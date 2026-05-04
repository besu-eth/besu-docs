---
title: Start Besu
sidebar_position: 3
description: Start Besu on a public Ethereum network.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Start Besu

Nodes can connect to Ethereum Mainnet, [Linea](https://docs.linea.build/get-started/how-to/run-a-node), and their respective public testnets.

Use the [`besu`](../reference/cli/options.md) command with the required command line options to start a node.

## Prerequisites

[Besu installed](install/binary-distribution.md)

## Local block data

When connecting to a network other than the network previously connected to, you must either delete the local block data or use the [`--data-path`](../reference/cli/options.md#data-path) option to specify a different data directory.

To delete the local block data, delete the `database` directory in the `besu/build/distribution/besu-<version>` directory.

## Genesis configuration

Besu specifies the genesis configuration, and sets the network ID and bootnodes when connecting to [ETH testnets](#run-a-node-on-an-ethereum-testnet), and [Mainnet](#run-a-node-on-ethereum-mainnet).

:::info

The following networks and testnets are deprecated: ETC (Ethereum Classic), Holesky, and Mordor.

:::

When you specify [`--network=dev`](../reference/cli/options.md#network), Besu uses the development mode genesis configuration with a fixed low difficulty. A node started with [`--network=dev`](../reference/cli/options.md#network) has an empty bootnodes list by default.

The genesis files defining the genesis configurations are in the [Besu source files](https://github.com/hyperledger/besu/tree/master/config/src/main/resources).

To define a genesis configuration, create a genesis file (for example, `genesis.json`) and specify the file using the [`--genesis-file`](../reference/cli/options.md#genesis-file) option.

## Syncing and storage

By default, Besu syncs to the current state of the blockchain using [snap sync](../concepts/node-sync.md#snap-synchronization) in:

- Networks specified using [`--network`](../reference/cli/options.md#network) except for the `dev` development network.
- Ethereum Mainnet.

We recommend using [snap sync](../concepts/node-sync.md#snap-synchronization) for a faster sync, by starting Besu with [`--sync-mode=SNAP`](../reference/cli/options.md#sync-mode).

By default, Besu stores data in the [Bonsai Tries format](../concepts/data-storage-formats.md#bonsai-tries).

## Run a node for testing

To run a node that mines blocks at a rate suitable for testing purposes:

```bash
besu --network=dev --rpc-http-cors-origins="all" --host-allowlist="*" --rpc-ws-enabled --rpc-http-enabled --data-path=/tmp/tmpDatdir
```

You can also use the following [configuration file](../how-to/configure-besu/index.md) on the command line to start a node with the same options as above:

```toml
network="dev"
rpc-http-cors-origins=["all"]
host-allowlist=["*"]
rpc-ws-enabled=true
rpc-http-enabled=true
data-path="/tmp/tmpdata-path"
```

:::danger Warning

The following settings are a security risk in production environments:

- Enabling the HTTP JSON-RPC service ([`--rpc-http-enabled`](../reference/cli/options.md#rpc-http-enabled)) and setting [`--rpc-http-host`](../reference/cli/options.md#rpc-http-host) to 0.0.0.0 exposes the RPC connection on your node to any remote connection.
- Setting [`--host-allowlist`](../reference/cli/options.md#host-allowlist) to `"*"` allows JSON-RPC API access from any host.
- Setting [`--rpc-http-cors-origins`](../reference/cli/options.md#rpc-http-cors-origins) to `"all"` or `"*"` allows cross-origin resource sharing (CORS) access from any domain.

:::

## Run a node on an Ethereum testnet

<Tabs>

<TabItem value="Hoodi" label="Hoodi" default>

To run a node on [Hoodi](https://github.com/eth-clients/hoodi) specifying a data directory:

```bash
besu --network=hoodi --data-path=<path>/<hoodidata-path>
```

Where `<path>` and `<hoodidata-path>` are the path and directory to save the Hoodi chain data to.

</TabItem>

<TabItem value="Sepolia" label="Sepolia">

To run a node on [Sepolia](https://github.com/eth-clients/sepolia) specifying a data directory:

```bash
besu --network=sepolia --data-path=<path>/<sepoliadata-path>
```

Where `<path>` and `<sepoliadata-path>` are the path and directory to save the Sepolia chain data to.

</TabItem>

<TabItem value="Ephemery" label="Ephemery">

To run a node on [Ephemery](https://github.com/ephemery-testnet/ephemery-resources?tab=readme-ov-file) specifying a data directory:

```bash
besu --network=ephemery --data-path=<path>/<ephemery-data-path>
```

Where `<path>` and `<ephemery-data-path>` are the path and directory to save the Ephemery chain data to.

</TabItem>

</Tabs>

See the [guide on connecting to a testnet](connect/testnet.md) for more information.

## Run a node on Ethereum Mainnet

To run a node on the Ethereum Mainnet:

```bash
besu
```

To run a node on Mainnet with the HTTP JSON-RPC service enabled and available for localhost only:

```bash
besu --rpc-http-enabled
```

See the [guide on connecting to Mainnet](connect/mainnet.md) for more information.

## Confirm node is running

If you started Besu with the [`--rpc-http-enabled`](../reference/cli/options.md#rpc-http-enabled) option, use [cURL](https://curl.haxx.se/) to call [JSON-RPC API methods](../reference/api/index.md) to confirm the node is running.

- `eth_chainId` returns the chain ID of the network.

  ```bash
  curl -X POST --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' localhost:8545/ -H "Content-Type: application/json"
  ```

- `eth_syncing` returns the starting, current, and highest block.

  ```bash
  curl -X POST --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' localhost:8545/ -H "Content-Type: application/json"
  ```

  For example, after connecting to Mainnet, `eth_syncing` will return something similar to:

  ```json
  {
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
      "startingBlock": "0x0",
      "currentBlock": "0x2d0",
      "highestBlock": "0x66c0"
    }
  }
  ```
