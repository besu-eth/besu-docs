---
title: Run Besu and Teku on a testnet
sidebar_position: 2
description: Run Besu and Teku on Ephemery , Hoodi or Sepolia testnet.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Run Besu and Teku on a testnet

Run Besu as an [execution client](../concepts/node-clients.md#execution-clients) and [Teku](https://docs.teku.consensys.net/) as a [consensus client](../concepts/node-clients.md#consensus-clients) on the [Hoodi](https://github.com/eth-clients/hoodi), [Ephemery](https://github.com/ephemery-testnet/ephemery-resources), and [Sepolia](https://github.com/eth-clients/sepolia) Ethereum testnets.

:::note

Sepolia is a permissioned network and you can't run a validator client on it without [requesting to become a validator](https://notes.ethereum.org/zvkfSmYnT0-uxwwEegbCqg) first. You can connect your consensus client using the beacon node only, without any validator duties.

:::

## 1. Install Besu and Teku

Install [Besu](../get-started/install/binary-distribution.md) and [Teku](https://docs.teku.consensys.net/HowTo/Get-Started/Installation-Options/Install-Binaries/).

Ensure you meet the prerequisites for the installation option you use. For example, you must have Java 21+ if using the Besu and Teku binary distributions.

Ensure you meet the [system requirements for Besu on public networks](../get-started/system-requirements.md).

## 2. Generate the shared secret

Run the following command:

```bash
openssl rand -hex 32 | tr -d "\n" > jwtsecret.hex
```

You will specify `jwtsecret.hex` when starting Besu and Teku. This is a shared JWT secret the clients use to authenticate each other when using the [Engine API](../how-to/use-engine-api.md).

## 3. Generate validator keys

If you're running Teku as a beacon node only, skip to the [next step](#4-start-besu).

If you're also running Teku as a validator client, create a test Ethereum address (you can do this in [MetaMask](https://support.metamask.io/configure/accounts/how-to-add-accounts-in-your-wallet/)). Fund this address with testnet ETH (32 ETH and gas fees for each validator) using a faucet. See the faucets for the relevant testnet:

- [Hoodi](https://github.com/eth-clients/hoodi)
- [Sepolia](https://github.com/eth-clients/sepolia)
- [Ephemery](https://ephemery-faucet.pk910.de/)

:::note

If you can't get ETH using the faucet, you can ask for help on the [EthStaker Discord](https://discord.com/invite/ethstaker).

:::

Generate validator keys for one or more validators using the [Hoodi Staking Launchpad](https://hoodi.launchpad.ethereum.org/), [Ephemery Staking Launchpad](https://launchpad.ephemery.dev/)
(or [request to become validator on Sepolia](https://notes.ethereum.org/zvkfSmYnT0-uxwwEegbCqg)).

:::info

Save the password you use to generate each key pair in a `.txt` file. You should also have a `.json` file for each validator key pair.

:::

## 4. Start Besu

Run the following command or specify the options in a [configuration file](../how-to/configure-besu/index.md):

<Tabs>

<TabItem value="Hoodi" label="Hoodi" default>

```bash
besu \
  --network=hoodi             \
  --rpc-http-enabled=true     \
  --rpc-http-cors-origins="*" \
  --rpc-ws-enabled=true       \
  --p2p-host=<your public IP> \
  --host-allowlist="*"        \
  --engine-host-allowlist="*" \
  --engine-rpc-enabled        \
  --engine-jwt-secret=<path to jwtsecret.hex>
```

</TabItem>

<TabItem value="Sepolia" label="Sepolia">

```bash
besu \
  --network=sepolia           \
  --rpc-http-enabled=true     \
  --rpc-http-cors-origins="*" \
  --rpc-ws-enabled=true       \
  --p2p-host=<your public IP> \  
  --host-allowlist="*"        \
  --engine-host-allowlist="*" \
  --engine-rpc-enabled        \
  --engine-jwt-secret=<path to jwtsecret.hex>
```

</TabItem>

<TabItem value="Ephemery" label="Ephemery" default>

```bash
besu \
  --network=ephemery           \
  --rpc-http-enabled=true     \
  --rpc-http-cors-origins="*" \
  --rpc-ws-enabled=true       \
  --p2p-host=<your public IP> \
  --host-allowlist="*"        \
  --engine-host-allowlist="*" \
  --engine-rpc-enabled        \
  --engine-jwt-secret=<path to jwtsecret.hex>
```

</TabItem>

</Tabs>

Specify the path to the `jwtsecret.hex` file generated in [step 2](#2-generate-the-shared-secret) using the [`--engine-jwt-secret`](../reference/cli/options.md#engine-jwt-secret) option.

You can modify the option values and add other [command line options](../reference/cli/options.md) as needed.

## 5. Start Teku

Open a new terminal window.

### Beacon node only

To run Teku as a beacon node only (without validator duties), run the following command or specify the options in the [Teku configuration file]:

<Tabs>

<TabItem value="Holesky" label="Holesky" default>

```bash
teku \
  --network=holesky                            \
  --ee-endpoint=http://localhost:8551          \
  --ee-jwt-secret-file=<path to jwtsecret.hex> \
  --metrics-enabled=true                       \
  --rest-api-enabled=true                      \
  --p2p-advertised-ip=<your public IP>         \  
  --checkpoint-sync-url=<checkpoint sync URL>
```

</TabItem>

<TabItem value="Sepolia" label="Sepolia">

```bash
teku \
  --network=sepolia                            \
  --ee-endpoint=http://localhost:8551          \
  --ee-jwt-secret-file=<path to jwtsecret.hex> \
  --metrics-enabled=true                       \
  --rest-api-enabled=true                      \
  --p2p-advertised-ip=<your public IP>         \  
  --checkpoint-sync-url=<checkpoint sync URL>
```

</TabItem>

<TabItem value="Ephemery" label="Ephemery" default>

```bash
teku \
  --network=ephemery                            \
  --ee-endpoint=http://localhost:8551          \
  --ee-jwt-secret-file=<path to jwtsecret.hex> \
  --metrics-enabled=true                       \
  --rest-api-enabled=true                      \
  --p2p-advertised-ip=<your public IP>         \  
  --checkpoint-sync-url=<checkpoint sync URL>
```

</TabItem>

</Tabs>

Specify:

- The path to the `jwtsecret.hex` file generated in [step 2](#2-generate-the-shared-secret) using the
  [`--ee-jwt-secret-file`](https://docs.teku.consensys.io/reference/cli#ee-jwt-secret-file) option.
- The public IP address of your Teku node using the
  [`--p2p-advertised-ip`](https://docs.teku.consensys.io/reference/cli#p2p-advertised-ip) option.
- The URL of a checkpoint sync endpoint using the
  [`--checkpoint-sync-url`](https://docs.teku.consensys.io/reference/cli#checkpoint-sync-url) option.

You can modify the option values and add other [Teku command line options] as needed.

### Beacon node and validator client

To run Teku as a beacon node and validator in a single process, run the following command or specify the options in the [Teku configuration file]:

<Tabs>

<TabItem value="Hoodi" label="Hoodi" default>

```bash
teku \
  --network=hoodi                                           \
  --ee-endpoint=http://localhost:8551                       \
  --ee-jwt-secret-file=<path to jwtsecret.hex>              \
  --metrics-enabled=true                                    \
  --rest-api-enabled=true                                   \
  --p2p-advertised-ip=<your public IP>                      \  
  --checkpoint-sync-url=<checkpoint sync URL>               \
  --validators-proposer-default-fee-recipient=<ETH address> \
  --validator-keys=<path to key file>:<path to password file>[,<path to key file>:<path to password file>,...]
```

</TabItem>

<TabItem value="Sepolia" label="Sepolia">

Sepolia is a permissioned network and you can't run a validator client on it without [requesting to become a validator](https://notes.ethereum.org/zvkfSmYnT0-uxwwEegbCqg) first.

</TabItem>

</Tabs>

Specify:

- The path to the `jwtsecret.hex` file generated in [step 2](#2-generate-the-shared-secret) using the
  [`--ee-jwt-secret-file`](https://docs.teku.consensys.io/reference/cli#ee-jwt-secret-file) option.
- The public IP address of your Teku node using the
  [`--p2p-advertised-ip`](https://docs.teku.consensys.io/reference/cli#p2p-advertised-ip) option.
- The URL of a checkpoint sync endpoint using the
  [`--checkpoint-sync-url`](https://docs.teku.consensys.io/reference/cli#checkpoint-sync-url) option.
- The test Ethereum address created in [step 3](#3-generate-validator-keys) as the default fee
  recipient using the
  [`--validators-proposer-default-fee-recipient`](https://docs.teku.consensys.io/reference/cli#validators-proposer-default-fee-recipient)
  option.
- The paths to the keystore `.json` file and password `.txt` file created in
  [step 3](#3-generate-validator-keys) for each validator using the
  [`--validator-keys`](https://docs.teku.consensys.io/reference/cli#validator-keys) option.
  Separate the `.json` and `.txt` files with a colon, and separate entries for multiple validators with commas.

You can modify the option values and add other [Teku command line options] as needed.

## 6. Wait for Besu and Teku to sync

After starting Besu and Teku, your node starts syncing and connecting to peers.

<Tabs>

<TabItem value="Besu logs" label="Besu logs" default>

```json
{"@timestamp":"2023-02-03T04:43:49,555","level":"INFO","thread":"main","class":"DefaultSynchronizer","message":"Starting synchronizer.","throwable":""}
{"@timestamp":"2023-02-03T04:43:49,556","level":"INFO","thread":"main","class":"FastSyncDownloader","message":"Starting sync","throwable":""}
{"@timestamp":"2023-02-03T04:43:49,559","level":"INFO","thread":"main","class":"Runner","message":"Ethereum main loop is up.","throwable":""}
{"@timestamp":"2023-02-03T04:43:53,106","level":"INFO","thread":"Timer-0","class":"DNSResolver","message":"Resolved 2409 nodes","throwable":""}
{"@timestamp":"2023-02-03T04:45:04,803","level":"INFO","thread":"nioEventLoopGroup-3-10","class":"SnapWorldStateDownloader","message":"Downloading world state from peers for pivot block 16545859 (0x616ae3c4cf85f95a9bce2814a7282d75dc2eac36
cb9f0fcc6f16386df70da3c5). State root 0xa7114541f42c62a72c8b6bb9901c2ccf4b424cd7f76570a67b82a183b02f25dc pending requests 0","throwable":""}
{"@timestamp":"2023-02-03T04:46:04,834","level":"INFO","thread":"EthScheduler-Services-3 (batchPersistAccountData)","class":"SnapsyncMetricsManager","message":"Worldstate download progress: 0.08%, Peer count: 8","throwable":""}
{"@timestamp":"2023-02-03T04:48:01,840","level":"INFO","thread":"EthScheduler-Services-3 (batchPersistAccountData)","class":"SnapsyncMetricsManager","message":"Worldstate download progress: 0.23%, Peer count: 8","throwable":""}
{"@timestamp":"2023-02-03T04:49:09,931","level":"INFO","thread":"EthScheduler-Services-3 (batchPersistAccountData)","class":"SnapsyncMetricsManager","message":"Worldstate download progress: 0.41%, Peer count: 11","throwable":""}
{"@timestamp":"2023-02-03T04:50:12,466","level":"INFO","thread":"EthScheduler-Services-3 (batchPersistAccountData)","class":"SnapsyncMetricsManager","message":"Worldstate download progress: 0.61%, Peer count: 10","throwable":""}
{"@timestamp":"2023-02-03T04:51:20,977","level":"INFO","thread":"EthScheduler-Services-3 (batchPersistAccountData)","class":"SnapsyncMetricsManager","message":"Worldstate download progress: 0.75%, Peer count: 10","throwable":""}
{"@timestamp":"2023-02-03T04:51:28,985","level":"INFO","thread":"EthScheduler-Services-29 (importBlock)","class":"FastImportBlocksStep","message":"Block import progress: 180400 of 16545859 (1%)","throwable":""}
```

</TabItem>

<TabItem value="Teku logs" label="Teku logs">

```bash
2022-03-21 20:43:24.355 INFO  - Syncing     *** Target slot: 76092, Head slot: 2680, Remaining slots: 73412, Connected peers: 8
2022-03-21 20:43:36.363 INFO  - Syncing     *** Target slot: 76093, Head slot: 2879, Remaining slots: 73214, Connected peers: 10
2022-03-21 20:43:48.327 INFO  - Syncing     *** Target slot: 76094, Head slot: 3080, Remaining slots: 73014, Connected peers: 8
2022-03-21 20:44:00.339 INFO  - Syncing     *** Target slot: 76095, Head slot: 3317, Remaining slots: 72778, Connected peers: 6
2022-03-21 20:44:12.353 INFO  - Syncing     *** Target slot: 76096, Head slot: 3519, Remaining slots: 72577, Connected peers: 9
```

</TabItem>

</Tabs>

If you're running Teku as a beacon node only, you're all set. If you're also running Teku as a validator client, ensure Besu and Teku are fully synced before submitting your staking deposit in the next step. Syncing Besu can take several days.

## 7. Stake ETH

Stake your testnet ETH for one or more validators using the [Holesky Staking Launchpad](https://holesky.launchpad.ethereum.org/), [Hoodi Staking Launchpad](https://hoodi.launchpad.ethereum.org/), or [Ephemery Staking Launchpad](https://launchpad.ephemery.dev/).

You can check your validator status by searching your Ethereum address on the [Holesky explorer](https://holesky.beaconcha.in/), [Hoodi explorer](https://hoodi.etherscan.io/), or [Ephemery explorer](https://explorer.ephemery.dev/). It may take up to multiple days for your validator to be activated and start proposing blocks.

<!--links-->

[Teku configuration file]: https://docs.teku.consensys.net/HowTo/Configure/Use-Configuration-File/
[Teku command line options]: https://docs.teku.consensys.net/Reference/CLI/CLI-Syntax/
