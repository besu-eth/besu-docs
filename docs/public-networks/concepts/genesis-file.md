---
title: Genesis file
sidebar_position: 9
description: Learn about configuring a network using the genesis file.
---

# Genesis file

The genesis file defines the first block in the chain, and the first block defines which chain you want to join.

For Ethereum Mainnet and public testnets (for example, Sepolia) the genesis configuration definition is in Besu and used when specifying a public network using the [`--network`](../reference/cli/options.md#network) command line option.

For private networks, [create a JSON genesis file](https://consensys.net/blog/quorum/hyperledger-besu-how-to-create-an-ethereum-genesis-file/), then specify the genesis file using the [`--genesis-file`](../reference/cli/options.md#genesis-file) command line option.

The genesis file specifies the [network-wide settings](../reference/genesis-items.md), such as those for a [free gas network](../../private-networks/how-to/configure/free-gas.md), so all nodes in a network must use the same genesis file.

:::note

You can specify node-level settings on the command line or in the [node configuration file](../how-to/configure-besu/index.md).

:::

```json title="Example IBFT 2.0 genesis file"
{
  "config": {
    "chainId": 2018,
    "berlinBlock": 0,
    "ibft2": {
      "blockperiodseconds": 2,
      "epochlength": 30000,
      "requesttimeoutseconds": 4
    }
  },
  "nonce": "0x0",
  "timestamp": "0x58ee40ba",
  "extraData": "0xf83ea00000000000000000000000000000000000000000000000000000000000000000d5949811ebc35d7b06b3fa8dc5809a1f9c52751e1deb808400000000c0",
  "gasLimit": "0x1fffffffffffff",
  "difficulty": "0x1",
  "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
  "coinbase": "0x0000000000000000000000000000000000000000",
  "alloc": {
    "9811ebc35d7b06b3fa8dc5809a1f9c52751e1deb": {
      "balance": "0xad78ebc5ac6200000"
    }
  }
}
```
