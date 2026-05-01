---
title: Transaction trace types
sidebar_position: 6
description: Transaction trace types reference
---

# Transaction trace types

When [tracing transactions](../how-to/troubleshoot/trace-transactions.md), the trace type options are [`trace`](#trace), [`vmTrace`](#vmtrace), and [`stateDiff`](#statediff).

## `trace`

An ordered list of calls to other contracts, excluding precompiled contracts.

```json title="trace example"
"trace":[
  {
    "action":{
      "callType":"call",
      "from":"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
      "gas":"0xffadea",
      "input":"0x",
      "to":"0x0100000000000000000000000000000000000000",
      "value":"0x0"
    },
    "result":{
      "gasUsed":"0x1e",
      "output":"0x"
    },
    "subtraces":0,
    "traceAddress":[
    ],
    "type":"call"
  }
]
```

| Key | Value |
| --- | --- |
| `action` | Transaction details. |
| `callType` | Whether the transaction is `call` or `create`. |
| `from` | Address of the transaction sender. |
| `gas` | Gas provided by sender. |
| `input` | Transaction data. |
| `to` | Target of the transaction. |
| `value` | Value transferred in the transaction. |
| `result` | Transaction result. |
| `gasUsed` | Gas used by the transaction. Includes any refunds of unused gas. |
| `output` | Return value of the contract call. Contains only the actual value sent by a `RETURN` operation. If a `RETURN` was not executed, the output is empty bytes. |
| `subTraces` | Traces of contract calls made by the transaction. |
| `traceAddress` | Tree list address of where the call occurred, address of the parents, and order of the current sub call. |
| `type` | Whether the transaction is a `CALL` or `CREATE` series operation. |

## `vmTrace`

An ordered list of EVM actions when processing the transaction.

`vmTrace` only reports actual data returned from a `RETURN` opcode and does not return the contents of the reserved output space for the call operations. As a result:

- `vmTrace` reports `null` when a call operation ends because of a `STOP`, `HALT`, `REVERT`, running out of instructions, or any exceptional halts.
- When a `RETURN` operation returns data of a different length to the space reserved by the call, `vmTrace` reports only the data passed to the `RETURN` operation and does not include pre-existing memory data or trim the returned data.

For out of gas operations, `vmTrace` reports the operation that caused the out of gas exception, including the calculated gas cost. `vmTrace` does not report `ex` values because the operation is not executed.

```json title="vmTrace example"
"vmTrace":{
  "code":"0x7f3940be4289e4c3587d88c1856cc95352461992db0a584c281226faefe560b3016000527f14c4d2c102bdeb2354bfc3dc96a95e4512cf3a8461e0560e2272dbf884ef3905601052600851",
  "ops":[
    {
    "cost":3,
    "ex":{
      "mem":null,
      "push":[
        "0x8"
      ],
      "store":null,
      "used":16756175
    },
    "pc":72,
    "sub":null
    },
    ...
  ]
}
```

| Key | Value |
| --- | --- |
| `code` | Code executed by the EVM. |
| `ops` | Sequence of EVM operations (opcodes) executed in the transaction. |
| `cost` | Gas cost of the opcode. Includes memory expansion costs but not gas refunds. For precompiled contract calls, reports only the actual cost. |
| `ex` | Executed operations. |
| `mem` | Memory read or written by the operation. |
| `push` | Adjusted stack items. For swap, includes all intermediate values and the result. Otherwise, is the value pushed onto the stack. |
| `store` | Account storage written by the operation. |
| `used` | Remaining gas taking into account the all but 1/64th rule for calls. |
| `pc` | Program counter. |
| `sub` | Sub call operations. |

## `stateDiff`

State changes in the requested block for each transaction represented as a map of accounts to an object. Besu lists the balance, code, nonce, and storage changes from immediately before the transaction to after the transaction. For the `key:value` pairs:

- `+` indicates the field didn’t exist before and now has the specified value
- `-` indicates a deleted value
- `*` has a `from` and a `to` value.

An absent value is distinct from zero when creating accounts or clearing storage.

```json title="stateDiff example"
"stateDiff":{
  "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73":{
    "balance":{
      "*":{
        "from":"0xffffffffffffffffffffffffffffffffc3e12a20b",
        "to":"0xffffffffffffffffffffffffffffffffc3dc5f091"
      }
    },
    "code":"=",
    "nonce":{
      "*":{
        "from":"0x14",
        "to":"0x15"
      }
    },
    "storage":{
    }
  }
}
```

| Key            | Value                                     |
| -------------- | ----------------------------------------- |
| `balance`      | Change of balance event.                  |
| `balance.from` | Balance before the transaction.           |
| `balance.to`   | Balance after the transaction.            |
| `code`         | Changes to code. None in this example.    |
| `nonce`        | Change of nonce.                          |
| `nonce.from`   | Nonce before the transaction.             |
| `nonce.to`     | Nonce after the transaction.              |
| `storage`      | Changes to storage. None in this example. |

## Applicable API methods

The trace options `trace`, `vmTrace`, and `stateDiff` are available for the following [ad-hoc tracing API methods](../how-to/troubleshoot/trace-transactions.md#ad-hoc-tracing-apis):

- [`trace_call`](api/index.md#trace_call)
- [`trace_callMany`](api/index.md#trace_callmany)
- [`trace_rawTransaction`](api/index.md#trace_rawtransaction)
- [`trace_replayBlockTransactions`](api/index.md#trace_replayblocktransactions)

Only the `trace` option is available for the following [transaction-trace filtering API methods](../how-to/troubleshoot/trace-transactions.md#transaction-trace-filtering-apis):

- [`trace_block`](api/index.md#trace_block)
- [`trace_filter`](api/index.md#trace_filter)
- [`trace_get`](api/index.md#trace_get)
- [`trace_transaction`](api/index.md#trace_transaction)
