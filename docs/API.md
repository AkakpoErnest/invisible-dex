# Invisible DEX – API Reference

Base URL: `http://localhost:3001` (dev) or your deployed backend.

## REST

### Health

- **GET /health**  
  Returns `{ status: "ok", service: "invisible-dex-server" }`.

### Markets

- **GET /api/markets**  
  Returns `{ markets: Market[] }`.  
  Each market: `id`, `question`, `resolved`, `winningOutcome`, `poolYes`, `poolNo`.

- **GET /api/markets/:id**  
  Returns a single market or 404.

- **POST /api/markets**  
  Body: `{ question: string }`.  
  Creates a market; returns the created market.

### Bets

- **GET /api/bets**  
  Query: `?marketId=<id>` (optional).  
  Returns `{ bets: Bet[] }`.

- **POST /api/bets**  
  Body: `{ marketId: string, outcome: 0 | 1, amount: string, user?: string }`.  
  Creates a bet; returns the created bet.

## WebSocket

- **Path:** `/ws`
- **Messages:**
  - Client → server: `{ type: "ping" }`
  - Server → client: `{ type: "pong", ts: number }`

Future: server will broadcast `bet_placed`, `market_resolved` for real-time UI updates.
