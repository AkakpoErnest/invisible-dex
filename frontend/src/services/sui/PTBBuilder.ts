/**
 * Build Programmable Transaction Blocks for settlement.
 * See docs/ARCHITECTURE.md – Settlement Process.
 */

import type { SettlementBatch } from "./SuiService";

export function buildSettlementPTB(_batch: SettlementBatch): unknown {
  // Stub: build Transaction with verify_batch, calculate_payout per position, mark_settled
  return null;
}
