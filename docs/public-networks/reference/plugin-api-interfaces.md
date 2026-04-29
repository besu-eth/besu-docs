---
title: Plugin API interfaces
sidebar_position: 4
description: Plugin interfaces
---

# Plugin API interfaces

API interfaces in Besu allow users to [build plugins](../concepts/plugins.md) to extend Besu's functionality.

For more information about the available interfaces, see the [Plugin API Javadoc](https://javadoc.io/doc/org.hyperledger.besu/plugin-api/latest/index.html).

:::note Javadoc issue

The plugin API documentation is currently not being updated. We're working on a fix, but in the meantime, some links are temporarily pointing to wiki.hyperledger.org.

:::

## Core plugin classes

The following table lists the interfaces providing core plugin classes.

| Interface | Description |
| --- | --- |
| [**ServiceManager**](https://wiki.hyperledger.org/display/BESU/BesuContext) | Allows plugins to access Besu services. |
| [**BesuPlugin**](https://javadoc.io/doc/org.hyperledger.besu/plugin-api/latest/org/hyperledger/besu/plugin/BesuPlugin.html) | Used to manage the plugin lifecycle. |

## Plugin services

The following table lists interfaces providing services you can retrieve.

| Interface | Description |
| --- | --- |
| [**BesuEvents**](https://javadoc.io/doc/org.hyperledger.besu/plugin-api/latest/org/hyperledger/besu/plugin/services/BesuEvents.html) | Allows plugins to attach to events during Besu operation. |
| [**BesuConfiguration**](https://javadoc.io/doc/org.hyperledger.besu/plugin-api/latest/org/hyperledger/besu/plugin/services/BesuConfiguration.html) | Provides file system locations of Besu's storage. |
| [**IbftQueryService**](https://javadoc.io/doc/org.hyperledger.besu/plugin-api/latest/org/hyperledger/besu/plugin/services/query/IbftQueryService.html) | Allows query of the IBFT 2.0 aspects of the blockchain. |
| [**MetricCategoryRegistry**](https://javadoc.io/doc/org.hyperledger.besu/plugin-api/latest/org/hyperledger/besu/plugin/services/metrics/MetricCategoryRegistry.html) | Adds a new metrics category to the CLI. |
| [**MetricsSystem**](https://javadoc.io/doc/org.hyperledger.besu/plugin-api/latest/org/hyperledger/besu/plugin/services/MetricsSystem.html) | Register metrics with the Prometheus endpoint. |
| [**PoaQueryService**](https://javadoc.io/doc/org.hyperledger.besu/plugin-api/latest/org/hyperledger/besu/plugin/services/query/PoaQueryService.html) | Query the current state of the IBFT 2.0 consensus protocol. |
| [**PicoCLIOptions**](https://javadoc.io/doc/org.hyperledger.besu/plugin-api/latest/org/hyperledger/besu/plugin/services/PicoCLIOptions.html) | Adds CLI commands to the Besu command line. |
| [**SecurityModuleService**](https://javadoc.io/doc/org.hyperledger.besu/plugin-api/latest/org/hyperledger/besu/plugin/services/SecurityModuleService.html) | Allows plugins to register a security module. |
| [**StorageService**](https://javadoc.io/doc/org.hyperledger.besu/plugin-api/latest/org/hyperledger/besu/plugin/services/StorageService.html) | Allows plugins to register as a storage engine. For example, to connect to a hardware security module (HSM). |
| [**PermissioningService**](https://wiki.hyperledger.org/display/BESU/PermissioningService) | Allows for fine grain control of node connection and node messaging permissioning. |
| [**RpcEndpointService**](https://wiki.hyperledger.org/display/BESU/RpcEndpointService) | Register custom RPC endpoints. |

To use the interfaces in your plugin, ensure the [Gradle build file](https://github.com/ConsenSys/PluginsAPIDemo/blob/957628b3c6f533f3c3f405e2a17e369cd1f02c31/build.gradle) contains the `https://hyperledger.jfrog.io/hyperledger/besu-maven` repository and the `plugin-api` dependency.

:::warning Known issue

As indicated in [issue #406](https://github.com/hyperledger/besu-docs/issues/406), plugins may need to access the parsed command line during registration, but the command line is not yet initialized at this stage.

It's in our roadmap to improve lifecycle steps and provide additional visibility for some data. A workaround is to create a supplier during the `register` step and store it in memory.

The `start` step can be ignored and your plugin module will be instantiated when the command line interface is parsed and available.

:::
