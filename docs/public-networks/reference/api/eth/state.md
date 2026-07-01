---
title: State and account methods
description: Besu ETH JSON-RPC API state and account methods reference
sidebar_label: State and account
sidebar_position: 4
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

These methods read account state at a given block, including balances, nonces, contract code, storage values, and Merkle proofs.

## `eth_getBalance`

Returns the account balance of the specified address.

### Parameters

- `address`: _string_ - 20-byte account address from which to retrieve the balance.

- `blockNumber` or `blockHash`: _string_ - (Optional) Hexadecimal integer representing a block
  number, block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or
  `safe`, as described in [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).
  The default is `latest`.

  :::note
  `pending` returns the same value as `latest`.
  :::

### Returns

- Current balance, in wei, as a hexadecimal value.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getBalance",
    "params": [
      "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
      "latest"
    ],
    "id": 53
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBalance",
  "params": [
    "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
    "latest"
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
  "result": "0x1cfe56f3795885980000"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{ account ( address: \"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73\") { balance } }"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  account(address: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73") {
    balance
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "account": {
      "balance": "0x1ce96a1ffe7620d00000"
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getCode`

Returns the code of the smart contract at the specified address. Besu stores compiled smart contract code as a hexadecimal value.

### Parameters

- `address`: _string_ - 20-byte contract address.

- `blockNumber` or `blockHash`: _string_ - (Optional) Hexadecimal integer representing a block number,
  block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as
  described in [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).
  The default is `latest`.

  :::note
  `pending` returns the same value as `latest`.
  :::

### Returns

- Code stored at the specified address.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getCode",
    "params": [
      "0xa50a51c09a5c451c52bb714527e1974b686d8e77",
      "latest"
    ],
    "id": 53
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getCode",
  "params": [
    "0xa50a51c09a5c451c52bb714527e1974b686d8e77",
    "latest"
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
  "result": "0x60806040526004361060485763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416633fa4f2458114604d57806355241077146071575b600080fd5b348015605857600080fd5b50605f6088565b60408051918252519081900360200190f35b348015607c57600080fd5b506086600435608e565b005b60005481565b60008190556040805182815290517f199cd93e851e4c78c437891155e2112093f8f15394aa89dab09e38d6ca0727879181900360200190a1505600a165627a7a723058209d8929142720a69bde2ab3bfa2da6217674b984899b62753979743c0470a2ea70029"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{account(address: \"0xa50a51c09a5c451c52bb714527e1974b686d8e77\"){ code }}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  account(address: "0xa50a51c09a5c451c52bb714527e1974b686d8e77") {
    code
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "account": {
      "code": "0x60806040526004361060485763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416633fa4f2458114604d57806355241077146071575b600080fd5b348015605857600080fd5b50605f6088565b60408051918252519081900360200190f35b348015607c57600080fd5b506086600435608e565b005b60005481565b60008190556040805182815290517f199cd93e851e4c78c437891155e2112093f8f15394aa89dab09e38d6ca0727879181900360200190a1505600a165627a7a723058209d8929142720a69bde2ab3bfa2da6217674b984899b62753979743c0470a2ea70029"
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getProof`

Returns the account and storage values of the specified account, including the Merkle proof.

The API allows IoT devices or mobile apps which are unable to run light clients to verify responses from untrusted sources, by using a trusted block hash.

### Parameters

- `address`: _string_ - 20-byte address of the account or contract.

- `keys`: _array_ of _strings_ - List of 32-byte storage keys to generate proofs for.

- `blockNumber` or `blockHash`: _string_ - (Optional) Hexadecimal integer representing a block
  number, block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or
  `safe`, as described in [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).
  The default is `latest`.

  :::note
  `pending` returns the same value as `latest`.
  :::

### Returns

- Account details object.

  <Fields>

  - `balance`: _string_ - Account balance.

  - `codeHash`: _string_ - 32-byte hash of the account code.

  - `nonce`: _string_ - Number of transactions sent from the account.

  - `storageHash`: _string_ - 32-byte SHA3 of the `storageRoot`.

  - `accountProof`: _array_ of _strings_ - List of RLP-encoded Merkle tree nodes, starting with the `stateRoot`.

  - `storageProof`: _array_ of _objects_ - List of storage entry objects.

    <Fields>

    - `key`: _string_ - Storage key.

    - `value`: _string_ - Storage value.

    - `proof`: _array_ of _strings_ - List of RLP-encoded Merkle tree nodes, starting with the `storageHash`.

    </Fields>

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getProof",
    "params": [
      "0a8156e7ee392d885d10eaa86afd0e323afdcd95",
      [
        "0x0000000000000000000000000000000000000000000000000000000000000347"
      ],
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
  "method": "eth_getProof",
  "params": [
    "0a8156e7ee392d885d10eaa86afd0e323afdcd95",
    [
      "0x0000000000000000000000000000000000000000000000000000000000000347"
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
  "id": 1,
  "result": {
    "accountProof": [
      "0xf90211a0...608d898380",
      "0xf90211a0...ec33f19580",
      "0xf901d1a0...9e55584480",
      "0xf8718080...18e5777142"
    ],
    "address": "0x0a8156e7ee392d885d10eaa86afd0e323afdcd95",
    "balance": "0x0",
    "codeHash": "0x2b6975dcaf69f9bb9a3b30bb6a37b305ce440250bf0dd2f23338cb18e5777142",
    "nonce": "0x5f",
    "storageHash": "0x917688de43091589aa58c1dfd315105bc9de4478b9ba7471616a4d8a43d46203",
    "storageProof": [
      {
        "key": "0x0000000000000000000000000000000000000000000000000000000000000347",
        "value": "0x0",
        "proof": [
          "0xf90211a0...5176779280",
          "0xf901f1a0...c208d86580",
          "0xf8d180a0...1ce6808080"
        ]
      }
    ]
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getStorageAt`

Returns the value of a storage position at a specified address.

### Parameters

- `address`: _string_ - 20-byte storage address.

- `index`: _string_ - Integer index of the storage position.

- `blockNumber` or `blockHash`: _string_ - (Optional) Hexadecimal integer representing a block
  number, block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or
  `safe`, as described in [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).
  The default is `latest`.

  :::note
  `pending` returns the same value as `latest`.
  :::

### Returns

- Value at the specified storage position.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getStorageAt",
    "params": [
      "0x‭3B3F3E‬",
      "0x0",
      "latest"
    ],
    "id": 53
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getStorageAt",
  "params": [
    "0x‭3B3F3E‬",
    "0x0",
    "latest"
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
  "result": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{account(address: \"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73\") {storage(slot: \"0x04\")}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  account(address: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73") {
    storage(slot: "0x04")
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "account": {
      "storage": "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getStorageValues`

Returns storage values for multiple slots across one or more accounts in a single call.
This is a batched version of [`eth_getStorageAt`](#eth_getstorageat).

### Parameters

- `storageRequest`: _object_ - Each key is a 20-byte account address
  and each value is an array of storage slot keys (as 32-byte hex strings).
  The maximum total number of storage slots across all addresses is 1024.

- `blockNumber` or `blockHash`: _string_ - (Optional) Hexadecimal integer representing a block number,
  block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or
  `safe`, as described in [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).
  The default is `latest`.

  :::note
  `pending` returns the same value as `latest`.
  :::

### Returns

- Each key is an account address and each value is an array of hex-encoded
  storage values in the same order as the requested slot keys.
  Unknown accounts return zero values for all requested slots.
  Key order in the response object is not guaranteed to match the request.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getStorageValues",
    "params": [
      {
        "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73": [
          "0x0",
          "0x1"
        ],
        "0x627306090abaB3A6e1400e9345bC60c78a8BEf57": [
          "0x0"
        ]
      },
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
  "method": "eth_getStorageValues",
  "params": [
    {
      "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73": [
        "0x0",
        "0x1"
      ],
      "0x627306090abaB3A6e1400e9345bC60c78a8BEf57": [
        "0x0"
      ]
    },
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
  "result": {
    "0x627306090abab3a6e1400e9345bc60c78a8bef57": [
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ],
    "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73": [
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ]
  }
}
```

</TabItem>

</Tabs>

---

## `eth_getTransactionCount`

Returns the number of transactions sent from a specified address. Use the `pending` tag to get the next account nonce not used by any pending transactions.

### Parameters

- `address`: _string_ - 20-byte account address.

- `blockNumber` or `blockHash`: _string_ - (Optional) Hexadecimal integer representing a block number, block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).
  The default is `latest`.

### Returns

- Integer representing the number of transactions sent from the specified address.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getTransactionCount",
    "params": [
      "0xc94770007dda54cF92009BFF0dE90c06F603a09f",
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
  "method": "eth_getTransactionCount",
  "params": [
    "0xc94770007dda54cF92009BFF0dE90c06F603a09f",
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
  "result": "0x1"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{ account (address:\"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73\"){transactionCount}}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  account(address: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73") {
    transactionCount
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "account": {
      "transactionCount": 5
    }
  }
}
```

</TabItem>

</Tabs>
