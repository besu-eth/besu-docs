---
sidebar_position: 6
description: Extend permissioning and peer-related behavior.
---

# Permissioning and peers

Use permissioning and peer services to influence network access or interact with peer connections.

## Permissioning

`PermissioningService` lets plugins register providers for:

- Node connection permissioning - Restrict node access to known participants only.
- Transaction permissioning - Restrict transaction processing based on transaction properties.
- Node message permissioning - Propagate different types of devP2P messages to particular nodes. 
  For example, this can be used to prevent pending transactions from being forwarded to other nodes.

For example, register a node connection permissioning provider:

```java
@Override
public void register(final ServiceManager context) {
  this.serviceManager = context;
  serviceManager
      .getService(PermissioningService.class)
      .ifPresent(
          permissioning ->
              permissioning.registerNodePermissioningProvider(nodeConnectionProvider));
}
```

The plugin supplies the provider implementation.

## Peers

`P2PService` exposes methods to:

- Enable or disable discovery.
- Get peer counts and peer connections.
- Subscribe to peer connect and disconnect events.
- Subscribe to messages for a capability.
- Send messages to peers.
- Disconnect peers.

Use `P2PService` for plugins that need peer visibility or direct peer interactions.

For example, read the current peer count and subscribe to connection events:

```java
@Override
public void start() {
  serviceManager
      .getService(P2PService.class)
      .ifPresent(
          p2p -> {
            int peerCount = p2p.getPeerCount();
            p2p.subscribeConnect(connection -> {});
            p2p.subscribeDisconnect((connection, reason, initiatedByPeer) -> {});
          });
}
```
