'use client'
import { TarotCard } from '@/lib/tarot-data'

interface TarotArtProps { card: TarotCard; style?: 'woodcut' | 'minimal' }

export default function TarotArt({ card, style = 'woodcut' }: TarotArtProps) {
  const stroke = "var(--ink)";
  const fill = "var(--ink)";
  const sw = style === "minimal" ? 1.5 : 2.5;
  const common = { fill: "none", stroke, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const filled = { fill, stroke: "none" };

  // pick an art block by card id
  const arts: Record<number, JSX.Element> = {
    0: ( // Fool — figure on cliff with bundle
      <g {...common}>
        <circle cx="50" cy="28" r="9" />
        <path d="M50 37 L50 62 M50 45 L36 55 M50 45 L64 52" />
        <path d="M50 62 L42 78 M50 62 L58 78" />
        <path d="M64 52 L72 44 L78 50 L74 56" />
        <path d="M20 84 L80 84 M20 84 L30 90 M80 84 L70 90" />
        <circle cx="78" cy="20" r="4" {...filled} />
      </g>
    ),
    1: ( // Magician — figure with wand and table
      <g {...common}>
        <circle cx="50" cy="22" r="7" />
        <path d="M50 29 L50 60 M50 38 L40 50 M50 38 L60 30" />
        <path d="M58 28 L70 16" strokeWidth={sw + 0.5} />
        <path d="M50 60 L42 76 M50 60 L58 76" />
        <rect x="28" y="76" width="44" height="6" />
        <circle cx="34" cy="72" r="2" {...filled} />
        <path d="M44 70 L52 70 M48 66 L48 74" />
        <path d="M62 70 L70 74 L66 66 Z" />
      </g>
    ),
    2: ( // High Priestess — pillars + moon
      <g {...common}>
        <rect x="20" y="22" width="8" height="60" />
        <rect x="72" y="22" width="8" height="60" />
        <circle cx="50" cy="40" r="11" />
        <path d="M44 38 a8 8 0 0 0 12 0" />
        <path d="M40 60 L60 60 L62 80 L38 80 Z" />
        <circle cx="50" cy="68" r="3" {...filled} />
      </g>
    ),
    3: ( // Empress — crown + stars
      <g {...common}>
        <circle cx="50" cy="32" r="10" />
        <path d="M40 28 L46 22 L50 28 L54 22 L60 28" />
        <path d="M50 42 L50 70 M50 50 L36 60 M50 50 L64 60" />
        <path d="M30 80 Q50 70 70 80" />
        <path d="M22 84 L78 84" strokeWidth={sw + 1} />
      </g>
    ),
    4: ( // Emperor — throne
      <g {...common}>
        <circle cx="50" cy="26" r="8" />
        <path d="M44 22 L50 14 L56 22" />
        <rect x="34" y="38" width="32" height="40" />
        <path d="M30 40 L34 38 M70 40 L66 38" />
        <path d="M40 78 L40 86 M60 78 L60 86" />
        <path d="M44 50 L56 50 M44 58 L56 58" />
      </g>
    ),
    6: ( // Lovers — two figures
      <g {...common}>
        <circle cx="34" cy="28" r="7" />
        <circle cx="66" cy="28" r="7" />
        <path d="M34 35 L34 64 M66 35 L66 64" />
        <path d="M34 45 L42 50 L58 50 L66 45" />
        <path d="M28 64 L40 80 M68 64 L80 80 M40 64 L28 80 M60 64 L72 80" />
        <path d="M50 14 L46 22 L54 22 Z" {...filled} />
      </g>
    ),
    8: ( // Strength — lion
      <g {...common}>
        <circle cx="50" cy="48" r="20" />
        <circle cx="44" cy="46" r="2" {...filled} />
        <circle cx="56" cy="46" r="2" {...filled} />
        <path d="M46 56 Q50 60 54 56" />
        <path d="M30 38 L24 32 M70 38 L76 32 M50 28 L50 22" />
        <path d="M30 56 L20 58 M70 56 L80 58 M28 48 L18 48 M72 48 L82 48" />
      </g>
    ),
    9: ( // Hermit — figure with lantern
      <g {...common}>
        <path d="M40 18 L50 12 L60 18 L58 30 L42 30 Z" />
        <path d="M42 30 L36 80 L64 80 L58 30" />
        <rect x="30" y="40" width="12" height="14" />
        <circle cx="36" cy="47" r="3" {...filled} />
        <path d="M30 54 L42 54" />
        <path d="M64 40 L72 50" />
      </g>
    ),
    10: ( // Wheel of Fortune
      <g {...common}>
        <circle cx="50" cy="50" r="26" />
        <circle cx="50" cy="50" r="14" />
        <path d="M50 24 L50 76 M24 50 L76 50 M32 32 L68 68 M68 32 L32 68" />
        <circle cx="50" cy="50" r="3" {...filled} />
      </g>
    ),
    13: ( // Death — scythe & moon
      <g {...common}>
        <circle cx="50" cy="30" r="10" />
        <path d="M48 28 a4 4 0 0 1 4 0" />
        <path d="M40 40 L40 78 L60 78 L60 40" />
        <path d="M44 50 L56 50 M44 58 L56 58 M44 66 L56 66" />
        <path d="M30 14 L74 70" strokeWidth={sw + 0.5} />
        <path d="M30 14 Q22 18 22 28 Q34 22 30 14 Z" {...filled} />
      </g>
    ),
    16: ( // Tower — falling tower with lightning
      <g {...common}>
        <rect x="36" y="30" width="28" height="50" />
        <path d="M36 42 L64 42 M36 60 L64 60" />
        <path d="M36 30 L34 22 L66 22 L64 30" />
        <path d="M50 14 L42 28 L50 28 L46 40" strokeWidth={sw + 0.5} />
        <path d="M30 80 L70 80 L72 86 L28 86 Z" {...filled} />
      </g>
    ),
    17: ( // Star — pouring water + star
      <g {...common}>
        <path d="M50 16 L54 28 L66 28 L56 36 L60 48 L50 40 L40 48 L44 36 L34 28 L46 28 Z" />
        <path d="M30 60 L42 70 M70 60 L58 70" />
        <path d="M28 80 Q50 72 72 80" />
        <circle cx="50" cy="76" r="2" {...filled} />
      </g>
    ),
    18: ( // Moon
      <g {...common}>
        <path d="M64 30 a22 22 0 1 0 0 44 a18 18 0 0 1 0 -44 Z" {...filled} />
        <path d="M30 70 Q50 60 70 70" />
        <path d="M34 80 L66 80 M40 86 L60 86" />
      </g>
    ),
    19: ( // Sun — radiant
      <g {...common}>
        <circle cx="50" cy="44" r="14" {...filled} />
        <path d="M50 18 L50 26 M50 62 L50 70 M22 44 L30 44 M70 44 L78 44" strokeWidth={sw + 1} />
        <path d="M30 24 L36 30 M64 30 L70 24 M30 64 L36 58 M64 58 L70 64" strokeWidth={sw + 0.5} />
        <path d="M28 80 L72 80 M34 86 L66 86" />
      </g>
    ),
    21: ( // World — wreath
      <g {...common}>
        <ellipse cx="50" cy="50" rx="22" ry="28" />
        <ellipse cx="50" cy="50" rx="22" ry="28" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" rx="22" ry="28" transform="rotate(-60 50 50)" />
        <circle cx="50" cy="50" r="6" {...filled} />
      </g>
    ),
  };

  // generic fallback: roman numeral block + decorative frame
  const romanNumerals: Record<number, string> = {
    0:"0",1:"I",2:"II",3:"III",4:"IV",5:"V",6:"VI",7:"VII",8:"VIII",9:"IX",
    10:"X",11:"XI",12:"XII",13:"XIII",14:"XIV",15:"XV",16:"XVI",17:"XVII",
    18:"XVIII",19:"XIX",20:"XX",21:"XXI"
  };
  const num = romanNumerals[card.id] ?? String(card.id);
  const fallback = (
    <g {...common}>
      <path d="M20 20 L80 20 L80 80 L20 80 Z" />
      <path d="M28 28 L72 28 L72 72 L28 72 Z" />
      <text x="50" y="58" textAnchor="middle" fontFamily="Roboto Slab" fontSize="22" fontWeight="900" fill={fill} stroke="none">{num}</text>
      <circle cx="50" cy="34" r="3" {...filled} />
    </g>
  );

  const art = arts[card.id] ?? fallback;

  // top/bottom decorative motifs (woodcut only)
  const decor = style === "woodcut" ? (
    <g {...common}>
      <path d="M14 14 L24 14 M76 14 L86 14 M14 86 L24 86 M76 86 L86 86" strokeWidth={sw - 0.5} />
      <path d="M50 8 L46 14 L54 14 Z" {...filled} />
      <path d="M50 92 L46 86 L54 86 Z" {...filled} />
    </g>
  ) : null;

  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", display: "block" }}>
      {decor}
      {art}
    </svg>
  );
}
