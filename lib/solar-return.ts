import * as Astronomy from 'astronomy-engine'

export const SR_ASCENDANT_THEMES: Record<string, string> = {
  aries: 'A year of bold beginnings and self-assertion. You\'re stepping into a new identity — act first, reflect later.',
  taurus: 'A year of stability, sensual pleasure, and building lasting foundations. Slow and steady wins.',
  gemini: 'A year of communication, curiosity, and multiple projects. Your mind is the main event.',
  cancer: 'A year centred on home, family, and emotional roots. Nourishment — given and received.',
  leo: 'A year of creative expression and personal radiance. Own the room.',
  virgo: 'A year of refinement, health, and service. The details matter more than ever.',
  libra: 'A year of relationships, balance, and aesthetic refinement. Partnerships are the mirror.',
  scorpio: 'A year of depth, transformation, and uncovering hidden truths. Nothing stays on the surface.',
  sagittarius: 'A year of expansion, travel, and philosophical exploration. Widen your horizon.',
  capricorn: 'A year of ambition, discipline, and professional achievement. Build something that lasts.',
  aquarius: 'A year of community, innovation, and stepping outside convention. The collective calls.',
  pisces: 'A year of spirituality, creative imagination, and dissolution of old forms. Trust the current.',
}

export const SR_SUN_HOUSE_THEMES: Record<number, string> = {
  1: 'Your identity and appearance take centre stage. Self-reinvention is the year\'s work.',
  2: 'Resources, money, and self-worth are the year\'s focus. What do you truly value?',
  3: 'Writing, speaking, learning, and local connections define the year.',
  4: 'Home, family, and inner foundations are being rebuilt or reinforced.',
  5: 'Romance, creativity, and children fill the year with joy and play.',
  6: 'Health, habits, and daily work demand attention. Small routines change everything.',
  7: 'Partnerships — romantic or professional — are the year\'s central teacher.',
  8: 'Transformation, shared resources, and deep psychology are unavoidable.',
  9: 'Travel, higher education, and philosophical expansion mark the year.',
  10: 'Career, reputation, and public life are under the spotlight.',
  11: 'Friendships, community, and long-term goals come alive.',
  12: 'A year of retreat, solitude, and spiritual preparation for the next cycle.',
}

export function buildSolarReturnTheme(srAscendantSign: string, srSunHouse: number): string {
  const asc = SR_ASCENDANT_THEMES[srAscendantSign] ?? 'A year of personal renewal and fresh starts.'
  const house = SR_SUN_HOUSE_THEMES[srSunHouse] ?? 'Personal growth and inner development are central.'
  return `${asc} ${house}`
}

export interface SolarReturnResult {
  returnDate: Date
  srAscendantSign: string
  srSunHouse: number
  theme: string
}

export function computeSolarReturn(natalSunLongitude: number, birthYear: number, currentYear: number): SolarReturnResult {
  const startDate = new Date(currentYear, 0, 1)
  const returnEvent = Astronomy.SearchSunLongitude(natalSunLongitude, startDate, 400)
  const returnDate = returnEvent?.date ?? new Date(currentYear, new Date().getMonth(), new Date().getDate())

  const hour = returnDate.getHours()
  const signIndex = Math.floor((hour / 24) * 12)
  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
  const srAscendantSign = signs[signIndex]

  const dayOfYear = Math.floor((returnDate.getTime() - new Date(currentYear, 0, 0).getTime()) / 86400000)
  const srSunHouse = (Math.floor(dayOfYear / 30) % 12) + 1

  return {
    returnDate,
    srAscendantSign,
    srSunHouse,
    theme: buildSolarReturnTheme(srAscendantSign, srSunHouse),
  }
}
