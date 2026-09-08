---
title: IPv6 and dual-stack networking
sidebar_position: 11
description: Learn how Besu supports peer discovery and connections over IPv4, IPv6, and dual-stack.
---

# IPv6 and dual-stack networking

Besu can communicate with peers over IPv4 (the default), IPv6, or both at the same time (dual-stack).
This page explains how Besu supports each mode and how the related configuration fits together.

## Discovery protocols

Besu supports [discovery v4](https://github.com/ethereum/devp2p/blob/master/discv4.md) and
[discovery v5](https://github.com/ethereum/devp2p/tree/master/discv5).
Use [`--discovery-mode`](../reference/options.md#discovery-mode) to choose one or both discovery protocols (the default is v4).

Discovery v4 advertises each peer as a single IP address, usually written as an
[enode URL](node-keys.md#enode-url).
Discovery v5 advertises each peer using an [Ethereum Node Record (ENR)](node-keys.md#enr-url), which can 
carry an IPv4 address and an IPv6 address at the same time (see
[EIP-778](https://eips.ethereum.org/EIPS/eip-778)).

Dual-stack works in both discovery modes; discovery v5 is not required to bind IPv6 sockets or advertise 
an IPv6 enode.
Set [`--discovery-mode`](../reference/options.md#discovery-mode) to `V5` or `BOTH` to do any of the following:

- Advertise both addresses during discovery
- Specify [bootnodes](../../private-networks/how-to/configure/bootnodes.md) using ENRs
- Auto-discover the advertised IPv6 address from peer consensus
- Find peers that only use discovery v5

## P2P options

Besu has a primary set of P2P options and a parallel set of `ipv6` options:

| Purpose            | Primary option                                                                          | IPv6 option                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Advertised host    | [`--p2p-host`](../reference/options.md#p2p-host) (default: `127.0.0.1`)                          | [`--p2p-host-ipv6`](../reference/options.md#p2p-host-ipv6) (no default)                                        |
| Listening interface | [`--p2p-interface`](../reference/options.md#p2p-interface) (default: `0.0.0.0`)                  | [`--p2p-interface-ipv6`](../reference/options.md#p2p-interface-ipv6) (no default)                              |
| TCP listening port | [`--p2p-port`](../reference/options.md#p2p-port) (default: `30303`)                               | [`--p2p-port-ipv6`](../reference/options.md#p2p-port-ipv6) (default: `30404`)                              |
| UDP discovery port | [`--p2p-discovery-port`](../reference/options.md#p2p-discovery-port) (default: `--p2p-port`) | [`--p2p-discovery-port-ipv6`](../reference/options.md#p2p-discovery-port-ipv6) (default: `--p2p-port-ipv6`) |

The primary options configure the node's main address family, IPv4 or IPv6.
The `ipv6` options are IPv6-specific and add a second address family for dual-stack operation.

How you combine these options determines the mode:

- **Single-stack:** Set the primary options to the addresses you want (IPv4 or IPv6), and don't set the
  `ipv6` options.
- **Dual-stack:** Set the primary options to IPv4 values (or use the default values) and add the `ipv6` options.
  The primary family must be IPv4.

Besu applies some defaults to simplify dual-stack setup:

- Setting `--p2p-host-ipv6` automatically sets `--p2p-interface-ipv6` to `::` (all IPv6 interfaces).
- Setting `--p2p-interface-ipv6` without `--p2p-host-ipv6` lets Besu auto-discover the advertised IPv6
  address from discovery v5 peer consensus.
  This requires `--discovery-mode` to be `v5` or `BOTH`.
- If `--p2p-port` and `--p2p-port-ipv6` use the same port, and both interfaces are wildcards (`0.0.0.0`
  and `::`, the dual-stack defaults), Besu binds a single dual-stack TCP socket instead of two independent sockets.
  The same rule applies to `--p2p-discovery-port` and `--p2p-discovery-port-ipv6` for UDP.

## How connections are established

In dual-stack mode, Besu opens a second UDP socket for peer
[discovery](../how-to/connect/manage-peers.md#p2p-discovery-process) and a second TCP socket for the
`devP2P` (RLPx) connection, both bound to the IPv6 interface.
This lets IPv6-only peers connect to your node in addition to IPv4 peers.
If the IPv4 and IPv6 ports match and both interfaces are wildcards, Besu binds one dual-stack socket per
protocol instead.
In IPv6-only mode, there is only one socket, bound to the IPv6 address.

When a discovered peer advertises both an IPv4 and an IPv6 address, Besu prefers IPv4 for outbound
connections, or IPv6 if
[`--p2p-ipv6-outbound-enabled`](../reference/options.md#p2p-ipv6-outbound-enabled) is `true`.
If a peer advertises only one address family, Besu always uses that address.

If the second IPv6 TCP socket fails to bind at startup (for example, due to a missing IPv6 address on the
host or a port conflict), Besu logs a warning and continues operating IPv4-only.

## Verifying addresses with `admin_nodeInfo`

Confirm the addresses and ports a node advertises using the
[`admin_nodeInfo`](../reference/api/admin.md#admin_nodeinfo) method.
Besu maintains a local ENR as an internal data structure (regardless of discovery protocol used), and
extracts IPv6 information from it.

The following IPv6-specific fields appear when the local ENR contains IPv6 keys:

- `ipv6` - The IPv6 address.
- `listenAddrV6` - The IPv6 listen address.
- `enodeV6` - The IPv6 [enode URL](node-keys.md#enode-url).
  Present when the ENR has both IPv6 TCP and UDP ports.
  Includes `?discport=` when those ports differ.
- `ports.listenerV6` - The IPv6 TCP listening port.
- `ports.discoveryV6` - The IPv6 UDP discovery port.

The following table outlines which fields are returned based on the host options you set:

<table style={{ textAlign: "center" }}>
  <thead>
    <tr>
      <th colSpan={2}>Options you set</th>
      <th colSpan={7}>Fields returned by <code>admin_nodeInfo</code></th>
    </tr>
    <tr>
      <th><a href="/public-networks/reference/options/#p2p-host"><code>p2p-host</code></a></th>
      <th><a href="/public-networks/reference/options/#p2p-host-ipv6"><code>p2p-host-ipv6</code></a></th>
      <th><code>ip</code></th>
      <th><code>ipv6</code></th>
      <th><code>listenAddr</code></th>
      <th><code>listenAddrV6</code></th>
      <th><code>enode</code></th>
      <th><code>enodeV6</code></th>
      <th>IPv6 ports</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>IPv4</td>
      <td>—</td>
      <td>IPv4</td>
      <td>—</td>
      <td><code>ipv4:port</code></td>
      <td>—</td>
      <td>IPv4</td>
      <td>—</td>
      <td>—</td>
    </tr>
    <tr>
      <td>IPv4</td>
      <td>IPv6</td>
      <td>IPv4</td>
      <td>IPv6</td>
      <td><code>ipv4:port</code></td>
      <td><code>[ipv6]:port</code></td>
      <td>IPv4</td>
      <td>IPv6</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>IPv6</td>
      <td>—</td>
      <td>IPv6</td>
      <td>IPv6</td>
      <td><code>[ipv6]:port</code></td>
      <td><code>[ipv6]:port</code></td>
      <td>IPv6</td>
      <td>IPv6</td>
      <td>Yes</td>
    </tr>
  </tbody>
</table>
