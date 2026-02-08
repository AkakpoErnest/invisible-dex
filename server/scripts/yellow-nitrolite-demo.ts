/**
 * Yellow Network Prize – Nitrolite SDK demo.
 *
 * This script demonstrates:
 * 1. Use of Yellow SDK / Nitrolite protocol (NitroliteClient + RPC messages).
 * 2. Off-chain transaction logic: instant transfer via state channel (createTransferMessage).
 * 3. Working prototype: connect → auth → off-chain transfer (settlement can be finalized on Sui).
 *
 * Run from server: npx tsx scripts/yellow-nitrolite-demo.ts
 * Or from repo root: npm run demo:yellow
 *
 * Prerequisites: Sepolia wallet with ETH, test tokens from Yellow sandbox faucet.
 * See docs/YELLOW_SDK_SETUP.md and https://docs.yellow.org/docs/learn/getting-started/quickstart
 */

import "dotenv/config";
import {
  NitroliteClient,
  createAuthVerifyMessageFromChallenge,
  createEIP712AuthMessageSigner,
  createECDSAMessageSigner,
  createGetChannelsMessage,
  createGetLedgerBalancesMessage,
  createTransferMessage,
} from "@erc7824/nitrolite";
import { createPublicClient, createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import WebSocket from "ws";

const WS_SANDBOX = "wss://clearnet-sandbox.yellow.com/ws";
const CUSTODY = "0x019B65A265EB3363822f2752141b3dF16131b262" as const;
const ADJUDICATOR = "0x7c7ccbc98469190849BCC6c926307794fDfB11F2" as const;
const YTEST_USD = "ytest.usd";

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}. Set in server/.env or environment.`);
  return v;
}

async function main() {
  console.log("Yellow Network / Nitrolite SDK demo – off-chain transaction\n");

  const privateKey = getEnv("PRIVATE_KEY").startsWith("0x")
    ? (getEnv("PRIVATE_KEY") as `0x${string}`)
    : (`0x${getEnv("PRIVATE_KEY")}` as `0x${string}`);
  const rpcUrl = process.env.ALCHEMY_RPC_URL || "https://1rpc.io/sepolia";

  const account = privateKeyToAccount(privateKey);
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(rpcUrl),
  });
  const walletClient = createWalletClient({
    chain: sepolia,
    transport: http(),
    account,
  });

  const client = new NitroliteClient({
    publicClient,
    walletClient,
    addresses: {
      custody: CUSTODY,
      adjudicator: ADJUDICATOR,
      guestAddress: CUSTODY,
    },
    chainId: sepolia.id,
    challengeDuration: 3600n,
  });

  console.log("✓ NitroliteClient initialized (Sepolia)");
  console.log("  Wallet:", account.address);

  const ws = new WebSocket(WS_SANDBOX);
  await new Promise<void>((resolve, reject) => {
    ws.on("open", () => resolve());
    ws.on("error", reject);
  });
  console.log("✓ WebSocket connected to Yellow sandbox\n");

  const sessionPrivateKey = generatePrivateKey();
  const sessionAccount = privateKeyToAccount(sessionPrivateKey);
  const sessionSigner = createECDSAMessageSigner(sessionPrivateKey);

  const timestamp = Date.now();
  const expiresAtMs = timestamp + 3600 * 1000; // 13-digit Unix ms (required by Yellow)
  const authParams = {
    session_key: sessionAccount.address,
    allowances: [{ asset: YTEST_USD, amount: "1000000000" }],
    expires_at: BigInt(expiresAtMs),
    scope: "test.app",
  };

  // Yellow protocol: params as object, expires_at in milliseconds (13 digits).
  const requestId = Math.floor(Math.random() * 1e15) + 1e14;
  const authParamsObject = {
    address: account.address,
    session_key: sessionAccount.address,
    application: "Test app",
    allowances: [{ asset: YTEST_USD, amount: "1000000000" }],
    scope: "test.app",
    expires_at: expiresAtMs,
  };
  const authRequestMsg = JSON.stringify({
    req: [requestId, "auth_request", authParamsObject, timestamp],
    sig: [""],
  });

  const authPromise = new Promise<void>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Auth timeout (30s) – check network / sandbox status")), 30000);
    const onMessage = (raw: Buffer) => {
      try {
        const str = raw.toString();
        const msg = JSON.parse(str);
        const method = msg.res?.[1] ?? msg.req?.[1] ?? msg.error?.message ?? "unknown";
        if (process.env.DEBUG_YELLOW) console.log("  [Yellow]", method, str.slice(0, 120) + (str.length > 120 ? "…" : ""));
        if (msg.res && msg.res[1] === "auth_verify") {
          clearTimeout(t);
          ws.off("message", onMessage);
          console.log("✓ Authenticated with Yellow (session key + EIP-712)\n");
          resolve();
        }
        if (msg.res && msg.res[1] === "auth_challenge") {
          console.log("  Received auth_challenge, signing with wallet…");
          const result = msg.res[2];
          const challenge = typeof result === "object" && result !== null && "challenge_message" in result
            ? (result as { challenge_message: string }).challenge_message
            : String(result);
          createEIP712AuthMessageSigner(walletClient, authParams, { name: "Test app" })
            .then((signer) => createAuthVerifyMessageFromChallenge(signer, challenge))
            .then((verifyMsg) => {
              ws.send(verifyMsg);
            })
            .catch(reject);
        }
        if (msg.error) reject(new Error(msg.error?.message || JSON.stringify(msg.error) || "RPC error"));
      } catch (e) {
        if (process.env.DEBUG_YELLOW) console.log("  [Yellow] parse err", (e as Error).message);
      }
    };
    ws.on("message", onMessage);
  });

  if (process.env.DEBUG_YELLOW) {
    const parsed = JSON.parse(authRequestMsg) as { req?: unknown };
    console.log("  [Yellow] Sending auth_request req:", JSON.stringify(parsed.req).slice(0, 200) + "…");
  }
  ws.send(authRequestMsg);
  await authPromise;

  const ledgerMsg = await createGetLedgerBalancesMessage(
    sessionSigner,
    account.address,
    Date.now()
  );
  ws.send(ledgerMsg);

  const channelsMsg = await createGetChannelsMessage(sessionSigner, account.address, "open");
  ws.send(channelsMsg);

  const channelsPromise = new Promise<{ channelId?: string }>((resolve) => {
    const t = setTimeout(() => resolve({}), 8000);
    ws.on("message", (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.res && msg.res[1] === "channels") {
          clearTimeout(t);
          const channels = msg.res[2]?.channels ?? [];
          const open = channels.find((c: { status: string }) => c.status === "open");
          resolve(open ? { channelId: open.channel_id } : {});
        }
      } catch {
        // ignore
      }
    });
  });

  const { channelId } = await channelsPromise;

  if (channelId) {
    console.log("✓ Open channel found:", channelId);
    const transferMsg = await createTransferMessage(
      sessionSigner,
      {
        destination: account.address,
        allocations: [{ asset: YTEST_USD, amount: "1" }],
      },
      undefined,
      Date.now()
    );
    ws.send(transferMsg);
    console.log("✓ Off-chain transfer sent (1 ytest.usd to self) – instant, no chain tx\n");
  } else {
    console.log("  No open channel yet. Create one on-chain (see Quickstart), then run again.");
    console.log(
      "  Faucet: curl -X POST https://clearnet-sandbox.yellow.com/faucet/requestTokens -H 'Content-Type: application/json' -d '{\"userAddress\":\"" +
        account.address +
        "\"}'\n"
    );
  }

  ws.close();
  console.log("Settlement: final state can be batch-settled on Sui (see contracts and ARCHITECTURE.md).");
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
