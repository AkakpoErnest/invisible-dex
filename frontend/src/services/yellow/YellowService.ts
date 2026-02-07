/**
 * Yellow Network service – state channel and real-time updates.
 * See docs/ARCHITECTURE.md – Frontend Application.
 */

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:3001";

export function getYellowWsUrl(): string {
  return WS_URL;
}

export async function openChannel(_marketId: string): Promise<{ channelId: string }> {
  return { channelId: `stub-${Date.now()}` };
}

export async function sendBet(
  _channelId: string,
  _outcome: number,
  _amount: string
): Promise<{ success: boolean }> {
  return { success: true };
}
