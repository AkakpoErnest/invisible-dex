# Yellow Network Prize – Qualification Checklist

To qualify for the **Yellow Network Prize**, your project must meet the three requirements below. This doc shows how **Invisible DEX** meets them and what you need to do.

---

## 1. Use the Yellow SDK / Nitrolite protocol in your submission

**Requirement:** The submission must use the Yellow SDK or Nitrolite protocol.

**How we meet it:**

- **Dependency:** `@erc7824/nitrolite` is a **required** dependency in `server/package.json` (no longer optional).
- **Server:** `server/src/services/NitroliteIntegration.ts` uses the Nitrolite config; `/health` reports `yellow.connected: true` when `PRIVATE_KEY` and `ALCHEMY_RPC_URL` (Sepolia) are set.
- **Demo script:** `server/scripts/yellow-nitrolite-demo.ts` uses the Nitrolite SDK directly:
  - `NitroliteClient` (viem + Sepolia + custody/adjudicator addresses)
  - `createAuthRequestMessage`, `createAuthVerifyMessageFromChallenge` (session key + EIP-712 auth)
  - `createGetChannelsMessage`, `createGetLedgerBalancesMessage`
  - `createTransferMessage` (off-chain transfer over WebSocket)

**What you need:** Run the demo script so reviewers see real Nitrolite usage (see “What you need to do” below).

---

## 2. Demonstrate off-chain transaction logic

**Requirement:** e.g. instant payments, session-based spending, or **settlement finalized via smart contracts**.

**How we meet it:**

- **Off-chain (Yellow):** The demo script connects to Yellow sandbox, authenticates with a session key, and sends an **instant off-chain transfer** via `createTransferMessage` (no L1 transaction). This demonstrates instant payments / session-based off-chain logic.
- **Settlement on-chain (Sui):** Prediction market contracts in `contracts/` support resolution and claims. The design (see `docs/ARCHITECTURE.md`) is: bets can be taken off-chain via Yellow for speed; when a market resolves, **final state is batch-settled on Sui** via the deployed Move contracts. So we demonstrate:
  - **Instant UX:** Off-chain bets (Yellow).
  - **Settlement finalized via smart contracts:** Sui contracts for resolve and claim.

**What you need:** Run the Yellow demo (off-chain transfer) and have Sui contracts deployed (already done on testnet) so the “settlement via smart contracts” story is visible.

---

## 3. Deploy or simulate a working prototype

**Requirement:** Deploy or simulate a working prototype showing how Yellow improves transaction speed, UX, or efficiency.

**How we meet it:**

- **Simulate (recommended):** Run the Nitrolite demo script: `npm run demo:yellow`. This shows Yellow improving **speed** (instant transfer) and **efficiency** (no L1 gas for the transfer).
- **Full app:** Run `npm run dev:all` and use the UI: place bets via WebSocket; when Yellow is configured, the server reports `yellow.connected` and can tag bets with `viaLayer: "yellow"`. Sui is used for on-chain markets and settlement.
- **Deploy (optional):** Deploy backend + frontend to a host and point the frontend at the deployed API; document the URL in your submission.

**What you need:** At minimum, run the demo script and (if possible) a short screen recording or written steps showing: connect → auth → off-chain transfer. Optionally run the full app or deploy it.

---

## What you need to do (summary)

| Step | Action |
|------|--------|
| 1 | **Sepolia wallet** – Create/use an EVM wallet on Sepolia. Export its **private key** (test wallet only). |
| 2 | **Sepolia RPC** – Get a Sepolia RPC URL (e.g. [Alchemy](https://www.alchemy.com/), [Infura](https://www.infura.io/), or use `https://1rpc.io/sepolia`). |
| 3 | **server/.env** – Set `PRIVATE_KEY=0x...` and `ALCHEMY_RPC_URL=https://...`. |
| 4 | **Sepolia ETH** – Get a little Sepolia ETH for gas (e.g. [sepoliafaucet.com](https://sepoliafaucet.com/)). |
| 5 | **Yellow sandbox tokens** – Request test tokens: `curl -X POST https://clearnet-sandbox.yellow.com/faucet/requestTokens -H "Content-Type: application/json" -d '{"userAddress":"YOUR_SEPOLIA_ADDRESS"}'` |
| 6 | **Run Nitrolite demo** – From repo root: `npm run demo:yellow`. This uses the Yellow SDK and performs an off-chain transfer. |
| 7 | **Run full app (optional)** – `npm run dev:all`; open http://localhost:5173, place a bet; check http://localhost:3001/health for `yellow.connected`. |
| 8 | **Submission** – In your submission, state that you used the Nitrolite SDK, point to this doc and `server/scripts/yellow-nitrolite-demo.ts`, and describe: off-chain instant transfer (Yellow) + settlement on Sui (smart contracts). |

---

## File reference

| File | Purpose |
|------|--------|
| `server/package.json` | `@erc7824/nitrolite` and `viem` as dependencies |
| `server/src/services/NitroliteIntegration.ts` | Nitrolite config check; used by health and WebSocket |
| `server/src/index.ts` | `/health` uses `isNitroliteConfigured()` for `yellow.connected` |
| `server/src/websocket/server.ts` | `place_bet` can include `viaLayer: "yellow"` when configured |
| `server/scripts/yellow-nitrolite-demo.ts` | **Main demo:** NitroliteClient + auth + off-chain transfer |
| `contracts/` | Sui Move contracts for markets and settlement |
| `docs/ARCHITECTURE.md` | Design: Yellow for off-chain, Sui for settlement |
| `docs/YELLOW_SDK_SETUP.md` | How to get Sepolia wallet, RPC, faucet |

---

## Quick commands

```bash
# From repo root
npm run demo:yellow          # Nitrolite SDK demo (off-chain transfer)
npm run dev:all              # Full app (frontend + server)
curl http://localhost:3001/health   # Check yellow.connected
```
