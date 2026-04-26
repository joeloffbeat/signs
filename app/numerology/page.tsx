'use client'
import { useState } from 'react'
import TopNav from '@/components/TopNav'
import { computeNumerology, type NumerologyResult } from '@/lib/numerology'

const INTERPRETATIONS: Record<number, { title: string; text: string }> = {
  1: { title: 'The Pioneer', text: 'Independent, driven, original. You forge paths others follow. Beware isolation.' },
  2: { title: 'The Diplomat', text: 'Sensitive, cooperative, intuitive. You build bridges. Beware self-erasure.' },
  3: { title: 'The Creator', text: 'Expressive, social, joyful. You make things beautiful. Beware scattered energy.' },
  4: { title: 'The Builder', text: 'Disciplined, practical, loyal. You make things last. Beware rigidity.' },
  5: { title: 'The Adventurer', text: 'Curious, free, adaptable. You need variety. Beware restlessness.' },
  6: { title: 'The Nurturer', text: 'Caring, responsible, harmonious. You hold people together. Beware martyrdom.' },
  7: { title: 'The Seeker', text: 'Analytical, spiritual, perceptive. You need solitude to find truth. Beware detachment.' },
  8: { title: 'The Achiever', text: 'Ambitious, authoritative, resilient. You understand power. Beware obsession with status.' },
  9: { title: 'The Sage', text: 'Compassionate, wise, idealistic. You see the whole picture. Beware escapism.' },
  11: { title: 'The Illuminator', text: 'Master number. Visionary, inspirational, highly intuitive. Beware nervous energy.' },
  22: { title: 'The Master Builder', text: 'Master number. You can turn dreams into reality at scale. Beware self-doubt.' },
  33: { title: 'The Master Teacher', text: 'Master number. Healing, devotion, spiritual guidance. Beware over-sacrifice.' },
}

const LABELS = ['life path', 'expression', 'soul urge', 'personal year']
const KEYS: (keyof NumerologyResult)[] = ['lifePath', 'expression', 'soulUrge', 'personalYear']

export default function NumerologyPage() {
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<NumerologyResult | null>(null)

  function calculate(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !birthDate) return
    setResult(computeNumerology(name, birthDate))
  }

  return (
    <>
      <TopNav />
      <div className="page" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        <div className="eyebrow">numerology</div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>your numbers</h1>
        <p className="lede">Pythagorean numerology — life path, expression, soul urge, and the current year&apos;s theme.</p>

        <form onSubmit={calculate} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
          <div className="field" style={{ flex: '2 1 200px' }}>
            <label className="field-label">full birth name</label>
            <input className="input" type="text" placeholder="as on birth certificate" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field" style={{ flex: '1 1 160px' }}>
            <label className="field-label">birth date</label>
            <input className="input" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
          </div>
          <div className="field" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn btn-primary" type="submit">calculate →</button>
          </div>
        </form>

        {result && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {KEYS.map((key, i) => {
              const n = result[key]
              const interp = INTERPRETATIONS[n]
              return (
                <div key={key} className="card" style={{ padding: 24 }}>
                  <div className="field-label">{LABELS[i]}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, lineHeight: 1, margin: '12px 0', color: 'var(--walnut)' }}>{n}</div>
                  {interp && (
                    <>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {interp.title}
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{interp.text}</p>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
