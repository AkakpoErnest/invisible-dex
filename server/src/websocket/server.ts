import { WebSocketServer } from "ws";
import type { Server } from "http";
import type { Logger } from "pino";
import { isNitroliteConfigured } from "../services/NitroliteIntegration.js";

export function setupWebSocket(httpServer: Server, logger: Logger): void {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws, req) => {
    const url = req.url ?? "";
    logger.info({ url }, "WebSocket client connected");

    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString()) as Record<string, unknown>;
        const type = msg.type as string;

        if (type === "ping") {
          ws.send(JSON.stringify({ type: "pong", ts: Date.now() }));
          return;
        }

        if (type === "auth") {
          const token = msg.token;
          ws.send(JSON.stringify({ type: "auth_ok", token: !!token }));
          return;
        }

        if (type === "subscribe") {
          const channel = msg.channel as string;
          const marketId = msg.marketId as string | undefined;
          const address = msg.address as string | undefined;
          ws.send(
            JSON.stringify({
              type: "subscribed",
              channel,
              ...(marketId && { marketId }),
              ...(address && { address }),
            })
          );
          return;
        }

        if (type === "place_bet") {
          const marketId = msg.marketId as string | undefined;
          const outcomeIndex = msg.outcomeIndex as number | undefined;
          const amount = msg.amount as string | undefined;
          const betId = `bet_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
          ws.send(
            JSON.stringify({
              type: "bet_confirmed",
              betId,
              marketId: marketId ?? null,
              outcomeIndex: outcomeIndex ?? 0,
              amount: amount ?? "0",
              odds: "1.85",
              timestamp: new Date().toISOString(),
              ...(isNitroliteConfigured() && { viaLayer: "yellow" }),
            })
          );
          return;
        }
      } catch {
        // ignore non-JSON or invalid
      }
    });

    ws.on("close", () => {
      logger.info("WebSocket client disconnected");
    });
  });

  /** Broadcast to all connected clients (e.g. odds_update, new_bet, market_settled) */
  (wss as unknown as { broadcast: (data: object) => void }).broadcast = (data: object) => {
    const payload = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === 1) client.send(payload);
    });
  };
}
