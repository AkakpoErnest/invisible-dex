# Vercel env: copy-paste reference

Use this when adding env vars in **Vercel → Settings → Environment Variables**. For each variable: click **Add**, paste the **Key** in the Key field, paste the **Value** in the Value field, then **Add Another** for the next.

Replace `https://your-backend.railway.app` with your real backend URL before pasting.

---

## 1. VITE_API_URL (required)

**Key:**
```
VITE_API_URL
```

**Value:** (replace with your backend URL, no trailing slash)
```
https://your-backend.railway.app
```

---

## 2. VITE_SUI_NETWORK (required)

**Key:**
```
VITE_SUI_NETWORK
```

**Value:**
```
testnet
```
(or `mainnet` if you use mainnet)

---

## 3. VITE_WS_URL (optional; if you use WebSockets)

**Key:**
```
VITE_WS_URL
```

**Value:** (same host as API, use wss in production)
```
wss://your-backend.railway.app
```

---

## 4. VITE_SUI_RPC_URL (optional)

**Key:**
```
VITE_SUI_RPC_URL
```

**Value:**
```
https://fullnode.testnet.sui.io:443
```

---

## 5. VITE_SUI_PACKAGE_ID (optional; for on-chain markets)

**Key:**
```
VITE_SUI_PACKAGE_ID
```

**Value:**
```
0x784407dee9e4e7f2c900f49d253fae91834ce1d903100ef059b6e8e546f1fdf2
```

---

## 6. VITE_PREDICTION_MARKET_PACKAGE (optional; same as above)

**Key:**
```
VITE_PREDICTION_MARKET_PACKAGE
```

**Value:**
```
0x784407dee9e4e7f2c900f49d253fae91834ce1d903100ef059b6e8e546f1fdf2
```

---

## 7. VITE_YELLOW_WS_ENDPOINT (optional)

**Key:**
```
VITE_YELLOW_WS_ENDPOINT
```

**Value:**
```
wss://clearnet.yellow.com/ws
```

---

## 8. VITE_YELLOW_API_KEY (optional; your Yellow key)

**Key:**
```
VITE_YELLOW_API_KEY
```

**Value:** (leave empty or paste your key)
```

```

---

## 9. VITE_ENABLE_3D_GRAPHICS (optional)

**Key:**
```
VITE_ENABLE_3D_GRAPHICS
```

**Value:**
```
true
```

---

## 10. VITE_ENABLE_ANALYTICS (optional)

**Key:**
```
VITE_ENABLE_ANALYTICS
```

**Value:**
```
false
```

---

## 11. VITE_DEBUG_MODE (optional; use false in production)

**Key:**
```
VITE_DEBUG_MODE
```

**Value:**
```
false
```

---

After adding all variables: save, then **Redeploy** the project so the build uses them.
