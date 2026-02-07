/**
 * Yellow Network integration stub.
 * In production: connect to Yellow WS, open state channels, route micro-bets off-chain.
 * See https://docs.yellow.org
 */

const YELLOW_WS = process.env.YELLOW_WS_ENDPOINT ?? "wss://clearnet.yellow.com/ws";
const YELLOW_API_KEY = process.env.YELLOW_API_KEY;

export function isYellowConfigured(): boolean {
  return Boolean(YELLOW_API_KEY);
}

export function getYellowWsEndpoint(): string {
  return YELLOW_WS;
}

/** Placeholder: in production this would submit a micro-bet to Yellow state channel */
export async function placeOffChainBet(
  _marketId: string,
  _outcome: number,
  _amountWei: string,
  _user: string
): Promise<{ success: boolean; txRef?: string }> {
  if (!isYellowConfigured()) {
    return { success: false };
  }
  // TODO: Yellow SDK @erc7824/nitrolite or custom WS protocol
  return { success: true, txRef: `yellow-${Date.now()}` };
}
