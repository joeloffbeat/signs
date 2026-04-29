'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import TopNav from '@/components/TopNav'
import SignLoreBox from '@/components/SignLoreBox'
import { makeChart, makeDailyVibe } from '@/lib/astro-data'
import type { Chart, DailyVibe } from '@/lib/astro-data'

const GENERIC_CHART = makeChart('today', '1970-06-21', '12:00', 'London')

export default function TodayPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [personalChart, setPersonalChart] = useState<Chart | null>(null)
  const [usePersonal, setUsePersonal] = useState(false)

  useEffect(() => {
    // load from localStorage
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

    // also try profile if logged in
    if (session) {
      fetch('/api/profile').then(r => r.json()).then(d => {
        if (d?.birth_date && !localStorage.getItem('signs-chart')) {
          setPersonalChart(makeChart(d.name ?? 'me', d.birth_date, d.birth_time ?? '12:00', d.birth_place ?? 'unknown'))
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
                <SignLoreBox signName={chart.sun.name} label="sun" glyph={chart.sun.glyph} inline />
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
