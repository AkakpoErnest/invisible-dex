# Invisible DEX – Deployment Guide

## Prerequisites

- Node.js 18+
- Sui CLI (for contract deployment)
- An account on your chosen Sui network (testnet/mainnet) with gas

## 1. Build and test locally

```bash
npm run install:all
cd server && npm run dev   # Terminal 1
cd frontend && npm run dev # Terminal 2
# Open http://localhost:5173, run through flows
```

## 2. Deploy smart contracts

```bash
cd contracts
sui client switch --env testnet   # or mainnet
sui move build
sui client publish --gas-budget 100000000
```

Save the **Package ID** from the output.

## 3. Backend deployment

Set environment variables:

- `PORT` – e.g. 3001
- `YELLOW_WS_ENDPOINT` – Yellow WebSocket URL
- `YELLOW_API_KEY` – Your Yellow API key
- `NODE_ENV=production`

**Options:**

- **Heroku:** `heroku create && git push heroku main`
- **Railway:** Connect repo, set env vars, deploy
- **VPS:** Use PM2 or systemd; run `npm run build && npm start` in `server/`

Ensure the backend URL is HTTPS in production and CORS allows your frontend origin.

## 4. Frontend deployment

Set build env (or use your platform’s env UI):

- `VITE_API_URL` – full backend API URL (e.g. `https://api.yourdomain.com`)
- `VITE_WS_URL` – WebSocket URL (e.g. `wss://api.yourdomain.com`)
- `VITE_SUI_PACKAGE_ID` – Package ID from step 2

Then:

```bash
cd frontend
npm run build
```

**Options:**

- **Vercel:** Connect repo, root directory `frontend`, build command `npm run build`, output `dist`
- **Netlify:** Same; publish directory `frontend/dist`

## 5. Post-deploy

- Verify wallet connection (Sui testnet/mainnet)
- Create a test market and place a bet
- Confirm settlement and claim flow if using full chain integration
