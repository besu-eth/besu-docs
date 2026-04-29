---
title: Install binary distribution
description: Install or upgrade Besu from binary distribution
sidebar_position: 3
---

# Install binary distribution

## MacOS with Homebrew

### Prerequisites

- [Homebrew](https://brew.sh/)
- Java JDK

:::caution

Besu supports:

- MacOS High Sierra 10.13 or later versions.
- Java 21+. You can install Java using `brew install openjdk@21`. Alternatively, you can manually install the [Java JDK](https://www.oracle.com/java/technologies/downloads).

:::

### Install (or upgrade) using Homebrew

To install Besu using Homebrew:

```bash
brew tap hyperledger/besu
brew install hyperledger/besu/besu
```

To upgrade an existing Besu installation using Homebrew:

```bash
brew upgrade hyperledger/besu/besu
```

:::note

If you've upgraded your MacOS version between installing and upgrading Besu, when running `brew upgrade hyperledger/besu/besu` you may be prompted to reinstall command line tools with `xcode-select --install`.

:::

:::note

When upgrading Besu, you might be prompted to fix the remote branch names in Homebrew by using the command `brew tap --repair`.

:::

To display the Besu version and confirm installation:

```bash
besu --version
```

To display Besu command line help:

```bash
besu --help
```

## Linux / Unix

### Prerequisites

- [Java JDK 17+](https://www.oracle.com/java/technologies/downloads/)

:::note Linux open file limit

If synchronizing to Mainnet on Linux or other chains with large data requirements, increase the maximum number of open files allowed using `ulimit`. If the open files limit is not high enough, a `Too many open files` RocksDB exception occurs.

:::

:::tip

We recommend installing [jemalloc](https://jemalloc.net/) to reduce memory usage. If using Ubuntu, you can install it with the command: `apt install libjemalloc-dev`.

:::

### Install from packaged binaries

Download the Besu [packaged binaries](https://github.com/hyperledger/besu/releases).

Unpack the downloaded files and change into the `besu-<release>` directory.

Display Besu command line help to confirm installation:

```bash
bin/besu --help
```

## Upgrade Besu

See the [Upgrade Besu](../../../public-networks/how-to/upgrade-node.md#upgrade-on-linux) guide for instructions on upgrading Besu on Linux.
