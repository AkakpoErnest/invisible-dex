# How to Get Yellow Network API Access

The app can use **Yellow Network** (Nitrolite state channels) for off-chain transfers. There are two ways to use it: **sandbox** (no API key) and **production** (API key if required by Yellow).

---

## When You Need It

- **Sandbox (testing):** No API key. You need a Sepolia wallet, Sepolia RPC URL, and Yellow sandbox test tokens. Used for demos and local testing.
- **Production:** If Yellow requires an API key for mainnet/clearnet, you need to get one from Yellow and set it in the server.

---

## Sandbox (No API Key)

For **sandbox**, Yellow uses wallet-based auth. You do **not** need to get an API key from a dashboard.

### 1. Sepolia wallet and RPC

- Create or use an **EVM wallet** on **Sepolia** (e.g. MetaMask → switch to Sepolia).
- Get a **Sepolia RPC URL**: see [HOW_TO_GET_SEPOLIA_RPC.md](./HOW_TO_GET_SEPOLIA_RPC.md).
- Get a little **Sepolia ETH** from a [Sepolia faucet](https://sepoliafaucet.com/) (for gas).
- Export the wallet **private key** (use a test-only wallet). Set it in `server/.env` as:
  ```bash
  PRIVATE_KEY=0x...your_sepolia_private_key...
  ALCHEMY_RPC_URL=https://...your_sepolia_rpc_url...
  ```

### 2. Yellow sandbox test tokens

Tokens go to your **Unified Balance** (off-chain). Request them with your **Sepolia wallet address**:

```bash
curl -X POST https://clearnet-sandbox.yellow.com/faucet/requestTokens \
  -H "Content-Type: application/json" \
  -d '{"userAddress":"YOUR_SEPOLIA_WALLET_ADDRESS"}'
```

Replace `YOUR_SEPOLIA_WALLET_ADDRESS` with the same address that owns `PRIVATE_KEY`.

### 3. Sandbox WebSocket (optional in code)

- **Endpoint:** `wss://clearnet-sandbox.yellow.com/ws`
- The server or scripts connect here for sandbox. No API key in the request.

### 4. Where to configure (sandbox)

In **server/.env**:

```bash
PRIVATE_KEY=0x...
ALCHEMY_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY   # or 1rpc.io/sepolia
# YELLOW_API_KEY=   leave empty for sandbox
```

The app’s **/health** endpoint will show `yellow.connected: true` when `PRIVATE_KEY` and `ALCHEMY_RPC_URL` are set and the Nitrolite integration is enabled.

---

## Production / API Key (If Required)

If you move to **production** or Yellow’s **clearnet** and they require an API key:

1. **Yellow docs and developer access**
   - Check [Yellow documentation](https://docs.yellow.org) and any “Developer” or “Dashboard” section.
   - Look for “API key”, “Developer key”, or “Get access” for the production WebSocket/API.

2. **Where to set it**
   - **Server:** In `server/.env`:
     ```bash
     YELLOW_API_KEY=your_key_here
     ```
   - **Frontend** (only if the frontend talks to Yellow directly): In `frontend/.env`:
     ```bash
     VITE_YELLOW_API_KEY=your_key_here
     ```

3. **WebSocket endpoint**
   - Production endpoint is often: `wss://clearnet.yellow.com/ws`
   - Set in `server/.env` if needed: `YELLOW_WS_ENDPOINT=wss://clearnet.yellow.com/ws`

Because Yellow’s signup and key process can change, always use their latest docs for the exact steps to get an API key.

---

## Summary

| Use case   | API key? | What you need |
|-----------|----------|----------------|
| **Sandbox** | No      | Sepolia wallet + private key, Sepolia RPC URL, Sepolia ETH, test tokens via faucet `curl` above. Set `PRIVATE_KEY` and `ALCHEMY_RPC_URL` in `server/.env`. |
| **Production** | If required by Yellow | Get API key from Yellow docs/dashboard; set `YELLOW_API_KEY` in `server/.env` (and optionally `VITE_YELLOW_API_KEY` in frontend). |

More detail: **YELLOW_WHAT_YOU_NEED.md** and **docs/YELLOW_SDK_SETUP.md**.
