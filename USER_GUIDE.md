# How to Use Invisible DEX

This guide walks you through running the app on **Sui testnet**. The main flow is **creating new prediction markets**; you don’t need to load markets first. Optionally you can view existing markets and place bets.

---

## 1. Prerequisites

- **Node.js** 18+
- **npm**
- A **Sui wallet** (e.g. [Sui Wallet](https://sui.io/wallet), Sui dapp-kit compatible). Use **testnet** so you don’t spend real funds.

---

## 2. Run the Platform (Testnet)

The app is configured to use **Sui testnet** by default. No code changes are required.

### One-time setup

```bash
# From the repo root
npm run install:all
```

### Optional: environment (defaults are fine for local dev)

- **Frontend** (`frontend/.env` or `frontend/.env.example`):
  - `VITE_API_URL=http://localhost:3001` — backend URL (default)
  - `VITE_SUI_NETWORK=testnet` — Sui network (default)
  - `VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443` — testnet RPC (default)
- **Server** (`server/.env`):
  - `PORT=3001` (default)
  - `SUI_NETWORK=testnet` (default)
  - `SUI_RPC_URL=https://fullnode.testnet.sui.io:443` (default)

If you don’t create a `.env` file, the app still defaults to testnet and `localhost:3001`.

### Start backend + frontend

```bash
npm run dev:all
```

- **Backend** runs at **http://localhost:3001** (API + health).
- **Frontend** runs at **http://localhost:5173** (or the port Vite prints).

Open **http://localhost:5173** in your browser.

### Check that things are on testnet

- In the app header you should see: **Sui network: testnet**.
- Your wallet extension should be set to **Sui Testnet** (or the app will prompt you to switch).

---

## 3. Connect Your Wallet

1. Click **Connect Wallet** in the header.
2. Choose your Sui wallet (e.g. Sui Wallet, Ethos, etc.).
3. Approve the connection.
4. Ensure the wallet is on **Testnet** (e.g. Sui Wallet: Settings → Network → Testnet).
5. (Optional) Get testnet SUI from the [Sui faucet](https://faucet.sui.io/) for gas if you plan to use on-chain features later.

Your address appears in the header once connected. The app uses it when you place bets (as “user” on the bet).

---

## 4. Create a New Prediction Market

You don’t need to load markets first. Just create one.

1. Scroll to **Create a new prediction market** (or click **Create prediction market** in the hero).
2. Type a **question** (e.g. “Will it rain tomorrow in NYC?”).
3. Click **Create market**.
4. The market is created via the API. If you want to see it in the list, click **View markets** in the “Existing markets” section below.

New markets are stored in the backend and are available to anyone using the same API.

---

## 5. View Existing Markets (Optional)

- The **Existing markets** section does **not** load automatically. Click **View markets** to load the list from the API.
- Each card shows the question, Yes/No pools, and Open/Resolved status. You can place bets from there.

---

## 6. Place a Bet

1. On any **open** market card, choose **Yes** or **No** (toggle buttons).
2. Enter an **amount** in the number field (e.g. `10`).
3. Click **Place bet**.
4. A success message appears and the amount field clears. The bet is sent to the API and associated with your wallet address if connected.

You can place multiple bets on the same or different markets. Bets are recorded by the backend; pool numbers on the card may not update until the backend implements pool updates.

---

## 7. Reload the List (Optional)

- Click **View markets** again to reload the existing markets list from the API. Use this after creating a market to see it in the list.

---

## 8. Troubleshooting

| Issue | What to do |
|-------|------------|
| “We could not load markets” | Backend not running or wrong URL. Start with `npm run dev:all` and ensure `VITE_API_URL` is `http://localhost:3001` (or your server URL). |
| Wallet won’t connect | Install a Sui-compatible wallet, switch it to **Testnet**, then try again. |
| Wrong network (mainnet) | Set `VITE_SUI_NETWORK=testnet` in `frontend/.env` and restart the frontend. In the UI you should see “Sui network: testnet”. |
| “Enter an amount greater than 0” | Type a number &gt; 0 in the amount field before clicking **Place bet**. |
| API runs but frontend can’t reach it | Check CORS and that `VITE_API_URL` matches the server (e.g. `http://localhost:3001`). |

---

## 9. Summary

- **Run:** `npm run dev:all` → open http://localhost:5173.
- **Network:** Sui **testnet** by default (shown in the header).
- **Main use:** Create new prediction markets (no need to load markets first). Optionally click **View markets** to see existing ones and place bets.

For deployment, contract deployment, or Yellow Network, see the repo’s other docs (e.g. SETUP.md, POST_LAUNCH_CHECKLIST.md, YELLOW_WHAT_YOU_NEED.md).
