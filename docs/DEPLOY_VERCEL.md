# Deploying Invisible DEX on Vercel

This guide covers launching the **frontend** on Vercel. The **backend** (Node/Express API) must be hosted separately (e.g. Railway, Render, Fly.io) or the app will have no markets/bets API until you add one.

---

## 1. Deploy the frontend to Vercel

### Option A: Vercel dashboard (recommended)

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub/GitLab/Bitbucket).
2. **Add New Project** → import your repo (`invisible-dex` or your fork).
3. **Configure** (use one of these):

   - **Option 1 – Root Directory = `frontend` (recommended):**  
     **Root Directory:** `frontend`. **Build Command:** `npm run build`. **Output Directory:** `dist`. **Install Command:** `npm install`. Framework: Vite.
   - **Option 2 – Deploy from repo root:**  
     Leave **Root Directory** empty. The repo’s root **vercel.json** will run `cd frontend && npm install && npm run build` and use **Output Directory** `frontend/dist`. No need to set build/output in the dashboard.
4. **Environment variables** (add in the Vercel project → Settings → Environment Variables):

   | Name | Value | Notes |
   |------|--------|--------|
   | `VITE_API_URL` | `https://your-api-url.com` | Your deployed backend URL (no trailing slash). Required for markets/bets. |
   | `VITE_WS_URL` | `wss://your-api-url.com` | WebSocket URL (same host as API, `wss` in production). |
   | `VITE_SUI_NETWORK` | `testnet` or `mainnet` | Sui network for the wallet. |
   | `VITE_SUI_RPC_URL` | (optional) | Override RPC; default is public fullnode for the network above. |
   | `VITE_SUI_PACKAGE_ID` | (optional) | Set after deploying contracts if you use on-chain markets. |

   Add these for **Production** (and Preview if you want previews to use the same API).

5. **Deploy.** Vercel builds the frontend and deploys it. Your app URL will be like `https://your-project.vercel.app`.

### Option B: Vercel CLI

From the repo root:

```bash
npm i -g vercel
cd frontend
vercel
```

When prompted, set **root directory** to `.` (current folder, i.e. `frontend`). Add the same environment variables in the Vercel dashboard for the linked project, or use `vercel env add`.

---

## 2. Backend (API) – required for markets and bets

The frontend calls `VITE_API_URL` for `/api/markets` and `/api/bets`. If you don’t deploy a backend, the app will load but **markets and place-bet will fail**.

**Deploy the backend somewhere else**, then point the frontend at it:

- **Railway:** New project → deploy from repo, root `server`, set `PORT` and other env vars.
- **Render:** New Web Service → repo, root `server`, build `npm install`, start `npm run start` (or `node dist/index.js` if you build first).
- **Fly.io / VPS:** Run the Node server and expose it over HTTPS.

After the backend is live:

1. Set **VITE_API_URL** to `https://your-backend-host.com` (no `/api` suffix; the app appends `/api`).
2. Set **VITE_WS_URL** to `wss://your-backend-host.com` if you use WebSockets.

Ensure the backend allows CORS from your Vercel domain (e.g. `https://your-project.vercel.app`).

---

## 3. Troubleshooting: app not showing or 404

- **Build is failing:** Open the deployment → **Building** tab in Vercel. Fix the error. Use **Root Directory** = `frontend` or deploy from repo root (root **vercel.json** builds the frontend).
- **404 on the app (blank page or “Failed to load resource” for the page):**
  - In Vercel, set **Root Directory** to **`frontend`** (Project Settings → General). If the root is wrong, the build may not produce `dist/index.html`.
  - The repo’s `frontend/vercel.json` includes an SPA fallback rewrite so any path serves `index.html`. Redeploy after pulling the latest so this is applied.
- **404 on `/api/...` or “Failed to load resource” for API calls:**
  - The frontend does **not** call your Vercel domain for the API. It calls **`VITE_API_URL`**. Set **VITE_API_URL** in Vercel to your **deployed backend URL** (e.g. `https://your-backend.railway.app`). If that env var is missing or wrong, the app will request `/api` on the same origin (Vercel), which has no API and returns 404.

---

## 4. Post-deploy checklist

- [ ] Open your Vercel URL; the app loads.
- [ ] Connect wallet (Sui testnet/mainnet).
- [ ] Markets load (if `VITE_API_URL` points to a running backend).
- [ ] Create a market and place a bet to confirm full flow.

---

## 5. Custom domain (optional)

In the Vercel project → **Settings → Domains**, add your domain and follow the DNS instructions.

---

## Summary

| What | Where |
|------|--------|
| **Frontend** | Vercel (root `frontend`, build `npm run build`, output `dist`). Set `VITE_API_URL`, `VITE_WS_URL`, `VITE_SUI_NETWORK`. |
| **Backend** | Deploy separately (Railway, Render, etc.); set its URL in `VITE_API_URL` and `VITE_WS_URL`. |
| **Contracts** | Deploy to Sui testnet/mainnet; set `VITE_SUI_PACKAGE_ID` in Vercel env if you use on-chain markets. |
