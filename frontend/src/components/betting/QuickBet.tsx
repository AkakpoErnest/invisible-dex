/**
 * Quick bet controls (outcome + amount).
 * See docs/ARCHITECTURE.md.
 */

type Props = {
  onBet: (outcome: number, amount: string) => void;
  loading?: boolean;
};

export function QuickBet({ onBet, loading }: Props) {
  return (
    <div className="flex gap-2 items-center">
      <button
        type="button"
        onClick={() => onBet(0, "0.01")}
        disabled={loading}
        className="rounded bg-slate-600 px-3 py-1 text-sm text-white"
      >
        Yes 0.01
      </button>
      <button
        type="button"
        onClick={() => onBet(1, "0.01")}
        disabled={loading}
        className="rounded bg-slate-600 px-3 py-1 text-sm text-white"
      >
        No 0.01
      </button>
    </div>
  );
}
