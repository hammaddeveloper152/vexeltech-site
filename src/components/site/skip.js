import { getLenis } from '../home/smoothScroll.js';

/* THE SKIP LINK'S PRESS (the launch gate, 2026-10-07). Focus moves to
   <main> without the browser scrolling, then the page is put at main's top
   through Lenis where Lenis runs (home), so the smooth scroller's position
   and the page's agree, and natively everywhere else. The href stays
   #main, so it works with no script at all. */
export function skipToMain(e) {
  const main = document.getElementById('main');
  if (!main) return;
  e.preventDefault();
  main.focus({ preventScroll: true });
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(main, { immediate: true, force: true });
  else main.scrollIntoView();
}
