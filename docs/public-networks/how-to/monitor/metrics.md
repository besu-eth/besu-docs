---
title: Use metrics
sidebar_position: 1
description: Monitoring and metrics
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Use metrics to monitor node performance

To enable the [Prometheus](https://prometheus.io/) monitoring and alerting service to access Besu metrics, use the [`--metrics-enabled`](../../reference/cli/options.md#metrics-enabled) option. Use [Grafana](https://grafana.com/) to visualize the collected data. See the sample [Besu Full Grafana dashboard](https://grafana.com/grafana/dashboards/16455-besu-full/).

The Besu example networks have [monitoring with Prometheus and Grafana configured].

Use Prometheus to monitor the number of blocks your Besu node is behind the chain head, and to alert you that your node is not keeping up with the chain head.

[This recording](https://www.youtube.com/watch?v=7BuutRe0I28&feature=youtu.be) shows examples of monitoring Besu.

## Install Prometheus

To use Prometheus with Besu, install the [Prometheus main component](https://prometheus.io/download/). On MacOS, install with [Homebrew](https://formulae.brew.sh/formula/prometheus):

```bash
brew install prometheus
```

:::tip

You can also install:

- Exporters that send system metrics to Prometheus to monitor non-Besu-specific items such as disk and CPU usage.
- Other Prometheus components, such as the Alert Manager. Additional configuration is not required for these components because Prometheus handles and analyzes data directly from the feed.

:::

## Set up and run Prometheus with Besu

To configure Prometheus and run with Besu:

1.  Configure Prometheus to poll Besu.
    For example, add the following YAML fragment to the `scrape_configs` block of the `prometheus.yml` file:

    <Tabs>
    <TabItem value="Fragment to insert in prometheus.yml">

    ```yml
    - job_name: besu
      scrape_interval: 15s
      scrape_timeout: 10s
      metrics_path: /metrics
      scheme: http
      static_configs:
        - targets:
            - localhost:9545
    ```

    </TabItem>
    <TabItem value="Full prometheus.yml example"> 

    ```yml
    global:
      scrape_interval: 15s

    scrape_configs:
      - job_name: "prometheus"
        static_configs:
          - targets: ["localhost:9090"]
      - job_name: besu
        scrape_interval: 15s
        scrape_timeout: 10s
        metrics_path: /metrics
        scheme: http
        static_configs:
          - targets:
              - localhost:9545
    ```

    </TabItem>
    </Tabs>

    Prometheus requires 3 MB of space per node per hour for metrics, with a `scrape_interval` of 15 seconds.

2.  Start Besu with the [`--metrics-enabled`](../../reference/cli/options.md#metrics-enabled) option.
    To start a single node for testing with metrics enabled, run the following command:

    <Tabs>
    <TabItem value="Syntax">

    ```bash
    besu --network=dev --rpc-http-cors-origins="all" --rpc-http-enabled --metrics-enabled
    ```

    </TabItem>
    <TabItem value="Example">

    ```bash
    besu --network=dev --rpc-http-cors-origins="all" --rpc-http-enabled --metrics-enabled
    ```

    </TabItem>
    </Tabs>

    To specify the host and port on which Prometheus accesses Besu, use the
    [`--metrics-host`](../../reference/cli/options.md#metrics-host) and
    [`--metrics-port`](../../reference/cli/options.md#metrics-port) options.
    The default host and port are `127.0.0.1` (`localhost`) and `9545`.

    :::danger
    To avoid DNS rebinding attacks, if running Prometheus on a different host than your Besu node
    (any host other than `localhost`), add the hostname that Prometheus uses to
    [`--host-allowlist`](../../reference/cli/options.md#host-allowlist).
    For example, if Prometheus is configured to get metrics from `http://besu.local:8008/metrics`,
    then `besu.local` must be in `--host-allowlist`.
    :::

3.  In another terminal, run Prometheus specifying the `prometheus.yml` file:

    ```bash
    prometheus --config.file=prometheus.yml
    ```

4.  View the [Prometheus graphical interface](#view-prometheus-graphical-interface).

    :::tip
    Use a log ingestion tool, such as Logstash, to parse the logs and alert you to configured anomalies.
    :::

## Run Prometheus with Besu in push mode

The [`--metrics-enabled`](../../reference/cli/options.md#metrics-enabled) option enables Prometheus
polling of Besu, but sometimes metrics are hard to poll (for example, when running inside Docker
containers with varying IP addresses).
To enable Besu to push metrics to a [Prometheus push gateway](https://github.com/prometheus/pushgateway),
use the [`--metrics-push-enabled`](../../reference/cli/options.md#metrics-push-enabled) option.

To configure Prometheus and run with Besu pushing to a push gateway:

1.  Configure Prometheus to read from a push gateway.
    For example, add the following YAML fragment to the `scrape_configs` block of the `prometheus.yml` file:

    ```yml
    - job_name: push-gateway
      metrics_path: /metrics
      scheme: http
      static_configs:
        - targets:
            - localhost:9091
    ```

1.  Start the push gateway.
    You can deploy the push gateway using the Docker image:

    ```bash
    docker pull prom/pushgateway
    docker run -d -p 9091:9091 prom/pushgateway
    ```

1.  Start Besu specifying the `--metrics-push-enabled` option and port of the push gateway:

    <Tabs>
    <TabItem value="Syntax">

    ```bash
    besu --network=dev --rpc-http-cors-origins="all" --rpc-http-enabled --metrics-push-enabled --metrics-push-port=9091 --metrics-push-host=127.0.0.1
    ```

    </TabItem>
    <TabItem value="Example">

    ```bash
    besu --network=dev --rpc-http-cors-origins="all" --rpc-http-enabled --metrics-push-enabled --metrics-push-port=9091 --metrics-push-host=127.0.0.1
    ```

    </TabItem>
    </Tabs>

1.  In another terminal, run Prometheus specifying the `prometheus.yml` file:

    ```bash
    prometheus --config.file=prometheus.yml
    ```

1.  View the [Prometheus graphical interface](#view-prometheus-graphical-interface).

## View Prometheus graphical interface

1. Open a Web browser to [`http://localhost:9090`](http://localhost:9090) to view the Prometheus graphical interface.

1. Choose **Graph** from the menu bar and click the **Console** tab below.

1. From the **Insert metric at cursor** drop-down, select a [metric](#view-the-metrics-list) such as `besu_blockchain_difficulty_total` or `ethereum_blockchain_height` and click **Execute**. The values display.

1. Click the **Graph** tab to view the data as a time-based graph. The query string displays below the graph. For example, `{ethereum_blockchain_height{instance="localhost:9545",job="prometheus"}`.

## View the metrics list

Run the following command to view the full list of available metrics:

```bash
curl http://localhost:9545/metrics
```

Update the host and port if you are not using the default values.

Each metric, such as `besu_blockchain_chain_head_gas_limit`, starts with a metric category prefix.
Metrics specific to Besu use the `besu_` prefix, followed by another metric category.
You can enable metric categories using the
[`--metrics-category`](../../reference/cli/options.md#metrics-category) command line option.

<!-- Links -->

[monitoring with Prometheus and Grafana configured]: ../../../private-networks/tutorials/quickstart.md#monitor-nodes-with-prometheus-and-grafana
