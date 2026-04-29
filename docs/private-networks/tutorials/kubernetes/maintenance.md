---
title: Maintenance
sidebar_position: 5
description: Maintenance for Besu on a Kubernetes cluster
---

# Maintenance

You can perform maintenance for Besu on a Kubernetes cluster.

## Prerequisites

- Clone the [Quorum-Kubernetes](https://github.com/ConsenSys/quorum-kubernetes) repository
- A [running Kubernetes cluster](cluster.md) with a [network](charts.md)
- Install [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- Install [Helm3](https://helm.sh/docs/intro/install/)

## Update a persistent volume claim size

Over time, as the chain grows, so will the amount of space used by the persistent volume claim (PVC). As of Kubernetes v1.11, [certain types of Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/#allow-volume-expansion) allow volume resizing. Production charts for Azure use Azure Files, and on AWS use EBS Block Store which allow for volume expansion.

To update the volume size, you must update the override values file. For example, to increase the size on the transaction nodes volumes, add the following snippet to the [`txnode values.yml`](https://github.com/ConsenSys/quorum-kubernetes/blob/5920caff6dd15b4ca17f760ad9e4d7d2e43b41a1/helm/values/txnode.yml) file, with the new size limit (the following example uses 50Gi).

```bash
storage:
  sizeLimit: "50Gi"
  pvcSizeLimit: "50Gi"
```

Once complete, update the node via helm:

```bash
helm upgrade tx-1 ./charts/besu-node --namespace besu --values ./values/txnode.yml
```

## Update Besu versions

:::important

When updating Besu nodes across a cluster, perform the updates as a rolling update and not all at once, especially for the validator pool. If all the validators are taken offline, the chain halts, and you must wait for round changes to expire before blocks are created again.

:::

Updates for Besu can be done via Helm in exactly the same manner as other applications. Alternatively, this can be done via `kubectl`. This example updates a node called `besu-validator-3`:

1. Set the update policy to use rolling updates (if not done already):

   ```bash
   kubectl patch statefulset besu-validator-3 --namespace besu -p '{"spec":{"updateStrategy":{"type":"RollingUpdate"}}}'
   ```

2. Update the Besu version via Helm:

   ```bash
   helm upgrade bootnode-1 ./charts/besu-node --namespace besu --values ./values/bootnode.yml --set image.besu.tag=21.10.0
   ```

   Or via `kubectl`:

   ```bash
   kubectl patch statefulset besu-validator-3 --namespace besu --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"hyperledger/besu:21.10.0"}]'
   ```
