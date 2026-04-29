---
title: Manage JVM memory
sidebar_position: 3
description: Besu memory management
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Manage JVM memory

You can manage Java Virtual Machine (JVM) memory usage for Besu by modifying the maximum heap size.

By default, the JVM uses 25% of system RAM. For example, if you have 16 GB RAM installed, the JVM uses 4 GB by default.

On public networks, we recommend setting the maximum heap size to:

- 3 GB on an 8 GB RAM system.
- 5 GB on a 16 GB RAM system.
- 8 GB on a system with at least 24 GB RAM.

:::note

Setting a higher maximum heap size speeds up the sync period but doesn't have much impact after sync. Thus, we recommend setting it to 8 GB only when you have available RAM.

:::

You can set the maximum heap size using the `BESU_OPTS` environment variable and the `-Xmx` option. The following examples set the maximum heap size to 8 GB:

<Tabs>

<TabItem value="Exported environment variable" default>

Set the variable for the whole shell before running Besu.

```bash
export BESU_OPTS=-Xmx8g
```

</TabItem>

<TabItem value="Inline environment variable">

Set the variable only for the specific Besu command.

```bash
BESU_OPTS=-Xmx8g besu [Besu options]
```

</TabItem>
<TabItem value=".service file">

```bash
[Service]
...
Environment="BESU_OPTS=-Xmx8g"
ExecStart=besu [Besu options]
...
```

</TabItem>

</Tabs>

## Manage the heap dump

Heap dump file generation is disabled by default. To enable it, set the `-XX:+HeapDumpOnOutOfMemoryError` Java option.

```bash
BESU_OPTS="-XX:+HeapDumpOnOutOfMemoryError"
```

When heap dump file generation is enabled, and an out-of-memory error occurs, the heap dump file is saved in the Besu runtime directory by default.

The heap dump file might be large and can saturate your drive. It can be up to the size of the allocated memory. For example, for 8 GB heap memory, the file can be up to 8 GB. Specify the directory where you want the dump to be saved using the `-XX:HeapDumpPath` Java option.

```bash
BESU_OPTS="-XX:HeapDumpPath=/<path>/<to>/<directory>"
```

## Default options

To reduce Besu memory footprint, the following G1GC Java options are enabled by default: 

```bash
-XX:G1ConcRefinementThreads=2
-XX:G1HeapWastePercent=15
-XX:MaxGCPauseMillis=100
```

To run Besu without the default G1GC options, use the `besu-untuned` start script. 