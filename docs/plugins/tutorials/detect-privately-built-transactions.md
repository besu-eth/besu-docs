---
title: Detect privately built transactions
description: Build an end-to-end Besu plugin that flags transactions that never appeared in the public mempool.
sidebar_position: 1
---

# Detect privately built transactions

In this tutorial, you'll build a complete Besu plugin from scratch, deploy it to a node, and watch it report live results.

The plugin watches the transactions your node sees gossiped in the public mempool, compares them to the transactions that
arrive in each new block, and reports the difference.
A transaction that appears in a block but was never seen in the mempool was likely built privately, for example by a
maximal extractable value (MEV) builder that bypasses the public mempool.

:::note
This is a heuristic, not proof.
A transaction can be missing from your node's view of the mempool for other reasons, such as your node starting recently,
peering differences, or propagation timing.
The signal is most meaningful once your node is fully synced and following the chain head.
:::

## Prerequisites

- Java 25+.
  You can install Java using `brew install openjdk@25` or manually install the
  [Java JDK](https://www.oracle.com/java/technologies/downloads).
- [Gradle](https://gradle.org/install/).
- A [Besu installation](../../public-networks/get-started/install/index.md).
- A consensus client, for example [Teku](https://docs.teku.consensys.net/), to run alongside Besu.

## Steps

### 1. Set up your project

A Besu plugin is a standalone Java project.
Create a new directory for it:

```bash
mkdir -p tx-detection-plugin/src/main/java/txdetection
cd tx-detection-plugin
```

By the end of the tutorial, your project will have the following structure:

```text
tx-detection-plugin/
├── build.gradle
├── settings.gradle
└── src/
    └── main/
        └── java/
            └── txdetection/
                └── TxDetectionPlugin.java
```

### 2. Configure the build

Besu provides a [Gradle plugin](https://github.com/Consensys/besu-plugin-gradle-plugin) to simplify
the plugin developer experience.
It automatically adds and manages dependencies, and packages the plugin artifacts when you
distribute the project.

In the root of your project, create `build.gradle`.
Apply the latest version of the [Gradle plugin](https://github.com/Consensys/besu-plugin-gradle-plugin)
(`net.consensys.besu-plugin-distribution`) and set the Besu version you want to compile your plugin against:

```groovy title="build.gradle"
plugins {
    id 'net.consensys.besu-plugin-distribution' version '0.2.1'
}

besuPlugin {
    besuVersion = '26.6.0'
}
```

Create `settings.gradle` to name the project.
The name determines the distribution ZIP file name:

```groovy title="settings.gradle"
rootProject.name = 'tx-detection-plugin'
```

Generate the [Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) so the
project builds with a consistent Gradle version:

```bash
gradle wrapper
```

### 3. Create the plugin skeleton

Every plugin implements the [`BesuPlugin`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/BesuPlugin.html)
interface, which has three required methods: `register`, `start`, and `stop`.

Create `src/main/java/txdetection/TxDetectionPlugin.java` with the following skeleton:

```java title="TxDetectionPlugin.java"
package txdetection;

import com.google.auto.service.AutoService;
import org.hyperledger.besu.plugin.BesuPlugin;
import org.hyperledger.besu.plugin.ServiceManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@AutoService(BesuPlugin.class)
public class TxDetectionPlugin implements BesuPlugin {

  private static final Logger LOG = LoggerFactory.getLogger(TxDetectionPlugin.class);
  private static final String PLUGIN_NAME = "tx-detection";

  private ServiceManager serviceManager;

  @Override
  public String getName() {
    return PLUGIN_NAME;
  }

  @Override
  public void register(final ServiceManager serviceManager) {
    // Store the ServiceManager and register early extension points.
    this.serviceManager = serviceManager;
  }

  @Override
  public void start() {
    // Retrieve runtime services and begin work.
  }

  @Override
  public void stop() {
    // Remove listeners and release resources.
  }
}
```

The `@AutoService(BesuPlugin.class)` annotation generates the service provider entry that Besu's `ServiceLoader` 
uses to discover your plugin at startup.
Besu calls `register(ServiceManager)` once, early in startup, and passes the
[`ServiceManager`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/ServiceManager.html)
you use to access all Besu services.
Store it in a field for later use.

### 4. Track the mempool

Add a `Set` that records the hash of every transaction your node sees in the
mempool.

A busy node sees many transactions; use a bounded structure so memory usage stays constant.
The following uses a fixed-size `LinkedHashMap` that evicts the oldest entry once it reaches its capacity, 
wrapped to make it thread-safe because Besu fires events from multiple threads:

```java title="TxDetectionPlugin.java"
// highlight-start
import org.hyperledger.besu.datatypes.Hash;
import org.hyperledger.besu.datatypes.Transaction;
import org.hyperledger.besu.plugin.services.BesuEvents;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
// highlight-end

@AutoService(BesuPlugin.class)
public class TxDetectionPlugin
    implements BesuPlugin,
        // highlight-next-line
        BesuEvents.TransactionAddedListener {

  private static final Logger LOG = LoggerFactory.getLogger(TxDetectionPlugin.class);
  private static final String PLUGIN_NAME = "tx-detection";
  // highlight-next-line
  private static final int MAX_TRACKED_TRANSACTIONS = 100_000;

  private ServiceManager serviceManager;

  // highlight-start
  // Bounded, thread-safe set of transaction hashes seen in the mempool.
  private final Set<Hash> mempoolHashes =
      Collections.synchronizedSet(
          Collections.newSetFromMap(
              new LinkedHashMap<>() {
                @Override
                protected boolean removeEldestEntry(final Map.Entry<Hash, Boolean> eldest) {
                  return size() > MAX_TRACKED_TRANSACTIONS;
                }
              }));

  @Override
  public void onTransactionAdded(final Transaction transaction) {
    mempoolHashes.add(transaction.getHash());
  }
  // highlight-end
}
```

Implementing [`BesuEvents.TransactionAddedListener`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/BesuEvents.html)
lets the plugin receive a callback every time a transaction is added to the node.

### 5. Inspect new blocks

Add the block listener that detects unseen transactions.
For each new block that advances the chain head, count the transactions whose hash the plugin never recorded 
from the mempool:

```java title="TxDetectionPlugin.java"
// highlight-next-line
import org.hyperledger.besu.plugin.data.AddedBlockContext;

@AutoService(BesuPlugin.class)
public class TxDetectionPlugin
    implements BesuPlugin,
        BesuEvents.TransactionAddedListener,
        // highlight-next-line
        BesuEvents.BlockAddedListener {

  // ... fields and other methods ...

  // highlight-start
  // Number of unseen transactions in the most recent block.
  private volatile long detectedTxLastBlock;

  @Override
  public void onBlockAdded(final AddedBlockContext blockContext) {
    // Only consider blocks that advance the canonical chain head.
    if (blockContext.getEventType() != AddedBlockContext.EventType.HEAD_ADVANCED) {
      return;
    }

    long unseen =
        blockContext.getBlockBody().getTransactions().stream()
            .map(Transaction::getHash)
            .filter(hash -> !mempoolHashes.contains(hash))
            .count();

    detectedTxLastBlock = unseen;

    if (unseen > 0) {
      LOG.info(
          "Block {} contained {} transaction(s) not seen in the mempool",
          blockContext.getBlockHeader().getNumber(),
          unseen);
    }
  }
  // highlight-end
}
```

Filtering on `HEAD_ADVANCED` avoids double-counting transactions from forks and reorganizations.

### 6. Register a metric category

Logging is useful, but metrics let you track the results over time.
Register a metric category during `register`.

[`MetricCategoryRegistry`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/metrics/MetricCategoryRegistry.html)
must be used in `register`:

```java title="TxDetectionPlugin.java"
// highlight-start
import org.hyperledger.besu.plugin.services.metrics.MetricCategory;
import org.hyperledger.besu.plugin.services.metrics.MetricCategoryRegistry;

import java.util.Optional;
// highlight-end

public class TxDetectionPlugin
    implements BesuPlugin,
        BesuEvents.TransactionAddedListener,
        BesuEvents.BlockAddedListener {

  // highlight-start
  // The category that groups this plugin's metrics.
  private final MetricCategory metricCategory =
      new MetricCategory() {
        @Override
        public String getName() {
          return "tx_detection";
        }

        @Override
        public Optional<String> getApplicationPrefix() {
          return Optional.empty();
        }
      };
  // highlight-end

  @Override
  public void register(final ServiceManager serviceManager) {
    this.serviceManager = serviceManager;
    // highlight-start
    serviceManager
        .getService(MetricCategoryRegistry.class)
        .ifPresent(registry -> registry.addMetricCategory(metricCategory));
    // highlight-end
  }
}
```

### 7. Create metrics and subscribe to events

In `start`, create the metrics and subscribe to the events.
These runtime services only become available at `start`.

Use [`MetricsSystem`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/MetricsSystem.html) to
create a counter for the running total and a gauge for the most recent block, then use
[`BesuEvents`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/BesuEvents.html) to register
both listeners.
Store the listener IDs in fields, so you can remove them in `stop`:

```java title="TxDetectionPlugin.java"
// highlight-start
import org.hyperledger.besu.plugin.services.MetricsSystem;
import org.hyperledger.besu.plugin.services.metrics.Counter;
// highlight-end

public class TxDetectionPlugin
    implements BesuPlugin,
        BesuEvents.TransactionAddedListener,
        BesuEvents.BlockAddedListener {

  // highlight-start
  private long txListenerId;
  private long blockListenerId;
  private Counter detectedTxTotal;
  // highlight-end

  @Override
  public void start() {
    // highlight-start
    serviceManager
        .getService(MetricsSystem.class)
        .ifPresent(
            metrics -> {
              detectedTxTotal =
                  metrics.createCounter(
                      metricCategory,
                      "total_detected",
                      "Total transactions imported in blocks but never seen in the mempool");
              metrics.createLongGauge(
                  metricCategory,
                  "last_block",
                  "Transactions in the most recent block never seen in the mempool",
                  () -> detectedTxLastBlock);
            });

    serviceManager
        .getService(BesuEvents.class)
        .ifPresent(
            events -> {
              txListenerId = events.addTransactionAddedListener(this);
              blockListenerId = events.addBlockAddedListener(this);
            });

    LOG.info("Transaction detection plugin started");
    // highlight-end
  }

  @Override
  public void stop() {
    // highlight-start
    serviceManager
        .getService(BesuEvents.class)
        .ifPresent(
            events -> {
              events.removeTransactionAddedListener(txListenerId);
              events.removeBlockAddedListener(blockListenerId);
            });
    LOG.info("Transaction detection plugin stopped");
    // highlight-end
  }
}
```

Next, update `onBlockAdded` to increment the counter when it finds unseen transactions.
Add the highlighted lines inside the existing `if (unseen > 0)` block:

```java title="TxDetectionPlugin.java"
    if (unseen > 0) {
      // highlight-start
      if (detectedTxTotal != null) {
        detectedTxTotal.inc(unseen);
      }
      // highlight-end
      LOG.info(
          "Block {} contained {} transaction(s) not seen in the mempool",
          blockContext.getBlockHeader().getNumber(),
          unseen);
    }
```

### 8. Review the complete plugin

Your finished `TxDetectionPlugin.java` should look like this:

```java title="TxDetectionPlugin.java"
package txdetection;

import com.google.auto.service.AutoService;
import org.hyperledger.besu.datatypes.Hash;
import org.hyperledger.besu.datatypes.Transaction;
import org.hyperledger.besu.plugin.BesuPlugin;
import org.hyperledger.besu.plugin.ServiceManager;
import org.hyperledger.besu.plugin.data.AddedBlockContext;
import org.hyperledger.besu.plugin.services.BesuEvents;
import org.hyperledger.besu.plugin.services.MetricsSystem;
import org.hyperledger.besu.plugin.services.metrics.Counter;
import org.hyperledger.besu.plugin.services.metrics.MetricCategory;
import org.hyperledger.besu.plugin.services.metrics.MetricCategoryRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@AutoService(BesuPlugin.class)
public class TxDetectionPlugin
    implements BesuPlugin,
        BesuEvents.TransactionAddedListener,
        BesuEvents.BlockAddedListener {

  private static final Logger LOG = LoggerFactory.getLogger(TxDetectionPlugin.class);
  private static final String PLUGIN_NAME = "tx-detection";
  private static final int MAX_TRACKED_TRANSACTIONS = 100_000;

  private ServiceManager serviceManager;

  private long txListenerId;
  private long blockListenerId;

  private Counter detectedTxTotal;
  private volatile long detectedTxLastBlock;

  // Bounded, thread-safe set of transaction hashes seen in the mempool.
  private final Set<Hash> mempoolHashes =
      Collections.synchronizedSet(
          Collections.newSetFromMap(
              new LinkedHashMap<>() {
                @Override
                protected boolean removeEldestEntry(final Map.Entry<Hash, Boolean> eldest) {
                  return size() > MAX_TRACKED_TRANSACTIONS;
                }
              }));

  private final MetricCategory metricCategory =
      new MetricCategory() {
        @Override
        public String getName() {
          return "tx_detection";
        }

        @Override
        public Optional<String> getApplicationPrefix() {
          return Optional.empty();
        }
      };

  @Override
  public String getName() {
    return PLUGIN_NAME;
  }

  @Override
  public void register(final ServiceManager serviceManager) {
    this.serviceManager = serviceManager;
    serviceManager
        .getService(MetricCategoryRegistry.class)
        .ifPresent(registry -> registry.addMetricCategory(metricCategory));
  }

  @Override
  public void start() {
    serviceManager
        .getService(MetricsSystem.class)
        .ifPresent(
            metrics -> {
              detectedTxTotal =
                  metrics.createCounter(
                      metricCategory,
                      "total_detected",
                      "Total transactions imported in blocks but never seen in the mempool");
              metrics.createLongGauge(
                  metricCategory,
                  "last_block",
                  "Transactions in the most recent block never seen in the mempool",
                  () -> detectedTxLastBlock);
            });

    serviceManager
        .getService(BesuEvents.class)
        .ifPresent(
            events -> {
              txListenerId = events.addTransactionAddedListener(this);
              blockListenerId = events.addBlockAddedListener(this);
            });

    LOG.info("Transaction detection plugin started");
  }

  @Override
  public void stop() {
    serviceManager
        .getService(BesuEvents.class)
        .ifPresent(
            events -> {
              events.removeTransactionAddedListener(txListenerId);
              events.removeBlockAddedListener(blockListenerId);
            });
    LOG.info("Transaction detection plugin stopped");
  }

  @Override
  public void onTransactionAdded(final Transaction transaction) {
    mempoolHashes.add(transaction.getHash());
  }

  @Override
  public void onBlockAdded(final AddedBlockContext blockContext) {
    if (blockContext.getEventType() != AddedBlockContext.EventType.HEAD_ADVANCED) {
      return;
    }

    long unseen =
        blockContext.getBlockBody().getTransactions().stream()
            .map(Transaction::getHash)
            .filter(hash -> !mempoolHashes.contains(hash))
            .count();

    detectedTxLastBlock = unseen;

    if (unseen > 0) {
      if (detectedTxTotal != null) {
        detectedTxTotal.inc(unseen);
      }
      LOG.info(
          "Block {} contained {} transaction(s) not seen in the mempool",
          blockContext.getBlockHeader().getNumber(),
          unseen);
    }
  }
}
```

### 9. Build the plugin

From the project root, run the `distZip` task:

```bash
./gradlew distZip
```

The build produces `build/distributions/tx-detection-plugin.zip`, which contains your plugin JAR.
Because the plugin has no extra dependencies, the ZIP contains a single JAR.

Inspect the archive to confirm:

```bash
unzip -l build/distributions/tx-detection-plugin.zip
```

### 10. Deploy the plugin to Besu

Create a `plugins` directory at the root of your Besu installation if it doesn't already exist, then unzip the archive into it.
The `-j` option flattens the ZIP so the JAR lands directly in `plugins/`:

```bash
mkdir -p /path/to/besu/plugins
unzip -j build/distributions/tx-detection-plugin.zip -d /path/to/besu/plugins/
```

If you installed Besu using Homebrew or docker, see [Deploy a plugin](../how-to/deploy-a-plugin.md).

### 11. Run Besu with the plugin

The plugin relies on mempool gossip and block import events, so it needs a node following a live network.
This tutorial runs it on the Hoodi testnet, which syncs quickly and still surfaces transactions that never appeared in
your node's public mempool.

Run Besu as an execution client on Hoodi alongside a consensus client.
Start Besu with metrics enabled and the plugin's metric category included.
The [`--metrics-category`](../../public-networks/reference/cli/options.md#metrics-category) option replaces 
the default set of categories, so list the `TX_DETECTION` category to expose the plugin's metrics:

```bash
besu \
  --network=hoodi \
  --engine-rpc-enabled \
  --engine-jwt-secret=<path to jwtsecret.hex> \
  --engine-host-allowlist="*" \
  --metrics-enabled=true \
  --metrics-host=127.0.0.1 \
  --metrics-port=9545 \
  --metrics-category=TX_DETECTION
```

Then start your consensus client.
For full setup instructions, including generating the shared JWT secret and starting the consensus client, see how to
[connect to a testnet](../../public-networks/get-started/connect/testnet.md) or follow the
[Besu and Teku testnet tutorial](../../public-networks/tutorials/besu-teku-testnet.md).

### 12. Verify the plugin is running

Check the Besu startup logs to confirm the plugin was detected and started.
You should see your start message:

```text
Transaction detection plugin started
```

Once the node is synced and following the chain head, the plugin logs each block that contains
transactions it never saw in the mempool:

```text
Block 1234567 contained 8 transaction(s) not seen in the mempool
```

You can paste the block number into a block explorer to inspect the block and its transactions, and
confirm whether any were submitted directly to a builder rather than the public mempool.

:::note
During initial sync, before your node receives mempool gossip, almost every block transaction
appears unseen.
Wait until the node is fully synced for accurate results.
:::

### 13. Query the metrics

Besu exposes metrics in Prometheus format on the metrics port.
Query the endpoint and filter for the plugin's category:

```bash
curl -s http://localhost:9545/metrics | grep tx_detection
```

You should see the plugin's counter and gauge, for example:

```text
# HELP tx_detection_total_detected Total transactions imported in blocks but never seen in the mempool
# TYPE tx_detection_total_detected counter
tx_detection_total_detected 152.0
# HELP tx_detection_last_block Transactions in the most recent block never seen in the mempool
# TYPE tx_detection_last_block gauge
tx_detection_last_block 8.0
```

:::note
The exact Prometheus metric names and any suffixes depend on the Besu version and metrics backend.
Use the `tx_detection` filter to find the current names in your output.
:::

You now have a working Besu plugin that detects and reports potentially privately built transactions.

## Next steps

- Learn more about [events and metrics](../services/events-and-metrics.md).
- Explore other [plugin services](/plugins/services).
