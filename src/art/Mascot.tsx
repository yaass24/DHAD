/** ضوء (Dhaw) — an original little light-drop companion who cheers the player on. */
type Mood = 'happy' | 'excited' | 'thinking' | 'wave';

export function DhawShape({ mood = 'happy' }: { mood?: Mood }) {
  const INK = '#3B2A22';
  return (
    <g>
      <circle cx="60" cy="66" r="58" fill="url(#dhawGlow)" />
      <g filter="url(#wobble)">
        {/* little arms */}
        <path d={mood === 'excited' || mood === 'wave' ? 'M 30 78 Q 14 66 12 50' : 'M 30 82 Q 18 88 16 96'} fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d={mood === 'excited' || mood === 'wave' ? 'M 30 78 Q 14 66 12 50' : 'M 30 82 Q 18 88 16 96'} fill="none" stroke="#FFC93C" strokeWidth="5" strokeLinecap="round" />
        <path d={mood === 'excited' ? 'M 90 78 Q 106 66 108 50' : mood === 'thinking' ? 'M 90 82 Q 82 96 70 92' : 'M 90 82 Q 102 88 104 96'} fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d={mood === 'excited' ? 'M 90 78 Q 106 66 108 50' : mood === 'thinking' ? 'M 90 82 Q 82 96 70 92' : 'M 90 82 Q 102 88 104 96'} fill="none" stroke="#FFC93C" strokeWidth="5" strokeLinecap="round" />
        {/* body: a soft drop of light */}
        <path d="M60 12 C 74 32 96 46 96 74 A 36 36 0 0 1 24 74 C 24 46 46 32 60 12 Z" fill="#FFD45E" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M60 30 C 68 42 82 52 82 72 A 22 22 0 0 1 60 94" fill="none" stroke="#FFF3B8" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
        {/* face */}
        {mood === 'happy' || mood === 'wave' ? (
          <g fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round">
            <path d="M44 70 q5 -6 10 0" />
            <path d="M66 70 q5 -6 10 0" />
          </g>
        ) : (
          <g fill={INK}>
            <ellipse cx={mood === 'thinking' ? 51 : 49} cy={mood === 'thinking' ? 67 : 69} rx="4" ry="5" />
            <ellipse cx={mood === 'thinking' ? 73 : 71} cy={mood === 'thinking' ? 67 : 69} rx="4" ry="5" />
            <circle cx={mood === 'thinking' ? 52 : 50} cy="67" r="1.4" fill="#fff" />
            <circle cx={mood === 'thinking' ? 74 : 72} cy="67" r="1.4" fill="#fff" />
          </g>
        )}
        <ellipse cx="40" cy="80" rx="6" ry="4" fill="#FF875F" opacity="0.55" />
        <ellipse cx="80" cy="80" rx="6" ry="4" fill="#FF875F" opacity="0.55" />
        {mood === 'thinking' ? (
          <path d="M55 86 l10 -2" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        ) : (
          <path d={mood === 'excited' ? 'M50 82 Q60 96 70 82 Z' : 'M52 83 Q60 91 68 83'} fill={mood === 'excited' ? '#8E3B33' : 'none'} stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </g>
      {mood === 'excited' && (
        <g className="twinkle" fill="#FFF" stroke="#F5AF22" strokeWidth="1.5">
          <path d="M14 22 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 z" />
          <path d="M100 18 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 z" />
        </g>
      )}
    </g>
  );
}

export function Dhaw({ mood = 'happy', size = 96, className = '', label }: { mood?: Mood; size?: number; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={'dhaw ' + className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <DhawShape mood={mood} />
    </svg>
  );
}
