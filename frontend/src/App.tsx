import { MarketsList } from "./components/market/MarketsList";
import { CreateMarketForm } from "./components/market/CreateMarketForm";
import { WalletConnect } from "./components/wallet/WalletConnect";
import { BalanceDisplay } from "./components/wallet/BalanceDisplay";
import { useMarkets } from "./hooks/useMarkets";
import { useSuiWallet } from "./hooks/useSuiWallet";

function App() {
  const { isConnected } = useSuiWallet();
  const { markets, loading, error, refresh, apiUrl } = useMarkets();
  const network = import.meta.env.VITE_SUI_NETWORK ?? "testnet";

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-screen background video */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="/background.mp4"
        />
        <div
          className="absolute inset-0 bg-[var(--bg-0)]/70"
          aria-hidden
        />
      </div>
      <div aria-hidden className="pointer-events-none z-[1] ring-field">
        <span className="ring ring-1" />
        <span className="ring ring-2" />
        <span className="ring ring-3" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 z-[1] h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl orb-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 z-[1] h-64 w-64 rounded-full bg-amber-300/10 blur-3xl orb-drift-slow"
      />

      {!isConnected ? (
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 via-cyan-300 to-amber-300 text-2xl font-semibold text-slate-900">
              ID
            </div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">Invisible DEX</p>
            <p className="mt-2 text-sm text-slate-400">
              High-frequency prediction betting: instant off-chain via Yellow, settled on Sui.
            </p>
            <h1 className="mt-4 font-display text-2xl text-slate-100">Connect your Sui wallet</h1>
            <p className="mt-3 text-sm text-slate-400">
              To create markets and place bets you need:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-300">
              <li>A <strong>Sui wallet</strong> (e.g. Sui Wallet, Ethos)</li>
              <li>Wallet connected to <strong>{network}</strong></li>
              <li><strong>SUI</strong> for gas (use <a href="https://faucet.sui.io" target="_blank" rel="noopener noreferrer" className="text-emerald-300 underline hover:text-emerald-200">faucet.sui.io</a> for testnet SUI)</li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Sui is required. Yellow off-chain execution is optional.
            </p>
            <div className="mt-8">
              <WalletConnect />
            </div>
          </div>
        </div>
      ) : (
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 pb-16 pt-8 lg:px-10">
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
              Built to make high-frequency prediction betting possible: instant off-chain micro-bets via Yellow Network and atomic on-chain settlement on Sui, so you get speed and finality without the complexity.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-300">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                API: {apiUrl}
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Network: {network}
              </div>
            </div>
            <a
              href="#create"
              className="glow-pill inline-block rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-amber-300 px-5 py-2 text-sm font-semibold text-slate-900 shadow-[0_18px_30px_rgba(11,24,32,0.4)] transition hover:brightness-110"
            >
              Create prediction market
            </a>
          </div>

          <div className="glass-panel flex h-full flex-col justify-between rounded-3xl p-6 reveal-up reveal-up-delay-2">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">Create</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-100">New prediction market</h3>
              <p className="mt-3 text-sm text-slate-400">
                Enter a question below. Markets are created via the API; no need to load or refresh a list first.
              </p>
            </div>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">API</span>
                <span className="text-slate-200 truncate max-w-[180px]" title={apiUrl}>{apiUrl}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Wallet network</span>
                <span className="text-slate-200">{network}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="create" className="mt-14">
          <h2 className="font-display text-3xl text-slate-100">Create a new prediction market</h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your market question and create it. You can then bet on it or view it in the list below.
          </p>
          <div className="mt-6">
            <CreateMarketForm
              apiUrl={apiUrl}
              onCreated={() => void refresh()}
            />
          </div>
        </section>

        <section id="markets" className="mt-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-2xl text-slate-100">Existing markets</h2>
              <p className="text-sm text-slate-400">
                Optional: load and view markets to bet on.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={loading}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-300/40 hover:bg-white/10 disabled:opacity-50"
            >
              {loading ? "Loading…" : "View markets"}
            </button>
          </div>
          <div className="mt-6">
            <MarketsList markets={markets} loading={loading} error={error} />
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-6 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>Invisible DEX • {network} • {apiUrl}</span>
            <span>Create prediction markets above to get started.</span>
          </div>
        </footer>
      </div>
      )}
    </div>
  );
}

export default App;
