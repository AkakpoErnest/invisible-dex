import { MarketsList } from "./components/market/MarketsList";
import { WalletConnect } from "./components/wallet/WalletConnect";
import { BalanceDisplay } from "./components/wallet/BalanceDisplay";
import { useMarkets } from "./hooks/useMarkets";

function App() {
  const { markets, loading, error, refresh, lastUpdated, apiUrl } = useMarkets();
  const totalMarkets = markets.length;
  const openMarkets = markets.filter((m) => !m.resolved).length;
  const resolvedMarkets = totalMarkets - openMarkets;
  const network = import.meta.env.VITE_SUI_NETWORK ?? "testnet";
  const lastUpdatedLabel = lastUpdated
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
        lastUpdated
      )
    : "—";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl orb-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl orb-drift-slow"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-6 pb-16 pt-8 lg:px-10">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between reveal-up">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 via-cyan-300 to-amber-300 text-lg font-semibold text-slate-900 shadow-[0_12px_30px_rgba(11,24,32,0.35)]">
              ID
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">Invisible</p>
              <h1 className="font-display text-2xl text-slate-100">Invisible DEX</h1>
              <p className="text-sm text-slate-400">Off-chain speed, on-chain settlement.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
              Sui network: <span className="text-emerald-200">{network}</span>
            </div>
            <BalanceDisplay />
            <WalletConnect />
          </div>
        </header>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 reveal-up reveal-up-delay-1">
            <h2 className="font-display text-4xl leading-tight text-slate-100 md:text-5xl">
              Real-time prediction markets with a{" "}
              <span className="text-gradient">liquid, invisible edge</span>.
            </h2>
            <p className="max-w-xl text-base text-slate-300">
              Markets, pools, and bets in this interface come directly from your API and on-chain
              state. No mock data is rendered.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-300">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                API: {apiUrl}
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Last updated: {lastUpdatedLabel}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 reveal-up reveal-up-delay-2">
              <a
                href="#markets"
                className="glow-pill rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-amber-300 px-5 py-2 text-sm font-semibold text-slate-900 shadow-[0_18px_30px_rgba(11,24,32,0.4)] transition hover:brightness-110"
              >
                Explore live markets
              </a>
              <button
                type="button"
                onClick={() => void refresh()}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-300/40 hover:bg-white/10"
              >
                Refresh data
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="glass-panel stat-card rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total</p>
                <p className="mt-3 text-2xl font-semibold text-slate-100">{totalMarkets}</p>
              </div>
              <div className="glass-panel stat-card rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Open</p>
                <p className="mt-3 text-2xl font-semibold text-slate-100">{openMarkets}</p>
              </div>
              <div className="glass-panel stat-card rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Resolved</p>
                <p className="mt-3 text-2xl font-semibold text-slate-100">{resolvedMarkets}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel flex h-full flex-col justify-between rounded-3xl p-6 reveal-up reveal-up-delay-2">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">Market pulse</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-100">Live data, no fillers.</h3>
              <p className="mt-3 text-sm text-slate-400">
                The UI only renders what the API returns. If the list is empty, it means the backend
                has no markets yet.
              </p>
            </div>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">API endpoint</span>
                <span className="text-slate-200">{apiUrl}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Last updated</span>
                <span className="text-slate-200">{lastUpdatedLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Wallet network</span>
                <span className="text-slate-200">{network}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              className="mt-6 w-full rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-300/40 hover:bg-white/10"
            >
              Refresh markets
            </button>
          </div>
        </section>

        <section id="markets" className="mt-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-3xl text-slate-100">Live Markets</h2>
              <p className="text-sm text-slate-400">
                Connected directly to your backend and chain state.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-300/40 hover:bg-white/10"
            >
              Refresh list
            </button>
          </div>
          <div className="mt-6">
            <MarketsList markets={markets} loading={loading} error={error} />
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-6 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>Invisible DEX • {network} • {apiUrl}</span>
            <span>Create markets via the API to populate this dashboard.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
