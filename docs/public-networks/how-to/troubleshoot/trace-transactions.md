---
title: Trace transactions
sidebar_position: 2
description: How to trace transactions
---

# Trace transactions

To get detailed information about transaction processing, use the [`TRACE` API](../../reference/api/index.md#trace-methods). Enable the `TRACE` API using the [`--rpc-http-api`](../../reference/cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../../reference/cli/options.md#rpc-ws-api) command line options.

The `TRACE` API has two sets of trace calls, [ad-hoc tracing APIs](#ad-hoc-tracing-apis) and [transaction-trace filtering APIs](#transaction-trace-filtering-apis).

## Ad-hoc tracing APIs

These APIs allow you to use the [`trace`, `vmTrace`, or `stateDiff`](../../reference/trace-types.md) diagnostic options when tracing calls or transactions.

When using [Bonsai Tries](../../concepts/data-storage-formats.md#bonsai-tries) with the ad-hoc
tracing APIs, the requested block or transaction must be within the number of
[blocks retained](../../reference/cli/options.md#bonsai-historical-block-limit) (by default, 512 
from the head of the chain).

The ad-hoc tracing APIs are:

- [`trace_call`](../../reference/api/index.md#trace_call)
- [`trace_callMany`](../../reference/api/index.md#trace_callmany)
- [`trace_rawTransaction`](../../reference/api/index.md#trace_rawtransaction)
- [`trace_replayBlockTransactions`](../../reference/api/index.md#trace_replayblocktransactions)

## Transaction-trace filtering APIs

These APIs allow you to filter and search by specific information such as the block, address, or transaction. These APIs only use the [`trace` type](../../reference/trace-types.md#trace).

To use the transaction-trace filtering APIs, your node must be an
[archive node](../../concepts/node-sync.md#archive-nodes), or the requested block
or transaction must be within the number of
[blocks retained](../../reference/cli/options.md#bonsai-historical-block-limit) when using
[Bonsai Tries](../../concepts/data-storage-formats.md#bonsai-tries) (by default, 512 from the head
of the chain).

The transaction-trace filtering APIs are:

- [`trace_block`](../../reference/api/index.md#trace_block)
- [`trace_filter`](../../reference/api/index.md#trace_filter)
- [`trace_get`](../../reference/api/index.md#trace_get)
- [`trace_transaction`](../../reference/api/index.md#trace_transaction)

## Dumping traces to file

For large blocks or when you prefer file output over a JSON response, use the debug API methods:

- [`debug_standardTraceBlockToFile`](../../reference/api/index.md#debug_standardtraceblocktofile)
- [`debug_standardTraceBadBlockToFile`](../../reference/api/index.md#debug_standardtracebadblocktofile)

Enable or disable trace fields (txHash, stack, memory, storage, and opcodes) via the optional options parameter on both methods. For example, set `disableStack`, `disableMemory`, and/or `disableStorage` to reduce output size or focus on specific data.

:::note

Trace files are written under the node data directory in the `traces` subdirectory; the data directory is set by the [`--data-path`](../../reference/cli/options.md#data-path) option.

:::
