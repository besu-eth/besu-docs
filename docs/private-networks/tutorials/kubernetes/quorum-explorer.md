---
title: Use the Quorum Explorer
sidebar_position: 4
description: Using the Quorum Explorer on a Kubernetes cluster
---

# Use the Quorum Explorer

You can use the Quorum Explorer on a Kubernetes cluster.

## Prerequisites

- Clone the [Quorum-Kubernetes](https://github.com/ConsenSys/quorum-kubernetes) repository
- A [running Kubernetes cluster](cluster.md)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm3](https://helm.sh/docs/intro/install/)
- [Existing network](charts.md)

## Deploy the Quorum Explorer helm chart

[Quorum-Explorer](https://github.com/ConsenSys/quorum-explorer) as a lightweight blockchain explorer. The Quorum Explorer is **not** recommended for use in production and is intended for demonstration or development purposes only.

The explorer can provide an overview over the whole network, such as block information, voting or removing validators from the network, and sending transactions between wallets in one interface.

To use the explorer, update the [Quorum-Explorer values file](https://github.com/ConsenSys/quorum-kubernetes/blob/5920caff6dd15b4ca17f760ad9e4d7d2e43b41a1/helm/values/explorer-besu.yaml) with your node details and endpoints, and then [deploy](charts.md).

## Nodes

The **Nodes** page provides an overview of the nodes on the network. Select the node you would like to interact with from the drop-down on the top right, and you'll get details of the node, block height, peers, queued transactions etc.

![`k8s-explorer`](../../../assets/images/kubernetes-explorer.png)

## Validators

The **Validators** page simulates a production environment or consortium where each node individually runs API calls to vote to add a validator or remove an existing validator.

When using the buttons to remove, discard pending validators, or proposing a validator, the app sends an API request to the selected node in the drop-down only. To add or remove a validator you need to select a majority of the existing validator pool individually, and perform the vote API call by clicking the button. Each node can call a discard on the voting process during or after the validator has been added.

The vote calls made from non-validator nodes have no effect on overall consensus.

![`k8s-explorer-validators`](../../../assets/images/kubernetes-explorer-validators.png)

## Explorer

The **Explorer** page gives you the latest blocks from the chain and the latest transactions as they occur on the network. In addition, you can search by block number or transaction hash using the respective search bar.

![`k8s-explorer-explorer`](../../../assets/images/kubernetes-explorer-explorer.png)

## Contracts

Use the **Contracts** page to compile and deploy a smart contract. Currently, the only contract available for deployment through the app is the `SimpleStorage` contract. However, in time, we plan to add more contracts to that view.

In this example, we deploy from `member-1` and select `member-1` and `member-3` in the **Private For** multi-select. Then click on `Compile` and `Deploy`

![`k8s-explorer-contracts-1`](../../../assets/images/kubernetes-explorer-contracts-1.png)

Once deployed, you can interact with the contract. As this is a new transaction, select `member-1` and `member-3` in **Interact** multi-select, and then click on the appropriate method call to `get` or `set` the value at the deployed contract address.

![`k8s-explorer-contracts-set`](../../../assets/images/kubernetes-explorer-contracts-set.png)

To test the private transaction functionality, select `member-2` from the drop-down on the top right, you'll notice that you are unable to interact with the contract because `member-2` was not part of the transaction. Only `members-1` and `member-3` responds correctly.

## Wallet

The **Wallet** page gives you the functionality to send simple ETH transactions between accounts by providing the account's private key, the recipient's address, and transfer amount in Wei.

![`k8s-explorer-wallet`](../../../assets/images/kubernetes-explorer-wallet.png)
