---
title: Prune pre-merge history
sidebar_position: 9
description: Reduce the size of your database by removing pre-merge blocks from your blockchain
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Node operators using [Snap sync](../concepts/node-sync.md#snap-synchronization) can significantly reduce
disk usage by removing [pre-merge](https://ethereum.org/en/roadmap/merge/) Proof of Work (PoW)
block data from the local database.

Besu can prune all pre-merge block bodies and associated transaction receipts, leaving only headers and
the genesis block.

:::warning

Besu does not currently provide a way to import pre-merge block data after pruning.
If you need to restore the full pre-merge history, you can revert to the former Snap sync behaviour and download
all blocks from peers by setting
[`--snapsync-synchronizer-pre-checkpoint-headers-only-enabled=false`](../reference/cli/options.md#snapsync-synchronizer-pre-checkpoint-headers-only-enabled).

:::

Besu provides multiple options to prune the historical blockchain data:
- [Offline pruning](#offline-pruning) to prune data on a stopped Besu instance.
- [Online pruning](#online-pruning) to prune data on a running Besu instance.
- [Sync Besu](#sync-without-pre-merge-blocks) using Snap sync, which by default prunes the historical
    blockchain data.

## Offline pruning

The fastest option for pruning pre-merge blocks is to perform an offline prune. It won't prune as much data as a full resync.

1. Ensure your Besu instance has stopped, and run the following command:

    ```bash
    besu --data-path=/path/to/your/database storage prune-pre-merge-blocks
    ```
    The command [`prune-pre-merge-blocks`](../reference/cli/subcommands.md#prune-pre-merge-blocks)
    prunes the database using the default options.

    On completion, you'll receive the `Pruning pre-merge blocks and transaction receipts completed` log message.
    It should only take a few minutes to complete but has been known to take up to two hours on occasion.

1. Add the [`--history-expiry-prune`](../reference/cli/options.md#history-expiry-prune)
    option and restart Besu to apply opinionated database garbage collection options to help free up space. You can tweak underlying
    garbage collection options separately if necessary.

   :::info
   In testing, we saw the space increased by up to 200GB before the space was finally reclaimed.
   We suggest waiting 24-48 hours for all the space to be reclaimed.
   :::

1. (Optional) Remove the `--history-expiry-prune` option and restart Besu. This will disable garbage collection which isn't necessary after pruning has reclaimed all the space.

## Online pruning

Online pruning allows you to prune the pre-merge blocks on a running Besu instance. It has the least
downtime but may impact normal operations for lower spec users. Add the [`--history-expiry-prune`](../reference/cli/options.md#history-expiry-prune) option and restart your Besu node.

:::note
The early access option  `--Xpre-merge-pruning-quantity` can be used to specify how many blocks to prune
for each new block added to the chain. For example, `--Xpre-merge-pruning-quantity=10`.
During testing on a 4 CPU machine, we only noticed an impact to Besu when this was tuned to `1000`
:::

The Besu logs will print the progress in the logs, and you'll see the `Done pruning pre-merge blocks.` message
when complete.

## Sync without pre-merge blocks

This option has the most downtime but reclaims the most disk space.
Delete your database and by default, syncing a Besu node using [`SNAP` sync (`--sync-mode=SNAP`)](../reference/cli/options.md#sync-mode)
will prune pre-merge blocks and only retain their headers.

If you're a solo staker, consider using [RocketPool's rescue node](https://rescuenode.com/docs/about)
to minimize downtime.
