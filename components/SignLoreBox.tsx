'use client'
import { useState } from 'react'
import { getSignLore } from '@/lib/sign-lore'

interface Props {
  signName: string
  label?: string  // e.g. "sun", "moon", "rising"
  glyph?: string
  inline?: boolean  // compact inline toggle vs full card
}

export default function SignLoreBox({ signName, label, glyph, inline }: Props) {
  const [open, setOpen] = useState(false)
  const lore = getSignLore(signName)
  if (!lore) return null

  return (
    <div style={{ marginTop: inline ? 8 : 12 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--ink-muted)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <span style={{ fontSize: 9, transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(90deg)' : 'none' }}>▶</span>
        {open ? 'hide mythology' : 'mythology + archetype'}
      </button>

      {open && (
        <div style={{
          marginTop: 12, padding: '20px 20px 16px',
          background: 'var(--ink)', color: 'var(--bone)',
          border: '2px solid var(--ink)', borderRadius: 4,
          boxShadow: '3px 3px 0 rgba(15,13,9,0.15)',
        }}>
          {/* archetype */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--paper-2)', marginBottom: 6 }}>
              {glyph && <span style={{ marginRight: 6 }}>{glyph}</span>}{signName}{label ? ` · ${label}` : ''}
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, lineHeight: 1.5, margin: 0, color: 'var(--bone)', fontStyle: 'italic' }}>
              {lore.archetype}
            </p>
          </div>

          {/* divider */}
          <div style={{ borderTop: '1px solid rgba(245,240,232,0.15)', marginBottom: 16 }} />

          {/* greek */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--honey)', marginBottom: 6 }}>
              greek · {lore.greek.deity}
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, color: 'var(--paper-2)' }}>
              {lore.greek.myth}
            </p>
          </div>

          {/* indian */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--clay-soft)', marginBottom: 6 }}>
              vedic · {lore.indian.deity}
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, color: 'var(--paper-2)' }}>
              {lore.indian.myth}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
