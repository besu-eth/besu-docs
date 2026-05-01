---
title: Genesis file items
sidebar_position: 4
description: Genesis file configuration items reference
---

# Genesis file items

The [Besu genesis file](../concepts/genesis-file.md) contains [network configuration items](#configuration-items) and [genesis block parameters](#genesis-block-parameters).

## Configuration items

Network configuration items are specified in the genesis file in the `config` object.

| Item                | Description                                                                                                                                                                                                       |
|---------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Milestone blocks    | [Milestone blocks for the network](#milestone-blocks).                                                                                                                                                            |
| `chainID`           | [Chain ID for the network](../concepts/network-and-chain-id.md).                                                                                                                                                  |
| `ethash`            | Specifies network uses [Ethash](../../private-networks/how-to/configure/consensus/index.md) and contains [`fixeddifficulty`](#fixed-difficulty).                                                                  |
| `ibft2`             | Specifies network uses [IBFT 2.0](../../private-networks/how-to/configure/consensus/ibft.md) and contains [IBFT 2.0 configuration items](../../private-networks/how-to/configure/consensus/ibft.md#genesis-file). |
| `qbft`              | Specifies network uses [QBFT](../../private-networks/how-to/configure/consensus/qbft.md) and contains [QBFT configuration items](../../private-networks/how-to/configure/consensus/qbft.md#genesis-file).         |
| `transitions`       | Specifies block at which to [change IBFT 2.0 or QBFT validators](../../private-networks/how-to/configure/consensus/add-validators-without-voting.md).                                                             |
| `contractSizeLimit` | Maximum contract size in bytes. Specify in [free gas networks](../../private-networks/how-to/configure/free-gas.md). The default is `24576` and the maximum size is `2147483647`.                                 |
| `evmStackSize`      | Maximum stack size. Specify to increase the maximum stack size in private networks with complex smart contracts. The default is `1024`.                                                                           |
| `ecCurve`           | Specifies [the elliptic curve to use](../../private-networks/how-to/configure/curves.md). Default is `secp256k1`.                                                                                                 |
| `discovery`         | Specifies [discovery configuration items](#discovery-configuration-items). The `discovery` object can be left empty.                                                                                              |
| `zeroBaseFee`       | Specifies a base fee of `0` for [free gas networks](../../private-networks/how-to/configure/free-gas.md#4-enable-zero-base-fee-if-using-london-fork-or-later).                                                      |
| `fixedBaseFee`      | Specifies a constant base fee for blocks, overriding the dynamic base fee calculation of [EIP-1559](../concepts/transactions/types.md#eip1559-transactions).  |

## Genesis block parameters

The purpose of some genesis block parameters varies depending on the consensus protocol (Ethash, [IBFT 2.0](../../private-networks/how-to/configure/consensus/ibft.md), or [QBFT](../../private-networks/how-to/configure/consensus/qbft.md)). These parameters include:

- `difficulty`.
- `extraData`.
- `mixHash`.

The following table describes the genesis block parameters with the same purpose across all consensus protocols.

| Item | Description                                                                                                                                                      |
| --- |:-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `gasLimit` | Block gas limit. Total gas limit for all transactions in a block.                                                                                                |
| `nonce` | Used in block computation. Can be any value in the genesis block (commonly set to `0x0`).                                                                        |
| `timestamp` | Creation date and time of the block. Must be before the next block so we recommend specifying `0x0` in the genesis file.                                         |
| `alloc` | Defines [accounts with balances](../../private-networks/reference/accounts-for-testing.md) or [contracts](../../private-networks/how-to/configure/contracts.md). |

:::caution

If a `Supplied genesis block does not match stored chain data` error occurs, use the genesis file matching the genesis block of the data directory, or use the [`--data-path`](../reference/cli/options.md#data-path) option to specify a different data directory.

:::

## Milestone blocks

In public networks, the milestone blocks specify the blocks at which the network changed protocol. See a [full list of Ethereum protocol releases](https://github.com/ethereum/execution-specs#ethereum-protocol-releases) and their corresponding milestone blocks.

```json title="Ethereum Mainnet milestone blocks"
{
  "config": {
    ...
    "homesteadBlock": 1150000,
    "daoForkBlock": 1920000,
    "daoForkSupport": true,
    "eip150Block": 2463000,
    "eip150Hash": "0x2086799aeebeae135c246c65021c82b4e15a2c451340993aacfd2751886514f0",
    "eip155Block": 2675000,
    "eip158Block": 2675000,
    "byzantiumBlock": 4370000,
    "constantinopleBlock": 7280000,
    "constantinopleFixBlock": 7280000,
    "muirGlacierBlock": 9200000,
    "berlinBlock": 12244000,
    "londonBlock": 12965000,
    "arrowGlacierBlock": 13773000,
    "grayGlacierBlock": 15050000,
    ...
  },
}
```

:::caution

Ensure you include a milestone far enough in advance in the genesis file. Not doing so can lead to unexpected and inconsistent behavior without specific errors.

:::

In private networks, the milestone block defines the protocol version for the network.

```json title="Private network milestone block"
{
  "config": {
    ...
    "berlinBlock": 0,
    ...
  },
}
```

:::note

In private networks, we recommend specifying the latest milestone block. It's implied this includes the preceding milestones. This ensures you use the most up-to-date protocol and have access to the most recent opcodes.

:::

## Fixed difficulty

Use `fixeddifficulty` to specify a fixed difficulty in private networks using Ethash. This will keep the network's difficulty constant and override the `difficulty` parameter from the genesis file.

```json
{
  "config": {
      ...
      "ethash": {
        "fixeddifficulty": 1000
      },

  },
  ...
}
```

:::tip

Using `fixeddifficulty` is not recommended for use with Ethash outside of test environments. For production networks using Ethash, we recommend setting a low `difficulty` value in the genesis file instead. Ethash will adjust the difficulty of the network based on hashrate to produce blocks at the targeted frequency.

:::

## Discovery configuration items

Use the `discovery` configuration items to specify the [`bootnodes`](cli/options.md#bootnodes) and [`discovery-dns-url`](cli/options.md#discovery-dns-url) in the genesis file, in place of using CLI options or listing them in the configuration file.
The genesis file can take discovery v4 bootnodes (specified as [enode URLs](../concepts/node-keys.md#enode-url) using the `bootnodes` option) and discovery v5 bootnodes (specified as [ENR URLs](../concepts/node-keys.md#enr-url) using the `v5Bootnodes` option).

:::tip Early access feature
To use discovery v5 bootnodes, set the early access option `--Xv5-discovery-enabled` to `true`.
:::

If any option is specified using the command line or [configuration file](../how-to/configure-besu/index.md), it takes precedence over the genesis file.

```json
{
  "config": {
    "discovery": {
      "bootnodes": [
        "enode://c35c3...d615f@1.2.3.4:30303",
        "enode://f42c13...fc456@1.2.3.5:30303"
      ],
      "v5Bootnodes": [
        "enr:-Mq4QL...DdWRwgiMo",
        "enr:-Ku4QLV...IN1ZHCCIyk"
      ],
      "dns": "enrtree://AM5FCQLWIZX2QFPNJAP7VUERCCRNGRHWZG3YYHIUV7BVDQ5FDPRT2@nodes.example.org"
    }
  }
}
```
