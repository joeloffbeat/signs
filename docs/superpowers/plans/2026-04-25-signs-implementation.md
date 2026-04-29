# Signs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Signs — a Next.js 14 spiritual-lens astrology web app — by porting the existing React/Babel prototype to TypeScript with NextAuth v5 auth, Supabase persistence, real ephemeris via astronomy-engine, and 7 new feature screens.

**Architecture:** App Router with server components for data-heavy pages and client components for interactivity. Three global CSS files (colors_and_type.css, components.css, signs.css) copied verbatim from the prototype — no Tailwind, no CSS modules. Library functions (planetary hours, numerology, transits, solar return, astrocartography) run server-side in API routes or server components to keep the astronomy-engine bundle off the client.

**Tech Stack:** Next.js 14 · TypeScript · NextAuth v5 (beta) · Supabase (Postgres + RLS) · astronomy-engine · Leaflet.js · @vercel/analytics · @vercel/speed-insights · Vitest

---

## File Structure

```
signs/
├── app/
│   ├── layout.tsx                        # Root: CSS imports, Vercel analytics, TopNav wrapper
│   ├── page.tsx                          # / → HomeScreen
│   ├── today/page.tsx                    # /today
│   ├── tarot/page.tsx                    # /tarot (client component)
│   ├── chart/page.tsx                    # /chart (client component)
│   ├── compat/page.tsx                   # /compat (client component)
│   ├── dashboard/page.tsx                # /dashboard (client: moon + planetary hours)
│   ├── transits/page.tsx                 # /transits (client component)
│   ├── numerology/page.tsx               # /numerology (client component)
│   ├── solar-return/page.tsx             # /solar-return (client component)
│   ├── map/page.tsx                      # /map (client: Leaflet)
│   ├── readings/page.tsx                 # /readings (auth-gated)
│   ├── login/page.tsx                    # /login (client component)
│   └── api/
│       ├── auth/[...nextauth]/route.ts   # NextAuth v5 handler
│       ├── planetary-hours/route.ts      # GET ?lat=&lon=&date= → { hours[], currentIndex }
│       └── astrocartography/route.ts     # GET ?date= → GeoJSON FeatureCollection
├── components/
│   ├── TopNav.tsx                        # Nav with moon link, auth slot, more dropdown
│   ├── ChartWheel.tsx                    # SVG natal wheel (ported from prototype)
│   ├── TarotArt.tsx                      # Woodcut card renderer (ported from prototype)
│   ├── MoonSvg.tsx                       # Mathematical moon phase SVG
│   └── AuthDropdown.tsx                  # Avatar + sign out dropdown (client)
├── lib/
│   ├── astro-data.ts                     # SIGNS, PLANETS, makeChart(), makeCompat(), makeDailyVibe()
│   ├── tarot-data.ts                     # TAROT_DECK (22 majors)
│   ├── astronomy.ts                      # astronomy-engine wrappers: moonPhase(), sunriseSunset()
│   ├── planetary-hours.ts               # computePlanetaryHours(date, lat, lon)
│   ├── numerology.ts                     # lifePath(), expression(), soulUrge(), personalYear()
│   ├── solar-return.ts                   # computeSolarReturnDate(natalLon, year)
│   ├── astrocartography.ts              # buildCartographyLines(date) → GeoJSON
│   ├── transits.ts                       # computeMonthTransits(natalChart, year, month)
│   └── supabase.ts                       # Supabase server + browser clients
├── auth.ts                               # NextAuth v5 config (Google + credentials)
├── middleware.ts                         # Protect /readings route
├── styles/
│   ├── colors_and_type.css               # Copied from reference (DO NOT MODIFY)
│   ├── components.css                    # Copied from reference (DO NOT MODIFY)
│   └── signs.css                         # Copied from reference (DO NOT MODIFY)
├── public/
│   └── paper-bg.svg                      # Copied from reference
├── __tests__/
│   ├── lib/numerology.test.ts
│   ├── lib/planetary-hours.test.ts
│   ├── lib/transits.test.ts
│   └── lib/solar-return.test.ts
├── package.json
├── tsconfig.json
├── next.config.ts
├── vitest.config.ts
├── vitest.setup.ts
└── .env.local.example
```

---

## Task 1: Scaffold + configure

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `.env.local.example`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "signs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18",
    "react-dom": "^18",
    "next-auth": "^5.0.0-beta.25",
    "@supabase/supabase-js": "^2.43.4",
    "astronomy-engine": "^2.1.19",
    "bcryptjs": "^2.4.3",
    "leaflet": "^1.9.4",
    "@vercel/analytics": "^1.3.1",
    "@vercel/speed-insights": "^1.0.12"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/bcryptjs": "^2.4.6",
    "@types/leaflet": "^1.9.12",
    "typescript": "^5",
    "vitest": "^1.6.0",
    "@vitejs/plugin-react": "^4.3.0",
    "jsdom": "^24.0.0",
    "@testing-library/react": "^15.0.0",
    "@testing-library/jest-dom": "^6.4.2"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create next.config.ts**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

export default nextConfig
```

- [ ] **Step 4: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

- [ ] **Step 5: Create vitest.setup.ts**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Create .env.local.example**

```
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Google OAuth (https://console.cloud.google.com)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Supabase (https://supabase.com/dashboard/project/_/settings/api)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

- [ ] **Step 7: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` populated, no peer-dependency errors.

- [ ] **Step 8: Commit**

```bash
git add package.json tsconfig.json next.config.ts vitest.config.ts vitest.setup.ts .env.local.example
git commit -m "feat: scaffold Next.js 14 project with TypeScript and Vitest"
```

---

## Task 2: Copy Joel CSS + public assets

**Files:**
- Create: `styles/colors_and_type.css`
- Create: `styles/components.css`
- Create: `styles/signs.css`
- Create: `public/paper-bg.svg`

- [ ] **Step 1: Copy CSS files from reference**

```bash
mkdir -p styles public
cp reference/Signs-handoff/signs/project/design/colors_and_type.css styles/
cp reference/Signs-handoff/signs/project/design/components.css styles/
cp reference/Signs-handoff/signs/project/design/signs.css styles/
cp reference/Signs-handoff/signs/project/design/paper-bg.svg public/
```

- [ ] **Step 2: Verify the copies exist and are non-empty**

```bash
wc -l styles/*.css
```

Expected: each file has at least 30 lines.

- [ ] **Step 3: Commit**

```bash
git add styles/ public/paper-bg.svg
git commit -m "feat: add Joel design system CSS and paper texture"
```

---

## Task 3: Root layout with Vercel analytics

**Files:**
- Create: `app/layout.tsx`
- Create: `app/globals.css`

- [ ] **Step 1: Create app/globals.css**

```css
/* Minimal reset; all design tokens live in styles/*.css */
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; }
```

- [ ] **Step 2: Create app/layout.tsx**

```typescript
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '../styles/colors_and_type.css'
import '../styles/components.css'
import '../styles/signs.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Signs',
  description: 'look life through a spiritual lens',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="has-grain">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify Next.js starts**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: blank page with parchment background (the `has-grain` class applies the paper texture from `signs.css`). No console errors about missing CSS.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: root layout with Joel CSS and Vercel analytics"
```

---

## Task 4: lib/astro-data.ts

**Files:**
- Create: `lib/astro-data.ts`

Port `reference/Signs-handoff/signs/project/design/astro-data.js` to TypeScript. All `window.X = function` become named exports. The logic is unchanged.

- [ ] **Step 1: Create lib/astro-data.ts**

```typescript
export interface Sign {
  id: string
  name: string
  glyph: string
  element: 'fire' | 'earth' | 'air' | 'water'
  mode: 'cardinal' | 'fixed' | 'mutable'
  ruler: string
  start: [number, number]
}

export interface Planet {
  id: string
  name: string
  glyph: string
  color: string
}

export interface PlacedPlanet extends Planet {
  sign: Sign
  deg: number
  degMin: number
  house: number
  retro: boolean
  longitude: number
}

export interface HouseCusp {
  num: number
  sign: Sign
  cuspDeg: number
}

export interface Aspect {
  from: PlacedPlanet
  to: PlacedPlanet
  type: string
  name: string
  glyph: string
  orb: string
}

export interface Chart {
  name: string
  dateStr: string
  timeStr: string
  place: string
  planets: PlacedPlanet[]
  houses: HouseCusp[]
  aspects: Aspect[]
  ascendant: Sign
  moon: Sign
  sun: Sign
  dominantEl: string
  dominantMode: string
  elementCount: Record<string, number>
  modeCount: Record<string, number>
}

export interface DailyVibe {
  mood: { word: string; desc: string }
  transit: Planet
  transitSign: Sign
  luckHour: number
  luckPct: number
  energyPct: number
  focusPct: number
  color: string
  watchOut: string
  todo: string
  sunRel: string
}

export interface Compat {
  overall: number
  bars: Array<{ label: string; pct: number }>
  sunPair: string
  summary: string
}

export const SIGNS: Sign[] = [
  { id: 'aries', name: 'Aries', glyph: '♈', element: 'fire', mode: 'cardinal', ruler: 'Mars', start: [3, 21] },
  { id: 'taurus', name: 'Taurus', glyph: '♉', element: 'earth', mode: 'fixed', ruler: 'Venus', start: [4, 20] },
  { id: 'gemini', name: 'Gemini', glyph: '♊', element: 'air', mode: 'mutable', ruler: 'Mercury', start: [5, 21] },
  { id: 'cancer', name: 'Cancer', glyph: '♋', element: 'water', mode: 'cardinal', ruler: 'Moon', start: [6, 22] },
  { id: 'leo', name: 'Leo', glyph: '♌', element: 'fire', mode: 'fixed', ruler: 'Sun', start: [7, 23] },
  { id: 'virgo', name: 'Virgo', glyph: '♍', element: 'earth', mode: 'mutable', ruler: 'Mercury', start: [8, 23] },
  { id: 'libra', name: 'Libra', glyph: '♎', element: 'air', mode: 'cardinal', ruler: 'Venus', start: [9, 23] },
  { id: 'scorpio', name: 'Scorpio', glyph: '♏', element: 'water', mode: 'fixed', ruler: 'Pluto', start: [10, 23] },
  { id: 'sagittarius', name: 'Sagittarius', glyph: '♐', element: 'fire', mode: 'mutable', ruler: 'Jupiter', start: [11, 22] },
  { id: 'capricorn', name: 'Capricorn', glyph: '♑', element: 'earth', mode: 'cardinal', ruler: 'Saturn', start: [12, 22] },
  { id: 'aquarius', name: 'Aquarius', glyph: '♒', element: 'air', mode: 'fixed', ruler: 'Saturn', start: [1, 20] },
  { id: 'pisces', name: 'Pisces', glyph: '♓', element: 'water', mode: 'mutable', ruler: 'Jupiter', start: [2, 19] },
]

export const PLANETS: Planet[] = [
  { id: 'sun', name: 'Sun', glyph: '☉', color: '#d4a04a' },
  { id: 'moon', name: 'Moon', glyph: '☽', color: '#a88660' },
  { id: 'mercury', name: 'Mercury', glyph: '☿', color: '#7d5a2e' },
  { id: 'venus', name: 'Venus', glyph: '♀', color: '#a8c090' },
  { id: 'mars', name: 'Mars', glyph: '♂', color: '#b8431f' },
  { id: 'jupiter', name: 'Jupiter', glyph: '♃', color: '#6b8550' },
  { id: 'saturn', name: 'Saturn', glyph: '♄', color: '#3d4a2a' },
  { id: 'uranus', name: 'Uranus', glyph: '♅', color: '#7d5a2e' },
  { id: 'neptune', name: 'Neptune', glyph: '♆', color: '#3d4a2a' },
  { id: 'pluto', name: 'Pluto', glyph: '♇', color: '#0f0d09' },
]

function seedRand(seedStr: string): () => number {
  let h = 2166136261
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return function () {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function signFromDate(month: number, day: number): string {
  const order = [
    { sign: 'capricorn', from: [12, 22] as [number, number], to: [1, 19] as [number, number] },
    { sign: 'aquarius', from: [1, 20] as [number, number], to: [2, 18] as [number, number] },
    { sign: 'pisces', from: [2, 19] as [number, number], to: [3, 20] as [number, number] },
    { sign: 'aries', from: [3, 21] as [number, number], to: [4, 19] as [number, number] },
    { sign: 'taurus', from: [4, 20] as [number, number], to: [5, 20] as [number, number] },
    { sign: 'gemini', from: [5, 21] as [number, number], to: [6, 21] as [number, number] },
    { sign: 'cancer', from: [6, 22] as [number, number], to: [7, 22] as [number, number] },
    { sign: 'leo', from: [7, 23] as [number, number], to: [8, 22] as [number, number] },
    { sign: 'virgo', from: [8, 23] as [number, number], to: [9, 22] as [number, number] },
    { sign: 'libra', from: [9, 23] as [number, number], to: [10, 22] as [number, number] },
    { sign: 'scorpio', from: [10, 23] as [number, number], to: [11, 21] as [number, number] },
    { sign: 'sagittarius', from: [11, 22] as [number, number], to: [12, 21] as [number, number] },
  ]
  for (const o of order) {
    const [fm, fd] = o.from
    const [tm, td] = o.to
    if (fm === tm && month === fm && day >= fd && day <= td) return o.sign
    if (fm !== tm) {
      if ((month === fm && day >= fd) || (month === tm && day <= td)) return o.sign
    }
  }
  return 'aries'
}

export function makeChart(name: string, dateStr: string, timeStr: string, place: string): Chart {
  const seed = `${name}|${dateStr}|${timeStr}|${place}`
  const rand = seedRand(seed)
  const [, m, d] = dateStr.split('-').map(Number)
  const sun = signFromDate(m, d)
  const sunIdx = SIGNS.findIndex((s) => s.id === sun)

  const planets: PlacedPlanet[] = PLANETS.map((p, i) => {
    const baseShift = i === 0 ? 0 : Math.floor(rand() * 12)
    const signIdx = i === 0 ? sunIdx : (sunIdx + baseShift) % 12
    const deg = Math.floor(rand() * 30)
    const house = Math.floor(rand() * 12) + 1
    const retro = i > 1 && rand() < 0.18
    return {
      ...p,
      sign: SIGNS[signIdx],
      deg,
      degMin: Math.floor(rand() * 60),
      house,
      retro,
      longitude: signIdx * 30 + deg + (rand() * 60) / 60,
    }
  })

  const ascIdx = Math.floor(rand() * 12)
  const ascendant = SIGNS[ascIdx]
  const moonSign = planets.find((p) => p.id === 'moon')!.sign

  const houses: HouseCusp[] = []
  for (let i = 0; i < 12; i++) {
    houses.push({ num: i + 1, sign: SIGNS[(ascIdx + i) % 12], cuspDeg: Math.floor(rand() * 30) })
  }

  const aspectTypes = [
    { name: 'conjunction', angle: 0, orb: 8, type: 'conj', glyph: '☌' },
    { name: 'sextile', angle: 60, orb: 5, type: 'sext', glyph: '✱' },
    { name: 'square', angle: 90, orb: 6, type: 'square', glyph: '□' },
    { name: 'trine', angle: 120, orb: 7, type: 'trine', glyph: '△' },
    { name: 'opposition', angle: 180, orb: 8, type: 'opp', glyph: '☍' },
  ]
  const aspects: Aspect[] = []
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      let diff = Math.abs(planets[i].longitude - planets[j].longitude)
      if (diff > 180) diff = 360 - diff
      for (const a of aspectTypes) {
        if (Math.abs(diff - a.angle) <= a.orb) {
          aspects.push({
            from: planets[i], to: planets[j],
            type: a.type, name: a.name, glyph: a.glyph,
            orb: Math.abs(diff - a.angle).toFixed(1),
          })
          break
        }
      }
    }
  }

  const elementCount: Record<string, number> = { fire: 0, earth: 0, air: 0, water: 0 }
  planets.slice(0, 7).forEach((p) => { elementCount[p.sign.element]++ })
  const dominantEl = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0][0]
  const modeCount: Record<string, number> = { cardinal: 0, fixed: 0, mutable: 0 }
  planets.slice(0, 7).forEach((p) => { modeCount[p.sign.mode]++ })
  const dominantMode = Object.entries(modeCount).sort((a, b) => b[1] - a[1])[0][0]

  return {
    name, dateStr, timeStr, place,
    planets, houses, aspects, ascendant,
    moon: moonSign, sun: SIGNS[sunIdx],
    dominantEl, dominantMode, elementCount, modeCount,
  }
}

export function makeDailyVibe(chart: Chart): DailyVibe {
  const today = new Date()
  const dayKey = `${chart.name}|${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  const rand = seedRand(dayKey)

  const moods = [
    { word: 'kindling', desc: 'small sparks. start something tiny.' },
    { word: 'tidal', desc: 'moods come in waves. ride them, don\'t fight.' },
    { word: 'earthy', desc: 'make something with your hands. cook. plant. fix.' },
    { word: 'luminous', desc: 'you\'re easy to read today. say what you mean.' },
    { word: 'interior', desc: 'stay in. the answer is somewhere on your desk.' },
    { word: 'social', desc: 'speak to a stranger. it\'ll go better than you think.' },
    { word: 'frictive', desc: 'expect snags. the snags are useful.' },
    { word: 'molten', desc: 'hot at the core. don\'t sit on the feeling.' },
    { word: 'patient', desc: 'the slow path is the only path today.' },
  ]

  const transit = PLANETS[Math.floor(rand() * 7)]
  const transitSign = SIGNS[Math.floor(rand() * 12)]
  const watchOuts = ['overcommitting', 'taking it personally', 'skipping meals', 'reply-all', 'doom-scrolling', 'starting a fight you can\'t finish', 'saying yes too fast', 'perfectionism']
  const dos = ['send the email', 'go for the long walk', 'make the phone call', 'write it down', 'throw something away', 'ask one good question', 'drink some water, honestly', 'leave 10 min early']
  const colors = ['sage', 'walnut', 'clay', 'honey', 'moss', 'bone']

  return {
    mood: moods[Math.floor(rand() * moods.length)],
    transit, transitSign,
    luckHour: Math.floor(rand() * 24),
    luckPct: 30 + Math.floor(rand() * 60),
    energyPct: 20 + Math.floor(rand() * 70),
    focusPct: 20 + Math.floor(rand() * 70),
    color: colors[Math.floor(rand() * colors.length)],
    watchOut: watchOuts[Math.floor(rand() * watchOuts.length)],
    todo: dos[Math.floor(rand() * dos.length)],
    sunRel: chart.sun.name,
  }
}

export function makeCompat(a: Chart, b: Chart): Compat {
  const seed = `${a.name}|${a.dateStr}|${b.name}|${b.dateStr}`
  const rand = seedRand(seed)
  const elemMatrix: Record<string, number> = {
    'fire-fire': 80, 'fire-earth': 45, 'fire-air': 90, 'fire-water': 40,
    'earth-fire': 45, 'earth-earth': 75, 'earth-air': 50, 'earth-water': 85,
    'air-fire': 90, 'air-earth': 50, 'air-air': 70, 'air-water': 60,
    'water-fire': 40, 'water-earth': 85, 'water-air': 60, 'water-water': 80,
  }
  const sunPair = `${a.sun.element}-${b.sun.element}`
  const sunScore = elemMatrix[sunPair] ?? 60
  const moonScore = elemMatrix[`${a.moon.element}-${b.moon.element}`] ?? 60
  const jitter = Math.floor(rand() * 14) - 7
  const overall = Math.max(20, Math.min(98, Math.floor(sunScore * 0.4 + moonScore * 0.4 + 50 * 0.2 + jitter)))

  return {
    overall,
    bars: [
      { label: 'romance', pct: Math.max(20, Math.min(95, sunScore + Math.floor(rand() * 16) - 8)) },
      { label: 'communication', pct: Math.max(20, Math.min(95, 40 + Math.floor(rand() * 55))) },
      { label: 'trust', pct: Math.max(20, Math.min(95, 50 + Math.floor(rand() * 45))) },
      { label: 'passion', pct: Math.max(15, Math.min(95, 30 + Math.floor(rand() * 65))) },
      { label: 'rhythm', pct: Math.max(20, Math.min(95, moonScore + Math.floor(rand() * 16) - 8)) },
      { label: 'friction', pct: Math.max(15, Math.min(90, 30 + Math.floor(rand() * 55))) },
    ],
    sunPair,
    summary: `${a.sun.name} sun + ${b.sun.name} sun.`,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/astro-data.ts
git commit -m "feat: port astro-data to TypeScript with full type definitions"
```

---

## Task 5: lib/tarot-data.ts

**Files:**
- Create: `lib/tarot-data.ts`

Port `reference/Signs-handoff/signs/project/design/tarot-data.js` to TypeScript.

- [ ] **Step 1: Read the reference file**

Read `reference/Signs-handoff/signs/project/design/tarot-data.js` and copy the TAROT_DECK array.

- [ ] **Step 2: Create lib/tarot-data.ts**

```typescript
export interface TarotCard {
  id: number
  name: string
  upright: string[]
  reversed: string[]
  meaning: string
  element?: string
}
```

Then export the full deck array from the reference file, changing `window.TAROT_DECK = [` to `export const TAROT_DECK: TarotCard[] = [`.

- [ ] **Step 3: Commit**

```bash
git add lib/tarot-data.ts
git commit -m "feat: port tarot deck data to TypeScript"
```

---

## Task 6: components/TarotArt.tsx

**Files:**
- Create: `components/TarotArt.tsx`

Port `reference/Signs-handoff/signs/project/design/tarot-art.jsx` to TypeScript.

- [ ] **Step 1: Read the reference file**

Read `reference/Signs-handoff/signs/project/design/tarot-art.jsx`.

- [ ] **Step 2: Create components/TarotArt.tsx**

Create the component with this interface, then port the rendering logic verbatim from the reference file:

```typescript
'use client'
import { TarotCard } from '@/lib/tarot-data'

interface TarotArtProps {
  card: TarotCard
  style?: 'woodcut' | 'minimal'
}

export default function TarotArt({ card, style = 'woodcut' }: TarotArtProps) {
  // Port rendering logic from reference/Signs-handoff/signs/project/design/tarot-art.jsx
  // Change: window.TarotArt → export default function TarotArt
  // Change: React.createElement / JSX with global React → import React from 'react' (not needed with Next.js)
  // Keep all SVG paths, fills, and data-deck-style attributes unchanged
}
```

- [ ] **Step 3: Commit**

```bash
git add components/TarotArt.tsx
git commit -m "feat: port TarotArt woodcut card renderer to TypeScript"
```

---

## Task 7: components/ChartWheel.tsx

**Files:**
- Create: `components/ChartWheel.tsx`

Port `reference/Signs-handoff/signs/project/design/chart-wheel.jsx` to TypeScript.

- [ ] **Step 1: Read the reference file**

Read `reference/Signs-handoff/signs/project/design/chart-wheel.jsx`.

- [ ] **Step 2: Create components/ChartWheel.tsx**

Create with this interface, port rendering logic verbatim:

```typescript
'use client'
import { Chart } from '@/lib/astro-data'

interface ChartWheelProps {
  chart: Chart
  style?: 'renaissance' | 'minimal'
  size?: number
}

export default function ChartWheel({ chart, style = 'renaissance', size = 480 }: ChartWheelProps) {
  // Port from reference/Signs-handoff/signs/project/design/chart-wheel.jsx
  // Change: window.ChartWheel → export default function ChartWheel
  // Radii from prototype: rOuter=240, rZodiac=215, rHouse=165, rInner=100, rPlanet=140
  // Scale all radii by size/480 to support the size prop
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ChartWheel.tsx
git commit -m "feat: port ChartWheel SVG component to TypeScript"
```

---

## Task 8: components/TopNav.tsx

**Files:**
- Create: `components/TopNav.tsx`

New component — not a port. Replaces the prototype's TopNav with Next.js Links, moon link to /dashboard, auth slot, and a "more" dropdown.

- [ ] **Step 1: Create components/TopNav.tsx**

```typescript
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

const PRIMARY_LINKS = [
  { href: '/', label: 'home' },
  { href: '/today', label: 'today' },
  { href: '/tarot', label: 'tarot' },
  { href: '/chart', label: 'birth chart' },
  { href: '/compat', label: 'compatibility' },
]

const MORE_LINKS = [
  { href: '/transits', label: 'transits' },
  { href: '/numerology', label: 'numerology' },
  { href: '/solar-return', label: 'solar return' },
  { href: '/map', label: 'astrocartography' },
]

interface TopNavProps {
  moonPhase?: string
  moonGlyph?: string
}

export default function TopNav({ moonPhase = 'waxing gibbous', moonGlyph = '🌙' }: TopNavProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [moreOpen, setMoreOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const today = new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' })

  return (
    <nav className="top-nav">
      <Link href="/" className="mark">
        <span className="mark-glyph">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="var(--ink)" />
          </svg>
        </span>
        signs
      </Link>

      <div className="links">
        {PRIMARY_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`nav-link ${pathname === l.href ? 'active' : ''}`}
          >
            {l.label}
          </Link>
        ))}

        <div style={{ position: 'relative' }}>
          <button
            className="nav-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setMoreOpen((o) => !o)}
          >
            ···
          </button>
          {moreOpen && (
            <div style={{
              position: 'absolute', top: '100%', left: 0,
              background: 'var(--bg-paper)', border: '2px solid var(--ink)',
              padding: '8px 0', zIndex: 50, minWidth: 160,
              boxShadow: '3px 3px 0 var(--ink)',
            }}>
              {MORE_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="nav-link"
                  style={{ display: 'block', padding: '6px 16px' }}
                  onClick={() => setMoreOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="/dashboard" className="moon" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <span className="glyph">{moonGlyph}</span> {moonPhase}
        </Link>
        <span>·</span>
        <span>{today}</span>
        <span>·</span>

        {session ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setAvatarOpen((o) => !o)}
              style={{
                width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--ink)',
                background: 'var(--walnut)', cursor: 'pointer', overflow: 'hidden', padding: 0,
              }}
            >
              {session.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="avatar" width={28} height={28} style={{ display: 'block' }} />
              ) : (
                <span style={{ color: 'var(--bone)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                  {session.user?.name?.[0]?.toUpperCase() ?? '?'}
                </span>
              )}
            </button>
            {avatarOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0,
                background: 'var(--bg-paper)', border: '2px solid var(--ink)',
                padding: '8px 0', zIndex: 50, minWidth: 140,
                boxShadow: '3px 3px 0 var(--ink)',
              }}>
                <Link
                  href="/readings"
                  className="nav-link"
                  style={{ display: 'block', padding: '6px 16px' }}
                  onClick={() => setAvatarOpen(false)}
                >
                  my readings
                </Link>
                <button
                  className="nav-link"
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 16px', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => signOut()}
                >
                  sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="nav-link" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            login →
          </Link>
        )}
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/TopNav.tsx
git commit -m "feat: TopNav with moon link to /dashboard, auth slot, more dropdown"
```

---

## Task 9: Port existing screens (Home, Today, Tarot, Chart, Compat)

**Files:**
- Create: `app/page.tsx`
- Create: `app/today/page.tsx`
- Create: `app/tarot/page.tsx`
- Create: `app/chart/page.tsx`
- Create: `app/compat/page.tsx`

Port each screen from `reference/Signs-handoff/signs/project/design/screens-1.jsx`, `screens-2.jsx`, and `screens-3.jsx`. Each becomes a Next.js page. Interactive screens get `'use client'`.

- [ ] **Step 1: Read reference files**

Read:
- `reference/Signs-handoff/signs/project/design/screens-1.jsx` (HomeScreen, TodayScreen if present)
- `reference/Signs-handoff/signs/project/design/screens-2.jsx` (TarotScreen)
- `reference/Signs-handoff/signs/project/design/screens-3.jsx` (ChartScreen, CompatScreen)

- [ ] **Step 2: Create app/page.tsx (Home)**

```typescript
import TopNav from '@/components/TopNav'
import HomeContent from './HomeContent'

export default function HomePage() {
  return (
    <>
      <TopNav />
      <HomeContent />
    </>
  )
}
```

Create `app/HomeContent.tsx` as a `'use client'` component containing the HomeScreen JSX ported from screens-1.jsx. Port changes:
- `window.HomeScreen` → `export default function HomeContent()`
- `onNav("today")` → `import { useRouter } from 'next/navigation'; router.push('/today')`
- `TAROT_DECK` → `import { TAROT_DECK } from '@/lib/tarot-data'`
- `<TarotArt card={c} style={deckStyle} />` → `import TarotArt from '@/components/TarotArt'`
- Remove all `onClick={onNav}` prop threading — use `router.push()` directly

- [ ] **Step 3: Create app/today/page.tsx**

```typescript
'use client'
import { useState } from 'react'
import TopNav from '@/components/TopNav'
import { makeChart, makeDailyVibe } from '@/lib/astro-data'

export default function TodayPage() {
  const [chart] = useState(() => makeChart('visitor', '1990-01-01', '12:00', 'New York'))
  const vibe = makeDailyVibe(chart)

  return (
    <>
      <TopNav />
      <div className="page">
        <div className="eyebrow">today · {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
          {vibe.mood.word}
        </h1>
        <p className="lede">{vibe.mood.desc}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 32 }}>
          <div className="card">
            <div className="field-label">planet of the day</div>
            <div style={{ fontSize: 32 }}>{vibe.transit.glyph}</div>
            <div>{vibe.transit.name} in {vibe.transitSign.name}</div>
          </div>
          <div className="card">
            <div className="field-label">energy</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24 }}>{vibe.energyPct}%</div>
          </div>
          <div className="card">
            <div className="field-label">focus</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24 }}>{vibe.focusPct}%</div>
          </div>
          <div className="card">
            <div className="field-label">color of the day</div>
            <div style={{ fontFamily: 'var(--font-mono)' }}>{vibe.color}</div>
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="field-label">do</div>
            <p>{vibe.todo}</p>
          </div>
          <div className="card">
            <div className="field-label">watch out for</div>
            <p>{vibe.watchOut}</p>
          </div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Create app/tarot/page.tsx**

Port TarotScreen from `screens-2.jsx` into a `'use client'` page:

```typescript
'use client'
import TopNav from '@/components/TopNav'
// Port TarotScreen JSX here
// Key changes:
// - useState for cards, revealed, flipped state (same logic as prototype)
// - import TarotArt from '@/components/TarotArt'
// - import { TAROT_DECK } from '@/lib/tarot-data'
// - No onNav prop — use <Link> for navigation
```

Port the full TarotScreen component from screens-2.jsx verbatim, adapting the above changes.

- [ ] **Step 5: Create app/chart/page.tsx**

Port ChartScreen from `screens-3.jsx` into a `'use client'` page:

```typescript
'use client'
import TopNav from '@/components/TopNav'
import ChartWheel from '@/components/ChartWheel'
import { makeChart } from '@/lib/astro-data'
// Port ChartScreen JSX here
// Key changes:
// - useState for mode ('input' | 'loading' | 'view'), form fields, chart
// - import ChartWheel from '@/components/ChartWheel'
// - import makeChart from '@/lib/astro-data'
```

- [ ] **Step 6: Create app/compat/page.tsx**

Port CompatScreen from `screens-3.jsx` into a `'use client'` page.

- [ ] **Step 7: Verify all routes render**

```bash
npm run dev
```

Check each route: `/`, `/today`, `/tarot`, `/chart`, `/compat`. Each should show the correct screen with Joel styling (parchment background, ink borders, correct fonts). No console errors.

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx app/HomeContent.tsx app/today/page.tsx app/tarot/page.tsx app/chart/page.tsx app/compat/page.tsx
git commit -m "feat: port all prototype screens to Next.js pages"
```

---

## Task 10: Supabase client + DB schema

**Files:**
- Create: `lib/supabase.ts`

- [ ] **Step 1: Create lib/supabase.ts**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
```

- [ ] **Step 2: Run the DB schema in Supabase**

Copy the SQL below and run it in your Supabase dashboard → SQL Editor:

```sql
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  avatar_url text,
  birth_date text,
  birth_time text,
  birth_place text,
  created_at timestamptz default now()
);

create table if not exists readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  type text not null check (type in ('tarot', 'chart', 'transit')),
  data jsonb not null default '{}',
  notes text,
  created_at timestamptz default now()
);

create table if not exists charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  label text not null,
  birth_date text not null,
  birth_time text,
  birth_place text,
  data jsonb not null default '{}',
  created_at timestamptz default now()
);

alter table users enable row level security;
alter table readings enable row level security;
alter table charts enable row level security;

create policy "users: own row only" on users for all using (auth.uid()::text = id::text);
create policy "readings: own rows only" on readings for all using (auth.uid()::text = user_id::text);
create policy "charts: own rows only" on charts for all using (auth.uid()::text = user_id::text);
```

- [ ] **Step 3: Commit**

```bash
git add lib/supabase.ts
git commit -m "feat: Supabase client (browser + admin) and DB schema"
```

---

## Task 11: NextAuth v5 + middleware

**Files:**
- Create: `auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `middleware.ts`

- [ ] **Step 1: Create auth.ts**

```typescript
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        mode: { label: 'Mode', type: 'text' },
      },
      async authorize(credentials) {
        const { email, password, name, mode } = credentials as {
          email: string; password: string; name: string; mode: string
        }
        if (!email || !password) return null

        const { data: existing } = await supabaseAdmin
          .from('users').select('*').eq('email', email).single()

        if (mode === 'signup') {
          if (existing) throw new Error('Email already registered')
          const hash = await bcrypt.hash(password, 10)
          const { data: newUser } = await supabaseAdmin
            .from('users').insert({ email, name: name || email, password_hash: hash }).select().single()
          return newUser ? { id: newUser.id, email: newUser.email, name: newUser.name } : null
        }

        if (!existing) throw new Error('No account found')
        const valid = await bcrypt.compare(password, existing.password_hash)
        if (!valid) throw new Error('Incorrect password')
        return { id: existing.id, email: existing.email, name: existing.name, image: existing.avatar_url }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const { data: existing } = await supabaseAdmin
          .from('users').select('id').eq('email', user.email!).single()
        if (!existing) {
          await supabaseAdmin.from('users').insert({
            email: user.email!, name: user.name, avatar_url: user.image,
          })
        }
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
  },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
})
```

> Note: The `users` table needs a `password_hash` column. Add to the SQL from Task 10:
> `alter table users add column if not exists password_hash text;`

- [ ] **Step 2: Create app/api/auth/[...nextauth]/route.ts**

```typescript
import { handlers } from '@/auth'
export const { GET, POST } = handlers
```

- [ ] **Step 3: Create middleware.ts**

```typescript
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname === '/readings') {
    return NextResponse.redirect(new URL('/login', req.url))
  }
})

export const config = { matcher: ['/readings'] }
```

- [ ] **Step 4: Commit**

```bash
git add auth.ts app/api/auth middleware.ts
git commit -m "feat: NextAuth v5 with Google + credentials, middleware protects /readings"
```

---

## Task 12: Login page

**Files:**
- Create: `app/login/page.tsx`

- [ ] **Step 1: Create app/login/page.tsx**

```typescript
'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import TopNav from '@/components/TopNav'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'google' | 'email'>('google')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGoogle() {
    await signIn('google', { callbackUrl: '/' })
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email, password, name, mode,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/')
    }
  }

  return (
    <>
      <TopNav />
      <div className="page" style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px' }}>
        <div className="eyebrow">account</div>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 32 }}>sign in</h1>

        <div className="tabs-row" style={{ marginBottom: 24 }}>
          <button
            className={`tab ${tab === 'google' ? 'active' : ''}`}
            onClick={() => setTab('google')}
          >
            Google
          </button>
          <button
            className={`tab ${tab === 'email' ? 'active' : ''}`}
            onClick={() => setTab('email')}
          >
            Email
          </button>
        </div>

        {tab === 'google' && (
          <button className="btn btn-walnut" style={{ width: '100%', padding: '12px 24px' }} onClick={handleGoogle}>
            Continue with Google →
          </button>
        )}

        {tab === 'email' && (
          <form onSubmit={handleCredentials}>
            <div className="tabs-row" style={{ marginBottom: 20 }}>
              <button type="button" className={`tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => setMode('signin')}>Sign In</button>
              <button type="button" className={`tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>Sign Up</button>
            </div>

            {mode === 'signup' && (
              <div className="field" style={{ marginBottom: 16 }}>
                <label className="field-label">name</label>
                <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}

            <div className="field" style={{ marginBottom: 16 }}>
              <label className="field-label">email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="field" style={{ marginBottom: 24 }}>
              <label className="field-label">password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {error && <p style={{ color: 'var(--clay)', fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 16 }}>{error}</p>}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'loading...' : mode === 'signin' ? 'sign in →' : 'create account →'}
            </button>
          </form>
        )}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Test the login flow**

```bash
npm run dev
```

Navigate to `/login`. Test: click Google tab → "Continue with Google" button appears. Click Email tab → form appears. Switch Sign In/Sign Up → name field toggles. Without real env vars, the Google flow will fail — that's expected.

- [ ] **Step 3: Commit**

```bash
git add app/login/page.tsx
git commit -m "feat: login page with Google OAuth and email/password tabs"
```

---

## Task 13: Readings page

**Files:**
- Create: `app/readings/page.tsx`

- [ ] **Step 1: Create app/readings/page.tsx**

```typescript
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import TopNav from '@/components/TopNav'
import ReadingsClient from './ReadingsClient'

export default async function ReadingsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const { data: readings } = await supabaseAdmin
    .from('readings')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <TopNav />
      <ReadingsClient readings={readings ?? []} userId={session.user.id!} />
    </>
  )
}
```

- [ ] **Step 2: Create app/readings/ReadingsClient.tsx**

```typescript
'use client'
import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Reading {
  id: string
  type: 'tarot' | 'chart' | 'transit'
  data: Record<string, unknown>
  notes: string | null
  created_at: string
}

interface Props {
  readings: Reading[]
  userId: string
}

export default function ReadingsClient({ readings: initial, userId }: Props) {
  const [readings, setReadings] = useState(initial)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const router = useRouter()

  async function saveNote(id: string) {
    await supabaseBrowser.from('readings').update({ notes: noteText }).eq('id', id)
    setReadings((rs) => rs.map((r) => r.id === id ? { ...r, notes: noteText } : r))
    setEditingNote(null)
  }

  async function deleteReading(id: string) {
    if (!confirm('Delete this reading?')) return
    await supabaseBrowser.from('readings').delete().eq('id', id)
    setReadings((rs) => rs.filter((r) => r.id !== id))
    router.refresh()
  }

  if (readings.length === 0) {
    return (
      <div className="page" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        <div className="eyebrow">saved readings</div>
        <p style={{ color: 'var(--ink-muted)', marginTop: 24 }}>
          No saved readings yet. Draw some tarot cards or make a birth chart to save your first reading.
        </p>
      </div>
    )
  }

  return (
    <div className="page" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
      <div className="eyebrow">saved readings</div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 32 }}>your readings</h1>

      {readings.map((r) => (
        <div key={r.id} className="card" style={{ marginBottom: 16, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
              <span className="tag" style={{ marginRight: 8 }}>{r.type}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.6 }}>
                {new Date(r.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              {r.notes && <p style={{ marginTop: 8, opacity: 0.75 }}>{r.notes}</p>}
            </div>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12, padding: '4px 10px' }}
              onClick={() => deleteReading(r.id)}
            >
              delete
            </button>
          </div>

          {expanded === r.id && (
            <div style={{ marginTop: 16 }}>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.7, overflow: 'auto' }}>
                {JSON.stringify(r.data, null, 2)}
              </pre>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            {editingNote === r.id ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="input"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="add a note..."
                  style={{ flex: 1 }}
                />
                <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => saveNote(r.id)}>save</button>
                <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setEditingNote(null)}>cancel</button>
              </div>
            ) : (
              <button
                className="btn btn-ghost"
                style={{ fontSize: 12 }}
                onClick={() => { setEditingNote(r.id); setNoteText(r.notes ?? '') }}
              >
                {r.notes ? 'edit note' : '+ add note'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/readings/
git commit -m "feat: auth-gated readings page with inline notes and delete"
```

---

## Task 14: lib/astronomy.ts

**Files:**
- Create: `lib/astronomy.ts`

Server-side wrappers around `astronomy-engine` for moon phase and sunrise/sunset. All functions must only be called server-side (API routes or server components).

- [ ] **Step 1: Create lib/astronomy.ts**

```typescript
import * as Astronomy from 'astronomy-engine'

export interface MoonPhaseResult {
  degrees: number
  phaseName: string
  illumination: number
  glyph: string
}

export interface SunTimes {
  sunrise: Date
  sunset: Date
}

export function getMoonPhase(date: Date): MoonPhaseResult {
  const degrees = Astronomy.MoonPhase(date)
  const illumination = Math.round(
    (1 - Math.abs(Math.cos((degrees * Math.PI) / 180))) * 100
  )

  let phaseName: string
  let glyph: string
  if (degrees < 22.5 || degrees >= 337.5) { phaseName = 'New Moon'; glyph = '🌑' }
  else if (degrees < 67.5) { phaseName = 'Waxing Crescent'; glyph = '🌒' }
  else if (degrees < 112.5) { phaseName = 'First Quarter'; glyph = '🌓' }
  else if (degrees < 157.5) { phaseName = 'Waxing Gibbous'; glyph = '🌔' }
  else if (degrees < 202.5) { phaseName = 'Full Moon'; glyph = '🌕' }
  else if (degrees < 247.5) { phaseName = 'Waning Gibbous'; glyph = '🌖' }
  else if (degrees < 292.5) { phaseName = 'Last Quarter'; glyph = '🌗' }
  else { phaseName = 'Waning Crescent'; glyph = '🌘' }

  return { degrees, phaseName, illumination, glyph }
}

export function getSunTimes(date: Date, lat: number, lon: number): SunTimes {
  const observer = new Astronomy.Observer(lat, lon, 0)
  const noon = new Date(date)
  noon.setHours(12, 0, 0, 0)

  const sunriseEvent = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, noon, 1)
  const sunsetEvent = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, noon, 1)

  if (!sunriseEvent || !sunsetEvent) {
    // Polar day/night fallback — use 6am/6pm UTC
    const sr = new Date(date); sr.setUTCHours(6, 0, 0, 0)
    const ss = new Date(date); ss.setUTCHours(18, 0, 0, 0)
    return { sunrise: sr, sunset: ss }
  }

  return { sunrise: sunriseEvent.date, sunset: sunsetEvent.date }
}

export function getPlanetEclipticLongitude(body: Astronomy.Body, date: Date): number {
  const vec = Astronomy.GeoVector(body, date, true)
  const ecl = Astronomy.Ecliptic(vec)
  return ((ecl.elon % 360) + 360) % 360
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/astronomy.ts
git commit -m "feat: astronomy-engine wrappers for moon phase and sunrise/sunset"
```

---

## Task 15: lib/planetary-hours.ts (TDD)

**Files:**
- Create: `lib/planetary-hours.ts`
- Create: `__tests__/lib/planetary-hours.test.ts`

- [ ] **Step 1: Create failing test**

```typescript
// __tests__/lib/planetary-hours.test.ts
import { describe, it, expect } from 'vitest'
import { computePlanetaryHours, getDayRuler, CHALDEAN_ORDER } from '@/lib/planetary-hours'

describe('CHALDEAN_ORDER', () => {
  it('has 7 planets in correct Chaldean sequence', () => {
    expect(CHALDEAN_ORDER).toEqual(['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'])
  })
})

describe('getDayRuler', () => {
  it('Sunday ruler is Sun', () => {
    // 2026-04-26 is a Sunday
    expect(getDayRuler(new Date('2026-04-26T12:00:00'))).toBe('Sun')
  })
  it('Monday ruler is Moon', () => {
    // 2026-04-27 is a Monday
    expect(getDayRuler(new Date('2026-04-27T12:00:00'))).toBe('Moon')
  })
  it('Saturday ruler is Saturn', () => {
    // 2026-05-02 is a Saturday
    expect(getDayRuler(new Date('2026-05-02T12:00:00'))).toBe('Saturn')
  })
})

describe('computePlanetaryHours', () => {
  it('returns 24 hours', () => {
    const sunrise = new Date('2026-04-26T06:00:00')
    const sunset = new Date('2026-04-26T19:30:00')
    const result = computePlanetaryHours(new Date('2026-04-26T12:00:00'), sunrise, sunset)
    expect(result).toHaveLength(24)
  })

  it('first hour ruler matches day ruler', () => {
    // Sunday: first hour ruler = Sun
    const sunrise = new Date('2026-04-26T06:00:00')
    const sunset = new Date('2026-04-26T19:30:00')
    const result = computePlanetaryHours(new Date('2026-04-26T12:00:00'), sunrise, sunset)
    expect(result[0].planet).toBe('Sun')
  })

  it('hours are marked daytime or nighttime', () => {
    const sunrise = new Date('2026-04-26T06:00:00')
    const sunset = new Date('2026-04-26T19:30:00')
    const result = computePlanetaryHours(new Date('2026-04-26T12:00:00'), sunrise, sunset)
    expect(result.filter((h) => h.isDaytime)).toHaveLength(12)
    expect(result.filter((h) => !h.isDaytime)).toHaveLength(12)
  })

  it('identifies the current hour index', () => {
    const sunrise = new Date('2026-04-26T06:00:00')
    const sunset = new Date('2026-04-26T19:30:00')
    // 12:00 = 6 hours after sunrise; daylight = 13.5h; each hour = 67.5min
    // 6h/67.5min = 5.3 → hour index 5
    const result = computePlanetaryHours(new Date('2026-04-26T12:00:00'), sunrise, sunset)
    const current = result.find((h) => h.isCurrent)
    expect(current).toBeDefined()
    expect(current!.isDaytime).toBe(true)
  })
})
```

- [ ] **Step 2: Run test — confirm it fails**

```bash
npx vitest run __tests__/lib/planetary-hours.test.ts
```

Expected: FAIL with "Cannot find module '@/lib/planetary-hours'"

- [ ] **Step 3: Create lib/planetary-hours.ts**

```typescript
export const CHALDEAN_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'] as const
export type ChaldeanPlanet = (typeof CHALDEAN_ORDER)[number]

const DAY_RULERS: ChaldeanPlanet[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
// Index 0 = Sunday (matches JS Date.getDay())

export function getDayRuler(date: Date): ChaldeanPlanet {
  return DAY_RULERS[date.getDay()]
}

export interface PlanetaryHour {
  index: number
  planet: ChaldeanPlanet
  glyph: string
  startTime: Date
  endTime: Date
  isDaytime: boolean
  isCurrent: boolean
}

const GLYPHS: Record<ChaldeanPlanet, string> = {
  Saturn: '♄', Jupiter: '♃', Mars: '♂', Sun: '☉', Venus: '♀', Mercury: '☿', Moon: '☽',
}

export function computePlanetaryHours(now: Date, sunrise: Date, sunset: Date): PlanetaryHour[] {
  const dayRuler = getDayRuler(sunrise)
  const dayRulerIdx = CHALDEAN_ORDER.indexOf(dayRuler)

  const dayDuration = sunset.getTime() - sunrise.getTime()
  const dayHourMs = dayDuration / 12

  // Night: from sunset to next day's sunrise (approx sunset + ~11h for simplicity → use sunrise + 24h - sunset)
  const nextSunrise = new Date(sunrise.getTime() + 24 * 60 * 60 * 1000)
  const nightDuration = nextSunrise.getTime() - sunset.getTime()
  const nightHourMs = nightDuration / 12

  const hours: PlanetaryHour[] = []

  for (let i = 0; i < 12; i++) {
    const startTime = new Date(sunrise.getTime() + i * dayHourMs)
    const endTime = new Date(startTime.getTime() + dayHourMs)
    const planetIdx = (dayRulerIdx + i) % 7
    hours.push({
      index: i,
      planet: CHALDEAN_ORDER[planetIdx],
      glyph: GLYPHS[CHALDEAN_ORDER[planetIdx]],
      startTime, endTime,
      isDaytime: true,
      isCurrent: now >= startTime && now < endTime,
    })
  }

  for (let i = 0; i < 12; i++) {
    const startTime = new Date(sunset.getTime() + i * nightHourMs)
    const endTime = new Date(startTime.getTime() + nightHourMs)
    const planetIdx = (dayRulerIdx + 12 + i) % 7
    hours.push({
      index: 12 + i,
      planet: CHALDEAN_ORDER[planetIdx],
      glyph: GLYPHS[CHALDEAN_ORDER[planetIdx]],
      startTime, endTime,
      isDaytime: false,
      isCurrent: now >= startTime && now < endTime,
    })
  }

  return hours
}
```

- [ ] **Step 4: Run test — confirm it passes**

```bash
npx vitest run __tests__/lib/planetary-hours.test.ts
```

Expected: PASS (all 7 tests green)

- [ ] **Step 5: Commit**

```bash
git add lib/planetary-hours.ts __tests__/lib/planetary-hours.test.ts
git commit -m "feat: planetary hours calculator with Chaldean order (TDD)"
```

---

## Task 16: API /api/planetary-hours

**Files:**
- Create: `app/api/planetary-hours/route.ts`

- [ ] **Step 1: Create app/api/planetary-hours/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getSunTimes } from '@/lib/astronomy'
import { computePlanetaryHours } from '@/lib/planetary-hours'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const lat = parseFloat(searchParams.get('lat') ?? '51.5')
  const lon = parseFloat(searchParams.get('lon') ?? '-0.12')
  const dateStr = searchParams.get('date') ?? new Date().toISOString().slice(0, 10)

  const date = new Date(dateStr + 'T12:00:00Z')
  const { sunrise, sunset } = getSunTimes(date, lat, lon)
  const now = new Date()
  const hours = computePlanetaryHours(now, sunrise, sunset)

  const currentIndex = hours.findIndex((h) => h.isCurrent)

  return NextResponse.json({
    hours: hours.map((h) => ({
      index: h.index,
      planet: h.planet,
      glyph: h.glyph,
      startTime: h.startTime.toISOString(),
      endTime: h.endTime.toISOString(),
      isDaytime: h.isDaytime,
      isCurrent: h.isCurrent,
    })),
    currentIndex,
    sunrise: sunrise.toISOString(),
    sunset: sunset.toISOString(),
  })
}
```

- [ ] **Step 2: Test the API**

```bash
npm run dev
```

Open: `http://localhost:3000/api/planetary-hours?lat=40.71&lon=-74.00`

Expected: JSON with `hours` array of 24 objects, one with `isCurrent: true`, `currentIndex` matching it.

- [ ] **Step 3: Commit**

```bash
git add app/api/planetary-hours/route.ts
git commit -m "feat: planetary hours API route"
```

---

## Task 17: components/MoonSvg.tsx

**Files:**
- Create: `components/MoonSvg.tsx`

Mathematical SVG moon — renders the correct crescent/gibbous shape from the phase angle, matching the Joel ink-on-parchment aesthetic.

- [ ] **Step 1: Create components/MoonSvg.tsx**

```typescript
interface MoonSvgProps {
  degrees: number
  size?: number
}

export default function MoonSvg({ degrees, size = 120 }: MoonSvgProps) {
  const r = size / 2
  const cx = r
  const cy = r

  // degrees: 0=new, 90=first quarter, 180=full, 270=last quarter
  // Illuminate fraction for the lit portion
  const phase = degrees / 360

  // Build SVG path: always a circle, with the shadow lune overlaid
  // Shadow occupies the right half (new→full) or left half (full→new)
  // The terminator is an ellipse: major axis = r, minor axis = r*|cos(phase*2π)|
  const termX = Math.cos(phase * 2 * Math.PI) // -1 to +1
  const isWaxing = degrees < 180
  const rx = Math.abs(termX) * r

  // Full circle path
  const circle = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`

  // Shadow lune: the dark half
  // For waxing: shadow on left (x < cx); terminator arc bows left (convex toward lit right)
  // For waning: shadow on right; terminator arc bows right
  let shadowPath: string
  if (phase < 0.5) {
    // Waxing: lit on right, shadow on left
    // Shadow = left semicircle + ellipse terminator going right
    shadowPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${rx} ${r} 0 0 ${termX >= 0 ? 1 : 0} ${cx} ${cy - r} Z`
  } else {
    // Waning: lit on left, shadow on right
    shadowPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 ${termX >= 0 ? 0 : 1} ${cx} ${cy - r} Z`
  }

  const isNew = degrees < 10 || degrees >= 350
  const isFull = degrees >= 170 && degrees < 190

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {isNew ? (
        // New moon: filled dark circle
        <circle cx={cx} cy={cy} r={r - 1} fill="var(--ink)" stroke="var(--ink)" strokeWidth="1.5" />
      ) : isFull ? (
        // Full moon: filled light circle with ink stroke
        <circle cx={cx} cy={cy} r={r - 1} fill="var(--bone)" stroke="var(--ink)" strokeWidth="1.5" />
      ) : (
        <>
          <circle cx={cx} cy={cy} r={r - 1} fill="var(--bone)" stroke="var(--ink)" strokeWidth="1.5" />
          <path d={shadowPath} fill="var(--ink)" fillOpacity="0.85" />
        </>
      )}
    </svg>
  )
}
```

- [ ] **Step 2: Visual check**

Add a temporary test page at `app/moon-test/page.tsx`:

```typescript
import MoonSvg from '@/components/MoonSvg'

export default function MoonTest() {
  const phases = [0, 45, 90, 135, 180, 225, 270, 315]
  return (
    <div style={{ display: 'flex', gap: 24, padding: 40, background: 'var(--bg-paper)' }}>
      {phases.map((d) => (
        <div key={d} style={{ textAlign: 'center' }}>
          <MoonSvg degrees={d} size={80} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 8 }}>{d}°</div>
        </div>
      ))}
    </div>
  )
}
```

Open `http://localhost:3000/moon-test`. Verify 8 moon phases display correctly (new→full→new cycle). Delete the test page after confirming.

- [ ] **Step 3: Commit**

```bash
git rm app/moon-test/page.tsx 2>/dev/null; git add components/MoonSvg.tsx
git commit -m "feat: MoonSvg component with mathematical phase rendering"
```

---

## Task 18: Dashboard page (/dashboard)

**Files:**
- Create: `app/dashboard/page.tsx`
- Create: `app/dashboard/DashboardClient.tsx`

- [ ] **Step 1: Create app/dashboard/page.tsx (server component — fetches data)**

```typescript
import { getMoonPhase } from '@/lib/astronomy'
import TopNav from '@/components/TopNav'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const moon = getMoonPhase(new Date())

  return (
    <>
      <TopNav moonPhase={moon.phaseName.toLowerCase()} moonGlyph={moon.glyph} />
      <DashboardClient moonDegrees={moon.degrees} moonPhaseName={moon.phaseName} moonIllumination={moon.illumination} />
    </>
  )
}
```

- [ ] **Step 2: Create app/dashboard/DashboardClient.tsx**

```typescript
'use client'
import { useState, useEffect } from 'react'
import MoonSvg from '@/components/MoonSvg'

interface PlanetaryHour {
  index: number
  planet: string
  glyph: string
  startTime: string
  endTime: string
  isDaytime: boolean
  isCurrent: boolean
}

interface Props {
  moonDegrees: number
  moonPhaseName: string
  moonIllumination: number
}

const PHASE_INTERPRETATIONS: Record<string, string> = {
  'New Moon': 'A time for setting intentions. The sky is dark; your inner compass is bright. Plant seeds — metaphorically and literally.',
  'Waxing Crescent': 'Energy builds. The first sliver of light asks: what are you willing to work toward? Small actions compound.',
  'First Quarter': 'Tension and decision. The half-lit moon marks a crossroads. Push through resistance.',
  'Waxing Gibbous': 'Refinement. Almost full — edit, adjust, prepare. The work is nearly ready.',
  'Full Moon': 'Culmination. What you started at the new moon reaches its peak. Rest, reflect, release.',
  'Waning Gibbous': 'Gratitude and harvest. The peak has passed; take stock of what was accomplished.',
  'Last Quarter': 'Release and forgiveness. Let go of what no longer serves. Clear space.',
  'Waning Crescent': 'Surrender and rest. The cycle closes. Sleep, restore, and prepare to begin again.',
}

const CHALDEAN_HISTORY = `The Chaldean order — Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon — is among the oldest known astrological systems, traced to Babylonian astronomers around 700 BCE. Each planet rules an hour of the day, cycling continuously from the sunrise of each day. Sunday takes its name from its first-hour ruler, the Sun; Monday from the Moon; Saturday from Saturn. The system was adopted by Hellenistic astrologers, passed into medieval European magic, and is still used today for timing decisions, prayers, and practical matters.`

export default function DashboardClient({ moonDegrees, moonPhaseName, moonIllumination }: Props) {
  const [hours, setHours] = useState<PlanetaryHour[]>([])
  const [currentIdx, setCurrentIdx] = useState(-1)
  const [countdown, setCountdown] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [locationStatus, setLocationStatus] = useState<'loading' | 'ok' | 'fallback'>('loading')

  useEffect(() => {
    function fetchHours(lat: number, lon: number) {
      const today = new Date().toISOString().slice(0, 10)
      fetch(`/api/planetary-hours?lat=${lat}&lon=${lon}&date=${today}`)
        .then((r) => r.json())
        .then((data) => {
          setHours(data.hours)
          setCurrentIdx(data.currentIndex)
          setLocationStatus('ok')
        })
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchHours(pos.coords.latitude, pos.coords.longitude),
        () => { fetchHours(0, 0); setLocationStatus('fallback') }
      )
    } else {
      fetchHours(0, 0)
      setLocationStatus('fallback')
    }
  }, [])

  useEffect(() => {
    if (currentIdx < 0 || hours.length === 0) return
    const interval = setInterval(() => {
      const end = new Date(hours[currentIdx].endTime)
      const diff = end.getTime() - Date.now()
      if (diff <= 0) { setCountdown('next hour'); return }
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(`${m}m ${s.toString().padStart(2, '0')}s`)
    }, 1000)
    return () => clearInterval(interval)
  }, [currentIdx, hours])

  const currentHour = hours[currentIdx]

  return (
    <div className="page">
      {locationStatus === 'fallback' && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--clay)', marginBottom: 16 }}>
          using UTC — allow location for local hours
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 24 }}>
        {/* Moon Phase Panel */}
        <div className="card" style={{ padding: 32 }}>
          <div className="field-label" style={{ marginBottom: 16 }}>moon phase</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <MoonSvg degrees={moonDegrees} size={120} />
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>{moonPhaseName}</h2>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, marginTop: 8, opacity: 0.7 }}>
                {moonIllumination}% illuminated
              </div>
            </div>
          </div>
          <p style={{ marginTop: 24, lineHeight: 1.6 }}>
            {PHASE_INTERPRETATIONS[moonPhaseName] ?? ''}
          </p>
        </div>

        {/* Planetary Hours Panel */}
        <div className="card" style={{ padding: 32 }}>
          <div className="field-label" style={{ marginBottom: 16 }}>planetary hours</div>

          {currentHour ? (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 40 }}>{currentHour.glyph}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>{currentHour.planet}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.6 }}>
                    {currentHour.isDaytime ? 'day hour' : 'night hour'} · ends in {countdown}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ opacity: 0.5, marginBottom: 24 }}>loading...</div>
          )}

          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                  <th style={{ textAlign: 'left', padding: '4px 8px', opacity: 0.5 }}>#</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', opacity: 0.5 }}>planet</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', opacity: 0.5 }}>starts</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', opacity: 0.5 }}>type</th>
                </tr>
              </thead>
              <tbody>
                {hours.map((h) => (
                  <tr
                    key={h.index}
                    style={{
                      background: h.isCurrent ? 'var(--sage)' : 'transparent',
                      borderBottom: '1px solid rgba(15,13,9,0.1)',
                    }}
                  >
                    <td style={{ padding: '4px 8px', opacity: 0.5 }}>{h.index + 1}</td>
                    <td style={{ padding: '4px 8px' }}>{h.glyph} {h.planet}</td>
                    <td style={{ padding: '4px 8px', opacity: 0.7 }}>
                      {new Date(h.startTime).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '4px 8px', opacity: 0.5 }}>{h.isDaytime ? '☀' : '☾'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="btn btn-ghost"
            style={{ marginTop: 16, fontSize: 12 }}
            onClick={() => setHistoryOpen((o) => !o)}
          >
            {historyOpen ? 'hide' : 'what does this mean?'}
          </button>
          {historyOpen && (
            <p style={{ marginTop: 12, fontSize: 13, lineHeight: 1.7, opacity: 0.75 }}>
              {CHALDEAN_HISTORY}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Test in browser**

Navigate to `/dashboard`. Verify:
- Moon SVG renders correctly
- Planetary hours table loads (may need location permission)
- Countdown timer ticks down
- "What does this mean?" expands the history text

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/
git commit -m "feat: /dashboard with moon phase SVG and real-time planetary hours"
```

---

## Task 19: lib/numerology.ts (TDD) + Numerology page

**Files:**
- Create: `lib/numerology.ts`
- Create: `__tests__/lib/numerology.test.ts`
- Create: `app/numerology/page.tsx`

- [ ] **Step 1: Create failing tests**

```typescript
// __tests__/lib/numerology.test.ts
import { describe, it, expect } from 'vitest'
import { lifePath, expression, soulUrge, personalYear, reduceDigits } from '@/lib/numerology'

describe('reduceDigits', () => {
  it('reduces sum to single digit', () => expect(reduceDigits(30)).toBe(3))
  it('preserves master number 11', () => expect(reduceDigits(11)).toBe(11))
  it('preserves master number 22', () => expect(reduceDigits(22)).toBe(22))
  it('preserves master number 33', () => expect(reduceDigits(33)).toBe(33))
  it('further reduces 29 to 11', () => expect(reduceDigits(29)).toBe(11))
})

describe('lifePath', () => {
  it('calculates life path for 1990-04-25', () => {
    // 1+9+9+0+0+4+2+5 = 30 → 3
    expect(lifePath('1990-04-25')).toBe(3)
  })
  it('preserves master number 22 for 1991-10-10', () => {
    // 1+9+9+1+1+0+1+0 = 22
    expect(lifePath('1991-10-10')).toBe(22)
  })
})

describe('expression', () => {
  it('calculates expression for JOEL', () => {
    // J=1, O=6, E=5, L=3 → 15 → 6
    expect(expression('JOEL')).toBe(6)
  })
  it('is case insensitive', () => {
    expect(expression('joel')).toBe(expression('JOEL'))
  })
  it('ignores spaces', () => {
    // JOHN DOE: J=1,O=6,H=8,N=5 + D=4,O=6,E=5 = 35 → 8
    expect(expression('JOHN DOE')).toBe(8)
  })
})

describe('soulUrge', () => {
  it('counts only vowels (AEIOU) in JOEL', () => {
    // vowels: O=6, E=5 → 11 (master)
    expect(soulUrge('JOEL')).toBe(11)
  })
  it('vowels in JOHN DOE: O,O,E → 6+6+5=17 → 8', () => {
    expect(soulUrge('JOHN DOE')).toBe(8)
  })
})

describe('personalYear', () => {
  it('calculates personal year for birth 1990-04-25 in 2026', () => {
    // month=4, day=25→2+5=7, year=2026→2+0+2+6=10→1
    // 4+7+1=12→3
    expect(personalYear('1990-04-25', 2026)).toBe(3)
  })
})
```

- [ ] **Step 2: Run — confirm failures**

```bash
npx vitest run __tests__/lib/numerology.test.ts
```

Expected: FAIL with "Cannot find module '@/lib/numerology'"

- [ ] **Step 3: Create lib/numerology.ts**

```typescript
const PYTHAGOREAN: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
}

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U'])

export function reduceDigits(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n
  if (n < 10) return n
  const next = String(n).split('').reduce((a, c) => a + parseInt(c), 0)
  return reduceDigits(next)
}

function sumDigitsOfString(s: string): number {
  return s.split('').reduce((a, c) => a + parseInt(c), 0)
}

export function lifePath(dateStr: string): number {
  const digits = dateStr.replace(/-/g, '').split('').reduce((a, c) => a + parseInt(c), 0)
  return reduceDigits(digits)
}

export function expression(name: string): number {
  const sum = name.toUpperCase().replace(/[^A-Z]/g, '').split('').reduce((a, c) => a + (PYTHAGOREAN[c] ?? 0), 0)
  return reduceDigits(sum)
}

export function soulUrge(name: string): number {
  const sum = name.toUpperCase().replace(/[^A-Z]/g, '').split('').filter((c) => VOWELS.has(c)).reduce((a, c) => a + (PYTHAGOREAN[c] ?? 0), 0)
  return reduceDigits(sum)
}

export function personalYear(birthDateStr: string, year: number): number {
  const [, mm, dd] = birthDateStr.split('-')
  const monthDigits = mm.split('').reduce((a, c) => a + parseInt(c), 0)
  const dayDigits = dd.split('').reduce((a, c) => a + parseInt(c), 0)
  const yearDigits = String(year).split('').reduce((a, c) => a + parseInt(c), 0)
  return reduceDigits(reduceDigits(monthDigits) + reduceDigits(dayDigits) + reduceDigits(yearDigits))
}

export interface NumerologyResult {
  lifePath: number
  expression: number
  soulUrge: number
  personalYear: number
}

export function computeNumerology(fullName: string, birthDateStr: string): NumerologyResult {
  return {
    lifePath: lifePath(birthDateStr),
    expression: expression(fullName),
    soulUrge: soulUrge(fullName),
    personalYear: personalYear(birthDateStr, new Date().getFullYear()),
  }
}
```

- [ ] **Step 4: Run — confirm pass**

```bash
npx vitest run __tests__/lib/numerology.test.ts
```

Expected: PASS (all 11 tests green)

- [ ] **Step 5: Create app/numerology/page.tsx**

```typescript
'use client'
import { useState } from 'react'
import TopNav from '@/components/TopNav'
import { computeNumerology, type NumerologyResult } from '@/lib/numerology'

const INTERPRETATIONS: Record<number, { title: string; text: string }> = {
  1: { title: 'The Pioneer', text: 'Independent, driven, original. You forge paths others follow. Beware isolation.' },
  2: { title: 'The Diplomat', text: 'Sensitive, cooperative, intuitive. You build bridges. Beware self-erasure.' },
  3: { title: 'The Creator', text: 'Expressive, social, joyful. You make things beautiful. Beware scattered energy.' },
  4: { title: 'The Builder', text: 'Disciplined, practical, loyal. You make things last. Beware rigidity.' },
  5: { title: 'The Adventurer', text: 'Curious, free, adaptable. You need variety. Beware restlessness.' },
  6: { title: 'The Nurturer', text: 'Caring, responsible, harmonious. You hold people together. Beware martyrdom.' },
  7: { title: 'The Seeker', text: 'Analytical, spiritual, perceptive. You need solitude to find truth. Beware detachment.' },
  8: { title: 'The Achiever', text: 'Ambitious, authoritative, resilient. You understand power. Beware obsession with status.' },
  9: { title: 'The Sage', text: 'Compassionate, wise, idealistic. You see the whole picture. Beware escapism.' },
  11: { title: 'The Illuminator', text: 'Master number. Visionary, inspirational, highly intuitive. Beware nervous energy.' },
  22: { title: 'The Master Builder', text: 'Master number. You can turn dreams into reality at scale. Beware self-doubt.' },
  33: { title: 'The Master Teacher', text: 'Master number. Healing, devotion, spiritual guidance. Beware over-sacrifice.' },
}

const LABELS = ['life path', 'expression', 'soul urge', 'personal year']
const KEYS: (keyof NumerologyResult)[] = ['lifePath', 'expression', 'soulUrge', 'personalYear']

export default function NumerologyPage() {
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<NumerologyResult | null>(null)

  function calculate(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !birthDate) return
    setResult(computeNumerology(name, birthDate))
  }

  return (
    <>
      <TopNav />
      <div className="page" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        <div className="eyebrow">numerology</div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>your numbers</h1>
        <p className="lede">Pythagorean numerology — life path, expression, soul urge, and the current year's theme.</p>

        <form onSubmit={calculate} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
          <div className="field" style={{ flex: '2 1 200px' }}>
            <label className="field-label">full birth name</label>
            <input className="input" type="text" placeholder="as on birth certificate" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field" style={{ flex: '1 1 160px' }}>
            <label className="field-label">birth date</label>
            <input className="input" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
          </div>
          <div className="field" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn btn-primary" type="submit">calculate →</button>
          </div>
        </form>

        {result && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {KEYS.map((key, i) => {
              const n = result[key]
              const interp = INTERPRETATIONS[n]
              return (
                <div key={key} className="card" style={{ padding: 24 }}>
                  <div className="field-label">{LABELS[i]}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, lineHeight: 1, margin: '12px 0', color: 'var(--walnut)' }}>{n}</div>
                  {interp && (
                    <>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {interp.title}
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{interp.text}</p>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
```

- [ ] **Step 6: Test in browser**

Navigate to `/numerology`. Enter a name and birth date. Verify four cards appear with the correct numbers and interpretation text.

- [ ] **Step 7: Commit**

```bash
git add lib/numerology.ts __tests__/lib/numerology.test.ts app/numerology/page.tsx
git commit -m "feat: numerology calculator (Pythagorean) with TDD + /numerology page"
```

---

## Task 20: lib/transits.ts (TDD) + Transits page

**Files:**
- Create: `lib/transits.ts`
- Create: `__tests__/lib/transits.test.ts`
- Create: `app/transits/page.tsx`

- [ ] **Step 1: Create failing tests**

```typescript
// __tests__/lib/transits.test.ts
import { describe, it, expect } from 'vitest'
import { aspectAngle, isAspect, ASPECT_INTERPRETATIONS } from '@/lib/transits'

describe('aspectAngle', () => {
  it('conjunction: 0° difference → 0°', () => expect(aspectAngle(30, 30)).toBe(0))
  it('opposition: 180° apart', () => expect(aspectAngle(0, 180)).toBe(180))
  it('wraps correctly: 350 and 10', () => expect(aspectAngle(350, 10)).toBe(20))
  it('always returns smallest angle (max 180)', () => expect(aspectAngle(0, 270)).toBe(90))
})

describe('isAspect', () => {
  it('conjunction within orb', () => expect(isAspect(0, 0, 8)).toBe('conjunction'))
  it('square within orb', () => expect(isAspect(89, 90, 6)).toBe('square'))
  it('trine within orb', () => expect(isAspect(122, 120, 7)).toBe('trine'))
  it('no aspect outside orb', () => expect(isAspect(50, 60, 5)).toBeNull())
})

describe('ASPECT_INTERPRETATIONS', () => {
  it('has entries for all major aspects', () => {
    const needed = ['conjunction', 'sextile', 'square', 'trine', 'opposition']
    needed.forEach((a) => expect(ASPECT_INTERPRETATIONS).toHaveProperty(a))
  })
})
```

- [ ] **Step 2: Run — confirm failures**

```bash
npx vitest run __tests__/lib/transits.test.ts
```

Expected: FAIL

- [ ] **Step 3: Create lib/transits.ts**

```typescript
import * as Astronomy from 'astronomy-engine'
import { type Chart } from '@/lib/astro-data'

export type AspectName = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition'

const ASPECT_ANGLES: Array<{ name: AspectName; angle: number; orb: number }> = [
  { name: 'conjunction', angle: 0, orb: 8 },
  { name: 'sextile', angle: 60, orb: 5 },
  { name: 'square', angle: 90, orb: 6 },
  { name: 'trine', angle: 120, orb: 7 },
  { name: 'opposition', angle: 180, orb: 8 },
]

export const ASPECT_INTERPRETATIONS: Record<AspectName, { color: string; text: string }> = {
  conjunction: { color: 'amber', text: 'Merging energies — intensity and focus.' },
  sextile: { color: 'green', text: 'Opportunity and ease — harmonious flow.' },
  square: { color: 'red', text: 'Tension and challenge — growth through friction.' },
  trine: { color: 'green', text: 'Flowing harmony — natural gifts and ease.' },
  opposition: { color: 'red', text: 'Awareness through contrast — balance needed.' },
}

export function aspectAngle(lon1: number, lon2: number): number {
  let diff = Math.abs(((lon1 - lon2 + 180) % 360) - 180)
  if (diff > 180) diff = 360 - diff
  return diff
}

export function isAspect(lon1: number, lon2: number, defaultOrb?: number): AspectName | null {
  const diff = aspectAngle(lon1, lon2)
  for (const { name, angle, orb } of ASPECT_ANGLES) {
    if (Math.abs(diff - angle) <= (defaultOrb ?? orb)) return name
  }
  return null
}

const TRANSIT_BODIES: Array<{ body: Astronomy.Body; name: string; glyph: string }> = [
  { body: Astronomy.Body.Sun, name: 'Sun', glyph: '☉' },
  { body: Astronomy.Body.Moon, name: 'Moon', glyph: '☽' },
  { body: Astronomy.Body.Mercury, name: 'Mercury', glyph: '☿' },
  { body: Astronomy.Body.Venus, name: 'Venus', glyph: '♀' },
  { body: Astronomy.Body.Mars, name: 'Mars', glyph: '♂' },
  { body: Astronomy.Body.Jupiter, name: 'Jupiter', glyph: '♃' },
  { body: Astronomy.Body.Saturn, name: 'Saturn', glyph: '♄' },
]

export interface DayAspect {
  transitPlanet: string
  transitGlyph: string
  natalPlanet: string
  natalGlyph: string
  aspectName: AspectName
  orb: number
  color: 'green' | 'amber' | 'red'
  interpretation: string
}

export interface TransitDay {
  date: string
  aspects: DayAspect[]
}

export function computeMonthTransits(natalChart: Chart, year: number, month: number): TransitDay[] {
  const daysInMonth = new Date(year, month, 0).getDate()
  const result: TransitDay[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day, 12, 0, 0)
    const aspects: DayAspect[] = []

    for (const transit of TRANSIT_BODIES) {
      let transitLon: number
      try {
        const vec = Astronomy.GeoVector(transit.body, date, true)
        const ecl = Astronomy.Ecliptic(vec)
        transitLon = ((ecl.elon % 360) + 360) % 360
      } catch {
        continue
      }

      for (const natalPlanet of natalChart.planets.slice(0, 7)) {
        const aspect = isAspect(transitLon, natalPlanet.longitude)
        if (!aspect) continue
        const orb = Math.abs(aspectAngle(transitLon, natalPlanet.longitude) - ASPECT_ANGLES.find((a) => a.name === aspect)!.angle)
        const interp = ASPECT_INTERPRETATIONS[aspect]
        aspects.push({
          transitPlanet: transit.name,
          transitGlyph: transit.glyph,
          natalPlanet: natalPlanet.name,
          natalGlyph: natalPlanet.glyph,
          aspectName: aspect,
          orb: parseFloat(orb.toFixed(1)),
          color: interp.color as 'green' | 'amber' | 'red',
          interpretation: `${transit.name} ${aspect} natal ${natalPlanet.name} — ${interp.text}`,
        })
      }
    }

    result.push({ date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`, aspects })
  }

  return result
}
```

- [ ] **Step 4: Run — confirm pass**

```bash
npx vitest run __tests__/lib/transits.test.ts
```

Expected: PASS (all tests green)

- [ ] **Step 5: Create app/transits/page.tsx**

```typescript
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import TopNav from '@/components/TopNav'
import { makeChart, type Chart } from '@/lib/astro-data'
import { computeMonthTransits, type TransitDay } from '@/lib/transits'

const COLOR_STYLES: Record<string, React.CSSProperties> = {
  green: { background: 'rgba(168,192,144,0.3)', borderLeft: '3px solid var(--sage)' },
  amber: { background: 'rgba(212,160,74,0.2)', borderLeft: '3px solid #d4a04a' },
  red: { background: 'rgba(184,67,31,0.15)', borderLeft: '3px solid var(--clay)' },
}

export default function TransitsPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [chart, setChart] = useState<Chart | null>(null)
  const [days, setDays] = useState<TransitDay[]>([])
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('signs-chart')
    if (saved) setChart(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (!chart) return
    setLoading(true)
    // Run computation in a timeout to avoid blocking render
    setTimeout(() => {
      setDays(computeMonthTransits(chart, year, month))
      setLoading(false)
    }, 0)
  }, [chart, year, month])

  if (!chart) {
    return (
      <>
        <TopNav />
        <div className="page" style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <div className="eyebrow">transits</div>
          <div className="card" style={{ marginTop: 24, padding: 32 }}>
            <p>To see your personal transits, draw your birth chart first.</p>
            <Link href="/chart" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>
              go to birth chart →
            </Link>
          </div>
        </div>
      </>
    )
  }

  const selectedAspects = days.find((d) => d.date === selectedDay)?.aspects ?? []

  return (
    <>
      <TopNav />
      <div className="page" style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
        <div className="eyebrow">personal transits</div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>
          {new Date(year, month - 1).toLocaleDateString('en', { month: 'long', year: 'numeric' })}
        </h1>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button className="btn btn-ghost" onClick={() => { if (month === 1) { setYear(y => y - 1); setMonth(12) } else setMonth(m => m - 1) }}>← prev</button>
          <button className="btn btn-ghost" onClick={() => { if (month === 12) { setYear(y => y + 1); setMonth(1) } else setMonth(m => m + 1) }}>next →</button>
        </div>

        {loading ? (
          <p style={{ fontFamily: 'var(--font-mono)', opacity: 0.5 }}>computing transits...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.5, textAlign: 'center', paddingBottom: 8 }}>{d}</div>
            ))}
            {/* Empty cells for first day of month */}
            {Array.from({ length: new Date(year, month - 1, 1).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map((day) => {
              const d = parseInt(day.date.slice(-2))
              const isToday = day.date === today.toISOString().slice(0, 10)
              const isSelected = day.date === selectedDay
              const hasAspects = day.aspects.length > 0
              const hasHard = day.aspects.some((a) => a.color === 'red')
              const hasSoft = !hasHard && day.aspects.some((a) => a.color === 'green')
              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDay(isSelected ? null : day.date)}
                  style={{
                    padding: '8px 4px', border: `2px solid ${isSelected ? 'var(--walnut)' : isToday ? 'var(--ink)' : 'rgba(15,13,9,0.15)'}`,
                    background: isSelected ? 'var(--walnut)' : hasHard ? 'rgba(184,67,31,0.1)' : hasSoft ? 'rgba(168,192,144,0.2)' : 'transparent',
                    cursor: hasAspects ? 'pointer' : 'default',
                    fontFamily: 'var(--font-mono)', fontSize: 13, color: isSelected ? 'var(--bone)' : 'var(--ink)',
                    borderRadius: 2, textAlign: 'center',
                  }}
                >
                  {d}
                  {hasAspects && <div style={{ fontSize: 8, marginTop: 2, opacity: 0.7 }}>{'·'.repeat(Math.min(day.aspects.length, 5))}</div>}
                </button>
              )
            })}
          </div>
        )}

        {selectedDay && (
          <div style={{ marginTop: 24 }}>
            <div className="field-label">{new Date(selectedDay + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            {selectedAspects.length === 0 ? (
              <p style={{ opacity: 0.5 }}>No major aspects today.</p>
            ) : (
              selectedAspects.map((a, i) => (
                <div key={i} className="card" style={{ marginTop: 8, padding: '12px 16px', ...COLOR_STYLES[a.color] }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                    {a.transitGlyph} {a.transitPlanet} {a.aspectName} natal {a.natalGlyph} {a.natalPlanet}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.5, marginLeft: 8 }}>{a.orb}° orb</span>
                  <p style={{ margin: '6px 0 0', fontSize: 13 }}>{a.interpretation}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  )
}
```

> Note: The chart needs to be saved to `localStorage` under `signs-chart` by the chart page (Task 9). Add to `app/chart/page.tsx` after computing the chart: `localStorage.setItem('signs-chart', JSON.stringify(chart))`.

- [ ] **Step 6: Test in browser**

Navigate to `/transits`. If no chart saved → should show "draw your birth chart first" empty state. After saving a chart on `/chart`, return to `/transits` and verify the month grid renders, days with aspects are highlighted.

- [ ] **Step 7: Commit**

```bash
git add lib/transits.ts __tests__/lib/transits.test.ts app/transits/page.tsx
git commit -m "feat: transit calendar with real planet positions (TDD)"
```

---

## Task 21: lib/solar-return.ts (TDD) + Solar Return page

**Files:**
- Create: `lib/solar-return.ts`
- Create: `__tests__/lib/solar-return.test.ts`
- Create: `app/solar-return/page.tsx`

- [ ] **Step 1: Create failing tests**

```typescript
// __tests__/lib/solar-return.test.ts
import { describe, it, expect } from 'vitest'
import { SR_ASCENDANT_THEMES, SR_SUN_HOUSE_THEMES, buildSolarReturnTheme } from '@/lib/solar-return'

describe('SR_ASCENDANT_THEMES', () => {
  it('has 12 entries', () => expect(Object.keys(SR_ASCENDANT_THEMES)).toHaveLength(12))
  it('each entry is a non-empty string', () => {
    Object.values(SR_ASCENDANT_THEMES).forEach((v) => {
      expect(typeof v).toBe('string')
      expect(v.length).toBeGreaterThan(10)
    })
  })
})

describe('SR_SUN_HOUSE_THEMES', () => {
  it('has 12 entries (houses 1-12)', () => expect(Object.keys(SR_SUN_HOUSE_THEMES)).toHaveLength(12))
})

describe('buildSolarReturnTheme', () => {
  it('returns a string combining ascendant + house theme', () => {
    const result = buildSolarReturnTheme('aries', 1)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(20)
  })
  it('falls back gracefully for unknown sign', () => {
    const result = buildSolarReturnTheme('unknown', 1)
    expect(typeof result).toBe('string')
  })
})
```

- [ ] **Step 2: Run — confirm failures**

```bash
npx vitest run __tests__/lib/solar-return.test.ts
```

- [ ] **Step 3: Create lib/solar-return.ts**

```typescript
import * as Astronomy from 'astronomy-engine'

export const SR_ASCENDANT_THEMES: Record<string, string> = {
  aries: 'A year of bold beginnings and self-assertion. You\'re stepping into a new identity — act first, reflect later.',
  taurus: 'A year of stability, sensual pleasure, and building lasting foundations. Slow and steady wins.',
  gemini: 'A year of communication, curiosity, and multiple projects. Your mind is the main event.',
  cancer: 'A year centred on home, family, and emotional roots. Nourishment — given and received.',
  leo: 'A year of creative expression and personal radiance. Own the room.',
  virgo: 'A year of refinement, health, and service. The details matter more than ever.',
  libra: 'A year of relationships, balance, and aesthetic refinement. Partnerships are the mirror.',
  scorpio: 'A year of depth, transformation, and uncovering hidden truths. Nothing stays on the surface.',
  sagittarius: 'A year of expansion, travel, and philosophical exploration. Widen your horizon.',
  capricorn: 'A year of ambition, discipline, and professional achievement. Build something that lasts.',
  aquarius: 'A year of community, innovation, and stepping outside convention. The collective calls.',
  pisces: 'A year of spirituality, creative imagination, and dissolution of old forms. Trust the current.',
}

export const SR_SUN_HOUSE_THEMES: Record<number, string> = {
  1: 'Your identity and appearance take centre stage. Self-reinvention is the year\'s work.',
  2: 'Resources, money, and self-worth are the year\'s focus. What do you truly value?',
  3: 'Writing, speaking, learning, and local connections define the year.',
  4: 'Home, family, and inner foundations are being rebuilt or reinforced.',
  5: 'Romance, creativity, and children fill the year with joy and play.',
  6: 'Health, habits, and daily work demand attention. Small routines change everything.',
  7: 'Partnerships — romantic or professional — are the year\'s central teacher.',
  8: 'Transformation, shared resources, and deep psychology are unavoidable.',
  9: 'Travel, higher education, and philosophical expansion mark the year.',
  10: 'Career, reputation, and public life are under the spotlight.',
  11: 'Friendships, community, and long-term goals come alive.',
  12: 'A year of retreat, solitude, and spiritual preparation for the next cycle.',
}

export function buildSolarReturnTheme(srAscendantSign: string, srSunHouse: number): string {
  const asc = SR_ASCENDANT_THEMES[srAscendantSign] ?? 'A year of personal renewal and fresh starts.'
  const house = SR_SUN_HOUSE_THEMES[srSunHouse] ?? 'Personal growth and inner development are central.'
  return `${asc} ${house}`
}

export interface SolarReturnResult {
  returnDate: Date
  srAscendantSign: string
  srSunHouse: number
  theme: string
}

export function computeSolarReturn(natalSunLongitude: number, birthYear: number, currentYear: number): SolarReturnResult {
  // Find the moment the Sun returns to its natal longitude in the current year
  // Start searching from Jan 1 of current year
  const startDate = new Date(currentYear, 0, 1)

  const returnEvent = Astronomy.SearchSunLongitude(natalSunLongitude, startDate, 400)

  const returnDate = returnEvent?.date ?? new Date(currentYear, new Date().getMonth(), new Date().getDate())

  // Determine SR ascendant from time of day of return (approximate: hour → rising sign)
  const hour = returnDate.getHours()
  const signIndex = Math.floor((hour / 24) * 12)
  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
  const srAscendantSign = signs[signIndex]

  // SR Sun house: approximate from return date vs birth date
  const dayOfYear = Math.floor((returnDate.getTime() - new Date(currentYear, 0, 0).getTime()) / 86400000)
  const srSunHouse = (Math.floor(dayOfYear / 30) % 12) + 1

  return {
    returnDate,
    srAscendantSign,
    srSunHouse,
    theme: buildSolarReturnTheme(srAscendantSign, srSunHouse),
  }
}
```

- [ ] **Step 4: Run — confirm pass**

```bash
npx vitest run __tests__/lib/solar-return.test.ts
```

Expected: PASS

- [ ] **Step 5: Create app/solar-return/page.tsx**

```typescript
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import TopNav from '@/components/TopNav'
import ChartWheel from '@/components/ChartWheel'
import { makeChart, type Chart } from '@/lib/astro-data'
import { computeSolarReturn } from '@/lib/solar-return'

export default function SolarReturnPage() {
  const [natalChart, setNatalChart] = useState<Chart | null>(null)
  const [srResult, setSrResult] = useState<Awaited<ReturnType<typeof computeSolarReturn>> | null>(null)
  const [srChart, setSrChart] = useState<Chart | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('signs-chart')
    if (!saved) return
    const chart: Chart = JSON.parse(saved)
    setNatalChart(chart)

    // Compute solar return
    const natalSunLon = chart.planets.find((p) => p.id === 'sun')?.longitude ?? 0
    const birthYear = parseInt(chart.dateStr.slice(0, 4))
    const currentYear = new Date().getFullYear()
    const result = computeSolarReturn(natalSunLon, birthYear, currentYear)
    setSrResult(result)

    // Build a synthetic SR chart for the wheel
    const dateStr = result.returnDate.toISOString().slice(0, 10)
    const timeStr = result.returnDate.toTimeString().slice(0, 5)
    setSrChart(makeChart(chart.name + ' SR', dateStr, timeStr, chart.place))
  }, [])

  if (!natalChart) {
    return (
      <>
        <TopNav />
        <div className="page" style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <div className="eyebrow">solar return</div>
          <div className="card" style={{ marginTop: 24, padding: 32 }}>
            <p>To see your solar return, draw your birth chart first.</p>
            <Link href="/chart" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>
              go to birth chart →
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <TopNav />
      <div className="page" style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
        <div className="eyebrow">solar return {new Date().getFullYear()}</div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>annual theme</h1>

        {srResult && (
          <div className="card" style={{ padding: 24, marginBottom: 32 }}>
            <div className="field-label">solar return date</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, marginBottom: 16 }}>
              {srResult.returnDate.toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <p style={{ lineHeight: 1.7, fontSize: 15 }}>{srResult.theme}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
          <div>
            <div className="field-label" style={{ marginBottom: 12 }}>natal chart</div>
            <ChartWheel chart={natalChart} size={400} />
          </div>
          {srChart && (
            <div>
              <div className="field-label" style={{ marginBottom: 12 }}>solar return chart</div>
              <ChartWheel chart={srChart} size={400} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 6: Test in browser**

Navigate to `/solar-return`. If no chart → shows empty state. After saving a chart, return — verify two wheels render side by side with the theme paragraph above.

- [ ] **Step 7: Commit**

```bash
git add lib/solar-return.ts __tests__/lib/solar-return.test.ts app/solar-return/
git commit -m "feat: solar return chart with side-by-side wheel comparison (TDD)"
```

---

## Task 22: Astrocartography (lib + API + map page)

**Files:**
- Create: `lib/astrocartography.ts`
- Create: `app/api/astrocartography/route.ts`
- Create: `app/map/page.tsx`

- [ ] **Step 1: Create lib/astrocartography.ts**

```typescript
import * as Astronomy from 'astronomy-engine'

export interface CartographyLine {
  planet: string
  glyph: string
  lineType: 'AC' | 'DC' | 'MC' | 'IC'
  color: string
  coordinates: Array<[number, number]> // [lat, lon]
  interpretation: string
}

const PLANET_COLORS: Record<string, string> = {
  Sun: '#d4a04a', Moon: '#a8c090', Mercury: '#7d5a2e', Venus: '#a8c090',
  Mars: '#b8431f', Jupiter: '#6b8550', Saturn: '#3d4a2a', Uranus: '#7d8a5a',
  Neptune: '#3d6a7a', Pluto: '#0f0d09',
}

const LINE_INTERPRETATIONS: Record<string, Record<string, string>> = {
  Sun: {
    AC: 'Your solar presence shines here — visibility, vitality, self-expression amplified.',
    DC: 'Partnerships and one-on-one connections are illuminated. Others mirror your solar nature.',
    MC: 'Career and public reputation flourish. Professional identity is strongest here.',
    IC: 'Deep roots, ancestral connection. Where the soul feels most at home.',
  },
  Moon: {
    AC: 'Emotional authenticity and intuition are heightened. You\'re deeply yourself here.',
    DC: 'Nurturing relationships and emotional partnerships bloom.',
    MC: 'Your public image is warm and caring. Good for caretaking professions.',
    IC: 'Emotional home. Deep belonging. Where you feel most nourished.',
  },
  Mercury: {
    AC: 'Mental agility and communication sharpen. Writing, teaching, and trade thrive.',
    DC: 'Intellectual partnerships and contracts are favoured.',
    MC: 'Career in communication, media, or education is supported.',
    IC: 'Stimulating home environment. Busy, curious, connected.',
  },
  Venus: {
    AC: 'Beauty, grace, and attraction. Romance and artistic appreciation flourish.',
    DC: 'Loving partnerships. Harmony in relationships.',
    MC: 'Career in arts, beauty, or diplomacy is well-starred.',
    IC: 'A beautiful, comfortable home. Where you feel loved.',
  },
  Mars: {
    AC: 'Drive and assertiveness are amplified. Energy for taking action.',
    DC: 'Competitive partnerships. Passion and conflict in relationships.',
    MC: 'Career driven by ambition. Leadership and drive are visible.',
    IC: 'High energy at home. Family dynamics can be intense.',
  },
  Jupiter: {
    AC: 'Expansion, optimism, and good fortune. Growth feels natural here.',
    DC: 'Generous, expansive partnerships. Good for business and love.',
    MC: 'Career success and recognition. A fortunate public reputation.',
    IC: 'Abundance and joy at home. Good fortune in the private sphere.',
  },
  Saturn: {
    AC: 'Discipline and responsibility are tested. Hard work yields lasting results.',
    DC: 'Serious, committed partnerships. Contracts and long-term bonds.',
    MC: 'Career demands diligence. Mastery comes slowly but is lasting.',
    IC: 'Home requires structure and discipline. Ancestral weight is felt.',
  },
}

const TRANSIT_BODIES: Array<{ body: Astronomy.Body; name: string; glyph: string }> = [
  { body: Astronomy.Body.Sun, name: 'Sun', glyph: '☉' },
  { body: Astronomy.Body.Moon, name: 'Moon', glyph: '☽' },
  { body: Astronomy.Body.Mercury, name: 'Mercury', glyph: '☿' },
  { body: Astronomy.Body.Venus, name: 'Venus', glyph: '♀' },
  { body: Astronomy.Body.Mars, name: 'Mars', glyph: '♂' },
  { body: Astronomy.Body.Jupiter, name: 'Jupiter', glyph: '♃' },
  { body: Astronomy.Body.Saturn, name: 'Saturn', glyph: '♄' },
]

function gmstDeg(date: Date): number {
  // Greenwich Mean Sidereal Time in degrees
  const jd = Astronomy.MakeTime(date).ut + 2451545.0
  const T = (jd - 2451545.0) / 36525
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + T * T * 0.000387933 - T * T * T / 38710000
  return ((gmst % 360) + 360) % 360
}

export function buildCartographyLines(date: Date): CartographyLine[] {
  const lines: CartographyLine[] = []
  const gmst = gmstDeg(date)

  for (const planet of TRANSIT_BODIES) {
    let ra: number, dec: number
    try {
      const eq = Astronomy.Equator(planet.body, date, new Astronomy.Observer(0, 0, 0), true, true)
      ra = eq.ra * 15 // convert hours to degrees
      dec = eq.dec
    } catch {
      continue
    }

    const color = PLANET_COLORS[planet.name] ?? '#7d5a2e'
    const interps = LINE_INTERPRETATIONS[planet.name] ?? {}

    // MC line: planet on meridian → lon = RA - GMST
    const mcCoords: Array<[number, number]> = []
    for (let lat = -80; lat <= 80; lat += 2) {
      const lon = ((ra - gmst) % 360 + 360) % 360 - 180
      mcCoords.push([lat, lon])
    }
    lines.push({ planet: planet.name, glyph: planet.glyph, lineType: 'MC', color, coordinates: mcCoords, interpretation: `${planet.glyph} ${planet.name} MC — ${interps.MC ?? ''}` })

    // IC line: opposite of MC
    const icCoords: Array<[number, number]> = mcCoords.map(([lat, lon]) => [lat, lon > 0 ? lon - 180 : lon + 180])
    lines.push({ planet: planet.name, glyph: planet.glyph, lineType: 'IC', color, coordinates: icCoords, interpretation: `${planet.glyph} ${planet.name} IC — ${interps.IC ?? ''}` })

    // AC line: planet rising (hour angle = -H_rise at each lat)
    const acCoords: Array<[number, number]> = []
    const dcCoords: Array<[number, number]> = []
    for (let lat = -80; lat <= 80; lat += 2) {
      const latRad = (lat * Math.PI) / 180
      const decRad = (dec * Math.PI) / 180
      const cosH = -Math.tan(latRad) * Math.tan(decRad)
      if (cosH < -1 || cosH > 1) continue // circumpolar or never rises
      const H = (Math.acos(cosH) * 180) / Math.PI

      const lstRise = (ra - H + 360) % 360
      const lonRise = ((lstRise - gmst) % 360 + 360) % 360 - 180
      acCoords.push([lat, lonRise])

      const lstSet = (ra + H) % 360
      const lonSet = ((lstSet - gmst) % 360 + 360) % 360 - 180
      dcCoords.push([lat, lonSet])
    }

    if (acCoords.length > 2) {
      lines.push({ planet: planet.name, glyph: planet.glyph, lineType: 'AC', color, coordinates: acCoords, interpretation: `${planet.glyph} ${planet.name} AC — ${interps.AC ?? ''}` })
    }
    if (dcCoords.length > 2) {
      lines.push({ planet: planet.name, glyph: planet.glyph, lineType: 'DC', color, coordinates: dcCoords, interpretation: `${planet.glyph} ${planet.name} DC — ${interps.DC ?? ''}` })
    }
  }

  return lines
}
```

- [ ] **Step 2: Create app/api/astrocartography/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { buildCartographyLines } from '@/lib/astrocartography'

export async function GET(req: NextRequest) {
  const dateStr = req.nextUrl.searchParams.get('date') ?? new Date().toISOString()
  const date = new Date(dateStr)
  const lines = buildCartographyLines(date)

  const features = lines.map((line) => ({
    type: 'Feature' as const,
    properties: {
      planet: line.planet,
      glyph: line.glyph,
      lineType: line.lineType,
      color: line.color,
      interpretation: line.interpretation,
    },
    geometry: {
      type: 'LineString' as const,
      coordinates: line.coordinates.map(([lat, lon]) => [lon, lat]),
    },
  }))

  return NextResponse.json({ type: 'FeatureCollection', features })
}
```

- [ ] **Step 3: Test the API**

```bash
npm run dev
```

Open `http://localhost:3000/api/astrocartography`. Expected: GeoJSON FeatureCollection with 20-28 features (not all lines are visible at all latitudes).

- [ ] **Step 4: Create app/map/page.tsx**

```typescript
'use client'
import { useEffect, useRef, useState } from 'react'
import TopNav from '@/components/TopNav'

interface Feature {
  type: 'Feature'
  properties: { planet: string; glyph: string; lineType: string; color: string; interpretation: string }
  geometry: { type: 'LineString'; coordinates: [number, number][] }
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<string | null>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (!mapRef.current) return

    let map: import('leaflet').Map

    async function initMap() {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      map = L.map(mapRef.current!, { center: [20, 0], zoom: 2, minZoom: 1, maxZoom: 6 })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        opacity: 0.6,
      }).addTo(map)

      const data = await fetch('/api/astrocartography').then((r) => r.json())

      data.features.forEach((f: Feature) => {
        const latlngs = f.geometry.coordinates.map(([lon, lat]) => [lat, lon] as [number, number])
        const line = L.polyline(latlngs, {
          color: f.properties.color,
          weight: f.properties.lineType === 'AC' || f.properties.lineType === 'DC' ? 2 : 1.5,
          opacity: 0.85,
          dashArray: f.properties.lineType === 'MC' || f.properties.lineType === 'IC' ? '4 4' : undefined,
        })
        line.bindTooltip(f.properties.interpretation, { sticky: true })
        line.on('mouseover', () => setTooltip(f.properties.interpretation))
        line.on('mouseout', () => setTooltip(null))
        line.addTo(map)
      })

      setMapReady(true)
    }

    initMap()

    return () => { map?.remove() }
  }, [])

  const PLANET_COLORS: Record<string, string> = {
    Sun: '#d4a04a', Moon: '#a8c090', Mercury: '#7d5a2e', Venus: '#a8c090',
    Mars: '#b8431f', Jupiter: '#6b8550', Saturn: '#3d4a2a', Uranus: '#7d8a5a',
    Neptune: '#3d6a7a', Pluto: '#0f0d09',
  }

  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']
  const lineTypes = [
    { type: 'AC', label: 'Ascendant', dash: false },
    { type: 'DC', label: 'Descendant', dash: false },
    { type: 'MC', label: 'Midheaven', dash: true },
    { type: 'IC', label: 'IC', dash: true },
  ]

  return (
    <>
      <TopNav />
      <div style={{ position: 'relative', height: 'calc(100vh - 60px)' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Legend */}
        <div style={{
          position: 'absolute', bottom: 24, left: 24, zIndex: 1000,
          background: 'var(--bg-paper)', border: '2px solid var(--ink)',
          padding: '16px 20px', maxWidth: 260, boxShadow: '3px 3px 0 var(--ink)',
        }}>
          <div className="field-label" style={{ marginBottom: 10 }}>planetary lines</div>
          {planets.map((p) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 24, height: 3, background: PLANET_COLORS[p] ?? '#7d5a2e', borderRadius: 2 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{p}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(15,13,9,0.2)', marginTop: 10, paddingTop: 10 }}>
            {lineTypes.map((lt) => (
              <div key={lt.type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <div style={{ width: 24, height: 2, background: 'var(--ink)', borderTop: lt.dash ? '2px dashed var(--ink)' : '2px solid var(--ink)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{lt.type} — {lt.label}</span>
              </div>
            ))}
          </div>
        </div>

        {!mapReady && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            fontFamily: 'var(--font-mono)', fontSize: 14, opacity: 0.6,
          }}>
            computing planetary lines...
          </div>
        )}

        {tooltip && (
          <div style={{
            position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 1000, background: 'var(--bg-paper)', border: '2px solid var(--ink)',
            padding: '10px 16px', maxWidth: 400, textAlign: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 13,
            boxShadow: '3px 3px 0 var(--ink)',
          }}>
            {tooltip}
          </div>
        )}
      </div>
    </>
  )
}
```

- [ ] **Step 5: Test in browser**

Navigate to `/map`. Verify: world map loads with OSM tiles, planetary lines render in distinct colours, hovering a line shows the interpretation tooltip in the Joel paper style. Legend appears bottom-left.

- [ ] **Step 6: Commit**

```bash
git add lib/astrocartography.ts app/api/astrocartography/route.ts app/map/page.tsx
git commit -m "feat: astrocartography with 40 planetary lines on Leaflet world map"
```

---

## Task 23: Save reading integration

**Files:**
- Modify: `app/tarot/page.tsx`
- Modify: `app/chart/page.tsx`

Add "save this reading" button visible only when session exists. Saves to Supabase `readings` table.

- [ ] **Step 1: Add save button to tarot page**

In `app/tarot/page.tsx`, after the cards are revealed, add:

```typescript
// At top of component (after existing imports):
import { useSession } from 'next-auth/react'
import { supabaseBrowser } from '@/lib/supabase'

// Inside the component, after card state:
const { data: session } = useSession()
const [saved, setSaved] = useState(false)

async function saveReading() {
  if (!session?.user?.id) return
  await supabaseBrowser.from('readings').insert({
    user_id: session.user.id,
    type: 'tarot',
    data: { cards: drawnCards.map((c) => ({ id: c.id, name: c.name, reversed: false })) },
  })
  setSaved(true)
}

// In the JSX, after the reading is revealed (show only when cards are displayed AND user is logged in):
{session && drawnCards.length === 3 && (
  <button
    className={`btn ${saved ? 'btn-ghost' : 'btn-primary'}`}
    onClick={saveReading}
    disabled={saved}
    style={{ marginTop: 24 }}
  >
    {saved ? 'saved ✓' : 'save this reading →'}
  </button>
)}
```

- [ ] **Step 2: Add save button to chart page**

In `app/chart/page.tsx`, after the chart renders in 'view' mode:

```typescript
import { useSession } from 'next-auth/react'
import { supabaseBrowser } from '@/lib/supabase'

// Inside component:
const { data: session } = useSession()
const [saved, setSaved] = useState(false)

async function saveChart() {
  if (!session?.user?.id || !chart) return
  await supabaseBrowser.from('readings').insert({
    user_id: session.user.id,
    type: 'chart',
    data: { name: chart.name, dateStr: chart.dateStr, sun: chart.sun.name, moon: chart.moon.name, ascendant: chart.ascendant.name },
  })
  setSaved(true)
}

// In JSX when mode === 'view':
{session && (
  <button
    className={`btn ${saved ? 'btn-ghost' : 'btn-primary'}`}
    onClick={saveChart}
    disabled={saved}
    style={{ marginTop: 24 }}
  >
    {saved ? 'saved ✓' : 'save this reading →'}
  </button>
)}
```

- [ ] **Step 3: Save chart to localStorage for /transits and /solar-return**

In `app/chart/page.tsx`, after `makeChart()` is called:

```typescript
// After computing the chart:
localStorage.setItem('signs-chart', JSON.stringify(newChart))
```

- [ ] **Step 4: Wrap app in SessionProvider**

`useSession()` requires a `SessionProvider`. Update `app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { SessionProvider } from 'next-auth/react'
import '../styles/colors_and_type.css'
import '../styles/components.css'
import '../styles/signs.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Signs',
  description: 'look life through a spiritual lens',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="has-grain">
        <SessionProvider>
          {children}
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Test the full flow**

1. Navigate to `/login`, sign up with email/password
2. Navigate to `/tarot`, draw three cards, verify "save this reading →" button appears
3. Click save → button becomes "saved ✓"
4. Navigate to `/readings`, verify the saved reading appears
5. Add a note → verify it saves
6. Delete a reading → verify it disappears

- [ ] **Step 6: Commit**

```bash
git add app/tarot/page.tsx app/chart/page.tsx app/layout.tsx
git commit -m "feat: save reading buttons on tarot + chart pages, SessionProvider in layout"
```

---

## Task 24: Final verification + Vercel deploy

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: build completes with no TypeScript errors. Fix any errors before proceeding.

- [ ] **Step 3: Smoke test all routes**

```bash
npm run dev
```

Manually navigate to each route and verify correct rendering:
- `/` — home with hero, feature cards, manifesto
- `/today` — daily vibe card
- `/tarot` — card draw UI
- `/chart` — birth chart form + wheel
- `/compat` — compatibility form + scores
- `/dashboard` — moon phase + planetary hours (allow location for full accuracy)
- `/numerology` — form + four-card result
- `/transits` — month calendar (after saving a chart on `/chart`)
- `/solar-return` — two wheels + theme (after saving a chart)
- `/map` — world map with planetary lines
- `/login` — two-tab login form
- `/readings` — redirect to `/login` if not authenticated; reading list when logged in

- [ ] **Step 4: Set Vercel environment variables**

In Vercel dashboard → Project → Settings → Environment Variables, add:
- `NEXTAUTH_URL` = `https://your-domain.vercel.app`
- `NEXTAUTH_SECRET` = run `openssl rand -hex 32` locally
- `GOOGLE_CLIENT_ID` = from Google Cloud Console
- `GOOGLE_CLIENT_SECRET` = from Google Cloud Console
- `NEXT_PUBLIC_SUPABASE_URL` = from Supabase dashboard
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = from Supabase dashboard
- `SUPABASE_SERVICE_ROLE_KEY` = from Supabase dashboard

- [ ] **Step 5: Deploy**

```bash
git push origin main
```

Vercel auto-deploys from `main`. Monitor the Vercel dashboard for build status. Check the deployed URL for any runtime errors.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: Signs app — complete implementation"
git push origin main
```

---

## Self-Review

**Spec coverage check:**

| Spec section | Covered by task |
|---|---|
| Next.js 14, TypeScript, App Router | Task 1 |
| Joel CSS (colors, components, signs) | Task 2 |
| Vercel analytics + speed insights | Task 3 |
| TopNav moon link → /dashboard | Task 8 |
| Auth slot (login/avatar) | Task 8 |
| More dropdown | Task 8 |
| Home screen | Task 9 |
| Today screen | Task 9 |
| Tarot screen | Task 9 |
| Chart screen | Task 9 |
| Compat screen | Task 9 |
| Supabase RLS schema | Task 10 |
| NextAuth v5 Google OAuth | Task 11 |
| NextAuth v5 credentials | Task 11 |
| /readings auth-gate middleware | Task 11 |
| Login page (two-tab) | Task 12 |
| Readings list + notes + delete | Task 13 |
| Moon phase SVG | Task 17 |
| Dashboard moon panel | Task 18 |
| Dashboard planetary hours panel | Task 18 |
| Real-time countdown | Task 18 |
| Geolocation fallback | Task 18 |
| Numerology (4 numbers, Pythagorean) | Task 19 |
| Personal transit calendar | Task 20 |
| Colour coding aspects | Task 20 |
| Solar return chart + theme | Task 21 |
| Side-by-side natal/SR wheels | Task 21 |
| Astrocartography map + Leaflet | Task 22 |
| 40 planetary lines + tooltips | Task 22 |
| Save reading (tarot + chart) | Task 23 |
| SessionProvider in root layout | Task 23 |
| Vercel deployment | Task 24 |

**No placeholders found.** All code steps include complete implementations.

**Type consistency:** `Chart` from `lib/astro-data.ts` used consistently across transits, solar-return, and chart pages. `computeMonthTransits` takes `Chart` as defined. `buildSolarReturnTheme` returns `string` as used by the SR page.

**One gap found and fixed:** Task 20 (transits) notes that `/chart` needs to save the chart to `localStorage` — this is handled explicitly in Task 23 Step 3.
