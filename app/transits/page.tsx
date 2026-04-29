'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import TopNav from '@/components/TopNav'
import { makeChart, type Chart } from '@/lib/astro-data'
import { computeMonthTransits, type TransitDay } from '@/lib/transits'

const COLOR_STYLES: Record<string, React.CSSProperties> = {
  green: { background: 'rgba(168,192,144,0.3)', borderLeft: '3px solid var(--sage)' },
  amber: { background: 'rgba(212,160,74,0.2)', borderLeft: '3px solid #d4a04a' },
  red: { background: 'rgba(184,67,31,0.15)', borderLeft: '3px solid var(--clay)' },
}

export default function TransitsPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [chart, setChart] = useState<Chart | null>(null)
  const [days, setDays] = useState<TransitDay[]>([])
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('signs-chart')
    if (!saved) return
    try {
      const d = JSON.parse(saved)
      if (d?.name && d?.date) setChart(makeChart(d.name, d.date, d.time ?? '12:00', d.place ?? 'unknown'))
    } catch { /* malformed */ }
  }, [])

  useEffect(() => {
    if (!chart) return
    setLoading(true)
    setTimeout(() => {
      setDays(computeMonthTransits(chart, year, month))
      setLoading(false)
    }, 0)
  }, [chart, year, month])

  if (!chart) {
    return (
      <>
        <TopNav />
        <div className="page" style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <div className="eyebrow">transits</div>
          <div className="card" style={{ marginTop: 24, padding: 32 }}>
            <p>To see your personal transits, draw your birth chart first.</p>
            <Link href="/chart" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>
              go to birth chart →
            </Link>
          </div>
        </div>
      </>
    )
  }

  const selectedAspects = days.find((d) => d.date === selectedDay)?.aspects ?? []

  return (
    <>
      <TopNav />
      <div className="page" style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
        <div className="eyebrow">personal transits</div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>
          {new Date(year, month - 1).toLocaleDateString('en', { month: 'long', year: 'numeric' })}
        </h1>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button className="btn btn-ghost" onClick={() => { if (month === 1) { setYear(y => y - 1); setMonth(12) } else setMonth(m => m - 1) }}>← prev</button>
          <button className="btn btn-ghost" onClick={() => { if (month === 12) { setYear(y => y + 1); setMonth(1) } else setMonth(m => m + 1) }}>next →</button>
        </div>

        {!loading && days.length > 0 && (() => {
          const todayStr = new Date().toISOString().slice(0, 10)
          const best = days
            .filter(d => d.date >= todayStr && d.aspects.length > 0)
            .map(d => ({
              ...d,
              score: d.aspects.filter(a => a.color === 'green').length - d.aspects.filter(a => a.color === 'red').length,
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 4)
          if (!best.length) return null
          return (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 10 }}>
                best upcoming days this month
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {best.map(day => {
                  const d = new Date(day.date + 'T12:00:00')
                  const isToday = day.date === todayStr
                  const label = d.toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })
                  const greenCount = day.aspects.filter(a => a.color === 'green').length
                  return (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDay(day.date === selectedDay ? null : day.date)}
                      style={{
                        textAlign: 'left', padding: '12px 16px', cursor: 'pointer',
                        background: day.date === selectedDay ? 'var(--ink)' : 'rgba(168,192,144,0.1)',
                        border: `2px solid ${day.date === selectedDay ? 'var(--ink)' : 'var(--sage)'}`,
                        borderRadius: 4, color: day.date === selectedDay ? 'var(--bone)' : 'var(--ink)',
                        display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start',
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 3 }}>
                          {isToday ? 'today · ' : ''}{label}
                        </div>
                        <div style={{ fontSize: 12, lineHeight: 1.55, opacity: 0.85 }}>
                          {day.aspects[0]?.interpretation ?? ''}
                        </div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: day.date === selectedDay ? 'var(--sage-soft)' : 'var(--sage)', whiteSpace: 'nowrap' }}>
                        {greenCount} favourable
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {loading ? (
          <p style={{ fontFamily: 'var(--font-mono)', opacity: 0.5 }}>computing transits...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.5, textAlign: 'center', paddingBottom: 8 }}>{d}</div>
            ))}
            {Array.from({ length: new Date(year, month - 1, 1).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map((day) => {
              const d = parseInt(day.date.slice(-2))
              const isToday = day.date === today.toISOString().slice(0, 10)
              const isSelected = day.date === selectedDay
              const hasAspects = day.aspects.length > 0
              const hasHard = day.aspects.some((a) => a.color === 'red')
              const hasSoft = !hasHard && day.aspects.some((a) => a.color === 'green')
              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDay(isSelected ? null : day.date)}
                  style={{
                    padding: '8px 4px', border: `2px solid ${isSelected ? 'var(--walnut)' : isToday ? 'var(--ink)' : 'rgba(15,13,9,0.15)'}`,
                    background: isSelected ? 'var(--walnut)' : hasHard ? 'rgba(184,67,31,0.1)' : hasSoft ? 'rgba(168,192,144,0.2)' : 'transparent',
                    cursor: hasAspects ? 'pointer' : 'default',
                    fontFamily: 'var(--font-mono)', fontSize: 13, color: isSelected ? 'var(--bone)' : 'var(--ink)',
                    borderRadius: 2, textAlign: 'center',
                  }}
                >
                  {d}
                  {hasAspects && <div style={{ fontSize: 8, marginTop: 2, opacity: 0.7 }}>{'·'.repeat(Math.min(day.aspects.length, 5))}</div>}
                </button>
              )
            })}
          </div>
        )}

        {selectedDay && (
          <div style={{ marginTop: 24 }}>
            <div className="field-label">{new Date(selectedDay + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            {selectedAspects.length === 0 ? (
              <p style={{ opacity: 0.5 }}>No major aspects today.</p>
            ) : (
              selectedAspects.map((a, i) => (
                <div key={i} className="card" style={{ marginTop: 8, padding: '12px 16px', ...COLOR_STYLES[a.color] }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                    {a.transitGlyph} {a.transitPlanet} {a.aspectName} natal {a.natalGlyph} {a.natalPlanet}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.5, marginLeft: 8 }}>{a.orb}° orb</span>
                  <p style={{ margin: '6px 0 0', fontSize: 13 }}>{a.interpretation}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  )
}
