---
title: Private network options
sidebar_position: 1
description: Besu private networks CLI reference
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Private network command line options

This reference describes the syntax of the Besu private network command line interface (CLI) options.

:::caution Important

This reference contains options that apply to only private networks. For options that apply to both private and public networks, see the [public network options reference](../../../public-networks/reference/cli/options.md).

:::

## Specify options

You can specify Besu options:

- On the command line.

  ```bash
  besu [OPTIONS] [SUBCOMMAND]
  ```

- As an environment variable. For each command line option, the equivalent environment variable is:

  - Uppercase.
  - `_` replaces `-`.
  - Has a `BESU_` prefix.

For example, set `--rpc-http-enabled` using the `BESU_RPC_HTTP_ENABLED` environment variable.

- In a [configuration file](../../../public-networks/how-to/configure-besu/index.md).

If you specify an option in more than one place, the order of priority is command line, environment variable, configuration file.

If using Bash or Z shell, you can view option suggestions by entering `--` and pressing the Tab key twice.

```bash
besu --Tab+Tab
```

:::caution

Characters such as smart quotes and long (em) hyphens don't work in Besu command line options. Ensure quotes aren't automatically converted to smart quotes, or double hyphens combined into em hyphens.

:::

## Options

### `permissions-accounts-config-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--permissions-accounts-config-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--permissions-accounts-config-file=/home/me/me_configFiles/myPermissionsFile
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_PERMISSIONS_ACCOUNTS_CONFIG_FILE=/home/me/me_configFiles/myPermissionsFile
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
permissions-accounts-config-file="/home/me/me_configFiles/myPermissionsFile"
```

</TabItem>

</Tabs>

The [accounts permissions configuration file]. The default is the `permissions_config.toml` file in the [data directory](../../../public-networks/reference/cli/options.md#data-path).

:::tip

`--permissions-accounts-config-file` and [`--permissions-nodes-config-file`](#permissions-nodes-config-file) can use the same file.

:::

### `permissions-accounts-config-file-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--permissions-accounts-config-file-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--permissions-accounts-config-file-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_PERMISSIONS_ACCOUNTS_CONFIG_FILE_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
permissions-accounts-config-file-enabled=true
```

</TabItem>

</Tabs>

Enables or disables file-based account level permissions. The default is `false`.

### `permissions-nodes-config-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--permissions-nodes-config-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--permissions-nodes-config-file=/home/me/me_configFiles/myPermissionsFile
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_PERMISSIONS_NODES_CONFIG_FILE=/home/me/me_configFiles/myPermissionsFile
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
permissions-nodes-config-file="/home/me/me_configFiles/myPermissionsFile"
```

</TabItem>

</Tabs>

The [nodes permissions configuration file]. The default is the `permissions_config.toml` file in the [data directory](../../../public-networks/reference/cli/options.md#data-path).

:::tip

`--permissions-nodes-config-file` and [`--permissions-accounts-config-file`](#permissions-accounts-config-file) can use the same file.

:::

### `permissions-nodes-config-file-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--permissions-nodes-config-file-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--permissions-nodes-config-file-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_PERMISSIONS_NODES_CONFIG_FILE_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
permissions-nodes-config-file-enabled=true
```

</TabItem>

</Tabs>

Enables or disables file-based node level permissions. The default is `false`.

### `poa-block-txs-selection-max-time`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--poa-block-txs-selection-max-time=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--poa-block-txs-selection-max-time=80
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_POA_BLOCK_TXS_SELECTION_MAX_TIME=80
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
poa-block-txs-selection-max-time=80
```

</TabItem>

</Tabs>

The maximum time that can be spent selecting transactions to be included in a block,
as a percentage of the fixed block time of the network.
The default is `75`, or 75%.

:::note
This option only applies to proof-of-authority networks.
For proof-of-stake and proof-of-work networks, see
[`--block-txs-selection-max-time`](../../../public-networks/reference/cli/options.md#block-txs-selection-max-time).
:::

### `poa-discovery-retry-bootnodes`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--poa-discovery-retry-bootnodes=<true|false>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--poa-discovery-retry-bootnodes=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_POA_DISCOVERY_RETRY_BOOTNODES=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
poa-discovery-retry-bootnodes=true
```

</TabItem>

</Tabs>

When enabled, Besu always uses [bootnodes](../../how-to/configure/bootnodes.md) during peer table refresh on Proof of Authority (PoA) networks. When disabled, bootnodes are only used on first startup. If bootnodes are unavailable after startup, the node may not discover new peers until it is restarted. The default is `true`.

:::note
This option only applies to proof of authority (private) networks.
:::

<!-- Links -->

[accounts permissions configuration file]: ../../how-to/use-local-permissioning.md#permissions-configuration-file
[nodes permissions configuration file]: ../../how-to/use-local-permissioning.md#permissions-configuration-file
[account permissioning]: ../../concepts/permissioning/index.md#account-permissioning
