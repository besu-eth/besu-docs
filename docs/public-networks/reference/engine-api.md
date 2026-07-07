---
title: Engine API
sidebar_position: 3
description: Engine API methods reference
---

# Engine API methods

[Consensus and execution clients](../concepts/node-clients.md#execution-and-consensus-clients) communicate with each other using the Engine API.
See [how to use the Engine API](../how-to/use-engine-api.md) to communicate with a consensus client.

:::info

The Engine API is enabled by default.

:::

Besu supports the following list of Engine API methods.
Each method links to its definition in the
[Ethereum execution APIs specification](https://ethereum.github.io/execution-apis/),
which documents the full request parameters, response fields, and examples.

Several methods have multiple versions because the Engine API adds a new versioned method whenever a hard fork changes a payload or parameter shape.
A consensus client calls the version appropriate for the network's currently active fork.

- [`engine_exchangeCapabilities`](https://ethereum.github.io/execution-apis/api/methods/engine_exchangeCapabilities) -
  Exchanges a list of supported Engine API methods between the consensus client and Besu.
- [`engine_exchangeTransitionConfigurationV1`](https://ethereum.github.io/execution-apis/api/methods/engine_exchangeTransitionConfigurationV1) -
  Sends the transition configuration to the consensus client to verify the configuration between both clients.
- [`engine_forkchoiceUpdatedV1`](https://ethereum.github.io/execution-apis/api/methods/engine_forkchoiceUpdatedV1), [`V2`](https://ethereum.github.io/execution-apis/api/methods/engine_forkchoiceUpdatedV2), [`V3`](https://ethereum.github.io/execution-apis/api/methods/engine_forkchoiceUpdatedV3), [`V4`](https://ethereum.github.io/execution-apis/api/methods/engine_forkchoiceUpdatedV4) - Updates the fork choice with the consensus client.
- [`engine_getBlobsV1`](https://ethereum.github.io/execution-apis/api/methods/engine_getBlobsV1), [`V2`](https://ethereum.github.io/execution-apis/api/methods/engine_getBlobsV2), [`V3`](https://ethereum.github.io/execution-apis/api/methods/engine_getBlobsV3) - Returns the blobs corresponding to the specified blob versioned hashes.
- [`engine_getClientVersionV1`](https://github.com/ethereum/execution-apis/blob/main/src/engine/identification.md#engine_getclientversionv1) - Exchanges the current client version.
- [`engine_getPayloadV1`](https://ethereum.github.io/execution-apis/api/methods/engine_getPayloadV1), [`V2`](https://ethereum.github.io/execution-apis/api/methods/engine_getPayloadV2), [`V3`](https://ethereum.github.io/execution-apis/api/methods/engine_getPayloadV3),
[`V4`](https://ethereum.github.io/execution-apis/api/methods/engine_getPayloadV4),
[`V5`](https://ethereum.github.io/execution-apis/api/methods/engine_getPayloadV5),
[`V6`](https://ethereum.github.io/execution-apis/api/methods/engine_getPayloadV6) - Prepares the payload to send to the consensus client.
- [`engine_getPayloadBodiesByHashV1`](https://ethereum.github.io/execution-apis/api/methods/engine_getPayloadBodiesByHashV1), [`V2`](https://ethereum.github.io/execution-apis/api/methods/engine_getPayloadBodiesByHashV2) - Returns execution payload bodies for the specified block hashes.
- [`engine_getPayloadBodiesByRangeV1`](https://ethereum.github.io/execution-apis/api/methods/engine_getPayloadBodiesByRangeV1), [`V2`](https://ethereum.github.io/execution-apis/api/methods/engine_getPayloadBodiesByRangeV2) - Returns execution payload bodies for the specified range of block numbers.
- [`engine_newPayloadV1`](https://ethereum.github.io/execution-apis/api/methods/engine_newPayloadV1),
[`V2`](https://ethereum.github.io/execution-apis/api/methods/engine_newPayloadV2),
[`V3`](https://ethereum.github.io/execution-apis/api/methods/engine_newPayloadV3),
[`V4`](https://ethereum.github.io/execution-apis/api/methods/engine_newPayloadV4),
[`V5`](https://ethereum.github.io/execution-apis/api/methods/engine_newPayloadV5) - Executes the payload with the consensus client.
