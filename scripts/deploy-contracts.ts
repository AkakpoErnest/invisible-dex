/**
 * Deploy Invisible DEX Move package to the active Sui network.
 * Prereqs: sui client configured, contracts built (sui move build).
 *
 * Usage: npx tsx scripts/deploy-contracts.ts
 * Or from repo root: cd contracts && sui client publish --gas-budget 100000000
 */

import { execSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const contractsDir = join(root, "contracts");

console.log("Deploying Invisible DEX contracts from", contractsDir);
console.log("Ensure you have run: cd contracts && sui move build");
console.log("");

try {
  const out = execSync("sui client publish --gas-budget 100000000", {
    cwd: contractsDir,
    encoding: "utf-8",
  });
  console.log(out);
  console.log("Done. Copy the Package ID from the output and set VITE_SUI_PACKAGE_ID in frontend/.env");
} catch (e: unknown) {
  const err = e as { stdout?: string; stderr?: string };
  console.error(err?.stdout ?? err?.stderr ?? e);
  process.exit(1);
}
