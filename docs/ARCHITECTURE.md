# Invisible DEX – Architecture

## Overview

Invisible DEX is a **hybrid** prediction market: fast off-chain micro-bets via Yellow Network state channels, with on-chain settlement on Sui using Programmable Transaction Blocks (PTBs).

## Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (React + @mysten/dapp-kit)                        │
│  – Connect wallet, view markets, place bets, see updates    │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP / WebSocket
┌───────────────────────────▼─────────────────────────────────┐
│  Backend (Node.js)                                           │
│  – REST API (markets, bets)                                 │
│  – WebSocket (real-time odds / events)                      │
│  – Yellow Network integration (state channels)              │
└────────────┬──────────────────────────────┬──────────────────┘
             │                              │
             │ PTB / read                   │ Off-chain
             ▼                              ▼
┌────────────────────────┐    ┌────────────────────────────────┐
│  Sui (on-chain)        │    │  Yellow Network                │
│  – Prediction markets  │    │  – Instant micro-bets          │
│  – Positions, resolve  │    │  – Batch settle to Sui         │
│  – Claim winnings      │    │  – 100k+ TPS                   │
└────────────────────────┘    └────────────────────────────────┘
```

## Flow

1. **Create market** – On Sui: `create_and_share_market` (question) → shared `PredictionMarket` object.
2. **Place bet (off-chain)** – User intent → backend/Yellow state channel → instant confirmation in UI.
3. **Accumulate** – Many micro-bets stay off-chain.
4. **Event ends** – Backend/oracle triggers resolution.
5. **Settle (on-chain)** – One PTB settles many bets on Sui; winners claim via `claim`.

## Key components

- **contracts/sources/prediction_market.move** – Sui Move: market creation, `place_bet`, `resolve`, `claim`.
- **server** – Express API, WebSocket, Yellow service stub.
- **frontend** – React, Sui wallet (dapp-kit), market list and bet UI.

## Security

- Settlement is trustless: only Sui state and rules determine payouts.
- Off-chain layer (Yellow) is used for speed; final state is always reflected on-chain after settlement.
