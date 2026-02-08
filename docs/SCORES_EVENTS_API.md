# APIs for scores and events to bet on

This doc lists external APIs you can use to fetch **scores** and **fixtures** (games/events) so users can create prediction markets or place bets on real outcomes. The Invisible DEX server can proxy one of these (see **GET /api/events** below) or you can call them directly with an API key.

---

## 1. SportSRC (free, no API key)

- **Site:** [sportsrc.org](https://www.sportsrc.org/)
- **Base URL:** `https://api.sportsrc.org/`
- **Auth:** None. CORS enabled; ~20 req/s per IP.
- **Use in this app:** The server exposes **GET /api/events** which proxies SportSRC (see below). Optional query: `?league=PL` (Premier League), `?league=CL` (Champions League), etc.

**Example – list leagues:**
```bash
curl "https://api.sportsrc.org/?data=results&category=leagues"
```

**Example – matches for a league (football):**
```bash
curl "https://api.sportsrc.org/?data=matches&category=football&league=PL"
```

Response includes `id`, `title`, `date`, `teams.home`, `teams.away`. Use these to build market questions (e.g. “Will [Home] beat [Away]?”).

---

## 2. API-Football (free tier, API key)

- **Site:** [api-football.com](https://www.api-football.com/) or [apifootball.com](https://apifootball.com/)
- **Free tier:** 100 requests/day; livescore, fixtures, standings.
- **Auth:** Register at the dashboard and use `APIkey=...` in query or header.

**Example – live scores:**
```bash
curl "https://apiv3.apifootball.com/?action=get_livescore&APIkey=YOUR_KEY"
```

**Example – fixtures:**
```bash
curl "https://v3.football.api-sports.io/fixtures?league=39&season=2024" \
  -H "x-rapidapi-key: YOUR_KEY"
```

Use the returned fixture IDs and team names to create markets.

---

## 3. TheSportsDB (free tier + paid)

- **Site:** [thesportsdb.com](https://www.thesportsdb.com/)
- **Free:** Search events/teams, list leagues; ~30 req/min. Live scores are on a paid plan.
- **Auth:** Free API key from the site.

Good for team/league metadata and past events; use another provider for real-time scores if needed.

---

## Using events in this app

- **Backend:** **GET /api/events** returns a list of upcoming/live matches from SportSRC (no key). Query params: `league` (e.g. `PL`, `CL`). Use this to show “Games to bet on” in the UI.
- **Frontend:** Call `GET ${VITE_API_URL}/api/events?league=PL` (or omit `league` for default). Each event has `id`, `title`, `home`, `away`, `date`. Use `title` or `home`/`away` to prefill a market question (e.g. “Will [home] win vs [away]?”) and create a market from it.

For more requests or other sports, add an API key for API-Football or TheSportsDB and implement a small server route that calls their API and returns the same shape as `/api/events`.
