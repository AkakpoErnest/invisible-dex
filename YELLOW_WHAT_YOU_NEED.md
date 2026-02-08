# What You Need for Yellow Network

To use **Yellow Network** (Nitrolite / state channels) in this app you need the following. No API key is required for **sandbox**.

---

## 1. Sepolia wallet (EVM)

- Create or use a wallet on **Sepolia** testnet (e.g. MetaMask, switch to Sepolia).
- **Export the private key** (Account details → Export private key). Use a **test-only** wallet.

---

## 2. Sepolia RPC URL

- Get a free RPC from [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/), or use:
  - `https://1rpc.io/sepolia`

---

## 3. Sepolia ETH (for gas)

- Get test ETH from a [Sepolia faucet](https://sepoliafaucet.com/) (or Alchemy/Infura faucet).

---

## 4. Yellow sandbox test tokens

- Request test tokens (they go to your **Unified Balance** off-chain):

```bash
curl -X POST https://clearnet-sandbox.yellow.com/faucet/requestTokens \
  -H "Content-Type: application/json" \
  -d '{"userAddress":"YOUR_SEPOLIA_WALLET_ADDRESS"}'
```

Replace `YOUR_SEPOLIA_WALLET_ADDRESS` with the same address that owns the private key.

---

## 5. server/.env

Add (or set) in **server/.env**:

```bash
PRIVATE_KEY=0x...your_sepolia_private_key...
ALCHEMY_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
```

(or your Infura URL, or `https://1rpc.io/sepolia`).

---

## 6. Optional: create a Yellow channel

- The **demo script** can do an off-chain transfer only if you already have an **open channel**.
- To create one, follow the [Yellow Quickstart](https://docs.yellow.org/docs/learn/getting-started/quickstart): create channel, then **resize** with `allocate_amount` (from your Unified Balance) so the channel is funded.

---

## 7. Run the Yellow demo

From the repo root:

```bash
npm run demo:yellow
```

This connects to Yellow sandbox, authenticates, and (if you have an open channel) sends an off-chain transfer. The app’s **/health** will show `yellow.connected: true` when `PRIVATE_KEY` and `ALCHEMY_RPC_URL` are set.

---

## Summary

| Item | Where |
|------|--------|
| Sepolia wallet + private key | Your wallet (test only) |
| Sepolia RPC | Alchemy / Infura / 1rpc.io |
| Sepolia ETH | Faucet |
| Yellow test tokens | `curl` to sandbox faucet (see above) |
| Env vars | **server/.env**: `PRIVATE_KEY`, `ALCHEMY_RPC_URL` |

More detail: **docs/YELLOW_SDK_SETUP.md** and **PRIZE_REQUIREMENTS.md**.

---

## If you get "invalid message format"

The demo script sends `auth_request` with params as an **object** and `expires_at` in **milliseconds** (per Yellow docs). If the sandbox still returns "invalid message format", try:

1. **Official Quickstart** – Run the exact [Yellow Quickstart](https://docs.yellow.org/docs/learn/getting-started/quickstart) code with your wallet to confirm the sandbox accepts your client.
2. **Yellow Discord / support** – Ask for the exact `auth_request` format the sandbox expects (NitroRPC version or param shape).
3. **Debug** – Run `DEBUG_YELLOW=1 npm run demo:yellow` to see the outgoing request and sandbox responses.
