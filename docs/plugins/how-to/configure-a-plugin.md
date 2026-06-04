---
sidebar_position: 2
description: Configure a Besu plugin.
---

# Configure a plugin

Use `PicoCLIOptions` when a plugin needs Besu startup configuration.

## Add plugin CLI options

`PicoCLIOptions` is available during `register()`. Register plugin option objects in
`register(ServiceManager)`:

```java
serviceManager
    .getService(PicoCLIOptions.class)
    .ifPresent(options -> options.addPicoCLIOptions("example", exampleOptions));
```

The namespace is the plugin namespace segment. For example, use `example`, not `plugin-example`.

Besu expects plugin options to use the plugin option prefix, such as:

```bash
--plugin-example-enabled=true
```

Plugin options can also be supplied through the Besu TOML configuration file or environment
variables using the normal Besu option naming conventions.

## Read Besu configuration

Use `BesuConfiguration` when a plugin needs selected Besu configuration values. The service exposes
values such as:

- Configured RPC HTTP host, port, and timeout.
- Data path and storage path.
- Database format.
- Minimum gas price.
- Data storage configuration.

Only use the values your plugin needs, and continue to treat the service as optional.

## Validate configuration

Validate plugin configuration during startup before the plugin begins runtime work. If the plugin
cannot run with the supplied configuration, fail with an actionable message.

For values that can change at runtime, implement
[`reloadConfiguration()`](reload-plugin-configuration.md). Keep non-reloadable values documented as
startup-only settings.
