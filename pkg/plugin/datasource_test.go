package plugin

import (
	"encoding/json"
	"net"
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
		s.cluster, _ = s.newClusterConfig(s.configuredHosts)

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
		c, _ := s.newClusterConfig([]string{"10.0.0.1"})

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

		if c, _ := whitelisted.newClusterConfig([]string{"10.0.0.1"}); c.HostFilter == nil {
			t.Fatal("expected a host filter for specified_list")
		}
		if c, _ := open.newClusterConfig([]string{"10.0.0.1"}); c.HostFilter == nil {
			t.Fatal("expected an accept-all host filter for any")
		}
	})

	t.Run("keeps peer discovery and sets a connect timeout", func(t *testing.T) {
		s := &instanceSettings{connectionScope: connectionScopeAny}
		c, err := s.newClusterConfig([]string{"10.0.0.1"})
		if err != nil {
			t.Fatal(err)
		}
		// Peer discovery provides the host IDs that host targeting relies on.
		if c.DisableInitialHostLookup {
			t.Error("DisableInitialHostLookup = true, want false")
		}
		if c.ConnectTimeout != connectTimeout {
			t.Errorf("ConnectTimeout = %v, want %v", c.ConnectTimeout, connectTimeout)
		}
	})

	t.Run("translator only for internal contact points", func(t *testing.T) {
		cases := []struct {
			name  string
			hosts []string
			want  bool
		}{
			{"private ip", []string{"10.0.0.1"}, true},
			{"private ip with port", []string{"10.0.0.1:9142"}, true},
			{"one private among public", []string{"203.0.113.1", "10.0.0.1"}, true},
			{"public ip", []string{"203.0.113.1"}, false},
			// A hostname may resolve to either kind of address, so keep the default behavior.
			{"hostname", []string{"scylla.example.com"}, false},
		}
		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				c, err := (&instanceSettings{connectionScope: connectionScopeAny}).newClusterConfig(tc.hosts)
				if err != nil {
					t.Fatal(err)
				}
				if got := c.AddressTranslator != nil; got != tc.want {
					t.Errorf("translator set = %v, want %v", got, tc.want)
				}
			})
		}
	})
}

func TestInternalAddressTranslator(t *testing.T) {
	ip := net.ParseIP
	// Nodes of a cluster that advertises public rpc_addresses and reports private
	// inter-node addresses (the case seen on a cloud cluster).
	local := gocql.HostInfoBuilder{RpcAddress: ip("198.51.100.1"), BroadcastAddress: ip("10.0.0.1"), ListenAddress: ip("10.0.0.1")}
	peer2 := gocql.HostInfoBuilder{RpcAddress: ip("198.51.100.2"), PreferredIP: ip("10.0.0.2"), Peer: ip("10.0.0.2")}
	peer3 := gocql.HostInfoBuilder{RpcAddress: ip("198.51.100.3"), BroadcastAddress: ip("10.0.0.3")}
	peer4 := gocql.HostInfoBuilder{RpcAddress: ip("198.51.100.4"), Peer: ip("10.0.0.4")}
	noInternal := gocql.HostInfoBuilder{RpcAddress: ip("198.51.100.5"), Peer: ip("198.51.100.5")}
	internalRPC := gocql.HostInfoBuilder{RpcAddress: ip("10.0.0.6"), Peer: ip("10.0.0.7")}

	type dial struct {
		host gocql.HostInfoBuilder
		want string // address the translator should return for the host's rpc_address
	}
	cases := []struct {
		name     string
		contacts []string
		dials    []dial // in order: earlier dials can provide evidence for later ones
	}{
		{
			name:     "contact node is translated (evidence 1)",
			contacts: []string{"10.0.0.1"},
			dials:    []dial{{local, "10.0.0.1"}},
		},
		{
			name:     "contact matched through preferred_ip",
			contacts: []string{"10.0.0.2:9142"},
			dials:    []dial{{peer2, "10.0.0.2"}},
		},
		{
			// Qodo: internal addresses are inter-node addresses, CQL may not listen there.
			name:     "peer is kept until the cluster shows CQL on internal addresses",
			contacts: []string{"10.0.0.1"},
			dials:    []dial{{peer2, "198.51.100.2"}},
		},
		{
			name:     "peers are translated after a contact node shows the pattern (evidence 2)",
			contacts: []string{"10.0.0.1"},
			dials: []dial{
				{peer2, "198.51.100.2"}, // before the evidence
				{local, "10.0.0.1"},     // contact node: evidence
				{peer2, "10.0.0.2"},     // reconnect: preferred_ip
				{peer3, "10.0.0.3"},     // broadcast address
				{peer4, "10.0.0.4"},     // peer
			},
		},
		{
			// Never invent an address the cluster did not report.
			name:     "no internal address is kept",
			contacts: []string{"10.0.0.1"},
			dials:    []dial{{local, "10.0.0.1"}, {noInternal, "198.51.100.5"}},
		},
		{
			name:     "already internal rpc_address is kept",
			contacts: []string{"10.0.0.1"},
			dials:    []dial{{local, "10.0.0.1"}, {internalRPC, "10.0.0.6"}},
		},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			tr := newInternalAddressTranslator(tc.contacts)
			if tr == nil {
				t.Fatal("no translator for internal contact points")
			}
			for i, d := range tc.dials {
				host := d.host.Build()
				got, err := tr.TranslateHost(&host, gocql.AddressPort{Address: host.RPCAddress(), Port: 9142})
				if err != nil {
					t.Fatal(err)
				}
				if !got.Address.Equal(ip(d.want)) || got.Port != 9142 {
					t.Errorf("dial %d (%v): TranslateHost = %v:%d, want %s:9142", i, host.RPCAddress(), got.Address, got.Port, d.want)
				}
			}
		})
	}
}

func TestHostInfoMatches(t *testing.T) {
	ip := net.ParseIP
	// A peer: system.peers reports preferred_ip.
	peer := gocql.HostInfoBuilder{RpcAddress: ip("198.51.100.7"), BroadcastAddress: ip("10.0.0.7"), PreferredIP: ip("10.0.0.7")}.Build()
	// The control connection's node: system.local has no preferred_ip, so its first
	// non-empty address is the public rpc_address.
	local := gocql.HostInfoBuilder{RpcAddress: ip("198.51.100.9"), BroadcastAddress: ip("10.0.0.9"), ListenAddress: ip("10.0.0.9")}.Build()
	cases := []struct {
		name string
		node *gocql.HostInfo
		host string
		want bool
	}{
		// Regression: only the first non-empty address was compared, so the local node
		// targeted by its private address failed with "could not resolve host".
		{"local node by private address", &local, "10.0.0.9", true},
		{"local node by rpc_address", &local, "198.51.100.9", true},
		{"peer by private address", &peer, "10.0.0.7", true},
		// Same regression in the other direction: a peer by its rpc_address.
		{"peer by rpc_address", &peer, "198.51.100.7", true},
		{"with port", &peer, "10.0.0.7:9142", true},
		{"unrelated address", &peer, "10.0.0.8", false},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := hostInfoMatches(tc.node, tc.host); got != tc.want {
				t.Errorf("hostInfoMatches(%q) = %v, want %v", tc.host, got, tc.want)
			}
		})
	}
}

func TestClusterPort(t *testing.T) {
	cases := []struct {
		hosts []string
		tls   bool
		want  int
	}{
		{[]string{"10.0.0.1"}, false, 9042},
		{[]string{"10.0.0.1"}, true, 9142},
		{[]string{"10.0.0.1:9042"}, true, 9042},
		{[]string{"10.0.0.1", "10.0.0.2:19142"}, false, 19142},
		{[]string{"[::1]:9142"}, false, 9142},
		{[]string{"::1"}, true, 9142},
		{[]string{"10.0.0.1:9142", "10.0.0.2:9142"}, false, 9142},
	}
	for _, c := range cases {
		if got, err := clusterPort(c.hosts, c.tls); err != nil || got != c.want {
			t.Errorf("clusterPort(%v, %v) = %d, %v, want %d", c.hosts, c.tls, got, err, c.want)
		}
	}
	for _, hosts := range [][]string{
		{"10.0.0.1:0"},
		{"10.0.0.1:70000"},
		{"10.0.0.1:abc"},
		{"10.0.0.1:9042", "10.0.0.2:9142"},
	} {
		if _, err := clusterPort(hosts, true); err == nil {
			t.Errorf("clusterPort(%v) succeeded, want error", hosts)
		}
	}
}
