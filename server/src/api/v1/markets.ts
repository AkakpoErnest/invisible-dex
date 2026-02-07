import { Router } from "express";
import { jsonSuccess, jsonError } from "../responses.js";

export const marketsV1Router = Router();

/** Shared in-memory store (same data as legacy /api/markets for dev) */
const markets: Array<{
  id: string;
  eventId?: string;
  question: string;
  description?: string;
  resolved: boolean;
  winningOutcome: number | null;
  poolYes: string;
  poolNo: string;
  createdAt?: string;
  channelId?: string;
}> = [
  {
    id: "test-market-1",
    eventId: "test-match-1",
    question: "Will Team A win the match?",
    description: "Will Team A win the match?",
    resolved: false,
    winningOutcome: null,
    poolYes: "0",
    poolNo: "0",
    createdAt: new Date().toISOString(),
    channelId: "0x0",
  },
];

/** GET /api/v1/markets – list with status, limit, offset, sort, order */
marketsV1Router.get("/", (req, res) => {
  const status = req.query.status as string | undefined;
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const offset = Math.max(0, Number(req.query.offset) || 0);
  let list = [...markets];
  if (status === "active") list = list.filter((m) => !m.resolved);
  if (status === "settled") list = list.filter((m) => m.resolved);
  const total = list.length;
  const page = list.slice(offset, offset + limit).map((m) => ({
    id: m.id,
    eventId: m.eventId ?? m.id,
    description: m.description ?? m.question,
    outcomes: [
      { name: "Yes", totalBacking: m.poolYes, odds: "1.85", positionCount: 0 },
      { name: "No", totalBacking: m.poolNo, odds: "2.10", positionCount: 0 },
    ],
    totalVolume: String(Number(m.poolYes) + Number(m.poolNo)),
    status: m.resolved ? "settled" : "active",
    createdAt: m.createdAt ?? new Date().toISOString(),
    settleTime: null,
    channelId: m.channelId ?? "0x0",
  }));
  jsonSuccess(res, { markets: page, total, limit, offset });
});

/** GET /api/v1/markets/:marketId */
marketsV1Router.get("/:marketId", (req, res) => {
  const m = markets.find((x) => x.id === req.params.marketId);
  if (!m) return jsonError(res, "NOT_FOUND", "Market not found", 404);
  jsonSuccess(res, {
    market: {
      id: m.id,
      eventId: m.eventId ?? m.id,
      description: m.description ?? m.question,
      outcomes: [
        { name: "Yes", totalBacking: m.poolYes, odds: "1.85", winning: m.winningOutcome === 0 },
        { name: "No", totalBacking: m.poolNo, odds: "2.10", winning: m.winningOutcome === 1 },
      ],
      totalVolume: String(Number(m.poolYes) + Number(m.poolNo)),
      status: m.resolved ? "settled" : "active",
      oracle: "0x0",
      createdAt: m.createdAt,
      settleTime: null,
      channelId: m.channelId,
      recentBets: [],
      stats: { totalBettors: 0, avgBetSize: "0", largestBet: "0", lastBetTime: null },
    },
  });
});

/** GET /api/v1/markets/:marketId/settlement */
marketsV1Router.get("/:marketId/settlement", (req, res) => {
  const m = markets.find((x) => x.id === req.params.marketId);
  if (!m) return jsonError(res, "NOT_FOUND", "Market not found", 404);
  jsonSuccess(res, {
    marketId: m.id,
    status: m.resolved ? "settled" : "pending",
    winningOutcome: m.winningOutcome ?? null,
    totalPaidOut: "0",
    positionsSettled: 0,
    settledAt: m.resolved ? new Date().toISOString() : null,
    transactionDigest: null,
  });
});

/** POST /api/v1/markets – create (admin stub) */
marketsV1Router.post("/", (req, res) => {
  const { eventId, description, outcomes, settleTime } = req.body ?? {};
  const id = `market-${Date.now()}`;
  const market = {
    id,
    eventId: eventId ?? id,
    question: description ?? "New market",
    description: description ?? "New market",
    resolved: false,
    winningOutcome: null,
    poolYes: "0",
    poolNo: "0",
    createdAt: new Date().toISOString(),
    channelId: "0x0",
  };
  markets.push(market);
  jsonSuccess(
    res,
    { marketId: id, transactionDigest: null, channelId: "0x0" },
    201
  );
});
