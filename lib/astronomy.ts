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
