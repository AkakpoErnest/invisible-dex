/**
 * Sui client for fetching chain data (real network). Uses PREDICTION_MARKET_PACKAGE when set.
 * Uses fetch to call Sui JSON-RPC so we avoid @mysten/sui subpath export issues in Node.
 */

const network = process.env.SUI_NETWORK ?? "testnet";
const rpcUrl =
  process.env.SUI_RPC_URL ??
  (network === "mainnet"
    ? "https://fullnode.mainnet.sui.io:443"
    : network === "devnet"
      ? "https://fullnode.devnet.sui.io:443"
      : "https://fullnode.testnet.sui.io:443");
const packageId = process.env.PREDICTION_MARKET_PACKAGE ?? "";

async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = (await res.json()) as { result?: T; error?: { message: string } };
  if (json.error) throw new Error(json.error.message);
  return json.result as T;
}

export class SuiService {
  /** Fetch an object by ID (e.g. market or position). */
  async getObject(objectId: string) {
    return rpc("sui_getObject", [
      objectId,
      { showContent: true, showType: true, showOwner: true },
    ]);
  }

  /** Get market object from chain if PREDICTION_MARKET_PACKAGE is set and id is valid. */
  async getMarket(marketId: string) {
    if (!marketId || !marketId.startsWith("0x")) return null;
    try {
      const obj = await this.getObject(marketId) as { data?: { content?: unknown } };
      if (obj?.data && obj.data.content) return obj;
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
