# Deployed Smart Contracts – Sui & Yellow Network

This document lists all deployed contract addresses and endpoints used by Invisible DEX for **Sui** (on-chain markets and settlement) and **Yellow Network** (Nitrolite state channels / off-chain micro-bets).

---

## Sui (testnet)

Single Move package: **one module** `invisible_dex::prediction_market` (create markets, place bets, resolve, claim). No separate settlement_manager or market_factory packages.

| Contract / ID | Value | Notes |
|---------------|--------|--------|
| **Package ID** | `0x784407dee9e4e7f2c900f49d253fae91834ce1d903100ef059b6e8e546f1fdf2` | Use for all Move calls (e.g. `prediction_market::create_and_share_market`, `prediction_market::resolve_and_claim`). |
| **Original package ID (v1)** | `0x01f5d4bdd3e3d582d8bd0d6def42a0a1b682b462ed71a1b794c5af8dd075ed5e` | First published version. |
| **Upgrade capability** | `0x078a0e9116603affad2e5051e490eb942ac23b7717225b39ea52b90e6af463d1` | For package upgrades. |
| **Chain ID** | `4c78adac` | Sui testnet. |
| **Module** | `invisible_dex::prediction_market` | All market and settlement logic. |

**Env:** `PREDICTION_MARKET_PACKAGE` (server), `VITE_PREDICTION_MARKET_PACKAGE` / `VITE_SUI_PACKAGE_ID` (frontend). See [SUI_PACKAGE_IDS.md](./SUI_PACKAGE_IDS.md) for copy-paste and details.

---

## Yellow Network (Sepolia / Nitrolite)

Yellow uses **Sepolia** for Nitrolite state channels. These are the deployed contract addresses and endpoints used by the app and the Yellow demo script.

### Contract addresses (Sepolia)

| Contract | Address | Notes |
|----------|---------|--------|
| **Custody** | `0x019B65A265EB3363822f2752141b3dF16131b262` | Nitrolite custody contract (sandbox). |
| **Adjudicator** | `0x7c7ccbc98469190849BCC6c926307794fDfB11F2` | Nitrolite adjudicator (sandbox). |

Used in `server/scripts/yellow-nitrolite-demo.ts` and any Nitrolite client config. Network: **Sepolia** (chain ID 11155111).

### Endpoints

| Purpose | URL |
|--------|-----|
| **WebSocket (sandbox)** | `wss://clearnet-sandbox.yellow.com/ws` |
| **WebSocket (production)** | `wss://clearnet.yellow.com/ws` |
| **Faucet (sandbox)** | `https://clearnet-sandbox.yellow.com/faucet/requestTokens` – POST with `{"userAddress":"YOUR_SEPOLIA_ADDRESS"}` |

**Env:** `PRIVATE_KEY` (Sepolia wallet), `ALCHEMY_RPC_URL` (Sepolia RPC, e.g. `https://eth-sepolia.g.alchemy.com/v2/...`), `YELLOW_WS_ENDPOINT` (optional, defaults above). See [YELLOW_SDK_SETUP.md](./YELLOW_SDK_SETUP.md) and [HOW_TO_GET_SEPOLIA_RPC.md](./HOW_TO_GET_SEPOLIA_RPC.md).

---

## Summary

| Network | Role | Main identifier |
|---------|------|------------------|
| **Sui testnet** | On-chain markets & settlement | Package `0x784407dee9e4e7f2c900f49d253fae91834ce1d903100ef059b6e8e546f1fdf2` |
| **Yellow (Sepolia)** | Off-chain micro-bets (Nitrolite) | Custody `0x019B65...`, Adjudicator `0x7c7ccb...` |

For Sui package IDs and env examples: [SUI_PACKAGE_IDS.md](./SUI_PACKAGE_IDS.md).  
For Yellow setup and SDK: [YELLOW_SDK_SETUP.md](./YELLOW_SDK_SETUP.md), [YELLOW_WHAT_YOU_NEED.md](../YELLOW_WHAT_YOU_NEED.md).
