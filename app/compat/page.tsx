'use client'
import { useState } from 'react'
import TopNav from '@/components/TopNav'
import { makeChart, makeCompat } from '@/lib/astro-data'
import type { Chart, Compat } from '@/lib/astro-data'

interface FormState {
  name: string
  date: string
  time: string
  place: string
}

export default function CompatPage() {
  // Seed a default "your" chart; in a real flow this would come from localStorage
  const [myChart] = useState<Chart | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('signs-chart')
      if (saved) {
        try {
          const d = JSON.parse(saved)
          return makeChart(d.name, d.date, d.time, d.place || 'unknown')
        } catch {
          return null
        }
      }
    }
    return null
  })

  const [partner, setPartner] = useState<Chart | null>(null)
  const [form, setForm] = useState<FormState>({ name: '', date: '1992-04-22', time: '09:15', place: '' })

  if (!myChart) {
    return (
      <>
        <TopNav />
        <div className="page page-narrow">
          <div className="page-head">
            <div className="eyebrow">synastry</div>
            <h1>need your chart first.</h1>
            <p>compatibility is computed against your natal positions. make a chart and come back.</p>
          </div>
        </div>
      </>
    )
  }

  if (!partner) {
    return (
      <>
        <TopNav />
        <div className="page page-narrow">
          <div className="page-head">
            <div className="eyebrow">synastry · second person</div>
            <h1>tell me about them.</h1>
            <p>same fields as your chart. signs computes the synastry — sun pairs, moon pairs, the usual squares and trines, and a single overall number you should not take too seriously.</p>
          </div>
          <div className="card" style={{ padding: 32, background: 'var(--bone)' }}>
            <div className="form-grid">
              <div className="full">
                <label className="field-label">their name</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. sam" />
              </div>
              <div>
                <label className="field-label">birth date</label>
                <input className="input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="field-label">birth time</label>
                <input className="input" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              </div>
              <div className="full">
                <label className="field-label">birth place</label>
                <input className="input" value={form.place} onChange={e => setForm({ ...form, place: e.target.value })} placeholder="city, country" />
              </div>
            </div>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <button className="btn btn-primary btn-lg" disabled={!form.name}
                onClick={() => setPartner(makeChart(form.name, form.date, form.time, form.place || 'unknown'))}>
                run synastry →
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const compat: Compat = makeCompat(myChart, partner)

  return (
    <>
      <TopNav />
      <div className="page">
        <div className="page-head split">
          <div>
            <div className="eyebrow">synastry</div>
            <h1>{myChart.name.toLowerCase()} & {partner.name.toLowerCase()}.</h1>
            <p>{compat.summary} take the number with salt. the bars below say more.</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setPartner(null)}>change partner</button>
        </div>

        <div className="compat-grid">
          <div className="compat-person">
            <div className="av">{myChart.name[0]?.toUpperCase()}</div>
            <h3>{myChart.name}</h3>
            <div className="when">{myChart.dateStr}</div>
            <div className="signs">
              <span className="badge badge-sage">{myChart.sun.glyph} sun</span>
              <span className="badge">{myChart.moon.glyph} moon</span>
              <span className="badge badge-ghost">{myChart.ascendant.glyph} rising</span>
            </div>
          </div>

          <div className="compat-meter">
            <div className="meter-circle">
              <div className="pct">{compat.overall}</div>
              <div className="lbl">overall</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              {compat.overall >= 80 ? 'rare alignment' : compat.overall >= 60 ? 'workable' : compat.overall >= 40 ? 'needs effort' : 'tough draw'}
            </div>
          </div>

          <div className="compat-person b">
            <div className="av">{partner.name[0]?.toUpperCase()}</div>
            <h3>{partner.name}</h3>
            <div className="when">{partner.dateStr}</div>
            <div className="signs">
              <span className="badge badge-sage">{partner.sun.glyph} sun</span>
              <span className="badge">{partner.moon.glyph} moon</span>
              <span className="badge badge-ghost">{partner.ascendant.glyph} rising</span>
            </div>
          </div>
        </div>

        <div className="compat-bars">
          <h4 style={{ margin: '0 0 16px' }}>by dimension</h4>
          {compat.bars.map(b => (
            <div className="compat-bar" key={b.label}>
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 11, color: 'var(--ink-muted)' }}>{b.label}</span>
              <div className="bar-track">
                <div className={`bar-fill ${b.pct < 40 ? 'bad' : b.pct < 60 ? 'warn' : ''}`} style={{ width: b.pct + '%' }}></div>
              </div>
              <span style={{ fontWeight: 700, textAlign: 'right' }}>{b.pct}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, padding: 28, background: 'var(--ink)', color: 'var(--bone)', border: '3px solid var(--ink)', borderRadius: 4 }}>
          <div className="eyebrow" style={{ color: 'var(--paper-2)' }}>read together</div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.4, margin: 0, color: 'var(--bone)' }}>
            {myChart.sun.element} sun meeting {partner.sun.element} sun is {compat.overall >= 70 ? 'easier than most' : compat.overall >= 50 ? 'a study in opposites' : 'a friction worth understanding'}. moons in {myChart.moon.element} and {partner.moon.element} mean your nightly selves {myChart.moon.element === partner.moon.element ? 'speak the same language' : 'translate before they understand'}. the rest is choices.
          </p>
        </div>
      </div>
    </>
  )
}
