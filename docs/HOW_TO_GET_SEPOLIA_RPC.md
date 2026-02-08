# How to Get a Sepolia RPC URL

The app uses **Sepolia** (Ethereum testnet) for **Yellow Network** (Nitrolite / state channels). You need a **Sepolia RPC URL** so the server can connect to Sepolia for wallet auth and gas. You can use a **free public RPC** or a **free tier** from Alchemy/Infura.

---

## When You Need It

- **Yellow Network (Nitrolite)** in the server: set `ALCHEMY_RPC_URL` (or any Sepolia RPC URL) in `server/.env` together with `PRIVATE_KEY` (Sepolia wallet).  
- Not required if you only use Sui and the REST markets/bets API (no Yellow).

---

## Option 1: Public RPC (No Sign-up)

**1rpc.io** offers a free public Sepolia endpoint:

```
https://1rpc.io/sepolia
```

**Where to set it:**  
In `server/.env`:

```bash
ALCHEMY_RPC_URL=https://1rpc.io/sepolia
```

(The variable name is `ALCHEMY_RPC_URL` for historical reasons; the URL can be from any provider.)

---

## Option 2: Alchemy (Free Tier)

1. Go to [alchemy.com](https://www.alchemy.com/) and sign up (free).
2. Create a new app:
   - **Dashboard** → **Create new app**
   - **Chain:** Ethereum  
   - **Network:** Sepolia
3. Open the app and go to **API key** / **View key**.
4. Copy the **HTTPS** URL; it looks like:
   ```
   https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   ```

**Where to set it:**  
In `server/.env`:

```bash
ALCHEMY_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

---

## Option 3: Infura (Free Tier)

1. Go to [infura.io](https://www.infura.io/) and sign up (free).
2. Create a project and open it.
3. In **API Keys**, select **Ethereum** and the **Sepolia** endpoint.
4. Copy the **Project URL**; it looks like:
   ```
   https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   ```

**Where to set it:**  
In `server/.env`:

```bash
ALCHEMY_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

---

## You Also Need (for Yellow)

- **Sepolia wallet** – MetaMask (or any EVM wallet) switched to **Sepolia**.
- **Sepolia ETH** – From a [Sepolia faucet](https://sepoliafaucet.com/) or your provider’s faucet (Alchemy/Infura often offer one).
- **Private key** – Export from the wallet and set in `server/.env` as `PRIVATE_KEY=0x...`.

See **YELLOW_WHAT_YOU_NEED.md** and **docs/YELLOW_SDK_SETUP.md** for the full Yellow setup.

---

## Summary

| Source      | Steps | URL format |
|------------|--------|------------|
| **1rpc.io** | None  | `https://1rpc.io/sepolia` |
| **Alchemy** | Sign up → Create app (Ethereum, Sepolia) → Copy HTTPS URL | `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY` |
| **Infura**  | Sign up → Create project → Sepolia endpoint → Copy URL | `https://sepolia.infura.io/v3/YOUR_PROJECT_ID` |

Put the chosen URL in `server/.env` as `ALCHEMY_RPC_URL=...`.
