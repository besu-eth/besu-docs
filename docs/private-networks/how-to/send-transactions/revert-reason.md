---
title: Include revert reason
description: Including revert reason in transactions with Besu
sidebar_position: 3
---

# Revert reason

In smart contracts, the [`revert`](https://docs.soliditylang.org/en/v0.8.12/control-structures.html#revert) operation triggers an exception to flag an error and revert the current call. The EVM passes back to the client an optional string message containing information about the error.

```sol
pragma solidity ^0.8.4;

contract VendingMachine {
    address owner;
    constructor() {
        owner = msg.sender;
    }
    error Unauthorized();
    function buy(uint amount) public payable {
        if (amount > msg.value / 2 ether)
            revert("Not enough Ether provided.");
        // Alternative way to do it:
        require(
            amount <= msg.value / 2 ether,
            "Not enough Ether provided."
        );
        // Perform the purchase.
    }
    function withdraw() public {
        if (msg.sender != owner)
            revert Unauthorized();

        payable(msg.sender).transfer(address(this).balance);
    }
}
```

## Enable revert reason

Use the [`--revert-reason-enabled`](../../../public-networks/reference/cli/options.md#revert-reason-enabled) command line option to include the revert reason in the transaction receipt and the [`trace`](../../../public-networks/reference/trace-types.md#trace) response in Besu.

:::caution

Enabling revert reason may use a significant amount of memory. We do not recommend enabling revert reason when connected to public Ethereum networks.

:::

## Where the revert reason is included

With revert reason enabled, the transaction receipt returned by [`eth_getTransactionReceipt`](../../../public-networks/reference/api/index.md#eth_gettransactionreceipt) includes the revert reason as an ABI-encoded string.

:::info

The revert reason is not included in the transaction receipt's root hash. Not including the revert reason in the transactions receipt's root hash means the revert reason is only available to nodes that execute the transaction when importing the block. That is, the revert reason is not available if using fast synchronization ([`--sync-mode=FAST`](../../../public-networks/reference/cli/options.md#sync-mode)).

:::

```json title="Example of transaction receipt"
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "blockHash": "0xe7212a92cfb9b06addc80dec2a0dfae9ea94fd344efeb157c41e12994fcad60a",
    "blockNumber": "0x50",
    "contractAddress": null,
    "cumulativeGasUsed": "0x5208",
    "from": "0x627306090abab3a6e1400e9345bc60c78a8bef57",
    "gasUsed": "0x5208",
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "status": "0x1",
    "to": "0xf17f52151ebef6c7334fad080c5704d77216b732",
    "transactionHash": "0xc00e97af59c6f88de163306935f7682af1a34c67245e414537d02e422815efc3",
    "transactionIndex": "0x0",
    "revertReason": "0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001a4e6f7420656e6f7567682045746865722070726f76696465642e000000000000"
  }
}
```

With revert reason enabled, the list items in the [`trace`](../../../public-networks/reference/trace-types.md#trace) response returned by [`trace_replayBlockTransactions`](../../../public-networks/reference/api/index.md#trace_replayblocktransactions), [`trace_block`](../../../public-networks/reference/api/index.md#trace_block), and [`trace_transaction`](../../../public-networks/reference/api/index.md#trace_transaction) include the revert reason as an ABI-encoded string.

```json title="Example of trace response list item"
{
  "jsonrpc": "2.0",
  "id": 415,
  "result": [
    {
      "action": {
        "callType": "call",
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "gas": "0xffadea",
        "input": "0x",
        "to": "0x0110000000000000000000000000000000000000",
        "value": "0x0"
      },
      "blockHash": "0x220bc13dc4f1ed38dcca927a5be15eca16497d279f4c40d7b8fe9704eadf1464",
      "blockNumber": 18,
      "error": "Reverted",
      "revertReason": "0x7d88c1856cc95352",
      "subtraces": 0,
      "traceAddress": [],
      "transactionHash": "0xc388baa0e55e6b73e850b22dc7e9853700f6b995fd55d95dd6ccd5a13d63c566",
      "transactionPosition": 1,
      "type": "call"
    }
  ]
}
```

By default, the error returned by [`eth_estimateGas`](../../../public-networks/reference/api/index.md#eth_estimategas) and [`eth_call`](../../../public-networks/reference/api/index.md#eth_call) includes the revert reason as an ABI-encoded string in the `data` field.

```json title="Example of eth_estimateGas and eth_call error"
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": {
    "code": -32000,
    "message": "Execution reverted: ERC20: transfer amount exceeds balance",
    "data": "0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001a4e6f7420656e6f7567682045746865722070726f76696465642e000000000000"
  }
}
```

## Revert reason format

As described in the [Solidity documentation], the revert reason is an ABI-encoded string consisting of:

```bash
0x08c379a0                                                         // Function selector for Error(string)
0x0000000000000000000000000000000000000000000000000000000000000020 // Data offset
0x000000000000000000000000000000000000000000000000000000000000001a // String length
0x4e6f7420656e6f7567682045746865722070726f76696465642e000000000000 // String data
```

```bash title="Example of revert reason string for 'Not enough Ether provided' "
"0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001a4e6f7420656e6f7567682045746865722070726f76696465642e000000000000"
```

## Dapp support

Client libraries, such as web3j, do not support extracting the revert reason from the transaction receipt. To extract the revert reason your dapp must interact directly with Besu using a custom JSON -> Object converter.

<!-- Links -->

[Solidity documentation]: https://docs.soliditylang.org/en/v0.8.12/control-structures.html#revert
