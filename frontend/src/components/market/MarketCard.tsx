import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import type { Market, Bet } from "../../services/api";
import { listBets } from "../../services/api";
import { useSuiWallet } from "../../hooks/useSuiWallet";
import { WalletConnect } from "../wallet/WalletConnect";

type Props = { market: Market };

const PACKAGE_ID =
  import.meta.env.VITE_PREDICTION_MARKET_PACKAGE ?? import.meta.env.VITE_SUI_PACKAGE_ID ?? "";
const COIN_TYPE = "0x2::sui::SUI";

/** Sui object IDs are 0x + 64 hex chars */
function isOnChainMarket(id: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(id);
}

function shortenAddress(addr: string, head = 6, tail = 4): string {
  if (!addr || addr.length <= head + tail) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

export function MarketCard({ market }: Props) {
  const [outcome, setOutcome] = useState<0 | 1>(0);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [betsLoading, setBetsLoading] = useState(false);
  const { address } = useSuiWallet();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const onChainBetEnabled = Boolean(PACKAGE_ID) && isOnChainMarket(market.id);

  const loadBets = useCallback(async () => {
    const apiUrl = import.meta.env.VITE_API_URL ?? "/api";
    setBetsLoading(true);
    try {
      const { bets: list } = await listBets(apiUrl, market.id);
      setBets(list);
    } catch {
      setBets([]);
    } finally {
      setBetsLoading(false);
    }
  }, [market.id]);

  useEffect(() => {
    loadBets();
  }, [loadBets]);

  const yesPool = Number(market.poolYes);
  const noPool = Number(market.poolNo);
  const totalPool =
    Number.isFinite(yesPool) && Number.isFinite(noPool) ? yesPool + noPool : 0;
  const yesPct = totalPool > 0 ? Math.round((yesPool / totalPool) * 100) : 0;
  const noPct = totalPool > 0 ? 100 - yesPct : 0;
  const isAmountValid = amount.trim() !== "" && Number(amount) > 0;

  const handleBet = async () => {
    setMessage(null);
    if (!address) {
      setMessage("Connect your wallet to place a bet.");
      return;
    }
    if (!isAmountValid) {
      setMessage("Enter an amount greater than 0.");
      return;
    }
    if (!onChainBetEnabled) {
      setMessage("This market is API-only. Create a market with your wallet connected to bet on Sui.");
      return;
    }
    setSubmitting(true);
    try {
      const amountMist = BigInt(Math.floor(parseFloat(amount) * 1e9));
      if (amountMist <= 0n) {
        setMessage("Enter an amount greater than 0.");
        setSubmitting(false);
        return;
      }
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [amountMist]);
      tx.moveCall({
        target: `${PACKAGE_ID}::prediction_market::place_bet`,
        typeArguments: [COIN_TYPE],
        arguments: [tx.object(market.id), coin, tx.pure.u8(outcome)],
      });
      const txJson = await tx.toJSON();
      const result = await signAndExecute({ transaction: txJson });
      await suiClient.waitForTransaction({ digest: result.digest });
      setMessage("Bet placed on-chain.");
      setAmount("");
      loadBets();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to place bet");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <li className="card-3d group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(6,12,18,0.35)]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-400/15 blur-2xl transition duration-300 group-hover:bg-amber-300/20" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
              {market.polymarketSlug ? "Polymarket" : "Market"}
            </p>
            <h2 className="mt-3 text-lg font-semibold text-slate-100">{market.question}</h2>
            {market.polymarketTags && market.polymarketTags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {market.polymarketTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
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

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Bets on this market
          </h3>
          {betsLoading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : bets.length === 0 ? (
            <p className="text-sm text-slate-500">No bets yet.</p>
          ) : (
            <ul className="space-y-2 max-h-32 overflow-y-auto">
              {bets.map((bet) => (
                <li
                  key={bet.id}
                  className="flex items-center justify-between gap-2 text-sm text-slate-300"
                >
                  <span className="truncate font-mono text-xs text-slate-400" title={bet.user}>
                    {shortenAddress(bet.user)}
                  </span>
                  <span className={bet.outcome === 0 ? "text-emerald-300" : "text-rose-300"}>
                    {bet.outcome === 0 ? "Yes" : "No"}
                  </span>
                  <span className="tabular-nums text-slate-200">{bet.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!market.resolved && (
          <div className="mt-6">
            <div className="rounded-2xl border border-white/20 bg-slate-900/70 px-5 py-5 shadow-lg backdrop-blur-md">
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-200">
                Place bet
              </h3>
              {!address ? (
                <>
                  <p className="mb-4 text-xs text-slate-400">
                    Connect your wallet when you’re ready to place a bet.
                  </p>
                  <WalletConnect />
                </>
              ) : !onChainBetEnabled ? (
                <p className="text-sm text-slate-400">
                  This market is API-only. Create a new market with your wallet connected to get an on-chain market and place bets on Sui.
                </p>
              ) : (
              <>
              <div className="space-y-4">
                <div>
                  <p className="mb-1.5 text-xs font-medium text-slate-400">Outcome</p>
                  <div className="flex w-full max-w-[200px] rounded-full border border-white/15 bg-white/5 p-1">
                    <button
                      type="button"
                      onClick={() => setOutcome(0)}
                      className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        outcome === 0
                          ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 shadow-md"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setOutcome(1)}
                      className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        outcome === 1
                          ? "bg-gradient-to-r from-rose-400 to-amber-400 text-slate-900 shadow-md"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor={`amount-${market.id}`} className="mb-1.5 block text-xs font-medium text-slate-400">
                    Amount
                  </label>
                  <div className="flex h-11 flex-nowrap items-center gap-3">
                    <input
                      id={`amount-${market.id}`}
                      type="number"
                      min="0"
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="h-11 min-h-0 w-24 shrink-0 rounded-xl border-2 border-white/15 bg-white/10 px-3 text-center text-base font-medium tabular-nums text-slate-100 placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      style={{ fontSize: "16px" }}
                    />
                    <button
                      type="button"
                      onClick={handleBet}
                      disabled={submitting || !isAmountValid}
                      className="h-11 shrink-0 rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {submitting ? "Placing…" : "Place bet"}
                    </button>
                  </div>
                </div>
              </div>
              {message && (
                <p className={`mt-4 text-sm ${message.startsWith("Bet placed") ? "text-emerald-300" : "text-amber-300"}`}>
                  {message}
                </p>
              )}
              </>
              )}
            </div>
          </div>
        )}

        {market.polymarketSlug && (
          <a
            href={`https://polymarket.com/event/${market.polymarketSlug}`}
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
        )}
      </div>
    </li>
  );
}
