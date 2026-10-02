import { useEffect } from 'react';
import { prefersReduced } from './useOnce.js';

/* A COUNT-UP THAT NEVER HIDES ITS FIGURE (BUILD-LAW Motion, 2026-10-03: an
   entrance never hides content). Every figure is painted at its final value
   from the first render. If the element is already on screen at load and
   motion is allowed, the figures run from 0 to their values over `ms`, on
   an ease-out, once; a figure scrolled to later is already final and does
   not count. No animation library.

   Each figure is a node matching `selector` whose FIRST text node holds the
   number; `data-to` is the value and `data-dp` its decimal places. The text
   node is written in place, so React's next render still finds it. */
export function useCountOnLoad(ref, selector, ms = 900) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return undefined;
    const r = el.getBoundingClientRect();
    if (!(r.top < window.innerHeight && r.bottom > 0)) return undefined;
    const nodes = [...el.querySelectorAll(selector)];
    const fmt = (n, dp) => n.toFixed(dp);
    let raf = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      const e = 1 - (1 - k) ** 3;
      nodes.forEach((n) => {
        const to = Number(n.dataset.to);
        const dp = Number(n.dataset.dp || 0);
        if (n.firstChild) n.firstChild.nodeValue = fmt(to * e, dp);
      });
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      nodes.forEach((n) => {
        if (n.firstChild) n.firstChild.nodeValue = fmt(Number(n.dataset.to), Number(n.dataset.dp || 0));
      });
    };
    // selector and ms are fixed for a use's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
