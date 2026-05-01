---
title: Create a cluster
sidebar_position: 2
description: Create a cluster for deployment
---

# Create a cluster

You can create a [local](#local-clusters) or [cloud](#cloud-clusters) cluster to deploy a Besu network using Kubernetes.

## Prerequisites

- Clone the [Quorum-Kubernetes](https://github.com/ConsenSys/quorum-kubernetes) repository
- Install [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- Install [Helm3](https://helm.sh/docs/intro/install/)
- Install [AWS CLI](https://aws.amazon.com/cli/) and [`eksctl`](https://eksctl.io/) for AWS EKS clusters
- Install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) for Azure AKS clusters
- Install the cloud-specific CLI

## Local Clusters

Use one of several options to create a local cluster. Select one listed below, or another that you're comfortable with.

### Minikube

[Minikube](https://minikube.sigs.k8s.io/docs/start/) is one of the most popular options to spin up a local Kubernetes cluster for development. You can [install a version](https://minikube.sigs.k8s.io/docs/start/) based on your architecture.

:::note

We recommend at least 2 CPUs and 16GB of RAM.

:::

To start the cluster, run the following command:

```bash
minikube start --cpus 2 --memory 16384 --cni auto
```

### kind

[kind (Kubernetes in Docker)](https://kind.sigs.k8s.io) is a lightweight tool for running local Kubernetes clusters. The [installation](https://kind.sigs.k8s.io/docs/user/quick-start#installation) is similar to [Minikube](#minikube).

To start the cluster, run the following command:

```bash
kind create cluster
```

### Rancher

[Rancher](https://github.com/rancher-sandbox/rancher-desktop/) is a lightweight open source desktop application for Mac, Windows, and Linux. It provides Kubernetes and container management, and allows you to choose the version of Kubernetes to run.

It can build, push, pull, and run container images. Built container images can be run without needing a registry.

:::note

The official Docker-CLI is not supported but rather uses [nerdctl](https://github.com/containerd/nerdctl) which is a Docker-CLI compatible tool for containerd, and is automatically installed with Rancher Desktop.

:::

:::note

For Windows, you must [install Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/install) to install Rancher Desktop.

Refer to the [official Rancher Desktop documentation](https://docs.rancherdesktop.io/) for system requirements and installation instructions.

:::

## Cloud clusters

### AWS EKS

[AWS Elastic Kubernetes Service (AWS EKS)](https://aws.amazon.com/eks/) is one of the most popular platforms to deploy Besu.

To create a cluster in AWS, you must install the [AWS CLI](https://aws.amazon.com/cli/) and [`eksctl`](https://eksctl.io/).

The [template](https://github.com/ConsenSys/quorum-kubernetes/tree/master/aws) comprises the base infrastructure used to build the cluster and other resources in AWS. We also use some native services with the cluster for performance and best practices, these include:

- [Pod identities](https://github.com/aws/amazon-eks-pod-identity-webhook).
- [Secrets Store CSI drivers](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html).
- Dynamic storage classes backed by AWS EBS. The [volume claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) are fixed sizes and can be updated as you grow via helm updates, and won't need to re-provision the underlying storage class.
- [CNI](https://docs.aws.amazon.com/eks/latest/userguide/pod-networking.html) networking mode for EKS. By default, EKS clusters use `kubenet` to create a virtual network and subnet. Nodes get an IP address from a virtual network subnet. Network address translation (NAT) is then configured on the nodes, and pods receive an IP address "hidden" behind the node IP.

  :::note

  This approach reduces the number of IP addresses that you must reserve in your network space for pods, but constrains what can connect to the nodes from outside the cluster (for example, on-premise nodes or those on another cloud provider).

  :::

AWS Container Networking Interface (CNI) provides each pod with an IP address from the subnet, and can be accessed directly. The IP addresses must be unique across your network space, and must be planned in advance. Each node has a configuration parameter for the maximum number of pods that it supports. The equivalent number of IP addresses per node are then reserved up front for that node. This approach requires more planning, and can lead to IP address exhaustion as your application demands grow, however makes it easier for external nodes to connect to your cluster.

:::warning

EKS clusters must not use 169.254.0.0/16, 172.30.0.0/16, 172.31.0.0/16, or 192.0.2.0/24 for the Kubernetes service address range.

:::

To provision the cluster:

1.  Update [cluster.yml](https://github.com/ConsenSys/quorum-kubernetes/blob/5920caff6dd15b4ca17f760ad9e4d7d2e43b41a1/aws/templates/cluster.yml)

2.  Deploy the template:

    ```bash
    eksctl create cluster -f ./templates/cluster.yml
    ```

3.  Your `.kube/config` should be connected to the cluster automatically, but if not, run the commands below and replace `AWS_REGION` and `CLUSTER_NAME` with details that are specific to your deployment.

    ```bash
    aws sts get-caller-identity
    aws eks --region AWS_REGION update-kubeconfig --name CLUSTER_NAME
    ```

4.  After the deployment completes, provision the EBS drivers for the volumes. While it is possible to use the in-tree `aws-ebs` driver that's natively supported by Kubernetes, it is no longer being updated and does not support newer EBS features such as the [cheaper and better gp3 volumes](https://stackoverflow.com/questions/68359043/whats-the-difference-between-ebs-csi-aws-com-vs-kubernetes-io-aws-ebs-for-provi). The `cluster.yml` file (from the steps above) that is included in this folder automatically deploys the cluster with the EBS IAM policies, but you need to install the EBS CSI drivers. This can be done through the AWS Management Console for simplicity, or via a CLI command as below. Replace `CLUSTER_NAME`, `AWS_REGION` and `AWS_ACCOUNT` with details that are specific to your deployment.

    ```bash
    eksctl create iamserviceaccount --name ebs-csi-controller-sa --namespace kube-system --cluster CLUSTER_NAME --region AWS_REGION --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy --approve --role-only --role-name AmazonEKS_EBS_CSI_DriverRole

    eksctl create addon --name aws-ebs-csi-driver --cluster CLUSTER_NAME --region AWS_REGION --service-account-role-arn arn:aws:iam::AWS_ACCOUNT:role/AmazonEKS_EBS_CSI_DriverRole --force
    ```

5.  Once the deployment is completed, provision the Secrets Manager IAM and CSI driver. Use `besu` (or equivalent) for `NAMESPACE` and replace `CLUSTER_NAME`, `AWS_REGION` and `AWS_ACCOUNT` with details that are specific to your deployment.

    ```bash
    helm repo add secrets-store-csi-driver https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
    helm install --namespace kube-system --create-namespace csi-secrets-store secrets-store-csi-driver/secrets-store-csi-driver
    kubectl apply -f https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/main/deployment/aws-provider-installer.yaml

    POLICY_ARN=$(aws --region AWS_REGION --query Policy.Arn --output text iam create-policy --policy-name quorum-node-secrets-mgr-policy --policy-document '{
        "Version": "2012-10-17",
        "Statement": [ {
            "Effect": "Allow",
            "Action": ["secretsmanager:CreateSecret","secretsmanager:UpdateSecret","secretsmanager:DescribeSecret","secretsmanager:GetSecretValue","secretsmanager:PutSecretValue","secretsmanager:ReplicateSecretToRegions","secretsmanager:TagResource"],
            "Resource": ["arn:aws:secretsmanager:AWS_REGION:AWS_ACCOUNT:secret:besu-node-*"]
        } ]
    }')

    # If you have deployed the above policy before, you can acquire its ARN:
    POLICY_ARN=$(aws iam list-policies --scope Local \
    --query 'Policies[?PolicyName==`quorum-node-secrets-mgr-policy`].Arn' \
    --output text)

    eksctl create iamserviceaccount --name quorum-node-secrets-sa --namespace NAMESPACE --region=AWS_REGION --cluster CLUSTER_NAME --attach-policy-arn "$POLICY_ARN" --approve --override-existing-serviceaccounts
    ```

    :::warning

    The above command creates a service account called `quorum-node-secrets-sa` and is preconfigured in the helm charts override `values.yml` files, for ease of use.

    :::

6.  Optionally, deploy the [kubernetes dashboard](https://github.com/ConsenSys/quorum-kubernetes/tree/master/aws/templates/k8s-dashboard).

7.  You can now use your cluster and you can deploy [Helm charts](charts.md) to it.

### Azure Kubernetes Service

[Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/services/kubernetes-service/) is another popular cloud platform that you can use to deploy Besu. To create a cluster in Azure, you must install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) and have admin rights on your Azure subscription to enable some preview features on AKS.

The [template](https://github.com/ConsenSys/quorum-kubernetes/tree/master/azure) comprises the base infrastructure used to build the cluster and other resources in Azure. We also make use Azure native services and features after the cluster is created. These include:

- [AAD pod identities](https://docs.microsoft.com/en-us/azure/aks/use-azure-ad-pod-identity).
- [Secrets Store CSI drivers](https://docs.microsoft.com/en-us/azure/key-vault/general/key-vault-integrate-kubernetes).
- Dynamic storage classes backed by Azure Files. The [volume claims](https://docs.microsoft.com/en-us/azure/aks/azure-disks-dynamic-pv) are fixed sizes and can be updated as you grow via helm updates, and won't need to re-provision the underlying storage class.
- [CNI](https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni) networking mode for AKS. By default, AKS clusters use `kubenet`, to create a virtual network and subnet. Nodes get an IP address from a virtual network subnet. Network address translation (NAT) is then configured on the nodes, and pods receive an IP address "hidden" behind the node IP.

  :::note

  This approach reduces the number of IP addresses you must reserve in your network space for pods to use, but constrains what can connect to the nodes from outside the cluster (for example, on-premise nodes or other cloud providers).

  :::

AKS Container Networking Interface (CNI) provides each pod with an IP address from the subnet, and can be accessed directly. These IP addresses must be unique across your network space, and must be planned in advance. Each node has a configuration parameter for the maximum number of pods that it supports. The equivalent number of IP addresses per node are then reserved up front for that node. This approach requires more planning, and can leads to IP address exhaustion as your application demands grow, however makes it easier for external nodes to connect to your cluster.

:::warning

Please do not create more than one AKS cluster in the same subnet. AKS clusters may not use `169.254.0.0/16`, `172.30.0.0/16`, `172.31.0.0/16`, or `192.0.2.0/24` for the Kubernetes service address range.

:::

To provision the cluster:

1. Enable the preview features that allow you to use AKS with CNI, and a managed identity to authenticate and run cluster operations with other services. We also enable [AAD pod identities](https://docs.microsoft.com/en-us/azure/aks/use-azure-ad-pod-identity) which use the managed identity. This is in preview, so you must enable this feature by registering the `EnablePodIdentityPreview` feature:

   ```bash
   az feature register --name EnablePodIdentityPreview --namespace Microsoft.ContainerService
   ```

   This takes a little while and you can check on progress by running:

   ```bash
   az feature list --namespace Microsoft.ContainerService -o table
   ```

   Install or update your local Azure CLI with preview features:

   ```bash
   az extension add --name aks-preview
   az extension update --name aks-preview
   ```

1. Create a resource group if you don't already have one:

   ```bash
   az group create --name BesuGroup --location "East US"
   ```

1. Deploy the template:

   1. Navigate to the [Azure portal](https://portal.azure.com), select **+ Create a resource** in the upper left corner.
   1. Search for `Template deployment (deploy using custom templates)` and select **Create**.
   1. Select **Build your own template in the editor**.
   1. Remove the contents (JSON) in the editor and paste in the contents of [`azuredeploy.json`](https://github.com/ConsenSys/quorum-kubernetes/blob/5920caff6dd15b4ca17f760ad9e4d7d2e43b41a1/azure/arm/azuredeploy.json)
   1. Select **Save**.
   1. Input provisioning parameters in the displayed user interface.

1. Provision the drivers:

   1. Run the [bootstrap](https://github.com/ConsenSys/quorum-kubernetes/blob/5920caff6dd15b4ca17f760ad9e4d7d2e43b41a1/azure/scripts/bootstrap.sh) script.
   1. Use `besu` for `AKS_NAMESPACE`, and update `AKS_RESOURCE_GROUP`, `AKS_CLUSTER_NAME`, and `AKS_MANAGED_IDENTITY` in the commands below to match your settings and deployed resources from step 3.

      ```bash
      ./scripts/bootstrap.sh "AKS_RESOURCE_GROUP" "AKS_CLUSTER_NAME" "AKS_MANAGED_IDENTITY" "AKS_NAMESPACE"
      ```

1. You can now use your cluster and you can deploy [Helm charts](charts.md) to it.
