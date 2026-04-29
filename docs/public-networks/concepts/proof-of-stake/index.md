---
description: Ethereum proof of stake consensus
---

# Proof of stake consensus

[The Merge](https://ethereum.org/en/upgrades/merge/) transitioned Ethereum Mainnet to [Proof of Stake
(PoS)](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/) consensus.

Under Ethereum's PoS, you must run a [full node](../node-clients.md#execution-and-consensus-clients) and
[stake 32 ETH](https://ethereum.org/en/staking/) to become a validator.

:::note
To operate a full node on Mainnet, you must run a beacon node, i.e. a consensus client and an execution client.
To become a validator, you must also run a validator client (either [in the same process as the
beacon node](https://docs.teku.consensys.net/get-started/start-teku#start-the-clients-in-a-single-process)
or [separately](https://docs.teku.consensys.net/get-started/start-teku#run-the-clients-separately)).
:::

PoS is preferred over Proof of Work and Proof of Authority as a consensus mechanism because it is
more secure, requires less energy, and lowers the barrier to entry.

The PoS mechanism randomly chooses validators to propose or validate blocks on the [Beacon
Chain](https://ethereum.org/en/upgrades/beacon-chain/) in defined time frames.

Proposers are responsible for proposing new consensus blocks, and non-proposing validators are
responsible for validating (attesting to) proposed blocks.
Validators earn [rewards](https://www.blocknative.com/ethereum-staking-calculator) for proposing and
attesting to consensus blocks eventually included in the Beacon Chain, and penalized for malicious behavior.
[Attestations](./attestations.md) make up the bulk of validator rewards (~85%).
Validators also receive transaction fees for included blocks.

Each consensus block contains an execution payload, which contains a list of transactions and other data required to execute and validate the payload.

When a node validates a consensus block, its [consensus client](../node-clients.md#consensus-clients) processes the block and sends the execution payload to the [execution client](../node-clients.md#execution-clients), which:

1. Assembles a block on the execution layer.
2. Verifies pre-conditions.
3. Executes transactions.
4. Verifies post-conditions.
5. Sends the validity result back to the consensus client.

If the block is valid, the execution client includes it in the execution chain and stores the new state in execution state storage.

If a consensus block receives attestations backed by enough staked ETH, the block is included in the Beacon Chain. In the case of competing chains, the chain with the highest number of validator votes is selected.
