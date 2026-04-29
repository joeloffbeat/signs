'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import TopNav from '@/components/TopNav'
import ChartWheel from '@/components/ChartWheel'
import SignLoreBox from '@/components/SignLoreBox'
import { makeChart } from '@/lib/astro-data'
import type { Chart } from '@/lib/astro-data'
import { getHouseMeaning } from '@/lib/house-meanings'
import { makeProgressedChart } from '@/lib/progressions'

type Mode = 'input' | 'loading' | 'view'

interface FormState {
  name: string
  date: string
  time: string
  place: string
  tz: string
}

const TZ_OPTIONS = [
  'UTC-12', 'UTC-11', 'UTC-10', 'UTC-09:30', 'UTC-09', 'UTC-08', 'UTC-07',
  'UTC-06', 'UTC-05', 'UTC-04', 'UTC-03:30', 'UTC-03', 'UTC-02', 'UTC-01',
  'UTC+00', 'UTC+01', 'UTC+02', 'UTC+03', 'UTC+03:30', 'UTC+04', 'UTC+04:30',
  'UTC+05', 'UTC+05:30', 'UTC+05:45', 'UTC+06', 'UTC+06:30', 'UTC+07',
  'UTC+08', 'UTC+08:45', 'UTC+09', 'UTC+09:30', 'UTC+10', 'UTC+10:30',
  'UTC+11', 'UTC+12', 'UTC+12:45', 'UTC+13', 'UTC+14',
]

function HouseCard({ h }: { h: Chart['houses'][0] }) {
  const [open, setOpen] = useState(false)
  const meaning = getHouseMeaning(h.num)
  const ord = h.num === 1 ? 'st' : h.num === 2 ? 'nd' : h.num === 3 ? 'rd' : 'th'

  return (
    <div style={{ background: 'var(--paper-1)', border: '2px solid var(--ink)', borderRadius: 4, padding: 14, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
        house {h.num}{ord}
      </div>
      <div style={{ fontFamily: 'Roboto Slab', fontWeight: 800, fontSize: 22, marginTop: 6 }}>
        {h.sign.glyph} {h.sign.name.toLowerCase()}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>{h.cuspDeg}° cusp</div>
      {meaning && (
        <>
          <button
            onClick={() => setOpen(o => !o)}
            style={{ marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <span style={{ fontSize: 8, display: 'inline-block', transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'none' }}>▶</span>
            {meaning.name}
          </button>
          {open && (
            <div style={{ marginTop: 10, padding: '14px 16px', background: 'var(--ink)', color: 'var(--bone)', borderRadius: 3 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--honey)', marginBottom: 6 }}>
                {meaning.keywords.join(' · ')}
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.65, margin: '0 0 10px', color: 'var(--paper-2)' }}>{meaning.governs}</p>
              <p style={{ fontSize: 12, lineHeight: 1.65, margin: 0, color: 'var(--paper-2)', opacity: 0.8 }}>{meaning.deeper}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function ChartPage() {
  const { data: session } = useSession()
  const [mode, setMode] = useState<Mode>('input')
  const [saved, setSaved] = useState(false)
  const [showProgressed, setShowProgressed] = useState(false)
  const [form, setForm] = useState<FormState>({
    name: '',
    date: '1990-06-15',
    time: '14:30',
    place: '',
    tz: 'UTC+00',
  })
  const [chart, setChart] = useState<Chart | null>(null)
  const [profile, setProfile] = useState<FormState | null>(null)

  useEffect(() => {
    if (!session) return
    fetch('/api/profile').then(r => r.json()).then(d => {
      if (d?.birth_date) setProfile({ name: d.name ?? '', date: d.birth_date, time: d.birth_time ?? '12:00', place: d.birth_place ?? '', tz: d.birth_tz ?? 'UTC+00' })
    })
  }, [session])

  async function saveChart() {
    if (!session || !chart) return
    await fetch('/api/readings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'chart',
        data: { name: chart.name, dateStr: chart.dateStr, sun: chart.sun.name, moon: chart.moon.name, ascendant: chart.ascendant.name },
      }),
    })
    setSaved(true)
  }

  const submit = () => {
    if (!form.name || !form.date) return
    const newChart = makeChart(form.name, form.date, form.time, form.place || 'unknown')
    setChart(newChart)
    if (typeof window !== 'undefined') {
      localStorage.setItem('signs-chart', JSON.stringify({ name: form.name, date: form.date, time: form.time, place: form.place, tz: form.tz }))
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
              <div>
                <label className="field-label">birth place</label>
                <input className="input" value={form.place}
                  onChange={e => setForm({ ...form, place: e.target.value })}
                  placeholder="city, country" />
              </div>
              <div>
                <label className="field-label">timezone</label>
                <select className="input" value={form.tz} onChange={e => setForm({ ...form, tz: e.target.value })}>
                  {TZ_OPTIONS.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select>
                <div className="field-help">local time zone at birth location.</div>
              </div>
            </div>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <button className="btn btn-primary btn-lg" onClick={submit} disabled={!form.name || !form.date}>
                draw the chart →
              </button>
              {profile && (
                <button className="btn btn-ghost" onClick={() => setForm(profile)}>
                  use my birth data →
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => setForm({ name: 'sample', date: '1990-06-21', time: '12:00', place: 'london, uk', tz: 'UTC+01' })}>
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

  const c = chart!

  const progressedResult = (() => {
    if (!showProgressed) return null
    try { return makeProgressedChart(c.name, c.dateStr, c.timeStr, c.place) } catch { return null }
  })()

  return (
    <>
      <TopNav />
      <div className="page">
        <div className="page-head split">
          <div>
            <div className="eyebrow">natal chart</div>
            <h1>{c.name}'s wheel.</h1>
            <p>{c.dateStr} · {c.timeStr} · {c.place}{form.tz !== 'UTC+00' ? ` · ${form.tz}` : ''}</p>
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
                <SignLoreBox signName={c.sun.name} label="sun" glyph={c.sun.glyph} inline />
              </div>
              <div className="b" style={{ background: 'var(--paper-2)' }}>
                <div className="lbl">moon</div>
                <div className="glyph">{c.moon.glyph}</div>
                <div className="name">{c.moon.name.toLowerCase()}</div>
                <SignLoreBox signName={c.moon.name} label="moon" glyph={c.moon.glyph} inline />
              </div>
              <div className="b" style={{ background: 'var(--sage-soft)' }}>
                <div className="lbl">rising</div>
                <div className="glyph">{c.ascendant.glyph}</div>
                <div className="name">{c.ascendant.name.toLowerCase()}</div>
                <SignLoreBox signName={c.ascendant.name} label="rising" glyph={c.ascendant.glyph} inline />
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
          {c.houses.map(h => <HouseCard key={h.num} h={h} />)}
        </div>

        {/* progressed chart */}
        <div className="section-divider">
          <span className="label">secondary progressions</span>
          <button
            onClick={() => setShowProgressed(s => !s)}
            style={{ marginLeft: 16, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', background: showProgressed ? 'var(--ink)' : 'transparent', color: showProgressed ? 'var(--bone)' : 'var(--ink-muted)', border: '1.5px solid var(--ink)', borderRadius: 2, cursor: 'pointer' }}
          >
            {showProgressed ? 'hide' : 'show'}
          </button>
        </div>

        {showProgressed && progressedResult && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.7, maxWidth: 640, marginBottom: 24 }}>
              Secondary progressions move the chart forward at a rate of <strong style={{ color: 'var(--ink)' }}>one solar day per year of life</strong>. Your natal planets have progressed to the positions below — reflecting internal development rather than external transits. The progressed Sun changes sign roughly every 30 years; the progressed Moon every 2–2.5 years.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
              <div>
                <div className="field-label" style={{ marginBottom: 8 }}>natal · {c.dateStr}</div>
                <ChartWheel chart={c} size={380} />
              </div>
              <div>
                <div className="field-label" style={{ marginBottom: 8 }}>
                  progressed · {progressedResult.progressedDate.toISOString().slice(0, 10)}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, marginLeft: 8, color: 'var(--ink-muted)' }}>
                    ({Math.floor(progressedResult.ageInYears)} yrs)
                  </span>
                </div>
                <ChartWheel chart={progressedResult.progressedChart} size={380} />
              </div>
            </div>
            <div className="placement-table" style={{ marginTop: 24 }}>
              <div className="row head"><div>planet</div><div>natal sign</div><div>progressed sign</div><div>shift</div></div>
              {progressedResult.progressedChart.planets.map((pp, i) => {
                const natal = c.planets[i]
                const changed = natal?.sign.name !== pp.sign.name
                return (
                  <div className="row" key={pp.id} style={{ background: changed ? 'rgba(168,192,144,0.1)' : undefined }}>
                    <div className="planet"><span className="glyph">{pp.glyph}</span> {pp.name.toLowerCase()}</div>
                    <div>{natal?.sign.glyph} {natal?.sign.name.toLowerCase()}</div>
                    <div style={{ color: changed ? 'var(--sage)' : undefined, fontWeight: changed ? 700 : undefined }}>{pp.sign.glyph} {pp.sign.name.toLowerCase()}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: changed ? 'var(--sage)' : 'var(--ink-muted)' }}>{changed ? '↗ sign change' : '—'}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
