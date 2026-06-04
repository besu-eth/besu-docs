---
sidebar_position: 1
description: Create and run a minimal Besu plugin.
---

# Quickstart

Follow this quickstart to walk through the essential workflow to create and deploy a Besu plugin.

## Steps

### 1. Add the Plugin API dependency

Add the `org.hyperledger.besu:besu-plugin-api` dependency to your build. Use the Plugin API version
that matches the Besu version you are developing against.

### 2. Implement `BesuPlugin`

Create a class that implements `BesuPlugin`. Besu calls `register(ServiceManager)` early in startup.
Store the `ServiceManager` so your plugin can retrieve Besu services later.

```java
package example;

import org.hyperledger.besu.plugin.BesuPlugin;
import org.hyperledger.besu.plugin.ServiceManager;

public class ExamplePlugin implements BesuPlugin {
  private ServiceManager serviceManager;

  @Override
  public String getName() {
    return "example";
  }

  @Override
  public void register(final ServiceManager serviceManager) {
    this.serviceManager = serviceManager;
  }

  @Override
  public void start() {}

  @Override
  public void stop() {}
}
```

### 3. Register the plugin for discovery

Besu discovers plugin JARs with Java `ServiceLoader`. Register your implementation by including a
service provider entry for `org.hyperledger.besu.plugin.BesuPlugin`.

You can generate the entry with `@AutoService(BesuPlugin.class)`, or add the file manually at:

```text
META-INF/services/org.hyperledger.besu.plugin.BesuPlugin
```

The file must contain the fully qualified class name of your plugin implementation.

### 4. Retrieve Besu services

Use `ServiceManager.getService(...)` to retrieve services. The method returns `Optional` because a
service might not be available in the current Besu version, configuration, or lifecycle phase.

```java
serviceManager
    .getService(org.hyperledger.besu.plugin.services.BesuEvents.class)
    .ifPresent(events -> {
      // Register event listeners in start(), and remove them in stop().
    });
```

Most plugins register CLI options or RPC endpoints in `register()`, then begin runtime work in
`start()`.

### 5. Build and run the plugin

Package the plugin and its required runtime dependencies into a plugin JAR, copy it to Besu's
`plugins` directory, and start Besu.

If you want to load only specific plugins, use
[`--plugins`](../../public-networks/reference/cli/options.md#plugins). If you omit `--plugins`,
Besu automatically loads plugins found in the `plugins` directory.

## Next steps

- [Build a plugin](../how-to/build-a-plugin.md)
- [Configure a plugin](../how-to/configure-a-plugin.md)
- [Plugin lifecycle](plugin-lifecycle.md)
- [Troubleshoot](../how-to/troubleshoot.md)
