---
title: Upgrade Besu
sidebar_position: 11
description: Upgrade your Besu node to a new version.
toc_max_heading_level: 2
---

# Upgrade your Besu node

This page provides instructions for upgrading your Besu node on:

- [Linux](#upgrade-on-linux)
- [Docker](#upgrade-on-docker)
- [Kubernetes](#upgrade-on-kubernetes)
- [Ansible](#upgrade-on-ansible)

When upgrading your node, we recommend:

- Checking the [Besu release notes](https://github.com/hyperledger/besu/releases) for breaking changes.
- Preserving your node's data and configuration.
- Storing your configuration under version control.

## Upgrade on Linux

1. Run the following script to automatically download the latest Linux release, extract it, and clean up:

    ```bash
    RELEASE_URL="https://api.github.com/repos/hyperledger/besu/releases/latest"
    TAG=$(curl -s $RELEASE_URL | jq -r .tag_name)
    BINARIES_URL="https://github.com/hyperledger/besu/releases/download/$TAG/besu-$TAG.tar.gz"
   
    echo Downloading URL: $BINARIES_URL
   
    cd $HOME
    wget -O besu.tar.gz $BINARIES_URL
    tar -xzvf besu.tar.gz -C $HOME
    rm besu.tar.gz
    sudo mv $HOME/besu-${TAG} besu
    ```
   
2. Stop your Besu node:

    ```bash
    sudo systemctl stop execution
    ```
   
3. Remove old binaries, install new binaries, and restart Besu:

    ```bash
    sudo rm -rf /usr/local/bin/besu
    sudo mv $HOME/besu /usr/local/bin/besu
    sudo systemctl start execution
    ```

:::tip note
Thank you to
[CoinCashew](https://www.coincashew.com/coins/overview-eth/guide-or-how-to-setup-a-validator-on-eth2-mainnet/part-ii-maintenance/updating-execution-client#besu)
for this upgrade script.
You can also see CoinCashew for instructions on upgrading Besu by building from source.
:::
 
## Upgrade on Docker

1. Update your Docker image:

    ```bash
    docker pull hyperledger/besu:latest
    ```

2. Stop the current container:

    ```bash
    docker stop besu-node
    ```

3. Start a new container with the updated image:

    ```bash
    docker run -d \
      --name besu-node            \
      -v besu-data:/opt/besu/data \
      -v besu-config:/etc/besu    \
      hyperledger/besu:latest
    ```

Here is an example `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  besu:
    image: hyperledger/besu:latest
    volumes:
      - besu-data:/opt/besu/data
      - besu-config:/etc/besu
    ports:
      - "8545:8545"
      - "30303:30303"
volumes:
  besu-data:
  besu-config:
```

## Upgrade on Kubernetes

1. Update your deployment manifest with a new image version:

    ```yaml
    spec:
      containers:
      - name: besu
        image: hyperledger/besu:new-version
    ```

2. Apply the update:

    ```bash
    kubectl apply -f besu-deployment.yaml
    ```

Here is an example PVC configuration:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: besu-data
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Ti
```

## Upgrade on Ansible

You can use the [Ansible role on Galaxy](https://galaxy.ansible.com/ui/standalone/roles/consensys/hyperledger_besu/)
directly or customize it to suit your needs.

Upgrade your Besu node by running the play with the new version.
For more information, select **Documentation** on the [Ansible Galaxy Besu page](https://galaxy.ansible.com/ui/standalone/roles/consensys/hyperledger_besu/).

The playbook:

1. Stops Besu.
2. Downloads the updated version.
3. Applies any new configuration.
4. Starts Besu.

## Verify post-upgrade

### RPC methods

If you have [JSON-RPC HTTP enabled](../reference/cli/options.md#rpc-http-enabled),
you can use the following commands to verify that you've successfully upgraded your Besu node.

Call [`eth_syncing`](../reference/api/index.md#eth_syncing) to check the node synchronization status:

 ```bash
 curl -X POST --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' http://127.0.0.1:8545 -H "Content-Type: application/json"
 ```

Call [`web3_clientVersion`](../reference/api/index.md#web3_clientversion) to check the current client version:

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' http://127.0.0.1:8545 -H "Content-Type: application/json"
```

Call [`net_peerCount`](../reference/api/index.md#net_peercount) to verify peer connections:

 ```bash
 curl -X POST --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' http://127.0.0.1:8545 -H "Content-Type: application/json"
 ```

### Logs

You can also check Besu's logs to verify the version and whether Besu is in sync.
For example, the startup logs look like the following:

```bash
{"@timestamp":"2025-01-17T07:23:03,791","level":"INFO","thread":"main","class":"Besu","message":"Starting Besu","throwable":""}
{"@timestamp":"2025-01-17T07:23:04,558","level":"INFO","thread":"main","class":"Besu","message":"Connecting to 0 static nodes.","throwable":""}
{"@timestamp":"2025-01-17T07:23:04,643","level":"INFO","thread":"main","class":"Besu","message":"
####################################################################################################
#                                                                                                  #
# Besu version 25.1.0                                                                #
#   
...                                                                                               #
```

### Metrics

If you have [metrics enabled](../reference/cli/options.md#metrics-enabled), you can verify the version by checking the
`process_release` metric in [Prometheus](monitor/metrics.md), or on the command line:

```bash
curl -s localhost:9545/metrics | grep process_release
```

For example, the response looks like the following:

```bash
process_release{version="besu/v25.10/linux-x86_64/openjdk-java-21"} 1.0
```

## Find peers on restarting

Nodes store known peers in the peer table.
The peer table is not persisted to disk.
When a node restarts, the node connects to the specified bootnodes and discovers other nodes through the peer discovery process.
The node continues collecting data from where it left off before the restart (assuming there was no data corruption in a failure scenario).

Before the node restarted, connected peers saved the node details in their peer tables.
These peers can reconnect to the restarted node.
The restarted node uses these peers and the bootnodes, to discover more peers.
To ensure that the restarted node successfully rejoins the network, ensure you specify at least one operational bootnode.

## Troubleshoot

#### Sync not progressing

Verify that the node is properly connected to the bootnodes.
Check the node logs to ensure that the connections are being established correctly.

#### Low peer count

Ensure that your network connection is stable and that the required ports for peer discovery and communication are open and correctly forwarded.

#### API unavailable

Check the configuration of your RPC endpoint to ensure it is set up correctly and is accessible. 
Verify that the API service is running and the correct ports are being used.

#### Data corruption

If you encounter data corruption, restore the node data from a known good backup.
Ensure regular backups are in place to avoid data loss.

:::note
As a last resort, you can delete the database to resync the node.
This can solve corruption issues, but it might suffer significant downtime depending on the size of the network.
:::
