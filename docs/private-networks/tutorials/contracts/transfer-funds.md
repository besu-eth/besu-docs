---
title: Transfer account funds
sidebar_position: 1
description: funds transfer transactions
---

# Transfer funds between accounts in a transaction

You can get started with the [Developer Quickstart](../quickstart.md) to rapidly generate local blockchain networks.

This tutorial shows you how to transfer funds (ETH) between accounts in a transaction.

## Prerequisites

- A [private network](../quickstart.md)

## Use `eth_sendSignedTransaction`

The simplest way to transfer funds between externally-owned accounts is using [`eth_sendSignedTransaction`](https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html#sendsignedtransaction). This example uses `eth_sendSignedTransaction` and one of the [test accounts](../../reference/accounts-for-testing.md) to transfer funds to a newly created account.

:::danger Do not use the test accounts on Ethereum Mainnet or any production network

The private key is publicly displayed, which means the account is not secure.

:::

Before making the transaction, check the balances of both accounts to verify the funds transfer after the transaction.

```js
const web3 = new Web3(host);
// Pre-seeded account with 90000 ETH
const privateKeyA =
  "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const accountA = web3.eth.accounts.privateKeyToAccount(privateKeyA);
var accountABalance = web3.utils.fromWei(
  await web3.eth.getBalance(accountA.address),
);
console.log("Account A has balance of: " + accountABalance);

// Create a new account to transfer ETH to
var accountB = web3.eth.accounts.create();
var accountBBalance = web3.utils.fromWei(
  await web3.eth.getBalance(accountB.address),
);
console.log("Account B has balance of: " + accountBBalance);
```

Use the test account address (Account A) for the `from` parameter, the recipient account address (Account B) for the `to` parameter, and the amount of ETH to transfer between accounts for the `value` parameter. Sign the transaction with Account A's private key and send it using `eth_sendSignedTransaction`.

```js
// Send some ETH from A to B
const rawTxOptions = {
  nonce: web3.utils.numberToHex(
    await web3.eth.getTransactionCount(accountA.address),
  ),
  from: accountA.address,
  to: accountB.address,
  value: "0x100", // Amount of ETH to transfer
  gasPrice: "0x0", // ETH per unit of gas
  gasLimit: "0x24A22", // Max number of gas units the tx is allowed to use
};
console.log("Creating transaction...");
const tx = new Tx(rawTxOptions);
console.log("Signing transaction...");
tx.sign(Buffer.from(accountA.privateKey.substring(2), "hex"));
console.log("Sending transaction...");
var serializedTx = tx.serialize();
const pTx = await web3.eth.sendSignedTransaction(
  "0x" + serializedTx.toString("hex").toString("hex"),
);
console.log("tx transactionHash: " + pTx.transactionHash);
```

Once it completes, you can see the updated balances.

```js
// After the transaction, there should be some ETH transferred
var accountABalance = await getAccountBalance(host, accountA);
console.log("Account A has an updated balance of: " + accountABalance);
var accountBBalance = await getAccountBalance(host, accountB);
console.log("Account B has an updatedbalance of: " + accountBBalance);
}
```

A [full example](https://github.com/ConsenSys/quorum-dev-quickstart/blob/1e8cc281098923802845cd829ec20c88513c2e1c/files/besu/smart_contracts/privacy/scripts/eth_tx.js) can be found in the Developer Quickstart.

## Use `eth_sendTransaction`

An alternative to using `eth_sendSignedTransaction` is [`eth_sendTransaction`](https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html#sendtransaction). However, Besu does not support the `eth_sendTransaction` API call and keeps account management separate for stronger security. Instead, Besu uses [Web3Signer](https://docs.web3signer.consensys.net/) to make the `eth_sendTransaction` API call.

Use `eth_sendTransaction` similarly to [using `eth_sendSignedTransaction`](#use-eth_sendsignedtransaction) (without the signing step which is done by Web3Signer):

```js
const web3 = new Web3(host);
// Pre-seeded account with 90000 ETH
const privateKeyA = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const accountA = web3.eth.accounts.privateKeyToAccount(privateKeyA);
var accountABalance = web3.utils.fromWei(await web3.eth.getBalance(accountA.address));
console.log("Account A has balance of: " + accountABalance);

// Create a new account to transfer ETH to
var accountB = web3.eth.accounts.create();
var accountBBalance = web3.utils.fromWei(await web3.eth.getBalance(accountB.address));
console.log("Account B has balance of: " + accountBBalance);

// Send some ETH from A to B
const txOptions = {
  from: accountA.address,
  to: accountB.address,
  value: "0x100",  // Amount of ETH to transfer
  gasPrice: "0x0", // ETH per unit of gas
  gasLimit: "0x24A22" // Max number of gas units the tx is allowed to use
};
console.log("Creating transaction...");
const pTx = await web3.eth.sendTransaction(txOptions);
console.log("tx transactionHash: " + pTx.transactionHash);

// After the transaction, there should be some ETH transferred
var accountABalance = await getAccountBalance(host, accountA);
console.log("Account A has an updated balance of: " + accountABalance);
var accountBBalance = await getAccountBalance(host, accountB);
console.log("Account B has an updatedbalance of: " + accountBBalance);
}
```
