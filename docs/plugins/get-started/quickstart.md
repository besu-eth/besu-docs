---
sidebar_position: 1
description: Create and run a minimal Besu plugin.
---

# Quickstart

Follow this quickstart to learn the essential workflow to create and deploy a Besu plugin.

## Prerequisites

- [JDK 25](https://adoptium.net/) or later
- [Gradle](https://gradle.org/install/)
- A [Besu installation](../../public-networks/get-started/install/index.md)

## Steps

### 1. Set up your project

A Besu plugin is a standalone Java project; create it in a separate directory from your Besu
installation.

Besu provides a [Gradle plugin](https://github.com/Consensys/besu-plugin-gradle-plugin) to simplify
the plugin developer experience.
It automatically adds and manages dependencies, and packages the plugin artifacts when you
distribute the project.

In your plugin project, apply the latest version of the [Gradle plugin](https://github.com/Consensys/besu-plugin-gradle-plugin)
(`net.consensys.besu-plugin-distribution`) and set the Besu version you want to compile your plugin against:

```groovy title="build.gradle"
plugins {
    id 'net.consensys.besu-plugin-distribution' version '0.2.1'
}

besuPlugin {
    besuVersion = '26.6.0'
}
```

### 2. Implement the plugin class

Create a class that implements [`BesuPlugin`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/BesuPlugin.html).
The three required methods are `register`, `start`, and `stop`.

Besu calls `register(ServiceManager)` early in startup.
[`ServiceManager`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/ServiceManager.html) is the interface through which your plugin accesses all Besu services.
Store `ServiceManager` in a field if your plugin needs to retrieve services later.

The `getName` method is optional; it defaults to the fully qualified class name, but overriding it with
a short string gives your plugin a readable identifier.

```java title="ExamplePlugin.java"
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

Besu discovers plugin classes using Java's `ServiceLoader`.
Register your plugin by including a service provider entry for `BesuPlugin`.
You can generate the entry using Google's `@AutoService` annotation processor:

```java title="ExamplePlugin.java"
package example;

import org.hyperledger.besu.plugin.BesuPlugin;
import org.hyperledger.besu.plugin.ServiceManager;
// highlight-next-line
import com.google.auto.service.AutoService;

// highlight-next-line
@AutoService(BesuPlugin.class)
public class ExamplePlugin implements BesuPlugin { ... }
```

### 4. Register CLI options

Use the `register` method to add plugin CLI options to the Besu command line.
Retrieve the [`PicoCLIOptions`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/PicoCLIOptions.html) service and call `addPicoCLIOptions`, passing a short namespace string and 
the object whose fields carry [PicoCLI](https://picocli.info/) `@Option` annotations.

```java title="ExamplePlugin.java"
// highlight-start
import org.hyperledger.besu.plugin.services.PicoCLIOptions;
import picocli.CommandLine.Option;
// highlight-end

public class ExamplePlugin implements BesuPlugin {
  private ServiceManager serviceManager;

// highlight-start
  @Option(names = "--plugin-example-enabled", description = "Enable the example plugin feature.")
  private boolean enabled = false;
// highlight-end

  @Override
  public void register(final ServiceManager serviceManager) {
    this.serviceManager = serviceManager;
// highlight-start
    serviceManager
        .getService(PicoCLIOptions.class)
        .ifPresent(cli -> cli.addPicoCLIOptions("example", this));
// highlight-end  
  }
  ...
}
```

:::warning Important
Plugin CLI option names must use the prefix `--plugin-<namespace>-`, where `<namespace>` is the value you pass to `addPicoCLIOptions`.
For example, passing `"example"` means every `@Option` name must start with `--plugin-example-`.
:::

### 5. Retrieve services and start

Use `start` to retrieve Besu services and begin runtime work.
Services that expose runtime data (such as events, metrics, and world state) only become available at `start`.
Learn more about [when services are available](plugin-lifecycle.md#service-availability).

The following example retrieves [`BesuEvents`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/BesuEvents.html):

```java title="ExamplePlugin.java"
import org.hyperledger.besu.plugin.services.BesuEvents;

@Override
public void start() {
  serviceManager
      .getService(BesuEvents.class)
      .ifPresent(events -> {
        // Subscribe to block, transaction, or sync events.
      });
}
```

### 6. Clean up in stop

Use `stop` to remove event subscriptions and release any resources your plugin holds.
Besu calls `stop` during shutdown and when disabling individual plugins.

```java title="ExamplePlugin.java"
@Override
public void stop() {
  // Remove event subscriptions and release resources.
}
```

### 7. Build and deploy the plugin

The Gradle plugin provides a `distZip` task that packages your plugin into a ZIP file containing only
the plugin JAR and any extra dependencies not already provided by Besu.
Build the distribution:

```bash
./gradlew distZip
```

Create a `plugins` directory at the root of your Besu installation if it doesn't already exist.
Then unzip the archive into it.
The `-j` flag flattens the ZIP so all JARs land directly in `plugins/`:

```bash
unzip -j build/distributions/example.zip -d /path/to/besu/plugins/
```

Start Besu.
It loads all JARs found in the `plugins` directory automatically.
To load only specific plugins, use
[`--plugins`](../../public-networks/reference/cli/options.md#plugins).

:::tip Deploy using Docker
See [Deploy a plugin](../how-to/deploy-a-plugin.md) to learn how to deploy your plugin using a Besu Docker image.
:::

## Next steps

- Learn about the [plugin lifecycle](plugin-lifecycle.md).
- Integrate different [services](/plugins/services) into your plugin.
- See example [open source plugins](../reference/resources.md).
