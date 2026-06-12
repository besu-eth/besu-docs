---
sidebar_position: 2
description: Add CLI options and read Besu configuration.
---

# Configure a plugin

You can perform configuration-related tasks: add CLI options, read Besu configuration values, validate configuration at startup, and reload configuration at runtime.

## Prerequisites

[Set up a plugin project](set-up-a-plugin.md).

## Add plugin CLI options

Use the `register` method to add plugin-specific options to the Besu command line.

Retrieve the [`PicoCLIOptions`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/PicoCLIOptions.html) service and pass an options object to `addPicoCLIOptions`.
The options object is a plain class (or `this`) whose fields carry [PicoCLI](https://picocli.info/) `@Option` annotations.

```java
import org.hyperledger.besu.plugin.services.PicoCLIOptions;
import picocli.CommandLine.Option;

public class ExamplePlugin implements BesuPlugin {

  @Option(names = "--plugin-example-enabled", description = "Enable the example plugin feature.")
  private boolean enabled = false;

  @Override
  public void register(final ServiceManager serviceManager) {
    this.serviceManager = serviceManager;
    serviceManager
        .getService(PicoCLIOptions.class)
        .ifPresent(cli -> cli.addPicoCLIOptions("example", this));
  }
  ...
}
```

:::warning Important
Plugin CLI option names must use the prefix `--plugin-<namespace>-`, where `<namespace>` is the value you pass to `addPicoCLIOptions`.
For example, passing `"example"` means every `@Option` name must start with `--plugin-example-`.
:::

Once registered, plugin options are automatically accepted through the Besu TOML configuration
file and as environment variables in addition to the CLI option, using the standard Besu naming
conventions.

## Read Besu configuration

Use [`BesuConfiguration`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/BesuConfiguration.html) when your plugin needs selected Besu configuration values.
The service is available from `register` onward.

```java
import org.hyperledger.besu.plugin.services.BesuConfiguration;

@Override
public void register(final ServiceManager serviceManager) {
    serviceManager
        .getService(BesuConfiguration.class)
        .ifPresent(config -> {
            // Use config values, for example config.getDataPath().
        });
}
```

Available values include:

- Configured RPC HTTP host, port, and timeout.
- Data path and storage path.
- Database format.
- Minimum gas price.
- Data storage configuration.

Treat `BesuConfiguration` as optional and use only the values your plugin needs.

## Validate plugin configuration

Validate plugin configuration at startup, before the plugin begins runtime work.
If the plugin can't run with the supplied configuration, throw an exception with an actionable
message so the operator knows what to fix.

```java
@Override
public void start() {
    if (enabled && targetUrl == null) {
        throw new IllegalStateException(
            "plugin-example-url is required when --plugin-example-enabled is true");
    }
    // Proceed with startup.
}
```

## Reload plugin configuration

Implement `reloadConfiguration` when your plugin can apply updated configuration values without
restarting Besu.

```java
@Override
public CompletableFuture<Void> reloadConfiguration() {
  // Reload plugin-owned configuration here.
  return CompletableFuture.completedFuture(null);
}
```

Besu calls this method through the
[`plugins_reloadPluginConfig`](../../public-networks/reference/api/index.md#plugins_reloadpluginconfig)
JSON-RPC method.
The method belongs to the `PLUGINS` API group, which is disabled by default.
Enable it with [`--rpc-http-api`](../../public-networks/reference/cli/options.md#rpc-http-api) or
[`--rpc-ws-api`](../../public-networks/reference/cli/options.md#rpc-ws-api).

Calling `plugins_reloadPluginConfig` without parameters reloads all plugins.
Supplying a plugin name reloads only that plugin.
Besu matches the name against the value returned by `BesuPlugin.getName`.

Only reload values your plugin can apply safely while Besu is running.
Leave startup-only settings unchanged until the next restart, and document them as non-reloadable.
