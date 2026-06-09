---
sidebar_position: 2
description: Understand the Besu plugin lifecycle.
---

# Plugin lifecycle

A Besu plugin is a Java class that implements the `BesuPlugin` interface.
Besu discovers plugin JARs using Java's `ServiceLoader`, then calls the plugin lifecycle methods during 
startup, runtime, reload, and shutdown.

## Lifecycle methods

| Method | Purpose |
| --- | --- |
| `getName` | Returns the plugin name. Besu uses this name for plugin-specific actions. The default is the plugin class name. |
| `register(ServiceManager)` | Called early in the Besu lifecycle. Store the `ServiceManager` and perform early registration such as CLI options and RPC endpoints. |
| `beforeExternalServices` | Optional hook called after Besu loads configuration and before external services (like metrics and HTTP) start. |
| `start` | Called after Besu loads configuration and starts external services, but before the main loop is up. Start runtime work here. |
| `afterExternalServicePostMainLoop` | Optional hook called after external services and main-loop setup. |
| `reloadConfiguration` | Optional hook called by the `plugins_reloadPluginConfig` RPC method. Implement it only for configuration that can be reloaded safely. |
| `stop` | Called when Besu shuts down or disables the plugin. Remove listeners and stop background work here. |
| `getVersion` | Returns plugin version information from package implementation metadata. |

## Lifecycle diagram

The following sequence diagram shows where plugin discovery and lifecycle callbacks fit into Besu startup,
normal execution, and shutdown.

<p align="center">

```mermaid
sequenceDiagram
    participant Besu

    Besu->>Besu: Basic startup
    create participant Loader as Java ServiceLoader
    Besu->>Loader: Discover plugin providers
    create participant Plugin as Besu plugin
    Loader->>Plugin: Create plugin instances
    destroy Loader
    Loader->>Besu: Return BesuPlugin<br/>implementations

    loop For each plugin
        Besu->>Plugin: register(ServiceManager)
        Plugin->>Besu: Register CLI options and RPC endpoints
    end

    Besu->>Besu: Full startup

    loop For each plugin
        Besu->>Plugin: start
        Plugin->>Besu: Register listeners, metrics, and runtime work
    end

    Besu->>Besu: Normal execution

    loop For each plugin
        Besu->>Plugin: stop
        Plugin->>Besu: Remove listeners and clean up resources
    end
```

</p>

## Service availability

Besu services are available at different parts of the plugin lifecycle.
Some are available and used in `register` before startup completes, and others interact with live data and are used in `start`.

`PicoCLIOptions` and `RpcEndpointService` must be used in `register`.

The following services are typically used in `register`:

- `BesuConfiguration`
- `MetricCategoryRegistry`
- `PermissioningService`
- `SecurityModuleService`
- `TransactionPoolValidatorService`
- `TransactionSelectionService`
- `TransactionValidatorService`

`BlockchainService` and `TransactionSimulationService` are available at `register`, but typically used in `start`.

The remaining services only become available at `start`:

- `BesuEvents`
- `BftQueryService`
- `BlockSimulationService`
- `MetricsSystem`
- `MiningService`
- `P2PService`
- `PoaQueryService`
- `RlpConverterService`
- `SynchronizationService`
- `TraceService`
- `TransactionPoolService`
- `WorldStateService`
