import { DataQuery, DataSourceJsonData } from '@grafana/data';

export type ConnectionScope = 'cluster_only' | 'specified_list' | 'any';

export const DEFAULT_CONNECTION_SCOPE: ConnectionScope = 'cluster_only';

export interface MyQuery extends DataQuery {
  queryText?: string;
  queryHost?: string;
  allHosts?: boolean;
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  queryText: '',
  queryHost: '',
  allHosts: false,
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  host?: string;
  connectionScope?: ConnectionScope;
  enableTls?: boolean;
  tlsCaCertPath?: string;
  tlsClientCertPath?: string;
  tlsClientKeyPath?: string;
  tlsSkipVerify?: boolean;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  user?: string;
  password?: string;
}
