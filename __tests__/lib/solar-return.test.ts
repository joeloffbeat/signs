import { describe, it, expect } from 'vitest'
import { SR_ASCENDANT_THEMES, SR_SUN_HOUSE_THEMES, buildSolarReturnTheme } from '@/lib/solar-return'

describe('SR_ASCENDANT_THEMES', () => {
  it('has 12 entries', () => expect(Object.keys(SR_ASCENDANT_THEMES)).toHaveLength(12))
  it('each entry is a non-empty string', () => {
    Object.values(SR_ASCENDANT_THEMES).forEach((v) => {
      expect(typeof v).toBe('string')
      expect(v.length).toBeGreaterThan(10)
    })
  })
})

describe('SR_SUN_HOUSE_THEMES', () => {
  it('has 12 entries (houses 1-12)', () => expect(Object.keys(SR_SUN_HOUSE_THEMES)).toHaveLength(12))
})

describe('buildSolarReturnTheme', () => {
  it('returns a string combining ascendant + house theme', () => {
    const result = buildSolarReturnTheme('aries', 1)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(20)
  })
  it('falls back gracefully for unknown sign', () => {
    const result = buildSolarReturnTheme('unknown', 1)
    expect(typeof result).toBe('string')
  })
})
