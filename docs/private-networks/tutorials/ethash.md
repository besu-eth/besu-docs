---
title: (Deprecated) Create an Ethash network
sidebar_position: 5
description: Create a private network using the (deprecated) Ethash consensus protocol.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create a private network using Ethash (Deprecated)

:::caution

PoW consensus is deprecated in Besu version 24.11.0 and later. Please read this [blog post](https://www.lfdecentralizedtrust.org/blog/sunsetting-tessera-and-simplifying-hyperledger-besu) for more context on the rationale behind this decision as well as alternative options.

:::

A private network provides a configurable network for testing. By configuring a low difficulty and enabling mining, this allows for fast block creation.

You can test multi-block and multi-user scenarios on a private network before moving to one of the public testnets.

:::danger

The steps in this tutorial create an isolated, but not protected or secure, Ethereum private network. We recommend running the private network behind a properly configured firewall.

:::

## Prerequisites

- [Besu](../get-started/install/binary-distribution.md)
- [Curl (or similar webservice client)](https://curl.haxx.se/download.html).

## Steps

Listed on the right-hand side of the page are the steps to create a private network using Ethash.

### 1. Create directories

Each node requires a data directory for the blockchain data. When the node starts, Besu saves the [node key](../../public-networks/concepts/node-keys.md) in this directory.

Create directories for your private network, each of the three nodes, and a data directory for each node:

```bash
Private-Network/
├── Node-1
│   ├── data
├── Node-2
│   ├── data
└── Node-3
    ├── data
```

### 2. Create a genesis file

The genesis file defines the genesis block of the blockchain (that is, the start of the blockchain). The genesis file includes entries for configuring the blockchain, such as the mining difficulty and initial accounts and balances.

All nodes in a network must use the same genesis file. The [network ID](../../public-networks/concepts/network-and-chain-id.md) defaults to the `chainID` in the genesis file. The `fixeddifficulty` enables fast block mining.

Copy the following genesis definition to a file called `privateNetworkGenesis.json` and save it in the `Private-Network` directory:

```json
{
  "config": {
    "berlinBlock": 0,
    "ethash": {
      "fixeddifficulty": 1000
    },
    "chainID": 1337
  },
  "nonce": "0x42",
  "gasLimit": "0x1000000",
  "difficulty": "0x10000",
  "alloc": {
    "fe3b557e8fb62b89f4916b721be55ceb828dbd73": {
      "privateKey": "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
      "comment": "private key and this comment are ignored.  In a real chain, the private key should NOT be stored",
      "balance": "0xad78ebc5ac6200000"
    },
    "f17f52151EbEF6C7334FAD080c5704D77216b732": {
      "privateKey": "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
      "comment": "private key and this comment are ignored.  In a real chain, the private key should NOT be stored",
      "balance": "90000000000000000000000"
    }
  }
}
```

:::note

We recommend specifying the latest [milestone](../../public-networks/reference/genesis-items.md#milestone-blocks) when creating the genesis file for a private network. This ensures you are using the most up-to-date protocol and have access to the most recent opcodes.

:::

:::warning

Don't use the accounts in `alloc` in the genesis file on Mainnet or any public network except for testing. The private keys display, which means the accounts are not secure.

:::

### 3. Start the first node as a bootnode

Start Node-1:

<Tabs>

<TabItem value="MacOS" label="MacOS" default>

```bash
besu --data-path=data --genesis-file=../privateNetworkGenesis.json --rpc-http-enabled --host-allowlist="*" --rpc-http-cors-origins="all" --profile=ENTERPRISE
```

</TabItem>

<TabItem value="Windows" label="Windows">

```bash
besu --data-path=data --genesis-file=..\privateNetworkGenesis.json --rpc-http-enabled --host-allowlist="*" --rpc-http-cors-origins="all" --profile=ENTERPRISE
```

</TabItem>

</Tabs>

The command line enables:

- JSON-RPC API using the [`--rpc-http-enabled`](../../public-networks/reference/cli/options.md#rpc-http-enabled) option.
- All-host access to the HTTP JSON-RPC API using the [`--host-allowlist`](../../public-networks/reference/cli/options.md#host-allowlist) option.
- All-domain access to the node through the HTTP JSON-RPC API using the [`--rpc-http-cors-origins`](../../public-networks/reference/cli/options.md#rpc-http-cors-origins) option.
- The [enterprise/private profile](../../public-networks/how-to/configure-besu/profile.md#enterpriseprivate-profile)
  using the [`--profile`](../../public-networks/reference/cli/options.md#profile) option.

When the node starts, the [enode URL](../../public-networks/concepts/node-keys.md#enode-url) displays. Copy the enode URL to specify Node-1 as the bootnode in the following steps.

![Node 1 Enode URL](../../assets/images/EnodeStartup.png)

### 4. Start Node-2

Start another terminal, change to the `Node-2` directory and start Node-2 specifying the Node-1 enode URL copied when starting Node-1 as the bootnode:

<Tabs>

<TabItem value="MacOS" label="MacOS" default>

```bash
besu --data-path=data --genesis-file=../privateNetworkGenesis.json --bootnodes=<Node-1 Enode URL> --p2p-port=30304 --profile=ENTERPRISE
```

</TabItem>

<TabItem value="Windows" label="Windows">

```bash
besu --data-path=data --genesis-file=..\privateNetworkGenesis.json --bootnodes=<Node-1 Enode URL> --p2p-port=30304 --profile=ENTERPRISE
```

</TabItem>

</Tabs>

The command line specifies:

- A different port to Node-1 for P2P discovery using the [`--p2p-port`](../../public-networks/reference/cli/options.md#p2p-port) option.
- The enode URL of Node-1 using the [`--bootnodes`](../../public-networks/reference/cli/options.md#bootnodes) option.
- A data directory for Node-2 using the [`--data-path`](../../public-networks/reference/cli/options.md#data-path) option.
- Other options as for [Node-1](#3-start-the-first-node-as-a-bootnode).

### 5. Start Node-3

Start another terminal, change to the `Node-3` directory and start Node-3 specifying the Node-1 enode URL copied when starting Node-1 as the bootnode:

<Tabs>

<TabItem value="MacOS" label="MacOS" default>

```bash
besu --data-path=data --genesis-file=../privateNetworkGenesis.json --bootnodes=<Node-1 Enode URL> --p2p-port=30305 --profile=ENTERPRISE
```

</TabItem>

<TabItem value="Windows" label="Windows">

```bash
besu --data-path=data --genesis-file=..\privateNetworkGenesis.json --bootnodes=<Node-1 Enode URL> --p2p-port=30305 --profile=ENTERPRISE
```

</TabItem>

</Tabs>

The command line specifies:

- A different port to Node-1 and Node-2 for P2P discovery.
- A data directory for Node-3 using the [`--data-path`](../../public-networks/reference/cli/options.md#data-path) option.
- Other options as for [Node-2](#4-start-node-2).

### 6. Confirm the private network is working

Start another terminal, use curl to call the JSON-RPC API [`net_peerCount`](../../public-networks/reference/api/index.md#net_peercount) method and confirm the nodes are functioning as peers:

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' localhost:8545/ -H "Content-Type: application/json"
```

The result confirms Node-1 (the node running the JSON-RPC service) has two peers (Node-2 and Node-3):

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x2"
}
```

## Next steps

Import accounts to MetaMask and send transactions as described in the [Quickstart tutorial](quickstart.md#create-a-transaction-using-metamask).

:::info

Besu doesn't support [private key management](../../public-networks/how-to/send-transactions.md).

:::

Send transactions using `eth_sendRawTransaction` to [send ether or, deploy or invoke contracts](../how-to/send-transactions/index.md).

Use the [JSON-RPC API](../../public-networks/how-to/use-besu-api/json-rpc.md).

Start a node with the [`--rpc-ws-enabled`](../../public-networks/reference/cli/options.md#rpc-ws-enabled) option and use the [RPC Pub/Sub API](../../public-networks/how-to/use-besu-api/rpc-pubsub.md).

## Stop the nodes

When finished using the private network, stop all nodes using ++ctrl+c++ in each terminal window.

:::tip

To restart the private network in the future, start from [3. Start the first node as a bootnode](#3-start-the-first-node-as-a-bootnode).

:::
