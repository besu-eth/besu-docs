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
Notable options are [`--json`](#json-trace), [`--nomemory`](#nomemory-tracenomemory),
[`--workers`](#workers), [`--test-name`](#test-name),
[`--test-name-regex`](#test-name-regex), [`--json-array`](#json-array), and
[`--summary-only`](#summary-only).

Set `--json` for EVM Lab Fuzzing.
Each executed test prints a summary JSON object to standard output, whether or not `--json` is set.
[`--summary-only`](#summary-only) omits that object for tests that pass.
[`--json-array`](#json-array) prints one JSON array instead.
The command exits with code 1 when any test fails or when no test runs.

#### `workers`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
evmtool state-test --workers=<integer>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
evmtool state-test --workers=4
```

</TabItem>

</Tabs>

Number of parallel workers used to process fixture files.
The default is the number of available processor cores.
A single path, including the `stdin` path, stays on one thread.
Parallelism applies only when the run collects more than one fixture file.

#### `test-name`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
evmtool state-test --test-name=<string>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
evmtool state-test --test-name=accessList
```

</TabItem>

</Tabs>

Limits execution to tests where the argument matches a case-insensitive substring of the
test name.
The special characters `*` and `?` can be used as wildcards to match multiple or single
characters.
An argument with a wildcard must match the whole test name, so add a leading or trailing `*`
to match part of it.
Quote an argument that contains `*` or `?` so the shell does not expand it.
For example, `--test-name='*ccess?ist'`.
An invalid pattern, or a pattern that selects no test, exits with code 1.

#### `test-name-regex`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
evmtool state-test --test-name-regex=<regex>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
evmtool state-test --test-name-regex='.*(7928|8282).*'
```

</TabItem>

</Tabs>

Limits execution to tests whose name matches this regular expression, taken exactly as written.
The match is case-sensitive and starts at the beginning of the test name, as a
[hive](https://github.com/ethereum/hive) `--sim.limit` filter does, so you can pass a published
hive filter unchanged.
This option can't be used with [`--test-name`](#test-name).
An invalid pattern, or a pattern that selects no test, exits with code 1.

#### `json-array`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
evmtool state-test --json-array
```

</TabItem>

</Tabs>

Prints results as one JSON array and prints nothing else.
Each element has `name`, `pass`, `fork`, `stateRoot`, and `error`.
`error` is an empty string when the test passes.
The process exits with code 1 when a test fails or when no test runs.

```json
[
  {
    "name": "<test-name>",
    "pass": true,
    "fork": "<fork>",
    "stateRoot": "<state-root>",
    "error": ""
  }
]
```

#### `summary-only`

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
evmtool state-test --summary-only
```

</TabItem>

</Tabs>

Skips the per-test summary JSON object for tests that pass.
Failed tests still print a summary JSON object.
When at least one test runs, the command then prints
`State test summary: <passed> passed, <failed> failed`.
With `--json`, that summary line is printed only when `--summary-only` is also set.
[`--json-array`](#json-array) ignores this option and prints only the JSON array.

#### Use command arguments

Pass one or more state test files or directories.
A directory is expanded recursively to its `.json` files, in sorted order.
Files under a `.meta` directory are skipped.
The collected files run in parallel when [`--workers`](#workers) is greater than 1 and more
than one file is collected.
A single file runs on one thread.

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

Pass the path `stdin` to read one state test JSON object from standard input.

<Tabs>

<TabItem value="Docker example" label="Docker example" default>

```bash
docker run --rm -i hyperledger/besu-evmtool:develop --json state-test stdin < stExample/add11.json
```

</TabItem>

<TabItem value="CLI example" label="CLI example">

```bash
evmtool --json state-test stdin < stExample/add11.json
```

</TabItem>

</Tabs>

With no path argument, each line of standard input is the path of one state test
file.
This path runs one file at a time and does not use `--workers`:

```bash
evmtool --json state-test < filenames.txt
```

### `block-test`

Allows the Ethereum blockchain tests in the
[execution spec releases](https://github.com/ethereum/execution-specs/releases)
to be evaluated.
Run `evmtool block-test --help` for the full list of supported options.
Notable options are [`--json`](#json-trace), [`--nomemory`](#nomemory-tracenomemory),
[`--workers`](#workers), [`--test-name`](#test-name),
[`--test-name-regex`](#test-name-regex), [`--json-array`](#block-test-json-array),
[`--cache-precompiles`](#block-test-cache-precompiles),
[`--block-access-list`](#block-test-block-access-list),
[`--trace-output`](#block-test-trace-output), and [`--verbose`](#block-test-verbose).

The command prints a test summary after the run.
[`--json-array`](#block-test-json-array) prints one JSON array instead.
The command exits with code 1 when a test fails, when no test runs, or when a
declared case never ran.

#### `json-array` {#block-test-json-array}

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
evmtool block-test --json-array
```

</TabItem>

</Tabs>

Prints results as one JSON array and prints nothing else.
Each element has `name`, `pass`, `fork`, `lastBlockHash`, and `error`.
Unreadable fixture files, and declared cases that never ran, appear as extra
elements with `pass` set to `false`.
A `NOT RUN` element reports how many of the declared cases never executed.
The process exits with code 1 when a test fails, when no test runs, or when a
declared case never ran.

```json
[
  {
    "name": "<test-name>",
    "pass": true,
    "fork": "<fork>",
    "lastBlockHash": "<block-hash>",
    "error": null
  }
]
```

#### `[no]block-access-list` {#block-test-block-access-list}

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
evmtool block-test --block-access-list, --noblock-access-list
```

</TabItem>

</Tabs>

Imports each block with the access list its fixture carries.
This option is enabled by default.
`--noblock-access-list` imports each block without an access list, as full sync
does, so post-Amsterdam blocks take the accumulator state root path rather than
the access list path.

#### `[no]cache-precompiles` {#block-test-cache-precompiles}

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
evmtool block-test --cache-precompiles, --nocache-precompiles
```

</TabItem>

</Tabs>

Enables precompile result caching, matching Besu's `--cache-precompiles` option.
Caching is disabled by default.

#### `trace-output` {#block-test-trace-output}

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
evmtool block-test --json --trace-output=<file>
```

</TabItem>

<TabItem value="Example" label="Example">

```bash
evmtool block-test --json --trace-output=traces.log
```

</TabItem>

</Tabs>

Writes traces to this file instead of standard error.
This option requires [`--json`](#json-trace) or `--trace`.

#### `verbose` {#block-test-verbose}

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
evmtool block-test --verbose
```

</TabItem>

</Tabs>

Prints a line for each test considered or skipped.
The command also prints `Chain import successful` when a test passes.

#### Use command arguments

Pass one or more blockchain test files or directories.
A directory is expanded recursively to its `.json` files, in sorted order.
Files under a `.meta` directory are skipped.
The collected files run in parallel when [`--workers`](#workers) is greater than 1 and more
than one file is collected.
A single file runs on one thread.

<Tabs>

<TabItem value="Docker example" label="Docker example" default>
```bash
docker run --rm -v ${PWD}:/opt/referencetests hyperledger/besu-evmtool:develop --json block-test /opt/referencetests/BlockchainTests/ValidBlocks/bcExample/shanghaiExample.json
```

</TabItem>

<TabItem value="CLI example" label="CLI example">


```bash
evmtool --json block-test bcExample/shanghaiExample.json
```

</TabItem>

</Tabs>

#### Use standard input

Pass the path `stdin` to read one blockchain test JSON object from standard input.

<Tabs>

<TabItem value="Docker example" label="Docker example" default>

```bash
docker run --rm -i hyperledger/besu-evmtool:develop --json block-test stdin < bcExample/shanghaiExample.json
```

</TabItem>

<TabItem value="CLI example" label="CLI example">

```bash
evmtool --json block-test stdin < bcExample/shanghaiExample.json
```

</TabItem>

</Tabs>

With no path argument, each line of standard input is the path of one blockchain
test file.
This path runs one file at a time and does not use `--workers`:

```bash
evmtool --json block-test < filenames.txt
```

### `engine-test`

Allows the Ethereum engine tests in the
[execution spec releases](https://github.com/ethereum/execution-specs/releases)
to be evaluated through the [Engine API](engine-api.md).
Run `evmtool engine-test --help` for the full list of supported options.
Notable options are [`--json`](#json-trace), [`--nomemory`](#nomemory-tracenomemory),
[`--workers`](#workers), [`--test-name`](#test-name),
[`--test-name-regex`](#test-name-regex), [`--json-array`](#engine-test-json-array),
and [`--verbose`](#engine-test-verbose).

Without [`--verbose`](#engine-test-verbose), only failing tests and the final
summary are printed.
[`--json-array`](#engine-test-json-array) prints one JSON array instead.
The command exits with code 1 when a test fails, when no test runs, or when a
declared case never ran.

#### `json-array` {#engine-test-json-array}

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
evmtool engine-test --json-array
```

</TabItem>

</Tabs>

Prints results as one JSON array and prints nothing else.
Each element has `name`, `pass`, `fork`, `lastBlockHash`, `lastPayloadStatus`,
and `error`.
`error` is an empty string when the test passes.
Unreadable fixture files, and declared cases that never ran, appear as extra
elements with `pass` set to `false`.
A `NOT RUN` element reports how many of the declared cases never executed.
The process exits with code 1 when a test fails, when no test runs, or when a
declared case never ran.

```json
[
  {
    "name": "<test-name>",
    "pass": true,
    "fork": "<fork>",
    "lastBlockHash": "<block-hash>",
    "lastPayloadStatus": "<status>",
    "error": ""
  }
]
```

#### `verbose` {#engine-test-verbose}

<Tabs>

<TabItem value="Syntax" label="Syntax" default>

```bash
evmtool engine-test --verbose
```

</TabItem>

</Tabs>

Prints progress for each test.
Without this option, only failing tests and the final summary are printed.

#### Use command arguments

Pass one or more engine test files or directories.
A directory is expanded recursively to its `.json` files, in sorted order.
Files under a `.meta` directory are skipped.
The collected files run in parallel when [`--workers`](#workers) is greater than 1 and more
than one file is collected.
A single file runs on one thread.

<Tabs>

<TabItem value="Docker example" label="Docker example" default>
```bash
docker run --rm -v ${PWD}:/opt/referencetests hyperledger/besu-evmtool:develop engine-test /opt/referencetests/blockchain_tests_engine
```

</TabItem>

<TabItem value="CLI example" label="CLI example">

```bash
evmtool engine-test blockchain_tests_engine
```

</TabItem>

</Tabs>

#### Use standard input

Pass the path `stdin` to read one engine test JSON object from standard input.

<Tabs>

<TabItem value="Docker example" label="Docker example" default>

```bash
docker run --rm -i hyperledger/besu-evmtool:develop engine-test stdin < blockchain_tests_engine/for_shanghai/shanghai/eip4895_withdrawals/withdrawals/zero_amount.json
```

</TabItem>

<TabItem value="CLI example" label="CLI example">

```bash
evmtool engine-test stdin < blockchain_tests_engine/for_shanghai/shanghai/eip4895_withdrawals/withdrawals/zero_amount.json
```

</TabItem>

</Tabs>

With no path argument, each line of standard input is the path of one engine test
file.
This path runs one file at a time and does not use `--workers`:

```bash
evmtool engine-test < filenames.txt
```

### `transition`, `t8n`, `t8n-server`

Allows the Ethereum state transition and blockchain tests to be evaluated.
See the [transition tool reference](https://ethereum-tests.readthedocs.io/en/develop/t8ntool-ref.html)
and [Execution Spec Tests](https://ethereum.github.io/execution-spec-tests/v1.0.6/) for more
information about this subcommand.
