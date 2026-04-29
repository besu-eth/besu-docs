---
title: Free gas network
description: Configuring free gas networks
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Configure free gas networks

Transactions use computational resources so have an associated cost. Gas is the cost unit and the gas price is the price per gas unit. The transaction cost is the gas used \* gas price.

In public networks, the account submitting the transaction pays the transaction cost, in Ether. The miner (or validator in PoA networks) that includes the transaction in a block receives transaction cost.

In many private networks, network participants run the validators and do not require gas as an incentive. Networks that don't require gas as an incentive usually configure the gas price to be zero (that is, free gas). Some private networks might allocate Ether and use a non-zero gas price to limit resource use.

:::tip

We use the term _free gas network_ to refer to a network with a gas price of zero. A network with a gas price of zero is also known as a _zero gas network_ or _no gas network_.

:::

:::note

Some pre-crafted transactions require the deployment account to have gas available. For example, the transaction that creates the smart contract in [EIP-1820](https://eips.ethereum.org/EIPS/eip-1820).

:::

In a free gas network, transactions still use gas but the gas price is zero, meaning the transaction cost is zero. Transaction cost = gas used \* 0 (the gas price).

## Configure free gas in Besu

When gas is free, limiting block and contract sizes is less important. In free gas networks, we increase the block size limit and set the contract size limit to the maximum value.

### 1. Set the block size

If you want to remove gas from consideration and don't mind blocks potentially taking longer to create, in the genesis file set the block size limit (measured in gas) to the maximum accepted by Hardhat (`0x1fffffffffffff`). In the genesis file, specify `gasLimit` following the `config` key.

```json
{
  "config": {
  ....
  },
  ...
  "gasLimit": "0x1fffffffffffff",
  ....
}
```

If you are more concerned about blocks arriving on time and don't have expensive individual transactions, set `gasLimit` to a value closer to the amount of gas your validators can process in the configured block time.

### 2. Set the contract size

In the `config` section of the genesis file, set the contract size limit to the maximum supported size (in bytes).

```json
(
  "config": {
    ...
    "contractSizeLimit": 2147483647,
    ...
  }
  ...
}
```

### 3. Start Besu with a minimum gas price of zero

When starting nodes, set the [minimum gas price](../../../public-networks/reference/cli/options.md#min-gas-price) to zero.

<Tabs>

<TabItem value="Command line" default>

```bash
--min-gas-price=0
```

</TabItem>

<TabItem value="Configuration file">

```bash
min-gas-price=0
```

</TabItem>

</Tabs>

:::danger Important

In a free gas network, ensure the [minimum gas price](../../../public-networks/reference/cli/options.md#min-gas-price) is set to zero for every node. Any node with a minimum gas price set higher than zero will silently drop transactions with a zero gas price. You can query a node's gas configuration using [`eth_gasPrice`](../../../public-networks/reference/api/index.md#eth_gasprice).

:::

### 4. Enable zero base fee if using London fork or later

If your network is configured to use the `londonBlock` or a later hard fork, then you must also enable the `zeroBaseFee` configuration. You must set this on all your nodes. Once it is set, future blocks produced by that node will set a `baseFee` of 0. This is required because the London hard fork (EIP-1559) introduced a non-zero `baseFee` into the block which normally means transactions require gas.

```json
{
  "config": {
    "londonBlock": 0,
    "zeroBaseFee": true,
    ...
  },
  ...
}
```

If zero base fee is enabled, you cannot specify a value for [`--tx-pool-price-bump`](../../../public-networks/reference/cli/options.md#tx-pool-price-bump).

## Configure free gas in Hardhat

If using Hardhat to develop your free gas network, you also need to configure free gas in Hardhat.

Like setting block and contract size limits to their maximum values for Besu, set the transaction gas limit in Hardhat to the maximum possible.

:::info

Besu does not support private key management. To use Besu with Hardhat, you must configure a [Hardhat wallet](../../../public-networks/how-to/develop/hardhat.md).

:::

### Update `hardhat.config.js`

Update the `hardhat.config.js` file:

1. Set the gas price to zero.

   ```js
   gasPrice: 0;
   ```

1. Set the gas limit for a transaction (that is, contract creation) to be the block gas limit - 1.

   ```js
   gas: "0x1ffffffffffffe";
   ```

   Setting `gasPrice` to `0` should cover transaction costs for most deployments.

1. Specify `evmVersion` when using the latest Solidity version.

   ```js
   solidity: {
      version: "0.8.20",
      settings: {
        evmVersion: "london", // required for Besu
        optimizer: {...},
      },
    },
   ```
