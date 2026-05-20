---
title: Extend Besu using plugins
sidebar_position: 1
sidebar_label: Introduction
id: index
description: Besu plugins overview
---

# Extend Hyperledger Besu using plugins

You can extend Hyperledger Besu's functionality by creating Java plugins or using existing
[open source Besu plugins](reference/resources.md#open-source-plugins).
Use the [Plugin API](reference/plugin-api/index.md) to get data from any public or private Besu
network and feed it into an application or system.

For example, you can create a plugin to add more monitoring functionality or to stream event data
to a third-party application.
The API exposes data about the following components:

- Blocks
- Balances
- Transactions
- Smart contracts
- Execution results
- Logs
- Syncing state

Get started by [creating a simple plugin](get-started/create-a-plugin.md).

## Architecture

The following diagram outlines the high-level architecture of the Plugin API.

![Besu plugin API](../assets/images/Hyperledger-Besu-Plugin-API.png)

If you have questions about creating or using Besu plugins, ask on the **besu** channel on
[Hyperledger Discord](https://discord.gg/hyperledger).
