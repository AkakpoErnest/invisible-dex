import { useState, useCallback, useRef, useEffect } from "react";
import { MarketsList } from "./components/market/MarketsList";
import { CreateMarketForm } from "./components/market/CreateMarketForm";
import { WalletConnect } from "./components/wallet/WalletConnect";
import { BalanceDisplay } from "./components/wallet/BalanceDisplay";
import { useMarkets } from "./hooks/useMarkets";
import { useSuiWallet } from "./hooks/useSuiWallet";
import { listEvents, type Event } from "./services/api";

function App() {
  useSuiWallet();
  const { markets, polymarkets, loading, polyLoading, error, refresh, refreshPolymarket, apiUrl } = useMarkets();
  const network = import.meta.env.VITE_SUI_NETWORK ?? "testnet";
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [prefillQuestion, setPrefillQuestion] = useState<string | null>(null);
  const [introVisible, setIntroVisible] = useState(true);
  const [introBreaking, setIntroBreaking] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  // Ensure background video plays (required for autoplay in some browsers)
  useEffect(() => {
    const video = bgVideoRef.current;
    if (!video) return;
    const play = () => video.play().catch(() => setVideoFailed(true));
    if (video.readyState >= 2) play();
    else video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, []);

  const loadEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError(null);
    try {
      const { events: list } = await listEvents(apiUrl, "PL");
      setEvents(list ?? []);
    } catch (e) {
      setEventsError(e instanceof Error ? e.message : "Could not load events");
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }, [apiUrl]);

  const createMarketForEvent = (ev: Event) => {
    setPrefillQuestion(`Will ${ev.home} beat ${ev.away}?`);
    document.getElementById("create")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleIntroClick = () => {
    if (!introVisible || introBreaking) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) {
      setIntroVisible(false);
      return;
    }
    setIntroBreaking(true);
    window.setTimeout(() => {
      setIntroVisible(false);
      setShowWelcome(true);
    }, 900);
    // Hide welcome animation after it plays
    window.setTimeout(() => setShowWelcome(false), 3800);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-screen background: video + ring animation + dark overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 isolate bg-[var(--bg-0)]"
        style={{ contain: "strict", transform: "translateZ(0)" }}
      >
        {/* Animated gradient orbs (always visible; stronger when video fails) */}
        <div
          className={`absolute inset-0 bg-orb-animated ${videoFailed ? "opacity-100" : "opacity-70"}`}
          aria-hidden
        />
        {/* Video layer */}
        <video
          ref={bgVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectFit: "cover" }}
          aria-hidden
          onError={() => setVideoFailed(true)}
        >
          <source src="/background-video.mp4" type="video/mp4" />
          <source src="/background-video.mov" type="video/quicktime" />
        </video>
        {/* Ring animations – on top of video so always visible */}
        <div className="bg-ring" aria-hidden />
        <div className="bg-ring-outer" aria-hidden />
        {/* Very dark overlay so text is readable */}
        <div
          className="absolute inset-0 bg-[var(--bg-0)]/99"
          aria-hidden
        />
        {/* Extra ash/dark layer for deeper contrast */}
        <div
          className="absolute inset-0 bg-black/80"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 pb-16 pt-8 lg:px-10">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between reveal-up">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Invisible DEX"
              className="h-16 w-16 rounded-2xl object-contain shadow-[0_12px_30px_rgba(11,24,32,0.35)]"
            />
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

        <section className="mt-14">
          <h2 className="font-display text-2xl text-slate-100">Games to bet on</h2>
          <p className="mt-1 text-sm text-slate-400">
            Load fixtures from the scores API, then create a market for a game.
          </p>
          <button
            type="button"
            onClick={() => void loadEvents()}
            disabled={eventsLoading}
            className="mt-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-300/40 hover:bg-white/10 disabled:opacity-50"
          >
            {eventsLoading ? "Loading…" : "Load games (Premier League)"}
          </button>
          {eventsError && (
            <p className="mt-2 text-sm text-amber-300">{eventsError}</p>
          )}
          {events.length > 0 && (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 12).map((ev) => (
                <li
                  key={ev.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="truncate text-sm text-slate-200">{ev.title}</span>
                  <button
                    type="button"
                    onClick={() => createMarketForEvent(ev)}
                    className="shrink-0 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
                  >
                    Create market
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="create" className="mt-14">
          <h2 className="font-display text-3xl text-slate-100">Create a new prediction market</h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your market question and create it. You can then bet on it or view it in the list below.
          </p>
          <div className="mt-6">
            <CreateMarketForm
              apiUrl={apiUrl}
              onCreated={() => { refresh(); setPrefillQuestion(null); }}
              initialQuestion={prefillQuestion}
            />
          </div>
        </section>

        <section id="markets" className="mt-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-2xl text-slate-100">Prediction Markets</h2>
              <p className="text-sm text-slate-400">
                Live events from Polymarket and your own markets.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void refreshPolymarket()}
                disabled={polyLoading}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-white/10 disabled:opacity-50"
              >
                {polyLoading ? "Loading…" : "Refresh Polymarket"}
              </button>
              <button
                type="button"
                onClick={() => void refresh()}
                disabled={loading}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-300/40 hover:bg-white/10 disabled:opacity-50"
              >
                {loading ? "Loading…" : "View my markets"}
              </button>
            </div>
          </div>
          <div className="mt-6">
            <MarketsList markets={markets} polymarkets={polymarkets} loading={loading || polyLoading} error={error} />
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-6 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>Invisible DEX • {network} • {apiUrl}</span>
            <span>Create prediction markets above to get started.</span>
          </div>
        </footer>
      </div>
      {introVisible && (
        <div
          className={`intro-overlay${introBreaking ? " is-breaking" : ""}`}
          role="presentation"
        >
          <div className="intro-vignette" aria-hidden />
          <button
            type="button"
            className="intro-glass"
            onClick={handleIntroClick}
            disabled={introBreaking}
            aria-label="Enter Invisible DEX"
          >
            <div className="intro-badge">
              <img src="/logo.png" alt="" className="h-full w-full object-contain" />
            </div>
            <p className="intro-kicker">Invisible DEX</p>
            <h2 className="intro-title">Welcome</h2>
            <p className="intro-subtitle">
              High-frequency prediction betting: instant off-chain via Yellow,
              settled on Sui.
            </p>
            <p className="intro-hint">Tap the glass to enter</p>
            <span className="intro-cracks" aria-hidden />
            <span className="intro-shards" aria-hidden>
              <span className="intro-shard shard-1" />
              <span className="intro-shard shard-2" />
              <span className="intro-shard shard-3" />
              <span className="intro-shard shard-4" />
              <span className="intro-shard shard-5" />
              <span className="intro-shard shard-6" />
            </span>
          </button>
        </div>
      )}
      {showWelcome && (
        <div
          className="welcome-animation"
          role="presentation"
          aria-live="polite"
        >
          <div className="welcome-animation-inner">
            <p className="welcome-animation-kicker">Invisible DEX</p>
            <h2 className="welcome-animation-title">Welcome</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
