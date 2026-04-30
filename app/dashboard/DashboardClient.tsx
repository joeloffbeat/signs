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

const CHALDEAN_HISTORY = `The Chaldean order — Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon — is among the oldest known astrological systems, traced to Babylonian astronomers around 700 BCE. Each planet rules an hour of the day, cycling continuously from sunrise. Sunday takes its name from its first-hour ruler, the Sun; Monday from the Moon; Saturday from Saturn.`

export default function DashboardClient({ moonDegrees, moonPhaseName, moonIllumination }: Props) {
  const [hours, setHours] = useState<PlanetaryHour[]>([])
  const [currentIdx, setCurrentIdx] = useState(-1)
  const [countdown, setCountdown] = useState('')
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
    <div className="page" style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
      {locationStatus === 'fallback' && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--clay)', marginBottom: 16, letterSpacing: '0.08em' }}>
          using UTC · allow location for local planetary hours
        </div>
      )}

      <div className="eyebrow">dashboard</div>

      {/* Moon hero */}
      <div style={{ textAlign: 'center', padding: '36px 0 40px' }}>
        <MoonSvg degrees={moonDegrees} size={150} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 52, marginTop: 28, marginBottom: 6, lineHeight: 1 }}>
          {moonPhaseName.toLowerCase()}.
        </h1>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.45, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 24 }}>
          {moonIllumination}% illuminated
        </div>
        <p style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, lineHeight: 1.65, color: 'var(--ink-soft)', fontStyle: 'italic' }}>
          {PHASE_INTERPRETATIONS[moonPhaseName] ?? ''}
        </p>
      </div>

      {/* Planetary hours */}
      <div style={{ borderTop: '2px solid var(--ink)', paddingTop: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 20 }}>planetary hours</div>

        {currentHour ? (
          <div style={{
            padding: '22px 28px', background: 'var(--ink)', color: 'var(--bone)',
            borderRadius: 4, marginBottom: 16,
            display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 20, alignItems: 'center',
          }}>
            <span style={{ fontFamily: 'Roboto Slab', fontWeight: 900, fontSize: 52, lineHeight: 1 }}>
              {currentHour.glyph}
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>{currentHour.planet}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--paper-3)', marginTop: 4, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {currentHour.isDaytime ? 'day hour' : 'night hour'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ends in</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'var(--sage)', marginTop: 4 }}>
                {countdown || '—'}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.4, marginBottom: 16 }}>loading hours...</div>
        )}

        {hours.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {hours.map((h) => (
              <div
                key={h.index}
                style={{
                  display: 'grid', gridTemplateColumns: '24px 1fr auto 20px',
                  gap: 12, alignItems: 'center',
                  padding: '7px 12px',
                  background: h.isCurrent ? 'rgba(168,192,144,0.18)' : 'transparent',
                  border: `1.5px solid ${h.isCurrent ? 'var(--sage)' : 'transparent'}`,
                  borderRadius: 3,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.35, textAlign: 'right' }}>
                  {h.index + 1}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: h.isCurrent ? 'var(--ink)' : 'var(--ink-soft)' }}>
                  {h.glyph} {h.planet}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.5 }}>
                  {new Date(h.startTime).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.35, textAlign: 'center' }}>
                  {h.isDaytime ? '☀' : '☾'}
                </span>
              </div>
            ))}
          </div>
        )}

        <p style={{ marginTop: 28, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)', lineHeight: 1.8, borderTop: '1px solid rgba(15,13,9,0.1)', paddingTop: 20 }}>
          {CHALDEAN_HISTORY}
        </p>
      </div>
    </div>
  )
}
