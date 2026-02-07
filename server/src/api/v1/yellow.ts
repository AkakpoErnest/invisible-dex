import { Router } from "express";
import { jsonSuccess, jsonError } from "../responses.js";

export const yellowRouter = Router();

const channels: Record<string, { marketId: string; balance: string; participants: string[]; allocations: Array<{ participant: string; amount: string }>; lastUpdate: string }> = {};

/** POST /api/v1/yellow/channels */
yellowRouter.post("/channels", (req, res) => {
  const { marketId, initialDeposit } = req.body ?? {};
  if (!marketId || !initialDeposit) {
    return jsonError(res, "INVALID_REQUEST", "marketId and initialDeposit required", 400);
  }
  const channelId = `0x${Buffer.from(`channel-${marketId}-${Date.now()}`).toString("hex").slice(0, 40)}`;
  channels[channelId] = {
    marketId,
    balance: String(initialDeposit),
    participants: [],
    allocations: [],
    lastUpdate: new Date().toISOString(),
  };
  jsonSuccess(res, { channelId, participants: [], balance: String(initialDeposit) }, 201);
});

/** GET /api/v1/yellow/channels/:channelId */
yellowRouter.get("/channels/:channelId", (req, res) => {
  const ch = channels[req.params.channelId];
  if (!ch) return jsonError(res, "NOT_FOUND", "Channel not found", 404);
  jsonSuccess(res, {
    channelId: req.params.channelId,
    version: "0",
    balance: ch.balance,
    allocations: ch.allocations,
    lastUpdate: ch.lastUpdate,
  });
});
