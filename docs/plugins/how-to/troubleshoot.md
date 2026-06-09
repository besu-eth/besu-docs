---
sidebar_position: 5
description: Troubleshoot common issues.
---

# Troubleshoot

Troubleshoot common plugin development issues.

## Plugin does not load

Check that:

- The plugin JAR is in Besu's `plugins` directory.
- The JAR contains a `META-INF/services/org.hyperledger.besu.plugin.BesuPlugin` entry.
- The service provider entry contains the fully qualified plugin implementation class name.
- The plugin class is available in the JAR.
- If you use `--plugins`, the value matches the plugin implementation class simple name.

## Service is missing

[`ServiceManager.getService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/ServiceManager.html) returns `Optional` because services can be unavailable.
A service might be missing because:

- The service is not available in the current lifecycle phase.
- The Besu version does not include the service.
- The current Besu configuration does not provide the service.

Handle missing services explicitly.
Only fail startup when the missing service is required for a user-requested plugin feature.

## RPC method returns `Method not found`

For custom RPC endpoints, check that:

- The plugin registers the endpoint in `register`.
- The namespace and function name are alphanumeric.
- The JSON-RPC API list enables the plugin namespace with `--rpc-http-api` or `--rpc-ws-api`.

Besu exposes plugin RPC methods as `<namespace>_<functionName>`.

## Plugin loads but has no effect

Check [lifecycle timing](../get-started/plugin-lifecycle.md):

- Register CLI options and RPC endpoints in `register`.
- Start listeners, metrics, and background work in `start`.
- Remove listeners and stop background work in `stop`.
