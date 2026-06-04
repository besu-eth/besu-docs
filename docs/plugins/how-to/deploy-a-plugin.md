---
sidebar_position: 5
description: Deploy a Besu plugin.
---

# Deploy a plugin

Deploy a plugin by copying the packaged plugin JAR to Besu's `plugins` directory before starting
Besu.

If you omit [`--plugins`](../../public-networks/reference/cli/options.md#plugins), Besu loads all
plugins found in the `plugins` directory. To load only specific plugins, pass a comma-separated list
to `--plugins`.

```bash
besu --plugins=ExamplePlugin
```

In the current implementation, `--plugins` matches the simple name of the class that implements
`BesuPlugin`. The match is case-sensitive.

## Verify startup

Check Besu startup logs to confirm the plugin was detected and registered. Besu logs a plugin
registration summary that includes registered plugins and detected plugins that were skipped.

## Plugin verification

Use [`--plugins-verification-mode`](../../public-networks/reference/cli/options.md#plugins-verification-mode)
to control whether plugin verification failures stop Besu.

- `NONE` logs a warning and continues running when verification fails.
- `FULL` logs an error and stops Besu when verification fails.

The default is `NONE`.

Keep plugin-specific installation, configuration, and operating instructions in the plugin's own
documentation. Besu docs should link to major plugin examples rather than duplicating each plugin's
operator guide.
