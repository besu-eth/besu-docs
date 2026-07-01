---
title: State and node methods
description: Besu DEBUG JSON-RPC API state and node methods reference
sidebar_label: State and node
sidebar_position: 3
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

These methods inspect account and world state, and manage node operations such as metrics, resyncing, and replaying blocks.

## `debug_accountAt`

Returns account information at the specified index of the specified block.

### Parameters

- `blockHashOrNumber`: _string_ - Block hash or number at which to retrieve account information.

- `txIndex`: _number_ - Transaction index at which to retrieve account information.

- `address`: _string_ - Contract or account address for which to retrieve information.

### Returns

- Account details object.

  <Fields>

  - `code`: _data_ - Code for the account. Displays `0x0` if the address is an externally owned account.

  - `nonce`: _quantity_ - Number of transactions made by the account before this one.

  - `balance`: _quantity_ - Balance of the account in wei.

  - `codehash`: _data_ - Code hash for the account.

  </Fields>

### Example

This example uses an externally owned account address for the `address` parameter.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_accountAt",
    "params": [
      "0xc8df1f061abb4d0c107b2b1a794ade8780b3120e681f723fe55a7be586d95ba6",
      0,
      "0xbcde5374fce5edbc8e2a8697c15331677e6ebf0b"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_accountAt",
  "params": [
    "0xc8df1f061abb4d0c107b2b1a794ade8780b3120e681f723fe55a7be586d95ba6",
    0,
    "0xbcde5374fce5edbc8e2a8697c15331677e6ebf0b"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "code": "0x0",
    "nonce": "0x5",
    "balance": "0xad78ebc5ac6200000",
    "codehash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
  }
}
```

</TabItem>

</Tabs>

This example uses a contract address for the `address` parameter.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_accountAt",
    "params": [
      "0x2b76b3a2fc44c0e21ea183d06c846353279a7acf12abcc6fb9d5e8fb14ae2f8c",
      0,
      "0x0e0d2c8f7794e82164f11798276a188147fbd415"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_accountAt",
  "params": [
    "0x2b76b3a2fc44c0e21ea183d06c846353279a7acf12abcc6fb9d5e8fb14ae2f8c",
    0,
    "0x0e0d2c8f7794e82164f11798276a188147fbd415"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "code": "0x608060405234801561001057600080fd5b506004361061002b5760003560e01c8063b27b880414610030575b600080fd5b61004a60048036038101906100459190610108565b61004c565b005b60606000806000604051935036600085376000803686885af490503d9150816000853e806000811461007d57610093565b60008311156100925761012085019350836040525b5b5060008114156100ec578473ffffffffffffffffffffffffffffffffffffffff167f410d96db3f80b0f89b36888c4d8a94004268f8d42309ac39b7bcba706293e099856040516100e3919061016e565b60405180910390a25b5050505050565b60008135905061010281610227565b92915050565b60006020828403121561011e5761011d610211565b5b600061012c848285016100f3565b91505092915050565b600061014082610190565b61014a818561019b565b935061015a8185602086016101de565b61016381610216565b840191505092915050565b600060208201905081810360008301526101888184610135565b905092915050565b600081519050919050565b600082825260208201905092915050565b60006101b7826101be565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60005b838110156101fc5780820151818401526020810190506101e1565b8381111561020b576000848401525b50505050565b600080fd5b6000601f19601f8301169050919050565b610230816101ac565b811461023b57600080fd5b5056fea2646970667358221220fdfb5c371055342507b8fb9ca7b0c234f79819bd5cb05c0d467fb605de979eb564736f6c63430008060033",
    "nonce": "0x1",
    "balance": "0x0",
    "codehash": "0xf5f334d41776ed2828fc910d488a05c57fe7c2352aab2d16e30539d7726e1562"
  }
}
```

</TabItem>

</Tabs>

---

## `debug_accountRange`

[Retesteth](https://github.com/ethereum/retesteth/wiki/Retesteth-Overview) uses `debug_accountRange` to implement debugging.

Returns the accounts for a specified block.

### Parameters

- `blockHashOrNumber`: _string_ - Block hash or number at which to retrieve account information.

- `txIndex`: _number_ - Transaction index at which to retrieve account information.

- `address`: _string_ - Address hash from which to start.

- `limit`: _integer_ - Maximum number of account entries to return.

### Returns

- Account details object.

  <Fields>

  - `addressMap`: _map_ of _strings_ to _strings_ - Map of address hashes and account addresses.

  - `nextKey`: _string_ - Hash of the next address if any addresses remain in the state, otherwise zero.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_accountRange",
    "params": [
      "12345",
      0,
      "0",
      5
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_accountRange",
  "params": [
    "12345",
    0,
    "0",
    5
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "addressMap": {
      "0x005e5...86960": "0x0000000000000000000000000000000000000000",
      "0x021fe...6ffe3": "0x0000000000000000000000000000000000000000",
      "0x028e6...ab776": "0x0000000000000000000000000000000000000000",
      "0x02cb5...bc4d8": "0x0000000000000000000000000000000000000000",
      "0x03089...23fd5": "0x0000000000000000000000000000000000000000"
    },
    "nextKey": "0x04242954a5cb9748d3f66bcd4583fd3830287aa585bebd9dd06fa6625976be49"
  }
}
```

</TabItem>

</Tabs>

---

## `debug_batchSendRawTransaction`

Sends a list of [signed transactions](../../../how-to/send-transactions.md). This is used to quickly load a network with a lot of transactions. This does the same thing as calling [`eth_sendRawTransaction`](../eth/submit.md#eth_sendrawtransaction) multiple times.

### Parameters

- `data`: _string_ - Signed transaction data array.

### Returns

- Object returned for each transaction.

  <Fields>

  - `index`: _string_ - Index of the transaction in the request parameters array.

  - `success`: _boolean_ - Indicates whether or not the transaction has been added to the transaction pool.

  - `errorMessage`: _string_ - (Optional) Error message.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_batchSendRawTransaction",
    "params": [
      "0xf868808203e882520894627306090abab3a6e1400e9345bc60c78a8bef57872386f26fc10000801ba0ac74ecfa0e9b85785f042c143ead4780931234cc9a032fce99fab1f45e0d90faa02fd17e8eb433d4ca47727653232045d4f81322619c0852d3fe8ddcfcedb66a43",
      "0x416",
      "0xf868018203e882520894627306090abab3a6e1400e9345bc60c78a8bef57872386f26fc10000801ca0b24ea1bee8fe36984c36acbf80979a4509f23fc17141851e08d505c0df158aa0a00472a05903d4cd7a811bd4d5c59cc105d93f5943f3393f253e92e65fc36e7ce0",
      "0xf868808203e882520894627306090abab3a6e1400e9345bc60c78a8bef5787470de4df820000801ca0f7936b4de04792e3c65095cfbfd1399d231368f5f05f877588c0c8509f6c98c9a01834004dead527c8da1396eede42e1c60e41f38a77c2fd13a6e495479c729b99"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_batchSendRawTransaction",
  "params": [
    "0xf868808203e882520894627306090abab3a6e1400e9345bc60c78a8bef57872386f26fc10000801ba0ac74ecfa0e9b85785f042c143ead4780931234cc9a032fce99fab1f45e0d90faa02fd17e8eb433d4ca47727653232045d4f81322619c0852d3fe8ddcfcedb66a43",
    "0x416",
    "0xf868018203e882520894627306090abab3a6e1400e9345bc60c78a8bef57872386f26fc10000801ca0b24ea1bee8fe36984c36acbf80979a4509f23fc17141851e08d505c0df158aa0a00472a05903d4cd7a811bd4d5c59cc105d93f5943f3393f253e92e65fc36e7ce0",
    "0xf868808203e882520894627306090abab3a6e1400e9345bc60c78a8bef5787470de4df820000801ca0f7936b4de04792e3c65095cfbfd1399d231368f5f05f877588c0c8509f6c98c9a01834004dead527c8da1396eede42e1c60e41f38a77c2fd13a6e495479c729b99"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "index": 0,
      "success": true
    },
    {
      "index": 1,
      "success": false,
      "errorMessage": "Invalid raw transaction hex"
    },
    {
      "index": 2,
      "success": true
    },
    {
      "index": 3,
      "success": false,
      "errorMessage": "TRANSACTION_REPLACEMENT_UNDERPRICED"
    }
  ]
}
```

</TabItem>

</Tabs>

---

## `debug_metrics`

Returns metrics providing information on the internal operation of Besu.

The available metrics might change over time. The JVM metrics might vary based on the JVM implementation used.

The metric types are:

- Timer
- Counter
- Gauge

### Parameters

- None

### Returns

- Metrics object.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_metrics",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_metrics",
  "params": [],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "jvm": {
      "memory_bytes_init": {
        "heap": 268435456,
        "nonheap": 2555904
      },
      "threads_current": 41,
      "memory_bytes_used": {
        "heap": 696923976,
        "nonheap": 63633456
      },
      "memory_pool_bytes_used": {
        "PS Eden Space": 669119360,
        "Code Cache": 19689024,
        "Compressed Class Space": 4871144,
        "PS Survivor Space": 2716320,
        "PS Old Gen": 25088296,
        "Metaspace": 39073288
      },
      ...
    },
    "process": {
      "open_fds": 546,
      "cpu_seconds_total": 67.148992,
      "start_time_seconds": 1543897699.589,
      "max_fds": 10240
    },
    "rpc": {
      "request_time": {
        "debug_metrics": {
          "bucket": {
            "+Inf": 2,
            "0.01": 1,
            "0.075": 2,
            "0.75": 2,
            "0.005": 1,
            "0.025": 2,
            "0.1": 2,
            "1.0": 2,
            "0.05": 2,
            "10.0": 2,
            "0.25": 2,
            "0.5": 2,
            "5.0": 2,
            "2.5": 2,
            "7.5": 2
          },
          "count": 2,
          "sum": 0.015925392
        }
      }
    },
    "blockchain": {
      "difficulty_total": 3533501,
      "announcedBlock_ingest": {
        "bucket": {
          "+Inf": 0,
          "0.01": 0,
          "0.075": 0,
          "0.75": 0,
          "0.005": 0,
          "0.025": 0,
          "0.1": 0,
          "1.0": 0,
          "0.05": 0,
          "10.0": 0,
          "0.25": 0,
          "0.5": 0,
          "5.0": 0,
          "2.5": 0,
          "7.5": 0
        },
        "count": 0,
        "sum": 0
      },
      "height": 1908793
    },
    "peers": {
      "disconnected_total": {
        "remote": {
          "SUBPROTOCOL_TRIGGERED": 5
        },
        "local": {
          "TCP_SUBSYSTEM_ERROR": 1,
          "SUBPROTOCOL_TRIGGERED": 2,
          "USELESS_PEER": 3
        }
      },
      "peer_count_current": 2,
      "connected_total": 10
    }
  }
}
```

</TabItem>

</Tabs>

---

## `debug_replayBlock`

Re-imports the block matching the specified block number, by rolling the head of the local chain back to the block right before the specified block, then importing the specified block.

### Parameters

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of the
  string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

### Returns

- `Success` or `error`.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_replayBlock",
    "params": [
      "0x1"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_replayBlock",
  "params": [
    "0x1"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "Success"
}
```

</TabItem>

</Tabs>

---

## `debug_resyncWorldState`

Triggers a re-synchronization of the world state while retaining imported blocks. This is useful if there are world state database inconsistencies (for example, Bonsai database issues).

### Parameters

- None

### Returns

- `Success` or `error`.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_resyncWorldState",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_resyncWorldState",
  "params": [],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "Success"
}
```

</TabItem>

</Tabs>

---

## `debug_setHead`

Sets the local chain head to the specified block. Optionally, moves the [bonsai](../../../concepts/data-storage-formats.md#bonsai-tries)
world state to that block when  the `shouldMoveWorldstate` parameter is set to `true`.

Moving the world state allows expensive operations like [`debug_traceBlock`](trace.md#debug_traceblock)
to run on historical blocks without replaying all intermediate states. This is helpful to avoid
out of memory errors when executing RPC calls on historical states.

:::warning
Do not use this method when a consensus client is directing Besu, or while the node is
actively importing or proposing blocks as this will likely corrupt the database.

Additionally, if you move the chain head by a large number of blocks (for example, more than 5,000),
the RPC call might time out even though Besu continues the operation in the background.
:::

### Parameters

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of the
    string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
    [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

    :::note
    `pending` returns the same value as `latest`.
    :::

- `shouldMoveWorldstate`: _boolean_ - (Optional) If `true`, moves the [bonsai](../../../concepts/data-storage-formats.md#bonsai-tries)
    world state to the specified block. The default is `false`.

### Returns

- `Success` or `error`.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_setHead",
    "params": [
      "0x1"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_setHead",
  "params": [
    "0x1"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "Success"
}
```

</TabItem>

</Tabs>

---

## `debug_storageRangeAt`

[Remix](https://remix.ethereum.org/) uses `debug_storageRangeAt` to implement debugging. Use the _Debugger_ tab in Remix instead of calling `debug_storageRangeAt` directly.

Returns the contract storage for the specified range.

### Parameters

- `blockHash`: _string_ - Block hash.

- `txIndex`: _number_ - Transaction index from which to start.

- `address`: _string_ - Contract address.

- `startKey`: _string_ - Start key.

- `limit`: _number_ - Number of storage entries to return.

### Returns

- Range object.

  <Fields>

  - `storage`: _object_ - Key hash and value. Pre-image key is `null` if it falls outside the cache.

  - `nextKey`: _hash_ - Hash of next key if further storage in range. Otherwise, not included.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "debug_storageRangeAt",
    "params": [
      "0x2b76b3a2fc44c0e21ea183d06c846353279a7acf12abcc6fb9d5e8fb14ae2f8c",
      0,
      "0x0e0d2c8f7794e82164f11798276a188147fbd415",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      1
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_storageRangeAt",
  "params": [
    "0x2b76b3a2fc44c0e21ea183d06c846353279a7acf12abcc6fb9d5e8fb14ae2f8c",
    0,
    "0x0e0d2c8f7794e82164f11798276a188147fbd415",
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    1
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "storage": {
      "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563": {
        "key": null,
        "value": "0x0000000000000000000000000000000000000000000000000000000000000001"
      }
    },
    "nextKey": "0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6"
  }
}
```

</TabItem>

</Tabs>
