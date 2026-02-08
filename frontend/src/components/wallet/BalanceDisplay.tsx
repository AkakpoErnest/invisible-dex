/**
 * Display connected wallet balance.
 * See docs/ARCHITECTURE.md.
 */

import { useSuiWallet } from "../../hooks/useSuiWallet";

export function BalanceDisplay() {
  const { address, balance, isConnected } = useSuiWallet();
  if (!isConnected || !address) return null;
  const shortAddress = `${address.slice(0, 6)}…${address.slice(-4)}`;
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
      <span className="h-2 w-2 rounded-full bg-emerald-400" />
      <span className="font-semibold">{shortAddress}</span>
      <span className="text-slate-500">|</span>
      <span className="text-slate-300">{balance ? `${balance} MIST` : "—"}</span>
    </div>
  );
}
