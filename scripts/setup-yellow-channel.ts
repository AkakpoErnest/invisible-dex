/**
 * Setup Yellow Network state channel (stub).
 * In production: connect to Yellow, create channel, fund balance, verify status.
 *
 * Usage: npx tsx scripts/setup-yellow-channel.ts
 */

const YELLOW_WS = process.env.YELLOW_WS_ENDPOINT ?? "wss://clearnet.yellow.com/ws";
const YELLOW_API_KEY = process.env.YELLOW_API_KEY;

async function main() {
  console.log("Yellow Network – channel setup");
  console.log("Endpoint:", YELLOW_WS);
  console.log("API Key:", YELLOW_API_KEY ? "(set)" : "(not set)");

  if (!YELLOW_API_KEY) {
    console.warn("YELLOW_API_KEY not set. Get one from https://docs.yellow.org");
    console.log("Skipping channel creation. Server will run with Yellow features disabled.");
    process.exit(0);
  }

  // Stub: in production use @erc7824/nitrolite or Yellow SDK to:
  // 1. Connect to Yellow Network
  // 2. Create state channel
  // 3. Fund initial balance
  // 4. Verify channel status
  console.log("Channel setup is a stub. Implement with Yellow SDK when ready.");
  console.log("See server/src/services/yellow.ts for integration point.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
