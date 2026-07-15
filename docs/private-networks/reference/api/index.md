---
sidebar_position: 1
description: Besu private network JSON-RPC API methods reference
---

# Private network JSON-RPC API methods

The Besu private network JSON-RPC API methods are grouped by namespace:

| Namespace | Description |
| --- | --- |
| [`IBFT`](ibft.md) | Access the [IBFT 2.0](../../how-to/configure/consensus/ibft.md) consensus engine. |
| [`PERM`](perm.md) | [Local permissioning](../../how-to/use-local-permissioning.md) functionality. |
| [`QBFT`](qbft.md) | Access the [QBFT](../../how-to/configure/consensus/qbft.md) consensus engine. |

:::caution Important

- This reference contains API methods that apply to only private networks. For API methods that apply to both private and public networks, see the [public network API reference](../../../public-networks/reference/api/index.md).
- All JSON-RPC HTTP examples use the default host and port endpoint `http://127.0.0.1:8545`. If using the [`--rpc-http-host`](../../../public-networks/reference/options.md#rpc-http-host) or [`--rpc-http-port`](../../../public-networks/reference/options.md#rpc-http-port) options, update the endpoint.

:::
