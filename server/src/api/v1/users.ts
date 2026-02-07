import { Router } from "express";
import { jsonSuccess, jsonError } from "../responses.js";

export const usersRouter = Router();

/** GET /api/v1/users/:address/stats */
usersRouter.get("/:address/stats", (req, res) => {
  const { address } = req.params;
  jsonSuccess(res, {
    address,
    stats: {
      totalBets: 0,
      totalWagered: "0",
      totalWon: "0",
      totalLost: "0",
      winRate: 0,
      roi: 0,
      avgBetSize: "0",
      largestWin: "0",
      longestWinStreak: 0,
      favoriteMarkets: [],
    },
    joined: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  });
});
