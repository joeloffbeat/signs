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
    { word: 'tidal', desc: "moods come in waves. ride them, don't fight." },
    { word: 'earthy', desc: 'make something with your hands. cook. plant. fix.' },
    { word: 'luminous', desc: "you're easy to read today. say what you mean." },
    { word: 'interior', desc: 'stay in. the answer is somewhere on your desk.' },
    { word: 'social', desc: "speak to a stranger. it'll go better than you think." },
    { word: 'frictive', desc: 'expect snags. the snags are useful.' },
    { word: 'molten', desc: "hot at the core. don't sit on the feeling." },
    { word: 'patient', desc: 'the slow path is the only path today.' },
  ]

  const transit = PLANETS[Math.floor(rand() * 7)]
  const transitSign = SIGNS[Math.floor(rand() * 12)]
  const watchOuts = ['overcommitting', 'taking it personally', 'skipping meals', 'reply-all', 'doom-scrolling', "starting a fight you can't finish", 'saying yes too fast', 'perfectionism']
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

export interface SynastryAspect {
  p1: PlacedPlanet
  p2: PlacedPlanet
  type: string
  name: string
  glyph: string
  orb: string
  quality: 'harmonious' | 'tense' | 'mixed'
  interpretation: string
}

const SYNASTRY_INTERP: Record<string, string> = {
  'sun-conj-sun': 'Identities fuse — instant recognition but easy to become an echo chamber.',
  'sun-trine-sun': 'Natural ease and mutual respect. You want similar things from life.',
  'sun-square-sun': 'Core drives conflict. Growth happens through friction, not despite it.',
  'sun-opp-sun': 'Opposite signs: you complete what the other lacks. Magnetic, requires negotiation.',
  'sun-sext-sun': 'Compatible directions with enough difference to stay interesting.',
  'sun-conj-moon': 'The sun person\'s identity illuminates the moon person\'s emotional world — powerful but unequal.',
  'sun-trine-moon': 'Emotional warmth flows naturally. One of the best synastry aspects for longevity.',
  'sun-square-moon': 'Identity needs clash with emotional needs. Requires patience and deliberate care.',
  'sun-opp-moon': 'Sun-moon opposition: a pull between what each person needs to shine vs. feel safe.',
  'sun-sext-moon': 'Easy mutual support. Identity and emotion speak the same language.',
  'moon-conj-moon': 'You feel things the same way. Deep emotional recognition — rare and stabilising.',
  'moon-trine-moon': 'Emotional rhythms align. Comfort with each other comes quickly and holds.',
  'moon-square-moon': 'Emotional needs conflict. What soothes one unsettles the other.',
  'moon-opp-moon': 'Very different emotional languages. Understanding is possible but requires translation.',
  'moon-sext-moon': 'Good emotional compatibility. You can read each other\'s moods without words.',
  'venus-conj-venus': 'You share aesthetic sensibility and values. Pleasure is easy between you.',
  'venus-trine-venus': 'Natural affection and shared taste. Attraction is low-friction and lasting.',
  'venus-square-venus': 'Different love languages. What one finds romantic the other finds hollow.',
  'venus-opp-venus': 'Opposing styles of love and desire — fascinating and frustrating in equal measure.',
  'venus-sext-venus': 'Warmth and appreciation flow easily. You notice what the other does well.',
  'venus-conj-mars': 'The classic romantic aspect — desire and attraction at close range.',
  'venus-trine-mars': 'Physical and emotional attraction that doesn\'t burn out quickly.',
  'venus-square-mars': 'High charge, high friction. Passion is real but so is the potential for conflict.',
  'venus-opp-mars': 'Intense magnetic pull — the challenge is channelling it constructively.',
  'venus-sext-mars': 'Attraction with enough ease to stay comfortable. Good for long-term desire.',
  'mars-conj-mars': 'Matched drive and energy. Can accelerate each other or collide head-on.',
  'mars-trine-mars': 'Shared approach to action and desire. You move at the same pace.',
  'mars-square-mars': 'Clashing wills. Productive if channelled into shared goals; exhausting if not.',
  'mars-opp-mars': 'Opposite strategies for getting what you want. Negotiation is constant.',
  'mercury-conj-mercury': 'You think alike and finish each other\'s sentences. Risk: a shared blind spot.',
  'mercury-trine-mercury': 'Communication flows. You understand each other\'s logic without effort.',
  'mercury-square-mercury': 'Different thinking styles create misunderstandings. Worth working through.',
  'mercury-opp-mercury': 'Opposite mental approaches — one\'s method baffles the other. Complementary when respected.',
}

function synastryInterp(p1id: string, aspType: string, p2id: string): string {
  const k = `${p1id}-${aspType}-${p2id}`
  const rk = `${p2id}-${aspType}-${p1id}`
  if (SYNASTRY_INTERP[k]) return SYNASTRY_INTERP[k]
  if (SYNASTRY_INTERP[rk]) return SYNASTRY_INTERP[rk]
  const qual = ['trine', 'sext'].includes(aspType) ? 'flows with ease' : ['square', 'opp'].includes(aspType) ? 'creates tension' : 'fuses energy'
  const n = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  return `${n(p1id)} ${qual} with their ${p2id}.`
}

export function makeSynastryAspects(a: Chart, b: Chart): SynastryAspect[] {
  const aspectTypes = [
    { name: 'conjunction', angle: 0, orb: 8, type: 'conj', glyph: '☌', quality: 'mixed' as const },
    { name: 'sextile', angle: 60, orb: 5, type: 'sext', glyph: '✱', quality: 'harmonious' as const },
    { name: 'square', angle: 90, orb: 6, type: 'square', glyph: '□', quality: 'tense' as const },
    { name: 'trine', angle: 120, orb: 7, type: 'trine', glyph: '△', quality: 'harmonious' as const },
    { name: 'opposition', angle: 180, orb: 8, type: 'opp', glyph: '☍', quality: 'tense' as const },
  ]
  const personal = ['sun', 'moon', 'mercury', 'venus', 'mars']
  const results: SynastryAspect[] = []
  for (const p1 of a.planets.filter((p) => personal.includes(p.id))) {
    for (const p2 of b.planets.filter((p) => personal.includes(p.id))) {
      let diff = Math.abs(p1.longitude - p2.longitude)
      if (diff > 180) diff = 360 - diff
      for (const asp of aspectTypes) {
        if (Math.abs(diff - asp.angle) <= asp.orb) {
          results.push({
            p1, p2,
            type: asp.type, name: asp.name, glyph: asp.glyph,
            orb: Math.abs(diff - asp.angle).toFixed(1),
            quality: asp.quality,
            interpretation: synastryInterp(p1.id, asp.type, p2.id),
          })
          break
        }
      }
    }
  }
  const order = { harmonious: 0, mixed: 1, tense: 2 }
  return results.sort((x, y) => order[x.quality] - order[y.quality])
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
