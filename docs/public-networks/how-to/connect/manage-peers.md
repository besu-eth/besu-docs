---
title: Manage peers
sidebar_position: 3
description: Managing Besu peers
---

# Manage peers

Besu peer-to-peer (P2P) discovery happens periodically based on the number of peers in a
network and the node's [peer limit](#limit-peers).

The frequency of discovery isn't configurable, but you can:

- [Limit remote connections](#limit-remote-connections) in public networks.
- [Allowlist peers by IP subnet](#allowlist-peers) to create a private network of peers across public 
networks.
- [Randomly prioritize connections](../../reference/cli/options.md#random-peer-priority-enabled) in
small, stable networks.

:::info
You can use [`admin_addPeer`](../../reference/api/index.md#admin_addpeer) to attempt a specific
connection, but this isn't P2P discovery.
:::

In private networks, we recommend
[using bootnodes](../../../private-networks/how-to/configure/bootnodes.md) to initially discover peers.

## P2P discovery process

The P2P discovery process requires [ports to be open to UDP and TCP traffic](configure-ports.md#p2p-networking).
If you have a firewall in place, keep those ports open to allow traffic in and out.
If you are running a node at home on your network, ensure that your router has those ports open.

The `discovery` stack uses UDP to keep peer discovery lightweight and quick.
It only allows a node to find peers and connect to them, without any additional overhead.
Once peers have bonded, the data exchange between them is complex and needs a fully featured
protocol to support error checking and retries, so the `devP2P` stack uses TCP.

Both stacks work in parallel: the `discovery` stack adds new peers to the network, and the `devP2P`
stack enables interactions and data flow between them.
In detail, the P2P discovery process is as follows:

1. When Besu starts up it advertises its presence and details (including the enode) using UDP before
   establishing a formal connection with any peer (log messages look like `Enode URL enode://....`).

2. Besu attempts to connect to the network's bootnodes (a set of predefined nodes used to help
   bootstrap discovery).

3. Once a connection with a bootnode is established using UDP (`ping/pong` handshake messages in the
   debug and trace logs), Besu requests a list of neighbors (potential peers) from the bootnode
   (`find node` messages in the debug and trace logs).

4. Besu attempts to connect to each peer using TCP, and get status information from them – such
   as network details, what the peer believes to be the current chain head, and its list of neighbors.
   From this point on any traffic to that peer is only done using TCP.

5. Depending on the [synchronization method](../../concepts/node-sync.md), a common block
   (the pivot block) is selected that all connected peers (default of 5) have, and Besu syncs from
   that block till it gets to chain head.
   Log messages look like `Downloading world state from peers for pivot block .......`.

6. Besu repeats the same process for each peer in step 4, and any new peers that come along
   (regardless of client).

The more peers Besu is connected to, the more confident it is of having an accurate view of the network.

## Limit peers

You can limit peers to reduce the bandwidth, CPU time, and disk access Besu uses to manage and respond to peers.

To reduce the maximum number of peers, use the [`--max-peers`](../../reference/cli/options.md#max-peers) option. The default is 25.

## Allowlist peers

You can define specific IP subnets permitted to interact with the node using the [`--net-restrict`](../../reference/cli/options.md#net-restrict) configuration. This restricts access to only those peers whose IP addresses fall within the allowed subnets. This is useful if you maintain a set of nodes and want to restrict which of those can connect to external nodes.

## Limit remote connections

Prevent eclipse attacks when using [`--sync-mode`](../../reference/cli/options.md#sync-mode) and [`--fast-sync-min-peers`](../../reference/cli/options.md#sync-min-peers-fast-sync-min-peers) on public networks by enabling the [remote connection limits](../../reference/cli/options.md#remote-connections-limit-enabled).

In private and permissioned networks with only trusted peers, enabling the remote connection limits is unnecessary and might adversely affect the speed at which nodes can join the network. Limiting remote connections can cause a closed group of peers to form when the number of nodes in the network is slightly higher than [`--max-peers`](../../reference/cli/options.md#max-peers). The nodes in this closed group are all connected to each other and can't accept more connections.

:::tip

You can use [`--random-peer-priority-enabled`](../../reference/cli/options.md#random-peer-priority-enabled) to help prevent closed groups of peers in small, stable networks.

:::

## Monitor peer connections

JSON-RPC API methods to monitor peer connections include:

- [`net_peerCount`](../../reference/api/index.md#net_peercount).
- [`admin_peers`](../../reference/api/index.md#admin_peers).
- [`debug_metrics`](../../reference/api/index.md#debug_metrics).

Each peer entry returned by [`admin_peers`](../../reference/api/index.md#admin_peers) includes a `protocols` section. Use the information in the `protocols` section to:

- Determine the health of peers. For example, an external process can use [`admin_peers`](../../reference/api/index.md#admin_peers) and [`admin_removePeer`](../../reference/api/index.md#admin_removepeer) to disconnect from peers that are stalled at a single difficulty for an extended period of time.

- Monitor node health. For example, if peers report increasing difficulties but the node is stuck at the same block number, the node may be on a different fork to most peers.

- Determine which protocol level peers are communicating with. For example, you can see if `"version": 65` is being used to reduce transaction sharing traffic.

## List node connections

The default logging configuration doesn't list node connection and disconnection messages. To enable listing them, set the [`--logging`](../../reference/cli/options.md#logging) option to `DEBUG`. For more verbosity, set the option to `TRACE`.

The console logs connection and disconnection events when the log level is `DEBUG` or higher. If the message `Successfully accepted connection from ...` displays, connections are getting through the firewalls.

```bash title="Sample log output"
2018-10-16 12:37:35.479-04:00 | nioEventLoopGroup-3-1 | INFO | NettyP2PNetwork | Successfully accepted connection from 0xa979fb575495b8d6db44f750317d0f4622bf4c2aa3365d6af7c284339968eef29b69ad0dce72a4d8db5ebb4968de0e3bec910127f134779fbcb0cb6d3331163c
```

## Disable discovery

To disable P2P discovery, set the [`--discovery-enabled`](../../reference/cli/options.md#discovery-enabled) option to `false`.

With discovery disabled, peers can't open connections with the node unless they were previously discovered or manually peered (for example, using [`admin_addPeer`](../../reference/api/index.md#admin_addpeer)). [Static nodes](static-nodes.md) can also open connections.

## Troubleshoot

If you encounter issues with peering, see the [troubleshoot peering documentation](../../how-to/troubleshoot/peering.md), which helps you identify and resolve common problems that can occur during the peering process.
