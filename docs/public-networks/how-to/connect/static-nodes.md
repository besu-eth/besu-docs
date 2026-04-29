---
title: Configure static nodes
sidebar_position: 1
description: Configuring static nodes
---

# Static nodes

Static nodes are a configured set of trusted nodes. Static nodes are exempt from [maximum peer](manage-peers.md#limit-peers) and [remote connection](manage-peers.md#limit-remote-connections) limits.

Besu periodically initiates a connection to any unconnected static node. To mitigate low peer count issues in small networks, we recommend using static nodes, or static nodes and bootnodes. 

:::tip

Bootnodes and static nodes are both methods for finding peers. Depending on your use case, you can use only bootnodes, only static nodes, or both bootnodes and static nodes. 

When connecting to bootnodes, Besu attempts to connect to all bootnodes at once, at startup.
When connecting to static nodes, Besu attempts to reconnect periodically, if the connection fails or is lost.

For example:
* You run multiple nodes on Mainnet, using bootnodes for discovery, but want to ensure your nodes are always connected to each other, using static nodes.
* You run a small network and want your nodes to reconnect if disconnected, using static nodes. 

To find peers, configure one or more [bootnodes](../../../private-networks/how-to/configure/bootnodes.md). To configure a specific set of peer connections, use static nodes.

:::

## Configure static nodes

To configure a network of static nodes:

1. List the [enode URLs](../../concepts/node-keys.md#enode-url) of the nodes in the [`static-nodes.json` file](#static-nodesjson-file).

1. Save the `static-nodes.json` file in the data directory (specified by [`--data-path`](../../reference/cli/options.md#data-path)) of each node. Alternatively, you can explicitly specify the static nodes file on the command line using [`--static-nodes-file`](../../reference/cli/options.md#static-nodes-file).

1. Start Besu with discovery disabled using [`--discovery-enabled=false`](../../reference/cli/options.md#discovery-enabled).

To update the list of static peers at run time, use the [`admin_addPeer`](../../reference/api/index.md#admin_addpeer) and [`admin_removePeer`](../../reference/api/index.md#admin_removepeer) JSON-RPC API methods.

:::note

Runtime modifications of static nodes are not persisted between runs. The `static-nodes.json` file is not updated by the `admin_addPeer` and `admin_removePeer` methods.

Nodes not in the list of the static nodes are not prevented from connecting. To prevent nodes from connecting, use [Permissioning](../../../private-networks/concepts/permissioning/index.md).

:::

:::tip

If the added peer does not appear in the peer list (returned by [`admin_peers`](../../reference/api/index.md#admin_peers)), check the supplied [enode URL](../../concepts/node-keys.md#enode-url) is correct, the node is running, and the node is listening for TCP connections on the endpoint.

:::

### `static-nodes.json` file

The `static-nodes.json` file must be in the data directory (specified by [`--data-path`](../../reference/cli/options.md#data-path)) and contain a JSON array of [enode URLs](../../concepts/node-keys.md#enode-url).

```json title="Example"
[
  "enode://cea71cb65a471037e01508cebcc178f176f9d5267bf29507ea1f6431eb6a5dc67d086dc8dc54358a72299dab1161febc5d7af49d1609c69b42b5e54544145d4f@127.0.0.1:30303",
  "enode://ca05e940488614402705a6b6836288ea902169ecc67a89e1bd5ef94bc0d1933f20be16bc881ffb4be59f521afa8718fc26eec2b0e90f2cd0f44f99bc8103e60f@127.0.0.1:30304"
]
```

:::note

Each node has a `static-nodes.json` file. We recommend each node in the network has the same `static-nodes.json` file.

:::
