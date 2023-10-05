import { DataQuery, DataSourceJsonData } from '@grafana/data';

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
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  user?: string;
  password?: string;
}
