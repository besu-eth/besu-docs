---
sidebar_position: 4
description: Build and deploy a plugin.
---

# Deploy a plugin

Build your plugin distribution and deploy it to a running Besu installation.

## Prerequisites

- A completed Besu plugin.
  See how to [set up a plugin project](set-up-a-plugin.md).
- A [Besu installation](../../public-networks/get-started/install/index.md).

## Steps

### 1. Build the distribution

Run the `distZip` task provided by the [Gradle plugin](https://github.com/Consensys/besu-plugin-gradle-plugin)
to package your plugin:

```bash
./gradlew distZip
```

The output archive at `build/distributions/<project-name>.zip` contains only your plugin JAR and
any extra runtime dependencies that Besu does not already provide.
JARs already in Besu's `lib` directory are excluded from the ZIP.

:::tip
If your plugin has no extra dependencies, the ZIP contains a single JAR.
:::

To inspect the contents of the archive before deploying:

```bash
unzip -l build/distributions/<project-name>.zip
```

### 2. Deploy to Besu

The method for deploying your plugin depends on how you installed Besu.

#### Standard installation

Create a `plugins` directory at the root of your Besu installation if it doesn't already exist,
then unzip the archive into it.
The `-j` flag flattens the ZIP so all JARs land directly in `plugins/`:

```bash
unzip -j build/distributions/<project-name>.zip -d /path/to/besu/plugins/
```

Start Besu.
By default, Besu loads all JARs found in the `plugins` directory automatically.
To load only specific plugins, pass a comma-separated list to
[`--plugins`](../../public-networks/reference/options.md#plugins).

#### Homebrew

The installation lives in the Homebrew Cellar (for example,
`/opt/homebrew/Cellar/besu/<version>`, which `brew --prefix besu` resolves to).
By default, Besu looks for plugins in a `plugins` directory there, but Homebrew replaces the entire
Cellar directory on `brew upgrade`, which removes any plugins you add.

Instead, keep your plugins in a stable location outside the Cellar and point Besu at it using the
`besu.plugins.dir` system property via `BESU_OPTS`:

```bash
mkdir -p ~/besu/plugins
unzip -j build/distributions/<project-name>.zip -d ~/besu/plugins/

export BESU_OPTS="-Dbesu.plugins.dir=$HOME/besu/plugins"
besu [options]
```

#### Docker

The Besu Docker image doesn't include a `plugins` directory.
Use a bind mount to inject your plugin JARs into the container at `/opt/besu/plugins`:

```bash
# Unzip the distribution into a local directory.
unzip -j build/distributions/<project-name>.zip -d /host/path/to/plugins/

# Mount that directory when starting the container.
docker run \
  -v /host/path/to/plugins:/opt/besu/plugins \
  hyperledger/besu:latest
```

To use a different path inside the container, override the plugins directory using the
`besu.plugins.dir` system property via `BESU_OPTS`:

```bash
docker run \
  -e BESU_OPTS="-Dbesu.plugins.dir=/data/plugins" \
  -v /host/path/to/plugins:/data/plugins \
  hyperledger/besu:latest
```

### 3. Verify startup

Check the Besu startup logs to confirm your plugin was detected and registered.
Besu logs a plugin registration summary that lists registered plugins and any plugins that
were detected but skipped.

Use [`--plugins-verification-mode`](../../public-networks/reference/options.md#plugins-verification-mode)
to control how Besu handles plugin verification failures:

- `NONE` (default) logs a warning and continues.
- `FULL` logs an error and stops Besu.

## Next steps

[Troubleshoot](troubleshoot.md) common issues.
