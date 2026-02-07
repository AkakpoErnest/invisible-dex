# Invisible DEX – Step-by-Step Setup

This guide walks you through setting up the Invisible DEX from scratch. If you prefer automation, use `./quick-start.sh` instead.

---

## Prerequisites

Before you begin, ensure you have:

| Tool        | Version   | Check command   |
|------------|-----------|------------------|
| Node.js    | 18+       | `node -v`        |
| npm        | 9+        | `npm -v`         |
| Git        | 2.x       | `git --version`  |
| Sui CLI    | latest    | `sui --version`  |

### Installing Sui CLI

If Sui CLI is not installed:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/MystenLabs/sui/main/scripts/install.sh | sh
export PATH="$HOME/.sui/bin:$PATH"
```

Add the last line to your `~/.zshrc` or `~/.bashrc` so it persists.

---

## 1. Clone and Install Dependencies

```bash
git clone https://github.com/AkakpoErnest/invisible-dex.git
cd invisible-dex
npm run install:all
```

This installs root, server, and frontend dependencies.

---

## 2. Sui Wallet Setup

### Create an address (if you don’t have one)

```bash
sui client new-address ed25519
```

Follow the prompts. Save the recovery phrase somewhere safe.

### Switch to testnet and get tokens

```bash
sui client switch --env testnet
sui client faucet
```

### Verify balance

```bash
sui client gas
```

You should see a non-zero balance. If not, run `sui client faucet` again.

---

## 3. Build and Deploy Smart Contracts

```bash
cd contracts
sui move build
```

Fix any build errors, then deploy:

```bash
sui client publish --gas-budget 100000000
```

Copy the **Package ID** from the output (e.g. `0xabc123...`). You’ll need it for the frontend and server.

Create a `.env` in the project root (or in `frontend` and `server` as needed):

```bash
# In project root or frontend/.env
VITE_SUI_PACKAGE_ID=<your-package-id>
```

---

## 4. Yellow Network Configuration

1. Get an API key from [Yellow Network docs](https://docs.yellow.org).
2. Create `server/.env`:

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```
YELLOW_WS_ENDPOINT=wss://clearnet.yellow.com/ws
YELLOW_API_KEY=your_key_here
PORT=3001
```

If you don’t have a key yet, you can still run the server; Yellow-dependent features will fail until the key is set.

---

## 5. Environment for Frontend

Create `frontend/.env` (or use root `.env` with `VITE_` prefix for Vite):

```
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
VITE_SUI_PACKAGE_ID=<package-id-from-step-3>
```

Use the same Package ID you saved in step 3.

---

## 6. Run Development Servers

Use two terminals.

**Terminal 1 – Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 – Frontend:**

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 7. Verify Setup

1. Connect your Sui wallet (e.g. Sui Wallet extension).
2. Ensure you’re on Sui testnet in the wallet.
3. Load the app; you should see the UI and any test market.
4. Place a small test bet and confirm it appears and updates.

---

## Troubleshooting

- **Sui CLI not found:** Ensure `$HOME/.sui/bin` is in your `PATH`.
- **Publish fails:** Run `sui client faucet` and increase `--gas-budget` if needed.
- **Yellow connection errors:** Check `YELLOW_API_KEY` and `YELLOW_WS_ENDPOINT` in `server/.env`.
- **Frontend can’t reach API:** Confirm the backend is running on the port in `VITE_API_URL` and CORS is allowed.

For more, see the main [README.md](./README.md) and [docs/](./docs/).
