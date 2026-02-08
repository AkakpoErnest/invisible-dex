import { useCallback, useEffect, useState } from "react";
import type { Market, PolymarketEvent } from "../services/api";
import { apiBase, listMarkets, fetchPolymarketEvents } from "../services/api";

type MarketsState = {
  markets: Market[];
  polymarketEvents: PolymarketEvent[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  apiUrl: string;
  refresh: () => Promise<void>;
  refreshPolymarket: () => Promise<void>;
};

/** Provides apiUrl, optional local markets list, and Polymarket events (auto-loaded). */
export function useMarkets(): MarketsState {
  const apiUrl = apiBase(import.meta.env.VITE_API_URL ?? "/api");
  const [markets, setMarkets] = useState<Market[]>([]);
  const [polymarketEvents, setPolymarketEvents] = useState<PolymarketEvent[]>([]);
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

  const refreshPolymarket = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const events = await fetchPolymarketEvents(5);
      setPolymarketEvents(events);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load Polymarket events");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load Polymarket events on mount
  useEffect(() => {
    refreshPolymarket();
  }, [refreshPolymarket]);

  return { markets, polymarketEvents, loading, error, lastUpdated, apiUrl, refresh, refreshPolymarket };
}
