---
sidebar_position: 8
description: Extend transaction pool, selection, and validation behavior.
---

# Transaction pool, selection, and validation

Use transaction pool services when a plugin needs to inspect pending transactions, control
transaction pool availability, influence transaction selection, or add validation rules.

## Observe pending transactions

`TransactionPoolService` exposes methods to:

- Disable or enable the transaction pool.
- Check whether the transaction pool is enabled.
- Retrieve pending transactions.

For event-based observation, `BesuEvents` exposes transaction added and transaction dropped
listeners.

For example, inspect pending transaction count:

```java
serviceManager
    .getService(TransactionPoolService.class)
    .ifPresent(
        transactionPool -> {
          boolean enabled = transactionPool.isTransactionPoolEnabled();
          int pendingCount = transactionPool.getPendingTransactions().size();
        });
```

For event-based observation, register transaction listeners:

```java
serviceManager
    .getService(BesuEvents.class)
    .ifPresent(
        events -> {
          long addedListenerId = events.addTransactionAddedListener(transaction -> {});
          long droppedListenerId =
              events.addTransactionDroppedListener((transaction, reason) -> {});
        });
```

## Influence selection

`TransactionSelectionService` exposes methods to create a plugin transaction selector, select
pending transactions, and register a plugin transaction selector factory.

Use this service when the plugin needs to participate in transaction selection.

For example, register a selector factory:

```java
serviceManager
    .getService(TransactionSelectionService.class)
    .ifPresent(
        selection ->
            selection.registerPluginTransactionSelectorFactory(transactionSelectorFactory));
```

The plugin supplies the `PluginTransactionSelectorFactory` implementation.

## Validate transactions

`TransactionPoolValidatorService` exposes methods to create a plugin transaction pool validator and
register a plugin transaction validator factory.

`TransactionValidatorService` exposes a method to register a transaction validation rule.

Use these services when a plugin needs custom validation behavior.

For example, register a transaction validation rule:

```java
serviceManager
    .getService(TransactionValidatorService.class)
    .ifPresent(
        validator ->
            validator.registerTransactionValidatorRule(
                transaction -> Optional.empty()));
```

Return an empty `Optional` when the transaction is valid, or an `Optional` containing a reason when
the plugin rejects the transaction.

For transaction pool validation, register a validator factory:

```java
serviceManager
    .getService(TransactionPoolValidatorService.class)
    .ifPresent(
        validator ->
            validator.registerPluginTransactionValidatorFactory(
                transactionPoolValidatorFactory));
```

The plugin supplies the `PluginTransactionPoolValidatorFactory` implementation.
