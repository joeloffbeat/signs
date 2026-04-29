'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import TopNav from '@/components/TopNav'
import TarotArt from '@/components/TarotArt'
import { TAROT_DECK } from '@/lib/tarot-data'
import type { TarotCard } from '@/lib/tarot-data'

type DrawnCard = TarotCard & { isReversed: boolean }

export default function TarotPage() {
  const { data: session } = useSession()
  const [phase, setPhase] = useState<'intro' | 'shuffle' | 'fan' | 'reveal'>('intro')
  const [drawn, setDrawn] = useState<DrawnCard[]>([])
  const [flipped, setFlipped] = useState([false, false, false])
  const [question, setQuestion] = useState('')
  const [saved, setSaved] = useState(false)

  async function saveReading() {
    if (!session) return
    await fetch('/api/readings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'tarot',
        data: { cards: drawn.map((c) => ({ id: c.id, name: c.name, reversed: c.isReversed })) },
      }),
    })
    setSaved(true)
  }

  const beginShuffle = () => {
    setPhase('shuffle')
    setTimeout(() => {
      const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5)
      const picks = shuffled.slice(0, 3).map(c => ({ ...c, isReversed: Math.random() < 0.25 }))
      setDrawn(picks)
      setPhase('fan')
    }, 1400)
  }

  const flip = (i: number) => {
    setFlipped(prev => prev.map((v, idx) => idx === i ? true : v))
  }
  const allFlipped = flipped.every(Boolean)

  const reset = () => {
    setPhase('intro')
    setDrawn([])
    setFlipped([false, false, false])
    setQuestion('')
  }

  const positions = ['past', 'present', 'future']

  return (
    <>
      <TopNav />
      <div className="page">
        <div className="page-head">
          <div className="eyebrow">three-card spread · majors only</div>
          <h1>pull a few cards.</h1>
          <p>22 majors, no minor noise. think of a question, shuffle, cut, flip. don't overthink it. the cards are a mirror, not a search engine.</p>
        </div>

        {phase === 'intro' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <h3>what's on your mind?</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 18 }}>
                optional. a clear question helps. "should i quit my job" is fine. so is "what do i need to hear."
              </p>
              <textarea className="textarea" rows={3} value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="type your question, or don't" />
              <div style={{ marginTop: 24 }} className="btn-row">
                <button className="btn btn-primary btn-lg" onClick={beginShuffle}>shuffle the deck →</button>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-muted)', marginLeft: 12 }}>
                  press <span className="kbd">enter</span> when ready
                </span>
              </div>
            </div>
            <div className="tarot-table" style={{ minHeight: 380 }}>
              <span className="table-label">deck — woodcut</span>
              <span className="table-label-r">22 cards</span>
              <div className="deck-stack" data-deck-style="woodcut">
                <div className="tarot-card"><div className="back"><div className="back-frame">s</div></div></div>
                <div className="tarot-card"><div className="back"><div className="back-frame">s</div></div></div>
                <div className="tarot-card"><div className="back"><div className="back-frame">s</div></div></div>
              </div>
            </div>
          </div>
        )}

        {phase === 'shuffle' && (
          <div className="tarot-table">
            <span className="table-label">shuffling</span>
            <div className="deck-stack jitter" data-deck-style="woodcut">
              <div className="tarot-card"><div className="back"><div className="back-frame">s</div></div></div>
              <div className="tarot-card"><div className="back"><div className="back-frame">s</div></div></div>
              <div className="tarot-card"><div className="back"><div className="back-frame">s</div></div></div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--paper-2)', letterSpacing: '0.18em', fontSize: 12, textTransform: 'uppercase' }}>
              cutting the deck<span className="loading-dots"><span>.</span><span>.</span><span>.</span></span>
            </div>
          </div>
        )}

        {(phase === 'fan' || phase === 'reveal') && (
          <>
            <div className="tarot-table">
              <span className="table-label">{question ? `q: ${question.slice(0, 40)}${question.length > 40 ? '…' : ''}` : 'open reading'}</span>
              <span className="table-label-r">{flipped.filter(Boolean).length}/3 revealed</span>
              <div className="spread-row">
                {drawn.map((c, i) => (
                  <div key={i} className="spread-slot">
                    <div className="slot-label">{positions[i]}</div>
                    <div
                      className={`tarot-card ${flipped[i] ? 'flipped' : ''} ${c.isReversed && flipped[i] ? 'reversed' : ''}`}
                      data-deck-style="woodcut"
                      onClick={() => !flipped[i] && flip(i)}
                      style={{
                        animation: `cardDeal 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.18}s both`
                      }}
                    >
                      <div className="back"><div className="back-frame">s</div></div>
                      <div className="face">
                        <div className="face-frame">
                          <div className="face-num">
                            <span>{c.id}</span>
                            <span>{c.isReversed ? '℞' : '·'}</span>
                          </div>
                          <div className="face-art">
                            <TarotArt card={c} style="woodcut" />
                          </div>
                          <div className="face-name">{c.name}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="scroll-hint" style={{ color: 'var(--paper-2)', marginTop: 0 }}>
                {allFlipped ? 'interpretation below ↓' : 'click each card to flip'}
              </div>
            </div>

            {allFlipped && (
              <>
                <div className="reading-grid fade-up">
                  {drawn.map((c, i) => (
                    <div key={i} className="reading-col">
                      <div className="position">{positions[i]}{c.isReversed ? ' · reversed' : ''}</div>
                      <h3>{c.name}</h3>
                      <div className="keywords">
                        {(c.isReversed ? c.reversed : c.upright).map((k: string, ki: number) => (
                          <span key={ki} className="tag">{k}</span>
                        ))}
                      </div>
                      <p>{c.meaning}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 32, padding: 24, background: 'var(--paper-2)', border: '2px solid var(--ink)', borderRadius: 4, boxShadow: 'var(--shadow-md)' }}>
                  <div className="eyebrow">read together</div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.4, margin: 0 }}>
                    you came from <strong>{drawn[0].name.toLowerCase()}</strong>, you're sitting in <strong>{drawn[1].name.toLowerCase()}</strong>, and the path bends toward <strong>{drawn[2].name.toLowerCase()}</strong>. notice what you're being asked to leave behind.
                  </p>
                </div>

                <div className="btn-row" style={{ marginTop: 24, justifyContent: 'center' }}>
                  <button className="btn btn-ghost" onClick={reset}>shuffle again</button>
                  {session && drawn.length === 3 && (
                    <button
                      className={`btn ${saved ? 'btn-ghost' : 'btn-primary'}`}
                      onClick={saveReading}
                      disabled={saved}
                      style={{ marginTop: 24 }}
                    >
                      {saved ? 'saved ✓' : 'save this reading →'}
                    </button>
                  )}
                  <button className="btn btn-secondary">share</button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}
