---
sidebar_position: 2
description: Besu JSON-RPC API methods reference
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Besu JSON-RPC API reference

The Besu JSON-RPC API methods are grouped by namespace:

| Namespace | Description |
| --- | --- |
| [`ADMIN`](admin.md) | Administrative functionality to manage your node. |
| [`DEBUG`](debug/index.md) | Inspect and debug the network. |
| [`ETH`](eth/index.md) | Interact with the blockchain, including querying blocks, transactions, logs, and account state. |
| [`MINER`](miner.md) | Control the node's block creation settings. |
| [`NET`](net.md) | Network-related information. |
| [`PLUGINS`](plugins.md) | Plugin-related functionality. |
| [`TRACE`](trace.md) | Concise alternative to the `DEBUG` API for tracing transactions. |
| [`TXPOOL`](txpool.md) | Inspect the contents of the transaction pool. |
| [`WEB3`](web3.md) | Functionality for the Ethereum ecosystem. |

:::caution Important

- This reference contains API methods that apply to both public and private networks. For private-network-specific API methods, see the [private network API reference](../../../private-networks/reference/api.md).
- All JSON-RPC HTTP examples use the default host and port endpoint `http://127.0.0.1:8545`. If using the [--rpc-http-host](../cli/options.md#rpc-http-host) or [--rpc-http-port](../cli/options.md#rpc-http-port) options, update the endpoint.
- Most example requests are made against private networks. Depending on network configuration and activity, your example results might be different.

:::

## Miscellaneous methods

### `rpc_modules`

Lists [enabled APIs](../../how-to/use-besu-api/json-rpc.md#api-methods-enabled-by-default) and the version of each.

#### Parameters

- None

#### Returns

- Enabled APIs and their versions.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "rpc_modules",
    "params": [],
    "id": 1
  }'
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "rpc_modules",
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
    "web3": "1.0",
    "eth": "1.0",
    "net": "1.0"
  }
}
```

</TabItem>
</Tabs>
