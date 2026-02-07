/**
 * State channel client for Yellow Network.
 * See docs/ARCHITECTURE.md.
 */

export interface ChannelState {
  version: number;
  channelId: string;
  allocations: Array<{ participant: string; amount: string }>;
}

export async function getChannelState(_channelId: string): Promise<ChannelState | null> {
  return null;
}
