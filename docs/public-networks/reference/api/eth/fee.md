---
title: Fee market methods
description: Besu ETH JSON-RPC API fee market methods reference
sidebar_label: Fee market
sidebar_position: 6
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

These methods query gas price and fee market information, including the base fee, blob base fee, fee history, and priority fees.

## `eth_baseFee`

Returns the base fee per gas for the next block in wei.

### Parameters

- None

### Returns

- Hexadecimal integer representing the base fee per gas for the next block in wei, or `null` if the network does not support [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559).

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_baseFee",
    "params": [],
    "id": 51
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_baseFee",
  "params": [],
  "id": 51
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 51,
  "result": "0x8"
}
```

</TabItem>

</Tabs>

---

## `eth_blobBaseFee`

Returns the base fee per blob gas in wei.

:::info

[Shard blob transactions](../../../concepts/transactions/types.md#blob-transactions) enable scaling Ethereum by allowing blobs of
data to be stored temporarily by consensus clients.

:::

### Parameters

- None

### Returns

- Hexadecimal integer representing the base fee per blob gas.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_blobBaseFee",
    "params": [],
    "id": 51
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_blobBaseFee",
  "params": [],
  "id": 51
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 51,
  "result": "0x3f5694c1f"
}
```
</TabItem>
</Tabs>

---

## `eth_feeHistory`

Returns base fee per gas and transaction effective priority fee per gas history for the requested block
range, allowing you to track trends over time.

As of [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844), this method tracks transaction blob gas fees as well.  

### Parameters

- `blockCount`: _integer_ or _string_ - Number of blocks in the requested range. Between 1 and 1024 blocks can be requested in a single query. If blocks in the specified block range are not available, then only the fee history for available blocks is returned. Accepts hexadecimal or integer values.

- `newestBlock`: _string_ - Hexadecimal integer representing the highest number block of
  the requested range, or one of the string tags `latest`, `earliest`, `pending`, `finalized`, or
  `safe`, as described in [block parameter](../../../how-to/use-besu-api/json-rpc.md#block-parameter).

  :::note
  `pending` returns the same value as `latest`.
  :::

- `array` of `integers` - (optional) A monotonically increasing list of percentile values to sample from each block's effective priority fees per gas in ascending order, weighted by gas used.

### Returns

- Fee history results object.

  <Fields>

  - `oldestBlock`: _quantity, integer_ - Lowest number block of the returned range.

  - `baseFeePerGas`: _array_ - Array of block base fees per gas, including an extra block value. The extra value is the next block after the newest block in the returned range. Returns zeroes for blocks created before [EIP-1559](https://github.com/ethereum/EIPs/blob/2d8a95e14e56de27c5465d93747b0006bd8ac47f/EIPS/eip-1559.md).

  - `baseFeePerBlobGas`: _array_ - Array of base fees per blob gas. Returns zeroes for blocks created before [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844).

  - `gasUsedRatio`: _array_ - Array of block gas used ratios. These are calculated as the ratio of `gasUsed` and `gasLimit`.

  - `blobGasUsedRatio`: _array_ - Array of blob gas used ratios. These are calculated as the ratio of `blobGasUsed` and the max blob gas per block.

  - `reward`: _array_ - Array of effective priority fee per gas data points from a single block. All zeroes are returned if the block is empty.

  </Fields>

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_feeHistory",
    "params": [
      "0x5",
      "latest",
      [
        20,
        30
      ]
    ],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_feeHistory",
  "params": [
    "0x5",
    "latest",
    [
      20,
      30
    ]
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
    "result": {
        "oldestBlock": "0x10b52f",
        "baseFeePerGas": [
            "0x3fa63a3f",
            "0x37f999ee",
            "0x3e36f20a",
            "0x4099f79a",
            "0x430d532d",
            "0x46fcd4a4"
        ],
        "baseFeePerBlobGas": [
            "0x7b7609c19",
            "0x6dbe41789",
            "0x7223341d4",
            "0x6574a002c",
            "0x7223341d4",
            "0x6574a002c"
        ],
        "gasUsedRatio": [
            0.017712333333333333,
            0.9458865666666667,
            0.6534561,
            0.6517375666666667,
            0.7347769666666667
        ],
        "blobGasUsedRatio": [
            0.0,
            0.6666666666666666,
            0.0,
            1.0,
            0.0
        ],
        "reward": [
            [
                "0x3b9aca00",
                "0x59682f00"
            ],
            [
                "0x3a13012",
                "0x3a13012"
            ],
            [
                "0xf4240",
                "0xf4240"
            ],
            [
                "0xf4240",
                "0xf4240"
            ],
            [
                "0xf4240",
                "0xf4240"
            ]
        ]
    }
}
```

</TabItem>

</Tabs>

---

## `eth_gasPrice`

Returns a percentile gas unit price for the most recent blocks, in wei. By default, the last 100 blocks are examined and the 50th percentile gas unit price (that is, the median value) is returned.

If there are no blocks, the value for [`--min-gas-price`](../../cli/options.md#min-gas-price) is returned. The value returned is restricted to values between [`--min-gas-price`](../../cli/options.md#min-gas-price) and [`--api-gas-price-max`](../../cli/options.md#api-gas-price-max). By default, 1000 wei and 500 gwei.

Use the [`--api-gas-price-blocks`](../../cli/options.md#api-gas-price-blocks), [`--api-gas-price-percentile`](../../cli/options.md#api-gas-price-percentile) , and [`--api-gas-price-max`](../../cli/options.md#api-gas-price-max) command line options to configure the `eth_gasPrice` default values.

### Parameters

- None

### Returns

- Percentile gas unit price for the most recent blocks, in wei, as a hexadecimal value.

### Example

<Tabs>

<TabItem value="curl HTTP" label="curl HTTP" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_gasPrice",
    "params": [],
    "id": 53
  }'
```

</TabItem>

<TabItem value="wscat WS" label="wscat WS">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_gasPrice",
  "params": [],
  "id": 53
}
```

</TabItem>

<TabItem value="JSON result" label="JSON result">

```json
{
  "jsonrpc": "2.0",
  "id": 53,
  "result": "0x3e8"
}
```

</TabItem>

<TabItem value="curl GraphQL" label="curl GraphQL">

```bash
curl -X POST http://localhost:8547/graphql \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{gasPrice}"
  }'
```

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

```text
{
  gasPrice
}
```

</TabItem>

<TabItem value="GraphQL result" label="GraphQL result">

```json
{
  "data": {
    "gasPrice": "0x3e8"
  }
}
```

</TabItem>

</Tabs>

---

## `eth_maxPriorityFeePerGas`

Returns an estimate of how much priority fee, in wei, you can pay to get a transaction included in the current block.

### Parameters

- None

### Returns

- Hexadecimal value in wei.

### Example

<Tabs>

<TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST http://127.0.0.1:8545/ \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_maxPriorityFeePerGas",
    "params": [],
    "id": 1
  }'
```

</TabItem>

<TabItem value="wscat WS request" label="wscat WS request">

```json
{
  "jsonrpc": "2.0",
  "method": "eth_maxPriorityFeePerGas",
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
  "result": "0xf4240"
}
```

</TabItem>

</Tabs>
