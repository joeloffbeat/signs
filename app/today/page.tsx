'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import TopNav from '@/components/TopNav'
import { makeChart, makeDailyVibe } from '@/lib/astro-data'
import type { Chart, DailyVibe } from '@/lib/astro-data'
import { computeMonthTransits } from '@/lib/transits'

const GENERIC_CHART = makeChart('today', '1970-06-21', '12:00', 'London')

export default function TodayPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [personalChart, setPersonalChart] = useState<Chart | null>(null)
  const [usePersonal, setUsePersonal] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('signs-chart')
      if (saved) {
        const d = JSON.parse(saved)
        if (d?.name && d?.date) {
          setPersonalChart(makeChart(d.name, d.date, d.time ?? '12:00', d.place ?? 'unknown'))
          setUsePersonal(true)
        }
      }
    } catch { /* ignore */ }

    if (session) {
      fetch('/api/profile').then(r => r.json()).then(d => {
        if (d?.birth_date && !localStorage.getItem('signs-chart')) {
          setPersonalChart(makeChart(d.name ?? 'me', d.birth_date, d.birth_time ?? '12:00', 'unknown'))
          setUsePersonal(true)
        }
      })
    }

    const t = setTimeout(() => setLoading(false), 1400)
    return () => clearTimeout(t)
  }, [session])

  const chart = (usePersonal && personalChart) ? personalChart : GENERIC_CHART

  if (loading) {
    return (
      <>
        <TopNav />
        <div className="page page-narrow">
          <div className="vibe-loader">
            <div className="scribble"></div>
            <div className="text">drawing today's chart<span className="loading-dots"><span>.</span><span>.</span><span>.</span></span></div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>
              transits · moon phase · planetary hours
            </div>
          </div>
        </div>
      </>
    )
  }

  const v: DailyVibe = makeDailyVibe(chart)
  const today = new Date()
  const dateLabel = today.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' }).toLowerCase()
  const isPersonal = usePersonal && personalChart !== null

  // Best days this week (only shown when personal chart available)
  const bestDays = (() => {
    if (!isPersonal || !personalChart) return []
    const yr = today.getFullYear()
    const mo = today.getMonth() + 1
    const allDays = computeMonthTransits(personalChart, yr, mo)
    const todayStr = today.toISOString().slice(0, 10)
    const weekEnd = new Date(today.getTime() + 7 * 86400000).toISOString().slice(0, 10)
    return allDays
      .filter(d => d.date >= todayStr && d.date <= weekEnd && d.aspects.length > 0)
      .map(d => ({
        date: d.date,
        greenCount: d.aspects.filter(a => a.color === 'green').length,
        redCount: d.aspects.filter(a => a.color === 'red').length,
        aspects: d.aspects,
      }))
      .sort((a, b) => (b.greenCount - b.redCount) - (a.greenCount - a.redCount))
      .slice(0, 3)
  })()

  return (
    <>
      <TopNav />
      <div className="page">
        <div className="page-head">
          <div className="eyebrow">today's read</div>
          <h1>{dateLabel}.</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            <p style={{ margin: 0 }}>
              {isPersonal
                ? `personalised to ${chart.name.toLowerCase()}'s natal positions and today's transits.`
                : "calculated from today's transits and planetary positions."}
            </p>
            {personalChart && (
              <button
                onClick={() => setUsePersonal(u => !u)}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
                  textTransform: 'uppercase', padding: '4px 10px', cursor: 'pointer',
                  background: isPersonal ? 'var(--ink)' : 'var(--paper-2)',
                  color: isPersonal ? 'var(--bone)' : 'var(--ink-muted)',
                  border: '1.5px solid var(--ink)', borderRadius: 2, whiteSpace: 'nowrap',
                }}
              >
                {isPersonal ? `✓ ${chart.name.toLowerCase()}` : 'use my chart'}
              </button>
            )}
            {!personalChart && (
              <a href="/chart" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'underline' }}>
                add your birth data →
              </a>
            )}
          </div>
        </div>

        <div className="today-grid">
          <div className="today-main fade-up">
            <div className="today-date">
              <span className="pulse"></span>
              <span>computed {today.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })}</span>
              <span>·</span>
              <span>moon in {v.transitSign.name.toLowerCase()}</span>
            </div>
            <h2 className="today-headline">today is <em style={{ color: 'var(--clay)' }}>{v.mood.word}</em>.</h2>
            <blockquote className="today-quote">{v.mood.desc}</blockquote>

            <div className="today-stats">
              <div className="stat-box">
                <div className="label">energy</div>
                <div className="value">{v.energyPct}%</div>
                <div className="transit-bar" style={{ marginTop: 8 }}>
                  <div className="fill" style={{ width: v.energyPct + '%' }}></div>
                </div>
              </div>
              <div className="stat-box">
                <div className="label">focus</div>
                <div className="value">{v.focusPct}%</div>
                <div className="transit-bar" style={{ marginTop: 8 }}>
                  <div className="fill" style={{ width: v.focusPct + '%', background: 'var(--honey)' }}></div>
                </div>
              </div>
              <div className="stat-box">
                <div className="label">luck</div>
                <div className="value">{v.luckPct}%</div>
                <div className="transit-bar" style={{ marginTop: 8 }}>
                  <div className="fill" style={{ width: v.luckPct + '%', background: 'var(--clay-soft)' }}></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
              <div className="stat-box" style={{ background: 'var(--sage-soft)' }}>
                <div className="label">do this</div>
                <div className="value" style={{ fontSize: 17 }}>{v.todo}.</div>
              </div>
              <div className="stat-box" style={{ background: 'var(--paper-2)' }}>
                <div className="label">watch out for</div>
                <div className="value" style={{ fontSize: 17 }}>{v.watchOut}.</div>
              </div>
            </div>

            {isPersonal && bestDays.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div className="section-divider"><span className="label">best days this week</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                  {bestDays.map(day => {
                    const d = new Date(day.date + 'T12:00:00')
                    const isToday = day.date === today.toISOString().slice(0, 10)
                    const label = d.toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })
                    const score = day.greenCount - day.redCount
                    return (
                      <div key={day.date} style={{
                        padding: '14px 16px',
                        background: score > 0 ? 'rgba(168,192,144,0.12)' : score < 0 ? 'rgba(184,67,31,0.07)' : 'var(--paper-2)',
                        border: `2px solid ${isToday ? 'var(--ink)' : score > 0 ? 'var(--sage)' : score < 0 ? 'var(--clay)' : 'rgba(15,13,9,0.15)'}`,
                        borderRadius: 4,
                        display: 'grid', gridTemplateColumns: '1fr auto', gap: '4px 16px', alignItems: 'start',
                      }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>
                            {isToday ? 'today · ' : ''}{label}
                          </div>
                          {day.aspects[0]?.interpretation && (
                            <div style={{ fontSize: 12, lineHeight: 1.55, color: 'var(--ink-soft)' }}>
                              {day.aspects[0].interpretation}
                            </div>
                          )}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: score > 0 ? 'var(--sage)' : score < 0 ? 'var(--clay)' : 'var(--ink-muted)', whiteSpace: 'nowrap', paddingTop: 2 }}>
                          {score > 0 ? `${day.greenCount} ✓` : score < 0 ? `${day.redCount} ✗` : `${day.aspects.length} asp`}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-muted)' }}>
                  <Link href="/transits" style={{ color: 'var(--ink-muted)' }}>full month view in transits →</Link>
                </div>
              </div>
            )}
          </div>

          <div className="today-side">
            <div className="side-card">
              <h4>planetary hours</h4>
              <div className="row-line"><span className="k">ruling planet</span><span className="v">{v.transit.name} {v.transit.glyph}</span></div>
              <div className="row-line"><span className="k">peak hour</span><span className="v">{String(v.luckHour).padStart(2, '0')}:00</span></div>
              <div className="row-line"><span className="k">moon phase</span><span className="v">waxing gibbous</span></div>
              <div className="row-line"><span className="k">color</span><span className="v" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                <span style={{ width: 14, height: 14, background: `var(--${v.color})`, border: '2px solid var(--ink)', display: 'inline-block' }}></span>
                {v.color}
              </span></div>
            </div>

            <div className="side-card">
              <h4>active transits</h4>
              {chart.aspects.slice(0, 4).map((a, i) => (
                <div key={i} className="row-line">
                  <span className="k" style={{ fontFamily: 'Roboto Slab', fontSize: 14, fontWeight: 800, color: 'var(--ink)', textTransform: 'none', letterSpacing: 0 }}>
                    {a.from.glyph} {a.glyph} {a.to.glyph}
                  </span>
                  <span className="v" style={{ color: 'var(--ink-muted)' }}>{a.name} · {a.orb}°</span>
                </div>
              ))}
            </div>

            {isPersonal ? (
              <div className="side-card" style={{ background: 'var(--ink)', color: 'var(--bone)', borderColor: 'var(--ink)' }}>
                <h4 style={{ color: 'var(--bone)' }}>your sun</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontFamily: 'Roboto Slab', fontWeight: 900, fontSize: 56, lineHeight: 1 }}>{chart.sun.glyph}</div>
                  <div>
                    <div style={{ fontFamily: 'Roboto Slab', fontWeight: 800, fontSize: 22 }}>{chart.sun.name}</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--paper-2)', marginTop: 2 }}>
                      {chart.sun.element} · {chart.sun.mode} · ruled by {chart.sun.ruler}
                    </div>
                  </div>
                </div>
                <Link href="/lore" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--honey)', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'inline-block', marginTop: 10 }}>
                  mythology + archetype →
                </Link>
              </div>
            ) : (
              <div className="side-card" style={{ background: 'var(--ink)', color: 'var(--bone)', borderColor: 'var(--ink)' }}>
                <h4 style={{ color: 'var(--bone)' }}>your natal chart</h4>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--paper-2)', marginBottom: 12 }}>
                  {session ? 'add birth data to your profile to personalise this page.' : 'sign in or make a birth chart to personalise this read.'}
                </p>
                <a href={session ? '/profile' : '/chart'} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--honey)', textDecoration: 'none' }}>
                  {session ? 'edit profile →' : 'make a chart →'}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
