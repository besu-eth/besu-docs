---
title: Developer Quickstart
sidebar_position: 1
description: Rapidly generate a local blockchain network using the Quickstart.
toc_max_heading_level: 3
---

import TestAccounts from '../../global/test_accounts.md';

import Postman from '../../global/postman.md';

# Developer Quickstart

The Besu Developer Quickstart generates a local private [QBFT](../how-to/configure/consensus/qbft.md) network of Besu nodes managed by Docker Compose.
Use this tutorial to create a development network, send JSON-RPC requests, view blocks and transactions, monitor nodes, and test a transaction from MetaMask.

:::caution

This tutorial runs a private network suitable for education or demonstration purposes and is not intended for running production 
networks.

:::

The generated private network includes four validators, one non-validator RPC node, and monitoring services.
You can optionally enable Chainlens Explorer and OpenTelemetry (OTel) when you generate the network.

## Prerequisites

- [Docker and Docker Compose](https://docs.docker.com/compose/install/) v2 or later
- [Node.js](https://nodejs.org/en/download/) or [Yarn](https://yarnpkg.com/cli/node)
- [curl](https://curl.haxx.se/download.html)
- [MetaMask](https://metamask.io/)

:::info

Allow Docker to use up to 6 GB of memory for the private network.
On Windows, use Windows 11 with WSL2 kernel 6.6 or later.
You can use Docker Desktop or Docker Engine with the Compose plugin in the WSL2 environment.

:::

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
| Add OTel Collector spans to Grafana? | **N**                 |
| Enable Chainlens Explorer?           | **Y**                 |
| Config files directory               | `./besu-test-network` |

To skip the prompts, run:

```bash
npx @consensys-software/besu-dev-quickstart --networkType private --outputPath ./besu-test-network --otel false --chainlens true
```

### 2. Start the network

Go to the generated directory and start the containers:

```bash
cd besu-test-network
./run.sh
```

The script builds the Docker images and starts the network.
The private network contains four QBFT validators named `validator1` through `validator4`, and one non-validator node named `rpcnode`.

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

The result indicates that `rpcnode` has four peers:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x4"
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

### 4. View the network in Chainlens

If you enabled Chainlens when generating the network, open `http://localhost:8081/dashboard` in your browser.

Chainlens connects to `rpcnode` and displays network activity, blocks, and transactions.
If the dashboard is empty at first, wait for the ingestion service to index the latest blocks, then refresh the page.

To add Chainlens after generating the network, generate a new quickstart directory with `--chainlens true`.
The Developer Quickstart adds the Chainlens services to the generated Docker Compose file at generation time.

### 5. Monitor nodes with Prometheus, Grafana, and Loki

The Developer Quickstart starts Prometheus, Grafana, Loki, and Grafana Alloy with the private network.
Use these services to inspect node metrics and logs.

- Open `http://localhost:9090/graph` to query metrics in Prometheus.
- Open the Grafana metrics URL listed by `./list.sh` to view the Besu overview dashboard.
- Open the Grafana logs URL listed by `./list.sh` to view logs from Loki.

If you generated the network with `--otel true`, the Developer Quickstart also includes an OTel Collector and Tempo.
Use Grafana to inspect the additional tracing data.

Learn more about how to [monitor metrics](../../public-networks/how-to/monitor/metrics.md).

### 6. Send a transaction with MetaMask

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

### 7. Stop and restart the network

Stop the containers without deleting the chain data:

```bash
./stop.sh
```

Restart the containers with the existing data:

```bash
./resume.sh
```

### 8. Remove the network

Stop the containers and remove the generated container volumes:

```bash
./remove.sh
```

The command doesn't delete the generated files in `besu-test-network`.

### 9. Add a non-validator node

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
