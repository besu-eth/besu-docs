---
title: Transaction methods
description: Besu ETH JSON-RPC API transaction methods reference
sidebar_label: Transaction
sidebar_position: 3
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

These methods retrieve transactions and transaction receipts.

## `eth_getTransactionByBlockHashAndIndex`

Returns transaction information for the specified block hash and transaction index position.

### Parameters

- `block`: _string_ - 32-byte hash of a block.

- `index`: _string_ - Integer representing the transaction index position.

### Returns

- Transaction object, or `null` when there is no transaction.

  <Fields>

  - `accessList`: _array_ - (Optional) List of addresses and storage keys the transaction plans to access. Used in [`ACCESS_LIST` transactions](../../../concepts/transactions/types.md#access_list-transactions) and may be used in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

  - `blockHash`: _data, 32 bytes_ - Hash of the block containing this transaction. `null` when transaction is pending.

  - `blockNumber`: _quantity_ - Block number of the block containing this transaction. `null` when transaction is pending.

  - `blockTimestamp`: _quantity_ - Hex-encoded Unix timestamp (in seconds) of the block containing this transaction. `null` when transaction is pending.

  - `chainId`: _quantity_ - [Chain ID](../../../concepts/network-and-chain-id.md).

  - `from`: _data, 20 bytes_ - Address of the sender.

  - `gas`: _quantity_ - Gas provided by the sender.

  - `gasPrice`: _quantity_ - (Optional) Gas price, in Wei, provided by the sender. Used only in non-[`EIP1559`](../../../concepts/transactions/types.md#eip1559-transactions) transactions.

  - `maxPriorityFeePerGas`: _quantity, integer_ - (Optional) Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

  - `maxFeePerGas`: _quantity, integer_ - (Optional) Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

  - `hash`: _data, 32 bytes_ - Hash of the transaction.

  - `input`: _data_ - Data sent with the transaction to create or invoke a contract.

  - `nonce`: _quantity_ - Number of transactions made by the sender before this one.

  - `to`: _data, 20 bytes_ - Address of the receiver. `null` if a contract creation transaction.

  - `transactionIndex`: _quantity, integer_ - Index position of the transaction in the block. `null` when transaction is pending.

  - `transactionType`: _string_ - [Transaction type](../../../concepts/transactions/types.md).

  - `value`: _quantity_ - Value transferred, in Wei.

  - `v`: _quantity_ - ECDSA Recovery ID.

  - `r`: _data, 32 bytes_ - ECDSA signature r.

  - `s`: _data, 32 bytes_ - ECDSA signature s.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getTransactionByBlockHashAndIndex",
    "params": [
      "0xbf137c3a7a1ebdfac21252765e5d7f40d115c2757e4a4abee929be88c624fdb7",
      "0x2"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionByBlockHashAndIndex",
  "params": [
    "0xbf137c3a7a1ebdfac21252765e5d7f40d115c2757e4a4abee929be88c624fdb7",
    "0x2"
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
    "blockHash": "0xbf137c3a7a1ebdfac21252765e5d7f40d115c2757e4a4abee929be88c624fdb7",
    "blockNumber": "0x1442e",
    "blockTimestamp": "0x561bc2e0",
    "chainId": 2018,
    "from": "0x70c9217d814985faef62b124420f8dfbddd96433",
    "gas": "0x3d090",
    "gasPrice": "0x57148a6be",
    "hash": "0xfc766a71c406950d4a4955a340a092626c35083c64c7be907060368a5e6811d6",
    "input": "0x51a34eb8000000000000000000000000000000000000000000000029b9e659e41b780000",
    "nonce": "0x2cb2",
    "to": "0xcfdc98ec7f01dab1b67b36373524ce0208dc3953",
    "transactionIndex": "0x2",
    "value": "0x0",
    "v": "0x2a",
    "r": "0xa2d2b1021e1428740a7c67af3c05fe3160481889b25b921108ac0ac2c3d5d40a",
    "s": "0x63186d2aaefe188748bfb4b46fb9493cbc2b53cf36169e8501a5bc0ed941b484"
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{ block(hash: \"0x9270651f9c6fa36232c379d0ecf69b519383aa275815a65f1e03114346668f69\") { transactionAt(index: 0) {block{hash}  hash } } }"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(hash: "0x9270651f9c6fa36232c379d0ecf69b519383aa275815a65f1e03114346668f69") {
    transactionAt(index: 0) {
      block {
        hash
      }
      hash
    }
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "transactionAt": {
        "block": {
          "hash": "0x9270651f9c6fa36232c379d0ecf69b519383aa275815a65f1e03114346668f69"
        },
        "hash": "0x5f5366af89e8777d5ae62a1af94a0876bdccbc22417bed0aff361eefa3e37f86"
      }
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getTransactionByBlockNumberAndIndex`

Returns transaction information for the specified block number and transaction index position.

### Parameters

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

- `index`: _string_ - Transaction index position.

### Returns

- Transaction object, or `null` when there is no transaction.

  <Fields>

  - `accessList`: _array_ - (Optional) List of addresses and storage keys the transaction plans to access. Used in [`ACCESS_LIST` transactions](../../../concepts/transactions/types.md#access_list-transactions) and may be used in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

  - `blockHash`: _data, 32 bytes_ - Hash of the block containing this transaction. `null` when transaction is pending.

  - `blockNumber`: _quantity_ - Block number of the block containing this transaction. `null` when transaction is pending.

  - `blockTimestamp`: _quantity_ - Hex-encoded Unix timestamp (in seconds) of the block containing this transaction. `null` when transaction is pending.

  - `chainId`: _quantity_ - [Chain ID](../../../concepts/network-and-chain-id.md).

  - `from`: _data, 20 bytes_ - Address of the sender.

  - `gas`: _quantity_ - Gas provided by the sender.

  - `gasPrice`: _quantity_ - (Optional) Gas price, in Wei, provided by the sender. Used only in non-[`EIP1559`](../../../concepts/transactions/types.md#eip1559-transactions) transactions.

  - `maxPriorityFeePerGas`: _quantity, integer_ - (Optional) Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

  - `maxFeePerGas`: _quantity, integer_ - (Optional) Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

  - `hash`: _data, 32 bytes_ - Hash of the transaction.

  - `input`: _data_ - Data sent with the transaction to create or invoke a contract.

  - `nonce`: _quantity_ - Number of transactions made by the sender before this one.

  - `to`: _data, 20 bytes_ - Address of the receiver. `null` if a contract creation transaction.

  - `transactionIndex`: _quantity, integer_ - Index position of the transaction in the block. `null` when transaction is pending.

  - `transactionType`: _string_ - [Transaction type](../../../concepts/transactions/types.md).

  - `value`: _quantity_ - Value transferred, in Wei.

  - `v`: _quantity_ - ECDSA Recovery ID.

  - `r`: _data, 32 bytes_ - ECDSA signature r.

  - `s`: _data, 32 bytes_ - ECDSA signature s.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getTransactionByBlockNumberAndIndex",
    "params": [
      "0x1442e",
      "0x2"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionByBlockNumberAndIndex",
  "params": [
    "0x1442e",
    "0x2"
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
    "blockHash": "0xbf137c3a7a1ebdfac21252765e5d7f40d115c2757e4a4abee929be88c624fdb7",
    "blockNumber": "0x1442e",
    "blockTimestamp": "0x561bc2e0",
    "chainId": 2018,
    "from": "0x70c9217d814985faef62b124420f8dfbddd96433",
    "gas": "0x3d090",
    "gasPrice": "0x57148a6be",
    "hash": "0xfc766a71c406950d4a4955a340a092626c35083c64c7be907060368a5e6811d6",
    "input": "0x51a34eb8000000000000000000000000000000000000000000000029b9e659e41b780000",
    "nonce": "0x2cb2",
    "to": "0xcfdc98ec7f01dab1b67b36373524ce0208dc3953",
    "transactionIndex": "0x2",
    "value": "0x0",
    "v": "0x2a",
    "r": "0xa2d2b1021e1428740a7c67af3c05fe3160481889b25b921108ac0ac2c3d5d40a",
    "s": "0x63186d2aaefe188748bfb4b46fb9493cbc2b53cf36169e8501a5bc0ed941b484"
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{block(number:20303) {transactionAt(index: 0) {block{hash} hash}}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(number: 20303) {
    transactionAt(index: 0) {
      block {
        hash
      }
      hash
    }
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "transactionAt": {
        "block": {
          "hash": "0x9270651f9c6fa36232c379d0ecf69b519383aa275815a65f1e03114346668f69"
        },
        "hash": "0x5f5366af89e8777d5ae62a1af94a0876bdccbc22417bed0aff361eefa3e37f86"
      }
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getTransactionByHash`

Returns transaction information for the specified transaction hash.

### Parameters

- `transaction`: _string_ - 32-byte transaction hash.

### Returns

- Transaction object, or `null` when there is no transaction.

  <Fields>

  - `accessList`: _array_ - (Optional) List of addresses and storage keys the transaction plans to access. Used in [`ACCESS_LIST` transactions](../../../concepts/transactions/types.md#access_list-transactions) and may be used in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

  - `blockHash`: _data, 32 bytes_ - Hash of the block containing this transaction. `null` when transaction is pending.

  - `blockNumber`: _quantity_ - Block number of the block containing this transaction. `null` when transaction is pending.

  - `blockTimestamp`: _quantity_ - Hex-encoded Unix timestamp (in seconds) of the block containing this transaction. `null` when transaction is pending.

  - `chainId`: _quantity_ - [Chain ID](../../../concepts/network-and-chain-id.md).

  - `from`: _data, 20 bytes_ - Address of the sender.

  - `gas`: _quantity_ - Gas provided by the sender.

  - `gasPrice`: _quantity_ - (Optional) Gas price, in Wei, provided by the sender. Used only in non-[`EIP1559`](../../../concepts/transactions/types.md#eip1559-transactions) transactions.

  - `maxPriorityFeePerGas`: _quantity, integer_ - (Optional) Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

  - `maxFeePerGas`: _quantity, integer_ - (Optional) Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

  - `hash`: _data, 32 bytes_ - Hash of the transaction.

  - `input`: _data_ - Data sent with the transaction to create or invoke a contract.

  - `nonce`: _quantity_ - Number of transactions made by the sender before this one.

  - `to`: _data, 20 bytes_ - Address of the receiver. `null` if a contract creation transaction.

  - `transactionIndex`: _quantity, integer_ - Index position of the transaction in the block. `null` when transaction is pending.

  - `transactionType`: _string_ - [Transaction type](../../../concepts/transactions/types.md).

  - `value`: _quantity_ - Value transferred, in Wei.

  - `v`: _quantity_ - ECDSA Recovery ID.

  - `r`: _data, 32 bytes_ - ECDSA signature r.

  - `s`: _data, 32 bytes_ - ECDSA signature s.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getTransactionByHash",
    "params": [
      "0xa52be92809541220ee0aaaede6047d9a6c5d0cd96a517c854d944ee70a0ebb44"
    ],
    "id": 53
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionByHash",
  "params": [
    "0xa52be92809541220ee0aaaede6047d9a6c5d0cd96a517c854d944ee70a0ebb44"
  ],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": {
    "blockHash": "0x510efccf44a192e6e34bcb439a1947e24b86244280762cbb006858c237093fda",
    "blockNumber": "0x422",
    "blockTimestamp": "0x561bc2e0",
    "chainId": 2018,
    "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
    "gas": "0x5208",
    "gasPrice": "0x3b9aca00",
    "hash": "0xa52be92809541220ee0aaaede6047d9a6c5d0cd96a517c854d944ee70a0ebb44",
    "input": "0x",
    "nonce": "0x1",
    "to": "0x627306090abab3a6e1400e9345bc60c78a8bef57",
    "transactionIndex": "0x0",
    "value": "0x4e1003b28d9280000",
    "v": "0xfe7",
    "r": "0x84caf09aefbd5e539295acc67217563438a4efb224879b6855f56857fa2037d3",
    "s": "0x5e863be3829812c81439f0ae9d8ecb832b531d651fb234c848d1bf45e62be8b9"
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{transaction(hash : \"0x03d80b9ca0a71435399a268609d6d7896f7155d2147cc22b780672bcb59b170d\") { block{hash} gas gasPrice hash nonce value from {address} to {address} status}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  transaction(hash: "0x03d80b9ca0a71435399a268609d6d7896f7155d2147cc22b780672bcb59b170d") {
    block {
      hash
    }
    gas
    gasPrice
    hash
    nonce
    value
    from {
      address
    }
    to {
      address
    }
    status
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "transaction": {
      "block": {
        "hash": "0xb1ef35744bade6980c3a933024b2557a8c724a19e5fdd2116bac712aa5e57198"
      },
      "gas": 21000,
      "gasPrice": "0x2540be400",
      "hash": "0x03d80b9ca0a71435399a268609d6d7896f7155d2147cc22b780672bcb59b170d",
      "nonce": 6,
      "value": "0x8ac7230489e80000",
      "from": {
        "address": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
      },
      "to": {
        "address": "0x9d8f8572f345e1ae53db1dfa4a7fce49b467bd7f"
      },
      "status": 1
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getTransactionBySenderAndNonce`

Returns transaction information for the specified sender address and nonce.

:::note
To return transactions included in blocks, this method requires the sender and nonce index.
The index is enabled by default; you can disable it using
[`--tx-sender-nonce-index-enabled`](../../options.md#tx-sender-nonce-index-enabled).
If the index is disabled, this method only returns information for pending transactions.
:::

### Parameters

- `address`: _string_ - 20-byte sender address.

- `nonce`: _string_ - Hexadecimal integer representing the transaction nonce.

### Returns

- Transaction object, or `null` when there is no transaction.

  <Fields>

  - `accessList`: _array_ - (Optional) List of addresses and storage keys the transaction plans to access. Used in [`ACCESS_LIST` transactions](../../../concepts/transactions/types.md#access_list-transactions) and may be used in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

  - `blockHash`: _data, 32 bytes_ - Hash of the block containing this transaction. `null` when transaction is pending.

  - `blockNumber`: _quantity_ - Block number of the block containing this transaction. `null` when transaction is pending.

  - `blockTimestamp`: _quantity_ - Hex-encoded Unix timestamp (in seconds) of the block containing this transaction. `null` when transaction is pending.

  - `chainId`: _quantity_ - [Chain ID](../../../concepts/network-and-chain-id.md).

  - `from`: _data, 20 bytes_ - Address of the sender.

  - `gas`: _quantity_ - Gas provided by the sender.

  - `gasPrice`: _quantity_ - (Optional) Gas price, in Wei, provided by the sender. Used only in non-[`EIP1559`](../../../concepts/transactions/types.md#eip1559-transactions) transactions.

  - `maxPriorityFeePerGas`: _quantity, integer_ - (Optional) Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

  - `maxFeePerGas`: _quantity, integer_ - (Optional) Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

  - `hash`: _data, 32 bytes_ - Hash of the transaction.

  - `input`: _data_ - Data sent with the transaction to create or invoke a contract.

  - `nonce`: _quantity_ - Number of transactions made by the sender before this one.

  - `to`: _data, 20 bytes_ - Address of the receiver. `null` if a contract creation transaction.

  - `transactionIndex`: _quantity, integer_ - Index position of the transaction in the block. `null` when transaction is pending.

  - `transactionType`: _string_ - [Transaction type](../../../concepts/transactions/types.md).

  - `value`: _quantity_ - Value transferred, in Wei.

  - `v`: _quantity_ - ECDSA Recovery ID.

  - `r`: _data, 32 bytes_ - ECDSA signature r.

  - `s`: _data, 32 bytes_ - ECDSA signature s.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getTransactionBySenderAndNonce",
    "params": [
      "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
      "0x1"
    ],
    "id": 53
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionBySenderAndNonce",
  "params": [
    "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
    "0x1"
  ],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": {
    "blockHash": "0x510efccf44a192e6e34bcb439a1947e24b86244280762cbb006858c237093fda",
    "blockNumber": "0x422",
    "blockTimestamp": "0x561bc2e0",
    "chainId": 2018,
    "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
    "gas": "0x5208",
    "gasPrice": "0x3b9aca00",
    "hash": "0xa52be92809541220ee0aaaede6047d9a6c5d0cd96a517c854d944ee70a0ebb44",
    "input": "0x",
    "nonce": "0x1",
    "to": "0x627306090abab3a6e1400e9345bc60c78a8bef57",
    "transactionIndex": "0x0",
    "value": "0x4e1003b28d9280000",
    "v": "0xfe7",
    "r": "0x84caf09aefbd5e539295acc67217563438a4efb224879b6855f56857fa2037d3",
    "s": "0x5e863be3829812c81439f0ae9d8ecb832b531d651fb234c848d1bf45e62be8b9"
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getTransactionReceipt`

Returns the receipt of a transaction by transaction hash. Receipts for pending transactions are not available.

If you enabled [revert reason](../../../../private-networks/how-to/send-transactions/revert-reason.md), the receipt includes available revert reasons in the response.

### Parameters

- `transaction`: _string_ - 32-byte hash of a transaction.

### Returns

- Transaction receipt object, or `null` when there is no receipt.

  <Fields>

  - `blockHash`: _data, 32 bytes_ - Hash of block containing this transaction.

  - `blockNumber`: _quantity_ - Block number of block containing this transaction.

  - `blockTimestamp`: _quantity_ - Hex-encoded unix timestamp (in seconds) of the block that includes this transaction.

  - `contractAddress`: _data, 20 bytes_ - Contract address created, if contract creation transaction, otherwise, `null`. A failed contract creation transaction still produces a contract address value.

  - `cumulativeGasUsed`: _quantity_ - Total amount of gas used by previous transactions in the block and this transaction.

  - `effectiveGasPrice`: _quantity_ - The [actual value per gas deducted](../../../concepts/transactions/types.md#eip1559-transactions) from the sender's account.

  - `from`: _data, 20 bytes_ - Address of the sender.

  - `gasUsed`: _quantity_ - Amount of gas used by this specific transaction.

  - `logs`: _array_ - Array of log objects generated by this transaction.

    <Fields>

    - `removed`: _tag_ - `true` if log removed because of a chain reorganization. `false` if a valid log.

    - `logIndex`: _quantity, integer_ - Log index position in the block. `null` when log is pending.

    - `transactionIndex`: _quantity, integer_ - Index position of the starting transaction for the log. `null` when log is pending.

    - `transactionHash`: _data, 32 bytes_ - Hash of the starting transaction for the log. `null` when log is pending.

    - `blockHash`: _data, 32 bytes_ - Hash of the block that includes the log. `null` when log is pending.

    - `blockNumber`: _quantity_ - Number of block that includes the log. `null` when log is pending.

    - `blockTimestamp`: _quantity_ - Hex-encoded unix timestamp (in seconds) of the block that includes the log.

    - `address`: _data, 20 bytes_ - Address the log originated from.

    - `data`: _data_ - Non-indexed arguments of the log.

    - `topics`: _array of data, 32 bytes each_ - [Event signature hash](../../../concepts/events-and-logs.md#event-signature-hash) and 0 to 3 [indexed log arguments](../../../concepts/events-and-logs.md#event-parameters).

    </Fields>

  - `logsBloom`: _data, 256 bytes_ - Bloom filter for light clients to quickly retrieve related logs.

  - `status`: _quantity_ - Either `0x0` (failure), `0x1` (success), or `0x2` (invalid).

  - `to`: _data, 20 bytes_ - Address of the receiver, if sending ether, otherwise, null.

  - `transactionHash`: _data, 32 bytes_ - Hash of the transaction.

  - `transactionIndex`: _quantity, integer_ - Index position of transaction in the block.

  - `transactionType`: _string_ - [Transaction type](../../../concepts/transactions/types.md).

  - `revertReason`: _string_ - ABI-encoded string that displays the [reason for reverting the transaction](../../../../private-networks/how-to/send-transactions/revert-reason.md). Only available if revert reason is [enabled](../../options.md#revert-reason-enabled).

  - `type`: _quantity_ - Transaction type, `0x00` for legacy transactions, `0x01` for access list types, `0x02` for dynamic fees, and `0x03` for blob transactions.

  - `root`: _data, 32 bytes_ - Pre-Byzantium transactions return this field instead of `status`. Post-transaction state root.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getTransactionReceipt",
    "params": [
      "0x504ce587a65bdbdb6414a0c6c16d86a04dd79bfcc4f2950eec9634b30ce5370f"
    ],
    "id": 53
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionReceipt",
  "params": [
    "0x504ce587a65bdbdb6414a0c6c16d86a04dd79bfcc4f2950eec9634b30ce5370f"
  ],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "blockHash": "0xe7212a92cfb9b06addc80dec2a0dfae9ea94fd344efeb157c41e12994fcad60a",
    "blockNumber": "0x50",
    "blockTimestamp": "0x55ba43bb",
    "contractAddress": null,
    "cumulativeGasUsed": "0x5208",
    "from": "0x627306090abab3a6e1400e9345bc60c78a8bef57",
    "gasUsed": "0x5208",
    "effectiveGasPrice": "0x1",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "status": "0x1",
    "to": "0xf17f52151ebef6c7334fad080c5704d77216b732",
    "transactionHash": "0xc00e97af59c6f88de163306935f7682af1a34c67245e414537d02e422815efc3",
    "transactionIndex": "0x0"
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{transaction(hash: \"0x5f5366af89e8777d5ae62a1af94a0876bdccbc22417bed0aff361eefa3e37f86\") {block{hash logsBloom} hash createdContract{address} cumulativeGasUsed gas gasUsed logs{topics} from{address} to{address} index}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  transaction(hash: "0x5f5366af89e8777d5ae62a1af94a0876bdccbc22417bed0aff361eefa3e37f86") {
    block {
      hash
      logsBloom
    }
    hash
    createdContract {
      address
    }
    cumulativeGasUsed
    gas
    gasUsed
    logs {
      topics
    }
    from {
      address
    }
    to {
      address
    }
    index
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "transaction": {
      "block": {
        "hash": "0x9270651f9c6fa36232c379d0ecf69b519383aa275815a65f1e03114346668f69",
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      },
      "hash": "0x5f5366af89e8777d5ae62a1af94a0876bdccbc22417bed0aff361eefa3e37f86",
      "createdContract": null,
      "cumulativeGasUsed": 21000,
      "gas": 21000,
      "gasUsed": 21000,
      "effectiveGasPrice": "0x1",
      "logs": [],
      "from": {
        "address": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
      },
      "to": {
        "address": "0x9d8f8572f345e1ae53db1dfa4a7fce49b467bd7f"
      },
      "index": 0
    }
  }
}
```

</TabItem>

</Tabs>
