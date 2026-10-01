/* THE ANIMATION LIBRARIES LOAD AFTER THE FIRST PAINT, 2026-10-01 (the
   founder's bundle split). GSAP, ScrollTrigger and Lenis were in the one
   bundle every route downloaded and ran before anything painted. They are
   async chunks now, fetched only by the routes that use them, and only once
   the page has painted:

     /          ScrollTrigger and Lenis (WordBand, RouteBand, smoothScroll.js)

   /pricing loaded GSAP core for the Plan Builder's tweens until COPY V3
   (2026-10-01) took the builder off; `loadGsap` stays as loadScroll's part.

   Every other route fetches none of them. Nothing a reader sees first waits
   on them: the scrubs and tweens start a frame or two after they land, and
   everything they drive sits below the fold or behind a click. */

/* After the first contentful paint: the browser's own entry for it, or
   load if the browser does not report paints, then a frame and a task. */
let painted = null;
const afterPaint = () => {
  if (!painted) {
    painted = new Promise((resolve) => {
      const done = () => requestAnimationFrame(() => setTimeout(resolve, 0));
      try {
        if (performance.getEntriesByName('first-contentful-paint').length) {
          done();
          return;
        }
        const po = new PerformanceObserver((list) => {
          if (list.getEntriesByName('first-contentful-paint').length) {
            po.disconnect();
            done();
          }
        });
        po.observe({ type: 'paint', buffered: true });
      } catch {
        if (document.readyState === 'complete') done();
        else window.addEventListener('load', done, { once: true });
      }
    });
  }
  return painted;
};

let gsap = null;
let core = null;
let scroll = null;
let scrollLibs = null;

/* GSAP core. Resolves to `gsap`. */
export function loadGsap() {
  if (!core) {
    core = afterPaint()
      .then(() => import('gsap'))
      .then((m) => {
        gsap = m.gsap || m.default;
        return gsap;
      });
  }
  return core;
}

/* The loaded `gsap`, or null while it is still on its way. */
export function gsapNow() {
  return gsap;
}

/* GSAP, ScrollTrigger and Lenis, registered. Resolves to
   `{ gsap, ScrollTrigger, Lenis }`. */
export function loadScroll() {
  if (!scroll) {
    scroll = afterPaint()
      .then(() => Promise.all([loadGsap(), import('gsap/ScrollTrigger'), import('lenis')]))
      .then(([g, st, ln]) => {
        const ScrollTrigger = st.ScrollTrigger || st.default;
        g.registerPlugin(ScrollTrigger);
        scrollLibs = { gsap: g, ScrollTrigger, Lenis: ln.default };
        return scrollLibs;
      });
  }
  return scroll;
}

/* Re-measure every ScrollTrigger, if the route has any (main.jsx, when the
   full stylesheet lands). A route that never loaded them has nothing to
   measure. */
export function refreshScroll() {
  if (scrollLibs) scrollLibs.ScrollTrigger.refresh();
}
