---
title: Accounts for testing
sidebar_position: 4
description: Ethereum accounts used for Besu testing only on private networks
---

import TestAccounts from '../../global/test_accounts.md';

# Accounts for testing

You can use existing accounts for testing by including them in the genesis file for a private network. Besu provides predefined test accounts in its `dev.json` genesis file.

## Predefined test accounts

Besu's `dev.json` genesis file defines the following test accounts.
To use them, copy the account entries into the `alloc` section of the genesis file for your test network.

<TestAccounts />

## Genesis file

To use existing test accounts, specify the accounts and balances in a genesis file for your test network. For an example of how to define accounts in the genesis file, see [`dev.json`](https://github.com/besu-eth/besu/blob/750580dcca349d22d024cc14a8171b2fa74b505a/config/src/main/resources/dev.json).

To start Besu with the genesis file defining the existing accounts, use the [`--genesis-file`](../../public-networks/reference/options.md#genesis-file) command line option .
