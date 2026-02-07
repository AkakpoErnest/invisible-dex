/**
 * Market detail view (outcomes, volume, resolution).
 * See docs/ARCHITECTURE.md.
 */

import type { Market } from "../../services/api";

type Props = { market: Market };

export function MarketDetails({ market }: Props) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
      <h2 className="font-semibold text-slate-100">{market.question}</h2>
      <p className="mt-1 text-sm text-slate-400">
        Status: {market.resolved ? "Settled" : "Active"} · Yes: {market.poolYes} / No: {market.poolNo}
      </p>
    </div>
  );
}
