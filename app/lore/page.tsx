'use client'
import { useState } from 'react'
import TopNav from '@/components/TopNav'
import { getAllPlanetLore, type PlanetLore } from '@/lib/planet-lore'
import { getAllSignLore, type SignLore } from '@/lib/sign-lore'
import { SIGNS } from '@/lib/astro-data'

const PLANETS = getAllPlanetLore()
const SIGN_LORE = getAllSignLore()
const SIGN_META = Object.fromEntries(SIGNS.map((s) => [s.name.toLowerCase(), s]))

const COMPAT: Record<string, { best: string[]; good: string[]; opposite: string; why: string }> = {
  Aries:       { best: ['Leo', 'Sagittarius'],     good: ['Gemini', 'Aquarius'],   opposite: 'Libra',        why: 'Fire trines match Aries\' drive; air sextiles feed its need for spark. Libra opposes it with diplomacy — the peacemaker meets the warrior.' },
  Taurus:      { best: ['Virgo', 'Capricorn'],     good: ['Cancer', 'Pisces'],     opposite: 'Scorpio',      why: 'Earth trines share its patience and appetite for tangible results. Water sextiles nourish without destabilising. Scorpio opposes it — the hidden vs. the held.' },
  Gemini:      { best: ['Libra', 'Aquarius'],      good: ['Aries', 'Leo'],         opposite: 'Sagittarius',  why: 'Air trines keep pace with its mind. Fire sextiles bring energy to match its restlessness. Sagittarius opposes with philosophy vs. data.' },
  Cancer:      { best: ['Scorpio', 'Pisces'],      good: ['Taurus', 'Virgo'],      opposite: 'Capricorn',    why: 'Water trines speak the same emotional language. Earth sextiles provide the security it craves. Capricorn opposes with ambition vs. belonging.' },
  Leo:         { best: ['Aries', 'Sagittarius'],   good: ['Gemini', 'Libra'],      opposite: 'Aquarius',     why: 'Fire trines amplify its warmth and confidence. Air sextiles provide an audience and ideas. Aquarius opposes it — the individual vs. the collective.' },
  Virgo:       { best: ['Taurus', 'Capricorn'],    good: ['Cancer', 'Scorpio'],    opposite: 'Pisces',       why: 'Earth trines share its precision and reliability. Water sextiles add depth to its analysis. Pisces opposes with dream vs. detail.' },
  Libra:       { best: ['Gemini', 'Aquarius'],     good: ['Leo', 'Sagittarius'],   opposite: 'Aries',        why: 'Air trines match its social intelligence. Fire sextiles introduce spontaneity without overwhelming. Aries opposes with action vs. deliberation.' },
  Scorpio:     { best: ['Cancer', 'Pisces'],       good: ['Virgo', 'Capricorn'],   opposite: 'Taurus',       why: 'Water trines match its emotional depth and intensity. Earth sextiles provide stability for its transformations. Taurus opposes — depth vs. permanence.' },
  Sagittarius: { best: ['Aries', 'Leo'],           good: ['Libra', 'Aquarius'],    opposite: 'Gemini',       why: 'Fire trines share its hunger for experience and expansion. Air sextiles keep the conversation philosophical. Gemini opposes with local vs. universal.' },
  Capricorn:   { best: ['Taurus', 'Virgo'],        good: ['Scorpio', 'Pisces'],    opposite: 'Cancer',       why: 'Earth trines share its discipline and long-range thinking. Water sextiles add emotional intelligence to its strategy. Cancer opposes — structure vs. softness.' },
  Aquarius:    { best: ['Gemini', 'Libra'],        good: ['Aries', 'Sagittarius'], opposite: 'Leo',          why: 'Air trines match its vision and idealism. Fire sextiles bring boldness to its innovation. Leo opposes — the group vs. the individual.' },
  Pisces:      { best: ['Cancer', 'Scorpio'],      good: ['Taurus', 'Capricorn'],  opposite: 'Virgo',        why: 'Water trines share its sensitivity and imagination. Earth sextiles ground its dreams without crushing them. Virgo opposes with analysis vs. surrender.' },
}

type Tab = 'planets' | 'signs'

function PlanetCard({ p }: { p: PlanetLore }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        border: '2px solid var(--ink)',
        borderRadius: 4,
        background: open ? 'var(--ink)' : 'var(--paper-1)',
        color: open ? 'var(--bone)' : 'var(--ink)',
        transition: 'background 0.2s, color 0.2s',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          cursor: 'pointer', padding: '20px 24px', color: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Roboto Slab', fontWeight: 900, fontSize: 44, lineHeight: 1, minWidth: 52 }}>
            {p.glyph}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>{p.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', opacity: 0.5, textTransform: 'uppercase' }}>
                rules {p.rules}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.55, opacity: 0.8, fontStyle: 'italic' }}>
              {p.archetype}
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {p.keywords.map((k) => (
                <span key={k} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '2px 7px', border: `1px solid ${open ? 'rgba(245,240,232,0.3)' : 'rgba(15,13,9,0.2)'}`,
                  borderRadius: 2, opacity: 0.7,
                }}>
                  {k}
                </span>
              ))}
            </div>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.4 }}>
            {open ? '▲' : '▼'}
          </span>
        </div>
      </button>

      {open && (
        <div style={{ padding: '0 24px 24px', borderTop: '1px solid rgba(245,240,232,0.15)' }}>
          <div style={{ paddingTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--honey)', marginBottom: 8 }}>
                greek · {p.greek.deity}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.75, margin: 0, color: 'var(--paper-2)' }}>
                {p.greek.myth}
              </p>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--clay-soft)', marginBottom: 8 }}>
                vedic · {p.indian.deity}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.75, margin: 0, color: 'var(--paper-2)' }}>
                {p.indian.myth}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SignCard({ lore }: { lore: SignLore }) {
  const [open, setOpen] = useState(false)
  const meta = SIGN_META[lore.sign.toLowerCase()]
  const compat = COMPAT[lore.sign]

  return (
    <div
      style={{
        border: '2px solid var(--ink)',
        borderRadius: 4,
        background: open ? 'var(--ink)' : 'var(--paper-1)',
        color: open ? 'var(--bone)' : 'var(--ink)',
        transition: 'background 0.2s, color 0.2s',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          cursor: 'pointer', padding: '20px 24px', color: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Roboto Slab', fontWeight: 900, fontSize: 44, lineHeight: 1, minWidth: 52 }}>
            {meta?.glyph ?? '?'}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>{lore.sign}</span>
              {meta && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', opacity: 0.5, textTransform: 'uppercase' }}>
                  {meta.element} · {meta.mode} · {meta.ruler}
                </span>
              )}
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.55, opacity: 0.8, fontStyle: 'italic' }}>
              {lore.archetype}
            </p>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.4 }}>
            {open ? '▲' : '▼'}
          </span>
        </div>
      </button>

      {open && (
        <div style={{ padding: '0 24px 24px', borderTop: '1px solid rgba(245,240,232,0.15)' }}>
          <div style={{ paddingTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--honey)', marginBottom: 8 }}>
                greek · {lore.greek.deity}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.75, margin: 0, color: 'var(--paper-2)' }}>
                {lore.greek.myth}
              </p>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--clay-soft)', marginBottom: 8 }}>
                vedic · {lore.indian.deity}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.75, margin: 0, color: 'var(--paper-2)' }}>
                {lore.indian.myth}
              </p>
            </div>
          </div>

          {compat && (
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(245,240,232,0.15)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: 14 }}>
                compatibility
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: 6 }}>
                    best match
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {compat.best.map((s) => {
                      const m = SIGN_META[s.toLowerCase()]
                      return (
                        <span key={s} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, padding: '3px 8px', background: 'rgba(168,192,144,0.2)', border: '1px solid var(--sage)', borderRadius: 2, color: 'var(--bone)' }}>
                          {m?.glyph} {s}
                        </span>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--honey)', marginBottom: 6 }}>
                    good match
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {compat.good.map((s) => {
                      const m = SIGN_META[s.toLowerCase()]
                      return (
                        <span key={s} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, padding: '3px 8px', background: 'rgba(212,160,74,0.15)', border: '1px solid rgba(212,160,74,0.5)', borderRadius: 2, color: 'var(--bone)' }}>
                          {m?.glyph} {s}
                        </span>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--clay-soft)', marginBottom: 6 }}>
                    opposite
                  </div>
                  <div>
                    {(() => {
                      const m = SIGN_META[compat.opposite.toLowerCase()]
                      return (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, padding: '3px 8px', background: 'rgba(184,67,31,0.15)', border: '1px solid rgba(184,67,31,0.4)', borderRadius: 2, color: 'var(--bone)' }}>
                          {m?.glyph} {compat.opposite}
                        </span>
                      )
                    })()}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.65, margin: 0, color: 'var(--paper-2)', opacity: 0.75 }}>
                {compat.why}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function LorePage() {
  const [tab, setTab] = useState<Tab>('planets')

  return (
    <>
      <TopNav />
      <div className="page" style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <div className="eyebrow">compendium</div>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 4 }}>planets & signs.</h1>
        <p style={{ color: 'var(--ink-muted)', marginBottom: 32, maxWidth: 560 }}>
          mythology, archetype, and lore for every body and sign in the wheel.
        </p>

        <div style={{ display: 'flex', gap: 0, marginBottom: 32, borderBottom: '2px solid var(--ink)' }}>
          {(['planets', 'signs'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '10px 20px', border: 'none', cursor: 'pointer',
                background: tab === t ? 'var(--ink)' : 'transparent',
                color: tab === t ? 'var(--bone)' : 'var(--ink-muted)',
                borderRadius: '4px 4px 0 0', marginBottom: -2,
              }}
            >
              {t === 'planets' ? `planets (${PLANETS.length})` : `signs (${SIGN_LORE.length})`}
            </button>
          ))}
        </div>

        {tab === 'planets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PLANETS.map((p) => (
              <PlanetCard key={p.id} p={p} />
            ))}
          </div>
        )}

        {tab === 'signs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SIGN_LORE.map((l) => (
              <SignCard key={l.sign} lore={l} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
