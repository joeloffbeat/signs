# Signs — Full App Design Spec
**Date:** 2026-04-25  
**Stack:** Next.js 14 · NextAuth v5 · Supabase · TypeScript · Vercel

---

## 1. Overview

Signs is a spiritual-lens astrology web app. The aesthetic is the Joel design system: warm parchment (`#f0e8d2`), near-black ink (`#0f0d09`), sage green, walnut, woodcut textures, paper grain. Roboto Slab for display, JetBrains Mono for labels.

The prototype (`reference/Signs-handoff/`) is the visual spec. Every new screen must match its aesthetic exactly: 2px ink borders, shadow offsets, uppercase mono labels, earthy palette.

---

## 2. Architecture

### Framework
- **Next.js 14** with App Router and TypeScript
- **Server Components** for static/data pages; Client Components only where interactivity is required
- All CSS served as global stylesheets (the Joel system: `colors_and_type.css`, `components.css`, `signs.css`) — no Tailwind, no CSS modules (keeps exact prototype match)

### Auth
- **NextAuth v5** (Auth.js) with two providers:
  - Google OAuth
  - Credentials (email + bcrypt-hashed password)
- Session stored as JWT; user record created in Supabase on first login
- Protected routes: `/readings` — redirect to `/login` if unauthenticated
- All other routes are public (no gate)

### Database — Supabase (Postgres)
```
users           id, email, name, avatar_url, birth_date, birth_time, birth_place, created_at
readings        id, user_id, type (tarot|chart|transit), data jsonb, notes text, created_at
charts          id, user_id, label, birth_date, birth_time, birth_place, data jsonb, created_at
```
- Row-level security: users can only read/write their own rows
- `readings.data` stores the full serialised reading (card array, chart object, etc.)

### Astronomy
- **astronomy-engine** npm package for real ephemeris: planet positions, moon phase, sunrise/sunset, planetary hours
- No mock data in production. Calculations run server-side (API routes or Server Components) to avoid bundling the full ephemeris in the client

### Analytics
- `@vercel/analytics` and `@vercel/speed-insights` injected in `app/layout.tsx` root layout
- No additional configuration needed for Vercel deployment

### Deployment
- Vercel (automatic from `main` branch)
- Environment variables: `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXTAUTH_URL`

---

## 3. Routes

| Route | Screen | Auth-gated |
|-------|--------|-----------|
| `/` | Home — hero, feature cards, manifesto | No |
| `/today` | Daily vibe — planet of the day, element, message | No |
| `/tarot` | 3-card tarot pull (woodcut deck) | No |
| `/chart` | Birth chart wheel — natal analysis | No |
| `/compat` | Chart compatibility | No |
| `/dashboard` | Moon phase + planetary hours (🌙 icon → here) | No |
| `/transits` | Personal transit calendar vs. natal chart | No |
| `/numerology` | Life path, expression, soul urge, personal year | No |
| `/solar-return` | Solar return chart — annual theme | No |
| `/map` | Astrocartography — planetary lines on world map | No |
| `/readings` | Saved past readings | **Yes** |
| `/login` | Google OAuth + email/password | No |

---

## 4. Screen Designs

### 4.1 `/dashboard` — Moon + Planetary Hours
**Entry point:** clicking the 🌙 moon icon in the top-nav right slot.

Two-column layout (desktop), stacked (mobile):

**Left — Moon Phase panel:**
- Current phase name + illumination %
- SVG moon illustration (crescent → full, rendered mathematically)
- Monthly mini calendar showing phase per day (28 cells)
- One-paragraph interpretation for current phase

**Right — Planetary Hours panel:**
- Current hour ruler (planet name + glyph, e.g. "☉ Sun")
- Real-time countdown to next hour
- Sequence table: all 24 hours for today, ruler per hour, highlighted current
- Expandable "what does this mean" section — the historical Chaldean order explanation (Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon cycling from sunrise)

Data: `astronomy-engine` computes sunrise/sunset for user's lat/lon (browser geolocation API, fallback to UTC), then divides daylight into 12 equal planetary hours and night into 12.

### 4.2 `/transits` — Personal Transit Calendar
Requires user's natal chart data (birth date/time/place). If not set, prompt to go to `/chart` first.

- Month view calendar grid
- Each day cell shows transiting planets making major aspects to natal planets (conjunction, square, trine, opposition, sextile, within 1° orb)
- Clicking a day expands an aspect list: "☿ Mercury conjunct natal ☉ Sun — mental clarity, good for writing"
- Colour coding: green (harmonious: trine/sextile), amber (neutral: conjunction), red (tense: square/opposition)
- Interpretive text pulled from a static lookup table (planet × aspect × natal planet)

### 4.3 `/numerology` — Numerology Layer
Input: full birth name + birth date. Stored in user profile if logged in.

Calculations (Pythagorean system):
- **Life Path** — reduce birth date digits to single digit (or master 11/22/33)
- **Expression** — full birth name, letters → numbers → reduce
- **Soul Urge** — vowels only
- **Personal Year** — current year formula

Each number has: the numeral (large display), a title (e.g. "The Visionary"), a short paragraph interpretation, and a compatible/challenging number pair.

Layout: four cards in a 2×2 grid, each card styled like the existing `card` component (ink border, paper background, sage highlight).

### 4.4 `/solar-return` — Solar Return Chart
- Input: birth data (same as natal chart)
- Compute the exact moment the Sun returns to its natal longitude in the current year → that is the solar return moment
- Render a second `ChartWheel` (reuse the existing component) for that moment
- Side-by-side comparison: natal wheel (left) vs solar return wheel (right)
- Below: "Theme for the year" prose — generated from dominant solar return placements (SR Ascendant sign, SR Sun house, SR Moon sign)
- Interpretive text built from two independent lookups: SR Ascendant sign (12 entries) + SR Sun house (12 entries), concatenated — avoids needing 144 combinations

### 4.5 `/map` — Astrocartography
- **Leaflet.js** world map with OpenStreetMap tiles
- For each of 10 planets: compute the Ascendant, Descendant, MC, and IC lines (geodetic projection)
- Render as coloured SVG polylines overlaid on the map (each planet = distinct colour matching Joel palette: Sun=walnut, Moon=sage, Mercury=clay, etc.)
- Legend panel (bottom-left): planet → line type → interpretation snippet
- Clicking a line shows a tooltip: "☽ Moon IC — emotional home, deep roots, where you feel most yourself"
- Calculation: for each planet, sweep latitudes −80°→80° and find the longitude where that planet is exactly rising (Ascendant line), setting (Descendant), at MC, or at IC at that latitude. This produces 4 polylines per planet (40 lines total). Computed server-side in a Next.js API route; client receives a GeoJSON FeatureCollection

### 4.6 `/readings` — Saved Past Readings
Auth-gated. Redirects to `/login` if no session.

- List view: card per reading, sorted newest-first
- Each card: type badge (tarot / chart / transit), date, summary snippet
- Expand to full reading detail: tarot card images + interpretations, or chart wheel, etc.
- "Add note" — inline text field → saves to `readings.notes`
- Delete reading (with confirmation)

Tarot screen and chart screen each get a "save this reading" button (visible only when logged in).

### 4.7 `/login`
Two-tab layout (tabs-row component):
- **Google** — single "Continue with Google" button (full-width, walnut style)
- **Email** — name, email, password fields; toggle between Sign In / Sign Up

On sign-up: hashed password stored via NextAuth credentials provider; user row created in Supabase.

---

## 5. Navigation Changes

The `TopNav` component gets two additions:

1. **Moon icon becomes a link** — `<Link href="/dashboard">` wrapping the moon glyph + phase text. Cursor: pointer. Underline on hover.

2. **Auth slot** (right of moon):
   - Logged out: `[login →]` link (mono, small)
   - Logged in: user avatar (circular, 28px) + dropdown with "my readings" and "sign out"

3. **More dropdown** — the existing 5 nav links stay. New routes (dashboard, transits, numerology, solar-return, map) live under a `···` or "more" button that opens a simple dropdown list. This prevents the nav from crowding.

---

## 6. Design Tokens (unchanged from prototype)

```css
--bg-paper: #f0e8d2;  --ink: #0f0d09;  --sage: #a8c090;
--walnut: #7d5a2e;    --clay: #b8431f;  --bone: #faf8f2;
--font-display: 'Roboto Slab'; --font-mono: 'JetBrains Mono';
```

Paper grain texture (`has-grain` class) applies to body. All borders: 2px solid `var(--ink)`. Box shadows: 3-4px offset, ink colour.

---

## 7. Error Handling & Edge Cases

- **No birth data**: `/transits` and `/solar-return` show an empty state card: "to see your transits, draw your birth chart first →" linking to `/chart`
- **Geolocation denied**: `/dashboard` planetary hours fall back to UTC-based calculation with a note "using UTC — allow location for local hours"
- **Supabase unavailable**: readings page shows cached last-session data from localStorage as fallback; write operations show a toast error
- **NextAuth errors**: standard error page styled in Joel system CSS

---

## 8. Out of Scope

- Push notifications for transit alerts
- Social/sharing features
- Paid tier / subscription gating
- Mobile native app
- Multi-language support
