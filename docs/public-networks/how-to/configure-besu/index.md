---
title: Configure Besu
description: Specify options in the Besu configuration file.
sidebar_position: 1
---

# Configure Besu

Besu comes with a [default configuration](#default-configuration) that is suitable for staking.

You can override the default values by specifying [configuration options](../../reference/cli/options.md) on the command line, as environment variables, or in a [TOML configuration file](#toml-configuration-file) that can be reused across node startups.

You can also use a [pre-configured profile](profile.md) for some common use cases or create and apply a [custom profile](profile.md#load-external-profiles).

## Configuration order of precedence

For options specified in multiple places, the order of precedence is as follows:

1. Command line
2. Environment variable
3. Configuration file specified by `--config-file`
4. [Pre-configured profile](profile.md) specified by `--profile`
5. Default values (used if no other configuration source is available)

For example, if you specify a `config.toml` configuration file and `staker` profile, and an option
is not found in the environment variables, Besu looks for it in `config.toml`.
If the option is not found in `config.toml`, Besu looks for it in `staker.toml`.
If the option is not found in `staker.toml`, Besu uses the default value for that option.

## TOML configuration file

:::note
The configuration file is used for node-level settings. You can specify network-wide settings in the [genesis file](../../concepts/genesis-file.md).
:::

Specify the configuration file using the [`--config-file`](../../reference/cli/options.md#config-file) option.
The configuration file must be a valid TOML file composed of key/value pairs. Each key is the same as the corresponding command line option name without the leading dashes (`--`).

Values must conform to TOML specifications for string, numbers, arrays, and booleans. Specific differences between the command line and the TOML file format are:

- Comma-separated lists on the command line are string arrays in the TOML file.
- Enclose file paths, hexadecimal numbers, URLs, and &lt;host:port> values in quotes.

Table headings are ignored in TOML files. If you specify a valid Besu option under a table heading in the configuration file, Besu ignores the table heading and reads the option in the same way it does for options not under table headings.

:::tip

The [command line reference](../../reference/cli/options.md) includes configuration file examples for each option.

:::

```toml title="Sample TOML configuration file"
# Valid TOML config file
data-path="/path/to/besudata" # Path

# Network
bootnodes=["enode://001@123:4567", "enode://002@123:4567", "enode://003@123:4567"]

p2p-host="1.2.3.4"
p2p-port=1234
max-peers=42

rpc-http-host="5.6.7.8"
rpc-http-port=5678

rpc-ws-host="9.10.11.12"
rpc-ws-port=9101

# Chain
genesis-file="/path/to/genesis.json" # Path to the custom genesis file

```

```bash title="Starting Besu with a configuration file"
besu --config-file=/home/me/me_node/config.toml
```
## Default configuration

The following tables describe important default values of Besu's configuration.
When using the default configuration, Besu is optimized for staking.
You can extend these defaults using a [profile](profile.md).

For example, extending the default configuration using the [staker profile](profile.md#staker-profile) directs Besu to use Mainnet, creating a staking-optimized node ready to run with a [validator and consensus client](../../concepts/node-clients.md#consensus-clients).

### Peering

|Configuration option|Default|Description|
|---------------------------|--------------------|------------------------------------------|
|[`discovery-enabled`](../../reference/cli/options.md#discovery-enabled)|`true`|Besu assumes the node will automatically discover other Ethereum nodes using P2P.|
|[`p2p-enabled`](../../reference/cli/options.md#p2p-enabled)|`true`|Besu assumes the node will connect P2P.|
|[`engine-rpc-enabled`](../../reference/cli/options.md#engine-rpc-enabled)|`true`|Besu assumes the Engine API will be required to communicate with the consensus layer.|

### Storage

|Configuration option|Default|Description|
|---------------------------|--------------------|------------------------------------------|
|[`data-storage-format`](../../reference/cli/options.md#data-storage-format)|`BONSAI`|Besu uses [Bonsai Tries](../../concepts/data-storage-formats.md#bonsai-tries), the most space-efficient data storage format.|

### Sync

|Configuration option|Default|Description|
|---------------------------|--------------------|------------------------------------------|
|[`sync-mode`](../../reference/cli/options.md#sync-mode)|`SNAP`|Besu syncs using [snap sync](../../concepts/node-sync.md#snap-synchronization), the most time-efficient sync method.|

:::note
You can see all default configuration values in the [configuration options reference](../../reference/cli/options.md).
:::
