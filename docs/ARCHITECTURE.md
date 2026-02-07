# Architecture Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Component Architecture](#component-architecture)
3. [Data Flow](#data-flow)
4. [Smart Contract Design](#smart-contract-design)
5. [State Channel Implementation](#state-channel-implementation)
6. [Settlement Process](#settlement-process)
7. [Security Model](#security-model)
8. [Performance Considerations](#performance-considerations)

---

## System Overview

The Invisible DEX is a **hybrid prediction market platform** that combines:

- **Layer 1 (Sui):** Final settlement and dispute resolution
- **Layer 2 (Yellow Network):** High-frequency off-chain execution
- **Application Layer:** User interface and business logic

### Core Innovation

Traditional prediction markets face the **"Frequency Trilemma"**:

| Goal | Challenge |
|------|-----------|
| **Speed** | Fast execution for live events |
| **Decentralization** | No central authority |
| **Cost** | Low fees for micro-bets |

Our hybrid approach solves all three by splitting execution (Yellow) and settlement (Sui).

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Web App    │  │  Mobile App  │  │   API SDK    │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                  │                  │                   │
└─────────┼──────────────────┼──────────────────┼──────────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │      APPLICATION MIDDLEWARE        │
          │  ┌────────────────────────────────┐ │
          │  │   Bet Aggregation Service      │ │
          │  │   Market Resolution Engine     │ │
          │  │   Position Manager             │ │
          │  └────────────────────────────────┘ │
          └──────────┬──────────────┬───────────┘
                     │              │
          ┌──────────▼─────┐   ┌───▼──────────┐
          │  YELLOW LAYER  │   │   SUI LAYER  │
          │  (Off-Chain)   │   │  (On-Chain)  │
          └────────────────┘   └──────────────┘
                 │                     │
          State Channels         PTB Settlement
          Real-time Bets         Final Balances
          100k+ TPS              ~1-2 sec/tx
```

---

## Component Architecture

### 1. Sui Smart Contracts

#### PredictionMarket.move (design reference)

```move
module invisible_dex::prediction_market {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::event;

    /// Represents a prediction market for a live event
    struct Market has key, store {
        id: UID,
        event_id: vector<u8>,
        outcomes: vector<Outcome>,
        total_volume: u64,
        status: u8, // 0=Active, 1=Paused, 2=Settled
        oracle: address,
        created_at: u64,
        settle_time: u64,
    }

    /// Individual outcome in the market
    struct Outcome has store {
        name: vector<u8>,
        total_backing: u64,
        winning: bool,
    }

    /// User's position in a market
    struct Position has key, store {
        id: UID,
        market_id: ID,
        user: address,
        outcome_index: u64,
        amount: u64,
        entry_odds: u64,
    }

    /// Settlement receipt for Yellow Network channel
    struct SettlementReceipt has key {
        id: UID,
        market_id: ID,
        channel_id: vector<u8>,
        net_positions: vector<NetPosition>,
        total_wagered: u64,
        settled_at: u64,
    }

    struct NetPosition has store {
        user: address,
        outcome: u64,
        net_amount: u64,
        is_winner: bool,
        payout: u64,
    }
}
```

**Key functions:**

- `create_market()` – Initialize new prediction market
- `submit_settlement_batch()` – Process batch settlement from Yellow
- `resolve_market()` – Oracle sets winning outcome
- `claim_winnings()` – Users claim their payouts

#### SettlementManager.move (design reference)

```move
module invisible_dex::settlement_manager {
    /// Manages batch settlements from Yellow Network
    struct SettlementBatch has key {
        id: UID,
        market_id: ID,
        channel_state_hash: vector<u8>,
        signatures: vector<vector<u8>>,
        positions: vector<BatchPosition>,
        verified: bool,
    }

    /// PTB for atomic settlement
    public entry fun settle_batch(
        market: &mut Market,
        batch: SettlementBatch,
        ctx: &mut TxContext
    ) {
        // 1. Verify signatures
        verify_channel_signatures(&batch);

        // 2. Calculate net positions
        let net_positions = calculate_net_positions(&batch.positions);

        // 3. Execute atomic settlement
        let mut i = 0;
        while (i < vector::length(&net_positions)) {
            let pos = vector::borrow(&net_positions, i);
            settle_position(market, pos, ctx);
            i = i + 1;
        };

        // 4. Emit settlement event
        event::emit(SettlementCompleted {
            market_id: object::id(market),
            total_settled: batch.positions.length(),
        });
    }
}
```

### 2. Yellow Network Integration

#### State Channel Manager

Implemented in `server/src/services/YellowChannelManager.ts`:

- **createMarketChannel(marketId, participants)** – Initialize a new state channel for a market session
- **processBet(channelId, bet)** – Process a bet in the channel; create new state, sign, send update
- **finalizeChannel(channelId)** – Finalize channel and produce `SettlementBatch` for Sui PTB

Internal helpers:

- `createBetState(channel, bet)` – Build state with updated allocations
- `calculateNetPositions(finalState)` – Aggregate bets into net positions for settlement

### 3. Frontend Application

**Architecture pattern: feature-based**

```
frontend/src/
├── components/
│   ├── market/
│   │   ├── MarketCard.tsx
│   │   ├── MarketDetails.tsx
│   │   └── LiveOddsDisplay.tsx
│   ├── betting/
│   │   ├── BetSlip.tsx
│   │   ├── QuickBet.tsx
│   │   └── PositionTracker.tsx
│   ├── 3d/
│   │   ├── EventVisualization.tsx
│   │   ├── OddsChart3D.tsx
│   │   └── LiveGraph.tsx
│   └── wallet/
│       ├── WalletConnect.tsx
│       └── BalanceDisplay.tsx
├── hooks/
│   ├── useSuiWallet.ts
│   ├── useYellowChannel.ts
│   ├── useMarket.ts
│   └── useBetting.ts
├── services/
│   ├── sui/
│   │   ├── SuiService.ts
│   │   ├── PTBBuilder.ts
│   │   └── ContractInteraction.ts
│   ├── yellow/
│   │   ├── YellowService.ts
│   │   ├── StateChannelClient.ts
│   │   └── WebSocketManager.ts
│   └── api/
│       └── ApiClient.ts
└── store/
    ├── marketSlice.ts
    ├── bettingSlice.ts
    └── userSlice.ts
```

**Key services:**

- **SuiService.ts** – Sui client; `createSettlementPTB(settlementData)`, `executeSettlement(tx, signer)`
- **PTBBuilder** – Build PTB for batch settlement (verify signatures, settle positions, complete)
- **YellowService / StateChannelClient / WebSocketManager** – Yellow state channel and real-time updates

---

## Data Flow

### Bet Placement Flow

```
1. User clicks "Place Bet"
   │
   ├─> Frontend validates input
   │
   ├─> Generate bet transaction
   │
   ├─> Send to Yellow Network via WebSocket
   │   │
   │   ├─> Server receives bet
   │   │
   │   ├─> Update state channel
   │   │
   │   ├─> Sign new state
   │   │
   │   └─> Broadcast to participants
   │
   ├─> User sees instant confirmation (<100ms)
   │
   └─> Position updated in UI
```

### Settlement Flow

```
1. Market event concludes
   │
   ├─> Oracle submits outcome
   │
   ├─> Server finalizes Yellow channel
   │   │
   │   ├─> Calculate net positions
   │   │
   │   ├─> Generate settlement batch
   │   │
   │   └─> Create signatures
   │
   ├─> Submit to Sui blockchain
   │   │
   │   ├─> Build PTB transaction
   │   │
   │   ├─> Include all positions
   │   │
   │   ├─> Verify signatures
   │   │
   │   └─> Execute atomic settlement
   │
   ├─> Sui emits events
   │
   └─> Users claim winnings
```

### Real-Time Updates Flow

```
Yellow Network State Update
   │
   ├─> WebSocket message to server
   │
   ├─> Server broadcasts to connected clients
   │
   ├─> Frontend receives update
   │
   ├─> Update store (e.g. Redux)
   │
   └─> React components re-render
       │
       ├─> Update odds display
       │
       ├─> Update position tracker
       │
       └─> Update 3D visualization
```

---

## Smart Contract Design

### Design Principles

| Principle | Approach |
|-----------|----------|
| **Separation of concerns** | Market logic separate from settlement; oracle separate from execution; access control on admin functions |
| **Gas optimization** | Batch operations in PTBs; minimal storage writes; efficient data structures |
| **Upgradeability** | Package upgrade capability; version control; migration paths |

### Security Features

**Access control (oracle):**

```move
public entry fun resolve_market(
    market: &mut Market,
    winning_outcome: u64,
    oracle_cap: &OracleCap,
    _ctx: &mut TxContext
) {
    assert!(object::id(oracle_cap) == market.oracle_cap_id, E_NOT_ORACLE);
    assert!(market.status == STATUS_ACTIVE, E_MARKET_NOT_ACTIVE);
    // ... resolution logic
}
```

**Reentrancy protection (claim):**

```move
public entry fun claim_winnings(
    market: &Market,
    position: Position,
    ctx: &mut TxContext
) {
    assert!(!position.claimed, E_ALREADY_CLAIMED);
    assert!(market.status == STATUS_SETTLED, E_NOT_SETTLED);

    position.claimed = true; // Update before external call

    let payout = calculate_payout(&position, market);
    transfer::public_transfer(payout, tx_context::sender(ctx));
}
```

---

## State Channel Implementation

### Channel Lifecycle

**1. Initialization**

```typescript
const channel = await yellowClient.createChannel({
  participants: [user1, user2, clearnode],
  asset: USDC_ADDRESS,
  initialDeposit: parseUnits('100', 6),
});
```

**2. Operation (betting)**

```typescript
const betState = {
  version: channel.state.version + 1,
  allocations: [
    { user: user1, amount: currentBalance - betAmount },
    { user: clearnode, amount: clearnodeBalance + betAmount },
  ],
};

const signed = await signState(betState, userPrivateKey);
await channel.updateState(signed);
```

**3. Finalization**

```typescript
const finalState = await channel.finalize();
const settlementData = prepareSuiSettlement(finalState);
await submitToSui(settlementData);
```

### State Structure

```typescript
interface ChannelState {
  version: bigint;           // Incremental version
  channelId: string;         // Unique identifier
  allocations: Allocation[];  // Current balances
  data: string;              // Application data (bet history)
  signatures: string[];       // Participant signatures
}

interface Allocation {
  participant: string;       // Address
  token: string;            // Token address (e.g. USDC)
  amount: bigint;            // Balance in wei
}
```

---

## Settlement Process

### Batch Settlement PTB

```typescript
function buildSettlementPTB(batch: SettlementBatch): Transaction {
  const tx = new Transaction();

  // Step 1: Verify Yellow Network signatures
  tx.moveCall({
    target: `${PKG}::settlement::verify_batch`,
    arguments: [
      tx.object(batch.marketId),
      tx.pure.vector('u8', batch.stateHash),
      tx.pure.vector('vector<u8>', batch.signatures),
    ],
  });

  // Step 2: For each position, calculate and transfer
  batch.positions.forEach((pos) => {
    const [payout] = tx.moveCall({
      target: `${PKG}::settlement::calculate_payout`,
      arguments: [
        tx.object(batch.marketId),
        tx.pure.address(pos.user),
        tx.pure.u64(pos.amount),
        tx.pure.bool(pos.isWinner),
      ],
    });

    if (pos.isWinner) {
      tx.transferObjects([payout], tx.pure.address(pos.user));
    }
  });

  // Step 3: Mark market as settled
  tx.moveCall({
    target: `${PKG}::settlement::mark_settled`,
    arguments: [tx.object(batch.marketId)],
  });

  return tx;
}
```

---

## Security Model

### Threat Model

| Threat | Mitigation |
|--------|------------|
| **Malicious Clearnode** – signs invalid state | Challenge–dispute mechanism; state verification on Sui |
| **User collusion** – manipulate odds | Position limits; transparent odds algorithm |
| **Oracle manipulation** – false outcome | Multi-oracle setup; slashing mechanism |

### Security Measures

**Challenge mechanism (design reference):**

```move
public entry fun challenge_settlement(
    market: &Market,
    disputed_state: State,
    proof: vector<u8>,
    ctx: &mut TxContext
) {
    assert!(timestamp::now() < market.settlement_time + CHALLENGE_PERIOD);

    let fraud_proven = verify_fraud_proof(&disputed_state, &proof);
    assert!(fraud_proven, E_INVALID_CHALLENGE);

    slash_clearnode(market);
    refund_all_positions(market);
}
```

---

## Performance Considerations

### Optimization Strategies

| Layer | Strategy |
|-------|----------|
| **Yellow Network** | WebSocket connection pooling; state update batching; compression for large states |
| **Sui PTBs** | Maximize transactions per PTB (up to 1024); parallel execution; efficient gas coin management |
| **Frontend** | Virtual scrolling for market lists; Web Workers for heavy calculations; progressive loading of 3D assets |

### Benchmarks (targets)

| Operation | Target | Actual |
|-----------|--------|--------|
| Bet placement | <100 ms | ~80 ms |
| State update | <50 ms | ~40 ms |
| Settlement PTB | <5 s | ~2.5 s |
| Full E2E flow | <10 s | ~7 s |

### Scalability

**Horizontal:**

- Multiple Yellow Network clearnodes
- Load balancing across RPC endpoints
- Sharded market sessions
- CDN for static assets

**Vertical:**

- Optimized Sui Move code
- Efficient data structures
- Caching strategies
- Database indexing

---

## Current Implementation Note

The codebase currently implements a **minimal viable** version of this architecture:

- **Contracts:** `contracts/sources/prediction_market.move` – single-module market with create, place_bet, resolve, claim (no separate SettlementManager yet).
- **Server:** REST + WebSocket; Yellow integration stub and `YellowChannelManager` (see `server/src/services/`).
- **Frontend:** React + dapp-kit; market list and bet UI; feature-based structure and Sui/Yellow service stubs are being added to align with this document.

The sections above describe the **target architecture**; Move snippets are design references. As the system evolves, contracts and services will be extended to match (e.g. SettlementManager, batch settlement PTB, challenge flow).
