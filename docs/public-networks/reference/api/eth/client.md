---
title: Client and network methods
description: Besu ETH JSON-RPC API client and network methods reference
sidebar_label: Client and network
sidebar_position: 1
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

These methods query client and network information, such as accounts, chain ID, protocol version, configuration, and sync status.

## `eth_accounts`

Returns a list of account addresses a client owns.

:::note

This method returns an empty object because Besu [doesn't support key management](../../../how-to/send-transactions.md) inside the client.

To provide access to your key store and then sign transactions, use [Web3Signer](https://docs.web3signer.consensys.net/) with Besu.

:::

### Parameters

- None

### Returns

- List of 20-byte account addresses owned by the client.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_accounts",
    "params": [],
    "id": 53
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_accounts",
  "params": [],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": []
}
```

</TabItem>

</Tabs>

---

## `eth_blockNumber`

Returns the index corresponding to the block number of the current chain head.

### Parameters

- None

### Returns

- Hexadecimal integer representing the index corresponding to the block number of the current chain head.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_blockNumber",
    "params": [],
    "id": 51
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": [],
  "id": 51
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 51,
  "result": "0x2377"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{block{number}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block {
    number
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "number": 16221
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_capabilities`

Returns the node's data-serving capabilities.

### Parameters

- None

### Returns

- Capabilities information.

  <Fields>

  - `head`: _object_ - Current chain head information.

    <Fields>

    - `number`: _string_ - Current chain head block number.

    - `hash`: _string_ - Current chain head block hash.

    </Fields>

  - `state`: _object_ - State capability information.

    <Fields>

    - `disabled`: _boolean_ - Indicates whether the `state` resource is disabled.

    - `oldestBlock`: _string_ - (Optional) Oldest available block.

    </Fields>

  - `tx`: _object_ - Transaction capability information.

    <Fields>

    - `disabled`: _boolean_ - Indicates whether the `tx` resource is disabled.

    - `oldestBlock`: _string_ - (Optional) Oldest available block.

    </Fields>

  - `logs`: _object_ - Logs capability information.

    <Fields>

    - `disabled`: _boolean_ - Indicates whether the `logs` resource is disabled.

    - `oldestBlock`: _string_ - (Optional) Oldest available block.

    </Fields>

  - `receipts`: _object_ - Receipts capability information.

    <Fields>

    - `disabled`: _boolean_ - Indicates whether the `receipts` resource is disabled.

    - `oldestBlock`: _string_ - (Optional) Oldest available block.

    </Fields>

  - `blocks`: _object_ - Blocks capability information.

    <Fields>

    - `disabled`: _boolean_ - Indicates whether the `blocks` resource is disabled.

    - `oldestBlock`: _string_ - (Optional) Oldest available block.

    </Fields>

  - `stateproofs`: _object_ - State proofs capability information.

    <Fields>

    - `disabled`: _boolean_ - Indicates whether the `stateproofs` resource is disabled.

    - `oldestBlock`: _string_ - (Optional) Oldest available block.

    </Fields>

  The `oldestBlock` field is included for block-backed resources when pruning has occurred.
  If the full chain is available, this can be `0x0`.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_capabilities",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_capabilities",
  "params": [],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc":"2.0",
  "id":1,
  "result":{
    "head":{
      "number":"0x13f8e3a",
      "hash":"0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3"
    },
    "state":{
      "disabled":false
    },
    "tx":{
      "disabled":false,
      "oldestBlock":"0x11b340a"
    },
    "logs":{
      "disabled":false,
      "oldestBlock":"0x11b340a"
    },
    "receipts":{
      "disabled":false,
      "oldestBlock":"0x11b340a"
    },
    "blocks":{
      "disabled":false,
      "oldestBlock":"0x0"
    },
    "stateproofs":{
      "disabled":false
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_chainId`

Returns the [chain ID](../../../concepts/network-and-chain-id.md).

### Parameters

- None

### Returns

- Chain ID in hexadecimal.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_chainId",
    "params": [],
    "id": 51
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_chainId",
  "params": [],
  "id": 51
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 51,
  "result": "0x7e2"
}
```

</TabItem>

</Tabs>

---

## `eth_config`

Returns the client's fork information for the current, next, and last known forks.

:::info

This method is defined in [EIP-7910](https://eips.ethereum.org/EIPS/eip-7910) and enables node operators to verify client readiness for upcoming forks and debug configuration mismatches.

:::

### Parameters

- None

### Returns

- Configuration information.

  <Fields>

  - `current`: _object_ - Current fork configuration.

    <Fields>

    - `activationTime`: _number_ - Fork activation timestamp (Unix epoch seconds).

    - `blobSchedule`: _object_ - Blob configuration parameters.

      <Fields>

      - `baseFeeUpdateFraction`: _number_ - Base fee update fraction.

      - `max`: _number_ - Maximum number of blobs per block.

      - `target`: _number_ - Target number of blobs per block.

      </Fields>

    - `chainId`: _string_ - Chain ID in hexadecimal.

    - `forkId`: _string_ - Fork hash as defined in [EIP-6122](https://eips.ethereum.org/EIPS/eip-6122).

    - `precompiles`: _object_ - Active precompiled contracts with names and addresses.

    - `systemContracts`: _object_ - System contract addresses.

    </Fields>

  - `next`: _object_ - Next fork configuration, or `null` if no future fork is scheduled.

  - `last`: _object_ - The furthest configured future fork configuration (the future fork with
      the largest `activationTime` among the client's configured forks). If only one future fork is configured, `next` and `last` are the same object. `null` if no future fork is scheduled.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_config",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_config",
  "params": [],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "current": {
      "activationTime": 1746612311,
      "blobSchedule": {
        "baseFeeUpdateFraction": 5007716,
        "max": 9,
        "target": 6
      },
      "chainId": "0x1",
      "forkId": "0xc376cf8b",
      "precompiles": {
        "BLAKE2F": "0x0000000000000000000000000000000000000009",
        "BLS12_G1ADD": "0x000000000000000000000000000000000000000b",
        "BLS12_G1MSM": "0x000000000000000000000000000000000000000c",
        "BLS12_G2ADD": "0x000000000000000000000000000000000000000d",
        "BLS12_G2MSM": "0x000000000000000000000000000000000000000e",
        "BLS12_MAP_FP2_TO_G2": "0x0000000000000000000000000000000000000011",
        "BLS12_MAP_FP_TO_G1": "0x0000000000000000000000000000000000000010",
        "BLS12_PAIRING_CHECK": "0x000000000000000000000000000000000000000f",
        "BN254_ADD": "0x0000000000000000000000000000000000000006",
        "BN254_MUL": "0x0000000000000000000000000000000000000007",
        "BN254_PAIRING": "0x0000000000000000000000000000000000000008",
        "ECREC": "0x0000000000000000000000000000000000000001",
        "ID": "0x0000000000000000000000000000000000000004",
        "KZG_POINT_EVALUATION": "0x000000000000000000000000000000000000000a",
        "MODEXP": "0x0000000000000000000000000000000000000005",
        "RIPEMD160": "0x0000000000000000000000000000000000000003",
        "SHA256": "0x0000000000000000000000000000000000000002"
      },
      "systemContracts": {
        "BEACON_ROOTS_ADDRESS": "0x000f3df6d732807ef1319fb7b8bb8522d0beac02",
        "CONSOLIDATION_REQUEST_PREDEPLOY_ADDRESS": "0x0000bbddc7ce488642fb579f8b00f3a590007251",
        "DEPOSIT_CONTRACT_ADDRESS": "0x00000000219ab540356cbb839cbe05303d7705fa",
        "HISTORY_STORAGE_ADDRESS": "0x0000f90827f1c53a10cb7a02335b175320002935",
        "WITHDRAWAL_REQUEST_PREDEPLOY_ADDRESS": "0x00000961ef480eb55e80d19ad83579a64c007002"
      }
    },
    "next": null,
    "last": null
  }
}
```

</TabItem>

</Tabs>

---

## `eth_protocolVersion`

Returns current Ethereum protocol version.

### Parameters

- None

### Returns

- Ethereum protocol version.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_protocolVersion",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_protocolVersion",
  "params": [],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x3f"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{protocolVersion}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  protocolVersion
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "protocolVersion": 63
  }
}
```

</TabItem>

</Tabs>

---

## `eth_syncing`

Returns an object with data about the synchronization status, or `false` if not synchronizing.

:::note

Once the node reaches the head of the chain, `eth_syncing` returns `false`, indicating that there is no active syncing target.

:::

### Parameters

- None

### Returns

- Synchronization status data object, or `false` if not synchronizing.

  <Fields>

  - `startingBlock`: _string_ - Index of the highest block on the blockchain when the network synchronization starts.

  - `currentBlock`: _string_ - Index of the latest block (also known as the best block) for the current node (this is the same index that [`eth_blockNumber`](#eth_blocknumber) returns.)

  - `highestBlock`: _string_ - Index of the highest known block in the peer network (that is, the highest block so far discovered among peer nodes. This is the same value as `currentBlock` if the current node has no peers.)

  - `pulledStates`: _string_ - The number of state entries fetched so far, or `null` if this is not known or not relevant (if
    [full syncing](../../../concepts/node-sync.md#full-synchronization) or fully synchronized, this field is not returned.)

  - `knownStates`: _string_ - The number of states the node knows of so far, or `null` if this is not known or not relevant (if
    [full syncing](../../../concepts/node-sync.md#full-synchronization) or fully synchronized, this field is not returned.)

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_syncing",
    "params": [],
    "id": 51
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_syncing",
  "params": [],
  "id": 51
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 51,
  "result": {
    "startingBlock": "0x0",
    "currentBlock": "0x1518",
    "highestBlock": "0x9567a3",
    "pulledStates": "0x203ca",
    "knownStates": "0x200636"
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{syncing{startingBlock currentBlock highestBlock pulledStates knownStates}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  syncing {
    startingBlock
    currentBlock
    highestBlock
    pulledStates
    knownStates
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "syncing": {
      "startingBlock": 0,
      "currentBlock": 5400,
      "highestBlock": 9791395,
      "pullStates": 132042,
      "knownStates": 2098742
    }
  }
}
```

</TabItem>

</Tabs>
