package plugin

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"net"
	"strconv"
	"strings"
	"sync"
	"time"

	"gopkg.in/inf.v0"

	"github.com/gocql/gocql"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

// NewDatasource creates a new datasource instance.
func NewDatasource(_ context.Context, s backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	settings, err := getDatasourceSettings(s)
	if err != nil {
		return nil, err
	}

	return &Datasource{
		settings: settings,
	}, nil
}

// Make sure Datasource implements required interfaces.
var (
	_ backend.QueryDataHandler      = (*Datasource)(nil)
	_ backend.CheckHealthHandler    = (*Datasource)(nil)
	_ instancemgmt.InstanceDisposer = (*Datasource)(nil)
)

// buildSslOpts constructs gocql.SslOptions from the configured paths, validating
// that the client cert and key are provided as a pair. gocql calls
// tls.LoadX509KeyPair when either path is set, so a partial mTLS configuration
// would otherwise fail later, deep inside session creation, with a confusing
// low-level file error.
func buildSslOpts(enableTls bool, caCertPath, clientCertPath, clientKeyPath string, skipVerify bool) (*gocql.SslOptions, error) {
	if !enableTls {
		return nil, nil
	}
	if (clientCertPath == "") != (clientKeyPath == "") {
		return nil, errors.New("TLS client cert path and client key path must both be set for mTLS, or both left empty")
	}
	return &gocql.SslOptions{
		CertPath:               clientCertPath,
		KeyPath:                clientKeyPath,
		CaPath:                 caCertPath,
		EnableHostVerification: !skipVerify,
	}, nil
}

const (
	connectionScopeClusterOnly = "cluster_only"
	connectionScopeSpecified   = "specified_list"
	connectionScopeAny         = "any"
)

func normalizeConnectionScope(scope string) string {
	switch scope {
	case connectionScopeSpecified, connectionScopeAny:
		return scope
	default:
		return connectionScopeClusterOnly
	}
}

func getDatasourceSettings(setting backend.DataSourceInstanceSettings) (*instanceSettings, error) {
	type editModel struct {
		Host              string `json:"host"`
		ConnectionScope   string `json:"connectionScope"`
		EnableTls         bool   `json:"enableTls"`
		TlsCaCertPath     string `json:"tlsCaCertPath"`
		TlsClientCertPath string `json:"tlsClientCertPath"`
		TlsClientKeyPath  string `json:"tlsClientKeyPath"`
		TlsSkipVerify     bool   `json:"tlsSkipVerify"`
	}
	var hosts editModel
	log.DefaultLogger.Debug("newDataSourceInstance", "data", setting.JSONData)
	var secureData = setting.DecryptedSecureJSONData
	err := json.Unmarshal(setting.JSONData, &hosts)
	if err != nil {
		log.DefaultLogger.Warn("error marsheling", "err", err)
		return nil, err
	}
	log.DefaultLogger.Info("looking for host", "host", hosts.Host)
	connectionScope := normalizeConnectionScope(hosts.ConnectionScope)
	configuredHosts := parseHostList(hosts.Host)
	if connectionScope != connectionScopeAny && len(configuredHosts) == 0 {
		return nil, errors.New("host list cannot be empty when connection scope is not any")
	}
	var newCluster *gocql.ClusterConfig = nil
	var authenticator *gocql.PasswordAuthenticator = nil
	password, hasPassword := secureData["password"]
	user, hasUser := secureData["user"]
	if hasPassword && hasUser {
		log.DefaultLogger.Debug("using username and password", "user", user)
		authenticator = &gocql.PasswordAuthenticator{
			Username: user,
			Password: password,
		}
	}
	sslOpts, err := buildSslOpts(hosts.EnableTls, hosts.TlsCaCertPath, hosts.TlsClientCertPath, hosts.TlsClientKeyPath, hosts.TlsSkipVerify)
	if err != nil {
		return nil, err
	}
	if len(configuredHosts) > 0 {
		newCluster = gocql.NewCluster(configuredHosts...)
		if authenticator != nil {
			newCluster.Authenticator = *authenticator
		}
		newCluster.SslOpts = sslOpts
		newCluster.Consistency = gocql.LocalOne
		switch connectionScope {
		case connectionScopeSpecified:
			newCluster.HostFilter = gocql.WhiteListHostFilter(configuredHosts...)
		default:
			newCluster.HostFilter = gocql.AcceptAllFilter()
		}
	}
	return &instanceSettings{
		cluster:         newCluster,
		authenticator:   authenticator,
		host:            hosts.Host,
		connectionScope: connectionScope,
		configuredHosts: configuredHosts,
	}, nil
}

// Datasource
type Datasource struct {
	backend.CallResourceHandler
	settings *instanceSettings
}

// Dispose here tells plugin SDK that plugin wants to clean up resources when a new instance
// created. As soon as datasource settings change detected by SDK old datasource instance will
// be disposed and a new one will be created using NewDatasource factory function.
func (d *Datasource) Dispose() {
	if d.settings != nil {
		d.settings.close()
	}
}

// QueryData handles multiple queries and returns multiple responses.
// req contains the queries []DataQuery (where each query contains RefID as a unique identifier).
// The QueryDataResponse contains a map of RefID to the response for each query, and each response
// contains Frames ([]*Frame).
func (d *Datasource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	defer func() {
		if r := recover(); r != nil {
			log.DefaultLogger.Info("Recovered in QueryData", "error", r)
		}
	}()
	response := backend.NewQueryDataResponse()

	// loop over queries and execute them individually.
	for _, q := range req.Queries {
		res := d.query(ctx, req.PluginContext, d.settings, q)

		// save the response in a hashmap
		// based on with RefID as identifier
		response.Responses[q.RefID] = res
	}

	return response, nil
}

type queryModel struct {
	Format   string `json:"format"`
	QueryTxt string `json:"queryTxt"`
}

func getTypeArray(typ string) interface{} {
	log.DefaultLogger.Debug("getTypeArray", "type", typ)
	switch t := typ; t {
	case "timestamp":
		return []time.Time{}
	case "bigint", "int":
		return []int64{}
	case "smallint":
		return []int16{}
	case "boolean":
		return []bool{}
	case "double", "varint", "decimal":
		return []float64{}
	case "float":
		return []float32{}
	case "tinyint":
		return []int8{}
	default:
		return []string{}
	}
}

func toValue(val interface{}, typ string) interface{} {
	if val == nil {
		return nil
	}
	switch t := typ; t {
	case "blob":
		return "Blob"
	}
	switch t := val.(type) {
	case float32, time.Time, string, int64, float64, bool, int16, int8:
		return t
	case gocql.UUID:
		return t.String()
	case int:
		return int64(t)
	case *inf.Dec:
		if s, err := strconv.ParseFloat(t.String(), 64); err == nil {
			return s
		}
		return 0
	case *big.Int:
		if s, err := strconv.ParseFloat(t.String(), 64); err == nil {
			return s
		}
		return 0
	default:
		r, err := json.Marshal(val)
		if err != nil {
			log.DefaultLogger.Info("Marsheling failed ", "err", err)
		}
		return string(r)
	}
}

func (td *Datasource) query(_ context.Context, pCtx backend.PluginContext, instance *instanceSettings, query backend.DataQuery) backend.DataResponse {
	var response backend.DataResponse

	// Unmarshal the JSON into our queryModel.
	var hosts queryModel

	err := json.Unmarshal(query.JSON, &hosts)
	var v interface{}
	json.Unmarshal(query.JSON, &v)
	dt := v.(map[string]interface{})
	if err != nil {
		log.DefaultLogger.Warn("Failed unmarsheling json", "err", response.Error, "json ", string(query.JSON))
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("json unmarshal: %v", err.Error()))
	}

	// create data frame response
	frame := data.NewFrame("response")
	if val, ok := dt["queryText"]; ok {
		querytxt := fmt.Sprintf("%v", val)
		log.DefaultLogger.Debug("queryText found", "querytxt", querytxt, "instance", instance)
		queryHost, hasHost := dt["queryHost"]
		allHosts, hasAllHosts := dt["allHosts"]
		var addHost bool = hasAllHosts && allHosts.(bool)
		var hostList []string
		if hasHost && queryHost != "" {
			log.DefaultLogger.Debug("Using host", "host", queryHost)
			s, _ := queryHost.(string)
			hostList = parseHostList(s)
		}
		if instance.connectionScope == connectionScopeSpecified && len(hostList) == 0 {
			response.Error = errors.New("query host is required when connection scope is specified_list")
			return response
		}

		type queryTarget struct {
			hostID  string
			hostRef string
		}

		session, err := instance.getSession()
		if err != nil {
			log.DefaultLogger.Warn("Failed getting session", "err", err)
			response.Error = err
			return response
		}

		targets := make([]queryTarget, 0)
		if len(hostList) == 0 {
			if addHost {
				for _, hostInfo := range session.GetHosts() {
					hostRef := hostInfoAddress(hostInfo)
					if hostRef == "" {
						continue
					}
					if instance.connectionScope == connectionScopeSpecified && !instance.isConfiguredHost(hostRef) {
						continue
					}
					targets = append(targets, queryTarget{hostID: hostInfo.HostID(), hostRef: hostRef})
				}
				if len(targets) == 0 {
					response.Error = errors.New("no eligible hosts found for all-host query")
					return response
				}
			} else {
				targets = append(targets, queryTarget{})
			}
		} else {
			for _, specificHost := range hostList {
				hostRef := strings.TrimSpace(specificHost)
				if hostRef == "" {
					continue
				}
				switch instance.connectionScope {
				case connectionScopeSpecified:
					if !instance.isConfiguredHost(hostRef) {
						response.Error = fmt.Errorf("host %q is not allowed by connection scope", hostRef)
						return response
					}
				case connectionScopeClusterOnly:
					inCluster, inClusterErr := instance.isHostInCluster(hostRef)
					if inClusterErr != nil {
						response.Error = inClusterErr
						return response
					}
					if !inCluster {
						response.Error = fmt.Errorf("host %q is not part of the cluster", hostRef)
						return response
					}
				}

				hostID, found, hostErr := instance.getHostIDByAddress(hostRef)
				if hostErr != nil {
					response.Error = hostErr
					return response
				}
				if !found {
					response.Error = fmt.Errorf("could not resolve host %q in cluster metadata", hostRef)
					return response
				}
				targets = append(targets, queryTarget{hostID: hostID, hostRef: hostRef})
				if !addHost {
					break
				}
			}
			if len(targets) == 0 {
				targets = append(targets, queryTarget{})
			}
		}

		for hostIndx, target := range targets {
			q := session.Query(querytxt)
			if target.hostID != "" {
				q = q.SetHostID(target.hostID)
			}
			iter := q.Iter()
			cols := iter.Columns()
			var numCols int = len(cols)
			if addHost {
				numCols++
			}
			if hostIndx == 0 {
				for _, c := range iter.Columns() {
					frame.Fields = append(frame.Fields,
						data.NewField(c.Name, nil, getTypeArray(c.TypeInfo.Type().String())),
					)
				}
				if addHost {
					frame.Fields = append(frame.Fields,
						data.NewField("_host", nil, getTypeArray("string")),
					)
				}
			}
			for {
				// New map each iteration
				row := make(map[string]interface{})
				if !iter.MapScan(row) {
					break
				}
				vals := make([]interface{}, numCols)
				for i, c := range cols {
					vals[i] = toValue(row[c.Name], c.TypeInfo.Type().String())
				}
				log.DefaultLogger.Debug("adding vals", "vals", vals)
				if addHost {
					vals[numCols-1] = target.hostRef
				}
				frame.AppendRow(vals...)
			}
			if err := iter.Close(); err != nil {
				log.DefaultLogger.Warn(err.Error())
			}
			if !addHost {
				break
			}
		}
	}
	// add the frames to the response
	response.Frames = append(response.Frames, frame)

	return response
}

// CheckHealth handles health checks sent from Grafana to the plugin.
// The main use case for these health checks is the test button on the
// datasource configuration page which allows users to verify that
// a datasource is working as expected.
func (d *Datasource) CheckHealth(_ context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	var status = backend.HealthStatusOk
	var message = "Data source is working"
	_, err := d.settings.getSession()
	if err != nil {
		log.DefaultLogger.Warn("Failed getting session", "err", err)
		return &backend.CheckHealthResult{
			Status:  backend.HealthStatusError,
			Message: err.Error(),
		}, nil
	}
	// TBD: On error we should return something meaningful
	//status = backend.HealthStatusError
	//message = "An error message"

	return &backend.CheckHealthResult{
		Status:  status,
		Message: message,
	}, nil
}

type instanceSettings struct {
	cluster *gocql.ClusterConfig
	// sessionMu guards session and disposed. The session is created lazily on
	// first use, and a datasource instance serves concurrent query and health
	// requests, so without this two callers could each build a session and one
	// of them would be leaked when the second overwrote the pointer.
	sessionMu       sync.Mutex
	session         *gocql.Session
	disposed        bool
	authenticator   *gocql.PasswordAuthenticator
	host            string
	connectionScope string
	configuredHosts []string
}

func parseHostList(hosts string) []string {
	cleanHosts := strings.NewReplacer("{", "", "}", "").Replace(hosts)
	parts := strings.Split(cleanHosts, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}

func normalizeHostAddress(addr string) string {
	trimmed := strings.TrimSpace(addr)
	if trimmed == "" || trimmed == "<nil>" {
		return ""
	}
	if h, _, err := net.SplitHostPort(trimmed); err == nil {
		return h
	}
	return trimmed
}

func resolveHostSet(host string) map[string]struct{} {
	targetHost := normalizeHostAddress(host)
	resolved := make(map[string]struct{})
	if targetHost == "" {
		return resolved
	}

	if parsed := net.ParseIP(targetHost); parsed != nil {
		resolved[parsed.String()] = struct{}{}
		return resolved
	}

	if addrs, err := net.LookupIP(targetHost); err == nil {
		for _, ip := range addrs {
			if ip != nil {
				resolved[ip.String()] = struct{}{}
			}
		}
	}

	return resolved
}

func hostsMatch(candidate string, target string) bool {
	normalizedCandidate := normalizeHostAddress(candidate)
	normalizedTarget := normalizeHostAddress(target)
	if normalizedCandidate == "" || normalizedTarget == "" {
		return false
	}

	targetIPSet := resolveHostSet(normalizedTarget)
	if len(targetIPSet) == 0 {
		return normalizedCandidate == normalizedTarget
	}

	candidateIPSet := resolveHostSet(normalizedCandidate)
	for ip := range candidateIPSet {
		if _, ok := targetIPSet[ip]; ok {
			return true
		}
	}
	return false
}

func hostInfoAddress(hostInfo *gocql.HostInfo) string {
	if hostInfo == nil {
		return ""
	}
	candidates := []string{
		hostInfo.PreferredIP().String(),
		hostInfo.RPCAddress().String(),
		hostInfo.BroadcastAddress().String(),
		hostInfo.ListenAddress().String(),
		hostInfo.ConnectAddress().String(),
		hostInfo.Peer().String(),
	}
	for _, candidate := range candidates {
		normalized := normalizeHostAddress(candidate)
		if normalized != "" {
			return normalized
		}
	}
	return ""
}

func (settings *instanceSettings) isConfiguredHost(host string) bool {
	for _, configuredHost := range settings.configuredHosts {
		if hostsMatch(host, configuredHost) {
			return true
		}
	}
	return false
}

func (settings *instanceSettings) isHostInCluster(host string) (bool, error) {
	targetHost := normalizeHostAddress(host)
	if targetHost == "" {
		return false, nil
	}

	clusterSession, err := settings.getSession()
	if err != nil {
		return false, err
	}

	targetIPSet := resolveHostSet(targetHost)

	matchHost := func(candidateHost string) bool {
		normalized := normalizeHostAddress(candidateHost)
		if normalized == "" {
			return false
		}
		if len(targetIPSet) > 0 {
			candidateIPSet := resolveHostSet(normalized)
			for candidateIP := range candidateIPSet {
				if _, ok := targetIPSet[candidateIP]; ok {
					return true
				}
			}
			return false
		}
		return normalized == targetHost
	}

	checkIter := func(iter *gocql.Iter) (bool, error) {
		row := make(map[string]interface{})
		for iter.MapScan(row) {
			for _, raw := range row {
				if raw == nil {
					continue
				}
				if matchHost(fmt.Sprintf("%v", raw)) {
					if err := iter.Close(); err != nil {
						return false, err
					}
					return true, nil
				}
			}
			row = make(map[string]interface{})
		}
		if err := iter.Close(); err != nil {
			return false, err
		}
		return false, nil
	}

	localMatch, err := checkIter(clusterSession.Query("SELECT rpc_address, broadcast_address, listen_address FROM system.local").Iter())
	if err != nil {
		return false, err
	}
	if localMatch {
		return true, nil
	}

	peerMatch, err := checkIter(clusterSession.Query("SELECT peer, rpc_address FROM system.peers").Iter())
	if err != nil {
		return false, err
	}
	if peerMatch {
		return true, nil
	}

	return false, nil
}

func (settings *instanceSettings) getHostIDByAddress(host string) (string, bool, error) {
	if normalizeHostAddress(host) == "" {
		return "", false, nil
	}

	session, err := settings.getSession()
	if err != nil {
		return "", false, err
	}

	for _, hostInfo := range session.GetHosts() {
		if hostInfo == nil {
			continue
		}
		if hostsMatch(hostInfoAddress(hostInfo), host) {
			return hostInfo.HostID(), true, nil
		}
	}

	return "", false, nil
}

func (settings *instanceSettings) getSession() (*gocql.Session, error) {
	if r := recover(); r != nil {
		log.DefaultLogger.Info("Recovered in getSession", "error", r)
		var err error = nil
		switch x := r.(type) {
		case string:
			err = errors.New(x)
		case error:
			err = x
		default:
			err = errors.New("unknown panic")
		}
		return nil, err
	}
	settings.sessionMu.Lock()
	defer settings.sessionMu.Unlock()
	if settings.disposed {
		return nil, errors.New("datasource instance has been disposed")
	}
	if settings.session != nil && !settings.session.Closed() {
		return settings.session, nil
	}
	if settings.cluster == nil {
		return nil, errors.New("no host supplied for connection")
	}
	session, err := gocql.NewSession(*settings.cluster)
	if err != nil {
		log.DefaultLogger.Info("unable to connect to scylla", "err", err, "clusterHosts", settings.cluster.Hosts)
		return nil, err
	}
	log.DefaultLogger.Debug("Session created successfully")
	settings.session = session
	return session, nil
}

// close releases the session and marks the instance unusable, so a request that
// is still in flight during Dispose cannot resurrect a session that nothing
// would ever close.
func (settings *instanceSettings) close() {
	settings.sessionMu.Lock()
	defer settings.sessionMu.Unlock()
	settings.disposed = true
	if settings.session != nil {
		settings.session.Close()
		settings.session = nil
	}
}
