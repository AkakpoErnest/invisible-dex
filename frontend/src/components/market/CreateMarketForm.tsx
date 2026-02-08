import { useState } from "react";
import type { Market } from "../../services/api";
import { createMarket } from "../../services/api";

type Props = {
  apiUrl: string;
  onCreated: (market: Market) => void;
};

export function CreateMarketForm({ apiUrl, onCreated }: Props) {
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    if (!q) {
      setError("Enter a question for the prediction market.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const market = await createMarket(apiUrl, q);
      setQuestion("");
      onCreated(market);
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
        Add a yes/no question. Others can bet on the outcome.
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
    </form>
  );
}
