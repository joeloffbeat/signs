'use client'
import { useState } from 'react'
import TopNav from '@/components/TopNav'
import { getAllPlanetLore, type PlanetLore } from '@/lib/planet-lore'
import { getAllSignLore, type SignLore } from '@/lib/sign-lore'
import { SIGNS } from '@/lib/astro-data'

const PLANETS = getAllPlanetLore()
const SIGN_LORE = getAllSignLore()
const SIGN_META = Object.fromEntries(SIGNS.map((s) => [s.name.toLowerCase(), s]))

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
