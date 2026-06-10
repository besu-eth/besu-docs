---
title: Use Chainlens Explorer
sidebar_position: 7
description: Use Chainlens Explorer on a Besu network
---

# Use Chainlens Blockchain Explorer

[Chainlens Blockchain Explorer](https://chainlens.com/) supports public and private EVM networks.
You can include Chainlens when generating a private network using the [Developer Quickstart](../../tutorials/quickstart.md).

Chainlens provides an overview of the entire network, including block information, contract
metadata, transaction searches, and [more](https://chainlens.com/).

:::note
In production networks, you must [secure access](../../../public-networks/how-to/use-besu-api/authenticate.md)
to RPC nodes.
:::

## Prerequisites

[Docker and Docker Compose](https://docs.docker.com/compose/install/) installed.

## Start Chainlens

Generate a private network using the [Developer Quickstart](../../tutorials/quickstart.md), with Chainlens enabled:

```bash
npx @consensys-software/besu-dev-quickstart --networkType private --outputPath ./besu-test-network --otel false --chainlens true
```

Start the generated network:

```bash
cd besu-test-network
./run.sh
```

Open `http://localhost:8081/dashboard` in your browser.
Chainlens may take a few minutes to index the latest blocks after the containers start.

If you already generated a private network without Chainlens, generate a new quickstart directory with `--chainlens true`.
The Developer Quickstart adds the Chainlens services to the Docker Compose file at generation time.

## View on Chainlens

After starting Chainlens, you can view information about your network.

:::note
Screenshots in this section are taken from the Chainlens Holesky network.
:::

The **Dashboard** page provides an aggregated view of network activities.

![Chainlens dashboard](../../../assets/images/chainlens-dashboard.png)

The **Blocks** page shows a real-time view of the finalized blocks.

![Chainlens blocks](../../../assets/images/chainlens-block.png)

You can view block details by selecting a block hash or number.

![Chainlens block details](../../../assets/images/chainlens-block-details.png)

The **Transactions** page shows a paginated view of new and historical transactions.

![Chainlens transactions](../../../assets/images/chainlens-transactions.png)

If you select any transaction hash, you can get the **transaction details.**

![Chainlens transaction_details](../../../assets/images/chainlens-transaction-details.png)

The **Contracts** page shows all the smart contracts deployed on the network.

![Chainlens contracts](../../../assets/images/chainlens-contracts.png)

You can view smart contract details by selecting the contract address.

![Chainlens contract details](../../../assets/images/chainlens-contract-details.png)

The **Events** page shows all the events generated on the network.

![Chainlens events](../../../assets/images/chainlens-events.png)

## Stop Chainlens

Chainlens runs as part of the generated quickstart network.
Stop the quickstart containers to stop Chainlens:

```bash
./stop.sh
```
