---
title: ADMIN methods
description: Besu ADMIN JSON-RPC API methods reference
sidebar_label: ADMIN
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `ADMIN` methods

The `ADMIN` API methods provide administrative functionality to manage your node.

:::note

The `ADMIN` API is not enabled by default for JSON-RPC.
Enable it using the [`--rpc-http-api`](../options.md#rpc-http-api) or [`--rpc-ws-api`](../options.md#rpc-ws-api) option.

:::

## `admin_addPeer`

Adds a [static node](../../how-to/connect/static-nodes.md).

:::caution

If connections are timing out, ensure the node ID in the [enode URL](../../concepts/node-keys.md#enode-url) is correct.

:::

### Parameters

- `enode`: _string_ - [Enode URL](../../concepts/node-keys.md#enode-url) of peer to add.

### Returns

- `true` if peer added or `false` if peer is already a [static node](../../how-to/connect/static-nodes.md).

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "admin_addPeer",
    "params": [
      "enode://f59c0ab603377b6ec88b89d5bb41b98fc385030ab1e4b03752db6f7dab364559d92c757c13116ae6408d2d33f0138e7812eb8b696b2a22fe3332c4b5127b22a3@127.0.0.1:30304"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "admin_addPeer",
  "params": [
    "enode://f59c0ab603377b6ec88b89d5bb41b98fc385030ab1e4b03752db6f7dab364559d92c757c13116ae6408d2d33f0138e7812eb8b696b2a22fe3332c4b5127b22a3@127.0.0.1:30304"
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
  "result": true
}
```

</TabItem>

</Tabs>

---

## `admin_changeLogLevel`

Changes the log level without restarting Besu. You can change the log level for all logs, or you can change the log level for specific packages or classes.

You can specify only one log level per RPC call.

### Parameters

- `level`: _string_ - [Log level](../options.md#logging).

- `log_filter`: _array_ - (Optional) Packages or classes for which to change the log level.

### Returns

- `Success` if the log level has changed, otherwise `error`.

### Example

The following example changes the debug level for specified classes to `DEBUG`.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "admin_changeLogLevel",
    "params": [
      "DEBUG",
      [
        "org.hyperledger.besu.ethereum.eth.manager",
        "org.hyperledger.besu.ethereum.p2p.rlpx.connections.netty.ApiHandler"
      ]
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "admin_changeLogLevel",
  "params": [
    "DEBUG",
    [
      "org.hyperledger.besu.ethereum.eth.manager",
      "org.hyperledger.besu.ethereum.p2p.rlpx.connections.netty.ApiHandler"
    ]
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

The following example changes the debug level of all logs to `WARN`.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "admin_changeLogLevel",
    "params": [
      "WARN"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "admin_changeLogLevel",
  "params": [
    "WARN"
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

## `admin_generateLogBloomCache`

Generates cached log bloom indexes for blocks.
API methods such as [`eth_getLogs`](eth/filter.md#eth_getlogs) and [`eth_getFilterLogs`](eth/filter.md#eth_getfilterlogs) use the cache for improved performance.

:::tip

Manually executing `admin_generateLogBloomCache` is not required unless the [`--auto-log-bloom-caching-enabled`](../options.md#auto-log-bloom-caching-enabled) command line option is set to false.

:::

:::note

Each index file contains 100000 blocks. The last fragment of blocks less than 100000 are not indexed.

:::

### Parameters

- `startBlock`: _string_ - Block to start generating indexes.

- `endBlock`: _string_ - Block to stop generating indexes.

### Returns

- Log bloom index details.

  <Fields>

  - `startBlock`: _string_ - Starting block for the last requested cache generation.

  - `endBlock`: _string_ - Ending block for the last requested cache generation.

  - `currentBlock`: _string_ - Most recent block added to the cache.

  - `indexing`: _boolean_ - Indicates if indexing is in progress.

  - `requestAccepted`: _boolean_ - Indicates acceptance of the request from this call to generate the cache.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "admin_generateLogBloomCache",
    "params": [
      "0x0",
      "0x10000"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "admin_generateLogBloomCache",
  "params": [
    "0x0",
    "0x10000"
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

---

## `admin_logsRemoveCache`

Removes cache files for the specified range of blocks.

### Parameters

- `fromBlock`: _string_ - Hexadecimal integer representing a block number, or one of the
  string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter).

- `toBlock`: _string_ - Hexadecimal integer representing a block number, or one of the
  string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../how-to/use-besu-api/json-rpc.md#block-parameter).

:::note
`pending` returns the same value as `latest`.
:::

You can skip a parameter by using an empty string, `""`. If you specify:

- No parameters, the call removes cache files for all blocks.
- Only `fromBlock`, the call removes cache files for the specified block.
- Only `toBlock`, the call removes cache files from the genesis block to the specified block.

### Returns

- `Cache Removed` status or `error`.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "admin_logsRemoveCache",
    "params": [
      "0x1",
      "0x64"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "admin_logsRemoveCache",
  "params": [
    "0x1",
    "0x64"
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
    "Status": "Cache Removed"
  }
}
```

</TabItem>

</Tabs>

---

## `admin_logsRepairCache`

Repairs cached logs by fixing all segments starting with the specified block number.

### Parameters

- `startBlock`: _string_ - Decimal index of the starting block to fix.
  The default is the head block.

### Returns

- Status of the repair request; `Started` or `Already running`.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "admin_logsRepairCache",
    "params": [
      "1200"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "admin_logsRepairCache",
  "params": [
    "1200"
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
    "Status": "Started"
  }
}
```

</TabItem>

</Tabs>

---

## `admin_nodeInfo`

Returns networking information about the node. The information includes general information about the node and specific information from each running Ethereum sub-protocol (for example, `eth`).

### Parameters

- None

### Returns

- Node object.

  <Fields>

  - `id`: _string_ - [Node public key](../../concepts/node-keys.md#node-public-key).

  - `name`: _string_ - Client name.

  - `activeFork`: _string_ - Active EVM hard fork name for the current chain head.

  - `enode`: _string_ - [Enode URL](../../concepts/node-keys.md#enode-url) of the node.

  - `enr`: _string_ - [ENR URL](../../concepts/node-keys.md#enr-url) of the node.

  - `ip`: _string_ - IP address.

  - `ipv6`: _string_ - IPv6 address.

  - `listenAddr`: _string_ - Host and port for the node.

  - `listenAddrV6`: _string_ - IPv6 host and port for the node.

  - `ports`: _object_ - Peer discovery and listening ports.

    <Fields>

    - `discovery`: _number_ - UDP discovery port.

    - `discoveryV6`: _number_ - IPv6 UDP discovery port.

    - `listener`: _number_ - TCP listening port.

    - `listenerV6`: _number_ - IPv6 TCP listening port.

    </Fields>

  - `protocols`: _object_ - List of objects containing information for each Ethereum sub-protocol.

  <br />
  
  :::note

  If the node is running locally, the host of the `enode` and `listenAddr` display as `[::]` in the result. When advertising externally, the external address displayed for the `enode` and `listenAddr` is defined by [`--nat-method`](../../how-to/connect/specify-nat.md).

  :::

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "admin_nodeInfo",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "admin_nodeInfo",
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
    "id": "bdf43211dba30bf100a00040b9f839e17161c88c8573028b8533c8adf8ed1e9466e4b87d716d06292426d154d0df7acde83c3f68df151da5413224b22f049054",
    "name": "besu/v26.3-develop-f2ec0fe/osx-aarch_64/oracle_openjdk-java-22",
    "enode": "enode://87ec35d558352cc55cd1bf6a472557797f91287b78fe5e86760219124563450ad1bb807e4cc61e86c574189a851733227155551a14b9d0e1f62c5e11332a18a3@[::]:30303",
    "enr": "enr:-Jq4QOBEJ_aqkcth60IN44olOQ3uNsfqwEahYc6eKRfBg8ZlGbqhHTKqN_Yr67QWUA9v8_l-iaYhpd2uJC_AEQDv3agCg2V0aMrJhPxk7ASDEYwwgmlkgnY0gmlwhH8AAAGJc2VjcDI1NmsxoQK99DIR26ML8QCgAEC5-DnhcWHIjIVzAouFM8it-O0elIN0Y3CCdl-DdWRwgnZf",
    "ip": "172.28.0.10",
    "ipv6": "fd00:dead:beef:0:0:0:0:10",
    "listenAddr": "172.28.0.10:30303",
    "listenAddrV6": "[fd00:dead:beef:0:0:0:0:10]:30404",
    "ports": {
      "discovery": 30303,
      "discoveryV6": 30404,
      "listener": 30303,
      "listenerV6": 30404
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

---

## `admin_peers`

Returns networking information about connected remote nodes.

### Parameters

- None

### Returns

- List of objects returned for each remote node.

  <Fields>

  - `version`: _string_ - P2P protocol version.

  - `name`: _string_ - Client name.

  - `caps`: _array_ of _strings_ - List of Ethereum sub-protocol capabilities.

  - `network`: _object_ - Local and remote addresses established at time of bonding with the peer (the remote address might not match the hex value for `port`; it depends on which node initiated the connection.)

  - `port`: _string_ - Port on the remote node on which P2P discovery is listening.

  - `id`: _string_ - Node public key (excluding the `0x` prefix, the node public key is the ID in the [enode URL](../../concepts/node-keys.md#enode-url) `enode://<id ex 0x>@<host>:<port>`.)

  - `protocols`: _object_ - [Current state of peer](../../how-to/connect/manage-peers.md#monitor-peer-connections) including `difficulty`, `head`, and `latestBlock` (`head` is the hash of the highest known block for the peer; `latestBlock` is the corresponding block number.)

  - `enode`: _string_ - Enode URL of the remote node.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "admin_peers",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "admin_peers",
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

---

## `admin_removePeer`

Removes a [static node](../../how-to/connect/static-nodes.md).

### Parameters

- `enode`: _string_ - [Enode URL](../../concepts/node-keys.md#enode-url) of peer to remove.

### Returns

- `true` if peer removed or `false` if peer is not a [static node](../../how-to/connect/static-nodes.md).

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "admin_removePeer",
    "params": [
      "enode://f59c0ab603377b6ec88b89d5bb41b98fc385030ab1e4b03752db6f7dab364559d92c757c13116ae6408d2d33f0138e7812eb8b696b2a22fe3332c4b5127b22a3@127.0.0.1:30304"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "admin_removePeer",
  "params": [
    "enode://f59c0ab603377b6ec88b89d5bb41b98fc385030ab1e4b03752db6f7dab364559d92c757c13116ae6408d2d33f0138e7812eb8b696b2a22fe3332c4b5127b22a3@127.0.0.1:30304"
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
  "result": true
}
```

</TabItem>

</Tabs>
