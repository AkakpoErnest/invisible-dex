/**
 * WebSocket manager for real-time Yellow state updates.
 * See docs/ARCHITECTURE.md – Real-Time Updates Flow.
 */

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:3001";

export function createRealtimeConnection(
  onMessage: (data: unknown) => void
): () => void {
  try {
    const ws = new WebSocket(`${WS_URL}/ws`);
    ws.onmessage = (e) => {
      try {
        onMessage(JSON.parse(e.data));
      } catch {
        onMessage(e.data);
      }
    };
    return () => ws.close();
  } catch {
    return () => {};
  }
}
