'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import TopNav from '@/components/TopNav'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'google' | 'email'>('google')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGoogle() {
    await signIn('google', { callbackUrl: '/' })
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email, password, name, mode,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/')
    }
  }

  return (
    <>
      <TopNav />
      <div className="page" style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px' }}>
        <div className="eyebrow">account</div>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 32 }}>sign in</h1>

        <div className="tabs-row" style={{ marginBottom: 24 }}>
          <button
            className={`tab ${tab === 'google' ? 'active' : ''}`}
            onClick={() => setTab('google')}
          >
            Google
          </button>
          <button
            className={`tab ${tab === 'email' ? 'active' : ''}`}
            onClick={() => setTab('email')}
          >
            Email
          </button>
        </div>

        {tab === 'google' && (
          <button className="btn btn-walnut" style={{ width: '100%', padding: '12px 24px' }} onClick={handleGoogle}>
            Continue with Google →
          </button>
        )}

        {tab === 'email' && (
          <form onSubmit={handleCredentials}>
            <div className="tabs-row" style={{ marginBottom: 20 }}>
              <button type="button" className={`tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => setMode('signin')}>Sign In</button>
              <button type="button" className={`tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>Sign Up</button>
            </div>

            {mode === 'signup' && (
              <div className="field" style={{ marginBottom: 16 }}>
                <label className="field-label">name</label>
                <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}

            <div className="field" style={{ marginBottom: 16 }}>
              <label className="field-label">email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="field" style={{ marginBottom: 24 }}>
              <label className="field-label">password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {error && <p style={{ color: 'var(--clay)', fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 16 }}>{error}</p>}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'loading...' : mode === 'signin' ? 'sign in →' : 'create account →'}
            </button>
          </form>
        )}
      </div>
    </>
  )
}
