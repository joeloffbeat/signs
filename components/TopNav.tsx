'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

const PRIMARY_LINKS = [
  { href: '/', label: 'home' },
  { href: '/today', label: 'today' },
  { href: '/tarot', label: 'tarot' },
  { href: '/chart', label: 'birth chart' },
  { href: '/compat', label: 'compatibility' },
]

const MORE_LINKS = [
  { href: '/transits', label: 'transits' },
  { href: '/numerology', label: 'numerology' },
  { href: '/solar-return', label: 'solar return' },
  { href: '/map', label: 'astrocartography' },
]

interface TopNavProps {
  moonPhase?: string
  moonGlyph?: string
}

export default function TopNav({ moonPhase = 'waxing gibbous', moonGlyph = '🌙' }: TopNavProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [moreOpen, setMoreOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const today = new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' })

  return (
    <nav className="top-nav">
      <Link href="/" className="mark">
        <span className="mark-glyph">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="var(--ink)" />
          </svg>
        </span>
        signs
      </Link>

      <div className="links">
        {PRIMARY_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`nav-link ${pathname === l.href ? 'active' : ''}`}
          >
            {l.label}
          </Link>
        ))}

        <div style={{ position: 'relative' }}>
          <button
            className="nav-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setMoreOpen((o) => !o)}
          >
            ···
          </button>
          {moreOpen && (
            <div style={{
              position: 'absolute', top: '100%', left: 0,
              background: 'var(--bg-paper)', border: '2px solid var(--ink)',
              padding: '8px 0', zIndex: 50, minWidth: 160,
              boxShadow: '3px 3px 0 var(--ink)',
            }}>
              {MORE_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="nav-link"
                  style={{ display: 'block', padding: '6px 16px' }}
                  onClick={() => setMoreOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="/dashboard" className="moon" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <span className="glyph">{moonGlyph}</span> {moonPhase}
        </Link>
        <span>·</span>
        <span>{today}</span>
        <span>·</span>

        {session ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setAvatarOpen((o) => !o)}
              style={{
                width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--ink)',
                background: 'var(--walnut)', cursor: 'pointer', overflow: 'hidden', padding: 0,
              }}
            >
              {session.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="avatar" width={28} height={28} style={{ display: 'block' }} />
              ) : (
                <span style={{ color: 'var(--bone)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                  {session.user?.name?.[0]?.toUpperCase() ?? '?'}
                </span>
              )}
            </button>
            {avatarOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0,
                background: 'var(--bg-paper)', border: '2px solid var(--ink)',
                padding: '8px 0', zIndex: 50, minWidth: 140,
                boxShadow: '3px 3px 0 var(--ink)',
              }}>
                <Link
                  href="/readings"
                  className="nav-link"
                  style={{ display: 'block', padding: '6px 16px' }}
                  onClick={() => setAvatarOpen(false)}
                >
                  my readings
                </Link>
                <button
                  className="nav-link"
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 16px', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => signOut()}
                >
                  sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="nav-link" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            login →
          </Link>
        )}
      </div>
    </nav>
  )
}
