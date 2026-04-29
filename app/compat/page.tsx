'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import TopNav from '@/components/TopNav'
import { makeChart, makeCompat, makeSynastryAspects } from '@/lib/astro-data'
import type { Chart, Compat, SynastryAspect } from '@/lib/astro-data'

interface FormState {
  name: string
  date: string
  time: string
  place: string
}

const emptyForm = (): FormState => ({ name: '', date: '1990-06-15', time: '12:00', place: '' })

function savedChart(): FormState | null {
  if (typeof window === 'undefined') return null
  try {
    const d = JSON.parse(localStorage.getItem('signs-chart') ?? '')
    if (d?.name && d?.date) return d as FormState
  } catch { /* no saved chart */ }
  return null
}

export default function CompatPage() {
  const { data: session } = useSession()
  const prefill = savedChart()
  const [myForm, setMyForm] = useState<FormState>(prefill ?? emptyForm())
  const [myChart, setMyChart] = useState<Chart | null>(
    prefill ? makeChart(prefill.name, prefill.date, prefill.time, prefill.place || 'unknown') : null
  )
  const [partner, setPartner] = useState<Chart | null>(null)
  const [partnerForm, setPartnerForm] = useState<FormState>(emptyForm())
  const [profile, setProfile] = useState<FormState | null>(null)
  const [compatSaved, setCompatSaved] = useState(false)

  useEffect(() => {
    if (!session) return
    fetch('/api/profile').then(r => r.json()).then(d => {
      if (d?.birth_date) setProfile({ name: d.name ?? '', date: d.birth_date, time: d.birth_time ?? '12:00', place: d.birth_place ?? '' })
    })
  }, [session])

  if (!myChart) {
    return (
      <>
        <TopNav />
        <div className="page page-narrow">
          <div className="page-head">
            <div className="eyebrow">synastry · person one</div>
            <h1>start with your chart.</h1>
            <p>enter your birth details below. no login needed — nothing leaves your browser.</p>
          </div>
          <div className="card" style={{ padding: 32, background: 'var(--bone)' }}>
            <div className="form-grid">
              <div className="full">
                <label className="field-label">name</label>
                <input className="input" value={myForm.name} onChange={e => setMyForm({ ...myForm, name: e.target.value })} placeholder="e.g. me" />
              </div>
              <div>
                <label className="field-label">birth date</label>
                <input className="input" type="date" value={myForm.date} onChange={e => setMyForm({ ...myForm, date: e.target.value })} />
              </div>
              <div>
                <label className="field-label">birth time</label>
                <input className="input" type="time" value={myForm.time} onChange={e => setMyForm({ ...myForm, time: e.target.value })} />
              </div>
              <div className="full">
                <label className="field-label">birth place</label>
                <input className="input" value={myForm.place} onChange={e => setMyForm({ ...myForm, place: e.target.value })} placeholder="city, country" />
              </div>
            </div>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <button className="btn btn-primary btn-lg" disabled={!myForm.name || !myForm.date}
                onClick={() => setMyChart(makeChart(myForm.name, myForm.date, myForm.time, myForm.place || 'unknown'))}>
                next: add them →
              </button>
              {profile && (
                <button className="btn btn-ghost" onClick={() => setMyForm(profile)}>
                  use my birth data →
                </button>
              )}
            </div>
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
            <div className="eyebrow">synastry · person two</div>
            <h1>tell me about them.</h1>
            <p>signs computes the synastry — sun pairs, moon pairs, the usual squares and trines, and a single overall number you should not take too seriously.</p>
          </div>
          <div className="card" style={{ padding: 32, background: 'var(--bone)' }}>
            <div className="form-grid">
              <div className="full">
                <label className="field-label">their name</label>
                <input className="input" value={partnerForm.name} onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })} placeholder="e.g. sam" />
              </div>
              <div>
                <label className="field-label">birth date</label>
                <input className="input" type="date" value={partnerForm.date} onChange={e => setPartnerForm({ ...partnerForm, date: e.target.value })} />
              </div>
              <div>
                <label className="field-label">birth time</label>
                <input className="input" type="time" value={partnerForm.time} onChange={e => setPartnerForm({ ...partnerForm, time: e.target.value })} />
              </div>
              <div className="full">
                <label className="field-label">birth place</label>
                <input className="input" value={partnerForm.place} onChange={e => setPartnerForm({ ...partnerForm, place: e.target.value })} placeholder="city, country" />
              </div>
            </div>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setMyChart(null)}>← back</button>
              <button className="btn btn-primary btn-lg" disabled={!partnerForm.name}
                onClick={() => setPartner(makeChart(partnerForm.name, partnerForm.date, partnerForm.time, partnerForm.place || 'unknown'))}>
                run synastry →
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const compat: Compat = makeCompat(myChart, partner)
  const synastry: SynastryAspect[] = makeSynastryAspects(myChart, partner)

  async function saveCompat() {
    if (!session || !myChart || !partner) return
    await fetch('/api/readings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'compat',
        data: {
          person1: { name: myChart.name, sun: myChart.sun.name, moon: myChart.moon.name, ascendant: myChart.ascendant.name },
          person2: { name: partner.name, sun: partner.sun.name, moon: partner.moon.name, ascendant: partner.ascendant.name },
          overall: compat.overall,
        },
      }),
    })
    setCompatSaved(true)
  }

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
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {session && (
              <button className="btn btn-ghost btn-sm" onClick={saveCompat} disabled={compatSaved}>
                {compatSaved ? 'saved ✓' : 'save reading'}
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => setPartner(null)}>change partner</button>
          </div>
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

        {synastry.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div className="section-divider"><span className="label">synastry aspects</span></div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-muted)', marginBottom: 20, maxWidth: 560 }}>
              Cross-chart aspects between personal planets — how {myChart.name.toLowerCase()}'s inner planets interact with {partner.name.toLowerCase()}'s.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {synastry.map((asp, i) => {
                const bg = asp.quality === 'harmonious' ? 'rgba(168,192,144,0.12)' : asp.quality === 'tense' ? 'rgba(184,67,31,0.08)' : 'rgba(212,160,74,0.10)'
                const border = asp.quality === 'harmonious' ? 'var(--sage)' : asp.quality === 'tense' ? 'var(--clay)' : '#d4a04a'
                const badge = asp.quality === 'harmonious' ? { bg: 'rgba(168,192,144,0.25)', color: 'var(--sage)' } : asp.quality === 'tense' ? { bg: 'rgba(184,67,31,0.15)', color: 'var(--clay)' } : { bg: 'rgba(212,160,74,0.2)', color: '#d4a04a' }
                return (
                  <div key={i} style={{ padding: '14px 18px', background: bg, border: `1.5px solid ${border}`, borderRadius: 4, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, alignItems: 'center' }}>
                    <div style={{ fontFamily: 'Roboto Slab', fontWeight: 900, fontSize: 18, whiteSpace: 'nowrap' }}>
                      {asp.p1.glyph} {asp.glyph} {asp.p2.glyph}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>
                        {myChart.name.toLowerCase()}'s {asp.p1.name.toLowerCase()} {asp.name} {partner.name.toLowerCase()}'s {asp.p2.name.toLowerCase()} · {asp.orb}° orb
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.55 }}>{asp.interpretation}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', background: badge.bg, color: badge.color, borderRadius: 2, whiteSpace: 'nowrap' }}>
                      {asp.quality}
                    </div>
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
