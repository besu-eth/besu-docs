---
title: Deploy Besu across multiple Kubernetes clusters across multiple cloud providers
description: Deploy Besu across multiple Kubernetes clusters across multiple cloud providers
sidebar_position: 7
---

# Deploy Besu across multiple Kubernetes clusters across multiple cloud providers

The following tutorial is just one of many ways to connect nodes in one K8S cluster to nodes in another K8S
cluster across multiple cloud provider - in this case [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/)
and [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-au/products/kubernetes-service)

This tutorial walks you through using AWS as the main cluster and adding an extra node in Azure to the existing pool

## Overview

### Steps

#### 1. Create an AWC VPC 

1. Use a CIDR block that doesn't overlap with that of Azure eg `10.0.0.0/16`
2. Create the EKS cluster as normal and use the default Kubernetes service range `172.20.0.0/16`

#### 2. Create an Azure Virtual Network

1. Use a CIDR block that doesn't overlap with that of AWS eg `10.1.0.0/16`
2. It is also recommended to create a subnet for the Gateway and use a CIDR of `/24` eg `10.1.1.0/24`
3. Create the AKS cluster as normal and use the different Kubernetes service range
 `10.2.0.0/16` (the default `10.0.0.0/16` overlaps with the AWS VPC CIDR block)

#### 3. Connect the AWS VPC and Azure VNet with a site to site VPN

##### 3.1 On the Azure side create a Virtual Network Gateway

In the AZure VNet, create a Virtual Network Gateway with the following settings

| Setting              | Value |
|----------------------|-------------|
| SKU                  | VpnGw2AZ (default) |
| Gateway Type         | VPN         |
| VPN Type             | Route-based |
| Virtual Network      | Use the network in step 2.1 |
| Gateway subnet       | Use the subnet from step 2.2 |
| Public IP Address    | Create new |
| Enable active-active mode | Disabled |
| Configure BGP        | Disabled |

The other settings can remain as defaults or set to suit your requirements. Once this is complete
please note down the IP address that was created for the Virtual Network Gateway

##### 3.2 On the AWS side create a Customer Gateway

This Customer Gateway points to the Azure Virtual Network Gateay from step 3.1 

| Setting              | Value |
|----------------------|-------------|
| Routing              | Static |
| IP Address           | Use the IP of the Virtual Network Gateway in step 3.1 |

The other settings can remain as defaults or set to suit your requirements

##### 3.3 On the AWS side create a Virtual Private Gateway 

Create an AWS Virtual Private Gateway and specify the name.

| Setting              | Value |
|----------------------|-------------|
| ASN              | Amazon Default ASN |

##### 3.4 On the AWS side attach the Virtual Private Gateway to the VPC

Select the Virtual Private Gateway and then select Actions and `Attach to VPC` and select
the VPC in step 1

##### 3.5 On the AWS side create the Site to Site VPN Connection

Create an AWS Site-to-Site VPN Connection with the following settings

| Setting              | Value |
|----------------------|-------------|
| Target Gateway Type  | Virtual Private Gateway |
| Virtual Private Gateway | Select the Virtual Private Gateway from step 3.3 |
| Customer Gateway | Existing |
| Customer Gateway ID  | Select the Customer Gateway from step 3.2 |
| Routing Options | Static |
| Static IP Prefixes | Use the Azure VNet CIDR from step 2.1 |
| Tunnel inside IP version | IPV4 |

The other settings can remain as defaults or set to suit your requirements

##### 3.6 Download the VPN connection config file

Select the VPN connection once it has been created and use the following options and then save the file locally

| Setting              | Value |
|----------------------|-------------|
| Vendor  | Generic |
| Platform | Generic |
| Software  | Vendor Agnostic |

Save the file and open it. In there you will find the shared keys and putlic address for each tunnel created above

You need to use the `Pre-Shared Key` in the next step in Azure as well as the `public IP` of Tunnel 1 of the VPN
connection (There are two created, and we just use #1 for this example)

##### 3.7 On the Azure side create a Local Network Gateway

Create an Azure Local Network Gateway using the pubic IP address from step 3.6 of the tunnel and the CIDR block of
the AWS VPC

| Setting              | Value |
|----------------------|-------------|
| Endpoint | IP Address |
| IP Address | Use the IP address from step 3.6 of the VPN Connection |
| Address space | Use the AWS CIDR block from step 1 |
| Configure BGP | No |

##### 3.8 On the Azure side create a Connection on the existing Virtual Network Gateway

Open the settings of the Virtual Network Gateway created in step 3.1. Then select `Connections` and `Add`.
Use the settings below

| Setting              | Value |
|----------------------|-------------|
| Connection Type | Site-to-Site IPSec |
| Virtual Network Gateway | Use the Virtual Network Gateway created in step 3.1 |
| Local Network Gateway | Use the Local Network Gateway created in step 3.7 |
| Authentication method | Shared Key (PSK) |
| Shared Key(PSK) | Use the key from the config file downloaded in step 3.6 |
| IKE Protocol | IKEv2 |
| BGP | Disabled |
| Use policy based traffic selector | Disabled |

The other settings can remain as defaults or set to suit your requirements

This may take a few minutes to setup. Once complete you should see the Tunnel from step 3.5 status show as `UP`

##### 3.9 High Availability on the Azure side

If you need high availability or this is a production setup, please use Tunnel #2 to create a second
Local Network Gateway (step 3.7) and then a second connection on the Virtual Network Gateway (step 3.8)

##### 3.10 On AWS update the subnet route table

On the AWS side please update the route tables of your subnets to use the Virtual gateway and set the destination
as the Azure VNet CIDR block

| Destination              | Target |
|----------------------|-------------|
| 10.1.0.0/16 | vgw -..... |

Please replace the Azure CIDR block with that of your own and select the id of the Virtual Gateway from step 3.3

:::caution

Also note that if each subnet has a different route table, then this change needs to be added to each subnet that you
EKS nodes with Besu running on them

:::

#### 4. Update security groups to allow traffic 

##### 4.1 On AWS side

Find the security group of the node pool that contains your Besu nodes and add this in to the `Inbound` rules to allow
traffic from the Azure VNet

| Type       | Protocol | Port range | Destination | Description |
|------------|----------|------------|-------------|-------------|
| Custom UDP | UDP      | `30303`    | `10.1.0.0/16` | Azure   |
| Custom TCP | TCP      | `30303`    | `10.1.0.0/16` | Azure   |
| Custom TCP | TCP      | `8545 `    | `10.1.0.0/16` | Azure   |

Please update the CIDR to only be a subnet CIDR if you have your nodes in select subnets.

##### 4.2 On Azure side

Find the network security group of the node pool that contains your Besu nodes and add this in to the `Inbound` rules to allow
traffic from the Azure VNet

| Type       | Protocol | Port range | Destination | Name |
|------------|----------|------------|-------------|-------------|
| UDP | UDP      | `30303`    | `10.0.0.0/16` | AWS   |
| TCP | TCP      | `30303`    | `10.0.0.0/16` | AWS   |
| TCP | TCP      | `8545 `    | `10.0.0.0/16` | AWS   |

Please update the CIDR to only be a subnet CIDR if you have your nodes in select subnets.

