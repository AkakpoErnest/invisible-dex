#!/usr/bin/env node
/**
 * Test Yellow Network WebSocket connection.
 * Usage: node scripts/test-yellow.js
 * Set YELLOW_WS_ENDPOINT and YELLOW_API_KEY in env (or .env in server/).
 */

const endpoint = process.env.YELLOW_WS_ENDPOINT || "wss://clearnet.yellow.com/ws";
const apiKey = process.env.YELLOW_API_KEY;

console.log("Testing Yellow Network connection...");
console.log("Endpoint:", endpoint);
console.log("API Key:", apiKey ? "(set)" : "(not set)");

function testWithNativeWS() {
  return new Promise((resolve, reject) => {
    const WebSocket = require("ws");
    const ws = new WebSocket(endpoint, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    });

    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error("Connection timeout (5s)"));
    }, 5000);

    ws.on("open", () => {
      clearTimeout(timeout);
      console.log("✅ Connected to Yellow Network (WebSocket open)");
      ws.close();
      resolve();
    });

    ws.on("error", (err) => {
      clearTimeout(timeout);
      console.error("❌ Connection failed:", err.message);
      reject(err);
    });

    ws.on("close", (code, reason) => {
      if (code !== 1000) console.log("Closed:", code, reason?.toString());
    });
  });
}

testWithNativeWS()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
