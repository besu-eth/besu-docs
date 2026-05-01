---
title: Bootnodes
description: Configuring bootnodes
sidebar_position: 3
---

# Configure bootnodes

You can use bootnodes to initially discover peers. Bootnodes are regular nodes used to discover other nodes.

In private networks for development or testing purposes, specify at least one bootnode.

In production networks, [configure two or more nodes as bootnodes](#configure-bootnodes-in-a-production-network).

:::tip

Bootnodes and static nodes are parallel methods for finding peers. Depending on your use case, you can use only bootnodes, only static nodes, or both bootnodes and static nodes.

When connecting to bootnodes, Besu attempts to connect to all bootnodes at once, at startup.
When connecting to static nodes, Besu attempts to reconnect periodically, if the connection fails or is lost.

To find peers, configure one or more bootnodes. To configure a specific set of peer connections, use [static nodes](../../../public-networks/how-to/connect/static-nodes.md).

:::

:::note Mainnet and public testnets

For Mainnet and the Sepolia and Ephemery testnets, Besu has an internal list of enode URLs and uses this list automatically when you specify the [`--network`](../../../public-networks/reference/cli/options.md#network) option.

:::

## Specify a bootnode

To start a node, specify bootnode [enode URLs](../../../public-networks/concepts/node-keys.md#enode-url) or
[ENR URLs](../../../public-networks/concepts/node-keys.md#enr-url) for P2P
discovery using the [`--bootnodes`](../../../public-networks/reference/cli/options.md#bootnodes) option.

```bash
besu --genesis-file=privateNetworkGenesis.json --data-path=nodeDataPath --bootnodes=enode://c35c3ec90a8a51fd5703594c6303382f3ae6b2ecb99bab2c04b3794f2bc3fc2631dabb0c08af795787a6c004d8f532230ae6e9925cbbefb0b28b79295d615f@127.0.0.1:30303
```

The `--bootnodes` option also accepts files or URLs:

- A local file path: `/path/to/bootnodes.txt`
- A file URI: `file:///path/to/bootnodes.txt`
- An HTTP(S) URL: `https://example.com/bootnodes.txt`

You can mix sources, comma-separated, together with direct enode or ENR URLs.
The list of sources must specify all enode URLs or all ENR URLs.

```bash
besu --bootnodes=/etc/besu/enodes.txt,https://example.com/enodes.txt,enode://c35c3...d615f@1.2.3.4:30303
```

:::tip Early access feature
To use ENR URLs and IPv6 addresses (discovery v5), set the early access option `--Xv5-discovery-enabled` to `true`.
:::

The default host and port advertised to other peers for P2P discovery is `127.0.0.1:30303`.
To specify a different host or port, use the
[`--p2p-host`](../../../public-networks/reference/cli/options.md#p2p-host)
/ [`--p2p-host-ipv6`](../../../public-networks/reference/cli/options.md#p2p-host) or
[`--p2p-port`](../../../public-networks/reference/cli/options.md#p2p-port)
/ [`--p2p-port-ipv6`](../../../public-networks/reference/cli/options.md#p2p-port) options.

By default, peer discovery listens on all available network interfaces. If the device Besu is running
on must bind to a specific network interface, specify the interface using the
[`--p2p-interface`](../../../public-networks/reference/cli/options.md#p2p-interface) or
[`--p2p-interface-ipv6`](../../../public-networks/reference/cli/options.md#p2p-interface-ipv6) option.

## Configure bootnodes in a production network

A network must have at least one operating bootnode. To allow for continuity in the event of failure, configure two or more bootnodes in a production network. If you don't configure any bootnodes, Besu uses Mainnet's default bootnodes.

We don't recommend putting bootnodes behind a load balancer because the [enode](../../../public-networks/concepts/node-keys.md#enode-url) relates to the node public key, IP address, and discovery ports. Any changes to a bootnode enode prevents other nodes from being able to establish a connection with the bootnode. This is why we recommend putting more bootnodes on the network itself.

To ensure a bootnode enode doesn't change when recovering from a complete bootnode failure:

1. Create the [node key pair](../../../public-networks/concepts/node-keys.md) (that is, the private and public key) before starting the bootnode.
1. When creating bootnodes in the cloud (for example, AWS and Azure), attempt to assign a static IP address to them. If your network is:

   - Publicly accessible, assign an elastic IP.
   - Internal only, specify a private IP address when you create the instance and record this IP address.

We recommend storing the bootnode configuration under source control.

To allow for failure, specify all bootnodes on the command line (even to the bootnodes themselves).

:::tip

Having each bootnode list the other bootnodes increases the speed of discovery. Nodes ignore their own enode in the bootnodes list so it isn't required to specify different bootnode lists to the bootnodes themselves.

:::

## Add and remove bootnodes

Adding new bootnodes is a similar process to creating bootnodes. After creating the bootnodes and adding them to the network, update the [`--bootnodes`](../../../public-networks/reference/cli/options.md#bootnodes) command line option for each node to include the new bootnodes.

When adding bootnodes, you don't need to restart running nodes. By updating the [`--bootnodes`](../../../public-networks/reference/cli/options.md#bootnodes) option, the next time you restart the nodes (for example, when [upgrading](../../../public-networks/how-to/upgrade-node.md)), the nodes connect to the new bootnodes.
