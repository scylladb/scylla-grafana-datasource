import React, { ChangeEvent, useEffect } from 'react';
import { InlineField, InlineSwitch, Input, SecretInput, Select } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps, SelectableValue } from '@grafana/data';
import { ConnectionScope, DEFAULT_CONNECTION_SCOPE, MyDataSourceOptions, MySecureJsonData } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;
  useEffect(() => {
    if (!options.jsonData.connectionScope) {
      onOptionsChange({
        ...options,
        jsonData: {
          ...options.jsonData,
          connectionScope: DEFAULT_CONNECTION_SCOPE,
        },
      });
    }
  }, [onOptionsChange, options]);

  const onHostChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      host: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  const onConnectionScopeChange = (value: SelectableValue<ConnectionScope>) => {
    const jsonData = {
      ...options.jsonData,
      connectionScope: value.value || DEFAULT_CONNECTION_SCOPE,
    };
    onOptionsChange({ ...options, jsonData });
  };
  const onUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      secureJsonData: {
        user: event.target.value,
      },
    });
  };

  // Secure field (only sent to the backend)
  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      secureJsonData: {
        password: event.target.value,
      },
    });
  };

  const onResetPassword = () => {
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        password: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        password: '',
      },
    });
  };

  const onResetUser = () => {
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        user: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        user: '',
      },
    });
  };

  const onEnableTlsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      enableTls: event.target.checked,
    };
    onOptionsChange({ ...options, jsonData });
  };

  const onTlsSkipVerifyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      tlsSkipVerify: event.target.checked,
    };
    onOptionsChange({ ...options, jsonData });
  };

  const onTlsCaCertPathChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      tlsCaCertPath: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  const onTlsClientCertPathChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      tlsClientCertPath: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  const onTlsClientKeyPathChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      tlsClientKeyPath: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  const { jsonData, secureJsonFields } = options;
  const secureJsonData = (options.secureJsonData || {}) as MySecureJsonData;
  const connectionScopeOptions: Array<SelectableValue<ConnectionScope>> = [
    { label: 'Cluster only (default)', value: 'cluster_only' },
    { label: 'Specified list', value: 'specified_list' },
    { label: 'Any (Unsafe)', value: 'any' },
  ];

  return (
    <div className="gf-form-group">
      <InlineField label="Connection scope" labelWidth={12}>
        <Select
          width={40}
          value={jsonData.connectionScope || DEFAULT_CONNECTION_SCOPE}
          options={connectionScopeOptions}
          onChange={onConnectionScopeChange}
        />
      </InlineField>
      <InlineField
      label="Host"
      labelWidth={12}
      >
        <Input
          onChange={onHostChange}
          value={jsonData.host || ''}
          placeholder="Host or comma-separated host list"
          width={40}
        />
      </InlineField>
      <InlineField label="User" labelWidth={12}>
        <SecretInput
          isConfigured={(secureJsonFields && secureJsonFields.user) as boolean}
          value={secureJsonData.user || ''}
          placeholder="A Database user"
          width={40}
          onReset={onResetUser}
          onChange={onUserChange}
        />
      </InlineField>
      <InlineField label="Password" labelWidth={12}>
        <SecretInput
          isConfigured={(secureJsonFields && secureJsonFields.password) as boolean}
          value={secureJsonData.password || ''}
          placeholder="secure json field (backend only)"
          width={40}
          onReset={onResetPassword}
          onChange={onPasswordChange}
        />
      </InlineField>
      <InlineField label="Enable TLS" labelWidth={12}>
        <InlineSwitch value={!!jsonData.enableTls} onChange={onEnableTlsChange} />
      </InlineField>
      {jsonData.enableTls && (
        <>
          <InlineField label="Skip TLS verify" labelWidth={12}>
            <InlineSwitch value={!!jsonData.tlsSkipVerify} onChange={onTlsSkipVerifyChange} />
          </InlineField>
          <InlineField label="CA cert path" labelWidth={12}>
            <Input
              onChange={onTlsCaCertPathChange}
              value={jsonData.tlsCaCertPath || ''}
              placeholder="/path/to/ca.pem (on the Grafana server)"
              width={40}
            />
          </InlineField>
          <InlineField label="Client cert path" labelWidth={12}>
            <Input
              onChange={onTlsClientCertPathChange}
              value={jsonData.tlsClientCertPath || ''}
              placeholder="/path/to/client-cert.pem (for mTLS)"
              width={40}
            />
          </InlineField>
          <InlineField label="Client key path" labelWidth={12}>
            <Input
              onChange={onTlsClientKeyPathChange}
              value={jsonData.tlsClientKeyPath || ''}
              placeholder="/path/to/client-key.pem (for mTLS)"
              width={40}
            />
          </InlineField>
        </>
      )}
    </div>
  );
}
