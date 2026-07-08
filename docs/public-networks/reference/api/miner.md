---
title: MINER methods
description: Besu MINER JSON-RPC API methods reference
sidebar_label: MINER
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `MINER` methods

The `MINER` API methods allow you to control settings related to block creation. 

:::note

The `MINER` API is not enabled by default for JSON-RPC.
Enable it using the [`--rpc-http-api`](../cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../cli/options.md#rpc-ws-api) option.

:::

## `miner_changeTargetGasLimit`

Updates the target gas limit set using the [`--target-gas-limit`](../cli/options.md#target-gas-limit) command line option.

### Parameters

- `gasPrice`: _number_ - Target gas price in wei.

### Returns

- `Success` or `error`.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "miner_changeTargetGasLimit",
    "params": [
      800000
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "miner_changeTargetGasLimit",
  "params": [
    800000
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
  "result": "Success"
}
```

</TabItem>

</Tabs>

---

## `miner_getExtraData`

Retrieves the current extra data field that is used when producing blocks.

### Parameters

- None

### Returns

- Hexadecimal string representation of the extra data bytes.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "miner_getExtraData",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "miner_getExtraData",
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
  "result": "0x68656c6c6f20776f726c64"
}
```

</TabItem>

</Tabs>

---

## `miner_getMinGasPrice`

Gets the minimum gas price (in wei) offered by a transaction to be included in a block.
The initial value is set using the [`--min-gas-price`](../cli/options.md#min-gas-price) command line
option, or is set to `1000` if the command line option is not specified.
Use [`miner_setMinGasPrice`](#miner_setmingasprice) to change the current value of the gas price.

### Parameters

- None

### Returns

- Minimum gas price (in wei) as a hexadecimal string.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "miner_getMinGasPrice",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "miner_getMinGasPrice",
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
  "result": "0x3e8"
}
```
</TabItem>

</Tabs>

---

## `miner_getMinPriorityFee`

Gets the minimum priority fee per gas (in wei) offered by a transaction to be included in a block. The initial value is set using the [`--min-priority-fee`](../cli/options.md#min-priority-fee) command line option, or is set to `0` if the command line option is not specified.
Use [`miner_setMinPriorityFee`](#miner_setminpriorityfee) to change the current value of the fee.

### Parameters

- None

### Returns

- Minimum priority fee per gas (in wei) as a hexadecimal string.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "miner_getMinPriorityFee",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "miner_getMinPriorityFee",
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
  "result": "0x1"
}
```
</TabItem>

</Tabs>

---

## `miner_setExtraData`

Sets a new value for the extra data field that is used when producing blocks.

### Parameters

- `extraData`: _string_ - Hexadecimal representation of the extra data field, with a maximum of 32 bytes.

### Returns

- `true` or `false`.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "miner_setExtraData",
    "params": [
      "0x0010203"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "miner_setExtraData",
  "params": [
    "0x0010203"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "params": ["0x0010203"],
  "id": 1,
  "result": "true"
}
```

</TabItem>

</Tabs>

---

## `miner_setMinGasPrice`

Sets the minimum gas price (in wei) offered by a transaction to be included in a block.
The initial value is set using the [`--min-gas-price`](../cli/options.md#min-gas-price) command line
option, or is set to `1000` if the command line option is not specified.
Use [`miner_getMinGasPrice`](#miner_getmingasprice) to get the current value of the gas price.

### Parameters

- `minGasPrice`: _string_ - Minimum gas price in hexadecimal.

### Returns

- `true` when the gas price is set.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "miner_setMinGasPrice",
    "params": [
      "0x5dc"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "miner_setMinGasPrice",
  "params": [
    "0x5dc"
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

## `miner_setMinPriorityFee`

Sets the minimum priority fee per gas (in wei) offered by a transaction to be included in a block. 
The initial value is set using the [`--min-priority-fee`](../cli/options.md#min-priority-fee) command line option, or is set to `0` if the command line option is not specified.
Use [`miner_getMinPriorityFee`](#miner_getminpriorityfee) to get the current value of the fee.

### Parameters

- `minPriorityFeePerGas`: _string_ - Minimum priority fee per gas in hexadecimal.

### Returns

- `true` when the fee is set.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "miner_setMinPriorityFee",
    "params": [
      "0x0a"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "miner_setMinPriorityFee",
  "params": [
    "0x0a"
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
