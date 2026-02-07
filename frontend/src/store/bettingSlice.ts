/**
 * Betting state (for Redux or similar).
 * See docs/ARCHITECTURE.md. Currently unused; add Redux when needed.
 */

export type BettingState = {
  slip: Array<{ marketId: string; outcome: number; amount: string }>;
  positions: Array<{ marketId: string; outcome: string; amount: string }>;
};

export const initialBettingState: BettingState = {
  slip: [],
  positions: [],
};
