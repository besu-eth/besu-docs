---
title: Events and logs
sidebar_position: 8
description: Learn about events and logs in Besu.
---

# Events and logs

Transaction mining causes smart contracts to emit events and write logs to the blockchain.

The smart contract address is the link to the logs and the blockchain includes the logs, but contracts cannot access logs. Log storage is cheaper than contract storage (that is, it costs less gas) so storing and accessing the required data in logs reduces the cost. For example, use logs to display all transfers made using a specific contract, but not the current state of the contract.

A Dapp front end can either access logs using the [JSON-RPC API filter methods](../how-to/use-besu-api/access-logs.md) or subscribe to logs using the [RPC Pub/Sub API](../how-to/use-besu-api/rpc-pubsub.md#logs).

Use [`admin_generateLogBloomCache`](../reference/api/index.md#admin_generatelogbloomcache) to improve log retrieval performance.

## Topics

Log entries contain up to four topics. The first topic is the [event signature hash](#event-signature-hash) and up to three topics are the indexed [event parameters](#event-parameters).

```json title="A log entry for an event with one indexed parameter"
{
  "logIndex": "0x0",
  "removed": false,
  "blockNumber": "0x84",
  "blockHash": "0x5fc573d76ec48ec80cbc43f299ebc306a8168112e3a4485c23e84e9a40f5d336",
  "transactionHash": "0xcb52f02342c2498df82c49ac26b2e91e182155c8b2a2add5b6dc4c249511f85a",
  "transactionIndex": "0x0",
  "address": "0x42699a7612a82f1d9c36148af9c77354759b210b",
  "data": "0x",
  "topics": [
    "0x04474795f5b996ff80cb47c148d4c5ccdbe09ef27551820caa9c2f8ed149cce3",
    "0x0000000000000000000000000000000000000000000000000000000000000001"
  ]
}
```

## Event parameters

Up to three event parameters can have the `indexed` attribute. Logs store these indexed parameters as `topics`. Indexed parameters are searchable and filterable.

Topics are 32 bytes. If an indexed argument is an array (including `string` and `byte` datatypes), the log stores the keccak-256 hash of the parameter as a topic.

Log `data` includes non-indexed parameters but is difficult to search or filter.

A Solidity contract storing one indexed and one non-indexed parameter and has an event emitting the value of each parameter:

```solidity
pragma solidity ^0.5.1;
contract Storage {
  uint256 public valueIndexed;
  uint256 public valueNotIndexed;

  event Event1(uint256 indexed valueIndexed, uint256 valueNotIndexed);

  function setValue(uint256 _valueIndexed, uint256 _valueNotIndexed) public {
    valueIndexed = _valueIndexed;
    valueNotIndexed = _valueNotIndexed;
    emit Event1(_valueIndexed, _valueNotIndexed);
  }
}
```

A log entry created by invoking the contract in the previous example with `valueIndexed` set to 5 and `valueNotIndexed` set to 7:

```json
{
  "logIndex": "0x0",
  "removed": false,
  "blockNumber": "0x4d6",
  "blockHash": "0x7d0ac7c12ac9f622d346d444c7e0fa4dda8d4ed90de80d6a28814613a4884a67",
  "transactionHash": "0xe994022ada94371ace00c4e1e20663a01437846ced02f18b3f3afec827002781",
  "transactionIndex": "0x0",
  "address": "0x43d1f9096674b5722d359b6402381816d5b22f28",
  "data": "0x0000000000000000000000000000000000000000000000000000000000000007",
  "topics": [
    "0xd3610b1c54575b7f4f0dc03d210b8ac55624ae007679b7a928a4f25a709331a8",
    "0x0000000000000000000000000000000000000000000000000000000000000005"
  ]
}
```

## Event signature hash

The first topic in a log entry is always the event signature hash. The event signature hash is a keccak-256 hash of the event name and input argument types, with argument names ignored. For example, the event `Hello(uint256 worldId)` has the signature hash `keccak('Hello(uint256)')`. The signature identifies to which event log topics belong.

A Solidity contract with two different events:

```solidity
pragma solidity ^0.5.1;
contract Storage {
  uint256 public valueA;
  uint256 public valueB;

  event Event1(uint256 indexed valueA);
  event Event2(uint256 indexed valueB);

  function setValue(uint256 _valueA) public {
    valueA = _valueA;
    emit Event1(_valueA);
  }

  function setValueAgain(uint256 _valueB) public {
    valueB = _valueB;
    emit Event2(_valueB);
  }
}
```

The event signature hash for event 1 is `keccak('Event1(uint256)')` and the event signature hash for event 2 is `keccak('Event2(uint256)')`. The hashes are:

- `04474795f5b996ff80cb47c148d4c5ccdbe09ef27551820caa9c2f8ed149cce3` for event 1
- `06df6fb2d6d0b17a870decb858cc46bf7b69142ab7b9318f7603ed3fd4ad240e` for event 2.

:::tip

You can use a library keccak (sha3) hash function, such as provided in [Web3.js](https://web3js.readthedocs.io/en/v1.2.11/web3-utils.html?highlight=sha3#sha3), or an online tool, such as https://emn178.github.io/online-tools/keccak_256.html, to generate event signature hashes.

:::

Log entries from invoking the Solidity contract in the previous example:

```json
[
  {
    "logIndex": "0x0",
    "removed": false,
    "blockNumber": "0x84",
    "blockHash": "0x5fc573d76ec48ec80cbc43f299ebc306a8168112e3a4485c23e84e9a40f5d336",
    "transactionHash": "0xcb52f02342c2498df82c49ac26b2e91e182155c8b2a2add5b6dc4c249511f85a",
    "transactionIndex": "0x0",
    "address": "0x42699a7612a82f1d9c36148af9c77354759b210b",
    "data": "0x",
    "topics": [
      "0x04474795f5b996ff80cb47c148d4c5ccdbe09ef27551820caa9c2f8ed149cce3",
      "0x0000000000000000000000000000000000000000000000000000000000000001"
    ]
  },
  {
    "logIndex": "0x0",
    "removed": false,
    "blockNumber": "0x87",
    "blockHash": "0x6643a1e58ad857f727552e4572b837a85b3ca64c4799d085170c707e4dad5255",
    "transactionHash": "0xa95295fcea7df3b9e47ab95d2dadeb868145719ed9cc0e6c757c8a174e1fcb11",
    "transactionIndex": "0x0",
    "address": "0x42699a7612a82f1d9c36148af9c77354759b210b",
    "data": "0x",
    "topics": [
      "0x06df6fb2d6d0b17a870decb858cc46bf7b69142ab7b9318f7603ed3fd4ad240e",
      "0x0000000000000000000000000000000000000000000000000000000000000002"
    ]
  }
]
```

## Topic filters

[Filter options objects](../reference/api/objects.md#filter-options-object) have a `topics` key to filter logs by topics.

Topics are order-dependent. A transaction with a log containing topics `[A, B]` matches with the following topic filters:

- `[]` - Match any topic
- `[A]` - Match A in first position
- `[[null], [B]]` - Match any topic in first position AND B in second position
- `[[A],[B]]` - Match A in first position AND B in second position
- `[[A, C], [B, D]]` - Match (A OR C) in first position AND (B OR D) in second position.

The following filter option object returns log entries for the [Event Parameters example contract](#event-parameters) with `valueIndexed` set to 5 or 9:

```json
{
  "fromBlock": "earliest",
  "toBlock": "latest",
  "address": "0x43d1f9096674b5722d359b6402381816d5b22f28",
  "topics": [
    ["0xd3610b1c54575b7f4f0dc03d210b8ac55624ae007679b7a928a4f25a709331a8"],
    [
      "0x0000000000000000000000000000000000000000000000000000000000000005",
      "0x0000000000000000000000000000000000000000000000000000000000000009"
    ]
  ]
}
```
