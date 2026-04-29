---
description: Besu private network JSON-RPC API methods reference
toc_max_heading_level: 3
sidebar_position: 2
sidebar_label: Besu API
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Private network API methods

:::caution Important

- This reference contains API methods that apply to only private networks. For API methods that apply to both private and public networks, see the [public network API reference](../../public-networks/reference/api/index.md).
- All JSON-RPC HTTP examples use the default host and port endpoint `http://127.0.0.1:8545`. If using the [--rpc-http-host](../../public-networks/reference/cli/options.md#rpc-http-host) or [--rpc-http-port](../../public-networks/reference/cli/options.md#rpc-http-port) options, update the endpoint.

:::

## `IBFT` 2.0 methods

The `IBFT` API methods provide access to the [IBFT 2.0](../how-to/configure/consensus/ibft.md) consensus engine.

:::note

The `IBFT` API methods are not enabled by default for JSON-RPC. To enable the `IBFT` API methods, use the [`--rpc-http-api`](../../public-networks/reference/cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../../public-networks/reference/cli/options.md#rpc-ws-api) options.

:::

### `ibft_discardValidatorVote`

Discards a proposal to [add or remove a validator] with the specified address.

#### Parameters

`address`: _string_ - 20-byte address of proposed validator

#### Returns

`result`: _boolean_ - indicates if the proposal is discarded

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_discardValidatorVote","params":["0xef1bfb6a12794615c9b0b5a21e6741f01e570185"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"ibft_discardValidatorVote","params":["0xef1bfb6a12794615c9b0b5a21e6741f01e570185"], "id":1}
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

### `ibft_getPendingVotes`

Returns [votes](../how-to/configure/consensus/ibft.md#add-and-remove-validators) cast in the current [epoch](../how-to/configure/consensus/ibft.md#genesis-file).

#### Parameters

None

#### Returns

`result`: _map_ of _strings_ to _booleans_ - map of account addresses to corresponding boolean values indicating the vote for each account; if `true`, the vote is to add a validator. If `false`, the proposal is to remove a validator.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_getPendingVotes","params":[], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"ibft_getPendingVotes","params":[], "id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "0xef1bfb6a12794615c9b0b5a21e6741f01e570185": true,
    "0x42d4287eac8078828cf5f3486cfe601a275a49a5": true
  }
}
```

</TabItem>

</Tabs>

### `ibft_getSignerMetrics`

Provides the following validator metrics for the specified range:

- Number of blocks from each validator

- Block number of the last block proposed by each validator (if any proposed in the specified range)

- All validators present in the last block of the range

#### Parameters

- `fromBlockNumber`: _string_ - hexadecimal integer representing a block number, or one
  of the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../public-networks/how-to/use-besu-api/json-rpc.md#block-parameter)

- `toBlockNumber`: _string_ - hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../public-networks/how-to/use-besu-api/json-rpc.md#block-parameter)

:::note
`pending` returns the same value as `latest`.
:::

If you specify:

- No parameters, the call provides metrics for the last 100 blocks, or all blocks if there are less than 100 blocks.

- Only the first parameter, the call provides metrics for all blocks from the block specified to the latest block.

#### Returns

`result`: _array_ of _objects_ - list of validator objects

:::note

The proposer of the genesis block has address `0x0000000000000000000000000000000000000000`.

:::

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_getSignerMetrics","params":["1", "100"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```bash
{"jsonrpc":"2.0","method":"ibft_getSignerMetrics","params":["1", "100"], "id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "address": "0x7ffc57839b00206d1ad20c69a1981b489f772031",
      "proposedBlockCount": "0x21",
      "lastProposedBlockNumber": "0x61"
    },
    {
      "address": "0x42eb768f2244c8811c63729a21a3569731535f06",
      "proposedBlockCount": "0x21",
      "lastProposedBlockNumber": "0x63"
    },
    {
      "address": "0xb279182d99e65703f0076e4812653aab85fca0f0",
      "proposedBlockCount": "0x21",
      "lastProposedBlockNumber": "0x62"
    }
  ]
}
```

</TabItem>

</Tabs>

### `ibft_getValidatorsByBlockHash`

Lists the validators defined in the specified block.

#### Parameters

`block`: _string_ - 32-byte block hash

#### Returns

`result`: _array_ of _strings_ - list of validator addresses

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_getValidatorsByBlockHash","params":["0xbae7d3feafd743343b9a4c578cab5e5d65eb735f6855fb845c00cab356331256"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"ibft_getValidatorsByBlockHash","params":["0xbae7d3feafd743343b9a4c578cab5e5d65eb735f6855fb845c00cab356331256"], "id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    "0x42d4287eac8078828cf5f3486cfe601a275a49a5",
    "0xb1b2bc9582d2901afdc579f528a35ca41403fa85",
    "0xef1bfb6a12794615c9b0b5a21e6741f01e570185"
  ]
}
```

</TabItem>

</Tabs>

### `ibft_getValidatorsByBlockNumber`

Lists the validators defined in the specified block.

#### Parameters

`blockNumber`: _string_ - hexadecimal integer representing a block number, or one of the
string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
[block parameter](../../public-networks/how-to/use-besu-api/json-rpc.md#block-parameter)

:::note
`pending` returns the same value as `latest`.
:::

#### Returns

`result`: _array_ of _strings_ - list of validator addresses

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_getValidatorsByBlockNumber","params":["latest"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"ibft_getValidatorsByBlockNumber","params":["latest"], "id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    "0x42d4287eac8078828cf5f3486cfe601a275a49a5",
    "0xb1b2bc9582d2901afdc579f528a35ca41403fa85",
    "0xef1bfb6a12794615c9b0b5a21e6741f01e570185"
  ]
}
```

</TabItem>

</Tabs>

### `ibft_proposeValidatorVote`

Proposes to [add or remove a validator] with the specified address.

#### Parameters

- `address`: _string_ - account address

- `proposal`: _boolean_ - `true` to propose adding validator or `false` to propose removing validator

#### Returns

`result`: _boolean_ - `true`

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_proposeValidatorVote","params":["42d4287eac8078828cf5f3486cfe601a275a49a5",true], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"ibft_proposeValidatorVote","params":["42d4287eac8078828cf5f3486cfe601a275a49a5",true], "id":1}
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

## `PERM` (Permissioning) methods

The `PERM` API methods provide permissioning functionality. Use these methods for [local permissioning](../how-to/use-local-permissioning.md) only.

:::important

The `PERM` API methods are not enabled by default for JSON-RPC. To enable the `PERM` API methods, use the [`--rpc-http-api`](../../public-networks/reference/cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../../public-networks/reference/cli/options.md#rpc-ws-api) CLI options.

:::

### `perm_addAccountsToAllowlist`

Adds accounts (participants) to the [accounts permission list](../how-to/use-local-permissioning.md#account-allowlisting).

#### Parameters

`addresses`: _array_ of _strings_ - list of account addresses

:::note

The parameters list contains a list which is why the account addresses are enclosed by double square brackets.

:::

#### Returns

`result`: _string_ - `Success` or `error` (errors include attempting to add accounts already on the allowlist and including invalid account addresses.)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"perm_addAccountsToAllowlist","params":[["0xb9b81ee349c3807e46bc71aa2632203c5b462032", "0xb9b81ee349c3807e46bc71aa2632203c5b462034"]], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"perm_addAccountsToAllowlist","params":[["0xb9b81ee349c3807e46bc71aa2632203c5b462032", "0xb9b81ee349c3807e46bc71aa2632203c5b462034"]], "id":1}
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

### `perm_addNodesToAllowlist`

Adds nodes to the [nodes allowlist](../how-to/use-local-permissioning.md#node-allowlisting).

To use domain names in enode URLs, ensure you [enable DNS support](../../public-networks/concepts/node-keys.md#domain-name-support) to avoid receiving a `request contains an invalid node` error.

:::warning

Enode URL domain name support is an early access feature.

:::

#### Parameters

`enodes`: _array_ of _strings_ - list of [enode URLs](../../public-networks/concepts/node-keys.md#enode-url)

:::note

The parameters list contains a list which is why the enode URLs are enclosed by double square brackets.

:::

#### Returns

`result`: _string_ - `Success` or `error`; errors include attempting to add nodes already on the allowlist or including invalid enode URLs.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"perm_addNodesToAllowlist","params":[["enode://7e4ef30e9ec683f26ad76ffca5b5148fa7a6575f4cfad4eb0f52f9c3d8335f4a9b6f9e66fcc73ef95ed7a2a52784d4f372e7750ac8ae0b544309a5b391a23dd7@127.0.0.1:30303","enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"]], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"perm_addNodesToAllowlist","params":[["enode://7e4ef30e9ec683f26ad76ffca5b5148fa7a6575f4cfad4eb0f52f9c3d8335f4a9b6f9e66fcc73ef95ed7a2a52784d4f372e7750ac8ae0b544309a5b391a23dd7@127.0.0.1:30303","enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"]], "id":1}
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

### `perm_getAccountsAllowlist`

Lists accounts (participants) in the [accounts permissions list](../how-to/use-local-permissioning.md#account-allowlisting).

#### Parameters

None

#### Returns

`result`: _array_ of _strings_ - list of accounts (participants) in the accounts allowlist

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"perm_getAccountsAllowlist","params":[], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"perm_getAccountsAllowlist","params":[], "id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    "0x0000000000000000000000000000000000000009",
    "0xb9b81ee349c3807e46bc71aa2632203c5b462033"
  ]
}
```

</TabItem>

</Tabs>

### `perm_getNodesAllowlist`

Lists nodes in the [nodes allowlist](../how-to/use-local-permissioning.md#node-allowlisting).

#### Parameters

None

#### Returns

`result`: _array_ of _strings_ - [enode URLs](../../public-networks/concepts/node-keys.md#enode-url) of nodes in the nodes allowlist

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"perm_getNodesAllowlist","params":[], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"perm_getNodesAllowlist","params":[], "id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    "enode://7b61d5ee4b44335873e6912cb5dd3e3877c860ba21417c9b9ef1f7e500a82213737d4b269046d0669fb2299a234ca03443f25fe5f706b693b3669e5c92478ade@127.0.0.1:30305",
    "enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"
  ]
}
```

</TabItem>

</Tabs>

### `perm_reloadPermissionsFromFile`

Reloads the accounts and nodes allowlists from the [permissions configuration file].

#### Parameters

None

#### Returns

`result`: _string_ - `Success`, or `error` if the permissions configuration file is not valid

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"perm_reloadPermissionsFromFile","params":[], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"perm_reloadPermissionsFromFile","params":[], "id":1}
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

### `perm_removeAccountsFromAllowlist`

Removes accounts (participants) from the [accounts permissions list](../how-to/use-local-permissioning.md#account-allowlisting).

#### Parameters

`addresses`: _array_ of _strings_ - list of account addresses

:::note

The parameters list contains a list which is why the account addresses are enclosed by double square brackets.

:::

#### Returns

`result`: _string_ - `Success` or `error` (errors include attempting to remove accounts not on the allowlist and including invalid account addresses.)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"perm_removeAccountsFromAllowlist","params":[["0xb9b81ee349c3807e46bc71aa2632203c5b462032", "0xb9b81ee349c3807e46bc71aa2632203c5b462034"]], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"perm_removeAccountsFromAllowlist","params":[["0xb9b81ee349c3807e46bc71aa2632203c5b462032", "0xb9b81ee349c3807e46bc71aa2632203c5b462034"]], "id":1}
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

### `perm_removeNodesFromAllowlist`

Removes nodes from the [nodes allowlist](../how-to/use-local-permissioning.md#node-allowlisting).

#### Parameters

`enodes`: _array_ of _strings_ - list of [enode URLs](../../public-networks/concepts/node-keys.md#enode-url)

:::note

The parameters list contains a list which is why the enode URLs are enclosed by double square brackets.

:::

#### Returns

`result`: _string_ - `Success` or `error` (errors include attempting to remove nodes not on the allowlist and including invalid enode URLs.)

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"perm_removeNodesFromAllowlist","params":[["enode://7e4ef30e9ec683f26ad76ffca5b5148fa7a6575f4cfad4eb0f52f9c3d8335f4a9b6f9e66fcc73ef95ed7a2a52784d4f372e7750ac8ae0b544309a5b391a23dd7@127.0.0.1:30303","enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"]], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"perm_removeNodesFromAllowlist","params":[["enode://7e4ef30e9ec683f26ad76ffca5b5148fa7a6575f4cfad4eb0f52f9c3d8335f4a9b6f9e66fcc73ef95ed7a2a52784d4f372e7750ac8ae0b544309a5b391a23dd7@127.0.0.1:30303","enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"]], "id":1}
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

## `QBFT` methods

The `QBFT` API methods provide access to the [QBFT](../how-to/configure/consensus/qbft.md) consensus engine.

:::note

The `QBFT` API methods are not enabled by default for JSON-RPC. To enable the `QBFT` API methods, use the [`--rpc-http-api`](../../public-networks/reference/cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../../public-networks/reference/cli/options.md#rpc-ws-api) options.

:::

### `qbft_discardValidatorVote`

Discards a proposal to [add or remove a validator](../how-to/configure/consensus/qbft.md#add-and-remove-validators) with the specified address.

#### Parameters

`address`: _string_ - 20-byte address of proposed validator

#### Returns

`result`: _boolean_ - indicates if the proposal is discarded

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"qbft_discardValidatorVote","params":["0xef1bfb6a12794615c9b0b5a21e6741f01e570185"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"qbft_discardValidatorVote","params":["0xef1bfb6a12794615c9b0b5a21e6741f01e570185"], "id":1}
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

### `qbft_getPendingVotes`

Returns [votes](../how-to/configure/consensus/qbft.md#add-and-remove-validators) cast in the current [epoch](../how-to/configure/consensus/qbft.md#genesis-file).

#### Parameters

None

#### Returns

`result`: _map_ of _strings_ to _booleans_ - map of account addresses to corresponding boolean values indicating the vote for each account; if `true`, the vote is to add a validator. If `false`, the proposal is to remove a validator.

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"qbft_getPendingVotes","params":[], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"qbft_getPendingVotes","params":[], "id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "0xef1bfb6a12794615c9b0b5a21e6741f01e570185": true,
    "0x42d4287eac8078828cf5f3486cfe601a275a49a5": true
  }
}
```

</TabItem>

</Tabs>

### `qbft_getSignerMetrics`

Provides the following validator metrics for the specified range:

- Number of blocks from each validator

- Block number of the last block proposed by each validator (if any proposed in the specified range)

- All validators present in the last block of the range

#### Parameters

- `fromBlockNumber`: _string_ - hexadecimal integer representing a block number, or one
  of the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../public-networks/how-to/use-besu-api/json-rpc.md#block-parameter)

- `toBlockNumber`: _string_ - hexadecimal integer representing a block number, or one of
  the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in
  [block parameter](../../public-networks/how-to/use-besu-api/json-rpc.md#block-parameter)

:::note
`pending` returns the same value as `latest`.
:::

If you specify:

- No parameters, the call provides metrics for the last 100 blocks, or all blocks if there are less than 100 blocks.

- Only the first parameter, the call provides metrics for all blocks from the block specified to the latest block.

#### Returns

`result`: _array_ of _objects_ - list of validator objects

:::note

The proposer of the genesis block has address `0x0000000000000000000000000000000000000000`.

:::

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"qbft_getSignerMetrics","params":["1", "100"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```bash
{"jsonrpc":"2.0","method":"qbft_getSignerMetrics","params":["1", "100"], "id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "address": "0x7ffc57839b00206d1ad20c69a1981b489f772031",
      "proposedBlockCount": "0x21",
      "lastProposedBlockNumber": "0x61"
    },
    {
      "address": "0x42eb768f2244c8811c63729a21a3569731535f06",
      "proposedBlockCount": "0x21",
      "lastProposedBlockNumber": "0x63"
    },
    {
      "address": "0xb279182d99e65703f0076e4812653aab85fca0f0",
      "proposedBlockCount": "0x21",
      "lastProposedBlockNumber": "0x62"
    }
  ]
}
```

</TabItem>

</Tabs>

### `qbft_getValidatorsByBlockHash`

Lists the validators defined in the specified block.

#### Parameters

`block`: _string_ - 32-byte block hash

#### Returns

`result`: _array_ of _strings_ - list of validator addresses

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"qbft_getValidatorsByBlockHash","params":["0xbae7d3feafd743343b9a4c578cab5e5d65eb735f6855fb845c00cab356331256"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"qbft_getValidatorsByBlockHash","params":["0xbae7d3feafd743343b9a4c578cab5e5d65eb735f6855fb845c00cab356331256"], "id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    "0x42d4287eac8078828cf5f3486cfe601a275a49a5",
    "0xb1b2bc9582d2901afdc579f528a35ca41403fa85",
    "0xef1bfb6a12794615c9b0b5a21e6741f01e570185"
  ]
}
```

</TabItem>

</Tabs>

### `qbft_getValidatorsByBlockNumber`

Lists the validators for the specified block.

For all blocks up to the chain head block this method returns the validators that were used at the time the block was produced.

Use `blockNumber` to get the list of validators for that block.

For the chain head block there are two validator lists associated with it:

1. The validators that were used at the time the block was produced. This list is returned by passing `latest` as the input parameter.
2. The validators that will be used to produce the next block. This list is returned by passing `pending` as the input parameter.

In most instances the two lists for the chain head block are the same. However, when voting has completed to add or remove a validator, the validators that will be used to produce the next block are different. Comparing the two lists can be helpful when diagnosing a stalled chain.

:::note
When the validator list changes, an `INFO` log message displays, showing the previous list of validators and the new list of validators.
:::

#### Parameters

- `blockNumber`: _string_ - hexadecimal integer representing a block number, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or `safe`, as described in [block parameter](../../public-networks/how-to/use-besu-api/json-rpc.md#block-parameter)

#### Returns

`result`: _array_ of _strings_ - list of validator addresses

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"qbft_getValidatorsByBlockNumber","params":["latest"], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"qbft_getValidatorsByBlockNumber","params":["latest"], "id":1}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    "0x42d4287eac8078828cf5f3486cfe601a275a49a5",
    "0xb1b2bc9582d2901afdc579f528a35ca41403fa85",
    "0xef1bfb6a12794615c9b0b5a21e6741f01e570185"
  ]
}
```

</TabItem>

</Tabs>

### `qbft_proposeValidatorVote`

Proposes to [add or remove a validator](../how-to/configure/consensus/qbft.md#add-and-remove-validators) with the specified address.

#### Parameters

- `address`: _string_ - account address

- `proposal`: _boolean_ - `true` to propose adding validator or `false` to propose removing validator

#### Returns

`result`: _boolean_ - `true`

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"qbft_proposeValidatorVote","params":["42d4287eac8078828cf5f3486cfe601a275a49a5",true], "id":1}' http://127.0.0.1:8545/ -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```bash
{"jsonrpc":"2.0","method":"qbft_proposeValidatorVote","params":["42d4287eac8078828cf5f3486cfe601a275a49a5",true], "id":1}
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

<!-- Links -->

[add or remove a validator]: ../how-to/configure/consensus/ibft.md#add-and-remove-validators
[permissions configuration file]: ../how-to/use-local-permissioning.md#permissions-configuration-file
