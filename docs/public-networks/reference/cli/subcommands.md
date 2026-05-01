---
title: Subcommands
description: Besu command line interface subcommands
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Subcommands

This reference describes the syntax of the Besu command line interface (CLI) subcommands.

:::note

This reference contains subcommands that apply to both public and private networks. For private-network-specific subcommands, see the [private network subcommands reference](../../../private-networks/reference/cli/subcommands.md).

:::

To start a Besu node using subcommands, run:

```bash
besu [OPTIONS] [SUBCOMMAND] [SUBCOMMAND OPTIONS]
```

If using Bash or Z shell, you can view subcommand suggestions by pressing the Tab key twice.

```bash
besu Tab+Tab
```

## `blocks`

Provides blocks related actions.

### `import`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu blocks import [--skip-pow-validation-enabled] [--start-block=<LONG>] [--end-block=<LONG>] --from=<block-file>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
besu blocks import --skip-pow-validation-enabled --start-block=100 --end-block=300 --from=/home/me/me_project/mainnet-export1.blocks --from=/home/me/me_project/mainnet-export2.blocks
```

</TabItem>

</Tabs>

Imports a block or range of blocks from the specified file into the blockchain database.

You can specify the starting index of the block range to import with `--start-block`. If omitted, the default start block is 0 (the beginning of the chain).

You can specify the ending index (exclusive) of the block range to import with `--end-block`. If omitted, all blocks after the start block are imported.

You can specify multiple `--from` arguments. This can be useful when blocks have been exported over time to multiple files. If multiple files are provided they are read in the order specified in the command.

Including `--skip-pow-validation-enabled` skips validation of the `mixHash` when importing blocks.

:::note

Use `--skip-pow-validation-enabled` when performing [Ethereum Foundation hive testing](https://github.com/ethereum/hive).

:::

### `export`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu blocks export [--start-block=<LONG>] [--end-block=<LONG>] --to=<block-file>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
besu --network=sepolia --data-path=/home/data/ blocks export --start-block=100 --end-block=300 --to=/home/exportblock.bin
```

</TabItem>

</Tabs>

Exports a block or range of blocks from storage to a file in RLP format.

If you omit `--start-block`, the default start block is 0 (the beginning of the chain), and if you omit `--end-block`, the default end block is the current chain head.

If you are not running the command against the default network (Mainnet), specify the `--network` or `--genesis-file` parameter.

## `operator`

Provides operator actions.

### `generate-log-bloom-cache`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu operator generate-log-bloom-cache [--start-block=<BLOCK_NUMBER>] [--end-block=<BLOCK_NUMBER>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
besu --network=sepolia --data-path=/project/sepolia operator generate-log-bloom-cache --start-block=0 --end-block=100000
```

</TabItem>

</Tabs>

:::tip

Manually executing `generate-log-bloom-cache` is not required unless you set the [`--auto-log-bloom-caching-enabled`](options.md#auto-log-bloom-caching-enabled) command line option to false.

:::

Generates cached log bloom indexes for blocks. APIs use the cached indexes for improved log query performance.

:::note

Each index file contains 100000 blocks. The last fragment of blocks less that 100000 are not indexed.

:::

To generate cached log bloom indexes while the node is running, use the [`admin_generateLogBloomCache`](../api/index.md#admin_generatelogbloomcache) API.

## `password`

Provides password related actions.

### `hash`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu password hash --password=<my-password>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
besu password hash --password=myPassword123
```

</TabItem>

</Tabs>

Generates the hash of a given password. Include the hash in the [credentials file](../../how-to/use-besu-api/authenticate.md#1-create-the-credentials-file) for JSON-RPC API [authentication](../../how-to/use-besu-api/authenticate.md).

## `public-key`

Provides node public key related actions.

:::caution

To get the public key or address of a node, ensure you use the [`--data-path`](options.md#data-path) or [`--node-private-key-file`](options.md#node-private-key-file) option with the `public-key` command. Otherwise, a new [node key](../../concepts/node-keys.md) is silently generated when starting Besu.

:::

### `export`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu public-key export [--node-private-key-file=<file>] [--to=<key-file>] [--ec-curve=<ec-curve-name>]
```

</TabItem>

<TabItem value="Example to standard output" label="Example (to standard output)">

```bash
besu --data-path=<node data path> public-key export --node-private-key-file=/home/me/me_node/myPrivateKey --ec-curve=secp256k1
```

</TabItem>

<TabItem value="Example to file" label="Example (to file)"> 

```bash
besu --data-path=<node data path> public-key export --node-private-key-file=/home/me/me_node/myPrivateKey --to=/home/me/me_project/not_precious_pub_key --ec-curve=secp256k1
```

</TabItem>

</Tabs>

Outputs the node public key to standard output or to the file specified by `--to=<key-file>`. You can output the public key associated with a specific private key file using the [`--node-private-key-file`](options.md#node-private-key-file) option. The default elliptic curve used for the key is `secp256k1`. Use the `--ec-curve` option to choose between `secp256k1` or `secp256r1`.

### `export-address`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu public-key export-address [--node-private-key-file=<file>] [--to=<address-file>] [--ec-curve=<ec-curve-name>]
```

</TabItem>

<TabItem value="Example to standard output" label="Example (to standard output)">

```bash
besu --data-path=<node data path> public-key export-address --node-private-key-file=/home/me/me_node/myPrivateKey --ec-curve=secp256k1
```

</TabItem>

<TabItem value="Example to file" label="Example (to file)">

```bash
besu --data-path=<node data path> public-key export-address --node-private-key-file=/home/me/me_node/myPrivateKey --to=/home/me/me_project/me_node_address --ec-curve=secp256k1
```

</TabItem>

</Tabs>

Outputs the node address to standard output or to the file specified by `--to=<address-file>`. You can output the address associated with a specific private key file using the [`--node-private-key-file`](options.md#node-private-key-file) option. The default elliptic curve used for the key is `secp256k1`. Use the `--ec-curve` option to choose between `secp256k1` or `secp256r1`.

## `retesteth`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu retesteth [--data-path=<PATH>] [--rpc-http-host=<HOST>] [--rpc-http-port=<PORT>] [-l=<LOG VERBOSITY LEVEL>] [--host-allowlist=<hostname>[,<hostname>…]… or * or all]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
besu retesteth --data-path=/home/me/me_node --rpc-http-port=8590 --host-allowlist=*
```

</TabItem>

</Tabs>

Runs a Retesteth-compatible server. [Retesteth](https://github.com/ethereum/retesteth/wiki) is a developer tool that can generate and run consensus tests against any Ethereum client running such a server.

The command accepts the following command line options:

- [`--data-path`](options.md#data-path)
- [`--host-allowlist`](options.md#host-allowlist)
- [`--rpc-http-host`](options.md#rpc-http-host)
- [`--rpc-http-port`](options.md#rpc-http-port)
- [`--logging`](options.md#logging)

## `storage`

Provides storage related actions.

### `prune-pre-merge-blocks`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu --data-path=/path/to/your/database storage prune-pre-merge-blocks [--prune-range-size=<INTEGER>] [--threads=<INTEGER>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
besu --data-path=/path/to/your/database storage prune-pre-merge-blocks --prune-range-size=5000 --threads=4
```

</TabItem>

</Tabs>

[Prunes all pre-merge Proof of Work blocks](../../how-to/pre-merge-history-expiry.md#offline-pruning) and associated
transaction receipts, leaving only headers and genesis block.

Specify the size of the block ranges to prune with the `--prune-range-size` option. The default range is `10000`.

Specify the number of concurrent threads to use while pruning with the `--threads` option. The default is 1 less than
the total CPU count.

### `revert-metadata`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu storage revert-metadata v2-to-v1
```

</TabItem>

</Tabs>

Reverts the modifications made by the [database metadata refactor](https://github.com/hyperledger/besu/pull/6555).
If you need to downgrade Besu, run this subcommand before installing the previous binaries.

### `revert-variables`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu --config-file <PATH-TO-CONFIG-FILE> storage revert-variables
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
besu --config-file config.toml storage revert-variables
```

</TabItem>

</Tabs>

Reverts the modifications made by the [variables storage feature](https://github.com/hyperledger/besu/pull/5471).
If you need to downgrade Besu, first run this subcommand specifying the path to
the [configuration file](../../how-to/configure-besu/index.md) normally used to
start Besu.

### `rocksdb usage`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu --config-file <PATH-TO-CONFIG-FILE> storage rocksdb usage
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
besu --config-file config.toml storage rocksdb usage
```

</TabItem>

<TabItem value="Example output" label="Example output">

```bash
|--------------------------------|-----------------|-------------|-----------------|------------------|
| Column Family                  | Keys            | Total Size  | SST Files Size  | Blob Files Size  |
|--------------------------------|-----------------|-------------|-----------------|------------------|
| BLOCKCHAIN                     | 2355141414      | 933 GiB     | 166 GiB         | 767 GiB          |
| VARIABLES                      | 26              | 240 KiB     | 240 KiB         | 0 B              |
| ACCOUNT_INFO_STATE             | 9634454         | 496 MiB     | 496 MiB         | 0 B              |
| ACCOUNT_STORAGE_STORAGE        | 24041432        | 1 GiB       | 1 GiB           | 0 B              |
| CODE_STORAGE                   | 37703864        | 12 GiB      | 12 GiB          | 0 B              |
| TRIE_BRANCH_STORAGE            | 1885032116      | 138 GiB     | 138 GiB         | 0 B              |
| TRIE_LOG_STORAGE               | 267301          | 17 GiB      | 17 GiB          | 0 B              |
|--------------------------------|-----------------|-------------|-----------------|------------------|
| ESTIMATED TOTAL                | 4311820607      | 1104 GiB    | 337 GiB         | 767 GiB          |
|--------------------------------|-----------------|-------------|-----------------|------------------|
```

</TabItem>

</Tabs>

Displays the disk space used by the RocksDB key-value database, categorized into column families.

### `trie-log`

Provides actions related to managing, recording, and logging changes for the Bonsai Trie data.

#### `count`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu --config-file <PATH-TO-CONFIG-FILE> storage trie-log count
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
besu --config-file config.toml storage trie-log count
```

</TabItem>

<TabItem value="Example output" label="Example output">

```bash
trieLog count: 742311
 - canonical count: 681039
 - fork count: 217
 - orphaned count: 61055
```

</TabItem>

</Tabs>

Displays the number of trie logs in the database.
This is the number of keys for the `TRIE_LOG_STORAGE` [column family in RocksDB](#rocksdb-usage). 
The following are specified in the `trieLog count`:
- `canonical count` represents the finalized blockchain.
- `fork count` represents non-finalized branches of the blockchain.
- `orphaned count` represents trie logs not in the blockchain, which can occur  during block creation.

#### `prune`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu --config-file <PATH-TO-CONFIG-FILE> storage trie-log prune
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
besu --config-file config.toml storage trie-log prune
```

</TabItem>

<TabItem value="Example setting retention limit" label="Example setting retention limit">

```bash
besu --config-file config.toml --bonsai-historical-block-limit=1024 storage trie-log prune
```

</TabItem>

</Tabs>

Removes all trie log layers below the specified retention limit, including orphaned trie logs. 
You can configure the retention limit using [`--bonsai-historical-block-limit`](options.md#bonsai-historical-block-limit). 
The retention limit should match the configuration used with [`--bonsai-limit-trie-logs-enabled`](options.md#bonsai-limit-trie-logs-enabled). 
The default limit is `512`.

#### `export`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu --config-file <PATH-TO-CONFIG-FILE> storage trie-log export [--trie-log-block-hash=<list>] [--trie-log-file-path=<file>]
```

</TabItem>

<TabItem value="Example exporting single trie log">

```bash
besu --config-file config.toml storage trie-log export --trie-log-block-hash=0x0dcfa528de7d12df63673d0ebbd103dbf3a9464fae7eeb89e0934678cd05d64b
```

:::note
This example exports the trie log corresponding to a particular block hash into a file in the default location, `<data-dir>/trie-logs.bin`.
:::

</TabItem>

<TabItem value="Example exporting list">

```bash
besu --config-file config.toml storage trie-log export --trie-log-file-path=/tmp/list_of_trielogs.bin --trie-log-block-hash=0x0dcfa528de7d12df63673d0ebbd103dbf3a9464fae7eeb89e0934678cd05d64b,0xe8c3e77a6eaf6c87552aee07b86ecf4aacba43650b1d6aac32a44fa3ca97780d,0x86df7008b32fee67baac103846931c58454fc1b391e7d826c4886ba8580ba169
```

:::note
This example exports trie logs corresponding to a list of block hashes into a specific file location.
:::

</TabItem>

</Tabs>

Exports the trie logs of blocks specified by hash to a binary file.

By default, Bonsai trie logs are regularly pruned, so the trie log for a given block might not be present if it has been pruned.
If you need to manually import or export trie logs, we recommend temporarily disabling trie log pruning by setting
[`--bonsai-limit-trie-logs-enabled`](options.md#bonsai-limit-trie-logs-enabled) to `false`.

#### `import`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu --config-file <PATH-TO-CONFIG-FILE> storage trie-log import [--trie-log-file-path=<file>]
```

</TabItem>

<TabItem value="Example">

```bash
besu --config-file config.toml storage trie-log import --trie-log-file-path=/tmp/list_of_trielogs.bin 
```

</TabItem>

</Tabs>

Imports trie logs from a binary trie log export file.

By default, Bonsai trie logs are regularly pruned.
If pruning is enabled, Besu might subsequently prune the imported trie logs.
If you need to manually import or export trie logs, we recommend temporarily disabling trie log pruning by setting
[`--bonsai-limit-trie-logs-enabled`](options.md#bonsai-limit-trie-logs-enabled) to `false`.

## `validate-config`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu validate-config --config-file <PATH-TO-CONFIG-FILE>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
besu validate-config --config-file config.toml
```

</TabItem>

</Tabs>

Performs basic syntax validation of the specified [configuration file](../../how-to/configure-besu/index.md). Checks TOML syntax (for example, valid format and unmatched quotes) and flags unknown options. Doesn't check data types, and doesn't check dependencies between options (this is done at Besu startup).
