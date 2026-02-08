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
