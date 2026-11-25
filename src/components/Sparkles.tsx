import type { CSSProperties } from 'react';
/** Short celebratory burst. Pure CSS; hidden when reduced motion is on. */
export function Sparkles({ count = 12, colors = ['#FFD45E', '#FF875F', '#91C8E9', '#B7A1E8', '#67916C'] }: { count?: number; colors?: string[] }) {
  return (
    <span className="sparkles" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i;
        const dist = 60 + (i % 3) * 22;
        return (
          <span
            key={i}
            className="spark"
            style={
              {
                '--a': angle + 'deg',
                '--d': dist + 'px',
                background: colors[i % colors.length],
                animationDelay: (i % 4) * 0.03 + 's',
              } as CSSProperties
            }
          />
        );
      })}
    </span>
  );
}

export function Confetti({ count = 40 }: { count?: number }) {
  const colors = ['#FFD45E', '#FF875F', '#91C8E9', '#B7A1E8', '#67916C', '#F7A7B5'];
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            left: ((i * 37) % 100) + '%',
            background: colors[i % colors.length],
            animationDelay: ((i * 13) % 20) / 10 + 's',
            animationDuration: 2.4 + ((i * 7) % 10) / 10 + 's',
            transform: `rotate(${i * 23}deg)`,
          }}
        />
      ))}
    </div>
  );
}
