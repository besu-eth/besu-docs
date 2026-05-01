---
title: Attestations
sidebar_position: 1
description: Proof of stake attestations
---

# Attestations

Ethereum's move to [proof of stake consensus](./index.md) has brought many changes to the way the network operates. An important aspect of proof of stake is the need for validators to provide attestations in a timely and accurate manner. However, missed attestations have become a common occurrence among validators, leading to a loss of rewards and earnings. This page explores the context behind missing attestations.

## What are attestations?

Every epoch (6.4 minutes), a validator proposes an attestation to the network. The attestation is for a specific slot (every 12 seconds) in the epoch. The attestation votes in favor of the validator's view of the chain, in particular, the most recent justified block and the first block in the current epoch (known as _source_ and _target_ checkpoints). This information is collected for all participating validators, enabling the network to reach consensus about the state of the blockchain.

Honest nodes have 1/3 \* `SECONDS_PER_SLOT` (4 seconds) from the start of the slot to either receive the block or decide there was no block produced and attest to an “empty” or “skip” slot. Once this time has elapsed, attesters should broadcast their attestation reflecting their local view of the chain.

See the [official specification](https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/validator.md#attesting) for more information about attestations.

## Attestation rewards

Around 85% of validators' rewards come from making attestations. Although committee and slot assignments for attesting are randomized, every active validator will be selected to make exactly one attestation each epoch.

Attestations receive rewards only if they're included in Beacon Chain blocks. An attestation contains three votes. Each vote is eligible for a reward, subject to the following conditions:

- Getting attestations included with the correct source checkpoint within 5 slots
- Getting attestations included with the correct target checkpoint within 32 slots
- Getting attestations included with the correct head within 1 slot immediately

Each of these duties carries a reward rate, a portion of the entire "weight denominator," or the sum of weighted rewards for each attestation. The remaining weights relate to participating in sync committees and proposing blocks (excluding any tips/MEV, the bulk of block rewards). The following table (from [Upgrading Ethereum](https://eth2book.info/bellatrix/part2/incentives/rewards/)) breaks down these weights for cumulative rewards:

| Name                   | Percentage | Value        |
| ---------------------- | ---------- | ------------ |
| `TIMELY_SOURCE_WEIGHT` | 21.9%      | `uint64(14)` |
| `TIMELY_TARGET_WEIGHT` | 40.6%      | `uint64(26)` |
| `TIMELY_HEAD_WEIGHT`   | 21.9%      | `uint64(14)` |
| `SYNC_REWARD_WEIGHT`   | 3.1%       | `uint64(2)`  |
| `PROPOSER_WEIGHT`      | 12.5%      | `uint64(8)`  |
| `WEIGHT_DENOMINATOR`   | 100%       | `uint64(64)` |

## Incorrect attestations

If you have attestations with incorrect head votes, your node might be experiencing slow block imports. However, block producers can also be slow to publish blocks, resulting in a majority of validators getting the head vote wrong. A \<100% head vote doesn't necessarily imply a problem with your node.

In case of a slowdown, identify whether the issue is with the beacon node or the execution client. Block timing logs can be helpful in determining this.

If you're using [Teku](https://docs.teku.consensys.net/) as a consensus layer client, identify late blocks (the block didn't get to Teku in time) with the following kind of log:

```bash
Late Block Import *** Block: c2b911533a8f8d5e699d1a334e0576d2b9aa4caa726bde8b827548b579b47c68 (4765916) proposer 6230 arrival 3475ms, pre-state_retrieved +5ms, processed +185ms, execution_payload_result_received +1436ms, begin_importing +0ms, transaction_prepared +0ms, transaction_committed +0ms, completed +21ms
```

The time of arrival indicates how much time elapsed after the start of the slot before your node received the block. In this example, the block arrived after 3475ms, which is slower than optimal, but still enough time for Teku to create an attestation 4 seconds into the slot.

Typically, delayed arrivals occur when the block producer is slow in generating the block. It's also possible that the block was published on time but took longer to propagate to your node through peer-to-peer gossip. If delayed arrivals are a recurring issue, it might be a problem with your node, such as an incorrect system clock, network issues, or a reduction in the number of peers.

## Conclusion

Attestations are complicated. Rewards can be impacted by:

- The contents of a block (how long it takes to compute).
- The hardware processing that block (execution speed).
- How long it takes for the block to arrive to Besu from the consensus layer.
- The arrival time of the block from other consensus layer peers. Besu and your consensus layer client have no control over how late into a slot they receive blocks.
- General network latency.
- The status of either Besu or the consensus layer client.

[Monitoring](../../how-to/monitor/index.md) your validator carefully for uptime, execution speed, and a valid consensus layer connection will help you explore attestation performance for your node.

## References

- [Upgrading Ethereum](https://eth2book.info/bellatrix/part2/incentives/rewards/)
- [Understanding Attestation Misses](https://www.symphonious.net/2022/09/25/understanding-attestation-misses/)
- [Block production in Ethereum after the Merge](https://notes.ethereum.org/DaWh-02HQ4qftum1xdphkg?view#Broadcast-attestation)
- [Ethereum Consensus Specs](https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/validator.md#attesting)
