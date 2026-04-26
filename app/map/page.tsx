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
    Mars: '#b8431f', Jupiter: '#6b8550', Saturn: '#3d4a2a',
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
