/**
 * Yellow Network state channel for a market.
 * See docs/ARCHITECTURE.md.
 */

import { useState, useCallback } from "react";
import { openChannel, sendBet } from "../services/yellow/YellowService";

export function useYellowChannel(marketId: string | null) {
  const [channelId, setChannelId] = useState<string | null>(null);

  const connect = useCallback(async () => {
    if (!marketId) return;
    const { channelId: id } = await openChannel(marketId);
    setChannelId(id);
  }, [marketId]);

  const placeBet = useCallback(
    async (outcome: number, amount: string) => {
      if (!channelId) return { success: false };
      return sendBet(channelId, outcome, amount);
    },
    [channelId]
  );

  return { channelId, connect, placeBet };
}
