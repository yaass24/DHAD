/** Shared SVG filters & gradients, rendered once at the app root. */
export function ArtDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        {/* slightly imperfect, hand-drawn outlines */}
        <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* paper grain overlay */}
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0.55 0" />
        </filter>
        <radialGradient id="dhawGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE9A0" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#FFD45E" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFD45E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="skyMorning" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A9DBF3" />
          <stop offset="100%" stopColor="#E3F4FB" />
        </linearGradient>
        <linearGradient id="skyWarm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD7A0" />
          <stop offset="100%" stopColor="#FFF3D7" />
        </linearGradient>
        <linearGradient id="skyCity" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9FB9C2" />
          <stop offset="100%" stopColor="#DCE5E2" />
        </linearGradient>
        <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E9B38C" />
          <stop offset="100%" stopColor="#F6E2C6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Paper texture rectangle to lay over a scene */
export function Grain({ w, h, opacity = 0.14 }: { w: number; h: number; opacity?: number }) {
  return <rect width={w} height={h} filter="url(#grain)" opacity={opacity} style={{ mixBlendMode: 'multiply' }} pointerEvents="none" />;
}
