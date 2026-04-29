---
title: Options
description: Besu command line interface reference
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


This reference describes the syntax of the Besu configuration options.

:::info

This reference contains options that apply to both public and private networks. For private-network-specific options, see the [private network options reference](../../../private-networks/reference/cli/options.md).

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

- In a [configuration file](../../how-to/configure-besu/index.md).

If you specify an option in more than one place, the order of priority is command line, environment variable, configuration file.

If using Bash or Z shell, you can view option suggestions by entering `--` and pressing the Tab key twice.

```bash
besu --Tab+Tab
```

:::caution

Characters such as smart quotes and long (em) hyphens don't work in Besu command line options. Ensure quotes aren't automatically converted to smart quotes, or double hyphens combined into em hyphens.

:::

## Options

### `api-gas-price-blocks`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--api-gas-price-blocks=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--api-gas-price-blocks=50
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_API_GAS_PRICE_BLOCKS=50
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
api-gas-price-blocks=50
```

</TabItem>

</Tabs>

Number of blocks back from the head block to examine for [`eth_gasPrice`](../api/index.md#eth_gasprice). The default is `100`.

### `api-gas-price-max`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--api-gas-price-max=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--api-gas-price-max=20000
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_API_GAS_PRICE_MAX=20000
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
api-gas-price-max=20000
```

</TabItem>

</Tabs>

Maximum gas price to return for [`eth_gasPrice`](../api/index.md#eth_gasprice), regardless of the percentile value measured. The default is `500000000000` (500 GWei).

### `api-gas-price-percentile`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--api-gas-price-percentile=<DOUBLE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--api-gas-price-percentile=75
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_API_GAS_PRICE_PERCENTILE=75
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
api-gas-price-percentile=75
```

</TabItem>

</Tabs>

Percentile value to measure for [`eth_gasPrice`](../api/index.md#eth_gasprice). The default is `50.0`.

For [`eth_gasPrice`](../api/index.md#eth_gasprice), to return the:

- Highest gas price in [`--api-gas-price-blocks`](#api-gas-price-blocks), set to `100`.
- Lowest gas price in [`--api-gas-price-blocks`](#api-gas-price-blocks), set to `0`.

### `auto-log-bloom-caching-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--auto-log-bloom-caching-enabled=<true|false>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--auto-log-bloom-caching-enabled=false
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_AUTO_LOG_BLOOM_CACHING_ENABLED=false
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
auto-log-bloom-caching-enabled=false
```

</TabItem>

</Tabs>

Enables or disables automatic log bloom caching. APIs such as [`eth_getLogs`](../api/index.md#eth_getlogs) and [`eth_getFilterLogs`](../api/index.md#eth_getfilterlogs) use the cache for improved performance. 

The default is `true`.

If automatic log bloom caching is enabled and a log bloom query reaches the end of the cache, Besu
performs an uncached query for logs not yet written to the cache.

Automatic log bloom caching has a small impact on performance. If you are not querying logs blooms for a large number of blocks, you might want to disable automatic log bloom caching.

### `banned-node-ids`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--banned-node-ids=<bannedNodeId>[,<bannedNodeId>...]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--banned-node-ids=0xc35c3...d615f,0xf42c13...fc456
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_BANNED_NODE_IDS=0xc35c3...d615f,0xf42c13...fc456
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
banned-node-ids=["0xc35c3...d615f","0xf42c13...fc456"]
```

</TabItem>

</Tabs>

A list of node IDs with which this node will not peer. The node ID is the public key of the node. You can specify the banned node IDs with or without the `0x` prefix.

:::tip

The singular `--banned-node-id` and plural `--banned-node-ids` are available and are two names for the same option.

:::

### `block-txs-selection-max-time`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--block-txs-selection-max-time=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--block-txs-selection-max-time=1700
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_BLOCK_TXS_SELECTION_MAX_TIME=1700
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
block-txs-selection-max-time=1700
```

</TabItem>

</Tabs>

The maximum time, in milliseconds, that can be spent selecting transactions to be included in a block.
This value must be less than or equal to the default, `5000`.

:::note
This option only applies to proof-of-stake and proof-of-work networks.
For proof-of-authority networks, see
[`--poa-block-txs-selection-max-time`](../../../private-networks/reference/cli/options.md#poa-block-txs-selection-max-time).
:::

### `bonsai-historical-block-limit`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--bonsai-historical-block-limit=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--bonsai-historical-block-limit=256
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_BONSAI_HISTORICAL_BLOCK_LIMIT=256
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
bonsai-historical-block-limit=256
```

</TabItem>

</Tabs>

When using [Bonsai Tries](../../concepts/data-storage-formats.md#bonsai-tries), the
[maximum number of previous blocks](../../concepts/data-storage-formats.md#accessing-data) for which
Bonsai can reconstruct a historical state.
The default is `512`. 

:::note

If you plan on querying historical blocks or state using the [JSON-RPC API](../api/index.md), you might need to adjust the default value or your configured value to avoid errors. 

:::

### `bonsai-limit-trie-logs-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--bonsai-limit-trie-logs-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--bonsai-limit-trie-logs-enabled=false
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_BONSAI_LIMIT_TRIE_LOGS_ENABLED=false
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
bonsai-limit-trie-logs-enabled=false
```

</TabItem>

</Tabs>

Enables or disables limiting the number of
[Bonsai Trie](../../concepts/data-storage-formats.md#bonsai-tries) logs that are retained.
When enabled, this limit is set to the value of
[`--bonsai-historical-block-limit`](#bonsai-historical-block-limit).

The default is `true`, unless [`--sync-mode=FULL`](#sync-mode) is set, in which case this option is
disallowed and must be set to `false`.

### `bonsai-parallel-tx-processing-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--bonsai-parallel-tx-processing-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--bonsai-parallel-tx-processing-enabled=false
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_BONSAI_PARALLEL_TX_PROCESSING_ENABLED=false
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
bonsai-parallel-tx-processing-enabled=false
```

</TabItem>

</Tabs>

Enables [parallelization of transactions](../../concepts/parallel-transaction-execution) to optimize 
processing speed. 

This applies to Besu instances configured to the [Bonsai Trie](../../concepts/data-storage-formats.md#bonsai-tries) 
data storage format, otherwise this option is ignored.

The default is `true`.

### `bonsai-trie-logs-pruning-window-size`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--bonsai-trie-logs-pruning-window-size=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--bonsai-trie-logs-pruning-window-size=100000
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_BONSAI_TRIE_LOGS_PRUNING_WINDOW_SIZE=100000
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
bonsai-trie-logs-pruning-window-size=100000
```

</TabItem>

</Tabs>

When using [`--bonsai-limit-trie-logs-enabled`](#bonsai-limit-trie-logs-enabled), the number of trie
logs to prune during one pruning operation.
A larger value might impact node performance.
The default is `30000`.

### `bootnodes`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--bootnodes=<enode://id@host:port>|<enr:base64Enr>[,<enode://id@host:port>|<enr:base64Enr>,...]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--bootnodes=enode://c35c3...d615f@1.2.3.4:30303,enode://f42c13...fc456@1.2.3.5:30303
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_BOOTNODES=enode://c35c3...d615f@1.2.3.4:30303,enode://f42c13...fc456@1.2.3.5:30303
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
bootnodes=["enode://c35c3...d615f@1.2.3.4:30303","enode://f42c13...fc456@1.2.3.5:30303"]
```

</TabItem>

</Tabs>

A list of comma-separated sources for [P2P discovery bootstrap](../../../private-networks/how-to/configure/bootnodes.md),
where each source can be one of the following:

- A direct [enode URL](../../concepts/node-keys.md#enode-url) or [ENR URL](../../concepts/node-keys.md#enr-url)
- A local file path: `/path/to/bootnodes.txt`
- A file URI: `file:///path/to/bootnodes.txt`
- An HTTP(S) URL: `https://example.com/bootnodes.txt`

Each file or URL must contain one enode or ENR URL per line. Blank lines and lines starting with `#` are ignored.

The `--bootnodes` list can mix sources, but must specify all enode URLs (for discovery v4) or all ENR URLs (for discovery v5).

:::tip Early access feature
To use discovery v5 bootnodes, set the early access option `--Xv5-discovery-enabled` to `true`.
:::

When connecting to Mainnet or public testnets, the default is a predefined list of bootnodes.
In private networks defined using [`--genesis-file`](#genesis-file) or when using
[`--network=dev`](#network), the default is an empty list of bootnodes.

### `cache-last-blocks`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--cache-last-blocks=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--cache-last-blocks=2048
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_CACHE_LAST_BLOCKS=2048
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
cache-last-blocks=2048
```

</TabItem>

</Tabs>

The number of recent blocks to cache. 
Using this option can improve the performance of several RPC calls including: [`eth_getBlockByNumber`](../api/index.md#eth_getblockbynumber), [`eth_getBlockByHash`](../api/index.md#eth_getblockbyhash), [`eth_getTransactionReceipt`](../api/index.md#eth_gettransactionreceipt), and especially [`eth_feeHistory`](../api/index.md#eth_feehistory). 
The default is `0`.

### `cache-last-block-headers`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--cache-last-block-headers=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--cache-last-block-headers=50000
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_CACHE_LAST_BLOCK_HEADERS=50000
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file">

```bash
cache-last-block-headers=50000
```

</TabItem>

</Tabs>

The number of last block headers to cache from the blocks persisted to the blockchain.
When used with [`--cache-last-block-headers-preload-enabled`](#cache-last-block-headers-preload-enabled), this value defines how many block headers are preloaded into the cache at startup.

The default is `0`.

### `cache-last-block-headers-preload-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--cache-last-block-headers-preload-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--cache-last-block-headers-preload-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_CACHE_LAST_BLOCK_HEADERS_PRELOAD_ENABLED=true
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file">

```bash
cache-last-block-headers-preload-enabled=true
```

</TabItem>

</Tabs>

Enables preloading the block headers cache at startup.
Only has effect when [`--cache-last-block-headers`](#cache-last-block-headers) is set to a value greater than `0`; the number of block headers preloaded is defined by that option.

The default is `false`.

### `color-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--color-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--color-enabled=false
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_COLOR_ENABLED=false
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
color-enabled=false
```

</TabItem>

</Tabs>

Enables or disables color output to console. 

The default is `true`.

### `config-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--config-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--config-file=/home/me/me_node/config.toml
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_CONFIG_FILE=/home/me/me_node/config.toml
```

</TabItem>

</Tabs>

The path to the [TOML configuration file](../../how-to/configure-besu/index.md). The default is `none`.

### `data-path`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--data-path=<PATH>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--data-path=/home/me/me_node
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_DATA_PATH=/home/me/me_node
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
data-path="/home/me/me_node"
```

</TabItem>

</Tabs>

The path to the Besu data directory. The default is the directory you installed Besu in, or `/opt/besu/database` if using the [Besu Docker image](../../get-started/install/run-docker-image.md).

### `data-storage-format`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--data-storage-format=<FORMAT>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--data-storage-format=FOREST
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_DATA_STORAGE_FORMAT=FOREST
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
data-storage-format="BONSAI"
```

</TabItem>

</Tabs>

The [data storage format](../../concepts/data-storage-formats.md) to use. Set to `BONSAI` for Bonsai Tries or `FOREST` for Forest of Tries. The default is `BONSAI`.

### `discovery-dns-url`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--discovery-dns-url=<enrtree URL>
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_DISCOVERY_DNS_URL=enrtree://AM5FCQLWIZX2QFPNJAP7VUERCCRNGRHWZG3YYHIUV7BVDQ5FDPRT2@nodes.example.org
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
discovery-dns-url="enrtree://AM5FCQLWIZX2QFPNJAP7VUERCCRNGRHWZG3YYHIUV7BVDQ5FDPRT2@nodes.example.org"
```

</TabItem>

</Tabs>

The `enrtree` URL of the DNS node list for [node discovery via DNS](https://eips.ethereum.org/EIPS/eip-1459). The default is `null`.

### `discovery-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--discovery-enabled=<true|false>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--discovery-enabled=false
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_DISCOVERY_ENABLED=false
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
discovery-enabled=false
```

</TabItem>

</Tabs>

Enables or disables P2P discovery. 

The default is `true`.

:::note

You can override the default DNS server if it's unreliable or doesn't serve TCP DNS requests, using the [early access option](#xhelp) `--Xp2p-dns-discovery-server=<HOST>`.

:::

### `engine-host-allowlist`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--engine-host-allowlist=<hostname>[,<hostname>...] or "*"
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--engine-host-allowlist=localhost,127.0.0.1
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_ENGINE_HOST_ALLOWLIST=localhost,127.0.0.1
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
engine-host-allowlist=["localhost","127.0.0.1"]
```

</TabItem>

</Tabs>

A comma-separated list of hostnames to allow for Engine API access (applies to both HTTP and WebSocket).

:::tip

To allow all hostnames, use `"*"`. We don't recommend allowing all hostnames in production environments.

:::

### `engine-jwt-disabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--engine-jwt-disabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--engine-jwt-disabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_ENGINE_JWT_DISABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
engine-jwt-disabled=true
```

</TabItem>

</Tabs>

Disables or enables [authentication](../../how-to/use-engine-api.md#authentication) for Engine APIs. 

The default is `false` (authentication is enabled by default).

### `engine-jwt-secret`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--engine-jwt-secret=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--engine-jwt-secret=jwt.hex
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_ENGINE_JWT_SECRET="jwt.hex"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
engine-jwt-secret="jwt.hex"
```

</TabItem>

</Tabs>

Shared secret used to authenticate [consensus clients](../../concepts/node-clients.md#consensus-clients) when using the Engine JSON-RPC API (both HTTP and WebSocket). Contents of file must be at least 32 hex-encoded bytes and not begin with `0x`. May be a relative or absolute path. See an [example of how to generate this](../../get-started/connect/mainnet.md#1-generate-the-shared-secret).

### `engine-rpc-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--engine-rpc-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--engine-rpc-enabled
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_ENGINE_RPC_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
engine-rpc-enabled=true
```

</TabItem>

</Tabs>

Enables or disables the [Engine API](../engine-api/index.md). 

The default is `false`.

### `engine-rpc-port`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--engine-rpc-port=<PORT>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--engine-rpc-port=8551
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_ENGINE_RPC_PORT=8551
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
engine-rpc-port="8551"
```

</TabItem>

</Tabs>

The listening port for the Engine API calls (`ENGINE`, `ETH`) for JSON-RPC over HTTP and WebSocket. The default is `8551`.

### `era1-data-uri`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--era1-data-uri=<URI>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--era1-data-uri=https://mainnet.era1.nimbus.team/
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_ERA1_DATA_URI=https://mainnet.era1.nimbus.team/
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
era1-data-uri="https://mainnet.era1.nimbus.team/"
```

</TabItem>

</Tabs>

The URI or local path to attempt to [import ERA1 files](../../how-to/era1-file-full-sync.md) from. For local files, a simple path may be used
(for example, `/home/user/era1`). The default is `https://mainnet.era1.nimbus.team/`.

### `era1-import-prepipeline-concurrency`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--era1-import-prepipeline-concurrency=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--era1-import-prepipeline-concurrency=2
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_ERA1_IMPORT_PREPIPELINE_CONCURRENCY=2
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
era1-import-prepipeline-concurrency=2
```

</TabItem>

</Tabs>

Number of parallel processes used to [import ERA1 archive files](../../how-to/era1-file-full-sync.md) before full synchronization begins.
Increasing this may improve performance when loading files from remote sources or on systems with
high I/O capacity. The default is `1`.

In most cases, we recommend using the default unless slow file downloads are a limiting factor.

### `era1-import-prepipeline-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--era1-import-prepipeline-enabled[=<true|false]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--era1-import-prepipeline-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_ERA1_IMPORT_PREPIPELINE_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
era1-import-prepipeline-enabled=true
```

</TabItem>

</Tabs>

Enables [importing pre-merge blocks from ERA1 archive files](../../how-to/era1-file-full-sync.md) before full sync begins. Files are loaded from the location specified by[`--era1-data-uri`](#era1-data-uri) (supports local paths and HTTP URLs).

This option only applies when [`--sync-mode=FULL`](#sync-mode); it has no effect in other sync modes. 

The default is `false`.

Use this to accelerate syncing from genesis or to restore full historical data without relying on peer-to-peer downloads.

### `estimate-gas-tolerance-ratio`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--estimate-gas-tolerance-ratio=<DECIMAL>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--estimate-gas-tolerance-ratio=0.015
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_ESTIMATE_GAS_TOLERANCE_RATIO=0.015
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
estimate-gas-tolerance-ratio=0.015
```

</TabItem>

</Tabs>

Defines the tolerance used when estimating gas for the [`eth_estimateGas`](../api/index.md#eth_estimategas) JSON-RPC method.
Lower values increase accuracy but take longer to compute.
Higher values speed up estimation but might provide less precise results.

The default is `0.015`. Set to `0.0` to disable tolerance and prioritize maximum accuracy.

### `ethstats`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--ethstats=<[ws://|wss://]nodename:secret@host:[port]>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--ethstats=Dev-Node-1:secret@127.0.0.1:3001
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_ETHSTATS=Dev-Node-1:secret@127.0.0.1:3001
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
ethstats="Dev-Node-1:secret@127.0.0.1:3001"
```

</TabItem>

</Tabs>

Reporting URL of an [Ethstats](../../../private-networks/how-to/deploy/ethstats.md) server.
If specified without a port, the default port is 443 for SSL connections and 80 for non-SSL connections.

You can optionally specify `ws://` or `wss://` in the Ethstats URL.
If you specify this scheme, the connection doesn't need to switch from SSL to non-SSL on each retry logic.

### `ethstats-cacert-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--ethstats-cacert-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--ethstats-cacert-file=./root.cert
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_ETHSTATS_CACERT_FILE=./root.cert
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
ethstats-cacert-file="./root.cert"
```

</TabItem>

</Tabs>

Path to the root certificate authority (CA) certificate file of the Ethstats server specified by [`--ethstats`](#ethstats). This option is useful in non-production environments.

### `ethstats-contact`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--ethstats-contact=<CONTACT>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--ethstats-contact=contact@mail.com
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_ETHSTATS_CONTACT=contact@mail.com
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
ethstats-contact="contact@mail.com"
```

</TabItem>

</Tabs>

Contact email address to send to the Ethstats server specified by [`--ethstats`](#ethstats).

### `ethstats-report-interval`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--ethstats-report-interval=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--ethstats-report-interval=10
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_ETHSTATS_REPORT_INTERVAL=10
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
ethstats-report-interval=10
```

</TabItem>

</Tabs>

Interval (in seconds) at which Besu sends status updates to the EthStats server.  
The default is `5`.

### `genesis-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--genesis-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--genesis-file=/home/me/me_node/customGenesisFile.json
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_GENESIS_FILE=/home/me/me_node/customGenesisFile.json
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
genesis-file="/home/me/me_node/customGenesisFile.json"
```

</TabItem>

</Tabs>

The path to the [genesis file](../../concepts/genesis-file.md).

:::caution

You can't use the [`--genesis-file`](#genesis-file) and [`--network`](#network) options at the same time.

:::

### `genesis-state-hash-cache-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--genesis-state-hash-cache-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--genesis-state-hash-cache-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_GENESIS_STATE_HASH_CACHE_ENABLED=true
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
genesis-state-hash-cache-enabled=true
```

</TabItem>

</Tabs>

Enables or disables fast startup from an existing genesis state hash. 

The default is `false`.

:::warning

Enabling this option avoids validating the genesis state hash, trading off security for faster node startup times. We only recommend using this option if you are certain that you have not modified your genesis file or database and understand the security implications.

:::

### `graphql-http-cors-origins`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--graphql-http-cors-origins=<graphQLHttpCorsAllowedOrigins>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--graphql-http-cors-origins="http://medomain.com","https://meotherdomain.com"
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_GRAPHQL_HTTP_CORS_ORIGINS="http://medomain.com","https://meotherdomain.com"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
graphql-http-cors-origins=["http://medomain.com","https://meotherdomain.com"]
```

</TabItem>

</Tabs>

A list of comma-separated origin domain URLs for CORS validation. The default is none.

### `graphql-http-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--graphql-http-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--graphql-http-enabled
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_GRAPHQL_HTTP_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
graphql-http-enabled=true
```

</TabItem>

</Tabs>

Enables or disables the GraphQL HTTP service. 

The default is `false`.

The default GraphQL HTTP service endpoint is `http://127.0.0.1:8547/graphql` if set to `true`.

### `graphql-http-host`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--graphql-http-host=<HOST>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
# to listen on all interfaces
--graphql-http-host=0.0.0.0
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
# to listen on all interfaces
BESU_GRAPHQL_HTTP_HOST=0.0.0.0
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
graphql-http-host="0.0.0.0"
```

</TabItem>

</Tabs>

The host on which GraphQL HTTP listens. The default is `127.0.0.1`.

To allow remote connections, set to `0.0.0.0`.

### `graphql-http-port`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--graphql-http-port=<PORT>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
# to listen on port 6175
--graphql-http-port=6175
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
# to listen on port 6175
BESU_GRAPHQL_HTTP_PORT=6175
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
graphql-http-port="6175"
```

</TabItem>

</Tabs>

The port (TCP) on which GraphQL HTTP listens. The default is `8547`. Ports must be [exposed appropriately](../../how-to/connect/configure-ports.md).

### `graphql-mtls-enabled`

<Tabs>
<TabItem value="Syntax">

```bash
--graphql-mtls-enabled[=<true|false>]
```

</TabItem>
<TabItem value="Example">

```bash
--graphql-mtls-enabled=true
```

</TabItem>
<TabItem value="Environment variable">

```bash
BESU_GRAPHQL_MTLS_ENABLED=true
```

</TabItem>
<TabItem value="Configuration file">

```bash
graphql-mtls-enabled=true
```

</TabItem>
</Tabs>

Enables or disables mTLS for the GraphQL HTTP service.

The default is `false`.

:::note
[`--graphql-http-enabled`](#graphql-http-enabled) must be enabled.
:::

### `graphql-tls-enabled`

<Tabs>
<TabItem value="Syntax">

```bash
--graphql-tls-enabled[=<true|false>]
```

</TabItem>
<TabItem value="Example">

```bash
--graphql-tls-enabled=true
```

</TabItem>
<TabItem value="Environment variable">

```bash
BESU_GRAPHQL_TLS_ENABLED=true
```

</TabItem>
<TabItem value="Configuration file">

```bash
graphql-tls-enabled=true
```

</TabItem>
</Tabs>

Enables or disables TLS for the GraphQL HTTP service.

The default is `false`.

:::note
[`--graphql-http-enabled`](#graphql-http-enabled) must be enabled.
:::

### `graphql-tls-keystore-file`

<Tabs>
<TabItem value="Syntax">

```bash
--graphql-tls-keystore-file=<FILE>
```

</TabItem>
<TabItem value="Example">

```bash
--graphql-tls-keystore-file=/home/me/me_node/keystore.pfx
```

</TabItem>
<TabItem value="Environment variable">

```bash
BESU_GRAPHQL_TLS_KEYSTORE_FILE=/home/me/me_node/keystore.pfx
```

</TabItem>
<TabItem value="Configuration file">

```bash
graphql-tls-keystore-file="/home/me/me_node/keystore.pfx"
```

</TabItem>
</Tabs>

Path to the keystore file when enabling TLS for the GraphQL HTTP service.
The keystore file contains the private key and certificate presented to the client during authentication.

Specify the keystore password file using [`--graphql-tls-keystore-password-file`](#graphql-tls-keystore-password-file).

### `graphql-tls-keystore-password-file`

<Tabs>
<TabItem value="Syntax">

```bash
--graphql-tls-keystore-password-file=<FILE>
```

</TabItem>
<TabItem value="Example">

```bash
--graphql-tls-keystore-password-file=/home/me/me_node/password
```

</TabItem>
<TabItem value="Environment variable">

```bash
BESU_GRAPHQL_TLS_KEYSTORE_PASSWORD_FILE=/home/me/me_node/password
```

</TabItem>
<TabItem value="Configuration file">

```bash
graphql-tls-keystore-password-file="/home/me/me_node/password"
```

</TabItem>
</Tabs>

Path to the file containing the password for the keystore specified in [`--graphql-tls-keystore-file`](#graphql-tls-keystore-file),
when enabling TLS for the GraphQL HTTP service.

### `graphql-tls-truststore-file`

<Tabs>
<TabItem value="Syntax">

```bash
--graphql-tls-truststore-file=<FILE>
```

</TabItem>
<TabItem value="Example">

```bash
--graphql-tls-truststore-file=/home/me/me_node/truststore.pfx
```

</TabItem>
<TabItem value="Environment variable">

```bash
BESU_GRAPHQL_TLS_TRUSTSTORE_FILE=/home/me/me_node/truststore.pfx
```

</TabItem>
<TabItem value="Configuration file">

```bash
graphql-tls-truststore-file="/home/me/me_node/truststore.pfx"
```

</TabItem>
</Tabs>

Path to the truststore file when enabling TLS for the GraphQL HTTP service.

Specify the truststore password file using [`--graphql-tls-truststore-password-file`](#graphql-tls-truststore-password-file).

### `graphql-tls-truststore-password-file`

<Tabs>
<TabItem value="Syntax">

```bash
--graphql-tls-truststore-password-file=<FILE>
```

</TabItem>
<TabItem value="Example">

```bash
--graphql-tls-truststore-password-file=/home/me/me_node/password
```

</TabItem>
<TabItem value="Environment variable">

```bash
BESU_GRAPHQL_TLS_TRUSTSTORE_PASSWORD_FILE=/home/me/me_node/password
```

</TabItem>
<TabItem value="Configuration file">

```bash
graphql-tls-truststore-password-file="/home/me/me_node/password"
```

</TabItem>
</Tabs>

Path to the file containing the password for the truststore specified in [`--graphql-tls-truststore-file`](#graphql-tls-truststore-file),
when enabling TLS for the GraphQL HTTP service.

### `help`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
-h, --help
```

</TabItem>

</Tabs>

Show the help message and exit.

### `history-expiry-prune`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--history-expiry-prune[=<true|false>]
```
</TabItem>

<TabItem value="Example" label="Example">

```bash
--history-expiry-prune=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_HISTORY_EXPIRY_PRUNE=true
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file">

```bash
history-expiry-prune=true
```

</TabItem>
</Tabs>

Enables or disables [online pruning of historical block data](../../how-to/pre-merge-history-expiry.md#online-pruning)
for pre-merge Proof of Work (PoW) blocks, retaining only the headers.
The option also activates garbage collection settings that works for both online and offline pruning
mechanisms, so that the reclaimed storage is compacted quickly, freeing disk space without manual intervention.

The default is `false`.

### `host-allowlist`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--host-allowlist=<hostname>[,<hostname>...] or "*"
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--host-allowlist=medomain.com,meotherdomain.com
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_HOST_ALLOWLIST=medomain.com,meotherdomain.com
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
host-allowlist=["medomain.com", "meotherdomain.com"]
```

</TabItem>

</Tabs>

A comma-separated list of hostnames to [access the JSON-RPC API](../../how-to/use-besu-api/index.md#host-allowlist) and [pull Besu metrics](../../how-to/monitor/metrics.md). By default, Besu accepts requests from `localhost` and `127.0.0.1`.

:::info

This isn't a permissioning feature. To restrict access to the API, we recommend using the [Besu authentication mechanism](../../how-to/use-besu-api/authenticate.md) with username and password authentication or JWT public key authentication.

:::

:::note

If using [Prometheus](https://prometheus.io/) to pull metrics from a node, you must specify all the other nodes you want to pull metrics from in the list of allowed hostnames.

:::

:::tip

To allow all hostnames, use `"*"`. We don't recommend allowing all hostnames for production environments.

:::

### `identity`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--identity=<String>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--identity=MyNode
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_IDENTITY=MyNode
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
identity="MyNode"
```

</TabItem>

</Tabs>

The name for the node. If specified, it's the second section of the client ID provided by some Ethereum network explorers. For example, in the client ID `besu/MyNode/v1.3.4/linux-x86_64/oracle_openjdk-java-11`, the node name is `MyNode`.

If a name is not specified, the name section is not included in the client ID. For example, `besu/v1.3.4/linux-x86_64/oracle_openjdk-java-11`.

### `json-pretty-print-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--json-pretty-print-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--json-pretty-print-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_JSON_PRETTY_PRINT_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
json-pretty-print-enabled=true
```

</TabItem>

</Tabs>

Enables or disables the pretty-print output for HTTP and WebSocket responses. 

The default is `false`.

### `key-value-storage`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--key-value-storage=<keyValueStorageName>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--key-value-storage=rocksdb
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_KEY_VALUE_STORAGE=rocksdb
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
key-value-storage="rocksdb"
```

</TabItem>

</Tabs>

The key-value storage to use. Use this option only if using a storage system provided with a plugin. The default is `rocksdb`.

For development use only, the `memory` option provides ephemeral storage for sync testing and debugging.

### `kzg-trusted-setup`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--kzg-trusted-setup=<PATH>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--kzg-trusted-setup=/etc/besu/kzg-trusted-setup.txt
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_KZG_TRUSTED_SETUP=/etc/besu/kzg-trusted-setup.txt
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
kzg-trusted-setup=/etc/besu/kzg-trusted-setup.txt
```

</TabItem>

</Tabs>

The path to the [C-KZG-4844](https://github.com/ethereum/c-kzg-4844) trusted setup file. Use this option to pass a custom setup file for custom networks or to override the default setup file for named networks.

### `logging`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
-l, --logging=<LEVEL>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--logging=DEBUG
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_LOGGING=DEBUG
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
logging="DEBUG"
```

</TabItem>

</Tabs>

Sets logging verbosity. Log levels are `OFF`, `FATAL`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`, `ALL`. The default is `INFO`.

### `max-blobs-per-block`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--max-blobs-per-block=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--max-blobs-per-block=8
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_MAX_BLOBS_PER_BLOCK=8
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
max-blobs-per-block=8
```

</TabItem>

</Tabs>

Maximum number of [blobs](../../concepts/transactions/types.md#blob-transactions) allowed per block.
The default is determined by the hard fork you're on, defined in the genesis file.
Use this option if you want to apply a limit smaller than the default value.

You can use this option starting from the [Osaka hard fork](https://eips.ethereum.org/EIPS/eip-7607).

### `max-blobs-per-transaction`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--max-blobs-per-transaction=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--max-blobs-per-transaction=2
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_MAX_BLOBS_PER_TRANSACTION=2
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
max-blobs-per-transaction=2
```

</TabItem>

</Tabs>

Maximum number of [blobs](../../concepts/transactions/types.md#blob-transactions) allowed per transaction.
The default is 6.
You can use this option starting from the [Osaka hard fork](https://eips.ethereum.org/EIPS/eip-7607).

### `max-peers`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--max-peers=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--max-peers=42
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_MAX_PEERS=42
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
max-peers=42
```

</TabItem>

</Tabs>

The maximum number of P2P connections you can establish. The default is 25.

### `metrics-category`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-category=<metrics-category>[,<metrics-category>...]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--metrics-category=BLOCKCHAIN,PEERS,PROCESS
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_METRICS_CATEGORY=BLOCKCHAIN,PEERS,PROCESS
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
metrics-category=["BLOCKCHAIN","PEERS","PROCESS"]
```

</TabItem>

</Tabs>

A comma-separated list of categories for which to track metrics. The defaults are `BLOCKCHAIN`, `ETHEREUM`, `EXECUTORS`, `JVM`, `NETWORK`, `PEERS`, `PERMISSIONING`, `PROCESS`, `PRUNER`, `RPC`, `SYNCHRONIZER`, and `TRANSACTION_POOL`.

Other categories are `KVSTORE_ROCKSDB`, `KVSTORE_PRIVATE_ROCKSDB`, `KVSTORE_ROCKSDB_STATS`, and `KVSTORE_PRIVATE_ROCKSDB_STATS`.

### `metrics-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--metrics-enabled
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_METRICS_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
metrics-enabled=true
```

</TabItem>

</Tabs>

Enables or disables the [metrics exporter](../../how-to/monitor/metrics.md). 

The default is `false`.

You can't specify `--metrics-enabled` with [`--metrics-push-enabled`](#metrics-push-enabled). That is, you can enable either Prometheus polling or Prometheus push gateway support, but not both at once.

### `metrics-host`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-host=<HOST>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--metrics-host=127.0.0.1
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_METRICS_HOST=127.0.0.1
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
metrics-host="127.0.0.1"
```

</TabItem>

</Tabs>

The host on which [Prometheus](https://prometheus.io/) accesses [Besu metrics](../../how-to/monitor/metrics.md). The metrics server respects the [`--host-allowlist` option](#host-allowlist).

The default is `127.0.0.1`.

### `metrics-port`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-port=<PORT>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--metrics-port=6174
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_METRICS_PORT=6174
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
metrics-port="6174"
```

</TabItem>

</Tabs>

The port (TCP) on which [Prometheus](https://prometheus.io/) accesses [Besu metrics](../../how-to/monitor/metrics.md). The default is `9545`. Ports must be [exposed appropriately](../../how-to/connect/configure-ports.md).

### `metrics-protocol`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-protocol=<metrics-protocol>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--metrics-protocol=OPENTELEMETRY
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_METRICS_PROTOCOL=OPENTELEMETRY
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
metrics-protocol="OPENTELEMETRY"
```

</TabItem>

</Tabs>

Metrics protocol to use: `PROMETHEUS`, `OPENTELEMETRY`, or `NONE`. The default is `PROMETHEUS`.

### `metrics-push-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-push-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--metrics-push-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_METRICS_PUSH_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
metrics-push-enabled=true
```

</TabItem>

</Tabs>

Enables or disables [push gateway integration].

The default is `false`.

You can't specify `--metrics-push-enabled` with [`--metrics-enabled`](#metrics-enabled). That is, you can enable either Prometheus polling or Prometheus push gateway support, but not both at once.

### `metrics-push-host`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-push-host=<HOST>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--metrics-push-host=127.0.0.1
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_METRICS_PUSH_HOST=127.0.0.1
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
metrics-push-host="127.0.0.1"
```

</TabItem>

</Tabs>

The host of the [Prometheus Push Gateway](https://github.com/prometheus/pushgateway). The default is `127.0.0.1`. The metrics server respects the [`--host-allowlist` option](#host-allowlist).

:::note

When pushing metrics, ensure you set `--metrics-push-host` to the machine on which the push gateway is. Generally, this is a different machine to the machine on which Besu is running.

:::

### `metrics-push-interval`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-push-interval=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--metrics-push-interval=30
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_METRICS_PUSH_INTERVAL=30
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
metrics-push-interval=30
```

</TabItem>

</Tabs>

The interval, in seconds, to push metrics when in `push` mode. The default is 15.

### `metrics-push-port`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-push-port=<PORT>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--metrics-push-port=6174
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_METRICS_PUSH_PORT=6174
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
metrics-push-port="6174"
```

</TabItem>

</Tabs>

The port (TCP) of the [Prometheus Push Gateway](https://github.com/prometheus/pushgateway). The default is `9001`. Ports must be [exposed appropriately](../../how-to/connect/configure-ports.md).

### `metrics-push-prometheus-job`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-push-prometheus-job=<metricsPrometheusJob>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--metrics-push-prometheus-job="my-custom-job"
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_METRICS_PUSH_PROMETHEUS_JOB="my-custom-job"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
metrics-push-prometheus-job="my-custom-job"
```

</TabItem>

</Tabs>

The job name when in `push` mode. The default is `besu-client`.

### `min-block-occupancy-ratio`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--min-block-occupancy-ratio=<minBlockOccupancyRatio>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--min-block-occupancy-ratio=0.5
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_MIN_BLOCK_OCCUPANCY_RATIO=0.5
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
min-block-occupancy-ratio="0.5"
```

</TabItem>

</Tabs>

Minimum occupancy ratio for a mined block if the transaction pool is not empty. When filling a block during mining, the occupancy ratio indicates the threshold at which the node stops waiting for smaller transactions to fill the remaining space. The default is 0.8.

:::note

Besu ignores the `--min-block-occupancy-ratio` option for proof-of-stake networks, such as Ethereum Mainnet.

:::

### `min-gas-price`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--min-gas-price=<minTransactionGasPrice>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--min-gas-price=1337
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_MIN_GAS_PRICE=1337
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
min-gas-price=1337
```

</TabItem>

</Tabs>

The minimum price (in wei) a transaction offers to include it in a mined block.
The minimum gas price is the lowest value [`eth_gasPrice`](../api/index.md#eth_gasprice) can return.
The default is `1000`.

For a running node, use:

* [`miner_getMinGasPrice`](../api/index.md#miner_getmingasprice) to get the value.
* [`miner_setMinGasPrice`](../api/index.md#miner_setmingasprice) to change the value.

:::tip

In a [free gas network](../../../private-networks/how-to/configure/free-gas.md), ensure the minimum
gas price is set to zero for every node.
Any node with a minimum gas price set higher than zero will silently drop transactions with a zero
gas price.
You can query a node's gas configuration using [`eth_gasPrice`](../api/index.md#eth_gasprice).

:::

### `min-priority-fee`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--min-priority-fee=<minPriorityFeePerGas>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--min-priority-fee=7
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_MIN_PRIORITY_FEE=7
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
min-priority-fee=7
```

</TabItem>

</Tabs>

The minimum priority fee per gas (in wei) offered by a transaction to be included in a block.
The default is `0`.

For a running node, use:

* [`miner_getMinPriorityFee`](../api/index.md#miner_getminpriorityfee) to get the value.
* [`miner_setMinPriorityFee`](../api/index.md#miner_setminpriorityfee) to change the value.

### `miner-extra-data`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--miner-extra-data=<Extra data>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--miner-extra-data=0x444F4E27542050414E4943202120484F444C2C20484F444C2C20484F444C2021
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_MINER_EXTRA_DATA=0x444F4E27542050414E4943202120484F444C2C20484F444C2C20484F444C2021
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
miner-extra-data="0x444F4E27542050414E4943202120484F444C2C20484F444C2C20484F444C2021"
```

</TabItem>

</Tabs>

A hex string representing the 32 bytes included in the extra data field of a created block.
The default is `0x`.

### `nat-method`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--nat-method=UPNP
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
nat-method="UPNP"
```

</TabItem>

</Tabs>

Specify the method for handling [NAT environments](../../how-to/connect/specify-nat.md). The options are:

- [`UPNP`](../../how-to/connect/specify-nat.md#upnp)
- [`UPNPP2PONLY`](../../how-to/connect/specify-nat.md#upnp)
- [`DOCKER`](../../how-to/connect/specify-nat.md#docker)
- [`AUTO`](../../how-to/connect/specify-nat.md#auto)
- [`NONE`](../../how-to/connect/specify-nat.md#none).

The default is `AUTO`. `NONE` disables NAT functionality.

:::tip

UPnP support is often disabled by default in networking firmware. If disabled by default, explicitly enable UPnP support.

:::

:::tip

Use `UPNPP2PONLY` if you wish to enable UPnP for P2P traffic but not JSON-RPC.

:::

:::note

Specifying `UPNP` might introduce delays during node startup, especially on networks without a UPnP gateway device.

You must specify `DOCKER` when using the [Besu Docker image](../../get-started/install/run-docker-image.md).

:::

### `net-restrict`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--net-restrict=<subnet>[,<subnet>...]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--net-restrict=192.168.1.0/24,10.0.0.0/8,fd00::/64
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_NET_RESTRICT=192.168.1.0/24,10.0.0.0/8,fd00::/64
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
net-restrict=["192.168.1.0/24","10.0.0.0/8","fd00::/64"]
```

</TabItem>

</Tabs>

A comma-separated list of allowed IP subnets.
Peers whose IP addresses fall within the specified subnets are granted permission to interact with the node.
If not specified, no subnet-based peer permission restrictions are applied.

:::tip
This option accepts both IPv4 and IPv6 addresses.
:::

### `network`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--network=<NETWORK>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--network=sepolia
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_NETWORK=sepolia
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
network="sepolia"
```

</TabItem>

</Tabs>

The predefined network configuration. The default is `mainnet`.

Possible values include the following:

| Network    | Chain | Type        | Default sync mode    | Consensus mechanism | Description                                                                    |
|:-----------|:------|:------------|:---------------------|:--------------------|:-------------------------------------------------------------------------------|
| `mainnet`  | ETH   | Production  | [`SNAP`](#sync-mode) | PoS network       | The main [Ethereum network](https://ethereum.org/en/developers/docs/networks/) |
| `hoodi`    | ETH   | Test        | [`SNAP`](#sync-mode) | PoS network       | Multi-client Ethereum testnet [Hoodi](https://hoodi.ethpandaops.io/)                    |
| `sepolia`  | ETH   | Test        | [`SNAP`](#sync-mode) | PoS network       | Multi-client Ethereum testnet [Sepolia](https://sepolia.dev)                            |
| `dev`      | ETH   | Development | [`FULL`](#sync-mode) | PoW network       | Development network with low difficulty to enable local CPU mining             |
| `ephemery` | ETH   | Test        | [`SNAP`](#sync-mode) | PoS network       | Multi-client Ethereum testnet [Ephemery](https://ephemery.dev)  
| `linea_mainnet`  | Linea   | Production        | [`SNAP`](#sync-mode) | Sequencer-based (zkEVM rollup)       | The main [Linea network](https://docs.linea.build/get-started/build/network-info)                            |
| `linea_sepolia`  | Linea   | Test        | [`SNAP`](#sync-mode) | Sequencer-based (zkEVM rollup)      | Linea [Sepolia testnet](https://docs.linea.build/get-started/build/network-info/)                            |
| `lukso`    | Lukso  | Production  | [`SNAP`](#sync-mode) | PoS network       | Network for the [Lukso chain](https://lukso.network/)                          |


:::tip

Values are case-insensitive, so either `mainnet` or `MAINNET` works.

:::

:::info

- You can't use the `--network` and [`--genesis-file`](#genesis-file) options at the same time.

- The following networks and testnets are deprecated: ETC Classic, Holesky, and Mordor.

:::

### `network-id`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--network-id=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--network-id=8675309
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_NETWORK_ID=8675309
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
network-id="8675309"
```

</TabItem>

</Tabs>

The [P2P network identifier](../../concepts/network-and-chain-id.md).

Use this option to override the default network ID. The default value is the same as the chain ID defined in the genesis file.

### `node-private-key-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--node-private-key-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--node-private-key-file=/home/me/me_node/myPrivateKey
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_NODE_PRIVATE_KEY_FILE=/home/me/me_node/myPrivateKey
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
node-private-key-file="/home/me/me_node/myPrivateKey"
```

</TabItem>

</Tabs>

The private key file for the node. The default is the key file in the [data directory](#data-path). If no key file exists, Besu creates a key file containing the generated private key, otherwise, the existing key file specifies the node private key.

:::danger

The private key is not encrypted.

:::

This option is ignored if [`--security-module`](#security-module) is set to a non-default value.

### `p2p-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--p2p-enabled=<true|false>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--p2p-enabled=false
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_P2P_ENABLED=false
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
p2p-enabled=false
```

</TabItem>

</Tabs>

Enables or disables all P2P communication. 

The default is `true`.

### `p2p-host`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--p2p-host=<HOST>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
# to listen on all interfaces
--p2p-host=0.0.0.0
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
# to listen on all interfaces
BESU_P2P_HOST=0.0.0.0
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
p2p-host="0.0.0.0"
```

</TabItem>

</Tabs>

The advertised host that can be used to access the node from outside the network in [P2P communication](../../how-to/connect/configure-ports.md#p2p-networking).
The default is `127.0.0.1`.

:::tip Early access feature
This option can take an IPv4 or IPv6 host.
To use IPv6 (discovery v5), set the early access option `--Xv5-discovery-enabled` to `true`.

If you specify an IPv6 host using `--p2p-host`, do not set [`--p2p-host-ipv6`](#p2p-host-ipv6).
:::

:::info

If [`--nat-method`](#nat-method) is set to [`NONE`](../../how-to/connect/specify-nat.md), `--p2p-host` is not overridden and must be specified for the node to be accessed from outside the network.

:::

### `p2p-host-ipv6`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--p2p-host-ipv6=<HOST>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--p2p-host-ipv6=2001:db8:85a3::8a2e:370:7334
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_P2P_HOST_IPV6=2001:db8:85a3::8a2e:370:7334
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
p2p-host-ipv6="2001:db8:85a3::8a2e:370:7334"
```

</TabItem>

</Tabs>

The advertised IPv6 host that can be used to access the node from outside the network in [P2P communication](../../how-to/connect/configure-ports.md#p2p-networking).

:::tip Early access feature
To use an IPv6 host (discovery v5), set the early access option `--Xv5-discovery-enabled` to `true`.

If you set `--p2p-host-ipv6`, do not specify an IPv6 host using [`--p2p-host`](#p2p-host).
:::

### `p2p-interface`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--p2p-interface=<HOST>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--p2p-interface=192.168.1.132
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_P2P_INTERFACE=192.168.1.132
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
p2p-interface="192.168.1.132"
```

</TabItem>

</Tabs>

The network interface on which the node listens for [P2P communication](../../how-to/connect/configure-ports.md#p2p-networking). Use the option to specify the required network interface when the device that Besu is running on has multiple network interfaces. The default is 0.0.0.0 (all interfaces).

:::tip Early access feature
This option can take an IPv4 or IPv6 interface.
To use IPv6 (discovery v5), set the early access option `--Xv5-discovery-enabled` to `true`.

If you specify an IPv6 interface using `--p2p-interface`, do not set [`--p2p-interface-ipv6`](#p2p-interface-ipv6).
:::

### `p2p-interface-ipv6`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--p2p-interface-ipv6=<HOST>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--p2p-interface-ipv6=2001:db8:85a3::1/64
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_P2P_INTERFACE_IPV6=2001:db8:85a3::1/64
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
p2p-interface-ipv6="2001:db8:85a3::1/64"
```

</TabItem>

</Tabs>

The IPv6 network interface on which the node listens for [P2P communication](../../how-to/connect/configure-ports.md#p2p-networking).
Use the option to specify the required network interface when the device that Besu is running on has multiple network interfaces.

:::tip Early access feature
To use an IPv6 interface (discovery v5), set the early access option `--Xv5-discovery-enabled` to `true`.

If you set `--p2p-interface-ipv6`, do not specify an IPv6 interface using [`--p2p-interface`](#p2p-interface).
:::

### `p2p-ipv6-outbound-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--p2p-ipv6-outbound-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--p2p-ipv6-outbound-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_P2P_IPV6_OUTBOUND_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
p2p-ipv6-outbound-enabled=true
```

</TabItem>

</Tabs>

Enables or disables preferring IPv6 addresses for outbound P2P connections when peers advertise both IPv4 and IPv6.

When set to `true`, IPv6 is preferred.
When omitted or set to `false`, IPv4 is preferred.
If a peer only advertises one address family, it is always used.

:::tip Early access feature
To use IPv6 addresses (discovery v5), set the early access option `--Xv5-discovery-enabled` to `true`.
:::

### `p2p-port`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--p2p-port=<PORT>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
# to listen on port 1789
--p2p-port=1789
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
# to listen on port 1789
BESU_P2P_PORT=1789
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
p2p-port="1789"
```

</TabItem>

</Tabs>

The P2P listening ports (UDP and TCP). The default is `30303`. You must [expose ports appropriately](../../how-to/connect/configure-ports.md).

:::tip Early access feature
To use IPv6 (discovery v5), set the early access option `--Xv5-discovery-enabled` to `true`.
:::

### `p2p-port-ipv6`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--p2p-port-ipv6=<PORT>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
# to listen on port 1789
--p2p-port-ipv6=1789
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
# to listen on port 1789
BESU_P2P_PORT_IPV6=1789
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
p2p-port-ipv6="1789"
```

</TabItem>

</Tabs>

The IPv6 P2P listening ports (UDP and TCP).
The default is `30404`.
You must [expose ports appropriately](../../how-to/connect/configure-ports.md).

:::tip Early access feature
To use IPv6 (discovery v5), set the early access option `--Xv5-discovery-enabled` to `true`.
:::

### `plugin-block-txs-selection-max-time`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--plugin-block-txs-selection-max-time=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--plugin-block-txs-selection-max-time=50
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_PLUGIN_BLOCK_TXS_SELECTION_MAX_TIME=50
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
plugin-block-txs-selection-max-time=50
```

</TabItem>

</Tabs>

Maximum time, as a percentage of the overall block creation time, that [plugins](../../concepts/plugins.md) can use to propose their own transactions during block creation.
The default is `50`: limiting plugins to up to 50% of the total block creation time.

### `plugin-continue-on-error`

<Tabs>
<TabItem value="Syntax">

```bash
--plugin-continue-on-error=<true|false>
```

</TabItem>
<TabItem value="Example">

```bash
--plugin-continue-on-error=true
```

</TabItem>
<TabItem value="Environment variable">

```bash
BESU_PLUGIN_CONTINUE_ON_ERROR=true
```

</TabItem>
<TabItem value="Configuration file">

```bash
plugin-continue-on-error=true
```

</TabItem>
</Tabs>

Enables or disables continuing to run Besu if a [plugin](../../concepts/plugins.md)
fails during registration or other startup lifecycle stages.
If set to `true` and any plugin fails, Besu logs an error and continues running.
If set to `false` and any plugin fails, Besu logs an error and stops running.

The default is `false`.

### `plugins-verification-mode`

<Tabs>
<TabItem value="Syntax" label="Syntax" default>

```bash
--plugins-verification-mode=<value>
```

</TabItem>
<TabItem value="Example">

```bash
--plugins-verification-mode="FULL"
```

</TabItem>
<TabItem value="Environment variable">

```bash
BESU_PLUGINS_VERIFICATION_MODE="FULL"
```

</TabItem>
<TabItem value="Configuration file">

```bash
plugins-verification-mode=FULL
```

</TabItem>
</Tabs>

Controls whether Besu fails to start if a [plugin's](../../concepts/plugins.md) verification fails at 
startup.

Verification mode options are `NONE` or `FULL`:
- If set to `NONE` and plugin verification fails, Besu logs a warning and continues running.
- If set to `FULL` and any plugin verification fails, Besu logs an error and stops running.

The default is `NONE`.

### `plugins`

<Tabs>
<TabItem value="Syntax">

```bash
--plugins=<PLUGIN>[,<PLUGIN>...]
```

</TabItem>
<TabItem value="Example">

```bash
--plugins=essential-plugin,security-plugin
```

</TabItem>
<TabItem value="Environment variable">

```bash
BESU_PLUGINS=essential-plugin,security-plugin
```

</TabItem>
<TabItem value="Configuration file">

```bash
plugins=["essential-plugin","security-plugin"]
```

</TabItem>
</Tabs>

Comma-separated list of [plugin](../../concepts/plugins.md) names to load. Each plugin must reside in
the `plugins` directory. If you omit this option, Besu automatically loads all plugins found in that directory.

The plugin name is case-sensitive, and is the name of the class that implements
[`BesuPlugin`](https://javadoc.io/doc/org.hyperledger.besu/plugin-api/latest/org/hyperledger/besu/plugin/BesuPlugin.html)
in the plugin source code.

If the specified plugin is not found, Besu exits with an error identifying the missing plugin.

### `print-paths-and-exit`

<Tabs>
<TabItem value="Syntax">

```bash
--print-paths-and-exit
```

</TabItem>
</Tabs>

Prints the Besu data directory paths and exits without starting the node.

### `profile`

<Tabs>
<TabItem value="Syntax">

```bash
--profile=<PROFILE>
```

</TabItem>
<TabItem value="Example">

```bash
--profile=STAKER
```

</TabItem>
<TabItem value="Environment variable">

```bash
BESU_PROFILE=STAKER
```

</TabItem>
<TabItem value="Configuration file">

```bash
profile="STAKER"
```

</TabItem>
</Tabs>

Loads a pre-configured TOML file containing custom settings for a specific user profile.
Possible values are:

- [`MINIMALIST_STAKER`](../../how-to/configure-besu/profile.md#minimalist-staker-profile)
- [`STAKER`](../../how-to/configure-besu/profile.md#staker-profile)
- [`ENTERPRISE` or `PRIVATE`](../../how-to/configure-besu/profile.md#enterpriseprivate-profile) (aliases for the same profile)
- [`PERFORMANCE`](../../how-to/configure-besu/profile.md#performance-profiles)
- [`PERFORMANCE_RPC`](../../how-to/configure-besu/profile.md#performance-profiles)
- File name of an [external profile](../../how-to/configure-besu/profile.md#load-external-profiles),
  without the `.toml` extension.
  
The default is `null`.

### `random-peer-priority-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--random-peer-priority-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--random-peer-priority-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RANDOM_PEER_PRIORITY_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
random-peer-priority-enabled=true
```

</TabItem>

</Tabs>

Enables or disables random prioritization of incoming connections. Enable in small, stable networks to prevent closed groups of peers forming. 

The default is `false`.

### `receipt-compaction-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--receipt-compaction-enabled=<true|false>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--receipt-compaction-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RECEIPT_COMPACTION_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
receipt-compaction-enabled=true
```

</TabItem>

</Tabs>

Enables or disables receipt compaction. 
Compacting receipts reduces storage by trimming unnecessary data from transaction receipts. 

The default is `true`.

### `remote-connections-limit-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--remote-connections-limit-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--remote-connections-limit-enabled=false
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_REMOTE_CONNECTIONS_LIMIT_ENABLED=false
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
remote-connections-limit-enabled=false
```

</TabItem>

</Tabs>

Enables or disables using the [`--remote-connections-max-percentage`](#remote-connections-max-percentage) option to limit the percentage of remote P2P connections initiated by peers. 

The default is `true`.

:::tip

In private and permissioned networks with a level of trust between peers, disabling the remote connection limits may increase the speed at which nodes can join the network.

:::

:::danger

To prevent eclipse attacks, ensure you enable the remote connections limit when connecting to any public network, and especially when using [`--sync-mode`](#sync-mode) and [`--fast-sync-min-peers`](#sync-min-peers-fast-sync-min-peers).

:::

### `remote-connections-max-percentage`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--remote-connections-max-percentage=<DOUBLE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--remote-connections-max-percentage=25
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_REMOTE_CONNECTIONS_MAX_PERCENTAGE=25
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
remote-connections-max-percentage=25
```

</TabItem>

</Tabs>

The percentage of remote P2P connections you can establish with the node. Must be between 0 and 100, inclusive. The default is 60.

### `reorg-logging-threshold`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--reorg-logging-threshold=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--reorg-logging-threshold=3
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_REORG_LOGGING_THRESHOLD=3
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
reorg-logging-threshold=3
```

</TabItem>

</Tabs>

Minimum depth of chain reorganizations to log. The default is 6.

### `required-block`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--required-block, --required-blocks=<BLOCK=HASH>[,<BLOCK=HASH>...]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--required-block=6485846=0x43f0cd1e5b1f9c4d5cda26c240b59ee4f1b510d0a185aa8fd476d091b0097a80
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_REQUIRED_BLOCK=6485846=0x43f0cd1e5b1f9c4d5cda26c240b59ee4f1b510d0a185aa8fd476d091b0097a80
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
required-block=["6485846=0x43f0cd1e5b1f9c4d5cda26c240b59ee4f1b510d0a185aa8fd476d091b0097a80"]
```

</TabItem>

</Tabs>

Requires a peer with the specified block number to have the specified hash when connecting, or Besu rejects that peer.

### `revert-reason-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--revert-reason-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--revert-reason-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_REVERT_REASON_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
revert-reason-enabled=true
```

</TabItem>

</Tabs>

Enables or disables including the [revert reason](../../../private-networks/how-to/send-transactions/revert-reason.md) in the transaction receipt, [`eth_estimateGas`](../api/index.md#eth_estimategas) error response, [`eth_call`](../api/index.md#eth_call) error response, and [`trace`](../trace-types.md#trace) response. 

The default is `false`.

:::caution

Enabling revert reason may use a significant amount of memory. We don't recommend enabling revert reason when connected to public Ethereum networks.

:::

### `rpc-gas-cap`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-gas-cap=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-gas-cap=50000000
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_GAS_CAP=50000000
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-gas-cap=50000000
```

</TabItem>

</Tabs>

Sets a limit on the amount of gas for transaction simulation RPC methods. 
This option allows users to override the transaction's gas limit. 
This can prevent the simulation of transactions with high gas usage by setting a predefined cap, preventing DoS attacks.
Its value must be greater than or equal to `0`. 
The default is `100000000`. You can set this to `0` to indicate there is no limit. 
This cap prevents [`eth_call`](../api/index.md#eth_call) requests from using excessive resources.

### `rpc-http-api`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-api=<api name>[,<api name>...]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-api=ETH,NET,WEB3
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_API=ETH,NET,WEB3
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-api=["ETH","NET","WEB3"]
```

</TabItem>

</Tabs>

A comma-separated list of APIs to enable on the JSON-RPC HTTP channel. When you use this option you must also specify the `--rpc-http-enabled` option. The available API options are: `ADMIN`, `DEBUG`, `ENGINE`, `ETH`, `IBFT`, `MINER`, `NET`, `PERM`, `PLUGINS`, `QBFT`, `TRACE`, `TXPOOL`, and `WEB3`. The default is: `ETH`, `NET`, `WEB3`.

:::tip

The singular `--rpc-http-api` and plural `--rpc-http-apis` are available and are two names for the same option.

:::

### `rpc-http-api-methods-no-auth`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-api-methods-no-auth=<api method>[,<api method>...]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-api-methods-no-auth=admin_peers,debug_traceCall
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_API_METHODS_NO_AUTH=admin_peers,debug_traceCall
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-api-methods-no-auth=["admin_peers","debug_traceCall"]
```

</TabItem>

</Tabs>

A comma-separated list of JSON-RPC API methods to exclude from [authentication services](../../how-to/use-besu-api/authenticate.md).

:::note
You must enable JSON-RPC HTTP authentication using [`--rpc-http-authentication-enabled`](#rpc-http-authentication-enabled).
:::

### `rpc-http-authentication-credentials-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-authentication-credentials-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-authentication-credentials-file=/home/me/me_node/auth.toml
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_AUTHENTICATION_CREDENTIALS_FILE=/home/me/me_node/auth.toml
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-authentication-credentials-file="/home/me/me_node/auth.toml"
```

</TabItem>

</Tabs>

The [credentials file](../../how-to/use-besu-api/authenticate.md#1-create-the-credentials-file) for JSON-RPC API [authentication](../../how-to/use-besu-api/authenticate.md).

### `rpc-http-authentication-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-authentication-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-authentication-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_AUTHENTICATION_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-authentication-enabled=true
```

</TabItem>

</Tabs>

Enables or disables [authentication](../../how-to/use-besu-api/authenticate.md) for the JSON-RPC HTTP service.

The default is `false`.

### `rpc-http-authentication-jwt-algorithm`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
---rpc-http-authentication-jwt-algorithm=<algorithm>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-authentication-jwt-algorithm=ES256
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_AUTHENTICATION_JWT_ALGORITHM=ES256
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-authentication-jwt-algorithm="ES256"
```

</TabItem>

</Tabs>

The [JWT key algorithm](../../how-to/use-besu-api/authenticate.md#1-generate-a-private-and-public-key-pair)
used to generate the keypair for JSON-RPC HTTP authentication.
Possible values are `RS256`, `RS384`, `RS512`, `ES256`, `ES384`, and `ES512`.
The default is `RS256`.

### `rpc-http-authentication-jwt-public-key-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-authentication-jwt-public-key-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-authentication-jwt-public-key-file=publicKey.pem
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_AUTHENTICATION_JWT_PUBLIC_KEY_FILE="publicKey.pem"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-authentication-jwt-public-key-file="publicKey.pem"
```

</TabItem>

</Tabs>

The [JWT provider's public key file] used for JSON-RPC HTTP authentication with an external JWT.

### `rpc-http-cors-origins`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-cors-origins=<url>[,<url>...] or all or "*"
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-cors-origins=http://medomain.com,http://remix.ethereum.org
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_CORS_ORIGINS=http://medomain.com,https://meotherdomain.com
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-cors-origins=["http://medomain.com","https://meotherdomain.com"]
```

</TabItem>

</Tabs>

A comma-separated list of domain URLs for CORS validation.

Listed domains can access the node using JSON-RPC. If your client interacts with Besu using a browser app (such as Remix or a block explorer), add the client domain to the list.

The default value is `"none"`. If you do not list any domains, browser apps cannot interact with your Besu node.

:::note

To run a local Besu node with MetaMask, set `--rpc-http-cors-origins` to `chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn`.

Remember to also include the dapp domain MetaMask interacts with, for example if your app is deployed on Remix and you're using MetaMask to interact with the contract, use `--rpc-http-cors-origins=chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn,http://remix.ethereum.org`

:::

:::tip

For testing and development purposes, use `"all"` or `"*"` to accept requests from any domain. We don't recommend accepting requests from any domain for production environments.

:::

### `rpc-http-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-enabled=true
```

</TabItem>

</Tabs>

Enables or disables the JSON-RPC HTTP service. 

The default is `false`.

### `rpc-http-host`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-host=<HOST>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
# to listen on all interfaces
--rpc-http-host=0.0.0.0
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_HOST=0.0.0.0
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-host="0.0.0.0"
```

</TabItem>

</Tabs>

The host on which JSON-RPC HTTP listens. The default is `127.0.0.1`.

To allow remote connections, set to `0.0.0.0`.

:::caution

Setting the host to `0.0.0.0` exposes the RPC connection on your node to any remote connection. In a production environment, ensure you are using a firewall to avoid exposing your node to the internet.

:::

### `rpc-http-max-active-connections`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-max-active-connections=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-max-active-connections=100
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_MAX_ACTIVE_CONNECTIONS=100
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```toml
rpc-http-max-active-connections=100
```

</TabItem>

</Tabs>

The maximum number of allowed JSON-RPC HTTP connections. Once this limit is reached, incoming connections are rejected. The default is 80.

### `rpc-http-max-request-content-length`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-max-request-content-length=<LONG>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-max-request-content-length=2097152
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_MAX_REQUEST_CONTENT_LENGTH=2097152
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```toml
rpc-http-max-request-content-length=2097152
```

</TabItem>

</Tabs>

The maximum request content length.
Besu only accepts JSON-RPC API requests with a body size less than or equal to this value.
The default is 5242880 (5 MB).

### `rpc-http-max-batch-size`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-max-batch-size=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-max-batch-size=1200
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_MAX_BATCH_SIZE=1200
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```toml
rpc-http-max-batch-size=1200
```

</TabItem>

</Tabs>

The maximum number of allowed requests in a [RPC batch request](../../how-to/use-besu-api/json-rpc.md#http). The default limit is `1024`, and `-1` specifies no limit.

### `rpc-http-port`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-port=<PORT>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
# to listen on port 3435
--rpc-http-port=3435
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_PORT=3435
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-port="3435"
```

</TabItem>

</Tabs>

The port (TCP) on which JSON-RPC HTTP listens. The default is `8545`. You must [expose ports appropriately](../../how-to/connect/configure-ports.md).

### `rpc-http-tls-ca-clients-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-tls-ca-clients-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-tls-ca-clients-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_TLS_CA_CLIENTS_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-tls-ca-clients-enabled=true
```

</TabItem>

</Tabs>

Enables or disables clients with trusted CA certificates to connect. 

The default is `false`.

:::note

You must enable client authentication using the [`--rpc-http-tls-client-auth-enabled`](#rpc-http-tls-client-auth-enabled) option.

:::

### `rpc-http-tls-client-auth-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-tls-client-auth-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-tls-client-auth-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_TLS_CLIENT_AUTH_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-tls-client-auth-enabled=true
```

</TabItem>

</Tabs>

Enables or disables TLS client authentication for the JSON-RPC HTTP service. 

The default is `false`.

:::note

You must specify [`--rpc-http-tls-ca-clients-enabled`](#rpc-http-tls-ca-clients-enabled) and/or [`rpc-http-tls-known-clients-file`](#rpc-http-tls-known-clients-file).

:::

### `rpc-http-tls-cipher-suite`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-tls-cipher-suite=<cipherSuiteName>[,<cipherSuiteName>...]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-tls-cipher-suite=TLS_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_TLS_CIPHER_SUITE=TLS_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-tls-cipher-suite=["TLS_AES_256_GCM_SHA384","TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384","TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256"]
```

</TabItem>

</Tabs>

A list of comma-separated TLS cipher suites to support.

:::tip

The singular `--rpc-http-tls-cipher-suite` and plural `--rpc-http-tls-cipher-suites` are available and are two names for the same option.

:::

### `rpc-http-tls-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-tls-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-tls-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_TLS_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-tls-enabled=true
```

</TabItem>

</Tabs>

Enables or disables TLS for the JSON-RPC HTTP service. 

The default is `false`.

:::note

[`--rpc-http-enabled`](#rpc-http-enabled) must be enabled.

:::

### `rpc-http-tls-keystore-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-tls-keystore-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-tls-keystore-file=/home/me/me_node/keystore.pfx
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_TLS_KEYSTORE_FILE=/home/me/me_node/keystore.pfx
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-tls-keystore-file="/home/me/me_node/keystore.pfx"
```

</TabItem>

</Tabs>

Path to the keystore file (in PKCS #12 format) when enabling TLS for the JSON-RPC HTTP service.
The keystore file contains the private key and certificate presented to the client during authentication.

Specify the keystore password file using [`--rpc-http-tls-keystore-password-file`](#rpc-http-tls-keystore-password-file).

### `rpc-http-tls-keystore-password-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-tls-keystore-password-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-tls-keystore-password-file=/home/me/me_node/password
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_TLS_KEYSTORE_PASSWORD_FILE=/home/me/me_node/password
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-tls-keystore-password-file="/home/me/me_node/password"
```

</TabItem>

</Tabs>

Path to the file containing the password for the keystore specified in [`--rpc-http-tls-keystore-file`](#rpc-http-tls-keystore-file),
when enabling TLS for the JSON-RPC HTTP service.

### `rpc-http-tls-known-clients-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-tls-known-clients-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-tls-known-clients-file=/home/me/me_node/knownClients
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_TLS_KNOWN_CLIENTS_FILE=/home/me/me_node/knownClients
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-tls-known-clients-file="/home/me/me_node/knownClients"
```

</TabItem>

</Tabs>

Path to the file used to [authenticate clients](../../../private-networks/how-to/configure/tls.md#create-the-known-clients-file) using self-signed certificates or non-public certificates.

Must contain the certificate's Common Name, and SHA-256 fingerprint in the format `<CommonName> <hex-string>`.

:::note

You must enable client authentication using the [`--rpc-http-tls-client-auth-enabled`](#rpc-http-tls-client-auth-enabled) option.

:::

### `rpc-http-tls-protocol`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-tls-protocol=<protocolName>[,<protocolName>...]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-tls-protocol=TLSv1.3,TLSv1.2
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_TLS_PROTOCOL=TLSv1.3,TLSv1.2
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-tls-protocol=["TLSv1.3","TLSv1.2"]
```

</TabItem>

</Tabs>

A list of comma-separated TLS protocols to support. The default is `DEFAULT_TLS_PROTOCOLS`, a list which includes `TLSv1.3` and `TLSv1.2`.

:::tip

The singular `--rpc-http-tls-protocol` and plural `--rpc-http-tls-protocols` are available and are two names for the same option.

:::

### `rpc-http-tls-truststore-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-tls-truststore-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-tls-truststore-file=/home/me/me_node/truststore.pfx
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_TLS_TRUSTSTORE_FILE=/home/me/me_node/truststore.pfx
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-tls-truststore-file="/home/me/me_node/truststore.pfx"
```

</TabItem>

</Tabs>

Path to the truststore file when enabling TLS for the JSON-RPC HTTP service.

Specify the truststore password file using [`--rpc-http-tls-truststore-password-file`](#rpc-http-tls-truststore-password-file).

### `rpc-http-tls-truststore-password-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-http-tls-truststore-password-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-http-tls-truststore-password-file=/home/me/me_node/password
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_HTTP_TLS_TRUSTSTORE_PASSWORD_FILE=/home/me/me_node/password
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-http-tls-truststore-password-file="/home/me/me_node/password"
```

</TabItem>

</Tabs>

Path to the file containing the password for the truststore specified in [`--rpc-http-tls-truststore-file`](#rpc-http-tls-truststore-file),
when enabling TLS for the JSON-RPC HTTP service.

### `rpc-max-logs-range`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-max-logs-range=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-max-logs-range=500
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_MAX_LOGS_RANGE=500
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-max-logs-range=500
```

</TabItem>

</Tabs>

When using [`eth_getLogs`](../api/index.md#eth_getlogs), the maximum number of blocks to retrieve logs from. Set to 0 to specify no limit. The default is 5000.

:::caution

Using `eth_getLogs` to get logs from a large range of blocks, especially an entire chain from its
genesis block, might cause Besu to stop responding for an indeterminable amount of time while
generating the response.

We recommend setting a range limit or leaving this option at its default value.

:::

### `rpc-max-trace-filter-range`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-max-trace-filter-range=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-max-trace-filter-range=100
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
--BESU_RPC_MAX_TRACE_FILTER_RANGE=100
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-max-trace-filter-range=100
```

</TabItem>

</Tabs>

The maximum number of blocks you can supply to the [`trace_filter`](../api/index.md#trace_filter) method. The value must be equal to or greater than `0`. Setting this option to `0` indicates there is no limit. The default is `1000`.

### `rpc-tx-feecap`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-tx-feecap=<MAX_FEE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-tx-feecap=1200000000000000000
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_TX_FEECAP=1200000000000000000
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-tx-feecap=1200000000000000000
```

</TabItem>

</Tabs>

The maximum transaction fee (in wei) accepted for transactions submitted through the [`eth_sendRawTransaction`](../api/index.md#eth_sendrawtransaction) RPC. The default is 1000000000000000000 (1 ether).

If set to 0, then this option is ignored and no cap is applied.

### `rpc-ws-api`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-api=<api name>[,<api name>...]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-api=ETH,NET,WEB3
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_API=ETH,NET,WEB3
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-api=["ETH","NET","WEB3"]
```

</TabItem>

</Tabs>

A comma-separated list of APIs to enable on the WebSockets channel. When you use this option you must also specify the `--rpc-ws-enabled` option. The available API options are: `ADMIN`, `DEBUG`, `ENGINE`, `ETH`, `IBFT`, `MINER`, `NET`, `PERM`, `PLUGINS`, `QBFT`, `TRACE`, `TXPOOL`, and `WEB3`. The default is: `ETH`, `NET`, `WEB3`.

:::tip

The singular `--rpc-ws-api` and plural `--rpc-ws-apis` options are available and are two names for the same option.

:::

### `rpc-ws-api-methods-no-auth`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-api-methods-no-auth=<api method>[,<api method>...]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-api-methods-no-auth=admin_peers,debug_traceCall
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_API_METHODS_NO_AUTH=admin_peers,debug_traceCall
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-api-methods-no-auth=["admin_peers","debug_traceCall"]
```

</TabItem>

</Tabs>

A comma-separated list of JSON-RPC API methods to exclude from [authentication services](../../how-to/use-besu-api/authenticate.md).

:::note
You must enable JSON-RPC WebSocket authentication using [`--rpc-ws-authentication-enabled`](#rpc-ws-authentication-enabled).
:::

### `rpc-ws-authentication-credentials-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-authentication-credentials-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-authentication-credentials-file=/home/me/me_node/auth.toml
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_AUTHENTICATION_CREDENTIALS_FILE=/home/me/me_node/auth.toml
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-authentication-credentials-file="/home/me/me_node/auth.toml"
```

</TabItem>

</Tabs>

The path to the [credentials file](../../how-to/use-besu-api/authenticate.md#1-create-the-credentials-file) for JSON-RPC API [authentication](../../how-to/use-besu-api/authenticate.md).

### `rpc-ws-authentication-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-authentication-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-authentication-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_AUTHENTICATION_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-authentication-enabled=true
```

</TabItem>

</Tabs>

Enables or disables [authentication](../../how-to/use-besu-api/authenticate.md) for the JSON-RPC WebSocket service.

The default is `false`.

:::note

`wscat` doesn't support headers. [Authentication](../../how-to/use-besu-api/authenticate.md) requires you to pass an authentication token in the request header. To use authentication with WebSockets, you need an app that supports headers.

:::

### `rpc-ws-authentication-jwt-algorithm`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
---rpc-ws-authentication-jwt-algorithm=<algorithm>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-authentication-jwt-algorithm=ES256
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_AUTHENTICATION_JWT_ALGORITHM=ES256
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-authentication-jwt-algorithm="ES256"
```

</TabItem>

</Tabs>

The [JWT key algorithm](../../how-to/use-besu-api/authenticate.md#1-generate-a-private-and-public-key-pair)
used to generate the keypair for JSON-RPC WebSocket authentication.
Possible values are `RS256`, `RS384`, `RS512`, `ES256`, `ES384`, and `ES512`.
The default is `RS256`.

### `rpc-ws-authentication-jwt-public-key-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-authentication-jwt-public-key-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-authentication-jwt-public-key-file=publicKey.pem
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_AUTHENTICATION_JWT_PUBLIC_KEY_FILE="publicKey.pem"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-authentication-jwt-public-key-file="publicKey.pem"
```

</TabItem>

</Tabs>

The [JWT provider's public key file] used for JSON-RPC WebSocket authentication with an external JWT.

### `rpc-ws-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-enabled=true
```

</TabItem>

</Tabs>

Enables or disables the WebSocket JSON-RPC service. 

The default is `false`.

### `rpc-ws-host`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-host=<HOST>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
# to listen on all interfaces
--rpc-ws-host=0.0.0.0
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_HOST=0.0.0.0
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-host="0.0.0.0"
```

</TabItem>

</Tabs>

The host on which WebSocket JSON-RPC listens.
The default is `127.0.0.1`.

To allow remote connections, set to `0.0.0.0`

### `rpc-ws-max-active-connections`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-max-active-connections=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-max-active-connections=100
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_MAX_ACTIVE_CONNECTIONS=100
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```toml
rpc-ws-max-active-connections=100
```

</TabItem>

</Tabs>

The maximum number of WebSocket connections allowed for JSON-RPC. Once this limit is reached, incoming connections are rejected. The default is 80.

### `rpc-ws-max-frame-size`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-max-frame-size=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-max-frame-size=65536
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_MAX_FRAME_SIZE=65536
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```toml
rpc-ws-max-frame-size=65536
```

</TabItem>

</Tabs>

The maximum size in bytes for JSON-RPC WebSocket frames. If this limit is exceeded, the WebSocket disconnects. The default is 1048576 (or 1 MB).

### `rpc-ws-port`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-port=<PORT>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
# to listen on port 6174
--rpc-ws-port=6174
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_PORT=6174
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-port="6174"
```

</TabItem>

</Tabs>

The port (TCP) on which WebSocket JSON-RPC listens. The default is `8546`. You must [expose ports appropriately](../../how-to/connect/configure-ports.md).

### `rpc-ws-ssl-cert-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-ssl-cert-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-ssl-cert-file=/home/me/me_node/websocket-cert.pem
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_SSL_CERT_FILE="/home/me/me_node/websocket-cert.pem"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-ssl-cert-file="/home/me/me_node/websocket-cert.pem"
```

</TabItem>

</Tabs>

Path to the PEM certificate file enabling SSL/TLS for the WebSocket JSON-RPC service.
This file contains the public certificate that is used to establish the identity of the server to clients.

Specify the private key file using [`--rpc-ws-ssl-key-file`](#rpc-ws-ssl-key-file).

Required if [`--rpc-ws-ssl-keystore-type`](#rpc-ws-ssl-keystore-type) is `PEM`.

### `rpc-ws-ssl-client-auth-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-ssl-client-auth-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-ssl-client-auth-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_SSL_CLIENT_AUTH_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-ssl-client-auth-enabled=true
```

</TabItem>

</Tabs>

Enables or disables client authentication for the WebSocket JSON-RPC service. 

The default is `false`.

:::note

When enabling client authentication, specify the truststore type using [`--rpc-ws-ssl-truststore-type`](#rpc-ws-ssl-truststore-type)
and provide the appropriate file path for the truststore or trust certificate using either
[`--rpc-ws-ssl-truststore-file`](#rpc-ws-ssl-truststore-file) (for JKS or PKCS12) or
[`--rpc-ws-ssl-trustcert-file`](#rpc-ws-ssl-trustcert-file) (for PEM).

If using JKS or PKCS12, specify the truststore password using [`--rpc-ws-ssl-truststore-password`](#rpc-ws-ssl-truststore-password).
:::

### `rpc-ws-ssl-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-ssl-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-ssl-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_SSL_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-ssl-enabled=true
```

</TabItem>

</Tabs>

Enables or disables server SSL/TLS authentication for the WebSocket JSON-RPC service. 

The default is `false`.

Set the appropriate keystore type using [`--rpc-ws-ssl-keystore-type`](#rpc-ws-ssl-keystore-type).

### `rpc-ws-ssl-key-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-ssl-key-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-ssl-key-file=/home/me/me_node/websocket-cert.pem
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_SSL_KEY_FILE="/home/me/me_node/websocket-cert.pem"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-ssl-key-file="/home/me/me_node/websocket-cert.pem"
```

</TabItem>

</Tabs>

Path to the PEM certificate file when enabling SSL/TLS for the WebSocket JSON-RPC service.
This file contains the private key that corresponds to the public certificate specified using
[`--rpc-ws-ssl-cert-file`](#rpc-ws-ssl-cert-file).

Required if [`--rpc-ws-ssl-keystore-type`](#rpc-ws-ssl-keystore-type) is `PEM`.

### `rpc-ws-ssl-keystore-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-ssl-keystore-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-ssl-keystore-file=/home/me/me_node/keystore.jks
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_SSL_KEYSTORE_FILE="/home/me/me_node/keystore.jks"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-ssl-keystore-file="/home/me/me_node/keystore.jks"
```

</TabItem>

</Tabs>

Path to the keystore file when enabling SSL/TLS for the WebSocket JSON-RPC service.
The keystore file is used to store the server's private key and public certificate in a single
file, typically in JKS or PKCS12 format. Use this option if you prefer to
manage your SSL/TLS certificates and keys in a keystore rather than separate PEM files.

Required if [`--rpc-ws-ssl-keystore-type`](#rpc-ws-ssl-keystore-type) is set to `JKS` or `PKCS12`.

Specify the keystore password using [`--rpc-ws-ssl-keystore-password`](#rpc-ws-ssl-keystore-password)
or [`--rpc-ws-ssl-keystore-password-file`](#rpc-ws-ssl-keystore-password-file).

### `rpc-ws-ssl-keystore-password`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-ssl-keystore-password=<STRING>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-ssl-keystore-password=keystore_password
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_SSL_KEYSTORE_PASSWORD="keystore_password"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-ssl-keystore-password="keystore_password"
```

</TabItem>

</Tabs>

Password for the keystore specified in [`--rpc-ws-ssl-keystore-file`](#rpc-ws-ssl-keystore-file),
when enabling WebSocket SSL/TLS client authentication.

### `rpc-ws-ssl-keystore-password-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-ssl-keystore-password-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-ssl-keystore-password-file=/home/me/me_node/keystore-password.txt
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_SSL_KEYSTORE_PASSWORD_FILE="/home/me/me_node/keystore-password.txt"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-ssl-keystore-password-file="/home/me/me_node/keystore-password.txt"
```

</TabItem>

</Tabs>

Path to the file containing the password for the keystore specified in [`--rpc-ws-ssl-keystore-file`](#rpc-ws-ssl-keystore-file),
when enabling WebSocket SSL/TLS client authentication.

### `rpc-ws-ssl-keystore-type`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-ssl-keystore-type=<STRING>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-ssl-keystore-type=JKS
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_SSL_KEYSTORE_TYPE="JKS"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-ssl-keystore-type="JKS"
```

</TabItem>

</Tabs>

Type of the keystore when enabling SSL/TLS for the WebSocket JSON-RPC service. Valid options are
`JKS`, `PKCS12`, and `PEM`.

Provide the appropriate file path for the keystore using either
[`--rpc-ws-ssl-keystore-file`](#rpc-ws-ssl-keystore-file) (for `JKS` or `PKCS12`), or
[`--rpc-ws-ssl-key-file`](#rpc-ws-ssl-key-file) and [`--rpc-ws-ssl-cert-file`](#rpc-ws-ssl-cert-file) (for `PEM`).

### `rpc-ws-ssl-trustcert-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-ssl-trustcert-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-ssl-trustcert-file=/home/me/me_node/trust-cert.pem
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_SSL_TRUSTCERT_FILE="/home/me/me_node/trust-cert.pem"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-ssl-trustcert-file="/home/me/me_node/trust-cert.pem"
```

</TabItem>

</Tabs>

Path to the PEM trust certificate file when enabling client SSL/TLS authentication for the WebSocket JSON-RPC
service.

### `rpc-ws-ssl-truststore-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-ssl-truststore-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-ssl-truststore-file=/home/me/me_node/websocket-truststore.jks
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_SSL_TRUSTSTORE_FILE="/home/me/me_node/websocket-truststore.jks"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-ssl-truststore-file="/home/me/me_node/websocket-truststore.jks"
```

</TabItem>

</Tabs>

Path to the truststore file when enabling SSL/TLS client authentication for the WebSocket JSON-RPC
service.

Specify the truststore password using [`--rpc-ws-ssl-truststore-password`](#rpc-ws-ssl-truststore-password)
or [`--rpc-ws-ssl-truststore-password-file`](#rpc-ws-ssl-truststore-password-file).

### `rpc-ws-ssl-truststore-password`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-ssl-truststore-password=<STRING>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-ssl-truststore-password=truststore_password
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_SSL_TRUSTSTORE_PASSWORD="truststore_password"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-ssl-truststore-password="truststore_password"
```

</TabItem>

</Tabs>

Password for the truststore specified using [`--rpc-ws-ssl-truststore-file`](#rpc-ws-ssl-truststore-file),
when enabling WebSocket SSL/TLS client authentication.

### `rpc-ws-ssl-truststore-password-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-ssl-truststore-password-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-ssl-truststore-password-file=/home/me/me_node/truststore-password.txt
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_SSL_TRUSTSTORE_PASSWORD_FILE="/home/me/me_node/truststore-password.txt"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-ssl-truststore-password-file="/home/me/me_node/truststore-password.txt"
```

</TabItem>

</Tabs>

Path to the file containing the password for the truststore specified in [`--rpc-ws-ssl-truststore-file`](#rpc-ws-ssl-truststore-file),
when enabling WebSocket SSL/TLS client authentication.

### `rpc-ws-ssl-truststore-type`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--rpc-ws-ssl-truststore-type=<STRING>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--rpc-ws-ssl-truststore-type=JKS
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_RPC_WS_SSL_TRUSTSTORE_TYPE="JKS"
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
rpc-ws-ssl-truststore-type="JKS"
```

</TabItem>

</Tabs>

Type of the truststore when enabling client SSL/TLS authentication for the WebSocket JSON-RPC service. Valid options are
`JKS`, `PKCS12`, and `PEM`.

Specify the required [`--rpc-ws-ssl-truststore-file`](#rpc-ws-ssl-truststore-file) for `JKS` and `PKCS12`, or
[`--rpc-ws-ssl-trustcert-file`](#rpc-ws-ssl-trustcert-file) for `PEM`.

### `security-module`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--security-module=<NAME>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--security-module=security_module
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_SECURITY_MODULE=security_module
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
security-module="security_module"
```

</TabItem>

</Tabs>

Name of the security module plugin to use. For example, a Hardware Security Module (HSM) or V3 filestore plugin.

The default is the node's local private key file specified using [`--node-private-key-file`](#node-private-key-file).

### `snapsync-server-enabled`

<Tabs>
<TabItem value="Syntax" label="Syntax" default>

```bash
--snapsync-server-enabled[=<true|false>]
```

</TabItem>
<TabItem value="Example" label="Example">

```bash
--snapsync-server-enabled=true
```

</TabItem>
<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_SNAPSYNC_SERVER_ENABLED=true
```

</TabItem>
<TabItem value="Example configuration file" label="Example configuration file">

```bash
snapsync-server-enabled=true
```

</TabItem>
</Tabs>

Enables or disables serving [snap sync](../../concepts/node-sync.md#snap-synchronization) data.
Set to `true` to allow other nodes to download data from this node using snap sync.

The default is `false`.

### `snapsync-synchronizer-pre-checkpoint-headers-only-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--snapsync-synchronizer-pre-checkpoint-headers-only-enabled[=<true|false>]
```
</TabItem>

<TabItem value="Example" label="Example">

```bash
--snapsync-synchronizer-pre-checkpoint-headers-only-enabled=false
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_SNAPSYNC_SYNCHRONIZER_PRE_CHECKPOINT_HEADERS_ONLY_ENABLED=false
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file">

```bash
snapsync-synchronizer-pre-checkpoint-headers-only-enabled=false
```

</TabItem>
</Tabs>

If set to `false`, [snap sync](../../concepts/node-sync.md#snap-synchronization) downloads full pre-merge Proof of Work (PoW) historical blocks
instead of headers only, allowing full historical data to be retained. 

The default is `true`.

Setting this option to `false` increases sync time and disk space usage.

### `snapsync-synchronizer-transaction-indexing-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--snapsync-synchronizer-transaction-indexing-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--snapsync-synchronizer-transaction-indexing-enabled=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_SNAPSYNC_SYNCHRONIZER_TRANSACTION_INDEXING_ENABLED=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
snapsync-synchronizer-transaction-indexing-enabled=true
```

</TabItem>

</Tabs>

Enables or disables transaction indexing during initial sync for [snap sync](../../concepts/node-sync.md#snap-synchronization) and [checkpoint sync](../../concepts/node-sync.md#checkpoint-synchronization). 

The default is `false`.

:::note Notes

- Enable this option to query historical transactions by hash. 
- Setting this option to `true` increases sync time and disk space usage.
:::

### `static-nodes-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--static-nodes-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--static-nodes-file=/path/to/besudata/static-nodes.json
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_STATIC_NODES_FILE=/path/to/besudata/static-nodes.json
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
static-nodes-file="/path/to/besudata/static-nodes.json"
```

</TabItem>

</Tabs>

Static nodes JSON file containing the [static nodes](../../how-to/connect/static-nodes.md) for this node to connect to. The default is `datapath/static-nodes.json`.

### `strict-tx-replay-protection-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--strict-tx-replay-protection-enabled[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--strict-tx-replay-protection-enabled=false
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_STRICT_TX_REPLAY_PROTECTION_ENABLED=false
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
strict-tx-replay-protection-enabled=false
```

</TabItem>

</Tabs>

Enables or disables replay protection, in accordance with [EIP-155](https://eips.ethereum.org/EIPS/eip-155), on transactions submitted using JSON-RPC. 

The default is `false`.

### `sync-min-peers`, `fast-sync-min-peers`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--sync-min-peers=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--sync-min-peers=8
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_SYNC_MIN_PEERS=8
```

</TabItem>

<TabItem value="Example configuration file" label="Example configuration file"> 

```bash
sync-min-peers=8
```

</TabItem>

</Tabs>

The minimum number of peers required before starting [sync](../../concepts/node-sync.md). The default is `5`. Set to `1` to enable static peers to contribute to the initial sync.

:::info

This option does not apply to Proof of Stake networks.

:::

### `sync-mode`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--sync-mode=<MODE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--sync-mode=SNAP
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_SYNC_MODE=SNAP
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
sync-mode="SNAP"
```

</TabItem>

</Tabs>

The synchronization mode. Use `SNAP` for [snap sync](../../concepts/node-sync.md#snap-synchronization), `CHECKPOINT` for [checkpoint sync](../../concepts/node-sync.md#checkpoint-synchronization), `FAST` for [fast sync](../../concepts/node-sync.md#fast-synchronization-deprecated), and `FULL` for [full sync](../../concepts/node-sync.md#full-synchronization).

- The default is `FULL` when connecting to a private network by not using the [`--network`](#network) option and specifying the [`--genesis-file`](#genesis-file) option.
- The default is `SNAP` when using the [`--network`](#network) option with named networks, except for the `dev` development network. `SNAP` is also the default if running Besu on the default network (Ethereum Mainnet) by specifying neither [network](#network) nor [genesis file](#genesis-file).

:::note Notes

- We recommend using snap sync over fast sync because snap sync can be faster by several days.
- Fast sync is deprecated in Besu version 24.12.0 and later.
  We recommend updating Besu to a version that supports other sync methods.
- When using a mode other than `FULL`, most historical world state data is unavailable.
  Any methods attempting to access unavailable world state data return `null`.

:::

### `target-gas-limit`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--target-gas-limit=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--target-gas-limit=8000000
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TARGET_GAS_LIMIT=8000000
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
target-gas-limit="8000000"
```

</TabItem>

</Tabs>

The gas limit toward which Besu will gradually move on an existing network, if enough miners are in agreement. To change the block gas limit set in the genesis file without creating a new network, use `target-gas-limit`. The gas limit between blocks can change only 1/1024th, so the target tells the block creator how to set the gas limit in its block. If the values are the same or within 1/1024th, Besu sets the limit to the specified value. Otherwise, the limit moves as far as it can within that constraint.

If a value for `target-gas-limit` is not specified, the block gas limit remains at the value specified in the [genesis file](../genesis-items.md#genesis-block-parameters).

Use the [`miner_changeTargetGasLimit`](../api/index.md#miner_changetargetgaslimit) API to update the `target-gas-limit` while Besu is running. Alternatively restart Besu with an updated `target-gas-limit` value.

### `tx-pool`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool=<TYPE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool=sequenced
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL=sequenced
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool="sequenced"
```

</TabItem>

</Tabs>

Type of [transaction pool](../../concepts/transactions/pool.md) to use.
Set to `layered` to use the [layered transaction pool](../../concepts/transactions/pool.md#layered-transaction-pool) implementation.
The default is `layered`.

Set to `sequenced` to use the [sequenced transaction pool](../../concepts/transactions/pool.md#sequenced-transaction-pool).
The default is `sequenced` for the [enterprise/private profile](../../how-to/configure-besu/profile.md#enterpriseprivate-profile).

### `tx-pool-blob-price-bump`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-blob-price-bump=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-blob-price-bump=25
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_BLOB_PRICE_BUMP=25
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-blob-price-bump="25"
```

</TabItem>

</Tabs>

Sets the price bump policy for re-issued blob transactions as a percentage increase in price. 
A blob transaction can only replace, or be replaced by, another blob transaction.
The default is `100`.

### `tx-pool-enable-balance-check`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-enable-balance-check[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-enable-balance-check=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_ENABLE_BALANCE_CHECK=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-enable-balance-check=true
```

</TabItem>

</Tabs>

Enables or disables balance checks for pending transactions in the [transaction pool](../../concepts/transactions/pool.md).
When enabled, the check prevents pending transactions, whose sender doesn't have enough balance to pay their fee, from being included in the prioritized layer. This prevents such transactions from occupying space and potentially being selected for block production.

The default is `false`.

### `tx-pool-enable-save-restore`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-enable-save-restore[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-enable-save-restore=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_ENABLE_SAVE_RESTORE=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-enable-save-restore=true
```

</TabItem>

</Tabs>

Enables or disables saving the [transaction pool](../../concepts/transactions/pool.md) contents to a
file on shutdown and reloading it at startup.

The default is `false`.

You can define a custom path to the transaction pool file using the [`--tx-pool-save-file`](#tx-pool-save-file) option.

### `tx-pool-layer-max-capacity`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-layer-max-capacity=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-layer-max-capacity=20000000
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_LAYER_MAX_CAPACITY=20000000
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-layer-max-capacity="20000000"
```

</TabItem>

</Tabs>

Maximum amount of memory (in bytes) that any layer within the [layered transaction pool](../../concepts/transactions/pool.md#layered-transaction-pool) can occupy.
The default is `12500000`, or 12.5 MB.

The transaction pool includes two memory-limited layers, resulting in an expected memory consumption
that is twice the value specified by this option, or 25 MB by default.
Increase this value if you have spare RAM and the eviction rate is high for your network.

### `tx-pool-limit-by-account-percentage`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-limit-by-account-percentage=<DOUBLE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-limit-by-account-percentage=0.1
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_LIMIT_BY_ACCOUNT_PERCENTAGE=0.1
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-limit-by-account-percentage=0.4
```

</TabItem>

</Tabs>

The maximum percentage of transactions from a single sender kept in the [transaction pool](../../concepts/transactions/pool.md).
Accepted values are in the range `(0–1]`.
The default is `.001`, or 0.1% of transactions from a single sender to be kept in the pool.

:::caution
- With the [layered transaction pool](../../concepts/transactions/pool.md#layered-transaction-pool)
  implementation, this option is not applicable.
  Replace this option with [`--tx-pool-max-future-by-sender`](#tx-pool-max-future-by-sender) to
  specify the maximum number of sequential transactions from a single sender kept in the pool.

- The default value is often unsuitable for [private networks](../../../private-networks/index.md).
  This feature mitigates future-nonce transactions from filling the pool without ever being
  executable by Besu.
  This is important for Mainnet, but may cause issues on private networks.
  Please update this value or set to `1` if you know the nodes gossiping transactions in your network.
:::

### `tx-pool-max-future-by-sender`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-max-future-by-sender=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-max-future-by-sender=250
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_MAX_FUTURE_BY_SENDER=250
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-max-future-by-sender="250"
```

</TabItem>

</Tabs>

The maximum number of sequential transactions from a single sender kept in the
[layered transaction pool](../../concepts/transactions/pool.md#layered-transaction-pool).
The default is `200`.

Increase this value to allow a single sender to fit more transactions in a single block.
For private networks, you can set this in the hundreds or thousands if you want to ensure
transactions with large nonce gaps remain in the transaction pool.

### `tx-pool-max-prioritized`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-max-prioritized=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-max-prioritized=1500
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_MAX_PRIORITIZED=1500
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-max-prioritized="1500"
```

</TabItem>

</Tabs>

The maximum number of transactions that are prioritized in the
[layered transaction pool](../../concepts/transactions/pool.md#layered-transaction-pool).
The default is `2000`.

For private networks, we recommend setting this value to the maximum number of transactions that fit
in a block in your network.

### `tx-pool-max-prioritized-by-type`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-max-prioritized-by-type=<TYPE=INTEGER>[,<TYPE=INTEGER>...]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-max-prioritized-by-type=["BLOB=6","FRONTIER=200"]
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_MAX_PRIORITIZED_BY_TYPE=["BLOB=6","FRONTIER=200"]
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-max-prioritized-by-type=["BLOB=6","FRONTIER=200"]
```

</TabItem>

</Tabs>

The maximum number of transactions of a specific [transaction type](../../concepts/transactions/types.md) that are prioritized in the [layered transaction pool](../../concepts/transactions/pool.md#layered-transaction-pool). 

This option is mostly useful for tuning the amount of prioritized [blob transactions](../../concepts/transactions/types.md#blob-transactions) in the transaction pool. 
Keeping the prioritized layer sorted is costly, and only a few blob transactions can fit in a block (currently a maximum of six). 
Tuning the maximum number of prioritized transactions by type can help maintain the efficiency and performance of the transaction pool.
The default is `BLOB=6`.

### `tx-pool-max-size`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-max-size=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-max-size=2000
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_MAX_SIZE=2000
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-max-size="2000"
```

</TabItem>

</Tabs>

The maximum number of transactions kept in the [transaction pool](../../concepts/transactions/pool.md).
The default is `4096`.

:::caution
With the [layered transaction pool](../../concepts/transactions/pool.md#layered-transaction-pool)
implementation, this option is not applicable because the layered pool is limited by memory size
instead of the number of transactions.
To configure the maximum memory capacity, use [`--tx-pool-layer-max-capacity`](#tx-pool-layer-max-capacity).
:::

### `tx-pool-min-gas-price`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-min-gas-price=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-min-gas-price=2000
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_MIN_GAS_PRICE=2000
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-min-gas-price="2000"
```

</TabItem>

</Tabs>

The minimum gas price, in wei, required for a transaction to be accepted into the [transaction pool](../../concepts/transactions/pool.md).

### `tx-pool-min-score`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-min-score=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-min-score=-100
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_MIN_SCORE=-100
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-min-score="-100"
```

</TabItem>

</Tabs>

Remove a pending transaction from the [layered transaction pool](../../concepts/transactions/pool.md#penalize-transient-invalid-pending-transactions)
if its score is lower than this value. Accepts a value between `-128` and `127`.
The default is `-128`.

The lowest score a pending transaction can have is `-128`. The default value of `-128` means that pending
transactions will not be removed and will remain in the pool with the lowest score, being selected after
all other pending transactions.

### `tx-pool-no-local-priority`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-no-local-priority[=<true|false>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-no-local-priority=true
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_NO_LOCAL_PRIORITY=true
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-no-local-priority=true
```

</TabItem>

</Tabs>

If this option is set to `true`, senders of transactions submitted via RPC are *not* prioritized over
remote transactions in the [transaction pool](../../concepts/transactions/pool.md).

The default is `false`.

### `tx-pool-price-bump`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-price-bump=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-price-bump=25
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_PRICE_BUMP=25
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-price-bump=25
```

</TabItem>

</Tabs>

The price bump percentage to 
[replace an existing transaction in the transaction pool](../../concepts/transactions/pool.md#replace-transactions-with-the-same-sender-and-nonce).
For networks with a [base fee and priced gas](../../concepts/transactions/pool.md#in-networks-with-a-base-fee-and-priced-gas), the default is `10`, or 10%.
For networks with [zero base fee, or free gas](../../concepts/transactions/pool.md#in-networks-with-zero-base-base-or-free-gas), the default is `0`. 

### `tx-pool-priority-senders`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-priority-senders=<address>[,<address>...]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-priority-senders=0x13003d886a7be927d9451c27eb3bc8d3616e26e9
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_PRIORITY_SENDERS=0x13003d886a7be927d9451c27eb3bc8d3616e26e9
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-priority-senders="0x13003d886a7be927d9451c27eb3bc8d3616e26e9"
```

</TabItem>

</Tabs>

A comma-separated list of sender addresses to prioritize in the [transaction pool](../../concepts/transactions/pool.md).
Transactions sent from these addresses, from any source, are prioritized and only evicted after all others.
If not specified, only senders submitting transactions via RPC have priority (unless
[`--tx-pool-no-local-priority`](#tx-pool-no-local-priority) is set to `true`).

### `tx-pool-retention-hours`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-retention-hours=<INTEGER>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-retention-hours=5
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_RETENTION_HOURS=5
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-retention-hours=5
```

</TabItem>

</Tabs>

The maximum period (in hours) to hold pending transactions in the [transaction pool](../../concepts/transactions/pool.md).
The default is `13`.

:::caution
With the [layered transaction pool](../../concepts/transactions/pool.md#layered-transaction-pool)
implementation, this option is not applicable because old transactions will expire when the memory
cache is full.
:::

### `tx-pool-save-file`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--tx-pool-save-file=<FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--tx-pool-save-file=/home/me/me_node/node_txpool.dump
```

</TabItem>

<TabItem value="Environment variable" label="Environment variable">

```bash
BESU_TX_POOL_SAVE_FILE=/home/me/me_node/node_txpool.dump
```

</TabItem>

<TabItem value="Configuration file" label="Configuration file">

```bash
tx-pool-save-file="/home/me/me_node/node_txpool.dump"
```

</TabItem>

</Tabs>

The path to the file that stores the [transaction pool's](../../concepts/transactions/pool.md)
content if the save and restore functionality is enabled using
[`--tx-pool-enable-save-restore`](#tx-pool-enable-save-restore).
The file is created on shutdown and reloaded during startup.
The default file name is `txpool.dump` in the [data directory](#data-path).

### `version`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
-V, --version
```

</TabItem>

</Tabs>

Prints version information and exits.

### `version-compatibility-protection`

<Tabs>
<TabItem value="Syntax">

```bash
--version-compatibility-protection[=<true|false>]
```

</TabItem>
<TabItem value="Example">

```bash
--version-compatibility-protection=true
```

</TabItem>
<TabItem value="Environment variable">

```bash
BESU_VERSION_COMPATIBILITY_PROTECTION=true
```

</TabItem>
<TabItem value="Configuration file">

```bash
version-compatibility-protection=true
```

</TabItem>
</Tabs>

Enables or disables performing version compatibility checks when starting Besu.
If set to `true`, it checks that the version of Besu being started is the same
or later than the version of Besu that previously started with the same data directory.

The default is `false` for named networks, such as Mainnet or Sepolia, and `true`
for non-named networks.

### `Xhelp`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
-X, --Xhelp
```

</TabItem>

</Tabs>

Displays the early access options and their descriptions, and exits.

:::caution

The displayed options are unstable and may change between releases.

:::

<!-- Links -->

[push gateway integration]: ../../how-to/monitor/metrics.md#run-prometheus-with-besu-in-push-mode
[JWT provider's public key file]: ../../how-to/use-besu-api/authenticate.md#jwt-public-key-authentication
