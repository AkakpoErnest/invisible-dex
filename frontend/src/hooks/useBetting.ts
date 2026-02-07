/**
 * Bet placement and position tracking.
 * See docs/ARCHITECTURE.md.
 */

import { useState, useCallback } from "react";
import { apiClient } from "../services/api/ApiClient";

export function useBetting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeBet = useCallback(
    async (marketId: string, outcome: number, amount: string, user?: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.placeBet({
          marketId,
          outcome,
          amount,
          user,
        });
        return result;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to place bet";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { placeBet, loading, error };
}
