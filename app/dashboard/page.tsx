import { getMoonPhase } from '@/lib/astronomy'
import TopNav from '@/components/TopNav'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const moon = getMoonPhase(new Date())

  return (
    <>
      <TopNav moonPhase={moon.phaseName.toLowerCase()} moonGlyph={moon.glyph} />
      <DashboardClient moonDegrees={moon.degrees} moonPhaseName={moon.phaseName} moonIllumination={moon.illumination} />
    </>
  )
}
