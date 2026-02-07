# API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [REST API Endpoints](#rest-api-endpoints)
4. [WebSocket API](#websocket-api)
5. [Smart Contract Interactions](#smart-contract-interactions)
6. [Yellow Network Integration](#yellow-network-integration)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)
9. [SDK Examples](#sdk-examples)

---

## Overview

- **Base URL (production):** `https://api.invisible-dex.io`
- **Base URL (development):** `http://localhost:3001`

### API Versions

| Version | Status   |
|---------|----------|
| v1      | Current (Stable) |

### Response Format

All responses are JSON.

**Success:**

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-31T12:00:00.000Z"
}
```

**Error:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  },
  "timestamp": "2024-01-31T12:00:00.000Z"
}
```

---

## Authentication

### Wallet-Based Authentication

Most protected endpoints require wallet signature authentication.

**Flow:**

1. Request challenge from server
2. Sign challenge with wallet
3. Send signed challenge to server
4. Receive JWT token
5. Use token in subsequent requests: `Authorization: Bearer <token>`

**Example:**

```typescript
// Step 1: Get challenge
const { data } = await axios.post('/api/v1/auth/challenge', {
  address: '0x123...'
});

// Step 2: Sign challenge
const signature = await wallet.signMessage(data.challenge);

// Step 3: Verify and get token
const { data: auth } = await axios.post('/api/v1/auth/verify', {
  address: '0x123...',
  signature,
  challenge: data.challenge
});

// Step 4: Use token
axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
```

---

## REST API Endpoints

### Health Check

**GET /health**

Check API health status.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-31T12:00:00.000Z",
  "sui": {
    "connected": true,
    "network": "testnet",
    "latency": 45
  },
  "yellow": {
    "connected": true,
    "latency": 32
  },
  "database": {
    "connected": true
  }
}
```

---

### Markets

#### List Markets

**GET /api/v1/markets**

Get list of prediction markets.

**Query parameters:**

| Parameter | Type   | Description                                |
|-----------|--------|--------------------------------------------|
| status    | string | Filter: `active`, `settled`, `cancelled`   |
| limit     | number | Results per page (default 20, max 100)     |
| offset    | number | Pagination offset (default 0)             |
| sort      | string | Sort field: `created_at`, `volume`, `settle_time` |
| order     | string | `asc` or `desc`                            |

**Response:**

```json
{
  "success": true,
  "data": {
    "markets": [
      {
        "id": "0x123...",
        "eventId": "nba-lakers-vs-celtics-2024",
        "description": "Lakers vs Celtics - Q1 Winner",
        "outcomes": [
          {
            "name": "Lakers",
            "totalBacking": "15000000000",
            "odds": "1.85",
            "positionCount": 145
          },
          {
            "name": "Celtics",
            "totalBacking": "12000000000",
            "odds": "2.10",
            "positionCount": 98
          }
        ],
        "totalVolume": "27000000000",
        "status": "active",
        "createdAt": "2024-01-31T10:00:00.000Z",
        "settleTime": null,
        "channelId": "0xabc..."
      }
    ],
    "total": 42,
    "limit": 20,
    "offset": 0
  }
}
```

#### Get Market Details

**GET /api/v1/markets/:marketId**

**Response:**

```json
{
  "success": true,
  "data": {
    "market": {
      "id": "0x123...",
      "eventId": "nba-lakers-vs-celtics-2024",
      "description": "Lakers vs Celtics - Q1 Winner",
      "outcomes": [...],
      "totalVolume": "27000000000",
      "status": "active",
      "oracle": "0xdef...",
      "createdAt": "2024-01-31T10:00:00.000Z",
      "settleTime": null,
      "channelId": "0xabc...",
      "recentBets": [
        {
          "user": "0x456...",
          "outcome": 0,
          "amount": "1000000000",
          "odds": "1.85",
          "timestamp": "2024-01-31T11:30:00.000Z"
        }
      ],
      "stats": {
        "totalBettors": 243,
        "avgBetSize": "500000000",
        "largestBet": "5000000000",
        "lastBetTime": "2024-01-31T11:45:00.000Z"
      }
    }
  }
}
```

#### Create Market (Admin Only)

**POST /api/v1/markets**

**Headers:** `Authorization: Bearer <admin_token>`

**Body:**

```json
{
  "eventId": "nfl-chiefs-vs-49ers-2024-q2",
  "description": "Chiefs vs 49ers - Q2 Winner",
  "outcomes": ["Chiefs", "49ers"],
  "settleTime": "2024-02-11T22:00:00.000Z"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "marketId": "0x789...",
    "transactionDigest": "0xabc...",
    "channelId": "0xdef..."
  }
}
```

---

### Betting

#### Place Bet

**POST /api/v1/bets**

**Headers:** `Authorization: Bearer <user_token>`

**Body:**

```json
{
  "marketId": "0x123...",
  "outcomeIndex": 0,
  "amount": "1000000000",
  "maxOdds": "2.00"
}
```

- `amount`: base units (e.g. MIST for SUI)  
- `maxOdds`: optional slippage protection

**Response:**

```json
{
  "success": true,
  "data": {
    "betId": "bet_123456",
    "marketId": "0x123...",
    "outcome": 0,
    "amount": "1000000000",
    "odds": "1.85",
    "potentialPayout": "1850000000",
    "channelState": "0xabc...",
    "timestamp": "2024-01-31T12:00:00.000Z"
  }
}
```

#### Get User Positions

**GET /api/v1/positions**

**Headers:** `Authorization: Bearer <user_token>`

**Query parameters:** `status` (active, won, lost), `marketId`

**Response:**

```json
{
  "success": true,
  "data": {
    "positions": [
      {
        "id": "0x456...",
        "marketId": "0x123...",
        "marketName": "Lakers vs Celtics - Q1 Winner",
        "outcome": 0,
        "outcomeName": "Lakers",
        "amount": "1000000000",
        "entryOdds": "1.85",
        "currentOdds": "1.92",
        "potentialPayout": "1850000000",
        "unrealizedPnL": "70000000",
        "status": "active",
        "createdAt": "2024-01-31T11:30:00.000Z"
      }
    ],
    "summary": {
      "totalPositions": 12,
      "totalWagered": "15000000000",
      "totalWon": "18500000000",
      "totalLost": "3000000000",
      "winRate": 0.67,
      "roi": 0.15
    }
  }
}
```

---

### Settlement

#### Get Settlement Status

**GET /api/v1/markets/:marketId/settlement**

**Response:**

```json
{
  "success": true,
  "data": {
    "marketId": "0x123...",
    "status": "settled",
    "winningOutcome": 0,
    "totalPaidOut": "45000000000",
    "positionsSettled": 243,
    "settledAt": "2024-01-31T15:00:00.000Z",
    "transactionDigest": "0xabc..."
  }
}
```

#### Claim Winnings

**POST /api/v1/positions/:positionId/claim**

**Headers:** `Authorization: Bearer <user_token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "positionId": "0x456...",
    "payout": "1850000000",
    "transactionDigest": "0xdef...",
    "claimedAt": "2024-01-31T15:30:00.000Z"
  }
}
```

---

### User Profile

#### Get User Stats

**GET /api/v1/users/:address/stats**

**Response:**

```json
{
  "success": true,
  "data": {
    "address": "0x123...",
    "stats": {
      "totalBets": 156,
      "totalWagered": "50000000000",
      "totalWon": "58000000000",
      "totalLost": "15000000000",
      "winRate": 0.65,
      "roi": 0.16,
      "avgBetSize": "320512820",
      "largestWin": "5000000000",
      "longestWinStreak": 8,
      "favoriteMarkets": [
        { "type": "NBA", "count": 45 },
        { "type": "NFL", "count": 32 }
      ]
    },
    "joined": "2024-01-01T00:00:00.000Z",
    "lastActive": "2024-01-31T12:00:00.000Z"
  }
}
```

---

## WebSocket API

**Production:** `wss://api.invisible-dex.io/ws`  
**Development:** `ws://localhost:3001/ws`

### Connection

```typescript
const ws = new WebSocket('ws://localhost:3001/ws');

ws.onopen = () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: 'auth', token: 'your_jwt_token' }));
};
```

### Message Types

#### Subscribe to Market Updates

```typescript
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'market',
  marketId: '0x123...'
}));
```

**Server events:**

- `odds_update` – `{ type: 'odds_update', marketId: '0x123...', outcomes: [...] }`
- `new_bet` – `{ type: 'new_bet', marketId: '0x123...', bet: {...} }`
- `market_settled` – `{ type: 'market_settled', marketId: '0x123...', winner: 0 }`

#### Subscribe to User Updates

```typescript
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'user',
  address: '0x456...'
}));
```

**Server events:** `position_update`, `balance_update`, `payout_received`

#### Real-Time Betting

```typescript
ws.send(JSON.stringify({
  type: 'place_bet',
  marketId: '0x123...',
  outcomeIndex: 0,
  amount: '1000000000'
}));
// Response: { type: 'bet_confirmed', betId: 'bet_123456', ... }
```

---

## Smart Contract Interactions

For direct Sui contract interaction.

### Create Market

```typescript
import { Transaction } from '@mysten/sui/transactions';

const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::prediction_market::create_market`,
  arguments: [
    tx.object(ADMIN_CAP_ID),
    tx.pure.string('nfl-chiefs-vs-49ers-2024'),
    tx.pure.string('Chiefs vs 49ers - Winner'),
    tx.pure.vector('string', ['Chiefs', '49ers']),
    tx.pure.vector('u8', channelId),
    tx.object(CLOCK_ID),
  ],
});
const result = await client.signAndExecuteTransaction({ signer: keypair, transaction: tx });
```

### Settlement PTB

```typescript
tx.moveCall({
  target: `${PACKAGE_ID}::prediction_market::submit_settlement_batch`,
  arguments: [
    tx.object(marketId),
    tx.pure.vector('u8', channelId),
    tx.pure.vector('u8', stateHash),
    tx.pure.vector('address', userAddresses),
    tx.pure.vector('u64', outcomeIndices),
    tx.pure.vector('u64', netAmounts),
    tx.pure.vector('bool', isWinners),
    tx.pure.vector('u64', payouts),
    tx.object(CLOCK_ID),
  ],
});
```

---

## Yellow Network Integration

### Create Channel

**POST /api/v1/yellow/channels**

**Body:**

```json
{
  "marketId": "0x123...",
  "initialDeposit": "10000000000"
}
```

**Response:**

```json
{
  "channelId": "0xabc...",
  "participants": ["0x123...", "0x456..."],
  "balance": "10000000000"
}
```

### Get Channel State

**GET /api/v1/yellow/channels/:channelId**

**Response:**

```json
{
  "channelId": "0xabc...",
  "version": "42",
  "balance": "8500000000",
  "allocations": [
    { "participant": "0x123...", "amount": "7000000000" },
    { "participant": "0x456...", "amount": "1500000000" }
  ],
  "lastUpdate": "2024-01-31T12:30:00.000Z"
}
```

---

## Error Handling

### Error Codes

| Code                 | HTTP | Description                          |
|----------------------|------|--------------------------------------|
| INVALID_REQUEST      | 400  | Malformed request                    |
| UNAUTHORIZED         | 401  | Invalid or missing authentication    |
| FORBIDDEN            | 403  | Insufficient permissions            |
| NOT_FOUND            | 404  | Resource not found                  |
| MARKET_NOT_ACTIVE    | 400  | Market not accepting bets           |
| INSUFFICIENT_BALANCE | 400  | Not enough funds                    |
| BET_TOO_SMALL        | 400  | Bet below minimum                   |
| BET_TOO_LARGE        | 400  | Bet above maximum                   |
| INVALID_ODDS         | 400  | Odds changed beyond slippage        |
| RATE_LIMIT_EXCEEDED  | 429  | Too many requests                   |
| INTERNAL_ERROR       | 500  | Server error                        |
| SERVICE_UNAVAILABLE  | 503  | Service temporarily down            |

### Error Response Example

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Your balance (0.5 SUI) is insufficient for this bet (1.0 SUI)",
    "details": {
      "required": "1000000000",
      "available": "500000000",
      "currency": "SUI"
    }
  },
  "timestamp": "2024-01-31T12:00:00.000Z"
}
```

---

## Rate Limiting

| Tier           | Limit              |
|----------------|--------------------|
| Anonymous      | 10 requests/minute |
| Authenticated  | 100 requests/minute|
| Premium        | 1000 requests/minute|

### Headers

- `X-RateLimit-Limit`: limit
- `X-RateLimit-Remaining`: remaining
- `X-RateLimit-Reset`: Unix timestamp

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again in 45 seconds.",
    "details": {
      "retryAfter": 45,
      "limit": 100,
      "window": "1 minute"
    }
  }
}
```

---

## SDK Examples

### TypeScript/JavaScript

```typescript
import { InvisibleDexClient } from '@invisible-dex/sdk';

const client = new InvisibleDexClient({
  apiUrl: 'https://api.invisible-dex.io',
  network: 'testnet'
});

await client.auth.connect(wallet);

const markets = await client.markets.list({ status: 'active' });

const bet = await client.bets.place({
  marketId: markets[0].id,
  outcomeIndex: 0,
  amount: '1000000000'
});

client.on('odds_update', (data) => {
  console.log('Odds updated:', data);
});
```

---

## Backward Compatibility

The following legacy endpoints remain supported:

- **GET /api/markets** – list markets (plain `{ markets: [...] }`)
- **GET /api/markets/:id** – get market
- **POST /api/markets** – create market (body: `{ question }`)
- **GET /api/bets** – list bets (query: `marketId`)
- **POST /api/bets** – place bet (body: `marketId`, `outcome`, `amount`, `user`)

Prefer **/api/v1/** endpoints for the standard envelope and full feature set.
