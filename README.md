# Scylla/Apache Cassandra Backend Plugin

The plugin is currently in Alpha and not ready for comercial usage.

[![CircleCI](https://circleci.com/gh/grafana/simple-datasource-backend/tree/master.svg?style=svg)](https://circleci.com/gh/grafana/simple-datasource-backend/tree/master)

This plugin allows connecting Scylla or Appahe Cassandra to Grafana.

## What is Scylla Grafana Data Source Backend Plugin?

A [Backend plugins](https://grafana.com/docs/grafana/latest/developers/plugins/backend/) is a type of data-source plugin that runs on the server.
That means that that from IP connectivity, your Database (Scylla or Appache Cassanra) should be accessible from the grafana server.


## Getting started
Use Grafana 7.0 or higher
* Download and place the datasouce in grafana/plugins directory.

This plugin is not signed yet, Granfa will not allow loading it by default. you should enable it by adding:

for example, if you are using Grafana with containers, add:
```
-e "GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=scylladb-scylla-datasource"
```

You can now add the scylla data source. You may configure a host in the cluster to
connect to by default; alternatively the host can be supplied per query and the cluster
connection is created on demand. Optional configuration includes username/password
authentication and TLS/mTLS (see below).

When adding a panel use CQL to get the data.
you can only do select statements, but any valid select would work.


## For Scylla-Monitoring Users
* Take the master branch that would run Grafana 7
* Either edit and add the the `ALLOW_PLUGINS` to `start-grafana.sh` or use the command line flag to `start-all.sh`
```
./start-all.sh -s scylla_servers.yml -c "GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=scylladb-scylla-datasource"

```
### Configure the datasoure from file
* If you do not want to configure the data source on every restart, edit `grafana/datasource.yml`
And add:
```
- name: scylla-datasource
  type: scylladb-scylla-datasource
  orgId: 1
  isDefault:
  jsonData:
    host: 'node-ip'
```
Replacing `node-ip` with an ip of a node in the cluster.

To support user and password add `secureJsonData` to `grafana/datasource.yml`
```
- name: scylla-datasource
  type: scylladb-scylla-datasource
  orgId: 1
  isDefault:
  jsonData:
    host: 'node-ip'
  secureJsonData:
    user: 'cassandra'
    password: 'cassandra'
```

### Connection scope and query hosts

`connectionScope` in `jsonData` controls which hosts a query may be routed to:

* `cluster_only` (default) - queries may target any node of the cluster reached through `host`. A query host that is not part of that cluster is rejected.
* `specified_list` - queries may only target nodes listed in `host`. A query host is required.
* `any` - no restriction on the query host. This is the only scope that allows `host` to be left empty:

```
- name: scylla-datasource
  type: scylladb-scylla-datasource
  orgId: 1
  isDefault:
  jsonData:
    host: ''
    connectionScope: 'any'
```

With this configuration the connection is created on demand from the hosts supplied by the
first query (for example a `queryHost` bound to a dashboard variable), which is how
Scylla-Monitoring uses the plugin.

A datasource instance holds a single connection and therefore serves a **single cluster** in
every connection scope. With `any` and an empty `host`, the first query's hosts decide which
cluster that is; hosts from another cluster in later queries fail to resolve until the
connection is re-established (a datasource settings change or a Grafana restart). To query
several clusters, configure one datasource per cluster.

### TLS / mTLS

To connect to a cluster that requires encryption in transit, or mutual TLS
client-certificate authentication, set `enableTls` in `jsonData` along with
the paths (on the Grafana server's filesystem, not the browser) to the
relevant PEM files:

Note: the default installation runs Grafana in a Docker container, so the
certificate files must be mounted into the container, e.g.
`-v /path/to/certs:/etc/grafana/certs`.

```
- name: scylla-datasource
  type: scylladb-scylla-datasource
  orgId: 1
  isDefault:
  jsonData:
    host: 'node-ip'
    enableTls: true
    tlsCaCertPath: '/etc/grafana/certs/ca.pem'
    tlsClientCertPath: '/etc/grafana/certs/client-cert.pem'
    tlsClientKeyPath: '/etc/grafana/certs/client-key.pem'
    tlsSkipVerify: false
```

* `enableTls` - enables TLS for the connection; required for any of the other TLS fields to take effect.
* `tlsCaCertPath` - path to a CA certificate used to verify the server's certificate. Optional; omit to use the system trust store.
* `tlsClientCertPath` / `tlsClientKeyPath` - paths to a client certificate/key pair, required together for mutual TLS (mTLS). Leave both empty for plain TLS without client authentication.
* `tlsSkipVerify` - when `true`, disables server certificate/hostname verification. Not recommended outside of testing.

TLS/mTLS can be combined with `user`/`password` authentication from
`secureJsonData` above; the two are independent settings.

### Configure the Datasource using Grafana API:
Grafana API allows adding datasource.
The following will add a data source without a username and password, replace the `ADMIN_PASSWORD`
with Grafana's Admin password

```
curl -XPOST -i http://admin:$ADMIN_PASSWORD@localhost:3000/api/datasources \
     --data-binary '{"name": "scylla-datasource","type": "scylladb-scylla-datasource", \
     "orgId": 1,"access":"proxy", "jsonData":{"host": ""}}' -H "Content-Type: application/json"
```

The following example shows how to configure the plugin with username and password
```
curl -XPOST -i http://admin:$ADMIN_PASSWORD@localhost:3000/api/datasources \
     --data-binary '{"name": "scylla-datasource","type": "scylladb-scylla-datasource", "orgId": 1,"access":"proxy", \
     "jsonData":{"host": ""}, "secureJsonData":{"user": "scylla", "password": "scylla"}}' \
      -H "Content-Type: application/json"
```

The following example shows how to configure the plugin with TLS/mTLS, using
paths to PEM files on the Grafana server:
```
curl -XPOST -i http://admin:$ADMIN_PASSWORD@localhost:3000/api/datasources \
     --data-binary '{"name": "scylla-datasource","type": "scylladb-scylla-datasource", "orgId": 1,"access":"proxy", \
     "jsonData":{"host": "", "enableTls": true, "tlsCaCertPath": "/etc/grafana/certs/ca.pem", \
     "tlsClientCertPath": "/etc/grafana/certs/client-cert.pem", "tlsClientKeyPath": "/etc/grafana/certs/client-key.pem"}}' \
      -H "Content-Type: application/json"
```


## Compiling the data source by yourself
A data source backend plugin consists of both frontend and backend components.

### Frontend

1. Install dependencies

```bash
npm install
```

2. Build plugin in development mode and run in watch mode

```bash
npm run dev
```

3. Build plugin in production mode

```bash
npm run build
```

### Backend

1. Update [Grafana plugin SDK for Go](https://grafana.com/docs/grafana/latest/developers/plugins/backend/grafana-plugin-sdk-for-go/) dependency to the latest minor version:

```bash
go get -u github.com/grafana/grafana-plugin-sdk-go
go mod tidy
```


2. Build backend plugin binaries for Linux, Windows and Darwin:
```BASH
mage -v
```

3. List all available Mage targets for additional commands:
```BASH
mage -l
```

## Learn more

- [Grafana plugin SDK for Go](https://grafana.com/docs/grafana/latest/developers/plugins/backend/grafana-plugin-sdk-for-go/)
