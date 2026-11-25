import { createElement, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Reveals its content as it scrolls into view.
 * Honours the reduce-motion setting: then everything is simply visible.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  variant = 'up',
  ...rest
}: {
  children: ReactNode;
  as?: 'div' | 'li' | 'article' | 'section';
  className?: string;
  /** seconds of stagger inside a group */
  delay?: number;
  variant?: 'up' | 'side' | 'zoom';
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.documentElement.classList.contains('reduce-motion') || !('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    Tag,
    {
      ref,
      className: `reveal reveal-${variant}${shown ? ' is-in' : ''}${className ? ' ' + className : ''}`,
      style: delay ? { transitionDelay: `${delay}s` } : undefined,
      ...rest,
    },
    children,
  );
}
