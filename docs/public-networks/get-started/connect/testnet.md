---
title: Connect to a testnet
sidebar_position: 3
Description: How to connect to a testnet
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Connect to a testnet

Run Besu as an [execution client](../../concepts/node-clients.md#execution-clients) with any consensus client on the [Hoodi](https://github.com/eth-clients/hoodi), [Sepolia](https://github.com/eth-clients/sepolia), or [Ephemery](https://github.com/ephemery-testnet/ephemery-resources) testnet.

If you're using [Teku](https://docs.teku.consensys.net/en/latest/) as a consensus client, you can follow the [Besu and Teku testnet tutorial](../../tutorials/besu-teku-testnet.md).

:::note

- Sepolia is a permissioned network and you can't run a validator client on it without
    [requesting to become a validator](https://notes.ethereum.org/zvkfSmYnT0-uxwwEegbCqg) first. You can connect
    your consensus client using the beacon node only, without any validator duties.

- Ephemery is a single network that resets to the genesis block after a set period. The network focuses on
    short-term, intensive testing use cases. This approach avoids issues like insufficient testnet funds, inactive
    validators, and state bloat that long-running testnets face.

:::

## Prerequisites

- [Besu installed](../install/binary-distribution.md).
- A consensus client installed. For example, [Teku](https://docs.teku.consensys.net/en/latest/).

## Steps

### 1. Generate the shared secret

Run the following command:

```bash
openssl rand -hex 32 | tr -d "\n" > jwtsecret.hex
```

You will specify `jwtsecret.hex` when starting Besu and the consensus client. This is a shared JWT secret the clients use to authenticate each other when using the [Engine API](../../how-to/use-engine-api.md).

### 2. Generate validator keys

If you're running the consensus client as a beacon node only, skip to the [next step](#3-start-besu).

If you're also running the consensus client as a validator client, create a test Ethereum address
(you can do this in [MetaMask](https://support.metamask.io/configure/accounts/how-to-add-accounts-in-your-wallet/)).
Fund this address with testnet ETH (32 ETH and gas fees for each validator) using a faucet. See the faucets for the relevant testnet:

- [Holesky](https://github.com/eth-clients/holesky)
- [Hoodi](https://github.com/eth-clients/hoodi)
- [Sepolia](https://github.com/eth-clients/sepolia)
- [Ephemery](https://ephemery-faucet.pk910.de/)

:::note

If you can't get testnet ETH using the faucet, you can ask for help on the [EthStaker Discord](https://discord.gg/ethstaker).

:::

Generate validator keys for one or more validators using the [Hoodi Staking Launchpad](https://hoodi.launchpad.ethereum.org/), [Ephemery Staking Launchpad](https://launchpad.ephemery.dev/), or [request to become validator on Sepolia](https://notes.ethereum.org/zvkfSmYnT0-uxwwEegbCqg).

:::info

Save the password you use to generate each key pair in a `.txt` file. You should also have a `.json` file for each validator key pair.

:::

### 3. Start Besu

Run the following command or specify the options in a [configuration file](../../how-to/configure-besu/index.md):

<Tabs>

<TabItem value="Hoodi" label="Hoodi">

```bash
besu \
  --network=hoodi             \
  --rpc-http-enabled=true     \
  --rpc-http-host=0.0.0.0     \
  --rpc-http-cors-origins="*" \
  --rpc-ws-enabled=true       \
  --rpc-ws-host=0.0.0.0       \
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
  --rpc-http-host=0.0.0.0     \
  --rpc-http-cors-origins="*" \
  --rpc-ws-enabled=true       \
  --rpc-ws-host=0.0.0.0       \
  --host-allowlist="*"        \
  --engine-host-allowlist="*" \
  --engine-rpc-enabled        \
  --engine-jwt-secret=<path to jwtsecret.hex>
```

</TabItem>

  <TabItem value="Ephemery" label="Ephemery">

  ```bash
  besu \
    --network=ephemery          \
    --rpc-http-enabled=true     \
    --rpc-http-host=0.0.0.0     \
    --rpc-http-cors-origins="*" \
    --rpc-ws-enabled=true       \
    --rpc-ws-host=0.0.0.0       \
    --host-allowlist="*"        \
    --engine-host-allowlist="*" \
    --engine-rpc-enabled        \
    --engine-jwt-secret=<path to jwtsecret.hex>
  ```

  </TabItem>
</Tabs>

Specify the path to the `jwtsecret.hex` file generated in [step 1](#1-generate-the-shared-secret) using the [`--engine-jwt-secret`](../../reference/cli/options.md#engine-jwt-secret) option.

You can modify the option values and add other [command line options](../../reference/cli/options.md) as needed.

### 4. Start the consensus client

Refer to your consensus client documentation to configure and start the consensus client.

:::info

If you're running a validator client, make sure you set a fee recipient address.

:::

If you're using Teku, follow the [Besu and Teku testnet tutorial](../../tutorials/besu-teku-testnet.md#5-start-teku).

### 5. Wait for the clients to sync

After starting Besu and the consensus client, your node starts syncing and connecting to peers.

<Tabs>

<TabItem value="Besu logs" label="Besu logs" default>

```bash
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

If you're running the consensus client as a beacon node only, you're all set. If you're also running the consensus client as a validator client, ensure your clients are fully synced before submitting your staking deposit in the next step. This can take several days.

### 6. Stake ETH

Stake your testnet ETH for one or more validators using the [Holesky Staking Launchpad](https://holesky.launchpad.ethereum.org/), [Hoodi Staking Launchpad](https://hoodi.launchpad.ethereum.org/), or [Ephemery Staking Launchpad](https://launchpad.ephemery.dev/).

You can check your validator status by searching your Ethereum address on the [Holesky explorer](https://holesky.beaconcha.in/),
[Hoodi explorer](https://hoodi.etherscan.io/), or [Ephemery explorer](https://explorer.ephemery.dev/). It may take up to multiple days for your validator to be activated and start proposing blocks.
