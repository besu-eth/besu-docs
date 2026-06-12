---
title: Transaction pool
sidebar_position: 2
description: Transaction pool overview
---

# Transaction pool

All nodes maintain a transaction pool to store pending transactions before processing.

Transaction pools are categorized into the following two types: 

* [Layered](#layered-transaction-pool) - Recommended for public blockchain networks.
* [Sequenced](#sequenced-transaction-pool) - Recommended for private blockchain networks.

You can use specific [options](../../reference/cli/options.md#tx-pool) and
[methods](../../reference/api/index.md#txpool-methods) to configure and monitor the transaction pool.

## Layered transaction pool

The [layered transaction pool](https://github.com/besu-eth/besu/pull/5290) is the default
transaction pool implementation.
The implementation separates the pool into layers according to value and executability of the transactions.
The first layer keeps only the highest-value transactions that can feasibly go into the next block. 
The other two layers ensure Besu always has a backlog of transactions to fill blocks, maximizing the amount of fees.

Layered pools have additional parameters that allow you to limit and configure the number of transactions
in different layers, enabling them to handle high volumes and sort transactions at a faster speed.

With the layered transaction pool, Besu produces more profitable blocks more quickly, with more
denial-of-service protection, and using less CPU than with the legacy transaction pool.

If you previously configured transaction pool behavior, upgrade to the layered transaction pool by:

- Removing the [`--tx-pool-retention-hours`](../../reference/cli/options.md#tx-pool-retention-hours)
  option, which is not applicable because old transactions will expire when the memory cache is full.
- Replacing the [`--tx-pool-limit-by-account-percentage`](../../reference/cli/options.md#tx-pool-limit-by-account-percentage)
  option with [`--tx-pool-max-future-by-sender`](../../reference/cli/options.md#tx-pool-max-future-by-sender)
  to limit the number of sequential transactions, instead of percentage of transactions, from a single
  sender kept in the pool.
- Removing the [`--tx-pool-max-size`](../../reference/cli/options.md#tx-pool-max-size) option,
  which is not applicable because the layered pool is limited by memory size instead of the number
  of transactions.
  To configure the maximum memory capacity, use [`--tx-pool-layer-max-capacity`](../../reference/cli/options.md#tx-pool-layer-max-capacity).

You can opt out of the layered transaction pool implementation by setting the
[`--tx-pool`](../../reference/cli/options.md#tx-pool) option to `sequenced`.

### Transient invalid pending transactions

Transient invalid pending transactions cannot be included in the current block but might be included in a future one. 
This can happen due to issues like insufficient balance in the sender's wallet or a gas price below the minimum. 
These conditions could resolve in the future.

:::note
Invalid pending transactions where conditions can't be resolved in the future (for example, invalid nonce)
are immediately dropped from the transaction pool.
:::

The layered transaction pool uses a scoring system to avoid repeatedly evaluating transient invalid pending
transactions, which can block the evaluation of valid ones. Each pending transaction starts with a score of
`127` and is penalized over time, with the score decreasing to a minimum of -128. 
This score determines the transaction's rank in the pool, pushing invalid transactions lower so they are 
evaluated only after non-penalized or less penalized ones.

The [`--tx-pool-min-score`](../../reference/cli/options.md#tx-pool-min-score) option, which accepts a value
between `-128` and `127`, instructs the transaction pool to remove pending transactions when their score falls
below the specified value. By default, the value is `-128`, meaning the pending transaction will remain in the
pool with the lowest score and will only be selected after all other pending transactions have been processed.

### Dropping transactions

When the layered transaction pool is full, it accepts and retains local transactions in preference to remote transactions,
unless [`--tx-pool-no-local-priority`](../../reference/cli/options.md#tx-pool-no-local-priority) is enabled.

If the transaction pool is full of local transactions, Besu drops the oldest local transactions first. 
That is, a full transaction pool continues to accept new local transactions by first dropping remote transactions and
then by dropping the oldest local transactions.

## Sequenced transaction pool

In the sequenced transaction pool, transactions are processed strictly in the order they are received.
Although sequenced transaction pools lack the flexibility of layered pools, they help maintain a 
consistent and transparent transaction order, which is often useful in private blockchains. 

You can select the sequenced transaction pool by setting [`--tx-pool=sequenced`](../../reference/cli/options.md#tx-pool).

If you set the enterprise configuration profile using [`--profile=enterprise`](../../how-to/configure-besu/profile.md#enterpriseprivate-profile) or [`--profile=private`](../../how-to/configure-besu/profile.md#enterpriseprivate-profile), the `sequenced` transaction pool is set by default.

The sequenced transaction pool suits enterprise environments because it functions like a first-in-first-out (FIFO) queue and processes transactions in the order of submission, regardless of the sender. 
When the pool reaches capacity, the newer transactions are evicted first, reducing the likelihood of a nonce gap and avoiding the need to resubmit older transactions.

## Replacing pending transactions

You can replace a pending transaction with a transaction that has the same sender and nonce but a higher gas price.

### Legacy transactions

If sending a [legacy](types.md#frontier-transactions) or [`ACCESS_LIST`](types.md#access_list-transactions) transaction,
the old transaction is replaced if the new transaction has a gas price higher than the existing gas price by the percentage
specified by [`--tx-pool-price-bump`](../../reference/cli/options.md#tx-pool-price-bump).

### `EIP1559` transactions

If sending an [`EIP1559` transaction](types.md#eip1559-transactions), the old transaction is replaced if one of the following is true:

- The new transaction's effective gas price is higher than the existing gas price by the percentage specified by
  [`--tx-pool-price-bump`](../../reference/cli/options.md#tx-pool-price-bump) AND the new effective priority fee is greater than
  or equal to the existing priority fee.

- The new transaction's effective gas price is equal to the existing gas price AND the new effective priority fee is higher than
  the existing priority fee by the percentage specified by [`--tx-pool-price-bump`](../../reference/cli/options.md#tx-pool-price-bump).

### `BLOB` transactions

If sending a [`BLOB` transaction](types.md#blob-transactions), the old transaction is replaced if BOTH of the following are true:

- The new transaction's gas price is higher than the existing gas price by the percentage specified by
  [`--tx-pool-price-bump`](../../reference/cli/options.md#tx-pool-price-bump).

- The new transaction's maximum fee per blob gas is higher than the existing maximum fee per blob gas by the percentage specified by 
  [`--tx-pool-blob-price-bump`](../../reference/cli/options.md#tx-pool-blob-price-bump).

### Free gas networks

In [free gas networks](../../../private-networks/how-to/configure/free-gas.md), the transaction pool price bump is `0` by default,
so replacement transactions can use the same gas price as the pending transaction.

If [`zeroBaseFee`](../../reference/genesis-items.md) is not set, you can set
[`--tx-pool-price-bump`](../../reference/cli/options.md#tx-pool-price-bump) to require a higher gas price when replacing transactions
that use a nonzero gas price.
