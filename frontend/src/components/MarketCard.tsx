import { useState } from "react";
import type { Market } from "../services/api";
import { placeBet } from "../services/api";

type Props = { market: Market };

export function MarketCard({ market }: Props) {
  const [outcome, setOutcome] = useState<0 | 1>(0);
  const [amount, setAmount] = useState("0.01");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleBet = async () => {
    setMessage(null);
    setSubmitting(true);
    const apiUrl = import.meta.env.VITE_API_URL ?? "/api";
    try {
      await placeBet(apiUrl, { marketId: market.id, outcome, amount, user: "user" });
      setMessage("Bet placed.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to place bet");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <li className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
      <h2 className="font-semibold text-slate-100">{market.question}</h2>
      <p className="mt-1 text-sm text-slate-400">
        {market.resolved ? "Resolved" : "Open"} · Yes: {market.poolYes} / No: {market.poolNo}
      </p>
      {!market.resolved && (
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOutcome(0)}
              className={`rounded px-3 py-1 text-sm ${outcome === 0 ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-300"}`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setOutcome(1)}
              className={`rounded px-3 py-1 text-sm ${outcome === 1 ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-300"}`}
            >
              No
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              className="w-24 rounded border border-slate-600 bg-slate-800 px-2 py-1 text-slate-100"
            />
            <button
              type="button"
              onClick={handleBet}
              disabled={submitting}
              className="rounded bg-slate-600 px-3 py-1 text-sm text-white hover:bg-slate-500 disabled:opacity-50"
            >
              {submitting ? "Placing…" : "Place bet"}
            </button>
          </div>
          {message && <p className="text-sm text-slate-400">{message}</p>}
        </div>
      )}
    </li>
  );
}
