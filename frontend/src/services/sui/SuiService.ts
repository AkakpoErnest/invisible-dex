/**
 * Sui client and PTB execution.
 * See docs/ARCHITECTURE.md – Key Services.
 */

import { getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";

const PACKAGE_ID = import.meta.env.VITE_SUI_PACKAGE_ID ?? "";

export interface SettlementBatch {
  marketId: string;
  stateHash: number[];
  signatures: number[][];
  positions: Array<{
    user: string;
    amount: string;
    isWinner: boolean;
  }>;
}

/**
 * Create PTB for batch settlement (verify signatures, settle positions, complete).
 */
export async function createSettlementPTB(
  _settlementData: SettlementBatch
): Promise<unknown> {
  // Stub: in production use @mysten/sui/transactions Transaction
  // tx.moveCall({ target: `${PACKAGE_ID}::settlement_manager::verify_signatures`, ... });
  // then settle_position for each, then complete_settlement
  if (!PACKAGE_ID) return null;
  return { type: "Transaction", packageId: PACKAGE_ID };
}

/**
 * Execute the settlement PTB with the given signer.
 */
export async function executeSettlement(
  _tx: unknown,
  _signer: unknown
): Promise<string> {
  // Stub: client.signAndExecuteTransaction({ signer, transaction: tx, ... })
  return "";
}

export function getRpcUrl(network: string): string {
  const n = network as "mainnet" | "testnet" | "devnet" | "localnet";
  return getJsonRpcFullnodeUrl(n ?? "testnet");
}
