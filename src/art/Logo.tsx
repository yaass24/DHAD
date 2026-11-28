import emblem from '../assets/dhad-emblem.webp';

/** The official DHAD emblem (heritage-inspired ornament). Source: the DHAD Figma identity. */
export function LogoMark({ size = 48, decorative = true }: { size?: number; decorative?: boolean }) {
  return (
    <img
      src={emblem}
      alt={decorative ? '' : 'شعار ضاد'}
      aria-hidden={decorative || undefined}
      className="logo-mark"
      height={size}
      width={Math.round((size * 384) / 436)}
      decoding="async"
    />
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="logo">
      <LogoMark />
      {!compact && (
        <span className="logo-text">
          <strong>ضاد</strong>
          <small>لكل كلمة حكاية</small>
        </span>
      )}
    </span>
  );
}
