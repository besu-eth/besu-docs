---
sidebar_position: 4
sidebar_label: Profile with Java Flight Recorder
description: Using Java Flight Recorder to profile Besu and analyze JVM performance
keywords:
  - java flight recorder
  - jfr
  - profiling
---

# Profile Besu with Java Flight Recorder

[Java Flight Recorder (JFR)](https://docs.oracle.com/javacomponents/jmc-5-4/jfr-runtime-guide/about.htm#JFRUH170) is a monitoring tool that collects information about the Java Virtual Machine (JVM) when Besu is running. Use the JFR as a tool to analyze Besu performance.

Besu records JFR data by default.
Save the recording to a file and inspect it afterwards.
To profile a node continuously instead, and view the results in Grafana, see
[Profile with Pyroscope](pyroscope.md).

## Save the recording

From version 24.7.0, the `besu` start script and the Besu Docker image start a
JFR recording using the JFR `default` settings.
The recording keeps the most recent data on disk, up to 250 MB.

To save the recording to a file:

1. Find the process ID of Besu.
   Run `jcmd` with no arguments to list the running Java processes.
   Besu is listed as `org.hyperledger.besu.Besu`.

   ```bash
   jcmd
   ```

1. Save the recording to a file, replacing `<PID>` with the process ID from the
   previous step:

   ```bash
   jcmd <PID> JFR.dump name=1 filename=/tmp/recording.jfr
   ```

:::note

The `besu-untuned` start script doesn't start a JFR recording.

:::

Inspect the file written to `/tmp/recording.jfr` with tools such as [Mission Control](https://docs.oracle.com/javacomponents/jmc-5-5/jmc-user-guide/intro.htm#JMCCI109).

:::danger

If providing the output file to [ConsenSys Quorum support](https://consensys.net/quorum/support/), be aware that while JFR files don't contain secrets such as private keys, some details about the user configuration can be inferred from the JFR output.

:::
