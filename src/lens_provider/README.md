# Web3Connect/src/lens_provider

Web3MQ-Provider lens.xyz

## Dependency
    redis-server

## Sync Instruction
    Sync lens follow data from Polygon network.
    Store nft contract and profile map.
    Send new follow event to web3mq.
## config before start

`config.json` testnet


```json
{
  "provider_id": "666",
  "provider_key": "69c3dce492fc84f9678dabcc34127f92e8a9ae210e3cd9053c981a7aaa047f84f59d85d50d0d2b2867975a7d94a23a4c84f0f3b1ecb913f538d403873515bbc8",
  "provider_pubkey": "f59d85d50d0d2b2867975a7d94a23a4c84f0f3b1ecb913f538d403873515bbc8",
  "web3mq_node": "https://dev-ap-jp-1.web3mq.com",
  "rpc_node": "https://rpc.ankr.com/polygon_mumbai",
  "db_config": "root:root@tcp(127.0.0.1:3306)/lens_db?charset=utf8&parseTime=True&loc=Local",
  "db_config_redis": "redis://localhost:6379/0",
  "sync_polygon_interval": 1,
  "push_web3mq_interval": 1,
  "sync_web3mq_interval": 10,
  "lens": {
    "profile_contract_address": "0x60ae865ee4c725cd04353b5aab364553f56cef82",
    "profile_creation_address": "0x1eec6eccaa4625da3fa6cd6339dbcc2418710e8a"
  }
}
```

`config.json` mainnet


```json
{
  "provider_id": "666",
  "provider_key": "69c3dce492fc84f9678dabcc34127f92e8a9ae210e3cd9053c981a7aaa047f84f59d85d50d0d2b2867975a7d94a23a4c84f0f3b1ecb913f538d403873515bbc8",
  "provider_pubkey": "f59d85d50d0d2b2867975a7d94a23a4c84f0f3b1ecb913f538d403873515bbc8",
  "web3mq_node": "https://dev-ap-jp-1.web3mq.com",
  "rpc_node": "https://polygon-rpc.com/",
  "db_config": "root:root@tcp(127.0.0.1:3306)/lens_db?charset=utf8&parseTime=True&loc=Local",
  "db_config_redis": "redis://localhost:6379/0",
  "sync_polygon_interval": 1,
  "push_web3mq_interval": 1,
  "sync_web3mq_interval": 10,
  "lens": {
    "profile_contract_address": "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
    "profile_creation_address": "0x1eec6eccaa4625da3fa6cd6339dbcc2418710e8a"
  }
}
```

## webhook url

`POST` /lens/owner

```json
{
    "userid": "user:userid",
    "did_type": "lens.xyz",
    "did_value": "lens.lens",
    "action": "validation",
    "content": "",
    "timestamp":  160000000
}
```
