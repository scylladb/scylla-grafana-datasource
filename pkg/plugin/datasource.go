package plugin

import (
	"context"
	"encoding/json"
	"errors"
	"gopkg.in/inf.v0"
	"math/big"
	"strconv"
	"time"

	"fmt"
	"github.com/gocql/gocql"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"strings"
)

// NewDatasource creates a new datasource instance.
func NewDatasource(s backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
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

func getDatasourceSettings(setting backend.DataSourceInstanceSettings) (*instanceSettings, error) {
	type editModel struct {
		Host string `json:"host"`
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
	if hosts.Host != "" {
		newCluster = gocql.NewCluster(hosts.Host)
		if authenticator != nil {
			newCluster.Authenticator = *authenticator
		}
	}
	return &instanceSettings{
		cluster:       newCluster,
		authenticator: authenticator,
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

type instanceSettings struct {
	cluster       *gocql.ClusterConfig
	authenticator *gocql.PasswordAuthenticator
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
		settings.clusters[host].HostFilter = gocql.WhiteListHostFilter(host)
		log.DefaultLogger.Debug("getSession creating cluster from host", "host", host)
		if settings.authenticator != nil {
			settings.clusters[host].Authenticator = *settings.authenticator
		}
		if settings.cluster == nil {
			// good opportunity to create a default cluster
			settings.cluster = gocql.NewCluster(host)
		}
		if specificHost {
			cluster = settings.clusters[host]
		} else {
			cluster = settings.cluster
		}

	}
	log.DefaultLogger.Debug("getSession, creating new session", "host", host)
	session, err := gocql.NewSession(*cluster)
	if err != nil {
		log.DefaultLogger.Info("unable to connect to scylla", "err", err, "session", session, "host", host)
		return nil, err
	}
	settings.sessions[host] = session
	return session, nil
}
