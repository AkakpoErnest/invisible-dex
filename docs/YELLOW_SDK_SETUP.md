# Yellow Network SDK – What You Need

This project uses the **Nitrolite SDK** (`@erc7824/nitrolite`) for Yellow Network state channels. Below is what you need to get the details and run it, based on the [Yellow Learn docs](https://docs.yellow.org/docs/learn/) and [Quickstart](https://docs.yellow.org/docs/learn/getting-started/quickstart).

---

## 1. Sandbox (testing) – no API key

For **sandbox**, you do **not** need an API key from a dashboard. You use wallet-based auth.

### Required

| What | Where to get it |
|------|------------------|
| **EVM wallet (Sepolia)** | Any Ethereum wallet (MetaMask, etc.). Must be on **Sepolia** testnet. |
| **Private key** | Export from your wallet (e.g. MetaMask → Account details → Export private key). Use **only** a test wallet, never mainnet keys. |
| **Sepolia RPC URL** | Free from [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/), or use public: `https://1rpc.io/sepolia`. |
| **Sepolia ETH** | For gas. Get from [Sepolia faucet](https://sepoliafaucet.com/) or Alchemy/Infura faucets. |

### Environment variables (server)

In **server/.env** (or in a `.env` in the folder from which you run the Yellow script):

```bash
# Sepolia wallet (for Yellow / Nitrolite)
PRIVATE_KEY=0x...your_sepolia_private_key...
ALCHEMY_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY   # or https://1rpc.io/sepolia
```

For **sandbox**, the Nitrolite Quickstart does **not** use `YELLOW_API_KEY`; auth is done with your wallet (EIP-712 challenge) and a temporary session key.

### Sandbox WebSocket

- **Endpoint:** `wss://clearnet-sandbox.yellow.com/ws`
- In code you connect to this URL and then run the auth flow (auth request → challenge → sign with wallet → auth verify).

### Test tokens (ytest.usd)

Get test tokens into your **Unified Balance** (off-chain) via the sandbox faucet:

```bash
curl -X POST https://clearnet-sandbox.yellow.com/faucet/requestTokens \
  -H "Content-Type: application/json" \
  -d '{"userAddress":"YOUR_SEPOLIA_WALLET_ADDRESS"}'
```

Replace `YOUR_SEPOLIA_WALLET_ADDRESS` with the same address that owns `PRIVATE_KEY`.

### Contract addresses (Sepolia sandbox)

From the [Quickstart](https://docs.yellow.org/docs/learn/getting-started/quickstart):

- **Custody:** `0x019B65A265EB3363822f2752141b3dF16131b262`
- **Adjudicator:** `0x7c7ccbc98469190849BCC6c926307794fDfB11F2`

Use these when initializing `NitroliteClient` for sandbox.

---

## 2. Production clearnet (optional)

For **production** Yellow clearnet (`wss://clearnet.yellow.com/ws`), some setups may require:

- **API key / developer access** – If Yellow provides a developer portal or dashboard, get your key there and set it in **server/.env** as `YELLOW_API_KEY=...`.
- **Same wallet/RPC as above** – Same idea: Sepolia (or the chain Yellow production uses) wallet + RPC.

Check the latest [Yellow docs](https://docs.yellow.org/docs/learn/) and any “Build” or “Production” section for:

- Developer portal / dashboard URL  
- How to request API keys for clearnet  
- Production contract addresses and chain ID  

---

## 3. Summary for this repo

| Goal | What to get |
|------|----------------------|
| **Run Yellow in sandbox** | Sepolia wallet + private key, Sepolia RPC URL, Sepolia ETH, faucet tokens to your address; use `wss://clearnet-sandbox.yellow.com/ws` and no API key. |
| **Use Nitrolite in code** | `PRIVATE_KEY`, `ALCHEMY_RPC_URL` (or similar), custody/adjudicator addresses, and the auth flow from the [Quickstart](https://docs.yellow.org/docs/learn/getting-started/quickstart). |
| **Production** | Follow Yellow’s current docs for API key/dashboard and set `YELLOW_API_KEY` in server/.env if required. |

---

## 4. References

- [Learn – Yellow Network](https://docs.yellow.org/docs/learn/)
- [Quickstart: Your First Channel](https://docs.yellow.org/docs/learn/getting-started/quickstart)
- [Key Terms & Mental Models](https://docs.yellow.org/docs/learn/getting-started/key-terms)
- [State Channels vs L1/L2](https://docs.yellow.org/docs/learn/core-concepts/state-channels-vs-l1-l2)

Nitrolite SDK: `@erc7824/nitrolite` (already in **server/package.json**).
