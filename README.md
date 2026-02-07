# 🚀 Getting Started with Invisible DEX

## Welcome

This repo is a **build guide and codebase** for building **The Invisible DEX** yourself — a hybrid prediction market (Sui + Yellow Network) for fast, low-cost betting on live events. You're building the app on your machine; this README is for you as the developer, not for showing or demoing anything to others.

Use this guide to go from zero to a working application in under 30 minutes.

---

## 📋 What You're Building

### The Problem You're Solving

Current prediction markets can't handle high-frequency betting (like every play in a football game) because:

- **On-chain is too slow** (15-30 second block times)
- **Off-chain is centralized** and requires trust
- **Hybrid solutions** are complex and expensive

### Your Solution

A true hybrid architecture:

- **Yellow Network** handles instant off-chain micro-bets (100k+ TPS)
- **Sui PTBs** batch-settle everything on-chain with atomic execution
- **Seamless UX** - users don't even know they're using two systems

### Technical Innovation

- State channels for live betting (sub-100ms execution)
- Programmable Transaction Blocks for efficient settlement
- One transaction settles 100s of bets
- 99% reduction in gas costs vs traditional DEXes

---

## 🎯 Quick Start (Choose Your Path)

### Path 1: Automated Setup (Recommended)

```bash
git clone https://github.com/AkakpoErnest/invisible-dex.git
cd invisible-dex

chmod +x quick-start.sh
./quick-start.sh
```

The script will:

- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Point you to Sui wallet and env setup
- ✅ Guide you through deploy and dev servers

**Time:** ~10 minutes

### Path 2: Manual Setup

Follow the step-by-step guide in [SETUP.md](./SETUP.md) to build and run everything yourself.

**Time:** ~20–30 minutes

### Path 3: Explore the Code First

If you prefer to read before running, the codebase is documented:

- **Smart contracts:** `contracts/sources/`
- **Frontend:** `frontend/src/`
- **Backend:** `server/src/`
- **Documentation:** `docs/`

---

## 📁 Project Structure Overview

```
invisible-dex/
│
├── contracts/                 # Sui Move Smart Contracts
│   ├── sources/
│   │   └── prediction_market.move    # Main prediction market logic
│   ├── tests/
│   └── Move.toml
│
├── frontend/                  # React Application
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── services/         # Blockchain & API integration
│   │   ├── hooks/            # React hooks
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/                    # Node.js Backend
│   ├── src/
│   │   ├── services/         # Yellow Network integration
│   │   ├── api/              # REST endpoints
│   │   └── websocket/        # Real-time updates
│   └── package.json
│
├── scripts/                   # Deployment & utility scripts
│   └── deploy-contracts.ts
│
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md        # System design
│   ├── API.md                 # API reference
│   └── DEPLOYMENT.md          # Deployment guide
│
├── README.md                  # Main documentation
├── SETUP.md                   # Step-by-step setup
├── quick-start.sh             # Automated setup script
└── package.json               # Root package config
```

---

## 🛠 Technology Stack

### Blockchain Layer

- **Sui Move:** Smart contract language
- **Sui TypeScript SDK:** Blockchain interaction
- **Programmable Transaction Blocks:** Batch execution

### State Channel Layer

- **Yellow Network:** Off-chain settlement
- **@erc7824/nitrolite:** State channel SDK
- **WebSocket:** Real-time communication

### Frontend

- **React 18:** UI framework
- **TypeScript:** Type safety
- **Vite:** Build tool
- **TailwindCSS:** Styling
- **Three.js:** 3D graphics
- **@mysten/dapp-kit:** Sui wallet integration

### Backend

- **Node.js:** Runtime
- **Express:** API server
- **WebSocket:** Real-time updates
- **Pino:** Logging

---

## 🎨 Key Features You'll Implement

### 1. High-Frequency Betting

- Bet on every play, not just final outcome
- Sub-100ms bet execution
- Live odds that update in real-time

### 2. Hybrid Settlement

```
User places bet (0.01 USDC)
    ↓
Yellow Network (instant, off-chain)
    ↓
100s of bets accumulate
    ↓
Event ends
    ↓
Sui PTB settles ALL bets in 1 transaction
    ↓
Winners receive payouts
```

### 3. Unified Balance

- Deposit once
- Bet across multiple events
- Single withdrawal at end

### 4. 3D Visualization (Optional)

- Real-time event rendering
- Interactive odds display
- Immersive experience

---

## 📖 Step-by-Step Implementation Guide

### Step 1: Environment Setup (5 min)

```bash
# Install prerequisites
# - Node.js 18+
# - Sui CLI
# - Git

# Clone and install
git clone <repo>
cd invisible-dex
npm install
```

### Step 2: Sui Wallet Setup (3 min)

```bash
# Create wallet
sui client new-address ed25519

# Get testnet tokens
sui client faucet

# Verify balance
sui client gas
```

### Step 3: Deploy Smart Contracts (5 min)

```bash
cd contracts

# Build
sui move build

# Deploy
sui client publish --gas-budget 100000000

# Save Package ID
```

### Step 4: Configure Yellow Network (5 min)

```bash
# Get API key from Yellow Network
# https://docs.yellow.org

# Update server/.env
YELLOW_WS_ENDPOINT=wss://clearnet.yellow.com/ws
YELLOW_API_KEY=your_key_here
```

### Step 5: Start Development Servers (2 min)

```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

### Step 6: Run and Test Locally (5 min)

Open http://localhost:5173 on your machine and confirm:

1. Wallet connects ✓
2. Test market loads ✓
3. You can place a bet ✓
4. Real-time updates work ✓
5. Settlement flow works ✓

---

## 🧪 Testing Your Build

### Smart Contract Tests

```bash
cd contracts
sui move test

# Expected: All tests pass ✓
```

### Integration Test

```bash
# Run end-to-end test
npm run test:integration

# This tests:
# 1. Contract deployment ✓
# 2. Yellow Network connection ✓
# 3. Bet placement ✓
# 4. Settlement ✓
```

### Manual Testing Checklist

- [ ] Wallet connects successfully
- [ ] Can view available markets
- [ ] Can place a bet (minimum 0.01 USDC)
- [ ] Bet appears instantly in UI
- [ ] Real-time odds update
- [ ] Settlement completes
- [ ] Winnings received

---

## 🚢 Deployment to Testnet

Once everything works locally:

```bash
# 1. Build production bundles
npm run build:all

# 2. Deploy contracts to testnet
cd contracts
sui client switch --env testnet
sui client publish --gas-budget 100000000

# 3. Deploy backend (choose platform)
# - Heroku: heroku create && git push heroku main
# - Railway: railway up
# - VPS: See docs/DEPLOYMENT.md

# 4. Deploy frontend
# - Vercel: vercel --prod
# - Netlify: netlify deploy --prod
```

Detailed guide: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## 📚 Documentation Index

### Essential Reading

- **README.md** (you are here) - Overview and quick start
- **SETUP.md** - Detailed setup instructions
- **docs/ARCHITECTURE.md** - How everything works

### Reference Docs

- **docs/API.md** - API endpoints and WebSocket events
- **docs/DEPLOYMENT.md** - Production deployment guide

### Code Documentation

- Smart contracts have inline comments
- Frontend components are documented with JSDoc
- Backend services have type definitions

---

## 🎓 Learning Resources

### Sui Development

- [Sui Documentation](https://docs.sui.io)
- [Move Language](https://move-language.github.io/move/)
- [Sui TypeScript SDK](https://github.com/MystenLabs/sui/tree/main/sdk/typescript)

### Yellow Network

- [Yellow Docs](https://docs.yellow.org)
- [State Channels Guide](https://docs.yellow.org/state-channels)
- [API Reference](https://docs.yellow.org/api)

### General Web3

- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Sui CLI not found**

```bash
# Solution
curl --proto '=https' --tlsv1.2 -sSf \
  https://raw.githubusercontent.com/MystenLabs/sui/main/scripts/install.sh | sh
export PATH="$HOME/.sui/bin:$PATH"
```

**Issue: Yellow Network connection fails**

```bash
# Check API key
echo $YELLOW_API_KEY

# Verify endpoint
curl -v wss://clearnet.yellow.com/ws
```

**Issue: Contract deployment fails**

```bash
# Check balance
sui client gas

# Request more tokens
sui client faucet

# Increase gas budget
sui client publish --gas-budget 200000000
```

Need more help? See [SETUP.md](./SETUP.md)

---

## 🤝 Contributing

If you later open-source or share this project, see [CONTRIBUTING.md](./CONTRIBUTING.md). While building, you might extend it with: more frontend features (3D, charts), better Yellow integration, contract optimizations, or docs.

---

## 💡 Pro Tips

### Development

- Use the quick-start script - it saves time
- Keep multiple terminal windows open (backend, frontend, logs)
- Use Sui explorer to verify transactions
- Test on testnet before mainnet

### Debugging

- Check browser console for frontend errors
- Check server logs for backend issues
- Use `sui client tx <digest>` to debug transactions
- Yellow Network has good error messages

### Performance

- Batch operations in PTBs
- Use WebSocket for real-time updates
- Cache market data on frontend
- Optimize Three.js rendering

---

## 📊 Build Success

Your build is in good shape when:

- ✅ **Speed:** Bets execute in <100ms
- ✅ **Cost:** Settlement costs <$0.01 for 100 bets
- ✅ **Scale:** Can handle 100+ simultaneous bets
- ✅ **UX:** The hybrid architecture feels seamless
- ✅ **Security:** All settlements verified on-chain

---

## 🎉 Next Steps (Your Build Plan)

With the dev environment ready, you can work through:

**Week 1: Core**

- Finish smart contract deployment
- Implement basic betting UI
- Connect Yellow Network
- Test settlement flow

**Week 2: Enhancement**

- Real-time odds updates
- Position tracking
- Optional 3D visualization
- UI polish

**Week 3: Testing**

- Broader testing
- Optional testnet deploy for your own use
- Refine docs for yourself

**Week 4: Optional**

- Deploy for your own use
- Extend features as you like

---

## 📞 Resources While You Build

**If you need help**

- [GitHub Issues](https://github.com/AkakpoErnest/invisible-dex/issues) – bugs or questions about the codebase

**Sui**

- [Sui Discord](https://discord.gg/sui)
- [Sui Forum](https://forum.sui.io)

**Yellow Network**

- [Yellow Discord](https://discord.gg/yellow)
- [Yellow Telegram](https://t.me/yellow_network)

---

## ⚖️ License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Sui Foundation for the blockchain platform
- Yellow Network for state channel infrastructure
- Cursor AI for development assistance

---

## ⏭️ Start Building

```bash
git clone https://github.com/AkakpoErnest/invisible-dex.git
cd invisible-dex

./quick-start.sh

# or follow the detailed guide
cat SETUP.md

# then code
cursor .  # or: code .
```
