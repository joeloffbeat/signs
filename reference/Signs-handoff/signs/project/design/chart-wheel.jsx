// Birth chart wheel SVG component
// Two styles: "renaissance" (heavy borders, decorative ring) | "minimal" (clean lines)
window.ChartWheel = function({ chart, style = "renaissance", animated = true }) {
  const cx = 250, cy = 250;
  const rOuter = 240;
  const rZodiac = 215;
  const rHouse = 165;
  const rInner = 100;
  const rPlanet = 140;

  // Convert longitude (0-360) to SVG angle. 0° Aries at 9 o'clock (left).
  // We rotate so ascendant is at 9 o'clock.
  const ascLong = SIGNS.indexOf(chart.ascendant) * 30;
  const toAngle = (long) => {
    const a = (long - ascLong) * (Math.PI / 180);
    return -a + Math.PI; // 9 o'clock baseline, counterclockwise
  };
  const polar = (r, long) => {
    const a = toAngle(long);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };

  // zodiac signs ring — use Roman numerals (sign 1-12) so we don't need emoji font
  const signRoman = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
  const signs12 = [];
  for (let i = 0; i < 12; i++) {
    const long = i * 30 + 15; // middle of sign
    const [x, y] = polar((rZodiac + rHouse) / 2 + 8, long);
    const sign = SIGNS[i];
    const sname = sign.name.slice(0, 3).toUpperCase();
    signs12.push(
      <g key={"s" + i}>
        <text x={x} y={y + 1} textAnchor="middle"
              fontFamily="Roboto Slab, serif" fontSize="14" fontWeight="900"
              fill="var(--ink)" letterSpacing="1">
          {sname}
        </text>
        <text x={x} y={y + 14} textAnchor="middle"
              fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700"
              fill="var(--ink-muted)">
          {signRoman[i]}
        </text>
      </g>
    );
  }
  // zodiac dividers
  const signLines = [];
  for (let i = 0; i < 12; i++) {
    const [x1, y1] = polar(rZodiac, i * 30);
    const [x2, y2] = polar(rHouse, i * 30);
    signLines.push(
      <line key={"sl" + i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="var(--ink)" strokeWidth={style === "renaissance" ? 1.5 : 1} />
    );
  }

  // house dividers
  const houseLines = [];
  for (let i = 0; i < 12; i++) {
    const [x1, y1] = polar(rHouse, i * 30);
    const [x2, y2] = polar(rInner, i * 30);
    const isAxis = i === 0 || i === 3 || i === 6 || i === 9; // ASC, IC, DSC, MC
    houseLines.push(
      <line key={"hl" + i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="var(--ink)" strokeWidth={isAxis ? 2.5 : 1}
            strokeDasharray={isAxis ? "0" : "4 3"} />
    );
  }
  // house numbers
  const houseLabels = [];
  for (let i = 0; i < 12; i++) {
    const long = i * 30 + 15;
    const [x, y] = polar((rHouse + rInner) / 2, long);
    houseLabels.push(
      <text key={"hn" + i} x={x} y={y + 4} textAnchor="middle"
            fontFamily="JetBrains Mono" fontSize="11" fontWeight="700"
            fill="var(--ink-muted)">{i + 1}</text>
    );
  }

  // aspects (in inner circle)
  const aspectLines = chart.aspects.map((a, i) => {
    const [x1, y1] = polar(rInner - 4, a.from.longitude);
    const [x2, y2] = polar(rInner - 4, a.to.longitude);
    const colorMap = {
      conj: "var(--ink)",
      sext: "var(--sage-deep)",
      square: "var(--clay)",
      trine: "var(--sage-deep)",
      opp: "var(--clay)",
    };
    const dashMap = {
      sext: "4 4",
      square: "0",
      trine: "0",
      opp: "6 4",
      conj: "0",
    };
    return (
      <line key={"a" + i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={colorMap[a.type] || "var(--ink)"}
            strokeWidth={1.4}
            strokeDasharray={dashMap[a.type]} opacity="0.7" />
    );
  });

  // planets
  const planetGroups = chart.planets.map((p, i) => {
    const [x, y] = polar(rPlanet, p.longitude);
    return (
      <g key={p.id}
         className={animated ? "planet-mark" : ""}
         style={animated ? { transformOrigin: `${cx}px ${cy}px`, animation: `wheelIn 0.7s cubic-bezier(0.34,1.56,0.64,1) ${0.2 + i * 0.07}s both` } : {}}>
        <circle cx={x} cy={y} r="16" fill="var(--bone)" stroke="var(--ink)" strokeWidth="2" />
        <text x={x} y={y + 5} textAnchor="middle"
              fontFamily="Roboto Slab, serif" fontSize="11" fontWeight="900"
              fill="var(--ink)" letterSpacing="0.5">{p.name.slice(0,2).toUpperCase()}</text>
        {p.retro && (
          <text x={x + 12} y={y - 8} fontFamily="JetBrains Mono" fontSize="9" fontWeight="700"
                fill="var(--clay)">℞</text>
        )}
      </g>
    );
  });

  // outer decorative ring (renaissance)
  const decor = style === "renaissance" ? (
    <g>
      {[...Array(36)].map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const x1 = cx + rOuter * Math.cos(a);
        const y1 = cy + rOuter * Math.sin(a);
        const x2 = cx + (rZodiac + 2) * Math.cos(a);
        const y2 = cy + (rZodiac + 2) * Math.sin(a);
        return <line key={"d" + i} x1={x1} y1={y1} x2={x2} y2={y2}
                     stroke="var(--ink)" strokeWidth={i % 3 === 0 ? 2 : 1} />;
      })}
      <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="var(--ink)" strokeWidth="2.5" />
    </g>
  ) : null;

  // ASC / MC labels
  const asc = polar(rOuter + 8, 0);
  const mc = polar(rOuter + 8, 270);
  const dsc = polar(rOuter + 8, 180);
  const ic = polar(rOuter + 8, 90);

  return (
    <svg viewBox="0 0 500 500" style={{ width: "100%", height: "100%" }}>
      {decor}
      <circle cx={cx} cy={cy} r={rZodiac} fill="var(--paper-1)" stroke="var(--ink)" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={rHouse} fill="var(--bone)" stroke="var(--ink)" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={rInner} fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
      {signLines}
      {signs12}
      {houseLines}
      {houseLabels}
      {aspectLines}
      {planetGroups}

      {/* ASC label */}
      <text x={asc[0] - 18} y={asc[1] + 4} fontFamily="JetBrains Mono" fontSize="12" fontWeight="700" fill="var(--ink)">ASC</text>
      <text x={mc[0]} y={mc[1] - 4} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="12" fontWeight="700" fill="var(--ink)">MC</text>
      <text x={dsc[0] + 4} y={dsc[1] + 4} fontFamily="JetBrains Mono" fontSize="12" fontWeight="700" fill="var(--ink-muted)">DSC</text>
      <text x={ic[0]} y={ic[1] + 16} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="12" fontWeight="700" fill="var(--ink-muted)">IC</text>
    </svg>
  );
};
