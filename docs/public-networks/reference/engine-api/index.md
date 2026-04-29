---
title: Engine API
description: Engine API methods reference
toc_max_heading_level: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Engine API methods

[Consensus and execution clients](../../concepts/node-clients.md#execution-and-consensus-clients) communicate with each other using the Engine API. When running Besu as an execution client, [use these API calls](../../how-to/use-engine-api.md) to communicate with a consensus client.

:::info

The engine API is enabled by default.

:::

See the [Ethereum Engine API specification](https://github.com/ethereum/execution-apis/blob/0b965fb714ccd3faa3c939fdce1726e56679cdec/src/engine/specification.md) for more information. Not all changes to the Engine API are documented on this page.

## Methods

### `engine_exchangeCapabilities`

Exchanges a list of supported Engine API methods between the consensus client and Besu.

#### Parameters

`remoteCapabilities`: _array_ of _strings_ - Engine API method names that the consensus client supports

#### Returns

`localCapabilities`: _array_ of _strings_ - Engine API method names that Besu supports

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"engine_exchangeCapabilities","params":[["engine_exchangeTransitionConfigurationV1","engine_forkchoiceUpdatedV1","engine_getPayloadBodiesByHash","engine_getPayloadBodiesByRangeV1","engine_getPayloadV1","engine_newPayloadV1"]],"id":67}' http://127.0.0.1:8550
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "engine_exchangeCapabilities",
  "params": [
    [
      "engine_exchangeTransitionConfigurationV1",
      "engine_forkchoiceUpdatedV1",
      "engine_getPayloadBodiesByHash",
      "engine_getPayloadBodiesByRangeV1",
      "engine_getPayloadV1",
      "engine_newPayloadV1"
    ]
  ],
  "id": 67
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 67,
  "result": [
    "engine_getPayloadV1",
    "engine_getPayloadV2",
    "engine_executePayloadV1",
    "engine_newPayloadV1",
    "engine_newPayloadV2",
    "engine_forkchoiceUpdatedV1",
    "engine_forkchoiceUpdatedV2",
    "engine_exchangeTransitionConfigurationV1",
    "engine_getPayloadBodiesByHashV1",
    "engine_getPayloadBodiesByRangeV1"
  ]
}
```

</TabItem>

</Tabs>

### `engine_exchangeTransitionConfigurationV1`

Sends the transition configuration to the consensus client to verify the configuration between both clients.

:::note

The execution client runs this call every 60 seconds in the background. The log displays a warning message if the call hasn't been sent in 120 seconds.

:::

#### Parameters

`transitionConfiguration`: _object_ - [Transition configuration object](objects.md#transition-configuration-object)

#### Returns

`transitionConfiguration`: _object_ - [Transition configuration object](objects.md#transition-configuration-object)

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"engine_exchangeTransitionConfigurationV1","params":[{"terminalTotalDifficulty": 0, "terminalBlockHash": "0x0000000000000000000000000000000000000000000000000000000000000000", "terminalBlockNumber": "0x1"}],"id":67}' http://127.0.0.1:8550
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "engine_exchangeTransitionConfigurationV1",
  "params": [
    {
      "terminalTotalDifficulty": 0,
      "terminalBlockHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "terminalBlockNumber": "0x1"
    }
  ],
  "id": 67
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 67,
  "result": {
    "terminalTotalDifficulty": 0,
    "terminalBlockHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "terminalBlockNumber": "0x1"
  }
}
```

</TabItem>

</Tabs>

### `engine_forkchoiceUpdatedV1`

Updates the fork choice with the consensus client.

#### Parameters

- `forkchoiceState`: _object_ - [Fork choice state object](objects.md#fork-choice-state-object)

- `payloadAttributes`: _object_ - [Payload attribute object](objects.md#payload-attributes-object). Can be `null`.

#### Returns

- `payloadStatus`: _object_ - [Payload status object](objects.md#payload-status-object)

- `payloadId`: _data_ - identifier of the payload build process or `null`

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"engine_forkchoiceUpdatedV1","params":[{"headBlockHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858", "safeBlockHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858", "finalizedBlockHash": "0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a"},null],"id":67}' http://127.0.0.1:8550
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "engine_forkchoiceUpdatedV1",
  "params": [
    {
      "headBlockHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858",
      "safeBlockHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858",
      "finalizedBlockHash": "0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a"
    },
    null
  ],
  "id": 67
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 67,
  "result": {
    "payloadStatus": {
      "status": "VALID",
      "latestValidHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858",
      "validationError": null
    },
    "payloadId": null
  }
}
```

</TabItem>

</Tabs>

### `engine_getBlobsV1`

Returns the blobs corresponding to the specified blob versioned hashes.

#### Parameters

`versionedHashes`: *array* of *strings* - Array of blob versioned hashes

#### Returns

`engineGetBlobsResultV1`: *array* of *objects* - Array of [blob and proof objects](objects.md#blob-and-proof-object),
items of which can be `null`

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"engine_getBlobsV1","params":[["0x010657f37554c781402a22917dee2f75def7ab966d7b770905398eba3c444014","0x01f3a5c9d8e7b6a4c2d1e0f9b8a7c6d5e4f3a2b1c0d9e8f7b6a5c4d3e2f1a0b9"]],"id":1}' http://127.0.0.1:8550
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "engine_getBlobsV1",
  "params": [
    [
      "0x010657f37554c781402a22917dee2f75def7ab966d7b770905398eba3c444014",
      "0x01f3a5c9d8e7b6a4c2d1e0f9b8a7c6d5e4f3a2b1c0d9e8f7b6a5c4d3e2f1a0b9"
    ]
  ],
  "id": 67
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 67,
  "result": [
    {
      "blob": "0x722662154e6d76b2b2b92e70c0cac3ccf534f9b74eb5b89819ec509083d00a503ae5c198d17634e79059c2cd735491...",
      "proof": "0x80c5f2e1eb23939cf3600f61872e3e9964d0acafb440634e530d6139a193b889c56a0c07d737729dbe0626706fc9f25f"
    },
    null
  ]
}
```

</TabItem>

</Tabs>

### `engine_getPayloadBodiesByHashV1`

Returns the bodies of the execution payloads corresponding to the specified block hashes.

#### Parameters

`blockHashes`: *array* of *strings* - Block hashes

#### Returns

`engineGetPayloadBodiesResultV1`: *array* of *objects* - Execution payload body objects

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"engine_getPayloadBodiesByHashV1","params":[["0xd5f1812548be429cbdc6376b29611fc49e06f1359758c4ceaaa3b393e2239f9c","0xfe88c94d860f01a17f961bf4bdfb6e0c6cd10d3fda5cc861e805ca1240c58553"]],"id":1}' http://127.0.0.1:8550
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "engine_getPayloadBodiesByHashV1",
  "params": [
    [
      "0xd5f1812548be429cbdc6376b29611fc49e06f1359758c4ceaaa3b393e2239f9c",
      "0xfe88c94d860f01a17f961bf4bdfb6e0c6cd10d3fda5cc861e805ca1240c58553"
    ]
  ],
  "id": 67
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
    "jsonrpc": "2.0",
    "id": 67,
    "result": [{
      "transactions": ["0xf865808506fc23ac00830124f8940101010101010101010101010101010101010101018031a02c4d88bfdc2f6dbf82c33d235c4e785e9fc23b2d0fc7b9d20fc5e9674f1f9d15a016d6d69b925cf26128683ab4a096e196fbb1142d6c6d4e8d3481b9bef1bd0f65", "0x02f86c0701843b9aca008506fc23ac00830124f89402020202020202020202020202020202020202020180c080a039409b4e5603dd8c3cf38232348661a8e99ac518396eeaa128ec9ec2a3eb8127a06b21ab956f5f138cb44fda1a9055bd08980ea4f8040d877c00dac025608d0d95", ...],
      "withdrawals": [{
        "index" : "0xf0",
        "validatorIndex" : "0xf0",
        "address" : "0x00000000000000000000000000000000000010f0",
        "amount" : "0x1"
      }, {
        "index" : "0xf1",
        "validatorIndex" : "0xf1",
        "address" : "0x00000000000000000000000000000000000010f1",
        "amount" : "0x1"
      }]
    }, {
      "transactions": ["0xf865108506fc23ac00830124f8940101010101010101010101010101010101010101018031a0d9712a3c40ae85aea4ad1bd95a0b7cc7bd805189a9e2517403b11a00a1530f81a053b53b0267a6dcfe9f9a1652307b396b3e8a65e65707a450e60c92baefdbcfbe", "0x02f86c0711843b9aca008506fc23ac00830124f89402020202020202020202020202020202020202020180c080a071d36bc93c7ae8cc5c01501e51e5e97a51aa541d1a89c809a2af7eb40e9bc2cba071644230e21c075c1da08916aff5efe9f95a6f6a4f94dc217f6c1bb4a3240b29", ...],
      "withdrawals": [{
        "index" : "0xf2",
        "validatorIndex" : "0xf2",
        "address" : "0x00000000000000000000000000000000000010f2",
        "amount" : "0x1"
      }, {
        "index" : "0xf3",
        "validatorIndex" : "0xf3",
        "address" : "0x00000000000000000000000000000000000010f3",
        "amount" : "0x1"
      }]
    }]
}
```

</TabItem>

</Tabs>

### `engine_getPayloadBodiesByRangeV1`

Returns the bodies of the execution payloads corresponding to the specified range of block numbers.

#### Parameters

- `startBlockNumber`: _string_ - Number of the starting block of the range, as a hexadecimal string

- `count`: _string_ - Number of blocks in the range (including the starting block), as a hexadecimal string

#### Returns

`engineGetPayloadBodiesResultV1`: _array_ of _objects_ - Execution payload body objects

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"engine_getPayloadBodiesByRangeV1","params":["0x20", "0x2"],"id":1}' http://127.0.0.1:8550
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "engine_getPayloadBodiesByRangeV1",
  "params": ["0x20", "0x2"],
  "id": 67
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
    "jsonrpc": "2.0",
    "id": 67,
    "result": [{
      "transactions": ["0xf865808506fc23ac00830124f8940101010101010101010101010101010101010101018031a02c4d88bfdc2f6dbf82c33d235c4e785e9fc23b2d0fc7b9d20fc5e9674f1f9d15a016d6d69b925cf26128683ab4a096e196fbb1142d6c6d4e8d3481b9bef1bd0f65", "0x02f86c0701843b9aca008506fc23ac00830124f89402020202020202020202020202020202020202020180c080a039409b4e5603dd8c3cf38232348661a8e99ac518396eeaa128ec9ec2a3eb8127a06b21ab956f5f138cb44fda1a9055bd08980ea4f8040d877c00dac025608d0d95", ...],
      "withdrawals": [{
        "index" : "0xf0",
        "validatorIndex" : "0xf0",
        "address" : "0x00000000000000000000000000000000000010f0",
        "amount" : "0x1"
      }, {
        "index" : "0xf1",
        "validatorIndex" : "0xf1",
        "address" : "0x00000000000000000000000000000000000010f1",
        "amount" : "0x1"
      }]
    }, {
      "transactions": ["0xf865108506fc23ac00830124f8940101010101010101010101010101010101010101018031a0d9712a3c40ae85aea4ad1bd95a0b7cc7bd805189a9e2517403b11a00a1530f81a053b53b0267a6dcfe9f9a1652307b396b3e8a65e65707a450e60c92baefdbcfbe", "0x02f86c0711843b9aca008506fc23ac00830124f89402020202020202020202020202020202020202020180c080a071d36bc93c7ae8cc5c01501e51e5e97a51aa541d1a89c809a2af7eb40e9bc2cba071644230e21c075c1da08916aff5efe9f95a6f6a4f94dc217f6c1bb4a3240b29", ...],
      "withdrawals": [{
        "index" : "0xf2",
        "validatorIndex" : "0xf2",
        "address" : "0x00000000000000000000000000000000000010f2",
        "amount" : "0x1"
      }, {
        "index" : "0xf3",
        "validatorIndex" : "0xf3",
        "address" : "0x00000000000000000000000000000000000010f3",
        "amount" : "0x1"
      }]
    }]
}
```

</TabItem>

</Tabs>

### `engine_getPayloadV1`

Prepares the payload to send to the consensus client.

#### Parameters

`payloadId`: _data_ - Identifier of the payload build process

#### Returns

`executionPayload`: _object_ - [Execution payload object](objects.md#execution-payload-object)

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"engine_getPayloadV1","params":["0x0000000021f32cc1"],"id":1}' http://127.0.0.1:8550
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "engine_getPayloadV1",
  "params": ["0x0000000021f32cc1"],
  "id": 67
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 67,
  "result": {
    "parentHash": "0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a",
    "feeRecipient": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
    "stateRoot": "0xca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45",
    "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "prevRandao": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "blockNumber": "0x1",
    "gasLimit": "0x1c9c380",
    "gasUsed": "0x0",
    "timestamp": "0x5",
    "extraData": "0x",
    "baseFeePerGas": "0x7",
    "blockHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858",
    "transactions": []
  }
}
```

</TabItem>

</Tabs>

### `engine_newPayloadV1`

Executes the payload with the consensus client.

#### Parameters

`executionPayload`: _object_ - [Execution payload object](objects.md#execution-payload-object)

#### Returns

- `payloadStatus`: _object_ - [Payload status object](objects.md#payload-status-object)

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"engine_newPayloadV1","params":[
  {
    "parentHash": "0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a",
    "feeRecipient": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
    "stateRoot": "0xca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45",
    "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "prevRandao": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "blockNumber": "0x1",
    "gasLimit": "0x1c9c380",
    "gasUsed": "0x0",
    "timestamp": "0x5",
    "extraData": "0x",
    "baseFeePerGas": "0x7",
    "blockHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858",
    "transactions": []
  }
],"id":67}' http://127.0.0.1:8550
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "engine_newPayloadV1",
  "params": [
    {
      "parentHash": "0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a",
      "feeRecipient": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
      "stateRoot": "0xca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45",
      "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "prevRandao": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "blockNumber": "0x1",
      "gasLimit": "0x1c9c380",
      "gasUsed": "0x0",
      "timestamp": "0x5",
      "extraData": "0x",
      "baseFeePerGas": "0x7",
      "blockHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858",
      "transactions": []
    }
  ],
  "id": 67
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "status": "VALID",
    "latestValidHash": "0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858",
    "validationError": null
  }
}
```

</TabItem>

</Tabs>
