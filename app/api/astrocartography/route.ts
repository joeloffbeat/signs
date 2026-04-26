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
