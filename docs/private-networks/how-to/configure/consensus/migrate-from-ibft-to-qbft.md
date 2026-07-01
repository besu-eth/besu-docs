---
title: Migrate from IBFT 2.0 to QBFT
description: Migrate an existing IBFT 2.0 private network to QBFT consensus.
sidebar_position: 5
keywords: [IBFT 2.0, QBFT, consensus migration, private network, startBlock]
---

# Migrate from IBFT 2.0 to QBFT

You can migrate a live [IBFT 2.0](ibft.md) network to [QBFT](qbft.md) consensus by updating the
genesis file to include a QBFT configuration section with a future migration block.

## Prerequisites

- A running IBFT 2.0 private network.

## Steps

### 1. Choose a migration block

Choose a block number that gives you enough time to update and restart all nodes in the network.
The migration block must be greater than the current chain head when you restart each node.

Get the current chain head block number using [`eth_blockNumber`](../../../../public-networks/reference/api/index.md#eth_blocknumber):

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://<NODE_URL>:8545
```

### 2. Update the genesis file

Add a `qbft` section to the existing genesis file.
Keep the original `ibft2` section intact; Besu uses both sections to detect and configure the
migration.

```json title="Example migration genesis file"
{
  "config": {
    "chainId": 1337,
    "berlinBlock": 0,
    "ibft2": {
      "blockperiodseconds": 2,
      "epochlength": 30000,
      "requesttimeoutseconds": 4
    },
    "qbft": {
      "blockperiodseconds": 2,
      "epochlength": 30000,
      "requesttimeoutseconds": 4,
      "startBlock": <MIGRATION_BLOCK_NUMBER>
    }
  },
  "nonce": "0x0",
  "timestamp": "0x58ee40ba",
  "extraData": "<EXISTING_IBFT2_EXTRA_DATA>",
  "gasLimit": "0x1fffffffffffff",
  "difficulty": "0x1",
  "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
  "alloc": {}
}
```

Ensure these fields are set:

- `qbft.startBlock` - The migration block number you chose in step 1.
  The value must be greater than 0 and greater than the current chain head when you restart each node.
- `extraData` - The `extraData` value from your existing genesis file.
  This field encodes the initial validator set for the IBFT 2.0 genesis block and remains valid after
  migration because Besu reads the validator set from block headers.

You can set different QBFT parameters (for example, a shorter `blockperiodseconds`) if you want
the network behavior to change after the migration block.
If you want to keep the same parameters, copy the values from the `ibft2` section.

### 3. Restart all nodes with the updated genesis

Before the network reaches the migration block, restart each node with the updated genesis file:

```bash
besu \
  --genesis-file=<PATH_TO_UPDATED_GENESIS> \
  --data-path=<DATA_DIRECTORY> \
  <OTHER_FLAGS>
```

Nodes automatically register both the IBFT 2.0 and QBFT wire protocols so they can communicate 
before and after the migration block.

:::tip
Restart validator nodes one at a time and confirm each node is peering correctly before restarting
the next one.
Because IBFT 2.0 requires a super-majority of validators to produce blocks, losing more than 1/3 of
validators during the restart window will stall the network.
:::

:::warning
If any node is still using the old genesis configuration at the migration block, that node will fork
from the network.
:::

### 4. Verify the migration

When the network reaches the migration block, Besu handles the cutover from IBFT 2.0 to QBFT 
automatically.
Confirm that the network is producing QBFT blocks by calling
[`qbft_getValidatorsByBlockNumber`](../../../reference/api.md#qbft_getvalidatorsbyblocknumber):

```bash
curl -X POST --data \
  '{"jsonrpc":"2.0","method":"qbft_getValidatorsByBlockNumber","params":["latest"],"id":1}' \
  http://<NODE_URL>:8545
```

A successful response lists the current validators, confirming that QBFT consensus is active.
