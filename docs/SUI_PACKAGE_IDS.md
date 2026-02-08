# Sui Package IDs (Testnet)

The Invisible DEX Move contracts are **one package** with **one module**: `invisible_dex::prediction_market`. There is no separate settlement_manager or market_factory package in this repo.

---

## Deployed on testnet (from `contracts/Published.toml`)

| Variable | Value | Notes |
|----------|--------|--------|
| **SUI_PACKAGE_ID** | `0x784407dee9e4e7f2c900f49d253fae91834ce1d903100ef059b6e8e546f1fdf2` | The published package ID. Use for all Move calls (e.g. `PackageId::prediction_market::create_and_share_market`). |
| **PREDICTION_MARKET_PACKAGE** | `0x784407dee9e4e7f2c900f49d253fae91834ce1d903100ef059b6e8e546f1fdf2` | Same as above; the prediction market module lives in this package. |
| **SETTLEMENT_MANAGER_PACKAGE** | *(not used)* | No separate settlement_manager module in this codebase. Settlement/claim logic is in `prediction_market`. Leave empty or omit. |
| **MARKET_FACTORY_PACKAGE** | *(not used)* | No separate market factory package. Market creation is `prediction_market::create_and_share_market`. Leave empty or omit. |

---

## Copy-paste for env

**Frontend (`.env` or Vercel):**
```bash
VITE_SUI_PACKAGE_ID=0x784407dee9e4e7f2c900f49d253fae91834ce1d903100ef059b6e8e546f1fdf2
VITE_PREDICTION_MARKET_PACKAGE=0x784407dee9e4e7f2c900f49d253fae91834ce1d903100ef059b6e8e546f1fdf2
# VITE_SETTLEMENT_MANAGER_PACKAGE=   # not used (one package)
# VITE_MARKET_FACTORY_PACKAGE=      # not used (one package)
```

**Server (`.env`):**
```bash
PREDICTION_MARKET_PACKAGE=0x784407dee9e4e7f2c900f49d253fae91834ce1d903100ef059b6e8e546f1fdf2
# No separate SUI_PACKAGE_ID on server; use PREDICTION_MARKET_PACKAGE for chain reads.
```

---

## Other testnet metadata (from Published.toml)

- **Chain ID:** `4c78adac` (Sui testnet)
- **Original package ID (v1):** `0x01f5d4bdd3e3d582d8bd0d6def42a0a1b682b462ed71a1b794c5af8dd075ed5e`
- **Upgrade capability:** `0x078a0e9116603affad2e5051e490eb942ac23b7717225b39ea52b90e6af463d1`
- **Version:** 2

If you had separate packages for settlement or market factory, they would have their own Published.toml entries or object IDs. In this repo, everything is in the single package above.
