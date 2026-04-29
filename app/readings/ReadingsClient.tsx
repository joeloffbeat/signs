'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

      {readings.map((r) => (
        <div key={r.id} className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className="tag">{r.type}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.55 }}>
                  {new Date(r.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <ReadingSummary r={r} />
              {r.notes && <p style={{ marginTop: 8, fontSize: 14, opacity: 0.75, marginBottom: 0 }}>{r.notes}</p>}
            </div>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12, padding: '4px 10px', marginLeft: 12 }}
              onClick={() => deleteReading(r.id)}
            >
              delete
            </button>
          </div>

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
      ))}
    </div>
  )
}
