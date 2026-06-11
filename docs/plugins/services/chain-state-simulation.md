---
sidebar_position: 1
description: Read chain state and simulate transactions.
---

# Chain state and simulation

Use chain state and simulation services to inspect blocks, receipts, transactions, world state, 
or simulated execution results.

## Read blockchain data

[`BlockchainService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/BlockchainService.html) exposes methods to retrieve blocks, block headers, receipts, transactions, the
chain head, safe and finalized blocks, chain ID, base fee information, and hard fork IDs.
It also includes methods for storing blocks and setting safe or finalized block hashes.

Use this service for plugins that need chain metadata or historical block data.

For example, use `BlockchainService` to expose chain head data from another plugin feature such as
a custom RPC endpoint or metric:

```java
@Override
public void start() {
  serviceManager
      .getService(BlockchainService.class)
      .ifPresent(
          blockchain -> {
            Hash chainHeadHash = blockchain.getChainHeadHash();
            long chainHeadNumber = blockchain.getChainHeadHeader().getNumber();
            Optional<BigInteger> chainId = blockchain.getChainId();
          });
}
```

## Read world state

[`WorldStateService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/WorldStateService.html) exposes the current `WorldView` and, when available, a `WorldView` for a block
hash.

Use this service for plugins that need account or storage state through Besu's world state view.

For example, retrieve the current world state view:

```java
@Override
public void start() {
  serviceManager
      .getService(WorldStateService.class)
      .ifPresent(worldState -> {
        WorldView currentWorldView = worldState.getWorldView();
      });
}
```

## Simulate execution

[`TransactionSimulationService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/TransactionSimulationService.html) simulates transactions and can create a pending block header for simulation. 
[`BlockSimulationService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/BlockSimulationService.html) simulates blocks and includes a method to simulate and persist world state.

Use simulation services for plugins that need to evaluate transaction or block execution without
submitting a normal transaction through JSON-RPC.

For example, use `TransactionSimulationService` to create a pending block header for transaction
simulation:

```java
@Override
public void start() {
  serviceManager
      .getService(TransactionSimulationService.class)
      .ifPresent(
          simulation -> {
            ProcessableBlockHeader pendingHeader = simulation.simulatePendingBlockHeader();
          });
}
```

If the plugin already has the transaction, state overrides, block overrides, and tracer it needs, it
can call the simulation methods directly:

```java
Optional<TransactionSimulationResult> result =
    simulation.simulate(
        transaction,
        Optional.empty(),
        blockHash,
        operationTracer,
        EnumSet.noneOf(TransactionSimulationService.SimulationParameters.class));
```

For block simulation, pass the block number, transactions, block overrides, and state overrides:

```java
PluginBlockSimulationResult result =
    blockSimulation.simulate(blockNumber, transactions, blockOverrides, stateOverrides);
```

## Read sync status

[`SynchronizationService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/sync/SynchronizationService.html) exposes sync status methods such as `isInitialSyncPhaseDone`,
`getSyncStatus`, `isInSync`, and `getBestPeerChainHead`.
It also exposes advanced methods that can start or stop synchronization, set
the chain head, fire forkchoice events, and disable the world state trie.

Use the chain-control methods only for specialized plugins that intentionally manage sync or chain
head behavior.
For ordinary observability, read sync status without changing synchronization behavior:

```java
@Override
public void start() {
  serviceManager
      .getService(SynchronizationService.class)
      .ifPresent(
          sync -> {
            boolean initialSyncDone = sync.isInitialSyncPhaseDone();
            boolean inSync = sync.isInSync();
            Optional<SyncStatus> status = sync.getSyncStatus();
            Optional<Long> bestPeerChainHead = sync.getBestPeerChainHead();
          });
}
```
