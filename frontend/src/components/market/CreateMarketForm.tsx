import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { createMarket } from "../../services/api";
import { useSuiWallet } from "../../hooks/useSuiWallet";

type Props = {
  apiUrl: string;
  onCreated: () => void;
};

export function CreateMarketForm({ apiUrl, onCreated }: Props) {
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { isConnected } = useSuiWallet();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const packageId =
    import.meta.env.VITE_PREDICTION_MARKET_PACKAGE ??
    import.meta.env.VITE_SUI_PACKAGE_ID ??
    "";
  const coinType = "0x2::sui::SUI";
  const onChainEnabled = Boolean(packageId) && isConnected;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    if (!q) {
      setError("Enter a question for the prediction market.");
      return;
    }
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      if (onChainEnabled) {
        const tx = new Transaction();
        tx.moveCall({
          target: `${packageId}::prediction_market::create_and_share_market`,
          typeArguments: [coinType],
          arguments: [tx.pure.string(q)],
        });

        const txJson = await tx.toJSON();
        const result = await signAndExecute({ transaction: txJson });
        const receipt = await suiClient.waitForTransaction({
          digest: result.digest,
          options: { showEvents: true },
        });

        const events: Array<{ type?: string; parsedJson?: unknown }> =
          receipt.events ?? [];
        const marketId = events
          ?.map((event) => {
            if (!event?.type?.includes("prediction_market::MarketCreated")) return null;
            const raw = (event.parsedJson as { market_id?: unknown })?.market_id;
            if (typeof raw === "string") return raw;
            if (typeof raw === "object" && raw && "id" in raw) {
              const id = (raw as { id?: string }).id;
              return typeof id === "string" ? id : null;
            }
            return null;
          })
          .find((id) => Boolean(id));

        setSuccess(
          marketId
            ? `Market created on-chain (${marketId.slice(0, 6)}…${marketId.slice(-4)}).`
            : "Market created on-chain."
        );
      } else {
        await createMarket(apiUrl, q);
        setSuccess("Market created via API.");
      }
      setQuestion("");
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create market");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel rounded-3xl border border-white/10 p-6"
    >
      <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/70">
        Create prediction market
      </p>
      <p className="mt-2 text-sm text-slate-400">
        Add a yes/no question. Markets are created on Sui when your wallet is connected.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="sr-only">Question</span>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Will Team A win the match?"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-300/50 focus:outline-none focus:ring-1 focus:ring-emerald-300/30"
            disabled={submitting}
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition hover:brightness-110 disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create market"}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-amber-200/90" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-3 text-sm text-emerald-200/90" role="status">
          {success}
        </p>
      )}
    </form>
  );
}
