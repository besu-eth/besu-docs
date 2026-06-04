---
sidebar_position: 3
description: Add custom JSON-RPC endpoints from a Besu plugin.
---

# Custom RPC endpoints

Use `RpcEndpointService` to register plugin functions as JSON-RPC methods.

## Register an endpoint

Register endpoints in `register(ServiceManager)`. The Plugin API requires endpoint registration
during `register()`, before Besu configures RPC endpoints. Besu does not call the handler before
`start()`.

```java
serviceManager
    .getService(RpcEndpointService.class)
    .ifPresent(
        rpc ->
            rpc.registerRPCEndpoint(
                "example",
                "status",
                request -> Map.of("status", "ok")));
```

Besu exposes the method as `<namespace>_<functionName>`. In this example, the JSON-RPC method is
`example_status`.

## Parameters and return values

`RpcEndpointService` passes a `PluginRpcRequest` to the handler. The request parameters are exposed
as strings. Complex input objects are not supported by the plugin RPC request interface.

The handler can return a Java object, primitive, or array. Besu serializes the return value to JSON
with Jackson. If the handler throws an exception, Besu returns an internal error.

For example, a handler can read string parameters from `PluginRpcRequest.getParams()`:

```java
rpc.registerRPCEndpoint(
    "example",
    "echo",
    request -> {
      Object[] params = request.getParams();
      return Map.of("message", params.length == 0 ? "" : params[0].toString());
    });
```

## Enable the namespace

Registering an endpoint is not enough. The plugin namespace must also be enabled on the HTTP or
WebSocket RPC API using
[`--rpc-http-api`](../../public-networks/reference/cli/options.md#rpc-http-api) or
[`--rpc-ws-api`](../../public-networks/reference/cli/options.md#rpc-ws-api).

If the endpoint is registered but the namespace is not enabled, JSON-RPC callers receive `Method not
found`.
