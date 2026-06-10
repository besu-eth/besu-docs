---
title: Use Elastic Stack
sidebar_position: 3
description: Using Elastic Stack (ELK) with Besu
---

# Use Elastic Stack

[Elastic Stack](https://www.elastic.co/elastic-stack/) (ELK) is an open-source log management platform you can use with Besu.
To use ELK, configure the following for your deployment:

- **Filebeat** - This configuration ingests logs.
  See the [example Filebeat configuration](https://github.com/ConsenSys/quorum-dev-quickstart/blob/b72a0f64d685c851bf8be399a8e33bbdf0e09982/files/common/filebeat/filebeat.yml).

- **Metricbeat** - This configuration collects metrics from the nodes at regular defined intervals and outputs them to Redis for storage.
  Redis provides a highly available mechanism enabling storage by any of the Elastic Beats and pulled by Logstash as required.
  See the [example Metricbeat configuration](https://github.com/ConsenSys/quorum-dev-quickstart/blob/b72a0f64d685c851bf8be399a8e33bbdf0e09982/files/common/metricbeat/metricbeat.yml).

- **Pipeline configuration** - This defines the JSON format used for Besu logs and automatically picks up any new log fields.
  See the [example pipeline configuration](https://github.com/ConsenSys/quorum-dev-quickstart/blob/b72a0f64d685c851bf8be399a8e33bbdf0e09982/files/common/logstash/pipeline/20_besu.conf).

  :::note

  The pipeline configuration must match the your log format.
  If using the default log format, you can use the [Grok plugin](https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html) to extract the log fields.

  :::
