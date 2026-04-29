---
title: Pass JVM options
sidebar_position: 2
description: Passing Java virtual machine JVM options to Besu at runtime
---

# Pass JVM options

To perform tasks such as attaching a debugger or configuring the garbage collector, pass Java Virtual Machine (JVM) options to Besu.

Besu passes the contents of the `BESU_OPTS` environment variable to the JVM. Set standard JVM options in the `BESU_OPTS` variable.

For Bash-based executions, you can set the variable for only the scope of the program execution by setting it before starting Besu.

```bash
BESU_OPTS=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 \
besu --network=sepolia
```
