---
title: QBFT
description: Besu QBFT proof of authority (PoA) consensus protocol implementation
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Configure QBFT consensus

Besu implements the QBFT proof of authority (PoA) [consensus protocol](index.md). QBFT is the recommended enterprise-grade consensus protocol for private networks.

In QBFT networks, approved accounts, known as validators, validate transactions and blocks. Validators take turns to create the next block. Before inserting the block onto the chain, a super-majority (greater than or equal to 2/3) of validators must first sign the block.

Existing validators propose and vote to [add or remove validators](#add-and-remove-validators).

You can [create a private network using QBFT](../../../tutorials/qbft.md).

:::caution

Configure your network to ensure you never lose more than 1/3 of your validators.
If more than 1/3 of validators stop participating, the network stops creating new blocks and stalls.
It might take significant time to recover after nodes are restarted.

:::

:::tip

You can use a plugin to securely store a validator's key using the [`--security-module`](../../../../public-networks/reference/cli/options.md#security-module) option.

:::

## Genesis file

To use QBFT, define a [genesis file](../../../../public-networks/concepts/genesis-file.md) that contains the QBFT properties.

The genesis file differs depending on the [validator management method](#add-and-remove-validators) you intend to use.

:::note

You can use a [transitions](#transitions) to change the `blockperiodseconds` or validator management method of the network at a later time.

:::

<Tabs>

<TabItem value="Block header validator selection" label="Block header validator selection" default>

```json
{
  "config": {
    "chainid": 1337,
    "berlinBlock": 0,
    "qbft": {
      "epochlength": 30000,
      "blockperiodseconds": 5,
      "requesttimeoutseconds": 10
    }
  },
  "nonce": "0x0",
  "timestamp": "0x5b3d92d7",
  "extraData": "0xf87aa00000000000000000000000000000000000000000000000000000000000000000f8549464a702e6263b7297a96638cac6ae65e6541f4169943923390ad55e90c237593b3b0e401f3b08a0318594aefdb9a738c9f433e5b6b212a6d62f6370c2f69294c7eeb9a4e00ce683cf93039b212648e01c6c6b78c080c0",
  "gasLimit": "0x29b92700",
  "difficulty": "0x1",
  "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
  "coinbase": "0x0000000000000000000000000000000000000000",
  "alloc": {
    "64d9be4177f418bcf4e56adad85f33e3a64efe22": {
      "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
    },
    "9f66f8a0f0a6537e4a36aa1799673ea7ae97a166": {
      "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
    },
    "a7f25969fb6f3d5ac09a88862c90b5ff664557a7": {
      "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
    },
    "f4bbfd32c11c9d63e9b4c77bb225810f840342df": {
      "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
    }
  },
  "number": "0x0",
  "gasUsed": "0x0",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
```

</TabItem>

<TabItem value="Contract validator selection" label="Contract validator selection">

```json
{
  "config": {
    "chainid": 1337,
    "berlinBlock": 0,
    "qbft": {
      "epochlength": 30000,
      "blockperiodseconds": 5,
      "requesttimeoutseconds": 10,
      "validatorcontractaddress": "0x0000000000000000000000000000000000007777"
    }
  },
  "nonce": "0x0",
  "timestamp": "0x5b3d92d7",
  "extraData": "0xe5a00000000000000000000000000000000000000000000000000000000000000000c0c080c0",
  "gasLimit": "0x29b92700",
  "difficulty": "0x1",
  "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
  "coinbase": "0x0000000000000000000000000000000000000000",
  "alloc": {
    "64d9be4177f418bcf4e56adad85f33e3a64efe22": {
      "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
    },
    "9f66f8a0f0a6537e4a36aa1799673ea7ae97a166": {
      "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
    },
    "a7f25969fb6f3d5ac09a88862c90b5ff664557a7": {
      "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
    },
    "f4bbfd32c11c9d63e9b4c77bb225810f840342df": {
      "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
    },
    "0x0000000000000000000000000000000000007777": {
      "comment": "validator smart contract",
      "balance": "0",
      "code": "0x608060405234801561001057600080fd5b50600436106100a5576000357c0100000000000000000000000000000000000000000000000000000000900480639692ea25116100785780639692ea2514610113578063b4ec9ac114610126578063b7ab4db514610139578063c76f24371461014e57600080fd5b80631c5a9d9c146100aa578063508adcfc146100bf57806351b42b00146100db5780635dc43899146100e3575b600080fd5b6100bd6100b8366004611399565b610161565b005b6100c860035481565b6040519081526020015b60405180910390f35b6100bd6104aa565b6100f66100f1366004611399565b61074e565b6040805193845260208401929092521515908201526060016100d2565b6100bd610121366004611399565b610bbd565b6100bd610134366004611399565b610deb565b6101416110a3565b6040516100d291906113c9565b6100bd61015c366004611399565b611105565b3360009081526001602052604090205460ff1661019c5760405160e560020a62461bcd02815260040161019390611416565b60405180910390fd5b600160a060020a03811661021b5760405160e560020a62461bcd02815260206004820152602860248201527f63616e6e6f742061637469766174652076616c696461746f722077697468206160448201527f64647265737320300000000000000000000000000000000000000000000000006064820152608401610193565b60005b6000548110156102b7576000818154811061023b5761023b611505565b600091825260209091200154600160a060020a03838116911614156102a55760405160e560020a62461bcd02815260206004820152601b60248201527f76616c696461746f7220697320616c72656164792061637469766500000000006044820152606401610193565b806102af816114b8565b91505061021e565b33600090815260016020526040902054610100900460ff16156103345733600090815260016020526040812054815484929162010000900460ff1690811061030157610301611505565b9060005260206000200160006101000a815481600160a060020a030219169083600160a060020a03160217905550610432565b600054610100116103b05760405160e560020a62461bcd02815260206004820152602e60248201527f6e756d626572206f662076616c696461746f72732063616e6e6f74206265206c60448201527f6172676572207468616e203235360000000000000000000000000000000000006064820152608401610193565b3360009081526001602081905260408220805461ff001981166101009081178355845460ff16620100000262ffff001990921691909117179055815490810182559080527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563018054600160a060020a038416600160a060020a03199091161790555b600160a060020a0382166000818152600260205260408082208054600160a060020a03191633908117909155915490519192917fbdea108da876d927928b65816d521f940fd6dc068dc0e02ba434e0ed0f2d915f9161049e916001909182521515602082015260400190565b60405180910390a35050565b3360009081526001602052604090205460ff166104dc5760405160e560020a62461bcd02815260040161019390611416565b6000546001106105315760405160e560020a62461bcd02815260206004820181905260248201527f63616e6e6f742064656163746976617465206c6173742076616c696461746f726044820152606401610193565b33600090815260016020526040902054610100900460ff166105be5760405160e560020a62461bcd02815260206004820152602860248201527f73656e64657220646f6573206e6f74206861766520616e20616374697665207660448201527f616c696461746f720000000000000000000000000000000000000000000000006064820152608401610193565b336000908152600160205260408120805461ff0019169081905581546201000090910460ff1691908190839081106105f8576105f8611505565b60009182526020822001548154600160a060020a03909116925081906106209060019061148a565b8154811061063057610630611505565b60009182526020822001548154600160a060020a03909116925082919060ff861690811061066057610660611505565b60009182526020808320919091018054600160a060020a031916600160a060020a03948516179055838316825260028152604080832054909316825260019052908120805462ff000019166201000060ff8716021790558054806106c6576106c66114ec565b6000828152602080822060001990840181018054600160a060020a03199081169091559301909355600160a060020a03851680825260028452604080832080549094169093558154835190815293840191909152339290917fbdea108da876d927928b65816d521f940fd6dc068dc0e02ba434e0ed0f2d915f910160405180910390a3505050565b336000908152600160205260408120548190819060ff166107845760405160e560020a62461bcd02815260040161019390611416565b60005b600160a060020a03851660009081526004602052604090205481101561082357600160a060020a038516600090815260046020526040812080546001929190849081106107d6576107d6611505565b6000918252602080832090910154600160a060020a0316835282019290925260400190205460ff1615610811578361080d816114b8565b9450505b8061081b816114b8565b915050610787565b5060026003546108339190611465565b831115610b8657600160a060020a038416600090815260046020526040812061085b9161135f565b600160a060020a03841660009081526001602052604090205460ff1615610ab0576003805490600061088c836114a1565b9091555050600160a060020a038416600090815260016020526040902054610100900460ff1615610a89576000546001106109325760405160e560020a62461bcd02815260206004820152603860248201527f63616e6e6f742072656d6f766520616c6c6f776564206163636f756e7420776960448201527f7468206c617374206163746976652076616c696461746f7200000000000000006064820152608401610193565b600160a060020a03841660009081526001602052604081205481546201000090910460ff169160029181908490811061096d5761096d611505565b6000918252602080832090910154600160a060020a0316835282019290925260400181208054600160a060020a0319169055805481906109af9060019061148a565b815481106109bf576109bf611505565b60009182526020822001548154600160a060020a03909116925082919060ff85169081106109ef576109ef611505565b600091825260208220018054600160a060020a031916600160a060020a039390931692909217909155805480610a2757610a276114ec565b6000828152602080822083016000199081018054600160a060020a0319169055909201909255600160a060020a0392831682526002815260408083205490931682526001905220805460ff909216620100000262ff0000199092169190911790555b600160a060020a0384166000908152600160205260409020805462ffffff19169055610b32565b60038054906000610ac0836114b8565b909155505060408051606081018252600180825260006020808401828152848601838152600160a060020a038b16845293909152939020915182549351915160ff16620100000262ff0000199215156101000261ff00199215159290921661ffff199095169490941717169190911790555b600160a060020a03841660008181526001602090815260409182902054915160ff909216151582527f94154efdb7741591680558a88682943a481f1a468cb81f46fe7f8cead2e40519910160405180910390a25b826002600354610b969190611465565b610ba190600161144d565b6002600354610bb09190611465565b9196909550931192915050565b3360009081526001602052604090205460ff16610bef5760405160e560020a62461bcd02815260040161019390611416565b60005b600160a060020a038216600090815260046020526040902054811015610d4b57600160a060020a0382166000908152600460205260409020805433919083908110610c3f57610c3f611505565b600091825260209091200154600160a060020a03161415610d3957600160a060020a03821660009081526004602052604090208054610c809060019061148a565b81548110610c9057610c90611505565b6000918252602080832090910154600160a060020a03858116845260049092526040909220805491909216919083908110610ccd57610ccd611505565b60009182526020808320919091018054600160a060020a031916600160a060020a039485161790559184168152600490915260409020805480610d1257610d126114ec565b60008281526020902081016000199081018054600160a060020a0319169055019055610d4b565b80610d43816114b8565b915050610bf2565b50600160a060020a0381166000818152600460205260409020546003543392917f91ad81c76cda7c0ccc324838ae74757eab38b250da52daab154daf408cb3bcba91610d9990600290611465565b610da490600161144d565b600160a060020a0386166000908152600160208181526040928390205483519586529085019390935260ff909216159083015260608201526080015b60405180910390a350565b3360009081526001602052604090205460ff16610e1d5760405160e560020a62461bcd02815260040161019390611416565b600160a060020a038116610e765760405160e560020a62461bcd02815260206004820152601f60248201527f6163636f756e7420746f2062652061646465642063616e6e6f742062652030006044820152606401610193565b600160a060020a03811660009081526001602081905260409091205460ff16151514610f0d5760405160e560020a62461bcd02815260206004820152602a60248201527f6163636f756e7420746f2072656d6f7665206973206e6f74206f6e207468652060448201527f616c6c6f77206c697374000000000000000000000000000000000000000000006064820152608401610193565b60005b600160a060020a038216600090815260046020526040902054811015610ffb57600160a060020a0382166000908152600460205260409020805433919083908110610f5d57610f5d611505565b600091825260209091200154600160a060020a03161415610fe95760405160e560020a62461bcd02815260206004820152602a60248201527f73656e6465722068617320616c726561647920766f74656420746f2072656d6f60448201527f7665206163636f756e74000000000000000000000000000000000000000000006064820152608401610193565b80610ff3816114b8565b915050610f10565b50600160a060020a0381166000818152600460209081526040822080546001810182558184529183209091018054600160a060020a0319163390811790915591839052546003549192917f91ad81c76cda7c0ccc324838ae74757eab38b250da52daab154daf408cb3bcba919061107490600290611465565b61107f90600161144d565b60408051928352602083019190915260009082018190526060820152608001610de0565b606060008054806020026020016040519081016040528092919081815260200182805480156110fb57602002820191906000526020600020905b8154600160a060020a031681526001909101906020018083116110dd575b5050505050905090565b3360009081526001602052604090205460ff166111375760405160e560020a62461bcd02815260040161019390611416565b600160a060020a03811660009081526001602052604090205460ff16156111c95760405160e560020a62461bcd02815260206004820152602b60248201527f6163636f756e7420746f2061646420697320616c7265616479206f6e2074686560448201527f20616c6c6f77206c6973740000000000000000000000000000000000000000006064820152608401610193565b60005b600160a060020a0382166000908152600460205260409020548110156112b757600160a060020a038216600090815260046020526040902080543391908390811061121957611219611505565b600091825260209091200154600160a060020a031614156112a55760405160e560020a62461bcd02815260206004820152602760248201527f73656e6465722068617320616c726561647920766f74656420746f206164642060448201527f6163636f756e74000000000000000000000000000000000000000000000000006064820152608401610193565b806112af816114b8565b9150506111cc565b50600160a060020a0381166000818152600460209081526040822080546001810182558184529183209091018054600160a060020a0319163390811790915591839052546003549192917f91ad81c76cda7c0ccc324838ae74757eab38b250da52daab154daf408cb3bcba919061133090600290611465565b61133b90600161144d565b60408051928352602083019190915260019082015260006060820152608001610de0565b508054600082559060005260206000209081019061137d9190611380565b50565b5b808211156113955760008155600101611381565b5090565b6000602082840312156113ab57600080fd5b8135600160a060020a03811681146113c257600080fd5b9392505050565b6020808252825182820181905260009190848201906040850190845b8181101561140a578351600160a060020a0316835292840192918401916001016113e5565b50909695505050505050565b6020808252601f908201527f73656e646572206973206e6f74206f6e2074686520616c6c6f77206c69737400604082015260600190565b60008219821115611460576114606114d3565b500190565b6000826114855760e060020a634e487b7102600052601260045260246000fd5b500490565b60008282101561149c5761149c6114d3565b500390565b6000816114b0576114b06114d3565b506000190190565b60006000198214156114cc576114cc6114d3565b5060010190565b60e060020a634e487b7102600052601160045260246000fd5b60e060020a634e487b7102600052603160045260246000fd5b60e060020a634e487b7102600052603260045260246000fdfea26469706673582212200c3e9c07521b155532c0de1605aae52f4ae953670f0afb0f30d320580b93213d64736f6c63430008070033",
      "storage": {
        "0000000000000000000000000000000000000000000000000000000000000000": "0000000000000000000000000000000000000000000000000000000000000002",
        "290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563": "0000000000000000000000009a6d82ef3912d5ab60473124bccd2f2a640769d7",
        "290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e564": "00000000000000000000000065463bf6268e5cc409b6501ec846487b935a1446",
        "aedead2c33b41c31b4afd2246c6bf5131c209d4b0ca6c2247778ac7be7443a00": "0000000000000000000000000000000000000000000000000000000000000101",
        "33784757d5da236467d27a7c5b0cc5aa9026ca3b79e29106a67a5e93c292a523": "0000000000000000000000000000000000000000000000000000000000010101",
        "35aba1eb0bbe741ac01e5b6ce584bc042b1a0b7d115eb8f7dd02a1a1de2fd14d": "000000000000000000000000fe3b557e8fb62b89f4916b721be55ceb828dbd73",
        "0d9217f0a1f7c602fd67052d20171ff73b156d1b87ea258cb6a5d94f71298158": "000000000000000000000000627306090abab3a6e1400e9345bc60c78a8bef57",
        "0000000000000000000000000000000000000000000000000000000000000003": "0000000000000000000000000000000000000000000000000000000000000002"
      },
      "version": "0x01"
    }
  },
  "number": "0x0",
  "gasUsed": "0x0",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
```

</TabItem>

</Tabs>

The QBFT properties are:

- `blockperiodseconds` - The minimum block time, in seconds.
- `epochlength` - The number of blocks after which to reset all votes.
- `requesttimeoutseconds` - The timeout for each consensus round before a round change, in seconds.
- `blockreward` - Optional reward amount in Wei to reward the beneficiary. Defaults to zero (0). Can be specified as a hexadecimal (with 0x prefix) or decimal string value. If set, then all nodes on the network must use the identical value.
- `validatorcontractaddress` - Address of the validator smart contract. Required only if using a contract validator selection. The address must be identical to the address in the `alloc` section. This option can also be used in the [transitions](#transitions) configuration item if swapping [validator management methods](#add-and-remove-validators) in an existing network.
- `miningbeneficiary` - Optional beneficiary of the `blockreward`. Defaults to the validator that proposes the block. If set, then all nodes on the network must use the same beneficiary.
- [`extraData`](#extra-data) - RLP encoded [extra data](#extra-data).

:::caution

We don't recommend changing `epochlength` in a running network. Changing the `epochlength` after genesis can result in illegal blocks.

:::

:::caution Invalid block header error

When adding a new node, if a `TimeStampMoreRecentThanParent | Invalid block header` error occurs, the genesis file of the new node specifies a higher `blockperiodseconds` than the imported chain. The imported chain makes new blocks faster than the genesis file allows and Besu rejects them with this error. This error most often occurs when importing chains from older versions of Besu.

Decrease the `blockperiodseconds` in the new QBFT genesis file to a lower value that satisfies the block header validation.

If the error reads `| TimestampMoreRecentThanParent | Invalid block header: timestamp 1619660141 is only 3 seconds newer than parent timestamp 1619660138. Minimum 4 seconds`, decrease the `blockperiodseconds` from 4 seconds to 3 seconds to match the imported chain.

After you update the new genesis file, if the imported chain has a `blockperiodseconds` value set lower than you prefer, you can adjust it by [configuring the block time on an existing QBFT network](#configure-block-time-on-an-existing-network).

:::

The properties with specific values in the QBFT genesis files are:

- `difficulty` - `0x1`
- `mixHash` - `0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365` for Istanbul block identification

To start a node on a QBFT private network, use the [`--genesis-file`](../../../../public-networks/reference/cli/options.md#genesis-file) option to specify the custom genesis file.

### Extra data

The `extraData` property is an RLP encoding of:

- 32 bytes of vanity data.
- If using:
  - [Block header validator selection](#add-and-remove-validators-using-block-headers), a list of validator addresses.
  - [Contract validator selection](#add-and-remove-validators-using-a-smart-contract), no validators.
- Any validator votes. No vote is included in the genesis block.
- The round the block was created on. The round in the genesis block is 0.
- A list of seals of the validators (signed block hashes). No seals are included in the genesis block.

When using block header validator selection, the important information in the genesis block extra data is the list of validators. All other details have empty values in the genesis block.

:::info

When using contract validator selection to manage validators, the list of validators is configured
in the `alloc` property's `storage` section.
View the [example smart contract](https://github.com/ConsenSys/validator-smart-contracts) for more
information on how to generate the `storage` section.

:::

Formally, `extraData` in the genesis block contains:

- If using block header validator selection: `RLP([32 bytes Vanity, List<Validators>, No Vote, Round=Int(0), 0 Seals])`.
- If using contract validator selection: `RLP([32 bytes Vanity, 0 Validators, No Vote, Round=Int(0), 0 Seals])`.

:::info

RLP encoding is a space-efficient object serialization scheme used in Ethereum.

:::

#### Generate extra data

To generate the `extraData` RLP string for inclusion in the genesis file, use the [`rlp encode`](../../../reference/cli/subcommands.md#encode) Besu subcommand.

```bash title="Example"
besu rlp encode --from=toEncode.json --type=QBFT_EXTRA_DATA
```

Where the `toEncode.json` file contains a list of the initial validators, in ascending order. To write the validator address and copy it to the `toEncode.json` file, use the [`public-key export-address`](../../../../public-networks/reference/cli/subcommands.md#export-address) Besu subcommand. For example:

```json title="Initial validators in toEncode.json file"
[
  "0x4592c8e45706cc08b8f44b11e43cba0cfc5892cb",
  "0x06e23768a0f59cf365e18c2e0c89e151bcdedc70",
  "0xc5327f96ee02d7bcbc1bf1236b8c15148971e1de",
  "0xab5e7f4061c605820d3744227eed91ff8e2c8908"
]
```

Copy the RLP encoded data to the `extraData` property in the genesis file.

```bash title="RLP encoded data"
0xf87aa00000000000000000000000000000000000000000000000000000000000000000f854944592c8e45706cc08b8f44b11e43cba0cfc5892cb9406e23768a0f59cf365e18c2e0c89e151bcdedc7094c5327f96ee02d7bcbc1bf1236b8c15148971e1de94ab5e7f4061c605820d3744227eed91ff8e2c8908c080c0
```

When you start the network, the four nodes previously specified in `toEncode.json` are the validators for the network.

### Block time

When the protocol receives a new chain head, the block time (`blockperiodseconds`) timer starts. When `blockperiodseconds` expires, the round timeout (`requesttimeoutseconds`) timer starts and the protocol proposes a new block.

If `requesttimeoutseconds` expires before adding the proposed block, a round change occurs, with the block time and timeout timers reset. The timeout period for the new round is two times `requesttimeoutseconds`. The timeout period continues to double each time a round fails to add a block.

Usually, the protocol adds the proposed block before reaching `requesttimeoutseconds`. A new round then starts, resetting the block time and round timeout timers. When `blockperiodseconds` expires, the protocol proposes the next new block.

:::danger

If more than 1/3 of validators stop participating, new blocks can no longer be created and `requesttimeoutseconds` doubles with each round change. The quickest method to resume block production is to restart all validators, which resets `requesttimeoutseconds` to its genesis value.

:::

Once `blockperiodseconds` is over, the time from proposing a block to adding the block is small (usually around one second) even in networks with geographically dispersed validators.

#### Tune block timeout

To tune the block timeout for your network deployment:

1. Set `blockperiodseconds` to your desired block time and `requesttimeoutseconds` to two times `blockperiodseconds`.
1. Reduce `requesttimeoutseconds` until you start to see round changes occurring.
1. Increase `requesttimeoutseconds` to the value where round changes are no longer occurring.

:::tip

View [`TRACE` logs](../../../../public-networks/reference/api/index.md#admin_changeloglevel) to see round change log messages.

:::

Use a [transition](#transitions) to update the `blockperiodseconds` in an existing network.

### Optional configuration options

Optional configuration options in the genesis file are:

- `messageQueueLimit` - In large networks with limited resources, increasing the message queue limit might help with message activity surges. The default is 1000.
- `duplicateMessageLimit` - If the same node is retransmitting messages, increasing the duplicate message limit might reduce the number of retransmissions. A value of two to three times the number of validators is usually enough. The default is 100.
- `futureMessagesLimit` - The future messages buffer holds messages for a future chain height. For large networks, increasing the future messages limit might be useful. The default is 1000.
- `futureMessagesMaxDistance` - The maximum height from the current chain height for buffering messages in the future messages buffer. The default is 10.

### Post-Merge configuration

After [The Merge](https://ethereum.org/en/upgrades/merge/), the following block fields are modified or deprecated. Their fields **must** contain only the constant values from the following chart.

| Field            | Constant value                                                       | Comment                    |
|------------------|----------------------------------------------------------------------|----------------------------|
| **`ommersHash`** | `0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347` | `= Keccak256(RLP([]))`     |
| **`difficulty`** | `0`                                                                  | Replaced with `prevrandao` |
| **`mixHash`**    | `0x0000000000000000000000000000000000000000000000000000000000000000` | Replaced with `prevrandao` |
| **`nonce`**      | `0x0000000000000000`                                                 |                            |
| **`ommers`**     | `[]`                                                                 | `RLP([]) = 0xc0`           |

Additionally, [`extraData`](#extra-data) is limited to the 32 bytes of vanity data after The Merge.

## Add and remove validators

QBFT provides two methods to manage validators:

- [Block header validator selection](#add-and-remove-validators-using-block-headers) - Existing validators propose and vote to add or remove validators using the QBFT JSON-RPC API methods.

- [Contract validator selection](#add-and-remove-validators-using-a-smart-contract) - Use a smart contract to specify the validators used to propose and validate blocks.

You can use [transitions](#transitions) to swap between block header validator selection and contract validator selection in an existing network.

For block header validator selection, initial validators are configured in the genesis file's [`extraData`](#extra-data) property, whereas the initial validators when using the contract validator selection method are configured in the genesis file's `storage` section.

### Add and remove validators using block headers

Enable the HTTP interface with [`--rpc-http-enabled`](../../../../public-networks/reference/cli/options.md#rpc-http-enabled) or the WebSockets interface with [`--rpc-ws-enabled`](../../../../public-networks/reference/cli/options.md#rpc-ws-enabled).

The QBFT API methods are disabled by default. To enable them, specify the [`--rpc-http-api`](../../../../public-networks/reference/cli/options.md#rpc-http-api) or [`--rpc-ws-api`](../../../../public-networks/reference/cli/options.md#rpc-ws-api) option and include `QBFT`.

The methods to add or remove validators are:

- [`qbft_getPendingVotes`](../../../reference/api.md#qbft_getpendingvotes).
- [`qbft_proposeValidatorVote`](../../../reference/api.md#qbft_proposevalidatorvote).
- [`qbft_discardValidatorVote`](../../../reference/api.md#qbft_discardvalidatorvote).

To view validator metrics for a specified block range, use [`qbft_getSignerMetrics`](../../../reference/api.md#qbft_getsignermetrics).

:::note

If network conditions render it impossible to add and remove validators by voting, you can [add and remove validators without voting](add-validators-without-voting.md).

:::

#### Add a validator

To propose adding a validator, call [`qbft_proposeValidatorVote`](../../../reference/api.md#qbft_proposevalidatorvote), specifying the address of the proposed validator and `true`. A majority of validators must execute the call.

```bash title="JSON-RPC qbft_proposeValidatorVote request example"
curl -X POST --data '{"jsonrpc":"2.0","method":"qbft_proposeValidatorVote","params":["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73", true], "id":1}' <JSON-RPC-endpoint:port>
```

When the validator proposes the next block, the protocol inserts one proposal received from [`qbft_proposeValidatorVote`](../../../reference/api.md#qbft_proposevalidatorvote) into the block. If blocks include all proposals, subsequent blocks proposed by the validator will not contain a vote.

When more than 50% of the existing validators have published a matching proposal, the protocol adds the proposed validator to the validator pool and the validator can begin validating blocks.

To return a list of validators and confirm the addition of a proposed validator, use [`qbft_getValidatorsByBlockNumber`](../../../reference/api.md#qbft_getvalidatorsbyblocknumber).

```bash title="JSON-RPC qbft_getValidatorsByBlockNumber request example"
curl -X POST --data '{"jsonrpc":"2.0","method":"qbft_getValidatorsByBlockNumber","params":["latest"], "id":1}' <JSON-RPC-endpoint:port>
```

To discard your proposal after confirming the addition of a validator, call [`qbft_discardValidatorVote`](../../../reference/api.md#qbft_discardvalidatorvote), specifying the address of the proposed validator.

```bash title="JSON-RPC qbft_discardValidatorVote request example"
curl -X POST --data '{"jsonrpc":"2.0","method":"qbft_discardValidatorVote","params":["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"], "id":1}' <JSON-RPC-endpoint:port>
```

#### Remove a validator

The process for removing a validator is the same as adding a validator except you specify `false` as the second parameter of [`qbft_proposeValidatorVote`](../../../reference/api.md#qbft_proposevalidatorvote).

#### Epoch transition

At each epoch transition, QBFT discards all pending votes collected from received blocks. Existing proposals remain in effect and validators re-add their vote the next time they create a block.

An epoch transition occurs every `epochLength` blocks. Define `epochlength` in the QBFT genesis file.

### Add and remove validators using a smart contract

Users can create their own smart contracts to add or remove validators based on their organizational requirements. View the [example smart contract](https://github.com/ConsenSys/validator-smart-contracts) for more information on how to create and deploy the smart contract.

You can pre-deploy the validator smart contract in a new QBFT network by specifying the contract details in the [genesis file](qbft.md#genesis-file). For existing QBFT networks you need to compile and deploy the contract using a transaction, then obtain the contract address from the receipt and use that in a [transition](#swap-validator-management-methods).

:::info

You can't use the JSON-RPC methods to add or remove validators when using a smart contract to manage nodes.

You must interact with the contract functions using transactions.

:::

:::note

If network conditions render it impossible to add and remove validators using a smart contract, you can [override smart contract validators](add-validators-without-voting.md#override-smart-contract-validators).

:::

### Minimum number of validators

QBFT requires four validators to be Byzantine fault tolerant. Byzantine fault tolerance is the ability for a blockchain network to function correctly and reach consensus despite nodes failing or propagating incorrect information to peers.

## Transitions

The `transitions` genesis configuration item allows you to specify a future block number at which to 
the QBFT network configuration in an existing network.
For example, you can update the [block time](#configure-block-time-on-an-existing-network),
[block reward](#configure-block-rewards-on-an-existing-network),
[validator management method](#swap-validator-management-methods), or
[mining beneficiary](#configure-the-mining-beneficiary-on-an-existing-network).

:::caution
Do not specify a transition block in the past.
Specifying a transition block in the past can result in unexpected behavior, such as causing the
network to fork.
:::

### Configure block time on an existing network

To update an existing network with a new `blockperiodseconds`:

1.  Stop all nodes in the network.
2.  In the [genesis file](#genesis-file), add the `transitions` configuration item where:

    - `<FutureBlockNumber>` is the upcoming block at which to change `blockperiodseconds`.
    - `<NewValue>` is the updated value for `blockperiodseconds`.

    <Tabs>
    <TabItem value="Syntax" label="Syntax" default>

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4
        },
        "transitions": {
          "qbft": [
            {
              "block": <FutureBlockNumber>,
              "blockperiodseconds": <NewValue>
            }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    <TabItem value="Example" label="Example">

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4
        },
        "transitions": {
          "qbft": [
            {
              "block": 1240,
              "blockperiodseconds": 4
            }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    </Tabs>

3.  Restart all nodes in the network using the updated genesis file.
4.  To verify the changes after the transition block, view the Besu logs and check that the time
    difference between each block matches the updated block period.

### Configure block rewards on an existing network

To update an existing network with a new `blockreward`:

1.  Stop all nodes in the network.
2.  In the [genesis file](#genesis-file), add the `transitions` configuration item where:

    - `<FutureBlockNumber>` is the upcoming block at which to change `blockreward`.
    - `<NewValue>` is the updated value for `blockreward`.

    <Tabs>
    <TabItem value="Syntax" label="Syntax" default>

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4
          "blockreward": "5000000000000000"
        },
        "transitions": {
          "qbft": [
            {
              "block": <FutureBlockNumber>,
              "blockreward": <NewValue>
            },
            {
              "block": <FutureBlockNumber>,
              "blockreward": <NewValue>
            },
            {
              "block": <FutureBlockNumber>,
              "blockreward": <NewValue>
            }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    <TabItem value="Example" label="Example">

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 2,
          "epochlength": 30000,
          "requesttimeoutseconds": 4
          "blockreward": "5000000000000000"
        },
        "transitions": {
          "qbft": [
            {
              "block": 10,
              "blockreward": "6000000000000000"
            },
            {
              "block": 15,
              "blockreward": "75000000000000000"
            },
            {
              "block": 20,
              "blockreward": "0"
            }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    </Tabs>

    :::note

    You can add multiple `blockreward` updates in one transition object by specifying multiple future blocks.

    :::

3.  Restart all nodes in the network using the updated genesis file.

### Swap validator management methods

To swap between block header validator selection and contract validator selection methods in an existing network:

1.  Stop all nodes in the network.
2.  In the [genesis file](#genesis-file), add the `transitions` configuration item where:

    - `<FutureBlockNumber>` is the upcoming block at which to change the validator selection method.
    - `<SelectionMode>` is the validator selection mode to switch to. Valid options are `contract` and `blockheader`.
    - `<ContractAddress>` is the smart contract address, if switching to the contract validator selection method.

    <Tabs>
    <TabItem value="Syntax" label="Syntax" default>

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 5,
          "epochlength": 30000,
          "requesttimeoutseconds": 10
        },
        "transitions": {
          "qbft": [
            {
              "block": <FutureBlockNumber>,
              "validatorselectionmode": <SelectionMode>,
              "validatorcontractaddress": <ContractAddress>
            }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    <TabItem value="Example" label="Example">

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 5,
          "epochlength": 30000,
          "requesttimeoutseconds": 10
        },
        "transitions": {
          "qbft": [
          {
            "block": 102885,
            "validatorselectionmode": "contract",
            "validatorcontractaddress": "0x0000000000000000000000000000000000007777"
          }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    </Tabs>

3.  Restart all nodes in the network using the updated genesis file.

### Configure the mining beneficiary on an existing network

To update an existing network with a new mining beneficiary:

1.  Stop all nodes in the network.
2.  In the [genesis file](#genesis-file), add the `transitions` configuration item where:

    - `<FutureBlockNumber>` is the upcoming block at which to change `miningbeneficiary`.
    - `<NewAddress>` is the updated 20-byte address for `miningbeneficiary`. Starting at `<FutureBlockNumber>`, block rewards go to this address.

    <Tabs>
    <TabItem value="Syntax" label="Syntax" default>

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 5,
          "epochlength": 30000,
          "requesttimeoutseconds": 10
        },
        "transitions": {
          "qbft": [
          {
            "block": <FutureBlockNumber>,
            "miningbeneficiary": <NewAddress>
          },
          {
            "block": <FutureBlockNumber>,
            "miningbeneficiary": <NewAddress>
          }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    <TabItem value="Example" label="Example">

    ```json
    {
      "config": {
        ...
        "qbft": {
          "blockperiodseconds": 5,
          "epochlength": 30000,
          "requesttimeoutseconds": 10
        },
        "transitions": {
          "qbft": [
          {
            "block": 10000,
            "miningbeneficiary": "0x0000000000000000000000000000000000000002",
          },
          {
            "block": 20000,
            "miningbeneficiary": "",
          }
          ]
        }
      },
      ...
    }
    ```

    </TabItem>
    </Tabs>

    :::note

    Setting the `miningbeneficiary` to an empty value clears out any override so that block rewards go to the block producer rather than a global override address.

    :::

3.  Restart all nodes in the network using the updated genesis file.
