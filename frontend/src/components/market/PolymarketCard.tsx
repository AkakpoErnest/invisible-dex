import type { PolymarketEvent } from "../../services/api";

type Props = { event: PolymarketEvent };

export function PolymarketCard({ event }: Props) {
  const tags = event.tags ?? [];

  return (
    <li className="card-3d group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(6,12,18,0.35)] backdrop-blur">
      {/* glow blob */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl transition duration-500 group-hover:bg-amber-300/30" />

      <div className="relative">
        {/* header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Polymarket</p>
            <h2 className="mt-2 text-lg font-semibold leading-snug text-slate-100">
              {event.title}
            </h2>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
              event.active && !event.closed
                ? "bg-emerald-400/15 text-emerald-200"
                : "bg-white/10 text-slate-300"
            }`}
          >
            {event.active && !event.closed ? "Active" : "Closed"}
          </span>
        </div>

        {/* tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-300"
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}

        {/* sub-markets with odds */}
        <div className="mt-5 space-y-4">
          {event.markets.map((m) => {
            let outcomes: string[] = [];
            let prices: string[] = [];
            try {
              outcomes = JSON.parse(m.outcomes);
            } catch {
              outcomes = ["Yes", "No"];
            }
            try {
              prices = JSON.parse(m.outcomePrices);
            } catch {
              prices = [];
            }

            const yesPct = prices[0] ? Math.round(Number(prices[0]) * 100) : null;
            const noPct = prices[1] ? Math.round(Number(prices[1]) * 100) : null;

            return (
              <div
                key={m.id}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <p className="text-sm font-medium text-slate-200">{m.question}</p>

                {/* odds bar */}
                {yesPct !== null && noPct !== null && (
                  <>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.24em] text-emerald-200">
                          {outcomes[0] ?? "Yes"}
                        </span>
                        <span className="tabular-nums font-semibold text-emerald-300">
                          {yesPct}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums font-semibold text-rose-300">
                          {noPct}%
                        </span>
                        <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.24em] text-rose-200">
                          {outcomes[1] ?? "No"}
                        </span>
                      </div>
                    </div>

                    <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300"
                        style={{ width: `${yesPct}%` }}
                      />
                      <div
                        className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-rose-400 to-rose-300"
                        style={{ width: `${noPct}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* external link */}
        <a
          href={`https://polymarket.com/event/${event.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-cyan-300 transition hover:text-cyan-200"
        >
          View on Polymarket
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
            <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
            <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
          </svg>
        </a>
      </div>
    </li>
  );
}
