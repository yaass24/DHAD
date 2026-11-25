import { useEffect, useState } from 'react';

/** Re-renders when the media query starts or stops matching. */
export function useMedia(query: string) {
  const get = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(query).matches;
  const [match, setMatch] = useState(get);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

/** Phone portrait: the app-style shell (bottom tab bar, single-screen home). */
export const PHONE_APP = '(max-width: 767px) and (min-height: 521px)';
