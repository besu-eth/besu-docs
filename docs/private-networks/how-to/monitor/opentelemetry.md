---
title: Use OpenTelemetry
sidebar_position: 6
description: Collect Besu information with the OpenTelemetry Collector
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Use OpenTelemetry

You can use the OpenTelemetry monitoring and tracing service to gather node metrics and traces. To enable OpenTelemetry to access Besu, use the [`--metrics-enabled`](../../../public-networks/reference/cli/options.md#metrics-enabled) and [`--metrics-protocol=opentelemetry`](../../../public-networks/reference/cli/options.md#metrics-protocol) options. Use [Splunk](https://splunk.com) to visualize the collected data.

:::tip

Use OpenTelemetry to monitor the sync time of your Besu node and show where time is spent internally and over the JSON-RPC interface.

[This office hours recording](https://wiki.hyperledger.org/display/BESU/2021-01-19+Office+Hours+Notes) shows examples of monitoring Besu.

:::

## Install OpenTelemetry Collector

Download and install the [OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/releases).

:::tip

You can also install exporters that send system metrics to OpenTelemetry to monitor non-Besu-specific items such as disk and CPU usage. The OpenTelemetry Collector can connect to additional applications, and may be deployed in Kubernetes environments as a daemonset.

:::

## Setting up and running OpenTelemetry with Besu

1.  Configure OpenTelemetry to accept data from Besu. For example, use the following configuration for your `otel-collector-config.yml` file, and send data to Splunk and Splunk APM:

    ```yml title="otel-collector-config.yml"
    receivers:
      otlp:
        protocols:
          grpc:
          http:

    exporters:
      splunk_hec/traces:
        # Splunk HTTP Event Collector token.
        token: "11111111-1111-1111-1111-1111111111113"
        # URL to a Splunk instance to send data to.
        endpoint: "https://<SPLUNK INSTANCE>:8088/services/collector"
        # Optional Splunk source: https://docs.splunk.com/Splexicon:Source
        source: "besu:traces"
        # Optional Splunk source type: https://docs.splunk.com/Splexicon:Sourcetype
        sourcetype: "otlp"
        # Splunk index, optional name of the Splunk index targeted.
        index: "traces"
        # Maximum HTTP connections to use simultaneously when sending data. Defaults to 100.
        max_connections: 20
        # Whether to disable gzip compression over HTTP. Defaults to false.
        disable_compression: false
        # HTTP timeout when sending data. Defaults to 10s.
        timeout: 10s
        # Whether to skip checking the certificate of the HEC endpoint when sending data over HTTPS. Defaults to false.
        # For this demo, we use a self-signed certificate on the Splunk docker instance, so this flag is set to true.
        insecure_skip_verify: true
      splunk_hec/metrics:
        # Splunk HTTP Event Collector token.
        token: "11111111-1111-1111-1111-1111111111113"
        # URL to a Splunk instance to send data to.
        endpoint: "https://<SPLUNK INSTANCE>:8088/services/collector"
        # Optional Splunk source: https://docs.splunk.com/Splexicon:Source
        source: "besu:metrics"
        # Optional Splunk source type: https://docs.splunk.com/Splexicon:Sourcetype
        sourcetype: "prometheus"
        # Splunk index, optional name of the Splunk index targeted.
        index: "metrics"
        # Maximum HTTP connections to use simultaneously when sending data. Defaults to 100.
        max_connections: 20
        # Whether to disable gzip compression over HTTP. Defaults to false.
        disable_compression: false
        # HTTP timeout when sending data. Defaults to 10s.
        timeout: 10s
        # Whether to skip checking the certificate of the HEC endpoint when sending data over HTTPS. Defaults to false.
        # For this demo, we use a self-signed certificate on the Splunk docker instance, so this flag is set to true.
        insecure_skip_verify: true
      # Traces
      sapm:
        access_token: "${SPLUNK_ACCESS_TOKEN}"
        endpoint: "https://ingest.${SPLUNK_REALM}.signalfx.com/v2/trace"
      # Metrics + Events
      signalfx:
        access_token: "${SPLUNK_ACCESS_TOKEN}"
        realm: "${SPLUNK_REALM}"

    processors:
      batch:

    extensions:
      health_check:
      pprof:
      zpages:

    service:
      extensions: [pprof, zpages, health_check]
      pipelines:
        traces:
          receivers: [otlp]
          exporters: [splunk_hec/traces, sapm]
          processors: [batch]
        metrics:
          receivers: [otlp]
          exporters: [splunk_hec/metrics, signalfx]
          processors: [batch]
    ```

    It is easiest to run the OpenTelemetry collector with Docker with the following command:

    <Tabs>
    
    <TabItem value="Syntax" label="Syntax" default>

    ```bash
    docker run -d \
      -v ./otel-collector-config.yml:/etc/otel/config.yaml \
      -e SPLUNK_ACCESS_TOKEN=<access token> \
      -e SPLUNK_REALM=<realm> \
      -p 4317:4317 \
      otel/opentelemetry-collector-contrib:latest
    ```

    </TabItem>
    
    <TabItem value="Example" label="Example">

    ```bash
    docker run -d \
      -v ./otel-collector-config.yml:/etc/otel/config.yaml \
      -e SPLUNK_ACCESS_TOKEN=abcdefg654 \
      -e SPLUNK_REALM=us1 \
      -p 4317:4317 \
      otel/opentelemetry-collector-contrib:latest
    ```

    </TabItem>
    
    </Tabs>

2.  Start Besu with the [`--metrics-enabled`](../../../public-networks/reference/cli/options.md#metrics-enabled) and [`--metrics-protocol=opentelemetry`](../../../public-networks/reference/cli/options.md#metrics-protocol) options. For example, run the following command to start a single node:
        
    <Tabs>
    
    <TabItem value="Syntax" label="Syntax" default>

    ```bash
    OTEL_EXPORTER_OTLP_ENDPOINT=https://<host>:<port> besu --network=dev --rpc-http-cors-origins="all" --rpc-http-enabled --metrics-enabled --metrics-protocol=opentelemetry
    ```

    </TabItem>
    
    <TabItem value="Example" label="Example">

    ```bash
    OTEL_EXPORTER_OTLP_ENDPOINT=https://localhost:4317 besu --network=dev --rpc-http-cors-origins="all" --rpc-http-enabled --metrics-enabled --metrics-protocol=opentelemetry
    ```

    </TabItem>
    
    </Tabs>

    The [OpenTelemetry SDK](https://github.com/open-telemetry/opentelemetry-specification/blob/8f7cdb73618a0b3afa9532b8f8103d719e352781/specification/sdk-environment-variables.md) mandates how to configure the OpenTelemetry gRPC client, so data flows to the collector from Besu.

    You can use the following environment variables:

    | Name                          | Description                                                                                                 | Required |
    |-------------------------------|-------------------------------------------------------------------------------------------------------------|----------|
    | `OTEL_EXPORTER_OTLP_ENDPOINT` | OpenTelemetry Collector endpoint, of the form `https://host:port`. The default is `https://localhost:4317`. | Yes      |
    | `OTEL_EXPORTER_OTLP_INSECURE` | Whether to allow insecure connections for OpenTelemetry data. The default is `false`.                       | No       |

<!-- Links -->

[Monitoring Besu synchronization to chain with Splunk]: https://github.com/splunk/splunk-connect-for-ethereum/tree/master/examples/besu-sync
