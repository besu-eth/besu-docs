---
sidebar_position: 3
description: Run unit tests and startup integration tests.
---

# Test a plugin

Test your plugin against the same lifecycle boundaries Besu uses: lifecycle callbacks, service
retrieval, runtime effects, and shutdown cleanup.

## Prerequisites

A completed Besu plugin.
See how to [set up a plugin project](set-up-a-plugin.md).

## Unit test lifecycle code

Use [`ServiceManager.SimpleServiceManager`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/ServiceManager.html) to unit test code that retrieves Plugin API services.
Add only the services the test needs, then call the lifecycle method under test.

```java
import org.hyperledger.besu.plugin.ServiceManager;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class ExamplePluginTest {

    @Test
    void register_storesServiceManager() {
        var serviceManager = new ServiceManager.SimpleServiceManager();
        var plugin = new ExamplePlugin();

        plugin.register(serviceManager);

        // Assert that the plugin stored the ServiceManager and registered any extension points.
    }

    @Test
    void register_handlesMissingOptionalService() {
        // Empty ServiceManager — the plugin must not throw when optional services are absent.
        var serviceManager = new ServiceManager.SimpleServiceManager();
        var plugin = new ExamplePlugin();

        assertDoesNotThrow(() -> plugin.register(serviceManager));
    }
}
```

Test that the plugin:

- Stores `ServiceManager` in `register`.
- Handles missing optional services without throwing.
- Registers early extension points in `register`.
- Starts runtime work in `start`.
- Removes listeners and stops background work in `stop`.

## Test feature behavior

Choose tests that match the plugin feature:

- For custom RPC endpoints, verify the registered namespace, function name, parameters, and return
  value.
- For events, verify that listeners are registered in `start` and removed in `stop`.
- For metrics, verify that metric categories and handles are created as expected.
- For configuration, verify valid values, invalid values, and reloadable values.
- For transaction pool, storage, permissioning, or tracing plugins, test the service integration
  points your plugin registers.

## Run the plugin with Besu

Add at least one startup test that runs Besu with the packaged plugin JAR.
This catches service provider registration, dependency packaging, plugin verification, and
lifecycle timing issues that unit tests can miss.

## Next steps

- [Deploy the plugin](deploy-a-plugin.md) to a Besu installation.
- [Troubleshoot](troubleshoot.md) common issues.
