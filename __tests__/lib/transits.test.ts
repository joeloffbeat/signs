import { describe, it, expect } from 'vitest'
import { aspectAngle, isAspect, ASPECT_INTERPRETATIONS } from '@/lib/transits'

describe('aspectAngle', () => {
  it('conjunction: 0° difference → 0°', () => expect(aspectAngle(30, 30)).toBe(0))
  it('opposition: 180° apart', () => expect(aspectAngle(0, 180)).toBe(180))
  it('wraps correctly: 350 and 10', () => expect(aspectAngle(350, 10)).toBe(20))
  it('always returns smallest angle (max 180)', () => expect(aspectAngle(0, 270)).toBe(90))
})

describe('isAspect', () => {
  it('conjunction within orb', () => expect(isAspect(0, 0, 8)).toBe('conjunction'))
  it('square within orb', () => expect(isAspect(0, 89, 6)).toBe('square'))
  it('trine within orb', () => expect(isAspect(0, 122, 7)).toBe('trine'))
  it('no aspect outside orb', () => expect(isAspect(50, 60, 5)).toBeNull())
})

describe('ASPECT_INTERPRETATIONS', () => {
  it('has entries for all major aspects', () => {
    const needed = ['conjunction', 'sextile', 'square', 'trine', 'opposition']
    needed.forEach((a) => expect(ASPECT_INTERPRETATIONS).toHaveProperty(a))
  })
})
