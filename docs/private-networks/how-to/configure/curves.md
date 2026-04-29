---
title: Alternative elliptic curves
description: Using alternative elliptic curves in Besu
sidebar_position: 8
---

# Configure alternative elliptic curves

:::caution

Configuring alternative elliptic curves is an early access feature.

:::

By default, Besu uses the Ethereum standard `secp256k1` elliptic curve (EC). However, when running nodes in a private network, it is possible to configure an alternative elliptic curve.

The configuration for what elliptic curve Besu will use is done in the network configuration section of genesis file, using the [`ecCurve`](../../../public-networks/reference/genesis-items.md#configuration-items) key:

```bash
{
  "genesis": {
    "config": {
      "ecCurve": "secp256k1",
    [...]
  },
  [...]
}
```

:::danger Important

All nodes in the network **MUST** use the same elliptic curve. Nodes with different EC configuration from the network won't be able to send messages to other nodes or verify transactions and blocks.

:::

Besu supports the following elliptic curves:

- `secp256k1` (Ethereum default)
- `secp256r1`
