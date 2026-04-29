---
title: Use Hardhat
sidebar_position: 1
description: Using Besu with Hardhat
---

# Use Hardhat

Developing for Besu using Hardhat is the same as developing for public Ethereum networks using Hardhat. Hardhat
supports Besu with the only difference being Besu does not support private key management. 

You can therefore use a wallet provider, or specify your private  key in the code.

## Private key management

### Use an HD wallet

To add the wallet provider, update the `hardhat.config.ts` file in the project directory. Replace:

- `<JSON-RPC-http-endpoint>` with the JSON-RPC endpoint (IP address and port) of a Besu node.
- `<MY-ACCOUNT-MNEMONIC>` with the list of words that make up your account's mnemonic.
- `<MY-PASSWORD`> with your password if used.
- `<MY-ACCOUNT-PRIVATE-KEY>` with your account's private key.

```js
module.exports = {
  // See <https://hardhat.org/hardhat-runner/docs/config#hd-wallet-config>
  // for more about customizing your Hardhat configuration!
  networks: {
    besuWallet: {
      url: "<JSON-RPC-http-endpoint>",
      accounts: {
        mnemonic: "<ACCOUNT-MNEMONIC>",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 1,
        passphrase: "",
      },
    },
  },
};
```

### Specify your private key in code

:::danger

Ensure you do not commit private keys to source control like Github, always inject your keys at runtime as environment variables, or
use a vault or similar.

:::

```js
const provider = new ethers.JsonRpcApiProvider(<JSON-RPC-http-endpoint>);
const wallet = new ethers.Wallet(<MY-ACCOUNT-PRIVATE-KEY>);
// connect the wallet to the provider
const signer = wallet.connect(provider);

```

## Start a Besu node

Start a Besu node with JSON-RPC enabled on the endpoint specified in the Hardhat configuration file.

## Deploy a contract

To deploy a contract onto the Besu network:

```bash
npx hardhat scripts run ./scripts/deploy_my_contract.ts --network besuWallet
```
