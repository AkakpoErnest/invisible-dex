import { Router } from "express";
import { betsStore } from "./store.js";

export const betsRouter = Router();

betsRouter.get("/", (req, res) => {
  const marketId = req.query.marketId as string | undefined;
  const list = marketId ? betsStore.filter((b) => b.marketId === marketId) : betsStore;
  res.json({ bets: list });
});

betsRouter.post("/", (req, res) => {
  const { marketId, outcome, amount, user } = req.body ?? {};
  if (!marketId || (outcome !== 0 && outcome !== 1) || !amount) {
    return res.status(400).json({ error: "marketId, outcome (0|1), and amount required" });
  }
  const id = `bet-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const bet = {
    id,
    marketId,
    outcome: Number(outcome),
    amount: String(amount),
    user: user ?? "anonymous",
    createdAt: new Date().toISOString(),
  };
  betsStore.push(bet);
  res.status(201).json(bet);
});
