---
title: Trace methods
description: Besu DEBUG JSON-RPC API trace methods reference
sidebar_label: Trace
sidebar_position: 1
toc_max_heading_level: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

These methods trace transactions, blocks, and calls to inspect low-level execution.

## `debug_standardTraceBlockToFile`

Generates files containing the block trace. A separate file is generated for each transaction in the block.

You can also specify a trace file for a specific transaction in a block.

Use [`debug_standardTraceBadBlockToFile`](#debug_standardtracebadblocktofile) to view the trace for an invalid block.

<h3>Parameters</h3>

- `blockHash`: _string_ - Block hash.

- `options`: _object_ - (Optional) Request options object (all fields optional).

  <Fields>

  - `txHash`: _string_ - Transaction hash; if omitted, a trace file is generated for each transaction in the block.

  - `disableMemory`: _boolean_ - `true` disables memory capture.
    The default is `false`.

  - `disableStack`: _boolean_ - `true` disables stack capture.
    The default is `false`.

  - `disableStorage`: _boolean_ - `true` disables storage capture.
    The default is `true`.

  - `opcodes`: _array_ of _strings_ - List of opcode names to trace; if omitted or empty, all opcodes are traced.

  - `enableReturnData`: _boolean_ - `true` enables return data capture.
    The default is `true`.

  </Fields>

<h3>Returns</h3>

- Location of the generated trace files.

<h3>Example</h3>

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

<h3>Parameters</h3>

- `blockHash`: _string_ - Block hash.

- `options`: _object_ - (Optional) Request options object (all fields optional).

  <Fields>

  - `txHash`: _string_ - Transaction hash; if omitted, a trace file is generated for each transaction in the block.

  - `disableMemory`: _boolean_ - `true` disables memory capture.
    The default is `false`.

  - `disableStack`: _boolean_ - `true` disables stack capture.
    The default is `false`.

  - `disableStorage`: _boolean_ - `true` disables storage capture.
    The default is `true`.

  - `opcodes`: _array_ of _strings_ - List of opcode names to trace; if omitted or empty, all opcodes are traced.

  - `enableReturnData`: _boolean_ - `true` enables return data capture.
    The default is `true`.

  </Fields>

<h3>Returns</h3>

- Location of the generated trace files.

<h3>Example</h3>

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

<h3>Parameters</h3>

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

  - `limit`: _integer_ - Maximum number of opcode steps to capture.
    The default is `0`, which sets no caller limit.
    When `limit` and [`--rpc-max-trace-steps`](../../options.md#rpc-max-trace-steps) are both greater than 
    `0`, Besu uses the lower value.

  - `tracer`: _string_ - [Tracer](#tracers) to use instead of the default opcode tracer:
    `callTracer`, `flatCallTracer`, `prestateTracer`, or `4byteTracer`.
    The preceding options apply only to the default opcode tracer.

  - `tracerConfig`: _object_ - Options for the specified `tracer`.
    See [Tracers](#tracers) for the options that each tracer supports.

  </Fields>

<h3>Returns</h3>

- Trace object.
  If you specify a `tracer`, Besu returns the [result of that tracer](#tracers) instead of the
  following opcode tracer fields.

  <Fields>

  - `gas`: _integer_ - Gas used by the transaction.

  - `failed`: _boolean_ - True if transaction failed, otherwise, false.

  - `returnValue`: _string_ - Bytes returned from transaction execution, as a hex
    string with a `0x` prefix.
    Empty output is `"0x"`.

  - `structLogs`: _array_ - Array of structured log objects.
    Empty when the executed code is empty (for example, a plain value transfer
    between two externally owned accounts (EOAs)).

    <Fields>

    - `pc`: _integer_ - Current program counter.

    - `op`: _string_ - Current opcode.

    - `gas`: _integer_ - Gas remaining.

    - `gasCost`: _integer_ - Gas consumed by the current opcode, in gas units.

    - `depth`: _integer_ - Execution depth.

    - `error`: _string_ - A string representing an error condition causing the EVM execution to terminate, such as running out of gas or attempting to execute an unknown instruction.

    - `stack`: _array of strings_ - EVM stack before the current opcode, as
      `0x`-prefixed compact hex strings (leading zeros stripped).

    - `memory`: _array of strings_ - Contract memory after the current opcode
      runs, as `0x`-prefixed 32-byte hex strings.

    - `storage`: _object_ - Storage entries changed by the current transaction.

    - `returnData`: _data_ - EVM return data produced by the current opcode, as a hex string.

    </Fields>

  - `truncated`: _boolean_ - `true` when opcode tracing stopped because it reached `limit` or
    [`--rpc-max-trace-steps`](../../options.md#rpc-max-trace-steps).
    Omitted when the trace is complete.

  </Fields>

<h3>Example</h3>

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
    "returnValue": "0x",
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

<h3>Parameters</h3>

- `block`: _string_ - RLP of the block.

- `options`: _object_ - (Optional) Request options object (all fields optional).

  <Fields>

  - `disableStorage`: _boolean_ - `true` disables storage capture. The default is `false`.

  - `enableMemory`: _boolean_ - `true` enables memory capture. The default is `false`.
    If specified, `enableMemory` takes precedence over `disableMemory`.

  - `disableMemory`: _boolean_ - `true` disables memory capture. The default is `true`.

  - `disableStack` : _boolean_ - `true` disables stack capture. The default is `false`.

  - `opcodes`: _array_ of _strings_ - List of opcode names to trace; if omitted or empty, all opcodes are traced.

  - `enableReturnData`: _boolean_ - `true` enables return data capture.
    The default is `false`.
    Streamed block traces do not include a per-opcode `returnData` field.

  - `limit`: _integer_ - Maximum number of opcode steps to capture
    for each transaction.
    The default is `0`, which sets no caller limit.
    When `limit` and [`--rpc-max-trace-steps`](../../options.md#rpc-max-trace-steps) are both greater than
    `0`, Besu uses the lower value.

  - `tracer`: _string_ - [Tracer](#tracers) to use instead of the default opcode tracer:
    `callTracer`, `flatCallTracer`, `prestateTracer`, or `4byteTracer`.
    The preceding options apply only to the default opcode tracer.

  - `tracerConfig`: _object_ - Options for the specified `tracer`.
    See [Tracers](#tracers) for the options that each tracer supports.

  </Fields>

<h3>Returns</h3>

- Array of transaction trace objects.

  <Fields>

  - `txHash`: _data, 32 bytes_ - Hash of the traced transaction.

  - `result`: _object_ - Opcode tracer result for that transaction.
    If you specify a `tracer`, `result` is the [result of that tracer](#tracers) instead of the
    following opcode tracer fields.

    <Fields>

    - `gas`: _integer_ - Gas used by the transaction.

    - `failed`: _boolean_ - True if transaction failed, otherwise, false.

    - `returnValue`: _string_ - Bytes returned from transaction execution, as a
      hex string with a `0x` prefix.
      Empty output is `"0x"`.

    - `structLogs`: _array_ - Array of structured log objects.
      Empty when the executed code is empty (for example, a plain value
      transfer between two externally owned accounts (EOAs)).

      <Fields>

      - `pc`: _integer_ - Current program counter.

      - `op`: _string_ - Current opcode.

      - `gas`: _integer_ - Gas remaining.

      - `gasCost`: _integer_ - Gas consumed by the current opcode, in gas units.

      - `depth`: _integer_ - Execution depth.

      - `error`: _string_ - A string representing an error condition causing the EVM execution to terminate, such as running out of gas or attempting to execute an unknown instruction.

      - `stack`: _array of strings_ - EVM stack before the current opcode, as
        `0x`-prefixed compact hex strings (leading zeros stripped).

      - `memory`: _array of strings_ - Contract memory after the current opcode
        runs, as `0x`-prefixed 32-byte hex strings.

      - `storage`: _object_ - Storage entries changed by the current transaction.

      </Fields>

    </Fields>

  </Fields>

<h3>Example</h3>

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
  "result": [
    {
      "txHash": "0x4ff04c4aec9517721179c8dd435f47fbbfc2ed26cd4926845ab687420d5580a6",
      "result": {
        "gas": 21000,
        "failed": false,
        "returnValue": "0x",
        "structLogs": []
      }
    }
  ]
}
```

</TabItem>

</Tabs>

---

## `debug_traceBlockByHash`

Returns full trace of all invoked opcodes of all transactions included in the block.

<h3>Parameters</h3>

- `blockHash`: _string_ - Block hash.

  :::note
  The genesis block is not traceable.
  :::

- `options`: _object_ - (Optional) Request options object (all fields optional).

  <Fields>

  - `disableStorage`: _boolean_ - `true` disables storage capture. The default is `false`.

  - `enableMemory`: _boolean_ - `true` enables memory capture. The default is `false`.
    If specified, `enableMemory` takes precedence over `disableMemory`.

  - `disableMemory`: _boolean_ - `true` disables memory capture. The default is `true`.

  - `disableStack` : _boolean_ - `true` disables stack capture. The default is `false`.

  - `opcodes`: _array_ of _strings_ - List of opcode names to trace; if omitted or empty, all opcodes are traced.

  - `enableReturnData`: _boolean_ - `true` enables return data capture.
    The default is `false`.
    Streamed block traces do not include a per-opcode `returnData` field.

  - `limit`: _integer_ - Maximum number of opcode steps to capture
    for each transaction.
    The default is `0`, which sets no caller limit.
    When `limit` and [`--rpc-max-trace-steps`](../../options.md#rpc-max-trace-steps) are both greater than
    `0`, Besu uses the lower value.

  - `tracer`: _string_ - [Tracer](#tracers) to use instead of the default opcode tracer:
    `callTracer`, `flatCallTracer`, `prestateTracer`, or `4byteTracer`.
    The preceding options apply only to the default opcode tracer.

  - `tracerConfig`: _object_ - Options for the specified `tracer`.
    See [Tracers](#tracers) for the options that each tracer supports.

  </Fields>

<h3>Returns</h3>

- Array of transaction trace objects.

  <Fields>

  - `txHash`: _data, 32 bytes_ - Hash of the traced transaction.

  - `result`: _object_ - Opcode tracer result for that transaction.
    If you specify a `tracer`, `result` is the [result of that tracer](#tracers) instead of the
    following opcode tracer fields.

    <Fields>

    - `gas`: _integer_ - Gas used by the transaction.

    - `failed`: _boolean_ - True if transaction failed, otherwise, false.

    - `returnValue`: _string_ - Bytes returned from transaction execution, as a
      hex string with a `0x` prefix.
      Empty output is `"0x"`.

    - `structLogs`: _array_ - Array of structured log objects.
      Empty when the executed code is empty (for example, a plain value
      transfer between two externally owned accounts (EOAs)).

      <Fields>

      - `pc`: _integer_ - Current program counter.

      - `op`: _string_ - Current opcode.

      - `gas`: _integer_ - Gas remaining.

      - `gasCost`: _integer_ - Gas consumed by the current opcode, in gas units.

      - `depth`: _integer_ - Execution depth.

      - `error`: _string_ - A string representing an error condition causing the EVM execution to terminate, such as running out of gas or attempting to execute an unknown instruction.

      - `stack`: _array of strings_ - EVM stack before the current opcode, as
        `0x`-prefixed compact hex strings (leading zeros stripped).

      - `memory`: _array of strings_ - Contract memory after the current opcode
        runs, as `0x`-prefixed 32-byte hex strings.

      - `storage`: _object_ - Storage entries changed by the current transaction.

      </Fields>

    </Fields>

  </Fields>

<h3>Example</h3>

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
      "txHash": "0x4ff04c4aec9517721179c8dd435f47fbbfc2ed26cd4926845ab687420d5580a6",
      "result": {
        "gas": 21000,
        "failed": false,
        "returnValue": "0x",
        "structLogs": []
      }
    }
  ]
}
```

</TabItem>

</Tabs>

---

## `debug_traceBlockByNumber`

Returns full trace of all invoked opcodes of all transactions included in the block.

<h3>Parameters</h3>

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of the
  string tags `latest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  - `pending` returns the same value as `latest`.
  - The genesis block (`0x0` or `earliest`) is not traceable.
  :::

- `options`: _object_ - (Optional) Request options object (all fields optional).

  <Fields>

  - `disableStorage`: _boolean_ - `true` disables storage capture. The default is `false`.

  - `enableMemory`: _boolean_ - `true` enables memory capture. The default is `false`.
    If specified, `enableMemory` takes precedence over `disableMemory`.

  - `disableMemory`: _boolean_ - `true` disables memory capture. The default is `true`.

  - `disableStack` : _boolean_ - `true` disables stack capture. The default is `false`.

  - `opcodes`: _array_ of _strings_ - List of opcode names to trace; if omitted or empty, all opcodes are traced.

  - `enableReturnData`: _boolean_ - `true` enables return data capture.
    The default is `false`.
    Streamed block traces do not include a per-opcode `returnData` field.

  - `limit`: _integer_ - Maximum number of opcode steps to capture
    for each transaction.
    The default is `0`, which sets no caller limit.
    When `limit` and [`--rpc-max-trace-steps`](../../options.md#rpc-max-trace-steps) are both greater than
    `0`, Besu uses the lower value.

  - `tracer`: _string_ - [Tracer](#tracers) to use instead of the default opcode tracer:
    `callTracer`, `flatCallTracer`, `prestateTracer`, or `4byteTracer`.
    The preceding options apply only to the default opcode tracer.

  - `tracerConfig`: _object_ - Options for the specified `tracer`.
    See [Tracers](#tracers) for the options that each tracer supports.

  </Fields>

<h3>Returns</h3>

- Array of transaction trace objects.

  <Fields>

  - `txHash`: _data, 32 bytes_ - Hash of the traced transaction.

  - `result`: _object_ - Opcode tracer result for that transaction.
    If you specify a `tracer`, `result` is the [result of that tracer](#tracers) instead of the
    following opcode tracer fields.

    <Fields>

    - `gas`: _integer_ - Gas used by the transaction.

    - `failed`: _boolean_ - True if transaction failed, otherwise, false.

    - `returnValue`: _string_ - Bytes returned from transaction execution, as a
      hex string with a `0x` prefix.
      Empty output is `"0x"`.

    - `structLogs`: _array_ - Array of structured log objects.
      Empty when the executed code is empty (for example, a plain value
      transfer between two externally owned accounts (EOAs)).

      <Fields>

      - `pc`: _integer_ - Current program counter.

      - `op`: _string_ - Current opcode.

      - `gas`: _integer_ - Gas remaining.

      - `gasCost`: _integer_ - Gas consumed by the current opcode, in gas units.

      - `depth`: _integer_ - Execution depth.

      - `error`: _string_ - A string representing an error condition causing the EVM execution to terminate, such as running out of gas or attempting to execute an unknown instruction.

      - `stack`: _array of strings_ - EVM stack before the current opcode, as
        `0x`-prefixed compact hex strings (leading zeros stripped).

      - `memory`: _array of strings_ - Contract memory after the current opcode
        runs, as `0x`-prefixed 32-byte hex strings.

      - `storage`: _object_ - Storage entries changed by the current transaction.

      </Fields>

    </Fields>

  </Fields>

<h3>Example</h3>

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
      "txHash": "0x4ff04c4aec9517721179c8dd435f47fbbfc2ed26cd4926845ab687420d5580a6",
      "result": {
        "gas": 21000,
        "failed": false,
        "returnValue": "0x",
        "structLogs": []
      }
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

<h3>Parameters</h3>

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

- `blockNumber` or `blockHash`: _string_ - Hexadecimal integer representing a block number,
  block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as
  described in [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).
  An unknown block hash returns a JSON-RPC error (`-32000`, `Block not found`).

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

  - `limit`: _integer_ - Maximum number of opcode steps to capture.
    The default is `0`, which sets no caller limit.
    When `limit` and [`--rpc-max-trace-steps`](../../options.md#rpc-max-trace-steps) are both greater than
    `0`, Besu uses the lower value.

  - `tracer`: _string_ - [Tracer](#tracers) to use instead of the default opcode tracer:
    `callTracer`, `flatCallTracer`, `prestateTracer`, or `4byteTracer`.
    The preceding options apply only to the default opcode tracer.

  - `tracerConfig`: _object_ - Options for the specified `tracer`.
    See [Tracers](#tracers) for the options that each tracer supports.

  - `stateOverrides`: _object_ - Address-to-state mapping.

    <Fields>

    - `balance`: _quantity_ - Temporary account balance for the call execution.

    - `nonce`: _quantity_ - Temporary nonce value for the call execution.

    - `code`: _binary_ - Bytecode to inject into the account.

    - `movePrecompileToAddress`: _data, 20 bytes_ - Address to which the precompile address should be moved.

    - `state`: _object_ - Map of storage slot to value that replaces all slots
      in the account storage.
      You cannot set both the `state` and `stateDiff` options simultaneously.

    - `stateDiff`: _object_ - Map of storage slot to value that overrides
      individual slots in the account storage.
      You cannot set both the `state` and `stateDiff` options simultaneously.

    </Fields>

  </Fields>

<h3>Returns</h3>

- Trace object.
  If you specify a `tracer`, Besu returns the [result of that tracer](#tracers) instead of the
  following opcode tracer fields.

  <Fields>

  - `gas`: _integer_ - Gas used by the transaction.

  - `failed`: _boolean_ - True if transaction failed, otherwise, false.

  - `returnValue`: _string_ - Bytes returned from transaction execution, as a hex
    string with a `0x` prefix.
    Empty output is `"0x"`.

  - `structLogs`: _array_ - Array of structured log objects.
    Empty when the executed code is empty (for example, a plain value transfer
    between two externally owned accounts (EOAs)).

    <Fields>

    - `pc`: _integer_ - Current program counter.

    - `op`: _string_ - Current opcode.

    - `gas`: _integer_ - Gas remaining.

    - `gasCost`: _integer_ - Gas consumed by the current opcode, in gas units.

    - `depth`: _integer_ - Execution depth.

    - `error`: _string_ - A string representing an error condition causing the EVM execution to terminate, such as running out of gas or attempting to execute an unknown instruction.

    - `stack`: _array of strings_ - EVM stack before the current opcode, as
      `0x`-prefixed compact hex strings (leading zeros stripped).

    - `memory`: _array of strings_ - Contract memory after the current opcode
      runs, as `0x`-prefixed 32-byte hex strings.

    - `storage`: _object_ - Storage entries changed by the current transaction.

    - `returnData`: _data_ - EVM return data produced by the current opcode, as a hex string.

    </Fields>

  - `truncated`: _boolean_ - `true` when opcode tracing stopped because it
    reached `limit` or
    [`--rpc-max-trace-steps`](../../options.md#rpc-max-trace-steps).
    Omitted when the trace is complete.

  </Fields>

<h3>Example</h3>

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
  "result": {
    "gas": 21000,
    "failed": false,
    "returnValue": "0x",
    "structLogs": []
  }
}
```

</TabItem>

</Tabs>

---

## Tracers

[`debug_traceTransaction`](#debug_tracetransaction), [`debug_traceBlock`](#debug_traceblock),
[`debug_traceBlockByHash`](#debug_traceblockbyhash),
[`debug_traceBlockByNumber`](#debug_traceblockbynumber), and [`debug_traceCall`](#debug_tracecall)
accept a `tracer` option that selects the tracer Besu runs and the format of the result.
If you don't specify a `tracer`, Besu uses the default opcode tracer, which returns the
`structLogs` result described in each method.

Besu supports the following tracers:

| Tracer | Result |
| --- | --- |
| [`callTracer`](#calltracer) | The calls that a transaction makes, as a nested tree of call frames. |
| [`flatCallTracer`](#flatcalltracer) | The calls that a transaction makes, as a flat list of call frames. |
| [`prestateTracer`](#prestatetracer) | The state of the accounts that a transaction accesses, or the state that it changes. |
| [`4byteTracer`](#4bytetracer) | The function selectors that a transaction calls, and how many times it calls each one. |

The following applies to all tracers:

- Tracer names are case-sensitive.
  If you specify a value that isn't a supported tracer name, Besu returns a JSON-RPC error
  (`-32602`, `Invalid transaction trace params`).
- Specify the options for a tracer in `tracerConfig`.
  Each option is a boolean, and the default is `false`.
- The options for the default opcode tracer, such as `disableStorage`, `opcodes`, and `limit`,
  have no effect.
- `debug_traceTransaction` and `debug_traceCall` return the tracer result directly.
  `debug_traceBlock`, `debug_traceBlockByHash`, and `debug_traceBlockByNumber` return an array
  with one object for each transaction in the block, where `txHash` is the transaction hash and
  `result` is the tracer result.

### `callTracer`

Returns the top-level call of a transaction and the calls that it makes, as a nested tree of call
frames.

Specify the following options in `tracerConfig`:

<Fields>

- `onlyTopCall`: _boolean_ - `true` traces only the top-level call and omits nested calls.
  The default is `false`.

- `withLog`: _boolean_ - `true` includes the logs that each call emits.
  The default is `false`.

</Fields>

The result is the call frame of the top-level call.
Each call frame is an object with the following fields.
Fields that don't apply to a call frame are omitted.

<Fields>

- `from`: _data, 20 bytes_ - Address of the caller.
  For a `SELFDESTRUCT` call frame, the contract that self-destructed.

- `gas`: _quantity_ - Gas provided for the call.

- `gasUsed`: _quantity_ - Gas used by the call.

- `to`: _data, 20 bytes_ - Address of the call target or the created contract.
  For a `SELFDESTRUCT` call frame, the recipient of the self-destructed balance.
  Omitted when a contract creation fails.

- `input`: _data_ - Call data.
  For a contract creation, the contract initialization bytecode.

- `output`: _data_ - Return data.
  For a contract creation, the deployed contract code.
  For a reverted call, the revert data.
  Omitted when empty.

- `error`: _string_ - Reason the call failed, such as `execution reverted`.
  Omitted when the call succeeds.

- `revertReason`: _string_ - Decoded revert reason.
  Present only when a reverted call returns revert data that Besu can decode.

- `calls`: _array_ - Call frames of the nested calls, in execution order.
  Omitted when the call makes no nested calls, or when `onlyTopCall` is `true`.

- `logs`: _array_ - Logs that the call emits.
  Present only when `withLog` is `true` and the call emits logs.
  Logs that a reverted call and its nested calls emit are omitted.

  <Fields>

  - `address`: _data, 20 bytes_ - Address of the contract that emitted the log.

  - `topics`: _array of data, 32 bytes each_ - Topics of the log.

  - `data`: _data_ - Data of the log.

  - `index`: _quantity_ - Index of the log within the block, equal to the `logIndex` value in the
    transaction receipt.
    For `debug_traceCall`, the index starts at `0x0`.

  - `position`: _quantity_ - Number of nested calls that the call had made when it emitted the log.

  </Fields>

- `value`: _quantity_ - Value transferred.
  Omitted for `STATICCALL` call frames.

- `type`: _string_ - Call type: `CALL`, `CALLCODE`, `DELEGATECALL`, `STATICCALL`, `CREATE`,
  `CREATE2`, or `SELFDESTRUCT`.

</Fields>

#### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_traceTransaction",
    "params": [
      "0xf4a589cd87fcf733fd893b7ef44913efbdead344ecbf4b3698508d9be4facd24",
      {
        "tracer": "callTracer",
        "tracerConfig": {
          "withLog": true
        }
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
    "0xf4a589cd87fcf733fd893b7ef44913efbdead344ecbf4b3698508d9be4facd24",
    {
      "tracer": "callTracer",
      "tracerConfig": {
        "withLog": true
      }
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
    "from": "0x627306090abab3a6e1400e9345bc60c78a8bef57",
    "gas": "0xfffff2",
    "gasUsed": "0x72b3",
    "to": "0xd54b47f8e6a1b97f3a84f63c867286272b273b7c",
    "input": "0x",
    "calls": [
      {
        "from": "0xd54b47f8e6a1b97f3a84f63c867286272b273b7c",
        "gas": "0xfba221",
        "gasUsed": "0x311",
        "to": "0xde5491f774f0cb009abcea7326342e105dbb1b2e",
        "input": "0x",
        "error": "execution reverted",
        "value": "0x0",
        "type": "CALL"
      },
      {
        "from": "0xd54b47f8e6a1b97f3a84f63c867286272b273b7c",
        "gas": "0xfb9507",
        "gasUsed": "0x30b",
        "to": "0xb9b7e0cb2edf5ea031c8b297a5a1fa20379b6a0a",
        "input": "0x",
        "logs": [
          {
            "address": "0xb9b7e0cb2edf5ea031c8b297a5a1fa20379b6a0a",
            "topics": [
              "0x00000000000000000000000000000000000000000000000000000000000000d1"
            ],
            "data": "0xbb",
            "index": "0x2",
            "position": "0x0"
          }
        ],
        "value": "0x0",
        "type": "CALL"
      }
    ],
    "logs": [
      {
        "address": "0xd54b47f8e6a1b97f3a84f63c867286272b273b7c",
        "topics": [
          "0x00000000000000000000000000000000000000000000000000000000000000e0"
        ],
        "data": "0x01",
        "index": "0x1",
        "position": "0x0"
      },
      {
        "address": "0xd54b47f8e6a1b97f3a84f63c867286272b273b7c",
        "topics": [
          "0x00000000000000000000000000000000000000000000000000000000000000e1"
        ],
        "data": "0x02",
        "index": "0x3",
        "position": "0x2"
      }
    ],
    "value": "0x0",
    "type": "CALL"
  }
}
```

</TabItem>

</Tabs>

### `flatCallTracer`

Returns the top-level call of a transaction and the calls that it makes, as a flat list of call
frames.
The list is in execution order, with each call frame followed by the call frames of its nested
calls.
The call frames use a layout similar to the [`trace`](../trace.md#trace) type of the `TRACE` API.

Specify the following options in `tracerConfig`:

<Fields>

- `includePrecompiles`: _boolean_ - `true` includes calls to precompiled contracts.
  By default, call frames for nested `CALL` and `STATICCALL` calls to precompiled contracts are
  omitted, and the `subtraces` value of the calling frame doesn't count them.
  The default is `false`.

- `convertParityErrors`: _boolean_ - `true` converts `error` values to the Parity error format.
  The default is `false`.

</Fields>

When `convertParityErrors` is `true`, Besu converts the following errors, and returns all other
errors unchanged:

| Error | Converted error |
| --- | --- |
| `execution reverted` | `Reverted` |
| Starts with `invalid opcode:` | `Bad instruction` |
| Starts with `out of gas:`, or `Code is too large` | `Out of gas` |
| Starts with `stack underflow` | `Stack underflow` |
| `Precompile error`, `precompile failed`, or starts with `invalid input length` | `Built-in failed` |

The result is an array of call frames.
Each call frame is an object with the following fields.

<Fields>

- `action`: _object_ - Details of the traced operation.
  Fields present depend on `type`.

  <Fields>

  - `callType`: _string_ - CALL-family variant: `call`, `callcode`, `delegatecall`, or
    `staticcall`.
    Present on `call` frames.

  - `from`: _data, 20 bytes_ - Address of the caller or creator.
    Present on `call` and `create` frames.

  - `gas`: _quantity_ - Gas provided for this operation.
    Present on `call` and `create` frames.

  - `input`: _data_ - Call data.
    Present on `call` frames.

  - `to`: _data, 20 bytes_ - Call target.
    Present on `call` frames.

  - `value`: _quantity_ - Value transferred.
    Present on `call` and `create` frames.

  - `init`: _data_ - Contract initialization bytecode.
    Present on `create` frames.

  - `creationMethod`: _string_ - Creation opcode (`create` or `create2`).
    Present on `create` frames.

  - `address`: _data, 20 bytes_ - Contract that self-destructed.
    Present on `suicide` frames.

  - `balance`: _quantity_ - Balance transferred on self-destruct.
    Present on `suicide` frames.

  - `refundAddress`: _data, 20 bytes_ - Recipient of the self-destructed balance.
    Present on `suicide` frames.

  </Fields>

- `blockHash`: _data, 32 bytes_ - Hash of the block containing the transaction.
  `null` for `debug_traceCall`.

- `blockNumber`: _integer_ - Number of the block containing the transaction.
  `0` for `debug_traceCall`.

- `error`: _string_ - Reason the operation failed, such as `execution reverted`.
  Omitted when the operation succeeds.

- `result`: _object_ - Execution result for `call` and `create` frames.
  Omitted for `suicide` frames, and when the operation fails with an `error` other than
  `execution reverted`.

  <Fields>

  - `gasUsed`: _quantity_ - Gas used by this operation.

  - `output`: _data_ - Return data of the call.
    Present on `call` frames.

  - `address`: _data, 20 bytes_ - Address of the created contract.
    Present on `create` frames.
    Omitted when the contract creation fails.

  - `code`: _data_ - Deployed contract code.
    Present on `create` frames.

  </Fields>

- `subtraces`: _integer_ - Number of nested calls that this call frame makes directly.

- `traceAddress`: _array_ - Path of this call frame in the call tree, as a list of indexes.
  Empty for the top-level call.

- `transactionHash`: _data, 32 bytes_ - Hash of the transaction.
  `null` for `debug_traceCall`.

- `transactionPosition`: _integer_ - Index of the transaction in the block.
  `0` for `debug_traceCall`.

- `type`: _string_ - Frame type: `call`, `create`, or `suicide` (self-destruct).

</Fields>

#### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_traceTransaction",
    "params": [
      "0x268bf9dcea258cf402c5b71e32b5c0ac26a7a0df09d8c9df5eff14977c98a975",
      {
        "tracer": "flatCallTracer"
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
    "0x268bf9dcea258cf402c5b71e32b5c0ac26a7a0df09d8c9df5eff14977c98a975",
    {
      "tracer": "flatCallTracer"
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
      "action": {
        "callType": "call",
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "gas": "0xfffff2",
        "input": "0x0000000000000000000000000030000000000000000000000000000000000000f000000000000000000000000000000000000000000000000000000000000001",
        "to": "0x0040000000000000000000000000000000000000",
        "value": "0x0"
      },
      "blockHash": "0x2e7ab6ee418961c74eac4a765eb9004cc56595565e05db89bc12602f61b822fc",
      "blockNumber": 8,
      "result": {
        "gasUsed": "0x5da2",
        "output": "0xf000000000000000000000000000000000000000000000000000000000000002"
      },
      "subtraces": 1,
      "traceAddress": [],
      "transactionHash": "0x268bf9dcea258cf402c5b71e32b5c0ac26a7a0df09d8c9df5eff14977c98a975",
      "transactionPosition": 0,
      "type": "call"
    },
    {
      "action": {
        "callType": "call",
        "from": "0x0040000000000000000000000000000000000000",
        "gas": "0xfba3e8",
        "input": "0xf000000000000000000000000000000000000000000000000000000000000001",
        "to": "0x0030000000000000000000000000000000000000",
        "value": "0x0"
      },
      "blockHash": "0x2e7ab6ee418961c74eac4a765eb9004cc56595565e05db89bc12602f61b822fc",
      "blockNumber": 8,
      "result": {
        "gasUsed": "0x1b",
        "output": "0xf000000000000000000000000000000000000000000000000000000000000002"
      },
      "subtraces": 0,
      "traceAddress": [0],
      "transactionHash": "0x268bf9dcea258cf402c5b71e32b5c0ac26a7a0df09d8c9df5eff14977c98a975",
      "transactionPosition": 0,
      "type": "call"
    }
  ]
}
```

</TabItem>

</Tabs>

### `prestateTracer`

Returns the state of the accounts that a transaction accesses, as it was before the transaction
ran.
The result includes the sender, the recipient or created contract, the fee recipient of the block,
and each account whose balance, code, or storage the transaction accesses.
For a transaction with an [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) authorization list,
the result also includes the authorizing accounts and the accounts they delegate to.

Specify the following options in `tracerConfig`:

<Fields>

- `diffMode`: _boolean_ - `true` returns the account state that the transaction changes, before
  and after the transaction, instead of the state of every accessed account.
  The default is `false`.

- `disableCode`: _boolean_ - `true` omits the `code` field.
  The default is `false`.

- `disableStorage`: _boolean_ - `true` omits the `storage` field.
  The default is `false`.

- `includeEmpty`: _boolean_ - `true` includes empty accounts, which have a zero balance, a zero
  nonce, and no code.
  You can't set both `includeEmpty` and `diffMode` to `true`.
  If you do, Besu returns a JSON-RPC error (`-32602`, `Invalid transaction trace params`).
  The default is `false`.

</Fields>

By default, the result is an object that maps each account address to an account state object
with the following fields.

<Fields>

- `balance`: _quantity_ - Balance of the account.

- `code`: _data_ - Code of the account.
  Omitted when the account has no code, or when `disableCode` is `true`.

- `codeHash`: _data, 32 bytes_ - Hash of the account code.
  Omitted when the account has no code.

- `nonce`: _integer_ - Nonce of the account.
  Omitted when the nonce is `0`.

- `storage`: _object_ - Map of each storage slot that the transaction reads or writes to the value
  of the slot before the transaction.
  Omitted when the transaction accesses no storage slots of the account, or when `disableStorage`
  is `true`.

</Fields>

When `diffMode` is `true`, the result is an object with the following fields.
Each field maps account addresses to account state objects.
Accounts that the transaction doesn't change are omitted from both fields.

<Fields>

- `post`: _object_ - State of each changed account after the transaction.
  Each account state object contains only the fields that the transaction changes, and can be
  empty.
  `storage` contains only the changed slots that have a non-zero value after the transaction.
  Accounts that the transaction self-destructs are omitted.

- `pre`: _object_ - State of each changed account before the transaction.
  `storage` contains only the changed slots that had a non-zero value before the transaction.
  Accounts that the transaction creates are omitted.

</Fields>

:::note
When `diffMode` is `true`, `post` can contain an account with only a `codeHash` of 32 zero bytes.
This entry represents an account that had no code before the transaction, and that is empty or
doesn't exist after it.
An example is the recipient of a zero-value self-destruct.
This matches the result that Geth returns.
:::

#### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_traceTransaction",
    "params": [
      "0xaa23559b17344fc753f6b7bb74d38a4d804292b1ac8503cbbf68d7402a5a6fb0",
      {
        "tracer": "prestateTracer"
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
    "0xaa23559b17344fc753f6b7bb74d38a4d804292b1ac8503cbbf68d7402a5a6fb0",
    {
      "tracer": "prestateTracer"
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
    "0x0010000000000000000000000000000000000000": {
      "balance": "0x0",
      "code": "0x6020356000355560603560403555",
      "codeHash": "0x6df1b93e5dde9915499fe86eb1f82cb512c4c5d48f6d25e23be3e2d43fe1a0a9",
      "storage": {
        "0x0000000000000000000000000000000000000000000000000000000000000001": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000002": "0x0000000000000000000000000000000000000000000000000000000000000004"
      }
    },
    "0x71562b71999873db5b286df957af199ec94617f7": {
      "balance": "0x2c65920"
    },
    "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73": {
      "balance": "0xfffffffffffffffffffffffffffffffffff101877",
      "nonce": 1
    }
  }
}
```

</TabItem>

</Tabs>

When you set `diffMode` to `true` in `tracerConfig`, the same request returns the following
result:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "post": {
      "0x0010000000000000000000000000000000000000": {},
      "0x71562b71999873db5b286df957af199ec94617f7": {
        "balance": "0x31dba08"
      },
      "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73": {
        "balance": "0xffffffffffffffffffffffffffffffffffeb8b78f",
        "nonce": 2
      }
    },
    "pre": {
      "0x0010000000000000000000000000000000000000": {
        "balance": "0x0",
        "code": "0x6020356000355560603560403555",
        "codeHash": "0x6df1b93e5dde9915499fe86eb1f82cb512c4c5d48f6d25e23be3e2d43fe1a0a9",
        "storage": {
          "0x0000000000000000000000000000000000000000000000000000000000000002": "0x0000000000000000000000000000000000000000000000000000000000000004"
        }
      },
      "0x71562b71999873db5b286df957af199ec94617f7": {
        "balance": "0x2c65920"
      },
      "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73": {
        "balance": "0xfffffffffffffffffffffffffffffffffff101877",
        "nonce": 1
      }
    }
  }
}
```

### `4byteTracer`

Returns the function selectors that a transaction calls, and how many times it calls each one.
A function selector is the first four bytes of the call data.
The tracer counts the top-level call and nested calls.
It doesn't count contract creations, calls to precompiled contracts, or calls with fewer than four
bytes of call data.

This tracer has no `tracerConfig` options.

The result is an object that maps each key to the number of calls that match it.
Each key is in the format `<selector>-<size>`, where `<selector>` is the function selector and
`<size>` is the size of the call data in bytes, excluding the selector.
The result is an empty object if the transaction makes no matching calls.

#### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_traceTransaction",
    "params": [
      "0x268bf9dcea258cf402c5b71e32b5c0ac26a7a0df09d8c9df5eff14977c98a975",
      {
        "tracer": "4byteTracer"
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
    "0x268bf9dcea258cf402c5b71e32b5c0ac26a7a0df09d8c9df5eff14977c98a975",
    {
      "tracer": "4byteTracer"
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
    "0x00000000-60": 1,
    "0xf0000000-28": 1
  }
}
```

</TabItem>

</Tabs>
