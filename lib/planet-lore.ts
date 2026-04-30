export interface PlanetLore {
  id: string
  name: string
  glyph: string
  keywords: string[]
  rules: string
  archetype: string
  greek: { deity: string; myth: string }
  indian: { deity: string; myth: string }
}

const PLANETS: PlanetLore[] = [
  {
    id: 'sun',
    name: 'Sun',
    glyph: '☉',
    keywords: ['identity', 'vitality', 'will', 'ego', 'purpose'],
    rules: 'Leo',
    archetype: 'The self that persists through every role. Not who you perform — who you are when no one is watching.',
    greek: {
      deity: 'Apollo · Helios',
      myth: 'Helios drove the solar chariot across the sky each day, holding the reins of four fire-horses with impossible steadiness. When his son Phaethon begged to drive it once, the horses bolted and the earth nearly burned. The myth is not about failure — it is about what happens when the Sun\'s core function is handed to someone who hasn\'t earned it. Apollo, the later solar figure, added dimension: god of prophecy, music, and rational order. The Sun\'s light is not just warmth — it is the condition under which truth becomes visible.',
    },
    indian: {
      deity: 'Surya · Vivasvan',
      myth: 'Surya is the most directly worshipped of the Navagrahas — the nine planets. He rides a chariot drawn by seven horses (the seven colours of visible light), driven by Aruna, the dawn. His consort Saranyu could not bear his radiance and created a shadow-double, Chhaya, to take her place. When Surya discovered the deception, he didn\'t punish — he reduced his own light. In Vedic thought, the Sun represents the Atman: the irreducible self that underlies all forms.',
    },
  },
  {
    id: 'moon',
    name: 'Moon',
    glyph: '☽',
    keywords: ['emotion', 'memory', 'instinct', 'nurture', 'cycles'],
    rules: 'Cancer',
    archetype: 'The part of you that reacts before it thinks. Your body\'s memory of every home it has ever had.',
    greek: {
      deity: 'Selene · Artemis · Hecate',
      myth: 'The Moon has three faces in Greek myth: Selene the full moon, Artemis the waxing crescent, Hecate the dark moon. Each governs a different kind of knowing. Selene loved the shepherd Endymion so much she asked Zeus to grant him eternal sleep so she could visit him forever — love so strong it chose preservation over presence. Hecate stands at the crossroads in the dark, holding two torches, facing both directions. She doesn\'t choose. She knows everything at the threshold.',
    },
    indian: {
      deity: 'Chandra · Soma',
      myth: 'Chandra is both the Moon god and Soma — the sacred ritual drink that confers immortality. He waxes and wanes because the gods consume him throughout the month, and he regenerates. This cycle is not death but metabolism: the Moon is digested by the cosmos and remade. Chandra is also the father of Budha (Mercury) — mind born from the unconscious. In Vedic astrology, the Moon is considered more important than the Sun; it governs the mind (manas) and the entire emotional-instinctual life.',
    },
  },
  {
    id: 'mercury',
    name: 'Mercury',
    glyph: '☿',
    keywords: ['mind', 'communication', 'language', 'travel', 'commerce'],
    rules: 'Gemini, Virgo',
    archetype: 'The gap between what is felt and what is said. Speed as intelligence. The trickster who understands all codes.',
    greek: {
      deity: 'Hermes · Thoth',
      myth: 'Hermes was born at dawn and by noon had stolen Apollo\'s sacred cattle, driven them backwards to hide the tracks, and invented the lyre from a tortoise shell to bargain his way out of trouble. He was never punished — he was made the messenger of the gods instead. Hermes alone moves freely between Olympus, Earth, and the Underworld. He carries the caduceus: two snakes wound around a staff, opposites held in dynamic tension. He invented writing, weights and measures, and the art of the omen. He is the only god who escorts souls to death and returns.',
    },
    indian: {
      deity: 'Budha · Saraswati',
      myth: 'Budha was born of the Moon\'s secret affair with the star Tara, wife of Brihaspati (Jupiter). His origins are illicit — a child of desire and confusion — yet he became the most rational of the Navagrahas. He governs language, mathematics, commerce, and discrimination (viveka): the ability to cut through appearances and see what is actually true. Saraswati, goddess of knowledge and eloquence, is his tutelary energy — the one who makes language a vessel for the sacred rather than just sound.',
    },
  },
  {
    id: 'venus',
    name: 'Venus',
    glyph: '♀︎',
    keywords: ['love', 'beauty', 'pleasure', 'value', 'harmony'],
    rules: 'Taurus, Libra',
    archetype: 'What you are willing to be seen wanting. The aesthetic self that knows what is worth the cost.',
    greek: {
      deity: 'Aphrodite · the Hesperides',
      myth: 'Aphrodite was born from sea-foam where Cronus threw Ouranos\'s severed genitals — desire arising from violence, beauty from rupture. She caused the Trojan War not out of malice but simply by existing and being promised as a prize. Her affair with Ares (Mars) is the central tension of the inner planets: beauty and war, magnetism and aggression, drawing toward and striking against. The Hesperides tended the golden apple tree in the far west — guardians of beauty at the edge of the world, the place where the sun sets.',
    },
    indian: {
      deity: 'Shukra · Lakshmi',
      myth: 'Shukra is guru of the asuras — the anti-gods — and possesses the Mritasanjivani vidya: the secret of reviving the dead. The gods\' guru (Brihaspati) doesn\'t have this knowledge. Shukra\'s power is not war or wisdom in the conventional sense but the deep knowledge of earthly desire and its complete mastery. Lakshmi, goddess of abundance and beauty, resides in Shukra\'s domain — she sits on a lotus in a lake, and what comes to her comes not by chase but by the quality of stillness that makes one worthy of receiving.',
    },
  },
  {
    id: 'mars',
    name: 'Mars',
    glyph: '♂︎',
    keywords: ['drive', 'courage', 'desire', 'conflict', 'action'],
    rules: 'Aries, Scorpio',
    archetype: 'The part of you that moves toward what it wants without apology. Anger as information. Will as a physical force.',
    greek: {
      deity: 'Ares · Eris',
      myth: 'Ares was the least popular of the Olympians — even his parents disliked him. Not because he was evil but because he was war made literal, and no one wants to look at that directly. He was wounded, humiliated, trapped by Hephaestus. But Aphrodite loved him. This is the key myth: beauty and war are inseparable. Ares represents the pure drive state — desire without finesse. His sister Eris threw the apple of discord at a wedding: three goddesses claimed it, a hero chose, a city burned. Conflict always starts with something being named better than something else.',
    },
    indian: {
      deity: 'Mangal · Skanda / Kartikeya',
      myth: 'Mangal (Mars) was born when Shiva\'s sweat fell to earth during intense tapas — concentration so fierce it produced a separate being. He is red, rides a ram, and carries a trident and mace. He is both destroyer and protector of dharma. His alternate form is Kartikeya / Skanda: the general of the divine army, born specifically to defeat the demon Tarakasura. He emerged from Shiva\'s third eye as six children (the Pleiades nursed him), merging into one. He is purpose fully embodied: no confusion about the mission, no hesitation in execution.',
    },
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    glyph: '♃',
    keywords: ['expansion', 'wisdom', 'faith', 'luck', 'abundance'],
    rules: 'Sagittarius, Pisces',
    archetype: 'The impulse to make meaning from experience. Luck as the byproduct of living according to your own truth.',
    greek: {
      deity: 'Zeus · Prometheus (shadow)',
      myth: 'Zeus rules Olympus not through force alone but through the agreement of all gods — he is the principle of order, the sky itself. He shape-shifts constantly: swan, bull, shower of gold, eagle. He is not a fixed thing; he is the principle that organizes everything else. His eagle (the same bird that torments Prometheus) sees from enormous altitude — the Jovian gift is perspective, the view from high enough that small things arrange into patterns. Prometheus stole fire from Zeus and gave it to humanity: the myth of Jupiter violated is also the myth of wisdom distributed beyond its proper container.',
    },
    indian: {
      deity: 'Brihaspati · Guru',
      myth: 'Brihaspati is the Guru of the gods — their teacher, priest, and the one who officiates every sacred ritual. He is called Vachaspati: lord of speech, because it is through precise language that the sacred is made accessible. His planet governs dharma, wisdom, children, and prosperity. In the great conflict between gods and asuras, Brihaspati is the one the gods cannot function without — when he once abandoned them in protest, the gods fell apart entirely. Jupiter\'s gifts are not material but structural: the framework that allows everything else to flourish.',
    },
  },
  {
    id: 'saturn',
    name: 'Saturn',
    glyph: '♄',
    keywords: ['discipline', 'limitation', 'time', 'karma', 'structure'],
    rules: 'Capricorn, Aquarius',
    archetype: 'The teacher who withholds the answer until you prove you can find it yourself. Every limitation is a diagram of what is real.',
    greek: {
      deity: 'Cronus · Chronos',
      myth: 'Cronus swallowed his children whole as they were born, because a prophecy said one would overthrow him — as he had overthrown his own father Ouranos. He was right. When Zeus escaped and returned, Cronus was made to vomit up his children and was dethroned. The Saturnian myth is time devouring its own creations. But Cronus is also Chronos — Time itself — the force that gives everything its proper season. After defeat, he was exiled to the Elysian Fields to reign over a Golden Age: the paradox of Saturn is that the lord of limitation becomes the guardian of paradise.',
    },
    indian: {
      deity: 'Shani · the Shadow Son',
      myth: 'Shani is the most feared of the Navagrahas. Son of Surya (Sun) and Chhaya (Shadow), he was rejected by his own father at birth because his gaze turned the Sun dark. He rides a crow, moves slowly (Saturn takes 29.5 years to orbit the sun), and brings consequences that cannot be avoided — only met. The Shani Sade Sati (7.5-year transit over the Moon sign) is considered the most transformative period in a life. He does not punish arbitrarily: he shows people the precise weight of what they have built. The crow as vehicle is significant — it eats what others discard, transforms waste into presence.',
    },
  },
  {
    id: 'uranus',
    name: 'Uranus',
    glyph: '♅',
    keywords: ['revolution', 'disruption', 'genius', 'freedom', 'the future'],
    rules: 'Aquarius (modern)',
    archetype: 'The future arriving before the present is ready. The shock that reorganizes everything downstream.',
    greek: {
      deity: 'Ouranos · Prometheus',
      myth: 'Ouranos was the sky itself — he lay upon Gaia (Earth) continuously and refused to let his children be born, keeping them compressed inside her. Cronus, the youngest Titan, used an adamantine sickle given by Gaia to castrate him, separating sky from earth and releasing the Titans. Ouranos is the principle of endless, formless potential that must be cut so that structure can emerge. The modern ruler Uranus is more strongly associated with Prometheus: the Titan who stole fire from the gods and gave it to humanity, knowing the punishment would be eternal. He is the archetype of liberation at personal cost.',
    },
    indian: {
      deity: 'Indra · Varuna (transitional)',
      myth: 'Uranus has no traditional Vedic ruler — it was discovered in 1781, outside the classical system. In synthesised Vedic-Western frameworks, Indra is sometimes mapped to Uranus: king of the Devas, lord of lightning, the force that breaks through obstacles (particularly the demon Vritra who had blocked all the rivers). But Indra\'s kingship is famously unstable — he loses it repeatedly and must regain it. The Uranian energy in Vedic thought is perhaps closest to the concept of the avatar: a direct intervention of cosmic will into history that reorganises what came before.',
    },
  },
  {
    id: 'neptune',
    name: 'Neptune',
    glyph: '♆',
    keywords: ['dissolution', 'imagination', 'mysticism', 'illusion', 'transcendence'],
    rules: 'Pisces (modern)',
    archetype: 'The boundary that isn\'t a wall. The self becoming permeable to something larger than itself.',
    greek: {
      deity: 'Poseidon · Dionysus',
      myth: 'Poseidon was given dominion over the seas when the cosmos was divided — but unlike Zeus\'s sky and Hades\'s underworld, the sea has no fixed geography. It changes constantly, holds everything, and is uncrossable without sacrifice. Poseidon\'s moods caused earthquakes and tsunamis; his love affairs gave rise to monsters (the Minotaur, Polyphemus). He is the principle of formless power that reshapes the land. Dionysus — god of wine, ecstasy, and ritual dissolution — shares the Neptunian register: the experience of the boundaries of the self becoming temporarily permeable to the divine.',
    },
    indian: {
      deity: 'Varuna · the Ocean (Samudra)',
      myth: 'Neptune has no classical Navagraha equivalent. Varuna — Vedic god of the cosmic waters, cosmic law (rita), and moral order — is the closest analogue. He sees all through the stars as his thousand eyes and records every action in a cosmic ledger. He can also forgive: his companion Mitra (cosmic friendship) balances his law with mercy. The deeper Neptunian resonance in Vedic thought is Samadhi — the state of complete dissolution of individual consciousness into the universal. Not erasure but expansion beyond the capacity of the ego to comprehend.',
    },
  },
  {
    id: 'pluto',
    name: 'Pluto',
    glyph: '♇',
    keywords: ['transformation', 'power', 'death', 'rebirth', 'the unconscious'],
    rules: 'Scorpio (modern)',
    archetype: 'The thing buried so deep it runs the whole system. Power that does not negotiate — only transforms.',
    greek: {
      deity: 'Hades · Persephone',
      myth: 'Hades is not a villain in Greek mythology — he is a judge. He rules the underworld with absolute fairness, takes nothing extra, and never returns the dead (with one exception: Eurydice, briefly, on the condition Orpheus not look back). His great act was the abduction of Persephone, which split the world into seasons: her return each spring is why the earth blooms. The Plutonian myth is not death as ending but as the thing that gives the living world its cycle. The pomegranate seeds Persephone ate in the underworld bound her there permanently — what you consume in the depths, you carry back.',
    },
    indian: {
      deity: 'Yama · Mahakala',
      myth: 'Pluto has no classical Navagraha position. Yama — lord of death and dharmic justice — is the Vedic analogue. He was the first mortal to die and thus the first to walk the path all others would follow; he became its lord. His sister Yami pleaded with him to break cosmic law and return, but he refused — he is the principle that keeps the cosmos honest. The deeper Plutonian resonance is Mahakala: Shiva in his form beyond time, who swallows and annihilates entire universes. Kali, his consort in this form, stands on his chest: the principle of destruction finding rest only in its own dissolution.',
    },
  },
]

export function getPlanetLore(id: string): PlanetLore | undefined {
  return PLANETS.find((p) => p.id === id.toLowerCase())
}

export function getAllPlanetLore(): PlanetLore[] {
  return PLANETS
}
