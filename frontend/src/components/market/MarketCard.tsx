import { useState } from "react";
import type { Market } from "../../services/api";
import { placeBet } from "../../services/api";
import { useSuiWallet } from "../../hooks/useSuiWallet";

type Props = { market: Market };

export function MarketCard({ market }: Props) {
  const [outcome, setOutcome] = useState<0 | 1>(0);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { address } = useSuiWallet();

  const yesPool = Number(market.poolYes);
  const noPool = Number(market.poolNo);
  const totalPool =
    Number.isFinite(yesPool) && Number.isFinite(noPool) ? yesPool + noPool : 0;
  const yesPct = totalPool > 0 ? Math.round((yesPool / totalPool) * 100) : 0;
  const noPct = totalPool > 0 ? 100 - yesPct : 0;
  const isAmountValid = amount.trim() !== "" && Number(amount) > 0;

  const handleBet = async () => {
    setMessage(null);
    if (!isAmountValid) {
      setMessage("Enter an amount greater than 0.");
      return;
    }
    setSubmitting(true);
    const apiUrl = import.meta.env.VITE_API_URL ?? "/api";
    try {
      await placeBet(apiUrl, { marketId: market.id, outcome, amount, user: address ?? undefined });
      setMessage("Bet placed.");
      setAmount("");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to place bet");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <li className="card-3d group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(6,12,18,0.35)] backdrop-blur">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl transition duration-500 group-hover:bg-amber-300/30" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">Market</p>
            <h2 className="mt-3 text-lg font-semibold text-slate-100">{market.question}</h2>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              market.resolved
                ? "bg-white/10 text-slate-300"
                : "bg-emerald-400/15 text-emerald-200"
            }`}
          >
            {market.resolved ? "Resolved" : "Open"}
          </span>
        </div>

        <div className="mt-5 space-y-3 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.24em] text-emerald-200">
                Yes
              </span>
              <span>{market.poolYes}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.24em] text-rose-200">
                No
              </span>
              <span>{market.poolNo}</span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-emerald-200 to-transparent"
              style={{ width: `${yesPct}%` }}
            />
            <div
              className="h-full rounded-full bg-gradient-to-l from-rose-300 via-rose-200 to-transparent"
              style={{ width: `${noPct}%`, marginTop: "-8px" }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-slate-500">
            <span>{totalPool > 0 ? `${yesPct}%` : "No liquidity yet"}</span>
            <span>{totalPool > 0 ? `${noPct}%` : ""}</span>
          </div>
        </div>

        {market.resolved && market.winningOutcome !== null ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
            Winning outcome: {market.winningOutcome === 0 ? "Yes" : "No"}
          </div>
        ) : null}

        {!market.resolved && (
          <div className="mt-5 space-y-4">
          <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setOutcome(0)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                outcome === 0
                  ? "bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-200 text-slate-900 shadow-[0_12px_20px_rgba(16,37,34,0.35)]"
                  : "text-slate-300 hover:text-slate-100"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setOutcome(1)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                outcome === 1
                  ? "bg-gradient-to-r from-rose-300 via-amber-200 to-rose-200 text-slate-900 shadow-[0_12px_20px_rgba(37,16,24,0.35)]"
                  : "text-slate-300 hover:text-slate-100"
              }`}
            >
              No
            </button>
          </div>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor={`amount-${market.id}`}>
                Bet amount
              </label>
              <input
                id={`amount-${market.id}`}
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="h-10 w-24 shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center text-sm tabular-nums text-slate-100 placeholder:text-slate-500 focus:border-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-300/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={handleBet}
                disabled={submitting || !isAmountValid}
                className="h-10 flex-1 min-w-0 rounded-xl bg-emerald-400/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300 disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitting ? "Placing…" : "Place bet"}
              </button>
            </div>
            {message && <p className="text-sm text-slate-400">{message}</p>}
          </div>
        )}
      </div>
    </li>
  );
}
