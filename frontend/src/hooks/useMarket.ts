/**
 * Market data and actions.
 * See docs/ARCHITECTURE.md.
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../services/api/ApiClient";

const api = apiClient;

export function useMarket(marketId: string | null) {
  const { data: markets } = useQuery({
    queryKey: ["markets"],
    queryFn: () => api.getMarkets(),
  });

  const market = marketId
    ? markets?.markets?.find((m) => m.id === marketId)
    : null;

  return { market, markets: markets?.markets ?? [] };
}

export function useMarkets() {
  return useQuery({
    queryKey: ["markets"],
    queryFn: () => api.getMarkets(),
  });
}
