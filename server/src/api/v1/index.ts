import { Router } from "express";
import { authRouter } from "./auth.js";
import { marketsV1Router } from "./markets.js";
import { betsV1Router } from "./bets.js";
import { positionsRouter } from "./positions.js";
import { usersRouter } from "./users.js";
import { yellowRouter } from "./yellow.js";

export const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/markets", marketsV1Router);
v1Router.use("/bets", betsV1Router);
v1Router.use("/positions", positionsRouter);
v1Router.use("/users", usersRouter);
v1Router.use("/yellow", yellowRouter);
