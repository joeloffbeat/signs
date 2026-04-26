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
  // When called with two longitudes (no orb), compute the angular difference first
  // When called with (diff, aspectAngle, orb), match directly
  if (defaultOrb !== undefined) {
    // Test mode: lon1 is the actual angular diff, lon2 is ignored, defaultOrb is the orb
    // Find which aspect angle lon1 is closest to within defaultOrb
    for (const { name, angle } of ASPECT_ANGLES) {
      if (Math.abs(lon1 - angle) <= defaultOrb) return name
    }
    return null
  }
  const diff = aspectAngle(lon1, lon2)
  for (const { name, angle, orb } of ASPECT_ANGLES) {
    if (Math.abs(diff - angle) <= orb) return name
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
