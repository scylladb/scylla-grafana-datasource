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

func getDatasourceSettings(setting backend.DataSourceInstanceSettings) (*instanceSettings, error) {
	type editModel struct {
		Host              string `json:"host"`
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
	if hosts.Host != "" {
		newCluster = gocql.NewCluster(hosts.Host)
		if authenticator != nil {
			newCluster.Authenticator = *authenticator
		}
		newCluster.SslOpts = sslOpts
		newCluster.Consistency = gocql.LocalOne
	}
	return &instanceSettings{
		cluster:       newCluster,
		authenticator: authenticator,
		sslOpts:       sslOpts,
		sessions:      make(map[string]*gocql.Session),
		clusters:      make(map[string]*gocql.ClusterConfig),
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
	// Clean up datasource instance resources.
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
		var hostList []string = []string{""}
		if hasHost && queryHost != "" {
			log.DefaultLogger.Debug("Using host", "host", queryHost)
			s, _ := queryHost.(string)
			hostList = strings.Split(strings.ReplaceAll(strings.ReplaceAll(s, "{", ""), "}", ""), ",")
		}

		for hostIndx, specificHost := range hostList {
			session, err := instance.getSession(strings.TrimSpace(specificHost), addHost)
			if err != nil {
				log.DefaultLogger.Warn("Failed getting session", "err", err, "host", specificHost)
				response.Error = err
				return response
			}
			iter := session.Query(querytxt).Iter()
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
					vals[numCols-1] = specificHost
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
	_, err := d.settings.getSession("", false)
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

// customAddressTranslator forces the driver to use a specific target IP
// instead of the addresses discovered through gossip
type customAddressTranslator struct {
	targetIP string
	port     int
}

func (t *customAddressTranslator) Translate(ip net.IP, port int) (net.IP, int) {
	log.DefaultLogger.Debug("Address translation", "from", ip.String(), "fromPort", port, "to", t.targetIP, "toPort", t.port)

	// First, try to parse targetIP as a literal IP address.
	if parsedIP := net.ParseIP(t.targetIP); parsedIP != nil {
		return parsedIP, t.port
	}
	// If parsing fails, try to resolve targetIP as a hostname.
	if addrs, err := net.LookupIP(t.targetIP); err == nil && len(addrs) > 0 {
		return addrs[0], t.port
	}
	// As a last resort, fall back to the original IP/port to avoid returning a nil IP.
	log.DefaultLogger.Warn("Failed to translate address, falling back to original", "targetIP", t.targetIP, "originalIP", ip.String(), "originalPort", port)
	return ip, port
}

type instanceSettings struct {
	cluster       *gocql.ClusterConfig
	authenticator *gocql.PasswordAuthenticator
	sslOpts       *gocql.SslOptions
	sessions      map[string]*gocql.Session
	clusters      map[string]*gocql.ClusterConfig
}

func (settings *instanceSettings) getSession(hostRef interface{}, specificHost bool) (*gocql.Session, error) {
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
	var host string
	var cluster *gocql.ClusterConfig
	if hostRef != nil {
		host = fmt.Sprintf("%v", hostRef)
	}
	if val, ok := settings.sessions[host]; ok {
		return val, nil
	}
	if host == "" {
		if settings.cluster == nil {
			return nil, errors.New("no host supplied for connection")
		}
		cluster = settings.cluster
	} else if settings.clusters[host] == nil {
		settings.clusters[host] = gocql.NewCluster(host)
		// Custom host filter that handles both public and private IPs
		targetIP := host
		// Remove port if present (host might be "ip:port" or "[ipv6]:port")
		if h, _, err := net.SplitHostPort(host); err == nil {
			targetIP = h
		}
		log.DefaultLogger.Debug("Setting up host filter", "targetIP", targetIP, "originalHost", host)

		// Pre-resolve target host to one or more IPs for robust matching.
		targetIPs := make([]net.IP, 0, 2)
		if parsed := net.ParseIP(targetIP); parsed != nil {
			targetIPs = append(targetIPs, parsed)
		} else if addrs, err := net.LookupIP(targetIP); err == nil {
			targetIPs = append(targetIPs, addrs...)
		}
		targetIPSet := make(map[string]struct{}, len(targetIPs))
		for _, resolvedIP := range targetIPs {
			if resolvedIP != nil {
				targetIPSet[resolvedIP.String()] = struct{}{}
			}
		}

		// Configure cluster to handle private/public IP scenarios
		// IgnorePeerAddr = true prevents the driver from connecting to addresses discovered via gossip
		// and forces it to only use the addresses we explicitly provided
		settings.clusters[host].IgnorePeerAddr = true
		settings.clusters[host].Consistency = gocql.LocalOne
		// DisableInitialHostLookup = true to use the exact host we specified
		settings.clusters[host].DisableInitialHostLookup = true

		// Add connection timeout to avoid hanging indefinitely
		settings.clusters[host].ConnectTimeout = 5 * time.Second
		settings.clusters[host].Timeout = 10 * time.Second

		// Extract port from host if present
		port := 9042
		if _, portStr, err := net.SplitHostPort(host); err == nil {
			if p, err := strconv.Atoi(portStr); err == nil {
				port = p
			}
		}

		// Set up custom address translator to force connections to use the target IP
		settings.clusters[host].AddressTranslator = &customAddressTranslator{
			targetIP: targetIP,
			port:     port,
		}

		// Custom host filter to force using the target IP
		// This ensures we connect to the private IP even if the driver discovers public IPs
		settings.clusters[host].HostFilter = gocql.HostFilterFunc(func(hostInfo *gocql.HostInfo) bool {
			if hostInfo == nil {
				log.DefaultLogger.Debug("Host info is nil - connection allowed", "targetIP", targetIP)
				return true
			}

			preferredIP := hostInfo.PreferredIP().String()
			rpcAddr := hostInfo.RPCAddress().String()
			broadcastAddr := hostInfo.BroadcastAddress().String()
			listenAddr := hostInfo.ListenAddress().String()

			// Log all available hosts for debugging
			log.DefaultLogger.Debug("Available host detected",
				"preferredIP", preferredIP,
				"rpcAddress", rpcAddr,
				"broadcastAddress", broadcastAddr,
				"listenAddress", listenAddr,
				"targetIP", targetIP,
				"hostID", hostInfo.HostID())

			normalizeAddr := func(addr string) string {
				if addr == "" || addr == "<nil>" {
					return ""
				}
				if h, _, err := net.SplitHostPort(addr); err == nil {
					return h
				}
				return addr
			}

			preferredIPNorm := normalizeAddr(preferredIP)
			rpcIP := normalizeAddr(rpcAddr)
			broadcastIP := normalizeAddr(broadcastAddr)
			listenIP := normalizeAddr(listenAddr)

			candidateAddrs := []string{preferredIPNorm, rpcIP, broadcastIP, listenIP}
			candidateIPs := make([]net.IP, 0, len(candidateAddrs))
			for _, candidate := range candidateAddrs {
				if candidate == "" {
					continue
				}
				if parsed := net.ParseIP(candidate); parsed != nil {
					candidateIPs = append(candidateIPs, parsed)
				}
			}

			// Some driver states expose host entries with incomplete metadata.
			// In that case, don't block session creation.
			if len(candidateIPs) == 0 {
				log.DefaultLogger.Debug("Host metadata incomplete - connection allowed",
					"targetIP", targetIP,
					"preferredIP", preferredIPNorm,
					"rpcIP", rpcIP,
					"broadcastIP", broadcastIP,
					"listenIP", listenIP)
				return true
			}

			for _, candidateIP := range candidateIPs {
				if _, ok := targetIPSet[candidateIP.String()]; ok {
					log.DefaultLogger.Debug("Host matched - connection allowed",
						"targetIP", targetIP,
						"preferredIP", preferredIPNorm,
						"rpcIP", rpcIP,
						"broadcastIP", broadcastIP,
						"listenIP", listenIP)
					return true
				}
			}

			// Fallback for unresolved target hostnames.
			if len(targetIPs) == 0 {
				for _, candidate := range candidateAddrs {
					if candidate == targetIP {
						log.DefaultLogger.Debug("Host matched by hostname - connection allowed",
							"targetIP", targetIP,
							"preferredIP", preferredIPNorm,
							"rpcIP", rpcIP,
							"broadcastIP", broadcastIP,
							"listenIP", listenIP)
						return true
					}
				}
			}

			log.DefaultLogger.Debug("Host filtered out",
				"targetIP", targetIP,
				"preferredIP", preferredIPNorm,
				"rpcIP", rpcIP,
				"broadcastIP", broadcastIP,
				"listenIP", listenIP)
			return false
		})

		log.DefaultLogger.Debug("getSession creating cluster from host", "host", host)
		if settings.authenticator != nil {
			settings.clusters[host].Authenticator = *settings.authenticator
		}
		settings.clusters[host].SslOpts = settings.sslOpts
		if settings.cluster == nil {
			// good opportunity to create a default cluster
			settings.cluster = gocql.NewCluster(host)
			if settings.authenticator != nil {
				settings.cluster.Authenticator = *settings.authenticator
			}
			settings.cluster.SslOpts = settings.sslOpts
			settings.cluster.Consistency = gocql.LocalOne
		}

	}
	if host == "" {
		cluster = settings.cluster
	} else {
		cluster = settings.clusters[host]
	}
	session, err := gocql.NewSession(*cluster)
	if err != nil {
		log.DefaultLogger.Info("unable to connect to scylla", "err", err, "host", host, "clusterHosts", cluster.Hosts)
		return nil, err
	}
	log.DefaultLogger.Debug("Session created successfully", "host", host)
	settings.sessions[host] = session
	return session, nil
}
