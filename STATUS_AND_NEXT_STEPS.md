# What’s Working Now & What to Do Next

## What’s working now

### Frontend (Vercel or local)
- **Wallet gate:** User must connect a **Sui wallet** before using the app. Connect screen explains: Sui wallet, correct network, SUI for gas (with faucet link).
- **Create prediction markets:** After connecting, user can create a new market (question only). No need to “load” markets first.
- **View markets (optional):** “View markets” loads existing markets from the API. Place bet box on each card shows: “You need a connected Sui wallet and SUI for gas to place bets.”
- **Place bet:** On each open market: choose Yes/No, enter amount, click “Place bet.” Bets are sent to your backend API.
- **UI:** Blended video background, favicon, testnet by default, “Place bet” section with clear labels (Outcome, Amount) and fixed layout.

### Backend (when running)
- **REST API:** `GET/POST /api/markets`, `GET/POST /api/bets`. In-memory store; no DB required for basic use.
- **Health:** `GET /health` reports status and Sui network.
- **Sui:** Contracts already deployed on testnet. Package ID in `contracts/Published.toml` and `docs/SUI_PACKAGE_IDS.md`.

### Sui
- **Contracts:** One package on testnet (`published-at` in `contracts/Published.toml`). Single module: `prediction_market`. No separate settlement_manager or market_factory packages.
- **App config:** Frontend/server can use `VITE_SUI_PACKAGE_ID` / `PREDICTION_MARKET_PACKAGE` from `docs/SUI_PACKAGE_IDS.md` if you wire on-chain reads.

---

## What you need to do now

### If you only run locally
1. **Run:** `npm run install:all` then `npm run dev:all`.
2. **Use:** Open http://localhost:5173 → connect Sui wallet (testnet) → create market and/or view markets → place bet.
3. **Optional:** Copy package IDs from `docs/SUI_PACKAGE_IDS.md` into `frontend/.env` and `server/.env` if you want the app to read on-chain markets.

### If frontend is on Vercel
1. **Backend required:** Set **VITE_API_URL** (and **VITE_WS_URL** if you use WebSockets) in Vercel to your **deployed backend URL**. Without this, create market and place bet will fail.
2. **Deploy backend** somewhere (e.g. Railway, Render) with the same repo (root: `server`), then put that URL in Vercel env and redeploy the frontend.
3. **Optional:** Set **VITE_SUI_PACKAGE_ID** / **VITE_SUI_NETWORK** in Vercel (see `docs/SUI_PACKAGE_IDS.md` and `docs/DEPLOY_VERCEL.md`).

### Optional improvements (not required to “work”)
- Add pool updates when a bet is placed (backend currently doesn’t update `poolYes`/`poolNo`).
- Add “Resolve market” (API + UI) so markets can be marked resolved.
- Wire on-chain settlement using the deployed Sui package (frontend/server already have env hooks).
- Yellow Network: only if you want off-chain speed; see `YELLOW_WHAT_YOU_NEED.md`.

---

## Quick checklist

| Item | Status |
|------|--------|
| Connect Sui wallet (required first) | ✅ Working |
| Create new prediction market | ✅ Working (needs backend) |
| View existing markets | ✅ Working (click “View markets”; needs backend) |
| Place bet (Yes/No + amount) | ✅ Working (needs backend) |
| Sui contracts on testnet | ✅ Deployed |
| Frontend on Vercel | ✅ You have it; set VITE_API_URL to backend |
| Backend deployed | ⚠️ You must deploy it and set VITE_API_URL |
| Favicon / video / wallet copy | ✅ Done |

**Bottom line:** App works end-to-end when (1) backend is running (local or deployed) and (2) frontend has `VITE_API_URL` pointing at it. Connect wallet → create or view markets → place bet. Deploy backend and set env if you want it live on Vercel.
