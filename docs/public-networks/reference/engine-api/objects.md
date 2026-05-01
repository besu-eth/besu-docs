---
title: Objects
description: Engine API objects reference
---

# Engine API objects

The following objects are parameters for or returned by the [Engine API methods](index.md).

## Blob and proof object

Returned by [`engine_getBlobsV1`](index.md#engine_getblobsv1).

| Key | Type | Value |
| --- | :-: | --- |
| `blob` | _Data_, 131072 Bytes | An SSZ-encoded `Blob` as defined in [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844). |
| `proof` | _Data_, 48 Bytes | A `KZGProof` as defined in [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844). |

## Execution payload object

Parameter for [`engine_newPayloadV1`](index.md#engine_newpayloadv1). Returned by [`engine_getPayloadV1`](index.md#engine_getpayloadv1).

| Key | Type | Value |
| --- | :-: | --- |
| `parentHash` | _Data_, 32 Bytes | Hash of the parent block. |
| `feeRecipient` | _Data_, 20 Bytes | Beneficiary of the fee. |
| `stateRoot` | _Data_, 32 Bytes | Root of the final state trie for the block. |
| `receiptsRoot` | _Data_, 32 Bytes | Root of the receipts trie for the block. |
| `logsBloom` | _Data_, 256 Bytes | Bloom filter for light clients to quickly retrieve related logs. |
| `prevRandao` | _Data_, 32 Bytes | Difficulty for this block. |
| `blockNumber` | _Quantity_, 64 Bits | Block number of block containing this transaction. |
| `gasLimit` | _Quantity_, 64 Bits | Maximum gas allowed in this block. |
| `gasUsed` | _Quantity_, 64 Bits | Total gas used by all transactions in this block. |
| `timestamp` | _Quantity_, 64 Bits | Unix timestamp (milliseconds) for block assembly. |
| `extraData` | _Data_, 0 to 32 Bytes | Extra data field for this block. |
| `baseFeePerGas` | _Quantity_, 256 Bits | The block's [base fee per gas](../../concepts/transactions/types.md#eip1559-transactions). This field is empty for blocks created before [EIP-1559](https://github.com/ethereum/EIPs/blob/2d8a95e14e56de27c5465d93747b0006bd8ac47f/EIPS/eip-1559.md). |
| `blockHash` | _Data_, 32 Bytes | Hash of the execution block. |
| `transactions` | _Array_ | Array of transaction objects, each object is a list representing `TransactionType`, `TransactionPayload`, or `LegacyTransaction` as defined in [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718). |

## Fork choice state object

Parameter for [`engine_forkchoiceUpdatedV1`](index.md#engine_forkchoiceupdatedv1).

| Key | Type | Value |
| --- | :-: | --- |
| `headBlockHash` | _Data_, 32 Bytes | Block hash of the head of the canonical chain. |
| `safeBlockHash` | _Data_, 32 Bytes | "Safe" block hash of the canonical chain under certain synchrony and honesty assumptions. This value MUST be either equal to or an ancestor of `headBlockHash`. |
| `finalizedBlockHash` | _Data_, 32 Bytes | Block hash of the most recent finalized block. |

## Payload attributes object

Parameter for [`engine_forkchoiceUpdatedV1`](index.md#engine_forkchoiceupdatedv1).

| Key | Type | Value |
| --- | :-: | --- |
| `timestamp` | _Quantity_, 64 Bits | Value for the `timestamp` field of the new payload. |
| `prevRandao` | _Data_, 32 Bytes | Value for the `prevRandao` field of the new payload. |
| `suggestedFeeRecipient` | _Data_, 20 Bytes | Suggested value for the `feeRecipient` field of the new payload. |

## Payload status object

Returned by [`engine_newPayloadV1`](index.md#engine_newpayloadv1) and [`engine_forkchoiceUpdatedV1`](index.md#engine_forkchoiceupdatedv1).

| Key | Type | Value |
| --- | :-: | --- |
| `status` | _Enumeration_ | Either `"VALID"`, `"INVALID"`, `"SYNCING"`, `"ACCEPTED"`, `"INVALID_BLOCK_HASH"`, or `"INVALID_TERMINAL_BLOCK"`. |
| `latestValidHash` | _Data_, 32 Bytes | Hash of the most recent valid block in the branch defined by payload and its ancestors. |
| `validationError` | _String_ | Message providing additional details on the validation error if the payload is classified as `INVALID`, `INVALID_BLOCK_HASH` or `INVALID_TERMINAL_BLOCK`. |

## Transition configuration object

Parameter for and returned by [`engine_exchangeTransitionConfigurationV1`](index.md#engine_exchangetransitionconfigurationv1).

| Key | Type | Value |
| --- | :-: | --- |
| `terminalTotalDifficulty` | _Quantity_, 256 Bits | Maps on the `TERMINAL_TOTAL_DIFFICULTY` parameter of [EIP-3675](https://eips.ethereum.org/EIPS/eip-3675#client-software-configuration). |
| `terminalBlockHash` | _Data_, 32 Bytes | Maps on the `TERMINAL_BLOCK_HASH` parameter of [EIP-3675](https://eips.ethereum.org/EIPS/eip-3675#client-software-configuration). |
| `terminalBlockNumber` | _Quantity_, 64 Bits | Maps on the `TERMINAL_BLOCK_NUMBER` parameter of [EIP-3675](https://eips.ethereum.org/EIPS/eip-3675#client-software-configuration). |
