---
sidebar_position: 4
description: Test a plugin.
---

# Test a plugin

Test plugin behavior at the same boundaries Besu uses to run the plugin: lifecycle callbacks,
service retrieval, runtime effects, and shutdown cleanup.

## Unit test lifecycle code

Use `ServiceManager.SimpleServiceManager` to unit test code that retrieves Plugin API services.
Add only the services the test needs, then call the lifecycle method under test.

Test that the plugin:

- Stores `ServiceManager` in `register()`.
- Handles missing optional services.
- Registers early extension points in `register()`.
- Starts runtime work in `start()`.
- Removes listeners and stops background work in `stop()`.

## Test feature behavior

Choose tests that match the plugin feature:

- For custom RPC endpoints, verify the registered namespace, function name, parameters, and return
  value.
- For events, verify that listeners are registered and removed.
- For metrics, verify that metric categories and metric handles are created as expected.
- For configuration, verify valid values, invalid values, and reloadable values.
- For transaction, storage, permissioning, or tracing plugins, test the service integration points
  your plugin registers.

## Run the plugin with Besu

Add at least one startup test that runs Besu with the packaged plugin JAR. This catches service
provider registration, dependency packaging, plugin verification, and lifecycle timing issues that
unit tests can miss.
