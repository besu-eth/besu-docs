---
title: TXPOOL methods
description: Besu TXPOOL JSON-RPC API methods reference
sidebar_label: TXPOOL
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `TXPOOL` methods

The `TXPOOL` API methods allow you to inspect the contents of the transaction pool.

:::note

The `TXPOOL` API is not enabled by default for JSON-RPC.
Enable it using the [`--rpc-http-api`](../cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../cli/options.md#rpc-ws-api) option.

:::

## `txpool_besuPendingTransactions`

Lists pending transactions that match the supplied filter conditions.

### Parameters

- `numResults`: _number_ - Integer representing the maximum number of results to return.

- `fields`: _object_ - Object of fields used to create the filter condition.

  <Fields>

  Each field in the object corresponds to a field name containing an operator, and a value for the operator.
  A field name can only be specified once, and can only contain one operator.
  For example, you cannot query transactions with a gas price between 8 and 9 Gwei by using both the `gt` and `lt` operator in the same field name instance.

  All filters must be satisfied for a transaction to be returned.

  :::note
 
  The available operators are `eq` (equal to), `lt` (less than), `gt` (greater than), and `action`.
  The only supported `action` is `"contract_creation"`.

  :::

  - `from`: _data, 20 bytes_ - Address of the sender. Supported operator: `eq`.

  - `to`: _data, 20 bytes_ - Address of the receiver, or `"contract_creation"`.
    Supported operators: `eq`, `action`.

  - `gas`: _quantity_ - Gas provided by the sender.
    Supported operators: `eq`, `gt`, `lt`.

  - `gasPrice`: _quantity_ - Gas price, in wei, provided by the sender.
    Supported operators: `eq`, `gt`, `lt`.

  - `value`: _quantity_ - Value transferred, in wei.
    Supported operators: `eq`, `gt`, `lt`.

  - `nonce`: _quantity_ - Number of transactions made by the sender.
    Supported operators: `eq`, `gt`, `lt`.

  </Fields>

### Returns

- List of objects with details of the pending transaction.

  <Fields>

  - `accessList`: _array_ - (Optional) List of addresses and storage keys the transaction plans to access. Used in [`ACCESS_LIST` transactions](../../concepts/transactions/types.md#access_list-transactions) and may be used in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

  - `from`: _data, 20 bytes_ - Address of the sender.

  - `gas`: _quantity_ - Gas provided by the sender.

  - `gasPrice`: _quantity_ - (Optional) Gas price, in wei, provided by the sender. Not used only in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

  - `maxPriorityFeePerGas`: _quantity, integer_ - (Optional) Maximum fee, in wei, the sender is willing to pay per gas above the base fee. Used only in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

  - `maxFeePerGas`: _quantity, integer_ - (Optional) Maximum total fee (base fee + priority fee), in wei, the sender is willing to pay per gas. Used only in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

  - `hash`: _data, 32 bytes_ - Hash of the transaction.

  - `input`: _data_ - Data sent with the transaction to create or invoke a contract.

  - `nonce`: _quantity_ - Number of transactions made by the sender before this one.

  - `to`: _data, 20 bytes_ - Address of the receiver. `null` if a contract creation transaction.

  - `transactionType`: _string_ - [Transaction type](../../concepts/transactions/types.md).

  - `value`: _quantity_ - Value transferred, in wei.

  - `v`: _quantity_ - ECDSA Recovery ID.

  - `r`: _data, 32 bytes_ - ECDSA signature r.

  - `s`: _data, 32 bytes_ - ECDSA signature s.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "txpool_besuPendingTransactions",
    "params": [
      2,
      {
        "from": {
          "eq": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
        },
        "gas": {
          "lt": "0x5209"
        },
        "nonce": {
          "gt": "0x1"
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
  "method": "txpool_besuPendingTransactions",
  "params": [
    2,
    {
      "from": {
        "eq": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
      },
      "gas": {
        "lt": "0x5209"
      },
      "nonce": {
        "gt": "0x1"
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
  "result": [
    {
      "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
      "gas": "0x5208",
      "gasPrice": "0xab5d04c00",
      "hash": "0xb7b2f4306c1c228ec94043da73b582594007091a7dfe024b1f8d6d772284e54b",
      "input": "0x",
      "nonce": "0x2",
      "to": "0xf8be4ebda7f62d79a665294ec1263bfdb59aabf2",
      "value": "0x0",
      "v": "0xfe8",
      "r": "0x5beb711e652c6cf0a589d3cea904eefc4f45ce4372652288701d08cc4412086d",
      "s": "0x3af14a56e63aa5fb7dcb444a89708363a9d2c1eba1f777c67690288415080ded"
    }
  ]
}
```

</TabItem>
</Tabs>

---

## `txpool_besuStatistics`

Lists statistics about the node transaction pool.

### Parameters

- None

### Returns

- Transaction pool statistics object.

  <Fields>

  - `maxSize`: _number_ - Maximum number of transactions kept in the transaction pool; use the [`--tx-pool-max-size`](../cli/options.md#tx-pool-max-size) option to configure the maximum size.

  - `localCount`: _number_ - Number of transactions submitted directly to this node.

  - `remoteCount`: _number_ - Number of transactions received from remote nodes.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "txpool_besuStatistics",
    "params": [],
    "id": 1
  }'
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "txpool_besuStatistics",
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
    "maxSize": 4096,
    "localCount": 1,
    "remoteCount": 0
  }
}
```

</TabItem>
</Tabs>

---

## `txpool_besuTransactions`

Lists transactions in the node transaction pool.

### Parameters

- None

### Returns

- List of transactions.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "txpool_besuTransactions",
    "params": [],
    "id": 1
  }'
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "txpool_besuTransactions",
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
  "result": [
    {
      "hash": "0x8a66830098be4006a3f63a03b6e9b67aa721e04bd6b46d420b8f1937689fb4f1",
      "isReceivedFromLocalSource": true,
      "addedToPoolAt": "2019-03-21T01:35:50.911Z"
    },
    {
      "hash": "0x41ee803c3987ceb5bcea0fad7a76a8106a2a6dd654409007d9931032ea54579b",
      "isReceivedFromLocalSource": true,
      "addedToPoolAt": "2019-03-21T01:36:00.374Z"
    }
  ]
}
```

</TabItem>
</Tabs>

---

## `txpool_content`

Returns all pending and queued transactions in the pool, grouped by
sender address and sorted by nonce.

### Parameters

- None

### Returns

- Transaction pool content object.

  <Fields>

  - `pending`: _object_ - Map of sender addresses to maps of nonces to transaction objects,
    for transactions pending inclusion in the next block.

    <Fields>

    - `accessList`: _array_ - (Optional) List of addresses and storage keys the transaction plans to access. Used in [`ACCESS_LIST` transactions](../../concepts/transactions/types.md#access_list-transactions) and may be used in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

    - `blockHash`: _data, 32 bytes_ - Hash of the block containing this transaction. `null` when transaction is pending.

    - `blockNumber`: _quantity_ - Block number of the block containing this transaction. `null` when transaction is pending.

    - `blockTimestamp`: _quantity_ - Hex-encoded Unix timestamp (in seconds) of the block containing this transaction. `null` when transaction is pending.

    - `chainId`: _quantity_ - [Chain ID](../../concepts/network-and-chain-id.md).

    - `from`: _data, 20 bytes_ - Address of the sender.

    - `gas`: _quantity_ - Gas provided by the sender.

    - `gasPrice`: _quantity_ - (Optional) Gas price, in Wei, provided by the sender. Used only in non-[`EIP1559`](../../concepts/transactions/types.md#eip1559-transactions) transactions.

    - `maxPriorityFeePerGas`: _quantity, integer_ - (Optional) Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Used only in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

    - `maxFeePerGas`: _quantity, integer_ - (Optional) Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Used only in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

    - `hash`: _data, 32 bytes_ - Hash of the transaction.

    - `input`: _data_ - Data sent with the transaction to create or invoke a contract.

    - `nonce`: _quantity_ - Number of transactions made by the sender before this one.

    - `to`: _data, 20 bytes_ - Address of the receiver. `null` if a contract creation transaction.

    - `transactionIndex`: _quantity, integer_ - Index position of the transaction in the block. `null` when transaction is pending.

    - `transactionType`: _string_ - [Transaction type](../../concepts/transactions/types.md).

    - `value`: _quantity_ - Value transferred, in Wei.

    - `v`: _quantity_ - ECDSA Recovery ID.

    - `r`: _data, 32 bytes_ - ECDSA signature r.

    - `s`: _data, 32 bytes_ - ECDSA signature s.

    </Fields>

  - `queued`: _object_ - Map of sender addresses to maps of nonces to transaction objects,
    for transactions scheduled for future execution.

    <Fields>

    - `accessList`: _array_ - (Optional) List of addresses and storage keys the transaction plans to access. Used in [`ACCESS_LIST` transactions](../../concepts/transactions/types.md#access_list-transactions) and may be used in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

    - `blockHash`: _data, 32 bytes_ - Hash of the block containing this transaction. `null` when transaction is pending.

    - `blockNumber`: _quantity_ - Block number of the block containing this transaction. `null` when transaction is pending.

    - `blockTimestamp`: _quantity_ - Hex-encoded Unix timestamp (in seconds) of the block containing this transaction. `null` when transaction is pending.

    - `chainId`: _quantity_ - [Chain ID](../../concepts/network-and-chain-id.md).

    - `from`: _data, 20 bytes_ - Address of the sender.

    - `gas`: _quantity_ - Gas provided by the sender.

    - `gasPrice`: _quantity_ - (Optional) Gas price, in Wei, provided by the sender. Used only in non-[`EIP1559`](../../concepts/transactions/types.md#eip1559-transactions) transactions.

    - `maxPriorityFeePerGas`: _quantity, integer_ - (Optional) Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Used only in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

    - `maxFeePerGas`: _quantity, integer_ - (Optional) Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Used only in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

    - `hash`: _data, 32 bytes_ - Hash of the transaction.

    - `input`: _data_ - Data sent with the transaction to create or invoke a contract.

    - `nonce`: _quantity_ - Number of transactions made by the sender before this one.

    - `to`: _data, 20 bytes_ - Address of the receiver. `null` if a contract creation transaction.

    - `transactionIndex`: _quantity, integer_ - Index position of the transaction in the block. `null` when transaction is pending.

    - `transactionType`: _string_ - [Transaction type](../../concepts/transactions/types.md).

    - `value`: _quantity_ - Value transferred, in Wei.

    - `v`: _quantity_ - ECDSA Recovery ID.

    - `r`: _data, 32 bytes_ - ECDSA signature r.

    - `s`: _data, 32 bytes_ - ECDSA signature s.

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
    "method": "txpool_content",
    "params": [],
    "id": 1
  }'
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "txpool_content",
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
    "pending": {
      "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73": {
        "6": {
          "blockHash": null,
          "blockNumber": null,
          "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
          "gas": "0x5208",
          "gasPrice": "0xab5d04c00",
          "hash": "0xb7b2f4306c1c228ec94043da73b582594007091a7dfe024b1f8d6d772284e54b",
          "input": "0x",
          "nonce": "0x6",
          "to": "0xf8be4ebda7f62d79a665294ec1263bfdb59aabf2",
          "transactionIndex": null,
          "value": "0xde0b6b3a7640000",
          "v": "0xfe8",
          "r": "0x5beb711e652c6cf0a589d3cea904eefc4f45ce4372652288701d08cc4412086d",
          "s": "0x3af14a56e63aa5fb7dcb444a89708363a9d2c1eba1f777c67690288415080ded"
        }
      }
    },
    "queued": {
      "0x1932c48b2bf8102ba33b4a6b545c32236e342f34": {
        "12": {
          "blockHash": null,
          "blockNumber": null,
          "from": "0x1932c48b2bf8102ba33b4a6b545c32236e342f34",
          "gas": "0x15f90",
          "gasPrice": "0x2cb417800",
          "hash": "0x7b959f5d8d906b74f646b9e6c43d808c3a13f72ae39ee2ca5531f6a83e38e0cf",
          "input": "0x",
          "nonce": "0xc",
          "to": "0x27f1e53f9861ab84aa62a2c8b9f5f0617edddfeb",
          "transactionIndex": null,
          "value": "0x0",
          "v": "0xfe7",
          "r": "0x78c32e3f5bba7cf08b2700c3ca37a2c80d2f073ff9b47f54e31d64e05e0a5b3d",
          "s": "0x517a04dbc67f9de1f76d5e3d3a1b0fda61869b8fad04bef40f07e24e10cbfdee"
        }
      }
    }
  }
}
```

</TabItem>
</Tabs>

---

## `txpool_contentFrom`

Returns the pending and queued transactions for a given sender address.

### Parameters

- `address`: _string_ - Sender address.

### Returns

- Transaction pool content for the given address.

  <Fields>

  - `pending`: _object_ - Map of nonces to transaction objects, for pending transactions from the given address.

    <Fields>

    - `accessList`: _array_ - (Optional) List of addresses and storage keys the transaction plans to access. Used in [`ACCESS_LIST` transactions](../../concepts/transactions/types.md#access_list-transactions) and may be used in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

    - `blockHash`: _data, 32 bytes_ - Hash of the block containing this transaction. `null` when transaction is pending.

    - `blockNumber`: _quantity_ - Block number of the block containing this transaction. `null` when transaction is pending.

    - `blockTimestamp`: _quantity_ - Hex-encoded Unix timestamp (in seconds) of the block containing this transaction. `null` when transaction is pending.

    - `chainId`: _quantity_ - [Chain ID](../../concepts/network-and-chain-id.md).

    - `from`: _data, 20 bytes_ - Address of the sender.

    - `gas`: _quantity_ - Gas provided by the sender.

    - `gasPrice`: _quantity_ - (Optional) Gas price, in Wei, provided by the sender. Used only in non-[`EIP1559`](../../concepts/transactions/types.md#eip1559-transactions) transactions.

    - `maxPriorityFeePerGas`: _quantity, integer_ - (Optional) Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Used only in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

    - `maxFeePerGas`: _quantity, integer_ - (Optional) Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Used only in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

    - `hash`: _data, 32 bytes_ - Hash of the transaction.

    - `input`: _data_ - Data sent with the transaction to create or invoke a contract.

    - `nonce`: _quantity_ - Number of transactions made by the sender before this one.

    - `to`: _data, 20 bytes_ - Address of the receiver. `null` if a contract creation transaction.

    - `transactionIndex`: _quantity, integer_ - Index position of the transaction in the block. `null` when transaction is pending.

    - `transactionType`: _string_ - [Transaction type](../../concepts/transactions/types.md).

    - `value`: _quantity_ - Value transferred, in Wei.

    - `v`: _quantity_ - ECDSA Recovery ID.

    - `r`: _data, 32 bytes_ - ECDSA signature r.

    - `s`: _data, 32 bytes_ - ECDSA signature s.

    </Fields>

  - `queued`: _object_ - Map of nonces to transaction objects for queued transactions from the given address.

    <Fields>

    - `accessList`: _array_ - (Optional) List of addresses and storage keys the transaction plans to access. Used in [`ACCESS_LIST` transactions](../../concepts/transactions/types.md#access_list-transactions) and may be used in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

    - `blockHash`: _data, 32 bytes_ - Hash of the block containing this transaction. `null` when transaction is pending.

    - `blockNumber`: _quantity_ - Block number of the block containing this transaction. `null` when transaction is pending.

    - `blockTimestamp`: _quantity_ - Hex-encoded Unix timestamp (in seconds) of the block containing this transaction. `null` when transaction is pending.

    - `chainId`: _quantity_ - [Chain ID](../../concepts/network-and-chain-id.md).

    - `from`: _data, 20 bytes_ - Address of the sender.

    - `gas`: _quantity_ - Gas provided by the sender.

    - `gasPrice`: _quantity_ - (Optional) Gas price, in Wei, provided by the sender. Used only in non-[`EIP1559`](../../concepts/transactions/types.md#eip1559-transactions) transactions.

    - `maxPriorityFeePerGas`: _quantity, integer_ - (Optional) Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Used only in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

    - `maxFeePerGas`: _quantity, integer_ - (Optional) Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Used only in [`EIP1559` transactions](../../concepts/transactions/types.md#eip1559-transactions).

    - `hash`: _data, 32 bytes_ - Hash of the transaction.

    - `input`: _data_ - Data sent with the transaction to create or invoke a contract.

    - `nonce`: _quantity_ - Number of transactions made by the sender before this one.

    - `to`: _data, 20 bytes_ - Address of the receiver. `null` if a contract creation transaction.

    - `transactionIndex`: _quantity, integer_ - Index position of the transaction in the block. `null` when transaction is pending.

    - `transactionType`: _string_ - [Transaction type](../../concepts/transactions/types.md).

    - `value`: _quantity_ - Value transferred, in Wei.

    - `v`: _quantity_ - ECDSA Recovery ID.

    - `r`: _data, 32 bytes_ - ECDSA signature r.

    - `s`: _data, 32 bytes_ - ECDSA signature s.

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
    "method": "txpool_contentFrom",
    "params": [
      "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
    ],
    "id": 1
  }'
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "txpool_contentFrom",
  "params": [
    "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
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
    "pending": {
      "0": {
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "gas": "0x5208",
        "gasPrice": "0xab5d04c00",
        "hash": "0xb7b2f4306c1c228ec94043da73b582594007091a7dfe024b1f8d6d772284e54b",
        "input": "0x",
        "nonce": "0x0",
        "to": "0xf8be4ebda7f62d79a665294ec1263bfdb59aabf2",
        "value": "0x0",
        "v": "0xfe8",
        "r": "0x5beb711e652c6cf0a589d3cea904eefc4f45ce4372652288701d08cc4412086d",
        "s": "0x3af14a56e63aa5fb7dcb444a89708363a9d2c1eba1f777c67690288415080ded"
      },
      "1": {
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "gas": "0x5208",
        "gasPrice": "0xab5d04c00",
        "hash": "0x1234abcd5678ef901234abcd5678ef901234abcd5678ef901234abcd5678ef90",
        "input": "0x",
        "nonce": "0x1",
        "to": "0xf8be4ebda7f62d79a665294ec1263bfdb59aabf2",
        "value": "0x0",
        "v": "0xfe8",
        "r": "0x1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "s": "0x2bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
      }
    },
    "queued": {
      "3": {
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "gas": "0x5208",
        "gasPrice": "0xab5d04c00",
        "hash": "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
        "input": "0x",
        "nonce": "0x3",
        "to": "0xf8be4ebda7f62d79a665294ec1263bfdb59aabf2",
        "value": "0x0",
        "v": "0xfe8",
        "r": "0x3ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
        "s": "0x4ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
      }
    }
  }
}
```

</TabItem>
</Tabs>

---

## `txpool_inspect`

Returns a textual summary of all pending and queued transactions in the pool, grouped by sender
address and sorted by nonce.

The summary is free form, implementation-dependent, and meant to be consumed by humans.
For programmatic access to the transaction pool, use [`txpool_content`](#txpool_content).

### Parameters

- None

### Returns

- Transaction pool inspect object.

  <Fields>

  - `pending`: _object_ - Map of sender addresses to maps of nonces to human-readable transaction
    summary strings, for transactions pending inclusion in the next block.

  - `queued`: _object_ - Map of sender addresses to maps of nonces to human-readable transaction
    summary strings, for transactions scheduled for future execution.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "txpool_inspect",
    "params": [],
    "id": 1
  }'
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "txpool_inspect",
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
    "pending": {
      "0x67ee9a8c19f7873125a875f61add461b4a505d8c": {
        "5": "{sequence: 68178, addedAt: 1775837774160, isLocal=false, hasPriority=false, score=127, 0xfbee0231c6140f9db3bbcef774b3626556f6f5528a6a49dcd38e1f7f86c79368={MessageCall, 5, 0x67ee9a8c19f7873125a875f61add461b4a505d8c, EIP1559, mf: 300.00 kwei, pf: 300.00 kwei, gl: 70926, v: 0 wei, to: 0xe9f8133e47d42bc9962e469721faaf75e385af31}}",
        "6": "{sequence: 68179, addedAt: 1775837774160, isLocal=false, hasPriority=false, score=127, 0x3474c0582722ed751dba809363f58c8d1acea415831b81bc0b0b9f29afb19c19={MessageCall, 6, 0x67ee9a8c19f7873125a875f61add461b4a505d8c, EIP1559, mf: 2.00 mwei, pf: 2.00 mwei, gl: 90617, v: 0 wei, to: 0x1eb4a2620b909a8838e0e24a8e912bd32f4a47a3}}"
      }
    },
    "queued": {
      "0x5fa84846743cc07ab16106ceabad8e4e0ec1c1b6": {
        "29": "{sequence: 2208499, addedAt: 1775952461706, isLocal=false, hasPriority=false, score=127, 0x2bb5f69f2b9737a99a3674018cd2aac5035b907a753a0c797051bc9df0b2a152={MessageCall, 29, 0x5fa84846743cc07ab16106ceabad8e4e0ec1c1b6, EIP1559, mf: 1.40 gwei, pf: 417.90 mwei, gl: 63209, v: 0 wei, to: 0xdac17f958d2ee523a2206206994597c13d831ec7}}",
        "31": "{sequence: 1766002, addedAt: 1775931135467, isLocal=false, hasPriority=false, score=127, 0xdd250f166c086412fae187ef52dfbe1c4ff9405818781ac50f89d67a77a2d432={MessageCall, 31, 0x5fa84846743cc07ab16106ceabad8e4e0ec1c1b6, EIP1559, mf: 47.74 gwei, pf: 9.28 gwei, gl: 21000, v: 0 wei, to: 0x5fa84846743cc07ab16106ceabad8e4e0ec1c1b6}}"
      }
    }
  }
}
```

</TabItem>
</Tabs>

---

## `txpool_status`

Returns the number of pending and queued transactions in the pool.

### Parameters

- None

### Returns

- Transaction count details.

  <Fields>

  - `pending`: _string_ - Count of the transactions currently pending for inclusion in the next
    block or blocks.

  - `queued`: _string_ - Count of the transactions that are scheduled for future execution
    (transactions with nonce gaps).

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "txpool_status",
    "params": [],
    "id": 1
  }'
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "txpool_status",
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
    "pending": "0xa",
    "queued": "0x7"
  }
}
```

</TabItem>
</Tabs>
