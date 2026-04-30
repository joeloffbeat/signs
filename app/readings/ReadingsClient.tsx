'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TAROT_DECK } from '@/lib/tarot-data'

interface Reading {
  id: string
  type: 'tarot' | 'chart' | 'transit' | 'compat'
  data: Record<string, unknown>
  notes: string | null
  created_at: string
}

interface Props {
  readings: Reading[]
  userId: string
}

const POSITIONS = ['past', 'present', 'future']

function TarotDetail({ data }: { data: Record<string, unknown> }) {
  const cards = (data.cards as Array<{ id: string; name: string; reversed: boolean }>) ?? []
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }}>
      {cards.map((c, i) => {
        const full = TAROT_DECK.find(t => t.id === c.id)
        const keywords = full ? (c.reversed ? full.reversed : full.upright) : []
        const meaning = full?.meaning ?? ''
        return (
          <div key={i} style={{ padding: '14px 16px', background: 'var(--paper-2)', border: '1.5px solid rgba(15,13,9,0.15)', borderRadius: 4 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>
              {POSITIONS[i]}{c.reversed ? ' · reversed' : ''}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{c.name}</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
              {keywords.slice(0, 3).map((k: string) => (
                <span key={k} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 6px', background: 'var(--paper-3)', borderRadius: 2, color: 'var(--ink-muted)' }}>{k}</span>
              ))}
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.6, margin: 0, color: 'var(--ink-soft)' }}>{meaning}</p>
          </div>
        )
      })}
    </div>
  )
}

function ChartDetail({ data }: { data: Record<string, unknown> }) {
  const d = data as { name?: string; sun?: string; moon?: string; ascendant?: string }
  const planets = Object.entries(d).filter(([k]) => !['name'].includes(k))
  return (
    <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {planets.map(([key, val]) => (
        <div key={key} style={{ padding: '10px 14px', background: 'var(--paper-2)', border: '1.5px solid rgba(15,13,9,0.15)', borderRadius: 4 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>{key}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{val as string}</div>
        </div>
      ))}
    </div>
  )
}

function CompatDetail({ data }: { data: Record<string, unknown> }) {
  const d = data as {
    person1?: { name?: string; sun?: string }
    person2?: { name?: string; sun?: string }
    overall?: number
    emotional?: number
    intellectual?: number
    physical?: number
  }
  const scores = [
    { label: 'overall', val: d.overall },
    { label: 'emotional', val: d.emotional },
    { label: 'intellectual', val: d.intellectual },
    { label: 'physical', val: d.physical },
  ].filter(s => s.val != null)
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        {[d.person1, d.person2].map((p, i) => p && (
          <div key={i} style={{ padding: '12px 16px', background: 'var(--paper-2)', border: '1.5px solid rgba(15,13,9,0.15)', borderRadius: 4 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>person {i + 1}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{p.name}</div>
            {p.sun && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>☉ {p.sun}</div>}
          </div>
        ))}
      </div>
      {scores.map(s => (
        <div key={s.label} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 11, marginBottom: 4 }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-muted)' }}>{s.label}</span>
            <span style={{ fontWeight: 700 }}>{s.val}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(15,13,9,0.1)', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${s.val}%`, background: 'var(--sage-deep)', borderRadius: 2 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function ReadingDetail({ r }: { r: Reading }) {
  if (r.type === 'tarot') return <TarotDetail data={r.data} />
  if (r.type === 'chart') return <ChartDetail data={r.data} />
  if (r.type === 'compat') return <CompatDetail data={r.data} />
  return null
}

function ReadingSummary({ r }: { r: Reading }) {
  if (r.type === 'tarot') {
    const cards = (r.data.cards as Array<{ name: string; reversed: boolean }>) ?? []
    return <span style={{ color: 'var(--ink-muted)', fontSize: 13 }}>{cards.map(c => c.name).join(' · ')}</span>
  }
  if (r.type === 'chart') {
    const d = r.data as { name?: string; sun?: string; moon?: string; ascendant?: string }
    return <span style={{ color: 'var(--ink-muted)', fontSize: 13 }}>{d.name} — ☉ {d.sun} · ☽ {d.moon} · ↑ {d.ascendant}</span>
  }
  if (r.type === 'compat') {
    const d = r.data as { person1?: { name?: string }; person2?: { name?: string }; overall?: number }
    return <span style={{ color: 'var(--ink-muted)', fontSize: 13 }}>{d.person1?.name} & {d.person2?.name} — {d.overall}% overall</span>
  }
  return null
}

export default function ReadingsClient({ readings: initial, userId }: Props) {
  const [readings, setReadings] = useState(initial)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const router = useRouter()

  async function saveNote(id: string) {
    await fetch(`/api/readings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: noteText }),
    })
    setReadings(rs => rs.map(r => r.id === id ? { ...r, notes: noteText } : r))
    setEditingNote(null)
  }

  async function deleteReading(id: string) {
    if (!confirm('Delete this reading?')) return
    await fetch(`/api/readings/${id}`, { method: 'DELETE' })
    setReadings(rs => rs.filter(r => r.id !== id))
    if (expandedId === id) setExpandedId(null)
    router.refresh()
  }

  if (readings.length === 0) {
    return (
      <div className="page" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        <div className="eyebrow">saved readings</div>
        <p style={{ color: 'var(--ink-muted)', marginTop: 24 }}>
          No saved readings yet. Draw some tarot cards, make a birth chart, or run a compatibility check.
        </p>
      </div>
    )
  }

  return (
    <div className="page" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
      <div className="eyebrow">saved readings</div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 32 }}>your readings</h1>

      {readings.map((r) => {
        const isExpanded = expandedId === r.id
        return (
          <div key={r.id} className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
                style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span className="tag">{r.type}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.55 }}>
                    {new Date(r.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.35, marginLeft: 'auto' }}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
                <ReadingSummary r={r} />
                {r.notes && <p style={{ marginTop: 8, fontSize: 14, opacity: 0.75, marginBottom: 0 }}>{r.notes}</p>}
              </button>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 12, padding: '4px 10px', marginLeft: 12, flexShrink: 0 }}
                onClick={() => deleteReading(r.id)}
              >
                delete
              </button>
            </div>

            {isExpanded && (
              <div style={{ marginTop: 4, paddingTop: 16, borderTop: '1.5px solid rgba(15,13,9,0.1)' }}>
                <ReadingDetail r={r} />
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              {editingNote === r.id ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="input"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="add a note..."
                    style={{ flex: 1 }}
                    autoFocus
                  />
                  <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => saveNote(r.id)}>save</button>
                  <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setEditingNote(null)}>cancel</button>
                </div>
              ) : (
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: 12 }}
                  onClick={() => { setEditingNote(r.id); setNoteText(r.notes ?? '') }}
                >
                  {r.notes ? 'edit note' : '+ add note'}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
