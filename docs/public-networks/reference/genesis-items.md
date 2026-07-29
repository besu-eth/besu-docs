---
title: Genesis file items
sidebar_position: 4
description: Genesis file configuration items reference
---

# Genesis file items

The [Besu genesis file](../concepts/genesis-file.md) contains [network configuration items](#configuration-items) and [genesis block parameters](#genesis-block-parameters).

:::note
Genesis item names are case-insensitive, except account addresses in `alloc`.
The examples on this page use the casing used in Besu's built-in genesis files.
:::

## Configuration items

Network configuration items are specified in the genesis file in the `config` object.

| Item                                   | Description                                                                                                                                                                                                 |
|----------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Milestone blocks                       | [Protocol milestone activation points](#milestone-configuration-items) for the network.                                                                                                                                  |
| `chainId`                              | [Chain ID](../concepts/network-and-chain-id.md) for the network.                                                                                                                                            |
| `ibft2`                                | Specifies that the network uses [IBFT 2.0](/private-networks/how-to/configure/consensus/ibft) and contains [IBFT 2.0 configuration items](/private-networks/how-to/configure/consensus/ibft#genesis-file).   |
| `qbft`                                 | Specifies that the network uses [QBFT](/private-networks/how-to/configure/consensus/qbft) and contains [QBFT configuration items](/private-networks/how-to/configure/consensus/qbft#genesis-file).          |
| `transitions`                          | Specifies the block at which to [change IBFT 2.0 or QBFT validators](../../private-networks/how-to/configure/consensus/add-validators-without-voting.md).                                                             |
| `contractSizeLimit`                    | Maximum contract size in bytes. Specify in [free gas networks](/private-networks/how-to/configure/free-gas). The default is `24576` and the maximum size is `2147483647`.                                  |
| `evmStackSize`                         | Maximum stack size. Specify to increase the maximum stack size in private networks with complex smart contracts. The default is `1024`.                                                                     |
| `ecCurve`                              | Specifies [the elliptic curve to use](/private-networks/how-to/configure/curves). The default is `secp256k1`.                                                                                              |
| `discovery`                            | Specifies [discovery configuration items](#discovery-configuration-items). The `discovery` object can be left empty.                                                                                        |
| `zeroBaseFee`                          | Specifies a base fee of `0` for [free gas networks](/private-networks/how-to/configure/free-gas#4-enable-zero-base-fee-if-using-london-fork-or-later).                                                     |
| `fixedBaseFee`                         | Specifies a constant base fee for blocks, overriding the dynamic base fee calculation of [Ethereum Improvement Proposal 1559 (EIP-1559)](../concepts/transactions/types.md#eip1559-transactions).           |
| `depositContractAddress`               | Address for the Ethereum staking contract.                                                                                                                           |
| `withdrawalRequestContractAddress`     | Address for the withdrawal request contract.                                                                                                                          |
| `consolidationRequestContractAddress`  | Address for the consolidation request contract.                                                                                                                       |
| `blobSchedule`                         | Specifies [blob schedule configuration items](#blob-schedule-configuration-items).                                                                                                                          |

## Genesis block parameters

Genesis block parameters are specified as top-level fields in the genesis file, outside of `config`.

| Item                    | Description                                                                                                                                                             |
|-------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `alloc`                 | Defines [accounts with balances](/private-networks/reference/accounts-for-testing) or [contracts](/private-networks/how-to/configure/contracts).                         |
| `baseFeePerGas`         | Genesis block base fee per gas, in Wei. Specify as a decimal or hexadecimal string. If omitted and `londonBlock` is `0`, Besu uses `1000000000`.                      |
| `blobGasUsed`           | Blob gas used in the genesis block. Besu applies this value when Cancun is active at genesis. The default is `0x0`.                                                     |
| `coinbase`              | Beneficiary address in the genesis block. If omitted, Besu uses the zero address.                                                                                       |
| `difficulty`            | Difficulty value in the genesis block. The required value depends on the consensus protocol.                                                                             |
| `excessBlobGas`         | Excess blob gas in the genesis block. Besu applies this value when Cancun is active at genesis. The default is `0x0`.                                                   |
| `extraData`             | Extra data in the genesis block. For IBFT 2.0 and QBFT, this contains the validator list and consensus metadata.                                                        |
| `gasLimit`              | Block gas limit. Total gas limit for all transactions in a block.                                                                                                       |
| `mixHash`               | Mix hash value in the genesis block. The required value depends on the consensus protocol.                                                                               |
| `nonce`                 | Used in block computation. Can be any value in the genesis block. The default is `0x0`.                                                                                 |
| `parentBeaconBlockRoot` | Parent beacon block root in the genesis block. Besu applies this value when Cancun is active at genesis. The default is the zero hash.                                  |
| `parentHash`            | Parent hash in the genesis block.                                                                                                                                      |
| `slotNumber`            | Slot number in the genesis block. Besu applies this value when Amsterdam is active at genesis. The default is `0x0`.                                                    |
| `timestamp`             | Creation date and time of the genesis block. Must be before the next block, so we recommend specifying `0x0`. |

:::caution

If a `Supplied genesis block does not match stored chain data` error occurs, use the genesis file matching the genesis block of the data directory, or use the [`--data-path`](../reference/options.md#data-path) option to specify a different data directory.

:::

## Milestone configuration items

Milestone items activate protocol changes for the network.
Use `terminalTotalDifficulty` for the Paris transition (The Merge).
Use block-number milestone items for pre-merge forks and timestamp milestone
items for post-merge forks (Shanghai and later).

See the Ethereum execution specs
[protocol history](https://github.com/ethereum/execution-specs/blob/master/docs/specs/protocol_history.md#mainnet-hardforks)
for Mainnet activation blocks and timestamps.

```json title="Ethereum Mainnet milestone items"
{
  "config": {
    "homesteadBlock": 1150000,
    "daoForkBlock": 1920000,
    "eip150Block": 2463000,
    "eip158Block": 2675000,
    "byzantiumBlock": 4370000,
    "constantinopleBlock": 7280000,
    "constantinopleFixBlock": 7280000,
    "istanbulBlock": 9069000,
    "muirGlacierBlock": 9200000,
    "berlinBlock": 12244000,
    "londonBlock": 12965000,
    "arrowGlacierBlock": 13773000,
    "grayGlacierBlock": 15050000,
    "terminalTotalDifficulty": 58750000000000000000000,
    "shanghaiTime": 1681338455,
    "cancunTime": 1710338135,
    "pragueTime": 1746612311,
    "osakaTime": 1764798551,
    "bpo1Time": 1765290071,
    "bpo2Time": 1767747671
  }
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

## Blob schedule configuration items

Use the `blobSchedule` object to configure blob gas parameters for Cancun,
Prague, and Blob Parameter Only (BPO) forks.

| Item                    | Description                                                           |
|-------------------------|:----------------------------------------------------------------------|
| `target`                | Target number of blobs per block for the fork.                        |
| `max`                   | Maximum number of blobs per block for the fork.                       |
| `baseFeeUpdateFraction` | Denominator used to update the blob base fee for the fork.            |

```json title="Blob schedule example"
{
  "config": {
    "blobSchedule": {
      "cancun": {
        "target": 3,
        "max": 6,
        "baseFeeUpdateFraction": 3338477
      },
      "prague": {
        "target": 6,
        "max": 9,
        "baseFeeUpdateFraction": 5007716
      }
    }
  }
}
```

## Discovery configuration items

Use the `discovery` configuration items to specify the [`bootnodes`](options.md#bootnodes) and [`discovery-dns-url`](options.md#discovery-dns-url) in the genesis file, in place of using CLI options or listing them in the configuration file.
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
