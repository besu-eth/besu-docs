---
sidebar_position: 2
description: Query PoA validator information.
---

# Consensus and validator queries

Use consensus query services to inspect validator information on proof of authority (PoA) networks.

[`PoaQueryService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/query/PoaQueryService.html) exposes:

- Validators for the latest block.
- The proposer of a block.
- The local signer address.

[`BftQueryService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/query/BftQueryService.html) extends `PoaQueryService` for BFT-style PoA networks and exposes:

- The round number from a block header.
- Signers from a block header.
- The consensus mechanism name.

Handle these services as optional.
They might not be available for every network configuration.

For example, expose the latest PoA validator count as a metric or RPC result:

```java
@Override
public void start() {
  serviceManager
      .getService(PoaQueryService.class)
      .ifPresent(
          poa -> {
            int validatorCount = poa.getValidatorsForLatestBlock().size();
            Address localSigner = poa.getLocalSignerAddress();
          });
}
```

For BFT-specific metadata, combine `BftQueryService` with a block header:

```java
@Override
public void start() {
  serviceManager
      .getService(BftQueryService.class)
      .ifPresent(
          bft -> {
            String consensusName = bft.getConsensusMechanismName();
            int round = bft.getRoundNumberFrom(blockHeader);
            Collection<Address> signers = bft.getSignersFrom(blockHeader);
          });
}
```
