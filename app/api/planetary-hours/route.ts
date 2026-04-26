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
