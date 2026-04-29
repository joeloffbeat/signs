// Birth chart input + analysis + compatibility

window.ChartScreen = function({ chart, setChart, wheelStyle }) {
  const [mode, setMode] = useState(chart ? "view" : "input");
  const [form, setForm] = useState({
    name: chart?.name || "",
    date: chart?.dateStr || "1990-06-15",
    time: chart?.timeStr || "14:30",
    place: chart?.place || "",
  });

  const submit = () => {
    if (!form.name || !form.date) return;
    const c = makeChart(form.name, form.date, form.time, form.place || "unknown");
    setChart(c);
    setMode("loading");
    setTimeout(() => setMode("view"), 1100);
  };

  if (mode === "input") {
    return (
      <div className="page page-narrow" data-screen-label="04 Chart Input">
        <div className="page-head">
          <div className="eyebrow">natal chart · enter your data</div>
          <h1>where & when did you start?</h1>
          <p>signs needs four things to draw your wheel: a name to label it, a birth date, a birth time (within an hour is fine), and a place. nothing leaves your browser.</p>
        </div>

        <div className="card" style={{ padding: 32, background: "var(--bone)" }}>
          <div className="form-grid">
            <div className="full">
              <label className="field-label">name (or what to call this chart)</label>
              <input className="input" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. me · joel · test chart" />
            </div>
            <div>
              <label className="field-label">birth date</label>
              <input className="input" type="date" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="field-label">birth time</label>
              <input className="input" type="time" value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })} />
              <div className="field-help">if unknown, pick noon. you'll lose ascendant accuracy.</div>
            </div>
            <div className="full">
              <label className="field-label">birth place</label>
              <input className="input" value={form.place}
                onChange={e => setForm({ ...form, place: e.target.value })}
                placeholder="city, country" />
            </div>
          </div>
          <div className="btn-row" style={{ marginTop: 28 }}>
            <button className="btn btn-primary btn-lg" onClick={submit} disabled={!form.name || !form.date}>
              draw the chart →
            </button>
            <button className="btn btn-ghost" onClick={() => setForm({ name: "joel", date: "1991-09-12", time: "07:42", place: "edinburgh, uk" })}>
              use sample data
            </button>
          </div>
        </div>

        <div style={{ marginTop: 32, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-muted)", lineHeight: 1.7 }}>
          <strong style={{ color: "var(--ink)" }}>method:</strong> placidus houses, tropical zodiac. ephemeris from swiss ephemeris (mock for this prototype). times in local civil time. no fudging.
        </div>
      </div>
    );
  }

  if (mode === "loading") {
    return (
      <div className="page page-narrow" data-screen-label="04 Chart Loading">
        <div className="vibe-loader">
          <div className="scribble"></div>
          <div className="text">computing planets<span className="loading-dots"><span>.</span><span>.</span><span>.</span></span></div>
        </div>
      </div>
    );
  }

  // view mode
  return (
    <div className="page" data-screen-label="04 Chart View">
      <div className="page-head split">
        <div>
          <div className="eyebrow">natal chart</div>
          <h1>{chart.name}'s wheel.</h1>
          <p>{chart.dateStr} · {chart.timeStr} · {chart.place}</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setMode("input")}>edit data</button>
      </div>

      <div className="chart-grid">
        <div className="chart-wheel-wrap">
          <ChartWheel chart={chart} style={wheelStyle} />
        </div>

        <div className="chart-meta">
          <div className="big3">
            <div className="b">
              <div className="lbl">sun</div>
              <div className="glyph">{chart.sun.glyph}</div>
              <div className="name">{chart.sun.name.toLowerCase()}</div>
            </div>
            <div className="b" style={{ background: "var(--paper-2)" }}>
              <div className="lbl">moon</div>
              <div className="glyph">{chart.moon.glyph}</div>
              <div className="name">{chart.moon.name.toLowerCase()}</div>
            </div>
            <div className="b" style={{ background: "var(--sage-soft)" }}>
              <div className="lbl">rising</div>
              <div className="glyph">{chart.ascendant.glyph}</div>
              <div className="name">{chart.ascendant.name.toLowerCase()}</div>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ margin: "0 0 12px" }}>signature</h4>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "var(--ink-soft)" }}>
              dominant element: <strong style={{ color: "var(--ink)" }}>{chart.dominantEl}</strong>.
              dominant mode: <strong style={{ color: "var(--ink)" }}>{chart.dominantMode}</strong>.
              this is a {chart.dominantMode}-{chart.dominantEl} signature — {chart.dominantEl === "fire" ? "kindling, restless, forward-leaning" : chart.dominantEl === "earth" ? "patient, hands-on, slow to commit" : chart.dominantEl === "air" ? "verbal, ideas-first, can over-think" : "moody, intuitive, runs on feeling"}.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 14 }}>
              {Object.entries(chart.elementCount).map(([el, n]) => (
                <div key={el} style={{ textAlign: "center", padding: 8, border: "1.5px solid var(--ink)", borderRadius: 2, background: "var(--paper-2)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)" }}>{el}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, marginTop: 2 }}>{n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* placement table */}
      <div className="section-divider"><span className="label">planetary placements</span></div>
      <div className="placement-table">
        <div className="row head">
          <div>planet</div><div>sign</div><div>house</div><div>°</div>
        </div>
        {chart.planets.map(p => (
          <div className="row" key={p.id}>
            <div className="planet"><span className="glyph">{p.glyph}</span> {p.name.toLowerCase()}{p.retro ? " ℞" : ""}</div>
            <div><span className="glyph">{p.sign.glyph}</span> {p.sign.name.toLowerCase()}</div>
            <div className="deg">{p.house}{p.house===1?"st":p.house===2?"nd":p.house===3?"rd":"th"} house</div>
            <div className="deg">{p.deg}° {String(p.degMin).padStart(2,"0")}'</div>
          </div>
        ))}
      </div>

      {/* aspects */}
      <div className="section-divider"><span className="label">major aspects</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="aspects">
          {chart.aspects.slice(0, Math.ceil(chart.aspects.length/2)).map((a, i) => (
            <div className="aspect-row" key={i}>
              <span style={{ fontFamily: "Roboto Slab", fontWeight: 800, fontSize: 16 }}>{a.from.glyph} {a.glyph} {a.to.glyph}</span>
              <span className={`aspect-line ${a.type}`}></span>
              <span style={{ color: "var(--ink-muted)" }}>{a.name}</span>
              <span style={{ color: "var(--ink)", fontWeight: 700 }}>{a.orb}°</span>
            </div>
          ))}
        </div>
        <div className="aspects">
          {chart.aspects.slice(Math.ceil(chart.aspects.length/2)).map((a, i) => (
            <div className="aspect-row" key={i}>
              <span style={{ fontFamily: "Roboto Slab", fontWeight: 800, fontSize: 16 }}>{a.from.glyph} {a.glyph} {a.to.glyph}</span>
              <span className={`aspect-line ${a.type}`}></span>
              <span style={{ color: "var(--ink-muted)" }}>{a.name}</span>
              <span style={{ color: "var(--ink)", fontWeight: 700 }}>{a.orb}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* houses */}
      <div className="section-divider"><span className="label">house cusps</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {chart.houses.map(h => (
          <div key={h.num} style={{ background: "var(--paper-1)", border: "2px solid var(--ink)", borderRadius: 4, padding: 14, boxShadow: "var(--shadow-sm)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-muted)" }}>house {h.num}</div>
            <div style={{ fontFamily: "Roboto Slab", fontWeight: 800, fontSize: 22, marginTop: 6 }}>
              {h.sign.glyph} {h.sign.name.toLowerCase()}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-muted)", marginTop: 2 }}>{h.cuspDeg}° cusp</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- Compatibility ----------
window.CompatScreen = function({ chart }) {
  const [partner, setPartner] = useState(null);
  const [form, setForm] = useState({ name: "", date: "1992-04-22", time: "09:15", place: "" });

  if (!chart) {
    return (
      <div className="page page-narrow" data-screen-label="05 Compat (no chart)">
        <div className="page-head">
          <div className="eyebrow">synastry</div>
          <h1>need your chart first.</h1>
          <p>compatibility is computed against your natal positions. make a chart and come back.</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="page page-narrow" data-screen-label="05 Compat Input">
        <div className="page-head">
          <div className="eyebrow">synastry · second person</div>
          <h1>tell me about them.</h1>
          <p>same fields as your chart. signs computes the synastry — sun pairs, moon pairs, the usual squares and trines, and a single overall number you should not take too seriously.</p>
        </div>
        <div className="card" style={{ padding: 32, background: "var(--bone)" }}>
          <div className="form-grid">
            <div className="full">
              <label className="field-label">their name</label>
              <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. sam" />
            </div>
            <div>
              <label className="field-label">birth date</label>
              <input className="input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div>
              <label className="field-label">birth time</label>
              <input className="input" type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
            </div>
            <div className="full">
              <label className="field-label">birth place</label>
              <input className="input" value={form.place} onChange={e => setForm({...form, place: e.target.value})} placeholder="city, country" />
            </div>
          </div>
          <div className="btn-row" style={{ marginTop: 28 }}>
            <button className="btn btn-primary btn-lg" disabled={!form.name}
              onClick={() => setPartner(makeChart(form.name, form.date, form.time, form.place || "unknown"))}>
              run synastry →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const compat = makeCompat(chart, partner);

  return (
    <div className="page" data-screen-label="05 Compat View">
      <div className="page-head split">
        <div>
          <div className="eyebrow">synastry</div>
          <h1>{chart.name.toLowerCase()} & {partner.name.toLowerCase()}.</h1>
          <p>{compat.summary} take the number with salt. the bars below say more.</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setPartner(null)}>change partner</button>
      </div>

      <div className="compat-grid">
        <div className="compat-person">
          <div className="av">{chart.name[0]?.toUpperCase()}</div>
          <h3>{chart.name}</h3>
          <div className="when">{chart.dateStr}</div>
          <div className="signs">
            <span className="badge badge-sage">{chart.sun.glyph} sun</span>
            <span className="badge">{chart.moon.glyph} moon</span>
            <span className="badge badge-ghost">{chart.ascendant.glyph} rising</span>
          </div>
        </div>

        <div className="compat-meter">
          <div className="meter-circle">
            <div className="pct">{compat.overall}</div>
            <div className="lbl">overall</div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-muted)" }}>
            {compat.overall >= 80 ? "rare alignment" : compat.overall >= 60 ? "workable" : compat.overall >= 40 ? "needs effort" : "tough draw"}
          </div>
        </div>

        <div className="compat-person b">
          <div className="av">{partner.name[0]?.toUpperCase()}</div>
          <h3>{partner.name}</h3>
          <div className="when">{partner.dateStr}</div>
          <div className="signs">
            <span className="badge badge-sage">{partner.sun.glyph} sun</span>
            <span className="badge">{partner.moon.glyph} moon</span>
            <span className="badge badge-ghost">{partner.ascendant.glyph} rising</span>
          </div>
        </div>
      </div>

      <div className="compat-bars">
        <h4 style={{ margin: "0 0 16px" }}>by dimension</h4>
        {compat.bars.map(b => (
          <div className="compat-bar" key={b.label}>
            <span style={{ textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 11, color: "var(--ink-muted)" }}>{b.label}</span>
            <div className="bar-track">
              <div className={`bar-fill ${b.pct < 40 ? "bad" : b.pct < 60 ? "warn" : ""}`} style={{ width: b.pct + "%" }}></div>
            </div>
            <span style={{ fontWeight: 700, textAlign: "right" }}>{b.pct}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: 28, background: "var(--ink)", color: "var(--bone)", border: "3px solid var(--ink)", borderRadius: 4 }}>
        <div className="eyebrow" style={{ color: "var(--paper-2)" }}>read together</div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.4, margin: 0, color: "var(--bone)" }}>
          {chart.sun.element} sun meeting {partner.sun.element} sun is {compat.overall >= 70 ? "easier than most" : compat.overall >= 50 ? "a study in opposites" : "a friction worth understanding"}. moons in {chart.moon.element} and {partner.moon.element} mean your nightly selves {chart.moon.element === partner.moon.element ? "speak the same language" : "translate before they understand"}. the rest is choices.
        </p>
      </div>
    </div>
  );
};
