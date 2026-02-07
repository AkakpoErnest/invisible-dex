/**
 * Yellow Network state channel manager.
 * Creates market channels, processes bets off-chain, finalizes for Sui settlement.
 * See docs/ARCHITECTURE.md – State Channel Implementation.
 *
 * Uses @erc7824/nitrolite when available; otherwise stub implementation.
 */

import type {
  YellowConfig,
  Channel,
  State,
  BetData,
  NetPosition,
  SettlementBatch,
} from "./types.js";

export class YellowChannelManager {
  private activeChannels: Map<string, Channel> = new Map();
  private config: YellowConfig;

  constructor(config: YellowConfig) {
    this.config = config;
  }

  /**
   * Initialize a new state channel for a market session.
   */
  async createMarketChannel(
    marketId: string,
    participants: string[]
  ): Promise<Channel> {
    // Stub: in production use NitroliteClient.createChannel
    const channel: Channel = {
      id: `channel-${marketId}-${Date.now()}`,
      participants,
      state: {
        version: 0n,
        channelId: `channel-${marketId}-${Date.now()}`,
        allocations: participants.map((p) => ({
          participant: p,
          token: "USDC",
          amount: 0n,
        })),
        data: "",
        signatures: [],
      },
    };
    this.activeChannels.set(marketId, channel);
    return channel;
  }

  /**
   * Process a bet in the state channel (update allocations, sign, broadcast).
   */
  async processBet(channelId: string, bet: BetData): Promise<State> {
    const channel = this.activeChannels.get(channelId);
    if (!channel) throw new Error("Channel not found");

    const newState = this.createBetState(channel, bet);
    // Stub: in production – sign and send state update via NitroliteClient
    return newState;
  }

  /**
   * Finalize channel and prepare batch for Sui settlement.
   */
  async finalizeChannel(channelId: string): Promise<SettlementBatch> {
    const channel = this.activeChannels.get(channelId);
    if (!channel) throw new Error("Channel not found");

    const finalState: State = {
      ...channel.state,
      version: channel.state.version,
      channelId: channel.id,
      allocations: [...channel.state.allocations],
    };

    const netPositions = this.calculateNetPositions(finalState);

    const batch: SettlementBatch = {
      marketId: channelId,
      stateHash: [],
      signatures: [],
      positions: netPositions,
    };

    return batch;
  }

  private createBetState(channel: Channel, bet: BetData): State {
    const amount = BigInt(bet.amount);
    const allocations = channel.state.allocations.map((a) => {
      if (a.participant === bet.user) {
        return { ...a, amount: a.amount - amount };
      }
      // Clearnode or pool – stub: single “pool” participant
      if (a.participant.startsWith("0x") && a.participant.length > 40) {
        return { ...a, amount: a.amount + amount };
      }
      return a;
    });

    return {
      version: channel.state.version + 1n,
      channelId: channel.id,
      allocations,
      data: JSON.stringify({ bet }),
    };
  }

  private calculateNetPositions(_finalState: State): NetPosition[] {
    // Stub: aggregate from state.data / history to compute net positions per user
    return [];
  }

  getChannel(marketId: string): Channel | undefined {
    return this.activeChannels.get(marketId);
  }
}
