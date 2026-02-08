import { Router } from "express";
import { jsonSuccess, jsonError } from "../responses.js";
import { suiService } from "../../services/SuiService.js";
import { marketsStore } from "../store.js";

export const marketsV1Router = Router();

/** GET /api/v1/markets – list with status, limit, offset, sort, order */
marketsV1Router.get("/", (req, res) => {
  const status = req.query.status as string | undefined;
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const offset = Math.max(0, Number(req.query.offset) || 0);
  let list = [...marketsStore];
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

/** GET /api/v1/markets/:marketId – try Sui chain first when id is 0x and package configured */
marketsV1Router.get("/:marketId", async (req, res) => {
  const marketId = req.params.marketId;
  if (marketId.startsWith("0x") && suiService.isConfigured()) {
    try {
      const chainObj = await suiService.getMarket(marketId);
      if (chainObj?.data && "content" in chainObj.data && chainObj.data.content?.dataType === "moveObject") {
        const fields = (chainObj.data.content as { fields: Record<string, unknown> }).fields as Record<string, unknown>;
        const question = typeof fields.question === "string" ? fields.question : String(fields.question ?? "");
        const resolved = Boolean(fields.resolved);
        const winningOutcome = typeof fields.winning_outcome === "number" ? fields.winning_outcome : null;
        const poolYes = String(fields.pool_yes ?? "0");
        const poolNo = String(fields.pool_no ?? "0");
        return jsonSuccess(res, {
          market: {
            id: marketId,
            eventId: marketId,
            description: question,
            outcomes: [
              { name: "Yes", totalBacking: poolYes, odds: "1.85", winning: winningOutcome === 0 },
              { name: "No", totalBacking: poolNo, odds: "2.10", winning: winningOutcome === 1 },
            ],
            totalVolume: String(Number(poolYes) + Number(poolNo)),
            status: resolved ? "settled" : "active",
            oracle: String(fields.creator ?? "0x0"),
            createdAt: null,
            settleTime: null,
            channelId: "0x0",
            recentBets: [],
            stats: { totalBettors: 0, avgBetSize: "0", largestBet: "0", lastBetTime: null },
          },
        });
      }
    } catch (_e) {
      // Fall through to in-memory
    }
  }
  const m = marketsStore.find((x) => x.id === marketId);
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
      channelId: m.channelId ?? "0x0",
      recentBets: [],
      stats: { totalBettors: 0, avgBetSize: "0", largestBet: "0", lastBetTime: null },
    },
  });
});

/** GET /api/v1/markets/:marketId/settlement */
marketsV1Router.get("/:marketId/settlement", (req, res) => {
  const m = marketsStore.find((x) => x.id === req.params.marketId);
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
  marketsStore.push(market);
  jsonSuccess(
    res,
    { marketId: id, transactionDigest: null, channelId: market.channelId ?? "0x0" },
    201
  );
});
