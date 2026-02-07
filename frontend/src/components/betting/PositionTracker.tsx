/**
 * User positions for a market.
 * See docs/ARCHITECTURE.md.
 */

type Position = { outcome: string; amount: string };

type Props = { positions?: Position[] };

export function PositionTracker({ positions = [] }: Props) {
  if (positions.length === 0) return <p className="text-sm text-slate-500">No positions</p>;
  return (
    <ul className="text-sm text-slate-400">
      {positions.map((p, i) => (
        <li key={i}>{p.outcome}: {p.amount}</li>
      ))}
    </ul>
  );
}
