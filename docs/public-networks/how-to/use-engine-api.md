---
title: Use the Engine API
sidebar_position: 2
description: Use the Engine API to communicate with a consensus client.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Use the Engine API

[Consensus and execution clients](../concepts/node-clients.md#execution-and-consensus-clients) communicate with each other using the [Engine API](../reference/engine-api/index.md). These API methods are a separate subsection of the [JSON-RPC API](../how-to/use-besu-api/index.md).

## Configure the Engine API

The Engine API is enabled by default even if no consensus client configuration exists. You can configure the Engine API to:

- Specify the [service ports](#service-ports).
- Specify the [host allowlist](#host-allowlist).

```bash title="Example Engine API configuration"
besu --engine-rpc-port=8551 --engine-host-allowlist=localhost,127.0.0.1 --engine-jwt-secret=jwt.hex
```


### Service ports

To specify the port the Engine API service listens on for HTTP and WebSocket, use the [`--engine-rpc-port`](../reference/cli/options.md#engine-rpc-port) option. The default is `8551`. This option is useful when you have another execution engine running on port 8551, in which case you can specify Besu to use another port, for example, `--engine-rpc-port 8552`.

### Host allowlist

To prevent DNS rebinding attacks, Besu checks incoming HTTP request host headers, WebSocket connections, and GraphQL requests. Besu accepts requests only when hostnames specified using the [`--engine-host-allowlist`](../reference/cli/options.md#engine-host-allowlist) option matches the request host headers. By default, Besu accepts requests and connections from `localhost` and `127.0.0.1`.

:::info

This isn't a permissioning feature. To restrict access to the Engine API, we recommend using [authentication](#authentication).

:::

If your application publishes RPC ports, specify the hostnames when starting Besu.

Specify `*` for `--engine-host-allowlist` to effectively disable host protection.

:::caution

We don't recommend specifying `*` for `--engine-host-allowlist` in production.

:::

## Authentication

By default, [authentication](../how-to/use-besu-api/authenticate.md) for the Engine API is enabled. To disable, set the [`--engine-jwt-disabled`](../reference/cli/options.md#engine-jwt-disabled) option to `true`.

:::caution

Don't disable JWT authentication in production environments.

Disable only for testing purposes.

:::

Set the [JWT secret](use-besu-api/authenticate.md#jwt-public-key-authentication) by using the [`--engine-jwt-secret`](../reference/cli/options.md#engine-jwt-secret) option.

## Send a payload using the Engine API

### 1. Prepare a payload

Prepare to send a payload using [`engine_forkchoiceUpdatedV1`](../reference/engine-api/index.md#engine_forkchoiceupdatedv1).

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"engine_forkchoiceUpdatedV1","params":[{"headBlockHash": "0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a", "safeBlockHash": "0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a", "finalizedBlockHash": "0x0000000000000000000000000000000000000000000000000000000000000000"},{"timestamp": "0x5","prevRandao": "0x0000000000000000000000000000000000000000000000000000000000000000","suggestedFeeRecipient": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b"}],"id":67}' http://127.0.0.1:8550
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 67,
  "result": {
    "payloadStatus": {
      "status": "VALID",
      "latestValidHash": "0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a",
      "validationError": null
    },
    "payloadId": "0x0000000021f32cc1"
  }
}
```

</TabItem>

</Tabs>

### 2. Get the payload

Get the payload using [`engine_getPayloadV1`](../reference/engine-api/index.md#engine_getpayloadv1)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"engine_getPayloadV1","params":["0x1"],"id":1}' http://127.0.0.1:8550
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "parentHash": "0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a",
    "feeRecipient": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
    "stateRoot": "0xca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45",
    "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "prevRandao": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "blockNumber": "0x1",
    "gasLimit": "0x1c9c380",
    "gasUsed": "0x0",
    "timestamp": "0x5",
    "extraData": "0x",
    "baseFeePerGas": "0x7",
    "blockHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858",
    "transactions": []
  }
}
```

</TabItem>

</Tabs>

### 3. Execute the payload

Execute the payload using [`engine_newPayloadV1`](../reference/engine-api/index.md#engine_newpayloadv1)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"engine_newPayloadV1","params":[
  {
    "parentHash": "0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a",
    "feeRecipient": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
    "stateRoot": "0xca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45",
    "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "prevRandao": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "blockNumber": "0x1",
    "gasLimit": "0x1c9c380",
    "gasUsed": "0x0",
    "timestamp": "0x5",
    "extraData": "0x",
    "baseFeePerGas": "0x7",
    "blockHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858",
    "transactions": []
  }
],"id":67}' http://127.0.0.1:8550
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "status": "VALID",
    "latestValidHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858",
    "validationError": null
  }
}
```

</TabItem>

</Tabs>

### 4. Update the fork choice

Update the fork choice using [`engine_forkchoiceUpdatedV1`](../reference/engine-api/index.md#engine_forkchoiceupdatedv1) again.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"engine_forkchoiceUpdatedV1","params":[{"headBlockHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858", "safeBlockHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858", "finalizedBlockHash": "0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a"},null],"id":67}' http://127.0.0.1:8550
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 67,
  "result": {
    "payloadStatus": {
      "status": "VALID",
      "latestValidHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858",
      "validationError": null
    },
    "payloadId": null
  }
}
```

</TabItem>

</Tabs>
