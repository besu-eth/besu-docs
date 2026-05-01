---
title: Private network subcommands
sidebar_position: 2
description: Besu command line interface subcommands
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Private network subcommands

This reference describes the syntax of the Besu private network command line interface (CLI) subcommands.

:::caution Important

This reference contains subcommands that apply to only private networks. For subcommands that apply to both private and public networks, see the [public network subcommands reference](../../../public-networks/reference/cli/subcommands.md).

:::

To start a Besu node using subcommands, run:

```bash
besu [OPTIONS] [SUBCOMMAND] [SUBCOMMAND OPTIONS]
```

If using Bash or Z shell, you can view subcommand suggestions by pressing the Tab key twice.

```bash
besu Tab+Tab
```

## `operator`

Provides operator actions.

### `generate-blockchain-config`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu operator generate-blockchain-config --config-file=<FILE> --to=<DIRECTORY> [--genesis-file-name=<FILE>] [--private-key-file-name=<FILE>] [--public-key-file-name=<FILE>]
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
besu operator generate-blockchain-config --config-file=config.json --to=myNetworkFiles
```

</TabItem>

</Tabs>

Generates an [IBFT 2.0](../../how-to/configure/consensus/ibft.md#genesis-file) or [QBFT](../../how-to/configure/consensus/qbft.md#genesis-file) genesis file.

The configuration file has two nested JSON nodes. The first is the `genesis` property defining the IBFT 2.0 or QBFT genesis file, except for the `extraData` string. The second is the `blockchain` property defining the number of key pairs to generate.

## `rlp`

Provides RLP related actions.

### `decode`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu rlp decode [--from=<FILE>] [--to=<FILE>] [--type=<TYPE>]
```

</TabItem>

<TabItem value="File example" label="File example">

```bash
besu rlp decode --from=ibft_extra_data.txt --to=decoded_ibft_extra_data.txt --type=IBFT_EXTRA_DATA
```

</TabItem>

<TabItem value="Standard input/output example" label="Standard input/output example">

```bash
cat ibft_extra_data.txt | besu rlp decode > decoded_ibft_extra_data.txt
```

</TabItem>

</Tabs>

Decodes the RLP hexadecimal string used as `extraData` in an
[IBFT 2.0](../../how-to/configure/consensus/ibft.md#extra-data) or
[QBFT](../../how-to/configure/consensus/qbft.md#extra-data) genesis file into a validator list.

This subcommand takes the following options:

- `from` - The file containing the RLP hexadecimal string to decode.
  The default is standard input.
- `to` - The file to write the decoded validator list to.
  The default is standard output.
- `type` - `IBFT_EXTRA_DATA` for an IBFT 2.0 `extraData` string, or `QBFT_EXTRA_DATA` for a QBFT
  `extraData` string.
  The default is `IBFT_EXTRA_DATA`.

### `encode`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
besu rlp encode [--from=<FILE>] [--to=<FILE>] [--type=<TYPE>]
```

</TabItem>

<TabItem value="File example" label="File example">

```bash
besu rlp encode --from=ibft_extra_data.json --to=extra_data_for_ibft_genesis.txt --type=IBFT_EXTRA_DATA
```

</TabItem>

<TabItem value="Standard input/output example" label="Standard input/output example">

```bash
cat extra_data.json | besu rlp encode > rlp.txt
```

</TabItem>

</Tabs>

Encodes a validator list into an RLP hexadecimal string to use as `extraData` in an
[IBFT 2.0](../../how-to/configure/consensus/ibft.md#extra-data) or
[QBFT](../../how-to/configure/consensus/qbft.md#extra-data) genesis file.

This subcommand takes the following options:

- `from` - The file containing the validator list to encode.
  The default is standard input.
- `to` - The file to write the RLP-encoded hexadecimal string to.
  The default is standard output.
- `type` - `IBFT_EXTRA_DATA` for an IBFT 2.0 `extraData` string, or `QBFT_EXTRA_DATA` for a QBFT
  `extraData` string.
  The default is `IBFT_EXTRA_DATA`.

## IBFT 2.0 extra data

To generate the RLP encoded `extraData` string, specify a JSON input that is an array of validator addresses in ascending order.

:::tip JSON schema for `IBFT_EXTRA_DATA`

Use the following JSON schema to validate that your JSON data is well-formatted. To validate your JSON content, use an online validation tool, such as [JSON Schema Validator](https://www.jsonschemavalidator.net/).

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://org.hyperledger.besu/cli_rlp_ibft_extra_data.json",
  "type": "array",
  "definitions": {},
  "title": "IBFT extra data",
  "description": "JSON format used as input to generate an IBFT extra data RLP string",
  "items": {
    "$id": "#/address",
    "type": "string",
    "title": "Validator address",
    "description": "The validator node address",
    "default": "",
    "examples": [
      "be068f726a13c8d46c44be6ce9d275600e1735a4",
      "5ff6f4b66a46a2b2310a6f3a93aaddc0d9a1c193"
    ],
    "pattern": "^([0-9a-f]{40})$"
  }
}
```

Example `IBFT_EXTRA_DATA` encoding:

<Tabs>

<TabItem value="JSON input" label="JSON input" default>

```json
[
  "be068f726a13c8d46c44be6ce9d275600e1735a4",
  "5ff6f4b66a46a2b2310a6f3a93aaddc0d9a1c193"
]
```

</TabItem>

<TabItem value="RLP output" label="RLP output">

```
0xf853a00000000000000000000000000000000000000000000000000000000000000000ea94be068f726a13c8d46c44be6ce9d275600e1735a4945ff6f4b66a46a2b2310a6f3a93aaddc0d9a1c193808400000000c0
```

</TabItem>

</Tabs>
