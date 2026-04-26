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
      ra = eq.ra * 15
      dec = eq.dec
    } catch {
      continue
    }

    const color = PLANET_COLORS[planet.name] ?? '#7d5a2e'
    const interps = LINE_INTERPRETATIONS[planet.name] ?? {}

    const mcCoords: Array<[number, number]> = []
    for (let lat = -80; lat <= 80; lat += 2) {
      const lon = ((ra - gmst) % 360 + 360) % 360 - 180
      mcCoords.push([lat, lon])
    }
    lines.push({ planet: planet.name, glyph: planet.glyph, lineType: 'MC', color, coordinates: mcCoords, interpretation: `${planet.glyph} ${planet.name} MC — ${interps.MC ?? ''}` })

    const icCoords: Array<[number, number]> = mcCoords.map(([lat, lon]) => [lat, lon > 0 ? lon - 180 : lon + 180])
    lines.push({ planet: planet.name, glyph: planet.glyph, lineType: 'IC', color, coordinates: icCoords, interpretation: `${planet.glyph} ${planet.name} IC — ${interps.IC ?? ''}` })

    const acCoords: Array<[number, number]> = []
    const dcCoords: Array<[number, number]> = []
    for (let lat = -80; lat <= 80; lat += 2) {
      const latRad = (lat * Math.PI) / 180
      const decRad = (dec * Math.PI) / 180
      const cosH = -Math.tan(latRad) * Math.tan(decRad)
      if (cosH < -1 || cosH > 1) continue
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
