'use client'
import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Reading {
  id: string
  type: 'tarot' | 'chart' | 'transit'
  data: Record<string, unknown>
  notes: string | null
  created_at: string
}

interface Props {
  readings: Reading[]
  userId: string
}

export default function ReadingsClient({ readings: initial, userId }: Props) {
  const [readings, setReadings] = useState(initial)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const router = useRouter()

  async function saveNote(id: string) {
    await supabaseBrowser.from('readings').update({ notes: noteText }).eq('id', id)
    setReadings((rs) => rs.map((r) => r.id === id ? { ...r, notes: noteText } : r))
    setEditingNote(null)
  }

  async function deleteReading(id: string) {
    if (!confirm('Delete this reading?')) return
    await supabaseBrowser.from('readings').delete().eq('id', id)
    setReadings((rs) => rs.filter((r) => r.id !== id))
    router.refresh()
  }

  if (readings.length === 0) {
    return (
      <div className="page" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        <div className="eyebrow">saved readings</div>
        <p style={{ color: 'var(--ink-muted)', marginTop: 24 }}>
          No saved readings yet. Draw some tarot cards or make a birth chart to save your first reading.
        </p>
      </div>
    )
  }

  return (
    <div className="page" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
      <div className="eyebrow">saved readings</div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 32 }}>your readings</h1>

      {readings.map((r) => (
        <div key={r.id} className="card" style={{ marginBottom: 16, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
              <span className="tag" style={{ marginRight: 8 }}>{r.type}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.6 }}>
                {new Date(r.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              {r.notes && <p style={{ marginTop: 8, opacity: 0.75 }}>{r.notes}</p>}
            </div>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12, padding: '4px 10px' }}
              onClick={() => deleteReading(r.id)}
            >
              delete
            </button>
          </div>

          {expanded === r.id && (
            <div style={{ marginTop: 16 }}>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.7, overflow: 'auto' }}>
                {JSON.stringify(r.data, null, 2)}
              </pre>
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
