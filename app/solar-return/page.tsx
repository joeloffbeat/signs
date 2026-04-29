'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import TopNav from '@/components/TopNav'
import ChartWheel from '@/components/ChartWheel'
import { makeChart, type Chart } from '@/lib/astro-data'
import { computeSolarReturn, type SolarReturnResult } from '@/lib/solar-return'

export default function SolarReturnPage() {
  const [natalChart, setNatalChart] = useState<Chart | null>(null)
  const [srResult, setSrResult] = useState<SolarReturnResult | null>(null)
  const [srChart, setSrChart] = useState<Chart | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('signs-chart')
    if (!saved) return
    try {
      const d = JSON.parse(saved)
      if (!d?.name || !d?.date) return
      const chart = makeChart(d.name, d.date, d.time ?? '12:00', d.place ?? 'unknown')
      setNatalChart(chart)

      const natalSunLon = chart.planets.find((p) => p.id === 'sun')?.longitude ?? 0
      const birthYear = new Date(d.date).getFullYear()
      const currentYear = new Date().getFullYear()
      const result = computeSolarReturn(natalSunLon, birthYear, currentYear)
      setSrResult(result)

      const dateStr = result.returnDate.toISOString().slice(0, 10)
      const timeStr = result.returnDate.toTimeString().slice(0, 5)
      setSrChart(makeChart(d.name + ' SR', dateStr, timeStr, d.place ?? 'unknown'))
    } catch { /* malformed localStorage */ }
  }, [])

  if (!natalChart) {
    return (
      <>
        <TopNav />
        <div className="page" style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <div className="eyebrow">solar return</div>
          <div className="card" style={{ marginTop: 24, padding: 32 }}>
            <p>To see your solar return, draw your birth chart first.</p>
            <Link href="/chart" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>
              go to birth chart →
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <TopNav />
      <div className="page" style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
        <div className="eyebrow">solar return {new Date().getFullYear()}</div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>annual theme</h1>

        {srResult && (
          <div className="card" style={{ padding: 24, marginBottom: 32 }}>
            <div className="field-label">solar return date</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, marginBottom: 16 }}>
              {srResult.returnDate.toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <p style={{ lineHeight: 1.7, fontSize: 15 }}>{srResult.theme}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
          <div>
            <div className="field-label" style={{ marginBottom: 12 }}>natal chart</div>
            <ChartWheel chart={natalChart} size={400} />
          </div>
          {srChart && (
            <div>
              <div className="field-label" style={{ marginBottom: 12 }}>solar return chart</div>
              <ChartWheel chart={srChart} size={400} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
