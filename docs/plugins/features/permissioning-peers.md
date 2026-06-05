---
sidebar_position: 6
description: Extend permissioning and peer-related behavior from a plugin.
---

# Permissioning and peers

Use permissioning and peer services to influence network access or interact with peer connections.

## Permissioning

`PermissioningService` lets plugins register:

- Node connection permissioning providers.
- Transaction permissioning providers.
- Node message permissioning providers.

Use this service for plugins that provide allowlisting or custom permission decisions.

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
