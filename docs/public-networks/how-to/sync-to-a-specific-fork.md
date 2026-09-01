---
title: Sync to a specific fork
sidebar_position: 9
description: Configure Besu to sync to a chosen fork during an extended period of non-finality.
keywords: [checkpoint, fork, non-finality, snap sync]
---

If the chain stops finalizing for an extended period and more than one fork is being built on,
you can pin Besu to the fork you consider correct.
Anchor [snap sync](../concepts/node-sync.md#snap-synchronization) to a checkpoint block on that
fork, and reject any peer that doesn't have that block.

## Prerequisites

Ensure you have a new Besu installation with an empty data directory.
To sync to a specific fork, you cannot use a node that has already synced.

## Steps

### 1. Get your checkpoint block information

Choose the fork you want to follow, and choose a block on that fork to anchor snap sync to.
Verify the following information about the checkpoint block:

- **The block hash and number.**
  Query a node that is already following the intended fork, or use a block explorer that reports
  that fork.

  :::warning
  Besu disconnects from every peer that doesn't have the block you specify.
  If the block hash and number don't match a block that exists, Besu finds no peers
  and doesn't sync.
  Confirm against a source you trust that the block exists and is on the fork you
  want to follow before you start the node.
  :::

- **The total difficulty.**
  Every proof-of-stake (PoS) block has a difficulty of `0`, so the total difficulty stopped
  increasing at [The Merge](https://ethereum.org/en/roadmap/merge/) and is identical for every
  block since.
  On Mainnet, that value is `0xC70D815D562D3CFA955` (the total difficulty at block 15537394, the
  first PoS block).

### 2. Start Besu with a new configuration

Start Besu with the following options:

```bash
besu \
  --checkpoint=<BLOCK_HASH>:<BLOCK_NUMBER>:<TOTAL_DIFFICULTY> \
  --snapsync-synchronizer-skip-pre-checkpoint-headers-enabled=true \
  --required-block=<BLOCK_NUMBER>=<BLOCK_HASH>
```

In the command:

- [`--checkpoint`](../reference/options.md#checkpoint) anchors sync to your chosen block, in the
  format `<blockHash>:<blockNumber>:<totalDifficulty>`.
  This overrides any
  [checkpoint configured in the genesis file](../reference/genesis-items.md#checkpoint-configuration).
- [`--snapsync-synchronizer-skip-pre-checkpoint-headers-enabled`](../reference/options.md#snapsync-synchronizer-skip-pre-checkpoint-headers-enabled)
  stops the header download at the checkpoint instead of continuing back to the genesis block.
  The default is `false`, so you must set it explicitly.
  Below the checkpoint, a peer can serve headers that aren't on the fork you want, and Besu
  restarts the header download and retries for as long as it takes.
  Stopping at the checkpoint gives the header download a better chance of completing.
- [`--required-block`](../reference/options.md#required-block) rejects any peer that doesn't have
  the specified hash at the specified block number.
  Use the same block as the checkpoint so that Besu only peers with nodes on your chosen fork.

:::note
Ensure you are using [snap sync](../concepts/node-sync.md#snap-synchronization).
Snap sync is the default for all named networks, so you don't need to set
[`--sync-mode=SNAP`](../reference/options.md#sync-mode) unless your configuration selects a
different sync mode.
:::

Because `--required-block` filters out peers on other forks, expect a smaller peer count than
usual, and a longer time to find enough peers to sync.

After the chain finalizes again, remove these options and restart the node to peer normally.
