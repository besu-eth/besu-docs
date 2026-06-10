---
title: System requirements
sidebar_position: 1
description: Ensure you meet the system requirements to sync and run Besu.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# System requirements

Determine public network system requirements by checking CPU and disk space requirements using [Prometheus](../how-to/monitor/metrics.md). Grafana provides a [sample dashboard](https://grafana.com/grafana/dashboards/10273) for Besu.

:::tip

CPU requirements are highest when syncing to the network and typically reduce after the node is synchronized to the chain head.

:::

## Java distribution and installation

Besu requires an installation of Java 25+ to run.
We currently recommend two Java distributions, [OpenJDK 25](https://jdk.java.net/25/) and
[OpenJ9](https://www.eclipse.org/openj9/), though you can experiment based on your needs.

OpenJDK is the default for many Java users and is balanced in performance and garbage collection.
OpenJ9 consumes less memory and system resources, but can have worse performance on some setups.

If you have more than 32GB RAM (for Besu and your [consensus client](../concepts/node-clients.md#consensus-clients)), use OpenJDK.
If you have less RAM:

* If you're on Linux (or Unix-based) and your CPU is x86-64 bit architecture (like Intel), use OpenJ9.
* If you're on ARM-64 CPU architecture (Mac M-series, Raspberry Pi), use OpenJDK.

If you have OpenJDK installed or need a fresh installation of OpenJ9, you can pick up the OpenJ9
docker image, or install the OpenJ9 JDK using the following steps:

1. Get the [binaries](https://github.com/ibmruntimes/semeru25-certified-binaries/releases) corresponding to
   your OS architecture.
   For example:

    ```bash
    wget https://github.com/ibmruntimes/semeru25-certified-binaries/releases/download/jdk-25.0.3.0/ibm-semeru-certified-jdk_x64_linux_25.0.3.0.tar.gz
    ```
2. Uncompress the binaries:

    <Tabs>
    <TabItem value="Command" label="Command" default>

    ```bash
    tar -xvf YOUR_J9_IMAGE.tar.gz
    ```

    </TabItem>
    <TabItem value="Example" label="Example">

    ```bash
    tar -xvf ibm-semeru-certified-jdk_x64_linux_25.0.3.0.tar.gz
    ```

    </TabItem>
    </Tabs>

3. Move the binaries to `bin` directory:

    <Tabs>
    <TabItem value="Command" label="Command" default>

    ```bash
    sudo cp -r YOUR_IMAGE/ /usr/bin/
    ```

    </TabItem>
    <TabItem value="Example" label="Example">

    ```bash
    sudo cp -r jdk-25.0.3+9/ /usr/bin/
    ```

    </TabItem>
    </Tabs>

4. Specify OpenJ9 for Java on your machine:

    <Tabs>
    <TabItem value="Command" label="Command" default>

    ```bash
    sudo update-alternatives --install "/usr/bin/java" "java" "/usr/bin/YOUR_IMAGE" 1
    sudo update-alternatives --config java (and choose OpenJ9)
    ```

    </TabItem>
    <TabItem value="Example" label="Example">

    ```bash
    sudo update-alternatives --install "/usr/bin/java" "java" "/usr/bin/jdk-25.0.3+9/bin/java"
    ```

    </TabItem>
    </Tabs>

    Change your `JAVA_HOME` to OpenJ9 (if using the JDK implementation), where `jdk-install-dir` is
    the installation location you specified:

    <Tabs>
    <TabItem value="Command" label="Command" default>

    ```bash
    export JAVA_HOME=jdk-install-dir
    ```

    </TabItem>
    <TabItem value="Example" label="Example">

    ```bash
    export JAVA_HOME=/usr/bin/jdk-25.0.3+9
    ```

    </TabItem>
    </Tabs>

## Java Virtual Machine size

For Mainnet and testnets, the minimum [Java Virtual Machine (JVM) memory requirement is 8 GB](../how-to/configure-java/manage-memory.md).

JVM memory requirements are highest when syncing, but will reduce after the node is synchronized to the chain head. Monitor your system to determine your actual JVM memory needs.

## Disk space

The disk space required for syncing a Besu node depends on the
[sync mode](../concepts/node-sync.md#sync-modes) and
[data storage format](../concepts/data-storage-formats.md) used.
Using snap sync with Bonsai on Mainnet requires about 1.14 TB.

See the current [Mainnet storage estimates](../concepts/data-storage-formats.md#storage-estimates) for more information.

## Disk type

Use [local SSD storage](https://cloud.google.com/compute/docs/disks) for high throughput nodes (validators and RPC nodes). Read-only nodes can use a lower performance setup.

You can use local SSDs through [SCSI interfaces](https://en.wikipedia.org/wiki/SCSI). For higher performance in production settings, we recommend upgrading to [NVMe interfaces](https://cloud.google.com/compute/docs/disks/local-ssd#performance).

## Reference environment

Recent Mainnet Bonsai snap sync measurements used AWS `m8g.2xlarge` instances with 8 vCPUs,
30 GiB memory, and a 1.9 TB Amazon EBS data volume.
Performance test nodes used provisioned disk IOPS and throughput.
Using a larger instance or faster disk while synchronizing can reduce sync time.
After the node is synchronized, you can reduce the instance size based on observed CPU, memory,
and disk I/O usage.

:::warning

If you are using a more recent release than 26.5.0, resource requirements may have increased.

:::
