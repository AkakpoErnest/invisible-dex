import { WebSocketServer } from "ws";
import type { Server } from "http";
import type { Logger } from "pino";

export function setupWebSocket(httpServer: Server, logger: Logger): void {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws, req) => {
    const url = req.url ?? "";
    logger.info({ url }, "WebSocket client connected");

    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "ping") {
          ws.send(JSON.stringify({ type: "pong", ts: Date.now() }));
        }
      } catch {
        // ignore non-JSON
      }
    });

    ws.on("close", () => {
      logger.info("WebSocket client disconnected");
    });
  });

  /** Broadcast to all connected clients (e.g. new bet, resolution) */
  (wss as unknown as { broadcast: (data: object) => void }).broadcast = (data: object) => {
    const payload = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === 1) client.send(payload);
    });
  };
}
