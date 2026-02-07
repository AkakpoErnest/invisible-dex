import { Router } from "express";

export const marketsRouter = Router();

/** In-memory list for dev; replace with DB or chain indexer */
const markets: Array<{
  id: string;
  question: string;
  resolved: boolean;
  winningOutcome: number | null;
  poolYes: string;
  poolNo: string;
}> = [
  {
    id: "test-market-1",
    question: "Will Team A win the match?",
    resolved: false,
    winningOutcome: null,
    poolYes: "0",
    poolNo: "0",
  },
];

marketsRouter.get("/", (_req, res) => {
  res.json({ markets });
});

marketsRouter.get("/:id", (req, res) => {
  const m = markets.find((x) => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: "Market not found" });
  res.json(m);
});

marketsRouter.post("/", (req, res) => {
  const { question } = req.body ?? {};
  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "question required" });
  }
  const id = `market-${Date.now()}`;
  const market = {
    id,
    question,
    resolved: false,
    winningOutcome: null,
    poolYes: "0",
    poolNo: "0",
  };
  markets.push(market);
  res.status(201).json(market);
});
