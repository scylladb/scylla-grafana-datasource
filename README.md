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

You can now add the scylla data source, the only current configuration is a host in the cluster.

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
