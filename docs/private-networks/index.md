---
title: Private networks
sidebar_position: 1
sidebar_label: Introduction
id: index
description: Private networks overview
---

# Besu for private (permissioned) networks

You can use Besu to develop enterprise applications requiring secure, high-performance transaction processing in a private network.

A private (also known as permissioned) network is a network not connected to Ethereum Mainnet or an Ethereum testnet. Private networks typically use a different [chain ID](../public-networks/concepts/network-and-chain-id.md) and proof of authority (PoA) consensus ([QBFT](how-to/configure/consensus/qbft.md) or [IBFT 2.0](how-to/configure/consensus/ibft.md)).

You can also [create a local development network using proof of work (PoW) (Deprecated)](tutorials/ethash.md).

Besu supports [permissioning](concepts/permissioning/index.md), and has a modular [plugin](../public-networks/concepts/plugins.md) framework.

Get started with the [Developer Quickstart](tutorials/quickstart.md) to rapidly generate local blockchain networks.

If you have any questions about Besu for private (permissioned) networks, ask on the **besu-enterprise** channel on
[Discord](https://discord.com/channels/905194001349627914/1172617318845657199).

## Architecture

The following diagram outlines the high-level architecture of Besu for private networks.

<p align="center">

![Private architecture](../assets/images/private-architecture.svg)

</p>
