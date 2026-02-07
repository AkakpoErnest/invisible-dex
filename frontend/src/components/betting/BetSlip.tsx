/**
 * Bet slip – review and confirm bet.
 * See docs/ARCHITECTURE.md.
 */

type Props = { outcome: string; amount: string; onConfirm?: () => void };

export function BetSlip({ outcome, amount, onConfirm }: Props) {
  return (
    <div className="rounded border border-slate-600 bg-slate-800 p-3">
      <p className="text-slate-300">{outcome} · {amount}</p>
      {onConfirm && (
        <button
          type="button"
          onClick={onConfirm}
          className="mt-2 rounded bg-slate-600 px-3 py-1 text-sm text-white"
        >
          Confirm
        </button>
      )}
    </div>
  );
}
