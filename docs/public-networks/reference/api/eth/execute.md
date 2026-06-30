---
title: Execution methods
description: Besu ETH JSON-RPC API execution methods reference
sidebar_label: Execution
sidebar_position: 5
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Execution methods execute calls, create access lists, estimate gas, and simulate transactions without submitting them to the network.

## `eth_call`

Invokes a contract function locally and does not change the state of the blockchain.

You can interact with contracts using [`eth_sendRawTransaction`](submit.md#eth_sendrawtransaction) or `eth_call`.

By default, the `eth_call` error response includes the [revert reason](../../../../private-networks/how-to/send-transactions/revert-reason.md).

### Parameters

- `call`: _object_ - Transaction call object with the following fields:

  :::note
  If you don't want the sender account balance checked, set the gas to zero or specify
  `strict:false`. Otherwise the call may fail if the sender account
  does not have sufficient funds to cover the gas fees.
  :::

  <details>
  <summary>Show `call` fields</summary>

  - `from`: _Data, 20 bytes_ - Address of the sender.

  - `to`: _Data, 20 bytes_ - Address of the action receiver.

  - `gas`: _Quantity, Integer_ - Gas provided by the sender. `eth_call` consumes zero gas, but other executions might need this parameter. `eth_estimateGas` ignores this value.

  - `gasPrice`: _Quantity, Integer_ - Gas price, in Wei, provided by the sender. The default is `0`. Used only in non-[`EIP1559`](../../../concepts/transactions/types.md#eip1559-transactions) transactions.

  - `maxPriorityFeePerGas`: _Quantity, Integer_ - Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Can be used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions). If used, must specify `maxFeePerGas`.

  - `maxFeePerGas`: _Quantity, Integer_ - Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Can be used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions). If used, must specify `maxPriorityFeePerGas`.

  - `maxFeePerBlobGas`: _Quantity, Integer_ - Maximum fee the sender is willing to pay per blob gas. Only used for blob transactions introduced in [EIP-4844]( https://eips.ethereum.org/EIPS/eip-4844).

  - `nonce`: _Quantity, Integer_ - Number of transactions made by the sender before this one. The default is the sender's nonce.

  - `value`: _Quantity, Integer_ - Value transferred, in Wei.

  - `data`: _Data_ - Hash of the method signature and encoded parameters. For details, see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html). Must be equal to `input` if both parameters are provided.

  - `input`: _Data_ - Hash of the method signature and encoded parameters. For details, see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html). Must be equal to `data` if both parameters are provided.

  - `accessList`: _Array_ - List of addresses and storage keys that the transaction plans to access. Used only in non-[`FRONTIER`](../../../concepts/transactions/types.md#frontier-transactions) transactions.

  - `strict`: _Tag_ - Determines if the sender account balance is considered during gas estimation. If `true`, the sender's balance is checked against the transaction's gas parameters. This ensures the estimated gas reflects what the sender can actually afford. If `false`, the balance checks are skipped. The default is `true`.

  - `blobVersionedHashes`: _Array_ - List of references to blobs introduced in [EIP-4844]( https://eips.ethereum.org/EIPS/eip-4844).

  </details>

- `blockNumber` or `blockHash`: _string_ - Hexadecimal integer representing a block number,
  block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as
  described in [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

- `stateOverride`: _object_ - (Optional) The address-to-state mapping.
    Each entry specifies a state that will be temporarily overridden before executing the call.
    This allows you to test, analyze, and debug smart contracts more efficiently by allowing
    temporary state changes without affecting the actual blockchain state, each with the following fields:

  <details>
  <summary>Show `stateOverride` fields</summary>

  - `balance`: _Quantity_ - Temporary account balance for the call execution.

  - `nonce`: _Quantity_ - Temporary nonce value for the call execution.

  - `code`: _Binary_ - Bytecode to inject into the account.

  - `movePrecompileToAddress`: _Data, 20 bytes_ - Address to which the precompile address should be moved.

  - `state`: _Quantity_ - `key:value` pairs to override all slots in the account storage. You cannot set both the `state` and `stateDiff` options simultaneously.

  - `stateDiff`: _Quantity_ - `key:value` pairs to override individual slots in the account storage. You cannot set both the `state` and `stateDiff` options simultaneously.

  </details>

### Returns

- Return value of the executed contract.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [
      {
        "to": "0x69498dd54bd25aa0c886cf1f8b8ae0856d55ff13",
        "value": "0x1"
      },
      "latest"
    ],
    "id": 53
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_call",
  "params": [
    {
      "to": "0x69498dd54bd25aa0c886cf1f8b8ae0856d55ff13",
      "value": "0x1"
    },
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
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{block {number call (data : {from : \"0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b\", to: \"0x69498dd54bd25aa0c886cf1f8b8ae0856d55ff13\", data :\"0x12a7b914\"}){data status}}}"
  }'
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
transaction call object in the `call` parameter, with the following fields:

- `from`: _Data, 20 bytes_ - Address of the sender.

- `to`: _Data, 20 bytes_ - Address of the action receiver.

- `gas`: _Quantity, Integer_ - Gas provided by the sender. `eth_call` consumes zero gas, but other executions might need this parameter. `eth_estimateGas` ignores this value.

- `gasPrice`: _Quantity, Integer_ - Gas price, in Wei, provided by the sender. The default is `0`. Used only in non-[`EIP1559`](../../../concepts/transactions/types.md#eip1559-transactions) transactions.

- `maxPriorityFeePerGas`: _Quantity, Integer_ - Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Can be used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions). If used, must specify `maxFeePerGas`.

- `maxFeePerGas`: _Quantity, Integer_ - Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Can be used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions). If used, must specify `maxPriorityFeePerGas`.

- `maxFeePerBlobGas`: _Quantity, Integer_ - Maximum fee the sender is willing to pay per blob gas. Only used for blob transactions introduced in [EIP-4844]( https://eips.ethereum.org/EIPS/eip-4844).

- `nonce`: _Quantity, Integer_ - Number of transactions made by the sender before this one. The default is the sender's nonce.

- `value`: _Quantity, Integer_ - Value transferred, in Wei.

- `data`: _Data_ - Hash of the method signature and encoded parameters. For details, see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html). Must be equal to `input` if both parameters are provided.

- `input`: _Data_ - Hash of the method signature and encoded parameters. For details, see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html). Must be equal to `data` if both parameters are provided.

- `accessList`: _Array_ - List of addresses and storage keys that the transaction plans to access. Used only in non-[`FRONTIER`](../../../concepts/transactions/types.md#frontier-transactions) transactions.

- `strict`: _Tag_ - Determines if the sender account balance is considered during gas estimation. If `true`, the sender's balance is checked against the transaction's gas parameters. This ensures the estimated gas reflects what the sender can actually afford. If `false`, the balance checks are skipped. The default is `true`.

- `blobVersionedHashes`: _Array_ - List of references to blobs introduced in [EIP-4844]( https://eips.ethereum.org/EIPS/eip-4844).

Besu simulates the data to create the contract.

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [
      {
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "data": "0x6080604052336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034801561005057600080fd5b5061021e806100606000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063445df0ac146100465780638da5cb5b14610064578063fdacd576146100ae575b600080fd5b61004e6100dc565b6040518082815260200191505060405180910390f35b61006c6100e2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100da600480360360208110156100c457600080fd5b8101908080359060200190929190505050610107565b005b60015481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146101ac576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260338152602001806101b76033913960400191505060405180910390fd5b806001819055505056fe546869732066756e6374696f6e206973207265737472696374656420746f2074686520636f6e74726163742773206f776e6572a265627a7a7231582007302f208a10686769509b529e1878bda1859883778d70dedd1844fe790c9bde64736f6c63430005100032",
        "gas": "0x439cf",
        "gasPrice": "0x0"
      },
      "latest"
    ],
    "id": 53
  }'
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
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [
      {
        "to": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "data": "0x70a08231000000000000000000000000fe3b557e8fb62b89f4916b721be55ceb828dbd73"
      },
      "latest",
      {
        "0xdAC17F958D2ee523a2206206994597C13D831ec7": {
          "stateDiff": {
            "0xd0dd44a13782bf89714335c2b2b08ecb7c074e78a161807742c578965dda1b56": "0x0000000000000000000000000000000000000000000000000000000000004E20"
          }
        }
      }
    ],
    "id": 1
  }'
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

---

## `eth_createAccessList`

Creates an [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930) access list that you can [include in a transaction](../../../concepts/transactions/types.md#access_list-transactions). The method returns a success response (access list and gas used) even if the simulated transaction would revert.

### Parameters

- `transaction`: _object_ - Transaction call object with the following fields:

  <details>
  <summary>Show `transaction` fields</summary>

  - `from`: _Data, 20 bytes_ - Address of the sender.

  - `to`: _Data, 20 bytes_ - Address of the action receiver.

  - `gas`: _Quantity, Integer_ - Gas provided by the sender. `eth_call` consumes zero gas, but other executions might need this parameter. `eth_estimateGas` ignores this value.

  - `gasPrice`: _Quantity, Integer_ - Gas price, in Wei, provided by the sender. The default is `0`. Used only in non-[`EIP1559`](../../../concepts/transactions/types.md#eip1559-transactions) transactions.

  - `maxPriorityFeePerGas`: _Quantity, Integer_ - Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Can be used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions). If used, must specify `maxFeePerGas`.

  - `maxFeePerGas`: _Quantity, Integer_ - Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Can be used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions). If used, must specify `maxPriorityFeePerGas`.

  - `maxFeePerBlobGas`: _Quantity, Integer_ - Maximum fee the sender is willing to pay per blob gas. Only used for blob transactions introduced in [EIP-4844]( https://eips.ethereum.org/EIPS/eip-4844).

  - `nonce`: _Quantity, Integer_ - Number of transactions made by the sender before this one. The default is the sender's nonce.

  - `value`: _Quantity, Integer_ - Value transferred, in Wei.

  - `data`: _Data_ - Hash of the method signature and encoded parameters. For details, see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html). Must be equal to `input` if both parameters are provided.

  - `input`: _Data_ - Hash of the method signature and encoded parameters. For details, see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html). Must be equal to `data` if both parameters are provided.

  - `accessList`: _Array_ - List of addresses and storage keys that the transaction plans to access. Used only in non-[`FRONTIER`](../../../concepts/transactions/types.md#frontier-transactions) transactions.

  - `strict`: _Tag_ - Determines if the sender account balance is considered during gas estimation. If `true`, the sender's balance is checked against the transaction's gas parameters. This ensures the estimated gas reflects what the sender can actually afford. If `false`, the balance checks are skipped. The default is `true`.

  - `blobVersionedHashes`: _Array_ - List of references to blobs introduced in [EIP-4844]( https://eips.ethereum.org/EIPS/eip-4844).

  </details>

- `blockNumber`: _string_ - Hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

### Returns

- Access list object with the following fields:

  <details>
  <summary>Show access list object fields</summary>

  - `accessList`: _array_ of _objects_ - List of objects with the following fields:

    <details>
    <summary>Show `accessList` fields</summary>

    - `address`: _string_ - Addresses to be accessed by the transaction.

    - `storageKeys`: _array_ - Storage keys to be accessed by the transaction.

    </details>

  - `gasUsed`: _string_ - Approximate gas cost for the transaction if the access list is included.

  </details>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
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
  }'
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

---

## `eth_estimateGas`

Returns an estimate of the gas required for a transaction to complete. The estimation process does not use gas and the transaction is not added to the blockchain. The resulting estimate can be greater than the amount of gas the transaction ends up using, for reasons including EVM mechanics and node performance.

The `eth_estimateGas` call does not send a transaction. You must call [`eth_sendRawTransaction`](submit.md#eth_sendrawtransaction) to execute the transaction.

By default, the `eth_estimateGas` error response includes the [revert reason](../../../../private-networks/how-to/send-transactions/revert-reason.md).

### Parameters

- `call`: _object_ - Transaction call object with the following fields:

      :::note
      If you don't want the sender account balance checked, set the gas to zero or specify
      `strict:false`. Otherwise the call may fail if the sender account
      does not have sufficient funds to cover the gas fees.
      :::

  <details>
  <summary>Show `call` fields</summary>

  - `from`: _Data, 20 bytes_ - Address of the sender.

  - `to`: _Data, 20 bytes_ - Address of the action receiver.

  - `gas`: _Quantity, Integer_ - Gas provided by the sender. `eth_call` consumes zero gas, but other executions might need this parameter. `eth_estimateGas` ignores this value.

  - `gasPrice`: _Quantity, Integer_ - Gas price, in Wei, provided by the sender. The default is `0`. Used only in non-[`EIP1559`](../../../concepts/transactions/types.md#eip1559-transactions) transactions.

  - `maxPriorityFeePerGas`: _Quantity, Integer_ - Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Can be used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions). If used, must specify `maxFeePerGas`.

  - `maxFeePerGas`: _Quantity, Integer_ - Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Can be used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions). If used, must specify `maxPriorityFeePerGas`.

  - `maxFeePerBlobGas`: _Quantity, Integer_ - Maximum fee the sender is willing to pay per blob gas. Only used for blob transactions introduced in [EIP-4844]( https://eips.ethereum.org/EIPS/eip-4844).

  - `nonce`: _Quantity, Integer_ - Number of transactions made by the sender before this one. The default is the sender's nonce.

  - `value`: _Quantity, Integer_ - Value transferred, in Wei.

  - `data`: _Data_ - Hash of the method signature and encoded parameters. For details, see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html). Must be equal to `input` if both parameters are provided.

  - `input`: _Data_ - Hash of the method signature and encoded parameters. For details, see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html). Must be equal to `data` if both parameters are provided.

  - `accessList`: _Array_ - List of addresses and storage keys that the transaction plans to access. Used only in non-[`FRONTIER`](../../../concepts/transactions/types.md#frontier-transactions) transactions.

  - `strict`: _Tag_ - Determines if the sender account balance is considered during gas estimation. If `true`, the sender's balance is checked against the transaction's gas parameters. This ensures the estimated gas reflects what the sender can actually afford. If `false`, the balance checks are skipped. The default is `true`.

  - `blobVersionedHashes`: _Array_ - List of references to blobs introduced in [EIP-4844]( https://eips.ethereum.org/EIPS/eip-4844).

  </details>

- `blockNumber`: _string_ - (Optional) Hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter)
  The default is `pending`.

- `stateOverride`: _object_ - The address-to-state mapping.
    Each entry specifies a state that will be temporarily overridden before executing the call.
    This allows you to make temporary state changes without affecting the actual blockchain state, each with the following fields:

  <details>
  <summary>Show `stateOverride` fields</summary>

  - `balance`: _Quantity_ - Temporary account balance for the call execution.

  - `nonce`: _Quantity_ - Temporary nonce value for the call execution.

  - `code`: _Binary_ - Bytecode to inject into the account.

  - `movePrecompileToAddress`: _Data, 20 bytes_ - Address to which the precompile address should be moved.

  - `state`: _Quantity_ - `key:value` pairs to override all slots in the account storage. You cannot set both the `state` and `stateDiff` options simultaneously.

  - `stateDiff`: _Quantity_ - `key:value` pairs to override individual slots in the account storage. You cannot set both the `state` and `stateDiff` options simultaneously.

  </details>

### Returns

- Amount of gas used.

### Example

The following example returns an estimate of 21000 wei (`0x5208`) for the transaction.

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
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
  }'
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
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{block{estimateGas (data: {from :\"0x6295ee1b4f6dd65047762f924ecd367c17eabf8f\", to :\"0x8888f1f195afa192cfee860698584c030f4c9db1\"})}}"
  }'
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
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_estimateGas",
    "params": [
      {
        "from": "0x8bad598904ec5d93d07e204a366d084a80c7694e",
        "data": "0x608060405234801561001057600080fd5b5060e38061001f6000396000f3fe6080604052600436106043576000357c0100000000000000000000000000000000000000000000000000000000900480633fa4f24514604857806355241077146070575b600080fd5b348015605357600080fd5b50605a60a7565b6040518082815260200191505060405180910390f35b348015607b57600080fd5b5060a560048036036020811015609057600080fd5b810190808035906020019092919050505060ad565b005b60005481565b806000819055505056fea165627a7a7230582020d7ad478b98b85ca751c924ef66bcebbbd8072b93031073ef35270a4c42f0080029"
      }
    ],
    "id": 1
  }'
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
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_estimateGas",
    "params": [
      {
        "from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "to": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "data": "0xa9059cbb000000000000000000000000627306090abaB3A6e1400e9345bC60c78a8BEf570000000000000000000000000000000000000000000000000000000000000064"
      },
      "latest",
      {
        "0xdAC17F958D2ee523a2206206994597C13D831ec7": {
          "stateDiff": {
            "0xd0dd44a13782bf89714335c2b2b08ecb7c074e78a161807742c578965dda1b56": "0x0000000000000000000000000000000000000000000000000000000000004E20"
          }
        }
      }
    ],
    "id": 1
  }'
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

---

## `eth_simulateV1`

Simulates transactions across multiple blocks. Allows you to test transactions with custom state and
block parameters without submitting them to the network.

### Parameters

- `payload`: _object_ - Transaction simulation payload object with the following fields:

  <details>
  <summary>Show `payload` fields</summary>

  - `blockStateCalls`: _array_ of _objects_ - List of block state call objects, each with the following fields:

    <details>
    <summary>Show `blockStateCalls` fields</summary>

    - `blockOverrides`: _array_ of _objects_ - List of block override objects, each with the following fields:


      <details>
      <summary>Show `blockOverrides` fields</summary>

      - `baseFeePerGas`: _Quantity_ - Base fee per gas for the block.

      - `blobBaseFee`: _Quantity_ - Base fee per unit of blob gas.

      - `feeRecipient`: _Data, 20 bytes_ - Address of the fee recipient for the block proposal.

      - `gasLimit`: _Quantity_ - Maximum gas allowed in this block.

      - `number`: _Quantity_ - Block number. When overriding block numbers across multiple blocks, block number must be increasing. By default, it's incremented by one for each block.

      - `prevRandao`: _Data, 32 bytes_ - Previous value of randomness.

      - `time`: _Quantity_ - Unix epoch time in seconds. Time must increase or remain constant relative to the previous block. By default, it's incremented by one for each block.

      - `withdrawals`: _Array_ - Array of withdrawals made by validators. This array can have a maximum length of 16.

      </details>

    - `stateOverrides`: _array_ of _objects_ - List of state override objects, each with the following fields:


      <details>
      <summary>Show `stateOverrides` fields</summary>

      - `balance`: _Quantity_ - Temporary account balance for the call execution.

      - `nonce`: _Quantity_ - Temporary nonce value for the call execution.

      - `code`: _Binary_ - Bytecode to inject into the account.

      - `movePrecompileToAddress`: _Data, 20 bytes_ - Address to which the precompile address should be moved.

      - `state`: _Quantity_ - `key:value` pairs to override all slots in the account storage. You cannot set both the `state` and `stateDiff` options simultaneously.

      - `stateDiff`: _Quantity_ - `key:value` pairs to override individual slots in the account storage. You cannot set both the `state` and `stateDiff` options simultaneously.

      </details>

    - `calls`: _array_ of _objects_ - List of transaction call objects, each with the following fields:


      <details>
      <summary>Show `calls` fields</summary>

      - `from`: _Data, 20 bytes_ - Address of the sender.

      - `to`: _Data, 20 bytes_ - Address of the action receiver.

      - `gas`: _Quantity, Integer_ - Gas provided by the sender. `eth_call` consumes zero gas, but other executions might need this parameter. `eth_estimateGas` ignores this value.

      - `gasPrice`: _Quantity, Integer_ - Gas price, in Wei, provided by the sender. The default is `0`. Used only in non-[`EIP1559`](../../../concepts/transactions/types.md#eip1559-transactions) transactions.

      - `maxPriorityFeePerGas`: _Quantity, Integer_ - Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Can be used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions). If used, must specify `maxFeePerGas`.

      - `maxFeePerGas`: _Quantity, Integer_ - Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Can be used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions). If used, must specify `maxPriorityFeePerGas`.

      - `maxFeePerBlobGas`: _Quantity, Integer_ - Maximum fee the sender is willing to pay per blob gas. Only used for blob transactions introduced in [EIP-4844]( https://eips.ethereum.org/EIPS/eip-4844).

      - `nonce`: _Quantity, Integer_ - Number of transactions made by the sender before this one. The default is the sender's nonce.

      - `value`: _Quantity, Integer_ - Value transferred, in Wei.

      - `data`: _Data_ - Hash of the method signature and encoded parameters. For details, see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html). Must be equal to `input` if both parameters are provided.

      - `input`: _Data_ - Hash of the method signature and encoded parameters. For details, see [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html). Must be equal to `data` if both parameters are provided.

      - `accessList`: _Array_ - List of addresses and storage keys that the transaction plans to access. Used only in non-[`FRONTIER`](../../../concepts/transactions/types.md#frontier-transactions) transactions.

      - `strict`: _Tag_ - Determines if the sender account balance is considered during gas estimation. If `true`, the sender's balance is checked against the transaction's gas parameters. This ensures the estimated gas reflects what the sender can actually afford. If `false`, the balance checks are skipped. The default is `true`.

      - `blobVersionedHashes`: _Array_ - List of references to blobs introduced in [EIP-4844]( https://eips.ethereum.org/EIPS/eip-4844).

      </details>

    </details>

  - `traceTransfers`:  _boolean_ - (Optional) If `true`, ETH transfers are added as ERC-20 transfer
      events to the logs, allowing you to trace value transfers. The default is `false`.

  - `validation`: _boolean_ - (Optional) If `true`, `eth_simulateV1` does all the validation that a
    normal EVM would do, except contract sender and signature checks. If `false`, `eth_simulateV1` behaves like `eth_call`.
    The default is `false`.

  - `returnFullTransactionObjects`: _boolean_ - (Optional) If `true`, returns full transaction
    objects. If `false`, returns only hashes. The default is `false`.

  </details>

- `blockNumber` or `blockHash`: _string_ - Hexadecimal integer representing a block number,
  block hash, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as
  described in [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

### Returns

- List of simulation result objects, each with the following fields:

  <details>
  <summary>Show fields</summary>

  - all the fields of a block object

    <details>
    <summary>Show fields</summary>

    - `number`: _Quantity, Integer_ - Block number. `null` when block is pending.

    - `hash`: _Data, 32 bytes_ - Hash of the block. `null` when block is pending.

    - `parentHash`: _Data, 32 bytes_ - Hash of the parent block.

    - `nonce`: _Data, 8 bytes_ - Hash of the generated proof of work. `null` when block is pending.

    - `sha3Uncles`: _Data, 32 bytes_ - SHA3 of the uncle's data in the block.

    - `logsBloom`: _Data, 256 bytes_ - Bloom filter for the block logs. `null` when block is pending.

    - `transactionsRoot`: _Data, 32 bytes_ - Root of the transaction trie for the block.

    - `stateRoot`: _Data, 32 bytes_ - Root of the final state trie for the block.

    - `receiptsRoot`: _Data, 32 bytes_ - Root of the receipts trie for the block.

    - `miner`: _Data, 20 bytes_ - Address to pay mining rewards to.

    - `difficulty`: _Quantity, Integer_ - Difficulty for this block.

    - `totalDifficulty`: _Quantity, Integer_ - Total difficulty of the chain until this block. This field is only returned for pre-merge (Proof of Work) blocks. This value will always be `0` for an uncle block.

    - `extraData`: _Data_ - Extra data field for this block. The first 32 bytes is vanity data you can set using the [`--miner-extra-data`](../../cli/options.md#miner-extra-data) command line option. Stores extra data when used with [IBFT](../../../../private-networks/how-to/configure/consensus/ibft.md#genesis-file).

    - `size`: _Quantity, Integer_ - Size of block in bytes.

    - `gasLimit`: _Quantity_ - Maximum gas allowed in this block.

    - `gasUsed`: _Quantity_ - Total gas used by all transactions in this block.

    - `timestamp`: _Quantity_ - Hex-encoded Unix timestamp (in seconds) for block assembly.

    - `transactions`: _Array_ - Array of transaction objects, or 32 byte transaction hashes depending on the specified boolean parameter, each with the following fields:

      <details>
      <summary>Show `transactions` fields</summary>

      - `accessList`: _Array_ - (Optional) List of addresses and storage keys the transaction plans to access. Used in [`ACCESS_LIST` transactions](../../../concepts/transactions/types.md#access_list-transactions) and may be used in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

      - `blockHash`: _Data, 32 bytes_ - Hash of the block containing this transaction. `null` when transaction is pending.

      - `blockNumber`: _Quantity_ - Block number of the block containing this transaction. `null` when transaction is pending.

      - `blockTimestamp`: _Quantity_ - Hex-encoded Unix timestamp (in seconds) of the block containing this transaction. `null` when transaction is pending.

      - `chainId`: _Quantity_ - [Chain ID](../../../concepts/network-and-chain-id.md).

      - `from`: _Data, 20 bytes_ - Address of the sender.

      - `gas`: _Quantity_ - Gas provided by the sender.

      - `gasPrice`: _Quantity_ - (Optional) Gas price, in Wei, provided by the sender. Used only in non-[`EIP1559`](../../../concepts/transactions/types.md#eip1559-transactions) transactions.

      - `maxPriorityFeePerGas`: _Quantity, Integer_ - (Optional) Maximum fee, in Wei, the sender is willing to pay per gas above the base fee. Used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

      - `maxFeePerGas`: _Quantity, Integer_ - (Optional) Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas. Used only in [`EIP1559` transactions](../../../concepts/transactions/types.md#eip1559-transactions).

      - `hash`: _Data, 32 bytes_ - Hash of the transaction.

      - `input`: _Data_ - Data sent with the transaction to create or invoke a contract.

      - `nonce`: _Quantity_ - Number of transactions made by the sender before this one.

      - `to`: _Data, 20 bytes_ - Address of the receiver. `null` if a contract creation transaction.

      - `transactionIndex`: _Quantity, Integer_ - Index position of the transaction in the block. `null` when transaction is pending.

      - `transactionType`: _String_ - [Transaction type](../../../concepts/transactions/types.md).

      - `value`: _Quantity_ - Value transferred, in Wei.

      - `v`: _Quantity_ - ECDSA Recovery ID.

      - `r`: _Data, 32 bytes_ - ECDSA signature r.

      - `s`: _Data, 32 bytes_ - ECDSA signature s.

      </details>

    - `uncles`: _Array_ - Array of uncle hashes.

    - `baseFeePerGas`: _Quantity_ - The block's [base fee per gas](../../../concepts/transactions/types.md#eip1559-transactions). This field is empty for blocks created before [EIP-1559](https://github.com/ethereum/EIPs/blob/2d8a95e14e56de27c5465d93747b0006bd8ac47f/EIPS/eip-1559.md).

    </details>

  - `calls`: _array_ of _objects_ - List of call result objects, each with the following fields:

    <details>
    <summary>Show `calls` fields</summary>

    - `returnData`: _Data_ - Data returned for the call.

    - `logs`: _Array_ - Array of log objects generated during the call, each with the following fields:

      <details>
      <summary>Show `logs` fields</summary>

      - `removed`: _Tag_ - `true` if log removed because of a chain reorganization. `false` if a valid log.

      - `logIndex`: _Quantity, Integer_ - Log index position in the block. `null` when log is pending.

      - `transactionIndex`: _Quantity, Integer_ - Index position of the starting transaction for the log. `null` when log is pending.

      - `transactionHash`: _Data, 32 bytes_ - Hash of the starting transaction for the log. `null` when log is pending.

      - `blockHash`: _Data, 32 bytes_ - Hash of the block that includes the log. `null` when log is pending.

      - `blockNumber`: _Quantity_ - Number of block that includes the log. `null` when log is pending.

      - `blockTimestamp`: _Quantity_ - Hex-encoded unix timestamp (in seconds) of the block that includes the log.

      - `address`: _Data, 20 bytes_ - Address the log originated from.

      - `data`: _Data_ - Non-indexed arguments of the log.

      - `topics`: _Array of Data, 32 bytes each_ - [Event signature hash](../../../concepts/events-and-logs.md#event-signature-hash) and 0 to 3 [indexed log arguments](../../../concepts/events-and-logs.md#event-parameters).

      </details>

    - `gasUsed`: _Quantity_ - Amount of gas used by the call.

    - `maxUsedGas`: _Quantity_ - Maximum gas used during the call before any refunds.

    - `status`: _Quantity_ - Status indicating whether the call succeeded (`0x1`). `0x0` indicates that a call has failed.

    </details>

  </details>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_simulateV1",
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
  }'
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
