---
title: Use Java Flight Recorder
sidebar_position: 4
description: Using Java Flight Recorder with Besu
---

# Use Java Flight Recorder

[Java Flight Recorder (JFR)](https://docs.oracle.com/javacomponents/jmc-5-4/jfr-runtime-guide/about.htm#JFRUH170) is a monitoring tool that collects information about the Java Virtual Machine (JVM) when Besu is running. Use the JFR as a tool to analyze Besu performance.

## Enable Java Flight Recorder

To enable JFR, set `BESU_OPTS` to the JFR tags as follows:

```bash
export BESU_OPTS=-XX:StartFlightRecording=disk=true,delay=15s,dumponexit=true,\
filename=/tmp/recording.jfr,maxsize=1024m,maxage=1d,\
settings=profile,path-to-gc-roots=true
```

:::tip

When recording, cleanly exiting Besu results in better data. If not possible to cleanly exit, the file may be missing some information not flushed to disk.

:::

Inspect the file written to `/tmp/recording.jfr` with tools such as [Mission Control](https://docs.oracle.com/javacomponents/jmc-5-5/jmc-user-guide/intro.htm#JMCCI109).

:::danger

If providing the output file to [ConsenSys Quorum support](https://consensys.net/quorum/support/), be aware that while JFR files don't contain secrets such as private keys, some details about the user configuration can be inferred from the JFR output.

:::
