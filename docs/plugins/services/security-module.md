---
sidebar_position: 7
description: Integrate custom signing and security modules.
---

# Security module

Use [`SecurityModuleService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/SecurityModuleService.html) to register a named security module.

The service exposes:

- `register(name, securityModuleSupplier)` to register a security module supplier.
- `getByName(name)` to retrieve a registered security module supplier.

Security module plugins are useful when node key operations must be delegated to a custom
implementation, such as an HSM-backed implementation.

For example, register a custom security module supplier:

```java
@Override
public void register(final ServiceManager context) {
  this.serviceManager = context;
  serviceManager
      .getService(SecurityModuleService.class)
      .ifPresent(
          securityModules -> securityModules.register("example-hsm", () -> securityModule));
}
```

The plugin supplies the [`SecurityModule`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/securitymodule/SecurityModule.html) implementation.
