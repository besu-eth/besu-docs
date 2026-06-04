---
sidebar_position: 1
description: Build and package a Besu plugin.
---

# Build a plugin

Build a Besu plugin as a Java project that depends on `org.hyperledger.besu:besu-plugin-api`,
implements `BesuPlugin`, and registers the implementation for Java `ServiceLoader` discovery.

## Add the Plugin API dependency

Use the `besu-plugin-api` version that matches the Besu version you are developing against.

Keep Besu-provided APIs separate from dependencies that must be bundled with your plugin. If your
plugin needs extra runtime libraries, package them with the plugin distribution.

## Implement the plugin class

Your plugin class must implement `org.hyperledger.besu.plugin.BesuPlugin`.

At minimum, implement:

- `register(ServiceManager)` to store the `ServiceManager` and perform early registration.
- `start()` to begin runtime work.
- `stop()` to clean up runtime work.

Override `getName()` if the default class name is not the name you want Besu to use for
plugin-specific actions such as reload.

## Register the service provider

Besu discovers plugins with Java `ServiceLoader`. Add a service provider entry for
`org.hyperledger.besu.plugin.BesuPlugin`.

You can use `@AutoService(BesuPlugin.class)` to generate the entry, or create this file manually:

```text
META-INF/services/org.hyperledger.besu.plugin.BesuPlugin
```

The file must contain the fully qualified name of the plugin implementation class.

## Package the plugin

Create a JAR that includes:

- Your plugin implementation.
- The `META-INF/services` provider entry.
- Any dependencies your plugin needs at runtime that Besu does not provide.

After building, [deploy the plugin](deploy-a-plugin.md) by copying the JAR to Besu's `plugins`
directory.
