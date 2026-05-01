---
title: Permissioning plugin
description: Plugin based permissioning
sidebar_position: 2
---

# Permissioning plugin

You can define complex [permissioning](index.md) solutions by building a plugin that extends Besu functionality.

The plugin API provides a `PermissioningService` interface that currently supports connection (node) permissioning, transaction permissioning and message permissioning.

## Connection (node) permissioning

Use connection permissioning when deciding whether to restrict node access to known participants only.

## Transaction permissioning

Use transaction permissioning when deciding whether to restrict transaction processing based on transaction properties.

## Message permissioning

Use message permissioning to propagate different types of devP2P messages to particular nodes. For example, this can be used to prevent pending transactions from being forwarded to other nodes.

## Register your plugin

To enable permissioning in your plugin, implement the `PermissioningService` interface and register your providers.

```java
@AutoService(BesuPlugin.class)
public class TestPermissioningPlugin implements BesuPlugin {
  PermissioningService service;
  @Override
  public void register(final BesuContext context) {
    service = context.getService(PermissioningService.class).get();
  }
  @Override
  public void start() {
    service.registerNodePermissioningProvider((sourceEnode, destinationEnode) -> {
      // perform logic for node permissioning
      return true;
    });
    service.registerNodeMessagePermissioningProvider((destinationEnode, code) -> {
      // perform logic for message permissioning
      return true;
    });
  }
  @Override
  public void stop() {}
}
```
