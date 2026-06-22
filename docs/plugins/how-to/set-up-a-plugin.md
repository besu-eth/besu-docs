---
sidebar_position: 1
description: Set up, implement, and register a plugin.
toc_max_heading_level: 3
---

# Set up a plugin project

Configure the build for a Besu plugin project, implement the `BesuPlugin` interface,
and register the plugin so Besu can discover it at startup.

## Prerequisites

- Java 25+.
  You can install Java using `brew install openjdk@25` or manually install the
  [Java JDK](https://www.oracle.com/java/technologies/downloads).
- [Gradle](https://gradle.org/install/).

## Steps

### 1. Configure your build

Besu provides a [Gradle plugin](https://github.com/Consensys/besu-plugin-gradle-plugin) to simplify
the plugin developer experience, enabling you to bootstrap a new plugin project easily.
The plugin:

- Adds the Maven repositories required to fetch Besu dependencies.
- Pre-populates the compile classpath with everything Besu provides, using the Besu BOM and an
  artifact catalog.
- Produces a slim distribution ZIP that excludes JARs already on Besu's classpath.

In a new plugin project, apply the Gradle plugin (`net.consensys.besu-plugin-distribution`), and set the Besu version you want to compile your plugin against:

```groovy title="build.gradle"
plugins {
    id 'net.consensys.besu-plugin-distribution' version '0.2.1'
}

besuPlugin {
    besuVersion = '26.6.0'
}
```

:::note
The Gradle plugin resolves the matching Besu API JARs as compile-time dependencies, so your plugin builds against that version's API surface.
:::

#### Multi-module projects

In a multi-module project, apply `net.consensys.besu-plugin-library` to modules that are shared
libraries rather than plugins themselves.
Apply `net.consensys.besu-plugin-distribution` only to modules that directly expose `BesuPlugin`
implementations.

```groovy title="library/build.gradle"
plugins {
    id 'net.consensys.besu-plugin-library' version '0.2.1'
}
```

Library modules are excluded from the plugin distribution ZIP.

#### Declare extra dependencies

Only declare dependencies that Besu does not already provide.
The Gradle plugin pre-populates the classpath from the Besu BOM and artifact catalog, so most
Besu-related libraries are already available without an explicit declaration.

:::warning
Bundling a JAR that Besu already provides causes classloading conflicts at runtime and may prevent
your plugin from loading.
:::

#### Configure the build manually

If you prefer not to use the Gradle plugin, add `besu-plugin-api` to your build, matching the
Besu version you are targeting:

```groovy title="build.gradle"
dependencies {
    compileOnly 'org.hyperledger.besu:besu-plugin-api:26.6.0'
}
```

Use `compileOnly` because `besu-plugin-api` is provided by Besu at runtime and must not be
bundled in your JAR.
You are responsible for managing all other Besu dependencies and configuring the packaging
task to produce a slim distribution.

### 2. Generate the Gradle wrapper

Generate the [Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) so the
project builds with a consistent Gradle version.
This creates the `gradlew` script used to [build and deploy the plugin](deploy-a-plugin.md):

```bash
gradle wrapper
```

### 3. Implement the plugin class

Create a class that implements [`BesuPlugin`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/BesuPlugin.html).
The three required methods are `register`, `start`, and `stop`.

Besu calls `register(ServiceManager)` early in startup.
[`ServiceManager`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/ServiceManager.html) is the interface through which your plugin accesses all Besu services.
This is the only time it is provided, so store it in a field for later use.

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

### 4. Register the plugin for discovery

Besu discovers plugin classes using Java's `ServiceLoader`.
Register your plugin by including a service provider entry for `BesuPlugin`.
You can generate the entry using Google's `@AutoService` annotation processor:

```java title="ExamplePlugin.java"
import com.google.auto.service.AutoService;
import org.hyperledger.besu.plugin.BesuPlugin;

@AutoService(BesuPlugin.class)
public class ExamplePlugin implements BesuPlugin { ... }
```

The annotation processor generates the `META-INF/services` entry at compile time.

#### Create a service file manually

If you prefer not to use the annotation processor, you can manually create the following file under `src/main/resources`:

```text
META-INF/services/org.hyperledger.besu.plugin.BesuPlugin
```

The file must contain the fully qualified class name of each `BesuPlugin` implementation, one
per line:

```text
example.ExamplePlugin
```

## Next steps

- Learn about the [plugin lifecycle](../get-started/plugin-lifecycle.md).
- Integrate [events and metrics](../services/events-and-metrics.md), [custom RPC endpoints](../services/custom-rpc-endpoints.md),
  and other plugin services.
- When you're ready to ship, [build and deploy the plugin](deploy-a-plugin.md).
- [Troubleshoot](troubleshoot.md) common issues.
