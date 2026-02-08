/**
 * GET /api/events – fetch fixtures/matches from SportSRC (no API key).
 * Use these to show "games to bet on" and prefill market questions.
 */
import { Router } from "express";

const SPORTSRC = "https://api.sportsrc.org";
const DEFAULT_LEAGUE = "PL";

type SportSrcMatch = {
  id: string;
  title: string;
  category?: string;
  date?: number;
  teams?: { home?: { name?: string }; away?: { name?: string } };
};

type NormalizedEvent = {
  id: string;
  title: string;
  home: string;
  away: string;
  date: string;
};

export const eventsRouter = Router();

eventsRouter.get("/", async (req, res) => {
  const league = (req.query.league as string) || DEFAULT_LEAGUE;
  try {
    const url = `${SPORTSRC}/?data=matches&category=football&league=${encodeURIComponent(league)}`;
    const r = await fetch(url);
    const data = (await r.json()) as { success?: boolean; data?: SportSrcMatch[] };
    const list = Array.isArray(data?.data) ? data.data : [];

    const events: NormalizedEvent[] = list
      .filter((m) => m?.title && m?.teams?.home?.name && m?.teams?.away?.name)
      .slice(0, 30)
      .map((m) => ({
        id: m.id,
        title: m.title,
        home: m.teams!.home!.name!,
        away: m.teams!.away!.name!,
        date: m.date ? new Date(m.date).toISOString() : "",
      }));

    res.json({ events });
  } catch (e) {
    res.status(502).json({
      error: "Could not fetch events",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
});
