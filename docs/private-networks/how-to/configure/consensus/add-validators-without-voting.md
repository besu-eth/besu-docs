---
title: Add and remove validators without voting
description: How to add or remove validators without voting
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Add and remove validators without voting

[QBFT](qbft.md) or [IBFT 2.0](ibft.md) network conditions might not allow voting to change validators. For example, if a majority of the current validators are no longer participating in the network, a vote to add or remove validators won't be successful. You can bypass voting and specify new validators using a transition in the genesis file.

:::caution

- In most cases, add or remove validators [by voting or smart contract for QBFT](qbft.md#add-and-remove-validators); or [by voting for IBFT 2.0](ibft.md#add-and-remove-validators). Use transitions only when voting isn't possible. Using transitions requires coordinating a rolling update of all the nodes in order to pick up the configuration at the correct block height. Using transitions also leaves the validator overrides permanently in your genesis configuration.
- Transitions are a Besu-specific feature. If you run a mixed-client QBFT network, you can't use transitions to change the validators.

:::

To add or remove validators without voting:

1.  In the genesis file, add the `transitions` configuration item where:

    - `<BlockNumber>` is the upcoming block at which to change validators.
    - `<ValidatorAddressX> ... <ValidatorAddressZ>` are strings representing the account addresses of the validators after `<BlockNumber>`.

    <Tabs>
    <TabItem value="QBFT syntax" label="QBFT syntax" default>

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4
        },
        "transitions": {
          "qbft": [
          {
            "block": <BlockNumber>,
            "validators": [
              <ValidatorAddressX>,
              ...
              <ValidatorAddressZ>
            ]
          }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    <TabItem value="QBFT example" label="QBFT example">

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4
        },
        "transitions": {
          "qbft": [
            {
            "block": 25,
            "validators": [
              "0x372a70ace72b02cc7f1757183f98c620254f9c8d",
              "0x9811ebc35d7b06b3fa8dc5809a1f9c52751e1deb"
              ]
            }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    <TabItem value="IBFT 2.0 syntax">

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
            "block": <BlockNumber>,
            "validators": [
              <ValidatorAddressX>,
              ...
              <ValidatorAddressZ>
            ]
          }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    <TabItem value="IBFT 2.0 example">

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
          "block": 25,
          "validators": [
            "0x372a70ace72b02cc7f1757183f98c620254f9c8d",
            "0x9811ebc35d7b06b3fa8dc5809a1f9c52751e1deb"
            ]
          }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    </Tabs>

2.  Restart all nodes in the network using the updated genesis file. You can make a rolling update of the nodes, as long as they're all up before the transition block is processed.
3.  To verify the changes after the transition block, call [`qbft_getValidatorsByBlockNumber`](../../../reference/api.md#qbft_getvalidatorsbyblocknumber) or [`ibft_getValidatorsByBlockNumber`](../../../reference/api.md#ibft_getvalidatorsbyblocknumber), specifying `latest`.

:::caution

Don't specify a transition block in the past.

Specifying a transition block in the past can result in unexpected behavior, such as causing the network to fork.

:::

## Override smart contract validators

When using [QBFT contract validator selection](qbft.md#add-and-remove-validators-using-a-smart-contract), if network conditions require it, you can bypass the smart contract and specify new validators in the genesis file. For example, you lose quorum for your current list of contract validators, and you can't perform a transaction to vote more in.

This requires temporarily [switching to block header validator selection mode](qbft.md#swap-validator-management-methods).

To bypass the smart contract and specify new validators:

1. In the genesis file, add a `transitions` configuration item where:

    - `<BlockNumber>` is the upcoming block at which to change validators.
    - `<SelectionMode>` is the validator selection mode to switch to. In this case we'll switch to the `blockheader` mode temporarily.
    - `<ValidatorAddressX> ... <ValidatorAddressZ>` are strings representing the account addresses of the validators after `<BlockNumber>`. These validators only need to be sufficient to progress the chain and allow a new contract to be deployed.

    <Tabs>
    <TabItem value="Syntax" label="Syntax" default>

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4,
          "validatorcontractaddress": "0x0000000000000000000000000000000000007777"
        },
        "transitions": {
          "qbft": [
          {
            "block": <BlockNumber>,
            "validatorselectionmode": <SelectionMode>,
            "validators": [
              <ValidatorAddressX>,
              ...
              <ValidatorAddressZ>
            ]
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
        "qbft": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4,
          "validatorcontractaddress": "0x0000000000000000000000000000000000007777"
        },
        "transitions": {
          "qbft": [
          {
            "block": 2555,
            "validatorselectionmode": "blockheader",
            "validators": [
              "0x372a70ace72b02cc7f1757183f98c620254f9c8d",
              "0x9811ebc35d7b06b3fa8dc5809a1f9c52751e1deb"
            ]
          }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    </Tabs>

2. Restart all nodes in the network using the updated genesis file. You can make a rolling update of the nodes, as long as they're all up before the transition block is processed.
3. Deploy a new contract to the blockchain containing the desired list of validators.
4. In the genesis file, add another `transitions` configuration item where:

    - `<BlockNumber>` is the upcoming block at which to change validators.
    - `<SelectionMode>` is the validator selection mode to switch to. In this case we'll switch to `contract` mode.
    - `<NewValidatorContractAddress>` is the address of the new smart contract.

    <Tabs>
    <TabItem value="Syntax" label="Syntax" default>

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4,
          “validatorcontractaddress”: “0x0000000000000000000000000000000000007777”
        },
        "transitions": {
          "qbft": [
          {
            "block": 2555,
            "validatorselectionmode": "blockheader",
            "validators": [
              "0x372a70ace72b02cc7f1757183f98c620254f9c8d",
              "0x9811ebc35d7b06b3fa8dc5809a1f9c52751e1deb"
              ]
            },
          {
            "block": <BlockNumber>,
            "validatorselectionmode": <SelectionMode>,
            "validatorcontractaddress": <NewValidatorContractAddress>
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
        "qbft": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4,
          "validatorcontractaddress": "0x0000000000000000000000000000000000007777"
        },
        "transitions": {
          "qbft": [
          {
            "block": 2555,
            "validatorselectionmode": "blockheader",
            "validators": [
              "0x372a70ace72b02cc7f1757183f98c620254f9c8d",
              "0x9811ebc35d7b06b3fa8dc5809a1f9c52751e1deb"
              ]
            },
          {
            "block": 2755,
            "validatorselectionmode": "contract",
            "validatorcontractaddress": "0x0000000000000000000000000000000000009999"
          }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    </Tabs>

5. Restart all nodes in the network using the updated genesis file. You can make a rolling update of the nodes, as long as they're all up before the transition block is processed.
