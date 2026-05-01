---
title: Use EVM tool
sidebar_position: 1
description: Besu EVM tool
---

# Use the EVM tool

The Besu EVM tool is a CLI program that executes arbitrary EVM programs and Ethereum State Tests
outside the context of an operating node.
Use the EVM tool for benchmarking and fuzz testing.

## Get the EVM tool

The EVM tool is part of the standard [Besu binary distribution](../../get-started/install/binary-distribution.md).

### Build from source

To build from source, run the following from the root of the Besu repository:

```bash
./gradlew :ethereum:evmTool:installDist
```

An extractable archive files is created in `ethereum/evmtool/build/distributions` and an executable
installation in `ethereum/evmtool/build/install/evmtool`.

Execute the EVM tool:

```bash
ethereum/evmtool/build/install/evmtool/bin/evmtool <evmtool options>
```

### Execute with Docker

To run the Besu EVM tool in a container:

```bash
docker run -rm <docker options> hyperledger/besu-evmtool:develop <evmtool options>
```

- Because no data is stored in local directories we recommended using the `-rm` docker option.
  The `-rm` option deletes the container at the end of execution.
- If you use an option that requires input from standard in, use the `-i` docker option.
  The `-i` option pipes standard input to the EVM tool.
- If you need to reference files we recommend using a docker file binding, such as
  `-v ${PWD}:/opt/data`, which maps the current directory to the `/opt/data` directory in the container.

:::note
The `latest` tag is the latest released version of Besu.
The `develop` tag is the current main branch code that will go into a future release version of Besu.
:::

## EVM tool options

The first mode of the EVM tool runs arbitrary EVM bytecode.
Use [command line options](../../reference/evm-tool.md#options) to specify the code and other
contextual information.
For example:

```bash
evmtool --code=5B600080808060045AFA50600056
```

The EVM tool also has [subcommands](../../reference/evm-tool.md#subcommands) used for testing code bases.
These subcommands are not meant for typical user interactions.
