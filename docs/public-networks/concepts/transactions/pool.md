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

You can use specific options and methods to [configure and monitor the transaction pool](#transaction-pool-methods-and-options).

## Layered transaction pool

The [layered transaction pool](https://github.com/hyperledger/besu/pull/5290) is the default
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

### Penalize transient invalid pending transactions

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

## Sequenced transaction pool

In the sequenced transaction pool, transactions are processed strictly in the order they are received.
Although sequenced transaction pools lack the flexibility of layered pools, they help maintain a 
consistent and transparent transaction order, which is often useful in private blockchains. 

You can select the sequenced transaction pool by setting [`--tx-pool=sequenced`](../../reference/cli/options.md#tx-pool).

If you set the enterprise configuration profile using [`--profile=enterprise`](../../how-to/configure-besu/profile.md#enterpriseprivate-profile) or [`--profile=private`](../../how-to/configure-besu/profile.md#enterpriseprivate-profile), the `sequenced` transaction pool is set by default.

The sequenced transaction pool suits enterprise environments because it functions like a first-in-first-out (FIFO) queue and processes transactions in the order of submission, regardless of the sender. 
When the pool reaches capacity, the newer transactions are evicted first, reducing the likelihood of a nonce gap and avoiding the need to resubmit older transactions.

## Drop transactions when the layered transaction pool is full

When the transaction pool is full, it accepts and retains local transactions in preference to remote transactions. 
If the transaction pool is full of local transactions, Besu drops the oldest local transactions first. 
That is, a full transaction pool continues to accept new local transactions by first dropping remote transactions and then by dropping the oldest local transactions.

## Replace transactions with the same sender and nonce

### In networks with a base fee and priced gas

You can replace a pending transaction with a transaction that has the same sender and nonce but a higher gas price.

If sending a [legacy transaction](types.md#frontier-transactions), the old transaction is replaced if the new transaction has a gas price higher than the existing gas price by the percentage specified by [`--tx-pool-price-bump`](../../reference/cli/options.md#tx-pool-price-bump).

If sending an [`EIP1559` transaction](types.md#eip1559-transactions), the old transaction is replaced if one of the following is true:

- The new transaction's effective gas price is higher than the existing gas price by the percentage specified by [`--tx-pool-price-bump`](../../reference/cli/options.md#tx-pool-price-bump) AND the new effective priority fee is greater than or equal to the existing priority fee.

- The new transaction's effective gas price is the equal to the existing gas price AND the new effective priority fee is higher than the existing priority fee by the percentage specified by [`--tx-pool-price-bump`](../../reference/cli/options.md#tx-pool-price-bump).

The default value for [`--tx-pool-price-bump`](../../reference/cli/options.md#tx-pool-price-bump) is 10%.

### In networks with zero base base or free gas

To enable replacing transactions in the transaction pool for zero base fee networks,
or free gas networks:

* If you set [`zeroBaseFee`](../../reference/genesis-items.md) to `true` in the genesis file,
  the transaction pool price bump is set to `0`. Specifying a value for transaction pool price bump using [`--tx-pool-price-bump`](../../reference/cli/options.md#tx-pool-price-bump)
  will cause an error.
* If the [minimum gas price is zero](../../../private-networks/how-to/configure/free-gas.md), the transaction pool price bump is set to `0`, unless you specify a different value using [`--tx-pool-price-bump`](../../reference/cli/options.md#tx-pool-price-bump).

## Transaction pool methods and options

You can configure and monitor the transaction pool using the following methods, subscriptions, and options:

|                | Name                                                                                             | Description                                                                         |
|----------------|--------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| Method         | [`txpool_besuTransactions`](../../reference/api/index.md#txpool_besutransactions)                | API method to list transactions in the transaction pool.                            |
| Method         | [`txpool_besuStatistics`](../../reference/api/index.md#txpool_besustatistics)                    | API method to list statistics of the transaction pool.                              |
| Method         | [`txpool_besuPendingTransactions`](../../reference/api/index.md#txpool_besupendingtransactions)  | API method to list pending transactions in the transaction pool.                    |
| Method         | [`txpool_contentFrom`](../../reference/api/index.md#txpool_contentfrom)                          | API method to list pending and queued transactions for a given sender address.      |
| Method         | [`txpool_content`](../../reference/api/index.md#txpool_content)                                  | API method to list all pending and queued transactions in the pool, grouped by sender address and nonce. |
| Subscription   | [`newPendingTransactions`](../../how-to/use-besu-api/rpc-pubsub.md#pending-transactions)         | RPC subscription to notify of transactions added to the transaction pool.           |
| Subscription   | [`droppedPendingTransactions`](../../how-to/use-besu-api/rpc-pubsub.md#dropped-transactions)     | RPC subscription to notify of transactions dropped from the transaction pool.       |
| Option         | [`--tx-pool`](../../reference/cli/options.md#tx-pool)                                            | Option to specify the type of transaction pool to use.                              |
| Option         | [`--tx-pool-enable-save-restore`](../../reference/cli/options.md#tx-pool-enable-save-restore)    | Option to enable save and restore functionality for the transaction pool.           |
| Option         | [`--tx-pool-layer-max-capacity`](../../reference/cli/options.md#tx-pool-layer-max-capacity)      | Option to specify the maximum memory capacity of the layered transaction pool.      |
| Option         | [`--tx-pool-limit-by-account-percentage`](../../reference/cli/options.md#tx-pool-limit-by-account-percentage) | Option to limit the transaction pool by account percentage.            |
| Option         | [`--tx-pool-max-future-by-sender`](../../reference/cli/options.md#tx-pool-max-future-by-sender)  | Option to specify the maximum number of future transactions by sender.              |
| Option         | [`--tx-pool-max-prioritized`](../../reference/cli/options.md#tx-pool-max-prioritized)            | Option to specify the maximum number of prioritized transactions.                   |
| Option         | [`--tx-pool-max-prioritized-by-type`](../../reference/cli/options.md#tx-pool-max-prioritized-by-type) | Option to specify the maximum number of prioritized transactions by type.      |
| Option         | [`--tx-pool-max-size`](../../reference/cli/options.md#tx-pool-max-size)                          | Option to specify the maximum size of the transaction pool.                         |
| Option         | [`--tx-pool-min-gas-price`](../../reference/cli/options.md#tx-pool-min-gas-price)                | Option to specify the minimum gas price for transactions in the pool.               |
| Option         | [`--tx-pool-min-score`](../../reference/cli/options.md#tx-pool-min-score)                | Option to remove a pending transaction from the layered transaction pool when its score is below a specified value.               |
| Option         | [`--tx-pool-no-local-priority`](../../reference/cli/options.md#tx-pool-no-local-priority)        | Option to disable local priority for transactions.                                  |
| Option         | [`--tx-pool-price-bump`](../../reference/cli/options.md#tx-pool-price-bump)                      | Option to specify the price bump percentage to replace an existing transaction.     |
| Option         | [`--tx-pool-priority-senders`](../../reference/cli/options.md#tx-pool-priority-senders)          | Option to specify sender addresses to prioritize in the transaction pool.           |
| Option         | [`--tx-pool-retention-hours`](../../reference/cli/options.md#tx-pool-retention-hours)            | Option to specify the number of hours to retain transactions in the pool.           |
| Option         | [`--tx-pool-save-file`](../../reference/cli/options.md#tx-pool-save-file)                        | Option to specify the file for saving the transaction pool state.                   |

:::note
The option [`--tx-pool-layer-max-capacity`](../../reference/cli/options.md#tx-pool-layer-max-capacity) is applicable only for [layered transaction pools](#layered-transaction-pool).
:::
