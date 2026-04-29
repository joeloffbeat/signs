// Astrology data — signs, planets, computed from a date
window.SIGNS = [
  { id: "aries", name: "Aries", glyph: "♈", element: "fire", mode: "cardinal", ruler: "Mars", start: [3, 21] },
  { id: "taurus", name: "Taurus", glyph: "♉", element: "earth", mode: "fixed", ruler: "Venus", start: [4, 20] },
  { id: "gemini", name: "Gemini", glyph: "♊", element: "air", mode: "mutable", ruler: "Mercury", start: [5, 21] },
  { id: "cancer", name: "Cancer", glyph: "♋", element: "water", mode: "cardinal", ruler: "Moon", start: [6, 22] },
  { id: "leo", name: "Leo", glyph: "♌", element: "fire", mode: "fixed", ruler: "Sun", start: [7, 23] },
  { id: "virgo", name: "Virgo", glyph: "♍", element: "earth", mode: "mutable", ruler: "Mercury", start: [8, 23] },
  { id: "libra", name: "Libra", glyph: "♎", element: "air", mode: "cardinal", ruler: "Venus", start: [9, 23] },
  { id: "scorpio", name: "Scorpio", glyph: "♏", element: "water", mode: "fixed", ruler: "Pluto", start: [10, 23] },
  { id: "sagittarius", name: "Sagittarius", glyph: "♐", element: "fire", mode: "mutable", ruler: "Jupiter", start: [11, 22] },
  { id: "capricorn", name: "Capricorn", glyph: "♑", element: "earth", mode: "cardinal", ruler: "Saturn", start: [12, 22] },
  { id: "aquarius", name: "Aquarius", glyph: "♒", element: "air", mode: "fixed", ruler: "Saturn", start: [1, 20] },
  { id: "pisces", name: "Pisces", glyph: "♓", element: "water", mode: "mutable", ruler: "Jupiter", start: [2, 19] },
];

window.PLANETS = [
  { id: "sun", name: "Sun", glyph: "☉", color: "#d4a04a" },
  { id: "moon", name: "Moon", glyph: "☽", color: "#a88660" },
  { id: "mercury", name: "Mercury", glyph: "☿", color: "#7d5a2e" },
  { id: "venus", name: "Venus", glyph: "♀", color: "#a8c090" },
  { id: "mars", name: "Mars", glyph: "♂", color: "#b8431f" },
  { id: "jupiter", name: "Jupiter", glyph: "♃", color: "#6b8550" },
  { id: "saturn", name: "Saturn", glyph: "♄", color: "#3d4a2a" },
  { id: "uranus", name: "Uranus", glyph: "♅", color: "#7d5a2e" },
  { id: "neptune", name: "Neptune", glyph: "♆", color: "#3d4a2a" },
  { id: "pluto", name: "Pluto", glyph: "♇", color: "#0f0d09" },
];

// deterministic pseudo-random seeded by string (for reproducible "calculations")
window.seedRand = function(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return function() {
    h += 0x6D2B79F5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// approximate sun sign from MM-DD
window.signFromDate = function(month, day) {
  // signs ordered with start [month, day]; check from sagittarius backwards for capricorn wrap
  const order = [
    { sign: "capricorn", from: [12, 22], to: [1, 19] },
    { sign: "aquarius", from: [1, 20], to: [2, 18] },
    { sign: "pisces", from: [2, 19], to: [3, 20] },
    { sign: "aries", from: [3, 21], to: [4, 19] },
    { sign: "taurus", from: [4, 20], to: [5, 20] },
    { sign: "gemini", from: [5, 21], to: [6, 21] },
    { sign: "cancer", from: [6, 22], to: [7, 22] },
    { sign: "leo", from: [7, 23], to: [8, 22] },
    { sign: "virgo", from: [8, 23], to: [9, 22] },
    { sign: "libra", from: [9, 23], to: [10, 22] },
    { sign: "scorpio", from: [10, 23], to: [11, 21] },
    { sign: "sagittarius", from: [11, 22], to: [12, 21] },
  ];
  for (const o of order) {
    const [fm, fd] = o.from, [tm, td] = o.to;
    if (fm === tm && month === fm && day >= fd && day <= td) return o.sign;
    if (fm !== tm) {
      if ((month === fm && day >= fd) || (month === tm && day <= td)) return o.sign;
    }
  }
  return "aries";
};

// produce a deterministic chart for a person from name+date+place
window.makeChart = function(name, dateStr, timeStr, place) {
  const seed = `${name}|${dateStr}|${timeStr}|${place}`;
  const rand = seedRand(seed);
  const [y, m, d] = dateStr.split("-").map(Number);
  const sun = signFromDate(m, d);
  const sunIdx = SIGNS.findIndex(s => s.id === sun);

  // give each planet a deterministic position
  const planets = PLANETS.map((p, i) => {
    const baseShift = i === 0 ? 0 : Math.floor(rand() * 12);
    const signIdx = i === 0 ? sunIdx : (sunIdx + baseShift) % 12;
    const deg = Math.floor(rand() * 30); // 0-29
    const house = Math.floor(rand() * 12) + 1;
    const retro = i > 1 && rand() < 0.18;
    return {
      ...p,
      sign: SIGNS[signIdx],
      deg,
      degMin: Math.floor(rand() * 60),
      house,
      retro,
      longitude: signIdx * 30 + deg + (rand() * 60) / 60,
    };
  });

  // ascendant/MC computed from time + date (deterministic)
  const ascIdx = Math.floor(rand() * 12);
  const mcIdx = (ascIdx + 9) % 12; // roughly 9 signs ahead
  const ascendant = SIGNS[ascIdx];
  const moon = planets.find(p => p.id === "moon").sign;

  // houses — 12 cusps starting from ascendant
  const houses = [];
  for (let i = 0; i < 12; i++) {
    houses.push({
      num: i + 1,
      sign: SIGNS[(ascIdx + i) % 12],
      cuspDeg: Math.floor(rand() * 30),
    });
  }

  // aspects — compute between major planets
  const aspects = [];
  const aspectTypes = [
    { name: "conjunction", angle: 0, orb: 8, type: "conj", glyph: "☌" },
    { name: "sextile", angle: 60, orb: 5, type: "sext", glyph: "✱" },
    { name: "square", angle: 90, orb: 6, type: "square", glyph: "□" },
    { name: "trine", angle: 120, orb: 7, type: "trine", glyph: "△" },
    { name: "opposition", angle: 180, orb: 8, type: "opp", glyph: "☍" },
  ];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      let diff = Math.abs(planets[i].longitude - planets[j].longitude);
      if (diff > 180) diff = 360 - diff;
      for (const a of aspectTypes) {
        if (Math.abs(diff - a.angle) <= a.orb) {
          aspects.push({
            from: planets[i],
            to: planets[j],
            type: a.type,
            name: a.name,
            glyph: a.glyph,
            orb: Math.abs(diff - a.angle).toFixed(1),
          });
          break;
        }
      }
    }
  }

  // dominant element
  const elementCount = { fire: 0, earth: 0, air: 0, water: 0 };
  planets.slice(0, 7).forEach(p => { elementCount[p.sign.element]++; });
  const dominantEl = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0][0];
  const modeCount = { cardinal: 0, fixed: 0, mutable: 0 };
  planets.slice(0, 7).forEach(p => { modeCount[p.sign.mode]++; });
  const dominantMode = Object.entries(modeCount).sort((a, b) => b[1] - a[1])[0][0];

  return {
    name, dateStr, timeStr, place,
    planets, houses, aspects, ascendant, moon,
    sun: SIGNS[sunIdx],
    dominantEl, dominantMode, elementCount, modeCount,
  };
};

// daily vibe based on chart + today's date
window.makeDailyVibe = function(chart) {
  const today = new Date();
  const dayKey = `${chart.name}|${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const rand = seedRand(dayKey);

  const moods = [
    { word: "kindling", desc: "small sparks. start something tiny." },
    { word: "tidal", desc: "moods come in waves. ride them, don't fight." },
    { word: "earthy", desc: "make something with your hands. cook. plant. fix." },
    { word: "luminous", desc: "you're easy to read today. say what you mean." },
    { word: "interior", desc: "stay in. the answer is somewhere on your desk." },
    { word: "social", desc: "speak to a stranger. it'll go better than you think." },
    { word: "frictive", desc: "expect snags. the snags are useful." },
    { word: "molten", desc: "hot at the core. don't sit on the feeling." },
    { word: "patient", desc: "the slow path is the only path today." },
  ];
  const moodIdx = Math.floor(rand() * moods.length);

  const transit = PLANETS[Math.floor(rand() * 7)];
  const transitSign = SIGNS[Math.floor(rand() * 12)];
  const luckHour = Math.floor(rand() * 24);
  const luckPct = 30 + Math.floor(rand() * 60);
  const energyPct = 20 + Math.floor(rand() * 70);
  const focusPct = 20 + Math.floor(rand() * 70);

  const colors = ["sage", "walnut", "clay", "honey", "moss", "bone"];
  const colorPick = colors[Math.floor(rand() * colors.length)];

  const watchOuts = [
    "overcommitting", "taking it personally", "skipping meals",
    "reply-all", "doom-scrolling", "starting a fight you can't finish",
    "saying yes too fast", "perfectionism",
  ];
  const watchOut = watchOuts[Math.floor(rand() * watchOuts.length)];

  const dos = [
    "send the email", "go for the long walk", "make the phone call",
    "write it down", "throw something away", "ask one good question",
    "drink some water, honestly", "leave 10 min early",
  ];
  const todo = dos[Math.floor(rand() * dos.length)];

  return {
    mood: moods[moodIdx],
    transit, transitSign,
    luckHour, luckPct, energyPct, focusPct,
    color: colorPick,
    watchOut, todo,
    sunRel: chart.sun.name,
  };
};

// compatibility between two charts
window.makeCompat = function(a, b) {
  const seed = `${a.name}|${a.dateStr}|${b.name}|${b.dateStr}`;
  const rand = seedRand(seed);

  // element compatibility
  const elemMatrix = {
    "fire-fire": 80, "fire-earth": 45, "fire-air": 90, "fire-water": 40,
    "earth-fire": 45, "earth-earth": 75, "earth-air": 50, "earth-water": 85,
    "air-fire": 90, "air-earth": 50, "air-air": 70, "air-water": 60,
    "water-fire": 40, "water-earth": 85, "water-air": 60, "water-water": 80,
  };
  const sunPair = `${a.sun.element}-${b.sun.element}`;
  const sunScore = elemMatrix[sunPair] || 60;
  const moonScore = elemMatrix[`${a.moon.element}-${b.moon.element}`] || 60;

  // overall = weighted with some seed jitter
  const jitter = Math.floor(rand() * 14) - 7;
  const overall = Math.max(20, Math.min(98, Math.floor((sunScore * 0.4 + moonScore * 0.4 + 50 * 0.2 + jitter))));

  return {
    overall,
    bars: [
      { label: "romance",   pct: Math.max(20, Math.min(95, sunScore + Math.floor(rand() * 16) - 8)) },
      { label: "communication", pct: Math.max(20, Math.min(95, 40 + Math.floor(rand() * 55))) },
      { label: "trust",     pct: Math.max(20, Math.min(95, 50 + Math.floor(rand() * 45))) },
      { label: "passion",   pct: Math.max(15, Math.min(95, 30 + Math.floor(rand() * 65))) },
      { label: "rhythm",    pct: Math.max(20, Math.min(95, moonScore + Math.floor(rand() * 16) - 8)) },
      { label: "friction",  pct: Math.max(15, Math.min(90, 30 + Math.floor(rand() * 55))) },
    ],
    sunPair, summary: a.sun.name + " sun + " + b.sun.name + " sun.",
  };
};
