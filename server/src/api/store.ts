/**
 * Single source of truth for markets and bets.
 * Starter markets below give new users something to see and bet on; more are added via API (Create market).
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

export const marketsStore: MarketRecord[] = [
  {
    id: "market-live-1",
    question: "Will BTC be above $100k by end of March 2026?",
    resolved: false,
    winningOutcome: null,
    poolYes: "1250",
    poolNo: "980",
    createdAt: new Date().toISOString(),
  },
  {
    id: "market-live-2",
    question: "Will the next Sui network upgrade ship before April 2026?",
    resolved: false,
    winningOutcome: null,
    poolYes: "420",
    poolNo: "310",
    createdAt: new Date().toISOString(),
  },
  {
    id: "market-live-3",
    question: "Will total TVL on Sui exceed $500M by Q2 2026?",
    resolved: false,
    winningOutcome: null,
    poolYes: "890",
    poolNo: "760",
    createdAt: new Date().toISOString(),
  },
  {
    id: "market-live-4",
    question: "Will ETH spot ETF daily volume exceed $1B in February 2026?",
    resolved: false,
    winningOutcome: null,
    poolYes: "2100",
    poolNo: "1850",
    createdAt: new Date().toISOString(),
  },
];

export const betsStore: BetRecord[] = [];
