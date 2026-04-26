export const CHALDEAN_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'] as const
export type ChaldeanPlanet = (typeof CHALDEAN_ORDER)[number]

const DAY_RULERS: ChaldeanPlanet[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']

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
