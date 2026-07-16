---
sidebar_label: Node synchronization
sidebar_position: 4
description: Learn about node synchronization for private networks.
---

# Node synchronization for private networks

For private, permissioned blockchain networks, Besu uses the same [synchronization 
modes as public networks](../../public-networks/concepts/node-sync.md), but with specific configurations
for private network needs.

To sync Besu on a private network:

- Ensure all nodes use compatible sync modes and configurations.
- Configure the network with a custom genesis file.
- Set the network ID and bootnodes specific to your private network.
- Implement permissioning features to control network access.

The following is an overview of the private network sync modes.
Select the sync mode based on your network's requirements and node purposes.

| Sync mode                                                                | Private network use                                                                                                      | Description                                                                                                                                |
|--------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| [Full](../../public-networks/concepts/node-sync.md#full-synchronization) | Default for private networks. Use full sync for the initial network and when peers cannot serve snap data. | Downloads and verifies the blockchain from genesis. Enable using [`--sync-mode=FULL`](../../public-networks/reference/options.md#sync-mode). |
| [Snap](../../public-networks/concepts/node-sync.md#snap-synchronization) | Optional for nodes joining or catching up to an existing private network.                                | Downloads as many leaves of the trie as possible and reconstructs the trie locally. Requires existing Bonsai nodes to serve snap sync data using [`--snapsync-server-enabled=true`](../../public-networks/reference/options.md#snapsync-server-enabled). Enable using [`--sync-mode=SNAP`](../../public-networks/reference/options.md#sync-mode). |

:::warning Checkpoint sync

Checkpoint sync is deprecated and will be removed in a future release. When you select checkpoint sync, Besu performs snap sync instead.

:::