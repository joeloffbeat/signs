import { makeChart } from './astro-data'
import type { Chart } from './astro-data'

export interface ProgressionResult {
  progressedDate: Date
  ageInYears: number
  progressedChart: Chart
}

export function computeProgressedDate(birthDateStr: string): Date {
  const birth = new Date(birthDateStr + 'T12:00:00')
  const today = new Date()
  const ageMs = today.getTime() - birth.getTime()
  const ageInYears = ageMs / (365.25 * 24 * 60 * 60 * 1000)
  // Secondary progressions: 1 solar day after birth = 1 year of life
  const progressedMs = birth.getTime() + ageInYears * 24 * 60 * 60 * 1000
  return new Date(progressedMs)
}

export function makeProgressedChart(name: string, birthDateStr: string, birthTime: string, place: string): ProgressionResult {
  const birth = new Date(birthDateStr + 'T12:00:00')
  const today = new Date()
  const ageMs = today.getTime() - birth.getTime()
  const ageInYears = ageMs / (365.25 * 24 * 60 * 60 * 1000)
  const progressedDate = computeProgressedDate(birthDateStr)
  const progressedDateStr = progressedDate.toISOString().slice(0, 10)
  const progressedTimeStr = progressedDate.toTimeString().slice(0, 5)
  return {
    progressedDate,
    ageInYears,
    progressedChart: makeChart(name + ' progressed', progressedDateStr, progressedTimeStr, place),
  }
}
