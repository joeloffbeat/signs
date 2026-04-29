'use client'
import { useRouter } from 'next/navigation'
import TarotArt from '@/components/TarotArt'
import { TAROT_DECK } from '@/lib/tarot-data'

export default function HomeContent() {
  const router = useRouter()
  const heroCards = [TAROT_DECK[6], TAROT_DECK[19], TAROT_DECK[17]] // Lovers, Sun, Star

  return (
    <div className="page" data-screen-label="01 Home">
      {/* hero */}
      <div className="hero">
        <div>
          <div className="eyebrow">a divination tool · est. mmxxv</div>
          <h1>
            the stars <span className="strike">don't</span> know you.<br/>
            but the <em>math</em> is fun.
          </h1>
          <p className="lede">
            signs is a small, sturdy place for tarot, birth charts, and the daily question of "what's the vibe today." everything's calculated, nothing's invented. read it, ignore it, write it down — your call.
          </p>
          <div className="cta-row">
            <button className="btn btn-primary btn-lg" onClick={() => router.push('/today')}>get today's read →</button>
            <button className="btn btn-ghost" onClick={() => router.push('/chart')}>or make a chart</button>
          </div>
          <div style={{ marginTop: 28, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-muted)', letterSpacing: '0.05em' }}>
            no llms · no horoscope mad-libs · just ephemerides + good fonts
          </div>
        </div>
        <div className="hero-stack">
          {heroCards.map((c, i) => (
            <div key={c.id} className={`hero-card c${i + 1}`}>
              <div className="frame" data-deck-style="woodcut">
                <div className="face-art" style={{ width: '100%', height: '100%' }}>
                  <TarotArt card={c} style="woodcut" />
                </div>
              </div>
              <div className="label">{c.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* feature grid */}
      <div className="feature-grid">
        <div className="feature-card b1" onClick={() => router.push('/today')}>
          <div className="glyph-box">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="5" fill="var(--ink)" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>
            </svg>
          </div>
          <h3>today's vibe</h3>
          <p>a single-word mood, a few measurements, one thing to do, one to dodge. takes 4 seconds to read.</p>
          <span className="arrow">read today →</span>
        </div>

        <div className="feature-card b2" onClick={() => router.push('/tarot')}>
          <div className="glyph-box">
            <svg width="32" height="40" viewBox="0 0 24 30" fill="none" stroke="var(--ink)" strokeWidth="2">
              <rect x="3" y="3" width="18" height="24" rx="1" fill="var(--bone)" />
              <path d="M12 9 L14 14 L19 14 L15 17 L17 22 L12 19 L7 22 L9 17 L5 14 L10 14 Z" fill="var(--ink)" stroke="none"/>
            </svg>
          </div>
          <h3>three-card pull</h3>
          <p>past, present, future. 22 majors, no minor noise, no upsell to a celtic cross. shuffle, cut, flip.</p>
          <span className="arrow">draw cards →</span>
        </div>

        <div className="feature-card b3" onClick={() => router.push('/chart')}>
          <div className="glyph-box">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="5" />
              <path d="M3 12h18M12 3v18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/>
            </svg>
          </div>
          <h3>birth chart</h3>
          <p>your full natal wheel. planets, houses, aspects, dominant element. enter your data once, save it, come back.</p>
          <span className="arrow">make chart →</span>
        </div>
      </div>

      {/* manifesto */}
      <div className="manifesto">
        <div>
          <h2>made for the curious & the skeptical.</h2>
        </div>
        <div>
          <p>
            i don't think jupiter cares about your monday. i do think the wheel of the year is older than the calendar, and the symbols are a useful mirror. signs treats astrology like a craft — wood, ink, math, type. nothing predicts anything. but reading the sky every day is a habit i recommend.
          </p>
          <p style={{ marginTop: 16, color: 'var(--bone)' }}>— j.</p>
        </div>
        <div className="stamp-spot">
          <span className="stamp">no woo, mostly</span>
        </div>
      </div>

      {/* sample reading preview */}
      <div className="section-divider">
        <span className="label">a reading, in three bites</span>
      </div>
      <div className="reading-grid" style={{ marginTop: 0 }}>
        {[
          { pos: 'past', card: TAROT_DECK[12] },
          { pos: 'present', card: TAROT_DECK[9] },
          { pos: 'future', card: TAROT_DECK[19] },
        ].map(s => (
          <div key={s.pos} className="reading-col">
            <div className="position">{s.pos}</div>
            <h3>{s.card.name}</h3>
            <div className="keywords">
              {s.card.upright.map((k: string) => <span key={k} className="tag">{k}</span>)}
            </div>
            <p>{s.card.meaning}</p>
          </div>
        ))}
      </div>

      <div className="foot">
        <div className="col">
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.02em' }}>signs</span>
          <span>built warm · 2025</span>
        </div>
        <div className="col" style={{ alignItems: 'flex-end' }}>
          <a href="#">about</a>
          <a href="#">methods</a>
          <a href="#">rss</a>
        </div>
      </div>
    </div>
  )
}
