---
description: Troubleshoot poor performance and resource constraints.
sidebar_label: Troubleshoot performance
sidebar_position: 3
---

# Troubleshoot performance

Your hardware, machine environment, and node configuration can affect your node's ability to serve
requests and perform [validator duties](../../concepts/proof-of-stake/index.md), including
[attestation performance](../../concepts/proof-of-stake/attestations.md).

If you notice high resource usage when [monitoring your node](../monitor/index.md), you can
try the following suggestions:

* Disable swapping.
  Besu is an I/O intensive application, especially during sync, enabling swapping hurts Besu's performance.
  You can disable swap at the OS level.
  [This article](https://www.tecmint.com/disable-swap-partition/) provides information on how to
  disable swap (and caveats).
* Use a high performance SSD disk with NVMe, since Besu's performance bottleneck is often slow disk I/O.
* Configure memory and RAM:
  * If you have RAM constraints, use [OpenJ9](../../get-started/system-requirements.md) if you're
    running on `x86_64` Linux architecture to reduce memory usage.
  * Review and change your [Java heap size](../configure-java/manage-memory.md) if necessary.
    5GB is an appropriate limit.
    Higher values may improve sync time, but can be reduced after completing sync.
  * Ensure Besu is using [jemalloc](../../get-started/install/binary-distribution.md).
  * If you have 32GB RAM or more, set the `Xplugin-rocksdb-high-spec-enabled` configuration option
    to `true`.
    Don't use this on RAM machines with 16GB RAM or less if you're running a consensus client on the
    same hardware.
* If you're running on ARM64, make sure the glibc version is greater than 2.29.
  If not, Besu uses a Java implementation instead of the native one for some precompiled contracts,
  which results in lower performance.
  * On Ubuntu, run `ldd --version`.
    See [the methods for other environments](https://dev.to/0xbf/how-to-get-glibc-version-c-lang-26he).
* Pay attention to what processes are running on the same machine/VM as Besu.
  Java applications, with default settings, are designed to run alone on the machine.
  You can run your consensus client on the same machine, but this adds overhead on Besu, and vice
  versa (on CPU cache misses, CPU scheduler latency, IO, etc.).

You should continue to monitor your node after following these suggestions.
