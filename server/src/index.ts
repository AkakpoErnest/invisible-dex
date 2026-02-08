import "dotenv/config";
import express from "express";
import cors from "cors";
import pino from "pino";
import { createServer } from "http";
import { apiRouter } from "./api/routes.js";
import { marketsRouter } from "./api/markets.js";
import { betsRouter } from "./api/bets.js";
import { setupWebSocket } from "./websocket/server.js";
import { isNitroliteConfigured } from "./services/NitroliteIntegration.js";

const logger = pino(
  process.env.NODE_ENV === "development"
    ? { transport: { target: "pino-pretty", options: { colorize: true } } }
    : {}
);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
// Also serve at root so both /api/markets and /markets work (avoids 404 from frontend)
app.use("/markets", marketsRouter);
app.use("/bets", betsRouter);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "invisible-dex-server",
    sui: { connected: true, network: process.env.SUI_NETWORK ?? "testnet", latency: 0 },
    yellow: { connected: Boolean(process.env.YELLOW_API_KEY) || isNitroliteConfigured(), latency: 0 },
    database: { connected: false },
  });
});

const port = Number(process.env.PORT) || 3001;
const httpServer = createServer(app);

setupWebSocket(httpServer, logger);

httpServer.listen(port, () => {
  logger.info({ port }, "Server listening");
});
