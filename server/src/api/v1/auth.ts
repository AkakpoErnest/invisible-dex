import { Router } from "express";
import { jsonSuccess, jsonError } from "../responses.js";

export const authRouter = Router();

/** POST /api/v1/auth/challenge – request challenge for wallet auth */
authRouter.post("/challenge", (req, res) => {
  const { address } = req.body ?? {};
  if (!address || typeof address !== "string") {
    return jsonError(res, "INVALID_REQUEST", "address required", 400);
  }
  const challenge = `invisible-dex-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  jsonSuccess(res, { challenge, address });
});

/** POST /api/v1/auth/verify – verify signature and return JWT (stub token) */
authRouter.post("/verify", (req, res) => {
  const { address, signature, challenge } = req.body ?? {};
  if (!address || !signature || !challenge) {
    return jsonError(res, "INVALID_REQUEST", "address, signature, and challenge required", 400);
  }
  const token = `stub_jwt_${Buffer.from(address).toString("base64url")}`;
  jsonSuccess(res, { token, expiresIn: 86400 });
});
