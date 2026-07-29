---
title: Submit methods
description: Besu ETH JSON-RPC API submit methods reference
sidebar_label: Submit
sidebar_position: 8
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

These methods submit signed transactions to the network.

:::info

Besu doesn't implement [`eth_sendTransaction`](../../../how-to/send-transactions.md).

[Web3Signer](https://docs.web3signer.consensys.net/) provides transaction signing and implements [`eth_sendTransaction`](https://docs.web3signer.consensys.net/reference/api/json-rpc#eth_sendtransaction).

:::

## `eth_sendRawTransaction`

Sends a [signed transaction](../../../how-to/send-transactions.md). A transaction can send ether, deploy a contract, or interact with a contract. Set the maximum transaction fee for transactions using the [`--rpc-tx-feecap`](../../options.md#rpc-tx-feecap) CLI option.

You can interact with contracts using `eth_sendRawTransaction` or [`eth_call`](execute.md#eth_call).

To avoid exposing your private key, create signed transactions offline and send the signed transaction data using `eth_sendRawTransaction`.

:::note

[Create and send transactions](../../../how-to/send-transactions.md) includes examples of creating signed transactions using the [web3.js](https://github.com/ethereum/web3.js/) library.

:::

### Parameters

- `transaction`: _string_ - Signed transaction serialized to hexadecimal format.

### Returns

- 32-byte transaction hash.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_sendRawTransaction",
    "params": [
      "0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_sendRawTransaction",
  "params": [
    "0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "mutation {sendRawTransaction(data: \"0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833\")}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
mutation {
  sendRawTransaction(data: "0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833")
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "sendRawTransaction": "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331"
  }
}
```

</TabItem>

</Tabs>
