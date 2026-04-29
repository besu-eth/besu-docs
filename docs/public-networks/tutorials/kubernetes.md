---
title: Deploy Besu using Kubernetes
description: Deploy a Besu node using Kubernetes.
sidebar_position: 3
toc_max_heading_level: 3
---

# Deploy a Besu public node using Kubernetes 

You can use a cloud provider such as [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/)
or [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-au/products/kubernetes-service) to deploy
a Besu public node

This tutorial walks you through adding an extra node group to your Besu pod.

## AWS EKS

### Prerequisites

Set up a Kubernetes cluster using a managed Kubernetes service such as
[Amazon EKS](https://aws.amazon.com/eks/).

### Steps

#### 1. Create a security group for discovery

Create a security group in your VPC that allows traffic from anywhere on ports `30303` and `9000`
(or equivalent ports that you are using for discovery). 

##### Outbound rules

| Type        | Protocol | Port range | Destination |
|-------------|----------|------------|-------------|
| All traffic | All      | All        | `0.0.0.0/0` |
| All traffic | All      | All        | `::/0`      |

#### Inbound rules

| Type       | Protocol | Port range | Destination | Description |
|------------|----------|------------|-------------|-------------|
| Custom UDP | UDP      | `9000`     | `0.0.0.0/0` | CL client   |
| Custom TCP | TCP      | `9000`     | `0.0.0.0/0` | CL client   |
| Custom UDP | UDP      | `30303`    | `0.0.0.0/0` | EL client   |
| Custom TCP | TCP      | `30303`    | `0.0.0.0/0` | EL client   |

:::warning important
The key here is to allow traffic on both TCP and UDP for the consensus layer client and the
execution layer client.
:::

#### 2. Add a node group to your cluster

In your VPC settings, enable **Auto-assign public IPv4 address** on the public subnets on which you
spin up your nodes.

This allows you to isolate your Besu node on a public subnet and separate it from the other apps and
node groups you might have running.
If you are using [EKSCTL](https://eksctl.io/), add the following snippet to your setup:

```yaml
managedNodeGroups:
  - name: ng-ethereum
    instanceType: m6a.xlarge
    desiredCapacity: 1 # Increase this capacity if you need more nodes.
    
    subnets:
      - public-subnet-id1
      - public-subnet-id2
      - public-subnet-id3
    labels: { "ng": "ethereum" }
    securityGroups:
      attachIDs: ["sg-1234..."] # The ID of the security group from the previous step.
    iam:
      withAddonPolicies:
        ebs: true
        # efs: true
    taints:
      - key: ethereum
        value: "true"
        effect: NoSchedule
      - key: ethereum
        value: "true"
        effect: NoExecute
```

If you are using [Terraform](https://www.terraform.io/), use something like the following for your
new node pool:

```yaml
    ng-ethereum = {
      desired_size = 1
      subnet_ids = module.vpc.public_subnets # Only public subnets here.
      vpc_security_group_ids  = [ sg-1234 ] # The ID of the security group from the previous step.
      instance_types = ["m6a.xlarge"]
      iam_role_name = "${local.name}-eks-ng-ethereum-role"
      taints = [
        {
          key    = "ethereum"
          value  = "true"
          effect = "NO_SCHEDULE"
        },
        {
          key    = "ethereum"
          value  = "true"
          effect = "NO_EXECUTE"
        }
      ]
      labels = {
        workloadType   = "ethereum"
      }
    ...
```

#### 3. Install the EBS or EFS drivers 

We recommend using EBS or NvME storage for your chain data.
For most cases, the [EBS drivers](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html) or
[EFS drivers](https://docs.aws.amazon.com/eks/latest/userguide/efs-csi.html) are sufficient.
However, if you are using instance stores, use the
[Local Storage Static Provisioner](https://aws.amazon.com/blogs/containers/eks-persistent-volumes-for-instance-store/)
instead.

#### 4. Set up the pod

Now that the infrastructure is set up, use `hostNetworking` to bind your pod to the host and use the
host node's public IP for your Besu node.

First, add the following snippet to your StatefulSet:

```yaml
template:
  metadata:
    labels:
      ...
    spec:
      hostNetwork: true
      dnsPolicy: ClusterFirstWithHostNet
      affinity: ...
```

Next, add an init container and a shared volume to store the public IP.
The init container `init` runs and gets the public IP of the host using the AWS metadata service and
saves it to a local shared volume `besu-pip` (between the init container and the Besu pod).

```yaml
template:
  metadata:
    labels:
      ...
    spec:
      hostNetwork: true
      dnsPolicy: ClusterFirstWithHostNet
      affinity: ...
      initContainers:
      - name: init
        image: alpine/curl:8.5.0
        volumeMounts:
          - name: pip
            mountPath: /pip
          - name: shared-jwt
            mountPath: /jwt           
          - name: besu-data
            mountPath: /data
        securityContext:
          runAsUser: 0                        
        command:
        - /bin/bash
        - -xec
        - |
          # Get the existing public IP to associate with.
          PUBLIC_IP_TO_ASSOCIATE=$(curl http://ifconfig.me/ip)
          # Store the public IP in a local file to be used by the container.
          echo -ne "$PUBLIC_IP_TO_ASSOCIATE" > /pip/ip
          
          # Create the JWT key.
          openssl rand -hex 32 | tr -d "\n" > /jwt/jwtSecret.hex

          # Update permissions on the data volume (if needed).
          chown -R 1000:1000 /data

      containers:
      ...

      volumes:
      - name: pip
        emptyDir: {}
      - name: jwt
        emptyDir: {}
      - name: besu-data
        persistentVolumeClaim:
          claimName: besu-pvc
      - name: teku-data
        persistentVolumeClaim:
          claimName: teku-pvc
```

When you start Besu up in the pod, use the text file in `pip` as your `p2p-host`, which allows
traffic in and out as normal.

```yaml
template:
  metadata:
    labels:
      ...
    spec:
      hostNetwork: true
      dnsPolicy: ClusterFirstWithHostNet
      affinity: ...
      initContainers:
      - name: init
        image: alpine/curl:8.5.0
        volumeMounts:
          - name: pip
            mountPath: /pip
          - name: shared-jwt
            mountPath: /jwt             
          - name: besu-data
            mountPath: /data
        securityContext:
          runAsUser: 0                        
        command:
        - /bin/bash
        - -xec
        - |
          # Get the existing public IP to associate with.
          PUBLIC_IP_TO_ASSOCIATE=$(curl http://ifconfig.me/ip)
          # Store the public IP in a local file to be used by the container.
          echo -ne "$PUBLIC_IP_TO_ASSOCIATE" > /pip/ip
          
          # Create the JWT key.
          openssl rand -hex 32 | tr -d "\n" > /jwt/jwtSecret.hex

          # Update permissions on the data volume (if needed).
          chown -R 1000:1000 /data

      containers:
      - name: besu
        image: hyperledger/besu:latest
        volumeMounts:
          - name: pip
            mountPath: /pip
            readOnly: true
          - name: shared-jwt
            mountPath: /jwt               
          - name: besu-data
            mountPath: {{ .Values.settings.dataPath }}
        ports:
          - name: elc-rpc
            containerPort: 8545
            protocol: TCP
          - name: elc-ws
            containerPort: 8546
            protocol: TCP
          - name: elc-rlpx
            containerPort: 30303
            protocol: TCP
          - name: elc-discovery
            containerPort: 30303
            protocol: UDP
          - name: elc-metrics
            containerPort: 8545
            protocol: TCP
          - name: elc-engine
            containerPort: 8551
            protocol: TCP         
        command:
          - /bin/sh
          - -c
        args:
          - |
            pip=$(cat /pip/ip)
            /opt/besu/bin/besu \
              --p2p-host=${pip} \
              ...
      
      - name: teku
        image: consensys/teku:develop
        ...

      volumes:
      - name: pip
        emptyDir: {}
      - name: jwt
        emptyDir: {}
      - name: besu-data
        persistentVolumeClaim:
          claimName: besu-pvc
      - name: teku-data
        persistentVolumeClaim:
          claimName: teku-pvc          
```


## Azure AKS

The process for Azure is much the same as that of AWS with a couple of differences.

#### 1. Create a Network Security Group (NSG)

Create a NSG with ports `30303` and `9000` (or equivalent) open for TCP and UDP.
Bind this NSG with the subnet you've designated for your Ethereum nodes to ensure that nodes initiated within this subnet will automatically inherit these security rules.


#### 2. Add a node pool to your cluster

In Azure all machines get allocated a public IP by default but you need to turn this on for your
new node pool.

If you are using [Terraform](https://www.terraform.io/), use something like the following for your
new node pool:

```yaml
  node_pools = {
    ...
    ethereum = {
      name                   = "ethereum"
      vm_size                = "Standard_D8as_v5"
      vnet_subnet_id         = lookup(module.vnet.vnet_subnets_name_id, "subnet-....") # The ID of the security group from the previous step.
      os_disk_size_gb        = 100
      min_count              = 1
      max_count              = 10
      enable_auto_scaling    = true
      enable_node_public_ip  = true     # This flag lets every node keep its public ip
      enable_host_encryption = true
      node_taints            = ["ethereum=true:NoSchedule", "ethereum=true:NoExecute"]
      node_labels = {
        "workloadType" = "ethereum"
      }
    }

    ...
  }
```


#### 3. Use Azure StorageClasses to suit your needs

We recommend using either Azure Disk or Azure Files to store your chain data
using the [CSI storage drivers](https://learn.microsoft.com/en-us/azure/aks/csi-storage-drivers).
If you are using a Terraform to provision your cluster e.g.
[terraform-azurerm-aks](https://registry.terraform.io/modules/Azure/aks/azurerm/latest)
the CSI drivers are provisioned automatically for you.

