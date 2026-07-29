---
title: Filter and log methods
description: Besu ETH JSON-RPC API filter and log methods reference
sidebar_label: Filter and log
sidebar_position: 7
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

These methods create, poll, and remove filters, and query event logs.

## `eth_getFilterChanges`

Polls the specified filter and returns an array of changes that have occurred since the last poll.

### Parameters

- `filterId`: _string_ - Filter ID.

### Returns

- If nothing changed since the last poll, an empty list; otherwise:

  - For filters created with `eth_newBlockFilter`, returns block hashes.

  - For filters created with `eth_newPendingTransactionFilter`, returns transaction hashes.

  - For filters created with `eth_newFilter`, returns log objects.

    <Fields>

    - `removed`: _tag_ - `true` if log removed because of a chain reorganization. `false` if a valid log.

    - `logIndex`: _quantity, integer_ - Log index position in the block. `null` when log is pending.

    - `transactionIndex`: _quantity, integer_ - Index position of the starting transaction for the log. `null` when log is pending.

    - `transactionHash`: _data, 32 bytes_ - Hash of the starting transaction for the log. `null` when log is pending.

    - `blockHash`: _data, 32 bytes_ - Hash of the block that includes the log. `null` when log is pending.

    - `blockNumber`: _quantity_ - Number of block that includes the log. `null` when log is pending.

    - `blockTimestamp`: _quantity_ - Hex-encoded unix timestamp (in seconds) of the block that includes the log.

    - `address`: _data, 20 bytes_ - Address the log originated from.

    - `data`: _data_ - Non-indexed arguments of the log.

    - `topics`: _array of data, 32 bytes each_ - [Event signature hash](../../../concepts/events-and-logs.md#event-signature-hash) and 0 to 3 [indexed log arguments](../../../concepts/events-and-logs.md#event-parameters).

    </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getFilterChanges",
    "params": [
      "0xf8bf5598d9e04fbe84523d42640b9b0e"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getFilterChanges",
  "params": [
    "0xf8bf5598d9e04fbe84523d42640b9b0e"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json title="Example result from a filter created with eth_newBlockFilter"
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    "0xda2bfe44bf85394f0d6aa702b5af89ae50ae22c0928c18b8903d9269abe17e0b",
    "0x88cd3a37306db1306f01f7a0e5b25a9df52719ad2f87b0f88ee0e6753ed4a812",
    "0x4d4c731fe129ff32b425e6060d433d3fde278b565bbd1fd624d5a804a34f8786"
  ]
}
```

```json title="Example result from a filter created with eth_newPendingTransactionFilter"
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    "0x1e977049b6db09362da09491bee3949d9362080ce3f4fc19721196d508580d46",
    "0xa3abc4b9a4e497fd58dc59cdff52e9bb5609136bcd499e760798aa92802769be"
  ]
}
```

```json title="Example result from a filter created with eth_newFilter"
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "logIndex": "0x0",
      "removed": false,
      "blockNumber": "0x233",
      "blockHash": "0xfc139f5e2edee9e9c888d8df9a2d2226133a9bd87c88ccbd9c930d3d4c9f9ef5",
      "blockTimestamp": "0x55ba4769",
      "transactionHash": "0x66e7a140c8fa27fe98fde923defea7562c3ca2d6bb89798aabec65782c08f63d",
      "transactionIndex": "0x0",
      "address": "0x42699a7612a82f1d9c36148af9c77354759b210b",
      "data": "0x0000000000000000000000000000000000000000000000000000000000000004",
      "topics": [
        "0x04474795f5b996ff80cb47c148d4c5ccdbe09ef27551820caa9c2f8ed149cce3"
      ]
    },
    {
      "logIndex": "0x0",
      "removed": false,
      "blockNumber": "0x238",
      "blockHash": "0x98b0ec0f9fea0018a644959accbe69cd046a8582e89402e1ab0ada91cad644ed",
      "blockTimestamp": "0x55ba4773",
      "transactionHash": "0xdb17aa1c2ce609132f599155d384c0bc5334c988a6c368056d7e167e23eee058",
      "transactionIndex": "0x0",
      "address": "0x42699a7612a82f1d9c36148af9c77354759b210b",
      "data": "0x0000000000000000000000000000000000000000000000000000000000000007",
      "topics": [
        "0x04474795f5b996ff80cb47c148d4c5ccdbe09ef27551820caa9c2f8ed149cce3"
      ]
    }
  ]
}
```

</TabItem>

</Tabs>

---

## `eth_getFilterLogs`

Returns an array of [logs](../../../concepts/events-and-logs.md) for the specified filter.

Leave the [`--auto-log-bloom-caching-enabled`](../../options.md#auto-log-bloom-caching-enabled) command line option at the default value of `true` to improve log retrieval performance.

:::note

`eth_getFilterLogs` is only used for filters created with `eth_newFilter`. To specify a filter object and get logs without creating a filter, use `eth_getLogs`.

:::

### Parameters

- `filterId`: _string_ - Filter ID.

### Returns

- List of log objects.

  <Fields>

  - `removed`: _tag_ - `true` if log removed because of a chain reorganization. `false` if a valid log.

  - `logIndex`: _quantity, integer_ - Log index position in the block. `null` when log is pending.

  - `transactionIndex`: _quantity, integer_ - Index position of the starting transaction for the log. `null` when log is pending.

  - `transactionHash`: _data, 32 bytes_ - Hash of the starting transaction for the log. `null` when log is pending.

  - `blockHash`: _data, 32 bytes_ - Hash of the block that includes the log. `null` when log is pending.

  - `blockNumber`: _quantity_ - Number of block that includes the log. `null` when log is pending.

  - `blockTimestamp`: _quantity_ - Hex-encoded unix timestamp (in seconds) of the block that includes the log.

  - `address`: _data, 20 bytes_ - Address the log originated from.

  - `data`: _data_ - Non-indexed arguments of the log.

  - `topics`: _array of data, 32 bytes each_ - [Event signature hash](../../../concepts/events-and-logs.md#event-signature-hash) and 0 to 3 [indexed log arguments](../../../concepts/events-and-logs.md#event-parameters).

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getFilterLogs",
    "params": [
      "0x5ace5de3985749b6a1b2b0d3f3e1fb69"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getFilterLogs",
  "params": [
    "0x5ace5de3985749b6a1b2b0d3f3e1fb69"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "logIndex": "0x0",
      "removed": false,
      "blockNumber": "0xb3",
      "blockHash": "0xe7cd776bfee2fad031d9cc1c463ef947654a031750b56fed3d5732bee9c61998",
      "blockTimestamp": "0x55ba4486",
      "transactionHash": "0xff36c03c0fba8ac4204e4b975a6632c862a3f08aa01b004f570cc59679ed4689",
      "transactionIndex": "0x0",
      "address": "0x2e1f232a9439c3d459fceca0beef13acc8259dd8",
      "data": "0x0000000000000000000000000000000000000000000000000000000000000003",
      "topics": [
        "0x04474795f5b996ff80cb47c148d4c5ccdbe09ef27551820caa9c2f8ed149cce3"
      ]
    },
    {
      "logIndex": "0x0",
      "removed": false,
      "blockNumber": "0xb6",
      "blockHash": "0x3f4cf35e7ed2667b0ef458cf9e0acd00269a4bc394bb78ee07733d7d7dc87afc",
      "blockTimestamp": "0x55ba448c",
      "transactionHash": "0x117a31d0dbcd3e2b9180c40aca476586a648bc400aa2f6039afdd0feab474399",
      "transactionIndex": "0x0",
      "address": "0x2e1f232a9439c3d459fceca0beef13acc8259dd8",
      "data": "0x0000000000000000000000000000000000000000000000000000000000000005",
      "topics": [
        "0x04474795f5b996ff80cb47c148d4c5ccdbe09ef27551820caa9c2f8ed149cce3"
      ]
    }
  ]
}
```

</TabItem>

</Tabs>

---

## `eth_getLogs`

Returns an array of [logs](../../../concepts/events-and-logs.md) matching a specified filter object.

Leave the [`--auto-log-bloom-caching-enabled`](../../options.md#auto-log-bloom-caching-enabled) command line option at the default value of `true` to improve log retrieval performance.

:::caution

Using `eth_getLogs` to get logs from a large range of blocks, especially an entire chain from its genesis block, might cause Besu to hang for an indeterminable amount of time while generating the response. We recommend setting a range limit using the [`--rpc-max-logs-range`](../../options.md#rpc-max-logs-range) option (or leaving it at its default value of 1000).

:::

### Parameters

- `filterOptions`: _object_ - Filter options object.

  <Fields>

  - `fromBlock`: _quantity | tag_ - (Optional) Integer block number or `latest`, `pending`, `earliest`. See [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).
    The default is `latest`.

  - `toBlock`: _quantity | tag_ - (Optional) Integer block number or `latest`, `pending`, `earliest`. See [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).
    The default is `latest`.

  - `address`: _data | array_ - (Optional) Contract address or array of addresses from which [logs](../../../concepts/events-and-logs.md) originate.

  - `topics`: _array of data, 32 bytes each_ - (Optional) Array of topics by which to [filter logs](../../../concepts/events-and-logs.md#topic-filters).

  - `blockHash`: _data, 32 bytes_ - (Optional) Hash of block for which to return logs. If you specify `blockHash`, you cannot specify `fromBlock` and `toBlock`.

  </Fields>

### Returns

- List of log objects.

  <Fields>

  - `removed`: _tag_ - `true` if log removed because of a chain reorganization. `false` if a valid log.

  - `logIndex`: _quantity, integer_ - Log index position in the block. `null` when log is pending.

  - `transactionIndex`: _quantity, integer_ - Index position of the starting transaction for the log. `null` when log is pending.

  - `transactionHash`: _data, 32 bytes_ - Hash of the starting transaction for the log. `null` when log is pending.

  - `blockHash`: _data, 32 bytes_ - Hash of the block that includes the log. `null` when log is pending.

  - `blockNumber`: _quantity_ - Number of block that includes the log. `null` when log is pending.

  - `blockTimestamp`: _quantity_ - Hex-encoded unix timestamp (in seconds) of the block that includes the log.

  - `address`: _data, 20 bytes_ - Address the log originated from.

  - `data`: _data_ - Non-indexed arguments of the log.

  - `topics`: _array of data, 32 bytes each_ - [Event signature hash](../../../concepts/events-and-logs.md#event-signature-hash) and 0 to 3 [indexed log arguments](../../../concepts/events-and-logs.md#event-parameters).

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getLogs",
    "params": [
      {
        "fromBlock": "0x16e2a9a",
        "toBlock": "0x16e2a9a",
        "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "topics": []
      }
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getLogs",
  "params": [
    {
      "fromBlock": "0x16e2a9a",
      "toBlock": "0x16e2a9a",
      "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "topics": []
    }
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "removed": false,
      "logIndex": "0x2",
      "transactionIndex": "0x0",
      "transactionHash": "0xf9bde920aba1c0eb632138ae21d3f019977de264a4714a54f1ae2e337cce4e3d",
      "blockHash": "0xa02851f445eea915ef51c54f1352a773c3821a1860d49c6d3e94a16659291c19",
      "blockNumber": "0x16e2a9a",
      "blockTimestamp": "0x693c23db",
      "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "data": "0x00000000000000000000000000000000000000000000000001112ea12c39c032",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378da...9d4b2b7fad"
      ]
    },
    {
      "removed": false,
      "logIndex": "0x6",
      "transactionIndex": "0x0",
      "transactionHash": "0xf9bde920aba1c0eb632138ae21d3f019977de264a4714a54f1ae2e337cce4e3d",
      "blockHash": "0xa02851f445eea915ef51c54f1352a773c3821a1860d49c6d3e94a16659291c19",
      "blockNumber": "0x16e2a9a",
      "blockTimestamp": "0x693c23db",
      "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "data": "0x00000000000000000000000000000000000000000000000001112ea12c39c032",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378d...629ba9375161"
      ]
    }
  ]
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{logs(filter:{fromBlock: 24000026, toBlock: 24000026, addresses: [\"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2\"]}) {index topics data account{address} transaction{hash} }}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  logs(filter: {fromBlock: 24000026, toBlock: 24000026, addresses: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"]}) {
    index
    topics
    data
    account {
      address
    }
    transaction {
      hash
    }
  }
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "logs": [
      {
        "index": 2,
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378...d4b2b7fad"
        ],
        "data": "0x00000000000000000000000000000000000000000000000001112ea12c39c032",
        "account": {
          "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
        },
        "transaction": {
          "hash": "0xf9bde920aba1c0eb632138ae21d3f019977de264a4714a54f1ae2e337cce4e3d"
        }
      },
      {
        "index": 6,
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378...9ba9375161"
        ],
        "data": "0x00000000000000000000000000000000000000000000000001112ea12c39c032",
        "account": {
          "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
        },
        "transaction": {
          "hash": "0xf9bde920aba1c0eb632138ae21d3f019977de264a4714a54f1ae2e337cce4e3d"
        }
      }
    ]
  }
}
```

</TabItem>

</Tabs>

---

## `eth_newBlockFilter`

Creates a filter to retrieve new block hashes. To poll for new blocks, use [`eth_getFilterChanges`](#eth_getfilterchanges).

### Parameters

- None

### Returns

- Filter ID.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_newBlockFilter",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_newBlockFilter",
  "params": [],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x9d78b6780f844228b96ecc65a320a825"
}
```

</TabItem>

</Tabs>

---

## `eth_newFilter`

Creates a [log filter](../../../concepts/events-and-logs.md). To poll for logs associated with the created filter, use [`eth_getFilterChanges`](#eth_getfilterchanges). To get all logs associated with the filter, use [`eth_getFilterLogs`](#eth_getfilterlogs).

### Parameters

- `filterOptions`: _object_ - Filter options object.

  <Fields>

  - `fromBlock`: _quantity | tag_ - (Optional) Integer block number or `latest`, `pending`, `earliest`. See [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).
    The default is `latest`.

  - `toBlock`: _quantity | tag_ - (Optional) Integer block number or `latest`, `pending`, `earliest`. See [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).
    The default is `latest`.

  - `address`: _data | array_ - (Optional) Contract address or array of addresses from which [logs](../../../concepts/events-and-logs.md) originate.

  - `topics`: _array of data, 32 bytes each_ - (Optional) Array of topics by which to [filter logs](../../../concepts/events-and-logs.md#topic-filters).

  - `blockHash`: _data, 32 bytes_ - (`eth_getLogs` only) (Optional) Hash of block for which to return logs. If you specify `blockHash`, you cannot specify `fromBlock` and `toBlock`.

  </Fields>

### Returns

- Filter ID.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_newFilter",
    "params": [
      {
        "fromBlock": "earliest",
        "toBlock": "latest",
        "topics": []
      }
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_newFilter",
  "params": [
    {
      "fromBlock": "earliest",
      "toBlock": "latest",
      "topics": []
    }
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1ddf0c00989044e9b41cc0ae40272df3"
}
```

</TabItem>

</Tabs>

---

## `eth_newPendingTransactionFilter`

Creates a filter to retrieve new pending transactions hashes. To poll for new pending transactions, use [`eth_getFilterChanges`](#eth_getfilterchanges).

### Parameters

- None

### Returns

- Filter ID.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_newPendingTransactionFilter",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_newPendingTransactionFilter",
  "params": [],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x443d6a77c4964707a8554c92f7e4debd"
}
```

</TabItem>

</Tabs>

---

## `eth_uninstallFilter`

Uninstalls a filter with the specified ID. When a filter is no longer required, call this method.

Filters time out when not requested by [`eth_getFilterChanges`](#eth_getfilterchanges) or [`eth_getFilterLogs`](#eth_getfilterlogs) for 10 minutes.

### Parameters

- `filterId`: _string_ - Filter ID.

### Returns

- Indicates if the filter is successfully uninstalled.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_uninstallFilter",
    "params": [
      "0x70355a0b574b437eaa19fe95adfedc0a"
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_uninstallFilter",
  "params": [
    "0x70355a0b574b437eaa19fe95adfedc0a"
  ],
  "id": 1
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```

</TabItem>

</Tabs>
