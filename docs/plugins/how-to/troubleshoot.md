---
sidebar_position: 6
description: Troubleshoot common issues.
---

# Troubleshoot

Use this page to narrow down common plugin development issues.

## Plugin does not load

Check that:

- The plugin JAR is in Besu's `plugins` directory.
- The JAR contains a `META-INF/services/org.hyperledger.besu.plugin.BesuPlugin` entry.
- The service provider entry contains the fully qualified plugin implementation class name.
- The plugin class is available in the JAR.
- If you use `--plugins`, the value matches the plugin implementation class simple name.

## Service is missing

`ServiceManager.getService(...)` returns `Optional` because services can be unavailable. A service
might be missing because:

- The service is not available in the current lifecycle phase.
- The Besu version does not include the service.
- The current Besu configuration does not provide the service.

Handle missing services explicitly. Only fail startup when the missing service is required for a
user-requested plugin feature.

## RPC method returns `Method not found`

For custom RPC endpoints, check that:

- The plugin registers the endpoint in `register()`.
- The namespace and function name are alphanumeric.
- The JSON-RPC API list enables the plugin namespace with `--rpc-http-api` or `--rpc-ws-api`.

Besu exposes plugin RPC methods as `<namespace>_<functionName>`.

## Plugin loads but has no effect

Check lifecycle timing. Register CLI options and RPC endpoints in `register()`. Start listeners,
metrics, and background work in `start()`. Remove listeners and stop background work in `stop()`.

## Reload does not affect the plugin

Check that:

- The plugin overrides `reloadConfiguration()`.
- The `PLUGINS` JSON-RPC API is enabled.
- The reload request uses the plugin name returned by `getName()`, or no parameter to reload all
  plugins.
- The setting being changed is designed to be reloadable.

## Besu reports plugin verification warnings

Check the plugin package and dependency set. If you need Besu to stop on verification failure, run
with
[`--plugins-verification-mode=FULL`](../../public-networks/reference/cli/options.md#plugins-verification-mode).
