/**
 * Live odds display (updates via WebSocket).
 * See docs/ARCHITECTURE.md.
 */

type Props = { yesOdds?: number; noOdds?: number };

export function LiveOddsDisplay({ yesOdds = 0.5, noOdds = 0.5 }: Props) {
  return (
    <div className="text-sm text-slate-400">
      Odds: Yes {yesOdds.toFixed(2)} / No {noOdds.toFixed(2)}
    </div>
  );
}
