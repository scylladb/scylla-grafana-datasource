import React, { ChangeEvent } from 'react';
import { InlineField, Input, Checkbox} from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, queryText: event.target.value });
  };

  const onHostChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, queryHost: event.target.value });
    // executes the query
    onRunQuery();
  };

  const onallHostChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, allHosts: event.target.checked });
    // executes the query
    onRunQuery();
  };
  const { queryText, queryHost, allHosts} = query;

  return (
    <div className="gf-form">
      <InlineField label="Query Text" labelWidth={16} tooltip="A CQL Query">
        <Input onChange={onQueryTextChange} value={queryText || ''}  width={60}/>
      </InlineField>
	  <Checkbox onChange={onallHostChange} value={allHosts} label="All host" description="Read from all hosts"/>
      <InlineField label="Hosts">
        <Input onChange={onHostChange} value={queryHost} width={8} />
      </InlineField>
    </div>
  );
}
