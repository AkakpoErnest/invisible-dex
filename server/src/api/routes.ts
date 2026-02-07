import { Router } from "express";
import { marketsRouter } from "./markets.js";
import { betsRouter } from "./bets.js";
import { v1Router } from "./v1/index.js";

export const apiRouter = Router();

apiRouter.use("/v1", v1Router);
apiRouter.use("/markets", marketsRouter);
apiRouter.use("/bets", betsRouter);

apiRouter.get("/", (_req, res) => {
  res.json({
    name: "Invisible DEX API",
    version: "0.1.0",
    endpoints: ["/v1", "/markets", "/bets", "/health"],
  });
});
