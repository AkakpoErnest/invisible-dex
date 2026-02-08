import { useCallback, useState } from "react";
import type { Market } from "../services/api";
import { apiBase, listMarkets } from "../services/api";

type MarketsState = {
  markets: Market[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  apiUrl: string;
  refresh: () => Promise<void>;
};

/** Provides apiUrl and optional markets list. Does not load markets on mount — user creates new prediction markets; list only when explicitly requested. */
export function useMarkets(): MarketsState {
  const apiUrl = apiBase(import.meta.env.VITE_API_URL ?? "/api");
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMarkets(apiUrl);
      setMarkets(data.markets ?? []);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load markets");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  return { markets, loading, error, lastUpdated, apiUrl, refresh };
}
