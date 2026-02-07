import { Router } from "express";
import { jsonSuccess } from "../responses.js";

export const positionsRouter = Router();

/** GET /api/v1/positions – user positions (stub; auth would filter by user) */
positionsRouter.get("/", (_req, res) => {
  jsonSuccess(res, {
    positions: [],
    summary: {
      totalPositions: 0,
      totalWagered: "0",
      totalWon: "0",
      totalLost: "0",
      winRate: 0,
      roi: 0,
    },
  });
});

/** POST /api/v1/positions/:positionId/claim – claim winnings (stub) */
positionsRouter.post("/:positionId/claim", (req, res) => {
  jsonSuccess(res, {
    positionId: req.params.positionId,
    payout: "0",
    transactionDigest: null,
    claimedAt: new Date().toISOString(),
  });
});
