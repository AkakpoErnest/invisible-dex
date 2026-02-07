import { useEffect, useState } from "react";
import type { Market } from "../../services/api";
import { listMarkets } from "../../services/api";
import { MarketCard } from "./MarketCard";

export function MarketsList() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL ?? "/api";
    listMarkets(apiUrl)
      .then((data) => setMarkets(data.markets ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load markets"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-400">Loading markets…</p>;
  if (error) return <p className="text-red-400">Error: {error}</p>;
  if (markets.length === 0) return <p className="text-slate-400">No markets yet.</p>;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {markets.map((m) => (
        <MarketCard key={m.id} market={m} />
      ))}
    </ul>
  );
}
