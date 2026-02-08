import { useCallback, useEffect, useState } from "react";
import type { Market } from "../services/api";
import { apiBase, listMarkets, fetchPolymarketEvents, polymarketEventToMarkets } from "../services/api";

type MarketsState = {
  markets: Market[];
  polymarkets: Market[];
  loading: boolean;
  polyLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  apiUrl: string;
  refresh: () => Promise<void>;
  refreshPolymarket: () => Promise<void>;
};

/** Provides apiUrl, optional local markets, and Polymarket-sourced markets (auto-loaded). */
export function useMarkets(): MarketsState {
  const apiUrl = apiBase(import.meta.env.VITE_API_URL ?? "/api");
  const [markets, setMarkets] = useState<Market[]>([]);
  const [polymarkets, setPolymarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);
  const [polyLoading, setPolyLoading] = useState(false);
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

  const refreshPolymarket = useCallback(async () => {
    setPolyLoading(true);
    setError(null);
    try {
      const events = await fetchPolymarketEvents(5);
      const mapped = events.flatMap(polymarketEventToMarkets);
      setPolymarkets(mapped);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load Polymarket events");
    } finally {
      setPolyLoading(false);
    }
  }, []);

  // Auto-load Polymarket events on mount
  useEffect(() => {
    refreshPolymarket();
  }, [refreshPolymarket]);

  return { markets, polymarkets, loading, polyLoading, error, lastUpdated, apiUrl, refresh, refreshPolymarket };
}
