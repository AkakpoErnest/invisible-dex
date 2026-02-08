/**
 * Sui client for fetching chain data (real network). Uses PREDICTION_MARKET_PACKAGE when set.
 */

import {
  SuiJsonRpcClient,
  getJsonRpcFullnodeUrl,
} from "@mysten/sui/jsonRpc";

const network = (process.env.SUI_NETWORK ?? "testnet") as "mainnet" | "testnet" | "devnet" | "localnet";
const rpcUrl = process.env.SUI_RPC_URL ?? getJsonRpcFullnodeUrl(network);
const packageId = process.env.PREDICTION_MARKET_PACKAGE ?? "";

export class SuiService {
  readonly client: SuiJsonRpcClient;

  constructor() {
    this.client = new SuiJsonRpcClient({ network, url: rpcUrl });
  }

  /** Fetch an object by ID (e.g. market or position). Use for real chain data when env is set. */
  async getObject(objectId: string) {
    const obj = await this.client.getObject({
      id: objectId,
      options: { showContent: true, showType: true, showOwner: true },
    });
    return obj;
  }

  /** Get market object from chain if PREDICTION_MARKET_PACKAGE is set and id is valid. */
  async getMarket(marketId: string) {
    if (!marketId || !marketId.startsWith("0x")) return null;
    try {
      const obj = await this.getObject(marketId);
      if (obj.data && "content" in obj.data) return obj;
      return null;
    } catch {
      return null;
    }
  }

  getPackageId(): string {
    return packageId;
  }

  isConfigured(): boolean {
    return Boolean(packageId);
  }
}

export const suiService = new SuiService();
