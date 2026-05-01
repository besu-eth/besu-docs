---
title: Create and send transactions
sidebar_position: 4
description: Send transactions using eth_call or eth_sendRawTransaction.
---

# Create and send transactions

You can send signed transactions using the [`eth_sendRawTransaction`](../reference/api/index.md#eth_sendrawtransaction)
JSON-RPC API method.
Signed transactions can be simple value transfers, contract creation, or contract invocation. Set the
maximum transaction fee for transactions using the [`--rpc-tx-feecap`](../reference/cli/options.md#rpc-tx-feecap) CLI option.

[Use client libraries](develop/client-libraries.md) to create and send a signed raw transaction to
transfer Ether and create a smart contract.

To accept signed transactions from remote connections, set the [API listening host](use-besu-api/index.md#service-hosts)
to `0.0.0.0`. Setting the listening host to `0.0.0.0` exposes the API service connection on your node to
any remote connection. In a production environment, ensure you are using a firewall to avoid exposing
your node to the internet.

:::danger Private keys

Don't use the accounts from the examples on Mainnet or any public network except for testing. The private keys are displayed which means the accounts are not secure.

All accounts and private keys in the examples are from the `dev.json` genesis file in the [`/besu/config/src/main/resources`](https://github.com/hyperledger/besu/tree/master/config/src/main/resources) directory.

In production environments avoid exposing your private keys by creating signed transactions offline, or use [Web3Signer](https://docs.web3signer.consensys.net/) to isolate your private keys and sign transactions with [`eth_sendTransaction`](https://docs.web3signer.consensys.net/reference/api/json-rpc#eth_sendtransaction).

:::

## `eth_call` vs. `eth_sendRawTransaction`

You can interact with contracts using [`eth_call`](../reference/api/index.md#eth_call) or [`eth_sendRawTransaction`](../reference/api/index.md#eth_sendrawtransaction). The table below compares the characteristics of both calls.

| `eth_call` | `eth_sendRawTransaction` |
| --- | --- |
| Read-only | Write |
| Invokes contract function locally | Broadcasts to the network |
| Does not change state of blockchain | Updates the blockchain (for example, transfers ether between accounts) |
| Does not consume gas | Requires gas |
| Synchronous | Asynchronous |
| Returns the value of a contract function available immediately | Returns transaction hash only. A block might not include all possible transactions (for example, if the gas price is too low). |

## Override state values 

Use methods that accept the [state override object](../reference/api/objects.md#state-override-object) to override an account with temporary state values before
executing a call. State overrides allow you to make temporary state changes without affecting the actual blockchain state, and provide the following benefits:

- Minimize the amount of contract code that must be deployed onchain. Code that returns internal
  state or performs predefined validations can be kept offchain and supplied to the node on demand.
- Extend and invoke custom methods on deployed contracts for analysis and debugging without
  reconstructing the entire state in a sandbox, allowing selective state or code overrides
  to observe execution changes.

The following methods support the [state override object](../reference/api/objects.md#state-override-object):

- [`eth_call`](../reference/api/index.md#eth_call)
- [`eth_estimateGas`](../reference/api/index.md#eth_estimategas)
- [`eth_simulateV1`](../reference/api/index.md#eth_simulatev1)
- [`debug_traceCall`](../reference/api/index.md#debug_tracecall) (via the `stateOverrides` options wrapper)

## Use wallets for key management

Besu doesn't support key management inside the client. Use:

- [Web3Signer](https://docs.web3signer.consensys.net/) with Besu to provide access to your key store and sign transactions.
- Third-party tools (for example, [MetaMask](https://metamask.io/) and [web3j](https://web3j.io/)) for creating accounts.
