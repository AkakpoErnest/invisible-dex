# Complete Setup Instructions

## Table of Contents

1. [System Prerequisites](#system-prerequisites)
2. [Development Environment Setup](#development-environment-setup)
3. [Smart Contract Deployment](#smart-contract-deployment)
4. [Yellow Network Integration](#yellow-network-integration)
5. [Frontend Configuration](#frontend-configuration)
6. [Backend Configuration](#backend-configuration)
7. [Testing & Verification](#testing--verification)
8. [Common Issues & Solutions](#common-issues--solutions)

---

## System Prerequisites

### 1. Install Node.js and npm

**macOS (using Homebrew):**

```bash
brew install node
```

**Linux (Ubuntu/Debian):**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows:**  
Download from [nodejs.org](https://nodejs.org) and run the installer.

**Verify installation:**

```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be v9.0.0 or higher
```

### 2. Install Sui CLI

**macOS/Linux:**

```bash
# Download and install Sui
curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/MystenLabs/sui/main/scripts/install.sh | sh

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$HOME/.sui/bin:$PATH"

# Reload shell
source ~/.bashrc   # or source ~/.zshrc
```

**Windows (WSL2 recommended):**

```bash
wsl --install
# Then follow Linux instructions inside WSL
```

**Verify installation:**

```bash
sui --version
# Expected output: sui 1.x.x
```

### 3. Install Additional Tools

**Git:**

```bash
# macOS
brew install git

# Linux
sudo apt-get install git

# Windows: Download from git-scm.com
```

**Code Editor:** Cursor AI (cursor.sh) or VS Code with Move, Prettier, and ESLint extensions.

---

## Development Environment Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/AkakpoErnest/invisible-dex.git
cd invisible-dex

# Verify structure
ls -la
# You should see: contracts/, frontend/, server/, docs/, etc.
```

### Step 2: Configure Sui Wallet

```bash
# Initialize Sui client
sui client

# Create a new wallet address
sui client new-address ed25519

# The output will show your address and recovery phrase
# IMPORTANT: Save your recovery phrase securely!

# Set active address (if you have multiple)
sui client switch --address <YOUR_ADDRESS>

# Request testnet tokens from faucet
sui client faucet

# Verify you received tokens
sui client gas
# Expected output: List of gas objects with balances
```

**Important Wallet Commands:**

```bash
# List all addresses
sui client addresses

# Export private key (keep secure!)
sui keytool export --address <YOUR_ADDRESS>

# Check current network
sui client active-env

# Switch network (devnet/testnet/mainnet)
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
```

### Step 3: Install Project Dependencies

```bash
# Install all dependencies (root, server, frontend)
npm run install:all

# Or install individually
cd server && npm install && cd ..
cd frontend && npm install && cd ..
```

**If you encounter issues:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Step 4: Environment Configuration

**Create root `.env` file:**

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Global Configuration
NODE_ENV=development
LOG_LEVEL=debug

# Sui Configuration
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Yellow Network (get from Yellow Network dashboard)
YELLOW_API_KEY=your_key_here
YELLOW_WS_ENDPOINT=wss://clearnet.yellow.com/ws
```

**Create frontend `.env`:**

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
# API (dev)
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

# Sui Network
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Contract Addresses (fill after deployment)
VITE_SUI_PACKAGE_ID=
VITE_PREDICTION_MARKET_PACKAGE=
VITE_SETTLEMENT_MANAGER_PACKAGE=
VITE_MARKET_FACTORY_PACKAGE=

# Yellow Network (optional)
VITE_YELLOW_WS_ENDPOINT=wss://clearnet.yellow.com/ws
VITE_YELLOW_API_KEY=

# Feature Flags
VITE_ENABLE_3D_GRAPHICS=true
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG_MODE=true
```

**Create server `.env`:**

```bash
cd ../server
cp .env.example .env
```

Edit `server/.env`:

```env
# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Sui
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
# SUI_PRIVATE_KEY=suiprivkey1...   # Optional: from sui keytool export

# Yellow Network
YELLOW_WS_ENDPOINT=wss://clearnet.yellow.com/ws
YELLOW_API_KEY=
YELLOW_TIMEOUT=30000
YELLOW_RETRY_ATTEMPTS=3

# Optional: Database
# DATABASE_URL=postgresql://localhost:5432/invisible_dex
# REDIS_URL=redis://localhost:6379
```

---

## Smart Contract Deployment

### Step 1: Build Contracts

```bash
cd contracts

# Build all contracts
sui move build

# Expected output: BUILD SUCCESSFUL
```

**If build fails:**

```bash
# Verify Move.toml configuration
cat Move.toml

# Check for syntax errors
sui move build --dump-bytecode-as-base64

# Run tests (when added)
sui move test
```

### Step 2: Deploy to Testnet

```bash
# Ensure you're on testnet
sui client switch --env testnet

# Deploy the package
sui client publish --gas-budget 100000000

# The output will show:
# - Transaction Digest
# - Package ID (SAVE THIS!)
# - Created Objects
# - Gas Used
```

**Save the Package ID:**

Copy the Package ID from the output (e.g. `0x1234567890abcdef...`) and update:

- `frontend/.env` → `VITE_SUI_PACKAGE_ID=0x...`
- `frontend/.env` → `VITE_PREDICTION_MARKET_PACKAGE=0x...` (same value if single package)

### Step 3: Verify Deployment

```bash
# Check package exists
sui client object <PACKAGE_ID>

# List all objects you own
sui client objects

# View transaction details
sui client tx <TRANSACTION_DIGEST>
```

### Step 4: Initialize Contracts (Optional)

```bash
# From repo root
cd scripts
npx tsx deploy-contracts.ts
# Or deploy manually: cd contracts && sui client publish --gas-budget 100000000
```

---

## Yellow Network Integration

### Step 1: Get Yellow Network Access

1. Visit [Yellow Network Developer Portal](https://docs.yellow.org).
2. Sign up for a developer account.
3. Generate an API key.
4. Note your WebSocket endpoint (e.g. `wss://clearnet.yellow.com/ws`).

### Step 2: Install Yellow SDK (Optional)

```bash
cd server
npm install @erc7824/nitrolite
```

### Step 3: Test Yellow Connection

```bash
# From repo root
node scripts/test-yellow.js
```

Or set env and run:

```bash
export YELLOW_WS_ENDPOINT=wss://clearnet.yellow.com/ws
export YELLOW_API_KEY=your_key
node scripts/test-yellow.js
```

### Step 4: Initialize State Channels (Optional)

```bash
npx tsx scripts/setup-yellow-channel.ts
# This connects to Yellow, creates state channel, and verifies status.
```

---

## Frontend Configuration

### Step 1: Install Frontend Dependencies

```bash
cd frontend
npm install

# Verify critical packages
npm list @mysten/sui @mysten/dapp-kit react
```

### Step 2: Configure Wallet Connection

The app uses `@mysten/dapp-kit` for wallet connection. No additional setup needed for development.

### Step 3: Build and Run Frontend

```bash
# Development mode
npm run dev
# App runs at http://localhost:5173

# Production build
npm run build
npm run preview
```

### Step 4: Test Frontend Features

In the browser verify:

- [ ] Wallet connection
- [ ] Network status (testnet)
- [ ] Test market display
- [ ] Bet placement (with testnet tokens)

---

## Backend Configuration

### Step 1: Install Backend Dependencies

```bash
cd server
npm install

# Optional: PM2 for process management
# npm install -g pm2
```

### Step 2: Database Setup (Optional)

If using PostgreSQL:

```bash
# macOS
brew install postgresql
brew services start postgresql

# Linux
sudo apt-get install postgresql
sudo service postgresql start

# Create database
createdb invisible_dex

# Run migrations (when added)
# npm run migrate
```

### Step 3: Start Backend Server

```bash
# Development mode
npm run dev

# Production
npm run build
npm start

# With PM2 (production)
# pm2 start dist/index.js --name invisible-dex-api
# pm2 save && pm2 startup
```

### Step 4: Test API Endpoints

```bash
# Health check
curl http://localhost:3001/health

# Get markets
curl http://localhost:3001/api/markets

# WebSocket (browser console or client)
# const ws = new WebSocket('ws://localhost:3001/ws');
# ws.onopen = () => console.log('Connected');
# ws.onmessage = (msg) => console.log('Message:', msg.data);
```

---

## Testing & Verification

### Unit Tests

```bash
# Contracts
cd contracts
sui move test

# Frontend (when tests added)
cd ../frontend
npm run test

# Backend (when tests added)
cd ../server
npm run test
```

### Integration Tests

```bash
# From repo root (start server first in another terminal)
npm run test:integration

# This checks:
# 1. Backend health
# 2. Markets API
```

### Manual Testing Checklist

- [ ] Wallet connects successfully
- [ ] Balance displays correctly
- [ ] Can view available markets
- [ ] Can place a bet
- [ ] Bet appears in UI / Yellow state channel (when integrated)
- [ ] Real-time updates work (WebSocket)
- [ ] Settlement completes (on-chain when integrated)
- [ ] Funds received in wallet

---

## Common Issues & Solutions

**Issue: Sui CLI not found**

```bash
export PATH="$HOME/.sui/bin:$PATH"
source ~/.bashrc   # or ~/.zshrc
```

**Issue: Insufficient gas**

```bash
sui client faucet
# Wait 60 seconds and try again if needed
```

**Issue: Yellow Network connection fails**

```bash
# Check endpoint
echo $YELLOW_WS_ENDPOINT

# Verify API key and Yellow status page
# Increase timeout in server/.env: YELLOW_TIMEOUT=60000
```

**Issue: Frontend won't start**

```bash
rm -rf node_modules .vite
npm install
npm run dev
```

**Issue: Contract deployment fails**

```bash
# Increase gas budget
sui client publish --gas-budget 200000000

# Check compilation
sui move build
```

**Issue: WebSocket connection refused**

```bash
# Ensure server is running
lsof -i :3001

# Check CORS and proxy in frontend vite.config.ts
```

---

## Advanced Configuration

### Custom Network

```bash
sui client new-env --alias custom --rpc https://your-rpc-url.com
sui client switch --env custom
```

### Quick Reference Commands

```bash
# Start both server and frontend (from root)
npm run dev:all

# Deploy contracts
cd contracts && sui client publish --gas-budget 100000000

# Run frontend only
cd frontend && npm run dev

# Run backend only
cd server && npm run dev

# Run integration test
npm run test:integration

# Build for production
npm run build:all
```

---

## Next Steps

- Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design.
- Review [docs/API.md](docs/API.md) for API documentation.
- Check [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment.
