---
title: TRACE methods
description: Besu TRACE JSON-RPC API methods reference
sidebar_label: TRACE
toc_max_heading_level: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `TRACE` methods

The `TRACE` API is a more concise alternative to the [`DEBUG` API](debug/index.md).

:::note

The `TRACE` API is not enabled by default for JSON-RPC.
Enable it using the [`--rpc-http-api`](../cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../cli/options.md#rpc-ws-api) option.

:::

## `trace_block`

Provides transaction processing of type [`trace`](#trace) for the specified block.

:::info note
Your node must be an [archive node](../../concepts/node-sync.md#archive-nodes), or
the requested block must be within the number of
[blocks retained](../cli/options.md#bonsai-historical-block-limit) when using
[Bonsai](../../concepts/data-storage-formats.md#bonsai-tries) (by default, 512 from the head of the chain).
:::

<h3>Parameters</h3>

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

<h3>Returns</h3>

- List of [calls to other contracts](#trace) containing one object per call, in transaction execution order; if revert reason is enabled with [`--revert-reason-enabled`](../cli/options.md#revert-reason-enabled), the returned list items include the [revert reason](../../../private-networks/how-to/send-transactions/revert-reason.md).

<h3>Example</h3>

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "trace_block",
    "params": [
      "0x6"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "trace_block",
  "params": [
    "0x6"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "result": [
    {
      "action": {
        "callType": "call",
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "gas": "0xffad82",
        "input": "0x0000000000000000000000000000000000000999",
        "to": "0x0020000000000000000000000000000000000000",
        "value": "0x0"
      },
      "blockHash": "0x71512d31e18f828cef069a87bc2c7514a8ca334f9ee72625efdf5cc2d43768dd",
      "blockNumber": 6,
      "result": {
        "gasUsed": "0x7536",
        "output": "0x"
      },
      "subtraces": 1,
      "traceAddress": [],
      "transactionHash": "0x91eeabc671e2dd2b1c8ddebb46ba59e8cb3e7d189f80bcc868a9787728c6e59e",
      "transactionPosition": 0,
      "type": "call"
    },
    {
      "action": {
        "address": "0x0020000000000000000000000000000000000000",
        "balance": "0x300",
        "refundAddress": "0x0000000000000999000000000000000000000000"
      },
      "blockHash": "0x71512d31e18f828cef069a87bc2c7514a8ca334f9ee72625efdf5cc2d43768dd",
      "blockNumber": 6,
      "result": null,
      "subtraces": 0,
      "traceAddress": [0],
      "transactionHash": "0x91eeabc671e2dd2b1c8ddebb46ba59e8cb3e7d189f80bcc868a9787728c6e59e",
      "transactionPosition": 0,
      "type": "suicide"
    },
    {
      "action": {
        "author": "0x0000000000000000000000000000000000000000",
        "rewardType": "block",
        "value": "0x1bc16d674ec80000"
      },
      "blockHash": "0x71512d31e18f828cef069a87bc2c7514a8ca334f9ee72625efdf5cc2d43768dd",
      "blockNumber": 6,
      "result": null,
      "subtraces": 0,
      "traceAddress": [],
      "transactionHash": null,
      "transactionPosition": null,
      "type": "reward"
    }
  ],
  "id": 1
}
```

</TabItem>

</Tabs>

---

## `trace_call`

Executes the given call and returns a number of possible traces for it.

:::info note
When using [Bonsai](../../concepts/data-storage-formats.md#bonsai-tries), the requested block must
be within the number of [blocks retained](../cli/options.md#bonsai-historical-block-limit) (by
default, 512 from the head of the chain).
:::

<h3>Parameters</h3>

- `call`: _object_ - Transaction call object.

  <Fields>

  - `from`: _data, 20 bytes_ - Address of the sender.

  - `to`: _data, 20 bytes_ - Address of the action receiver.

  - `gas`: _quantity, integer_ - Gas provided by the sender. `eth_call` consumes zero gas, but other executions might need this parameter. `eth_estimateGas` ignores this value.

  - `gasPrice`: _quantity, integer_ - Gas price, in Wei, provided by the sender. The default is `0`. Used only in non-[`EIP1559`](../../concepts/transactions/types.md#eip1559-transactions) transactions.

  - `maxPriorityFeePerGas`: _quantity, integer_ - Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Can be used only in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions). If used, must specify `maxFeePerGas`.

  - `maxFeePerGas`: _quantity, integer_ - Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Can be used only in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions). If used, must specify `maxPriorityFeePerGas`.

  - `maxFeePerBlobGas`: _quantity, integer_ - Maximum fee the sender is willing to pay per blob gas. Only used for blob transactions introduced in [EIP-4844]( https://eips.ethereum.org/EIPS/eip-4844).

  - `nonce`: _quantity, integer_ - Number of transactions made by the sender before this one. The default is the sender's nonce.

  - `value`: _quantity, integer_ - Value transferred, in Wei.

  - `data`: _data_ - Hash of the method signature and encoded parameters. For details, see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html). Must be equal to `input` if both parameters are provided.

  - `input`: _data_ - Hash of the method signature and encoded parameters. For details, see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html). Must be equal to `data` if both parameters are provided.

  - `accessList`: _array_ - List of addresses and storage keys that the transaction plans to access. Used only in non-[`FRONTIER`](../../concepts/transactions/types.md#frontier-transactions) transactions.

  - `strict`: _tag_ - Determines if the sender account balance is considered during gas estimation. If `true`, the sender's balance is checked against the transaction's gas parameters. This ensures the estimated gas reflects what the sender can actually afford. If `false`, the balance checks are skipped. The default is `true`.

  - `blobVersionedHashes`: _array_ - List of references to blobs introduced in [EIP-4844]( https://eips.ethereum.org/EIPS/eip-4844).

  </Fields>

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

- `options`: _array_ of _strings_ - List of tracing options; tracing options are [`trace`](#trace), [`vmTrace`](#vmtrace), and [`stateDiff`](#statediff). Specify any combination of the three options including none of them.

<h3>Returns</h3>

- Object containing the trace results for the call, depending on the requested `options`.

  <Fields>

  - `output`: _data_ - Return value of the call.

  - `stateDiff`: _object_ - [State changes in the requested block](#statediff), or `null` if `stateDiff` wasn't a requested option.

  - `trace`: _array_ - [Ordered list of calls to other contracts](#trace), or an empty array if `trace` wasn't a requested option.

  - `vmTrace`: _object_ - [Ordered list of EVM actions](#vmtrace), or `null` if `vmTrace` wasn't a requested option.

  </Fields>

<h3>Example</h3>

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "trace_call",
    "params": [
      {
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "to": "0x0010000000000000000000000000000000000000",
        "gas": "0xfffff2",
        "gasPrice": "0xef",
        "value": "0x0",
        "data": "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002",
        "nonce": "0x0"
      },
      [
        "trace"
      ],
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
  "method": "trace_call",
  "params": [
    {
      "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
      "to": "0x0010000000000000000000000000000000000000",
      "gas": "0xfffff2",
      "gasPrice": "0xef",
      "value": "0x0",
      "data": "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002",
      "nonce": "0x0"
    },
    [
      "trace"
    ],
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
    "result": {
      "output" : "0x",
      "stateDiff" : null,
      "trace" : [ {
        "action" : {
          "callType" : "call",
          "from" : "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
          "gas" : "0xffabba",
          "input" : "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002",
          "to" : "0x0010000000000000000000000000000000000000",
          "value" : "0x0"
      },
      "result" : {
        "gasUsed" : "0x9c58",
        "output" : "0x"
      },
      "subtraces" : 0,
      "traceAddress" : [ ],
      "type" : "call"
    } ],
    "vmTrace" : null
    },
"id" : 2
},
```

</TabItem>

</Tabs>

---

## `trace_callMany`

Performs multiple call traces on top of the same block. You can trace dependent transactions.

:::info note
When using [Bonsai](../../concepts/data-storage-formats.md#bonsai-tries), the requested block must
be within the number of [blocks retained](../cli/options.md#bonsai-historical-block-limit) (by
default, 512 from the head of the chain).
:::

<h3>Parameters</h3>

- `options`: _array_ of _strings_ - List of tracing options; tracing options are [`trace`](#trace), [`vmTrace`](#vmtrace), and [`stateDiff`](#statediff). Specify any combination of the three options including none of them.

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

<h3>Returns</h3>

- List of objects containing the trace results for each call, in the order the calls were specified, one object per call, depending on the requested `options`.

  <Fields>

  - `output`: _data_ - Return value of the call.

  - `stateDiff`: _object_ - [State changes in the requested block](#statediff), or `null` if `stateDiff` wasn't a requested option.

  - `trace`: _array_ - [Ordered list of calls to other contracts](#trace), or an empty array if `trace` wasn't a requested option.

  - `vmTrace`: _object_ - [Ordered list of EVM actions](#vmtrace), or `null` if `vmTrace` wasn't a requested option.

  </Fields>

<h3>Example</h3>

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "trace_callMany",
    "params": [
      [
        [
          {
            "from": "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
            "to": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
            "value": "0x186a0"
          },
          [
            "trace"
          ]
        ],
        [
          {
            "from": "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
            "to": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
            "value": "0x186a0"
          },
          [
            "trace"
          ]
        ]
      ],
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
  "method": "trace_callMany",
  "params": [
    [
      [
        {
          "from": "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
          "to": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
          "value": "0x186a0"
        },
        [
          "trace"
        ]
      ],
      [
        {
          "from": "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
          "to": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
          "value": "0x186a0"
        },
        [
          "trace"
        ]
      ]
    ],
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
    "result": [
      {
      "output" : "0x",
      "stateDiff" : null,
      "trace" : [ {
        "action" : {
          "callType" : "call",
          "from" : "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
          "gas" : "0x1dcd12f8",
          "input" : "0x",
          "to" : "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
          "value" : "0x186a0"
      },
      "result" : {
        "gasUsed" : "0x0",
        "output" : "0x"
      },
      "subtraces" : 0,
      "traceAddress" : [ ],
      "type" : "call"
    } ],
    "vmTrace" : null
    },
    {
      "output" : "0x",
      "stateDiff" : null,
      "trace" : [ {
        "action" : {
          "callType" : "call",
          "from" : "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
          "gas" : "0x1dcd12f8",
          "input" : "0x",
          "to" : "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
          "value" : "0x186a0"
      },
      "result" : {
        "gasUsed" : "0x0",
        "output" : "0x"
      },
      "subtraces" : 0,
      "traceAddress" : [ ],
      "type" : "call"
    } ],
    "vmTrace" : null
    },
  ],
"id" : 1
},
```

</TabItem>

</Tabs>

---

## `trace_filter`

Returns traces matching the specified filter. The maximum number of blocks you can supply to `trace_filter` is 1000 by default. You can adjust this limit using the [`--rpc-max-trace-filter-range`](../cli/options.md#rpc-max-trace-filter-range) option. 

:::info note
Your node must be an [archive node](../../concepts/node-sync.md#archive-nodes), or
the requested blocks must be within the number of
[blocks retained](../cli/options.md#bonsai-historical-block-limit) when using
[Bonsai](../../concepts/data-storage-formats.md#bonsai-tries) (by default, 512 from the head of the chain).
:::

<h3>Parameters</h3>

- `traceFilterOptions`: _object_ - Trace filter options object.

- `fromBLock`: _String | Tag_ - Trace starts at this block.

- `toBlock`: _String | Tag_ - Trace stops at this block.

- `fromAddress`: _string_ - Include only traces sent from this address.

- `toAddress`: _string_ - Include only traces with this destination address.

- `after`: _quantity_ - The offset trace number.

- `count`: _integer_ - Number of traces to display in a batch.

<h3>Returns</h3>

- List of [calls to other contracts](#trace) containing one object per call, in transaction execution order.

<h3>Example</h3>

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "trace_filter",
    "params": [
      {
        "fromBlock": "0x1",
        "toBlock": "0x21",
        "after": 2,
        "count": 2,
        "fromAddress": [
          "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
        ]
      }
    ],
    "id": 415
  }'
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "trace_filter",
  "params": [
    {
      "fromBlock": "0x1",
      "toBlock": "0x21",
      "after": 2,
      "count": 2,
      "fromAddress": [
        "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
      ]
    }
  ],
  "id": 415
}
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "result": [
    {
      "action": {
        "callType": "call",
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "gas": "0xffad82",
        "input": "0x0000000000000000000000000000000000000999",
        "to": "0x0020000000000000000000000000000000000000",
        "value": "0x0"
      },
      "blockHash": "0xcd5d9c7acdcbd3fb4b24a39e05a38e32235751bb0c9e4f1aa16dc598a2c2a9e4",
      "blockNumber": 6,
      "result": {
        "gasUsed": "0x7536",
        "output": "0x"
      },
      "subtraces": 1,
      "traceAddress": [],
      "transactionHash": "0x91eeabc671e2dd2b1c8ddebb46ba59e8cb3e7d189f80bcc868a9787728c6e59e",
      "transactionPosition": 0,
      "type": "call"
    },
    {
      "action": {
        "callType": "call",
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "gas": "0xffad52",
        "input": "0xf000000000000000000000000000000000000000000000000000000000000001",
        "to": "0x0030000000000000000000000000000000000000",
        "value": "0x0"
      },
      "blockHash": "0xeed85fe57db751442c826cfe4fdf43b10a5c2bc8b6fd3a8ccced48eb3fb35885",
      "blockNumber": 7,
      "result": {
        "gasUsed": "0x1b",
        "output": "0xf000000000000000000000000000000000000000000000000000000000000002"
      },
      "subtraces": 0,
      "traceAddress": [],
      "transactionHash": "0x47f4d445ea1812cb1ddd3464ab23d2bfc6ed408a8a9db1c497f94e8e06e85286",
      "transactionPosition": 0,
      "type": "call"
    }
  ],
  "id": 415
}
```

</TabItem>
</Tabs>

---

## `trace_get`

Returns a trace at the given position.

:::info note
Your node must be an [archive node](../../concepts/node-sync.md#archive-nodes), or
the requested transaction must be contained in a block within the number of
[blocks retained](../cli/options.md#bonsai-historical-block-limit) when using
[Bonsai](../../concepts/data-storage-formats.md#bonsai-tries) (by default, 512 from the head of the chain).
:::

<h3>Parameters</h3>

- `transaction`: _string_ - Transaction hash.

- `indexPositions`: _array_ - Index positions of the traces.

<h3>Returns</h3>

- List of [calls to other contracts](#trace) containing one object per call, in the order called by the transaction.

<h3>Example</h3>

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "trace_get",
    "params": [
      "0x17104ac9d3312d8c136b7f44d4b8b47852618065ebfa534bd2d3b5ef218ca1f3",
      [
        "0x0"
      ]
    ],
    "id": 1
  }'
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "trace_get",
  "params": [
    "0x17104ac9d3312d8c136b7f44d4b8b47852618065ebfa534bd2d3b5ef218ca1f3",
    [
      "0x0"
    ]
  ],
  "id": 1
}
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
    "jsonrpc": "2.0",
    "result": {
      "action" : {
        "callType" : "call",
        "from" : "0x1c39ba39e4735cb65978d4db400ddd70a72dc750",
        "gas" : "0x13e99",
        "input" : "0x16c72721",
        "to" : "0x2bd2326c993dfaef84f696526064ff22eba5b362",
        "value" : "0x0"
      },
      "blockHash" : "0x7eb25504e4c202cf3d62fd585d3e238f592c780cca82dacb2ed3cb5b38883add"
      "blockNumber": 3068185,
      "result": {
        "gasUsed": "0x183",
        "output" : "0x0000000000000000000000000000000000000000000000000000000000000001"
      },
      "subtraces" : 0,
      "traceAddress" : [
        0
      ],
      "transactionHash": "0x17104ac9d3312d8c136b7f44d4b8b47852618065ebfa534bd2d3b5ef218ca1f3",
      "transactionPosition": 2,
      "type" : "call"
    },
"id" : 1
},
```

</TabItem>
</Tabs>

---

## `trace_rawTransaction`

Traces a call to `eth_sendRawTransaction` without making the call, returning the traces.

:::info note
When using [Bonsai](../../concepts/data-storage-formats.md#bonsai-tries), the requested transaction
must be contained in a block within the number of
[blocks retained](../cli/options.md#bonsai-historical-block-limit) (by default, 512 from the head of
the chain).
:::

<h3>Parameters</h3>

- `data` - _string_ - Raw transaction data.

- `options`: _array_ of _strings_ - List of tracing options; tracing options are [`trace`](#trace), [`vmTrace`](#vmtrace), and [`stateDiff`](#statediff). Specify any combination of the three options including none of them.

<h3>Returns</h3>

- Object containing the trace results for the transaction, depending on the requested `options`.

  <Fields>

  - `output`: _data_ - Return value of the transaction.

  - `from`: _data, 20 bytes_ - Address of the transaction sender.

  - `stateDiff`: _object_ - [State changes in the requested block](#statediff), or `null` if `stateDiff` wasn't a requested option.

  - `trace`: _array_ - [Ordered list of calls to other contracts](#trace), or an empty array if `trace` wasn't a requested option.

  - `vmTrace`: _object_ - [Ordered list of EVM actions](#vmtrace), or `null` if `vmTrace` wasn't a requested option.

  </Fields>

<h3>Example</h3>

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "trace_rawTransaction",
    "params": [
      "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
      [
        "trace"
      ]
    ],
    "id": 1
  }'
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "trace_rawTransaction",
  "params": [
    "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
    [
      "trace"
    ]
  ],
  "id": 1
}
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
    "jsonrpc": "2.0",
    "result": {
      "output" : "0x"
      "stateDiff": null,
      "from" : "0x1c39ba39e4735cb65978d4db400ddd70a72dc750",
      "trace": [{
        "action": { ... },
        "result": {
          "gasUsed": "0x0",
          "output": "0x"
        }
      "subtraces": 0,
      "traceAddress": [],
      "type": "call"
    }],
    "vmTrace": null
    },
"id" : 1
},
```

</TabItem>
</Tabs>

---

## `trace_replayBlockTransactions`

Provides transaction processing tracing per block.

:::info note
When using [Bonsai](../../concepts/data-storage-formats.md#bonsai-tries), the requested block must
be within the number of [blocks retained](../cli/options.md#bonsai-historical-block-limit) (by
default, 512 from the head of the chain).
:::

<h3>Parameters</h3>

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

- `options`: _array_ of _strings_ - List of tracing options; tracing options are [`trace`](#trace), [`vmTrace`](#vmtrace), and [`stateDiff`](#statediff). Specify any combination of the three options including none of them.

<h3>Returns</h3>

- List of transaction trace objects containing one object per transaction, in transaction execution order; if revert reason is enabled with [`--revert-reason-enabled`](../cli/options.md#revert-reason-enabled), the [`trace`](#trace) list items in the returned transaction trace object include the [revert reason](../../../private-networks/how-to/send-transactions/revert-reason.md).

  <Fields>

  - `output`: _boolean_ - Transaction result. 1 for success and 0 for failure.

  - `stateDiff`: _object_ - [State changes in the requested block](#statediff).

  - `trace`: _array_ - [Ordered list of calls to other contracts](#trace).

  - `vmTrace`: _object_ - [Ordered list of EVM actions](#vmtrace).

  - `transactionHash`: _data, 32 bytes_ - Hash of the replayed transaction.

  </Fields>

<h3>Example</h3>

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "trace_replayBlockTransactions",
    "params": [
      "0x12",
      [
        "trace",
        "vmTrace",
        "stateDiff"
      ]
    ],
    "id": 1
  }'
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "trace_replayBlockTransactions",
  "params": [
    "0x12",
    [
      "trace",
      "vmTrace",
      "stateDiff"
    ]
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
    "result":[
      {
        "output":"0x",
        "vmTrace":{
          "code":"0x7f3940be4289e4c3587d88c1856cc95352461992db0a584c281226faefe560b3016000527f14c4d2c102bdeb2354bfc3dc96a95e4512cf3a8461e0560e2272dbf884ef3905601052600851",
          "ops":[
            {
              "cost":3,
              "ex":{
                "mem":null,
                "push":[
                  "0x8"
                ],
                "store":null,
                "used":16756175
              },
              "pc":72,
              "sub":null
            },
            ...
          ]
        },
        "trace":[
          {
            "action":{
              "callType":"call",
              "from":"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
              "gas":"0xffadea",
              "input":"0x",
              "to":"0x0100000000000000000000000000000000000000",
              "value":"0x0"
            },
            "result":{
              "gasUsed":"0x1e",
              "output":"0x"
            },
            "subtraces":0,
            "traceAddress":[
            ],
            "type":"call"
          }
        ],
        "stateDiff":{
          "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73":{
            "balance":{
              "*":{
                "from":"0xffffffffffffffffffffffffffffffffc3e12a20b",
                "to":"0xffffffffffffffffffffffffffffffffc3dc5f091"
              }
            },
            "code":"=",
            "nonce":{
              "*":{
                "from":"0x14",
                "to":"0x15"
              }
            },
            "storage":{
            }
          }
        },
        "transactionHash":"0x2a5079cc535c429f668f13a7fb9a28bdba6831b5462bd04f781777b332a8fcbd",
      },
      {...}
    ]
}
```

</TabItem>
</Tabs>

---

## `trace_transaction`

Provides transaction processing of type [`trace`](#trace) for the specified transaction.

:::info note
Your node must be an [archive node](../../concepts/node-sync.md#archive-nodes), or
the requested transaction must be contained in a block within the number of
[blocks retained](../cli/options.md#bonsai-historical-block-limit) when using
[Bonsai](../../concepts/data-storage-formats.md#bonsai-tries) (by default, 512 from the head of the chain).
:::

<h3>Parameters</h3>

- `transaction`: _string_ - Transaction hash.

<h3>Returns</h3>

- List of [calls to other contracts](#trace) containing one object per call, in the order called by the transaction; if revert reason is enabled with [`--revert-reason-enabled`](../cli/options.md#revert-reason-enabled), the returned list items include the [revert reason](../../../private-networks/how-to/send-transactions/revert-reason.md).

<h3>Example</h3>

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "trace_transaction",
    "params": [
      "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7"
    ],
    "id": 1
  }'
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "trace_transaction",
  "params": [
    "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7"
  ],
  "id": 1
}
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "result": [
    {
      "action": {
        "creationMethod": "create",
        "from": "0x627306090abab3a6e1400e9345bc60c78a8bef57",
        "gas": "0xff2e26",
        "init": "0x60006000600060006000732c2b9c9a4a25e24b174f26114e8926a9f2128fe45af2600060006000600060007300a00000000000000000000000000000000000005af2",
        "value": "0x0"
      },
      "blockHash": "0x7e9a993adc6f043c0a9b6a385e6ed3fa370586c55823251b8fa7033cf89d414e",
      "blockNumber": 19,
      "result": {
        "address": "0x30753e4a8aad7f8597332e813735def5dd395028",
        "code": "0x",
        "gasUsed": "0x1c39"
      },
      "subtraces": 2,
      "traceAddress": [],
      "transactionHash": "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7",
      "transactionPosition": 3,
      "type": "create"
    },
    {
      "action": {
        "callType": "callcode",
        "from": "0x30753e4a8aad7f8597332e813735def5dd395028",
        "gas": "0xfb2ea9",
        "input": "0x",
        "to": "0x2c2b9c9a4a25e24b174f26114e8926a9f2128fe4",
        "value": "0x0"
      },
      "blockHash": "0x7e9a993adc6f043c0a9b6a385e6ed3fa370586c55823251b8fa7033cf89d414e",
      "blockNumber": 19,
      "result": {
        "gasUsed": "0x138e",
        "output": "0x"
      },
      "subtraces": 1,
      "traceAddress": [0],
      "transactionHash": "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7",
      "transactionPosition": 3,
      "type": "call"
    },
    {
      "action": {
        "address": "0x30753e4a8aad7f8597332e813735def5dd395028",
        "balance": "0x0",
        "refundAddress": "0x0000000000000000000000000000000000000000"
      },
      "blockHash": "0x7e9a993adc6f043c0a9b6a385e6ed3fa370586c55823251b8fa7033cf89d414e",
      "blockNumber": 19,
      "result": null,
      "subtraces": 0,
      "traceAddress": [0, 0],
      "transactionHash": "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7",
      "transactionPosition": 3,
      "type": "suicide"
    },
    {
      "action": {
        "callType": "callcode",
        "from": "0x30753e4a8aad7f8597332e813735def5dd395028",
        "gas": "0xfb18a5",
        "input": "0x",
        "to": "0x00a0000000000000000000000000000000000000",
        "value": "0x0"
      },
      "blockHash": "0x7e9a993adc6f043c0a9b6a385e6ed3fa370586c55823251b8fa7033cf89d414e",
      "blockNumber": 19,
      "result": {
        "gasUsed": "0x30b",
        "output": "0x"
      },
      "subtraces": 0,
      "traceAddress": [1],
      "transactionHash": "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7",
      "transactionPosition": 3,
      "type": "call"
    }
  ],
  "id": 1
}
```

</TabItem>
</Tabs>

---

## Trace types

### `trace`

An ordered list of calls to other contracts, excluding precompiled contracts.
Each item in the list is an object with the following fields.

<Fields>

- `action`: _object_ - Transaction details.

  <Fields>

  - `callType`: _string_ - Whether the transaction is `call` or `create`.

  - `from`: _data, 20 bytes_ - Address of the transaction sender.

  - `gas`: _quantity_ - Gas provided by sender.

  - `input`: _data_ - Transaction data.

  - `to`: _data, 20 bytes_ - Target of the transaction.

  - `value`: _quantity_ - Value transferred in the transaction.

  </Fields>

- `result`: _object_ - Transaction result.

  <Fields>

  - `gasUsed`: _quantity_ - Gas used by the transaction. Includes any refunds of unused gas.

  - `output`: _data_ - Return value of the contract call. Contains only the actual value sent by a `RETURN` operation. If a `RETURN` was not executed, the output is empty bytes.

  </Fields>

- `subtraces`: _integer_ - Traces of contract calls made by the transaction.

- `traceAddress`: _array_ - Tree list address of where the call occurred, address of the parents, and order of the current sub call.

- `type`: _string_ - Whether the transaction is a `CALL` or `CREATE` series operation.

</Fields>

#### Example

```json
"trace":[
  {
    "action":{
      "callType":"call",
      "from":"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
      "gas":"0xffadea",
      "input":"0x",
      "to":"0x0100000000000000000000000000000000000000",
      "value":"0x0"
    },
    "result":{
      "gasUsed":"0x1e",
      "output":"0x"
    },
    "subtraces":0,
    "traceAddress":[
    ],
    "type":"call"
  }
]
```

### `vmTrace`

An object containing the following fields.

<Fields>

- `code`: _data_ - Code executed by the EVM.

- `ops`: _array_ - Sequence of EVM operations (opcodes) executed in the transaction.

  <Fields>

  - `cost`: _quantity_ - Gas cost of the opcode. Includes memory expansion costs but not gas refunds. For precompiled contract calls, reports only the actual cost.

  - `ex`: _object_ - Executed operations.

    <Fields>

    - `mem`: _object_ - Memory read or written by the operation.

    - `push`: _array_ - Adjusted stack items. For swap, includes all intermediate values and the result. Otherwise, is the value pushed onto the stack.

    - `store`: _object_ - Account storage written by the operation.

    - `used`: _quantity_ - Remaining gas taking into account the all but 1/64th rule for calls.

    </Fields>

  - `pc`: _quantity_ - Program counter.

  - `sub`: _object_ - Sub call operations.

  </Fields>

</Fields>

`vmTrace` only reports actual data returned from a `RETURN` opcode and does not return the contents of the reserved output space for the call operations. As a result:

- `vmTrace` reports `null` when a call operation ends because of a `STOP`, `HALT`, `REVERT`, running out of instructions, or any exceptional halts.
- When a `RETURN` operation returns data of a different length to the space reserved by the call, `vmTrace` reports only the data passed to the `RETURN` operation and does not include pre-existing memory data or trim the returned data.

For out of gas operations, `vmTrace` reports the operation that caused the out of gas exception, including the calculated gas cost. `vmTrace` does not report `ex` values because the operation is not executed.

#### Example

```json
"vmTrace":{
  "code":"0x7f3940be4289e4c3587d88c1856cc95352461992db0a584c281226faefe560b3016000527f14c4d2c102bdeb2354bfc3dc96a95e4512cf3a8461e0560e2272dbf884ef3905601052600851",
  "ops":[
    {
    "cost":3,
    "ex":{
      "mem":null,
      "push":[
        "0x8"
      ],
      "store":null,
      "used":16756175
    },
    "pc":72,
    "sub":null
    },
    ...
  ]
}
```

### `stateDiff`

State changes in the requested block for each transaction represented as a map of accounts to an object.
Besu lists the balance, code, nonce, and storage changes from immediately before the transaction to after the transaction.

<Fields>

- `balance`: _string or object_ - Change of balance.

- `code`: _string or object_ - Change to the account's code.

- `nonce`: _string or object_ - Change of nonce.

- `storage`: _object_ - Map of each changed storage slot key to its diff value.

<br/>

Each of the `balance`, `code`, and `nonce` values, and each changed storage slot in `storage`, uses one of the following notations, depending on the type of change:

- `"="` - The value didn't change.

- `{"+": <value>}` - The value didn't exist before the transaction and now has the specified value.

- `{"-": <value>}` - The value existed before the transaction and was deleted.

- `{"*": {"from": <value>, "to": <value>}}` - The value changed from one value to another.

An absent value is distinct from zero when creating accounts or clearing storage.

</Fields>

#### Example

```json
"stateDiff":{
  "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73":{
    "balance":{
      "*":{
        "from":"0xffffffffffffffffffffffffffffffffc3e12a20b",
        "to":"0xffffffffffffffffffffffffffffffffc3dc5f091"
      }
    },
    "code":"=",
    "nonce":{
      "*":{
        "from":"0x14",
        "to":"0x15"
      }
    },
    "storage":{
    }
  }
}
```
