/**
 * Single source of truth for markets and bets.
 * No seed/mock data – markets and bets come from API creates or chain indexer.
 */

export type MarketRecord = {
  id: string;
  question: string;
  resolved: boolean;
  winningOutcome: number | null;
  poolYes: string;
  poolNo: string;
  eventId?: string;
  description?: string;
  createdAt?: string;
  channelId?: string;
};

export type BetRecord = {
  id: string;
  marketId: string;
  outcome: number;
  amount: string;
  user: string;
  odds?: string;
  createdAt: string;
  channelState?: string;
};

export const marketsStore: MarketRecord[] = [];

export const betsStore: BetRecord[] = [];
