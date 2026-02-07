/**
 * Sui wallet state and actions.
 * See docs/ARCHITECTURE.md.
 */

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

export function useSuiWallet() {
  const account = useCurrentAccount();
  const { data: balance } = useSuiClientQuery(
    "getBalance",
    { owner: account?.address ?? "" },
    { enabled: !!account?.address }
  );

  return {
    address: account?.address ?? null,
    isConnected: Boolean(account),
    balance: balance?.totalBalance ?? null,
  };
}
