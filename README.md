# Invisible DEX

Invisible DEX is a hybrid prediction market: Sui for on-chain settlement and Yellow Network (Nitrolite) for off-chain micro-bets. This README is an overview and index only. Step-by-step instructions live in the linked docs.

## Quick start (links)

- Setup and local run: `SETUP.md`
- Use the app (testnet): `USER_GUIDE.md`
- Vercel deploy: `docs/DEPLOY_VERCEL.md`
- Sui package IDs: `docs/SUI_PACKAGE_IDS.md`
- Yellow SDK setup: `docs/YELLOW_SDK_SETUP.md`
- API reference: `docs/API.md`

## Current functionality (no mock data)

- Wallet gate: connect a Sui wallet to use the app.
- Create market: on-chain if `VITE_PREDICTION_MARKET_PACKAGE` is set; otherwise via API (in-memory).
- View markets: backend merges on-chain markets (when configured) plus API-created markets.
- Place bet: sends to backend API and stores in-memory; on-chain bet flow is not wired yet.
- Yellow: `npm run demo:yellow` runs an off-chain transfer via the Nitrolite SDK; `/health` reports Yellow connected when env is set.

## Deployed contracts and integration

| Where | Sui (testnet) | Yellow Network (Sepolia) |
| --- | --- | --- |
| What | One Move package: `invisible_dex::prediction_market`. | Nitrolite Custody and Adjudicator contracts + WebSocket clearnodes. |
| In the app | Frontend can create markets on-chain. Server can read on-chain markets via events. | Server uses Nitrolite for demo and health checks. |
| Flow | Create market -> place bets -> resolve -> claim (on-chain). | Instant micro-bets off-chain; final state can be batch-settled on Sui. |
| Env | `PREDICTION_MARKET_PACKAGE` (server), `VITE_PREDICTION_MARKET_PACKAGE` / `VITE_SUI_PACKAGE_ID` (frontend). | `PRIVATE_KEY`, `ALCHEMY_RPC_URL`, optional `YELLOW_WS_ENDPOINT`. |

Full addresses and IDs: `docs/DEPLOYED_CONTRACTS.md`.

## Project structure

- `contracts/` Sui Move smart contracts
- `frontend/` React app (Vite + Tailwind)
- `server/` Node/Express API + WebSocket
- `docs/` Documentation
- `scripts/` Utility and demo scripts

## Requirements

- Node.js 18+
- Sui wallet + testnet SUI (for on-chain create)
- Sepolia wallet + RPC (optional, for Yellow demo)

## Docs index

- `SETUP.md` detailed setup
- `USER_GUIDE.md` how to run and use the app
- `docs/ARCHITECTURE.md` system design
- `docs/API.md` REST and WebSocket
- `docs/DEPLOYMENT.md` deployment guide
- `docs/DEPLOYED_CONTRACTS.md` deployed addresses

## Contributing

See `CONTRIBUTING.md`.
