# Post-launch checklist – what to configure after you run the app

Use this list once the app is running locally or after you deploy. Fill in real values and keep them out of git (use `.env`, never commit secrets).

---

## 1. Sui (testnet / mainnet)

| Where | Variable | What to put |
|-------|----------|-------------|
| **server/.env** | `SUI_NETWORK` | `testnet` or `mainnet` |
| **server/.env** | `SUI_RPC_URL` | e.g. `https://fullnode.testnet.sui.io:443` |
| **server/.env** | `PREDICTION_MARKET_PACKAGE` | Package ID from `sui client publish` (e.g. `0x...`) |
| **server/.env** | `SUI_PRIVATE_KEY` | From `sui keytool export --address <addr>` (backend signer; **never commit**) |
| **frontend/.env** | `VITE_SUI_PACKAGE_ID` or `VITE_PREDICTION_MARKET_PACKAGE` | Same Package ID as above |
| **frontend/.env** | `VITE_SUI_NETWORK` | `testnet` or `mainnet` |
| **frontend/.env** | `VITE_SUI_RPC_URL` | Same RPC URL as server (if you use a custom one) |

---

## 2. Yellow Network

| Where | Variable | What to put |
|-------|----------|-------------|
| **server/.env** | `YELLOW_WS_ENDPOINT` | e.g. `wss://clearnet.yellow.com/ws` |
| **server/.env** | `YELLOW_API_KEY` | Your Yellow API key (from Yellow dashboard) |
| **server/.env** | `YELLOW_TIMEOUT` | Optional, e.g. `30000` (ms) |
| **frontend/.env** | `VITE_YELLOW_WS_ENDPOINT` | Same WebSocket URL (if frontend talks to Yellow directly) |
| **frontend/.env** | `VITE_YELLOW_API_KEY` | Only if the frontend needs it (usually backend only) |

---

## 3. API URLs (after deployment)

| Where | Variable | What to put |
|-------|----------|-------------|
| **frontend/.env** | `VITE_API_BASE_URL` or `VITE_API_URL` | Backend URL, e.g. `https://api.yourdomain.com` (prod) or `http://localhost:3001` (dev) |
| **frontend/.env** | `VITE_WS_URL` | WebSocket URL, e.g. `wss://api.yourdomain.com` (prod) or `ws://localhost:3001` (dev) |
| **server/.env** | `CORS_ORIGIN` | Frontend origin, e.g. `https://app.yourdomain.com` (prod) or `http://localhost:5173` (dev) |

---

## 4. Optional / feature flags

| Where | Variable | What to put |
|-------|----------|-------------|
| **frontend/.env** | `VITE_ENABLE_3D_GRAPHICS` | `true` or `false` |
| **frontend/.env** | `VITE_DEBUG_MODE` | `true` (dev) or `false` (prod) |
| **server/.env** | `LOG_LEVEL` | e.g. `debug` (dev) or `info` (prod) |
| **server/.env** | `NODE_ENV` | `development` or `production` |

---

## 5. After first contract deploy

1. Run `sui client publish --gas-budget 100000000` from `contracts/`.
2. Copy the **Package ID** from the output.
3. Put it in **server** and **frontend** `.env` as above.
4. (Optional) If your contract has AdminCap / OracleCap, note those object IDs for admin/oracle calls.

---

## 6. Before going to production

- [ ] All `.env` files use production URLs and keys; no dev secrets in repo.
- [ ] `CORS_ORIGIN` on server matches your production frontend URL.
- [ ] Frontend `VITE_API_URL` and `VITE_WS_URL` point to the production backend.
- [ ] Sui network and RPC match (testnet vs mainnet).
- [ ] Yellow API key is for the right environment.

---

## Quick reference: minimal dev .env

**server/.env (minimal for local):**

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
PREDICTION_MARKET_PACKAGE=
YELLOW_WS_ENDPOINT=wss://clearnet.yellow.com/ws
YELLOW_API_KEY=
```

**frontend/.env (minimal for local):**

```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
VITE_SUI_NETWORK=testnet
VITE_SUI_PACKAGE_ID=
VITE_PREDICTION_MARKET_PACKAGE=
```

Fill in `PREDICTION_MARKET_PACKAGE` and `VITE_SUI_PACKAGE_ID` / `VITE_PREDICTION_MARKET_PACKAGE` after you deploy the contracts.
