---
title: PLUGINS methods
description: Besu PLUGINS JSON-RPC API methods reference
sidebar_label: PLUGINS
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The `PLUGINS` API methods provide plugin-related functionality.

:::note

The `PLUGINS` API methods are not enabled by default for JSON-RPC. To enable the `PLUGINS` API methods, 
use the [`--rpc-http-api`](../cli/options.md#rpc-http-api) or 
[`--rpc-ws-api`](../cli/options.md#rpc-ws-api) options.

:::

## `plugins_reloadPluginConfig`

When you call this method without parameters, all plugins are reloaded. If you specify names, only 
those plugins are reloaded. This method awaits all reloads before returning its result. 

### Parameters

- `plugin`: _string_ - (optional) plugin name

### Returns

`result`: _string_ - `Success`

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"plugins_reloadPluginConfig","params":["tech.pegasys.plus.plugin.kafka.KafkaPlugin"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "plugins_reloadPluginConfig",
  "params": ["tech.pegasys.plus.plugin.kafka.KafkaPlugin"],
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

:::note

If one or more plugins fail, the error response provides a comma-separated list of `pluginName`:success or 
`pluginName`:failure (reason).

:::

</TabItem>

</Tabs>
