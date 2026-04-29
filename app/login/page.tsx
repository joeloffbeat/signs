'use client'
import { signIn } from 'next-auth/react'
import TopNav from '@/components/TopNav'

export default function LoginPage() {
  return (
    <>
      <TopNav />
      <div className="page" style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px' }}>
        <div className="eyebrow">account</div>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>sign in</h1>
        <p style={{ color: 'var(--ink-muted)', marginBottom: 32 }}>save readings, track your chart over time.</p>
        <button
          className="btn btn-walnut"
          style={{ width: '100%', padding: '12px 24px' }}
          onClick={() => signIn('google', { callbackUrl: '/' })}
        >
          Continue with Google →
        </button>
      </div>
    </>
  )
}
