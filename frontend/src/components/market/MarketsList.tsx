import type { Market } from "../../services/api";
import { MarketCard } from "./MarketCard";

type Props = {
  markets: Market[];
  loading: boolean;
  error: string | null;
};

export function MarketsList({ markets, loading, error }: Props) {
  if (loading) {
    return (
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <li
            key={`skeleton-${idx}`}
            className="glass-panel animate-pulse rounded-3xl border border-white/10 p-6"
          >
            <div className="h-3 w-24 rounded-full bg-white/10" />
            <div className="mt-4 h-6 w-full rounded-xl bg-white/10" />
            <div className="mt-6 h-2 w-full rounded-full bg-white/10" />
            <div className="mt-5 h-9 w-32 rounded-full bg-white/10" />
          </li>
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 p-6 text-slate-200">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-200/70">API error</p>
        <p className="mt-3 text-lg font-semibold">We could not load markets.</p>
        <p className="mt-2 text-sm text-slate-400">Message: {error}</p>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 p-6 text-slate-200">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/70">No markets</p>
        <p className="mt-3 text-lg font-semibold">There are no markets yet.</p>
        <p className="mt-2 text-sm text-slate-400">
          Create a market via the API or deploy on-chain markets to populate this list.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {markets.map((m) => (
        <MarketCard key={m.id} market={m} />
      ))}
    </ul>
  );
}
