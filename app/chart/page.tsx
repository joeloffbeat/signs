'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { supabaseBrowser } from '@/lib/supabase'
import TopNav from '@/components/TopNav'
import ChartWheel from '@/components/ChartWheel'
import { makeChart } from '@/lib/astro-data'
import type { Chart } from '@/lib/astro-data'

type Mode = 'input' | 'loading' | 'view'

interface FormState {
  name: string
  date: string
  time: string
  place: string
}

export default function ChartPage() {
  const { data: session } = useSession()
  const [mode, setMode] = useState<Mode>('input')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<FormState>({
    name: '',
    date: '1990-06-15',
    time: '14:30',
    place: '',
  })
  const [chart, setChart] = useState<Chart | null>(null)

  async function saveChart() {
    if (!session?.user?.id || !chart) return
    await supabaseBrowser.from('readings').insert({
      user_id: session.user.id,
      type: 'chart',
      data: { name: chart.name, dateStr: chart.dateStr, sun: chart.sun.name, moon: chart.moon.name, ascendant: chart.ascendant.name },
    })
    setSaved(true)
  }

  const submit = () => {
    if (!form.name || !form.date) return
    const newChart = makeChart(form.name, form.date, form.time, form.place || 'unknown')
    setChart(newChart)
    if (typeof window !== 'undefined') {
      localStorage.setItem('signs-chart', JSON.stringify({ name: form.name, date: form.date, time: form.time, place: form.place }))
    }
    setMode('loading')
    setTimeout(() => setMode('view'), 1100)
  }

  if (mode === 'input') {
    return (
      <>
        <TopNav />
        <div className="page page-narrow">
          <div className="page-head">
            <div className="eyebrow">natal chart · enter your data</div>
            <h1>where & when did you start?</h1>
            <p>signs needs four things to draw your wheel: a name to label it, a birth date, a birth time (within an hour is fine), and a place. nothing leaves your browser.</p>
          </div>

          <div className="card" style={{ padding: 32, background: 'var(--bone)' }}>
            <div className="form-grid">
              <div className="full">
                <label className="field-label">name (or what to call this chart)</label>
                <input className="input" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. me · alex · test chart" />
              </div>
              <div>
                <label className="field-label">birth date</label>
                <input className="input" type="date" value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="field-label">birth time</label>
                <input className="input" type="time" value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })} />
                <div className="field-help">if unknown, pick noon. you'll lose ascendant accuracy.</div>
              </div>
              <div className="full">
                <label className="field-label">birth place</label>
                <input className="input" value={form.place}
                  onChange={e => setForm({ ...form, place: e.target.value })}
                  placeholder="city, country" />
              </div>
            </div>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <button className="btn btn-primary btn-lg" onClick={submit} disabled={!form.name || !form.date}>
                draw the chart →
              </button>
              <button className="btn btn-ghost" onClick={() => setForm({ name: 'sample', date: '1990-06-21', time: '12:00', place: 'london, uk' })}>
                use sample data
              </button>
            </div>
          </div>

          <div style={{ marginTop: 32, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--ink)' }}>method:</strong> placidus houses, tropical zodiac. ephemeris from swiss ephemeris (mock for this prototype). times in local civil time. no fudging.
          </div>
        </div>
      </>
    )
  }

  if (mode === 'loading') {
    return (
      <>
        <TopNav />
        <div className="page page-narrow">
          <div className="vibe-loader">
            <div className="scribble"></div>
            <div className="text">computing planets<span className="loading-dots"><span>.</span><span>.</span><span>.</span></span></div>
          </div>
        </div>
      </>
    )
  }

  // view mode — chart is guaranteed non-null here
  const c = chart!

  return (
    <>
      <TopNav />
      <div className="page">
        <div className="page-head split">
          <div>
            <div className="eyebrow">natal chart</div>
            <h1>{c.name}'s wheel.</h1>
            <p>{c.dateStr} · {c.timeStr} · {c.place}</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setMode('input')}>edit data</button>
        </div>

        {session && (
          <button
            className={`btn ${saved ? 'btn-ghost' : 'btn-primary'}`}
            onClick={saveChart}
            disabled={saved}
            style={{ marginTop: 24 }}
          >
            {saved ? 'saved ✓' : 'save this reading →'}
          </button>
        )}

        <div className="chart-grid">
          <div className="chart-wheel-wrap">
            <ChartWheel chart={c} />
          </div>

          <div className="chart-meta">
            <div className="big3">
              <div className="b">
                <div className="lbl">sun</div>
                <div className="glyph">{c.sun.glyph}</div>
                <div className="name">{c.sun.name.toLowerCase()}</div>
              </div>
              <div className="b" style={{ background: 'var(--paper-2)' }}>
                <div className="lbl">moon</div>
                <div className="glyph">{c.moon.glyph}</div>
                <div className="name">{c.moon.name.toLowerCase()}</div>
              </div>
              <div className="b" style={{ background: 'var(--sage-soft)' }}>
                <div className="lbl">rising</div>
                <div className="glyph">{c.ascendant.glyph}</div>
                <div className="name">{c.ascendant.name.toLowerCase()}</div>
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <h4 style={{ margin: '0 0 12px' }}>signature</h4>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--ink-soft)' }}>
                dominant element: <strong style={{ color: 'var(--ink)' }}>{c.dominantEl}</strong>.
                dominant mode: <strong style={{ color: 'var(--ink)' }}>{c.dominantMode}</strong>.
                this is a {c.dominantMode}-{c.dominantEl} signature — {c.dominantEl === 'fire' ? 'kindling, restless, forward-leaning' : c.dominantEl === 'earth' ? 'patient, hands-on, slow to commit' : c.dominantEl === 'air' ? 'verbal, ideas-first, can over-think' : 'moody, intuitive, runs on feeling'}.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 14 }}>
                {Object.entries(c.elementCount).map(([el, n]) => (
                  <div key={el} style={{ textAlign: 'center', padding: 8, border: '1.5px solid var(--ink)', borderRadius: 2, background: 'var(--paper-2)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{el}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, marginTop: 2 }}>{n}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* placement table */}
        <div className="section-divider"><span className="label">planetary placements</span></div>
        <div className="placement-table">
          <div className="row head">
            <div>planet</div><div>sign</div><div>house</div><div>°</div>
          </div>
          {c.planets.map(p => (
            <div className="row" key={p.id}>
              <div className="planet"><span className="glyph">{p.glyph}</span> {p.name.toLowerCase()}{p.retro ? ' ℞' : ''}</div>
              <div><span className="glyph">{p.sign.glyph}</span> {p.sign.name.toLowerCase()}</div>
              <div className="deg">{p.house}{p.house===1?'st':p.house===2?'nd':p.house===3?'rd':'th'} house</div>
              <div className="deg">{p.deg}° {String(p.degMin).padStart(2,'0')}'</div>
            </div>
          ))}
        </div>

        {/* aspects */}
        <div className="section-divider"><span className="label">major aspects</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="aspects">
            {c.aspects.slice(0, Math.ceil(c.aspects.length / 2)).map((a, i) => (
              <div className="aspect-row" key={i}>
                <span style={{ fontFamily: 'Roboto Slab', fontWeight: 800, fontSize: 16 }}>{a.from.glyph} {a.glyph} {a.to.glyph}</span>
                <span className={`aspect-line ${a.type}`}></span>
                <span style={{ color: 'var(--ink-muted)' }}>{a.name}</span>
                <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{a.orb}°</span>
              </div>
            ))}
          </div>
          <div className="aspects">
            {c.aspects.slice(Math.ceil(c.aspects.length / 2)).map((a, i) => (
              <div className="aspect-row" key={i}>
                <span style={{ fontFamily: 'Roboto Slab', fontWeight: 800, fontSize: 16 }}>{a.from.glyph} {a.glyph} {a.to.glyph}</span>
                <span className={`aspect-line ${a.type}`}></span>
                <span style={{ color: 'var(--ink-muted)' }}>{a.name}</span>
                <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{a.orb}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* houses */}
        <div className="section-divider"><span className="label">house cusps</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {c.houses.map(h => (
            <div key={h.num} style={{ background: 'var(--paper-1)', border: '2px solid var(--ink)', borderRadius: 4, padding: 14, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>house {h.num}</div>
              <div style={{ fontFamily: 'Roboto Slab', fontWeight: 800, fontSize: 22, marginTop: 6 }}>
                {h.sign.glyph} {h.sign.name.toLowerCase()}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>{h.cuspDeg}° cusp</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
