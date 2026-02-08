/**
 * Sui client for fetching chain data (real network). Uses PREDICTION_MARKET_PACKAGE when set.
 * Uses fetch to call Sui JSON-RPC so we avoid @mysten/sui subpath export issues in Node.
 */

import type { MarketRecord } from "../api/store.js";

const network = process.env.SUI_NETWORK ?? "testnet";
const rpcUrl =
  process.env.SUI_RPC_URL ??
  (network === "mainnet"
    ? "https://fullnode.mainnet.sui.io:443"
    : network === "devnet"
      ? "https://fullnode.devnet.sui.io:443"
      : "https://fullnode.testnet.sui.io:443");

const packageId = process.env.PREDICTION_MARKET_PACKAGE ?? "";
const coinType = process.env.SUI_COIN_TYPE ?? "0x2::sui::SUI";

type SuiEvent = {
  id: { txDigest: string; eventSeq: string };
  type: string;
  parsedJson?: Record<string, unknown>;
  timestampMs?: string;
};

type SuiEventPage = {
  data: SuiEvent[];
  nextCursor: { txDigest: string; eventSeq: string } | null;
  hasNextPage: boolean;
};

type SuiMoveObject = {
  data?: {
    content?: {
      dataType?: string;
      fields?: Record<string, unknown>;
    };
  };
};

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
      const obj = (await this.getObject(marketId)) as SuiMoveObject;
      if (obj?.data && obj.data.content) return obj;
      return null;
    } catch {
      return null;
    }
  }

  async listMarketsFromChain(limit = 20): Promise<MarketRecord[]> {
    if (!packageId) return [];
    const events = await this.queryMarketCreatedEvents(limit);
    const marketIds = Array.from(
      new Set(
        events
          .map((event) => extractId(event.parsedJson?.market_id))
          .filter((id): id is string => Boolean(id))
      )
    );

    const markets = await Promise.all(
      marketIds.map(async (marketId) => {
        const obj = await this.getMarket(marketId);
        const content = obj?.data?.content;
        if (!content || content.dataType !== "moveObject" || !content.fields) return null;

        const fields = content.fields;
        const question = decodeMoveString(fields.question);
        const resolved = toBoolean(fields.resolved);
        const poolYes = extractBalance(fields.pool_yes);
        const poolNo = extractBalance(fields.pool_no);
        const winning = toNumber(fields.winning_outcome);

        const event = events.find((e) => extractId(e.parsedJson?.market_id) === marketId);
        const createdAt = event?.timestampMs
          ? new Date(Number(event.timestampMs)).toISOString()
          : null;

        const market: MarketRecord = {
          id: marketId,
          question,
          resolved,
          winningOutcome: resolved ? winning : null,
          poolYes,
          poolNo,
          ...(createdAt ? { createdAt } : {}),
        };

        return market;
      })
    );

    return markets.filter((m): m is MarketRecord => Boolean(m));
  }

  getPackageId(): string {
    return packageId;
  }

  isConfigured(): boolean {
    return Boolean(packageId);
  }

  private async queryMarketCreatedEvents(limit: number): Promise<SuiEvent[]> {
    const eventType = `${packageId}::prediction_market::MarketCreated<${coinType}>`;
    try {
      const page = await rpc<SuiEventPage>("suix_queryEvents", [
        { MoveEventType: eventType },
        null,
        limit,
        true,
      ]);
      return page?.data ?? [];
    } catch {
      return [];
    }
  }
}

export const suiService = new SuiService();

function extractId(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value) {
    const id = (value as { id?: string }).id;
    if (typeof id === "string") return id;
  }
  return null;
}

function decodeMoveString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "object" && value && "bytes" in value) {
    const bytes = (value as { bytes?: string }).bytes;
    if (typeof bytes === "string") {
      const hex = bytes.startsWith("0x") ? bytes.slice(2) : bytes;
      try {
        return Buffer.from(hex, "hex").toString("utf8");
      } catch {
        return "";
      }
    }
  }
  return String(value ?? "");
}

function extractBalance(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object" && value && "value" in value) {
    const inner = (value as { value?: string | number }).value;
    if (typeof inner === "string" || typeof inner === "number") return String(inner);
  }
  return "0";
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  if (typeof value === "number") return value !== 0;
  return false;
}
