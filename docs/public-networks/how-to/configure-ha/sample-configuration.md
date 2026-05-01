---
title: Sample load balancer configurations
sidebar_position: 1
description: Sample load balancers
---

# Sample load balancer configurations

## AWS

For AWS, we recommend the Classic Load Balancer. The Classic Load Balancer is the easiest to configure and work with. Register the Besu instances to the load balancer and use the [liveness endpoint](../use-besu-api/json-rpc.md#readiness-and-liveness-endpoints) for health checks.

For finer grain control, use the Application Load Balancer:

- Configure one target group with n nodes.
- Configure multiple listeners with one per port (for example, `30303`, `8545`) you are using and route to the target group.
- Use the [liveness endpoint](../use-besu-api/json-rpc.md#readiness-and-liveness-endpoints) for health checks.
- Register the Besu instances multiple times with different ports. This is like configuring microservices on Elastic Container Service (ECS) or Elastic Kubernetes Service (EKS).

### HTTPS redirection

With either AWS load balancer, you can add certificates using ACM (Amazon Certificate Manager), add them to the load balancers, and redirect all HTTP calls to HTTPS.

## Elastic Kubernetes Service

For Elastic Kubernetes Service (AWS Kubernetes service) use the same load balancer configuration as when running nodes in Kubernetes. Use labels to specify nodes for the load balanced group.

## Manual configurations

Where applicable, we strongly recommend using service discovery. That is, pair your load balancer configuration with something that dynamically detects new nodes and removed failed nodes.

For Nginx, use multiple upstreams (one for each port). Pair each upstream with a separate server block.

```conf title="Upstreams paired with server blocks"
upstream discovery_tcp_30303 {
    server 10.0.1.1:30303;
    server 10.0.1.2:30303;
}

upstream rpc_tcp_8545 {
    server 10.0.1.1:8545;
    server 10.0.1.2:8545;
}

server {
    listen 30303;
    server_name some.host;
    location / {
        proxy_pass http://discovery_tcp_30303;
    }
}

server {
    listen 8545;
    server_name some.host;
    location / {
        proxy_pass http://rpc_tcp_8545;
    }
}
...
```

For HAProxy, create multiple backend and frontend sets.

```text title="Multiple backend and frontend sets"
frontend discovery-tcp-30303
    bind *:30303
    acl ...
    ...
    default_backend back-discovery-tcp-30303

frontend rpc-tcp-8545
    bind *:8545
    acl ...
    ...
    default_backend back-rpc-tcp-8545

backend back-discovery-tcp-30303
    balance leastconn
    server node-01 10.0.1.1:30303 weight 1 check
    server node-02 10.0.1.2:30303 weight 1 check
    option ...
    timeout server 600s

backend back-rpc-tcp-8545
    balance leastconn
    server node-01 10.0.1.1:8545 weight 1 check
    server node-02 10.0.1.2:8545 weight 1 check
    option ....
    timeout server 600s
...
```

### HTTPS redirection

To add HTTPS capability, update the above server blocks to include the certificates and specific ciphers. If you require an HTTP to HTTPS redirection, add separate blocks to return a 301 code with the new URI.
