import { useEffect } from 'react';

/* THE DRIFT, every route's ground since 2026-09-21: NO ROUTE HAS A FLAT
   GROUND. The page's second material, anchored to the PAGE rather than the
   viewport (the rig's two blooms stay on the fixed layer above it). See
   `body[data-ground='drift']` in lit.css.

   `stops` is a function returning `[token, px]` pairs down the page, measured
   from the live layout; it is re-run whenever the page changes height (fonts
   landing, a width change, a disclosure opening). The last stop holds to the
   bottom of the page. `at(selector, edge)` gives an element's top or bottom
   in document px, or null if it is not on the page, and a null stop is
   skipped.

   The body attribute and the gradient are taken off when the page unmounts,
   so a route without a drift can never inherit another route's. */

export function at(selector, edge = 'top') {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return Math.round((edge === 'bottom' ? r.bottom : r.top) + window.scrollY);
}

export default function useDrift(stops) {
  useEffect(() => {
    const body = document.body;
    body.dataset.ground = 'drift';
    const set = () => {
      const list = stops().filter(([, px]) => px !== null && px !== undefined);
      if (!list.length) return;
      const parts = list.map(([token, px]) => `var(${token}) ${px}px`);
      const last = list[list.length - 1][0];
      body.style.setProperty(
        '--drift-image',
        `linear-gradient(to bottom, ${parts.join(', ')}, var(${last}) 100%)`
      );
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(body);
    if (document.fonts) document.fonts.ready.then(set);
    return () => {
      ro.disconnect();
      delete body.dataset.ground;
      body.style.removeProperty('--drift-image');
    };
    // The stop function is the page's own and fixed for its life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
