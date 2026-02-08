# How to Get / Configure the Backend API URL

The frontend talks to **your own** Invisible DEX backend (Node/Express server), not a third-party API. You don’t “get” a key from a provider; you **run the server** and point the frontend at its URL.

---

## What These Are

| Variable | Meaning |
|----------|--------|
| **VITE_API_URL** | Base URL of your backend (e.g. `http://localhost:3001`). Used for REST: `/api/markets`, `/api/bets`, etc. |
| **VITE_WS_URL** | WebSocket URL of the same server (e.g. `ws://localhost:3001`). Used for real-time Yellow or other WS features. |

They usually share the same host and port; only the scheme changes (`http`/`https` vs `ws`/`wss`).

---

## Local Development

1. **Start the backend** (from repo root):
   ```bash
   npm run dev:server
   ```
   Or run both frontend and backend:
   ```bash
   npm run dev:all
   ```
   By default the server listens on **port 3001**.

2. **Configure the frontend**  
   In `frontend/.env` (create from `frontend/.env.example` if needed):
   ```bash
   VITE_API_URL=http://localhost:3001
   VITE_WS_URL=ws://localhost:3001
   ```
   If you don’t set these, the frontend falls back to `/api` (same origin) and `ws://localhost:3001` for WS, which works when the frontend is served by Vite with proxy or when the backend runs on 3001.

3. **Use the app**  
   Open the frontend (e.g. `http://localhost:5173`). It will call `http://localhost:3001/api/markets`, `http://localhost:3001/api/bets`, etc.

---

## Different Port or Host

- **Server on another port (e.g. 3002)**  
  In `server/.env`: `PORT=3002`.  
  In `frontend/.env`: `VITE_API_URL=http://localhost:3002` and `VITE_WS_URL=ws://localhost:3002`.

- **Server on another machine (e.g. same LAN)**  
  Use that machine’s IP and port:
  ```bash
  VITE_API_URL=http://192.168.1.10:3001
  VITE_WS_URL=ws://192.168.1.10:3001
  ```
  Ensure the server allows CORS and is reachable (firewall, etc.).

---

## Production (Deployed Backend)

After you deploy the backend (e.g. to a VPS, Railway, Render, or a cloud provider):

1. You get a **public URL**, e.g. `https://api.yourdomain.com`.
2. Set in the **frontend** env (or your host’s env for the frontend build):
   ```bash
   VITE_API_URL=https://api.yourdomain.com
   VITE_WS_URL=wss://api.yourdomain.com
   ```
3. Rebuild the frontend so `VITE_*` are baked in: `npm run build` in `frontend/`.
4. Ensure the backend has CORS set to allow your frontend origin and that the WebSocket server is available at the same host (e.g. `wss://api.yourdomain.com`).

You don’t get this URL from a third party; it’s the URL of the server **you** deploy. See **POST_LAUNCH_CHECKLIST.md** and **docs/DEPLOYMENT.md** for deployment steps.

---

## Summary

| Case | What to do |
|------|------------|
| **Local dev** | Run `npm run dev:all` (or `dev:server` + `dev:frontend`). Set `VITE_API_URL=http://localhost:3001` and `VITE_WS_URL=ws://localhost:3001` in `frontend/.env` if needed. |
| **Different port/host** | Set `PORT` in `server/.env` and match `VITE_API_URL` / `VITE_WS_URL` in `frontend/.env`. |
| **Production** | Deploy the backend, get its public URL, set `VITE_API_URL` and `VITE_WS_URL` to `https://...` and `wss://...`, then rebuild the frontend. |

The “backend API” is your own server; you get the URL by running it locally or deploying it.
