---
title: Privacy with Paladin
sidebar_position: 2
description: Learn about the Paladin privacy domains, their trust models, and how factory contracts coordinate privacy on a Besu network.
keywords: [Paladin, privacy, Pente, Noto, Zeto, ZK-SNARKs, private network]
---

[Paladin](https://lfdt-paladin.github.io/paladin/head/architecture/overview/) is an open-source
privacy layer developed by the Linux Foundation Decentralized Trust (LFDT), separate from Besu.
It runs alongside each Besu node in a permissioned network, managing private state in each node's
encrypted local database and anchoring cryptographic commitments on the public chain.
This allows participants to share confidential business logic, private tokens, or regulated assets
without exposing that data to the rest of the network.

[Permissioning](./permissioning.md) controls which nodes and accounts can access the network.
Paladin controls what those permitted participants can see once they are on the network.
The two mechanisms are independent and can be used together.

Use Paladin when full on-chain visibility is unacceptable for your use case, for example when
sharing contract state between a subset of consortium members, issuing regulated tokens that
require auditor oversight, or settling assets with no trusted intermediary.

Paladin supports three privacy domains, each with a different trust model and privacy mechanism.
Choosing the right domain depends on what you need to keep private and how much you trust the
other parties involved.

## Privacy domains

In Paladin, a _domain_ is a pluggable runtime module that implements a specific privacy protocol.
Each domain has its own smart contracts, key management, and transaction lifecycle.
Paladin ships three built-in domains: Pente, Noto, and Zeto.

### Pente

Pente is a privacy group domain where a subset of nodes share an encrypted EVM environment.
Members can deploy and call Solidity contracts whose state is invisible to non-members.
Transactions are submitted by any group member and executed privately; only an encrypted state
root lands on the public chain.
No trusted third party is required; the group collectively holds the state, and other members
endorse each EVM execution.

Use Pente for private business logic: confidential contracts, private DeFi, and multi-party
workflows that need shared compute rather than just value transfer.

### Noto

Noto is a private token domain backed by a designated notary.
Every transfer must be co-signed by the notary, who has full visibility into all balances and
transfers; each participant sees only their own transactions.
The notary co-signs automatically in `notaryMode: basic`, which means you are trusting the notary
to act honestly and not front-run transfers.

Use Noto when an issuer or custodian must maintain full auditability over a token: regulated
assets such as CBDCs, tokenised securities, or supply-chain tokens with compliance requirements.

### Zeto

Zeto is a private token domain that uses zero-knowledge succinct non-interactive arguments of
knowledge (ZK-SNARKs).
Each transfer is accompanied by a cryptographic proof that the sender owned the funds and the
amounts are consistent, without revealing what those amounts are.
Proofs are generated server-side inside `libzeto.so` using WASM-compiled Groth16 circuits bundled
in the Docker image, so no ZK tooling is needed on your machine.
No trusted third party is required; validity is guaranteed by the proof, not by a co-signer.

Use Zeto when you need the strongest privacy guarantees with no trusted intermediary: interbank
settlement, privacy-first payment rails, or any use case where even the notary model is
unacceptable.

### Domain comparison

| | Pente | Noto | Zeto |
| -------------------------------- | ----------------------------- | ------------------------------------------- | ------------------------------------------------------- |
| **Privacy mechanism** | Encrypted EVM state | UTXO hashes, notary co-signs | UTXO hashes and Groth16 ZK proof |
| **Who can see amounts** | Group members only | Notary sees all; participants see own txns | Sender and receiver only |
| **Who must sign** | Submitting node | Sender and notary (automatic in basic mode) | Sender only (proof substitutes co-signer) |
| **Trusted third party** | No | Yes (notary) | No |
| **Smart contract support** | Yes (private EVM) | No | No |
| **Token transfers** | No (compute, not value) | Yes | Yes |
| **Double-spend protection** | EVM state | Notary enforces UTXO rules | Nullifiers (`Zeto_AnonNullifier`) or none (`Zeto_Anon`) |
| **Proof of validity** | EVM re-execution by members | Notary signature | Cryptographic (Groth16 SNARK) |
| **First transaction latency** | Seconds | Seconds | 3 to 5 minutes (WASM warm-up in Docker or WSL2) |
| **Production latency** | Seconds | Seconds | Under 30 seconds (native binaries) |
| **Best for** | Private business logic | Regulated tokens with oversight | Maximum privacy, no trusted party |

## Factory contracts

Paladin is a multi-node system, and the nodes need a shared on-chain coordination point for each
privacy domain.
That coordination point is a factory contract.
Paladin keeps private state off-chain, in each node's encrypted private database.
The public chain still needs to know something is happening; otherwise double-spends are possible,
state roots can't be anchored, and nodes have no way to discover that a new token or privacy group
exists.

When a node deploys a new token or forms a privacy group, it needs a known on-chain address to
publish to, and other nodes need to know where to look.
Each factory contract serves that purpose: it is a static address, hardcoded in each node's
configuration, that acts as a shared registry.
In Paladin configuration, that address is typically set as `registryAddress`.
Deploying a token or privacy group calls the factory contract, which emits an on-chain event that
all other Paladin nodes are watching.
This makes discovery automatic, with no out-of-band coordination required.

Each domain has its own factory contract, and all three must be deployed before any Paladin node
starts.

For details on factory contract deployment and configuration, see the
[Paladin architecture documentation](https://lfdt-paladin.github.io/paladin/head/architecture/overview/).

## Next steps

- Use the [Developer Quickstart with privacy](../tutorials/quickstart-with-privacy.md) to create a
  local network with all three privacy domains.
- Learn how [permissioning](./permissioning.md) controls node and account access on your network.
