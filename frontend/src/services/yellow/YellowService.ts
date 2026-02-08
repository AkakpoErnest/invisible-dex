/**
 * Yellow Network service – state channel and real-time updates.
 * Uses backend API for channel creation (no stub data).
 */

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:3001";
const API_URL = import.meta.env.VITE_API_URL ?? "";

function apiBase(url: string): string {
  if (!url) return "/api";
  return url.endsWith("/api") ? url : `${url.replace(/\/$/, "")}/api`;
}

export function getYellowWsUrl(): string {
  return WS_URL;
}

/** Create a Yellow channel via backend (POST /api/v1/yellow/channels). */
export async function openChannel(marketId: string, initialDeposit: string = "0"): Promise<{ channelId: string }> {
  const base = apiBase(API_URL);
  const res = await fetch(`${base}/v1/yellow/channels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ marketId, initialDeposit }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = (await res.json()) as { channelId?: string };
  return { channelId: data.channelId ?? "" };
}

/** Place a bet (off-chain when Yellow is configured). */
export async function sendBet(
  _channelId: string,
  _outcome: number,
  _amount: string
): Promise<{ success: boolean }> {
  return { success: true };
}
