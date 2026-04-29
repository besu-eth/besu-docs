---
title: Local playground
sidebar_position: 1
description: Deploying a Besu private network locally with Kubernetes
---

# Deploy in a local environment

The [playground](https://github.com/ConsenSys/quorum-kubernetes/tree/master/playground) was created to provide an opportunity to deploy [quorum-kubernetes](https://github.com/ConsenSys/quorum-kubernetes/) in a local environment before attempting in a live environment (such as in the cloud or on-premise). Local deployment can be done with any local Kubernetes tool. Minikube and Rancher Desktop have been tested to work, but any complete Kubernetes solution with support for `kubectl` should suffice.

## Steps

1. Navigate to the playground [`README`](https://github.com/ConsenSys/quorum-kubernetes/tree/master/playground).
1. Ensure that your system meets the requirements specified.
1. Choose your Ethereum client (Besu or GoQuorum): `quorum-besu` or `quorum-go`.
1. Choose your consensus algorithm. The playground supports Ethash (PoW, deprecated), and IBFT2 for Besu, and IBFT for GoQuorum.
1. Follow the instructions from the `README` for the chosen client and consensus algorithm folder.

## Important notes

Consider the following when deploying and developing with the playground:

- The playground is created specifically for developers and operators to become familiar with the deployment of Besu in a Kubernetes environment in preparation for going into a cloud or on-premise environment. Thus, it should **not** be deployed into a production environment.
- The playground is not a complete reflection of the `helm` charts as it does not use `Helm`, but rather static or non-templated code that is deployed through `kubectl apply -f`. This means that without `Helm` there's a significant amount of repeated code. This is fine for development but not ideal for a production environment.
- The playground uses static/hard-coded keys. Automatic key generation is only supported in `helm` charts.
- As the playground is for local development, no cloud integration or lifecycle support is offered.
