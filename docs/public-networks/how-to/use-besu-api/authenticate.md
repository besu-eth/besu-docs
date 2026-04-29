---
title: Authenticate over JSON-RPC requests
sidebar_position: 4
description: Besu authentication and authorization for JSON-RPC
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Authenticate and authorize JSON-RPC

Authentication identifies a user, and authorization verifies user access to requested JSON-RPC methods. Besu verifies users using
[JSON Web Tokens (JWT)](https://jwt.io/introduction/).

Besu supports two mutually exclusive authentication methods:

- [Username and password](#username-and-password-authentication)
- [JWT public key](#jwt-public-key-authentication).

Besu creates JWT internally with [username and password authentication](#username-and-password-authentication), and externally with [JWT public key authentication](#jwt-public-key-authentication).

:::info

Using JSON-RPC authentication and authorization with [MetaMask](https://metamask.io/) is not supported.

:::

:::caution

To prevent interception of authentication credentials and authenticated tokens, make authenticated requests over HTTPS. We recommend running production deployments behind a network layer that provides SSL termination. Besu does not provide a HTTPS connection natively.

:::

## Username and password authentication

Enable authentication from the command line. Supply the credentials file and send a request to the `/login` endpoint using the username and password. The `/login` endpoint creates a JWT for making permitted JSON-RPC requests.

Using [public key authentication](#jwt-public-key-authentication) disables the `/login` endpoint.

### 1. Create the credentials file

The `toml` credentials file defines user details and the JSON-RPC methods they can access.

```toml title="auth.toml"
[Users.username1]
password = "$2a$10$l3GA7K8g6rJ/Yv.YFSygCuI9byngpEzxgWS9qEg5emYDZomQW7fGC"
permissions=["net:*","eth:blockNumber"]

[Users.username2]
password = "$2b$10$6sHt1J0MVUGIoNKvJiK33uaZzUwNmMmJlaVLkIwinkPiS1UBnAnF2"
permissions=["net:version","admin:*"]
```

Each user requiring JSON-RPC access the configuration file lists the:

- Username. `Users.` is mandatory and followed by the username. That is, replace `<username>` in `[Users.<username>]` with the username.
- Hash of the user password. Use the [`password hash`](../../reference/cli/subcommands.md#password) subcommand to generate the hash.
- [JSON-RPC permissions](#json-rpc-permissions).

<Tabs>

<TabItem value="Command" label="Command" default>

```bash
besu password hash --password=MyPassword
```

</TabItem>

<TabItem value="Hash output" label="Hash output">

```text
$2a$10$L3Xb5G/AJOsEK5SuOn9uzOhpCCfuVWTajc5hwWerY6N5xBM/xlrMK
```

</TabItem>

</Tabs>

### 2. Enable authentication

Enable authentication for the JSON-RPC API using the
[`--rpc-http-authentication-enabled`](../../reference/cli/options.md#rpc-http-authentication-enabled)
or [`--rpc-ws-authentication-enabled`](../../reference/cli/options.md#rpc-ws-authentication-enabled) option.

Specify the [credentials file](#1-create-the-credentials-file) using the
[`--rpc-http-authentication-credentials-file`](../../reference/cli/options.md#rpc-http-authentication-credentials-file)
or [`--rpc-ws-authentication-credentials-file`](../../reference/cli/options.md#rpc-ws-authentication-credentials-file) option.

:::note
With authentication enabled, you can specify methods that don't require authentication using
[`--rpc-http-api-methods-no-auth`](../../reference/cli/options.md#rpc-http-api-methods-no-auth) or
[`--rpc-ws-api-methods-no-auth`](../../reference/cli/options.md#rpc-ws-api-methods-no-auth).
:::

### 3. Generate an authentication token

To generate an authentication token, make a request to the `/login` endpoint with your username and password. Specify the HTTP port or the WS port to generate a token to authenticate over HTTP or WS respectively. HTTP and WS requires a different token.

<Tabs>

<TabItem value="Generate a token for HTTP" label="Generate a token for HTTP" default>

```bash
curl -X POST --data '{"username":"username1","password":"MyPassword"}' <JSON-RPC-http-hostname:http-port>/login
```

</TabItem>

<TabItem value="Example for HTTP" label="Example for HTTP">

```bash
curl -X POST --data '{"username":"username1","password":"MyPassword"}' http://localhost:8545/login
```

</TabItem>

<TabItem value="Generate a token for WS" label="Generate a token for WS">

```bash
curl -X POST --data '{"username":"username1","password":"MyPassword"}' <JSON-RPC-ws-hostname:ws-port>/login
```

</TabItem>

<TabItem value="Example for WS" label="Example for WS">

```bash
curl -X POST --data '{"username":"username1","password":"MyPassword"}' http://localhost:8546/login
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwZXJtaXNzaW9ucyI6WyIqOioiXSwidXNlcm5hbWUiOiJ1c2VyMiIsImlhdCI6MTU1MDQ2MDYwNCwiZXhwIjoxNTUwNDYwOTA0fQ.l2Ycqzl_AyvReXBeUSayOlOMS_E8-DCuz3q0Db0DKD7mqyl6q-giWoEtfdWzUEvZbRRi2_ecKO3N6JkXq7zMKQAJbVAEzobfbaaXWcQEpHOjtnK4_Yz-UPyKiXtu7HGdcdl5Tfx3dKoksbqkBl3U3vFWxzmFnuu3dAISfVJYUNA"
}
```

</TabItem>

</Tabs>

Authentication tokens expire five minutes after generation. If you require access after the token expires, you need to generate a new token.

## JWT public key authentication

Enable authentication from the command line and supply the external JWT provider's public key.

:::caution

JWT public authentication disables the Besu `/login` endpoint, meaning [username and password authentication](#username-and-password-authentication) will not work.

:::

### 1. Generate a private and public key pair

The private and accompanying public key files must be in `.pem` format.

The [key algorithm](https://datatracker.ietf.org/doc/html/rfc7518#section-3.1) can be:

- RSA with private key length of at least 2048 bits using algorithm `RS256`, `RS384`, or `RS512`.
- ECDSA private key, using `ES256` (`secp256r1` or `secp256k1`), `ES384`, or `ES512`.

The default value for Besu is `RS256`.
When you use a different key algorithm, you must specify the
[`--rcp-http-authentication-jwt-algorithm`](../../reference/cli/options.md#rpc-http-authentication-jwt-algorithm)
option and/or the
[`--rcp-ws-authentication-jwt-algorithm`](../../reference/cli/options.md#rpc-ws-authentication-jwt-algorithm)
option depending on your needs.

<Tabs>
<TabItem value="RS256 RSA Keys" label="RS256 RSA Keys" default>

1. Generate the private key:

   ```bash
   openssl genrsa -out privateRSAKey.pem 2048
   ```

2. Generate the public key:

   ```bash
   openssl rsa -pubout -in privateRSAKey.pem -pubout -out publicRSAKey.pem
   ```

</TabItem>

<TabItem value="ES256 secp256r1 ECDSA Keys" label="ES256 secp256r1 ECDSA Keys">

1.  Generate the private key:

    ```bash
    openssl ecparam -name secp256r1 -genkey -out privateECDSAKey.pem
    ```

2.  Generate the public key:

    ```bash
    openssl ec -in privateECDSAKey.pem -pubout -out publicECDSAKey.pem
    ```

</TabItem>

</Tabs>

:::danger Private key security

The private key must be kept secret. Never share private keys publicly or on a Web site, even if advertised as secure.
<!-- markdown-link-check-disable -->
Always keep your private keys safe -- ideally using [hardware](https://connect2id.com/products/nimbus-jose-jwt/examples/pkcs11) or [vault](https://www.vaultproject.io/docs/secrets/identity/identity-token) -- and define a strong security policy and
[best practices](https://auth0.com/docs/secure/tokens/token-best-practices).
<!-- markdown-link-check-enable -->
Compromised keys can provide attackers access to your node's RPC-API.

:::

### 2. Create the JWT

Create the JWT using a trusted authentication provider[^1] or [library](https://jwt.io/libraries) in your own code.

[^1]: for example [Auth0](https://auth0.com/) or [Keycloak](https://www.keycloak.org/)

See [Java code sample to generate JWT using Vertx](https://github.com/NicolasMassart/java-jwt-sample-generation/) for an example implementation.

:::caution Important

The JWT must use one of the `RS256`, `RS384`, `RS512`, `ES256`, `ES384`, or `ES512` algorithms.

:::

Each payload for the JWT must contain:

- [JSON-RPC permissions](#json-rpc-permissions)
- [`exp` (Expiration Time) claim](https://tools.ietf.org/html/rfc7519#section-4.1.4)

<Tabs>

<TabItem value="Example JSON Payload" label="Example JSON Payload" default>

```json
{
  "permissions": ["*:*"],
  "exp": 1600899999002
}
```

</TabItem>

<TabItem value="Example JWT result" label="Example JWT result">

![Example result](jwt.png)

</TabItem>

</Tabs>

### 3. Enable authentication

Enable authentication for the JSON-RPC API using the
[`--rpc-http-authentication-enabled`](../../reference/cli/options.md#rpc-http-authentication-enabled)
or [`--rpc-ws-authentication-enabled`](../../reference/cli/options.md#rpc-ws-authentication-enabled) option.

Specify the JWT provider's public key file to use with the externally created JWT, using the
[`--rpc-http-authentication-jwt-public-key-file`](../../reference/cli/options.md#rpc-http-authentication-jwt-public-key-file)
or [`--rpc-ws-authentication-jwt-public-key-file`](../../reference/cli/options.md#rpc-ws-authentication-jwt-public-key-file) option.

:::note
With authentication enabled, you can specify methods that don't require authentication using
[`--rpc-http-api-methods-no-auth`](../../reference/cli/options.md#rpc-http-api-methods-no-auth) or
[`--rpc-ws-api-methods-no-auth`](../../reference/cli/options.md#rpc-ws-api-methods-no-auth).
:::

## JSON-RPC permissions

Each user has a list of permissions strings defining the methods they can access. To give access to:

- All API methods, specify `["*:*"]`.
- All API methods in an API group, specify `["<api_group>:*"]`. For example, `["eth:*"]`.
- Specific API methods, specify `["<api_group>:<method_name>"]`. For example, `["admin:peers"]`.

With authentication enabled, to explicitly specify a user cannot access any methods, include the user with an empty permissions list (`[]`). Users with an empty permissions list and users not included in the credentials file cannot access any JSON-RPC methods.

## Use an authentication token to make requests

Specify the authentication token as a `Bearer` token in the JSON-RPC request header.

### Postman

In the **Authorization** tab in the **TYPE** drop-down list, select **Bearer Token** and specify the token (generated either [externally](#2-create-the-jwt) or by the [`login` request](#3-generate-an-authentication-token)).

### cURL

Specify the `Bearer` in the header.

<Tabs>

<TabItem value="cURL Request with authentication placeholders" label="cURL Request with authentication placeholders" default>

```bash
curl -X POST -H 'Authorization: Bearer <JWT_TOKEN>' -d '{"jsonrpc":"2.0","method":"<API_METHOD>","params":[],"id":1}' <JSON-RPC-http-hostname:port> -H "Content-Type: application/json"
```

</TabItem>

<TabItem value="cURL Request with authentication" label="cURL Request with authentication">

```bash
curl -X POST -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwZXJtaXNzaW9ucyI6WyIqOioiXSwidXNlcm5hbWUiOiJ1c2VyMiIsImlhdCI6MTU1MDQ2MTQxNiwiZXhwIjoxNTUwNDYxNzE2fQ.WQ1mqpqzRLHaoL8gOSEZPvnRs_qf6j__7A3Sg8vf9RKvWdNTww_vRJF1gjcVy-FFh96AchVnQyXVx0aNUz9O0txt8VN3jqABVWbGMfSk2T_CFdSw5aDjuriCsves9BQpP70Vhj-tseaudg-XU5hCokX0tChbAqd9fB2138zYm5M' -d '{"jsonrpc":"2.0","method":"net_listening","params":[],"id":1}' http://localhost:8545/ -H "Content-Type: application/json"
```

</TabItem>

</Tabs>
