import { Router } from "express";
import { marketsStore } from "./store.js";

export const marketsRouter = Router();

marketsRouter.get("/", (_req, res) => {
  res.json({ markets: marketsStore });
});

marketsRouter.get("/:id", (req, res) => {
  const m = marketsStore.find((x) => x.id === req.params.id);
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
  marketsStore.push(market);
  res.status(201).json(market);
});
