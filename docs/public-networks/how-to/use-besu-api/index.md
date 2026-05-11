---
description: Besu API
---

# Access the Besu API

Access the [Besu API](../../reference/api/index.md) using:

- [JSON-RPC over HTTP, WebSocket, or IPC](json-rpc.md)
- [RPC Pub/Sub over WebSockets and IPC](rpc-pubsub.md)
- [GraphQL over HTTP](graphql.md).

:::note

HTTP and WebSocket responses are compact JSON by default. You can use [`--json-pretty-print-enabled`](../../reference/cli/options.md#json-pretty-print-enabled) to pretty-print the output.

:::

The following sections provide information about JSON-RPC, RPC Pub/Sub, and GraphQL.

## Enable API access

To enable API access, use the [`--rpc-http-enabled`](../../reference/cli/options.md#rpc-http-enabled), [`--rpc-ws-enabled`](../../reference/cli/options.md#rpc-ws-enabled), [`--graphql-http-enabled`](../../reference/cli/options.md#graphql-http-enabled), or the early access `--Xrpc-ipc-enabled` options.

:::caution

`--Xrpc-ipc-enabled` is an early access option.

:::

## Service hosts

To specify the host the API service listens on, use the [`--rpc-http-host`](../../reference/cli/options.md#rpc-http-host), [`--rpc-ws-host`](../../reference/cli/options.md#rpc-ws-host), and [`--graphql-http-host`](../../reference/cli/options.md#graphql-http-host) options. The default host is `127.0.0.1`.

To allow remote connections, set the host to `0.0.0.0`.

:::caution

Setting the host to `0.0.0.0` exposes the API service connection on your node to any remote connection. In a production environment, ensure you use a firewall to avoid exposing your node to the internet.

:::

## Service ports

To specify the port the API service listens on, use the [`--rpc-http-port`](../../reference/cli/options.md#rpc-http-port), [`--rpc-ws-port`](../../reference/cli/options.md#rpc-ws-port), and [`--graphql-http-port`](../../reference/cli/options.md#graphql-http-port) options.

The default ports are:

- 8545 for JSON-RPC over HTTP.
- 8546 for JSON-RPC over WebSocket.
- 8547 for GraphQL over HTTP.

Ports must be [exposed appropriately](../connect/configure-ports.md).

## Socket path

To specify the socket path for the IPC socket, use the `--Xrpc-ipc-path` option. The default path is `besu.ipc` in the Besu data directory.

:::caution

`--Xrpc-ipc-path` is an early access option.

:::

## Host allowlist

To prevent DNS rebinding attacks, Besu checks incoming HTTP request host headers, WebSocket connections, and GraphQL requests. Besu accepts requests only when hostnames specified using the [`--host-allowlist`](../../reference/cli/options.md#host-allowlist) option matches the request host headers. By default, Besu accepts requests and connections from `localhost` and `127.0.0.1`.

:::info

This isn't a permissioning feature. To restrict access to the API, we recommend using the [Besu authentication mechanism](authenticate.md) with username and password authentication or JWT public key authentication.

:::

If your application publishes RPC ports, specify the hostnames when starting Besu.

```bash
besu --host-allowlist=example.com
```

Specify `*` for `--host-allowlist` to effectively disable host protection.

:::caution

Specifying `*` for `--host-allowlist` is not recommended for production code.

:::

## Not supported by Besu

### Account management

Account management relies on private key management in the client, which is not supported by Besu.

To send signed transactions, use [`eth_sendRawTransaction`](../../reference/api/index.md#eth_sendrawtransaction). `eth_sendTransaction` is not implemented.

For [account management](../send-transactions.md#use-wallets-for-key-management), use third-party wallets.

### Protocols

Besu does not support the Whisper and Swarm protocols.
