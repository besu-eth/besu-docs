---
title: Use Grafana Loki
sidebar_position: 2
description: Using Grafana Loki log management platform with Besu
---

# Grafana Loki

[Grafana Loki] is an open-source log management platform that is available when using the [Developer Quickstart](../../tutorials/quickstart.md).

The [Promtail configuration] ingests logs at regular defined intervals and outputs them to [Loki] for storage.

The `pipeline configuration` in Promtail defines pipeline stages that can collate logs natively or using the JSON format.

:::note

If using the pipeline regex stage in `Promtail`, configuration must match your log format.

:::

To view the GoQuorum Quickstart network logs in Loki:

1. [Start the Developer Quickstart with Besu](../../tutorials/quickstart.md), selecting Loki monitoring.
2. Open the [`Grafana Loki address`](http://localhost:3000/d/Ak6eXLsPxFemKYKEXfcH/quorum-logs-loki?orgId=1&var-app=besu&var-search=&from=now-15m&to=now) listed by the sample networks `list.sh` script.

   The logs display in Loki.

   ![Loki logs](../../../assets/images/grafana_loki.png)

<!-- Links -->

[Promtail configuration]: https://github.com/ConsenSys/quorum-dev-quickstart/blob/master/files/common/promtail/promtail.yml
[pipeline configuration]: https://github.com/ConsenSys/quorum-dev-quickstart/blob/master/files/common/promtail/promtail.yml
[Loki]: https://github.com/ConsenSys/quorum-dev-quickstart/blob/master/files/common/loki/loki.yml
[Grafana Loki]: https://grafana.com/oss/loki/
