// Today (daily vibe) + Tarot reading flow

window.TodayScreen = function({ chart }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="page page-narrow" data-screen-label="02 Today (loading)">
        <div className="vibe-loader">
          <div className="scribble"></div>
          <div className="text">drawing today's chart<span className="loading-dots"><span>.</span><span>.</span><span>.</span></span></div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.1em" }}>
            transits · moon phase · planetary hours
          </div>
        </div>
      </div>
    );
  }

  const v = makeDailyVibe(chart);
  const today = new Date();
  const dateLabel = today.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" }).toLowerCase();

  return (
    <div className="page" data-screen-label="02 Today">
      <div className="page-head">
        <div className="eyebrow">today's read</div>
        <h1>{dateLabel}.</h1>
        <p>your daily vibe, calculated from {chart.name.toLowerCase()}'s natal positions and today's transits. one paragraph, two numbers, no horoscope filler.</p>
      </div>

      <div className="today-grid">
        <div className="today-main fade-up">
          <div className="today-date">
            <span className="pulse"></span>
            <span>computed {today.toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" })}</span>
            <span>·</span>
            <span>moon in {v.transitSign.name.toLowerCase()}</span>
          </div>
          <h2 className="today-headline">today is <em style={{ color: "var(--clay)" }}>{v.mood.word}</em>.</h2>
          <blockquote className="today-quote">{v.mood.desc}</blockquote>

          <div className="today-stats">
            <div className="stat-box">
              <div className="label">energy</div>
              <div className="value">{v.energyPct}%</div>
              <div className="transit-bar" style={{ marginTop: 8 }}>
                <div className="fill" style={{ width: v.energyPct + "%" }}></div>
              </div>
            </div>
            <div className="stat-box">
              <div className="label">focus</div>
              <div className="value">{v.focusPct}%</div>
              <div className="transit-bar" style={{ marginTop: 8 }}>
                <div className="fill" style={{ width: v.focusPct + "%", background: "var(--honey)" }}></div>
              </div>
            </div>
            <div className="stat-box">
              <div className="label">luck</div>
              <div className="value">{v.luckPct}%</div>
              <div className="transit-bar" style={{ marginTop: 8 }}>
                <div className="fill" style={{ width: v.luckPct + "%", background: "var(--clay-soft)" }}></div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
            <div className="stat-box" style={{ background: "var(--sage-soft)" }}>
              <div className="label">do this</div>
              <div className="value" style={{ fontSize: 17 }}>{v.todo}.</div>
            </div>
            <div className="stat-box" style={{ background: "var(--paper-2)" }}>
              <div className="label">watch out for</div>
              <div className="value" style={{ fontSize: 17 }}>{v.watchOut}.</div>
            </div>
          </div>
        </div>

        <div className="today-side">
          <div className="side-card">
            <h4>planetary hours</h4>
            <div className="row-line"><span className="k">ruling planet</span><span className="v">{v.transit.name} {v.transit.glyph}</span></div>
            <div className="row-line"><span className="k">peak hour</span><span className="v">{String(v.luckHour).padStart(2,"0")}:00</span></div>
            <div className="row-line"><span className="k">moon phase</span><span className="v">waxing gibbous</span></div>
            <div className="row-line"><span className="k">color</span><span className="v" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
              <span style={{ width: 14, height: 14, background: `var(--${v.color})`, border: "2px solid var(--ink)", display: "inline-block" }}></span>
              {v.color}
            </span></div>
          </div>

          <div className="side-card">
            <h4>active transits</h4>
            {chart.aspects.slice(0, 4).map((a, i) => (
              <div key={i} className="row-line">
                <span className="k" style={{ fontFamily: "Roboto Slab", fontSize: 14, fontWeight: 800, color: "var(--ink)", textTransform: "none", letterSpacing: 0 }}>
                  {a.from.glyph} {a.glyph} {a.to.glyph}
                </span>
                <span className="v" style={{ color: "var(--ink-muted)" }}>{a.name} · {a.orb}°</span>
              </div>
            ))}
          </div>

          <div className="side-card" style={{ background: "var(--ink)", color: "var(--bone)", borderColor: "var(--ink)" }}>
            <h4 style={{ color: "var(--bone)" }}>your sun</h4>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontFamily: "Roboto Slab", fontWeight: 900, fontSize: 56, lineHeight: 1 }}>{chart.sun.glyph}</div>
              <div>
                <div style={{ fontFamily: "Roboto Slab", fontWeight: 800, fontSize: 22 }}>{chart.sun.name}</div>
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--paper-2)", marginTop: 2 }}>
                  {chart.sun.element} · {chart.sun.mode} · ruled by {chart.sun.ruler}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Tarot ----------
window.TarotScreen = function({ deckStyle }) {
  const [phase, setPhase] = useState("intro"); // intro -> shuffle -> fan -> reveal
  const [drawn, setDrawn] = useState([]); // 3 cards
  const [flipped, setFlipped] = useState([false, false, false]);
  const [question, setQuestion] = useState("");

  const beginShuffle = () => {
    setPhase("shuffle");
    setTimeout(() => {
      // pick 3 random cards, possibly reversed
      const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
      const picks = shuffled.slice(0, 3).map(c => ({ ...c, reversed: Math.random() < 0.25 }));
      setDrawn(picks);
      setPhase("fan");
    }, 1400);
  };

  const flip = (i) => {
    setFlipped(prev => prev.map((v, idx) => idx === i ? true : v));
  };
  const allFlipped = flipped.every(Boolean);

  const reset = () => {
    setPhase("intro");
    setDrawn([]);
    setFlipped([false, false, false]);
  };

  const positions = ["past", "present", "future"];

  return (
    <div className="page" data-screen-label="03 Tarot">
      <div className="page-head">
        <div className="eyebrow">three-card spread · majors only</div>
        <h1>pull a few cards.</h1>
        <p>22 majors, no minor noise. think of a question, shuffle, cut, flip. don't overthink it. the cards are a mirror, not a search engine.</p>
      </div>

      {phase === "intro" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <h3>what's on your mind?</h3>
            <p style={{ color: "var(--ink-soft)", fontSize: 14, marginBottom: 18 }}>
              optional. a clear question helps. "should i quit my job" is fine. so is "what do i need to hear."
            </p>
            <textarea className="textarea" rows={3} value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="type your question, or don't" />
            <div style={{ marginTop: 24 }} className="btn-row">
              <button className="btn btn-primary btn-lg" onClick={beginShuffle}>shuffle the deck →</button>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-muted)", marginLeft: 12 }}>
                press <span className="kbd">enter</span> when ready
              </span>
            </div>
          </div>
          <div className="tarot-table" style={{ minHeight: 380 }}>
            <span className="table-label">deck — {deckStyle}</span>
            <span className="table-label-r">22 cards</span>
            <div className="deck-stack" data-deck-style={deckStyle}>
              <div className="tarot-card"><div className="back"><div className="back-frame">s</div></div></div>
              <div className="tarot-card"><div className="back"><div className="back-frame">s</div></div></div>
              <div className="tarot-card"><div className="back"><div className="back-frame">s</div></div></div>
            </div>
          </div>
        </div>
      )}

      {phase === "shuffle" && (
        <div className="tarot-table">
          <span className="table-label">shuffling</span>
          <div className="deck-stack jitter" data-deck-style={deckStyle}>
            <div className="tarot-card"><div className="back"><div className="back-frame">s</div></div></div>
            <div className="tarot-card"><div className="back"><div className="back-frame">s</div></div></div>
            <div className="tarot-card"><div className="back"><div className="back-frame">s</div></div></div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", color: "var(--paper-2)", letterSpacing: "0.18em", fontSize: 12, textTransform: "uppercase" }}>
            cutting the deck<span className="loading-dots"><span>.</span><span>.</span><span>.</span></span>
          </div>
        </div>
      )}

      {(phase === "fan" || phase === "reveal") && (
        <>
          <div className="tarot-table">
            <span className="table-label">{question ? `q: ${question.slice(0, 40)}${question.length > 40 ? "…" : ""}` : "open reading"}</span>
            <span className="table-label-r">{flipped.filter(Boolean).length}/3 revealed</span>
            <div className="spread-row">
              {drawn.map((c, i) => (
                <div key={i} className="spread-slot">
                  <div className="slot-label">{positions[i]}</div>
                  <div
                    className={`tarot-card ${flipped[i] ? "flipped" : ""} ${c.reversed && flipped[i] ? "reversed" : ""}`}
                    data-deck-style={deckStyle}
                    onClick={() => !flipped[i] && flip(i)}
                    style={{
                      animation: `cardDeal 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.18}s both`
                    }}
                  >
                    <div className="back"><div className="back-frame">s</div></div>
                    <div className="face">
                      <div className="face-frame">
                        <div className="face-num">
                          <span>{c.num}</span>
                          <span>{c.reversed ? "℞" : "·"}</span>
                        </div>
                        <div className="face-art">
                          <TarotArt card={c} style={deckStyle} />
                        </div>
                        <div className="face-name">{c.name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="scroll-hint" style={{ color: "var(--paper-2)", marginTop: 0 }}>
              {allFlipped ? "interpretation below ↓" : "click each card to flip"}
            </div>
          </div>

          {allFlipped && (
            <>
              <div className="reading-grid fade-up">
                {drawn.map((c, i) => (
                  <div key={i} className="reading-col">
                    <div className="position">{positions[i]}{c.reversed ? " · reversed" : ""}</div>
                    <h3>{c.name}</h3>
                    <div className="keywords">
                      {(c.reversed ? c.reversed_kw || c.reversed : c.upright).map((k, ki) => (
                        <span key={ki} className="tag">{k}</span>
                      ))}
                    </div>
                    <p>{c.meaning}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 32, padding: 24, background: "var(--paper-2)", border: "2px solid var(--ink)", borderRadius: 4, boxShadow: "var(--shadow-md)" }}>
                <div className="eyebrow">read together</div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.4, margin: 0 }}>
                  you came from <strong>{drawn[0].name.toLowerCase()}</strong>, you're sitting in <strong>{drawn[1].name.toLowerCase()}</strong>, and the path bends toward <strong>{drawn[2].name.toLowerCase()}</strong>. notice what you're being asked to leave behind.
                </p>
              </div>

              <div className="btn-row" style={{ marginTop: 24, justifyContent: "center" }}>
                <button className="btn btn-ghost" onClick={reset}>shuffle again</button>
                <button className="btn">save this reading</button>
                <button className="btn btn-secondary">share</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
