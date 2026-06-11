---
sidebar_position: 4
description: Observe Besu activity and expose plugin metrics.
---

# Events and metrics

Observe Besu activity using events, and expose plugin state through Besu's metrics system.

## Events

[`BesuEvents`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/BesuEvents.html) lets plugins observe the following events:

- Block propagation.
- Block additions.
- Block reorganizations.
- Initial sync completion and restart.
- Transaction additions and drops.
- Sync status changes.
- Log emissions filtered by address and topics.
- Bad blocks.

Register event listeners in `start` and remove them in `stop`.

```java
private long listenerId;

@Override
public void start() {
  serviceManager
      .getService(BesuEvents.class)
      .ifPresent(events -> listenerId = events.addBlockAddedListener(context -> {}));
}

@Override
public void stop() {
  serviceManager
      .getService(BesuEvents.class)
      .ifPresent(events -> events.removeBlockAddedListener(listenerId));
}
```

Events are useful for plugins that forward Besu activity to external systems, collect
operational data, or react to chain activity.

## Metrics

Use [`MetricCategoryRegistry`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/metrics/MetricCategoryRegistry.html) to add a metric category, and use [`MetricsSystem`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/MetricsSystem.html) to create counters,
gauges, timers, histograms, summaries, and cache collectors.

`MetricsSystem` also exposes enabled metric categories, so plugins can check whether their category
is enabled before doing extra metrics work.

For example, register a plugin metric category during startup, then create a counter when metrics
are available:

```java
private static final MetricCategory EXAMPLE_CATEGORY =
    new MetricCategory() {
      @Override
      public String getName() {
        return "EXAMPLE";
      }

      @Override
      public Optional<String> getApplicationPrefix() {
        return Optional.empty();
      }
    };

@Override
public void register(final ServiceManager serviceManager) {
  this.serviceManager = serviceManager;
  serviceManager
      .getService(MetricCategoryRegistry.class)
      .ifPresent(registry -> registry.addMetricCategory(EXAMPLE_CATEGORY));
}

@Override
public void start() {
  serviceManager
      .getService(MetricsSystem.class)
      .ifPresent(
          metrics -> {
            Counter blocksSeen =
                metrics.createCounter(EXAMPLE_CATEGORY, "blocks_seen", "Blocks seen by plugin");
            blocksSeen.inc();
          });
}
```
