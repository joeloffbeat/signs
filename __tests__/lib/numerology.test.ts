import { describe, it, expect } from 'vitest'
import { lifePath, expression, soulUrge, personalYear, reduceDigits } from '@/lib/numerology'

describe('reduceDigits', () => {
  it('reduces sum to single digit', () => expect(reduceDigits(30)).toBe(3))
  it('preserves master number 11', () => expect(reduceDigits(11)).toBe(11))
  it('preserves master number 22', () => expect(reduceDigits(22)).toBe(22))
  it('preserves master number 33', () => expect(reduceDigits(33)).toBe(33))
  it('further reduces 29 to 11', () => expect(reduceDigits(29)).toBe(11))
})

describe('lifePath', () => {
  it('calculates life path for 1990-04-25', () => {
    // 1+9+9+0+0+4+2+5 = 30 → 3
    expect(lifePath('1990-04-25')).toBe(3)
  })
  it('preserves master number 22 for 1991-10-10', () => {
    // 1+9+9+1+1+0+1+0 = 22
    expect(lifePath('1991-10-10')).toBe(22)
  })
})

describe('expression', () => {
  it('calculates expression for JOEL', () => {
    // J=1, O=6, E=5, L=3 → 15 → 6
    expect(expression('JOEL')).toBe(6)
  })
  it('is case insensitive', () => {
    expect(expression('joel')).toBe(expression('JOEL'))
  })
  it('ignores spaces', () => {
    // JOHN DOE: J=1,O=6,H=8,N=5 + D=4,O=6,E=5 = 35 → 8
    expect(expression('JOHN DOE')).toBe(8)
  })
})

describe('soulUrge', () => {
  it('counts only vowels (AEIOU) in JOEL', () => {
    // vowels: O=6, E=5 → 11 (master)
    expect(soulUrge('JOEL')).toBe(11)
  })
  it('vowels in JOHN DOE: O,O,E → 6+6+5=17 → 8', () => {
    expect(soulUrge('JOHN DOE')).toBe(8)
  })
})

describe('personalYear', () => {
  it('calculates personal year for birth 1990-04-25 in 2026', () => {
    // month=4, day=25→2+5=7, year=2026→2+0+2+6=10→1
    // 4+7+1=12→3
    expect(personalYear('1990-04-25', 2026)).toBe(3)
  })
})
