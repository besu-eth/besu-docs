---
title: Add and removing IBFT 2.0 validators
sidebar_position: 1
description: Adding and removing IBFT 2.0 validators
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Add and remove IBFT 2.0 validators

This example walks through [adding and removing an IBFT 2.0 validator](../../how-to/configure/consensus/ibft.md#add-and-remove-validators).

## Prerequisites

- [IBFT 2.0 network as configured in the IBFT 2.0 tutorial](index.md)

## Add a validator

### 1. Create directories

Create a working directory and a data directory for the new node that needs to be added:

```bash
mkdir -p Node-5/data
```

### 2. Start the node

Change into the working directory for the new Node-5 and start the node, specifying the [Node-1 enode URL](index.md#6-start-the-first-node-as-the-bootnode) as the bootnode:

```bash
besu --data-path=data --genesis-file=../genesis.json --bootnodes=<Node-1 Enode URL> --p2p-port=30307 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8549 --profile=ENTERPRISE
```

The command line specifies:

- The data directory for Node-5 using the [`--data-path`](../../../public-networks/reference/cli/options.md#data-path) option.
- A different port to Node-1 for P2P discovery using the [`--p2p-port`](../../../public-networks/reference/cli/options.md#p2p-port) option.
- A different port to Node-1 for HTTP JSON-RPC using the [`--rpc-http-port`](../../../public-networks/reference/cli/options.md#rpc-http-port) option.
- The enode URL of Node-1 using the [`--bootnodes`](../../../public-networks/reference/cli/options.md#bootnodes) option.
- Other options as for [Node-1](index.md#6-start-the-first-node-as-the-bootnode).

### 3. Copy the address of the node

Copy the address of the node. You can find the address in the logs when starting the new node:

```bash
2021-05-28 09:49:00.881+10:00 | main | INFO  | DefaultP2PNetwork | Node address 0x90626e6a67445aabf1c0615410d108d4733aa90b
```

Or use the [`public-key export-address`](../../../public-networks/reference/cli/subcommands.md#export-address) subcommand:

<Tabs>

<TabItem value="Subcommand" label="Subcommand" default>

```bash
besu --data-path=IBFT-Network/Node-5/data public-key export-address
```

</TabItem>

<TabItem value="Output" label="Output">

```bash
0x90626e6a67445aabf1c0615410d108d4733aa90b
```

</TabItem>

</Tabs>

### 4. Propose adding the new validator

Propose adding the new validator from more than half the number of current validators, using [`ibft_proposeValidatorVote`](../../reference/api.md#ibft_proposevalidatorvote), specifying the address of the proposed validator and `true`:

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_proposeValidatorVote","params":["0x90626e6a67445aabf1c0615410d108d4733aa90b", true], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```
</TabItem>

</Tabs>

Repeat the proposal process for this candidate node from at least two of the other nodes.

### 5. Verify the addition of the new validator

Verify that the new validator is now in the list of validators using [`ibft_getValidatorsByBlockNumber`](../../reference/api.md#ibft_getvalidatorsbyblocknumber):

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_getValidatorsByBlockNumber","params":["latest"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```
</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
[
  "0x189d23d201b03ae1cf9113672df29a5d672aefa3",
  "0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1",
  "0x44b07d2c28b8ed8f02b45bd84ac7d9051b3349e6",
  "0x4c1ccd426833b9782729a212c857f2f03b7b4c0d",
  "0x90626e6a67445aabf1c0615410d108d4733aa90b"
]
```
</TabItem>

</Tabs>

The list of validators contains 5 addresses now.

## Remove a validator

The process for removing a validator is similar to [adding a validator](#add-a-validator) starting from step 2, except you specify `false` as the second parameter of [`ibft_proposeValidatorVote`](../../reference/api.md#ibft_proposevalidatorvote).
