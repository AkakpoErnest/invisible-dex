# How to Get a Sui RPC URL

The app uses a **Sui RPC endpoint** to talk to the Sui blockchain (wallet, reads, and eventually contract calls). You can use the **public fullnode** for free, or a **dedicated RPC** for higher rate limits and reliability.

---

## When You Need It

- **Frontend:** Wallet and chain reads use the RPC. Set `VITE_SUI_RPC_URL` (optional; the app defaults to the public testnet/mainnet URLs).
- **Server:** Contract reads and settlement use the RPC. Set `SUI_RPC_URL` in `server/.env` (optional; defaults to public URLs).

---

## Option 1: Public Fullnode (No Sign-up)

Sui provides free public RPC endpoints. **No API key required.**

| Network  | URL |
|----------|-----|
| **Testnet** | `https://fullnode.testnet.sui.io:443` |
| **Mainnet** | `https://fullnode.mainnet.sui.io:443` |
| **Devnet**  | `https://fullnode.devnet.sui.io:443` |

**Where to set it:**

- **Frontend** (`frontend/.env`):  
  `VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443`
- **Server** (`server/.env`):  
  `SUI_RPC_URL=https://fullnode.testnet.sui.io:443`

If you don’t set these, the code already defaults to the public testnet/mainnet URLs, so **you don’t need to get anything** for local dev on testnet.

---

## Option 2: Dedicated RPC (Optional)

For production or higher traffic you may want a dedicated RPC provider (better rate limits, latency, support).

### Sui-approved RPC providers

1. **Sui Foundation / Sui RPC**  
   - Docs: [Sui Docs – RPC](https://docs.sui.io/build/full-node)  
   - You may get a dedicated URL when running a full node or through Sui’s programs.

2. **Third-party providers**  
   - Check [Sui ecosystem](https://sui.io/ecosystem) or [Sui docs](https://docs.sui.io) for current RPC offerings (e.g. QuickNode, BlockVision, etc.).  
   - Sign up, create a project, and copy the **Sui Testnet** or **Mainnet** RPC URL they give you.

### After you have a URL

- **Frontend:** Put it in `frontend/.env` as `VITE_SUI_RPC_URL=<your-rpc-url>`.
- **Server:** Put it in `server/.env` as `SUI_RPC_URL=<your-rpc-url>`.

Restart the frontend and server so they use the new RPC.

---

## Summary

| Goal | What to do |
|------|------------|
| **Local dev / testnet** | Use defaults or set `VITE_SUI_RPC_URL` / `SUI_RPC_URL` to `https://fullnode.testnet.sui.io:443`. No sign-up. |
| **Production / higher limits** | Get a dedicated RPC URL from a Sui RPC provider and set it in the same env vars. |
