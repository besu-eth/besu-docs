---
title: Transaction types
sidebar_position: 1
description: Description of the different transaction types
---

# Transaction types

You can interact with the Besu JSON-RPC API using different transaction types (specified by the `transactionType` parameter).

The following API objects use a unique format for each `transactionType`:

- [Pending transaction object](../../reference/api/objects.md#pending-transaction-object)
- [Transaction object](../../reference/api/objects.md#transaction-object)
- [Transaction call object](../../reference/api/objects.md#transaction-call-object)
- [Transaction receipt object](../../reference/api/objects.md#transaction-receipt-object)

## `FRONTIER` transactions

Transactions with type `FRONTIER` are _legacy transactions_ that use the transaction format existing before typed transactions were introduced in [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718). They contain the parameters `chainId`, `nonce`, `gasPrice`, `gasLimit`, `to`, `value`, `data`, `v`, `r`, and `s`. Legacy transactions don't use [access lists](#access_list-transactions) or incorporate [EIP-1559 fee market changes](#eip1559-transactions).

## `ACCESS_LIST` transactions

Transactions with type `ACCESS_LIST` are transactions introduced in [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930). They contain, along with the [legacy parameters](#frontier-transactions), an `accessList` parameter, which specifies an array of addresses and storage keys that the transaction plans to access (an _access list_). `ACCESS_LIST` transactions must specify an access list, and they don't incorporate [EIP-1559 fee market changes](#eip1559-transactions).

Use the [`eth_createAccessList`](../../reference/api/index.md#eth_createaccesslist) API to simulate a transaction which returns the addresses and storage keys that may be used to send the real transaction, and the approximate gas cost.

## `EIP1559` transactions

Transactions with type `EIP1559` are transactions introduced in [EIP-1559](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md). EIP-1559 addresses the network congestion and overpricing of transaction fees caused by the historical fee market, in which users send transactions specifying a gas price bid using the `gasPrice` parameter, and miners choose transactions with the highest bids.

`EIP1559` transactions don't specify `gasPrice`, and instead use an in-protocol, dynamically changing _base fee_ per gas. At each block, the base fee per gas is adjusted to address network congestion as measured by a gas target.

`EIP1559` transactions contain, along with the [`accessList`](#access_list-transactions) parameter and [legacy parameters](#frontier-transactions) except for `gasPrice`, a `maxPriorityFeePerGas` parameter, which specifies the maximum fee the sender is willing to pay per gas above the base fee (the maximum _priority fee_ per gas), and a `maxFeePerGas` parameter, which specifies the maximum total fee (base fee + priority fee) the sender is willing to pay per gas.

An `EIP1559` transaction always pays the base fee of the block it's included in, and it pays a priority fee as priced by `maxPriorityFeePerGas` or, if the base fee per gas + `maxPriorityFeePerGas` exceeds `maxFeePerGas`, it pays a priority fee as priced by `maxFeePerGas` minus the base fee per gas. The base fee is burned, and the priority fee is paid to the miner that included the transaction. A transaction's priority fee per gas incentivizes miners to include the transaction over other transactions with lower priority fees per gas.

`EIP1559` transactions must specify both `maxPriorityFeePerGas` and `maxFeePerGas`. They must not specify `gasPrice`.

## `BLOB` transactions

Shard blob transactions introduced in [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) enable scaling the
Ethereum network by allowing large amounts of data (blobs) to be included that cannot be directly accessed or
processed by the Ethereum Virtual Machine (EVM).

When the network includes a blob-carrying transaction in a block, the transaction doesn't actually contain
the blob data itself. Instead, it contains a commitment to this data. The EVM can verify this commitment to
ensure the data's availability and integrity without directly accessing the data.

:::info

A commitment is a type of cryptographic proof that securely and verifiably confirms the existence and integrity
of large data blobs.

:::

This mechanism significantly reduces the computational and storage burden on the Ethereum network while ensuring
that the data is available for those who need it (for example, rollups or other layer 2 solutions that rely on data 
availability for their security and operation).

Blobs are temporarily stored by consensus clients such as Teku, and blocks on the execution layer permanently store
the reference to the blob.

:::tip
Configure the maximum number of blobs per block and transaction using the
[`--max-blobs-per-block`](../../reference/cli/options.md#max-blobs-per-block) and
[`--max-blobs-per-transaction`](../../reference/cli/options.md#max-blobs-per-transaction) CLI options.
:::

### View blob transaction costs

Use the [`eth_blobBaseFee`](../../reference/api/index.md#eth_blobbasefee) method to view the current base
fee per blob gas in wei.

You can also use [`eth_feeHistory`](../../reference/api/index.md#eth_feehistory) to view the historical
blob transaction cost details.
