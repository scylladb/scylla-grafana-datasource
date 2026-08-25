package plugin

import (
	"encoding/json"
	"strings"
	"testing"

	"github.com/gocql/gocql"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
)

func TestParseHostList(t *testing.T) {
	cases := []struct {
		in   string
		want []string
	}{
		{"", nil},
		{"   ", nil},
		{"172.17.0.2", []string{"172.17.0.2"}},
		{"172.17.0.2,172.17.0.3", []string{"172.17.0.2", "172.17.0.3"}},
		// Grafana's default (glob) formatting of a multi value variable.
		{"{172.17.0.2,172.17.0.3}", []string{"172.17.0.2", "172.17.0.3"}},
		{" 172.17.0.2 , ,172.17.0.3 ", []string{"172.17.0.2", "172.17.0.3"}},
	}
	for _, c := range cases {
		got := parseHostList(c.in)
		if strings.Join(got, "|") != strings.Join(c.want, "|") {
			t.Errorf("parseHostList(%q) = %v, want %v", c.in, got, c.want)
		}
	}
}

func TestNormalizeConnectionScope(t *testing.T) {
	cases := map[string]string{
		"":               connectionScopeClusterOnly,
		"bogus":          connectionScopeClusterOnly,
		"cluster_only":   connectionScopeClusterOnly,
		"specified_list": connectionScopeSpecified,
		"any":            connectionScopeAny,
	}
	for in, want := range cases {
		if got := normalizeConnectionScope(in); got != want {
			t.Errorf("normalizeConnectionScope(%q) = %q, want %q", in, got, want)
		}
	}
}

func settingsFromJSON(t *testing.T, jsonData string) (*instanceSettings, error) {
	t.Helper()
	return getDatasourceSettings(backend.DataSourceInstanceSettings{
		JSONData:                json.RawMessage(jsonData),
		DecryptedSecureJSONData: map[string]string{},
	})
}

func TestGetDatasourceSettings(t *testing.T) {
	t.Run("no host with default scope is rejected", func(t *testing.T) {
		if _, err := settingsFromJSON(t, `{"host":""}`); err == nil {
			t.Fatal("expected an error for empty host with cluster_only scope")
		}
	})

	t.Run("no host with specified_list scope is rejected", func(t *testing.T) {
		if _, err := settingsFromJSON(t, `{"host":"","connectionScope":"specified_list"}`); err == nil {
			t.Fatal("expected an error for empty host with specified_list scope")
		}
	})

	t.Run("no host with any scope is accepted without a cluster", func(t *testing.T) {
		s, err := settingsFromJSON(t, `{"host":"","connectionScope":"any"}`)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if s.cluster != nil {
			t.Fatal("expected no cluster to be built when no host is configured")
		}
		if s.connectionScope != connectionScopeAny {
			t.Fatalf("connectionScope = %q, want any", s.connectionScope)
		}
	})

	t.Run("configured hosts build the cluster", func(t *testing.T) {
		s, err := settingsFromJSON(t, `{"host":"10.0.0.1,10.0.0.2"}`)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if s.cluster == nil {
			t.Fatal("expected a cluster to be built from the configured hosts")
		}
		if strings.Join(s.cluster.Hosts, ",") != "10.0.0.1,10.0.0.2" {
			t.Fatalf("cluster hosts = %v", s.cluster.Hosts)
		}
	})
}

func TestClusterForSession(t *testing.T) {
	queryHosts := []string{"172.17.0.2", "172.17.0.3"}

	t.Run("configured cluster wins regardless of query hosts", func(t *testing.T) {
		s := &instanceSettings{connectionScope: connectionScopeAny, configuredHosts: []string{"10.0.0.1"}}
		s.cluster = s.newClusterConfig(s.configuredHosts)

		got, err := s.clusterForSession(queryHosts)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != s.cluster {
			t.Fatal("expected the configured cluster to be returned")
		}
	})

	t.Run("any scope without configured hosts builds from query hosts", func(t *testing.T) {
		s := &instanceSettings{connectionScope: connectionScopeAny}

		got, err := s.clusterForSession(queryHosts)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if strings.Join(got.Hosts, ",") != strings.Join(queryHosts, ",") {
			t.Fatalf("cluster hosts = %v, want %v", got.Hosts, queryHosts)
		}
		if s.cluster != nil {
			t.Fatal("lazily built cluster must not be stored on the instance")
		}
	})

	t.Run("any scope without any hosts at all fails", func(t *testing.T) {
		s := &instanceSettings{connectionScope: connectionScopeAny}
		if _, err := s.clusterForSession(nil); err == nil {
			t.Fatal("expected an error when neither configured nor query hosts exist")
		}
	})

	for _, scope := range []string{connectionScopeClusterOnly, connectionScopeSpecified} {
		t.Run("scope "+scope+" never builds from query hosts", func(t *testing.T) {
			s := &instanceSettings{connectionScope: scope}
			if _, err := s.clusterForSession(queryHosts); err == nil {
				t.Fatalf("expected an error for scope %s with query hosts only", scope)
			}
		})
	}
}

func TestNewClusterConfigAppliesSettings(t *testing.T) {
	auth := &gocql.PasswordAuthenticator{Username: "u", Password: "p"}
	ssl := &gocql.SslOptions{CaPath: "/ca.pem", EnableHostVerification: true}

	t.Run("auth, tls and consistency are applied", func(t *testing.T) {
		s := &instanceSettings{connectionScope: connectionScopeAny, authenticator: auth, sslOpts: ssl}
		c := s.newClusterConfig([]string{"10.0.0.1"})

		if got, ok := c.Authenticator.(gocql.PasswordAuthenticator); !ok || got.Username != "u" {
			t.Fatalf("authenticator not applied: %#v", c.Authenticator)
		}
		if c.SslOpts != ssl {
			t.Fatal("ssl options not applied")
		}
		if c.Consistency != gocql.LocalOne {
			t.Fatalf("consistency = %v, want LocalOne", c.Consistency)
		}
	})

	t.Run("specified_list uses a whitelist filter, others accept all", func(t *testing.T) {
		whitelisted := &instanceSettings{connectionScope: connectionScopeSpecified}
		open := &instanceSettings{connectionScope: connectionScopeAny}

		if whitelisted.newClusterConfig([]string{"10.0.0.1"}).HostFilter == nil {
			t.Fatal("expected a host filter for specified_list")
		}
		if open.newClusterConfig([]string{"10.0.0.1"}).HostFilter == nil {
			t.Fatal("expected an accept-all host filter for any")
		}
	})
}
