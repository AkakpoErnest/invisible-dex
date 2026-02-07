#!/usr/bin/env bash
# Invisible DEX – Quick start script
# Checks prerequisites, installs deps, and guides through setup.

set -e

echo "🚀 Invisible DEX – Quick Start"
echo "================================"

# Prerequisites
echo ""
echo "📋 Checking prerequisites..."

command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required. Install from https://nodejs.org"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required."; exit 1; }
command -v git >/dev/null 2>&1 || { echo "❌ Git is required."; exit 1; }

NODE_VER=$(node -v | cut -d. -f1 | tr -d 'v')
if [ "$NODE_VER" -lt 18 ]; then
  echo "❌ Node.js 18+ required. Current: $(node -v)"
  exit 1
fi

echo "   Node: $(node -v) ✓"
echo "   npm:  $(npm -v) ✓"
echo "   Git:  $(git --version) ✓"

if ! command -v sui >/dev/null 2>&1; then
  echo ""
  echo "⚠️  Sui CLI not found. Install with:"
  echo "   curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/MystenLabs/sui/main/scripts/install.sh | sh"
  echo "   export PATH=\"\$HOME/.sui/bin:\$PATH\""
  echo ""
  read -p "Continue without Sui CLI? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
else
  echo "   Sui:  $(sui --version 2>/dev/null || echo 'installed') ✓"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm run install:all || npm install

# Env hints
echo ""
echo "📝 Next steps:"
echo "   1. Create server/.env from server/.env.example (Yellow API key, PORT)"
echo "   2. Create frontend/.env with VITE_API_URL, VITE_WS_URL, VITE_SUI_PACKAGE_ID"
echo "   3. Deploy contracts: cd contracts && sui move build && sui client publish --gas-budget 100000000"
echo "   4. Start backend:  cd server && npm run dev"
echo "   5. Start frontend: cd frontend && npm run dev"
echo ""
echo "   Full guide: SETUP.md"
echo "   Done! 🎉"
