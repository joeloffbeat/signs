'use client'
import { useEffect, useRef, useState } from 'react'
import TopNav from '@/components/TopNav'
import 'leaflet/dist/leaflet.css'

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

      const worldBounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180))
      map = L.map(mapRef.current!, {
        center: [20, 0], zoom: 2, minZoom: 2, maxZoom: 6,
        maxBounds: worldBounds, maxBoundsViscosity: 1.0,
        worldCopyJump: false,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '©<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ©<a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        opacity: 0.85,
        noWrap: true,
        bounds: worldBounds,
      }).addTo(map)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
        opacity: 0.35,
        noWrap: true,
        bounds: worldBounds,
        pane: 'shadowPane',
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
        <style>{`.leaflet-tile-pane { filter: sepia(0.3) brightness(0.93) saturate(0.6); }`}</style>
        <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#ede5cf' }} />

        <div style={{
          position: 'absolute', bottom: 24, left: 24, zIndex: 1000,
          background: 'var(--paper-1)', border: '2px solid var(--ink)',
          padding: '18px 20px', maxWidth: 220, boxShadow: '4px 4px 0 var(--ink)',
          borderRadius: 2,
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 12 }}>
            planetary lines
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {planets.map((p) => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 2.5, background: PLANET_COLORS[p] ?? '#7d5a2e', borderRadius: 1, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)' }}>{p}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(15,13,9,0.15)', marginTop: 12, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {lineTypes.map((lt) => (
              <div key={lt.type} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 0, borderTop: `2px ${lt.dash ? 'dashed' : 'solid'} var(--ink-muted)`, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-muted)' }}>{lt.type} · {lt.label}</span>
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
            position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
            zIndex: 1000, background: 'var(--ink)', color: 'var(--bone)',
            border: '2px solid var(--ink)',
            padding: '10px 18px', maxWidth: 480, textAlign: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.55,
            boxShadow: '4px 4px 0 var(--walnut)', borderRadius: 2,
            pointerEvents: 'none',
          }}>
            {tooltip}
          </div>
        )}
      </div>
    </>
  )
}
