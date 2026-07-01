---
title: DEBUG methods
description: Besu DEBUG JSON-RPC API methods reference
sidebar_label: DEBUG
toc_max_heading_level: 2
---

import Link from '@docusaurus/Link';

# `DEBUG` methods

The `DEBUG` API methods allow you to inspect and debug the network.
The `DEBUG` API is a more verbose alternative to the [`TRACE` API](../trace.md), and its main purpose is compatibility with tools such as [Remix](https://remix.ethereum.org/).
Where these APIs overlap, we recommend using the [`TRACE` API](../trace.md) for production use over the `DEBUG` API.
Specifically, we recommend `trace_block` over `debug_traceBlock`, and `trace_transaction` over `debug_traceTransaction`.

:::note

The `DEBUG` API is not enabled by default for JSON-RPC.
Enable it using the [`--rpc-http-api`](../../cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../../cli/options.md#rpc-ws-api) option.

:::

The `DEBUG` methods are grouped into the following pages.

<div className="row">
<div className="col col--6 margin-bottom--lg">
<Link className="card padding--md api-card" to="/public-networks/reference/api/debug/trace">

#### Trace

Trace transactions, blocks, and calls.

- `debug_standardTraceBlockToFile`
- `debug_standardTraceBadBlockToFile`
- `debug_traceTransaction`
- `debug_traceBlock`
- `debug_traceBlockByHash`
- `debug_traceBlockByNumber`
- `debug_traceCall`

</Link>
</div>
<div className="col col--6 margin-bottom--lg">
<Link className="card padding--md api-card" to="/public-networks/reference/api/debug/getters">

#### Getters

Retrieve block and transaction information.

- `debug_getBadBlocks`
- `debug_getRawBlock`
- `debug_getRawHeader`
- `debug_getRawReceipts`
- `debug_getRawTransaction`

</Link>
</div>
<div className="col col--6 margin-bottom--lg">
<Link className="card padding--md api-card" to="/public-networks/reference/api/debug/state-node">

#### State and node

Inspect account and world state, and manage node operations.

- `debug_accountAt`
- `debug_accountRange`
- `debug_batchSendRawTransaction`
- `debug_metrics`
- `debug_replayBlock`
- `debug_resyncWorldState`
- `debug_setHead`
- `debug_storageRangeAt`

</Link>
</div>
</div>
