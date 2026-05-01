---
title: IBFT 2.0
description: Besu IBFT 2.0 proof of authority (PoA) consensus protocol implementation
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Configure IBFT 2.0 consensus

Besu implements the IBFT 2.0 proof of authority (PoA) [consensus protocol](index.md). IBFT 2.0 is supported for existing private networks, but [QBFT](qbft.md) is the recommended enterprise-grade consensus protocol for private networks.

In IBFT 2.0 networks, approved accounts, known as validators, validate transactions and blocks. Validators take turns to create the next block. Before inserting the block onto the chain, a super-majority (greater than or equal to 2/3) of validators must first sign the block.

Existing validators propose and vote to [add or remove validators](#add-and-remove-validators).

You can [create a private network using IBFT](../../../tutorials/ibft/index.md).

:::caution

Configure your network to ensure you never lose more than 1/3 of your validators.
If more than 1/3 of validators stop participating, the network stops creating new blocks and stalls.
It might take significant time to recover after nodes are restarted.

:::

:::tip

You can use a plugin to securely store a validator's key using the [`--security-module`](../../../../public-networks/reference/cli/options.md#security-module) option.

:::

## Genesis file

To use IBFT 2.0, Besu requires an IBFT 2.0 [genesis file](../../../../public-networks/concepts/genesis-file.md). The genesis file defines properties specific to IBFT 2.0.

```json title="Example IBFT 2.0 genesis file"
{
  "config": {
    "chainId": 1981,
    "berlinBlock": 0,
    "ibft2": {
      "blockperiodseconds": 2,
      "epochlength": 30000,
      "requesttimeoutseconds": 4,
      "blockreward": "5000000000000000",
      "miningbeneficiary": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
    }
  },
  "nonce": "0x0",
  "timestamp": "0x58ee40ba",
  "extraData": "0xf83ea00000000000000000000000000000000000000000000000000000000000000000d594c2ab482b506de561668e07f04547232a72897daf808400000000c0",
  "gasLimit": "0x1fffffffffffff",
  "difficulty": "0x1",
  "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
  "alloc": {}
}
```

The properties specific to IBFT 2.0 are:

- `blockperiodseconds` - The minimum block time, in seconds.
- `epochlength` - The number of blocks after which to reset all votes.
- `requesttimeoutseconds` - The timeout for each consensus round before a round change, in seconds.
- `blockreward` - Optional reward amount in Wei to reward the beneficiary. Defaults to zero (0). Can be specified as a hexadecimal (with 0x prefix) or decimal string value. If set, then all nodes on the network must use the identical value.
- `miningbeneficiary` - Optional beneficiary of the `blockreward`. Defaults to the validator that proposes the block. If set, then all nodes on the network must use the same beneficiary.
- `extraData` - RLP encoded [extra data](#extra-data).

:::caution

We don't recommend changing `epochlength` in a running network. Changing the `epochlength` after genesis can result in illegal blocks.

:::

:::caution Invalid block header error

When adding a new node, if a `TimeStampMoreRecentThanParent | Invalid block header` error occurs, the genesis file of the new node specifies a higher `blockperiodseconds` than the imported chain. The imported chain makes new blocks faster than the genesis file allows and Besu rejects them with this error. This error most often occurs when importing chains from older versions of Besu.

Decrease the `blockperiodseconds` in the new IBFT 2.0 genesis file to a lower value that satisfies the block header validation.

:::

If the error reads `| TimestampMoreRecentThanParent | Invalid block header: timestamp 1619660141 is only 3 seconds newer than parent timestamp 1619660138. Minimum 4 seconds`, decrease the `blockperiodseconds` from 4 seconds to 3 seconds to match the imported chain.

After you update the new genesis file, if the imported chain has a `blockperiodseconds` value set lower than you prefer, you can adjust it by [configuring the block time on an existing IBFT 2.0 network](#configure-block-time-on-an-existing-network).

The properties with specific values in the IBFT 2.0 genesis files are:

- `nonce` - `0x0`
- `difficulty` - `0x1`
- `mixHash` - `0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365` for Istanbul block identification

To start a node on an IBFT 2.0 private network, use the [`--genesis-file`](../../../../public-networks/reference/cli/options.md#genesis-file) option to specify the custom genesis file.

### Extra data

The `extraData` property is an RLP encoding of:

- 32 bytes of vanity data.
- A list of validator addresses.
- Any validator votes. No vote is included in the genesis block.
- The round the block was created on. The round in the genesis block is 0.
- A list of seals of the validators (signed block hashes). No seals are included in the genesis block.

In the genesis block, the important information in the extra data is the list of validators. All other details have empty values. Formally, `extraData` in the genesis block contains `RLP([32 bytes Vanity, List<Validators>, No Vote, Round=Int(0), 0 Seals])`.

:::info

RLP encoding is a space-efficient object serialization scheme used in Ethereum.

:::

#### Generate extra data

To generate the `extraData` RLP string for inclusion in the genesis file, use the [`rlp encode`](../../../reference/cli/subcommands.md#encode) Besu subcommand.

```bash title="Example"
besu rlp encode --from=toEncode.json
```

Where the `toEncode.json` file contains a list of the initial validators, in ascending order. To write the validator address and copy it to the `toEncode.json` file, use the [`public-key export-address`](../../../../public-networks/reference/cli/subcommands.md#export-address) Besu subcommand. For example:

```json title="One initial validator in toEncode.json file"
["9811ebc35d7b06b3fa8dc5809a1f9c52751e1deb"]
```

Copy the RLP encoded data to the `extraData` property in the genesis file.

### Block time

When the protocol receives a new chain head, the block time (`blockperiodseconds`) and round timeout (`requesttimeoutseconds`) timers start. When `blockperiodseconds` expires, the protocol proposes a new block.

If `requesttimeoutseconds` expires before adding the proposed block, a round change occurs, with the block time and timeout timers reset. The timeout period for the new round is two times `requesttimeoutseconds`. The timeout period continues to double each time a round fails to add a block.

Usually, the protocol adds the proposed block before reaching `requesttimeoutseconds`. A new round then starts, resetting the block time and round timeout timers. When `blockperiodseconds` expires, the protocol proposes the next new block.

:::danger

If more than 1/3 of validators stop participating, new blocks can no longer be created and `requesttimeoutseconds` doubles with each round change. The quickest method to resume block production is to restart all validators, which resets `requesttimeoutseconds` to its genesis value.

:::

Once `blockperiodseconds` is over, the time from proposing a block to adding the block is small (usually around one second) even in networks with geographically dispersed validators.

An internal network run by ConsenSys had four geographically dispersed validators in Sweden, Sydney, and two in North Virginia. With a `blockperiodseconds` of 5 and a `requesttimeoutseconds` of 10, the testnet consistently created blocks with a five second block time.

#### Tune block timeout

To tune the block timeout for your network deployment:

1. Set `blockperiodseconds` to your desired block time and `requesttimeoutseconds` to two times `blockperiodseconds`.
1. Reduce `requesttimeoutseconds` until you start to see round changes occurring.
1. Increase `requesttimeoutseconds` to the value where round changes are no longer occurring.

:::tip

View [`TRACE` logs](../../../../public-networks/reference/api/index.md#trace-methods) to see round change log messages.

:::

Use a [transition](#transitions) to update the `blockperiodseconds` in an existing network.

### Optional configuration options

Optional configuration options in the genesis file are:

- `messageQueueLimit` - In large networks with limited resources, increasing the message queue limit might help with message activity surges. The default is 1000.
- `duplicateMessageLimit` - If the same node is retransmitting messages, increasing the duplicate message limit might reduce the number of retransmissions. A value of two to three times the number of validators is usually enough. The default is 100.
- `futureMessagesLimit` - The future messages buffer holds messages for a future chain height. For large networks, increasing the future messages limit might be useful. The default is 1000.
- `futureMessagesMaxDistance` - The maximum height from the current chain height for buffering messages in the future messages buffer. The default is 10.

### Post-Merge configuration

After [The Merge](https://ethereum.org/en/upgrades/merge/), the following block fields are modified or deprecated. Their fields **must** contain only the constant values from the following chart.

| Field            | Constant value                                                       | Comment                    |
|------------------|----------------------------------------------------------------------|----------------------------|
| **`ommersHash`** | `0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347` | `= Keccak256(RLP([]))`     |
| **`difficulty`** | `0`                                                                  | Replaced with `prevrandao` |
| **`mixHash`**    | `0x0000000000000000000000000000000000000000000000000000000000000000` | Replaced with `prevrandao` |
| **`nonce`**      | `0x0000000000000000`                                                 |                            |
| **`ommers`**     | `[]`                                                                 | `RLP([]) = 0xc0`           |

Additionally, [`extraData`](#extra-data) is limited to 32 bytes of vanity data after The Merge.

## Add and remove validators

Existing validators propose and vote to add or remove validators using the IBFT 2.0 JSON-RPC API methods. Enable the HTTP interface with [`--rpc-http-enabled`](../../../../public-networks/reference/cli/options.md#rpc-http-enabled) or the WebSocket interface with [`--rpc-ws-enabled`](../../../../public-networks/reference/cli/options.md#rpc-ws-enabled).

The IBFT 2.0 API methods are disabled by default. To enable them, specify the [`--rpc-http-api`](../../../../public-networks/reference/cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../../../../public-networks/reference/cli/options.md#rpc-ws-api) option and include `IBFT`.

The methods to add or remove validators are:

- [`ibft_getPendingVotes`](../../../reference/api.md#ibft_getpendingvotes).
- [`ibft_proposeValidatorVote`](../../../reference/api.md#ibft_proposevalidatorvote).
- [`ibft_discardValidatorVote`](../../../reference/api.md#ibft_discardvalidatorvote).

To view validator metrics for a specified block range, use [`ibft_getSignerMetrics`](../../../reference/api.md#ibft_getsignermetrics).

:::note

If network conditions render it impossible to add and remove validators by voting, you can [add and remove validators without voting](add-validators-without-voting.md).

:::

### Add a validator

To propose adding a validator to an IBFT 2.0 network, call [`ibft_proposeValidatorVote`](../../../reference/api.md#ibft_proposevalidatorvote), specifying the address of the proposed validator and `true`. A majority of validators must execute the call.

```bash title="JSON-RPC ibft_proposeValidatorVote request example"
curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_proposeValidatorVote","params":["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73", true], "id":1}' <JSON-RPC-endpoint:port>
```

When the validator proposes the next block, the protocol inserts one proposal received from [`ibft_proposeValidatorVote`](../../../reference/api.md#ibft_proposevalidatorvote) into the block. If blocks include all proposals, subsequent blocks proposed by the validator will not contain a vote.

When more than 50% of the existing validators have published a matching proposal, the protocol adds the proposed validator to the validator pool and the validator can begin validating blocks.

To return a list of validators and confirm the addition of a proposed validator, use [`ibft_getValidatorsByBlockNumber`](../../../reference/api.md#ibft_getvalidatorsbyblocknumber).

```bash title="JSON-RPC ibft_getValidatorsByBlockNumber request example"
curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_getValidatorsByBlockNumber","params":["latest"], "id":1}' <JSON-RPC-endpoint:port>
```

To discard your proposal after confirming the addition of a validator, call [`ibft_discardValidatorVote`](../../../reference/api.md#ibft_discardvalidatorvote), specifying the address of the proposed validator.

```bash title="JSON-RPC ibft_discardValidatorVote request example"
curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_discardValidatorVote","params":["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"], "id":1}' <JSON-RPC-endpoint:port>
```

### Remove a validator

The process for removing a validator from an IBFT 2.0 network is the same as [adding a validator](#add-a-validator) except you specify `false` as the second parameter of [`ibft_proposeValidatorVote`](../../../reference/api.md#ibft_proposevalidatorvote).

### Epoch transition

At each epoch transition, IBFT 2.0 discards all pending votes collected from received blocks. Existing proposals remain in effect and validators re-add their vote the next time they create a block.

An epoch transition occurs every `epochLength` blocks. Define `epochlength` in the [IBFT 2.0 genesis file](#genesis-file).

### Minimum number of validators

IBFT 2.0 requires four validators to be Byzantine fault tolerant. Byzantine fault tolerance is the ability for a blockchain network to function correctly and reach consensus despite nodes failing or propagating incorrect information to peers.

### Maximum number of validators

As the number of validators increase, the message complexity increases, which can decrease performance. In [network tests](https://wiki.hyperledger.org/display/BESU/Maximum+Validator+count+for+an+IBFT2+Network), IBFT 2.0 handles up to 30 validators with no loss of performance.

Non-validator nodes don't affect performance and don't count towards the maximum limit.

## Transitions

The `transitions` genesis configuration item allows you to specify a future block number at which to
change the IBFT 2.0 network configuration in an existing network.
For example, you can update the [block time](#configure-block-time-on-an-existing-network),
[block reward](#configure-block-rewards-on-an-existing-network), or
[mining beneficiary](#configure-the-mining-beneficiary-on-an-existing-network).

:::caution
Do not specify a transition block in the past.
Specifying a transition block in the past can result in unexpected behavior, such as causing the
network to fork.
:::

### Configure block time on an existing network

To update an existing network with a new `blockperiodseconds`:

1. Stop all nodes in the network.
2. In the [genesis file](#genesis-file), add the `transitions` configuration item where:

    - `<FutureBlockNumber>` is the upcoming block at which to change `blockperiodseconds`.
    - `<NewValue>` is the updated value for `blockperiodseconds`.

    <Tabs>
    <TabItem value="Syntax" label="Syntax" default>

    ```json
    {
      "config": {
        ...
        "ibft2": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4
        },
        "transitions": {
          "ibft2": [
            {
              "block": <FutureBlockNumber>,
              "blockperiodseconds": <NewValue>
            }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    <TabItem value="Example" label="Example">

    ```json
    {
      "config": {
        ...
        "ibft2": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4
        },
        "transitions": {
          "ibft2": [
            {
              "block": 1240,
              "blockperiodseconds": 4
            }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    </Tabs>

3. Restart all nodes in the network using the updated genesis file.
4. To verify the changes after the transition block, view the Besu logs and check that the time
   difference between each block matches the updated block period.

### Configure block rewards on an existing network

To update an existing network with a new `blockreward`:

1. Stop all nodes in the network.
2. In the [genesis file](#genesis-file), add the `transitions` configuration item where:

    - `<FutureBlockNumber>` is the upcoming block at which to change `blockreward`.
    - `<NewValue>` is the updated value for `blockreward`.

    <Tabs>
    <TabItem value="Syntax" label="Syntax" default>

    ```json
    {
      "config": {
        ...
        "ibft2": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4
          "blockreward": "5000000000000000"
        },
        "transitions": {
          "ibft2": [
            {
              "block": <FutureBlockNumber>,
              "blockreward": <NewValue>
            },
            {
              "block": <FutureBlockNumber>,
              "blockreward": <NewValue>
            },
            {
              "block": <FutureBlockNumber>,
              "blockreward": <NewValue>
            }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    <TabItem value="Example" label="Example">

    ```json
    {
      "config": {
        ...
        "ibft2": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4
          "blockreward": "5000000000000000"
        },
        "transitions": {
          "ibft2": [
            {
              "block": 10,
              "blockreward": "6000000000000000"
            },
            {
              "block": 15,
              "blockreward": "75000000000000000"
            },
            {
              "block": 20,
              "blockreward": "0"
            }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    </Tabs>
    
    :::note

    You can add multiple `blockreward` updates in one transition object by specifying multiple future blocks.

    :::

3. Restart all nodes in the network using the updated genesis file.

### Configure the mining beneficiary on an existing network

To update an existing network with a new mining beneficiary:

1. Stop all nodes in the network.
2. In the [genesis file](#genesis-file), add the `transitions` configuration item where:

    - `<FutureBlockNumber>` is the upcoming block at which to change `miningbeneficiary`.
    - `<NewAddress>` is the updated 20-byte address for `miningbeneficiary`. Starting at `<FutureBlockNumber>`, block rewards go to this address.

    <Tabs>
    <TabItem value="Syntax" label="Syntax" default>

    ```json
    {
      "config": {
        "chainId": 999,
        "berlinBlock": 0,
        "ibft2": {
          "blockperiodseconds": 1,
          "epochlength": 30000,
          "requesttimeoutseconds": 5,
          "blockreward": "5000000000000000000",
          "miningbeneficiary": "0x0000000000000000000000000000000000000001"
        },
        "transitions": {
          "ibft2": [
            {
              "block": <FutureBlockNumber>,
              "miningbeneficiary": <NewAddress>
            },
            {
              "block": <FutureBlockNumber>,
              "miningbeneficiary": <NewAddress>
            }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    <TabItem value="Example" label="Example">

    ```json
    {
      "config": {
        "chainId": 999,
        "berlinBlock": 0,
        "ibft2": {
          "blockperiodseconds": 1,
          "epochlength": 30000,
          "requesttimeoutseconds": 5,
          "blockreward": "5000000000000000000",
          "miningbeneficiary": "0x0000000000000000000000000000000000000001"
        },
        "transitions": {
          "ibft2": [
          {
            "block": 10000,
            "miningbeneficiary": "",
          },
          {
            "block": 20000,
            "miningbeneficiary": "0x0000000000000000000000000000000000000002",
          }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    </Tabs>
    
    :::note

    Setting the `miningbeneficiary` to an empty value clears out any override so that block rewards go to the block producer rather than a global override address.

    :::

3. Restart all nodes in the network using the updated genesis file.
