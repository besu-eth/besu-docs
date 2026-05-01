---
title: Use JSON-RPC over HTTP, WS, and IPC
sidebar_position: 1
description: How to access the Besu API using JSON-RPC
---

import Postman from '../../../global/postman.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Use JSON-RPC over HTTP, WebSocket, and IPC

JSON-RPC APIs allow you to interact with your node. JSON-RPC endpoints are not enabled by default.

:::caution

You should secure access to your node's JSON-RPC endpoints. Users with access to your node via JSON-RPC can make calls directly to your node, causing your node to consume resources.

:::

To enable JSON-RPC over HTTP or WebSocket, use the [`--rpc-http-enabled`](../../reference/cli/options.md#rpc-http-enabled) and [`--rpc-ws-enabled`](../../reference/cli/options.md#rpc-ws-enabled) options.

To enable JSON-RPC over an [IPC socket](index.md#socket-path), use the `--Xrpc-ipc-enabled` option.

:::caution

`--Xrpc-ipc-enabled` is an early access option.

:::

Subscription methods (`eth_subscribe`, `eth_unsubscribe`) are supported over IPC as well as WebSocket, but not over HTTP. See [RPC Pub/Sub over WebSockets and IPC](rpc-pubsub.md).

<Postman />

## Geth console

The geth console is a REPL (Read, Evaluate, & Print Loop) JavaScript console. Use JSON-RPC APIs supported by geth and Besu directly in the console.

To use the geth console with Besu:

1. Start Besu with the [`--rpc-http-enabled`](../../reference/cli/options.md#rpc-http-enabled) or `--Xrpc-ipc-enabled` 
option.

2. Specify which APIs to enable using the [`--rpc-http-api`](../../reference/cli/options.md#rpc-http-api) or 
`--Xrpc-ipc-api` option.

3. Start the geth console specifying the JSON-RPC endpoint:

    <Tabs>
    
    <TabItem value="HTTP endpoint" label="HTTP endpoint" default>
    
    ```bash
    geth attach http://localhost:8545
    ```
    
    </TabItem>
    
    <TabItem value="IPC endpoint" label="IPC endpoint">
    
    ```bash
    geth attach /path/to/besu.ipc
    ```
    
    </TabItem>
    
    </Tabs>

4. Use the geth console to call [JSON-RPC API methods](../../reference/api/index.md) that geth and Besu share.

    ```bash
    eth.syncing
    ```

## JSON-RPC authentication

Besu disables [Authentication](authenticate.md) by default.

## HTTP and WebSocket requests

### HTTP

To make RPC requests over HTTP, you can use [`curl`](https://curl.haxx.se/download.html).

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","id":<request-ID>,"method":"<method-name>","params":[<method-parameters>]}' <JSON-RPC-http-endpoint:port> -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="curl HTTP request" label="curl HTTP request">

```bash
curl -X POST --data '{"jsonrpc":"2.0","id":"1","method":"eth_blockNumber","params":[]}' http://127.0.0.1:8555/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": "0x60e"
}
```

</TabItem>

</Tabs>

You can use `curl` to make multiple RPC requests (batch requests) over HTTP at the same time. Send the requests as an array, and receive an array of responses. The default number of allowed requests in a RPC batch request is `1024`. Use the [`--rpc-http-max-batch-size`](../../reference/cli/options.md#rpc-http-max-batch-size) command line option to update the default value.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '[{"jsonrpc":"2.0","id":"1","method":"eth_blockNumber","params":[]}, {"jsonrpc":"2.0","id":"2","method":"admin_peers","params":[]}]' http://127.0.0.1:8555/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
[
  {
    "jsonrpc": "2.0",
    "id": "1",
    "result": "0x60e"
  },
  {
    "jsonrpc": "2.0",
    "id": "2",
    "result": []
  }
]
```

</TabItem>

</Tabs>

### WebSocket

To make RPC requests over WebSocket, you can use [`wscat`](https://github.com/websockets/wscat), a Node.js based command-line tool.

First connect to the WebSocket server using `wscat` (you only need to connect once per session):

```bash
wscat -c ws://<JSON-RPC-ws-endpoint:port>
```

After you establish a connection, the terminal displays a '>' prompt. Send individual requests as a JSON data package at each prompt.

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
{"jsonrpc":"2.0","id":<request-ID>,"method":"<method-name>","params":[<method-parameters>]}
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","id":"1","method":"eth_blockNumber","params":[]}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": "0x23"
}
```

</TabItem>

</Tabs>

You can use `wscat` to make multiple RPC requests over WebSocket at the same time. Send the requests as an array, and receive an array of responses.

<Tabs>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
[{"jsonrpc":"2.0","id":"1","method":"eth_blockNumber","params":[]}, {"jsonrpc":"2.0","id":"2","method":"admin_peers","params":[]}]
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
[
  {
    "jsonrpc": "2.0",
    "id": "1",
    "result": "0x23"
  },
  {
    "jsonrpc": "2.0",
    "id": "2",
    "result": []
  }
]
```

</TabItem>

</Tabs>

:::note

`wscat` does not support headers. [Authentication](authenticate.md) requires you to pass an authentication token in the request header. To use authentication with WebSocket, you need an app that supports headers.

:::

## Readiness and liveness endpoints

Besu provides readiness and liveness endpoints to confirm the Besu node status. Both return a `200 OK` status when ready or live and a `503 Service Unavailable` status if not ready or live.

### Readiness

By default, the readiness check requires a connected peer and the node to be within two blocks of the best known block. If you have [disabled P2P communication](../../reference/cli/options.md#p2p-enabled), you do not need peers. A live node with P2P disabled is always ready.

Use the query parameters `minPeers` and `maxBlocksBehind` to adjust the number of peers required and the number of blocks tolerance.

<Tabs>

<TabItem value="Readiness endpoint" label="Readiness endpoint" default>

```bash
http://<JSON-RPC-HTTP-endpoint:port>/readiness
```

</TabItem>

<TabItem value="curl request example" label="curl request example">

```bash
curl -v 'http://localhost:8545/readiness'
```

</TabItem>

<TabItem value="Query parameters example" label="Query parameters example">

```bash
curl -v 'http://localhost:8545/readiness?minPeers=0&maxBlocksBehind=10'
```

</TabItem>

</Tabs>

### Liveness

The liveness check requires the JSON-RPC server to be up. You can use the endpoint to verify that the node can respond to RPC calls. The status in the response will always be `UP`.

<Tabs>

<TabItem value="Liveness endpoint" label="Liveness endpoint" default>

```bash
http://<JSON-RPC-HTTP-endpoint:port>/liveness
```

</TabItem>

<TabItem value="curl request example" label="curl request example">

```bash
curl -v 'http://localhost:8545/liveness'
```

</TabItem>

</Tabs>

## API methods enabled by default

Besu enables the `ETH`, `NET`, and `WEB3` API methods by default.

To enable the `ADMIN`, `DEBUG`, `EEA`, `IBFT`, `MINER`, `PERM`, `PLUGINS`, `PRIV`, `TRACE`, and `TXPOOL` API methods, use the [`--rpc-http-api`](../../reference/cli/options.md#rpc-http-api), [`--rpc-ws-api`](../../reference/cli/options.md#rpc-ws-api), or `--Xrpc-ipc-api` options.

:::caution

`--Xrpc-ipc-api` is an early access option.

:::

## Block parameter

When you make requests that might have different results depending on the block accessed, the block
parameter specifies the block.
Methods such as [`eth_getTransactionByBlockNumberAndIndex`](../../reference/api/index.md#eth_gettransactionbyblocknumberandindex)
have a block parameter.

The block parameter can have one of the following values:

- `blockNumber` : _quantity_ - The block number, specified in hexadecimal.
  `0` represents the genesis block.
- `blockHash` : _string_ or _object_ - 32-byte block hash or JSON object specifying the block hash.
  If using a JSON object, you can specify `requireCanonical` to indicate whether the block must be a
  canonical block.
  See [this example](https://github.com/hyperledger/besu/blob/a2dedb0b2c7980cdc35db8eb4c094f2eb0dc7deb/ethereum/api/src/test/resources/org/hyperledger/besu/ethereum/api/jsonrpc/eth/eth_getBalance_blockHashObjectCanonical.json).

  :::note

  Only the following methods support the `blockHash` parameter:

  - [`eth_call`](../../reference/api/index.md#eth_call)
  - [`eth_getBalance`](../../reference/api/index.md#eth_getbalance)
  - [`eth_getCode`](../../reference/api/index.md#eth_getcode)
  - [`eth_getProof`](../../reference/api/index.md#eth_getproof)
  - [`eth_getStorageAt`](../../reference/api/index.md#eth_getstorageat)
  - [`eth_getTransactionCount`](../../reference/api/index.md#eth_gettransactioncount)

  :::

- `earliest` : _tag_ - The earliest (genesis) block.
- `latest` : _tag_ - The most recent block.
- `pending` : _tag_ - The next anticipated block, except in the following cases:
  - For some methods (specified in their parameter description), `pending` returns the
    same value as `latest`.
  - For [`eth_getTransactionCount`](../../reference/api/index.md#eth_gettransactioncount),
    `pending` refers to the most recent block plus pending transactions.
  - For [`qbft_getValidatorsByBlockNumber`](../../../private-networks/reference/api.md#qbft_getvalidatorsbyblocknumber),
    `pending` returns a list of validators that will be used to produce the next block.
- `finalized` : _tag_ - The most recent crypto-economically secure block.
  It cannot be reorganized outside manual intervention driven by community coordination.
- `safe` : _tag_ - The most recent block that is safe from reorganization under honest majority and
  certain synchronicity assumptions.
