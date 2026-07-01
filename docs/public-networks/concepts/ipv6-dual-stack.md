---
title: IPv6 and dual-stack networking
sidebar_position: 11
description: Learn how Besu supports peer discovery and connections over IPv4, IPv6, and dual-stack.
---

# IPv6 and dual-stack networking

Besu can communicate with peers over IPv4 (the default), IPv6, or both at the same time (dual-stack).
This page explains how Besu supports each mode and how the related configuration fits together.

## Discovery v5 and ENR

Dual-stack operation relies on [discovery v5](https://github.com/ethereum/devp2p/tree/master/discv5),
which identifies peers using [Ethereum Node Records (ENRs)](node-keys.md#enr-url).
Unlike an [enode URL](node-keys.md#enode-url) (used by discovery v4), which carries a single IP address,
an ENR can advertise both an IPv4 and an IPv6 address (see [EIP-778](https://eips.ethereum.org/EIPS/eip-778)).
This is what allows a dual-stack node to tell peers about both of its addresses simultaneously.

:::tip Early access feature

Discovery v5 is an early access feature.
Enable it by setting [`--Xv5-discovery-enabled`](../reference/cli/options.md#xhelp) to `true`.

:::

## P2P options

Besu has a primary set of P2P options and a parallel set of `ipv6` options:

| Purpose | Primary option | IPv6 option |
|---------|----------------|-------------|
| Advertised host | [`--p2p-host`](../reference/cli/options.md#p2p-host) (`127.0.0.1`) | [`--p2p-host-ipv6`](../reference/cli/options.md#p2p-host-ipv6) |
| Listening interface | [`--p2p-interface`](../reference/cli/options.md#p2p-interface) (`0.0.0.0`) | [`--p2p-interface-ipv6`](../reference/cli/options.md#p2p-interface-ipv6) |
| Listening port (UDP and TCP) | [`--p2p-port`](../reference/cli/options.md#p2p-port) (`30303`) | [`--p2p-port-ipv6`](../reference/cli/options.md#p2p-port-ipv6) (`30304`) |

The primary options configure the node's main address family, IPv4 or IPv6.
The `ipv6` options are IPv6-specific and add a second address family for dual-stack operation.

How you combine these options determines the mode:

- **Single-stack:** Set the primary options to the addresses you want (or use default values), 
  and don't set the `ipv6` options.
  This works under the discovery v4, as well as discovery v5 when `--Xv5-discovery-enabled=true`.
- **Dual-stack:** Set the primary options to IPv4 values (or use the default values) and add the
  `ipv6` options.
  The primary family must be IPv4.
  This only works under discovery v5, requiring `--Xv5-discovery-enabled=true`.

Besu applies some defaults to simplify dual-stack setup:

- Setting `--p2p-host-ipv6` automatically sets `--p2p-interface-ipv6` to `::` (all IPv6 interfaces).
- Setting `--p2p-interface-ipv6` without `--p2p-host-ipv6` lets Besu auto-discover the advertised
  IPv6 address from discovery v5 peer consensus.

## How connections are established

In dual-stack mode, Besu opens a second UDP socket for peer
[discovery](../how-to/connect/manage-peers.md#p2p-discovery-process) and a second TCP socket for the
`devP2P` (RLPx) connection, both bound to the IPv6 interface.
This lets IPv6-only peers connect to your node in addition to IPv4 peers.
In IPv6-only mode, there is only one socket, but it is bound to the IPv6 address.

When a discovered peer advertises both an IPv4 and an IPv6 address, Besu prefers IPv4 for outbound
connections, or IPv6 if
[`--p2p-ipv6-outbound-enabled`](../reference/cli/options.md#p2p-ipv6-outbound-enabled) is `true`.
If a peer advertises only one address family, Besu always uses that address.

If the second IPv6 TCP socket fails to bind at startup (for example, due to a missing IPv6 address
on the host or a port conflict), Besu logs a warning and continues operating IPv4-only.

## Verifying addresses with `admin_nodeInfo`

You can confirm the addresses and ports a node advertises using the
[`admin_nodeInfo`](../reference/api/index.md#admin_nodeinfo) method.
Besu maintains a local ENR as an internal data structure (regardless of discovery version
used), and extracts IPv6 information from it.
The following fields appear only when the local ENR contains an IPv6 address:

- `ipv6` - The IPv6 address.
- `listenAddrV6` - The IPv6 listen address.
- `ports.listenerV6` - The IPv6 TCP listening port.
- `ports.discoveryV6` - The IPv6 UDP discovery port.

The following table outlines which fields are returned based on the values you set for the discovery and host options:

<table style={{ textAlign: "center" }}>
  <thead>
    <tr>
      <th colSpan={3}>Options you set</th>
      <th colSpan={6}>Fields returned by <code>admin_nodeInfo</code></th>
    </tr>
    <tr>
      <th><code>Xv5-discovery-enabled</code></th>
      <th><a href="/public-networks/reference/cli/options/#p2p-host"><code>p2p-host</code></a></th>
      <th><a href="/public-networks/reference/cli/options/#p2p-host-ipv6"><code>p2p-host-ipv6</code></a></th>
      <th><code>ip</code></th>
      <th><code>ipv6</code></th>
      <th><code>listenAddr</code></th>
      <th><code>listenAddrV6</code></th>
      <th>IPv6 ports</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>true</code></td>
      <td>IPv4</td>
      <td>—</td>
      <td>IPv4</td>
      <td>—</td>
      <td><code>ipv4:port</code></td>
      <td>—</td>
      <td>—</td>
    </tr>
    <tr>
      <td><code>true</code></td>
      <td>IPv4</td>
      <td>IPv6</td>
      <td>IPv4</td>
      <td>IPv6</td>
      <td><code>ipv4:port</code></td>
      <td><code>[ipv6]:port</code></td>
      <td>Yes</td>
    </tr>
    <tr>
      <td><code>true</code></td>
      <td>IPv6</td>
      <td>—</td>
      <td>IPv6</td>
      <td>IPv6</td>
      <td><code>[ipv6]:port</code></td>
      <td><code>[ipv6]:port</code></td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>—</td>
      <td>IPv4</td>
      <td>—</td>
      <td>IPv4</td>
      <td>—</td>
      <td><code>ipv4:port</code></td>
      <td>—</td>
      <td>—</td>
    </tr>
    <tr>
      <td>—</td>
      <td>IPv6</td>
      <td>—</td>
      <td>IPv6</td>
      <td>IPv6</td>
      <td><code>[ipv6]:port</code></td>
      <td><code>[ipv6]:port</code></td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>—</td>
      <td>IPv4</td>
      <td>IPv6</td>
      <td>IPv4</td>
      <td>—</td>
      <td><code>ipv4:port</code></td>
      <td>—</td>
      <td>—</td>
    </tr>
  </tbody>
</table>

Without `--Xv5-discovery-enabled=true`, Besu uses discovery v4.
Discovery v4 reports IPv6 information only when `--p2p-host` is set to an IPv6 address.

The `--p2p-host-ipv6` option and dual-stack operation require discovery v5.
In the last row, `--p2p-host-ipv6` is ignored under discovery v4.
