---
title: WEB3 methods
description: Besu WEB3 JSON-RPC API methods reference
sidebar_label: WEB3
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `WEB3` methods

The `WEB3` API methods provide functionality for the Ethereum ecosystem.

## `web3_clientVersion`

Returns the current client version.

### Parameters

- None

### Returns

- Current client version.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "web3_clientVersion",
    "params": [],
    "id": 1
  }'
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "web3_clientVersion",
  "params": [],
  "id": 1
}
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": "besu/<version>"
}
```

</TabItem>
</Tabs>

---

## `web3_sha3`

Returns a [SHA3](https://en.wikipedia.org/wiki/SHA-3) hash of the specified data. The result value is a [Keccak-256](https://keccak.team/keccak.html) hash, not the standardized SHA3-256.

### Parameters

- `data`: _string_ - Data to convert to a SHA3 hash.

### Returns

- SHA3 result of the input data.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "web3_sha3",
    "params": [
      "0x68656c6c6f20776f726c00"
    ],
    "id": 53
  }'
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "web3_sha3",
  "params": [
    "0x68656c6c6f20776f726c00"
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
  "result": "0x5e39a0a66544c0668bde22d61c47a8710000ece931f13b84d3b2feb44ec96d3f"
}
```

</TabItem>
</Tabs>
