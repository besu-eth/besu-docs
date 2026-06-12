---
title: Use Grafana Loki
sidebar_position: 2
description: Using Grafana Loki log management platform with Besu
---

# Grafana Loki

[Grafana Loki] is an open-source log management platform that is available when using the [Developer Quickstart](../../tutorials/quickstart.md).
The generated quickstart network uses Grafana Alloy to collect Besu logs and send them to Loki.

## View quickstart logs in Loki

1. Generate a private network using the [Developer Quickstart](../../tutorials/quickstart.md).
2. Open the Grafana logs URL listed by `./list.sh`.
   The URL uses Grafana Explore:

   ```text
   http://localhost:3000/a/grafana-lokiexplore-app/explore
   ```

3. Select the Loki data source if Grafana doesn't select it automatically.

   The logs display in Grafana.

   ![Loki logs](../../../assets/images/grafana_loki.png)

<!-- Links -->

[Grafana Loki]: https://grafana.com/oss/loki/
