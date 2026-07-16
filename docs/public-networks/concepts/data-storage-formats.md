---
title: Data storage formats
sidebar_position: 3
description: Learn about storing data using Forest of Tries and Bonsai Tries.
---

# Data storage formats

Besu offers two formats for storing the world state, [Bonsai Tries](#bonsai-tries) and [Forest of Tries](#forest-of-tries).

## Bonsai Tries

Bonsai Tries is a data storage layout policy designed to reduce storage requirements and increase read performance. This is the default for Besu.

Bonsai stores leaf values in a trie log, separate from the branches of the trie. Bonsai stores nodes by the location of the node instead of the hash of the node. Bonsai can access the leaf from the underlying storage directly using the account key. This greatly reduces the disk space needed for storage and allows for less resource-demanding and faster read performance. Bonsai inherently prunes orphaned nodes and old branches.

To run a node with Bonsai Tries data storage format, use the command line option [`--data-storage-format=BONSAI`](../reference/options.md#data-storage-format).

<p align="center">

![Bonsai tries](../../assets/images/bonsai-tries.svg)

</p>

:::caution important

Do not run an [archive node](node-sync.md#archive-nodes) with Bonsai Tries.
Bonsai is designed for retrieving recent data only.

:::

:::tip

You can read more about Bonsai in [Consensys' Guide to Bonsai Tries](https://consensys.io/blog/bonsai-tries-guide).

:::

## Forest of Tries

Forest of Tries, also called forest mode, is another method of representing the world state, and is more suitable for [archive nodes](node-sync.md#archive-nodes).

In forest mode, each node in the trie is saved in a key-value store by hash. For each block, the world state is updated with new nodes, leaf nodes, and a new state root. Old leaf nodes remain in the underlying data store. Data is accessed and stored by hash, which increases the size of the database and increases the resources and time needed to access account data.

<p align="center">

![Forest of tries](../../assets/images/forest-of-tries.svg)

</p>

:::warning

Forest pruning using the `--pruning-enabled` option is no longer supported.
We recommend using [Bonsai Tries](#bonsai-tries) to save disk space.

:::

## Forest of Tries vs. Bonsai Tries

### Storage estimates

Mainnet storage requirements change over time as the chain grows.
Use the following estimates as a reference point, not fixed minimum requirements.

| Data storage format | Sync mode | Node type    | Mainnet storage estimate  |
|---------------------|-----------|--------------|---------------------------|
| Bonsai              | [Snap](node-sync.md#snap-synchronization) | [Full node](node-sync.md#full-nodes)       | ~1.14 TB |
| Forest              | [Full](node-sync.md#full-synchronization) | [Archive node](node-sync.md#archive-nodes) | ~12 TB   |

The Bonsai snap sync estimate is based on May 2026 burn-in results for the Besu 26.5.0
release cycle on AWS `m8g.2xlarge` instances.
By default, snap sync prunes historical block data for PoW blocks, retaining only the headers and the genesis block.
Downloading full PoW blocks (by setting [`--snapsync-synchronizer-pre-checkpoint-headers-only-enabled=false`](../reference/options.md#snapsync-synchronizer-pre-checkpoint-headers-only-enabled)) increases disk usage.

Forest mode uses significantly more memory than Bonsai, and we do not recommend using it on Mainnet.

### Accessing data

Forest mode must go through all the branches by hash to read a leaf value. Bonsai can access the leaf from the underlying storage directly using the account key. Bonsai will generally read faster than forest mode, particularly if the blocks are more recent.

However, Bonsai becomes increasingly more resource-intensive the further in history you try to read data. To prevent this, you can limit how far Bonsai looks back while reconstructing data. The default limit Bonsai looks back is 512. To change the parameter, use the [`--bonsai-historical-block-limit`](../reference/options.md#bonsai-historical-block-limit) option. This might directly impact [JSON-RPC API](../reference/api/index.md) queries.

:::note

Using `--bonsai-historical-block-limit` doesn't affect the size of the database being stored, only how far back to load. This means there is no "safe minimum" value to use with this option.

:::
