import { describe, it, expect } from 'vitest'
import { computePlanetaryHours, getDayRuler, CHALDEAN_ORDER } from '@/lib/planetary-hours'

describe('CHALDEAN_ORDER', () => {
  it('has 7 planets in correct Chaldean sequence', () => {
    expect(CHALDEAN_ORDER).toEqual(['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'])
  })
})

describe('getDayRuler', () => {
  it('Sunday ruler is Sun', () => {
    expect(getDayRuler(new Date('2026-04-26T12:00:00'))).toBe('Sun')
  })
  it('Monday ruler is Moon', () => {
    expect(getDayRuler(new Date('2026-04-27T12:00:00'))).toBe('Moon')
  })
  it('Saturday ruler is Saturn', () => {
    expect(getDayRuler(new Date('2026-05-02T12:00:00'))).toBe('Saturn')
  })
})

describe('computePlanetaryHours', () => {
  it('returns 24 hours', () => {
    const sunrise = new Date('2026-04-26T06:00:00')
    const sunset = new Date('2026-04-26T19:30:00')
    const result = computePlanetaryHours(new Date('2026-04-26T12:00:00'), sunrise, sunset)
    expect(result).toHaveLength(24)
  })

  it('first hour ruler matches day ruler', () => {
    const sunrise = new Date('2026-04-26T06:00:00')
    const sunset = new Date('2026-04-26T19:30:00')
    const result = computePlanetaryHours(new Date('2026-04-26T12:00:00'), sunrise, sunset)
    expect(result[0].planet).toBe('Sun')
  })

  it('hours are marked daytime or nighttime', () => {
    const sunrise = new Date('2026-04-26T06:00:00')
    const sunset = new Date('2026-04-26T19:30:00')
    const result = computePlanetaryHours(new Date('2026-04-26T12:00:00'), sunrise, sunset)
    expect(result.filter((h) => h.isDaytime)).toHaveLength(12)
    expect(result.filter((h) => !h.isDaytime)).toHaveLength(12)
  })

  it('identifies the current hour index', () => {
    const sunrise = new Date('2026-04-26T06:00:00')
    const sunset = new Date('2026-04-26T19:30:00')
    const result = computePlanetaryHours(new Date('2026-04-26T12:00:00'), sunrise, sunset)
    const current = result.find((h) => h.isCurrent)
    expect(current).toBeDefined()
    expect(current!.isDaytime).toBe(true)
  })
})
