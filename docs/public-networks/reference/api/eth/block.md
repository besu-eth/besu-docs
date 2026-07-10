---
title: Block methods
description: Besu ETH JSON-RPC API block methods reference
sidebar_label: Block
sidebar_position: 2
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

These methods query blocks and their contents, including block details, transaction counts, receipts, and uncles.

## `eth_getBlockByHash`

Returns information about the block matching the specified block hash.

### Parameters

- `hash`: _string_ - 32-byte hash of a block.

- `verbose`: _boolean_ - If `true`, returns the full transaction objects; if `false`, returns the transaction hashes.

### Returns

- Block object, or `null` when there is no block.

  <Fields>

  - `number`: _quantity, integer_ - Block number. `null` when block is pending.

  - `hash`: _data, 32 bytes_ - Hash of the block. `null` when block is pending.

  - `mixHash`: _data, 32 bytes_ - For pre-[merge](https://ethereum.org/roadmap/merge/) blocks, the hash used to verify the proof of work. For post-merge blocks, the `prevRandao` value supplied by the consensus layer.

  - `parentHash`: _data, 32 bytes_ - Hash of the parent block.

  - `nonce`: _data, 8 bytes_ - Hash of the generated proof of work. `null` when block is pending.

  - `sha3Uncles`: _data, 32 bytes_ - SHA3 of the uncle's data in the block.

  - `logsBloom`: _data, 256 bytes_ - Bloom filter for the block logs. `null` when block is pending.

  - `transactionsRoot`: _data, 32 bytes_ - Root of the transaction trie for the block.

  - `stateRoot`: _data, 32 bytes_ - Root of the final state trie for the block.

  - `receiptsRoot`: _data, 32 bytes_ - Root of the receipts trie for the block.

  - `miner`: _data, 20 bytes_ - Address to pay mining rewards to.

  - `difficulty`: _quantity, integer_ - Difficulty for this block.

  - `totalDifficulty`: _quantity, integer_ - Total difficulty of the chain until this block. Only present for pre-[merge](https://ethereum.org/roadmap/merge/) blocks. This value will always be `0` for an uncle block.

  - `extraData`: _data_ - Extra data field for this block. The first 32 bytes is vanity data you can set using the [`--miner-extra-data`](../../cli/options.md#miner-extra-data) command line option. Stores extra data when used with [IBFT](../../../../private-networks/how-to/configure/consensus/ibft.md#genesis-file).

  - `size`: _quantity, integer_ - Size of block in bytes.

  - `gasLimit`: _quantity_ - Maximum gas allowed in this block.

  - `gasUsed`: _quantity_ - Total gas used by all transactions in this block.

  - `timestamp`: _quantity_ - Hex-encoded Unix timestamp (in seconds) for block assembly.

  - `transactions`: _array_ - Array of transaction objects, or 32 byte transaction hashes depending on the specified boolean parameter.

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

  - `uncles`: _array_ - Array of uncle hashes.

  - `baseFeePerGas`: _quantity_ - The block's [base fee per gas](../../../concepts/transactions/types.md#eip1559-transactions). Only present for blocks created after [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559).

  - `withdrawalsRoot`: _data, 32 bytes_ - Root of the withdrawals trie for the block. Only present for blocks created after [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) (Shanghai).

  - `withdrawals`: _array_ - Array of validator withdrawal objects included in the block. Only present for blocks created after [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) (Shanghai).

    <Fields>

    - `index`: _quantity_ - Index of the withdrawal.

    - `validatorIndex`: _quantity_ - Index of the validator that initiated the withdrawal.

    - `address`: _data, 20 bytes_ - Address the withdrawal was sent to.

    - `amount`: _quantity_ - Amount withdrawn, in Gwei.

    </Fields>

  - `blobGasUsed`: _quantity_ - Total blob gas used by the transactions in this block. Only present for blocks created after [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) (Cancun).

  - `excessBlobGas`: _quantity_ - Running total of excess blob gas used to calculate the blob base fee for subsequent blocks. Only present for blocks created after [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) (Cancun).

  - `parentBeaconBlockRoot`: _data, 32 bytes_ - Root of the parent beacon block, which exposes beacon chain state to the EVM. Only present for blocks created after [EIP-4788](https://eips.ethereum.org/EIPS/eip-4788) (Cancun).

  - `requestsHash`: _data, 32 bytes_ - Hash of the general purpose execution layer requests (for example, deposits, withdrawals, and consolidations) included in the block. Only present for blocks created after [EIP-7685](https://eips.ethereum.org/EIPS/eip-7685) (Prague).

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getBlockByHash",
    "params": [
      "0xd5f1812548be429cbdc6376b29611fc49e06f1359758c4ceaaa3b393e2239f9c",
      false
    ],
    "id": 53
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBlockByHash",
  "params": [
    "0xd5f1812548be429cbdc6376b29611fc49e06f1359758c4ceaaa3b393e2239f9c",
    false
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
    "number": "0x68b3",
    "hash": "0xd5f1812548be429cbdc6376b29611fc49e06f1359758c4ceaaa3b393e2239f9c",
    "mixHash": "0x24900fb3da77674a861c428429dce0762707ecb6052325bbd9b3c64e74b5af9d",
    "parentHash": "0x1f68ac259155e2f38211ddad0f0a15394d55417b185a93923e2abe71bb7a4d6d",
    "nonce": "0x378da40ff335b070",
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "logsBloom": "0x00000000000000100000004080000000000500000000000000020000100000000800001000000004000001000000000000000800040010000020100000000400000010000000000000000040000000000000040000000000000000000000000000000400002400000000000000000000000000000004000004000000000000840000000800000080010004000000001000000800000000000000000000000000000000000800000000000040000000020000000000000000000800000400000000000000000000000600000400000000002000000000000000000000004000000000000000100000000000000000000000000000000000040000900010000000",
    "transactionsRoot": "0x4d0c8e91e16bdff538c03211c5c73632ed054d00a7e210c0eb25146c20048126",
    "stateRoot": "0x91309efa7e42c1f137f31fe9edbe88ae087e6620d0d59031324da3e2f4f93233",
    "receiptsRoot": "0x68461ab700003503a305083630a8fb8d14927238f0bc8b6b3d246c0c64f21f4a",
    "miner": "0xb42b6c4a95406c78ff892d270ad20b22642e102d",
    "difficulty": "0x66e619a",
    "totalDifficulty": "0x1e875d746ae",
    "extraData": "0xd583010502846765746885676f312e37856c696e7578",
    "size": "0x334",
    "gasLimit": "0x47e7c4",
    "gasUsed": "0x37993",
    "timestamp": "0x5835c54d",
    "uncles": [],
    "transactions": [
      "0xa0807e117a8dd124ab949f460f08c36c72b710188f01609595223b325e58e0fc",
      "0xeae6d797af50cb62a596ec3939114d63967c374fa57de9bc0f4e2b576ed6639d"
    ],
    "baseFeePerGas": "0x7"
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{block (hash : \"0xb0efed1fc9326fee967cb2d845d4ebe57c5350a0670c8e86f8052dea6f219f92\") {number transactions{hash} timestamp difficulty totalDifficulty gasUsed gasLimit hash nonce ommerCount logsBloom mixHash ommerHash extraData stateRoot receiptsRoot transactionCount transactionsRoot}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(hash: "0xb0efed1fc9326fee967cb2d845d4ebe57c5350a0670c8e86f8052dea6f219f92") {
    number
    transactions {
      hash
    }
    timestamp
    difficulty
    totalDifficulty
    gasUsed
    gasLimit
    hash
    nonce
    ommerCount
    logsBloom
    mixHash
    ommerHash
    extraData
    stateRoot
    receiptsRoot
    transactionCount
    transactionsRoot
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "number": 17607,
      "transactions": [],
      "timestamp": "0x5cdbdfb5",
      "difficulty": "0x1",
      "totalDifficulty": "0x44c8",
      "gasUsed": 0,
      "gasLimit": 4700000,
      "hash": "0xb0efed1fc9326fee967cb2d845d4ebe57c5350a0670c8e86f8052dea6f219f92",
      "nonce": "0x0000000000000000",
      "ommerCount": 0,
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
      "ommerHash": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "extraData": "0xf882a00000000000000000000000000000000000000000000000000000000000000000d5949811ebc35d7b06b3fa8dc5809a1f9c52751e1deb808400000000f843b841fae6d25da0b91e3e88669d0a765c98479d86d53e9ea1f3fb6b36d7ff22fa622a3da0c49c20e5562c774e90acae8ad487936f6b6019cd8a782db684693cba1e9800",
      "stateRoot": "0xa7086c266aed46cd3bc45579178f8acb36d9d147de575a3ecbf8c7e6f1c737fc",
      "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "transactionCount": 0,
      "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "baseFeePerGas": "0x7"
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getBlockByNumber`

Returns information about the block matching the specified block number.

### Parameters

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

- `verbose`: _boolean_ - If `true`, returns the full transaction objects; if `false`, returns only the hashes of the transactions.

### Returns

- Block object, or `null` when there is no block.

  <Fields>

  - `number`: _quantity, integer_ - Block number. `null` when block is pending.

  - `hash`: _data, 32 bytes_ - Hash of the block. `null` when block is pending.

  - `mixHash`: _data, 32 bytes_ - For pre-[merge](https://ethereum.org/roadmap/merge/) blocks, the hash used to verify the proof of work. For post-merge blocks, the `prevRandao` value supplied by the consensus layer.

  - `parentHash`: _data, 32 bytes_ - Hash of the parent block.

  - `nonce`: _data, 8 bytes_ - Hash of the generated proof of work. `null` when block is pending.

  - `sha3Uncles`: _data, 32 bytes_ - SHA3 of the uncle's data in the block.

  - `logsBloom`: _data, 256 bytes_ - Bloom filter for the block logs. `null` when block is pending.

  - `transactionsRoot`: _data, 32 bytes_ - Root of the transaction trie for the block.

  - `stateRoot`: _data, 32 bytes_ - Root of the final state trie for the block.

  - `receiptsRoot`: _data, 32 bytes_ - Root of the receipts trie for the block.

  - `miner`: _data, 20 bytes_ - Address to pay mining rewards to.

  - `difficulty`: _quantity, integer_ - Difficulty for this block.

  - `totalDifficulty`: _quantity, integer_ - Total difficulty of the chain until this block. Only present for pre-[merge](https://ethereum.org/roadmap/merge/) blocks. This value will always be `0` for an uncle block.

  - `extraData`: _data_ - Extra data field for this block. The first 32 bytes is vanity data you can set using the [`--miner-extra-data`](../../cli/options.md#miner-extra-data) command line option. Stores extra data when used with [IBFT](../../../../private-networks/how-to/configure/consensus/ibft.md#genesis-file).

  - `size`: _quantity, integer_ - Size of block in bytes.

  - `gasLimit`: _quantity_ - Maximum gas allowed in this block.

  - `gasUsed`: _quantity_ - Total gas used by all transactions in this block.

  - `timestamp`: _quantity_ - Hex-encoded Unix timestamp (in seconds) for block assembly.

  - `transactions`: _array_ - Array of transaction objects, or 32 byte transaction hashes depending on the specified boolean parameter.

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

  - `uncles`: _array_ - Array of uncle hashes.

  - `baseFeePerGas`: _quantity_ - The block's [base fee per gas](../../../concepts/transactions/types.md#eip1559-transactions). Only present for blocks created after [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559).

  - `withdrawalsRoot`: _data, 32 bytes_ - Root of the withdrawals trie for the block. Only present for blocks created after [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) (Shanghai).

  - `withdrawals`: _array_ - Array of validator withdrawal objects included in the block. Only present for blocks created after [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) (Shanghai).

    <Fields>

    - `index`: _quantity_ - Index of the withdrawal.

    - `validatorIndex`: _quantity_ - Index of the validator that initiated the withdrawal.

    - `address`: _data, 20 bytes_ - Address the withdrawal was sent to.

    - `amount`: _quantity_ - Amount withdrawn, in Gwei.

    </Fields>

  - `blobGasUsed`: _quantity_ - Total blob gas used by the transactions in this block. Only present for blocks created after [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) (Cancun).

  - `excessBlobGas`: _quantity_ - Running total of excess blob gas used to calculate the blob base fee for subsequent blocks. Only present for blocks created after [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) (Cancun).

  - `parentBeaconBlockRoot`: _data, 32 bytes_ - Root of the parent beacon block, which exposes beacon chain state to the EVM. Only present for blocks created after [EIP-4788](https://eips.ethereum.org/EIPS/eip-4788) (Cancun).

  - `requestsHash`: _data, 32 bytes_ - Hash of the general purpose execution layer requests (for example, deposits, withdrawals, and consolidations) included in the block. Only present for blocks created after [EIP-7685](https://eips.ethereum.org/EIPS/eip-7685) (Prague).

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getBlockByNumber",
    "params": [
      "0x68B3",
      true
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBlockByNumber",
  "params": [
    "0x68B3",
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
  "result": {
    "number": "0x68b3",
    "hash": "0xd5f1812548be429cbdc6376b29611fc49e06f1359758c4ceaaa3b393e2239f9c",
    "mixHash": "0x24900fb3da77674a861c428429dce0762707ecb6052325bbd9b3c64e74b5af9d",
    "parentHash": "0x1f68ac259155e2f38211ddad0f0a15394d55417b185a93923e2abe71bb7a4d6d",
    "nonce": "0x378da40ff335b070",
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "logsBloom": "0x00000000000000100000004080000000000500000000000000020000100000000800001000000004000001000000000000000800040010000020100000000400000010000000000000000040000000000000040000000000000000000000000000000400002400000000000000000000000000000004000004000000000000840000000800000080010004000000001000000800000000000000000000000000000000000800000000000040000000020000000000000000000800000400000000000000000000000600000400000000002000000000000000000000004000000000000000100000000000000000000000000000000000040000900010000000",
    "transactionsRoot": "0x4d0c8e91e16bdff538c03211c5c73632ed054d00a7e210c0eb25146c20048126",
    "stateRoot": "0x91309efa7e42c1f137f31fe9edbe88ae087e6620d0d59031324da3e2f4f93233",
    "receiptsRoot": "0x68461ab700003503a305083630a8fb8d14927238f0bc8b6b3d246c0c64f21f4a",
    "miner": "0xb42b6c4a95406c78ff892d270ad20b22642e102d",
    "difficulty": "0x66e619a",
    "totalDifficulty": "0x1e875d746ae",
    "extraData": "0xd583010502846765746885676f312e37856c696e7578",
    "size": "0x334",
    "gasLimit": "0x47e7c4",
    "gasUsed": "0x37993",
    "timestamp": "0x5835c54d",
    "uncles": [],
    "transactions": [],
    "baseFeePerGas": "0x7"
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{block (number : 100) {transactions{hash} timestamp difficulty totalDifficulty gasUsed gasLimit hash nonce ommerCount logsBloom mixHash ommerHash extraData stateRoot receiptsRoot transactionCount transactionsRoot ommers{hash} ommerAt(index : 1){hash} miner{address} account(address: \"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73\"){balance} parent{hash} }}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(number: 100) {
    transactions {
      hash
    }
    timestamp
    difficulty
    totalDifficulty
    gasUsed
    gasLimit
    hash
    nonce
    ommerCount
    logsBloom
    mixHash
    ommerHash
    extraData
    stateRoot
    receiptsRoot
    transactionCount
    transactionsRoot
    ommers {
      hash
    }
    ommerAt(index: 1) {
      hash
    }
    miner {
      address
    }
    account(address: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73") {
      balance
    }
    parent {
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
      "transactions": [],
      "timestamp": "0x5cd10933",
      "difficulty": "0x1",
      "totalDifficulty": "0x65",
      "gasUsed": 0,
      "gasLimit": 4700000,
      "hash": "0x63b3ea2bc37fec8f82680eb823652da6af8acebb4f6c4d0ff659c55be473c8b0",
      "nonce": "0x0000000000000000",
      "ommerCount": 0,
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
      "ommerHash": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "extraData": "0xf882a00000000000000000000000000000000000000000000000000000000000000000d5949811ebc35d7b06b3fa8dc5809a1f9c52751e1deb808400000000f843b8414d877d8d0ced37ea138fab55a978f3740367a24a31731322ecdc3368f11e0d4966c9ce17ae59a76fb94eb436e8a386868f6bd6b0a5678e58daf49f5dd940558b00",
      "stateRoot": "0xd650578a04b39f50cc979155f4510ec28c2c0a7c1e5fdbf84609bc7b1c430f48",
      "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "transactionCount": 0,
      "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "ommers": [],
      "ommerAt": null,
      "miner": {
        "address": "0x9811ebc35d7b06b3fa8dc5809a1f9c52751e1deb"
      },
      "account": {
        "balance": "0xad0f47f269cbf31ac"
      },
      "parent": {
        "hash": "0x7bca25e1fa5e395fd6029eb496a70b6b5495843976bf9e49b993c723ded29d9e"
      },
      "baseFeePerGas": "0x7"
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getBlockReceipts`

Returns all transaction receipts for a given block. Transaction receipts provide a way to track the success or failure of a transaction (`1` if successful and `0` if failed), as well as the amount of
gas used and any event logs that might have been produced by a smart contract during the transaction.

### Parameters

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

### Returns

- List of transaction receipt objects, or `null` when there is no block.

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

  - `revertReason`: _string_ - ABI-encoded string that displays the [reason for reverting the transaction](../../../../private-networks/how-to/send-transactions/revert-reason.md). Only available if revert reason is [enabled](../../cli/options.md#revert-reason-enabled).

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
    "method": "eth_getBlockReceipts",
    "params": [
      "latest"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBlockReceipts",
  "params": [
    "0x6f55"
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
      "blockHash": "0x19514ce955c65e4dd2cd41f435a75a46a08535b8fc16bc660f8092b32590b182",
      "blockNumber": "0x6f55",
      "contractAddress": null,
      "cumulativeGasUsed": "0x18c36",
      "from": "0x22896bfc68814bfd855b1a167255ee497006e730",
      "gasUsed": "0x18c36",
      "effectiveGasPrice": "0x9502f907",
      "logs": [
        {
          "address": "0xfd584430cafa2f451b4e2ebcf3986a21fff04350",
          "topics": [
            "0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d",
            "0x4be29e0e4eb91f98f709d98803cba271592782e293b84a625e025cbb40197ba8",
            "0x000000000000000000000000835281a2563db4ebf1b626172e085dc406bfc7d2",
            "0x00000000000000000000000022896bfc68814bfd855b1a167255ee497006e730"
          ],
          "data": "0x",
          "blockNumber": "0x6f55",
          "transactionHash": "0x4a481e4649da999d92db0585c36cba94c18a33747e95dc235330e6c737c6f975",
          "transactionIndex": "0x0",
          "blockHash": "0x19514ce955c65e4dd2cd41f435a75a46a08535b8fc16bc660f8092b32590b182",
          "blockTimestamp": "0x561bc2e0",
          "logIndex": "0x0",
          "removed": false
        }
      ],
      "logsBloom": "0x00000004000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000080020000000000000200010000000000000000000001000000800000000000000000000000000000000000000000000000000000100100000000000000000000008000000000000000000000000000000002000000000000000000000",
      "status": "0x1",
      "to": "0xfd584430cafa2f451b4e2ebcf3986a21fff04350",
      "transactionHash": "0x4a481e4649da999d92db0585c36cba94c18a33747e95dc235330e6c737c6f975",
      "transactionIndex": "0x0",
      "type": "0x0"
    },
    {
      "blockHash": "0x19514ce955c65e4dd2cd41f435a75a46a08535b8fc16bc660f8092b32590b182",
      "blockNumber": "0x6f55",
      "contractAddress": null,
      "cumulativeGasUsed": "0x1de3e",
      "from": "0x712e3a792c974b3e3dbe41229ad4290791c75a82",
      "gasUsed": "0x5208",
      "effectiveGasPrice": "0x9502f907",
      "logs": [],
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "status": "0x1",
      "to": "0xd42e2b1c14d02f1df5369a9827cb8e6f3f75f338",
      "transactionHash": "0xefb83b4e3f1c317e8da0f8e2fbb2fe964f34ee184466032aeecac79f20eacaf6",
      "transactionIndex": "0x1",
      "type": "0x2"
    }
  ]
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{block  (hash: \"0x4d746a3381673a5180744a56e78cded4696b77317866c2253566e0fa16967e1d\") {transactions{block{hash logsBloom} hash createdContract{address} cumulativeGasUsed gas gasUsed logs{topics} from{address} to{address} index}}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block (hash: "0x4d746a3381673a5180744a56e78cded4696b77317866c2253566e0fa16967e1d") {
    transactions { 
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
      logs{ 
        topics
      } 
      from{ 
        address
      }
      to { 
        address
      } 
      index
    }
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data" : {
    "block" : {
      "transactions" : [ {
        "block" : {
          "hash" : "0x4d746a3381673a5180744a56e78cded4696b77317866c2253566e0fa16967e1d",
          "logsBloom" : "0x2e0a8080520608000e38181e0c9081e813a00c184a010d1900c9602240428dc6480004444098428b945010802454104002827420426591a200224016802841900031bd4440828ec9b113081880027c01cc47105c1885d556216200880026160810050028422a4b0c4bc8087372860851000802c8d901158504a482100d488040119c08045e500824402054a0d91cc433188909020a06ac841914a2a082c104a1260460014b8b001b28030202518c040008266038a880026208041d082503589054581223c188004396804801280c00020c492816060a421831c8820ac04460303a9e48128238e0098f319030083808150c4914b8840000206715481500690000"
        },
        "hash" : "0x7afe779fd0c6d4a1b6f330e679a5cf94095eaa57d2ce0c0ef991dfb2b405374f",
        "createdContract" : null,
        "cumulativeGasUsed" : "0x5208",
        "gas" : "0x61a8",
        "gasUsed" : "0x5208",
        "logs" : [ ],
        "from" : {
          "address" : "0x66f962241b8ff853849c85a63a0ce20bae4f68d5"
        },
        "to" : {
          "address" : "0x6be8356826a9fc7b2d911fcc1de6342ae5f5b9a3"
        },
        "index" : "0x0"
      }, {
        "block" : {
          "hash" : "0x4d746a3381673a5180744a56e78cded4696b77317866c2253566e0fa16967e1d",
          "logsBloom" : "0x2e0a8080520608000e38181e0c9081e813a00c184a010d1900c9602240428dc6480004444098428b945010802454104002827420426591a200224016802841900031bd4440828ec9b113081880027c01cc47105c1885d556216200880026160810050028422a4b0c4bc8087372860851000802c8d901158504a482100d488040119c08045e500824402054a0d91cc433188909020a06ac841914a2a082c104a1260460014b8b001b28030202518c040008266038a880026208041d082503589054581223c188004396804801280c00020c492816060a421831c8820ac04460303a9e48128238e0098f319030083808150c4914b8840000206715481500690000"
        },
        "hash" : "0x412f04ba27c1c096dadb2d8af54ee61034c3d4679fdd025a634e95fa2238713c",
        "createdContract" : null,
        "cumulativeGasUsed" : "0xbcdb2",
        "gas" : "0xbdfe0",
        "gasUsed" : "0xb7baa",
        "logs" : [ {
          "topics" : [ "0xd93fde3ea1bb11dcd7a4e66320a05fc5aa63983b6447eff660084c4b1b1b499b", "0x00000000000000000000000000000000000000000000000000000000000e4d3a" ]
        } ],
        "from" : {
          "address" : "0xe253f7a6533c62755f470b33fa5bcd659a5db3cd"
        },
        "to" : {
          "address" : "0x95ff8d3ce9dcb7455beb7845143bea84fe5c4f6f"
        },
        "index" : "0x1"
      } ]
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getBlockTransactionCountByHash`

Returns the number of transactions in the block matching the specified block hash.

### Parameters

- `hash`: _string_ - 32-byte block hash.

### Returns

- Integer representing the number of transactions in the specified block, or `null` if no matching block hash is found.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getBlockTransactionCountByHash",
    "params": [
      "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"
    ],
    "id": 53
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBlockTransactionCountByHash",
  "params": [
    "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"
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
  "result": null
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{block(hash:\"0xe455c14f757b0b9b67774baad1be1c180a4c1657df52259dbb685bf375408097\"){transactionCount}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(hash: "0xe455c14f757b0b9b67774baad1be1c180a4c1657df52259dbb685bf375408097") {
    transactionCount
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "transactionCount": 1
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getBlockTransactionCountByNumber`

Returns the number of transactions in a block matching the specified block number.

### Parameters

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

### Returns

- Integer representing the number of transactions in the specified block, or `null` if no matching block number is found.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getBlockTransactionCountByNumber",
    "params": [
      "0xe8"
    ],
    "id": 51
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBlockTransactionCountByNumber",
  "params": [
    "0xe8"
  ],
  "id": 51
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 51,
  "result": "0x8"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{block(number:232){transactionCount}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(number: 232) {
    transactionCount
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "transactionCount": 1
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getUncleByBlockHashAndIndex`

Returns uncle specified by block hash and index.

### Parameters

- `block`: _string_ - 32-byte block hash.

- `uncleIndex`: _string_ - Index of the uncle.

### Returns

- Block object.

  <Fields>

  - `number`: _quantity, integer_ - Block number. `null` when block is pending.

  - `hash`: _data, 32 bytes_ - Hash of the block. `null` when block is pending.

  - `mixHash`: _data, 32 bytes_ - For pre-[merge](https://ethereum.org/roadmap/merge/) blocks, the hash used to verify the proof of work. For post-merge blocks, the `prevRandao` value supplied by the consensus layer.

  - `parentHash`: _data, 32 bytes_ - Hash of the parent block.

  - `nonce`: _data, 8 bytes_ - Hash of the generated proof of work. `null` when block is pending.

  - `sha3Uncles`: _data, 32 bytes_ - SHA3 of the uncle's data in the block.

  - `logsBloom`: _data, 256 bytes_ - Bloom filter for the block logs. `null` when block is pending.

  - `transactionsRoot`: _data, 32 bytes_ - Root of the transaction trie for the block.

  - `stateRoot`: _data, 32 bytes_ - Root of the final state trie for the block.

  - `receiptsRoot`: _data, 32 bytes_ - Root of the receipts trie for the block.

  - `miner`: _data, 20 bytes_ - Address to pay mining rewards to.

  - `difficulty`: _quantity, integer_ - Difficulty for this block.

  - `totalDifficulty`: _quantity, integer_ - Total difficulty of the chain until this block. Only present for pre-[merge](https://ethereum.org/roadmap/merge/) blocks. This value will always be `0` for an uncle block.

  - `extraData`: _data_ - Extra data field for this block. The first 32 bytes is vanity data you can set using the [`--miner-extra-data`](../../cli/options.md#miner-extra-data) command line option. Stores extra data when used with [IBFT](../../../../private-networks/how-to/configure/consensus/ibft.md#genesis-file).

  - `size`: _quantity, integer_ - Size of block in bytes.

  - `gasLimit`: _quantity_ - Maximum gas allowed in this block.

  - `gasUsed`: _quantity_ - Total gas used by all transactions in this block.

  - `timestamp`: _quantity_ - Hex-encoded Unix timestamp (in seconds) for block assembly.

  - `transactions`: _array_ - Array of transaction objects, or 32 byte transaction hashes depending on the specified boolean parameter.

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

  - `uncles`: _array_ - Array of uncle hashes.

  - `baseFeePerGas`: _quantity_ - The block's [base fee per gas](../../../concepts/transactions/types.md#eip1559-transactions). Only present for blocks created after [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559).

  - `withdrawalsRoot`: _data, 32 bytes_ - Root of the withdrawals trie for the block. Only present for blocks created after [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) (Shanghai).

  - `withdrawals`: _array_ - Array of validator withdrawal objects included in the block. Only present for blocks created after [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) (Shanghai).

    <Fields>

    - `index`: _quantity_ - Index of the withdrawal.

    - `validatorIndex`: _quantity_ - Index of the validator that initiated the withdrawal.

    - `address`: _data, 20 bytes_ - Address the withdrawal was sent to.

    - `amount`: _quantity_ - Amount withdrawn, in Gwei.

    </Fields>

  - `blobGasUsed`: _quantity_ - Total blob gas used by the transactions in this block. Only present for blocks created after [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) (Cancun).

  - `excessBlobGas`: _quantity_ - Running total of excess blob gas used to calculate the blob base fee for subsequent blocks. Only present for blocks created after [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) (Cancun).

  - `parentBeaconBlockRoot`: _data, 32 bytes_ - Root of the parent beacon block, which exposes beacon chain state to the EVM. Only present for blocks created after [EIP-4788](https://eips.ethereum.org/EIPS/eip-4788) (Cancun).

  - `requestsHash`: _data, 32 bytes_ - Hash of the general purpose execution layer requests (for example, deposits, withdrawals, and consolidations) included in the block. Only present for blocks created after [EIP-7685](https://eips.ethereum.org/EIPS/eip-7685) (Prague).

  <br />

  :::note

  Uncles don't contain individual transactions.

  :::
  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getUncleByBlockHashAndIndex",
    "params": [
      "0xc48fb64230a82f65a08e7280bd8745e7fea87bc7c206309dee32209fe9a985f7",
      "0x0"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getUncleByBlockHashAndIndex",
  "params": [
    "0xc48fb64230a82f65a08e7280bd8745e7fea87bc7c206309dee32209fe9a985f7",
    "0x0"
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
    "difficulty": "0x76b123df93230",
    "extraData": "0x50505945206e616e6f706f6f6c2e6f7267",
    "gasLimit": "0x7a121d",
    "gasUsed": "0x7a0175",
    "hash": "0xc20189c0b1a4a23116ab3b177e929137f6e826f17fc4c2e880e7258c620e9817",
    "logsBloom": "0x890086c024487ca422be846a201a10e41bc2882902312116c1119609482031e9c000e2a708004a10281024028020c505727a12570c4810121c59024490b040894406a1c23c37a0094810921da3923600c71c03044b40924280038d07ab91964a008084264a01641380798840805a284cce201a8026045451002500113a00de441001320805ca2840037000111640d090442c11116d2112948084240242340400236ce81502063401dcc214b9105194d050884721c1208800b20501a4201400276004142f118e60808284506979a86e050820101c170c185e2310005205a82a2100382422104182090184800c02489e033440218142140045801c024cc1818485",
    "miner": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5",
    "mixHash": "0xf557cc827e058862aa3ea1bd6088fb8766f70c0eac4117c56cf85b7911f82a14",
    "nonce": "0xd320b48904347cdd",
    "number": "0x768964",
    "parentHash": "0x98d752708b3677df8f439c4529f999b94663d5494dbfc08909656db3c90f6255",
    "receiptsRoot": "0x0f838f0ceb73368e7fc8d713a7761e5be31e3b4beafe1a6875a7f275f82da45b",
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "size": "0x21a",
    "stateRoot": "0xa0c7d4fca79810c89c517eff8dadb9c6d6f4bcc27c2edfb301301e1cf7dec642",
    "timestamp": "0x5cdcbba6",
    "totalDifficulty": "0x229ad33cabd4c40d23d",
    "transactionsRoot": "0x866e38e91d01ef0387b8e07ccf35cd910224271ccf2b7477b8c8439e8b70f365",
    "uncles": []
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{block(hash:\"0xc48fb64230a82f65a08e7280bd8745e7fea87bc7c206309dee32209fe9a985f7\"){ ommerAt(index: 0) {difficulty extraData gasLimit gasUsed hash logsBloom mixHash nonce number receiptsRoot stateRoot timestamp totalDifficulty transactionsRoot}}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(hash: "0xc48fb64230a82f65a08e7280bd8745e7fea87bc7c206309dee32209fe9a985f7") {
    ommerAt(index: 0) {
      difficulty
      extraData
      gasLimit
      gasUsed
      hash
      logsBloom
      mixHash
      nonce
      number
      receiptsRoot
      stateRoot
      timestamp
      totalDifficulty
      transactionsRoot
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
      "difficulty": "0x1",
      "extraData": "0xf882a00000000000000000000000000000000000000000000000000000000000000000d5949811ebc35d7b06b3fa8dc5809a1f9c52751e1deb808400000000f843b8418e98ef756acdae1e510b1df4b507b7af04eb3802db7fa0f3e73e7d0721b3645e76f4eb3d0dbf0de75620c4405bd5a663247cdd9616482c883053856d857f884a01",
      "gasLimit": 4700000,
      "gasUsed": 0,
      "hash": "0x0efe67972b982eb6be5df84e5238eb07475f86afa8a7de708f6a13ac0ff60d6c",
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
      "nonce": "0x0000000000000000",
      "number": 200,
      "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "stateRoot": "0xd650578a04b39f50cc979155f4510ec28c2c0a7c1e5fdbf84609bc7b1c430f48",
      "timestamp": "0x5cd109fb",
      "totalDifficulty": "0xc9",
      "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getUncleByBlockNumberAndIndex`

Returns uncle specified by block number and index.

### Parameters

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

- `uncleIndex`: _string_ - Index of the uncle.

### Returns

- Block object.

  <Fields>

  - `number`: _quantity, integer_ - Block number. `null` when block is pending.

  - `hash`: _data, 32 bytes_ - Hash of the block. `null` when block is pending.

  - `mixHash`: _data, 32 bytes_ - For pre-[merge](https://ethereum.org/roadmap/merge/) blocks, the hash used to verify the proof of work. For post-merge blocks, the `prevRandao` value supplied by the consensus layer.

  - `parentHash`: _data, 32 bytes_ - Hash of the parent block.

  - `nonce`: _data, 8 bytes_ - Hash of the generated proof of work. `null` when block is pending.

  - `sha3Uncles`: _data, 32 bytes_ - SHA3 of the uncle's data in the block.

  - `logsBloom`: _data, 256 bytes_ - Bloom filter for the block logs. `null` when block is pending.

  - `transactionsRoot`: _data, 32 bytes_ - Root of the transaction trie for the block.

  - `stateRoot`: _data, 32 bytes_ - Root of the final state trie for the block.

  - `receiptsRoot`: _data, 32 bytes_ - Root of the receipts trie for the block.

  - `miner`: _data, 20 bytes_ - Address to pay mining rewards to.

  - `difficulty`: _quantity, integer_ - Difficulty for this block.

  - `totalDifficulty`: _quantity, integer_ - Total difficulty of the chain until this block. Only present for pre-[merge](https://ethereum.org/roadmap/merge/) blocks. This value will always be `0` for an uncle block.

  - `extraData`: _data_ - Extra data field for this block. The first 32 bytes is vanity data you can set using the [`--miner-extra-data`](../../cli/options.md#miner-extra-data) command line option. Stores extra data when used with [IBFT](../../../../private-networks/how-to/configure/consensus/ibft.md#genesis-file).

  - `size`: _quantity, integer_ - Size of block in bytes.

  - `gasLimit`: _quantity_ - Maximum gas allowed in this block.

  - `gasUsed`: _quantity_ - Total gas used by all transactions in this block.

  - `timestamp`: _quantity_ - Hex-encoded Unix timestamp (in seconds) for block assembly.

  - `transactions`: _array_ - Array of transaction objects, or 32 byte transaction hashes depending on the specified boolean parameter.

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

  - `uncles`: _array_ - Array of uncle hashes.

  - `baseFeePerGas`: _quantity_ - The block's [base fee per gas](../../../concepts/transactions/types.md#eip1559-transactions). Only present for blocks created after [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559).

  - `withdrawalsRoot`: _data, 32 bytes_ - Root of the withdrawals trie for the block. Only present for blocks created after [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) (Shanghai).

  - `withdrawals`: _array_ - Array of validator withdrawal objects included in the block. Only present for blocks created after [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) (Shanghai).

    <Fields>

    - `index`: _quantity_ - Index of the withdrawal.

    - `validatorIndex`: _quantity_ - Index of the validator that initiated the withdrawal.

    - `address`: _data, 20 bytes_ - Address the withdrawal was sent to.

    - `amount`: _quantity_ - Amount withdrawn, in Gwei.

    </Fields>

  - `blobGasUsed`: _quantity_ - Total blob gas used by the transactions in this block. Only present for blocks created after [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) (Cancun).

  - `excessBlobGas`: _quantity_ - Running total of excess blob gas used to calculate the blob base fee for subsequent blocks. Only present for blocks created after [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) (Cancun).

  - `parentBeaconBlockRoot`: _data, 32 bytes_ - Root of the parent beacon block, which exposes beacon chain state to the EVM. Only present for blocks created after [EIP-4788](https://eips.ethereum.org/EIPS/eip-4788) (Cancun).

  - `requestsHash`: _data, 32 bytes_ - Hash of the general purpose execution layer requests (for example, deposits, withdrawals, and consolidations) included in the block. Only present for blocks created after [EIP-7685](https://eips.ethereum.org/EIPS/eip-7685) (Prague).

  <br />

  :::note

  Uncles don't contain individual transactions.

  :::

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getUncleByBlockNumberAndIndex",
    "params": [
      "0x7689D2",
      "0x0"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getUncleByBlockNumberAndIndex",
  "params": [
    "0x7689D2",
    "0x0"
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
    "difficulty": "0x77daec467bf93",
    "extraData": "0x50505945206e616e6f706f6f6c2e6f7267",
    "gasLimit": "0x7a121d",
    "gasUsed": "0x7a0f7b",
    "hash": "0x42d83ae9c0743f4b1f9c61ff7ea8b164c1bab3627decd49233760680be006ecf",
    "logsBloom": "0x888200800000340120220008640200500408006100038400100581c000080240080a0014e8002010080004088040004022402a000c18010001400100002a041141a0610a0052900600041018c0002a0003090020404c00206010010513d00020005380124e08050480710000000108401012b0901c1424006000083a10a8c1040100a0440081050210124400040044304070004001100000012600806008061d0320800000b40042160600002480000000800000c0002100200940801c000820800048024904710000400640490026000a44300309000286088010c2300060003011380006400200812009144042204810209020410a84000410520c08802941",
    "miner": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5",
    "mixHash": "0xf977fcdb52868be410b75ef2becc35cc312f13ab0a6ce400ecd9d445f66fa3f2",
    "nonce": "0x628b28403bf1e3d3",
    "number": "0x7689d0",
    "parentHash": "0xb32cfdfbf4adb05d30f02fcc6fe039cc6666402142954051c1a1cb9cc91aa11e",
    "receiptsRoot": "0x9c7c8361d1a24ea2841432234c81974a9920d3eba2b2b1c496b5f925a95cb4ac",
    "sha3Uncles": "0x7d972aa1b182b7e93f1db043f03fbdbfac6874fe7e67e162141bcc0aefa6336b",
    "size": "0x21a",
    "stateRoot": "0x74e97b77813146344d75acb5a52a006cc6dfaca678a10fb8a484a8443e919272",
    "timestamp": "0x5cdcc0a7",
    "totalDifficulty": "0x229b0583b4bd2698ca0",
    "transactionsRoot": "0x1d21626afddf05e5866de66ca3fcd98f1caf5357eba0cc6ec675606e116a891b",
    "uncles": []
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{block(number:2587){ ommerAt(index: 0) {difficulty extraData gasLimit gasUsed hash logsBloom mixHash nonce number receiptsRoot stateRoot timestamp totalDifficulty transactionsRoot}}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(number: 2587) {
    ommerAt(index: 0) {
      difficulty
      extraData
      gasLimit
      gasUsed
      hash
      logsBloom
      mixHash
      nonce
      number
      receiptsRoot
      stateRoot
      timestamp
      totalDifficulty
      transactionsRoot
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
      "ommerAt": null
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getUncleCountByBlockHash`

Returns the number of uncles in a block from a block matching the given block hash.

### Parameters

- `block`: _string_ - 32-byte block hash.

### Returns

- Integer representing the number of uncles in the specified block.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getUncleCountByBlockHash",
    "params": [
      "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getUncleCountByBlockHash",
  "params": [
    "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"
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
  "result": 0x0
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{block(hash:\"0x65c08d792e4192b9ece6b6f2390da7da464208b22d88490be8add9373917b426\"){ommerCount}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(hash: "0x65c08d792e4192b9ece6b6f2390da7da464208b22d88490be8add9373917b426") {
    ommerCount
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "ommerCount": 2
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getUncleCountByBlockNumber`

Returns the number of uncles in a block matching the specified block number.

### Parameters

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

### Returns

- Integer representing the number of uncles in the specified block.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getUncleCountByBlockNumber",
    "params": [
      "0xe8"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getUncleCountByBlockNumber",
  "params": [
    "0xe8"
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
  "result": "0x1"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{block(number:\"0x59fd\"){ommerCount}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(number: "0x59fd") {
    ommerCount
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "ommerCount": 0
    }
  }
}
```

</TabItem>

</Tabs>
