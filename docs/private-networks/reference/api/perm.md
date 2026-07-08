---
title: PERM methods
description: Besu PERM JSON-RPC API methods reference
sidebar_label: PERM
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `PERM` methods

The `PERM` API methods provide permissioning functionality.
Use these methods for [local permissioning](../../how-to/use-local-permissioning.md) only.

:::note

The `PERM` API is not enabled by default for JSON-RPC.
Enable it using the [`--rpc-http-api`](../../../public-networks/reference/cli/options.md#rpc-http-api) or
[`--rpc-ws-api`](../../../public-networks/reference/cli/options.md#rpc-ws-api) option.

:::

## `perm_addAccountsToAllowlist`

Adds accounts (participants) to the [accounts permission list](../../how-to/use-local-permissioning.md#account-allowlisting).

### Parameters

- `addresses`: _array_ of _strings_ - List of account addresses.

  :::note

  The parameters list contains a list, which is why the account addresses are enclosed by double square brackets.

  :::

### Returns

- `Success`, or `error` if the request fails (for example, if you attempt to add accounts already on the allowlist, or include invalid account addresses).

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "perm_addAccountsToAllowlist",
    "params": [
      [
        "0xb9b81ee349c3807e46bc71aa2632203c5b462032",
        "0xb9b81ee349c3807e46bc71aa2632203c5b462034"
      ]
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "perm_addAccountsToAllowlist",
  "params": [
    [
      "0xb9b81ee349c3807e46bc71aa2632203c5b462032",
      "0xb9b81ee349c3807e46bc71aa2632203c5b462034"
    ]
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
  "result": "Success"
}
```

</TabItem>

</Tabs>

---

## `perm_addNodesToAllowlist`

Adds nodes to the [nodes allowlist](../../how-to/use-local-permissioning.md#node-allowlisting).

To use domain names in enode URLs, [enable DNS support](../../../public-networks/concepts/node-keys.md#domain-name-support) to avoid receiving a `request contains an invalid node` error.

:::warning

Enode URL domain name support is an early access feature.

:::

### Parameters

- `enodes`: _array_ of _strings_ - List of [enode URLs](../../../public-networks/concepts/node-keys.md#enode-url).

  :::note

  The parameters list contains a list, which is why the enode URLs are enclosed by double square brackets.

  :::

### Returns

- `Success`, or `error` if the request fails (for example, if you attempt to add nodes already on the allowlist, or include invalid enode URLs).

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "perm_addNodesToAllowlist",
    "params": [
      [
        "enode://7e4ef30e9ec683f26ad76ffca5b5148fa7a6575f4cfad4eb0f52f9c3d8335f4a9b6f9e66fcc73ef95ed7a2a52784d4f372e7750ac8ae0b544309a5b391a23dd7@127.0.0.1:30303",
        "enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"
      ]
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "perm_addNodesToAllowlist",
  "params": [
    [
      "enode://7e4ef30e9ec683f26ad76ffca5b5148fa7a6575f4cfad4eb0f52f9c3d8335f4a9b6f9e66fcc73ef95ed7a2a52784d4f372e7750ac8ae0b544309a5b391a23dd7@127.0.0.1:30303",
      "enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"
    ]
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
  "result": "Success"
}
```

</TabItem>

</Tabs>

---

## `perm_getAccountsAllowlist`

Lists accounts (participants) in the [accounts permissions list](../../how-to/use-local-permissioning.md#account-allowlisting).

### Parameters

- None

### Returns

- List of accounts (participants) in the accounts allowlist.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "perm_getAccountsAllowlist",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "perm_getAccountsAllowlist",
  "params": [],
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
    "0x0000000000000000000000000000000000000009",
    "0xb9b81ee349c3807e46bc71aa2632203c5b462033"
  ]
}
```

</TabItem>

</Tabs>

---

## `perm_getNodesAllowlist`

Lists nodes in the [nodes allowlist](../../how-to/use-local-permissioning.md#node-allowlisting).

### Parameters

- None

### Returns

- [Enode URLs](../../../public-networks/concepts/node-keys.md#enode-url) of nodes in the nodes allowlist.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "perm_getNodesAllowlist",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "perm_getNodesAllowlist",
  "params": [],
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
    "enode://7b61d5ee4b44335873e6912cb5dd3e3877c860ba21417c9b9ef1f7e500a82213737d4b269046d0669fb2299a234ca03443f25fe5f706b693b3669e5c92478ade@127.0.0.1:30305",
    "enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"
  ]
}
```

</TabItem>

</Tabs>

---

## `perm_reloadPermissionsFromFile`

Reloads the accounts and nodes allowlists from the [permissions configuration file](../../how-to/use-local-permissioning.md#permissions-configuration-file).

### Parameters

- None

### Returns

- `Success`, or `error` if the permissions configuration file is not valid.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "perm_reloadPermissionsFromFile",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "perm_reloadPermissionsFromFile",
  "params": [],
  "id": 1
}
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

---

## `perm_removeAccountsFromAllowlist`

Removes accounts (participants) from the [accounts permissions list](../../how-to/use-local-permissioning.md#account-allowlisting).

### Parameters

- `addresses`: _array_ of _strings_ - List of account addresses.

  :::note

  The parameters list contains a list, which is why the account addresses are enclosed by double square brackets.

  :::

### Returns

- `Success`, or `error` if the request fails (for example, if you attempt to remove accounts not on the allowlist, or include invalid account addresses).

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "perm_removeAccountsFromAllowlist",
    "params": [
      [
        "0xb9b81ee349c3807e46bc71aa2632203c5b462032",
        "0xb9b81ee349c3807e46bc71aa2632203c5b462034"
      ]
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "perm_removeAccountsFromAllowlist",
  "params": [
    [
      "0xb9b81ee349c3807e46bc71aa2632203c5b462032",
      "0xb9b81ee349c3807e46bc71aa2632203c5b462034"
    ]
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
  "result": "Success"
}
```

</TabItem>

</Tabs>

---

## `perm_removeNodesFromAllowlist`

Removes nodes from the [nodes allowlist](../../how-to/use-local-permissioning.md#node-allowlisting).

### Parameters

- `enodes`: _array_ of _strings_ - List of [enode URLs](../../../public-networks/concepts/node-keys.md#enode-url).

  :::note

  The parameters list contains a list, which is why the enode URLs are enclosed by double square brackets.

  :::

### Returns

- `Success`, or `error` if the request fails (for example, if you attempt to remove nodes not on the allowlist, or include invalid enode URLs).

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "perm_removeNodesFromAllowlist",
    "params": [
      [
        "enode://7e4ef30e9ec683f26ad76ffca5b5148fa7a6575f4cfad4eb0f52f9c3d8335f4a9b6f9e66fcc73ef95ed7a2a52784d4f372e7750ac8ae0b544309a5b391a23dd7@127.0.0.1:30303",
        "enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"
      ]
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "perm_removeNodesFromAllowlist",
  "params": [
    [
      "enode://7e4ef30e9ec683f26ad76ffca5b5148fa7a6575f4cfad4eb0f52f9c3d8335f4a9b6f9e66fcc73ef95ed7a2a52784d4f372e7750ac8ae0b544309a5b391a23dd7@127.0.0.1:30303",
      "enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304"
    ]
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
  "result": "Success"
}
```

</TabItem>

</Tabs>
