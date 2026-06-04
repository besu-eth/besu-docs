---
sidebar_position: 3
description: Reload plugin configuration at runtime.
---

# Reload plugin configuration

Implement `reloadConfiguration()` when a plugin can safely reload configuration without restarting
Besu.

```java
@Override
public CompletableFuture<Void> reloadConfiguration() {
  // Reload plugin-owned configuration here.
  return CompletableFuture.completedFuture(null);
}
```

Besu calls this method through the
[`plugins_reloadPluginConfig`](../../public-networks/reference/api/index.md#plugins_reloadpluginconfig)
JSON-RPC method. The method is part of the `PLUGINS` API, which is not enabled by default. Enable it
with [`--rpc-http-api`](../../public-networks/reference/cli/options.md#rpc-http-api) or
[`--rpc-ws-api`](../../public-networks/reference/cli/options.md#rpc-ws-api).

Calling `plugins_reloadPluginConfig` without parameters reloads all plugins. Supplying a plugin name
reloads only that plugin. Besu matches reload names against `BesuPlugin.getName()`.

Only reload values that your plugin can apply safely while Besu is running. Leave startup-only
settings unchanged until the next restart, and document them as non-reloadable.
