---
sidebar_position: 5
description: Trace execution and build debugging plugins.
---

# Execution tracing and debugging

Use tracing services when a plugin needs execution traces or block-import tracing hooks.

[`TraceService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/TraceService.html) exposes methods to:

- Trace a block by block number.
- Trace a block by block hash.
- Trace execution with an operation tracer.

[`BlockImportTracerProvider`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/BlockImportTracerProvider.html) lets a plugin provide a [`BlockAwareOperationTracer`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/tracer/BlockAwareOperationTracer.html) for a block header
during block import.

Tracing plugins commonly use operation tracers to inspect EVM execution, collect debugging data, or
produce trace output for external tools.

For example, trace a block by number with a plugin-provided tracer:

```java
@Override
public void start() {
  serviceManager
      .getService(TraceService.class)
      .ifPresent(
          traceService -> {
            BlockTraceResult result =
                traceService.traceBlock(blockNumber, blockAwareOperationTracer);
          });
}
```

To participate in block import tracing, implement `BlockImportTracerProvider` and register it with
Besu in `start` using `addService`:

```java
public class ExampleImportTracerProvider implements BlockImportTracerProvider {
  @Override
  public BlockAwareOperationTracer getBlockImportTracer(final BlockHeader blockHeader) {
    return blockAwareOperationTracer;
  }
}

@Override
public void start() {
  serviceManager.addService(BlockImportTracerProvider.class, new ExampleImportTracerProvider());
}
```

<details>
<summary><b>Known issue:</b> BFT networks invoke the tracer twice per block</summary>
<div>
On QBFT and IBFT 2.0 networks, Besu processes each block twice: once during the validation phase
(before voting) and once during the commit phase (when importing the agreed block).
Each pass calls `getBlockImportTracer(header)`, creating a fresh, independent tracer instance. 
Both tracer instances receive `traceEndTransaction` for every transaction in the block.

This means that on BFT networks, your plugin will see each transaction twice per block.
The two tracer instances have no shared state, so per-tracer deduplication (for example, a `Set` 
field on the tracer) does not help; the duplicate comes from a separate tracer object. 
Deduplicate at a shared data layer keyed by both block hash and transaction hash.

On proof of stake networks, each block is processed once and the tracer fires once per transaction.
</div>
</details>
