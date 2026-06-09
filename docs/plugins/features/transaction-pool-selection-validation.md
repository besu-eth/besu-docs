---
sidebar_position: 8
description: Extend transaction pool, selection, and validation behavior.
---

# Transaction pool, selection, and validation

Use transaction pool services to inspect pending transactions, control
transaction pool availability, influence transaction selection, or add validation rules.

## Observe pending transactions

[`TransactionPoolService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/transactionpool/TransactionPoolService.html) exposes methods to:

- Disable or enable the transaction pool.
- Check whether the transaction pool is enabled.
- Retrieve pending transactions.

For event-based observation, [`BesuEvents`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/BesuEvents.html) exposes transaction added and transaction dropped
listeners.

For example, inspect pending transaction count:

```java
@Override
public void start() {
  serviceManager
      .getService(TransactionPoolService.class)
      .ifPresent(
          transactionPool -> {
            boolean enabled = transactionPool.isTransactionPoolEnabled();
            int pendingCount = transactionPool.getPendingTransactions().size();
          });
}
```

For event-based observation, register transaction listeners:

```java
@Override
public void start() {
  serviceManager
      .getService(BesuEvents.class)
      .ifPresent(
          events -> {
            long addedListenerId = events.addTransactionAddedListener(transaction -> {});
            long droppedListenerId =
                events.addTransactionDroppedListener((transaction, reason) -> {});
          });
}
```

## Influence selection

[`TransactionSelectionService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/TransactionSelectionService.html) exposes methods to create a plugin transaction selector, select
pending transactions, and register a plugin transaction selector factory.

Use this service when the plugin needs to participate in transaction selection.

For example, register a selector factory:

```java
@Override
public void register(final ServiceManager context) {
  this.serviceManager = context;
  serviceManager
      .getService(TransactionSelectionService.class)
      .ifPresent(
          selection ->
              selection.registerPluginTransactionSelectorFactory(transactionSelectorFactory));
}
```

The plugin supplies the [`PluginTransactionSelectorFactory`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/txselection/PluginTransactionSelectorFactory.html) implementation.

## Validate transactions

[`TransactionPoolValidatorService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/TransactionPoolValidatorService.html) exposes methods to create a plugin transaction pool validator and
register a plugin transaction validator factory.

[`TransactionValidatorService`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/TransactionValidatorService.html) exposes a method to register a transaction validation rule.

Use these services when a plugin needs custom validation behavior.

For example, register a transaction validation rule:

```java
@Override
public void register(final ServiceManager context) {
  this.serviceManager = context;
  serviceManager
      .getService(TransactionValidatorService.class)
      .ifPresent(
          validator ->
              validator.registerTransactionValidatorRule(
                  transaction -> Optional.empty()));
}
```

Return an empty `Optional` when the transaction is valid, or an `Optional` containing a reason when
the plugin rejects the transaction.

For transaction pool validation, register a validator factory:

```java
@Override
public void register(final ServiceManager context) {
  this.serviceManager = context;
  serviceManager
      .getService(TransactionPoolValidatorService.class)
      .ifPresent(
          validator ->
              validator.registerPluginTransactionValidatorFactory(
                  transactionPoolValidatorFactory));
}
```

The plugin supplies the [`PluginTransactionPoolValidatorFactory`](pathname:///plugins/reference/plugin-api/org/hyperledger/besu/plugin/services/txvalidator/PluginTransactionPoolValidatorFactory.html) implementation.
