---
title: PLUGINS methods
description: Besu PLUGINS JSON-RPC API methods reference
sidebar_label: PLUGINS
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `PLUGINS` methods

The `PLUGINS` API methods provide plugin-related functionality.

:::note

The `PLUGINS` API is not enabled by default for JSON-RPC.
Enable it using the [`--rpc-http-api`](../options.md#rpc-http-api) or [`--rpc-ws-api`](../options.md#rpc-ws-api) option.

:::

## `plugins_reloadPluginConfig`

When you call this method without parameters, all plugins are reloaded. If you specify names, only 
those plugins are reloaded. This method awaits all reloads before returning its result. 

### Parameters

- `plugin`: _string_ - (Optional) Plugin name.

### Returns

- `Success` if the plugins reload.
  If one or more plugins fail, the error response provides a comma-separated list of `<pluginName>:success` or `<pluginName>:failure (reason)`.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "plugins_reloadPluginConfig",
    "params": [
      "tech.pegasys.plus.plugin.kafka.KafkaPlugin"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "plugins_reloadPluginConfig",
  "params": [
    "tech.pegasys.plus.plugin.kafka.KafkaPlugin"
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
  "result": "Success"
}
```

</TabItem>

</Tabs>
