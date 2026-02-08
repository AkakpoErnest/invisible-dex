import { Router } from "express";
import { marketsStore } from "./store.js";
import { suiService } from "../services/SuiService.js";

export const marketsRouter = Router();

marketsRouter.get("/", async (_req, res) => {
  try {
    const chainMarkets = suiService.isConfigured()
      ? await suiService.listMarketsFromChain(20)
      : [];
    const merged = new Map<string, typeof marketsStore[number]>();

    chainMarkets.forEach((m) => merged.set(m.id, m));
    marketsStore.forEach((m) => {
      if (!merged.has(m.id)) merged.set(m.id, m);
    });

    const list = Array.from(merged.values()).sort((a, b) => {
      const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
      return bTime - aTime;
    });

    res.json({ markets: list });
  } catch {
    res.json({ markets: marketsStore });
  }
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
