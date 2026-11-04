---
title: Configure logging
sidebar_position: 3
description: Besu log level setting and log formatting
path: blob/master/besu/src/main/resources/
source: log4j2.xml
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

Besu uses [Log4j 2](https://logging.apache.org/log4j/2.x/) for logging and provides two methods to configure logging behavior:

- [Basic](#basic-logging) - Change the log level or structured logging format.
- [Advanced](#advanced-logging) - Configure the output and format of the logs.

[Besu Developer Quickstart](https://github.com/Consensys/besu-dev-quickstart) provides an example implementation using Grafana Alloy, Loki, and Grafana for log management.

## Basic logging

Use the [`--logging`](../../reference/options.md#logging) command line option to specify logging verbosity.
This option changes the volume of events displayed in the log.
Valid log levels are `OFF`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`, `ALL`.
The default level is `INFO`.

:::tip

Use the [`admin_changeLogLevel`](../../reference/api/admin.md#admin_changeloglevel) API method to change the log level while Besu is running.

:::

Use the [`--logging-format`](../../reference/options.md#logging-format) option to specify the logging format.
You can select a structured logging format, which emits each log record as a JSON object in a well-defined
format, making logs consistent and machine-readable.
Valid formats are `PLAIN`, `ECS`, `GCP`, `LOGSTASH`, and `GELF`.
The default format is `PLAIN`, which specifies traditional pattern-based text logging.

## Advanced logging

You can provide your own logging configuration using the standard Log4j 2 configuration mechanisms.

Besu includes the Log4j JSON Template Layout library, which supplies production-ready templates for each
structured logging format.
Specify `JsonTemplateLayout` in your configuration file to use the Log4J templates.

The following is an example of a custom configuration file, a configuration file using the default Elastic
Common Schema (ECS) template, and a configuration file using the Google Cloud Platform (GCP) template.
For more information, see the Log4j
[configuration file](https://logging.apache.org/log4j/2.x/manual/configuration.html) and
[event templates](https://logging.apache.org/log4j/2.x/manual/json-template-layout.html#event-templates) documentation.

<Tabs>

<TabItem value="Custom configuration" default>

```xml
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

</TabItem>

<TabItem value="With default ECS template">

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration level="INFO">
  <Properties>
    <Property name="root.log.level">INFO</Property>
  </Properties>

  <Appenders>
    <Console name="Console" target="SYSTEM_OUT">
      <JsonTemplateLayout />
    </Console>
  </Appenders>
  <Loggers>
    <Root level="${sys:root.log.level}">
      <AppenderRef ref="Console" />
    </Root>
  </Loggers>
</Configuration>
```

</TabItem>

<TabItem value="With GCP template">

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration level="INFO">
  <Properties>
    <Property name="root.log.level">INFO</Property>
  </Properties>

  <Appenders>
    <Console name="Console" target="SYSTEM_OUT">
      <JsonTemplateLayout eventTemplateUri="classpath:GcpLayout.json" />
    </Console>
  </Appenders>
  <Loggers>
    <Root level="${sys:root.log.level}">
      <AppenderRef ref="Console" />
    </Root>
  </Loggers>
</Configuration>
```

</TabItem>

</Tabs>

To use your custom configuration, set the `LOG4J_CONFIGURATION_FILE` environment variable to the location
of your configuration file.

```bash
export LOG4J_CONFIGURATION_FILE="<path_to_file>"
```

For Bash-based executions, you can set the variable for only the scope of the program execution by setting
it before starting Besu.

```bash title="Set the custom logging and start Besu"
LOG4J_CONFIGURATION_FILE="<path_to_file>" besu --network=sepolia
```

:::info note

When a custom Log4j 2 configuration file is provided, it takes precedence over
[`--logging-format`](../../reference/options.md#logging-format).
[`--logging`](../../reference/options.md#logging) still sets the log level.

:::

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

The [Besu Developer Quickstart](https://github.com/Consensys/besu-dev-quickstart) logging configuration defines a [log rotation to restrict the size of the log files].

<!-- Links -->

[log rotation to restrict the size of the log files]: https://github.com/Consensys/besu-dev-quickstart/blob/master/files/common/config/besu/log-config.xml
