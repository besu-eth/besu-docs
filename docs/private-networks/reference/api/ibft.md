---
title: IBFT methods
description: Besu IBFT JSON-RPC API methods reference
sidebar_label: IBFT
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `IBFT` methods

The `IBFT` API methods provide access to the [IBFT 2.0](../../how-to/configure/consensus/ibft.md) consensus engine.

:::note

The `IBFT` API is not enabled by default for JSON-RPC.
Enable it using the [`--rpc-http-api`](../../../public-networks/reference/cli/options.md#rpc-http-api) or
[`--rpc-ws-api`](../../../public-networks/reference/cli/options.md#rpc-ws-api) option.

:::

## `ibft_discardValidatorVote`

Discards a proposal to [add or remove a validator](../../how-to/configure/consensus/ibft.md#add-and-remove-validators) with the specified address.

### Parameters

- `address`: _string_ - 20-byte address of the proposed validator.

### Returns

- Indicates if the proposal is discarded.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "ibft_discardValidatorVote",
    "params": [
      "0xef1bfb6a12794615c9b0b5a21e6741f01e570185"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "ibft_discardValidatorVote",
  "params": [
    "0xef1bfb6a12794615c9b0b5a21e6741f01e570185"
  ],
  "id": 1
}
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

---

## `ibft_getPendingVotes`

Returns [votes](../../how-to/configure/consensus/ibft.md#add-and-remove-validators) cast in the current [epoch](../../how-to/configure/consensus/ibft.md#genesis-file).

### Parameters

- None

### Returns

- Account addresses mapped to boolean values indicating the vote for each account.
  `true` is a vote to add a validator; `false` is a vote to remove a validator.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "ibft_getPendingVotes",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "ibft_getPendingVotes",
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
    "0xef1bfb6a12794615c9b0b5a21e6741f01e570185": true,
    "0x42d4287eac8078828cf5f3486cfe601a275a49a5": true
  }
}
```

</TabItem>

</Tabs>

---

## `ibft_getSignerMetrics`

Provides the following validator metrics for the specified range:

- Number of blocks from each validator.
- Block number of the last block proposed by each validator (if any proposed in the specified range).
- All validators present in the last block of the range.

### Parameters

- `fromBlockNumber`: _string_ - (Optional) Hexadecimal integer representing a block number, or one
  of the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../public-networks/how-to/use-besu-api/json-rpc.md#block-parameter).

- `toBlockNumber`: _string_ - (Optional) Hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../public-networks/how-to/use-besu-api/json-rpc.md#block-parameter).

:::note
`pending` returns the same value as `latest`.
:::

If you specify:

- No parameters, the call provides metrics for the last 100 blocks, or all blocks if there are fewer than 100 blocks.
- Only the first parameter, the call provides metrics for all blocks from the specified block to the latest block.

### Returns

- List of validator objects.

  <Fields>

  - `address`: _string_ - Address of the validator.

    :::note

    The proposer of the genesis block has address `0x0000000000000000000000000000000000000000`.

    :::

  - `proposedBlockCount`: _string_ - Hexadecimal integer representing the number of blocks proposed by the validator in the specified range.

  - `lastProposedBlockNumber`: _string_ - Hexadecimal integer representing the block number of the last block proposed by the validator in the specified range.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "ibft_getSignerMetrics",
    "params": [
      "0x1",
      "0x64"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "ibft_getSignerMetrics",
  "params": [
    "0x1",
    "0x64"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "address": "0x7ffc57839b00206d1ad20c69a1981b489f772031",
      "proposedBlockCount": "0x21",
      "lastProposedBlockNumber": "0x61"
    },
    {
      "address": "0x42eb768f2244c8811c63729a21a3569731535f06",
      "proposedBlockCount": "0x21",
      "lastProposedBlockNumber": "0x63"
    },
    {
      "address": "0xb279182d99e65703f0076e4812653aab85fca0f0",
      "proposedBlockCount": "0x21",
      "lastProposedBlockNumber": "0x62"
    }
  ]
}
```

</TabItem>

</Tabs>

---

## `ibft_getValidatorsByBlockHash`

Lists the validators defined in the specified block.

### Parameters

- `block`: _string_ - 32-byte block hash.

### Returns

- List of validator addresses.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "ibft_getValidatorsByBlockHash",
    "params": [
      "0xbae7d3feafd743343b9a4c578cab5e5d65eb735f6855fb845c00cab356331256"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "ibft_getValidatorsByBlockHash",
  "params": [
    "0xbae7d3feafd743343b9a4c578cab5e5d65eb735f6855fb845c00cab356331256"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    "0x42d4287eac8078828cf5f3486cfe601a275a49a5",
    "0xb1b2bc9582d2901afdc579f528a35ca41403fa85",
    "0xef1bfb6a12794615c9b0b5a21e6741f01e570185"
  ]
}
```

</TabItem>

</Tabs>

---

## `ibft_getValidatorsByBlockNumber`

Lists the validators defined in the specified block.

### Parameters

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of the
  string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../public-networks/how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

### Returns

- List of validator addresses.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "ibft_getValidatorsByBlockNumber",
    "params": [
      "latest"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "ibft_getValidatorsByBlockNumber",
  "params": [
    "latest"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    "0x42d4287eac8078828cf5f3486cfe601a275a49a5",
    "0xb1b2bc9582d2901afdc579f528a35ca41403fa85",
    "0xef1bfb6a12794615c9b0b5a21e6741f01e570185"
  ]
}
```

</TabItem>

</Tabs>

---

## `ibft_proposeValidatorVote`

Proposes to [add or remove a validator](../../how-to/configure/consensus/ibft.md#add-and-remove-validators) with the specified address.

### Parameters

- `address`: _string_ - Account address.

- `proposal`: _boolean_ - `true` to propose adding a validator, or `false` to propose removing a validator.

### Returns

- `true`

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "ibft_proposeValidatorVote",
    "params": [
      "0x42d4287eac8078828cf5f3486cfe601a275a49a5",
      true
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "ibft_proposeValidatorVote",
  "params": [
    "0x42d4287eac8078828cf5f3486cfe601a275a49a5",
    true
  ],
  "id": 1
}
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
