---
title: Node synchronization
sidebar_position: 4
description: Learn about node synchronization for public networks.
---

# Node synchronization

Besu supports two [node types](#node-types) and two [synchronization modes](#sync-modes) on public networks.

## Node types

### Full nodes

A full node consists of an 
[execution and consensus client](node-clients.md#execution-and-consensus-clients), 
and stores a local copy of the blockchain.
With a full node, you can check current balances, sign and send transactions, and look at current
dapp data.

Full nodes can guarantee the latest state of the blockchain (and some older states). However, they
can't serve the network with all data requests (for example, the balance of an account at an old
block).

Run a full node using [snap synchronization](#snap-synchronization).

### Archive nodes

An archive node is a node that also stores the intermediary state of every account and contract
for every block since the genesis block. 
Archive nodes can do everything full nodes do, and they can also access historical state data. 
This means that archive nodes require more disk space than full nodes.

Run an archive node using [full synchronization](#full-synchronization).

:::caution important
Do not run an archive node with the [Bonsai Tries](data-storage-formats.md#bonsai-tries)
data storage format.
Bonsai is designed for retrieving recent data only.
:::

## Sync modes

The following table summarizes the recommended public network sync modes:

| Sync mode                     | Recommended use | Besu version requirement |
|-------------------------------|-----------------|--------------------------|
| [Snap](#snap-synchronization) | Full nodes on Mainnet and public testnets. | 22.4.0 or later |
| [Full](#full-synchronization) | Archive nodes on smaller networks. Not recommended on Mainnet. | Any |

:::warning Checkpoint sync

Checkpoint sync is deprecated.
When you select checkpoint sync, Besu performs snap sync instead.

:::

:::info Private network syncing

Private networks might require different sync configurations.
See [Node synchronization for private networks](../../private-networks/concepts/node-sync-private.md)
for more information.

:::

:::note Troubleshooting

Besu must connect with other peers to sync with the network.
If your node is having trouble peering, try [troubleshooting peering](../how-to/troubleshoot/peering.md).

:::

### Snap synchronization

Snap sync is the default sync mode for all named [networks](../reference/cli/options.md#network)
except `dev`.
You can enable snap sync using [`--sync-mode=SNAP`](../reference/cli/options.md#sync-mode).
You need Besu version 22.4.0 or later to use snap sync.
By default, [Snap sync prunes historical block data](../how-to/pre-merge-history-expiry.md) for
[pre-merge](https://ethereum.org/en/roadmap/merge/) PoW blocks, retaining only the
headers and the genesis block.

:::note
To download the full PoW block history, set
[`--snapsync-synchronizer-pre-checkpoint-headers-only-enabled`](../reference/cli/options.md#snapsync-synchronizer-pre-checkpoint-headers-only-enabled)
to `false`. However, this will increase the sync time and disk space usage.
:::

Instead of downloading the [state trie](data-storage-formats.md) node by node, snap
sync downloads as many leaves of the trie as possible, and reconstructs the trie locally.
To enable serving snap sync data to other nodes, set
[`--snapsync-server-enabled`](../reference/cli/options.md#snapsync-server-enabled) to `true`.

You can restart Besu during a snap sync in case of hardware or software problems. The sync resumes
from the last valid world state and continues to download blocks starting from the last downloaded
block.

See [how to read the Besu metrics charts](../how-to/monitor/understand-metrics.md) when using
snap sync.

### Full synchronization

Full sync is the default sync mode for the [`dev` network](../reference/cli/options.md#network).
You can enable full sync using [`--sync-mode=FULL`](../reference/cli/options.md#sync-mode).
Use full sync with [Forest of Tries](data-storage-formats.md#forest-of-tries) to run an
[archive node](#archive-nodes).
Full sync starts from the genesis block and reprocesses all transactions.

You can optionally [download and sync pre-merge Ethereum history](../how-to/era1-file-full-sync.md)
from ERA1 archive files instead of relying on peered nodes for the data.

:::caution important
Do not run full sync with the [Bonsai Tries](data-storage-formats.md#bonsai-tries)
data storage format.
Bonsai is designed for retrieving recent data only.
:::

## Sync times

To sync with a public network, Besu runs two processes in parallel: the world state sync and the
blockchain download.

While the world state syncs, Besu downloads and imports the blockchain in the background.
The blockchain download time depends on CPU, the network, Besu's peers, and disk speed.
The blockchain download generally takes longer than the world state sync. Besu must catch up to the 
current chain head and sync the world state to participate on Mainnet.

The following table shows estimates for each sync mode on Mainnet.
All times are hardware dependent.

| Sync mode | Storage format | Node type    | Mainnet sync time |
|-----------|----------------|--------------|-------------------|
| Snap      | [Bonsai](data-storage-formats.md#bonsai-tries)    | Full node    | ~12-16 hours |
| Full      | [Forest](data-storage-formats.md#forest-of-tries) | Archive node | ~weeks       |

The Bonsai snap sync estimate is based on May 2026 burn-in results for the Besu 26.5.0
release cycle on AWS `m8g.2xlarge` instances.
The observed sync time range includes differences in peer sets and disk speed.
By default, snap sync prunes historical block data for pre-merge PoW blocks.
Downloading full PoW blocks could double the download time.

Full sync takes significantly more time than snap sync, and we do not recommend using it on Mainnet.

See the [storage estimates](data-storage-formats.md#storage-estimates) for the different sync modes and node types.

:::note
Testnets take significantly less time and space to sync.
:::
