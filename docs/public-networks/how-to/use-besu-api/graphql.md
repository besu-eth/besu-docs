---
title: Use GraphQL over HTTP
sidebar_position: 3
description: How to access the Besu API using GraphQL
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Use GraphQL over HTTP

GraphQL can reduce the overhead needed for common queries.
For example, instead of querying each receipt in a block, GraphQL can get the same result with a
single query for the entire block.

The [Besu GraphQL schema] describes the GraphQL implementation for Ethereum.
Enable the GraphQL service using [command line options](index.md#enable-api-access).

:::note

GraphQL is not supported over WebSocket.

:::

Access the GraphQL endpoint at `http://<HOST>:<PORT>/graphql`.
Configure `<HOST>` and `<PORT>` using [`graphql-http-host`](../../reference/cli/options.md#graphql-http-host)
and [`graphql-http-port`](../../reference/cli/options.md#graphql-http-port).
The default endpoint is `http://127.0.0.1:8547/graphql`.

## GraphQL requests with cURL

[Besu JSON-RPC API methods](../../reference/api/index.md) with an equivalent
[GraphQL](graphql.md) query include a GraphQL request and result in the method example.

For example, the following request returns the block number:

<Tabs>
<TabItem value="Request" label="Request" default>

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block{number}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="Response" label="Response">

```json
{
  "data" : {
    "block" : {
      "number" : "0x281"
    }
  }
}
```

</TabItem>

</Tabs>
The following request returns the gas price:

<Tabs>
<TabItem value="Request" label="Request" default>

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{gasPrice}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="Response" label="Response">

```json
{
  "data" : {
    "gasPrice" : "0x0"
  }
}
```

</TabItem>

</Tabs>
The following [`syncing`](../../reference/api/index.md#eth_syncing) request returns data about the
synchronization status:

<Tabs>
<TabItem value="Request" label="Request" default>

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{syncing{startingBlock currentBlock highestBlock}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="Response" label="Response">

```json
{
  "data" : {
    "syncing" : {
      "startingBlock" : 665,
      "currentBlock" : 3190,
      "highestBlock" : 26395
    }
  }
}
```

</TabItem>

</Tabs>
:::info note
In some cases, for example, when your node is fully synced, the syncing request returns a `null` response:

```json
{
  "data" : {
    "syncing" : null
  }
}
```
:::

## GraphQL requests with GraphiQL app

The third-party tool, [GraphiQL](https://github.com/skevy/graphiql-app), provides a tabbed interface
for editing and testing GraphQL queries and mutations.
GraphiQL also provides access to the [Besu GraphQL schema] from within the app.

![GraphiQL](../../../assets/images/GraphiQL.png)

## Pending

`transactionCount` and `transactions` supports the Pending query.

:::info

Besu does not execute pending transactions so results from `account`, `call`, and `estimateGas` for
Pending do not reflect pending transactions.

:::

<Tabs>
<TabItem value="Pending transactions" label="Pending transactions" default>

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{pending {transactionCount}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="Result" label="Result">

```json
{
  "data": {
    "pending": {
      "transactionCount": 2
    }
  }
}
```

</TabItem>

</Tabs>
<Tabs>
<TabItem value="Pending transactions" label="Pending transactions" default>

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{pending {transactions{hash}}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="Result" label="Result">

```json
{
  "data": {
    "pending": {
      "transactions": [
        {
          "hash": "0xbb3ab8e2113a4afdde9753782cb0680408c0d5b982572dda117a4c72fafbf3fa"
        },
        {
          "hash": "0xf6bd6b1bccf765024bd482a71c6855428e2903895982090ab5dbb0feda717af6"
        }
      ]
    }
  }
}
```

</TabItem>

</Tabs>
<!-- Links -->

[Besu GraphQL schema]: https://github.com/hyperledger/besu/blob/750580dcca349d22d024cc14a8171b2fa74b505a/ethereum/api/src/main/resources/schema.graphqls
