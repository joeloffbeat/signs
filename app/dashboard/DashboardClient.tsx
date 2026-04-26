'use client'
import { useState, useEffect } from 'react'
import MoonSvg from '@/components/MoonSvg'

interface PlanetaryHour {
  index: number
  planet: string
  glyph: string
  startTime: string
  endTime: string
  isDaytime: boolean
  isCurrent: boolean
}

interface Props {
  moonDegrees: number
  moonPhaseName: string
  moonIllumination: number
}

const PHASE_INTERPRETATIONS: Record<string, string> = {
  'New Moon': 'A time for setting intentions. The sky is dark; your inner compass is bright. Plant seeds — metaphorically and literally.',
  'Waxing Crescent': 'Energy builds. The first sliver of light asks: what are you willing to work toward? Small actions compound.',
  'First Quarter': 'Tension and decision. The half-lit moon marks a crossroads. Push through resistance.',
  'Waxing Gibbous': 'Refinement. Almost full — edit, adjust, prepare. The work is nearly ready.',
  'Full Moon': 'Culmination. What you started at the new moon reaches its peak. Rest, reflect, release.',
  'Waning Gibbous': 'Gratitude and harvest. The peak has passed; take stock of what was accomplished.',
  'Last Quarter': 'Release and forgiveness. Let go of what no longer serves. Clear space.',
  'Waning Crescent': 'Surrender and rest. The cycle closes. Sleep, restore, and prepare to begin again.',
}

const CHALDEAN_HISTORY = `The Chaldean order — Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon — is among the oldest known astrological systems, traced to Babylonian astronomers around 700 BCE. Each planet rules an hour of the day, cycling continuously from the sunrise of each day. Sunday takes its name from its first-hour ruler, the Sun; Monday from the Moon; Saturday from Saturn. The system was adopted by Hellenistic astrologers, passed into medieval European magic, and is still used today for timing decisions, prayers, and practical matters.`

export default function DashboardClient({ moonDegrees, moonPhaseName, moonIllumination }: Props) {
  const [hours, setHours] = useState<PlanetaryHour[]>([])
  const [currentIdx, setCurrentIdx] = useState(-1)
  const [countdown, setCountdown] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [locationStatus, setLocationStatus] = useState<'loading' | 'ok' | 'fallback'>('loading')

  useEffect(() => {
    function fetchHours(lat: number, lon: number) {
      const today = new Date().toISOString().slice(0, 10)
      fetch(`/api/planetary-hours?lat=${lat}&lon=${lon}&date=${today}`)
        .then((r) => r.json())
        .then((data) => {
          setHours(data.hours)
          setCurrentIdx(data.currentIndex)
          setLocationStatus('ok')
        })
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchHours(pos.coords.latitude, pos.coords.longitude),
        () => { fetchHours(0, 0); setLocationStatus('fallback') }
      )
    } else {
      fetchHours(0, 0)
      setLocationStatus('fallback')
    }
  }, [])

  useEffect(() => {
    if (currentIdx < 0 || hours.length === 0) return
    const interval = setInterval(() => {
      const end = new Date(hours[currentIdx].endTime)
      const diff = end.getTime() - Date.now()
      if (diff <= 0) { setCountdown('next hour'); return }
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(`${m}m ${s.toString().padStart(2, '0')}s`)
    }, 1000)
    return () => clearInterval(interval)
  }, [currentIdx, hours])

  const currentHour = hours[currentIdx]

  return (
    <div className="page">
      {locationStatus === 'fallback' && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--clay)', marginBottom: 16 }}>
          using UTC — allow location for local hours
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 24 }}>
        <div className="card" style={{ padding: 32 }}>
          <div className="field-label" style={{ marginBottom: 16 }}>moon phase</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <MoonSvg degrees={moonDegrees} size={120} />
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>{moonPhaseName}</h2>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, marginTop: 8, opacity: 0.7 }}>
                {moonIllumination}% illuminated
              </div>
            </div>
          </div>
          <p style={{ marginTop: 24, lineHeight: 1.6 }}>
            {PHASE_INTERPRETATIONS[moonPhaseName] ?? ''}
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div className="field-label" style={{ marginBottom: 16 }}>planetary hours</div>

          {currentHour ? (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 40 }}>{currentHour.glyph}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>{currentHour.planet}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.6 }}>
                    {currentHour.isDaytime ? 'day hour' : 'night hour'} · ends in {countdown}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ opacity: 0.5, marginBottom: 24 }}>loading...</div>
          )}

          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                  <th style={{ textAlign: 'left', padding: '4px 8px', opacity: 0.5 }}>#</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', opacity: 0.5 }}>planet</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', opacity: 0.5 }}>starts</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', opacity: 0.5 }}>type</th>
                </tr>
              </thead>
              <tbody>
                {hours.map((h) => (
                  <tr
                    key={h.index}
                    style={{
                      background: h.isCurrent ? 'var(--sage)' : 'transparent',
                      borderBottom: '1px solid rgba(15,13,9,0.1)',
                    }}
                  >
                    <td style={{ padding: '4px 8px', opacity: 0.5 }}>{h.index + 1}</td>
                    <td style={{ padding: '4px 8px' }}>{h.glyph} {h.planet}</td>
                    <td style={{ padding: '4px 8px', opacity: 0.7 }}>
                      {new Date(h.startTime).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '4px 8px', opacity: 0.5 }}>{h.isDaytime ? '☀' : '☾'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="btn btn-ghost"
            style={{ marginTop: 16, fontSize: 12 }}
            onClick={() => setHistoryOpen((o) => !o)}
          >
            {historyOpen ? 'hide' : 'what does this mean?'}
          </button>
          {historyOpen && (
            <p style={{ marginTop: 12, fontSize: 13, lineHeight: 1.7, opacity: 0.75 }}>
              {CHALDEAN_HISTORY}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
