---
title: Configure logging
sidebar_position: 3
description: Besu log level setting and log formatting
path: blob/master/besu/src/main/resources/
source: log4j2.xml
---

# Use logging

Besu uses [Log4j 2](https://logging.apache.org/log4j/2.x/) for logging and provides two methods to configure logging behavior:

- [Basic](#basic-logging) - Changes the log level.
- [Advanced](#advanced-logging) - Configures the output and format of the logs.

[Quorum Developer Quickstart](https://github.com/ConsenSys/quorum-dev-quickstart) provides an [example implementation using Elastic Stack](../../../private-networks/how-to/monitor/elastic-stack.md) for log management.

## Basic logging

Use the [`--logging`](../../reference/cli/options.md#logging) command line option to specify logging verbosity. The [`--logging`](../../reference/cli/options.md#logging) option changes the volume of events displayed in the log. Valid log levels are `OFF`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`, `ALL`. The default level is `INFO`.

For most use cases, the basic method provides enough configurability.

:::tip

Use the [`admin_changeLogLevel`](../../reference/api/index.md#admin_changeloglevel) API method to change the log level while Besu is running.

:::

## Advanced logging

You can provide your own logging configuration using the standard Log4j 2 configuration mechanisms. For example, the following Log4j 2 configuration is the same as the [default configuration] except for the exclusion of logging of stack traces for exceptions:

```xml title="debug.xml"
<?xml version="1.0" encoding="UTF-8"?>
<Configuration level="INFO">
  <Properties>
    <Property name="root.log.level">INFO</Property>
  </Properties>

  <Appenders>
    <Console name="Console" target="SYSTEM_OUT">
      <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSSZZZ} | %t | %-5level | %c{1} | %msg %throwable{short.message}%n" />
    </Console>
  </Appenders>
  <Loggers>
    <Root level="${sys:root.log.level}">
      <AppenderRef ref="Console" />
    </Root>
  </Loggers>
</Configuration>
```

To use your custom configuration, set the environment variable `LOG4J_CONFIGURATION_FILE` to the location of your configuration file.

If you have more specific requirements, you can create your own [Log4j 2 configuration](https://logging.apache.org/log4j/2.x/manual/configuration.html).

For Bash-based executions, you can set the variable for only the scope of the program execution by setting it before starting Besu.

To set the debug logging and start Besu connected to the Sepolia testnet:

```bash
LOG4J_CONFIGURATION_FILE=./debug.xml besu --network=sepolia
```

### Log invalid transactions

You can log information about invalid transactions that have been removed from the transaction pool.

Use the log marker `INVALID_TX_REMOVED` and the following fields to format the log line as required:

- `txhash` - The hash of the transaction.
- `txlog` - The human-readable log of the transaction.
- `reason` - The reason the transaction is invalid.
- `txrlp` - The RLP encoding of the transaction.

For example, the following Log4j 2 configuration enables logging of invalid transactions:

```xml title="debug.xml"
<?xml version="1.0" encoding="UTF-8"?>
<Configuration monitorInterval="30" status="INFO">
  <Properties>
    <Property name="root.log.level">INFO</Property>
  </Properties>
  <Appenders>
    <Console name="Console">
      <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSSZZZ} | %t | %-5level | %c{1} | %msg%n"/>
    </Console>
    <Routing name="Router">
      <Routes pattern="$${event:Marker}">
        <Route key="INVALID_TX_REMOVED">
          <Console name="ConsoleITR" target="SYSTEM_OUT">
            <PatternLayout pattern="Invalid tx removed:%X{txlog}, reason:%X{reason}; RLP={%X{txrlp}}}%n"/>
          </Console>
        </Route>
        <Route ref="Console"/>
      </Routes>
    </Routing>
  </Appenders>
  <Loggers>
        <Logger additivity="false" name="org.hyperledger.besu.ethereum.eth.transactions">
            <AppenderRef ref="Router"/>
        </Logger>
    <Root level="${sys:root.log.level}">
      <AppenderRef ref="Console"/>
    </Root>
  </Loggers>
</Configuration>
```

### Log rotation

The [Quorum Developer Quickstart](https://github.com/ConsenSys/quorum-dev-quickstart) logging configuration defines a [log rotation to restrict the size of the log files].

<!-- Links -->

[default configuration]: https://github.com/hyperledger/besu/blob/750580dcca349d22d024cc14a8171b2fa74b505a/besu/src/main/resources/log4j2.xml
[log rotation to restrict the size of the log files]: https://github.com/ConsenSys/quorum-dev-quickstart/blob/b72a0f64d685c851bf8be399a8e33bbdf0e09982/files/besu/config/besu/log-config.xml
