'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import TopNav from '@/components/TopNav'

interface Profile {
  name: string
  birth_date: string
  birth_time: string
  birth_place: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState<Profile>({ name: '', birth_date: '', birth_time: '', birth_place: '' })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return }
    if (status !== 'authenticated') return
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => {
        if (data) setForm({
          name: data.name ?? session?.user?.name ?? '',
          birth_date: data.birth_date ?? '',
          birth_time: data.birth_time ?? '',
          birth_place: data.birth_place ?? '',
        })
        setLoading(false)
      })
  }, [status, router, session])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return <><TopNav /><div className="page page-narrow"><p style={{ color: 'var(--ink-muted)' }}>loading...</p></div></>

  return (
    <>
      <TopNav />
      <div className="page page-narrow">
        <div className="eyebrow">account</div>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>your profile</h1>
        <p style={{ color: 'var(--ink-muted)', marginBottom: 32 }}>
          {session?.user?.email} — birth data is used to pre-fill charts, compatibility, and numerology.
        </p>
        <form onSubmit={save}>
          <div className="card" style={{ padding: 32, background: 'var(--bone)' }}>
            <div className="form-grid">
              <div className="full">
                <label className="field-label">display name</label>
                <input className="input" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="your name" />
              </div>
              <div>
                <label className="field-label">birth date</label>
                <input className="input" type="date" value={form.birth_date}
                  onChange={e => setForm({ ...form, birth_date: e.target.value })} />
              </div>
              <div>
                <label className="field-label">birth time</label>
                <input className="input" type="time" value={form.birth_time}
                  onChange={e => setForm({ ...form, birth_time: e.target.value })} />
                <div className="field-help">leave blank if unknown</div>
              </div>
              <div className="full">
                <label className="field-label">birth place</label>
                <input className="input" value={form.birth_place}
                  onChange={e => setForm({ ...form, birth_place: e.target.value })}
                  placeholder="city, country" />
              </div>
            </div>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <button className="btn btn-primary" type="submit">
                {saved ? 'saved ✓' : 'save profile →'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
