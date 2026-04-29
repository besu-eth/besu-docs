---
title: Deploy a smart contract
sidebar_position: 1
description: deploying smart contracts
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Deploy smart contracts to an Ethereum chain

This tutorial shows you how to deploy smart contracts as transactions to a network.

## Prerequisites

- A local blockchain network. You can use the [Developer Quickstart](../quickstart.md) to rapidly generate 
one.
- Install the Solidity compiler using one of the following methods:
  - Use the [Solidity releases](https://github.com/ethereum/solidity/releases) for the `solc` binary.
  - Run `npm install -g solc` for the JavaScript version.

## Use `eth_sendSignedTransaction`

To deploy a smart contract using 
[`eth_sendSignedTransaction`](https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#sendsignedtransaction), use an account's 
private key to sign and serialize the transaction, and send the API request.

This example uses the [web3js](https://www.npmjs.com/package/web3) library to make the API calls.

Using the [`SimpleStorage.sol`](https://github.com/ConsenSys/quorum-dev-quickstart/blob/1e8cc281098923802845cd829ec20c88513c2e1c/files/common/smart_contracts/privacy/contracts/SimpleStorage.sol) smart contract as an example, create a new file called `compile.js` with the following content:

```js title="compile.js"
const fs = require("fs").promises;
const solc = require("solc");

async function main() {
  // Load the contract source code
  const sourceCode = await fs.readFile("SimpleStorage.sol", "utf8");
  // Compile the source code and retrieve the ABI and bytecode
  const { abi, bytecode } = compile(sourceCode, "SimpleStorage");
  // Store the ABI and bytecode into a JSON file
  const artifact = JSON.stringify({ abi, bytecode }, null, 2);
  await fs.writeFile("SimpleStorage.json", artifact);
}

function compile(sourceCode, contractName) {
  // Create the Solidity Compiler Standard Input and Output JSON
  const input = {
    language: "Solidity",
    sources: { main: { content: sourceCode } },
    settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
  };
  // Parse the compiler output to retrieve the ABI and bytecode
  const output = solc.compile(JSON.stringify(input));
  const artifact = JSON.parse(output).contracts.main[contractName];
  return {
    abi: artifact.abi,
    bytecode: artifact.evm.bytecode.object,
  };
}

main().then(() => process.exit(0));
```

Run `compile.js` to get the smart contract's output JSON:

```bash
node compile.js
```

Run the compiler to get the contract's bytecode and ABI:

<Tabs>
<TabItem value="Binary (solc)" label="Binary (solc)" default>

If you installed the compiler from [Solidity releases](https://github.com/ethereum/solidity/releases):

```bash
solc SimpleStorage.sol --bin --abi
```

</TabItem>
<TabItem value="npm (solcjs)" label="npm (solcjs)">

If you installed via `npm install -g solc`, use **`solcjs`**:

```bash
solcjs SimpleStorage.sol --bin --abi
```

</TabItem>
</Tabs>

Once you have the bytecode and ABI, you can rename the output files to make them easier to use; this tutorial refers to them as 
`SimpleStorage.bin` and `SimpleStorage.abi`.

Create a new file named `public_tx.js` to send the transaction (or run the following commands in a JavaScript console). 
The developer quickstart provides an 
[example of a public transaction script](https://github.com/ConsenSys/quorum-dev-quickstart/blob/1e8cc281098923802845cd829ec20c88513c2e1c/files/besu/smart_contracts/privacy/scripts/public_tx.js).

```js titl="public_tx.js"
const web3 = new Web3(host);
// use an existing account, or make an account
const privateKey =
  "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63";
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

// read in the contracts
const contractJsonPath = path.resolve(__dirname, "SimpleStorage.json");
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
const contractAbi = contractJson.abi;
const contractBinPath = path.resolve(__dirname, "SimpleStorage.bin");
const contractBin = fs.readFileSync(contractBinPath);
// initialize the default constructor with a value `47 = 0x2F`; this value is appended to the bytecode
const contractConstructorInit =
  "000000000000000000000000000000000000000000000000000000000000002F";

// get txnCount for the nonce value
const txnCount = await web3.eth.getTransactionCount(account.address);

const rawTxOptions = {
  nonce: web3.utils.numberToHex(txnCount),
  from: account.address,
  to: null, //public tx
  value: "0x00",
  data: "0x" + contractBin + contractConstructorInit, // contract binary appended with initialization value
  gasPrice: "0x0", //ETH per unit of gas
  gasLimit: "0x24A22", //max number of gas units the tx is allowed to use
};
console.log("Creating transaction...");
const tx = new Tx(rawTxOptions);
console.log("Signing transaction...");
tx.sign(privateKey);
console.log("Sending transaction...");
var serializedTx = tx.serialize();
const pTx = await web3.eth.sendSignedTransaction(
  "0x" + serializedTx.toString("hex").toString("hex"),
);
console.log("tx transactionHash: " + pTx.transactionHash);
console.log("tx contractAddress: " + pTx.contractAddress);
```

`rawTxOptions` contains the following fields:

- `nonce` - the number of transactions sent from an address.
- `from` - address of the sending account. For example `0xfe3b557e8fb62b89f4916b721be55ceb828dbd73`.
- `to` - address of the receiver. To deploy a contract, set to `null`.
- `gas` - amount of gas provided by the sender for the transaction.
- `gasPrice` - price for each unit of gas the sender is willing to pay.
- `data` - binary of the contract (in this example there's also a constructor initialization value, so we append that to the 
binary value).
- `value` - amount of Ether/Wei transferred from the sender to the recipient.

Run the `public_tx.js` to send the transaction:

```bash
node public_tx.js
```

This example code creates the transaction `tx`, signs it with the private key of the account, serializes it, then calls 
`eth_sendSignedTransaction` to deploy the contract.

## Use `eth_sendTransaction`

You can use [`eth_sendTransaction`](https://ethereum.org/developers/docs/apis/json-rpc/#eth_sendtransaction) as an alternative 
to `eth_sendSignedTransaction`. However, Besu does not support the `eth_sendTransaction` API call and keeps account management 
separate for stronger security. Configure [Web3Signer](https://docs.web3signer.consensys.net/) with your Besu node to make the 
`eth_sendTransaction` API call.

Pass the following parameters to the [`eth_sendTransaction`](https://docs.web3signer.consensys.net/reference/api/json-rpc#eth_sendtransaction) call to Web3Signer. Web3Signer converts the request to an [`eth_sendRawTransaction`](../../../public-networks/reference/api/index.md#eth_sendrawtransaction) call that Besu uses:

- `to` - address of the receiver. To deploy a contract, set to `null`.
- `from` - address of the sender account. For example `0x9b790656b9ec0db1936ed84b3bea605873558198`.
- `gas` - amount of gas provided by the sender for the transaction
- `gasPrice` - price for each unit of gas the sender is willing to pay
- `data` - one of the following:
  - For contract deployments (this use case) - compiled code of the contract
  - For contract interactions - hash of the invoked method signature and encoded parameters (see 
  [Ethereum Contract ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html))
  - For simple ether transfers - empty

```json title="'eth_sendTransaction' parameters"
params: {
  "to": null,
  "from": "0x9b790656b9ec0db1936ed84b3bea605873558198",
  "gas": "0x76c0",
  "gasPrice": "0x9184e72a000",
  "data": "0x608060405234801561001057600080fd5b5060405161014d38038061014d8339818101604052602081101561003357600080fd5b8101908080519060200190929190505050806000819055505060f38061005a6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80632a1afcd914604157806360fe47b114605d5780636d4ce63c146088575b600080fd5b604760a4565b6040518082815260200191505060405180910390f35b608660048036036020811015607157600080fd5b810190808035906020019092919050505060aa565b005b608e60b4565b6040518082815260200191505060405180910390f35b60005481565b8060008190555050565b6000805490509056fea2646970667358221220e6966e446bd0af8e6af40eb0d8f323dd02f771ba1f11ae05c65d1624ffb3c58264736f6c63430007060033"
}
```

Make the request using `eth_sendTransaction`:

```bash title="'eth_sendTransaction' curl HTTP request"
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from":"0x9b790656b9ec0db1936ed84b3bea605873558198", "to":null, "gas":"0x7600","gasPrice":"0x9184e72a000", "data":"0x608060405234801561001057600080fd5b5060405161014d38038061014d8339818101604052602081101561003357600080fd5b8101908080519060200190929190505050806000819055505060f38061005a6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80632a1afcd914604157806360fe47b114605d5780636d4ce63c146088575b600080fd5b604760a4565b6040518082815260200191505060405180910390f35b608660048036036020811015607157600080fd5b810190808035906020019092919050505060aa565b005b608e60b4565b6040518082815260200191505060405180910390f35b60005481565b8060008190555050565b6000805490509056fea2646970667358221220e6966e446bd0af8e6af40eb0d8f323dd02f771ba1f11ae05c65d1624ffb3c58264736f6c63430007060033"}], "id":1}' <JSON-RPC-endpoint:port>
```
