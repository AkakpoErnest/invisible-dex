/**
 * API client for backend REST endpoints.
 * See docs/ARCHITECTURE.md.
 */

export type Market = {
  id: string;
  question: string;
  resolved: boolean;
  winningOutcome: number | null;
  poolYes: string;
  poolNo: string;
};

const defaultBase = typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "";

function apiBase(base: string): string {
  if (!base) return "/api";
  return base.endsWith("/api") ? base : `${base.replace(/\/$/, "")}/api`;
}

export class ApiClient {
  constructor(private baseUrl: string = defaultBase) {}

  async getMarkets(): Promise<{ markets: Market[] }> {
    const res = await fetch(`${apiBase(this.baseUrl)}/markets`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async createMarket(question: string): Promise<Market> {
    const res = await fetch(`${apiBase(this.baseUrl)}/markets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async placeBet(body: {
    marketId: string;
    outcome: number;
    amount: string;
    user?: string;
  }): Promise<unknown> {
    const res = await fetch(`${apiBase(this.baseUrl)}/bets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}

export const apiClient = new ApiClient();
