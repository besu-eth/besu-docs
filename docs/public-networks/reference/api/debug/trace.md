---
title: Trace methods
description: Besu DEBUG JSON-RPC API trace methods reference
sidebar_label: Trace
sidebar_position: 1
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

These methods trace transactions, blocks, and calls to inspect low-level execution.

## `debug_standardTraceBlockToFile`

Generates files containing the block trace. A separate file is generated for each transaction in the block.

You can also specify a trace file for a specific transaction in a block.

Use [`debug_standardTraceBadBlockToFile`](#debug_standardtracebadblocktofile) to view the trace for an invalid block.

### Parameters

- `blockHash`: _string_ - Block hash.

- `options`: _object_ - (Optional) Request options object (all fields optional).

  <Fields>

  - `txHash`: _string_ - Transaction hash; if omitted, a trace file is generated for each transaction in the block.

  - `disableMemory`: _boolean_ - `true` disables memory capture.
    The default is `true`.

  - `disableStack`: _boolean_ - `true` disables stack capture.
    The default is `false`.

  - `disableStorage`: _boolean_ - `true` disables storage capture.
    The default is `false`.

  - `opcodes`: _array_ of _strings_ - List of opcode names to trace; if omitted or empty, all opcodes are traced.

  - `enableReturnData`: _boolean_ - `true` enables return data capture.
    The default is `false`.

  </Fields>

### Returns

- Location of the generated trace files.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_standardTraceBlockToFile",
    "params": [
      "0x2dc0b6c43144e314a86777b4bd4f987c0790a6a0b21560671d221ed81a23f2dc",
      {
        "txHash": "0x4ff04c4aec9517721179c8dd435f47fbbfc2ed26cd4926845ab687420d5580a6",
        "disableMemory": false
      }
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_standardTraceBlockToFile",
  "params": [
    "0x2dc0b6c43144e314a86777b4bd4f987c0790a6a0b21560671d221ed81a23f2dc",
    {
      "txHash": "0x4ff04c4aec9517721179c8dd435f47fbbfc2ed26cd4926845ab687420d5580a6",
      "disableMemory": false
    }
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
    "/Users/me/mynode/sepolia/data/traces/block_0x2dc0b6c4-4-0x4ff04c4a-1612820117332"
  ]
}
```

</TabItem>

</Tabs>

---

## `debug_standardTraceBadBlockToFile`

Generates files containing the block trace of invalid blocks. A separate file is generated for each transaction in the block.

Use [`debug_standardTraceBlockToFile`](#debug_standardtraceblocktofile) to view the trace for a valid block.

### Parameters

- `blockHash`: _string_ - Block hash.

- `options`: _object_ - (Optional) Request options object (all fields optional).

  <Fields>

  - `txHash`: _string_ - Transaction hash; if omitted, a trace file is generated for each transaction in the block.

  - `disableMemory`: _boolean_ - `true` disables memory capture.
    The default is `true`.

  - `disableStack`: _boolean_ - `true` disables stack capture.
    The default is `false`.

  - `disableStorage`: _boolean_ - `true` disables storage capture.
    The default is `false`.

  - `opcodes`: _array_ of _strings_ - List of opcode names to trace; if omitted or empty, all opcodes are traced.

  - `enableReturnData`: _boolean_ - `true` enables return data capture.
    The default is `false`.

  </Fields>

### Returns

- Location of the generated trace files.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_standardTraceBadBlockToFile",
    "params": [
      "0x53741e9e94791466d117c5f9e41a2ed1de3f73d39920c621dfc2f294e7779baa"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_standardTraceBadBlockToFile",
  "params": [
    "0x53741e9e94791466d117c5f9e41a2ed1de3f73d39920c621dfc2f294e7779baa"
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
    "/Users/me/mynode/sepolia/data/traces/block_0x53741e9e-0-0x407ec43d-1600951088172"
  ]
}
```

</TabItem>

</Tabs>

---

## `debug_traceTransaction`

[Remix](https://remix.ethereum.org/) uses `debug_traceTransaction` to implement debugging. Use the _Debugger_ tab in Remix instead of calling `debug_traceTransaction` directly.

Reruns the transaction with the same state as when the transaction executed.

### Parameters

- `transactionHash`: _string_ - Transaction hash.

- `options`: _object_ - (Optional) Request options object (all fields optional).

  <Fields>

  - `disableStorage`: _boolean_ - `true` disables storage capture. The default is `false`.

  - `enableMemory`: _boolean_ - `true` enables memory capture. The default is `false`.
    If specified, `enableMemory` takes precedence over `disableMemory`.

  - `disableMemory`: _boolean_ - `true` disables memory capture. The default is `true`.

  - `disableStack` : _boolean_ - `true` disables stack capture. The default is `false`.

  - `opcodes`: _array_ of _strings_ - List of opcode names to trace; if omitted or empty, all opcodes are traced.

  - `enableReturnData`: _boolean_ - `true` enables return data capture. The default is `false`.

  </Fields>

### Returns

- Trace object.

  <Fields>

  - `gas`: _integer_ - Gas used by the transaction.

  - `failed`: _boolean_ - True if transaction failed, otherwise, false.

  - `returnValue`: _string_ - Bytes returned from transaction execution (without a `0x` prefix).

  - `structLogs`: _array_ - Array of structured log objects.

    <Fields>

    - `pc`: _integer_ - Current program counter.

    - `op`: _string_ - Current opcode.

    - `gas`: _integer_ - Gas remaining.

    - `gasCost`: _integer_ - Cost in wei of each gas unit.

    - `depth`: _integer_ - Execution depth.

    - `exceptionalHaltReasons`: _array_ - One or more strings representing an error condition causing the EVM execution to terminate, such as running out of gas or attempting to execute an unknown instruction.

    - `stack`: _array of 32 byte arrays_ - EVM execution stack before executing current operation.

    - `memory`: _array of 32 byte arrays_ - Memory space of the contract before executing current operation.

    - `storage`: _object_ - Storage entries changed by the current transaction.

    - `returnData`: _data_ - EVM return data produced by the current opcode, as a hex string.

    </Fields>

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_traceTransaction",
    "params": [
      "0x2cc6c94c21685b7e0f8ddabf277a5ccf98db157c62619cde8baea696a74ed18e",
      {
        "disableStorage": true,
        "enableReturnData": true
      }
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_traceTransaction",
  "params": [
    "0x2cc6c94c21685b7e0f8ddabf277a5ccf98db157c62619cde8baea696a74ed18e",
    {
      "disableStorage": true,
      "enableReturnData": true
    }
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
  "result": {
    "gas": 21000,
    "failed": false,
    "returnValue": "",
    "structLogs": [
      {
        "pc": 100,
        "op": "STATICCALL",
        "gas": 78000,
        "gasCost": 500,
        "depth": 1,
        "stack": [],
        "returnData": "0x0000000000000000000000000000000000000000000000000000000000000001"
      }
    ]
  }
}
```

</TabItem>

</Tabs>

---

## `debug_traceBlock`

Returns full trace of all invoked opcodes of all transactions included in the block.

### Parameters

- `block`: _string_ - RLP of the block.

- `options`: _object_ - (Optional) Request options object (all fields optional).

  <Fields>

  - `disableStorage`: _boolean_ - `true` disables storage capture. The default is `false`.

  - `enableMemory`: _boolean_ - `true` enables memory capture. The default is `false`.
    If specified, `enableMemory` takes precedence over `disableMemory`.

  - `disableMemory`: _boolean_ - `true` disables memory capture. The default is `true`.

  - `disableStack` : _boolean_ - `true` disables stack capture. The default is `false`.

  - `opcodes`: _array_ of _strings_ - List of opcode names to trace; if omitted or empty, all opcodes are traced.

  - `enableReturnData`: _boolean_ - `true` enables return data capture. The default is `false`.

  </Fields>

### Returns

- Trace object.

  <Fields>

  - `gas`: _integer_ - Gas used by the transaction.

  - `failed`: _boolean_ - True if transaction failed, otherwise, false.

  - `returnValue`: _string_ - Bytes returned from transaction execution (without a `0x` prefix).

  - `structLogs`: _array_ - Array of structured log objects.

    <Fields>

    - `pc`: _integer_ - Current program counter.

    - `op`: _string_ - Current opcode.

    - `gas`: _integer_ - Gas remaining.

    - `gasCost`: _integer_ - Cost in wei of each gas unit.

    - `depth`: _integer_ - Execution depth.

    - `exceptionalHaltReasons`: _array_ - One or more strings representing an error condition causing the EVM execution to terminate, such as running out of gas or attempting to execute an unknown instruction.

    - `stack`: _array of 32 byte arrays_ - EVM execution stack before executing current operation.

    - `memory`: _array of 32 byte arrays_ - Memory space of the contract before executing current operation.

    - `storage`: _object_ - Storage entries changed by the current transaction.

    - `returnData`: _data_ - EVM return data produced by the current opcode, as a hex string.

    </Fields>

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_traceBlock",
    "params": [
      "0xf90277f90208a05a41d0e66b4120775176c09fcf39e7c0520517a13d2b57b18d33d342df038bfca01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934794e6a7a1d47ff21b6321162aea7c6cb457d5476bcaa00e0df2706b0a4fb8bd08c9246d472abbe850af446405d9eba1db41db18b4a169a04513310fcb9f6f616972a3b948dc5d547f280849a87ebb5af0191f98b87be598a0fe2bf2a941abf41d72637e5b91750332a30283efd40c424dc522b77e6f0ed8c4b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000860153886c1bbd82b44382520b8252088455c426598b657468706f6f6c2e6f7267a0b48c515a9dde8d346c3337ea520aa995a4738bb595495506125449c1149d6cf488ba4f8ecd18aab215f869f86780862d79883d2000825208945df9b87991262f6ba471f09758cde1c0fc1de734827a69801ca088ff6cf0fefd94db46111149ae4bfc179e9b94721fffd821d38d16464b3f71d0a045e0aff800961cfce805daef7016b9b675c137a6a41a548f7b60a3484c06a33ac0"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_traceBlock",
  "params": [
    "0xf90277f90208a05a41d0e66b4120775176c09fcf39e7c0520517a13d2b57b18d33d342df038bfca01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934794e6a7a1d47ff21b6321162aea7c6cb457d5476bcaa00e0df2706b0a4fb8bd08c9246d472abbe850af446405d9eba1db41db18b4a169a04513310fcb9f6f616972a3b948dc5d547f280849a87ebb5af0191f98b87be598a0fe2bf2a941abf41d72637e5b91750332a30283efd40c424dc522b77e6f0ed8c4b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000860153886c1bbd82b44382520b8252088455c426598b657468706f6f6c2e6f7267a0b48c515a9dde8d346c3337ea520aa995a4738bb595495506125449c1149d6cf488ba4f8ecd18aab215f869f86780862d79883d2000825208945df9b87991262f6ba471f09758cde1c0fc1de734827a69801ca088ff6cf0fefd94db46111149ae4bfc179e9b94721fffd821d38d16464b3f71d0a045e0aff800961cfce805daef7016b9b675c137a6a41a548f7b60a3484c06a33ac0"
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
  "result": {
    "gas": 21000,
    "failed": false,
    "returnValue": "",
    "structLogs": [
      {
        "pc": 0,
        "op": "STOP",
        "gas": 0,
        "gasCost": 0,
        "depth": 1,
        "stack": []
      }
    ]
  }
}
```

</TabItem>

</Tabs>

---

## `debug_traceBlockByHash`

Returns full trace of all invoked opcodes of all transactions included in the block.

### Parameters

- `blockHash`: _string_ - Block hash.

- `options`: _object_ - (Optional) Request options object (all fields optional).

  <Fields>

  - `disableStorage`: _boolean_ - `true` disables storage capture. The default is `false`.

  - `enableMemory`: _boolean_ - `true` enables memory capture. The default is `false`.
    If specified, `enableMemory` takes precedence over `disableMemory`.

  - `disableMemory`: _boolean_ - `true` disables memory capture. The default is `true`.

  - `disableStack` : _boolean_ - `true` disables stack capture. The default is `false`.

  - `opcodes`: _array_ of _strings_ - List of opcode names to trace; if omitted or empty, all opcodes are traced.

  - `enableReturnData`: _boolean_ - `true` enables return data capture. The default is `false`.

  </Fields>

### Returns

- List of trace objects.

  <Fields>

  - `gas`: _integer_ - Gas used by the transaction.

  - `failed`: _boolean_ - True if transaction failed, otherwise, false.

  - `returnValue`: _string_ - Bytes returned from transaction execution (without a `0x` prefix).

  - `structLogs`: _array_ - Array of structured log objects.

    <Fields>

    - `pc`: _integer_ - Current program counter.

    - `op`: _string_ - Current opcode.

    - `gas`: _integer_ - Gas remaining.

    - `gasCost`: _integer_ - Cost in wei of each gas unit.

    - `depth`: _integer_ - Execution depth.

    - `exceptionalHaltReasons`: _array_ - One or more strings representing an error condition causing the EVM execution to terminate, such as running out of gas or attempting to execute an unknown instruction.

    - `stack`: _array of 32 byte arrays_ - EVM execution stack before executing current operation.

    - `memory`: _array of 32 byte arrays_ - Memory space of the contract before executing current operation.

    - `storage`: _object_ - Storage entries changed by the current transaction.

    - `returnData`: _data_ - EVM return data produced by the current opcode, as a hex string.

    </Fields>

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_traceBlockByHash",
    "params": [
      "0xaceb3b2c9b25b0589230873921eb894b28722011b8df63977145517d754875a5"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_traceBlockByHash",
  "params": [
    "0xaceb3b2c9b25b0589230873921eb894b28722011b8df63977145517d754875a5"
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
      "gas": 21000,
      "failed": false,
      "returnValue": "",
      "structLogs": [
        {
          "pc": 0,
          "op": "STOP",
          "gas": 0,
          "gasCost": 0,
          "depth": 1,
          "stack": []
        }
      ]
    }
  ]
}
```

</TabItem>

</Tabs>

---

## `debug_traceBlockByNumber`

Returns full trace of all invoked opcodes of all transactions included in the block.

### Parameters

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of the
  string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

- `options`: _object_ - (Optional) Request options object (all fields optional).

  <Fields>

  - `disableStorage`: _boolean_ - `true` disables storage capture. The default is `false`.

  - `enableMemory`: _boolean_ - `true` enables memory capture. The default is `false`.
    If specified, `enableMemory` takes precedence over `disableMemory`.

  - `disableMemory`: _boolean_ - `true` disables memory capture. The default is `true`.

  - `disableStack` : _boolean_ - `true` disables stack capture. The default is `false`.

  - `opcodes`: _array_ of _strings_ - List of opcode names to trace; if omitted or empty, all opcodes are traced.

  - `enableReturnData`: _boolean_ - `true` enables return data capture. The default is `false`.

  </Fields>

### Returns

- List of trace objects.

  <Fields>

  - `gas`: _integer_ - Gas used by the transaction.

  - `failed`: _boolean_ - True if transaction failed, otherwise, false.

  - `returnValue`: _string_ - Bytes returned from transaction execution (without a `0x` prefix).

  - `structLogs`: _array_ - Array of structured log objects.

    <Fields>

    - `pc`: _integer_ - Current program counter.

    - `op`: _string_ - Current opcode.

    - `gas`: _integer_ - Gas remaining.

    - `gasCost`: _integer_ - Cost in wei of each gas unit.

    - `depth`: _integer_ - Execution depth.

    - `exceptionalHaltReasons`: _array_ - One or more strings representing an error condition causing the EVM execution to terminate, such as running out of gas or attempting to execute an unknown instruction.

    - `stack`: _array of 32 byte arrays_ - EVM execution stack before executing current operation.

    - `memory`: _array of 32 byte arrays_ - Memory space of the contract before executing current operation.

    - `storage`: _object_ - Storage entries changed by the current transaction.

    - `returnData`: _data_ - EVM return data produced by the current opcode, as a hex string.

    </Fields>

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_traceBlockByNumber",
    "params": [
      "0x7224",
      {
        "disableStorage": true
      }
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_traceBlockByNumber",
  "params": [
    "0x7224",
    {
      "disableStorage": true
    }
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
      "gas": 21000,
      "failed": false,
      "returnValue": "",
      "structLogs": [
        {
          "pc": 0,
          "op": "STOP",
          "gas": 0,
          "gasCost": 0,
          "depth": 1,
          "stack": []
        }
      ]
    }
  ]
}
```
</TabItem>

</Tabs>

---

## `debug_traceCall`

Performs an [`eth_call`](../eth/execute.md#eth_call) within the execution environment of a given block, using the final state of its parent block as the base, and provides a detailed trace of the executed opcodes.

Each `options` entry specifies a state that will be temporarily overridden before executing the call. 
This allows you to test, analyze, and debug smart contracts more efficiently by allowing
temporary state changes without affecting the actual blockchain state.

### Parameters

- `call`: _object_ - Transaction call object.

  <Fields>

  - `from`: _data, 20 bytes_ - Address of the sender.

  - `to`: _data, 20 bytes_ - Address of the action receiver.

  - `gas`: _quantity, integer_ - Gas provided by the sender. `eth_call` consumes zero gas, but other executions might need this parameter. `eth_estimateGas` ignores this value.

  - `gasPrice`: _quantity, integer_ - Gas price, in Wei, provided by the sender. The default is `0`. Used only in non-[`EIP1559`](../../../concepts/transactions/types.md#eip1559-transactions) transactions.

  - `maxPriorityFeePerGas`: _quantity, integer_ - Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Can be used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions). If used, must specify `maxFeePerGas`.

  - `maxFeePerGas`: _quantity, integer_ - Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Can be used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions). If used, must specify `maxPriorityFeePerGas`.

  - `maxFeePerBlobGas`: _quantity, integer_ - Maximum fee the sender is willing to pay per blob gas. Only used for blob transactions introduced in [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844).

  - `nonce`: _quantity, integer_ - Number of transactions made by the sender before this one. The default is the sender's nonce.

  - `value`: _quantity, integer_ - Value transferred, in Wei.

  - `data`: _data_ - Hash of the method signature and encoded parameters. For details, see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html). Must be equal to `input` if both parameters are provided.

  - `input`: _data_ - Hash of the method signature and encoded parameters. For details, see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html). Must be equal to `data` if both parameters are provided.

  - `accessList`: _array_ - List of addresses and storage keys that the transaction plans to access. Used only in non-[`FRONTIER`](../../../concepts/transactions/types.md#frontier-transactions) transactions.

  - `strict`: _tag_ - Determines if the sender account balance is considered during gas estimation. If `true`, the sender's balance is checked against the transaction's gas parameters. This ensures the estimated gas reflects what the sender can actually afford. If `false`, the balance checks are skipped. The default is `true`.

  - `blobVersionedHashes`: _array_ - List of references to blobs introduced in [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844).

  </Fields>

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of the
  string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

- `options`: _object_ - (Optional) Request options object (all fields optional).

  <Fields>

  - `disableStorage`: _boolean_ - `true` disables storage capture.
    The default is `false`.

  - `enableMemory`: _boolean_ - `true` enables memory capture.
    The default is `false`.
    If specified, `enableMemory` takes precedence over `disableMemory`.

  - `disableMemory`: _boolean_ - `true` disables memory capture.
    The default is `true`.

  - `disableStack` : _boolean_ - `true` disables stack capture.
    The default is `false`.

  - `opcodes`: _array_ of _strings_ - List of opcode names to trace; if omitted or empty, all opcodes are traced.

  - `enableReturnData`: _boolean_ - `true` enables return data capture. The default is `false`.

  - `stateOverrides`: _object_ - Address-to-state mapping.

    <Fields>

    - `balance`: _quantity_ - Temporary account balance for the call execution.

    - `nonce`: _quantity_ - Temporary nonce value for the call execution.

    - `code`: _binary_ - Bytecode to inject into the account.

    - `movePrecompileToAddress`: _data, 20 bytes_ - Address to which the precompile address should be moved.

    - `state`: _quantity_ - `key:value` pairs to override all slots in the account storage. You cannot set both the `state` and `stateDiff` options simultaneously.

    - `stateDiff`: _quantity_ - `key:value` pairs to override individual slots in the account storage. You cannot set both the `state` and `stateDiff` options simultaneously.

    </Fields>

  </Fields>

### Returns

- List of trace objects.

  <Fields>

  - `gas`: _integer_ - Gas used by the transaction.

  - `failed`: _boolean_ - True if transaction failed, otherwise, false.

  - `returnValue`: _string_ - Bytes returned from transaction execution (without a `0x` prefix).

  - `structLogs`: _array_ - Array of structured log objects.

    <Fields>

    - `pc`: _integer_ - Current program counter.

    - `op`: _string_ - Current opcode.

    - `gas`: _integer_ - Gas remaining.

    - `gasCost`: _integer_ - Cost in wei of each gas unit.

    - `depth`: _integer_ - Execution depth.

    - `exceptionalHaltReasons`: _array_ - One or more strings representing an error condition causing the EVM execution to terminate, such as running out of gas or attempting to execute an unknown instruction.

    - `stack`: _array of 32 byte arrays_ - EVM execution stack before executing current operation.

    - `memory`: _array of 32 byte arrays_ - Memory space of the contract before executing current operation.

    - `storage`: _object_ - Storage entries changed by the current transaction.

    - `returnData`: _data_ - EVM return data produced by the current opcode, as a hex string.

    </Fields>

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_traceCall",
    "params": [
      {
        "from": "",
        "to": "",
        "gas": "0xfffff2",
        "gasPrice": "0xef",
        "value": "0x0",
        "data": ""
      },
      "latest",
      {
        "disableMemory": true,
        "disableStack": true,
        "disableStorage": true
      }
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_traceCall",
  "params": [{"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73","0x0050000000000000000000000000000000000000", "0xfffff2","0xef","0x0","0x0000000000000000000000000030000000000000000000000000000000000000f000000000000000000000000000000000000000000000000000000000000001"},"latest",{"disableMemory":true,"disableStack":true,"disableStorage":true}],
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
      "gas": 21000,
      "failed": false,
      "returnValue": "",
      "structLogs": [
        {
          "pc": 0,
          "op": "STOP",
          "gas": 0,
          "gasCost": 0,
          "depth": 1
        }
      ]
    }
  ]
}
```

</TabItem>

</Tabs>
