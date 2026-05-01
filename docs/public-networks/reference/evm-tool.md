---
title: EVM tool options
sidebar_position: 5
toc_max_heading_level: 3
description: Besu EVM tool options reference
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# EVM tool reference

This reference describes [options](#options) and [subcommands](#subcommands) for the
[EVM tool](../how-to/troubleshoot/evm-tool.md).

:::note

Option names that include `trace`, such as [`--trace`](#json-trace) and [`--trace.[no]memory`](#nomemory-tracenomemory) exist to support [`t8ntool`](https://ethereum-tests.readthedocs.io/en/latest/t8ntool.html) reference testing, and are interchangeable with their standard option names.

:::

## Options

### `code`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--code=<code>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
--code=5B600080808060045AFA50600056
```

</TabItem>

</Tabs>

The code to be executed, in compiled hex code form. Execution fails if this is not set.

### `gas`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--gas=<integer>
```

</TabItem>

  <TabItem value="Example" label="Example">

```bash
--gas=100000000
```

</TabItem>

</Tabs>

Amount of gas to make available to the EVM. The default is 10 billion, a number unlikely to be seen in any production blockchain.

### `price`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--price=<integer>
```

</TabItem>

  <TabItem value="Example" label="Example">

```bash
--price=10
```

</TabItem>

</Tabs>

Price of gas in Gwei. The default is `0`. If set to a non-zero value, the sender account must have enough value to cover the gas fees.

### `sender`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--sender=<address>
```

</TabItem>

  <TabItem value="Example" label="Example">

```bash
--sender=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73
```

</TabItem>

</Tabs>

The account the invocation is sent from. The specified account must exist in the world state, which, unless specified by [`--genesis`](#genesis), is the set of [accounts used for testing](../../private-networks/reference/accounts-for-testing.md).

### `receiver`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--receiver=<address>
```

</TabItem>

  <TabItem value="Example" label="Example">

```bash
--receiver=0x588108d3eab34e94484d7cda5a1d31804ca96fe7
```

</TabItem>

</Tabs>

The account the invocation is sent to. The specified account does not need to exist.

### `input`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--input=<code>
```

</TabItem>

  <TabItem value="Example" label="Example">

```bash
--input=9064129300000000000000000000000000000000000000000000000000000000
```

</TabItem>

</Tabs>

The data passed into the call. Corresponds to the `data` field of the transaction and is returned by the `CALLDATA` and related opcodes.

### `value`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--value=<integer>
```

</TabItem>

  <TabItem value="Example" label="Example">

```bash
--value=1000000000000000000
```

</TabItem>

</Tabs>

The value, in wei, attached to this transaction. For operations that query the value or transfer it to other accounts this is the amount that is available. The amount is not reduced to cover intrinsic cost and gas fees.

### `json`, `trace`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--json
```

</TabItem>

</Tabs>

Provides an operation-by-operation trace of the command in JSON.

`--trace` is an alias for `--json`.

### `json-alloc`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--json-alloc
```

</TabItem>

</Tabs>

Outputs a JSON summary of the post-execution world state and allocations.

### `[no]memory`, `trace.[no]memory`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--nomemory, --memory
```

</TabItem>

</Tabs>

Setting `--nomemory` disables tracing the memory output for each operation. Setting `--memory` enables it. Memory traces are disabled by default.

For memory heavy scripts, disabling memory traces may reduce the volume of JSON output.

`--trace.[no]memory` is an alias for `--[no]memory`.

### `trace.[no]stack`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--trace.nostack, --trace.stack
```

</TabItem>

</Tabs>

Setting `--trace.nostack` disables tracing the operand stack for each operation. Setting `--trace.stack` enables it. Stack traces are enabled by default.

### `trace.[no]returndata`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--trace.noreturndata, --trace.returndata
```

</TabItem>

</Tabs>

Setting `--trace.noreturndata` disables tracing the return data for each operation. Setting `--trace.returndata` enables it. Return data traces are enabled by default.

### `[no]time`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--notime, --time
```

</TabItem>

</Tabs>

Setting `--notime` disables including time data in the summary output. Setting `--time` enables it.

This is useful for testing and differential evaluations.

### `genesis`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--genesis=<path>
```

</TabItem>

  <TabItem value="Example" label="Example">

```bash
--genesis=/opt/besu/genesis.json
```

</TabItem>

</Tabs>

The [Besu genesis file](genesis-items.md) to use when evaluating the EVM. Most useful are the `alloc` items that set up accounts and their stored memory states.

`--prestate` is a deprecated alias for `--genesis`.

### `chain`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--chain=<mainnet|sepolia|dev|hoodi|linea_mainnet|linea_sepolia>
```

</TabItem>

  <TabItem value="Example" label="Example">

```bash
--chain=sepolia
```

</TabItem>

</Tabs>

The well-known network genesis file to use when evaluating the EVM. These values are an alternative to the [`--genesis`](#genesis) option for well-known networks.

### `repeat`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--repeat=<integer>
```

</TabItem>

  <TabItem value="Example" label="Example">

```bash
--repeat=1000
```

</TabItem>

</Tabs>

Number of times to repeat the contract before gathering timing information. This is useful when benchmarking EVM operations. The default is `0`.

### `revert-reason-enabled`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--revert-reason-enabled
```

</TabItem>

</Tabs>

Enables tracing the reason included in `REVERT` operations. The revert reason is enabled by default.

### `fork`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--fork=<string>
```

</TabItem>

  <TabItem value="Example" label="Example">

```bash
--fork=FutureEips
```

</TabItem>

</Tabs>

Specific fork to evaluate, overriding network settings.

### `key-value-storage`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--key-value-storage=<memory|rocksdb>
```

</TabItem>

  <TabItem value="Example" label="Example">

```bash
--key-value-storage=rocksdb
```

</TabItem>

</Tabs>

Kind of key value storage to use.

It might be useful to execute isolated EVM calls in the context of an actual world state. The default is `memory`, which executes the call only in the context of the world provided by [`--genesis`](#genesis) or [`--chain`](#chain) at block zero.

When set to `rocksdb` and combined with [`--data-path`](#data-path), [`--block-number`](#block-number), and [`--genesis`](#genesis), a Besu node that isn't currently running can be used to provide the appropriate world state for a transaction. This is useful when evaluating consensus failures.

### `data-path`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--data-path=<path>
```

</TabItem>

  <TabItem value="Example" label="Example">

```bash
--data-path=/opt/besu/data
```

</TabItem>

</Tabs>

When [`--key-value-storage`](#key-value-storage) is set to `rocksdb`, specifies the location of the database on disk.

### `block-number`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--block-number=<integer>
```

</TabItem>

  <TabItem value="Example" label="Example">

```bash
--block-number=10000000
```

</TabItem>

</Tabs>

The block number to evaluate the code against. Used to ensure that the EVM is evaluating the code against the correct fork, or to specify the world state when [`--key-value-storage`](#key-value-storage) is set to `rocksdb`.

### `version`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
--version
```

</TabItem>

</Tabs>

Displays the version information.

`-v` is an alias for `--version`.

## Subcommands

:::caution
The following subcommands are used for testing code bases and not meant for typical user interactions.
:::

### `code-validate`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
evmtool code-validate --file=<file>
```

</TabItem>

  <TabItem value="Example" label="Example">

```bash
evmtool code-validate --file=eof.txt
```

</TabItem>

</Tabs>

Allows [Ethereum object formatted (EOF)](https://eips.ethereum.org/EIPS/eip-3540) code to be validated.

You can specify a file containing one or more EOF containers or EVM bytecode using the `--file` option.
Each line in the file is considered a separate program.

#### Use command arguments

If you use command arguments, each argument is considered a separate program.
If a code segment includes spaces, it must be contained in quotes.

<Tabs>

<TabItem value="Docker example" label="Docker example" default>

```bash
docker run --rm hyperledger/besu-evmtool:develop code-validate "0xef0001 010008 020002-0007-0002 030000 00 00000002-02010002 59-59-b00001-50-b1 03-b1" 0xef0002 0xef00010100040200010001030000000000000000
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
evmtool code-validate "0xef0001 010008 020002-0007-0002 030000 00 00000002-02010002 59-59-b00001-50-b1 03-b1" 0xef0002 0xef00010100040200010001030000000000000000
```

</TabItem>

</Tabs>

#### Use standard input

If no reference tests are passed in using the command line, the EVM tool loads and validates code
from standard input.
Each line is considered a separate program.
Comment lines and blanks are ignored.

### `state-test`

Allows the [Ethereum state tests](https://github.com/ethereum/execution-spec-tests/tree/main/tests/static/state_tests)
to be evaluated.
Run `evmtool state-test --help` for the full list of supported options.
Notable options are [`--json`](#json-trace) and [`--nomemory`](#nomemory-tracenomemory).

Set `--json` for EVM Lab Fuzzing.
Whether or not `--json` is set, a summary JSON object is printed to standard output for each state
test executed.

#### Use command arguments

If you use command arguments, you can list one or more state tests.
All the state tests are evaluated in the order they are specified.

<Tabs>

<TabItem value="Docker example" label="Docker example" default>
```bash
docker run --rm -v ${PWD}:/opt/referencetests hyperledger/besu-evmtool:develop --json state-test /opt/referencetests/GeneralStateTests/stExample/add11.json
```

</TabItem>

<TabItem value="CLI example" label="CLI example">


```bash
evmtool --json state-test stExample/add11.json
```

</TabItem>

</Tabs>

#### Use standard input

If no reference tests are passed in using the command line, the EVM tool loads one complete JSON
object from standard input and executes that state test.

<Tabs>

<TabItem value="Docker example" label="Docker example" default>

```bash
docker run --rm -i hyperledger/besu-evmtool:develop --json state-test < stExample/add11.json
```

</TabItem>

<TabItem value="CLI example" label="CLI example">

```bash
evmtool --json state-test < stExample/add11.json
```

</TabItem>

</Tabs>

### `transition`, `t8n`, `t8n-server`

Allows the Ethereum state transition and blockchain tests to be evaluated.
See the [transition tool reference](https://ethereum-tests.readthedocs.io/en/develop/t8ntool-ref.html)
and [Execution Spec Tests](https://ethereum.github.io/execution-spec-tests/v1.0.6/) for more
information about this subcommand.
