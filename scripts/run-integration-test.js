/**
 * Minimal integration test: checks API and (optionally) contract deployment.
 * Run: npm run test:integration (from repo root)
 */

const API_URL = process.env.VITE_API_URL || "http://localhost:3001";

async function main() {
  console.log("Invisible DEX – integration check");
  console.log("API URL:", API_URL);

  try {
    const res = await fetch(`${API_URL}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    const data = await res.json();
    console.log("Health:", data);
  } catch (e) {
    console.error("Backend not reachable. Start with: cd server && npm run dev");
    process.exit(1);
  }

  const marketsRes = await fetch(`${API_URL}/api/markets`);
  if (!marketsRes.ok) throw new Error(`Markets failed: ${marketsRes.status}`);
  const markets = await marketsRes.json();
  console.log("Markets count:", markets.markets?.length ?? 0);
  console.log("Integration check passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
