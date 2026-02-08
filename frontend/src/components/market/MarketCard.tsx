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

        <div className="mt-5 space-y-2 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span>Yes pool: {market.poolYes}</span>
            <span>No pool: {market.poolNo}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-200"
              style={{ width: `${yesPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-slate-500">
            <span>{totalPool > 0 ? `${yesPct}% Yes` : "No liquidity yet"}</span>
            <span>{totalPool > 0 ? `${noPct}% No` : ""}</span>
          </div>
        </div>

        {market.resolved && market.winningOutcome !== null ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
            Winning outcome: {market.winningOutcome === 0 ? "Yes" : "No"}
          </div>
        ) : null}

        {!market.resolved && (
          <div className="mt-5 space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOutcome(0)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  outcome === 0
                    ? "bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/40"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setOutcome(1)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  outcome === 1
                    ? "bg-rose-400/20 text-rose-200 ring-1 ring-rose-300/40"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                No
              </button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-300/20"
              />
              <button
                type="button"
                onClick={handleBet}
                disabled={submitting || !isAmountValid}
                className="glow-pill w-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow-[0_18px_30px_rgba(11,24,32,0.4)] transition hover:brightness-110 disabled:opacity-50"
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
