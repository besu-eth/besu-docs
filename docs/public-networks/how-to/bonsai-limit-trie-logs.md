---
title: Reduce storage for Bonsai Tries
sidebar_position: 9
description: Reduce the size of your database when using Bonsai Tries
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Reduce storage for Bonsai Tries

When using the [Bonsai Tries](../concepts/data-storage-formats.md#bonsai-tries) data storage format,
[`--bonsai-limit-trie-logs-enabled`](../reference/cli/options.md#bonsai-limit-trie-logs-enabled) is
enabled by default. 
When enabled, this feature can reduce database growth by more than 3 GB each week on Mainnet.

:::note
If [`--sync-mode=FULL`](../reference/cli/options.md#sync-mode) is set, the
[`--bonsai-limit-trie-logs-enabled`](../reference/cli/options.md#bonsai-limit-trie-logs-enabled)
option is disallowed and must be set to `false`.
:::

## Limit and prune trie logs

If you're running Besu without
[`--bonsai-limit-trie-logs-enabled`](../reference/cli/options.md#bonsai-limit-trie-logs-enabled),
you might have a backlog of redundant trie logs.
You can prune these using the following instructions.

:::note
Ensure you are using Besu version 24.6.0 or later.
If you are using an older version, upgrade Besu or refer to the older version of the documentation.
:::

:::caution
The following commands are examples.
Before executing these example commands on your node, modify them to apply to your node's configuration.
:::
 
1. Stop Besu.
1. (Optional) Run the Besu trie log prune command. Specify the Bonsai Trie data storage format and the data directory for your Besu database:
    ```bash
    sudo /usr/local/bin/besu/bin/besu --data-storage-format=BONSAI --data-path=/var/lib/besu --sync-mode=SNAP storage trie-log prune
    ```
1. Start Besu.
1. Look for `Limit trie logs enabled: retention: 512; prune window: 30000` in your Besu configuration printout at startup.

### Prune outdated trie logs

When you start Besu with
[`--bonsai-limit-trie-logs-enabled`](../reference/cli/options.md#bonsai-limit-trie-logs-enabled), it
continuously prunes the unnecessary trie log data, removing it one block at a time.
This process begins after an initial reduction in the database size during startup.

Enabling `--bonsai-limit-trie-logs-enabled` on a long-running node does not immediately clear your backlog of trie logs in the same way resyncing does. 
Instead of resyncing, you can run an offline command to immediately prune old trie logs. 
To run the offline command, you must shut down Besu for a minimal period. 
If the `--bonsai-limit-trie-logs-enabled` option is enabled, you do not need to run the offline command again after initially running it.

For minimal downtime, we recommend running the offline command before restarting Besu with `--bonsai-limit-trie-logs-enabled`.

If you are following the guides by [Somer Esat](https://someresat.medium.com/guide-to-staking-on-ethereum-ubuntu-teku-f09ecd9ef2ee) or [CoinCashew](https://www.coincashew.com/coins/overview-eth/guide-or-how-to-setup-a-validator-on-eth2-mainnet/part-i-installation/step-3-installing-execution-client/besu), you have set the following options in your `besu.service` or `execution.service` systemd file:

```bash
...
ExecStart=/usr/local/bin/besu/bin/besu \
...
  --sync-mode=SNAP \
  --data-path="/var/lib/besu" \
  --data-storage-format=BONSAI \
...
```
To prune trie logs, the command should look similar to the following:

```bash
sudo /usr/local/bin/besu/bin/besu --data-storage-format=BONSAI --data-path=/var/lib/besu --sync-mode=SNAP storage trie-log prune
```

The logs should look similar to the following:

```bash
2024-02-02 05:45:41.162+00:00 | main | INFO  | KeyPairUtil | Attempting to load public key from /data/besu/key
 ...
2024-02-02 05:45:43.433+00:00 | main | INFO  | TrieLogSubCommand | Estimating trie logs size before pruning...
2024-02-02 05:45:43.837+00:00 | main | INFO  | TrieLogSubCommand | Estimated trie logs size before pruning: 9 GiB
2024-02-02 05:46:09.863+00:00 | main | INFO  | TrieLogHelper | Starting pruning: retain 512 trie logs, processing in 1 batches...
2024-02-02 05:46:09.918+00:00 | main | INFO  | TrieLogHelper | Saving trie logs to retain in file /data/besu/database/trieLogsToRetain-1 (batch 1)...
2024-02-02 05:46:09.926+00:00 | main | INFO  | TrieLogHelper | Obtaining trielogs from db, this may take a few minutes...
2024-02-02 05:46:10.100+00:00 | main | INFO  | TrieLogHelper | Clear trie logs...
2024-02-02 05:46:10.155+00:00 | main | INFO  | TrieLogHelper | Restoring trie logs retained from batch 1...
2024-02-02 05:46:10.222+00:00 | main | INFO  | TrieLogHelper | Key(0): 0xcd50706da7f6f2db7f9d54f3589122760900d9ab2508c20a4ca40b496d930368
... 
2024-02-02 05:46:10.336+00:00 | main | INFO  | TrieLogHelper | Key(511): 0x238f9649b59616430ad7e43b8f3cf65bc97cac4aa54a3eddf3ad6ee666ce733e
2024-02-02 05:46:10.441+00:00 | main | INFO  | TrieLogHelper | Deleting files...
2024-02-02 05:46:10.446+00:00 | main | INFO  | TrieLogSubCommand | Finished pruning. Re-estimating trie logs size...
2024-02-02 05:46:11.023+00:00 | main | INFO  | TrieLogSubCommand | Estimated trie logs size after pruning: 0 B (0 B estimate is normal when using default settings)
2024-02-02 05:46:11.023+00:00 | main | INFO  | TrieLogSubCommand | Prune ran successfully. We estimate you freed up 9 GiB!
Prune ran successfully. We estimate you freed up 9 GiB!
```

If you are using a TOML configuration file, you can run a command similar to the following:

```bash
sudo /usr/local/bin/besu/bin/besu --config-file=besu-config.toml storage trie-log prune
```

## Troubleshoot

Troubleshoot common errors that can occur when using the trie log prune command to reduce your database size for Bonsai Tries.
To minimize errors, ensure your command specifies the following:

- [`--data-storage-format`](../reference/cli/options.md#data-storage-format)
- [`--data-path`](../reference/cli/options.md#data-path)
- [`--sync-mode`](../reference/cli/options.md#sync-mode)

### Prune command for Mainnet

The prune command should look similar to the following:

```bash
sudo /usr/local/bin/besu/bin/besu --data-path=/var/lib/besu --data-storage-format=BONSAI --sync-mode=SNAP storage trie-log prune
```

Ensure you stop Besu before running the command.

###  Subcommand not working

- `java.lang.IllegalArgumentException: Subcommand only works with data-storage-format=BONSAI`

The `--data-storage-format=BONSAI` might be missing. 
To resolve, add the storage format. 
The command should look similar to the following:

```bash
sudo /usr/local/bin/besu/bin/besu --data-storage-format=BONSAI --data-path=/var/lib/besu --sync-mode=SNAP storage trie-log prune
```

### Column handle not found for segment `TRIE_BRANCH_STORAGE`

- `java.lang.RuntimeException: Column handle not found for segment TRIE_BRANCH_STORAGE`

Ensure you specify `--data-path`. 
Your command should look similar to the following:

```bash
sudo /usr/local/bin/besu/bin/besu --data-path=/var/lib/besu --data-storage-format=BONSAI --sync-mode=SNAP storage trie-log prune
```

### Database not detected

- `java.lang.IllegalArgumentException: Trying to retain more trie logs than chain length (0), skipping pruning`

Ensure you specify the correct `--data-path` for your node. 
Your command should look similar to the following:

```bash
sudo /usr/local/bin/besu/bin/besu --data-path=/var/lib/besu --data-storage-format=BONSAI --sync-mode=SNAP storage trie-log prune
```

### Cannot store generated private key

- `java.lang.IllegalArgumentException: Cannot store generated private key`

Ensure you specify the correct `--data-path` for your node. 
Your command should look similar to the following:

```bash
sudo /usr/local/bin/besu/bin/besu --data-path=/var/lib/besu --data-storage-format=BONSAI --sync-mode=SNAP storage trie-log prune
```

### Valid keypair not provided

- `java.lang.IllegalArgumentException: Supplied file does not contain valid keyPair pair.`

Check your file permissions and try running a `sudo` command to resolve the issue:

```bash
sudo /usr/local/bin/besu/bin/besu --data-storage-format=BONSAI --data-path=/var/lib/besu storage --sync-mode=SNAP trie-log prune
```

### Column handle not found for segment `WORLD_STATE`

- `java.lang.RuntimeException: Column handle not found for segment WORLD_STATE`

Ensure you are using `--data-storage-format=BONSAI` instead of `--data-storage-format=FOREST` on an existing Bonsai database.

### Resource temporarily unavailable

- `org.hyperledger.besu.plugin.services.exception.StorageException: org.rocksdb.RocksDBException: While lock file: /data/besu/database/LOCK: Resource temporarily unavailable`

Check if Besu is already running. 
You must shut down the Besu client before running the subcommand.

### Unable to change the sync mode

- `java.lang.IllegalStateException: Unable to change the sync mode when snap sync is incomplete, please restart with snap sync mode`

Check that you have specified `--sync-mode`. 
The default is `--sync-mode=SNAP`. 
Most Mainnet users use `SNAP` or `CHECKPOINT`. 

### Cannot run trie log prune

- `java.lang.RuntimeException: No finalized block present, can't safely run trie log prune`

This message might appear if your node is relatively new or recently resynced. 
To resolve this error, ensure that your node is fully synced and correctly configured to recognize finalized blocks.

### Block does not match stored chain data

- `org.hyperledger.besu.util.InvalidConfigurationException: Supplied genesis block does not match chain data stored in /data/besu.`

Check if you are running the command for a network other than Mainnet. 
To specify a network, run a command that looks similar to the following:

```bash
sudo /usr/local/bin/besu/bin/besu --network=sepolia --sync-mode=SNAP --data-storage-format=BONSAI --data-path=/var/lib/besu storage trie-log prune
```
