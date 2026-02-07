import { Router } from "express";

export const betsRouter = Router();

const bets: Array<{
  id: string;
  marketId: string;
  outcome: number;
  amount: string;
  user: string;
  createdAt: string;
}> = [];

betsRouter.get("/", (req, res) => {
  const marketId = req.query.marketId as string | undefined;
  const list = marketId ? bets.filter((b) => b.marketId === marketId) : bets;
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
  bets.push(bet);
  res.status(201).json(bet);
});
