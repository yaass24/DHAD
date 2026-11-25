import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

export function ScoreCounter({ value, label = 'النقاط', icon = 'star' }: { value: number; label?: string; icon?: 'star' | 'sparkle' }) {
  const prev = useRef(value);
  const [bump, setBump] = useState(false);
  useEffect(() => {
    if (value > prev.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 600);
      prev.current = value;
      return () => clearTimeout(t);
    }
    prev.current = value;
  }, [value]);
  return (
    <span className={'score' + (bump ? ' bump' : '')} aria-label={`${label}: ${value}`}>
      <Icon name={icon} filled={icon === 'star'} size={18} />
      <span aria-hidden="true">{value}</span>
    </span>
  );
}

export function Stars({ count, max = 3, size = 22 }: { count: number; max?: number; size?: number }) {
  return (
    <span className="stars" role="img" aria-label={`${count} من ${max} نجوم`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < count ? 'star on' : 'star'} style={{ animationDelay: i * 0.18 + 's' }}>
          <Icon name="star" filled={i < count} size={size} />
        </span>
      ))}
    </span>
  );
}
