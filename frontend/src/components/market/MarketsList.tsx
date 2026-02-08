import type { Market, PolymarketEvent } from "../../services/api";
import { MarketCard } from "./MarketCard";
import { PolymarketCard } from "./PolymarketCard";

type Props = {
  markets: Market[];
  polymarketEvents?: PolymarketEvent[];
  loading: boolean;
  error: string | null;
};

export function MarketsList({ markets, polymarketEvents = [], loading, error }: Props) {
  const hasContent = markets.length > 0 || polymarketEvents.length > 0;

  if (loading && !hasContent) {
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

  if (error && !hasContent) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 p-6 text-slate-200">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-200/70">API error</p>
        <p className="mt-3 text-lg font-semibold">We could not load markets.</p>
        <p className="mt-2 text-sm text-slate-400">Message: {error}</p>
      </div>
    );
  }

  if (!hasContent) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 p-6 text-slate-200">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/70">No markets loaded</p>
        <p className="mt-3 text-lg font-semibold">Markets are loading from Polymarket…</p>
        <p className="mt-2 text-sm text-slate-400">
          Or create a new prediction market in the section above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Polymarket events */}
      {polymarketEvents.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
            Polymarket — Live Events
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {polymarketEvents.map((evt) => (
              <PolymarketCard key={evt.id} event={evt} />
            ))}
          </ul>
        </div>
      )}

      {/* Local markets */}
      {markets.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200/70">
            Your Markets
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {markets.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
