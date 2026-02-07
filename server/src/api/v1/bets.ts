import { Router } from "express";
import { jsonSuccess, jsonError } from "../responses.js";

export const betsV1Router = Router();

const bets: Array<{
  id: string;
  marketId: string;
  outcome: number;
  amount: string;
  user: string;
  odds: string;
  createdAt: string;
}> = [];

/** POST /api/v1/bets – place bet (body: marketId, outcomeIndex, amount, maxOdds?) */
betsV1Router.post("/", (req, res) => {
  const { marketId, outcomeIndex, amount, maxOdds } = req.body ?? {};
  if (marketId == null || outcomeIndex == null || !amount) {
    return jsonError(res, "INVALID_REQUEST", "marketId, outcomeIndex, and amount required", 400);
  }
  const outcome = Number(outcomeIndex);
  if (outcome !== 0 && outcome !== 1) {
    return jsonError(res, "INVALID_REQUEST", "outcomeIndex must be 0 or 1", 400);
  }
  const id = `bet_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const odds = "1.85";
  const amt = String(amount);
  const potentialPayout = String(Math.floor(Number(amt) * 1.85));
  const bet = {
    id,
    marketId,
    outcome,
    amount: amt,
    odds,
    potentialPayout,
    channelState: "0x0",
    timestamp: new Date().toISOString(),
    user: (req as unknown as { user?: { address?: string } }).user?.address ?? "anonymous",
  };
  bets.push({
    id,
    marketId,
    outcome,
    amount: amt,
    user: bet.user,
    odds,
    createdAt: bet.timestamp,
  });
  jsonSuccess(res, bet, 201);
});
