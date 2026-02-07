/**
 * Shared types for Yellow Network state channels and Sui settlement.
 * Aligns with docs/ARCHITECTURE.md.
 */

export interface YellowConfig {
  wsEndpoint: string;
  timeout: number;
  retryAttempts: number;
  apiKey?: string;
}

export interface BetData {
  marketId: string;
  user: string;
  outcome: number;
  amount: string;
  odds?: number;
}

export interface Allocation {
  participant: string;
  token: string;
  amount: bigint;
}

export interface ChannelState {
  version: bigint;
  channelId: string;
  allocations: Allocation[];
  data: string;
  signatures: string[];
}

export interface Channel {
  id: string;
  state: ChannelState;
  participants: string[];
}

export interface State {
  version: bigint;
  channelId: string;
  allocations: Allocation[];
  data?: string;
  hash?: string;
  signatures?: string[];
}

export interface NetPosition {
  user: string;
  outcome: number;
  netAmount: string;
  isWinner: boolean;
  payout: string;
}

export interface BatchPosition {
  user: string;
  outcome: number;
  amount: string;
  isWinner: boolean;
}

export interface SettlementBatch {
  marketId: string;
  stateHash: Uint8Array | number[];
  signatures: Uint8Array[] | number[][];
  positions: NetPosition[];
}
