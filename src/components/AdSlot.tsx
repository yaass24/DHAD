import { useEffect, useRef } from 'react';
import { ADSENSE, adsEnabled, type AdPlacement } from '../config/ads';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    /** set only on preview builds to show where ads will appear */
    DHAD_ADS_PREVIEW?: boolean;
  }
}

let scriptAdded = false;
function loadAdSense() {
  if (scriptAdded || typeof document === 'undefined') return;
  scriptAdded = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE.client}`;
  s.crossOrigin = 'anonymous';
  document.head.appendChild(s);
}

/**
 * One responsive AdSense unit.
 * - Never used inside the story or conversation players (no ads near answer buttons).
 * - `audience="kids"` tags the request for child treatment (TFAT = 1), which turns off
 *   personalised and remarketing ads for that impression, as Google requires for children.
 * - Clearly labelled «إعلان», with space reserved to avoid layout jumps.
 */
export function AdSlot({ placement, audience = 'general' }: { placement: AdPlacement; audience?: 'kids' | 'general' }) {
  const ref = useRef<HTMLModElement>(null);
  const enabled = adsEnabled() && !!ADSENSE.slots[placement];

  useEffect(() => {
    if (!enabled) return;
    loadAdSense();
    try {
      if (ref.current && !ref.current.dataset.adsbygoogleStatus) (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocked or not ready: the reserved space simply stays empty */
    }
  }, [enabled]);

  if (!enabled) {
    if (typeof window !== 'undefined' && window.DHAD_ADS_PREVIEW)
      return (
        <aside className="ad-wrap container" aria-label="مساحة إعلانية">
          <span className="ad-label">إعلان</span>
          <div className="ad-preview">
            مساحة إعلانية (معاينة)
            <small>تظهر هنا إعلانات Google AdSense بعد إضافة رقم الناشر{audience === 'kids' ? ' — موسومة كمحتوى موجّه للأطفال' : ''}</small>
          </div>
        </aside>
      );
    return null;
  }

  return (
    <aside className="ad-wrap container" aria-label="إعلان">
      <span className="ad-label">إعلان</span>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE.client}
        data-ad-slot={ADSENSE.slots[placement]}
        data-ad-format="auto"
        data-full-width-responsive="true"
        {...(audience === 'kids' ? { 'data-tag-for-age-treatment': '1' } : {})}
      />
    </aside>
  );
}
