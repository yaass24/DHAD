import { useEffect, useState, type CSSProperties } from 'react';

/**
 * A reading line at the top of the page, plus dots that mark the home sections.
 * Both are hidden when the reduce-motion setting is on.
 */
export function ScrollLine({ sections }: { sections: { id: string; label: string }[] }) {
  const [read, setRead] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setRead(h > 0 ? Math.min(1, window.scrollY / h) : 0);
      const mid = window.scrollY + window.innerHeight / 2;
      let current = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= mid) current = i;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sections]);

  return (
    <>
      <div className="scroll-line" style={{ '--read': read } as CSSProperties} aria-hidden="true" />
      <nav className="scroll-dots" aria-label="أقسام الصفحة">
        {sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={'scroll-dot' + (i === active ? ' is-on' : '')}
            aria-label={s.label}
            aria-current={i === active ? 'true' : undefined}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            <span>{s.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
