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
  const diff = ((lon1 - lon2) % 360 + 360) % 360
  return diff > 180 ? 360 - diff : diff
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

export function computeMonthSkyEnergy(year: number, month: number): TransitDay[] {
  const daysInMonth = new Date(year, month, 0).getDate()
  const result: TransitDay[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day, 12, 0, 0)
    const aspects: DayAspect[] = []

    const positions: Array<{ body: typeof TRANSIT_BODIES[0]; lon: number }> = []
    for (const body of TRANSIT_BODIES) {
      try {
        const vec = Astronomy.GeoVector(body.body, date, true)
        const ecl = Astronomy.Ecliptic(vec)
        positions.push({ body, lon: ((ecl.elon % 360) + 360) % 360 })
      } catch { /* skip */ }
    }

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const p1 = positions[i]
        const p2 = positions[j]
        const aspect = isAspect(p1.lon, p2.lon, 3)
        if (!aspect) continue
        const orb = Math.abs(aspectAngle(p1.lon, p2.lon) - ASPECT_ANGLES.find((a) => a.name === aspect)!.angle)
        const interp = ASPECT_INTERPRETATIONS[aspect]
        aspects.push({
          transitPlanet: p1.body.name,
          transitGlyph: p1.body.glyph,
          natalPlanet: p2.body.name,
          natalGlyph: p2.body.glyph,
          aspectName: aspect,
          orb: parseFloat(orb.toFixed(1)),
          color: interp.color as 'green' | 'amber' | 'red',
          interpretation: `${p1.body.name} ${aspect} ${p2.body.name} — ${interp.text}`,
        })
      }
    }

    result.push({
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      aspects,
    })
  }

  return result
}
