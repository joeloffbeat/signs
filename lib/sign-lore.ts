export interface SignLore {
  sign: string
  archetype: string
  greek: { deity: string; myth: string }
  indian: { deity: string; myth: string }
}

const LORE: SignLore[] = [
  {
    sign: 'Aries',
    archetype: 'Acts first, asks questions later. Pure kinetic force — the first breath of the cosmos taking form.',
    greek: {
      deity: 'Ares · the Chrysomallus Ram',
      myth: 'The golden Ram of Chrysomallus carried Phrixus across the sea to safety, then gave its fleece willingly — the same fleece Jason hunted across the world. Its constellation was placed by Zeus as the first light of spring. Aries also channels Ares, god of war: not cruelty, but the necessity of action when hesitation kills.',
    },
    indian: {
      deity: 'Mangal (Mars) · Kartikeya',
      myth: 'Mesha is ruled by Mangal, the red planet born from Shiva\'s sweat falling into the earth. The presiding deity is Kartikeya — Murugan — commander of the divine army, born specifically to slay the demon Tarakasura. He is the archetype of focused purpose: born fully formed, weapon in hand, never confused about his mission.',
    },
  },
  {
    sign: 'Taurus',
    archetype: 'Builds slowly, holds everything. Abundance is not chased — it is grown.',
    greek: {
      deity: 'Zeus as the Bull · Aphrodite',
      myth: 'Zeus became a white bull of impossible beauty to carry Europa across the sea — the divine hidden in the earthly form. The bull\'s power was not conquest but magnetism: it simply appeared on the shore and Europa climbed on willingly. Taurus also carries Aphrodite\'s domain — pleasure as a form of worship, the body as sacred ground.',
    },
    indian: {
      deity: 'Shukra (Venus) · Nandi',
      myth: 'Vrishabha is ruled by Shukra, guru of the asuras and master of all earthly pleasures. But its deeper symbol is Nandi — Shiva\'s bull, who sits eternally at the gate of Kailash. Nandi doesn\'t rush inside. He waits. He listens. He is the first disciple, the one who understands that stillness before the divine is its own form of power.',
    },
  },
  {
    sign: 'Gemini',
    archetype: 'Inhabits contradictions without resolving them. The mind as a place to live, not a problem to solve.',
    greek: {
      deity: 'Castor & Pollux · the Dioscuri',
      myth: 'The twin sons of Leda — one fathered by Zeus (immortal), one by a mortal king (human). When Castor died, Pollux refused Olympus alone. Zeus split immortality between them: they alternate between the world of the living and the realm of the dead, never fully in either. This is the Gemini myth — not confusion, but the deliberate refusal to choose one world over the other.',
    },
    indian: {
      deity: 'Budha (Mercury) · Ashwini Kumaras',
      myth: 'Mithuna is ruled by Budha, son of the Moon by a secret affair — born between worlds, belonging to neither fully. The presiding figures are the Ashwini Kumaras, twin physician-gods who arrive at dawn on golden horses. They heal the sick, restore youth, and carry divine knowledge between the cosmic and the earthly. Speed and duality are their nature.',
    },
  },
  {
    sign: 'Cancer',
    archetype: 'Feels the room before entering it. Memory is a home they carry everywhere.',
    greek: {
      deity: 'Selene · Hera\'s Crab',
      myth: 'During Heracles\' battle with the Lernaean Hydra, Hera sent a crab to distract him — it pinched his foot and was immediately crushed underfoot. Yet Hera immortalised it in the stars for its loyalty. This is the Cancer myth: the small act of devotion that goes unnoticed by the powerful, consecrated quietly by the divine. Selene, goddess of the moon, rules the tides — pulling everything toward her without touching anything.',
    },
    indian: {
      deity: 'Chandra (Moon) · Durga',
      myth: 'Karka is ruled by Chandra, the moon god who carries the nectar of immortality (amrita) in his waxing phase and releases it as he wanes. He is also associated with the mind (manas) in Vedic thought — the seat of feeling and memory. The presiding goddess is Durga in her aspect as the great mother — ferocious in protection, tender within the fortress walls.',
    },
  },
  {
    sign: 'Leo',
    archetype: 'Exists to be witnessed. The warmth is genuine; the performance is too — they are the same thing.',
    greek: {
      deity: 'Apollo · the Nemean Lion',
      myth: 'The Nemean Lion was no ordinary beast — its golden pelt was impenetrable by any weapon. Heracles\' first labour was to strangle it with bare hands. Zeus placed it in the stars not as a defeated enemy but as an honoured adversary: something so magnificent it deserved the sky. Apollo, god of light, music, and prophecy, also governs Leo — the sun as performer, the creative act as divine right.',
    },
    indian: {
      deity: 'Surya (Sun) · Narasimha',
      myth: 'Simha is ruled by Surya — the sun god who drives his chariot across the sky, whose direct gaze the other gods must shield their eyes from. The lion avatar of Vishnu, Narasimha, burst through a pillar at dusk (neither day nor night, neither inside nor outside) to protect his devotee Prahlada. Leo\'s power is not asked for permission. It finds the exact threshold where rules don\'t apply and acts there.',
    },
  },
  {
    sign: 'Virgo',
    archetype: 'Perfects what others walk past. Service is not obligation — it is the form devotion takes.',
    greek: {
      deity: 'Demeter · Persephone · Astraea',
      myth: 'Demeter, goddess of the harvest, gave humanity grain and the knowledge to cultivate it — the original act of discernment. Her daughter Persephone descends each year so the earth can learn scarcity. Astraea, goddess of justice and the last immortal to remain on earth, left only when human cruelty became unbearable — taking her scales (now Libra) and her torch with her. She is the memory of what precision and care once meant.',
    },
    indian: {
      deity: 'Budha (Mercury) · Saraswati',
      myth: 'Kanya is ruled by Budha and presided over by Saraswati — goddess of learning, craft, and the discriminating mind. Vishwakarma, the divine architect who built Dwarka and forged Indra\'s thunderbolt, is Virgo\'s working saint. In Vedic tradition, Kanya represents viveka — the faculty of discernment — the one quality the gods granted only to humans, the capacity to tell the real from the unreal.',
    },
  },
  {
    sign: 'Libra',
    archetype: 'Needs the other to know itself. Beauty and justice are not separate concerns.',
    greek: {
      deity: 'Themis · Astraea',
      myth: 'Themis, Titan goddess of divine law, held the scales — not to punish but to show. The scales don\'t decide; they reveal. Astraea, her daughter by some accounts, was the last goddess on earth and the first to leave when humans chose war. The Libra scales were her parting gift — a way of seeing the world without her presence to enforce it. Justice, she implied, must eventually become internal.',
    },
    indian: {
      deity: 'Shukra (Venus) · Yama\'s scales',
      myth: 'Tula is ruled by Shukra and associated with Yama\'s scales of karma — the divine weighing of the soul\'s actions. But Tula\'s deeper myth is the goddess Lakshmi standing on her lotus: abundance that chooses where to land. Libra is not passive balance but active choosing. In Vedic thought, dharma (right action) and its measurement are Libra\'s inheritance.',
    },
  },
  {
    sign: 'Scorpio',
    archetype: 'Transforms through contact. Goes into the underworld willingly and comes back changed, not rescued.',
    greek: {
      deity: 'Hades · the Scorpion of Orion',
      myth: 'The scorpion was sent by Gaia (or Artemis) to kill Orion after he boasted he would hunt every creature on earth. Zeus placed them on opposite ends of the sky — Orion sets as Scorpio rises. They never meet, yet are defined by each other. Hades rules this sign too: not the god of death, but of the underworld — the vast interior space where everything goes and from which anything may return, transformed.',
    },
    indian: {
      deity: 'Mangal (Mars) · Kali · Shiva',
      myth: 'Vrischika is associated with Kali — who danced on Shiva\'s chest after destroying the demon armies, drunk on the blood of transformation. Shiva lay down beneath her not to submit but to still her: even destruction needs a ground. The Vrischika native carries this — the capacity to dismantle, the stillness to survive it. In Vedic astrology, this sign governs moksha: liberation through complete dissolution of the false self.',
    },
  },
  {
    sign: 'Sagittarius',
    archetype: 'Truth as motion. The quest is not toward an answer — it is the living answer.',
    greek: {
      deity: 'Chiron · Zeus\'s arrow',
      myth: 'Chiron was the only centaur of divine origin — son of the Titan Kronos. Where other centaurs were driven by appetite, Chiron was a physician, astronomer, and teacher of heroes. He trained Achilles, Asclepius, Jason, and Heracles. When accidentally wounded by one of Heracles\' poisoned arrows, he chose to give up his immortality to end the pain — and was placed in the stars as a gift to humanity. The teacher as the ultimate student.',
    },
    indian: {
      deity: 'Guru / Brihaspati (Jupiter) · Arjuna',
      myth: 'Dhanu is ruled by Guru — Brihaspati, teacher of the gods, who holds the divine library and dispenses wisdom from the throne of Jupiter. The human archetype is Arjuna from the Mahabharata: the archer who put down his bow mid-battle because he could not bear to fight his own kin — and received the Bhagavad Gita. The highest teaching comes only when the seeker is willing to question everything, including the fight they trained their whole life for.',
    },
  },
  {
    sign: 'Capricorn',
    archetype: 'Earns everything, trusts nothing given freely. Time is not the enemy — time is the medium.',
    greek: {
      deity: 'Kronos · Pan',
      myth: 'Pan, god of the wild, transformed himself into a goat-fish to flee the monster Typhon — and Zeus placed that hybrid form in the stars. The goat-fish is the sea-goat: mountain ambition with ocean depth beneath. Kronos (Saturn) is the deeper ruler — he swallowed his children to preserve his power, then was tricked into returning them. Time devours; time also disgorges. The Capricorn myth is the mastery of what time destroys in everyone else.',
    },
    indian: {
      deity: 'Shani (Saturn) · Makara · Ganga',
      myth: 'Makara is the vehicle of Varuna, lord of cosmic order, and also of Ganga — the sacred river goddess who descended from heaven with the force to destroy the earth, caught only by Shiva\'s matted hair. Makara carries souls across the river of time. Shani (Saturn) rules with strict impartiality: he does not punish, he reveals exactly what was built and what wasn\'t. The harvest is always honest.',
    },
  },
  {
    sign: 'Aquarius',
    archetype: 'Belongs to the future. Detachment is not coldness — it is love at the scale of the species.',
    greek: {
      deity: 'Ganymede · Deucalion',
      myth: 'Ganymede was a Trojan prince so beautiful that Zeus, in the form of an eagle, carried him to Olympus to serve as cupbearer to the gods — pouring ambrosia, the drink of immortality. He was removed from his people and given to the divine. Deucalion survived the great flood Zeus sent to reset humanity, rebuilt the world by throwing stones over his shoulder that became people. Aquarius pours water (or nectar) for everyone, personally belonging to none.',
    },
    indian: {
      deity: 'Shani (Saturn) · Kumbha Mela',
      myth: 'Kumbha means pot — the sacred vessel that carried amrita (divine nectar) during the churning of the cosmic ocean. When demons seized it and fled, drops of nectar fell at four places on earth — those places became the sites of the Kumbh Mela, where hundreds of millions gather. Aquarius is that dropped vessel: the idea that spills out of its original container and becomes something belonging to everyone, permanently.',
    },
  },
  {
    sign: 'Pisces',
    archetype: 'Feels what hasn\'t happened yet. Boundaries dissolve not through weakness but through the understanding that they were always imaginary.',
    greek: {
      deity: 'Aphrodite & Eros · Poseidon',
      myth: 'When the monster Typhon threatened Olympus, Aphrodite and her son Eros leapt into the Euphrates and transformed into two fish, tying themselves together with a cord so they wouldn\'t lose each other in the river. Zeus placed them in the stars still bound together. The two fish swimming in opposite directions are not confused — they are holding each other in the current. Poseidon\'s trident governs the deep: everything beneath the surface, the unconscious world that surrounds all the solid things.',
    },
    indian: {
      deity: 'Guru (Jupiter) · Matsya avatar',
      myth: 'Meena is ruled by Guru and its mythic root is Matsya — the fish avatar of Vishnu, first of the Dashavatara. A small fish appeared to Manu (progenitor of humanity) in a bowl of water and said: keep me safe, I will save you in return. The fish grew to fill every ocean. When the great deluge came, Matsya carried the ark and the sacred Vedas through the flood waters. Pisces is this: the small, sacred thing that turns out to be the whole cosmos, asking to be held.',
    },
  },
]

const LORE_MAP = Object.fromEntries(LORE.map(l => [l.sign.toLowerCase(), l]))

export function getSignLore(signName: string): SignLore | null {
  return LORE_MAP[signName.toLowerCase()] ?? null
}
