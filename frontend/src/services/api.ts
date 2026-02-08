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

/* ── Polymarket types ── */

export type PolymarketTag = {
  id: string;
  label: string;
  slug: string;
};

export type PolymarketMarket = {
  id: string;
  question: string;
  clobTokenIds: string[];
  outcomes: string;          // JSON-encoded string: '["Yes","No"]'
  outcomePrices: string;     // JSON-encoded string: '["0.65","0.35"]'
};

export type PolymarketEvent = {
  id: string;
  slug: string;
  title: string;
  active: boolean;
  closed: boolean;
  tags: PolymarketTag[];
  markets: PolymarketMarket[];
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

/* ── Polymarket API ── */

// In dev the Vite proxy at /polymarket avoids CORS issues.
// In production, set VITE_POLYMARKET_API to your own proxy URL.
const POLYMARKET_API =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_POLYMARKET_API) ||
  "/polymarket";

export async function fetchPolymarketEvents(limit = 5): Promise<PolymarketEvent[]> {
  const res = await fetch(
    `${POLYMARKET_API}/events?active=true&closed=false&limit=${limit}`
  );
  if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`);
  return res.json();
}
