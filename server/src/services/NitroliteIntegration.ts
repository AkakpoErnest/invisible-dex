/**
 * Yellow Network / Nitrolite SDK integration for the server.
 * Used to satisfy prize requirement: "Use the Yellow SDK / Nitrolite protocol".
 *
 * When PRIVATE_KEY and ALCHEMY_RPC_URL (Sepolia) are set, the app can:
 * - Report yellow.connected in /health
 * - Run off-chain transfers via Nitrolite RPC (see scripts/yellow-nitrolite-demo.ts)
 *
 * Settlement is finalized on Sui via the prediction market contracts (see contracts/ and ARCHITECTURE.md).
 */

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.ALCHEMY_RPC_URL;

export function isNitroliteConfigured(): boolean {
  return Boolean(PRIVATE_KEY && RPC_URL);
}

export function getNitroliteConfig(): { privateKey: string; rpcUrl: string } | null {
  if (!PRIVATE_KEY || !RPC_URL) return null;
  return {
    privateKey: PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`,
    rpcUrl: RPC_URL,
  };
}
