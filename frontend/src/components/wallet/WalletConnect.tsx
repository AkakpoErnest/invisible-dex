/**
 * Wallet connect button (wraps dapp-kit).
 * See docs/ARCHITECTURE.md.
 */

import { ConnectButton } from "@mysten/dapp-kit";

export function WalletConnect() {
  return <ConnectButton connectText="Connect Wallet" className="text-sm font-semibold tracking-wide" />;
}
