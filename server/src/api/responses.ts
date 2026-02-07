/**
 * Standard API response envelope. See docs/API.md.
 */

import type { Response } from "express";

const timestamp = () => new Date().toISOString();

export function jsonSuccess(res: Response, data: unknown, status = 200): Response {
  return res.status(status).json({
    success: true,
    data,
    timestamp: timestamp(),
  });
}

export function jsonError(
  res: Response,
  code: string,
  message: string,
  status = 400,
  details?: Record<string, unknown>
): Response {
  return res.status(status).json({
    success: false,
    error: { code, message, ...(details && { details }) },
    timestamp: timestamp(),
  });
}
