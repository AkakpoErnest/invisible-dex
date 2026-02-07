/**
 * Display connected wallet balance.
 * See docs/ARCHITECTURE.md.
 */

import { useSuiWallet } from "../../hooks/useSuiWallet";

export function BalanceDisplay() {
  const { address, balance, isConnected } = useSuiWallet();
  if (!isConnected || !address) return null;
  return (
    <span className="text-sm text-slate-400">
      {balance ? `${balance} MIST` : "—"}
    </span>
  );
}
