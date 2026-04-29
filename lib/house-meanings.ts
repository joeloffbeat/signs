export interface HouseMeaning {
  num: number
  name: string
  keywords: string[]
  governs: string
  deeper: string
}

const HOUSE_MEANINGS: HouseMeaning[] = [
  {
    num: 1,
    name: 'The Self',
    keywords: ['identity', 'appearance', 'first impressions', 'the body'],
    governs: 'Physical appearance, the personality projected outward, the lens through which you enter every room.',
    deeper: 'The 1st house cusp is the Ascendant — the exact degree of the zodiac rising on the eastern horizon at birth. It is not who you are but how you arrive: the costume the soul chose for this life. Planets here are intensely personal and visible to others before you are even aware of them yourself.',
  },
  {
    num: 2,
    name: 'Resources',
    keywords: ['money', 'possessions', 'self-worth', 'values'],
    governs: 'Earned income, material security, what you own and what you consider worth having. Also self-esteem — what you believe you deserve.',
    deeper: 'The 2nd house governs not just money but the entire relationship between self and the material world. A planet here shapes your earning style and your deepest sense of security. Venus here desires beautiful things; Saturn here works twice as hard for them and still doesn\'t feel safe.',
  },
  {
    num: 3,
    name: 'Communication',
    keywords: ['siblings', 'short trips', 'language', 'early education'],
    governs: 'Writing, speaking, daily communication, short journeys, siblings, early schooling, and the immediate neighbourhood.',
    deeper: 'The 3rd house is the mind in motion — restless, local, networked. It governs how you gather and distribute information in your immediate world. Planets here describe how you think and talk. Mercury rules it; a packed 3rd house rarely stops talking.',
  },
  {
    num: 4,
    name: 'Home & Roots',
    keywords: ['family', 'home', 'ancestry', 'emotional foundation'],
    governs: 'The home, family of origin, one parent (traditionally the mother or primary caregiver), ancestral patterns, and the base from which you operate.',
    deeper: 'The 4th house cusp (IC) is the lowest point of the chart — the roots. It describes the private self that few see, the inherited patterns that run deepest, and what kind of home environment you need to function. Planets here only surface in true intimacy.',
  },
  {
    num: 5,
    name: 'Creativity & Pleasure',
    keywords: ['creativity', 'romance', 'children', 'play', 'risk'],
    governs: 'Creative expression, romantic affairs, children, gambling and speculation, sports, and all pleasure taken for its own sake.',
    deeper: 'The 5th is the house of the heart\'s free activity — what you do when obligation falls away. It rules the joy of making things, the thrill of being seen, and the electricity of new romance before it becomes a partnership. Sun here is at home; Saturn here may struggle to let itself play.',
  },
  {
    num: 6,
    name: 'Work & Health',
    keywords: ['daily work', 'health', 'service', 'routines'],
    governs: 'Daily work, the body\'s functioning and its breakdowns, habits and routines, service, and the dynamic with co-workers.',
    deeper: 'The 6th is the house of craft: ordinary, repetitive, body-involved work. Planets here describe your relationship with discipline and your health vulnerabilities. Mars here is efficient; Neptune here can struggle with boundaries between self and the work.',
  },
  {
    num: 7,
    name: 'Partnership',
    keywords: ['marriage', 'partnerships', 'contracts', 'open enemies'],
    governs: 'Committed partnerships of all kinds — romantic and professional — contracts, known rivals, and qualities you project onto others.',
    deeper: 'The 7th cusp (Descendant) is directly opposite the Ascendant. Where the 1st describes self, the 7th describes what the self cannot easily see in itself — what it needs and seeks in another. Planets here often describe qualities that feel magnetic in partners because they\'re undeveloped in you.',
  },
  {
    num: 8,
    name: 'Transformation',
    keywords: ['death', 'inheritance', 'shared resources', 'sexuality', 'taboo'],
    governs: 'Shared finances, inheritance, other people\'s money, death and regeneration, sexuality, psychological depth.',
    deeper: 'The 8th is the house of what cannot be kept: money that passes through (taxes, debt, inheritance), experiences that change you permanently, sexuality that merges self with other. Planets here describe your relationship with depth and power. Pluto is at home here.',
  },
  {
    num: 9,
    name: 'Philosophy & Travel',
    keywords: ['higher education', 'foreign travel', 'religion', 'philosophy', 'publishing'],
    governs: 'Long-distance travel, higher education, religion, philosophy, publishing, law, and all forms of meaning-making beyond the immediate.',
    deeper: 'The 9th asks the largest questions: why, and so what? It governs the search for meaning through experience — foreign lands, advanced study, spiritual practice, writing a book. Jupiter is at home here; Saturn here can make the search feel like an obligation.',
  },
  {
    num: 10,
    name: 'Career & Status',
    keywords: ['career', 'reputation', 'public role', 'authority', 'achievement'],
    governs: 'Public reputation, career, professional achievement, the relationship with authority figures, and worldly ambition.',
    deeper: 'The 10th cusp (Midheaven/MC) is the most public point of the chart — the apex of the sky at birth. It describes the role the world will see you in and your relationship with authority. Planets here are exposed and professionally charged. The Sun here is highly visible and rarely off-duty.',
  },
  {
    num: 11,
    name: 'Community & Vision',
    keywords: ['friends', 'groups', 'hopes', 'social causes', 'the future'],
    governs: 'Friendships, social networks, group affiliations, hopes and long-range wishes, humanitarian causes, and collective vision.',
    deeper: 'The 11th is the house of chosen tribe: people gathered around shared values rather than blood or romance. It governs the role you play in communities and the future you are building toward. Uranus is at home here; Saturn here takes friendship and social responsibility seriously.',
  },
  {
    num: 12,
    name: 'The Hidden Realm',
    keywords: ['solitude', 'the unconscious', 'hidden enemies', 'karma', 'transcendence'],
    governs: 'The unconscious mind, hidden matters, solitude and retreat, institutions, self-undoing, and spiritual transcendence.',
    deeper: 'The 12th is the house of what the self cannot look at directly — things buried before birth or too large to face consciously. It governs retreats chosen and unchosen, patterns that run below the surface, and the eventual dissolution of the ego into something larger. Neptune is at home here. Planets here are powerful but operate unseen.',
  },
]

export function getHouseMeaning(num: number): HouseMeaning | undefined {
  return HOUSE_MEANINGS.find((h) => h.num === num)
}

export function getAllHouseMeanings(): HouseMeaning[] {
  return HOUSE_MEANINGS
}
