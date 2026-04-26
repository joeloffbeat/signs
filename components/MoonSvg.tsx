interface MoonSvgProps {
  degrees: number
  size?: number
}

export default function MoonSvg({ degrees, size = 120 }: MoonSvgProps) {
  const r = size / 2
  const cx = r
  const cy = r

  const phase = degrees / 360
  const termX = Math.cos(phase * 2 * Math.PI)
  const rx = Math.abs(termX) * r

  let shadowPath: string
  if (phase < 0.5) {
    shadowPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${rx} ${r} 0 0 ${termX >= 0 ? 1 : 0} ${cx} ${cy - r} Z`
  } else {
    shadowPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 ${termX >= 0 ? 0 : 1} ${cx} ${cy - r} Z`
  }

  const isNew = degrees < 10 || degrees >= 350
  const isFull = degrees >= 170 && degrees < 190

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {isNew ? (
        <circle cx={cx} cy={cy} r={r - 1} fill="var(--ink)" stroke="var(--ink)" strokeWidth="1.5" />
      ) : isFull ? (
        <circle cx={cx} cy={cy} r={r - 1} fill="var(--bone)" stroke="var(--ink)" strokeWidth="1.5" />
      ) : (
        <>
          <circle cx={cx} cy={cy} r={r - 1} fill="var(--bone)" stroke="var(--ink)" strokeWidth="1.5" />
          <path d={shadowPath} fill="var(--ink)" fillOpacity="0.85" />
        </>
      )}
    </svg>
  )
}
