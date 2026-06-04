---
sidebar_position: 5
description: Trace execution and build debugging plugins.
---

# Execution tracing and debugging

Use tracing services when a plugin needs execution traces or block-import tracing hooks.

`TraceService` exposes methods to:

- Trace a block by block number.
- Trace a block by block hash.
- Trace execution with an operation tracer.

`BlockImportTracerProvider` lets a plugin provide a `BlockAwareOperationTracer` for a block header
during block import.

Tracing plugins commonly use operation tracers to inspect EVM execution, collect debugging data, or
produce trace output for external tools.

For example, trace a block by number with a plugin-provided tracer:

```java
serviceManager
    .getService(TraceService.class)
    .ifPresent(
        traceService -> {
          BlockTraceResult result = traceService.traceBlock(blockNumber, blockAwareOperationTracer);
        });
```

To participate in block import tracing, implement `BlockImportTracerProvider` and return a
`BlockAwareOperationTracer` for the block being imported:

```java
public class ExampleImportTracerProvider implements BlockImportTracerProvider {
  @Override
  public BlockAwareOperationTracer getBlockImportTracer(final BlockHeader blockHeader) {
    return blockAwareOperationTracer;
  }
}
```
