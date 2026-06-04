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

### 1. Add the Besu Gradle Plugin

Besu provides a [Gradle plugin](https://github.com/Consensys/besu-plugin-gradle-plugin) to simplify
the plugin developer experience, enabling you to bootstrap a new plugin project easily.
The Gradle plugin automatically adds and manages dependencies, and packages the plugin artifacts when
you distribute the project.

In a new plugin project, apply the Gradle plugin (`net.consensys.besu-plugin-distribution`), and set the Besu version using `besuPlugin`:

```groovy title="build.gradle"
plugins {
    id 'net.consensys.besu-plugin-distribution' version '0.2.1'
}

besuPlugin {
    besuVersion = '26.6.0'
}
```

### 2. Implement `BesuPlugin`

Create a class that implements `BesuPlugin`.

The three required methods are `register`, `start`, and `stop`.
Besu calls `register(ServiceManager)` early in startup;
this is the only time the `ServiceManager` is provided, so store it for later use.
`getName` is optional; it defaults to the fully qualified class name, but overriding it with a short 
string gives your plugin a readable identifier.

```java title="ExamplePlugin.java"
package example;

import org.hyperledger.besu.plugin.BesuPlugin;
import org.hyperledger.besu.plugin.ServiceManager;

public class ExamplePlugin implements BesuPlugin {
  private ServiceManager context;

  @Override
  public String getName() {
    return "example";
  }

  @Override
  public void register(final ServiceManager context) {
    this.context = context;
  }

  @Override
  public void start() {}

  @Override
  public void stop() {}
}
```

### 3. Register the plugin for discovery

Besu discovers plugin JARs with Java `ServiceLoader`.
Register your plugin by including a service provider entry for
`org.hyperledger.besu.plugin.BesuPlugin`.
You can generate the entry with `@AutoService(BesuPlugin.class)`:

```java title="ExamplePlugin.java"
import com.google.auto.service.AutoService;
import org.hyperledger.besu.plugin.BesuPlugin;

@AutoService(BesuPlugin.class)
public class ExamplePlugin implements BesuPlugin { ... }
```

### 4. Register CLI options

Use `register` to add CLI options to the Besu command line.
Retrieve the `PicoCLIOptions` service and call `addPicoCLIOptions`, passing a short namespace string and the object whose fields carry PicoCLI `@Option` annotations.

Besu auto-prepends `--plugin-` to the namespace you provide, so the actual required option prefix
is `--plugin-<namespace>-`.
Passing `"example"` means every `@Option` name must start with `--plugin-example-`.

```java title="ExamplePlugin.java"
import org.hyperledger.besu.plugin.services.PicoCLIOptions;
import picocli.CommandLine.Option;

public class ExamplePlugin implements BesuPlugin {
  private ServiceManager context;

  @Option(names = "--plugin-example-enabled", description = "Enable the example plugin feature.")
  private boolean enabled = false;

  @Override
  public void register(final ServiceManager context) {
    this.context = context;
    context
        .getService(PicoCLIOptions.class)
        .ifPresent(cli -> cli.addPicoCLIOptions("example", this));
  }
  ...
}
```

### 5. Retrieve services and start

Use `start` to retrieve Besu services and begin runtime work.
Most services are not available until `start` is called — calling `getService` in `register` will return 
an empty `Optional` for most services.

```java title="ExamplePlugin.java"
import org.hyperledger.besu.plugin.services.BesuEvents;

@Override
public void start() {
  context
      .getService(BesuEvents.class)
      .ifPresent(events -> {
        // subscribe to block, transaction, or sync events
      });
}
```

### 6. Clean up in stop

Use `stop` to remove event subscriptions and release any resources your plugin holds.
Besu calls `stop` during shutdown and when disabling individual plugins.

```java title="ExamplePlugin.java"
@Override
public void stop() {
  // remove event subscriptions and release resources
}
```

### 7. Build and deploy the plugin

The Gradle plugin provides a `distZip` task that packages your plugin into a ZIP file containing only
the plugin JAR and any extra dependencies not already provided by Besu.
Build the distribution:

```bash
./gradlew distZip
```

Create the `plugins` directory in your Besu installation if it does not already exist, then unzip
the archive into it.
The `-j` flag flattens the ZIP so all JARs land directly in `plugins/`:

```bash
unzip -j build/distributions/example.zip -d /path/to/besu/plugins/
```

Start Besu.
It loads all JARs found in the `plugins` directory automatically.
To load only specific plugins, use
[`--plugins`](../../public-networks/reference/cli/options.md#plugins).

## Next steps

- [Build a plugin](../how-to/build-a-plugin.md)
- [Configure a plugin](../how-to/configure-a-plugin.md)
- [Plugin lifecycle](plugin-lifecycle.md)
- [Troubleshoot](../how-to/troubleshoot.md)
