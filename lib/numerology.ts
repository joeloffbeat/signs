const PYTHAGOREAN: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
}

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U'])

export function reduceDigits(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n
  if (n < 10) return n
  const next = String(n).split('').reduce((a, c) => a + parseInt(c), 0)
  return reduceDigits(next)
}

export function lifePath(dateStr: string): number {
  const digits = dateStr.replace(/-/g, '').split('').reduce((a, c) => a + parseInt(c), 0)
  return reduceDigits(digits)
}

export function expression(name: string): number {
  const sum = name.toUpperCase().replace(/[^A-Z]/g, '').split('').reduce((a, c) => a + (PYTHAGOREAN[c] ?? 0), 0)
  return reduceDigits(sum)
}

export function soulUrge(name: string): number {
  const sum = name.toUpperCase().replace(/[^A-Z]/g, '').split('').filter((c) => VOWELS.has(c)).reduce((a, c) => a + (PYTHAGOREAN[c] ?? 0), 0)
  return reduceDigits(sum)
}

export function personalYear(birthDateStr: string, year: number): number {
  const [, mm, dd] = birthDateStr.split('-')
  const monthDigits = mm.split('').reduce((a, c) => a + parseInt(c), 0)
  const dayDigits = dd.split('').reduce((a, c) => a + parseInt(c), 0)
  const yearDigits = String(year).split('').reduce((a, c) => a + parseInt(c), 0)
  return reduceDigits(reduceDigits(monthDigits) + reduceDigits(dayDigits) + reduceDigits(yearDigits))
}

export interface NumerologyResult {
  lifePath: number
  expression: number
  soulUrge: number
  personalYear: number
}

export function computeNumerology(fullName: string, birthDateStr: string): NumerologyResult {
  return {
    lifePath: lifePath(birthDateStr),
    expression: expression(fullName),
    soulUrge: soulUrge(fullName),
    personalYear: personalYear(birthDateStr, new Date().getFullYear()),
  }
}
