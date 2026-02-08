# What You Need to Provide & Instructions

## What you need

1. **Sui Package ID** – You get this after deploying the contracts (see below). Put it in both server and frontend `.env`.
2. **Sui private key** (optional, for backend signer) – From `sui keytool export --address <your_address>`. Put only in `server/.env`. Never commit it.
3. **Yellow API key** (optional) – From the Yellow Network dashboard. Put in `server/.env` if you use Yellow.
4. **Backend URL** (only for production) – When you deploy the backend, put that URL in the frontend `.env` as `VITE_API_URL` and `VITE_WS_URL` (same host, `https`/`wss` for production).

---

## Instructions

### 1. Create `.env` files

**Server**

```bash
cd server
cp .env.example .env
```

**Frontend**

```bash
cd frontend
cp .env.example .env
```

### 2. Install Sui CLI and create a dev wallet (if needed)

**Install Sui CLI (pick one):**

```bash
brew install sui
```

or with Cargo:

```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git sui
```

**Create a dev wallet** (if you don’t have one):

```bash
sui client new-address ed25519
```

Save the recovery phrase. Switch to testnet and get tokens:

```bash
sui client switch --env testnet
```

Testnet tokens are via the **web faucet** (CLI no longer mints). Open this URL (replace with your address if different):

**https://faucet.sui.io/?address=YOUR_SUI_ADDRESS**

Or run `sui client active-address` and open:  
`https://faucet.sui.io/?address=<paste_that_address>`

### 3. Deploy the contracts and get the Package ID

```bash
cd contracts
sui move build
sui client publish --gas-budget 100000000
```

In the output, copy the **Package ID** (starts with `0x`).

### 4. Put the Package ID in both `.env` files

- **server/.env** – set `PREDICTION_MARKET_PACKAGE=<the_package_id_you_copied>`
- **frontend/.env** – set `VITE_SUI_PACKAGE_ID=<the_same_package_id>`

### 5. (Optional) Backend signer

If you want the server to sign transactions (e.g. settlements):

```bash
sui client active-address
sui keytool export --address <that_address>
```

Put the exported key in **server/.env** as `SUI_PRIVATE_KEY=suiprivkey1...`. Do not commit this file.

### 6. (Optional) Yellow Network

If you have a Yellow API key, put it in **server/.env** as `YELLOW_API_KEY=...`. Leave it empty otherwise.

### 7. Run the app

```bash
# From project root
npm run dev:all
```

- Backend: http://localhost:3001  
- Frontend: http://localhost:5173  

### 8. When you deploy to production

- In **frontend/.env** (or your host’s env): set `VITE_API_URL` and `VITE_WS_URL` to your deployed backend URL (e.g. `https://api.yourdomain.com` and `wss://api.yourdomain.com`).
- In **server/.env**: set `CORS_ORIGIN` to your frontend URL (e.g. `https://app.yourdomain.com`).

---

**Summary:** Copy `.env.example` to `.env` in both `server` and `frontend`, deploy contracts, paste the Package ID in both `.env` files, then run `npm run dev:all`. Add private key and Yellow key only if you need them.
