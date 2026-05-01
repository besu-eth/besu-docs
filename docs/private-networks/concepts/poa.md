---
title: Proof of authority consensus
sidebar_position: 1
description: Besu proof of authority consensus protocols comparison
---

# Proof of authority consensus

Besu implements the QBFT and IBFT 2.0 proof of authority (PoA) [consensus protocols](../how-to/configure/consensus/index.md). PoA consensus protocols work when participants know each other and there is a level of trust between them. For example, in a permissioned consortium network.

:::warning Important
Besu no longer supports the Clique consensus protocol.
:::

PoA consensus protocols have faster block times and a much greater transaction throughput than the Ethash proof of work consensus protocol used on the Ethereum Mainnet.

In QBFT or IBFT 2.0, a group of nodes in the network act as validators. The existing nodes in the validator pool vote to add nodes to or remove nodes from the pool.

Consider the following properties when using QBFT or IBFT 2.0:

## Immediate finality

QBFT and IBFT 2.0 have immediate finality; there are no forks and all valid blocks get included in the main chain.

## Minimum number of validators

To be Byzantine fault tolerant, QBFT and IBFT 2.0 require a minimum of four validators.

:::tip

Byzantine fault tolerant is the ability to function correctly and reach consensus despite nodes failing or propagating incorrect information to peers.

:::

## Liveness

QBFT and IBFT 2.0 networks require greater than or equal to two-thirds of validators to be operating to create blocks. For example, an QBFT and IBFT 2.0 network of:

- Four to five validators tolerates one unresponsive validator.
- Six to eight validators tolerates two unresponsive validators.

Networks with three or less validators can produce blocks but do not guarantee finality when operating in adversarial environments.

:::caution

We recommend using QBFT or IBFT 2.0 networks with at least four nodes in production environments.

:::

## Speed

For QBFT and IBFT 2.0, the time to add new blocks increases as the number of validators increases.
