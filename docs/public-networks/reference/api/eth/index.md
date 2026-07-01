---
title: ETH methods
description: Besu ETH JSON-RPC API methods reference
sidebar_label: ETH
toc_max_heading_level: 2
---

import Link from '@docusaurus/Link';

# `ETH` methods

The `ETH` API methods allow you to interact with the blockchain.

:::note

Methods with an equivalent [GraphQL](../../../how-to/use-besu-api/graphql.md) query include a GraphQL request and result in the method example.
The parameter and result descriptions apply to the JSON-RPC requests.
The GraphQL specification is defined in the [schema].

:::

The `ETH` methods are grouped into the following pages.

<div className="row">
<div className="col col--6 margin-bottom--lg">
<Link className="card padding--md api-card" to="/public-networks/reference/api/eth/client">

#### Client and network

Query client and network information.

- `eth_accounts`
- `eth_blockNumber`
- `eth_capabilities`
- `eth_chainId`
- `eth_config`
- `eth_protocolVersion`
- `eth_syncing`

</Link>
</div>
<div className="col col--6 margin-bottom--lg">
<Link className="card padding--md api-card" to="/public-networks/reference/api/eth/block">

#### Block

Query blocks and their contents.

- `eth_getBlockByHash`
- `eth_getBlockByNumber`
- `eth_getBlockReceipts`
- `eth_getBlockTransactionCountByHash`
- `eth_getBlockTransactionCountByNumber`
- `eth_getUncleByBlockHashAndIndex`
- `eth_getUncleByBlockNumberAndIndex`
- `eth_getUncleCountByBlockHash`
- `eth_getUncleCountByBlockNumber`

</Link>
</div>
<div className="col col--6 margin-bottom--lg">
<Link className="card padding--md api-card" to="/public-networks/reference/api/eth/transaction">

#### Transaction

Retrieve transactions and transaction receipts.

- `eth_getTransactionByBlockHashAndIndex`
- `eth_getTransactionByBlockNumberAndIndex`
- `eth_getTransactionByHash`
- `eth_getTransactionBySenderAndNonce`
- `eth_getTransactionReceipt`

</Link>
</div>
<div className="col col--6 margin-bottom--lg">
<Link className="card padding--md api-card" to="/public-networks/reference/api/eth/state">

#### State and account

Read account state at a given block.

- `eth_getBalance`
- `eth_getCode`
- `eth_getProof`
- `eth_getStorageAt`
- `eth_getStorageValues`
- `eth_getTransactionCount`

</Link>
</div>
<div className="col col--6 margin-bottom--lg">
<Link className="card padding--md api-card" to="/public-networks/reference/api/eth/execute">

#### Execution

Execute calls and perform actions without changing blockchain state.

- `eth_call`
- `eth_createAccessList`
- `eth_estimateGas`
- `eth_simulateV1`

</Link>
</div>
<div className="col col--6 margin-bottom--lg">
<Link className="card padding--md api-card" to="/public-networks/reference/api/eth/fee">

#### Fee market

Query gas price and fee market information.

- `eth_baseFee`
- `eth_blobBaseFee`
- `eth_feeHistory`
- `eth_gasPrice`
- `eth_maxPriorityFeePerGas`

</Link>
</div>
<div className="col col--6 margin-bottom--lg">
<Link className="card padding--md api-card" to="/public-networks/reference/api/eth/filter">

#### Filter and log

Manage filters and query event logs.

- `eth_getFilterChanges`
- `eth_getFilterLogs`
- `eth_getLogs`
- `eth_newBlockFilter`
- `eth_newFilter`
- `eth_newPendingTransactionFilter`
- `eth_uninstallFilter`

</Link>
</div>
<div className="col col--6 margin-bottom--lg">
<Link className="card padding--md api-card" to="/public-networks/reference/api/eth/submit">

#### Submit

Submit signed transactions to the network.

- `eth_sendRawTransaction`

</Link>
</div>
</div>

<!-- Links -->

[schema]: https://github.com/besu-eth/besu/blob/750580dcca349d22d024cc14a8171b2fa74b505a/ethereum/api/src/main/resources/schema.graphqls
