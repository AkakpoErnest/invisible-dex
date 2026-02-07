/**
 * Market state (for Redux or similar).
 * See docs/ARCHITECTURE.md. Currently unused; add Redux when needed.
 */

export type MarketState = {
  list: Array<{ id: string; question: string; resolved: boolean }>;
  selectedId: string | null;
};

export const initialMarketState: MarketState = {
  list: [],
  selectedId: null,
};
