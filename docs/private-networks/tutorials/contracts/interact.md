---
title: Interact with a deployed contract
sidebar_position: 2
description: calling smart contracts functions
---

# Interact with deployed smart contracts

You can get started with the [Developer Quickstart](../quickstart.md) to rapidly generate local blockchain networks.

This tutorial shows you how to interact with smart contracts that have been deployed to a network.

## Prerequisites

- A network with a deployed smart contract as in the [deploying smart contracts tutorial](index.md)

## Interact with public contracts

This tutorial uses the [`SimpleStorage.sol`](https://github.com/ConsenSys/quorum-dev-quickstart/blob/1e8cc281098923802845cd829ec20c88513c2e1c/files/common/smart_contracts/privacy/contracts/SimpleStorage.sol) contract:

```js
pragma solidity ^0.7.0;

contract SimpleStorage {
  uint public storedData;

  constructor(uint initVal) public {
    storedData = initVal;
  }

  function set(uint x) public {
    storedData = x;
  }

  function get() view public returns (uint retVal) {
    return storedData;
  }
}
```

Once the contract is deployed, you can perform a read operation using the `get` function call and a write operation using the `set` function call. This tutorial uses the [web3js](https://www.npmjs.com/package/web3) library to interact with the contract. A [full example](https://github.com/ConsenSys/quorum-dev-quickstart/blob/1e8cc281098923802845cd829ec20c88513c2e1c/files/besu/smart_contracts/privacy/scripts/public_tx.js) of these calls can be found in the [Developer Quickstart].

### 1. Perform a read operation

To perform a read operation, you need the address that the contract was deployed to and the contract's ABI. The contract's ABI can be obtained from compiling the contract; see the [deploying smart contracts tutorial](index.md) for an example.

Use the [`web3.eth.Contract`](https://web3js.readthedocs.io/en/v1.3.4/web3-eth-contract.html) object to create a new instance of the smart contract, then make the `get` function call from the contract's list of methods, which will return the value stored:

```js
async function getValueAtAddress(
  host,
  deployedContractAbi,
  deployedContractAddress,
) {
  const web3 = new Web3(host);
  const contractInstance = new web3.eth.Contract(
    deployedContractAbi,
    deployedContractAddress,
  );
  const res = await contractInstance.methods.get().call();
  console.log("Obtained value at deployed contract is: " + res);
  return res;
}
```

### 2. Perform a write operation

To perform a write operation, send a transaction to update the stored value. As with the [`get` call](#1-perform-a-read-operation), you need to use the address that the contract was deployed to and the contract's ABI. The account address must correspond to an actual account with some ETH in it to perform the transaction. Because Besu doesn't manage accounts, this address is the address you use in [Web3Signer](https://docs.web3signer.consensys.net/) (or equivalent) to manage your accounts.

Make the `set` call passing in your account address, `value` as the updated value of the contract, and the amount of gas you are willing to spend for the transaction:

```js
// You need to use the accountAddress details provided to Besu to send/interact with contracts
async function setValueAtAddress(
  host,
  accountAddress,
  value,
  deployedContractAbi,
  deployedContractAddress,
) {
  const web3 = new Web3(host);
  const contractInstance = new web3.eth.Contract(
    deployedContractAbi,
    deployedContractAddress,
  );
  const res = await contractInstance.methods
    .set(value)
    .send({ from: accountAddress, gasPrice: "0xFF", gasLimit: "0x24A22" });
  return res;
}
```

### 3. Verify an updated value

To verify that a value has been updated, perform a `get` call after a `set` update call.

## Interact with private contracts

This private contracts example uses the same `SimpleStorage.sol` contract as in the [public contracts example](#interact-with-public-contracts), but it uses the [web3js-quorum](https://consensys.github.io/web3js-quorum/latest/index.html) library and the [`generateAndSendRawTransaction`](https://consensys.github.io/web3js-quorum/latest/module-priv.html#~generateAndSendRawTransaction) method to interact with the contract. Both read and write operations are performed using the `generateAndSendRawTransaction` API call. A [full example](https://github.com/ConsenSys/quorum-dev-quickstart/blob/1e8cc281098923802845cd829ec20c88513c2e1c/files/besu/smart_contracts/privacy/scripts/private_tx.js) can be found in the [Developer Quickstart].

### 1. Perform a read operation

As in the public contracts example, to perform a read operation, you need the address that the contract was deployed to and the contract's ABI. You also need your private and public keys and the recipient's public key.

Use the [`web3.eth.Contract`](https://web3js.readthedocs.io/en/v1.3.4/web3-eth-contract.html) object to create a new instance of the smart contract, extract the signature of function's ABI for the `get` method, and then use this value as the `data` parameter for the `generateAndSendRawTransaction` transaction.

The keys remain the same for the sender and recipient, and the `to` field is the contract's address. Once you make the request, you receive a `transactionHash`, which you can use to get a `transactionReceipt` containing the value stored:

```js
async function getValueAtAddress(
  clientUrl,
  address,
  contractAbi,
  fromPrivateKey,
  fromPublicKey,
  toPublicKey,
) {
  const Web3 = require("web3");
  const Web3Quorum = require("web3js-quorum");
  const web3 = new Web3Quorum(new Web3("http://localhost:22000"));
  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "get";
  });
  const functionParams = {
    to: address,
    data: functionAbi.signature,
    privateKey: fromPrivateKey,
    privateFrom: fromPublicKey,
    privateFor: [toPublicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams,
  );
  // console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash,
  );
  console.log(
    "" + nodeName + " value from deployed contract is: " + result.output,
  );
  return result;
}
```

### 2. Perform a write operation

Performing a write operation is almost the same process as the read operation, except that you encode the new value to the `set` function's ABI, and then append these arguments to the `set` function's ABI and use this as the `data` field:

```js
async function setValueAtAddress(
  clientUrl,
  address,
  value,
  contractAbi,
  fromPrivateKey,
  fromPublicKey,
  toPublicKey,
) {
  const Web3 = require("web3");
  const Web3Quorum = require("web3js-quorum");
  const web3 = new Web3Quorum(new Web3("http://localhost:22000"));
  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "set";
  });
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [value])
    .slice(2);
  const functionParams = {
    to: address,
    data: functionAbi.signature + functionArgs,
    privateKey: fromPrivateKey,
    privateFrom: fromPublicKey,
    privateFor: [toPublicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams,
  );
  console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash,
  );
  return result;
}
```

### 3. Verify an updated value

To verify that a value has been updated, perform a `get` call after a `set` update call.

[Developer Quickstart]: ../quickstart.md
