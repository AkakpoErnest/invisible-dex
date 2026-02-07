import express from "express";
import cors from "cors";
import pino from "pino";
import { createServer } from "http";
import { apiRouter } from "./api/routes.js";
import { setupWebSocket } from "./websocket/server.js";

const logger = pino(
  process.env.NODE_ENV === "development"
    ? { transport: { target: "pino-pretty", options: { colorize: true } } }
    : {}
);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "invisible-dex-server" });
});

const port = Number(process.env.PORT) || 3001;
const httpServer = createServer(app);

setupWebSocket(httpServer, logger);

httpServer.listen(port, () => {
  logger.info({ port }, "Server listening");
});
