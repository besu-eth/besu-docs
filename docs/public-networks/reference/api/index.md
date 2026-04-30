---
title: Besu API
sidebar_position: 2
description: Besu JSON-RPC API methods reference
toc_max_heading_level: 3
---

import Postman from '../../../global/postman.md'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Besu API methods

:::caution

- This reference contains API methods that apply to both public and private networks. For private-network-specific API methods, see the [private network API reference](../../../private-networks/reference/api.md).
- All JSON-RPC HTTP examples use the default host and port endpoint `http://127.0.0.1:8545`. If using the [--rpc-http-host](../cli/options.md#rpc-http-host) or [--rpc-http-port](../cli/options.md#rpc-http-port) options, update the endpoint.
- Most example requests are made against private networks. Depending on network configuration and activity, your example results might be different.

:::

<Postman />

## `ADMIN` methods

The `ADMIN` API methods provide administrative functionality to manage your node.

:::note

The `ADMIN` API methods are not enabled by default for JSON-RPC. To enable the `ADMIN` API methods, use the [`--rpc-http-api`](../cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../cli/options.md#rpc-ws-api) options.

:::

### `admin_addPeer`

Adds a [static node](../../how-to/connect/static-nodes.md).

:::caution

If connections are timing out, ensure the node ID in the [enode URL](../../concepts/node-keys.md#enode-url) is correct.

:::

#### Parameters

`enode`: _string_ - [enode URL](../../concepts/node-keys.md#enode-url) of peer to add

#### Returns

`result`: _boolean_ - `true` if peer added or `false` if peer already a [static node](../../how-to/connect/static-nodes.md)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"admin_addPeer","params":["enode://f59c0ab603377b6ec88b89d5bb41b98fc385030ab1e4b03752db6f7dab364559d92c757c13116ae6408d2d33f0138e7812eb8b696b2a22fe3332c4b5127b22a3@127.0.0.1:30304"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"admin_addPeer","params":["enode://f59c0ab603377b6ec88b89d5bb41b98fc385030ab1e4b03752db6f7dab364559d92c757c13116ae6408d2d33f0138e7812eb8b696b2a22fe3332c4b5127b22a3@127.0.0.1:30304"],"id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```

</TabItem>

</Tabs>

### `admin_changeLogLevel`

Changes the log level without restarting Besu. You can change the log level for all logs, or you can change the log level for specific packages or classes.

You can specify only one log level per RPC call.

#### Parameters

- `level`: _string_ - [log level](../cli/options.md#logging)

- `log_filter`: _array_ - (optional) packages or classes for which to change the log level

#### Returns

`result`: _string_ - `Success` if the log level has changed, otherwise `error`

The following example changes the debug level for specified classes to `DEBUG`.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0", "method":"admin_changeLogLevel", "params":["DEBUG", ["org.hyperledger.besu.ethereum.eth.manager","org.hyperledger.besu.ethereum.p2p.rlpx.connections.netty.ApiHandler"]], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0", "method":"admin_changeLogLevel", "params":["DEBUG", ["org.hyperledger.besu.ethereum.eth.manager","org.hyperledger.besu.ethereum.p2p.rlpx.connections.netty.ApiHandler"]], "id":1}
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

The following example changes the debug level of all logs to `WARN`.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"admin_changeLogLevel","params":["WARN"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "admin_changeLogLevel",
  "params": ["WARN"],
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

### `admin_generateLogBloomCache`

Generates cached log bloom indexes for blocks. APIs calls such as [`eth_getLogs`](#eth_getlogs) and [`eth_getFilterLogs`](#eth_getfilterlogs) use the cache for improved performance.

:::tip

Manually executing `admin_generateLogBloomCache` is not required unless the [`--auto-log-bloom-caching-enabled`](../cli/options.md#auto-log-bloom-caching-enabled) command line option is set to false.

:::

:::note

Each index file contains 100000 blocks. The last fragment of blocks less than 100000 are not indexed.

:::

#### Parameters

- `startBlock`: _string_ - block to start generating indexes

- `endBlock`: _string_ - block to stop generating indexes

#### Returns

`result`: _object_ - log bloom index details:

- `startBlock`: _string_ - starting block for the last requested cache generation

- `endBlock`: _string_ - ending block for the last requested cache generation

- `currentBlock`: _string_ - most recent block added to the cache

- `indexing`: _boolean_ - indicates if indexing is in progress

- _boolean_ - indicates acceptance of the request from this call to generate the cache

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"admin_generateLogBloomCache", "params":["0x0", "0x10000"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "admin_generateLogBloomCache",
  "params": ["0x0", "0x10000"],
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
    "startBlock": "0x0",
    "endBlock": "0x10000",
    "currentBlock": "0x0",
    "indexing": true,
    "requestAccepted": true
  }
}
```

</TabItem>

</Tabs>

### `admin_logsRemoveCache`

Removes cache files for the specified range of blocks.

#### Parameters

- `fromBlock`: _string_ - hexadecimal integer representing a block number, or one of the
  string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

- `toBlock`: _string_ - hexadecimal integer representing a block number, or one of the
  string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

:::note
`pending` returns the same value as `latest`.
:::

You can skip a parameter by using an empty string, `""`. If you specify:

- No parameters, the call removes cache files for all blocks.
- Only `fromBlock`, the call removes cache files for the specified block.
- Only `toBlock`, the call removes cache files from the genesis block to the specified block.

#### Returns

`result`: _object_ - `Cache Removed` status or `error`

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"admin_logsRemoveCache","params":["1", "100"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "admin_logsRemoveCache",
  "params": ["1", "100"],
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
    "Status": "Cache Removed"
  }
}
```

</TabItem>

</Tabs>

### `admin_logsRepairCache`

Repairs cached logs by fixing all segments starting with the specified block number.

#### Parameters

`startBlock`: _string_ - decimal index of the starting block to fix; defaults to the head block

#### Returns

`result`: _object_ - status of the repair request; `Started` or `Already running`

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"admin_logsRepairCache","params":["1200"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "admin_logsRepairCache",
  "params": ["1200"],
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
    "Status": "Started"
  }
}
```

</TabItem>

</Tabs>

### `admin_nodeInfo`

Returns networking information about the node. The information includes general information about the node and specific information from each running Ethereum sub-protocol (for example, `eth`).

#### Parameters

None

#### Returns

`result`: _object_ - node object with the following fields:

- `enode`: _string_ - [enode URL](../../concepts/node-keys.md#enode-url) of the node

- `enr`: _string_ - [ENR URL](../../concepts/node-keys.md#enr-url) of the node

- `listenAddr`: _string_ - host and port for the node

- `name`: _string_ - client name

- `id`: _string_ - [node public key](../../concepts/node-keys.md#node-public-key)

- `ports`: _object_ - peer discovery and listening [ports](../../how-to/connect/configure-ports.md)

- `protocols`: _object_ - list of objects containing information for each Ethereum sub-protocol

:::note

If the node is running locally, the host of the `enode` and `listenAddr` display as `[::]` in the result. When advertising externally, the external address displayed for the `enode` and `listenAddr` is defined by [`--nat-method`](../../how-to/connect/specify-nat.md).

:::

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"admin_nodeInfo","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"admin_nodeInfo","params":[],"id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "enode": "enode://87ec35d558352cc55cd1bf6a472557797f91287b78fe5e86760219124563450ad1bb807e4cc61e86c574189a851733227155551a14b9d0e1f62c5e11332a18a3@[::]:30303",
    "enr": "enr:-Jq4QOBEJ_aqkcth60IN44olOQ3uNsfqwEahYc6eKRfBg8ZlGbqhHTKqN_Yr67QWUA9v8_l-iaYhpd2uJC_AEQDv3agCg2V0aMrJhPxk7ASDEYwwgmlkgnY0gmlwhH8AAAGJc2VjcDI1NmsxoQK99DIR26ML8QCgAEC5-DnhcWHIjIVzAouFM8it-O0elIN0Y3CCdl-DdWRwgnZf",
    "listenAddr": "[::]:30303",
    "name": "besu/v26.3-develop-f2ec0fe/osx-aarch_64/oracle_openjdk-java-22",
    "id": "bdf43211dba30bf100a00040b9f839e17161c88c8573028b8533c8adf8ed1e9466e4b87d716d06292426d154d0df7acde83c3f68df151da5413224b22f049054",
    "ports": {
      "discovery": 30303,
      "listener": 30303
    },
    "protocols": {
      "eth": {
        "config": {
          "chainId": 2018,
          "homesteadBlock": 0,
          "daoForkBlock": 0,
          "daoForkSupport": true,
          "eip150Block": 0,
          "eip155Block": 0,
          "eip158Block": 0,
          "byzantiumBlock": 0,
          "constantinopleBlock": 0,
          "constantinopleFixBlock": 0,
          "ethash": {
            "fixeddifficulty": 100
          }
        },
        "difficulty": 78536,
        "genesis": "0x43ee12d45470e57c86a0dfe008a5b847af9e372d05e8ba8f01434526eb2bea0f",
        "head": "0xc6677651f16d07ae59cab3a5e1f0b814ed2ec27c00a93297b2aa2e29707844d9",
        "network": 2018
      }
    }
  }
}
```

</TabItem>

</Tabs>

### `admin_peers`

Returns networking information about connected remote nodes.

#### Parameters

None

#### Returns

`result`: _array_ of _objects_ - list of objects returned for each remote node, with the following fields.

- `version`: _string_ - P2P protocol version

- `name`: _string_ - client name

- `caps`: _array_ of _strings_ - list of Ethereum sub-protocol capabilities

- `network`: _object_ - local and remote addresses established at time of bonding with the peer (the remote address might not match the hex value for `port`; it depends on which node initiated the connection.)

- `port`: _string_ - port on the remote node on which P2P discovery is listening

- `id`: _string_ - node public key (excluding the `0x` prefix, the node public key is the ID in the [enode URL](../../concepts/node-keys.md#enode-url) `enode://<id ex 0x>@<host>:<port>`.)

- `protocols`: _object_ - [current state of peer](../../how-to/connect/manage-peers.md#monitor-peer-connections) including `difficulty`, `head`, and `latestBlock` (`head` is the hash of the highest known block for the peer; `latestBlock` is the corresponding block number.)

- `enode`: _string_ - enode URL of the remote node

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"admin_peers","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"admin_peers","params":[],"id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "version": "0x5",
      "name": "besu/v20.10.4-dev-0905d1b2/osx-x86_64/adoptopenjdk-java-11",
      "caps": ["eth/67", "eth/68", "IBF/1"],
      "network": {
        "localAddress": "192.168.1.229:50115",
        "remoteAddress": "168.61.153.255:40303"
      },
      "port": "0x765f",
      "id": "0xe143eadaf670d49afa3327cae2e655b083f5a89dac037c9af065914a9f8e6bceebcfe7ae2258bd22a9cd18b6a6de07b9790e71de49b78afa456e401bd2fb22fc",
      "protocols": {
        "eth": {
          "difficulty": "0x1ac",
          "head": "0x964090ae9277aef43f47f1b8c28411f162243d523118605f0b1231dbfdf3611a",
          "latestBlock": 428,
          "version": 65
        }
      },
      "enode": "enode://e143eadaf670d49afa3327cae2e655b083f5a89dac037c9af065914a9f8e6bceebcfe7ae2258bd22a9cd18b6a6de07b9790e71de49b78afa456e401bd2fb22fc@127.0.0.1:30303"
    }
  ]
}
```

</TabItem>

</Tabs>

### `admin_removePeer`

Removes a [static node](../../how-to/connect/static-nodes.md).

#### Parameters

`enode`: _string_ - [enode URL](../../concepts/node-keys.md#enode-url) of peer to remove

#### Returns

`result`: _boolean_ - `true` if peer removed or `false` if peer not a [static node](../../how-to/connect/static-nodes.md)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"admin_removePeer","params":["enode://f59c0ab603377b6ec88b89d5bb41b98fc385030ab1e4b03752db6f7dab364559d92c757c13116ae6408d2d33f0138e7812eb8b696b2a22fe3332c4b5127b22a3@127.0.0.1:30304"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"admin_removePeer","params":["enode://f59c0ab603377b6ec88b89d5bb41b98fc385030ab1e4b03752db6f7dab364559d92c757c13116ae6408d2d33f0138e7812eb8b696b2a22fe3332c4b5127b22a3@127.0.0.1:30304"],"id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```

</TabItem>

</Tabs>

## `DEBUG` methods

The `DEBUG` API methods allow you to inspect and debug the network. The `DEBUG` API is a more verbose alternative to the [`TRACE` API](#trace-methods), and its main purpose is compatibility with tools such as [Remix](https://remix.ethereum.org/). Where these APIs overlap, we recommend using the [`TRACE` API](#trace-methods) for production use over the `DEBUG` API. Specifically, we recommend `trace_block` over `debug_traceBlock`, and `trace_transaction` over `debug_traceTransaction`.

:::note

The `DEBUG` API methods are not enabled by default for JSON-RPC. To enable the `DEBUG` API methods, use the [`--rpc-http-api`](../cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../cli/options.md#rpc-ws-api) options.

:::

### `debug_accountAt`

Returns account information at the specified index of the specified block.

#### Parameters

- `blockHashOrNumber`: _string_ - block hash or number at which to retrieve account information

- `txIndex`: _number_ - transaction index at which to retrieve account information

- `address`: _string_ - contract or account address for which to retrieve information

#### Returns

`result`: _object_ - account details object with the following fields:

- `code`: _data_ - code for the account. Displays `0x0` if the address is an externally owned account.

- `nonce`: _quantity_ - number of transactions made by the account before this one

- `balance`: _quantity_ - balance of the account in wei

- `codehash`: _data_ - code hash for the account

This example uses an externally owned account address for the `address` parameter.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_accountAt","params":["0xc8df1f061abb4d0c107b2b1a794ade8780b3120e681f723fe55a7be586d95ba6", 0, "0xbcde5374fce5edbc8e2a8697c15331677e6ebf0b"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
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
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_accountAt","params":["0x2b76b3a2fc44c0e21ea183d06c846353279a7acf12abcc6fb9d5e8fb14ae2f8c", 0, "0x0e0d2c8f7794e82164f11798276a188147fbd415"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
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

### `debug_accountRange`

[Retesteth](https://github.com/ethereum/retesteth/wiki/Retesteth-Overview) uses `debug_accountRange` to implement debugging.

Returns the accounts for a specified block.

#### Parameters

- `blockHashOrNumber`: _string_ - block hash or number at which to retrieve account information

- `txIndex`: _number_ - transaction index at which to retrieve account information

- `address`: _string_ - address hash from which to start

- `limit`: _integer_ - maximum number of account entries to return

#### Returns

`result`: _object_ - account details object with the following fields:

- `addressMap`: _map_ of _strings_ to _strings_ - map of address hashes and account addresses

- `nextKey`: _string_ - hash of the next address if any addresses remain in the state, otherwise zero

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_accountRange","params":["12345", 0, "0", 5],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_accountRange",
  "params": ["12345", 0, "0", 5],
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

### `debug_batchSendRawTransaction`

Sends a list of [signed transactions](../../how-to/send-transactions.md). This is used to quickly load a network with a lot of transactions. This does the same thing as calling [`eth_sendRawTransaction`](#eth_sendrawtransaction) multiple times.

#### Parameters

`data`: _string_ - signed transaction data array

#### Returns

`result`: _array_ of _objects_ - object returned for each transaction, with the following fields:

- `index`: _string_ - index of the transaction in the request parameters array

- `success`: _boolean_ - indicates whether or not the transaction has been added to the transaction pool

- `errorMessage`: _string_ - (optional) error message

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_batchSendRawTransaction","params":["0xf868808203e882520894627306090abab3a6e1400e9345bc60c78a8bef57872386f26fc10000801ba0ac74ecfa0e9b85785f042c143ead4780931234cc9a032fce99fab1f45e0d90faa02fd17e8eb433d4ca47727653232045d4f81322619c0852d3fe8ddcfcedb66a43","0x416","0xf868018203e882520894627306090abab3a6e1400e9345bc60c78a8bef57872386f26fc10000801ca0b24ea1bee8fe36984c36acbf80979a4509f23fc17141851e08d505c0df158aa0a00472a05903d4cd7a811bd4d5c59cc105d93f5943f3393f253e92e65fc36e7ce0","0xf868808203e882520894627306090abab3a6e1400e9345bc60c78a8bef5787470de4df820000801ca0f7936b4de04792e3c65095cfbfd1399d231368f5f05f877588c0c8509f6c98c9a01834004dead527c8da1396eede42e1c60e41f38a77c2fd13a6e495479c729b99"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```bash
{"jsonrpc":"2.0","method":"debug_batchSendRawTransaction","params":["0xf868808203e882520894627306090abab3a6e1400e9345bc60c78a8bef57872386f26fc10000801ba0ac74ecfa0e9b85785f042c143ead4780931234cc9a032fce99fab1f45e0d90faa02fd17e8eb433d4ca47727653232045d4f81322619c0852d3fe8ddcfcedb66a43","0x416","0xf868018203e882520894627306090abab3a6e1400e9345bc60c78a8bef57872386f26fc10000801ca0b24ea1bee8fe36984c36acbf80979a4509f23fc17141851e08d505c0df158aa0a00472a05903d4cd7a811bd4d5c59cc105d93f5943f3393f253e92e65fc36e7ce0","0xf868808203e882520894627306090abab3a6e1400e9345bc60c78a8bef5787470de4df820000801ca0f7936b4de04792e3c65095cfbfd1399d231368f5f05f877588c0c8509f6c98c9a01834004dead527c8da1396eede42e1c60e41f38a77c2fd13a6e495479c729b99"],"id":1}
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

### `debug_getBadBlocks`

Returns a list of invalid blocks. This is used to detect and analyze consensus flaws.

#### Parameters

None

#### Returns

`result`: _array_ of _objects_ - list of [block objects](objects.md#block-object)

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_getBadBlocks","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```bash
{"jsonrpc":"2.0","method":"debug_getBadBlocks","params":[],"id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "block": {
        "number": "0xd",
        "hash": "0x85c2edc1ca74b4863cab46ff6ed4df514a698aa7c29a9bce58742a33af07d7e6",
        "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "parentHash": "0x544a2f7a4c8defc0d8da44aa0c0db7c36b56db2605c01ed266e919e936579d31",
        "nonce": "0x0000000000000000",
        "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "transactionsRoot": "0x02c387e001cbe2a8296bfa2e18afbc3480d0e49588b05556148b0bf7c17dec41",
        "stateRoot": "0x861ab7e868e3c23f84b7c4ed86b52a6a4f063633bc45ef29212c33459df84ea5",
        "receiptsRoot": "0xccd2d33763dc0ac3fe02d4ecbbcd7d2bdc6f57db635ba31007184679303721d7",
        "miner": "0x0000000000000000000000000000000000000000",
        "difficulty": "0x1",
        "totalDifficulty": "0x1",
        "extraData": "0x00000000000000000000000000000000000000000000000000000000000000008c6a091f07e4ba3930f2f5fabbfc5b1c70986319096760ba200a6abc0d30e33c2d501702d1b58d7f75807bdbf981044557628611319121170b96466ec06bb3fd01",
        "size": "0x3a0",
        "gasLimit": "0xffffffffffff",
        "gasUsed": "0x1a488",
        "timestamp": "0x5f5b6824",
        "uncles": [],
        "transactions": [
          {
            "blockHash": "0x85c2edc1ca74b4863cab46ff6ed4df514a698aa7c29a9bce58742a33af07d7e6",
            "blockNumber": "0xd",
            "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
            "gas": "0x1a49e",
            "gasPrice": "0x3e8",
            "hash": "0xdd8cf045113754c306ba9ac8ac8786235e33bc5c087678084ef260a2a583f127",
            "input": "0x608060405234801561001057600080fd5b5060c78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636057361d146037578063b05784b8146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b60686088565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea26469706673582212208dea039245bf78c381278382d7056eef5083f7d243d8958817ef447e0a403bd064736f6c63430006060033",
            "nonce": "0x0",
            "to": null,
            "transactionIndex": "0x0",
            "value": "0x0",
            "v": "0xf9d",
            "r": "0xa7a15050302ca4b7d3842d35cdd3cbf25b2c48c0c37f96d78beb6a6a6bc4f1c7",
            "s": "0x130d29294b2b6a2b7e89f501eb27772f7abf37bfa28a1ce300daade975589fca"
          }
        ]
      },
      "hash": "0x85c2edc1ca74b4863cab46ff6ed4df514a698aa7c29a9bce58742a33af07d7e6",
      "rlp": "0xf9039df9025ca0544a2f7a4c8defc0d8da44aa0c0db7c36b56db2605c01ed266e919e936579d31a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347940000000000000000000000000000000000000000a0861ab7e868e3c23f84b7c4ed86b52a6a4f063633bc45ef29212c33459df84ea5a002c387e001cbe2a8296bfa2e18afbc3480d0e49588b05556148b0bf7c17dec41a0ccd2d33763dc0ac3fe02d4ecbbcd7d2bdc6f57db635ba31007184679303721d7b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010d86ffffffffffff8301a488845f5b6824b86100000000000000000000000000000000000000000000000000000000000000008c6a091f07e4ba3930f2f5fabbfc5b1c70986319096760ba200a6abc0d30e33c2d501702d1b58d7f75807bdbf981044557628611319121170b96466ec06bb3fd01a00000000000000000000000000000000000000000000000000000000000000000880000000000000000f9013af90137808203e88301a49e8080b8e6608060405234801561001057600080fd5b5060c78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636057361d146037578063b05784b8146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b60686088565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea26469706673582212208dea039245bf78c381278382d7056eef5083f7d243d8958817ef447e0a403bd064736f6c63430006060033820f9da0a7a15050302ca4b7d3842d35cdd3cbf25b2c48c0c37f96d78beb6a6a6bc4f1c7a0130d29294b2b6a2b7e89f501eb27772f7abf37bfa28a1ce300daade975589fcac0"
    },
    {
      "block": {
        "number": "0x8",
        "hash": "0x601a3ae9b6eceb2476d249e1cffe058ba3ff2c9c1b28b1ec7a0259fdd1d90121",
        "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "parentHash": "0x98ae440cd7b904d842daa6c263608969a3c8ce6a9acd6bd1f99b394f5f28a207",
        "nonce": "0x0000000000000000",
        "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "transactionsRoot": "0x8ee998cc699a1f9310a1079458780b3ebee8756f96a0905f5224b89d0eb17486",
        "stateRoot": "0x140a9783291704223eb759e3a0db5471a520d349fc17ac2f77ff8582472e3bac",
        "receiptsRoot": "0x2b5c77f6e7764d2468178fab7253346b9b8bb6a34b63946f6bdc2f5ad398bfc3",
        "miner": "0x0000000000000000000000000000000000000000",
        "difficulty": "0x2",
        "totalDifficulty": "0x2",
        "extraData": "0x00000000000000000000000000000000000000000000000000000000000000004d04551bdd9ae08af1fd661e49d4ab662c98c532c7ec0e4656a27e4de7d330af578ab1e4f5e49e085ff1d78673c7388ed9ccf017fbe89e53066bfa4018142c0701",
        "size": "0x3a0",
        "gasLimit": "0xffffffffffff",
        "gasUsed": "0x1a4c9",
        "timestamp": "0x5f5b6b80",
        "uncles": [],
        "transactions": [
          {
            "blockHash": "0x601a3ae9b6eceb2476d249e1cffe058ba3ff2c9c1b28b1ec7a0259fdd1d90121",
            "blockNumber": "0x8",
            "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
            "gas": "0x1a4c9",
            "gasPrice": "0x3e8",
            "hash": "0x675e336a4281b29c619dfd4ccfbd2f930f3728b20caf9e0067284aa3224e6758",
            "input": "0x608060405234801561001057600080fd5b5060c78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636057361d146037578063b05784b8146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b60686088565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea26469706673582212208dea039245bf78c381278382d7056eef5083f7d243d8958817ef447e0a403bd064736f6c63430006060033",
            "nonce": "0x0",
            "to": null,
            "transactionIndex": "0x0",
            "value": "0x0",
            "v": "0xf9d",
            "r": "0x2e30624c0305e64812e1d9e325ba6e50410314634b008edcb50f45be71fa0d4",
            "s": "0x50e205faed23c219ba15610de2451d458cbd4221207b2168344cfc972a7973c0"
          }
        ]
      },
      "hash": "0x601a3ae9b6eceb2476d249e1cffe058ba3ff2c9c1b28b1ec7a0259fdd1d90121",
      "rlp": "0xf9039df9025ca098ae440cd7b904d842daa6c263608969a3c8ce6a9acd6bd1f99b394f5f28a207a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347940000000000000000000000000000000000000000a0140a9783291704223eb759e3a0db5471a520d349fc17ac2f77ff8582472e3baca08ee998cc699a1f9310a1079458780b3ebee8756f96a0905f5224b89d0eb17486a02b5c77f6e7764d2468178fab7253346b9b8bb6a34b63946f6bdc2f5ad398bfc3b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020886ffffffffffff8301a4c9845f5b6b80b86100000000000000000000000000000000000000000000000000000000000000004d04551bdd9ae08af1fd661e49d4ab662c98c532c7ec0e4656a27e4de7d330af578ab1e4f5e49e085ff1d78673c7388ed9ccf017fbe89e53066bfa4018142c0701a00000000000000000000000000000000000000000000000000000000000000000880000000000000000f9013af90137808203e88301a4c98080b8e6608060405234801561001057600080fd5b5060c78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636057361d146037578063b05784b8146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b60686088565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea26469706673582212208dea039245bf78c381278382d7056eef5083f7d243d8958817ef447e0a403bd064736f6c63430006060033820f9da002e30624c0305e64812e1d9e325ba6e50410314634b008edcb50f45be71fa0d4a050e205faed23c219ba15610de2451d458cbd4221207b2168344cfc972a7973c0c0"
    }
  ]
}
```

</TabItem>

</Tabs>

### `debug_getRawBlock`

Returns the [RLP encoding](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/) of the specified block.

#### Parameters

`blockNumber`: _string_ - hexadecimal integer representing a block number, or one of the
string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
[block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

:::note
`pending` returns the same value as `latest`.
:::

#### Returns

`result`: _object_ - RLP-encoded [block object](objects.md#block-object)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_getRawBlock","params":["0x32026E"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"debug_getRawBlock","params":["0x32026E"],"id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0xf96096f90236a09f73691f6dabca4f0a99b05d0a701995506aa311dcaa9ce9833d6f4ca474c162a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934794c6e2459991bfe27cca6d86722f35da23a1e4cb97a078103ea8c47231886481d72ec1afae6eeb06c3773ce24a91323d5c9eed69d4cca0008992da2531db404f07b0871dd620a94ba346963e1b1c6dc7b00748e8593a1ea0b6c3890d9604434fc52f722848c84d1770add20cd75bbc28cdedff42940dbb56b90100200800000400000002000e0000000401000000440100000000c0400600000002000801000000040480020840048000000000400000000000000020004220000011002000000000000204000800000010010002000002000000000040a000000000000400020000010885000000000808000000008800001004002010020300005000000010002110410402000000000000000890000008000000000000000000020040000002000000000000810400000040006000004000004080020000000000000022001000000000000840400000000220250000000000080402000420000418000000000000000400040000004080040010200000000000108020020000808332026e8401c9c380833e3c3c846436f93899d883010b05846765746888676f312e32302e32856c696e7578a0112d8f15793e7df7f8dcdb21c891cff78c0d1839cb5b6dcd06116cdbb99536ae88000000000000000008a0cdb97712af6685bb9650d21d609525913293c48adda7c45990926daada335c9bf95c56f8ac82d51f8502540be4008303c9e294a68d4c1e3de1b721ad1356bbf827d6bc8cef304f80b844b1bb4d351300dbc7e12342566318001b83aefc9f20080000f3ef25472407fe9c9c69a1470000000242692bb4cd506c409651ab80eb3acfa54551d3dbc9af4493605d79871ba01e474fb147b16b9538d7a59a57738e406158d9cc306a9062b1b7a9f544c35abfa061aabb714c760f2243a16a024811679d402c8822e8b25dfd0038d84298fb5205b87502f87283aa36a754849502f900849502f9108302222794102554afa6b5dbccc86176faef2b2d854201756e8084e2bc7b43c001a04f2398f24bc950db1f5439de3cf6431ea277236595ae8dc5815c0cc671c9f97ca029898786a59c56f086fc0f7a16859f366cf46084add999fe137cbf43693712e8b87c02f87983aa36a7830293748459682f00850165a0bc008255f094fafb56bb5b37c3b0b0ee9d7c31f018aac91dfb778806f05b59d3b2000080c080a0b069dd8967533a773e592c26b1b36df0793d0b9f6eceba34da246f602c2fae58a002009dab32ab63a25b705d9a00e311f7cd5d85e73f9b2c03ffd0e5135c0bb2c6b89502f89283aa36a7018459682f008459682f0983011fec945b9fedd37f0b92e7e282b19cebcf06f57b77c60480a46a62784200000000000000000000000019a1fcc6fcc5832cd2db7704d75efbc800f5a742c001a0c65eb0e48090a8f8830de47f430b9ad11071a62a5db9555619a990d7e9b81738a05a6e826610a5b2ee529a22942ebcd3abd2a8a10228098c8158380e8fcceb962fb9028002f9027c83aa36a7178459682f008459682f0983017ac9942ab7c0ab9ab47fcf370d13058bfee28f2ec0940c880169964394fc8860b9020496e17852000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000003aa4d7eb55ec2539f5305eb27ea42f6f90f168270000000000000000000000000000000000000000000000000000000000aa36a70000000000000000000000000000000000000000000000000000000000028c5c0000000000000000000000003aa4d7eb55ec2539f5305eb27ea42f6f90f168270000000000000000000000003aa4d7eb55ec2539f5305eb27ea42f6f90f168270000000000000000000000003aa4d7eb55ec2539f5305eb27ea42f6f90f16827000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000650cb3772886000000000000000000000000000000000000000000000000000000000000222e000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c080a004f8666c8e5d0f3c7110994f624d24aa47a1327814289698c3e2777284a5cfdca04ff05f1b8c5beb58972d40e5a7b894d5e28ad2f15a3429c7d2bee6b6a9633730b9019f02f9019b83aa36a70b8459682f008459682f098303644f944284890d4acd0bcb017ece481b96fd4cb457cac88715c0f4db6e0ea0b90124ee1490b20000000000000000000000000000000000000000000000000000000000028c5c0000000000000000000000007847f2e0262512206333ffb200f6d9df2da319d40000000000000000000000001e8c104d068f22d351859cdbfe41a697a98e6ea20000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000222e00000000000000000000000000000000000000000000000000015c0f4db6e0ea00000000000000000000000007847f2e0262512206333ffb200f6d9df2da319d400000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000c080a0e5270f6291acc162885656bedf64fbcb904c41951221dc0cbbbdca03bb33ce43a01f08c7ed3c231403b55f37a157d80e121b653baa810add8c02aea722631450dcb87c02f87983aa36a7830293758459682f00850165a0bc008255f0948d247f4fbbe81429d3d164a5c9ae0063210edbdc8806f05b59d3b2000080c080a0bb83dd6181c9a7ae3069af3bdf1820b5e556eaf99e385b8d7b3571321fb2966ba02ac193773704524adcd02824796df83407a42cdd81e786b591eba43c4ffc6c40b9028002f9027c83aa36a7048459682f008459682f0983017ac9942ab7c0ab9ab47fcf370d13058bfee28f2ec0940c880169964394fc8860b9020496e178520000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000062d23ed77d0e5d0205edabe4ce3a27adc49ac6790000000000000000000000000000000000000000000000000000000000aa36a70000000000000000000000000000000000000000000000000000000000028c5c00000000000000000000000062d23ed77d0e5d0205edabe4ce3a27adc49ac67900000000000000000000000062d23ed77d0e5d0205edabe4ce3a27adc49ac67900000000000000000000000062d23ed77d0e5d0205edabe4ce3a27adc49ac679000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000650cb3772886000000000000000000000000000000000000000000000000000000000000222e000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c001a0fc882968005f717a74a2c2fb345f691091cab084f4bd3934358741807bd5a66ea03f81c68d05d06bf851a6ef5ea6874557a221cbadde24f3fa51f777699b5d2804b8d802f8d583aa36a7822c0b8459682f008459682f098303534f943367dfa11e3148a07c2da773e1f65b155b0abe5680b864ad58bdd100000000000000000000000053844f9577c2334e541aec7df7174ece5df1fcf0000000000000000000000000e9e12c660e77a732940bab3c2cf385c843b834b800000000000000000000000000000000000000000006015d637c177581800000c001a0a292e7723d3c950aa8a557bd91dece34ec527d9efe2cc413d582dcd9fc6bf6eba03386ce6f58e862f329946bf32897f7df5d1c8f818fecfafc1223052fb251d97eb8b602f8b383aa36a7138459682f008459682f09832dc6c094ba175fdab00e7fcf603f43be8f68db7f4de9f3a980b844095ea7b300000000000000000000000084a0cc1ab353da6b7817947f7b116b8ea982c3d20000000000000000000000000000000000000000000000068f365aea1e440000c001a0968ed0274829918071d9cef28e1adbf1fd15ec76e5a4f809971e887b4c9f34b6a001ce26485bc7e3ea71fb99866bd43002b264b2ed80e10850203c2f07b78856bdb87c02f87983aa36a7830293768459682f00850165a0bc008255f0946d3b93db4e4078cf6541a68532d00705d9a4da618806f05b59d3b2000080c080a083c831630788e7ee57c87128d18582e29aa51f1f233e91d916c06d0750578156a0549b5a00477f3fb4d8fbf95ba3a636c3a14ff011c1bbf3a717e00d61735cbf34b87c02f87983aa36a7830293778459682f00850165a0bc008255f0940d3a7d69859a0dd6971d39703b15379e05ae2ec48806f05b59d3b2000080c001a0082660b5db2d3a8a58c0b863673ab27f7cfe4c049dcc52c76a00ab45b0358db5a05a7519a2d399cb534480383ac21262fbde2dd85241495d7832dee8bb02c49c87b87c02f87983aa36a7830293788459682f00850165a0bc008255f0941be13f64a2463fc7a76b4092c53328cc965a77fb8806f05b59d3b2000080c001a0e6ee9b85c3b729518524fdaeb25d47f89f6fc6c4d2c4df707187bef74d73f958a0756bbf4ab119805b77466957b5895c1d5bf422c5f65d8a06f7efd37dcb2c87afb87c02f87983aa36a7830293798459682f00850165a0bc008255f094a90b28fd6f8e46ac668fcb688414184a163e2cd28806f05b59d3b2000080c080a0d394dd43c58591e5dda8a7f3a2f4eae1bfd65655b9e9eec5facc6dcb39aa77baa002eeabf3fe9c0a56eae476d2f6452ea72e63a9c9b1180290b792883258f939f5b8f802f8f583aa36a7830283818459682f008459682f1082962494d0f723c6b2226df56fe41e63b9eaa66eb540bcb880b884abac047b000000000000000000000000000000000000000000000000000000000103e9f0f3471dc445d8f209ef546e0d20eaccc12ed0a5b4100007f57d9bc8638dacaf6480000000000000000000000000000000000000000000000000000000001d209b1ea11d77d1ab457eb3e2954cb2b98e77b5b07e2a4f48507af0adc61329ddc210c001a0efa10ab60f3bd1e7c4a8d52a275a568fbe2f5edc9e1eaf386299577ff9ddbd6ba06e62cf2f66b58f655ddd3eae47ce40408445b086f6ea858edb7bd847ee206207f86f82e6e582014482f618949ebf6b12e7e33b8672788e7b2b3330356f6f2c41880de0b6b3a7640000808401546d72a008d6be7aa21be0a43e08e960620f4c40c44010a743ead9919ef9423863c08b12a06a63a7caae4504ee5528e50387ca09974f7124035328a62d1085da2fee6618f9f86f82e1c382014482f618949c68eb31c4d00b94c3e3d4c2887946f8b076b24c880de0b6b3a7640000808401546d72a0c22d48d72c70ccf0a44d0950daf16741838f9333ee0bc5e05ff02b058da1e010a06a20c9f74cbc14c0d5bf3b3c38d3c33a5ace9194cddc2c533afb16459eaa7647f86f82e4cb82014482f61894d531e7aa3c0bee832aaff22642c7a3128d48a81a880de0b6b3a7640000808401546d72a01dbaeffc8e11964c06a722bae73e35bb5de55b8f959592868f2ff5fc13b69bd3a002acadc04665570a2032cdb616de15bdca79127f21302d62db5baf96ae4734e6f86e830176e381d882520894ad346e81c5b26fe563ab1ba2aa4ff811655882ca872386f26fc10000808401546d72a0b6de11598824e338100d5ebe70c0b0f4d6893fbb36f11ad55cf74b2f43afc5dda05101e65e7e84ea9edba6e5bf1a1e07028ae3fa5213240e812e57cf6b29080726b9235302f9234f83aa36a7830137d564748315f52194ac9251ee97ed8bef31706354310c6b020c35d87b80b922e48ed7b3be000000000000000000000000000000000000000000000000000000000001edc00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000001fe000000000000000000000000000000000000000000000000000000000000020c00000000000000000000000000000000000000000000000000000000000001f60000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000002200000000000000000000000009d69394bd71906a235f9113cc04321f573958d3e00000000000000000000000000000000000000000000000000000000000005200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001edc00000000000000000000000000000000000000000000000000000000000320266d6b1b655f66cf8f99d35432492f8fbedfa97a2a48f0efaae65de6738e2594aa5000000000000000000000000000077770000000000000000000000000000000191c15235c348207e935e72b9151056a9661d73631d1e2c3f89ffddf8e74efe8a42ab8767076a555a049372055c846097c99e69c26ab0a24553d21c15de29ea900000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000030ef2c000000000000000000000000000000000000000000000000000000006436f8d800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004d65822107fcfd520000000000000000000000000000000000000000000000000000000000000000ec15abee257256da1a964434000f59ddd45b1ce67d5df44f1c82fd5bfe95c3b31dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d493470000000000000000000000000000777700000000000000000000000000000001d4b5b35d93f51c8143f6a4cc3d7b320d37ce03989cd88c28601f4ea94cd6554249cff83e4dd8e99a8ef9004b2ac7518996f4784af1f9e52debb6223a697e9652530feda219f333e01f8cd0b31ee83b9c250ee51fde9718ef5fa305cbcd01901200200100002020000400000280000006004000c0020000000000000000000100000000029000000000000000090000000000008000200040000012004020000800000000240002400008000800000020000000001040000000000040824000000000000002040000400000002000080000000000000804000000001001000c84000208000000000180020000014000000000210100510008000082c0000000001200002000000024000008400000000220001800400000008010000052000200000200028000000000800000040200000110000010000010000001020000210004100002000000000900280000010008001000000018004000000020000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001edc0000000000000000000000000000000000000000000000000000000000034bfbc00000000000000000000000000000000000000000000000000000000002ddb24000000000000000000000000000000000000000000000000000000006436f8d800000000000000000000000000000000000000000000000000000000000002e042ab8767076a555a049372055c846097c99e69c26ab0a24553d21c15de29ea900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000016a000000000000000000000000000000000000000000000000000000000000017e000000000000000000000000000000000000000000000000000000000000016202bf20ff78727f38ef16e03bfb3d4895f35cc626f97ede7cc99f48aeff8661fe32015ea8d62ec7a79e01cd398e85867bafdcf55cb6a7121b6fef097f5f5656a5d11ddf336b6879926ea2ae425e91c748a553c9a496cbe2ab556a91689f75ee2b01ad3c43aa774b50a9d8411a9f65be42d6cde781db1a1949a1e886f868917997b2a7122720155935f15da0807d0054f1a4c3db2a92ec4124bf590ce7a16594f3f1812f260acb049d01ad534a937840a80c0f56fd9a54ca5a8628ed896d14a5f8b2570f5813e35c990656f6300a1a1849429135ada6337646248f6ea03a7f70ac426c1d805216d154ea5a8e5ff953bc04b71b049b4b5bd549b6b0cfa7f8b21dba72a3805c7093d8589f2d4c55b6211441041e8bd7916daed5093fcebd377c31e810a6499e6e26840e3afadc9b339c6abc86b7f89fc3559f4242d373a71389db20219195f6e13069701f6d539dcf63a049726cdd8cadc412d1c43cf3fc0095ae5e2157dc668bdb924d7d7afc2b4632ab8a0e4ef71941a0a6a65645f6cd8570302f90b98bbdd01be238dc07780ee9b93e22ab87f26170d7fc5531347fb9fadcb65dc2ca20442a70be9e785292d533fa9496308a7b1588b50b45c17ea765de525259f036edd3984782399b46793acd5abb9f49e38b309c2363aead57264ac1a44e6432b81127a0bfdc29f01bd04e7db2b2545ed8426d2fe9b3e561793ec8fc875f2a71f31c13d11b94f892bb9f96bd2931b66ffa5e22b104c549e7c0d5010e4e70e271d48c0bd6e4be68c920ea77af85d12eb155d9b25703eabbd0ede1909565a55f11fcba848e01c60438611958101321898e95c8fdc936d31389bdba8073b382e5b1e2cd25993ad31586d7525f165fb25a1cf8c22623f983c025d21f0e52ecfec5f0232a753addaad88340ca39f00e9722f35dd25fbe8fdd8846bfc0288215d0638004009396bfcd5e6eb0c587797ae8297decbca48b02407219b910ce163552ed230438292cec430007886beabe7cdf5c6f9c3740a3dd6c52ba88e6d652ce43f90044193c4a42335291795c2cc160dc68b6225edb425a88d27cae159f77df3a2241fbe809c8f1122d245bf439df0761bec97358b96d6653bc83702b559bde5a2d12f771a2a11bc9dc32580bc3ccf9dfacd0a5379587ac5160b45d333a85cde46810ad2875b406f00438aee245ecc63815528a185e9e2a029147db7fcffcb8875e5259f15c3e467de02e035891b131bc715e54e7e27a7acc437bb9f6f84fa4456aa016b3578a73ed8a4706efb935be8b6abe0697e46d878d9c74e274f2816d2fd88146b316731719e125d227e002af95aa13f468a9bae4ff41a4a6036ee7fc321b3249aed4dfb6e75089ec0656ee4e87e1fffefbd74edf55a20d752a85caccf583c0d9e2ef1040b4d36a8e992ad50ce1c4bd2b300b344ca881725c164886a5f8f18035f6e75e67a3eaa2064fc24ff79897edb624e1a67f34deb414d5efaf4c55d482da108aa2ab7504fd5d7f78d91da5c20230380ec013b910b01a26b8bed8a05a004d52db30b7fb01f16347692e9f19f303f48ea8cbbed2d3a3eb277ddf4e9ed8026af5ce92a618c8942caf28b3249044347e14e5c3c2ed5ec0f9cccf1d11a5b290c00773e12c25feafbcceeb8ae6c25a88c9657c627187af6fe0bfea0b3cc36c908a76f90e965bc4135c8596534f444c91aaaaaa6277985e36248bd53ef0f74f103eeac98ba92c5350e4a0c586c851ad25df982e16b2d408de37c687efc6915a41197df379614aa657ab5100627c47896b51b000cb95505bac77e4e440ecd1fe50252fc98f15ee41cafbf717e144da35f424e141639de04ebe5d333e9df8c06821c689d1ef2abbfd12e8a1edc059a9279db7ff44bac1962b5f7297da5c989528229e98a91a3a2e351f371dfa34d4c3676725baa5fa4696f67f4239b5fe1e3fa351d66aa5a2df992426d94ba049bbb4eea0ab22e3b9a7409f2b6719ede64353f4112e4da3919adc16dcd99c545966256493d2699ae529e365c20515d95c013ba2627576fb75a030ffd25b85ed3fc40dbbedbca54427f8dc2255c16b742b3e2b82e1bb634ae73a402927e6dc424d1908942b9b0f2cc17909ed050defe85d24a1986291facbb4ecf9b7ff66c27f8e771d28ec6866e3d24bc97e7be388013df8ba8f407b9147ed9b3581784003a22eeada55656d2be271afce06ef3fca32ac9b77b4f2420d60e892c95418b2a1b7d3dae2738a073ef105e66c08488e8a91e8ebdb5a10e979611bd29245c13cc4c0f5b33eedc5263edd6c27666e0c3f02161114120230511406f9f82102fd8c37c36d4e383e445df4afc6e7dbaa570cfe05b3f6038ec1b7932b70e7b068a2656173d241e8f20bb6be3a3a3767111aa6f459f84be961c2337f6e03ed3cc6c847a3683894288b471504cbdc43a78f856801a10a87c77322e36e0ca426ec67ad3a2a3b79bc5cb81928a79a67a0fb46bb967cbab73fd36022f92d920204de61717dde6a85b7bcf57584c11ce54ac92998f856bf042a01c5006f155ac97d6757728caceba5530eb745e72277723ad34268b34008a97a27c370e9bc006aeaca4ac36414f35aa41ff400f698623a447c949f7f004f3c3fdb09f2af3c96042e215f0d4bbb23fda72d4f01dd9a55dbdec930919715a23e2cd772a260e2b91324c244d88ce1b83c92dce1aa0e0c255b80ed9325dec0e677563984a1c559ddb4a544eadeb2a38e8ed7736174a30d2bee6e0b65f3766e0b7a4e4d8022dd9f82493a9b1fadd1907147ac29edeb8cf8c7c58fbfa9b82ed3d9f9f05bfc900e52e29a05ca8d445b5245b16928dd61800ebb63933d9c471c2fb38776459641e9debdc606abf6ccfdf8fb41da88ba0745d96fd4557a879fee82e33df32d18b18d7360529f89f3dea680a5cb0c6a7652ee38589e1997f3e64ce4db1d3c04cd628fc0fd6e7ef1944108d48eb742a28467fa4bca693dbc8f923945256da2a83222d172286c82b1949803c54409de4653f258d0cf4266c83d5675ca9b5b3a3fb322b9c493ed7bff0a6165babb19c94d9e2014b13b099f09894fbcf32959b9d4ce71ddf9d24dee8bc40d6be92ee6e1220d84d68ecf1a0424132315c0612802b477b0acabcf346b0ad5ea329ea72f4de7524530bc00ad36baeee835908655faecd350463484d31623127c09c6cec446a9ac9a53cb6841ca2a097ceef88e537e209880ffdcfd5033bc3f5a885c271e41ee332366345fa867780beb3c1d5eaa496ea0908c560e84b404afb45f69169d28348ca20bb4f5693db19304d154f60a91ec4e9255be05739f5dc7e0b420d4bde4b188a8520bf39202f81dd3e2f4adcc6f4b4be16880103e0ab232f509729c91ddf0006d6a099a769b38affb89d7489b3bf261106aec362c77acdbb0a71c3da369067eb0f2ee9866a0bbdc4ee41ae81a88d860f1784565b7b1cdd350e8e12241103ff9d57c86c368775530773bafc058cbcea6309bd6d9c144cf6657cac5084ac5fe63ef038a71b3d79e6b7a32cc70039e182052f5cd5e415128e9ab1f553f13c165ea122d089975c1daf617766e12d9f3abb2501571eefde182b767e4b63568d37a8c553671adcee2ee4c7c6d77493e4599cd70d002a718fe0d7c31b7df3893f8b9993c90d7d55eea1c38292f1eae3a7887cfd182977403d5c029a42809f2c6fb8d04aff1c60106ba36367ecca0699866e5ec922ebaeffc4e624d0cc2c748f9c446da0c293d8ba7a28125145ce0936a2dd47172c4502ccf050145fc0584ad8608ee8f6c34c3e718fa5ca616722c5b3549ddb5e2f6a96e82c3d706bf255afda0272c199da51f9a4a869ce8b164694f6ef7593ce08b4bb0afda822eed4a0a7863f532fc0a22de9de5d3456574021b711c42eb1c9190de35ea592568f8ba5528c0f5fadc38e10b14a89a1e49fba9a76ca2478dcca20f8a3c78bb3e1b9869b7375d0deb87819ce7209ad4d73d84a92d08d23649bb50ecb4a1763050b7860afb055461b3158647b453d7977bddde0fac9415327e7eb2ea373fc8abd6793f576e72a47c92d6f6e19fadfdf2c6912365b74929d9b483c19f5146ac5a8dd943caf50b2e0a95fb19066a63a71862a540b2e41731ea66697094e51d309589ce9d25a37c06c9a12839c4c08a050a3ff9e502514f20d573c610466ac5399e11b0153954428f25d16958ab48614d34f768991f84411c401e6900fb0dfaab4108db0ad42fc9ae0a255e60fa4d92747ddda47d07de9f847e7a2be289798c5d34924aae419abdc41d30fb095c6ccabe5c5d5be73ec6197371ea74e08f0583b21901bd748db5348282cabaf57d883f5c55311f1304d7fcd30a9f0b22f810b1a7f089860e4ca0f23ddce9a23d7167762734b10b995d5bd2cf3b31f8f24b18d0a2f7ce1101d3a32d18988f162e91ac94b0f521f24fa287b0d2b97c408079336b89af9e842cf31886c701018ba98d5b0eb0e6d41b67b499f4c466cb1412db0e5937f7ffa83426c9234c713096444d0fc65d1b45f166e54d2a54bc103de110669fbc34555a6d16714ca37651e976b06a7ee96d80af9ff50162016a998451e2ce5819f3346b1fcdf6fe9ff3ec8420d4860a9980ce28fd8c55660983a3fb02cbedb5c638a49e5cdf0b69b71d78e071f1200608e235e6ed0ee8fea5567be12018bcd026412db0538c28bcd4a9afe799d5c677298646943c4200a039d2fced71d985d188f84dfd3132b6a015c50b8a60d712a97c89e0cd7d3a1740244c1522b117dad1220463f5d4af1004c1a2ad6b5708d7d6b28f8ae1e1e7dd1b2d3798b8c2e27a3559c7202aa268099eb3bbdf7c42d0d20b47e5623dba8e6aa1392ff532113c32bd836f4160abb287aefe648aaff6bb0a23928f580347046b64babf354790704538c6ce83f117ac7e83e1e0f54054466cc82b2144cf135be31f24f1b224e2a956827c303b0d82964e284b968c5ebe97688e49ca793a4aba81a3d36eefd8c12e3ce9409be63c3a308636a7b296b804d8125b4f29068ef44d3f2a3c9eb13e61d6365bb96d6973e88a70757b1d9213511d357d252df58d1e848d534d9517165263e803855e8caf387579f1ff0e7e9c3c8e532a2025d8016b70a45c24a546f0b21acf38d16b27eae6466e22396097090291184a7719beb4a55beb89275c6893e01f2075d3b73e165c39335d34a5aa7b280386e30a6df9ba917e1dc6774e2edaa0c87e8f5fcf89306a6fdbcf8cf52cf25f5df473fe350325d510421546765acd00b34ef53e56b01445deea042282e7d6ce20c8f967204c26bda9f2596fa378dc611091ab6db9e1e8d4e9b5c1cc4c4d6ee2ad82b32d08f8cb5a9dd9b03f7aa754f2738ddf2dc0c3318974ff3810765917c251c74ce3d7132c26b5f2ede12a6f62f2e8ddecd5e0d02f99f2ed8ac15641c586d68e093fbe80cefd6a7dbdac6d43e261160807eb82fc2aea870a22b25148d256a083325a5b97bcf0187f748b6c0a1691867344efdd53809fb9edea57669c33780a4aa9e65149937817d3d845d9fccae1876575d5383d06adeacd0f3371209a30e1a9c98446174b0b98560652d0643f120bdabd5484435871b42ad0ce36aa8330c7edd26e64e89eb84e0c72a2c6e49fb24088ae2bdaf7ef07af9bfe381dd6a9ed430a553de1bad4dcefd5239b389090925a69e44e25800d9fccda11ff4e1e4d3049386397f1145c3595ab5115255bc1c1eabb379a37504eda27b1a103b88ae8f174e1d182e3dfbb0b8317d05d6e08c191661b04537421fd84057a9ff5a6eceb68c5bf1f0e356df6e93d936bb6bdccb42127cba43e7615d522242df13f08e5fa162a641430c1431a7d7181dec65202fb618a690c2bf3361d7dc689d5e4a97a550a9b17c8a5ada8f32db3f774e9ed047c02eb7d1ba7add29fa07ab90f290e77bd91ee9b5208b1fb19a37f29dd1a492fa32156a7d43146a336fe6144d19228f975c54ab304565269124e069e864873c0eef23f2e7b012e84ad0c71d76e1b23b8b9a0a66edcd59f4b203a9773ce26baee206254b49efb10cc48bad814b2e299bd478fd4bd8b1ae2c8bd99070b259a9e204e42fc5f65f9e25cb4e4a1a3b67872314fcaeede2abbbc6978660c3e685f6dccb53160d1f7517bbda54177495c23fcf45cdd66363a70a84f2699e239b5071c9e6cb19069f3e0be9f4390c8028ae9960851e34ea18ff88d36ee826c0a4db4e33e94f0ec6651a728a1a2b0c15b30a1783ad4b1d224d87264779a817d107d40c75b77c25addd7b7d6a8b73b2d551f125daed95786920c4130d2061178604f9604a0e2f1c6cdbf3066fd28bf276ee0aee379bc049bc8eba361f4052bd2a698da312c991015c0fbc43ea1d2e72426279fc5181851a15a2f4883018ab01ff8745625f388f05f5fa9abc5d87a710a1227322626115b60f781f4ddd91e205c1cca582a5e37e005396703375846be4f36fdb76c277dc1a2ff1f183cbafc6db485a562f4d08262a207844a3d12261fa0ac479abca76f417df42b037e611b1b6acfda94d5dacc620c3edf5744db24bcc41ef1722dc0e620f8a35c50585a7cecfc97f05bfec21f919420e62a9c4f28ea9585cc056aee08ed8891d077a9647d9c0b5c3141f8c517f13b05bf0a18b99111d2d6e7b4892e78fab35d882e4e153060f0c44cb946d20ad0897a34d2a24d3800b54acd68fdd797aa362560dcede6d12909948bd6f4726a20142eec9c6b78d224b2c24885490bfb492217c6809e0628164579d2c2c16a90f28aa5393ad44c45d4e1500fccdcc684023d7cac4e2cca889333f048cd9a29de018e958d00553c77c74ab50d974df5f654233fb923e809ef6ceabe6a860386603003cc376e90b8bee74f2477343a5ae923aea4ffe99a91b9d9289ddcc3ca316b026b3d369aca474b7941588fc6e9cb062528b10f13b90dd55afd64f7b0ab79163163ce02aed379af25740ac5e37c5628c0b868b7ccfed0ae521c964846f0287d3006952539b2dffaf891bd01fe98a1685e71536d7f33ae85775d11545eb379e0916be616206968605e5033267f6f79cc651c2ce71a790ae5cef19fea7604e479c0793f82db1f8e85bec40d8c6a2dbc9bf76d02a616aced611ae1a7a3756d87dab2855ca585d0048e1e4222ed9d6fa24e3e13677256fbb9959b965727c192696a11474a7f6a6b6c8efb649b1f601c76576f36996ec7a20eee84208232c20e8502903d4e303e4ad7139c654b7e5d2aa262d75672cbb4f653e62ed8e4d28835f7d6d0efb3f39c40558d9cbf19f250681a5c8a59143fec80d6a69d8a265835d6562ef248fa4ac508bd60c9283f6e731baa786828d0f7a635e1d14a448383c8b0243570df4a42799afe03143c227e3fcf0b1393bdf8bacbd26f1041d5e3112c84755942fac77981fe16f048cd882243a8787b09bdc38847a5a9cc9aaf4d30544181ff014dca8b2892c00a933333df6d8ef79041483f2d8c6416897ae7897ca1da85e8f0a493be4520595cd0dd7d32c87999e703704ba0ac7d8b444dba807746123100e2cf7573843a0a755eebad6045d2970a0ef8c9adddff093e79731d5e506f1c43318fb25144ff5fb63041574e89216ebe0ac75d7dcffc35d095691723493c94dcc11d4480bf3fe7b76ba53cae5b409c002f2d1bb5eab08ac993054ec297543798700fe3e2877a4a0cce53599a66eb4f1fef5cafc774277f0e694ebd7f8748fb5140735282e5e0b9bb35b8aeb098775a33820c9b8decad3ad6ce36f79c347dcc2c60a5442d2eab4368827acae1f0ccd52f0475fab95ac57c3c9d7c2649d355756140d5a1e8c6eab8b67a5c169cb899230c4be1dc702323f2b07ee1fcf5657361e250ccbe93bb403abd857eee4335e454e8485a3b055c908c957dca3f9a288299729216103089910386fb994285602ce12b04be1819a2c80394b2410767d9aabdb591e4c4dcd08d1d5bc1bcb532496ff1fc968ac3ff59bc7266d8ecbb67f34b681331685a99b781c9752dfe83d145bd4f3c8ec634f028e850e246aa81f1d03aef40d000000000000000000000000000000000000000000000000000000000000010cf90109b853f851a0bf32b9037b600aae3ecd3dd1838bc9f18ae1661f615cf3d70bc270b6c31f55fb80808080808080a0a2381991afea644ece5cba0d8d69f838f7b123d2e0057a54509e0c61e8b293028080808080808080b8b2f8b030b8adf8ab8301edbf808303d09094000077770000000000000000000000000000000180b844a0ca2d080000000000000000000000000000000000000000000000000000000000320266d6b1b655f66cf8f99d35432492f8fbedfa97a2a48f0efaae65de6738e2594aa5830518dca079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798a05f3b41e975b46e86d5365943cfe25ae960fc2c7c1bb4eb0025eac5eb0bc6639c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001ebf901e8b853f851a0529f2d89256fc038782a4d70b40bf127de906cbe211e7acaa3e928e0fd5cf11d80808080808080a0b4f4d0be01c65da5308bab41d52d8a7c93a1693c170c44d1f619b8364d40e3428080808080808080b90190f9018d30b90189f901860183039445b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000001000000000000000000000000000000000000000000800000000000000000000000000000000000200000000000000000000000000000000000000001000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000f87cf87a940000777700000000000000000000000000000001f842a058313b60ec6c5bfc381e52f0de3ede0faac3cdffea26f7d6bcc3d09b61018691a00000000000000000000000000000000000000000000000000000000000320266a0d6b1b655f66cf8f99d35432492f8fbedfa97a2a48f0efaae65de6738e2594aa500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000adf8ab8301edbf808303d09094000077770000000000000000000000000000000180b844a0ca2d080000000000000000000000000000000000000000000000000000000000320266d6b1b655f66cf8f99d35432492f8fbedfa97a2a48f0efaae65de6738e2594aa5830518dca079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798a05f3b41e975b46e86d5365943cfe25ae960fc2c7c1bb4eb0025eac5eb0bc6639c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000189f901860183039445b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000001000000000000000000000000000000000000000000800000000000000000000000000000000000200000000000000000000000000000000000000001000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000f87cf87a940000777700000000000000000000000000000001f842a058313b60ec6c5bfc381e52f0de3ede0faac3cdffea26f7d6bcc3d09b61018691a00000000000000000000000000000000000000000000000000000000000320266a0d6b1b655f66cf8f99d35432492f8fbedfa97a2a48f0efaae65de6738e2594aa50000000000000000000000000000000000000000000000c080a0ae5e67673b90f2d6802e8dba26aadb2e8b81e059d1611afd1908e743e3c0b75da004886b0ac3a810519aa2395bffdd94fbcfe4a2de989ec95d1aea0fcd09afd931b9235302f9234f83aa36a7830137d664748315f42594ac9251ee97ed8bef31706354310c6b020c35d87b80b922e48ed7b3be000000000000000000000000000000000000000000000000000000000001edc10000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000001fe000000000000000000000000000000000000000000000000000000000000020c00000000000000000000000000000000000000000000000000000000000001f60000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000002200000000000000000000000009d69394bd71906a235f9113cc04321f573958d3e00000000000000000000000000000000000000000000000000000000000005200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001edc10000000000000000000000000000000000000000000000000000000000320267dbfbf2c535ffc52117d4cc616b8d97bd07cdd8585ab67d9095c067e9de6d674400000000000000000000000000007777000000000000000000000000000000010012f20d5ba20a09e185d452c999c129d712b83c75480e2e029fc895986d361a781b2045b8b5226f9c1fd712d8b1a5f1faca84f5fcee87a7d1dd2b57f55617df000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000004f9456000000000000000000000000000000000000000000000000000000006436f8e400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004d65822107fcfd520000000000000000000000000000000000000000000000000000000000000000bbe20eedcc0216c615d3a0550a5507bdb2f9912eba7b608300486e871a4e42491dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934700000000000000000000000000007777000000000000000000000000000000014852ab81d236f35c396d4836a6f82239f5672a4b6136ab9ebdd8669a9f9e831b87a26944e5c04f16b79426135ac11b155922c14178bf3d1ecbb1fb12ccc8119a22df5003de2d5956c745f9e825a8f0ca1bb1e265d4d431781b00765e0fe37280000000000004a00000000000800000020400004002001000000000000000010000000002800000000000100009000000000000a000000050000010004020000000000000000412000008002900000000000000000000000000000000820000000000000002000000400000000000080000000000000800000000001000040c0400000000000000010000000001400000000081000001800800008280000000001200002000000000000008440000000000001000000000004000000000000200200040028000000000000000000200000000000000000010000000020200290004100000000000000902080400010000001000000008000000000020000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001edc100000000000000000000000000000000000000000000000000000000005364e600000000000000000000000000000000000000000000000000000000004456ed000000000000000000000000000000000000000000000000000000006436f8e400000000000000000000000000000000000000000000000000000000000002e0781b2045b8b5226f9c1fd712d8b1a5f1faca84f5fcee87a7d1dd2b57f55617df0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000016a000000000000000000000000000000000000000000000000000000000000017e000000000000000000000000000000000000000000000000000000000000016202bf20ff78727f38ef16e03bfb3d4895f35cc626f97ede7cc99f48aeff8661fe32015ea8d62ec7a79e01cd398e85867bafdcf55cb6a7121b6fef097f5f5656a5d11ddf336b6879926ea2ae425e91c748a553c9a496cbe2ab556a91689f75ee2b01ad3c43aa774b50a9d8411a9f65be42d6cde781db1a1949a1e886f868917997b21ad05b7c1eb0d208d17426c52831c6347a8db75b12bfeb2970c4dc6666e4eba0492d2ec318089b11ee7ec6087ab6a3df335770526cc0c1679b764d847b4ec1e303d400c12e690aa26a3771e5676e7ac95e2dc7a1b33be698f077c598f880d4203defa26ad36b84573e923af347475c7c7671be245e9859ca1db3c047faeee4b1c0e81d8a92915c2b94ff300e18f77f70ffec15631161e0bc3cdc9143c43422c208187652c1ec83c5d282e10587216eaf56689e5fe236f72c13eb9574afabc622a739cefbbe11aaa4e2e3d4c5415818914fe554a07be374f565d9bcebc0134940e8921b87bd4f6b42a6432e6e176be5ec82bb8eb6bdb7e4acc1f1e99725bd3ab2e3fa52e02c2741dfe6eddf5a3846dfd57f6a72e834faa048cb007826a293d9e163d47f9ea635871b25afcc3561dfce77b3a2604b3c8de90aa24916f41aed62d2e0c0d18f9c259bf614f1321c5b7cf7b5bd73cec408dd85f046bf36302e20f3603b7832071796022e893386de4e3b170135a591b1a44117240ba85876dba586b1f31c13d11b94f892bb9f96bd2931b66ffa5e22b104c549e7c0d5010e4e70e271d48c0bd6e4be68c920ea77af85d12eb155d9b25703eabbd0ede1909565a55f12f7e30e74b0329222f6067cad3b4324a80f570506985d729f7780955333f40e615f065023fb607d975d7a2b9f234137e72260d8f6b586baecf42819f8328dfb3304441f2c9e97d1fab9a3625073ac3d2bff6ba2f8d659cbc6f66e8d9afde1ef229ff39bac1ecd65eddc4953e2726a72daefa76f00d58e11c9a9ba3448fbe0d3a03db78d70ed9c574ddc45de5c73efdf3113ee70a4b42cea9884f85c1b995516912800abeb70f3022d5de6d9f49469161a36a6a309099ca43e388908635ed4ae825a14b7cf5213454a1f345497008ed417e5d33ef84c4934368b36f27606072192a1b43396f89647f0541dd25f55b42c5295d3ab2a22355664608b8dfec3c9d76045b27d8c2bdba7f376a44826bbf4044aed0d57068489fd32a2bf52f8613aa150185aafe655d2b86bf8867a6f7728c4133fb95776545b19767a0d7144f60f5ef038eac390d1cac6f9882211d7302137efc82b93b8f9c55db629f47a2c61931c21d01d5ad967c9dc6c1abfd496a74df2ac4714cfb027bc4d8c0153543ca663ded2af64f7396ed3b2ebd1976386814e94b7f7fcc3a19a4dd876288b905c381bc8f008de145083d6404890a863e1af1dd897aeef2516b20df50befb6c708c9728a22cb31d80b0e953aa71230d2462bb0668dd8701e11bc5240d85184f9298e2c5a3257b5dcc3e138df8b7d4162d6253fb5c21a65e952600c8764c613c6f43d22c861d4380cd688c286e9ffad6bb8582421fcab96b075769cf48b3160f056dfac4041b08287533a769bed0f08fdee9a16c5c8f414eb35830793c7b64341fef79dbc529a7b99f85d4e2e88b64954be967c5ee6386f9131b80b454ce70209f78f2101d0ca71da273735bcbcdc5ea5d3d54b607820b9bc852abb1b733cb7bb5018276d30c4c0a7f9ffcd318499a2041043494b82456ca8ac6f07678a8b770329b7c00f31e70e97ce48bc796570be27577e8986ee4c7fa51da44bdecfddfcf18686cbddc02ca206d9132d451ab55cce8069f631412ad2ae02b1a8245d31c0a65854d07370259f632fe253b2412c5a785148248d660d7cb6bef5240749d6ac4a4ac59384b27e7019c6cae15ef7c82e5a952f4da079b6205f9e16f3d3c84e94b490530c5b602d4bf5e9d34f2a785cdb7f7755d6d467a9d88071bbdf8c79195730db7d0b7872cbdcdabab02bd4b8487b726c5ce6492344ae7e900a21893e7b840b46380ba99278ce95322dc23daa97995d1149d425952913428c8ef8659dd2cc2895f12b08e0532a254fd5674fcac1b0992472ef75337d8d77f6fef3720d4b7b17302478c7d2e3b8dec7af4c681aba5e25d8aa3f4382b0082066c3f7a0b4e42c4637df90d9a1e2f3fd1cffa7e0d5577f5da89353521ed02cb1c39eb5746cef10ceb74c3fdba13199b42516ebfe29af40da64ad81b46b7bf04bf25994255c7a51f6839848810025bb52fe7500cf1ef628a07747894e3b73d53e6b2997d0654f1ffd0c070455400fd7e9d670984ac807a0f8131977ed1806fd3c0927c34b7b4dabf011d31e86b1b7932b70e7b068a2656173d241e8f20bb6be3a3a3767111aa6f459f84be961c2337f6e03ed3cc6c847a3683894288b471504cbdc43a78f856801a10a87c77322e36e0ca426ec67ad3a2a3b79bc5cb81928a79a67a0fb46bb967cbab73fd36022f92d920204de61717dde6a85b7bcf57584c11ce54ac92998f856bf042a01c5020d266b1ccea774955484405f58ad161251d879a87c43d5dbaecd976ac5d04dd2586d70031a86b0dcade14028f36a04508494c7a20e98b3b21f7765e7b3ef68f10960709e63eea35a26ff47424e18df8cc271ff3049262c855d6a131695a395f2ba2f1b039012ac8a2abdf6d9f6b0c432f0ae78b9bccb99f89759434477257ce1f44cc61e95b9c9843ec8efb17c640fc4c837ec125fb25323d3f0644615d21721607fee4d68e2dc9bd29f5b13fafe39b0710d0365dccda35e3c937aed1b6949b2a0a7523011eb706357b85e174376ea7cadbd01ed0dd1bc6a8e5a5a11bc6131f0661dd6365b13c6e2de50b98cba1cde58a921d19936c711424eb625b7c35cba01a0f7dfa8d6f86a2a02425ab48e2c28f8f2f61adbb744c221b9c4f35b16c749c227bcee1202e87537c7441f421c855ce87d858a679f09dcf814bfa1f26f7d9ce18f723d2f84d4b25ec60adbb6367e92270836d03c71ed43413767342a4fb8d6801b8755bf65e7947ed4459ad6486fc1cca1f1cc89df3d307f01d8ac68aa1d08d18aa35a46bf245589c599eddc6337e764c36426f7b7f5d2afde0a76fd3aa536d1a165f9f23cfc65866f574f2289aa5be056dd32c72a204ba8328dd9b0b4643790463484d31623127c09c6cec446a9ac9a53cb6841ca2a097ceef88e537e209880ffdcfd5033bc3f5a885c271e41ee332366345fa867780beb3c1d5eaa496ea09160db3fa7477a2fff436ecee95aa2d51ff42ca9d4fcf021b6e501410fd41098a1a8f6021636ece98c27bd74740b7280d3a5e13d9850fcf7f2118c4c91572ba5826fcc4b0837d0b394f6683cba38fa35a5e2bd242041533bd25939cc873d1f5852a2f57cb172eb17c2e3c351240a0b2b334978b90ac18041b09aead26649b1c1c019e41731e77c6b2211d7da94630507bad027561dc625b7e84094378e599a57b09eb32c2a67cf5f2f0bf9250e6da07b165f97dca10517e9f3fe3561d02ec83a722b544bd6e25ef27d9825d13651443c4d984d7e5d0fd70c2a7f983b3ae8c698d27a2a0bf2d35655f477adc99c56f48773922831746f8af58de941a020986ad7c23fb7d31c2f17f305174db26b40447e64c66216dce98e7a8316dd91dee468e602206a4d1d18fa7827f733037fa87dfc9c74c9df0960867087c776382b94db9420a19e5338e17e8a68cb7621f0b56984610bedd3d9b77dc5447cdb129ecc33596079cf206e93904368cae07f0d449e2095f8abd95f26603d2db047647babc8342200be0095aa5489fd18cd00a52f59b70ff04c4b1e572db76d08bad419abbabb00b9e485e3f017807c12b427b5e0e648cf7b16065e313c1c073ce354a5fc6812c02b8d4b6aa1168c575dad9875087fe9f61702309febfb99b895387cc1104c35e123b713019b5e51c320fc2521cdb5cfca20f617773fd46d3872128b87df6f66a21fb3fa16711245ab65eef629c5e6073efaff5b707657f4442f2eb2637fa71000f14fc691a71aacf902c0c1a1a5d7d8d351b8b3cad57acd0a9e47a1abdcaf2b70aed8b7370a6bb2bb4f3d679c4f9793e4b256deefaef1e6dbcdbb648b917e34822d833d2ac1614aebcf360d328d9271f27c52c93de4a9455ce6cd8d2140ebf6b21c9b172cf47556efc5dff9afb913e328a708292bfb65c96d668f4d0b3a9a21b222039156cba9980d6bf11efbd8dd893378e5dc1b323c57d8f702076c22d125d1489bab2553c5521631c35f7b5236007ce8f37012cace78d6eb39718904b5dc31ddcb6f4f175e52bcf6c6008f6f5a572925600194b9af7ae074dbf85119e3afd141b2ff2652a58f043e97f11b77997a9da1c96c18b5254a107f24e997a3ea61c2069b9d04d49bd1bcd2495b19bc71848f28bfb4f0346b682a1b474e040b056e60a32b5e8aa532103101cb45ca41c6a690c8688523b8566d507f29eb44fe2d2490e81f4343ca61c8783b83e40e3ce66532f186e9d09bd2667cf974a763072a910121aa5e86e151d92a868508b680f795bc30b4502769f41e3afef5f321be9ce2f1cff3eb3308d65aa0ed780cc889f605f35eb5e02ba772d08db2579f8561c61fa09a8e23ea1416fb95ca0c7e139ddd16f04b0c872499e44cb5a03868d6c5fa1300c19a96b8586b8f33bd760c6350713696b7d3236acb0eb35bde2e6378e9ef9b117b02290ead7824d42452e332f6ec95a7f871da9ebdf6ad02c959a1a36ba33ff0089a4f5217b7bfa5379a507b1e994fb7b8fef489f1f2cf6fdedf0e530635ef31faaa1a37457c445836376dc5cdefc7770fbbad8c326955655efe4ecde89bd2f1dc62a2551a45206fd7d42605aa1c0fc80476b741bd7df1f0f2db0fc387614240e78427bb3a8cbbaf9bb112da06ea6942335f88c65d42d17816136509ec39b51079b5eb2a8cd15c3d1fbc56dd72c3499c101e2fc9126e8f194c6c8006faef30917c5e535439c6b0d78be52a4d17a3a25d0878649b668db027eecbbafcfac7a612138c77d1511f9cc5e763eaddbad6d9d8770705ef7b4d062b4c6dc72f30d1d272dca8700ae03a4c6d2cc6a0a03f9bfb2615b2b294515ca80827ec9cbaa7746112530f5e70f236a641c05bbc8647dd130f02db3561f9dfaa1d687235bccb0498202af478a6070dfa49df99785a61eb5fe5f18777569c18b08d2042ae8639abbc225b832a2fbcd95ff43a3fee4fb2962983af8304ef995716110a7ad35c538697c109c01c427ca6cefef3a842fcf74b1c49a3f2da88b85fdb1d05e20cd567538942fa2f0ffbb5d2ff73d60d562d9a0a6894bec3d85a709b43e42ab64e2306cb96919e078b899f3155af56390d06ddc662afe8d2c91fc091e2c5cbbfab3fdb3f49423a5a5f7741f2d70c6736adc66e7c2caa89c6bbc678bb4b445a8a63d120867f01f164dc87adc853633ca7bd4b9d585c2a637d1469da612b5210476fc8d66f90029bdbf7fa5eddc8335cd23deb4bb47e1582e64a03dd021292d34435419af80af178cdfab0fb9374fa0fade48108cd3a571b814231784ac37c9f6071fc6ac0bb018595c9d8afbfcd6f31832b2581f7f7ce7c45d22817aab8ac6df0e0995e12dbd1595c3377b707b816c96ceb1893b9e7c747a577bb7540b89eb3ff7cac878a7a121a37b38fcd3248abfd24b50e25948dcaeff8c1c7ab8b745a93adb87cd54fca223dd940ef4d7eca9dd69243c74ea128ed624e52c7a2257f3950d0c7409d665d912495f8a8a2cf2482c1d51cd7793d3d31f32ffc24374d8606daa2a423931d97019ba2fd3ba773645b7fd01cf75e8201dd29f694a72136b585d940bff8867654223c28d0603d85fe4472d93ee30e35f46e27b8f40f9a9ad03992d9ff23305fc062c7d95971baae1ab074df88d41e09ec9752efff012c482e0cf9aea2b78cc26db146a278d584575ed615f5d168e6df7a832322da093f0aea706cee594207427d3005fd910843f3dc54b14f8b187e3b495b7474792743fc2e43f62bbc7fd50a76513f1fa4073b15a42d1e78a708134238f2521c749d086deeef512823b514aa64122b365efd51e11415de40826971c234d571c3e2a0507226c6ccc540e43a9aa32244b29784ac824c20d3d1b72dc7262f61cce4eefbe9a4ea4cb1061e4a71925aa13f31d6ce80bb7c56bf47b91cf107ab17168dd4fb60614757d7c7f4ebe0320692235fb502621ed9b15b9b3fa23aa1bf266a2a2c3f2386b52625e42e0cd85c37319e3266185419bcf6dea997e52ec8fca5887a68530002fcc5b3619e88d4dc9a918cc36bac2416ffa9b9734ac4e67a93a800f36d7aba4ecfed8d65f62cf6ad13d184a8c6406e3ba17b8aee6af0721ed091e1d225d044629a4ef5153c294a3e87e243e03bdcf6eaf7ee56d9d969a1f054d5774a7e2c363b160386b909c89717aa7015385f4ab8b6c97805c12c37d981ca945134cb1306d39a4d136b42c36d8aacd2c37575a11b17fa50ede8072d667f64bb55e3b54aff2c3c61782e442e088db7c1ce62287477132bef00c17e9992dd42f35b5e098eb97724fc4e697d75812635203abe8f96000d9553012be065980fb16d6d1c0c80457585c6eb699b0e8a6e36c1cd518dd1ffc517afcb9114a4ff629d06cd2f0be1495c4ee09243e96529e6c3a228c923ca2a703930ea94f7a5803645324ba9ea1a08e6c3241fe57a80bd24f780566342561189baed15e85ba9257b701d651754ff534e51279961ff379974e34010d80773b169a140e0ee7c5e2c0312c9dee46fb7b309710d448a43805c7eab513e84e346411b7145f77ff4ced7b32eb641528f78d88af0fe88e0840e9c16f2210e18c1da605bb04a4c963441c06fa839f722b0c67345168bc0fbb1c826f20472c7551a1327eae9eddbc24e63814fb81320cbc6f03488d64587f3e5f53c03db02cb15412e622f9ec9944643d4b5530b0cd4d577489d8ee499ecf2b74fb72423412aca8530fe53c3fc584ed8e39f900843ac73e36fb113c343cc197cd689a09e12f29203c1dfe839630f6932f3a29de81ba787f6044e70dff8981b71fe82f8a4d01f45770a53b090026a003b3e639eca0e6a1e5bdd0aad456e89d83012ea1f53e1a5fe848b33528f7195a7b0c36d4315f1b96b62d5603e87a13e12a97ec335e3922d4339d9575cb26d5691da78a738aa5c84aecc22a93033a6912f84360d13e2e23b0185bdc2cd331bd26ababcc91894935db5c7e1800b8a10db884a7614ceea91f38bbf623c5e7e7238eef06cd9fc9e43507c56e8d6212b7d03ef2db0dfceb040c0b206e1b7eee6ae564b15e4c02e9c3e4179d78bc68a9fbc2166cb8458342f218dc631705602b2ef1c6716dbc08f30810c9e2ab3ac7a03e300e9c21cd2a0240025ed5eda13e6daa246241669acfae65302dbca5c579d3b5c3a4c16a976209e22845337f9ca033329f849f3ccebc69ff01b301d99dbe9e79058fade67bf881c70283f41eaca130d1423e733ccd520f26ebbe8d304cbb8fa2f4bf67e2e041e5e90e840d5510d33a9f700219fbead699901ea3b3f8aa3d5ff0c028ceee5b5e711c29e7740bc98f4b78f15f2aa1e01449f1f15e68023861f540d2ae0541273c641914ea0e6abadbb2f11618bb678c8b7abff1f6d4e9f789706cdbd8dcc1acd4bbd506e42e928d134366d3f32d8caa4b86736bb065b1a3f89354835b7ba5ae1e53cc1bd9f5dfa3e0d49c0a0a8d32670c382712e30f8f4cb8fc980785fb6012df752e02c923d3f56f5764a41629646f9fd7641c8365f0917f85a64d0ba36179e2c2b3045d7b3c6ccfdb60cd5c365c43d88e231465c6616f7d2cab0db88cd79268e5ba0cecb98875958ee3827af7842e35d9cc89c3776e5640f2433a6afccf0e6fff9321e31802746639bf2bf77f375dd6799baa184b48815f24d3fca5d534dfe61d1306d15e97d3a320457ddd2239cc52fb31dbf98709cf090ae59afabbda6da75f4e1373a28bcadc2405e0a7f6dbf9a3e26511fc600a496b4623593213283a1fd33f000000000000000000000000000000000000000000000000000000000000010cf90109b853f851a04dd5a916917c46969db2e2093e73972daa52d5582e183eb0bd08362e7aca1dc280808080808080a03605d0d2c4765be29883abb71f1c4b162f9d6786835ccabb068a243ff819909f8080808080808080b8b2f8b030b8adf8ab8301edc0808303d09094000077770000000000000000000000000000000180b844a0ca2d080000000000000000000000000000000000000000000000000000000000320267dbfbf2c535ffc52117d4cc616b8d97bd07cdd8585ab67d9095c067e9de6d6744830518dba079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798a05a4ba290d849b719839872aa1e6999ee672fff37d450956de85fe07c96f172d2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001ebf901e8b853f851a087eef6c6fab228bc280138441d870592a3910f042806b16f257faf5f1542f9a280808080808080a00ac60a3a5bafa4560edb7bd978a6b8980fa818c5edea7c010986328de4d9b4ba8080808080808080b90190f9018d30b90189f901860183039445b9010000000000000400000000000000000000040000000000000000000000000000000000000000000000000000000100000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000080000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000f87cf87a940000777700000000000000000000000000000001f842a058313b60ec6c5bfc381e52f0de3ede0faac3cdffea26f7d6bcc3d09b61018691a00000000000000000000000000000000000000000000000000000000000320267a0dbfbf2c535ffc52117d4cc616b8d97bd07cdd8585ab67d9095c067e9de6d674400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000adf8ab8301edc0808303d09094000077770000000000000000000000000000000180b844a0ca2d080000000000000000000000000000000000000000000000000000000000320267dbfbf2c535ffc52117d4cc616b8d97bd07cdd8585ab67d9095c067e9de6d6744830518dba079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798a05a4ba290d849b719839872aa1e6999ee672fff37d450956de85fe07c96f172d2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000189f901860183039445b9010000000000000400000000000000000000040000000000000000000000000000000000000000000000000000000100000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000080000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000f87cf87a940000777700000000000000000000000000000001f842a058313b60ec6c5bfc381e52f0de3ede0faac3cdffea26f7d6bcc3d09b61018691a00000000000000000000000000000000000000000000000000000000000320267a0dbfbf2c535ffc52117d4cc616b8d97bd07cdd8585ab67d9095c067e9de6d67440000000000000000000000000000000000000000000000c080a0d86a71e8e531bae3b2a2e70d98e516ccf31b6583d936ffa31c3772ac265db828a0420f5a8067c7eec5214117647da149eaa4e7c78a10d8ee6fa62001ee1b680f9fb9060002f905fc83aa36a7823d3f647482a9c494bac000000000000000000000000000000000000380b905930001536cb8da3dd105e94414690798c7f100000000057b78da8ccffb3bd38b03c0f12199bb964b426dd6b091efd7dc3ad1a9d321d1713b2ea1189d39280b4791c5c858729090c3b6182ac75951eef74b38191686b35c4669656ca9dc5a0ce7e9399f7efffc03afe7fd6e7485887f6264e97e9856a6978b65c5db3b4ce57cf4812abeba0de10d0d6ee5a2cbc9885a2163a58d1895524adbfd86d795eac74ec74d783b599861bf4b7b3e6daf70b3ae0e5740c88a4dc15b893f76fe074a718bcead52fb2a06d6e5f1cf3ca344ad05dcf5ca10bd9bc2809cd8ecd40a2dd0e03200dadd8f921f0e9953a7e6d8c7dc99e60cf6fe81465175e0cf99b702ac6a13706e64ac349a1119796eb0b6e7d5ae48ad74a5c997d679ef9c637c619587cb98ecf88e620dacdc57701500c74e087533f978831a78bf3857cb6044a8c66e41645cdee74ac7cdac69a8484083eb003827ccfd6b92c77b7097a15f38a419f6f0578f3568465e6fb639f1a8d6e52e9d17a0413100ca8d08b210a2e5adb2bead3dfaada14b2513113802f3996daccac89014dafd1368700300053ad7daeea2a4d4d9e8502aa44337c6ff91165a25de84fe5273b2e5b7f4dda3a0410900125e7778d5c2a59a2ca2ce36bacc9e95812ae1b69a478fc7ecf5ded14b68a80a010d6e03e07137d5de8082773f8a422390cd0a592d81e6e623a42bc69547e6b343e1d9a14e64ac3486116e29a8315486a2324d93d3e33a8344ffdbc2655b76dbf72077e43c13961a6a52f0565f2000881576c7a113e7aa6e9a6ed4679014533f8d1bf80ff44ae5599813e80d2c1f2fd0a03400864952137916724a4504bb118ccaf9236f217a1e43c97e471397a3f86672226dd0e02e00d4dcbfe4dd250a97d0c830b3d93213fd048fed38ea8378018c726be68728e22c687037000e3bb6d2858fba82db877c2e28fa1e2cca4ce57b6bdfdba7513dcd2649da93544083d06f85c8f4d21559e8e7651dcaa0c3aafc4a691fdfb27f2f39ea08ea62feff43cf0d80061500b0b00cb246f3641d83f5c934c477ca641a5c545da8aa0e4662c4c5f26ee70525a04125006cf268fbdcaddb151168bf24d3fa2e09f7445d859ff9e5ba2fe71e7ef8861ba61834a80280ebddf1bc99e8d00ae5d2a0893d64774d4cea1bad7146fc964526b6c4617cd70a68500d00f7e8131b976b9537ab4e2b9c9cf086fcfd82e235cf6c6eabbf8030cc3fd1e395071a840120bfbd7fd4a54397eca0c0f7adc1231dd539950f508f92e237e3aeb91468c38d4083ea0068a89abd38178e2e9f67559758419b6908d48d58967547c9edfe98ba016e050734a809807957936c079272b238748593ee3a73f5c7647d0ece20a5c208769c484474aa2f192b6dcc780a770c9b40b42348219a34a746cb495f3f1efb710a816ac142121461c6f7bf82fb00b0dec5bfbcaa2e32983075c84989e439154bfc7df1d0549680a6c1a4999c18aa010dee074028fcade2995b7daec4562449ccbced0caf7a660f49ac4ea07d485b22348948a0415d001ce8e16f70ca5813141f7f7544586da1364d2f77dd8fbb7cc937c6d46136f93d68f000009a72d59e5a9bdf1de5e60bbb17358bc65e8ff1566fabad6d6eb42ef2781f6d6d40837000bce21c64847942319b4ac1c92b2ee02fe2bfbf43b685908b92a0c3cd25f21641a0417d0084138599419cf73489312bda0d53e1fa748e1f7927380961470ec9fda73b36978c953661c8065aaafe09fb847fb54e35b3c68f771b6953941b2b4e619b486d81761ee187bf828700301cd34529763c60738c12e1ccce6ddff8b8338cda8fda245e5d8d5613d20734408306df96bd65c7b8d5c27299269dd9335ef7cb1f3357145983f365ec2f933686fc6d77d0a01100ca3a3773d3f0a52559ee691776b714fedc8c7b2cd672c7065c295693d0616d37408318007c18e9a9f6e4929e20d8efd4c2428065720ed1938af8e5348c14b373b0a845d1063468d2f96f000000ffff86f9aa5001c001a08f785a1c8e4c549c415dd948da80f86e3aaabc4e7a784604b6362208e0fb6b85a011d366d57b6ad95cda2eb6b618704859b4d433ad7557cad177eff6f6bae578cbc0f90200df8345de7e8203e494e276bc378a527a8792b353cdca5b5e53263dfb9e82168cdf8345de7f8203e594e276bc378a527a8792b353cdca5b5e53263dfb9e82168cdf8345de8082062294388ea662ef2c223ec0b047d41bf3c0f362142ad58212cadf8345de8182062394388ea662ef2c223ec0b047d41bf3c0f362142ad58212cadf8345de828201949425c4a76e7d118705e7ea2e9b7d8c59930d8acd3b8212cadf8345de838201979425c4a76e7d118705e7ea2e9b7d8c59930d8acd3b8212cadf8345de848201999425c4a76e7d118705e7ea2e9b7d8c59930d8acd3b8212cadf8345de8582019a9425c4a76e7d118705e7ea2e9b7d8c59930d8acd3b8212cadf8345de8682019b9425c4a76e7d118705e7ea2e9b7d8c59930d8acd3b8212cadf8345de8782019e9425c4a76e7d118705e7ea2e9b7d8c59930d8acd3b820f08df8345de888201a29425c4a76e7d118705e7ea2e9b7d8c59930d8acd3b820f08df8345de898201a59425c4a76e7d118705e7ea2e9b7d8c59930d8acd3b820f08df8345de8a8201a89425c4a76e7d118705e7ea2e9b7d8c59930d8acd3b820f08df8345de8b8201a99425c4a76e7d118705e7ea2e9b7d8c59930d8acd3b820f08df8345de8c8201aa9425c4a76e7d118705e7ea2e9b7d8c59930d8acd3b820f08df8345de8d8201ac9425c4a76e7d118705e7ea2e9b7d8c59930d8acd3b820f08"
}
```

</TabItem>

</Tabs>

### `debug_getRawHeader`

Returns the [RLP encoding](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/) of the header of specified block.

#### Parameters

`blockNumber`: _string_ - hexadecimal integer representing a block number, or one of the
string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
[block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

:::note
`pending` returns the same value as `latest`.
:::

#### Returns

`result`: _string_ - RLP-encoded block header or `error`

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_getRawHeader","params":["0x32026E"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_getRawHeader",
  "params": ["0x32026E"],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0xf90236a09f73691f6dabca4f0a99b05d0a701995506aa311dcaa9ce9833d6f4ca474c162a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934794c6e2459991bfe27cca6d86722f35da23a1e4cb97a078103ea8c47231886481d72ec1afae6eeb06c3773ce24a91323d5c9eed69d4cca0008992da2531db404f07b0871dd620a94ba346963e1b1c6dc7b00748e8593a1ea0b6c3890d9604434fc52f722848c84d1770add20cd75bbc28cdedff42940dbb56b90100200800000400000002000e0000000401000000440100000000c0400600000002000801000000040480020840048000000000400000000000000020004220000011002000000000000204000800000010010002000002000000000040a000000000000400020000010885000000000808000000008800001004002010020300005000000010002110410402000000000000000890000008000000000000000000020040000002000000000000810400000040006000004000004080020000000000000022001000000000000840400000000220250000000000080402000420000418000000000000000400040000004080040010200000000000108020020000808332026e8401c9c380833e3c3c846436f93899d883010b05846765746888676f312e32302e32856c696e7578a0112d8f15793e7df7f8dcdb21c891cff78c0d1839cb5b6dcd06116cdbb99536ae88000000000000000008a0cdb97712af6685bb9650d21d609525913293c48adda7c45990926daada335c9b"
}
```

</TabItem>

</Tabs>

### `debug_getRawReceipts`

Returns the [RLP encoding](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/)
of the transaction receipts of the specified block.

#### Parameters

`blockNumber`: _string_ - hexadecimal integer representing a block number, or one of the
string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
[block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

:::note
`pending` returns the same value as `latest`.
:::

#### Returns

`result`: _object_ - array of RLP-encoded [transaction receipts](objects.md#transaction-receipt-object)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_getRawReceipts","params":["0x32026E"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"debug_getRawReceipts","params":["0x32026E"],"id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    "0xf901a60182c70eb9010000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000002000000000000000000000008000000000000000000000000000000000040000000001000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000100000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000002000000000100000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000020000000000000000f89df89b947753cfad258efbc52a9a1452e42ffbce9be486cbf863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa00000000000000000000000000828d0386c1122e565f07dd28c7d1340ed5b3315a000000000000000000000000021849e99c31e3113a489d7eb0fd4d8c0edbe47afa00000000000000000000000000000000000000000000000000000000029b92700",
    "0xf901a70183018e1cb9010000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000002000000000000000000000008000000000000000000000000000000000040000000001000000000000000000000000000000000000000000000000010000000000000000000000000000000008000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000002000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000020000000000000000f89df89b947753cfad258efbc52a9a1452e42ffbce9be486cbf863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa00000000000000000000000000828d0386c1122e565f07dd28c7d1340ed5b3315a000000000000000000000000069cda9d6cc6ce05982d0b4fdf9480f2991f39b5aa00000000000000000000000000000000000000000000000000000000029b92700"
  ]
}
```

</TabItem>

</Tabs>

### `debug_getRawTransaction`

Returns the [RLP encoding](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/)
of the specified transaction.

#### Parameters

`transaction`: _string_ - 32-byte transaction hash

#### Returns

`result`: _object_ - RLP-encoded [transaction object](objects.md#transaction-object)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_getRawTransaction","params":["0x3a2fd1a5ea9ffee477f449be53a49398533d2c006a5815023920d1c397298df3"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"debug_getRawTransaction","params":["0x3a2fd1a5ea9ffee477f449be53a49398533d2c006a5815023920d1c397298df3"],"id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0xf8678084342770c182520894658bdf435d810c91414ec09147daa6db624063798203e880820a95a0af5fc351b9e457a31f37c84e5cd99dd3c5de60af3de33c6f4160177a2c786a60a0201da7a21046af55837330a2c52fc1543cd4d9ead00ddf178dd96935b607ff9b"
}
```

</TabItem>

</Tabs>

### `debug_metrics`

Returns metrics providing information on the internal operation of Besu.

The available metrics might change over time. The JVM metrics might vary based on the JVM implementation used.

The metric types are:

- Timer

- Counter

- Gauge

#### Parameters

None

#### Returns

`result`: _object_ - metrics object

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_metrics","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "debug_metrics", "params": [], "id": 1 }
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

### `debug_replayBlock`

Re-imports the block matching the specified block number, by rolling the head of the local chain back to the block right before the specified block, then importing the specified block.

#### Parameters

`blockNumber`: _string_ - hexadecimal integer representing a block number, or one of the
string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
[block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

:::note
`pending` returns the same value as `latest`.
:::

#### Returns

`result`: _string_ - `Success` or `error`

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_replayBlock","params":["0x1"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "debug_replayBlock", "params": ["0x1"], "id": 1 }
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

### `debug_resyncWorldState`

Triggers a re-synchronization of the world state while retaining imported blocks. This is useful if there are world state database inconsistencies (for example, Bonsai database issues).

#### Parameters

None

#### Returns

`result`: _string_ - `Success` or `error`

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_resyncWorldState","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "debug_resyncWorldState", "params": [], "id": 1 }
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

### `debug_setHead`

Sets the local chain head to the specified block. Optionally, moves the [bonsai](../../concepts/data-storage-formats.md#bonsai-tries)
world state to that block when  the `shouldMoveWorldstate` parameter is set to `true`.

Moving the world state allows expensive operations like [`debug_traceBlock`](#debug_traceblock)
to run on historical blocks without replaying all intermediate states. This is helpful to avoid
out of memory errors when executing RPC calls on historical states.

:::warning
Do not use this method when a consensus client is directing Besu, or while the node is
actively importing or proposing blocks as this will likely corrupt the database.

Additionally, if you move the chain head by a large number of blocks (for example, more than 5,000),
the RPC call might time out even though Besu continues the operation in the background.
:::

#### Parameters

- `blockNumber`: _string_ - hexadecimal integer representing a block number, or one of the
    string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
    [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

    :::note
    `pending` returns the same value as `latest`.
    :::

- `shouldMoveWorldstate`: _boolean_ - (optional) if `true`, moves the [bonsai](../../concepts/data-storage-formats.md#bonsai-tries)
    world state to the specified block. The default is `false`.

#### Returns

`result`: _string_ - `Success` or `error`

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_setHead","params":["0x1"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "debug_setHead", "params": ["0x1"], "id": 1 }
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

### `debug_standardTraceBlockToFile`

Generates files containing the block trace. A separate file is generated for each transaction in the block.

You can also specify a trace file for a specific transaction in a block.

Use [`debug_standardTraceBadBlockToFile`](#debug_standardtracebadblocktofile) to view the trace for an invalid block.

#### Parameters

- `blockHash`: _string_ - block hash

- Optional second parameter _object_ (all keys optional):

  - `txHash`: _string_ - transaction hash; if omitted, a trace file is generated for each transaction in the block

  - `disableMemory`: _boolean_ - omit EVM memory from the trace; defaults to `false`

  - `disableStack`: _boolean_ - omit stack from the trace; defaults to `false`

  - `disableStorage`: _boolean_ - omit storage from the trace; defaults to `false`

  - `opcodes`: _array_ of _strings_ - list of opcode names to trace; if omitted or empty, all opcodes are traced

#### Returns

`result`: _string_ - location of the generated trace files

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_standardTraceBlockToFile","params":["0x2dc0b6c43144e314a86777b4bd4f987c0790a6a0b21560671d221ed81a23f2dc", {
"txHash": "0x4ff04c4aec9517721179c8dd435f47fbbfc2ed26cd4926845ab687420d5580a6", "disableMemory": false}], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_standardTraceBlockToFile",
  "params": [
    "0x2dc0b6c43144e314a86777b4bd4f987c0790a6a0b21560671d221ed81a23f2dc",
    {
      "txHash": "0x4ff04c4aec9517721179c8dd435f47fbbfc2ed26cd4926845ab687420d5580a6",
      "disableMemory": false
    }
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
    "/Users/me/mynode/sepolia/data/traces/block_0x2dc0b6c4-4-0x4ff04c4a-1612820117332"
  ]
}
```

</TabItem>

</Tabs>

### `debug_standardTraceBadBlockToFile`

Generates files containing the block trace of invalid blocks. A separate file is generated for each transaction in the block.

Use [`debug_standardTraceBlockToFile`](#debug_standardtraceblocktofile) to view the trace for a valid block.

#### Parameters

- `blockHash`: _string_ - block hash

- Optional second parameter _object_ (all keys optional):

  - `txHash`: _string_ - transaction hash; if omitted, a trace file is generated for each transaction in the block

  - `disableMemory`: _boolean_ - omit EVM memory from the trace; defaults to `true`

  - `disableStack`: _boolean_ - omit stack from the trace; defaults to `false`

  - `disableStorage`: _boolean_ - omit storage from the trace; defaults to `true`

  - `opcodes`: _array_ of _strings_ - list of opcode names to trace; if omitted or empty, all opcodes are traced

#### Returns

`result`: _string_ - location of the generated trace files

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_standardTraceBadBlockToFile","params":["0x53741e9e94791466d117c5f9e41a2ed1de3f73d39920c621dfc2f294e7779baa"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_standardTraceBadBlockToFile",
  "params": [
    "0x53741e9e94791466d117c5f9e41a2ed1de3f73d39920c621dfc2f294e7779baa"
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
    "/Users/me/mynode/sepolia/data/traces/block_0x53741e9e-0-0x407ec43d-1600951088172"
  ]
}
```

</TabItem>

</Tabs>

### `debug_storageRangeAt`

[Remix](https://remix.ethereum.org/) uses `debug_storageRangeAt` to implement debugging. Use the _Debugger_ tab in Remix instead of calling `debug_storageRangeAt` directly.

Returns the contract storage for the specified range.

#### Parameters

- `blockHash`: _string_ - block hash

- `txIndex`: _number_ - transaction index from which to start

- `address`: _string_ - contract address

- `startKey`: _string_ - start key

- `limit`: _number_ - number of storage entries to return

#### Returns

`result`: _object_ - [range object](objects.md#range-object).

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_storageRangeAt","params":["0x2b76b3a2fc44c0e21ea183d06c846353279a7acf12abcc6fb9d5e8fb14ae2f8c",0,"0x0e0d2c8f7794e82164f11798276a188147fbd415","0x0000000000000000000000000000000000000000000000000000000000000000",1], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
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

### `debug_traceTransaction`

[Remix](https://remix.ethereum.org/) uses `debug_traceTransaction` to implement debugging. Use the _Debugger_ tab in Remix instead of calling `debug_traceTransaction` directly.

Reruns the transaction with the same state as when the transaction executed.

#### Parameters

- `transactionHash`: _string_ - transaction hash.

- `options`: _object_ - request options object with the following fields (all optional):

  - `disableStorage`: _boolean_ - `true` disables storage capture; defaults to `false`

  - `disableMemory`: _boolean_ - `true` disables memory capture; defaults to `true`

  - `disableStack` : _boolean_ - `true` disables stack capture; defaults to `false`

  - `opcodes`: _array_ of _strings_ - list of opcode names to trace; if omitted or empty, all opcodes are traced

#### Returns

`result`: _object_ - [trace object](objects.md#trace-object)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_traceTransaction","params":["0x2cc6c94c21685b7e0f8ddabf277a5ccf98db157c62619cde8baea696a74ed18e",{"disableStorage":true}],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_traceTransaction",
  "params": [
    "0x2cc6c94c21685b7e0f8ddabf277a5ccf98db157c62619cde8baea696a74ed18e",
    { "disableStorage": true }
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
    "gas": 21000,
    "failed": false,
    "returnValue": "",
    "structLogs": [
      {
        "pc": 0,
        "op": "STOP",
        "gas": 0,
        "gasCost": 0,
        "depth": 1,
        "stack": [],
        "memory": [],
        "storage": null
      }
    ]
  }
}
```

</TabItem>

</Tabs>

### `debug_traceBlock`

Returns full trace of all invoked opcodes of all transactions included in the block.

#### Parameters

- `block`: _string_ - RLP of the block

- `options`: _object_ - (optional) request options object with the following fields:

  - `disableStorage`: _boolean_ - `true` disables storage capture. The default is `false`.

  - `disableMemory`: _boolean_ - `true` disables memory capture. The default is `true`.

  - `disableStack` : _boolean_ - `true` disables stack capture. The default is `false`.

  - `opcodes`: _array_ of _strings_ - list of opcode names to trace; if omitted or empty, all opcodes are traced

#### Returns

`result`: _object_ - [trace object](objects.md#trace-object)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_traceBlock","params":["0xf90277f90208a05a41d0e66b4120775176c09fcf39e7c0520517a13d2b57b18d33d342df038bfca01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934794e6a7a1d47ff21b6321162aea7c6cb457d5476bcaa00e0df2706b0a4fb8bd08c9246d472abbe850af446405d9eba1db41db18b4a169a04513310fcb9f6f616972a3b948dc5d547f280849a87ebb5af0191f98b87be598a0fe2bf2a941abf41d72637e5b91750332a30283efd40c424dc522b77e6f0ed8c4b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000860153886c1bbd82b44382520b8252088455c426598b657468706f6f6c2e6f7267a0b48c515a9dde8d346c3337ea520aa995a4738bb595495506125449c1149d6cf488ba4f8ecd18aab215f869f86780862d79883d2000825208945df9b87991262f6ba471f09758cde1c0fc1de734827a69801ca088ff6cf0fefd94db46111149ae4bfc179e9b94721fffd821d38d16464b3f71d0a045e0aff800961cfce805daef7016b9b675c137a6a41a548f7b60a3484c06a33ac0"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_traceBlock",
  "params": [
    "0xf90277f90208a05a41d0e66b4120775176c09fcf39e7c0520517a13d2b57b18d33d342df038bfca01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934794e6a7a1d47ff21b6321162aea7c6cb457d5476bcaa00e0df2706b0a4fb8bd08c9246d472abbe850af446405d9eba1db41db18b4a169a04513310fcb9f6f616972a3b948dc5d547f280849a87ebb5af0191f98b87be598a0fe2bf2a941abf41d72637e5b91750332a30283efd40c424dc522b77e6f0ed8c4b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000860153886c1bbd82b44382520b8252088455c426598b657468706f6f6c2e6f7267a0b48c515a9dde8d346c3337ea520aa995a4738bb595495506125449c1149d6cf488ba4f8ecd18aab215f869f86780862d79883d2000825208945df9b87991262f6ba471f09758cde1c0fc1de734827a69801ca088ff6cf0fefd94db46111149ae4bfc179e9b94721fffd821d38d16464b3f71d0a045e0aff800961cfce805daef7016b9b675c137a6a41a548f7b60a3484c06a33ac0"
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
    "gas": 21000,
    "failed": false,
    "returnValue": "",
    "structLogs": [
      {
        "pc": 0,
        "op": "STOP",
        "gas": 0,
        "gasCost": 0,
        "depth": 1,
        "stack": []
      }
    ]
  }
}
```

</TabItem>

</Tabs>

### `debug_traceBlockByHash`

Returns full trace of all invoked opcodes of all transactions included in the block.

#### Parameters

- `blockHash`: _string_ - block hash

- `options`: _object_ - (optional) request options object with the following fields:

  - `disableStorage`: _boolean_ - `true` disables storage capture. The default is `false`.

  - `disableMemory`: _boolean_ - `true` disables memory capture. The default is `true`.

  - `disableStack` : _boolean_ - `true` disables stack capture. The default is `false`.

  - `opcodes`: _array_ of _strings_ - list of opcode names to trace; if omitted or empty, all opcodes are traced

#### Returns

`result`: _array_ of _objects_ - list of [trace objects](objects.md#trace-object)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_traceBlockByHash","params":["0xaceb3b2c9b25b0589230873921eb894b28722011b8df63977145517d754875a5"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_traceBlockByHash",
  "params": [
    "0xaceb3b2c9b25b0589230873921eb894b28722011b8df63977145517d754875a5"
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
      "gas": 21000,
      "failed": false,
      "returnValue": "",
      "structLogs": [
        {
          "pc": 0,
          "op": "STOP",
          "gas": 0,
          "gasCost": 0,
          "depth": 1,
          "stack": []
        }
      ]
    }
  ]
}
```

</TabItem>

</Tabs>

### `debug_traceBlockByNumber`

Returns full trace of all invoked opcodes of all transactions included in the block.

#### Parameters

- `blockNumber`: _string_ - hexadecimal integer representing a block number, or one of the
  string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

  :::note
  `pending` returns the same value as `latest`.
  :::

- `options`: _object_ - (optional) request options object with the following fields:

  - `disableStorage`: _boolean_ - `true` disables storage capture. The default is `false`.

  - `disableMemory`: _boolean_ - `true` disables memory capture. The default is `true`.

  - `disableStack` : _boolean_ - `true` disables stack capture. The default is `false`.

  - `opcodes`: _array_ of _strings_ - list of opcode names to trace; if omitted or empty, all opcodes are traced

#### Returns

`result`: _array_ of _objects_ - list of [trace objects](objects.md#trace-object)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_traceBlockByNumber","params":["0x7224",{"disableStorage":true}], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_traceBlockByNumber",
  "params": ["0x7224", { "disableStorage": true }],
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
      "gas": 21000,
      "failed": false,
      "returnValue": "",
      "structLogs": [
        {
          "pc": 0,
          "op": "STOP",
          "gas": 0,
          "gasCost": 0,
          "depth": 1,
          "stack": []
        }
      ]
    }
  ]
}
```
</TabItem>

</Tabs>

### `debug_traceCall`

Performs an [`eth_call`](#eth_call) within the execution environment of a given block, using the final state of its parent block as the base, and provides a detailed trace of the executed opcodes.

Each `options` entry specifies a state that will be temporarily overridden before executing the call. 
This allows you to test, analyze, and debug smart contracts more efficiently by allowing
temporary state changes without affecting the actual blockchain state.

#### Parameters

- `call`: _object_ - [transaction call object](objects.md#transaction-call-object).

- `blockNumber`: _string_ - hexadecimal integer representing a block number, or one of the
  string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

  :::note
  `pending` returns the same value as `latest`.
  :::

- `options`: _object_ - request options object with the following fields:

  - `disableStorage`: _boolean_ - (optional) `true` disables storage capture; defaults to `false`

  - `disableMemory`: _boolean_ - (optional) `true` disables memory capture; defaults to `true`

  - `disableStack` : _boolean_ - (optional) `true` disables stack capture; defaults to `false`

  - `opcodes`: _array_ of _strings_ - (optional) list of opcode names to trace; if omitted or empty, all opcodes are traced

  - `stateOverrides`: _object_ - (optional) [address-to-state mapping](./objects.md#state-override-object)

#### Returns

`result`: _array_ of _objects_ - list of [trace objects](objects.md#trace-object)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"debug_traceCall","params":[{"from":"","to":"","gas":"0xfffff2","gasPrice":"0xef","value":"0x0","data":""},"latest",{"disableMemory":true,"disableStack":true,"disableStorage":true}], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"

```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "debug_traceCall",
  "params": [{"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73","0x0050000000000000000000000000000000000000", "0xfffff2","0xef","0x0","0x0000000000000000000000000030000000000000000000000000000000000000f000000000000000000000000000000000000000000000000000000000000001"},"latest",{"disableMemory":true,"disableStack":true,"disableStorage":true}],
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
      "gas": 21000,
      "failed": false,
      "returnValue": "",
      "structLogs": [
        {
          "pc": 0,
          "op": "STOP",
          "gas": 0,
          "gasCost": 0,
          "depth": 1,
          "stack": [],
          "memory": [],
          "storage": null,
          "reason": null
        }
      ]
    }
  ]
}
```

</TabItem>

</Tabs>

## `ETH` methods

The `ETH` API methods allow you to interact with the blockchain.

:::note

Methods with an equivalent [GraphQL](../../how-to/use-besu-api/graphql.md) query include a GraphQL request and result in the method example. The parameter and result descriptions apply to the JSON-RPC requests. The GraphQL specification is defined in the [schema].

:::

### `eth_accounts`

Returns a list of account addresses a client owns.

:::note

This method returns an empty object because Besu [doesn't support key management](../../how-to/send-transactions.md) inside the client.

To provide access to your key store and then sign transactions, use [Web3Signer](https://docs.web3signer.consensys.net/) with Besu.

:::

#### Parameters

None

#### Returns

`result`: _array_ of _strings_ - list of 20-byte account addresses owned by the client

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "eth_accounts", "params": [], "id": 53 }
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": []
}
```

</TabItem>

</Tabs>

### `eth_blobBaseFee`

Returns the base fee per blob gas in wei.

:::info

[Shard blob transactions](../../concepts/transactions/types.md#blob-transactions) enable scaling Ethereum by allowing blobs of
data to be stored temporarily by consensus clients.

:::

#### Parameters

None

#### Returns

`result`: _string_ - hexadecimal integer representing the base fee per blob gas.

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blobBaseFee","params":[],"id":51}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{"jsonrpc":"2.0","method":"eth_blobBaseFee","params":[],"id":51}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 51,
  "result": "0x3f5694c1f"
}
```
</TabItem>
</Tabs>

### `eth_blockNumber`

Returns the index corresponding to the block number of the current chain head.

#### Parameters

None

#### Returns

`result`: _string_ - hexadecimal integer representing the index corresponding to the block number of the current chain head

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":51}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{ "jsonrpc": "2.0", "method": "eth_blockNumber", "params": [], "id": 51 }
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 51,
  "result": "0x2377"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block{number}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block {
    number
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "number": 16221
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_call`

Invokes a contract function locally and does not change the state of the blockchain.

You can interact with contracts using [`eth_sendRawTransaction`](#eth_sendrawtransaction) or `eth_call`.

By default, the `eth_call` error response includes the [revert reason](../../../private-networks/how-to/send-transactions/revert-reason.md).

#### Parameters

- `call`: _object_ - [transaction call object](objects.md#transaction-call-object)

  :::note
  If you don't want the sender account balance checked, set the gas to zero or specify
  [`strict:false`](objects.md#transaction-call-object). Otherwise the call may fail if the sender account
  does not have sufficient funds to cover the gas fees.
  :::

- `blockNumber` or `blockHash`: _string_ - hexadecimal integer representing a block number,
  block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as
  described in [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

  :::note
  `pending` returns the same value as `latest`.
  :::

- `stateOverride`: _object_ - (optional) The [address-to-state mapping](./objects.md#state-override-object).
    Each entry specifies a state that will be temporarily overridden before executing the call.
    This allows you to test, analyze, and debug smart contracts more efficiently by allowing
    temporary state changes without affecting the actual blockchain state.

#### Returns

`result`: _string_ - return value of the executed contract

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x69498dd54bd25aa0c886cf1f8b8ae0856d55ff13","value":"0x1"}, "latest"],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_call",
  "params": [
    { "to": "0x69498dd54bd25aa0c886cf1f8b8ae0856d55ff13", "value": "0x1" },
    "latest"
  ],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": "0x"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block {number call (data : {from : \"0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b\", to: \"0x69498dd54bd25aa0c886cf1f8b8ae0856d55ff13\", data :\"0x12a7b914\"}){data status}}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block {
    number
    call(data: {from: "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b", to: "0x69498dd54bd25aa0c886cf1f8b8ae0856d55ff13", data: "0x12a7b914"}) {
      data
      status
    }
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "number": 17449,
      "call": {
        "data": "0x",
        "status": 1
      }
    }
  }
}
```

</TabItem>

</Tabs>

The following example creates a simulated contract by not including the `to` parameter from the
[transaction call object](objects.md#transaction-call-object) in the `call` parameter.
Besu simulates the data to create the contract.

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73", "data":"0x6080604052336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034801561005057600080fd5b5061021e806100606000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063445df0ac146100465780638da5cb5b14610064578063fdacd576146100ae575b600080fd5b61004e6100dc565b6040518082815260200191505060405180910390f35b61006c6100e2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100da600480360360208110156100c457600080fd5b8101908080359060200190929190505050610107565b005b60015481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146101ac576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260338152602001806101b76033913960400191505060405180910390fd5b806001819055505056fe546869732066756e6374696f6e206973207265737472696374656420746f2074686520636f6e74726163742773206f776e6572a265627a7a7231582007302f208a10686769509b529e1878bda1859883778d70dedd1844fe790c9bde64736f6c63430005100032","gas":"0x439cf","gasPrice":"0x0"},"latest"],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": "0x608060405234801561001057600080fd5b50600436106100415760003560e01c8063445df0ac146100465780638da5cb5b14610064578063fdacd576146100ae575b600080fd5b61004e6100dc565b6040518082815260200191505060405180910390f35b61006c6100e2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100da600480360360208110156100c457600080fd5b8101908080359060200190929190505050610107565b005b60015481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146101ac576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260338152602001806101b76033913960400191505060405180910390fd5b806001819055505056fe546869732066756e6374696f6e206973207265737472696374656420746f2074686520636f6e74726163742773206f776e6572a265627a7a7231582007302f208a10686769509b529e1878bda1859883778d70dedd1844fe790c9bde64736f6c63430005100032"
}
```

</TabItem>

</Tabs>

The following example checks the USDT contract for the balance of the address `0xfe3b557e8fb62b89f4916b721be55ceb828dbd73`, with
a state override that sets the balance to 20,000 USDT. The result will reflect the overridden balance
for the specified address.

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0xdAC17F958D2ee523a2206206994597C13D831ec7","data":"0x70a08231000000000000000000000000fe3b557e8fb62b89f4916b721be55ceb828dbd73"},"latest",{"0xdAC17F958D2ee523a2206206994597C13D831ec7":{"stateDiff":{"0xd0dd44a13782bf89714335c2b2b08ecb7c074e78a161807742c578965dda1b56":"0x0000000000000000000000000000000000000000000000000000000000004E20"}}}],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc":"2.0",
  "id":1,
  "result":"0x0000000000000000000000000000000000000000000000000000000000004e20"
}
```

</TabItem>

</Tabs>

### `eth_chainId`

Returns the [chain ID](../../concepts/network-and-chain-id.md).

#### Parameters

None

#### Returns

`result`: _string_ - chain ID in hexadecimal

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":51}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "eth_chainId", "params": [], "id": 51 }
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 51,
  "result": "0x7e2"
}
```

</TabItem>

</Tabs>

### `eth_config`

Returns the client's fork information for the current, next, and last known forks.

:::info

This method is defined in [EIP-7910](https://eips.ethereum.org/EIPS/eip-7910) and enables node operators to verify client readiness for upcoming forks and debug configuration mismatches.

:::

#### Parameters

None

#### Returns

`result`: _object_ - configuration information containing:

- `current`: _object_ - current fork configuration:
  - `activationTime`: _number_ - fork activation timestamp (Unix epoch seconds)
  - `blobSchedule`: _object_ - blob configuration parameters:
    - `baseFeeUpdateFraction`: _number_ - base fee update fraction
    - `max`: _number_ - maximum number of blobs per block
    - `target`: _number_ - target number of blobs per block
  - `chainId`: _string_ - chain ID in hexadecimal
  - `forkId`: _string_ - fork hash as defined in [EIP-6122](https://eips.ethereum.org/EIPS/eip-6122)
  - `precompiles`: _object_ - active precompiled contracts with names and addresses
  - `systemContracts`: _object_ - system contract addresses
- `next`: _object_ - next fork configuration, or `null` if no future fork is scheduled.
- `last`: _object_ - the furthest configured future fork configuration (the future fork with
    the largest `activationTime` among the client's configured forks). If only one future fork is configured, `next` and `last` are the same object. `null` if no future fork is scheduled.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_config","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "eth_config", "params": [], "id": 1 }
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "current": {
      "activationTime": 1746612311,
      "blobSchedule": {
        "baseFeeUpdateFraction": 5007716,
        "max": 9,
        "target": 6
      },
      "chainId": "0x1",
      "forkId": "0xc376cf8b",
      "precompiles": {
        "BLAKE2F": "0x0000000000000000000000000000000000000009",
        "BLS12_G1ADD": "0x000000000000000000000000000000000000000b",
        "BLS12_G1MSM": "0x000000000000000000000000000000000000000c",
        "BLS12_G2ADD": "0x000000000000000000000000000000000000000d",
        "BLS12_G2MSM": "0x000000000000000000000000000000000000000e",
        "BLS12_MAP_FP2_TO_G2": "0x0000000000000000000000000000000000000011",
        "BLS12_MAP_FP_TO_G1": "0x0000000000000000000000000000000000000010",
        "BLS12_PAIRING_CHECK": "0x000000000000000000000000000000000000000f",
        "BN254_ADD": "0x0000000000000000000000000000000000000006",
        "BN254_MUL": "0x0000000000000000000000000000000000000007",
        "BN254_PAIRING": "0x0000000000000000000000000000000000000008",
        "ECREC": "0x0000000000000000000000000000000000000001",
        "ID": "0x0000000000000000000000000000000000000004",
        "KZG_POINT_EVALUATION": "0x000000000000000000000000000000000000000a",
        "MODEXP": "0x0000000000000000000000000000000000000005",
        "RIPEMD160": "0x0000000000000000000000000000000000000003",
        "SHA256": "0x0000000000000000000000000000000000000002"
      },
      "systemContracts": {
        "BEACON_ROOTS_ADDRESS": "0x000f3df6d732807ef1319fb7b8bb8522d0beac02",
        "CONSOLIDATION_REQUEST_PREDEPLOY_ADDRESS": "0x0000bbddc7ce488642fb579f8b00f3a590007251",
        "DEPOSIT_CONTRACT_ADDRESS": "0x00000000219ab540356cbb839cbe05303d7705fa",
        "HISTORY_STORAGE_ADDRESS": "0x0000f90827f1c53a10cb7a02335b175320002935",
        "WITHDRAWAL_REQUEST_PREDEPLOY_ADDRESS": "0x00000961ef480eb55e80d19ad83579a64c007002"
      }
    },
    "next": null,
    "last": null
  }
}
```

</TabItem>

</Tabs>

### `eth_createAccessList`

Creates an [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930) access list that you can [include in a transaction](../../concepts/transactions/types.md#access_list-transactions). The method returns a success response (access list and gas used) even if the simulated transaction would revert.

#### Parameters

- `transaction`: _object_ - [transaction call object](objects.md#transaction-call-object)

- `blockNumber`: _string_ - hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

#### Returns

`result`: _object_ - access list object with the following fields:

- `accessList`: _array_ of _objects_ - list of objects with the following fields:
  - `address`: _string_ - addresses to be accessed by the transaction
  - `storageKeys`: _array_ - storage keys to be accessed by the transaction
- `gasUsed`: _string_ - approximate gas cost for the transaction if the access list is included

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"method":"eth_createAccessList","params":[{"from": "0xaeA8F8f781326bfE6A7683C2BD48Dd6AA4d3Ba63", "data": "0x608060806080608155"}, "pending"],"id":1,"jsonrpc":"2.0"}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "method": "eth_createAccessList",
  "params": [
    {
      "from": "0xaeA8F8f781326bfE6A7683C2BD48Dd6AA4d3Ba63",
      "data": "0x608060806080608155"
    },
    "pending"
  ],
  "id": 1,
  "jsonrpc": "2.0"
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "accessList": [
    {
      "address": "0xa02457e5dfd32bda5fc7e1f1b008aa5979568150",
      "storageKeys": [
        "0x0000000000000000000000000000000000000000000000000000000000000081",
      ]
    }
  ]
  "gasUsed": "0x125f8"
}
```

</TabItem>

</Tabs>

:::tip

This method doesn't indicate whether a transaction would succeed or revert; to see simulation outcomes
use [`eth_call`](#eth_call) or [`eth_estimateGas`](#eth_estimategas).

:::

### `eth_estimateGas`

Returns an estimate of the gas required for a transaction to complete. The estimation process does not use gas and the transaction is not added to the blockchain. The resulting estimate can be greater than the amount of gas the transaction ends up using, for reasons including EVM mechanics and node performance.

The `eth_estimateGas` call does not send a transaction. You must call [`eth_sendRawTransaction`](#eth_sendrawtransaction) to execute the transaction.

By default, the `eth_estimateGas` error response includes the [revert reason](../../../private-networks/how-to/send-transactions/revert-reason.md).

#### Parameters

- `call`: _object_ - [transaction call object](objects.md#transaction-call-object)

      :::note
      If you don't want the sender account balance checked, set the gas to zero or specify
      [`strict:false`](objects.md#transaction-call-object). Otherwise the call may fail if the sender account
      does not have sufficient funds to cover the gas fees.
      :::

- `blockNumber`: _string_ - (optional) hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)
  The default is `pending`.

- `stateOverride`: _object_ - The [address-to-state mapping](./objects.md#state-override-object).
    Each entry specifies a state that will be temporarily overridden before executing the call.
    This allows you to make temporary state changes without affecting the actual blockchain state.

#### Returns

`result`: _string_ - amount of gas used

The following example returns an estimate of 21000 wei (`0x5208`) for the transaction.

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_estimateGas","params":[{"from":"0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73","to":"0x44Aa93095D6749A706051658B970b941c72c1D53","value":"0x1"}],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_estimateGas",
  "params": [
    {
      "from": "0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73",
      "to": "0x44Aa93095D6749A706051658B970b941c72c1D53",
      "value": "0x1"
    }
  ],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": "0x5208"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block{estimateGas (data: {from :\"0x6295ee1b4f6dd65047762f924ecd367c17eabf8f\", to :\"0x8888f1f195afa192cfee860698584c030f4c9db1\"})}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block {
    estimateGas(data: {from: "0x6295ee1b4f6dd65047762f924ecd367c17eabf8f", to: "0x8888f1f195afa192cfee860698584c030f4c9db1"})
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "estimateGas": 21000
    }
  }
}
```

</TabItem>

</Tabs>

The following example request estimates the cost of deploying a simple storage smart contract to the network. The data field contains the hash of the compiled contract you want to deploy. (You can get the compiled contract hash from your IDE, for example, **Remix > Compile tab > details > WEB3DEPLOY**.) The result is 113355 wei.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_estimateGas","params":[{"from":"0x8bad598904ec5d93d07e204a366d084a80c7694e","data":"0x608060405234801561001057600080fd5b5060e38061001f6000396000f3fe6080604052600436106043576000357c0100000000000000000000000000000000000000000000000000000000900480633fa4f24514604857806355241077146070575b600080fd5b348015605357600080fd5b50605a60a7565b6040518082815260200191505060405180910390f35b348015607b57600080fd5b5060a560048036036020811015609057600080fd5b810190808035906020019092919050505060ad565b005b60005481565b806000819055505056fea165627a7a7230582020d7ad478b98b85ca751c924ef66bcebbbd8072b93031073ef35270a4c42f0080029"}],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1bacb"
}
```

</TabItem>

</Tabs>

The following example estimates the gas required for the `transfer` call in the USDT contract, with a state
override that sets the balance of the sender address to 20,000 USDT. The result provides the gas required
for the transaction.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_estimateGas","params":[{"from":"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73","to":"0xdAC17F958D2ee523a2206206994597C13D831ec7","data":"0xa9059cbb000000000000000000000000627306090abaB3A6e1400e9345bC60c78a8BEf570000000000000000000000000000000000000000000000000000000000000064"},"latest",{"0xdAC17F958D2ee523a2206206994597C13D831ec7":{"stateDiff":{"0xd0dd44a13782bf89714335c2b2b08ecb7c074e78a161807742c578965dda1b56":"0x0000000000000000000000000000000000000000000000000000000000004E20"}}}],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc":"2.0",
  "id":1,
  "result":"0xfa07"
}
```

</TabItem>

</Tabs>

### `eth_feeHistory`

Returns base fee per gas and transaction effective priority fee per gas history for the requested block
range, allowing you to track trends over time.

As of [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844), this method tracks transaction blob gas fees as well.  

#### Parameters

- `blockCount`: _integer_ or _string_ - Number of blocks in the requested range. Between 1 and 1024 blocks can be requested in a single query. If blocks in the specified block range are not available, then only the fee history for available blocks is returned. Accepts hexadecimal or integer values.

- `newestBlock`: _string_ - hexadecimal integer representing the highest number block of
  the requested range, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or
  `safe`, as described in [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

  :::note
  `pending` returns the same value as `latest`.
  :::

- `array` of `integers` - (optional) A monotonically increasing list of percentile values to sample from each block's effective priority fees per gas in ascending order, weighted by gas used.

#### Returns

`result`: _object_ - [Fee history results object](objects.md#fee-history-results-object).

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_feeHistory","params": ["0x5", "latest", [20,30]],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_feeHistory",
  "params": ["0x5", "latest", [20, 30]],
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
        "oldestBlock": "0x10b52f",
        "baseFeePerGas": [
            "0x3fa63a3f",
            "0x37f999ee",
            "0x3e36f20a",
            "0x4099f79a",
            "0x430d532d",
            "0x46fcd4a4"
        ],
        "baseFeePerBlobGas": [
            "0x7b7609c19",
            "0x6dbe41789",
            "0x7223341d4",
            "0x6574a002c",
            "0x7223341d4",
            "0x6574a002c"
        ],
        "gasUsedRatio": [
            0.017712333333333333,
            0.9458865666666667,
            0.6534561,
            0.6517375666666667,
            0.7347769666666667
        ],
        "blobGasUsedRatio": [
            0.0,
            0.6666666666666666,
            0.0,
            1.0,
            0.0
        ],
        "reward": [
            [
                "0x3b9aca00",
                "0x59682f00"
            ],
            [
                "0x3a13012",
                "0x3a13012"
            ],
            [
                "0xf4240",
                "0xf4240"
            ],
            [
                "0xf4240",
                "0xf4240"
            ],
            [
                "0xf4240",
                "0xf4240"
            ]
        ]
    }
}
```

</TabItem>

</Tabs>

### `eth_gasPrice`

Returns a percentile gas unit price for the most recent blocks, in wei. By default, the last 100 blocks are examined and the 50th percentile gas unit price (that is, the median value) is returned.

If there are no blocks, the value for [`--min-gas-price`](../cli/options.md#min-gas-price) is returned. The value returned is restricted to values between [`--min-gas-price`](../cli/options.md#min-gas-price) and [`--api-gas-price-max`](../cli/options.md#api-gas-price-max). By default, 1000 wei and 500 gwei.

Use the [`--api-gas-price-blocks`](../cli/options.md#api-gas-price-blocks), [`--api-gas-price-percentile`](../cli/options.md#api-gas-price-percentile) , and [`--api-gas-price-max`](../cli/options.md#api-gas-price-max) command line options to configure the `eth_gasPrice` default values.

#### Parameters

None

#### Returns

`result`: _string_ - percentile gas unit price for the most recent blocks, in wei, as a hexadecimal value

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{ "jsonrpc": "2.0", "method": "eth_gasPrice", "params": [], "id": 53 }
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": "0x3e8"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{gasPrice}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  gasPrice
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "gasPrice": "0x3e8"
  }
}
```

</TabItem>

</Tabs>

### `eth_getBalance`

Returns the account balance of the specified address.

#### Parameters

- `address`: _string_ - 20-byte account address from which to retrieve the balance

- `blockNumber` or `blockHash`: _string_ - hexadecimal integer representing a block
  number, block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or
  `safe`, as described in [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

  :::note
  `pending` returns the same value as `latest`.
  :::

#### Returns

`result`: _string_ - current balance, in wei, as a hexadecimal value

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xfe3b557e8fb62b89f4916b721be55ceb828dbd73", "latest"],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBalance",
  "params": ["0xfe3b557e8fb62b89f4916b721be55ceb828dbd73", "latest"],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": "0x1cfe56f3795885980000"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{ account ( address: \"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73\") { balance } }"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  account(address: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73") {
    balance
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "account": {
      "balance": "0x1ce96a1ffe7620d00000"
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getBlockByHash`

Returns information about the block matching the specified block hash.

#### Parameters

- `hash`: _string_ - 32-byte hash of a block

- `verbose`: _boolean_ - if `true`, returns the full [transaction objects](objects.md#transaction-object); if `false`, returns the transaction hashes

#### Returns

`result`: _object_ - [block object](objects.md#block-object), or `null` when there is no block

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockByHash","params":["0xd5f1812548be429cbdc6376b29611fc49e06f1359758c4ceaaa3b393e2239f9c", false],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBlockByHash",
  "params": [
    "0xd5f1812548be429cbdc6376b29611fc49e06f1359758c4ceaaa3b393e2239f9c",
    false
  ],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": {
    "number": "0x68b3",
    "hash": "0xd5f1812548be429cbdc6376b29611fc49e06f1359758c4ceaaa3b393e2239f9c",
    "mixHash": "0x24900fb3da77674a861c428429dce0762707ecb6052325bbd9b3c64e74b5af9d",
    "parentHash": "0x1f68ac259155e2f38211ddad0f0a15394d55417b185a93923e2abe71bb7a4d6d",
    "nonce": "0x378da40ff335b070",
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "logsBloom": "0x00000000000000100000004080000000000500000000000000020000100000000800001000000004000001000000000000000800040010000020100000000400000010000000000000000040000000000000040000000000000000000000000000000400002400000000000000000000000000000004000004000000000000840000000800000080010004000000001000000800000000000000000000000000000000000800000000000040000000020000000000000000000800000400000000000000000000000600000400000000002000000000000000000000004000000000000000100000000000000000000000000000000000040000900010000000",
    "transactionsRoot": "0x4d0c8e91e16bdff538c03211c5c73632ed054d00a7e210c0eb25146c20048126",
    "stateRoot": "0x91309efa7e42c1f137f31fe9edbe88ae087e6620d0d59031324da3e2f4f93233",
    "receiptsRoot": "0x68461ab700003503a305083630a8fb8d14927238f0bc8b6b3d246c0c64f21f4a",
    "miner": "0xb42b6c4a95406c78ff892d270ad20b22642e102d",
    "difficulty": "0x66e619a",
    "totalDifficulty": "0x1e875d746ae",
    "extraData": "0xd583010502846765746885676f312e37856c696e7578",
    "size": "0x334",
    "gasLimit": "0x47e7c4",
    "gasUsed": "0x37993",
    "timestamp": "0x5835c54d",
    "uncles": [],
    "transactions": [
      "0xa0807e117a8dd124ab949f460f08c36c72b710188f01609595223b325e58e0fc",
      "0xeae6d797af50cb62a596ec3939114d63967c374fa57de9bc0f4e2b576ed6639d"
    ],
    "baseFeePerGas": "0x7"
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block (hash : \"0xb0efed1fc9326fee967cb2d845d4ebe57c5350a0670c8e86f8052dea6f219f92\") {number transactions{hash} timestamp difficulty totalDifficulty gasUsed gasLimit hash nonce ommerCount logsBloom mixHash ommerHash extraData stateRoot receiptsRoot transactionCount transactionsRoot}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(hash: "0xb0efed1fc9326fee967cb2d845d4ebe57c5350a0670c8e86f8052dea6f219f92") {
    number
    transactions {
      hash
    }
    timestamp
    difficulty
    totalDifficulty
    gasUsed
    gasLimit
    hash
    nonce
    ommerCount
    logsBloom
    mixHash
    ommerHash
    extraData
    stateRoot
    receiptsRoot
    transactionCount
    transactionsRoot
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "number": 17607,
      "transactions": [],
      "timestamp": "0x5cdbdfb5",
      "difficulty": "0x1",
      "totalDifficulty": "0x44c8",
      "gasUsed": 0,
      "gasLimit": 4700000,
      "hash": "0xb0efed1fc9326fee967cb2d845d4ebe57c5350a0670c8e86f8052dea6f219f92",
      "nonce": "0x0000000000000000",
      "ommerCount": 0,
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
      "ommerHash": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "extraData": "0xf882a00000000000000000000000000000000000000000000000000000000000000000d5949811ebc35d7b06b3fa8dc5809a1f9c52751e1deb808400000000f843b841fae6d25da0b91e3e88669d0a765c98479d86d53e9ea1f3fb6b36d7ff22fa622a3da0c49c20e5562c774e90acae8ad487936f6b6019cd8a782db684693cba1e9800",
      "stateRoot": "0xa7086c266aed46cd3bc45579178f8acb36d9d147de575a3ecbf8c7e6f1c737fc",
      "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "transactionCount": 0,
      "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "baseFeePerGas": "0x7"
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getBlockByNumber`

Returns information about the block matching the specified block number.

#### Parameters

- `blockNumber`: _string_ - hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

  :::note
  `pending` returns the same value as `latest`.
  :::

- `verbose`: _boolean_ - if `true`, returns the full [transaction objects](objects.md#transaction-object); if `false`, returns only the hashes of the transactions.

#### Returns

`result`: _object_ - [block object](objects.md#block-object), or `null` when there is no block.

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["0x68B3", true],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBlockByNumber",
  "params": ["0x68B3", true],
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
    "number": "0x68b3",
    "hash": "0xd5f1812548be429cbdc6376b29611fc49e06f1359758c4ceaaa3b393e2239f9c",
    "mixHash": "0x24900fb3da77674a861c428429dce0762707ecb6052325bbd9b3c64e74b5af9d",
    "parentHash": "0x1f68ac259155e2f38211ddad0f0a15394d55417b185a93923e2abe71bb7a4d6d",
    "nonce": "0x378da40ff335b070",
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "logsBloom": "0x00000000000000100000004080000000000500000000000000020000100000000800001000000004000001000000000000000800040010000020100000000400000010000000000000000040000000000000040000000000000000000000000000000400002400000000000000000000000000000004000004000000000000840000000800000080010004000000001000000800000000000000000000000000000000000800000000000040000000020000000000000000000800000400000000000000000000000600000400000000002000000000000000000000004000000000000000100000000000000000000000000000000000040000900010000000",
    "transactionsRoot": "0x4d0c8e91e16bdff538c03211c5c73632ed054d00a7e210c0eb25146c20048126",
    "stateRoot": "0x91309efa7e42c1f137f31fe9edbe88ae087e6620d0d59031324da3e2f4f93233",
    "receiptsRoot": "0x68461ab700003503a305083630a8fb8d14927238f0bc8b6b3d246c0c64f21f4a",
    "miner": "0xb42b6c4a95406c78ff892d270ad20b22642e102d",
    "difficulty": "0x66e619a",
    "totalDifficulty": "0x1e875d746ae",
    "extraData": "0xd583010502846765746885676f312e37856c696e7578",
    "size": "0x334",
    "gasLimit": "0x47e7c4",
    "gasUsed": "0x37993",
    "timestamp": "0x5835c54d",
    "uncles": [],
    "transactions": [],
    "baseFeePerGas": "0x7"
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block (number : 100) {transactions{hash} timestamp difficulty totalDifficulty gasUsed gasLimit hash nonce ommerCount logsBloom mixHash ommerHash extraData stateRoot receiptsRoot transactionCount transactionsRoot ommers{hash} ommerAt(index : 1){hash} miner{address} account(address: \"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73\"){balance} parent{hash} }}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(number: 100) {
    transactions {
      hash
    }
    timestamp
    difficulty
    totalDifficulty
    gasUsed
    gasLimit
    hash
    nonce
    ommerCount
    logsBloom
    mixHash
    ommerHash
    extraData
    stateRoot
    receiptsRoot
    transactionCount
    transactionsRoot
    ommers {
      hash
    }
    ommerAt(index: 1) {
      hash
    }
    miner {
      address
    }
    account(address: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73") {
      balance
    }
    parent {
      hash
    }
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "transactions": [],
      "timestamp": "0x5cd10933",
      "difficulty": "0x1",
      "totalDifficulty": "0x65",
      "gasUsed": 0,
      "gasLimit": 4700000,
      "hash": "0x63b3ea2bc37fec8f82680eb823652da6af8acebb4f6c4d0ff659c55be473c8b0",
      "nonce": "0x0000000000000000",
      "ommerCount": 0,
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
      "ommerHash": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "extraData": "0xf882a00000000000000000000000000000000000000000000000000000000000000000d5949811ebc35d7b06b3fa8dc5809a1f9c52751e1deb808400000000f843b8414d877d8d0ced37ea138fab55a978f3740367a24a31731322ecdc3368f11e0d4966c9ce17ae59a76fb94eb436e8a386868f6bd6b0a5678e58daf49f5dd940558b00",
      "stateRoot": "0xd650578a04b39f50cc979155f4510ec28c2c0a7c1e5fdbf84609bc7b1c430f48",
      "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "transactionCount": 0,
      "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "ommers": [],
      "ommerAt": null,
      "miner": {
        "address": "0x9811ebc35d7b06b3fa8dc5809a1f9c52751e1deb"
      },
      "account": {
        "balance": "0xad0f47f269cbf31ac"
      },
      "parent": {
        "hash": "0x7bca25e1fa5e395fd6029eb496a70b6b5495843976bf9e49b993c723ded29d9e"
      },
      "baseFeePerGas": "0x7"
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getBlockReceipts`

Returns all transaction receipts for a given block. Transaction receipts provide a way to track the success or failure of a transaction (`1` if successful and `0` if failed), as well as the amount of
gas used and any event logs that might have been produced by a smart contract during the transaction.

#### Parameters

`blockNumber`: _string_ - hexadecimal integer representing a block number, or one of
the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
[block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

:::note
`pending` returns the same value as `latest`.
:::

#### Returns

`result`: _object_ - [block object](objects.md#block-object), or `null` when there is no block.

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockReceipts","params":["latest"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0", "method": "eth_getBlockReceipts", "params": ["0x6f55"], "id": 1
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
      "blockHash": "0x19514ce955c65e4dd2cd41f435a75a46a08535b8fc16bc660f8092b32590b182",
      "blockNumber": "0x6f55",
      "contractAddress": null,
      "cumulativeGasUsed": "0x18c36",
      "from": "0x22896bfc68814bfd855b1a167255ee497006e730",
      "gasUsed": "0x18c36",
      "effectiveGasPrice": "0x9502f907",
      "logs": [
        {
          "address": "0xfd584430cafa2f451b4e2ebcf3986a21fff04350",
          "topics": [
            "0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d",
            "0x4be29e0e4eb91f98f709d98803cba271592782e293b84a625e025cbb40197ba8",
            "0x000000000000000000000000835281a2563db4ebf1b626172e085dc406bfc7d2",
            "0x00000000000000000000000022896bfc68814bfd855b1a167255ee497006e730"
          ],
          "data": "0x",
          "blockNumber": "0x6f55",
          "transactionHash": "0x4a481e4649da999d92db0585c36cba94c18a33747e95dc235330e6c737c6f975",
          "transactionIndex": "0x0",
          "blockHash": "0x19514ce955c65e4dd2cd41f435a75a46a08535b8fc16bc660f8092b32590b182",
          "logIndex": "0x0",
          "removed": false
        }
      ],
      "logsBloom": "0x00000004000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000080020000000000000200010000000000000000000001000000800000000000000000000000000000000000000000000000000000100100000000000000000000008000000000000000000000000000000002000000000000000000000",
      "status": "0x1",
      "to": "0xfd584430cafa2f451b4e2ebcf3986a21fff04350",
      "transactionHash": "0x4a481e4649da999d92db0585c36cba94c18a33747e95dc235330e6c737c6f975",
      "transactionIndex": "0x0",
      "type": "0x0"
    },
    {
      "blockHash": "0x19514ce955c65e4dd2cd41f435a75a46a08535b8fc16bc660f8092b32590b182",
      "blockNumber": "0x6f55",
      "contractAddress": null,
      "cumulativeGasUsed": "0x1de3e",
      "from": "0x712e3a792c974b3e3dbe41229ad4290791c75a82",
      "gasUsed": "0x5208",
      "effectiveGasPrice": "0x9502f907",
      "logs": [],
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "status": "0x1",
      "to": "0xd42e2b1c14d02f1df5369a9827cb8e6f3f75f338",
      "transactionHash": "0xefb83b4e3f1c317e8da0f8e2fbb2fe964f34ee184466032aeecac79f20eacaf6",
      "transactionIndex": "0x1",
      "type": "0x2"
    }
  ]
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block  (hash: \"0x4d746a3381673a5180744a56e78cded4696b77317866c2253566e0fa16967e1d\") {transactions{block{hash logsBloom} hash createdContract{address} cumulativeGasUsed gas gasUsed logs{topics} from{address} to{address} index}}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block (hash: "0x4d746a3381673a5180744a56e78cded4696b77317866c2253566e0fa16967e1d") {
    transactions { 
      block { 
        hash
        logsBloom
      } 
      hash
      createdContract {
        address
      } 
      cumulativeGasUsed
      gas
      gasUsed
      logs{ 
        topics
      } 
      from{ 
        address
      }
      to { 
        address
      } 
      index
    }
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data" : {
    "block" : {
      "transactions" : [ {
        "block" : {
          "hash" : "0x4d746a3381673a5180744a56e78cded4696b77317866c2253566e0fa16967e1d",
          "logsBloom" : "0x2e0a8080520608000e38181e0c9081e813a00c184a010d1900c9602240428dc6480004444098428b945010802454104002827420426591a200224016802841900031bd4440828ec9b113081880027c01cc47105c1885d556216200880026160810050028422a4b0c4bc8087372860851000802c8d901158504a482100d488040119c08045e500824402054a0d91cc433188909020a06ac841914a2a082c104a1260460014b8b001b28030202518c040008266038a880026208041d082503589054581223c188004396804801280c00020c492816060a421831c8820ac04460303a9e48128238e0098f319030083808150c4914b8840000206715481500690000"
        },
        "hash" : "0x7afe779fd0c6d4a1b6f330e679a5cf94095eaa57d2ce0c0ef991dfb2b405374f",
        "createdContract" : null,
        "cumulativeGasUsed" : "0x5208",
        "gas" : "0x61a8",
        "gasUsed" : "0x5208",
        "logs" : [ ],
        "from" : {
          "address" : "0x66f962241b8ff853849c85a63a0ce20bae4f68d5"
        },
        "to" : {
          "address" : "0x6be8356826a9fc7b2d911fcc1de6342ae5f5b9a3"
        },
        "index" : "0x0"
      }, {
        "block" : {
          "hash" : "0x4d746a3381673a5180744a56e78cded4696b77317866c2253566e0fa16967e1d",
          "logsBloom" : "0x2e0a8080520608000e38181e0c9081e813a00c184a010d1900c9602240428dc6480004444098428b945010802454104002827420426591a200224016802841900031bd4440828ec9b113081880027c01cc47105c1885d556216200880026160810050028422a4b0c4bc8087372860851000802c8d901158504a482100d488040119c08045e500824402054a0d91cc433188909020a06ac841914a2a082c104a1260460014b8b001b28030202518c040008266038a880026208041d082503589054581223c188004396804801280c00020c492816060a421831c8820ac04460303a9e48128238e0098f319030083808150c4914b8840000206715481500690000"
        },
        "hash" : "0x412f04ba27c1c096dadb2d8af54ee61034c3d4679fdd025a634e95fa2238713c",
        "createdContract" : null,
        "cumulativeGasUsed" : "0xbcdb2",
        "gas" : "0xbdfe0",
        "gasUsed" : "0xb7baa",
        "logs" : [ {
          "topics" : [ "0xd93fde3ea1bb11dcd7a4e66320a05fc5aa63983b6447eff660084c4b1b1b499b", "0x00000000000000000000000000000000000000000000000000000000000e4d3a" ]
        } ],
        "from" : {
          "address" : "0xe253f7a6533c62755f470b33fa5bcd659a5db3cd"
        },
        "to" : {
          "address" : "0x95ff8d3ce9dcb7455beb7845143bea84fe5c4f6f"
        },
        "index" : "0x1"
      } ]
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getBlockTransactionCountByHash`

Returns the number of transactions in the block matching the specified block hash.

#### Parameters

`hash`: _string_ - 32-byte block hash

#### Returns

`result`: _number_ - integer representing the number of transactions in the specified block, or `null` if no matching block hash is found

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockTransactionCountByHash","params":["0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBlockTransactionCountByHash",
  "params": [
    "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"
  ],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": null
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block(hash:\"0xe455c14f757b0b9b67774baad1be1c180a4c1657df52259dbb685bf375408097\"){transactionCount}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(hash: "0xe455c14f757b0b9b67774baad1be1c180a4c1657df52259dbb685bf375408097") {
    transactionCount
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "transactionCount": 1
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getBlockTransactionCountByNumber`

Returns the number of transactions in a block matching the specified block number.

#### Parameters

`blockNumber`: _string_ - hexadecimal integer representing a block number, or one of
the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
[block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

:::note
`pending` returns the same value as `latest`.
:::

#### Returns

`result`: _string_ - integer representing the number of transactions in the specified block, or `null` if no matching block number is found

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockTransactionCountByNumber","params":["0xe8"],"id":51}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBlockTransactionCountByNumber",
  "params": ["0xe8"],
  "id": 51
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 51,
  "result": "0x8"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block(number:232){transactionCount}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(number: 232) {
    transactionCount
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "transactionCount": 1
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getCode`

Returns the code of the smart contract at the specified address. Besu stores compiled smart contract code as a hexadecimal value.

#### Parameters

- `address`: _string_ - 20-byte contract address

- `blockNumber` or `blockHash`: _string_ - hexadecimal integer representing a block number,
  block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as
  described in [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

  :::note
  `pending` returns the same value as `latest`.
  :::

#### Returns

`result`: _data_ - code stored at the specified address

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0xa50a51c09a5c451c52bb714527e1974b686d8e77", "latest"],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getCode",
  "params": ["0xa50a51c09a5c451c52bb714527e1974b686d8e77", "latest"],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": "0x60806040526004361060485763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416633fa4f2458114604d57806355241077146071575b600080fd5b348015605857600080fd5b50605f6088565b60408051918252519081900360200190f35b348015607c57600080fd5b506086600435608e565b005b60005481565b60008190556040805182815290517f199cd93e851e4c78c437891155e2112093f8f15394aa89dab09e38d6ca0727879181900360200190a1505600a165627a7a723058209d8929142720a69bde2ab3bfa2da6217674b984899b62753979743c0470a2ea70029"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{"query": "{account(address: \"0xa50a51c09a5c451c52bb714527e1974b686d8e77\"){ code }}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  account(address: "0xa50a51c09a5c451c52bb714527e1974b686d8e77") {
    code
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "account": {
      "code": "0x60806040526004361060485763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416633fa4f2458114604d57806355241077146071575b600080fd5b348015605857600080fd5b50605f6088565b60408051918252519081900360200190f35b348015607c57600080fd5b506086600435608e565b005b60005481565b60008190556040805182815290517f199cd93e851e4c78c437891155e2112093f8f15394aa89dab09e38d6ca0727879181900360200190a1505600a165627a7a723058209d8929142720a69bde2ab3bfa2da6217674b984899b62753979743c0470a2ea70029"
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getFilterChanges`

Polls the specified filter and returns an array of changes that have occurred since the last poll.

#### Parameters

`filterId`: _string_ - filter ID

#### Returns

`result`: _array_ of _strings_ or _objects_ - if nothing changed since the last poll, an empty list; otherwise:

- For filters created with `eth_newBlockFilter`, returns block hashes.

- For filters created with `eth_newPendingTransactionFilter`, returns transaction hashes.

- For filters created with `eth_newFilter`, returns [log objects](objects.md#log-object).

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getFilterChanges","params":["0xf8bf5598d9e04fbe84523d42640b9b0e"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getFilterChanges",
  "params": ["0xf8bf5598d9e04fbe84523d42640b9b0e"],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json title="Example result from a filter created with eth_newBlockFilter"
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    "0xda2bfe44bf85394f0d6aa702b5af89ae50ae22c0928c18b8903d9269abe17e0b",
    "0x88cd3a37306db1306f01f7a0e5b25a9df52719ad2f87b0f88ee0e6753ed4a812",
    "0x4d4c731fe129ff32b425e6060d433d3fde278b565bbd1fd624d5a804a34f8786"
  ]
}
```

```json title="Example result from a filter created with eth_newPendingTransactionFilter"
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    "0x1e977049b6db09362da09491bee3949d9362080ce3f4fc19721196d508580d46",
    "0xa3abc4b9a4e497fd58dc59cdff52e9bb5609136bcd499e760798aa92802769be"
  ]
}
```

```json title="Example result from a filter created with eth_newFilter"
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "logIndex": "0x0",
      "removed": false,
      "blockNumber": "0x233",
      "blockHash": "0xfc139f5e2edee9e9c888d8df9a2d2226133a9bd87c88ccbd9c930d3d4c9f9ef5",
      "blockTimestamp": "0x55ba4769",
      "transactionHash": "0x66e7a140c8fa27fe98fde923defea7562c3ca2d6bb89798aabec65782c08f63d",
      "transactionIndex": "0x0",
      "address": "0x42699a7612a82f1d9c36148af9c77354759b210b",
      "data": "0x0000000000000000000000000000000000000000000000000000000000000004",
      "topics": [
        "0x04474795f5b996ff80cb47c148d4c5ccdbe09ef27551820caa9c2f8ed149cce3"
      ]
    },
    {
      "logIndex": "0x0",
      "removed": false,
      "blockNumber": "0x238",
      "blockHash": "0x98b0ec0f9fea0018a644959accbe69cd046a8582e89402e1ab0ada91cad644ed",
      "blockTimestamp": "0x55ba4773",
      "transactionHash": "0xdb17aa1c2ce609132f599155d384c0bc5334c988a6c368056d7e167e23eee058",
      "transactionIndex": "0x0",
      "address": "0x42699a7612a82f1d9c36148af9c77354759b210b",
      "data": "0x0000000000000000000000000000000000000000000000000000000000000007",
      "topics": [
        "0x04474795f5b996ff80cb47c148d4c5ccdbe09ef27551820caa9c2f8ed149cce3"
      ]
    }
  ]
}
```

</TabItem>

</Tabs>

### `eth_getFilterLogs`

Returns an array of [logs](../../concepts/events-and-logs.md) for the specified filter.

Leave the [`--auto-log-bloom-caching-enabled`](../cli/options.md#auto-log-bloom-caching-enabled) command line option at the default value of `true` to improve log retrieval performance.

:::note

`eth_getFilterLogs` is only used for filters created with `eth_newFilter`. To specify a filter object and get logs without creating a filter, use `eth_getLogs`.

:::

#### Parameters

`filterId`: _string_ - filter ID

#### Returns

`result`: _array_ of _objects_ - list of [log objects](objects.md#log-object)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getFilterLogs","params":["0x5ace5de3985749b6a1b2b0d3f3e1fb69"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getFilterLogs",
  "params": ["0x5ace5de3985749b6a1b2b0d3f3e1fb69"],
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
      "logIndex": "0x0",
      "removed": false,
      "blockNumber": "0xb3",
      "blockHash": "0xe7cd776bfee2fad031d9cc1c463ef947654a031750b56fed3d5732bee9c61998",
      "blockTimestamp": "0x55ba4486",
      "transactionHash": "0xff36c03c0fba8ac4204e4b975a6632c862a3f08aa01b004f570cc59679ed4689",
      "transactionIndex": "0x0",
      "address": "0x2e1f232a9439c3d459fceca0beef13acc8259dd8",
      "data": "0x0000000000000000000000000000000000000000000000000000000000000003",
      "topics": [
        "0x04474795f5b996ff80cb47c148d4c5ccdbe09ef27551820caa9c2f8ed149cce3"
      ]
    },
    {
      "logIndex": "0x0",
      "removed": false,
      "blockNumber": "0xb6",
      "blockHash": "0x3f4cf35e7ed2667b0ef458cf9e0acd00269a4bc394bb78ee07733d7d7dc87afc",
      "blockTimestamp": "0x55ba448c",
      "transactionHash": "0x117a31d0dbcd3e2b9180c40aca476586a648bc400aa2f6039afdd0feab474399",
      "transactionIndex": "0x0",
      "address": "0x2e1f232a9439c3d459fceca0beef13acc8259dd8",
      "data": "0x0000000000000000000000000000000000000000000000000000000000000005",
      "topics": [
        "0x04474795f5b996ff80cb47c148d4c5ccdbe09ef27551820caa9c2f8ed149cce3"
      ]
    }
  ]
}
```

</TabItem>

</Tabs>

### `eth_getLogs`

Returns an array of [logs](../../concepts/events-and-logs.md) matching a specified filter object.

Leave the [`--auto-log-bloom-caching-enabled`](../cli/options.md#auto-log-bloom-caching-enabled) command line option at the default value of `true` to improve log retrieval performance.

:::caution

Using `eth_getLogs` to get logs from a large range of blocks, especially an entire chain from its genesis block, might cause Besu to hang for an indeterminable amount of time while generating the response. We recommend setting a range limit using the [`--rpc-max-logs-range`](../cli/options.md#rpc-max-logs-range) option (or leaving it at its default value of 1000).

:::

#### Parameters

`filterOptions`: _object_ - [filter options object](objects.md#filter-options-object)

#### Returns

`result`: _array_ of _objects_ - list of [log objects](objects.md#log-object)

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getLogs","params":[{"fromBlock":"0x16e2a9a","toBlock":"0x16e2a9a","address":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "topics":[]}], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getLogs",
  "params": [
    {
      "fromBlock": "0x16e2a9a",
      "toBlock": "0x16e2a9a",
      "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "topics": []
    }
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
      "removed": false,
      "logIndex": "0x2",
      "transactionIndex": "0x0",
      "transactionHash": "0xf9bde920aba1c0eb632138ae21d3f019977de264a4714a54f1ae2e337cce4e3d",
      "blockHash": "0xa02851f445eea915ef51c54f1352a773c3821a1860d49c6d3e94a16659291c19",
      "blockNumber": "0x16e2a9a",
      "blockTimestamp": "0x693c23db",
      "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "data": "0x00000000000000000000000000000000000000000000000001112ea12c39c032",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378da...9d4b2b7fad"
      ]
    },
    {
      "removed": false,
      "logIndex": "0x6",
      "transactionIndex": "0x0",
      "transactionHash": "0xf9bde920aba1c0eb632138ae21d3f019977de264a4714a54f1ae2e337cce4e3d",
      "blockHash": "0xa02851f445eea915ef51c54f1352a773c3821a1860d49c6d3e94a16659291c19",
      "blockNumber": "0x16e2a9a",
      "blockTimestamp": "0x693c23db",
      "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "data": "0x00000000000000000000000000000000000000000000000001112ea12c39c032",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378d...629ba9375161"
      ]
    }
  ]
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{"query": "{logs(filter:{fromBlock: 24000026, toBlock: 24000026, addresses: [\"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2\"]}) {index topics data account{address} transaction{hash} }}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  logs(filter: {fromBlock: 24000026, toBlock: 24000026, addresses: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"]}) {
    index
    topics
    data
    account {
      address
    }
    transaction {
      hash
    }
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "logs": [
      {
        "index": 2,
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378...d4b2b7fad"
        ],
        "data": "0x00000000000000000000000000000000000000000000000001112ea12c39c032",
        "account": {
          "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
        },
        "transaction": {
          "hash": "0xf9bde920aba1c0eb632138ae21d3f019977de264a4714a54f1ae2e337cce4e3d"
        }
      },
      {
        "index": 6,
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378...9ba9375161"
        ],
        "data": "0x00000000000000000000000000000000000000000000000001112ea12c39c032",
        "account": {
          "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
        },
        "transaction": {
          "hash": "0xf9bde920aba1c0eb632138ae21d3f019977de264a4714a54f1ae2e337cce4e3d"
        }
      }
    ]
  }
}
```

</TabItem>

</Tabs>
 
### `eth_getProof`

Returns the account and storage values of the specified account, including the Merkle proof.

The API allows IoT devices or mobile apps which are unable to run light clients to verify responses from untrusted sources, by using a trusted block hash.

#### Parameters

- `address`: _string_ - 20-byte address of the account or contract

- `keys`: _array_ of _strings_ - list of 32-byte storage keys to generate proofs for

- `blockNumber` or `blockHash`: _string_ - hexadecimal integer representing a block
  number, block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or
  `safe`, as described in [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

  :::note
  `pending` returns the same value as `latest`.
  :::

#### Returns

`result`: _object_ - account details object with the following fields:

- `balance`: _string_ - account balance

- `codeHash`: _string_ - 32-byte hash of the account code

- `nonce`: _string_ - number of transactions sent from the account

- `storageHash`: _string_ - 32-byte SHA3 of the `storageRoot`

- `accountProof`: _array_ of _strings_ - list of RLP-encoded Merkle tree nodes, starting with the `stateRoot`

- `storageProof`: _array_ of _objects_ - list of storage entry objects with the following fields:

  - `key`: _string_ - storage key

  - `value`: _string_ - storage value

  - `proof`: _array_ of _strings_ - list of RLP-encoded Merkle tree nodes, starting with the `storageHash`

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method": "eth_getProof","params": [
"0a8156e7ee392d885d10eaa86afd0e323afdcd95", ["0x0000000000000000000000000000000000000000000000000000000000000347"], "latest"],"id": 1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getProof",
  "params": [
    "0a8156e7ee392d885d10eaa86afd0e323afdcd95",
    ["0x0000000000000000000000000000000000000000000000000000000000000347"],
    "latest"
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
    "accountProof": [
      "0xf90211a0...608d898380",
      "0xf90211a0...ec33f19580",
      "0xf901d1a0...9e55584480",
      "0xf8718080...18e5777142"
    ],
    "address": "0x0a8156e7ee392d885d10eaa86afd0e323afdcd95",
    "balance": "0x0",
    "codeHash": "0x2b6975dcaf69f9bb9a3b30bb6a37b305ce440250bf0dd2f23338cb18e5777142",
    "nonce": "0x5f",
    "storageHash": "0x917688de43091589aa58c1dfd315105bc9de4478b9ba7471616a4d8a43d46203",
    "storageProof": [
      {
        "key": "0x0000000000000000000000000000000000000000000000000000000000000347",
        "value": "0x0",
        "proof": [
          "0xf90211a0...5176779280",
          "0xf901f1a0...c208d86580",
          "0xf8d180a0...1ce6808080"
        ]
      }
    ]
  }
}
```

</TabItem>

</Tabs>

### `eth_getStorageAt`

Returns the value of a storage position at a specified address.

#### Parameters

- `address`: _string_ - 20-byte storage address

- `index`: _string_ - integer index of the storage position

- `blockNumber` or `blockHash`: _string_ - hexadecimal integer representing a block
  number, block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or
  `safe`, as described in [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

  :::note
  `pending` returns the same value as `latest`.
  :::

#### Returns

`result` : _string_ - value at the specified storage position

Calculating the correct position depends on the storage you want to retrieve.

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method": "eth_getStorageAt","params": ["0x‭3B3F3E‬","0x0","latest"],"id": 53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getStorageAt",
  "params": ["0x‭3B3F3E‬", "0x0", "latest"],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{account(address: \"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73\") {storage(slot: \"0x04\")}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  account(address: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73") {
    storage(slot: "0x04")
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "account": {
      "storage": "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getTransactionByBlockHashAndIndex`

Returns transaction information for the specified block hash and transaction index position.

#### Parameters

- `block`: _string_ - 32-byte hash of a block

- `index`: _string_ - integer representing the transaction index position

#### Returns

`result`: _object_ - [transaction object](objects.md#transaction-object), or `null` when there is no transaction

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionByBlockHashAndIndex","params":["0xbf137c3a7a1ebdfac21252765e5d7f40d115c2757e4a4abee929be88c624fdb7", "0x2"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionByBlockHashAndIndex",
  "params": [
    "0xbf137c3a7a1ebdfac21252765e5d7f40d115c2757e4a4abee929be88c624fdb7",
    "0x2"
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
    "blockHash": "0xbf137c3a7a1ebdfac21252765e5d7f40d115c2757e4a4abee929be88c624fdb7",
    "blockNumber": "0x1442e",
    "chainId": 2018,
    "from": "0x70c9217d814985faef62b124420f8dfbddd96433",
    "gas": "0x3d090",
    "gasPrice": "0x57148a6be",
    "hash": "0xfc766a71c406950d4a4955a340a092626c35083c64c7be907060368a5e6811d6",
    "input": "0x51a34eb8000000000000000000000000000000000000000000000029b9e659e41b780000",
    "nonce": "0x2cb2",
    "to": "0xcfdc98ec7f01dab1b67b36373524ce0208dc3953",
    "transactionIndex": "0x2",
    "value": "0x0",
    "v": "0x2a",
    "r": "0xa2d2b1021e1428740a7c67af3c05fe3160481889b25b921108ac0ac2c3d5d40a",
    "s": "0x63186d2aaefe188748bfb4b46fb9493cbc2b53cf36169e8501a5bc0ed941b484"
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{"query": "{ block(hash: \"0x9270651f9c6fa36232c379d0ecf69b519383aa275815a65f1e03114346668f69\") { transactionAt(index: 0) {block{hash}  hash } } }"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(hash: "0x9270651f9c6fa36232c379d0ecf69b519383aa275815a65f1e03114346668f69") {
    transactionAt(index: 0) {
      block {
        hash
      }
      hash
    }
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "transactionAt": {
        "block": {
          "hash": "0x9270651f9c6fa36232c379d0ecf69b519383aa275815a65f1e03114346668f69"
        },
        "hash": "0x5f5366af89e8777d5ae62a1af94a0876bdccbc22417bed0aff361eefa3e37f86"
      }
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getTransactionByBlockNumberAndIndex`

Returns transaction information for the specified block number and transaction index position.

#### Parameters

- `blockNumber`: _string_ - hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

  :::note
  `pending` returns the same value as `latest`.
  :::

- `index`: _string_ - transaction index position

#### Returns

`result`: _object_ - [transaction object](objects.md#transaction-object), or `null` when there is no transaction

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionByBlockNumberAndIndex","params":["82990", "0x2"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionByBlockNumberAndIndex",
  "params": ["82990", "0x2"],
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
    "blockHash": "0xbf137c3a7a1ebdfac21252765e5d7f40d115c2757e4a4abee929be88c624fdb7",
    "blockNumber": "0x1442e",
    "chainId": 2018,
    "from": "0x70c9217d814985faef62b124420f8dfbddd96433",
    "gas": "0x3d090",
    "gasPrice": "0x57148a6be",
    "hash": "0xfc766a71c406950d4a4955a340a092626c35083c64c7be907060368a5e6811d6",
    "input": "0x51a34eb8000000000000000000000000000000000000000000000029b9e659e41b780000",
    "nonce": "0x2cb2",
    "to": "0xcfdc98ec7f01dab1b67b36373524ce0208dc3953",
    "transactionIndex": "0x2",
    "value": "0x0",
    "v": "0x2a",
    "r": "0xa2d2b1021e1428740a7c67af3c05fe3160481889b25b921108ac0ac2c3d5d40a",
    "s": "0x63186d2aaefe188748bfb4b46fb9493cbc2b53cf36169e8501a5bc0ed941b484"
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{"query": "{block(number:20303) {transactionAt(index: 0) {block{hash} hash}}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(number: 20303) {
    transactionAt(index: 0) {
      block {
        hash
      }
      hash
    }
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "transactionAt": {
        "block": {
          "hash": "0x9270651f9c6fa36232c379d0ecf69b519383aa275815a65f1e03114346668f69"
        },
        "hash": "0x5f5366af89e8777d5ae62a1af94a0876bdccbc22417bed0aff361eefa3e37f86"
      }
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getTransactionByHash`

Returns transaction information for the specified transaction hash.

#### Parameters

`transaction`: _string_ - 32-byte transaction hash

#### Returns

`result`: _object_ - [transaction object](objects.md#transaction-object), or `null` when there is no transaction

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["0xa52be92809541220ee0aaaede6047d9a6c5d0cd96a517c854d944ee70a0ebb44"],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionByHash",
  "params": [
    "0xa52be92809541220ee0aaaede6047d9a6c5d0cd96a517c854d944ee70a0ebb44"
  ],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": {
    "blockHash": "0x510efccf44a192e6e34bcb439a1947e24b86244280762cbb006858c237093fda",
    "blockNumber": "0x422",
    "chainId": 2018,
    "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
    "gas": "0x5208",
    "gasPrice": "0x3b9aca00",
    "hash": "0xa52be92809541220ee0aaaede6047d9a6c5d0cd96a517c854d944ee70a0ebb44",
    "input": "0x",
    "nonce": "0x1",
    "to": "0x627306090abab3a6e1400e9345bc60c78a8bef57",
    "transactionIndex": "0x0",
    "value": "0x4e1003b28d9280000",
    "v": "0xfe7",
    "r": "0x84caf09aefbd5e539295acc67217563438a4efb224879b6855f56857fa2037d3",
    "s": "0x5e863be3829812c81439f0ae9d8ecb832b531d651fb234c848d1bf45e62be8b9"
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{"query": "{transaction(hash : \"0x03d80b9ca0a71435399a268609d6d7896f7155d2147cc22b780672bcb59b170d\") { block{hash} gas gasPrice hash nonce value from {address} to {address} status}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  transaction(hash: "0x03d80b9ca0a71435399a268609d6d7896f7155d2147cc22b780672bcb59b170d") {
    block {
      hash
    }
    gas
    gasPrice
    hash
    nonce
    value
    from {
      address
    }
    to {
      address
    }
    status
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "transaction": {
      "block": {
        "hash": "0xb1ef35744bade6980c3a933024b2557a8c724a19e5fdd2116bac712aa5e57198"
      },
      "gas": 21000,
      "gasPrice": "0x2540be400",
      "hash": "0x03d80b9ca0a71435399a268609d6d7896f7155d2147cc22b780672bcb59b170d",
      "nonce": 6,
      "value": "0x8ac7230489e80000",
      "from": {
        "address": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
      },
      "to": {
        "address": "0x9d8f8572f345e1ae53db1dfa4a7fce49b467bd7f"
      },
      "status": 1
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getTransactionCount`

Returns the number of transactions sent from a specified address. Use the `pending` tag to get the next account nonce not used by any pending transactions.

#### Parameters

- `address`: _string_ - 20-byte account address

- `blockNumber` or `blockHash`: _string_ - hexadecimal integer representing a block number, block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

#### Returns

`result`: _string_ - integer representing the number of transactions sent from the specified address

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["0xc94770007dda54cF92009BFF0dE90c06F603a09f","latest"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionCount",
  "params": ["0xc94770007dda54cF92009BFF0dE90c06F603a09f", "latest"],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{ account (address:\"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73\"){transactionCount}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  account(address: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73") {
    transactionCount
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "account": {
      "transactionCount": 5
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getTransactionReceipt`

Returns the receipt of a transaction by transaction hash. Receipts for pending transactions are not available.

If you enabled [revert reason](../../../private-networks/how-to/send-transactions/revert-reason.md), the receipt includes available revert reasons in the response.

#### Parameters

`transaction`: _string_ - 32-byte hash of a transaction

#### Returns

`result`: _object_ - [transaction receipt object](objects.md#transaction-receipt-object), or `null` when there is no receipt

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params":["0x504ce587a65bdbdb6414a0c6c16d86a04dd79bfcc4f2950eec9634b30ce5370f"],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionReceipt",
  "params": [
    "0x504ce587a65bdbdb6414a0c6c16d86a04dd79bfcc4f2950eec9634b30ce5370f"
  ],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "blockHash": "0xe7212a92cfb9b06addc80dec2a0dfae9ea94fd344efeb157c41e12994fcad60a",
    "blockNumber": "0x50",
    "blockTimestamp": "0x55ba43bb",
    "contractAddress": null,
    "cumulativeGasUsed": "0x5208",
    "from": "0x627306090abab3a6e1400e9345bc60c78a8bef57",
    "gasUsed": "0x5208",
    "effectiveGasPrice": "0x1",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "status": "0x1",
    "to": "0xf17f52151ebef6c7334fad080c5704d77216b732",
    "transactionHash": "0xc00e97af59c6f88de163306935f7682af1a34c67245e414537d02e422815efc3",
    "transactionIndex": "0x0"
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{"query": "{transaction(hash: \"0x5f5366af89e8777d5ae62a1af94a0876bdccbc22417bed0aff361eefa3e37f86\") {block{hash logsBloom} hash createdContract{address} cumulativeGasUsed gas gasUsed logs{topics} from{address} to{address} index}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  transaction(hash: "0x5f5366af89e8777d5ae62a1af94a0876bdccbc22417bed0aff361eefa3e37f86") {
    block {
      hash
      logsBloom
    }
    hash
    createdContract {
      address
    }
    cumulativeGasUsed
    gas
    gasUsed
    logs {
      topics
    }
    from {
      address
    }
    to {
      address
    }
    index
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "transaction": {
      "block": {
        "hash": "0x9270651f9c6fa36232c379d0ecf69b519383aa275815a65f1e03114346668f69",
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      },
      "hash": "0x5f5366af89e8777d5ae62a1af94a0876bdccbc22417bed0aff361eefa3e37f86",
      "createdContract": null,
      "cumulativeGasUsed": 21000,
      "gas": 21000,
      "gasUsed": 21000,
      "effectiveGasPrice": "0x1",
      "logs": [],
      "from": {
        "address": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
      },
      "to": {
        "address": "0x9d8f8572f345e1ae53db1dfa4a7fce49b467bd7f"
      },
      "index": 0
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getUncleByBlockHashAndIndex`

Returns uncle specified by block hash and index.

#### Parameters

- `block`: _string_ - 32-byte block hash

- `uncleIndex`: _string_ - index of the uncle

#### Returns

`result`: _object_ - [block object](objects.md#block-object)

:::note

Uncles don't contain individual transactions.

:::

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getUncleByBlockHashAndIndex","params":["0xc48fb64230a82f65a08e7280bd8745e7fea87bc7c206309dee32209fe9a985f7", "0x0"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getUncleByBlockHashAndIndex",
  "params": [
    "0xc48fb64230a82f65a08e7280bd8745e7fea87bc7c206309dee32209fe9a985f7",
    "0x0"
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
    "difficulty": "0x76b123df93230",
    "extraData": "0x50505945206e616e6f706f6f6c2e6f7267",
    "gasLimit": "0x7a121d",
    "gasUsed": "0x7a0175",
    "hash": "0xc20189c0b1a4a23116ab3b177e929137f6e826f17fc4c2e880e7258c620e9817",
    "logsBloom": "0x890086c024487ca422be846a201a10e41bc2882902312116c1119609482031e9c000e2a708004a10281024028020c505727a12570c4810121c59024490b040894406a1c23c37a0094810921da3923600c71c03044b40924280038d07ab91964a008084264a01641380798840805a284cce201a8026045451002500113a00de441001320805ca2840037000111640d090442c11116d2112948084240242340400236ce81502063401dcc214b9105194d050884721c1208800b20501a4201400276004142f118e60808284506979a86e050820101c170c185e2310005205a82a2100382422104182090184800c02489e033440218142140045801c024cc1818485",
    "miner": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5",
    "mixHash": "0xf557cc827e058862aa3ea1bd6088fb8766f70c0eac4117c56cf85b7911f82a14",
    "nonce": "0xd320b48904347cdd",
    "number": "0x768964",
    "parentHash": "0x98d752708b3677df8f439c4529f999b94663d5494dbfc08909656db3c90f6255",
    "receiptsRoot": "0x0f838f0ceb73368e7fc8d713a7761e5be31e3b4beafe1a6875a7f275f82da45b",
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "size": "0x21a",
    "stateRoot": "0xa0c7d4fca79810c89c517eff8dadb9c6d6f4bcc27c2edfb301301e1cf7dec642",
    "timestamp": "0x5cdcbba6",
    "totalDifficulty": "0x229ad33cabd4c40d23d",
    "transactionsRoot": "0x866e38e91d01ef0387b8e07ccf35cd910224271ccf2b7477b8c8439e8b70f365",
    "uncles": []
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block(hash:\"0xc48fb64230a82f65a08e7280bd8745e7fea87bc7c206309dee32209fe9a985f7\"){ ommerAt(index: 0) {difficulty extraData gasLimit gasUsed hash logsBloom mixHash nonce number receiptsRoot stateRoot timestamp totalDifficulty transactionsRoot}}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(hash: "0xc48fb64230a82f65a08e7280bd8745e7fea87bc7c206309dee32209fe9a985f7") {
    ommerAt(index: 0) {
      difficulty
      extraData
      gasLimit
      gasUsed
      hash
      logsBloom
      mixHash
      nonce
      number
      receiptsRoot
      stateRoot
      timestamp
      totalDifficulty
      transactionsRoot
    }
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "difficulty": "0x1",
      "extraData": "0xf882a00000000000000000000000000000000000000000000000000000000000000000d5949811ebc35d7b06b3fa8dc5809a1f9c52751e1deb808400000000f843b8418e98ef756acdae1e510b1df4b507b7af04eb3802db7fa0f3e73e7d0721b3645e76f4eb3d0dbf0de75620c4405bd5a663247cdd9616482c883053856d857f884a01",
      "gasLimit": 4700000,
      "gasUsed": 0,
      "hash": "0x0efe67972b982eb6be5df84e5238eb07475f86afa8a7de708f6a13ac0ff60d6c",
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
      "nonce": "0x0000000000000000",
      "number": 200,
      "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "stateRoot": "0xd650578a04b39f50cc979155f4510ec28c2c0a7c1e5fdbf84609bc7b1c430f48",
      "timestamp": "0x5cd109fb",
      "totalDifficulty": "0xc9",
      "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getUncleByBlockNumberAndIndex`

Returns uncle specified by block number and index.

#### Parameters

- `blockNumber`: _string_ - hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

  :::note
  `pending` returns the same value as `latest`.
  :::

- `uncleIndex`: _string_ - index of the uncle

#### Returns

`result`: _object_ - [block object](objects.md#block-object)

:::note

Uncles do not contain individual transactions.

:::

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getUncleByBlockNumberAndIndex","params":["0x7689D2", "0x0"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getUncleByBlockNumberAndIndex",
  "params": ["0x7689D2", "0x0"],
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
    "difficulty": "0x77daec467bf93",
    "extraData": "0x50505945206e616e6f706f6f6c2e6f7267",
    "gasLimit": "0x7a121d",
    "gasUsed": "0x7a0f7b",
    "hash": "0x42d83ae9c0743f4b1f9c61ff7ea8b164c1bab3627decd49233760680be006ecf",
    "logsBloom": "0x888200800000340120220008640200500408006100038400100581c000080240080a0014e8002010080004088040004022402a000c18010001400100002a041141a0610a0052900600041018c0002a0003090020404c00206010010513d00020005380124e08050480710000000108401012b0901c1424006000083a10a8c1040100a0440081050210124400040044304070004001100000012600806008061d0320800000b40042160600002480000000800000c0002100200940801c000820800048024904710000400640490026000a44300309000286088010c2300060003011380006400200812009144042204810209020410a84000410520c08802941",
    "miner": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5",
    "mixHash": "0xf977fcdb52868be410b75ef2becc35cc312f13ab0a6ce400ecd9d445f66fa3f2",
    "nonce": "0x628b28403bf1e3d3",
    "number": "0x7689d0",
    "parentHash": "0xb32cfdfbf4adb05d30f02fcc6fe039cc6666402142954051c1a1cb9cc91aa11e",
    "receiptsRoot": "0x9c7c8361d1a24ea2841432234c81974a9920d3eba2b2b1c496b5f925a95cb4ac",
    "sha3Uncles": "0x7d972aa1b182b7e93f1db043f03fbdbfac6874fe7e67e162141bcc0aefa6336b",
    "size": "0x21a",
    "stateRoot": "0x74e97b77813146344d75acb5a52a006cc6dfaca678a10fb8a484a8443e919272",
    "timestamp": "0x5cdcc0a7",
    "totalDifficulty": "0x229b0583b4bd2698ca0",
    "transactionsRoot": "0x1d21626afddf05e5866de66ca3fcd98f1caf5357eba0cc6ec675606e116a891b",
    "uncles": []
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block(number:2587){ ommerAt(index: 0) {difficulty extraData gasLimit gasUsed hash logsBloom mixHash nonce number receiptsRoot stateRoot timestamp totalDifficulty transactionsRoot}}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(number: 2587) {
    ommerAt(index: 0) {
      difficulty
      extraData
      gasLimit
      gasUsed
      hash
      logsBloom
      mixHash
      nonce
      number
      receiptsRoot
      stateRoot
      timestamp
      totalDifficulty
      transactionsRoot
    }
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "ommerAt": null
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getUncleCountByBlockHash`

Returns the number of uncles in a block from a block matching the given block hash.

#### Parameters

`block`: _string_ - 32-byte block hash

#### Returns

`result`: _string_ - integer representing the number of uncles in the specified block

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getUncleCountByBlockHash","params":["0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getUncleCountByBlockHash",
  "params": [
    "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"
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
  "result": 0x0
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block(hash:\"0x65c08d792e4192b9ece6b6f2390da7da464208b22d88490be8add9373917b426\"){ommerCount}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(hash: "0x65c08d792e4192b9ece6b6f2390da7da464208b22d88490be8add9373917b426") {
    ommerCount
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "ommerCount": 2
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_getUncleCountByBlockNumber`

Returns the number of uncles in a block matching the specified block number.

#### Parameters

`blockNumber`: _string_ - hexadecimal integer representing a block number, or one of
the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
[block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

:::note
`pending` returns the same value as `latest`.
:::

#### Returns

`result`: _string_ - integer representing the number of uncles in the specified block

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getUncleCountByBlockNumber","params":["0xe8"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getUncleCountByBlockNumber",
  "params": ["0xe8"],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{block(number:\"0x59fd\"){ommerCount}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  block(number: "0x59fd") {
    ommerCount
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "block": {
      "ommerCount": 0
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_maxPriorityFeePerGas`

Returns an estimate of how much priority fee, in wei, you can pay to get a transaction included in the current block.

#### Parameters

None

#### Returns

`result`: _hexadecimal_ value in wei

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_maxPriorityFeePerGas","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "eth_maxPriorityFeePerGas", "params": [], "id": 1 }
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0xf4240"
}
```

</TabItem>

</Tabs>

### `eth_mining` (Deprecated)

Whether the client is actively mining new blocks. Besu pauses mining while the client synchronizes with the network regardless of command settings or methods called.

#### Parameters

None

#### Returns

`result`: _boolean_ - indicates if the client is actively mining new blocks

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_mining","params":[],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "eth_mining", "params": [], "id": 53 }
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": true
}
```

</TabItem>

</Tabs>

### `eth_newBlockFilter`

Creates a filter to retrieve new block hashes. To poll for new blocks, use [`eth_getFilterChanges`](#eth_getfilterchanges).

#### Parameters

None

#### Returns

`result`: _string_ - filter ID

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_newBlockFilter","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "eth_newBlockFilter", "params": [], "id": 1 }
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x9d78b6780f844228b96ecc65a320a825"
}
```

</TabItem>

</Tabs>

### `eth_newFilter`

Creates a [log filter](../../concepts/events-and-logs.md). To poll for logs associated with the created filter, use [`eth_getFilterChanges`](#eth_getfilterchanges). To get all logs associated with the filter, use [`eth_getFilterLogs`](#eth_getfilterlogs).

#### Parameters

`filterOptions`: _object_ - [filter options object](objects.md#filter-options-object)

:::note

`fromBlock` and `toBlock` in the filter options object default to `latest`.

:::

#### Returns

`result`: _string_ - filter ID

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_newFilter","params":[{"fromBlock":"earliest", "toBlock":"latest", "topics":[]}],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_newFilter",
  "params": [{ "fromBlock": "earliest", "toBlock": "latest", "topics": [] }],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1ddf0c00989044e9b41cc0ae40272df3"
}
```

</TabItem>

</Tabs>

### `eth_newPendingTransactionFilter`

Creates a filter to retrieve new pending transactions hashes. To poll for new pending transactions, use [`eth_getFilterChanges`](#eth_getfilterchanges).

#### Parameters

None

#### Returns

`result`: _string_ - filter ID

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_newPendingTransactionFilter","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_newPendingTransactionFilter",
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
  "result": "0x443d6a77c4964707a8554c92f7e4debd"
}
```

</TabItem>

</Tabs>

### `eth_protocolVersion`

Returns current Ethereum protocol version.

#### Parameters

None

#### Returns

`result`: _string_ - Ethereum protocol version

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_protocolVersion","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{ "jsonrpc": "2.0", "method": "eth_protocolVersion", "params": [], "id": 1 }
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x3f"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{protocolVersion}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  protocolVersion
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "protocolVersion": 63
  }
}
```

</TabItem>

</Tabs>

### `eth_sendRawTransaction`

Sends a [signed transaction](../../how-to/send-transactions.md). A transaction can send ether, deploy a contract, or interact with a contract. Set the maximum transaction fee for transactions using the [`--rpc-tx-feecap`](../cli/options.md#rpc-tx-feecap) CLI option.

You can interact with contracts using `eth_sendRawTransaction` or [`eth_call`](#eth_call).

To avoid exposing your private key, create signed transactions offline and send the signed transaction data using `eth_sendRawTransaction`.

:::info

Besu doesn't implement [`eth_sendTransaction`](../../how-to/send-transactions.md).

[Web3Signer](https://docs.web3signer.consensys.net/) provides transaction signing and implements [`eth_sendTransaction`](https://docs.web3signer.consensys.net/reference/api/json-rpc#eth_sendtransaction).

:::

#### Parameters

`transaction`: _string_ - signed transaction serialized to hexadecimal format

:::note

[Creating and sending transactions](../../how-to/send-transactions.md) includes examples of creating signed transactions using the [web3.js](https://github.com/ethereum/web3.js/) library.

:::

#### Returns

`result`: _string_ - 32-byte transaction hash

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_sendRawTransaction",
  "params": [
    "0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "mutation {sendRawTransaction(data: \"0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833\")}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
mutation {
  sendRawTransaction(data: "0xf869018203e882520894f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000801ba02da1c48b670996dcb1f447ef9ef00b33033c48a4fe938f420bec3e56bfd24071a062e0aa78a81bf0290afbc3a9d8e9a068e6d74caa66c5e0fa8a46deaae96b0833")
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "sendRawTransaction": "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331"
  }
}
```

</TabItem>

</Tabs>

### `eth_simulateV1`

Simulates transactions across multiple blocks. Allows you to test transactions with custom state and
block parameters without submitting them to the network.

#### Parameters

- `payload`: _object_ - transaction simulation payload object containing the following fields:

  - `blockStateCalls`: _array_ of _objects_ - list of block state call objects, each containing the following fields:

    - `blockOverrides`: _array_ of _objects_ - list of [block override objects](objects.md#block-override-object)
    
    - `stateOverrides`: _array_ of _objects_ - list of [state override objects](objects.md#state-override-object)
    
    - `calls`: _array_ of _objects_ - list of [transaction call objects](objects.md#transaction-call-object)
  
  - `traceTransfers`:  _boolean_ - (optional) if `true`, ETH transfers are added as ERC-20 transfer
      events to the logs, allowing you to trace value transfers. The default is `false`.
  
  - `validation`: _boolean_ - (optional) If `true`, `eth_simulateV1` does all the validation that a
    normal EVM would do, except contract sender and signature checks. If `false`, `eth_simulateV1` behaves like `eth_call`.
    The default is `false`.
  
  - `returnFullTransactionObjects`: _boolean_ - (optional) If `true`, returns full transaction
    objects. If `false`, returns only hashes. The default is `false`.

- `blockNumber` or `blockHash`: _string_ - hexadecimal integer representing a block number,
  block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as
  described in [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

#### Returns

`result`: _array_ of _objects_ - list of simulation result objects, each containing the following fields:

- all the fields of a [block object](objects.md#block-object)

- `calls`: _array_ of _objects_ - list of [call result objects](objects.md#call-result-object)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0", "method":"eth_simulateV1", "params":[{"blockStateCalls":[{"blockOverrides":{"baseFeePerGas":"0x9"},"stateOverrides":{"0xc000000000000000000000000000000000000000":{"balance":"0x4a817c800"}},"calls":[{"from":"0xc000000000000000000000000000000000000000","to":"0xc000000000000000000000000000000000000001","maxFeePerGas":"0xf","value":"0x1"},{"from":"0xc000000000000000000000000000000000000000","to":"0xc000000000000000000000000000000000000002","maxFeePerGas":"0xf","value":"0x1"}]}],"validation":true,"traceTransfers":true},"latest"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_simultateV1",
  "params": [
    {
      "blockStateCalls": [
        {
          "blockOverrides": {
            "baseFeePerGas": "0x9"
          },
          "stateOverrides": {
            "0xc000000000000000000000000000000000000000": {
              "balance": "0x4a817c800"
            }
          },
          "calls": [
            {
              "from": "0xc000000000000000000000000000000000000000",
              "to": "0xc000000000000000000000000000000000000001",
              "maxFeePerGas": "0xf",
              "value": "0x1"
            },
            {
              "from": "0xc000000000000000000000000000000000000000",
              "to": "0xc000000000000000000000000000000000000002",
              "maxFeePerGas": "0xf",
              "value": "0x1"
            }
          ]
        }
      ],
      "validation": true,
      "traceTransfers": true
    },
    "latest"
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
      "baseFeePerGas": "0x9",
      "blobGasUsed": "0x0",
      "calls": [
        {
          "gasUsed": "0x5208",
          "maxUsedGas": "0x7530",
          "logs": [
            {
              "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
              "blockHash": "0xc98388385b0dbfc15ad5c6a0f4b19f7abd94efb4618ced05e3eb320ee30b1e7f",
              "blockNumber": "0x1496e50",
              "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
              "logIndex": "0x0",
              "removed": false,
              "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x000000000000000000000000c000000000000000000000000000000000000000",
                "0x000000000000000000000000c000000000000000000000000000000000000001"
              ],
              "transactionHash": "0xe7217784e0c3f7b35d39303b1165046e9b7e8af9b9cf80d5d5f96c3163de8f51",
              "transactionIndex": "0x0"
            }
          ],
          "returnData": "0x",
          "status": "0x1"
        },
        {
          "gasUsed": "0x5208",
          "maxUsedGas": "0x7530",
          "logs": [
            {
              "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
              "blockHash": "0xc98388385b0dbfc15ad5c6a0f4b19f7abd94efb4618ced05e3eb320ee30b1e7f",
              "blockNumber": "0x1496e50",
              "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
              "logIndex": "0x1",
              "removed": false,
              "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x000000000000000000000000c000000000000000000000000000000000000000",
                "0x000000000000000000000000c000000000000000000000000000000000000002"
              ],
              "transactionHash": "0xf0182201606ec03701ba3a07d965fabdb4b7d06b424f226ea7ec3581802fc6fa",
              "transactionIndex": "0x1"
            }
          ],
          "returnData": "0x",
          "status": "0x1"
        }
      ],
      "difficulty": "0x0",
      "excessBlobGas": "0x4920000",
      "extraData": "0x",
      "gasLimit": "0x1c9c380",
      "gasUsed": "0xa410",
      "hash": "0xc98388385b0dbfc15ad5c6a0f4b19f7abd94efb4618ced05e3eb320ee30b1e7f",
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "miner": "0x7e2a2fa2a064f693f0a55c5639476d913ff12d05",
      "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "nonce": "0x0000000000000000",
      "number": "0x1496e50",
      "parentBeaconBlockRoot": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "parentHash": "0xddd47e7383c8ced495e85e053f898d7a333feb0432fa9098306f6f563cde4984",
      "receiptsRoot": "0x75308898d571eafb5cd8cde8278bf5b3d13c5f6ec074926de3bb895b519264e1",
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "size": "0x29c",
      "stateRoot": "0xd6da11fae4ab94ddba2c4c71206962f7c6eaec6e5fabf00f3f7540c4ed7ad8f1",
      "timestamp": "0x67803e64",
      "transactions": [
        "0xe7217784e0c3f7b35d39303b1165046e9b7e8af9b9cf80d5d5f96c3163de8f51",
        "0xf0182201606ec03701ba3a07d965fabdb4b7d06b424f226ea7ec3581802fc6fa"
      ],
      "transactionsRoot": "0x9bdb74f3ce41f5893a02a631e904ae0d21ae8c4e416786d8dbd9cb5c54f1dc0f",
      "uncles": [],
      "withdrawals": [],
      "withdrawalsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"
    }
  ]  
}
```

</TabItem>

</Tabs>

### `eth_syncing`

Returns an object with data about the synchronization status, or `false` if not synchronizing.

:::note

Once the node reaches the head of the chain, `eth_syncing` returns false, indicating that there is no active syncing target.

:::

#### Parameters

None

#### Returns

`result`: _object_ or _boolean_ - synchronization status data object with the following fields, or `false` if not synchronizing:

- `startingBlock`: _string_ - index of the highest block on the blockchain when the network synchronization starts

- `currentBlock`: _string_ - index of the latest block (also known as the best block) for the current node (this is the same index that [`eth_blockNumber`](#eth_blocknumber) returns.)

- `highestBlock`: _string_ - index of the highest known block in the peer network (that is, the highest block so far discovered among peer nodes. This is the same value as `currentBlock` if the current node has no peers.)

- `pulledStates`: _string_ - if fast synchronizing, the number of state entries fetched so far, or `null` if this is not known or not relevant (if full synchronizing or fully synchronized, this field is not returned.)

- `knownStates`: _string_ - if fast synchronizing, the number of states the node knows of so far, or `null` if this is not known or not relevant (if full synchronizing or fully synchronized, this field is not returned.)

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":51}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{ "jsonrpc": "2.0", "method": "eth_syncing", "params": [], "id": 51 }
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 51,
  "result": {
    "startingBlock": "0x0",
    "currentBlock": "0x1518",
    "highestBlock": "0x9567a3",
    "pulledStates": "0x203ca",
    "knownStates": "0x200636"
  }
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "query": "{syncing{startingBlock currentBlock highestBlock pulledStates knownStates}}"}' http://localhost:8547/graphql
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  syncing {
    startingBlock
    currentBlock
    highestBlock
    pulledStates
    knownStates
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "syncing": {
      "startingBlock": 0,
      "currentBlock": 5400,
      "highestBlock": 9791395,
      "pullStates": 132042,
      "knownStates": 2098742
    }
  }
}
```

</TabItem>

</Tabs>

### `eth_uninstallFilter`

Uninstalls a filter with the specified ID. When a filter is no longer required, call this method.

Filters time out when not requested by [`eth_getFilterChanges`](#eth_getfilterchanges) or [`eth_getFilterLogs`](#eth_getfilterlogs) for 10 minutes.

#### Parameters

`filterId`: _string_ - filter ID

#### Returns

`result`: _boolean_ - indicates if the filter is successfully uninstalled

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_uninstallFilter","params":["0x70355a0b574b437eaa19fe95adfedc0a"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_uninstallFilter",
  "params": ["0x70355a0b574b437eaa19fe95adfedc0a"],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```

</TabItem>

</Tabs>

## `MINER` methods

The `MINER` API methods allow you to control the node's mining operation, or settings related to
block creation in general. 

:::note

The `MINER` API methods are not enabled by default for JSON-RPC. To enable the `MINER` API methods, use the [`--rpc-http-api`](../cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../cli/options.md#rpc-ws-api) options.

:::

### `miner_changeTargetGasLimit`

Updates the target gas limit set using the [`--target-gas-limit`](../cli/options.md#target-gas-limit) command line option.

#### Parameters

`gasPrice`: _number_ - target gas price in wei

#### Returns

`result`: _string_ - `Success` or `error`

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"miner_changeTargetGasLimit","params":[800000], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "miner_changeTargetGasLimit",
  "params": [800000],
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

### `miner_getExtraData`

Retrieves the current extra data field that is used when producing blocks.

#### Parameters

None

#### Returns

`result`: _string_ - Hexadecimal string representation of the extra data bytes.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"miner_getExtraData","params":[], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "miner_getExtraData",
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
  "result": "0x68656c6c6f20776f726c64"
}
```

</TabItem>

</Tabs>

### `miner_getMinGasPrice`

Gets the minimum gas price (in wei) offered by a transaction to be included in a block.
The initial value is set using the [`--min-gas-price`](../cli/options.md#min-gas-price) command line
option, or is set to `1000` if the command line option is not specified.
Use [`miner_setMinGasPrice`](#miner_setmingasprice) to change the current value of the gas price.

#### Parameters

None

#### Returns

`result`: _string_ - Minimum gas price (in wei) as a hexadecimal string

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"miner_getMinGasPrice","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "miner_getMinGasPrice",
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
  "result": "0x3e8"
}
```
</TabItem>

</Tabs>

### `miner_getMinPriorityFee`

Gets the minimum priority fee per gas (in wei) offered by a transaction to be included in a block. The initial value is set using the [`--min-priority-fee`](../cli/options.md#min-priority-fee) command line option, or is set to `0` if the command line option is not specified.
Use [`miner_setMinPriorityFee`](#miner_setminpriorityfee) to change the current value of the fee.

#### Parameters

None

#### Returns

`result`: _string_ - Minimum priority fee per gas (in wei) as a hexadecimal string

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"miner_getMinPriorityFee","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "miner_getMinPriorityFee",
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
  "result": "0x1"
}
```
</TabItem>

</Tabs>


### `miner_setExtraData`

Sets a new value for the extra data field that is used when producing blocks.

#### Parameters

`extraData`: _string_ - Hexadecimal representation of the extra data field, with a maximum of 32 bytes.

#### Returns

`result`: _string_ - `true` or `false`

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"miner_setExtraData","params":["0x0010203"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "miner_setExtraData",
  "params": ["0x0010203"],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "params": ["0x0010203"],
  "id": 1,
  "result": "true"
}
```

</TabItem>

</Tabs>

### `miner_setMinGasPrice`

Sets the minimum gas price (in wei) offered by a transaction to be included in a block.
The initial value is set using the [`--min-gas-price`](../cli/options.md#min-gas-price) command line
option, or is set to `1000` if the command line option is not specified.
Use [`miner_getMinGasPrice`](#miner_getmingasprice) to get the current value of the gas price.

#### Parameters

`minGasPrice`: _string_ - Minimum gas price in hexadecimal

#### Returns

`result`: _boolean_ - `true` when the gas price is set

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"miner_setMinGasPrice","params":["0x5dc"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "miner_setMinGasPrice",
  "params": ["0x5dc"],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```

</TabItem>

</Tabs>

### `miner_setMinPriorityFee`

Sets the minimum priority fee per gas (in wei) offered by a transaction to be included in a block. 
The initial value is set using the [`--min-priority-fee`](../cli/options.md#min-priority-fee) command line option, or is set to `0` if the command line option is not specified.
Use [`miner_getMinPriorityFee`](#miner_getminpriorityfee) to get the current value of the fee.

#### Parameters

`minPriorityFeePerGas`: _string_ - Minimum priority fee per gas in hexadecimal

#### Returns

`result`: _boolean_ - `true` when the fee is set

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"miner_setMinPriorityFee","params":["0x0a"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "miner_setMinPriorityFee",
  "params": ["0x0a"],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```

</TabItem>

</Tabs>

## `NET` methods

The `NET` API methods provide network-related information.

### `net_enode`

Returns the [enode URL](../../concepts/node-keys.md#enode-url).

#### Parameters

None

#### Returns

`result`: _string_ - [enode URL](../../concepts/node-keys.md#enode-url) of the node

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"net_enode","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"net_enode","params":[],"id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "enode://6a63160d0ccef5e4986d270937c6c8d60a9a4d3b25471cda960900d037c61988ea14da67f69dbfb3497c465d0de1f001bb95598f74b68a39a5156a608c42fa1b@127.0.0.1:30303"
}
```

</TabItem>

</Tabs>

### `net_listening`

Whether the client is actively listening for network connections.

#### Parameters

None

#### Returns

`result`: _boolean_ - indicates if the client is actively listening for network connections

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"net_listening","params":[],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"net_listening","params":[],"id":53}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": true
}
```

</TabItem>

</Tabs>

### `net_peerCount`

Returns the number of peers currently connected to the client.

#### Parameters

None

#### Returns

`result`: _string_ - number of connected peers in hexadecimal

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "net_peerCount", "params": [], "id": 53 }
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": "0x5"
}
```

</TabItem>

</Tabs>

### `net_services`

Returns enabled services (for example, `jsonrpc`) and the host and port for each service.

:::note

The [`--nat-method`](../cli/options.md#nat-method) setting affects the JSON-RPC and P2P host and port values, but not the metrics host and port values.

:::

#### Parameters

None

#### Returns

`result`: _object_ - enabled services

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"net_services","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"net_services","params":[],"id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "jsonrpc": {
      "host": "127.0.0.1",
      "port": "8545"
    },
    "p2p": {
      "host": "127.0.0.1",
      "port": "30303"
    },
    "metrics": {
      "host": "127.0.0.1",
      "port": "9545"
    }
  }
}
```

</TabItem>

</Tabs>

### `net_version`

Returns the [network ID](../../concepts/network-and-chain-id.md).

#### Parameters

None

#### Returns

`result`: _string_ - current network ID
 
| Network ID | Chain  | Network | Description                   |
| ---------- | -------| ------- | ----------------------------- |
| `1`        | ETH    | Mainnet | Main Ethereum network         |
| `560048`   | ETH    | Hoodi   | Ethereum PoS test network     |
| `11155111` | ETH    | Sepolia | Ethereum PoS test network     |
| `2018`     | ETH    | Dev     | Ethereum PoW development network|
| `59144`    | Linea  | Mainnet | Main Linea network            |
| `59141`    | Linea  | Testnet | Linea Sepolia testnet         |
| `4201`     | Lukso  | Mainnet | Main Lukso network            |

:::note

For almost all networks, network ID and chain ID are the same. For Ephemery, the network ID is dynamic.

:::

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "net_version", "params": [], "id": 53 }
```

</TabItem>

<TabItem value="JSON result for Mainnet" label="JSON result for Mainnet">

```json
{
  "jsonrpc": "2.0",
  "id": 51,
  "result": "1"
}
```

</TabItem>

</Tabs>

## `PLUGINS` methods

The `PLUGINS` API methods provide plugin-related functionality.

:::note

The `PLUGINS` API methods are not enabled by default for JSON-RPC. To enable the `PLUGINS` API methods, 
use the [`--rpc-http-api`](../cli/options.md#rpc-http-api) or 
[`--rpc-ws-api`](../cli/options.md#rpc-ws-api) options.

:::

### `plugins_reloadPluginConfig`

When you call this method without parameters, all plugins are reloaded. If you specify names, only 
those plugins are reloaded. This method awaits all reloads before returning its result. 

#### Parameters

- `plugin`: _string_ - (optional) plugin name

#### Returns

`result`: _string_ - `Success`

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"plugins_reloadPluginConfig","params":["tech.pegasys.plus.plugin.kafka.KafkaPlugin"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "plugins_reloadPluginConfig",
  "params": ["tech.pegasys.plus.plugin.kafka.KafkaPlugin"],
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

:::note

If one or more plugins fail, the error response provides a comma-separated list of `pluginName`:success or 
`pluginName`:failure (reason).

:::

</TabItem>

</Tabs>

## `TRACE` methods

The `TRACE` API is a more concise alternative to the [`DEBUG` API](#debug-methods).

:::note

The `TRACE` API methods are not enabled by default for JSON-RPC. To enable the `TRACE` API methods, use the [`--rpc-http-api`](../cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../cli/options.md#rpc-ws-api) options.

:::

### `trace_block`

Provides transaction processing of [type `trace`](../trace-types.md#trace) for the specified block.

:::info note
Your node must be an [archive node](../../concepts/node-sync.md#archive-nodes), or
the requested block must be within the number of
[blocks retained](../cli/options.md#bonsai-historical-block-limit) when using
[Bonsai](../../concepts/data-storage-formats.md#bonsai-tries) (by default, 512 from the head of the chain).
:::

#### Parameters

`blockNumber`: _string_ - hexadecimal integer representing a block number, or one of
the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
[block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

:::note
`pending` returns the same value as `latest`.
:::

#### Returns

`result`: _array_ of _objects_ - list of [calls to other contracts](../trace-types.md#trace) containing one object per call, in transaction execution order; if revert reason is enabled with [`--revert-reason-enabled`](../cli/options.md#revert-reason-enabled), the returned list items include the [revert reason](../../../private-networks/how-to/send-transactions/revert-reason.md).

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"trace_block","params":["0x6"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "trace_block", "params": ["0x6"], "id": 1 }
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "result": [
    {
      "action": {
        "callType": "call",
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "gas": "0xffad82",
        "input": "0x0000000000000000000000000000000000000999",
        "to": "0x0020000000000000000000000000000000000000",
        "value": "0x0"
      },
      "blockHash": "0x71512d31e18f828cef069a87bc2c7514a8ca334f9ee72625efdf5cc2d43768dd",
      "blockNumber": 6,
      "result": {
        "gasUsed": "0x7536",
        "output": "0x"
      },
      "subtraces": 1,
      "traceAddress": [],
      "transactionHash": "0x91eeabc671e2dd2b1c8ddebb46ba59e8cb3e7d189f80bcc868a9787728c6e59e",
      "transactionPosition": 0,
      "type": "call"
    },
    {
      "action": {
        "address": "0x0020000000000000000000000000000000000000",
        "balance": "0x300",
        "refundAddress": "0x0000000000000999000000000000000000000000"
      },
      "blockHash": "0x71512d31e18f828cef069a87bc2c7514a8ca334f9ee72625efdf5cc2d43768dd",
      "blockNumber": 6,
      "result": null,
      "subtraces": 0,
      "traceAddress": [0],
      "transactionHash": "0x91eeabc671e2dd2b1c8ddebb46ba59e8cb3e7d189f80bcc868a9787728c6e59e",
      "transactionPosition": 0,
      "type": "suicide"
    },
    {
      "action": {
        "author": "0x0000000000000000000000000000000000000000",
        "rewardType": "block",
        "value": "0x1bc16d674ec80000"
      },
      "blockHash": "0x71512d31e18f828cef069a87bc2c7514a8ca334f9ee72625efdf5cc2d43768dd",
      "blockNumber": 6,
      "result": null,
      "subtraces": 0,
      "traceAddress": [],
      "transactionHash": null,
      "transactionPosition": null,
      "type": "reward"
    }
  ],
  "id": 1
}
```

</TabItem>

</Tabs>

### `trace_call`

Executes the given call and returns a number of possible traces for it.

:::info note
When using [Bonsai](../../concepts/data-storage-formats.md#bonsai-tries), the requested block must
be within the number of [blocks retained](../cli/options.md#bonsai-historical-block-limit) (by
default, 512 from the head of the chain).
:::

#### Parameters

- `call`: _object_ - [transaction call object](objects.md#transaction-call-object)

- `blockNumber`: _string_ - hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

  :::note
  `pending` returns the same value as `latest`.
  :::

- `options`: _array_ of _strings_ - list of tracing options; tracing options are [`trace`, `vmTrace`, and `stateDiff`](../trace-types.md). Specify any combination of the three options including none of them.

#### Returns

`result`: _array_ of _objects_ - list of [calls to other contracts](../trace-types.md#trace) containing one object per call, in transaction execution order

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"trace_call","params":[{"from":"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73","to":"0x0010000000000000000000000000000000000000","gas":"0xfffff2","gasPrice":"0xef","value":"0x0","data":"0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002","nonce":"0x0"},["trace"],"latest"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "trace_call",
  "params": [
    {
      "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
      "to": "0x0010000000000000000000000000000000000000",
      "gas": "0xfffff2",
      "gasPrice": "0xef",
      "value": "0x0",
      "data": "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002",
      "nonce": "0x0"
    },
    ["trace"],
    "latest"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
    "jsonrpc": "2.0",
    "result": {
      "output" : "0x",
      "stateDiff" : null,
      "trace" : [ {
        "action" : {
          "callType" : "call",
          "from" : "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
          "gas" : "0xffabba",
          "input" : "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002",
          "to" : "0x0010000000000000000000000000000000000000",
          "value" : "0x0"
      },
      "result" : {
        "gasUsed" : "0x9c58",
        "output" : "0x"
      },
      "subtraces" : 0,
      "traceAddress" : [ ],
      "type" : "call"
    } ],
    "vmTrace" : null
    },
"id" : 2
},
```

</TabItem>

</Tabs>

### `trace_callMany`

Performs multiple call traces on top of the same block. You can trace dependent transactions.

:::info note
When using [Bonsai](../../concepts/data-storage-formats.md#bonsai-tries), the requested block must
be within the number of [blocks retained](../cli/options.md#bonsai-historical-block-limit) (by
default, 512 from the head of the chain).
:::

#### Parameters

- `options`: _array_ of _strings_ - list of tracing options; tracing options are [`trace`, `vmTrace`, and `stateDiff`](../trace-types.md). Specify any combination of the three options including none of them.

- `blockNumber`: _string_ - hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

  :::note
  `pending` returns the same value as `latest`.
  :::

#### Returns

`result`: _array_ of _objects_ - list of [calls to other contracts](../trace-types.md#trace) containing one object per call, in transaction execution order

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"trace_callMany","params":[[[{"from":"0x407d73d8a49eeb85d32cf465507dd71d507100c1","to":"0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b","value":"0x186a0"},["trace"]],[{"from":"0x407d73d8a49eeb85d32cf465507dd71d507100c1","to":"0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b","value":"0x186a0"},["trace"]]],"latest"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{"jsonrpc":"2.0","method":"trace_callMany","params":[[[{"from":"0x407d73d8a49eeb85d32cf465507dd71d507100c1","to":"0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b","value":"0x186a0"},["trace"]],[{"from":"0x407d73d8a49eeb85d32cf465507dd71d507100c1","to":"0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b","value":"0x186a0"},["trace"]]],"latest"],"latest"],"id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
    "jsonrpc": "2.0",
    "result": [
      {
      "output" : "0x",
      "stateDiff" : null,
      "trace" : [ {
        "action" : {
          "callType" : "call",
          "from" : "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
          "gas" : "0x1dcd12f8",
          "input" : "0x",
          "to" : "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
          "value" : "0x186a0"
      },
      "result" : {
        "gasUsed" : "0x0",
        "output" : "0x"
      },
      "subtraces" : 0,
      "traceAddress" : [ ],
      "type" : "call"
    } ],
    "vmTrace" : null
    },
    {
      "output" : "0x",
      "stateDiff" : null,
      "trace" : [ {
        "action" : {
          "callType" : "call",
          "from" : "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
          "gas" : "0x1dcd12f8",
          "input" : "0x",
          "to" : "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
          "value" : "0x186a0"
      },
      "result" : {
        "gasUsed" : "0x0",
        "output" : "0x"
      },
      "subtraces" : 0,
      "traceAddress" : [ ],
      "type" : "call"
    } ],
    "vmTrace" : null
    },
  ],
"id" : 1
},
```

</TabItem>

</Tabs>

### `trace_filter`

Returns traces matching the specified filter. The maximum number of blocks you can supply to `trace_filter` is 1000 by default. You can adjust this limit using the [`--rpc-max-trace-filter-range`](../cli/options.md#rpc-max-trace-filter-range) option. 

:::info note
Your node must be an [archive node](../../concepts/node-sync.md#archive-nodes), or
the requested blocks must be within the number of
[blocks retained](../cli/options.md#bonsai-historical-block-limit) when using
[Bonsai](../../concepts/data-storage-formats.md#bonsai-tries) (by default, 512 from the head of the chain).
:::

#### Parameters

`traceFilterOptions`: _object_ - [trace filter options object](objects.md#trace-filter-options-object)

#### Returns

`result`: _array_ of _objects_ - list of [calls to other contracts](../trace-types.md#trace) containing one object per call, in transaction execution order

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"trace_filter","params":[{"fromBlock":"0x1","toBlock":"0x21","after":2,"count":2,"fromAddress":["0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"]}],"id":415}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "trace_filter",
  "params": [
    {
      "fromBlock": "0x1",
      "toBlock": "0x21",
      "after": 2,
      "count": 2,
      "fromAddress": ["0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"]
    }
  ],
  "id": 415
}
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "result": [
    {
      "action": {
        "callType": "call",
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "gas": "0xffad82",
        "input": "0x0000000000000000000000000000000000000999",
        "to": "0x0020000000000000000000000000000000000000",
        "value": "0x0"
      },
      "blockHash": "0xcd5d9c7acdcbd3fb4b24a39e05a38e32235751bb0c9e4f1aa16dc598a2c2a9e4",
      "blockNumber": 6,
      "result": {
        "gasUsed": "0x7536",
        "output": "0x"
      },
      "subtraces": 1,
      "traceAddress": [],
      "transactionHash": "0x91eeabc671e2dd2b1c8ddebb46ba59e8cb3e7d189f80bcc868a9787728c6e59e",
      "transactionPosition": 0,
      "type": "call"
    },
    {
      "action": {
        "callType": "call",
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "gas": "0xffad52",
        "input": "0xf000000000000000000000000000000000000000000000000000000000000001",
        "to": "0x0030000000000000000000000000000000000000",
        "value": "0x0"
      },
      "blockHash": "0xeed85fe57db751442c826cfe4fdf43b10a5c2bc8b6fd3a8ccced48eb3fb35885",
      "blockNumber": 7,
      "result": {
        "gasUsed": "0x1b",
        "output": "0xf000000000000000000000000000000000000000000000000000000000000002"
      },
      "subtraces": 0,
      "traceAddress": [],
      "transactionHash": "0x47f4d445ea1812cb1ddd3464ab23d2bfc6ed408a8a9db1c497f94e8e06e85286",
      "transactionPosition": 0,
      "type": "call"
    }
  ],
  "id": 415
}
```

</TabItem>
</Tabs>

### `trace_get`

Returns a trace at the given position.

:::info note
Your node must be an [archive node](../../concepts/node-sync.md#archive-nodes), or
the requested transaction must be contained in a block within the number of
[blocks retained](../cli/options.md#bonsai-historical-block-limit) when using
[Bonsai](../../concepts/data-storage-formats.md#bonsai-tries) (by default, 512 from the head of the chain).
:::

#### Parameters

- `transaction`: _string_ - transaction hash

- `indexPositions`: _array_ - Index positions of the traces

#### Returns

`result`: _array_ of _objects_ - list of [calls to other contracts](../trace-types.md#trace) containing one object per call, in the order called by the transaction

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"trace_get","params":["0x17104ac9d3312d8c136b7f44d4b8b47852618065ebfa534bd2d3b5ef218ca1f3",["0x0"]],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "trace_get",
  "params": [
    "0x17104ac9d3312d8c136b7f44d4b8b47852618065ebfa534bd2d3b5ef218ca1f3",
    ["0x0"]
  ],
  "id": 1
}
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
    "jsonrpc": "2.0",
    "result": {
      "action" : {
        "callType" : "call",
        "from" : "0x1c39ba39e4735cb65978d4db400ddd70a72dc750",
        "gas" : "0x13e99",
        "input" : "0x16c72721",
        "to" : "0x2bd2326c993dfaef84f696526064ff22eba5b362",
        "value" : "0x0"
      },
      "blockHash" : "0x7eb25504e4c202cf3d62fd585d3e238f592c780cca82dacb2ed3cb5b38883add"
      "blockNumber": 3068185,
      "result": {
        "gasUsed": "0x183",
        "output" : "0x0000000000000000000000000000000000000000000000000000000000000001"
      },
      "subtraces" : 0,
      "traceAddress" : [
        0
      ],
      "transactionHash": "0x17104ac9d3312d8c136b7f44d4b8b47852618065ebfa534bd2d3b5ef218ca1f3",
      "transactionPosition": 2,
      "type" : "call"
    },
"id" : 1
},
```

</TabItem>
</Tabs>

### `trace_rawTransaction`

Traces a call to `eth_sendRawTransaction` without making the call, returning the traces.

:::info note
When using [Bonsai](../../concepts/data-storage-formats.md#bonsai-tries), the requested transaction
must be contained in a block within the number of
[blocks retained](../cli/options.md#bonsai-historical-block-limit) (by default, 512 from the head of
the chain).
:::

#### Parameters

- `data` - _string_ - Raw transaction data

- `options`: _array_ of _strings_ - list of tracing options; tracing options are [`trace`, `vmTrace`, and `stateDiff`](../trace-types.md). Specify any combination of the three options including none of them.

#### Returns

`result`: _array_ of _objects_ - list of [calls to other contracts](../trace-types.md#trace) containing one object per call, in the order called by the transaction

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"trace_rawTransaction","params":["0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",["trace"]],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "trace_rawTransaction",
  "params": [
    "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
    ["trace"]
  ],
  "id": 1
}
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
    "jsonrpc": "2.0",
    "result": {
      "output" : "0x"
      "stateDiff": null,
      "from" : "0x1c39ba39e4735cb65978d4db400ddd70a72dc750",
      "trace": [{
        "action": { ... },
        "result": {
          "gasUsed": "0x0",
          "output": "0x"
        }
      "subtraces": 0,
      "traceAddress": [],
      "type": "call"
    }],
    "vmTrace": null
    },
"id" : 1
},
```

</TabItem>
</Tabs>

### `trace_replayBlockTransactions`

Provides transaction processing tracing per block.

:::info note
When using [Bonsai](../../concepts/data-storage-formats.md#bonsai-tries), the requested block must
be within the number of [blocks retained](../cli/options.md#bonsai-historical-block-limit) (by
default, 512 from the head of the chain).
:::

#### Parameters

- `blockNumber`: _string_ - hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter)

  :::note
  `pending` returns the same value as `latest`.
  :::

- `options`: _array_ of _strings_ - list of tracing options; tracing options are [`trace`, `vmTrace`, and `stateDiff`](../trace-types.md). Specify any combination of the three options including none of them.

#### Returns

`result`: _array_ of _objects_ - list of [transaction trace objects](objects.md#transaction-trace-object) containing one object per transaction, in transaction execution order; if revert reason is enabled with [`--revert-reason-enabled`](../cli/options.md#revert-reason-enabled), the [`trace`](../trace-types.md#trace) list items in the returned transaction trace object include the [revert reason](../../../private-networks/how-to/send-transactions/revert-reason.md).

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc": "2.0", "method": "trace_replayBlockTransactions","params": ["0x12",["trace","vmTrace","stateDiff"]],"id": 1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "trace_replayBlockTransactions",
  "params": ["0x12", ["trace", "vmTrace", "stateDiff"]],
  "id": 1
}
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result":[
      {
        "output":"0x",
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
        },
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
        ],
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
        },
        "transactionHash":"0x2a5079cc535c429f668f13a7fb9a28bdba6831b5462bd04f781777b332a8fcbd",
      },
      {...}
    ]
}
```

</TabItem>
</Tabs>

### `trace_transaction`

Provides transaction processing of [type `trace`](../trace-types.md#trace) for the specified transaction.

:::info note
Your node must be an [archive node](../../concepts/node-sync.md#archive-nodes), or
the requested transaction must be contained in a block within the number of
[blocks retained](../cli/options.md#bonsai-historical-block-limit) when using
[Bonsai](../../concepts/data-storage-formats.md#bonsai-tries) (by default, 512 from the head of the chain).
:::

#### Parameters

`transaction`: _string_ - transaction hash

#### Returns

`result`: _array_ of _objects_ - list of [calls to other contracts](../trace-types.md#trace) containing one object per call, in the order called by the transaction; if revert reason is enabled with [`--revert-reason-enabled`](../cli/options.md#revert-reason-enabled), the returned list items include the [revert reason](../../../private-networks/how-to/send-transactions/revert-reason.md).

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc": "2.0", "method": "trace_transaction","params": ["0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7"],"id": 1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "trace_transaction",
  "params": [
    "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7"
  ],
  "id": 1
}
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "result": [
    {
      "action": {
        "creationMethod": "create",
        "from": "0x627306090abab3a6e1400e9345bc60c78a8bef57",
        "gas": "0xff2e26",
        "init": "0x60006000600060006000732c2b9c9a4a25e24b174f26114e8926a9f2128fe45af2600060006000600060007300a00000000000000000000000000000000000005af2",
        "value": "0x0"
      },
      "blockHash": "0x7e9a993adc6f043c0a9b6a385e6ed3fa370586c55823251b8fa7033cf89d414e",
      "blockNumber": 19,
      "result": {
        "address": "0x30753e4a8aad7f8597332e813735def5dd395028",
        "code": "0x",
        "gasUsed": "0x1c39"
      },
      "subtraces": 2,
      "traceAddress": [],
      "transactionHash": "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7",
      "transactionPosition": 3,
      "type": "create"
    },
    {
      "action": {
        "callType": "callcode",
        "from": "0x30753e4a8aad7f8597332e813735def5dd395028",
        "gas": "0xfb2ea9",
        "input": "0x",
        "to": "0x2c2b9c9a4a25e24b174f26114e8926a9f2128fe4",
        "value": "0x0"
      },
      "blockHash": "0x7e9a993adc6f043c0a9b6a385e6ed3fa370586c55823251b8fa7033cf89d414e",
      "blockNumber": 19,
      "result": {
        "gasUsed": "0x138e",
        "output": "0x"
      },
      "subtraces": 1,
      "traceAddress": [0],
      "transactionHash": "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7",
      "transactionPosition": 3,
      "type": "call"
    },
    {
      "action": {
        "address": "0x30753e4a8aad7f8597332e813735def5dd395028",
        "balance": "0x0",
        "refundAddress": "0x0000000000000000000000000000000000000000"
      },
      "blockHash": "0x7e9a993adc6f043c0a9b6a385e6ed3fa370586c55823251b8fa7033cf89d414e",
      "blockNumber": 19,
      "result": null,
      "subtraces": 0,
      "traceAddress": [0, 0],
      "transactionHash": "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7",
      "transactionPosition": 3,
      "type": "suicide"
    },
    {
      "action": {
        "callType": "callcode",
        "from": "0x30753e4a8aad7f8597332e813735def5dd395028",
        "gas": "0xfb18a5",
        "input": "0x",
        "to": "0x00a0000000000000000000000000000000000000",
        "value": "0x0"
      },
      "blockHash": "0x7e9a993adc6f043c0a9b6a385e6ed3fa370586c55823251b8fa7033cf89d414e",
      "blockNumber": 19,
      "result": {
        "gasUsed": "0x30b",
        "output": "0x"
      },
      "subtraces": 0,
      "traceAddress": [1],
      "transactionHash": "0x4c253746668dca6ac3f7b9bc18248b558a95b5fc881d140872c2dff984d344a7",
      "transactionPosition": 3,
      "type": "call"
    }
  ],
  "id": 1
}
```

</TabItem>
</Tabs>

## `TXPOOL` methods

The `TXPOOL` API methods allow you to inspect the contents of the transaction pool.

:::note

The `TXPOOL` API methods are not enabled by default for JSON-RPC. To enable the `TXPOOL` API methods, use the [`--rpc-http-api`](../cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../cli/options.md#rpc-ws-api) options.

:::

### `txpool_besuPendingTransactions`

Lists pending transactions that match the supplied filter conditions.

#### Parameters

- `numResults`: _number_ - integer representing the maximum number of results to return

- `fields`: _object_ - object of fields used to create the filter condition

Each field in the object corresponds to a field name containing an operator, and a value for the operator. A field name can only be specified once, and can only contain one operator. For example, you cannot query transactions with a gas price between 8 and 9 Gwei by using both the `gt` and `lt` operator in the same field name instance.

All filters must be satisfied for a transaction to be returned.

| Field name | Value | Value type | Supported operators |
| --- | --- | :-: | --- |
| `from` | Address of the sender. | _Data_, 20&nbsp;bytes | `eq` |
| `to` | Address of the receiver, or `"contract_creation"`. | _Data_, 20&nbsp;bytes | `eq`, `action` |
| `gas` | Gas provided by the sender. | _Quantity_ | `eq`, `gt`, `lt` |
| `gasPrice` | Gas price, in wei, provided by the sender. | _Quantity_ | `eq`, `gt`, `lt` |
| `value` | Value transferred, in wei. | _Quantity_ | `eq`, `gt`, `lt` |
| `nonce` | Number of transactions made by the sender. | _Quantity_ | `eq`, `gt`, `lt` |

Supported operators:

- `eq` (equal to)

- `lt` (less than)

- `gt` (greater than)

- `action`

:::note

The only supported `action` is `"contract_creation"`.

:::

#### Returns

`result`: _array_ of _objects_ - list of objects with [details of the pending transaction](objects.md#pending-transaction-object)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"txpool_besuPendingTransactions","params":[2,{"from":{"eq":"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"},"gas":{"lt":"0x5209"},"nonce":{"gt":"0x1"}}],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "txpool_besuPendingTransactions",
  "params": [
    2,
    {
      "from": { "eq": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73" },
      "gas": { "lt": "0x5209" },
      "nonce": { "gt": "0x1" }
    }
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
      "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
      "gas": "0x5208",
      "gasPrice": "0xab5d04c00",
      "hash": "0xb7b2f4306c1c228ec94043da73b582594007091a7dfe024b1f8d6d772284e54b",
      "input": "0x",
      "nonce": "0x2",
      "to": "0xf8be4ebda7f62d79a665294ec1263bfdb59aabf2",
      "value": "0x0",
      "v": "0xfe8",
      "r": "0x5beb711e652c6cf0a589d3cea904eefc4f45ce4372652288701d08cc4412086d",
      "s": "0x3af14a56e63aa5fb7dcb444a89708363a9d2c1eba1f777c67690288415080ded"
    }
  ]
}
```

</TabItem>
</Tabs>

### `txpool_besuStatistics`

Lists statistics about the node transaction pool.

#### Parameters

None

#### Returns

`result`: _object_ - transaction pool statistics object with the following fields:

- `maxSize`: _number_ - maximum number of transactions kept in the transaction pool; use the [`--tx-pool-max-size`](../cli/options.md#tx-pool-max-size) option to configure the maximum size.

- `localCount`: _number_ - number of transactions submitted directly to this node

- `remoteCount`: _number_ - number of transactions received from remote nodes

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"txpool_besuStatistics","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"txpool_besuStatistics","params":[],"id":1}
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "maxSize": 4096,
    "localCount": 1,
    "remoteCount": 0
  }
}
```

</TabItem>
</Tabs>

### `txpool_besuTransactions`

Lists transactions in the node transaction pool.

#### Parameters

None

#### Returns

`result`: _array_ of _objects_ - list of transactions

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"txpool_besuTransactions","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "txpool_besuTransactions", "params": [], "id": 1 }
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "hash": "0x8a66830098be4006a3f63a03b6e9b67aa721e04bd6b46d420b8f1937689fb4f1",
      "isReceivedFromLocalSource": true,
      "addedToPoolAt": "2019-03-21T01:35:50.911Z"
    },
    {
      "hash": "0x41ee803c3987ceb5bcea0fad7a76a8106a2a6dd654409007d9931032ea54579b",
      "isReceivedFromLocalSource": true,
      "addedToPoolAt": "2019-03-21T01:36:00.374Z"
    }
  ]
}
```

</TabItem>
</Tabs>

### `txpool_content`

Returns all pending and queued transactions in the pool, grouped by
sender address and sorted by nonce.

#### Parameters

None

#### Returns

`result`: _object_ - transaction pool content object with the following fields:

- `pending`: _object_ - map of sender addresses to maps of nonces to [transaction objects](objects.md#transaction-object),
  for transactions pending inclusion in the next block

- `queued`: _object_ - map of sender addresses to maps of nonces to [transaction objects](objects.md#transaction-object),
  for transactions scheduled for future execution

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"txpool_content","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "txpool_content", "params": [], "id": 1 }
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "pending": {
      "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73": {
        "6": {
          "blockHash": null,
          "blockNumber": null,
          "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
          "gas": "0x5208",
          "gasPrice": "0xab5d04c00",
          "hash": "0xb7b2f4306c1c228ec94043da73b582594007091a7dfe024b1f8d6d772284e54b",
          "input": "0x",
          "nonce": "0x6",
          "to": "0xf8be4ebda7f62d79a665294ec1263bfdb59aabf2",
          "transactionIndex": null,
          "value": "0xde0b6b3a7640000",
          "v": "0xfe8",
          "r": "0x5beb711e652c6cf0a589d3cea904eefc4f45ce4372652288701d08cc4412086d",
          "s": "0x3af14a56e63aa5fb7dcb444a89708363a9d2c1eba1f777c67690288415080ded"
        }
      }
    },
    "queued": {
      "0x1932c48b2bf8102ba33b4a6b545c32236e342f34": {
        "12": {
          "blockHash": null,
          "blockNumber": null,
          "from": "0x1932c48b2bf8102ba33b4a6b545c32236e342f34",
          "gas": "0x15f90",
          "gasPrice": "0x2cb417800",
          "hash": "0x7b959f5d8d906b74f646b9e6c43d808c3a13f72ae39ee2ca5531f6a83e38e0cf",
          "input": "0x",
          "nonce": "0xc",
          "to": "0x27f1e53f9861ab84aa62a2c8b9f5f0617edddfeb",
          "transactionIndex": null,
          "value": "0x0",
          "v": "0xfe7",
          "r": "0x78c32e3f5bba7cf08b2700c3ca37a2c80d2f073ff9b47f54e31d64e05e0a5b3d",
          "s": "0x517a04dbc67f9de1f76d5e3d3a1b0fda61869b8fad04bef40f07e24e10cbfdee"
        }
      }
    }
  }
}
```

</TabItem>
</Tabs>

### `txpool_contentFrom`

Returns the pending and queued transactions for a given sender address.

#### Parameters

`address`: _string_ - sender address

#### Returns

`result`: _object_ - transaction pool content for the given address:

  - `pending`: _object_ - map of nonces to [transaction objects](objects.md#transaction-object), for pending transactions from the given address

  - `queued`: _object_ - map of nonces to [transaction objects](objects.md#transaction-object) for queued transactions from the given address

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"txpool_contentFrom","params":["0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "txpool_contentFrom",
  "params": ["0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"],
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
    "pending": {
      "0": {
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "gas": "0x5208",
        "gasPrice": "0xab5d04c00",
        "hash": "0xb7b2f4306c1c228ec94043da73b582594007091a7dfe024b1f8d6d772284e54b",
        "input": "0x",
        "nonce": "0x0",
        "to": "0xf8be4ebda7f62d79a665294ec1263bfdb59aabf2",
        "value": "0x0",
        "v": "0xfe8",
        "r": "0x5beb711e652c6cf0a589d3cea904eefc4f45ce4372652288701d08cc4412086d",
        "s": "0x3af14a56e63aa5fb7dcb444a89708363a9d2c1eba1f777c67690288415080ded"
      },
      "1": {
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "gas": "0x5208",
        "gasPrice": "0xab5d04c00",
        "hash": "0x1234abcd5678ef901234abcd5678ef901234abcd5678ef901234abcd5678ef90",
        "input": "0x",
        "nonce": "0x1",
        "to": "0xf8be4ebda7f62d79a665294ec1263bfdb59aabf2",
        "value": "0x0",
        "v": "0xfe8",
        "r": "0x1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "s": "0x2bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
      }
    },
    "queued": {
      "3": {
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "gas": "0x5208",
        "gasPrice": "0xab5d04c00",
        "hash": "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
        "input": "0x",
        "nonce": "0x3",
        "to": "0xf8be4ebda7f62d79a665294ec1263bfdb59aabf2",
        "value": "0x0",
        "v": "0xfe8",
        "r": "0x3ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
        "s": "0x4ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
      }
    }
  }
}
```

</TabItem>
</Tabs>

### `txpool_inspect`

Returns a textual summary of all pending and queued transactions in the pool, grouped by sender
address and sorted by nonce.

The summary is free form, implementation-dependent, and meant to be consumed by humans.
For programmatic access to the transaction pool, use [`txpool_content`](#txpool_content).

#### Parameters

None

#### Returns

`result`: _object_ - transaction pool inspect object with the following fields:

- `pending`: _object_ - map of sender addresses to maps of nonces to human-readable transaction
  summary strings, for transactions pending inclusion in the next block

- `queued`: _object_ - map of sender addresses to maps of nonces to human-readable transaction
  summary strings, for transactions scheduled for future execution

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"txpool_inspect","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "txpool_inspect", "params": [], "id": 1 }
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "pending": {
      "0x67ee9a8c19f7873125a875f61add461b4a505d8c": {
        "5": "{sequence: 68178, addedAt: 1775837774160, isLocal=false, hasPriority=false, score=127, 0xfbee0231c6140f9db3bbcef774b3626556f6f5528a6a49dcd38e1f7f86c79368={MessageCall, 5, 0x67ee9a8c19f7873125a875f61add461b4a505d8c, EIP1559, mf: 300.00 kwei, pf: 300.00 kwei, gl: 70926, v: 0 wei, to: 0xe9f8133e47d42bc9962e469721faaf75e385af31}}",
        "6": "{sequence: 68179, addedAt: 1775837774160, isLocal=false, hasPriority=false, score=127, 0x3474c0582722ed751dba809363f58c8d1acea415831b81bc0b0b9f29afb19c19={MessageCall, 6, 0x67ee9a8c19f7873125a875f61add461b4a505d8c, EIP1559, mf: 2.00 mwei, pf: 2.00 mwei, gl: 90617, v: 0 wei, to: 0x1eb4a2620b909a8838e0e24a8e912bd32f4a47a3}}"
      }
    },
    "queued": {
      "0x5fa84846743cc07ab16106ceabad8e4e0ec1c1b6": {
        "29": "{sequence: 2208499, addedAt: 1775952461706, isLocal=false, hasPriority=false, score=127, 0x2bb5f69f2b9737a99a3674018cd2aac5035b907a753a0c797051bc9df0b2a152={MessageCall, 29, 0x5fa84846743cc07ab16106ceabad8e4e0ec1c1b6, EIP1559, mf: 1.40 gwei, pf: 417.90 mwei, gl: 63209, v: 0 wei, to: 0xdac17f958d2ee523a2206206994597c13d831ec7}}",
        "31": "{sequence: 1766002, addedAt: 1775931135467, isLocal=false, hasPriority=false, score=127, 0xdd250f166c086412fae187ef52dfbe1c4ff9405818781ac50f89d67a77a2d432={MessageCall, 31, 0x5fa84846743cc07ab16106ceabad8e4e0ec1c1b6, EIP1559, mf: 47.74 gwei, pf: 9.28 gwei, gl: 21000, v: 0 wei, to: 0x5fa84846743cc07ab16106ceabad8e4e0ec1c1b6}}"
      }
    }
  }
}
```

</TabItem>
</Tabs>

### `txpool_status`

Returns the number of pending and queued transactions in the pool.

#### Parameters

None

#### Returns

`result`: _object_ - transaction count details:

  - `pending`: _string_ - count of the transactions currently pending for inclusion in the next
    block or blocks

  - `queued`: _string_ - count of the transactions that are scheduled for future execution
    (transactions with nonce gaps)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"txpool_status","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "txpool_status", "params": [], "id": 1 }
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "pending": "0xa",
    "queued": "0x7"
  }
}
```

</TabItem>
</Tabs>

## `WEB3` methods

The `WEB3` API methods provide functionality for the Ethereum ecosystem.

### `web3_clientVersion`

Returns the current client version.

#### Parameters

None

#### Returns

`result`: _string_ - current client version

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{ "jsonrpc": "2.0", "method": "web3_clientVersion", "params": [], "id": 1 }
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": "besu/<version>"
}
```

</TabItem>
</Tabs>

### `web3_sha3`

Returns a [SHA3](https://en.wikipedia.org/wiki/SHA-3) hash of the specified data. The result value is a [Keccak-256](https://keccak.team/keccak.html) hash, not the standardized SHA3-256.

#### Parameters

`data`: _string_ - data to convert to a SHA3 hash

#### Returns

`result`: _string_ - SHA3 result of the input data

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"web3_sha3","params":["0x68656c6c6f20776f726c00"],"id":53}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "web3_sha3",
  "params": ["0x68656c6c6f20776f726c00"],
  "id": 53
}
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": "0x5e39a0a66544c0668bde22d61c47a8710000ece931f13b84d3b2feb44ec96d3f"
}
```

</TabItem>
</Tabs>

## Miscellaneous methods

### `rpc_modules`

Lists [enabled APIs](../../how-to/use-besu-api/json-rpc.md#api-methods-enabled-by-default) and the version of each.

#### Parameters

None

#### Returns

`result`: _map_ of _strings_ to _strings_ - enabled APIs and their versions

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"rpc_modules","params":[],"id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"rpc_modules","params":[],"id":1}
```

</TabItem>
<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "web3": "1.0",
    "eth": "1.0",
    "net": "1.0"
  }
}
```

</TabItem>
</Tabs>

<!-- Links -->

[schema]: https://github.com/hyperledger/besu/blob/750580dcca349d22d024cc14a8171b2fa74b505a/ethereum/api/src/main/resources/schema.graphqls
[eth_sendRawTransaction or eth_call]: ../../how-to/send-transactions.md#eth_call-or-eth_sendrawtransaction
