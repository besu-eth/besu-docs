---
title: Developer Quickstart with Privacy
sidebar_position: 2
description: Rapidly generate a local blockchain network with privacy using the Quickstart.
toc_max_heading_level: 3
---

import TestAccounts from '../../global/test_accounts.md';

import Postman from '../../global/postman.md';

# Developer Quickstart with Privacy

The Besu Developer Quickstart generates a local private [QBFT](../how-to/configure/consensus/qbft.md) network of Besu nodes and privacy with
[LFDT Paladin](https://www.lfdecentralizedtrust.org/projects/paladin); all managed by Docker Compose.
Use this tutorial to create a development network, use privacy in multiple forms, send JSON-RPC requests, view blocks and transactions, monitor nodes
and test a transaction from MetaMask.

:::caution

This tutorial runs a private network suitable for education or demonstration purposes and is not intended for running production 
networks.

:::

The generated private network includes four validators, one non-validator RPC node, three member nodes (besu paired with paladin) and monitoring services.
You can optionally enable Chainlens Explorer and OpenTelemetry (OTel) when you generate the network.

## Privacy with Paladin

[Paladin](https://lfdt-paladin.github.io/paladin/head/architecture/overview/) supports three privacy domains, each with a different trust model and privacy mechanism. This quickstart deploys all three so you can test each.

### Overview

**Pente** is a _privacy group_ and the most similar to Consensys Tessera. It is a domain where a subset of nodes share an encrypted EVM environment. Members
of the group can deploy and call Solidity contracts whose state is invisible to non-members. Transactions are submitted by any group member and executed
privately; only an encrypted state root lands on the public chain.

- **Who can see the state?** Only nodes that are members of the privacy group.
- **Who signs?** The submitting node. Other group members endorse the EVM execution.
- **Third-party trust required?** No — the group collectively holds the state.
- **Use when:** You need private business logic (confidential contracts, private DeFi, multi-party workflows that need compute, not just value transfer).

**Noto** is a _private token ledger_ backed by a designated notary. Every transfer must be co-signed by the notary, who has full visibility into all
balances and transfers. Non-participants cannot see amounts, but the notary always can.

- **Who can see balances?** The notary sees everything. Each participant sees only their own transactions.
- **Who signs?** The sender submits; the notary automatically co-signs (in `notaryMode: basic`).
- **Third-party trust required?** Yes — you are trusting the notary to act honestly and not front-run transfers.
- **Use when:** You need a regulated token where an issuer or custodian must maintain auditability (CBDC, tokenised securities, supply-chain tokens with
compliance requirements).

**Zeto** is a _privacy-preserving token using ZK-SNARKs_. Each transfer is accompanied by a cryptographic proof that the sender owned the funds and the amounts
are consistent — without revealing what those amounts are. No third party is required; the math enforces correctness.

- **Who can see balances?** Only the sender and receiver of each transaction. On-chain observers see only UTXO hashes and proofs.
- **Who signs?** The sender's Paladin node generates and submits the ZK proof. No co-signer needed.
- **Third-party trust required?** No — validity is guaranteed by the proof, not by a trusted party.
- **ZK proofs:** Generated server-side inside `libzeto.so` using WASM-compiled Groth16 circuits bundled in the Docker image. No ZK tooling is needed on your machine.
- **Use when:** You need the strongest privacy guarantees with no trusted intermediary (interbank settlement, privacy-first payment rails).

### Comparison table

| | Pente | Noto | Zeto |
|---|---|---|---|
| **Privacy mechanism** | Encrypted EVM state | UTXO hashes, notary co-signs | UTXO hashes + Groth16 ZK proof |
| **Who can see amounts** | Group members only | Notary sees all; participants see own txns | Sender and receiver only |
| **Who must sign** | Submitting node | Sender + notary (automatic in basic mode) | Sender only (proof substitutes co-signer) |
| **Trusted third party** | No | Yes (notary) | No |
| **Smart contract support** | Yes (private EVM) | No | No |
| **Token transfers** | No (compute, not value) | Yes | Yes |
| **Double-spend protection** | EVM state | Notary enforces UTXO rules | Nullifiers (`Zeto_AnonNullifier`) or none (`Zeto_Anon`) |
| **Proof of validity** | EVM re-execution by members | Notary signature | Cryptographic (Groth16 SNARK) |
| **First-tx latency** | ~seconds | ~seconds | 3-5 min (WASM warm-up in Docker/WSL2) |
| **Production latency** | ~seconds | ~seconds | < 30s (native binaries, dedicated CPU) |
| **Best for** | Private business logic | Regulated tokens with oversight | Maximum privacy, no trusted party |

#### Before you start 

##### ZK proof performance

Zeto ZK proof generation is the slowest part of this quickstart. The proofs are computed by the Paladin container using WASM-compiled Groth16 circuits
bundled at `/app/domains/zeto/zkp/` inside the image. WASM JIT is 10-50× slower than native code, and proof times depend heavily on your runtime environment.

##### Expected times by setup

| Setup | First proof (WASM cold start) | Subsequent proofs |
|---|---|---|
| Docker Desktop + WSL2 (default limits) | 10+ minutes | 3-5 minutes |
| Docker Desktop + WSL2 (tuned limits) | 3-5 minutes | 1-2 minutes |
| Docker native in WSL2 (no Desktop) | 2-4 minutes | 30s-1min |
| Native Linux (bare metal or VM) | 30-60 seconds | 10-30 seconds |

**The warm-up only happens once per `docker compose up`.** After the first proof the WASM circuit instance stays loaded in the Paladin process. Subsequent proofs reuse it and are noticeably faster. A `docker compose down` restarts the process and resets the timer.


## Prerequisites

- [Docker and Docker Compose](https://docs.docker.com/compose/install/) v2 or later
- [Node.js](https://nodejs.org/en/download/) or [Yarn](https://yarnpkg.com/cli/node)
- [curl](https://curl.haxx.se/download.html)
- [MetaMask](https://metamask.io/)

:::info

Allow Docker to use up to 16 GB of memory for the private network.
On Windows, use Windows 11 with WSL2 kernel 6.6 or later.
You can use Docker Desktop or Docker Engine with the Compose plugin in the WSL2 environment.

:::

### Native Linux / WSL2 without Docker Desktop

If you are running Docker directly inside WSL2 (i.e. the Docker daemon is installed in the WSL2 distro itself, not via Docker Desktop), you only
need to tune the WSL2 VM resource allocation. WSL2 is still a Hyper-V lightweight VM and defaults cap CPU well below your physical core count.

Create or edit `%USERPROFILE%\.wslconfig` on the Windows host (e.g. `C:\Users\YourName\.wslconfig`):

```ini
[wsl2]
processors=8      # physical cores to expose to the WSL2 VM (up to your machine's core count)
memory=16GB       # RAM for the VM — aim for at least 8 GB for comfortable Zeto proof generation
swap=0            # optional: disable swap to avoid latency spikes during proof generation
```

Apply by restarting the VM from PowerShell:

```powershell
wsl --shutdown
```

Then reopen your WSL2 terminal. The change takes effect immediately on next WSL2 start.

If you are on **native Linux** (not WSL2 at all), no tuning is needed — Docker runs directly on the host kernel and proof times are in the 30-60s range.

### Docker Desktop + WSL2

If you are using Docker Desktop with the WSL2 backend you have two resource caps to raise:

**1. Set WSL2 VM limits** — same `.wslconfig` as above.

**2. Match Docker Desktop's own cap** — Docker Desktop has a separate CPU/memory limit that overrides the WSL2 allocation if it is lower. Open
Docker Desktop → **Settings** → **Resources** and set CPUs and Memory to match what you put in `.wslconfig`, then click **Apply & Restart**.

Without step 2, Docker Desktop silently ignores the extra WSL2 resources and you get no benefit.

## Steps

### 1. Generate the private network files

Run the Developer Quickstart.
The quickstart generates a folder (`./besu-test-network` by default) with the Docker Compose files, scripts, and Besu configuration in it.

```bash
npx @consensys-software/besu-dev-quickstart
```

When prompted, select the following options:

| Prompt                               | Selection             |
| ------------------------------------ | --------------------- |
| Network type                         | **Private**           |
| Add privacy (using paladin) to the network? | **Y**          |
| Add OTel Collector spans to Grafana? | **N**                 |
| Enable Chainlens Explorer?           | **Y**                 |
| Config files directory               | `./besu-test-network` |

To skip the prompts, run:

```bash
npx @consensys-software/besu-dev-quickstart --networkType private --outputPath ./besu-test-network --privacy true --otel false --chainlens true
```

### 2. Start the network

Go to the generated directory and start the containers:

```bash
cd besu-test-network
./run.sh
```

The script builds the Docker images and starts the network.
The private network contains four QBFT validators named `validator1` through `validator4`, one non-validator node named `rpcnode`, three members 

When startup finishes, the script lists the available endpoints:

```log title="Services list"
*************************************
Besu Dev Quickstart
*************************************
----------------------------------
List endpoints and services
----------------------------------
JSON-RPC HTTP service endpoint        : http://localhost:8545
JSON-RPC WebSocket service endpoint   : ws://localhost:8546
Prometheus address                    : http://localhost:9090/graph
Grafana metrics                       : http://localhost:3000/d/XE4V0WGZz/besu-overview?orgId=1&refresh=10s&from=now-30m&to=now&var-system=All
Grafana logs                          : http://localhost:3000/a/grafana-lokiexplore-app/explore
Chainlens Explorer (if selected)      : http://localhost:8081/dashboard

For more information on the endpoints and services, refer to README.md in the installation directory.
****************************************************************
```

Use the endpoints as follows:

- Use the JSON-RPC HTTP endpoint to send requests to `rpcnode`.
- Use the JSON-RPC WebSocket endpoint for WebSocket subscriptions.
- Use Prometheus and Grafana to monitor node metrics.
- Use Grafana logs to view Besu logs in Loki.
- Use Chainlens Explorer to inspect blocks and transactions if you enabled it.

To display the list of endpoints again, run:

```bash
./list.sh
```

You now have a running private Besu network.

### 3. Run JSON-RPC requests

Send JSON-RPC requests to `http://localhost:8545`.
You can also use `ws://localhost:8546` for WebSocket connections.

This tutorial uses [curl](https://curl.haxx.se/download.html) to send JSON-RPC requests over HTTP.

#### Request the node version

Run the following command from the host shell:

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' http://localhost:8545/ -H "Content-Type: application/json"
```

The result displays the client version of the running node:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "besu/v26.2.0/linux-aarch_64/openjdk-java-21"
}
```

The exact version, architecture, and Java runtime can differ depending on the Besu image used by your generated network.
Successfully calling this method shows that you can connect to the network using JSON-RPC over HTTP.

#### Count the peers

Peers are the other nodes connected to the node receiving the JSON-RPC request.
Poll the peer count using [`net_peerCount`](../../public-networks/reference/api/index.md#net_peercount):

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' http://localhost:8545/ -H "Content-Type: application/json"
```

The result indicates that `rpcnode` has seven peers:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x7"
}
```

#### Request the most recent block number

Call [`eth_blockNumber`](../../public-networks/reference/api/index.md#eth_blocknumber) to retrieve the highest block number on `rpcnode`:

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545/ -H "Content-Type: application/json"
```

The result indicates the highest block number synchronized on this node:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x2a"
}
```

The hexadecimal value `0x2a` translates to `42`, the number of blocks received by the node so far.

### 4. Paladin Bootstrap

Paladin is a multi-node system, and the nodes need a shared on-chain coordination point for each privacy domain. The factory is that coordination point.
Paladin's whole job is to keep private state off-chain — in each node's encrypted private database. But the public chain still needs to know something is
happening, otherwise double-spends are possible, state roots can't be anchored, and nodes have no way to discover that a new token or privacy group exists.

For example when node A wants to create a Noto token, or form a Pente privacy group, it needs to publish something on-chain. _But what address does it publish to?_
And how do nodes B and C know to look for it? The factory is the answer. It is a known, static address — hardcoded in every `paladin*.yaml` — that acts as a **shared
registry.** When node A calls the factory to deploy a new token instance, the factory emits an on-chain event. Nodes B and C are watching that factory address
and see the event. Discovery is solved without any out-of-band coordination.

Each domain has its own factory (& contract). **Before any Paladin node starts, three factory contracts must be deployed to the chain — one per privacy domain.**

The quickstart bootstrap is designed for a fresh chain where the rpcnode deployer account starts at _nonce=0_, producing **deterministic addresses that are pre-hardcoded
in the YAML files**. 

**On an existing network the deployer account will have a non-zero nonce, so addresses will differ — you must collect the printed addresses and configure each Paladin
node manually.**

After the network is up (ie the validators) a paladin bootstrap container runs and creates these factory contracts. **Pente is deployed first** because its factory
address derives from nonce=0 of the deployer account. The `CREATE` opcode computes the contract address as `keccak256(rlp([sender, nonce]))[12:]`, so the very first
transaction from the `rpcnode` always produces `0xBca0fDc68d9b21b5bfB16D784389807017B2bbbc`. This address is pre-hardcoded into all three `paladin*.yaml` files.

**If anything else were deployed before Pente, it would consume nonce=0 and push the factory to a different address, breaking the config.**

To examine this code please see the `smart_contracts/paladin_bootstrap/deploy_*.ts` files of the quickstart. We deploy in the order of pente -> noto -> zeto.

Also refer to `config/paladin/README.md` for more details on how paladin works and is used in the quickstart.

When the container has finished, the logs should resemble the following:

```bash

> besu-paladin-smart-contracts@1.0.0 precompile
> node scripts/paladin_bootstrap/get_abis.mjs

Fetching Paladin ABIs (v1.0.0)...
  ✓ PenteFactory.json
  ✓ NotoFactory.json
  ✓ Noto.json
  ✓ ZetoFactory.json
Fetching Zeto contracts (v0.2.0)...
  ✓ Zeto_Anon.json
  ✓ Groth16Verifier_Deposit.json
  ✓ Groth16Verifier_Withdraw.json
  ✓ Groth16Verifier_WithdrawBatch.json
  ✓ Groth16Verifier_Anon.json
  ✓ Groth16Verifier_AnonBatch.json

> besu-paladin-smart-contracts@1.0.0 compile
> hardhat compile

Downloading compiler 0.8.27
Downloading compiler 0.8.27
Generating typings for: 11 artifacts in dir: typechain-types for target: ethers-v6
Successfully generated 38 typings!
Compiled 12 Solidity files successfully (evm target: paris).
Deploying PenteFactory from account: 0xC9C913c8c3C1Cd416d80A0abF475db2062F161f6

PenteFactory deployed at: 0xBca0fDc68d9b21b5bfB16D784389807017B2bbbc

Add this to each paladin*.yaml under domains.pente:
    registryAddress: "0xBca0fDc68d9b21b5bfB16D784389807017B2bbbc"
Deploying NotoFactory from account: 0xC9C913c8c3C1Cd416d80A0abF475db2062F161f6
Current nonce: 1

1. Noto implementation:    0x9A8ea6736DF00Af70D1cD70b1Daf3619C8c0D7F4
2. NotoFactory logic:       0xeB35B7bA819DAD84E60752c357d45e5ce41D85c5
3. NotoFactory proxy:       0x9393486896D3ae612B4939afAF2C367Df17CC39B

Add to each paladin*.yaml under domains.noto:
    registryAddress: "0x9393486896D3ae612B4939afAF2C367Df17CC39B"
Deploying ZetoFactory from account: 0xC9C913c8c3C1Cd416d80A0abF475db2062F161f6
Current nonce: 4

1. ZetoFactory logic:          0x1ADB4e782226cf66FF065FDF2D52B1ee7D831A64
2. ZetoFactory proxy:           0x49f8866d90ffDa8B12AC5677966e963acEc6d80E  ← registryAddress
   3. Groth16Verifier_Deposit    : 0x6410E8e6321f46B7A34B9Ea9649a4c84563d8045
   4. Groth16Verifier_Withdraw   : 0x6468751F5D94540338058254D8F9BD1AcEa498Fe
   5. Groth16Verifier_WithdrawBatch: 0x9b3241A4050670aC6598381501953911555dC53E
   6. Groth16Verifier_Anon       : 0x0C66Ce3b115507fFFF6eDC75116044675ABbc2c1
   7. Groth16Verifier_AnonBatch  : 0xBe5e64248757D402a596c0C5A7742ccAdA270aeC
8. Zeto_Anon implementation:   0x836114F71F13321808D9CAd370D1f5c5158f09cE
9. registerImplementation("Zeto_Anon") ✓

Add to each paladin*.yaml under domains.zeto:
    registryAddress: "0x49f8866d90ffDa8B12AC5677966e963acEc6d80E"

```

### 5 Paladin Pente - Privacy Groups

Pente is also the simplest domain: a single self-contained contract, one transaction, no proxy pattern, no initialization arguments. 

Run the privacy example between `member1` to `member2` by creating a privacy group and then deploys the `SimpleStorage` contract, does a read and write operation and then 
requests the value from all three members. `member1` and `member2` respond correctly, `member3` however throws an error as it was not part of the privacy group

```bash
cd smart_contracts
npm i
npm run pente-tx
```

which results in 

```bash

> besu-paladin-smart-contracts@1.0.0 pente-tx
> ts-node scripts/privacy/pente_tx.ts

=== PRIVATE CONTRACT DEMO (Paladin / Pente) ===

member1 key: member@paladin1
member2 key: member@paladin2
member3 key: outsider@paladin3 (excluded from group)

1. Creating Pente privacy group for member1 + member2 ...
  Privacy group address: 0x57a0aa749dc96523441563f5c4a50ec77fc89e70

2. Deploying SimpleStorage privately (initVal=47) ...
  Private contract address: 0x82dd7e78ec835a1db64bb3c434f01f9af03ec7cf

3. Reading constructor-initialized value from member1 ...
  member1 get() => 47 (expected: 47)

4. Setting value to 123 from member1 ...
  set(123) mined

5. Verifying privacy: reading from member1, member2, member3 ...
  member1 get() => 123 (expected: 123) ✓
  member2 get() => 123 (expected: 123) ✓
  Attempting member3 read (not in privacy group) ...
JSON-RPC error from pgroup_call (200 OK) PD012502: Privacy group '0xa0004eccd032092fc41176255b0d2f5a8eed08f636104fecf53e377e388d12c5' not found
  member3 correctly denied — "PD012502: Privacy group '0xa0004eccd032092fc41176255b0d2f5a8eed08f636104fecf53e377e388d12c5' not found" ✓

=== DONE ===

```

### 6 Paladin Noto - Notazized Tokens

Noto is second. With Pente having consumed nonce=0, the three Noto contracts land at deterministic addresses that are also pre-hardcoded in the YAML files. The proxy at nonce=3 — `0x9393486896D3ae612B4939afAF2C367Df17CC39B` — is the `registryAddress` Paladin nodes use to deploy and look up Noto token instances.
Noto uses NotoFactory V2, which is UUPS upgradeable. Unlike Pente's V0 self-contained contract, an upgradeable factory separates the business logic from a stable proxy address so the implementation can be swapped without invalidating existing token deployments. This requires three sequential steps:

With this example `member 1` is the notary. With `notaryMode: "basic"` only the notary can mint tokens - please see the paladin docs on `notaryMode: "hooks"` if you want other members
to have the ability to mint tokens. In this example, `member1` mints 2000 tokens and then transfers 1000 to `member2` which in turn sends 800 to `member3`. Each of these transfers needs
the notary i.e., `member1` to co-sign them (every token operation in fact).

Lastly it reads the final balances of all three members.

```bash
cd smart_contracts
npm i
npm run noto-tx
```

which results in 

```bash

> besu-paladin-smart-contracts@1.0.0 noto-tx
> ts-node scripts/privacy/noto_tx.ts

=== NOTARIZED TOKEN DEMO (Paladin / Noto) ===

member1 (notary): member@paladin1
member2:          member@paladin2
member3:          member@paladin3

1. Deploying Noto token (member1 = notary, notaryMode = basic) ...
  Token address: 0x3fdb4bb84d78fd695e83a4dbd5d558e1971ac904

2. Minting 2000 tokens to member1 ...
  member1 balance: 2000 (expected: 2000) ✓

3. Transferring 1000 from member1 → member2 ...
  member2 balance: 1000 (expected: 1000) ✓

4. Transferring 800 from member2 → member3 ...

5. Final balances:
  member1: 1000 (expected: 1000) ✓
  member2: 200 (expected: 200) ✓
  member3: 800 (expected: 800) ✓

=== DONE ===
```

### 7 Paladin Zeto - ZK Snark Private Tokens

Zeto ZK proof generation is the slowest part of this quickstart. The proofs are computed by the Paladin container using WASM-compiled Groth16 circuits
bundled at `/app/domains/zeto/zkp/` inside the image. WASM JIT is 10-50× slower than native code, and proof times depend heavily on your runtime environment.

Zeto is deployed last because it requires the most on-chain setup. Starting at nonce=4, the bootstrap runs nine steps: a UUPS proxy deployment (two contracts), five Groth16 verifier contracts, the Zeto_Anon token implementation, and a final `registerImplementation` call that ties them together. The ZetoFactory proxy at nonce=5 is the `registryAddress` hardcoded in the YAML files; all other addresses support it.

The five `Groth16Verifier_*` contracts are the key difference from Noto. **Zeto does not rely on a trusted notary — instead, on-chain Solidity contracts verify each ZK proof independently.** Every mint and transfer is accompanied by a Groth16 proof that the chain verifies before accepting the transaction. This means no off-chain coordinator is needed; correctness is enforced by math, not by trust.

This quickstart uses `Zeto_Anon` for simplicity, but Paladin supports richer Zeto variants. Please refer to the [paladin documentation](https://lfdt-paladin.github.io/paladin/head/architecture/zeto/) for that.

```bash
cd smart_contracts
npm i
npm run zeto-tx
```

which results in 

```bash

> besu-paladin-smart-contracts@1.0.0 zeto-tx
> ts-node scripts/privacy/zeto_tx.ts

=== ZK TOKEN DEMO (Paladin / Zeto_Anon) ===

Zeto_Anon is an anonymous token where amounts and balances are hidden from
on-chain observers using ZK-SNARKs. Unlike Noto (which relies on a trusted
notary), Zeto uses cryptographic proofs — no third party sees your balance.

member1: member@paladin1
member2: member@paladin2
member3: member@paladin3

1. Deploying Zeto_Anon token ...
   The ZetoFactory proxy creates a new token instance on-chain.
   No ZK proof required for deployment.
   Token address: 0x8e2fcc765a0a101451d199417f02a3501f911082

2. Minting 1000 tokens to member1 ...
   [ZK proof] circuit: 'deposit', submitter: member@paladin1
   Paladin is generating a Groth16 SNARK proof server-side inside libzeto.so.
   No ZK tooling is needed on your machine — the circuits are bundled in the Docker image.
   Expected time: 3-5 min first proof (WASM cold start in Docker/WSL2),
                  30s-2min for subsequent proofs (WASM instance stays loaded).
   On production hardware with native binaries this typically takes < 30s.
   Waiting for on-chain confirmation...
   member1 balance: 1000 (expected: 1000) ✓

3. Transferring 400 from member1 → member2 ...
   [ZK proof] circuit: 'anon', submitter: member@paladin1 → member@paladin2
   Paladin is generating a Groth16 SNARK proof server-side inside libzeto.so.
   No ZK tooling is needed on your machine — the circuits are bundled in the Docker image.
   Expected time: 3-5 min first proof (WASM cold start in Docker/WSL2),
                  30s-2min for subsequent proofs (WASM instance stays loaded).
   On production hardware with native binaries this typically takes < 30s.
   Waiting for on-chain confirmation...
   member2 balance: 400 (expected: 400) ✓

4. Transferring 300 from member2 → member3 ...
   WASM circuit is already loaded — this proof should be faster than the first.
   [ZK proof] circuit: 'anon', submitter: member@paladin2 → member@paladin3
   Paladin is generating a Groth16 SNARK proof server-side inside libzeto.so.
   No ZK tooling is needed on your machine — the circuits are bundled in the Docker image.
   Expected time: 3-5 min first proof (WASM cold start in Docker/WSL2),
                  30s-2min for subsequent proofs (WASM instance stays loaded).
   On production hardware with native binaries this typically takes < 30s.
   Waiting for on-chain confirmation...

5. Final balances:
   Each node queries its own private state — only states you own are visible to you.
   member1: 600 (expected: 600) ✓
   member2: 100 (expected: 100) ✓
   member3: 300 (expected: 300) ✓

=== DONE ===

```

### 7. View the network in Chainlens

If you enabled Chainlens when generating the network, open `http://localhost:8081/dashboard` in your browser.

Chainlens connects to `rpcnode` and displays network activity, blocks, and transactions.
If the dashboard is empty at first, wait for the ingestion service to index the latest blocks, then refresh the page.

To add Chainlens after generating the network, generate a new quickstart directory with `--chainlens true`.
The Developer Quickstart adds the Chainlens services to the generated Docker Compose file at generation time.

### 8. Monitor nodes with Prometheus, Grafana, and Loki

The Developer Quickstart starts Prometheus, Grafana, Loki, and Grafana Alloy with the private network.
Use these services to inspect node metrics and logs.

- Open `http://localhost:9090/graph` to query metrics in Prometheus.
- Open the Grafana metrics URL listed by `./list.sh` to view the Besu overview dashboard.
- Open the Grafana logs URL listed by `./list.sh` to view logs from Loki.

If you generated the network with `--otel true`, the Developer Quickstart also includes an OTel Collector and Tempo.
Use Grafana to inspect the additional tracing data.

Learn more about how to [monitor metrics](../../public-networks/how-to/monitor/metrics.md).

### 9. Send a transaction with MetaMask

Connect MetaMask to the local JSON-RPC endpoint and send a transaction between the prefunded test accounts.

#### Import test accounts

Import two of the following test accounts into MetaMask.
These accounts are already funded in the generated genesis file.

<TestAccounts />

#### Add the network

In MetaMask, add a custom network with the following values:

| Field           | Value                   |
| --------------- | ----------------------- |
| Network name    | `Besu Dev Quickstart`   |
| RPC URL         | `http://localhost:8545` |
| Chain ID        | `1337`                  |
| Currency symbol | `ETH`                   |

#### Send the transaction

From one imported test account, send a small amount of ETH to another imported test account.
The private network has zero gas price configured, so the transaction doesn't require a gas fee.

After MetaMask confirms the transaction, copy the transaction hash.
If Chainlens is enabled, search for the transaction hash in `http://localhost:8081/dashboard`.

### 10. Stop and restart the network

Stop the containers without deleting the chain data:

```bash
./stop.sh
```

Restart the containers with the existing data:

```bash
./resume.sh
```

### 11. Remove the network

Stop the containers and remove the generated container volumes:

```bash
./remove.sh
```

The command doesn't delete the generated files in `besu-test-network`.

### 12. Add a non-validator node

You can add a non-validator Besu node to the private network by generating node keys, adding a Docker Compose service, and allowing the node in the network configuration.
To add a validator instead, use the [QBFT validator voting process](../how-to/configure/consensus/qbft.md#add-and-remove-validators) after the node is running.

#### Generate node keys

From the `besu-test-network` directory, generate the node details:

```bash
cd extra
npm install
node generate_node_details.js --password "Password"
```

The script writes the following files:

- `nodekey`
- `nodekey.pub`
- `address`
- `accountKeystore`
- `accountPrivateKey`
- `accountPassword`


Create a directory for the new node and copy the files:

```bash
cd ..
mkdir -p config/nodes/node5
cp extra/nodekey extra/nodekey.pub extra/accountKeystore extra/accountPassword config/nodes/node5/
```

#### Add the Docker Compose service

In `docker-compose.yml`, add a service for `node5`.
Use an unused IP address in the `besu-dev-quickstart` subnet:

```yaml
  node5:
    << : *besu-def
    container_name: node5
    environment:
      - OTEL_RESOURCE_ATTRIBUTES=service.name=node5,service.version=${BESU_VERSION:-latest}
    volumes:
      - ./config/besu/:/config
      - ./config/nodes/node5:/opt/besu/keys
      - ./logs/besu:/tmp/besu
    depends_on:
      - validator1
    ports:
      - 21005:8545/tcp
      - 30303
      - 9545
    networks:
      besu-dev-quickstart:
        ipv4_address: 172.16.239.16
```

#### Allow and discover the node

Create the enode URL for the new node using the contents of `config/nodes/node5/nodekey.pub`:

```text
enode://<nodekey.pub>@172.16.239.16:30303
```

Add the enode URL to `config/besu/permissions_config.toml`.
Also add it to `config/besu/static-nodes.json` so existing nodes discover it when they restart.

#### Add the node to Prometheus

In `config/prometheus/prometheus.yml`, add a scrape job for `node5`:

```yaml
- job_name: "node5"
  metrics_path: /metrics
  scheme: http
  static_configs:
    - targets: [node5:9545]
```

#### Restart the network

Restart the network for the updated Docker Compose and Besu configuration files to take effect:

```bash
./stop.sh
./resume.sh
```

After the containers start, confirm that `node5` appears in Docker and that the peer count has increased:

```bash
docker compose ps node5
curl -X POST --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' http://localhost:8545/ -H "Content-Type: application/json"
```

## Next steps

- [Configure QBFT consensus](../how-to/configure/consensus/qbft.md).
- [Configure local permissioning](../how-to/use-local-permissioning.md).
- [Deploy and interact with smart contracts](./contracts/interact.md).
- [Monitor Besu metrics](/public-networks/how-to/monitor/metrics).

