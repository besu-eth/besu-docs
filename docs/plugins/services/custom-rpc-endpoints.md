---
sidebar_position: 3
description: Add custom JSON-RPC endpoints.
---

# Custom RPC endpoints

Use [`RpcEndpointService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/RpcEndpointService.html) to register plugin functions as custom JSON-RPC methods.

## Register an endpoint

Register endpoints in `register(ServiceManager)`.
The Plugin API requires endpoint registration during `register`, before Besu configures RPC endpoints.
Besu does not call the handler before `start`.

```java
@Override
public void register(final ServiceManager serviceManager) {
  this.serviceManager = serviceManager;
  serviceManager
      .getService(RpcEndpointService.class)
      .ifPresent(
          rpc ->
              rpc.registerRPCEndpoint(
                  "example",
                  "status",
                  request -> Map.of("status", "ok")));
}
```

Besu exposes the method as `<namespace>_<functionName>`.
In this example, the JSON-RPC method is `example_status`.

## Parameters and return values

`RpcEndpointService` passes a [`PluginRpcRequest`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/rpc/PluginRpcRequest.html) to the handler.
The request parameters are exposed as strings.
Complex input objects are not supported by the plugin RPC request interface.

The handler can return a Java object, primitive, or array.
Besu serializes the return value to JSON.
If the handler throws an exception, Besu returns an internal error.

For example, a handler can read string parameters from `PluginRpcRequest.getParams`:

```java
@Override
public void register(final ServiceManager context) {
  this.serviceManager = context;
  serviceManager
      .getService(RpcEndpointService.class)
      .ifPresent(
          rpc ->
              rpc.registerRPCEndpoint(
                  "example",
                  "echo",
                  request -> {
                    Object[] params = request.getParams();
                    return Map.of("message", params.length == 0 ? "" : params[0].toString());
                  }));
}
```

## Enable the namespace

When you register a custom endpoint, you must also add the plugin namespace
to [`--rpc-http-api`](../../public-networks/reference/options.md#rpc-http-api) or
[`--rpc-ws-api`](../../public-networks/reference/options.md#rpc-ws-api) when starting Besu.
The namespace is matched case-insensitively, but uppercase is the convention.

For example, to enable the `example` namespace:

```bash
besu --rpc-http-enabled --rpc-http-api=ETH,NET,WEB3,EXAMPLE
```
