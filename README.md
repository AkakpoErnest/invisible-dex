# 🚀 Invisible DEX

## Welcome

This repo is a **build guide and codebase** for **The Invisible DEX** — a hybrid prediction market (Sui + Yellow Network) for fast, low-cost betting on live events.

**This README is an overview and index only.** Step-by-step instructions (setup, usage, APIs, deployment) live in the linked docs (SETUP.md, USER_GUIDE.md, docs/). Do not add full instructions here.

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

## 🎯 Quick Start

- **Automated:** Run the setup script — see [SETUP.md](./SETUP.md).
- **Manual:** Full setup steps are in [SETUP.md](./SETUP.md).
- **Using the app (testnet):** [USER_GUIDE.md](./USER_GUIDE.md).
- **Deploy on Vercel:** [docs/DEPLOY_VERCEL.md](docs/DEPLOY_VERCEL.md).
- **APIs and keys:** [docs/HOW_TO_GET_SUI_RPC.md](docs/HOW_TO_GET_SUI_RPC.md), [docs/HOW_TO_GET_SEPOLIA_RPC.md](docs/HOW_TO_GET_SEPOLIA_RPC.md), [docs/HOW_TO_GET_YELLOW_API.md](docs/HOW_TO_GET_YELLOW_API.md), [docs/HOW_TO_GET_BACKEND_API.md](docs/HOW_TO_GET_BACKEND_API.md).

All step-by-step instructions live in those docs, not in this README.

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

## 📖 Where to Find Instructions

- **Setup, env, contracts, Yellow:** [SETUP.md](./SETUP.md)
- **Run and use the app (testnet):** [USER_GUIDE.md](./USER_GUIDE.md)
- **Testing:** See [SETUP.md](./SETUP.md) and `npm run test:integration`
- **Deployment:** [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md); **Vercel:** [docs/DEPLOY_VERCEL.md](./docs/DEPLOY_VERCEL.md)

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

See [SETUP.md](./SETUP.md) and [USER_GUIDE.md](./USER_GUIDE.md). For APIs and keys, use the [docs/HOW_TO_GET_*](docs/) guides.

---

## 🤝 Contributing

If you later open-source or share this project, see [CONTRIBUTING.md](./CONTRIBUTING.md). While building, you might extend it with: more frontend features (3D, charts), better Yellow integration, contract optimizations, or docs.

---

## 💡 Pro Tips

- Use [SETUP.md](./SETUP.md) and [USER_GUIDE.md](./USER_GUIDE.md) for all how-to steps.
- Test on testnet before mainnet. Use browser console and server logs for debugging.

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

Clone the repo, then follow [SETUP.md](./SETUP.md) or [USER_GUIDE.md](./USER_GUIDE.md). Do not rely on this README for step-by-step instructions.
