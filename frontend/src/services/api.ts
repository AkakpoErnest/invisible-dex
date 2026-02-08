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
  /** Set when the market was mapped from a Polymarket event */
  polymarketSlug?: string;
  polymarketTags?: string[];
};

/* ── Polymarket types ── */

export type PolymarketTag = { id: string; label: string; slug: string };

export type PolymarketMarket = {
  id: string;
  question: string;
  clobTokenIds: string[];
  outcomes: string;
  outcomePrices: string;
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

export type Bet = {
  id: string;
  marketId: string;
  outcome: number;
  amount: string;
  user: string;
  createdAt: string;
};

export type Event = {
  id: string;
  title: string;
  home: string;
  away: string;
  date: string;
};

export function apiBase(url?: string): string {
  if (!url) return "/api";
  return url.endsWith("/api") ? url : `${url.replace(/\/$/, "")}/api`;
}

const BACKEND_NOT_CONNECTED =
  "Backend not connected. Deploy the server (see server/) and set VITE_API_URL to your API URL, then redeploy the frontend.";

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
  const text = await res.text();
  const isHtml =
    res.headers.get("content-type")?.includes("text/html") ||
    text.trimStart().startsWith("<");
  if (isHtml) throw new Error(BACKEND_NOT_CONNECTED);
  if (!res.ok) throw new Error(text || res.statusText);
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text || "Invalid response");
  }
}

export async function listMarkets(apiUrl: string): Promise<{ markets: Market[] }> {
  const res = await fetch(`${apiBase(apiUrl)}/markets`);
  return parseJsonOrThrow<{ markets: Market[] }>(res);
}

export async function listEvents(
  apiUrl: string,
  league?: string
): Promise<{ events: Event[] }> {
  const qs = league ? `?league=${encodeURIComponent(league)}` : "";
  const res = await fetch(`${apiBase(apiUrl)}/events${qs}`);
  return parseJsonOrThrow<{ events: Event[] }>(res);
}

export async function createMarket(apiUrl: string, question: string): Promise<Market> {
  const res = await fetch(`${apiBase(apiUrl)}/markets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return parseJsonOrThrow<Market>(res);
}

export async function listBets(
  apiUrl: string,
  marketId?: string
): Promise<{ bets: Bet[] }> {
  const qs = marketId ? `?marketId=${encodeURIComponent(marketId)}` : "";
  const res = await fetch(`${apiBase(apiUrl)}/bets${qs}`);
  return parseJsonOrThrow<{ bets: Bet[] }>(res);
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
  return parseJsonOrThrow<unknown>(res);
}

/* ── Polymarket API ── */

/**
 * Polymarket requests are proxied to avoid CORS issues:
 * - Dev: Vite proxy  /polymarket-api -> https://gamma-api.polymarket.com
 * - Prod: Vercel rewrite /polymarket-api/* -> https://gamma-api.polymarket.com/*
 */
const POLYMARKET_API = "/polymarket-api";

export async function fetchPolymarketEvents(limit = 5): Promise<PolymarketEvent[]> {
  const res = await fetch(
    `${POLYMARKET_API}/events?active=true&closed=false&limit=${limit}`
  );
  if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`);
  return res.json();
}

/** Convert a Polymarket event into Market objects the UI can render. */
export function polymarketEventToMarkets(event: PolymarketEvent): Market[] {
  return event.markets.map((m) => {
    let prices: string[] = [];
    try { prices = JSON.parse(m.outcomePrices); } catch { /* ignore */ }
    const yesPrice = Number(prices[0] ?? 0);
    const noPrice = Number(prices[1] ?? 0);
    // Express prices as pool-like values (scale to 100 for display)
    const poolYes = String(Math.round(yesPrice * 100));
    const poolNo = String(Math.round(noPrice * 100));

    return {
      id: m.id,
      question: m.question,
      resolved: event.closed,
      winningOutcome: null,
      poolYes,
      poolNo,
      polymarketSlug: event.slug,
      polymarketTags: event.tags.map((t) => t.label),
    };
  });
}
