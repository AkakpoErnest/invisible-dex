export type Market = {
  id: string;
  question: string;
  resolved: boolean;
  winningOutcome: number | null;
  poolYes: string;
  poolNo: string;
  eventId?: string;
  description?: string;
  createdAt?: string;
};

export type Bet = {
  id: string;
  marketId: string;
  outcome: number;
  amount: string;
  user: string;
  createdAt: string;
};

export function apiBase(url?: string): string {
  if (!url) return "/api";
  return url.endsWith("/api") ? url : `${url.replace(/\/$/, "")}/api`;
}

export async function listMarkets(apiUrl: string): Promise<{ markets: Market[] }> {
  const res = await fetch(`${apiBase(apiUrl)}/markets`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createMarket(apiUrl: string, question: string): Promise<Market> {
  const res = await fetch(`${apiBase(apiUrl)}/markets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listBets(
  apiUrl: string,
  marketId?: string
): Promise<{ bets: Bet[] }> {
  const qs = marketId ? `?marketId=${encodeURIComponent(marketId)}` : "";
  const res = await fetch(`${apiBase(apiUrl)}/bets${qs}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function placeBet(
  apiUrl: string,
  body: { marketId: string; outcome: number; amount: string; user?: string }
): Promise<unknown> {
  const res = await fetch(`${apiBase(apiUrl)}/bets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
