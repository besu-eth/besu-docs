---
title: NET methods
description: Besu NET JSON-RPC API methods reference
sidebar_label: NET
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `NET` methods

The `NET` API methods provide network-related information.

## `net_enode`

Returns the [enode URL](../../concepts/node-keys.md#enode-url).

### Parameters

- None

### Returns

- [Enode URL](../../concepts/node-keys.md#enode-url) of the node.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "net_enode",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "net_enode",
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
  "result": "enode://6a63160d0ccef5e4986d270937c6c8d60a9a4d3b25471cda960900d037c61988ea14da67f69dbfb3497c465d0de1f001bb95598f74b68a39a5156a608c42fa1b@127.0.0.1:30303"
}
```

</TabItem>

</Tabs>

---

## `net_listening`

Whether the client is actively listening for network connections.

### Parameters

- None

### Returns

- Indicates if the client is actively listening for network connections.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "net_listening",
    "params": [],
    "id": 53
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "net_listening",
  "params": [],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": true
}
```

</TabItem>

</Tabs>

---

## `net_peerCount`

Returns the number of peers currently connected to the client.

### Parameters

- None

### Returns

- Number of connected peers in hexadecimal.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "net_peerCount",
    "params": [],
    "id": 53
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "net_peerCount",
  "params": [],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": "0x5"
}
```

</TabItem>

</Tabs>

---

## `net_services`

Returns enabled services (for example, `jsonrpc`) and the host and port for each service.

:::note

The [`--nat-method`](../options.md#nat-method) setting affects the JSON-RPC and P2P host and port values, but not the metrics host and port values.

:::

### Parameters

- None

### Returns

- Enabled services.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "net_services",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "net_services",
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
    "jsonrpc": {
      "host": "127.0.0.1",
      "port": "8545"
    },
    "p2p": {
      "host": "127.0.0.1",
      "port": "30303"
    },
    "metrics": {
      "host": "127.0.0.1",
      "port": "9545"
    }
  }
}
```

</TabItem>

</Tabs>

---

## `net_version`

Returns the [network ID](../../concepts/network-and-chain-id.md).

### Parameters

- None

### Returns

- Current network ID.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "net_version",
    "params": [],
    "id": 53
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "net_version",
  "params": [],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result for Mainnet" label="JSON result for Mainnet">

```json
{
  "jsonrpc": "2.0",
  "id": 51,
  "result": "1"
}
```

</TabItem>

</Tabs>
