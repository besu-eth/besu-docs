---
title: Node keys
sidebar_position: 10
description: Learn about node public and private keys, and the node address.
---

# Node keys and node address

Each node has a private and public key pair, and a node address. Besu uses the private and public key pair to sign and verify transactions, and the node address as an identifier for the node.

## Node private key

When starting Besu, if the [`--node-private-key-file`](../reference/cli/options.md#node-private-key-file) option is not specified and a `key` file does not exist in the data directory for the node, Besu generates a node private key and writes it to the `key` file.

If a `key` file does exist in the data directory when starting Besu, the node starts using the private key in the `key` file.

:::info

The private key is not encrypted.

:::

## Node public key

The node public key displays in the log after starting Besu. Also referred to as the node ID, the node public key forms part of the enode URL of a node.

You can export the node public key, either to standard output or to a specified file, using the [`public-key export`](../reference/cli/subcommands.md#public-key) subcommand.

## Node address

Besu generates the node address by creating a hash of the node public key and using the last 20 bytes of the hash as the node address. It is also displayed in the logs after starting Besu.

You can export the node address, either to standard output or to a specified file, using the [`public-key export-address`](../reference/cli/subcommands.md#public-key) subcommand.

## Specify a custom node private key file

Use the [`--node-private-key-file`](../reference/cli/options.md#node-private-key-file) option to specify a custom `key` file in any location.

If the `key` file exists, the node starts with the private key in the `key` file. If the `key` file does not exist, Besu generates a node private key and writes it to the `key` file.

For example, the following command either reads the node private key from `privatekeyfile` or writes a generated private key to `privatekeyfile`.

```bash
besu --node-private-key-file="/Users/username/privatekeyfile"
```

## Enode URL

The enode URL identifies a node for discovery v4.
For example, you can specify nodes by the enode URL using the [`--bootnodes`](../reference/cli/options.md#bootnodes) option and the [`admin_addPeer`](../reference/api/index.md#admin_addpeer) method.

:::tip
Besu supports [ENR URLs](#enr-url) for discovery v5 when the early access option 
[`--Xv5-discovery-enabled`](../reference/cli/options.md#xhelp) is set to `true`.
:::

The enode URL format is `enode://<id>@<host:port>[?discport=<port>]` where:

- `<id>` is the node public key, excluding the initial 0x.
- `<host:port>` is the host and TCP port the bootnode is listening on for P2P discovery. Specify the host and TCP port using the [`--p2p-host`](../reference/cli/options.md#p2p-host) and [`--p2p-port`](../reference/cli/options.md#p2p-port) options. The default host is `127.0.0.1` and the default port is `30303`.

  :::note

  Standard Ethereum enode URLs allow hostnames as IP addresses only, however Besu provides [domain name support](#domain-name-support) in private permissioned networks.

  :::

- If the TCP listening and UDP discovery ports differ, the UDP port is specified as query parameter `discport`.

:::info

If the node public key is `0xc35c3ec90a8a51fd5703594c6303382f3ae6b2ecb9589bab2c04b3794f2bc3fc2631dabb0c08af795787a6c004d8f532230ae6e9925cbbefb0b28b79295d615f`, the host is `10.3.58.6`, the TCP listening port is `30303`, and the UDP discovery port is `30301`, then the enode URL is `enode://c35c3ec90a8a51fd5703594c6303382f3ae6b2ecb9589bab2c04b3794f2bc3fc2631dabb0c08af795787a6c004d8f532230ae6e9925cbbefb0b28b79295d615f@10.3.58.6:30303?discport=30301`

If the [`--p2p-host`](../reference/cli/options.md#p2p-host) or [`--p2p-port`](../reference/cli/options.md#p2p-port) options are not specified and the node public key is `0xc35c3ec90a8a51fd5703594c6303382f3ae6b2ecb9589bab2c04b3794f2bc3fc2631dabb0c08af795787a6c004d8f532230ae6e9925cbbefb0b28b79295d615f`, then the enode URL is `enode://c35c3ec90a8a51fd5703594c6303382f3ae6b2ecb9589bab2c04b3794f2bc3fc2631dabb0c08af795787a6c004d8f532230ae6e9925cbbefb0b28b79295d615f@127.0.0.1:30303`

:::

The enode URL displays when starting a Besu node. Use the [`net_enode`](../reference/api/index.md#net_enode) JSON-RPC API method to get the enode URL of the node.

The enode advertised to other nodes during discovery is the external IP address and port, as defined by [`--nat-method`](../how-to/connect/specify-nat.md).

### Domain name support

:::caution

Enode URL domain name support is an early access feature that you can use in private [permissioned networks](../../private-networks/concepts/permissioning/index.md) only.

:::

To use domain names in enode URLs:

- Configure DNS reverse lookup.
- Enable DNS support using the early access option `--Xdns-enabled`.

```bash title="Example enode URL using a domain name"
enode://c35c3ec90a8a51fd5703594c6303382f3ae6b2ecb9589bab2c04b3794f2bc3fc2631dabb0c08af795787a6c004d8f532230ae6e9925cbbefb0b28b79295d615f@mydomain.dev.example.net:30301
```

:::tip

If deploying Besu using Kubernetes in private permissioned networks, use the `--Xdns-enabled` and `--Xdns-update-enabled` options to ensure that Besu can connect to a container after restarting even if the IP address of the container changes.

Use the [`--Xhelp`](../reference/cli/options.md#xhelp) command line option to view early access options and their descriptions.

:::

If nodes are not connecting as expected, set the [log level to TRACE](../reference/api/index.md#admin_changeloglevel) to help troubleshoot the issue.

## ENR URL

The Ethereum Node Record, or ENR URL, identifies a node for [discovery v5](https://github.com/ethereum/devp2p/tree/master/discv5).
For example, you can specify nodes by the ENR URL using the [`--bootnodes`](../reference/cli/options.md#bootnodes) option
or in the [`v5Bootnodes`](../reference/genesis-items.md#discovery-configuration-items) discovery setting in the genesis file.
The [`admin_nodeInfo`](../reference/api/index.md#admin_nodeinfo) method returns the ENR URL in the `enr` field.

:::tip Early access feature
To use ENR URLs (discovery v5), set the early access option `--Xv5-discovery-enabled` to `true`.
:::

Unlike [enode URLs](#enode-url), ENR URLs can advertise additional node information, including IPv4 and IPv6 addresses.
See [EIP-778](https://eips.ethereum.org/EIPS/eip-778) for the full specification.
