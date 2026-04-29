# signs

Look at life through a spiritual lens.

An astrology web app with tarot readings, birth charts, moon phases, planetary hours, numerology, transits, solar return, and astrocartography.

**Stack:** Next.js 14 · TypeScript · NextAuth v5 · Supabase · astronomy-engine · Leaflet.js · Vercel

## Features

- **Today** — daily vibe card
- **Tarot** — three-card draw with save to readings
- **Chart** — birth chart wheel with planetary positions
- **Compat** — synastry compatibility scores
- **Dashboard** — live moon phase + planetary hours countdown
- **Numerology** — life path, expression, soul urge, personal year
- **Transits** — monthly personal transit calendar
- **Solar Return** — annual chart with themes
- **Map** — astrocartography world map with planetary lines
- **Readings** — saved readings with notes (auth-gated)

## Development

```bash
npm install
cp .env.local.example .env.local  # fill in your credentials
npm run dev
```

## Environment Variables

| Variable | Where to get it |
|---|---|
| `NEXTAUTH_URL` | your deployment URL |
| `NEXTAUTH_SECRET` | `openssl rand -hex 32` |
| `GOOGLE_CLIENT_ID` | Google Cloud Console → Credentials |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console → Credentials |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |

## Deploy

```bash
vercel login
vercel        # creates project + first deploy
git push origin main  # auto-deploys on every push after linking
```

Add the redirect URI `https://<your-domain>/api/auth/callback/google` in Google Cloud Console → OAuth 2.0 credentials.

## Tests

```bash
npm test
```

35 tests covering planetary hours, numerology, transits, solar return, and astrocartography logic.
