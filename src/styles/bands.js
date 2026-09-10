/* bands.js — a band does not fetch its photograph until it is nearly on screen.

   THERE IS NO LAZY LOADING FOR A CSS BACKGROUND. `loading="lazy"` is an `<img>`
   attribute; a `background-image` is fetched as soon as the box that carries it
   is in the render tree, wherever that box happens to be on the page. Five
   photographs went onto the home page in one pass and every one of them was
   pulled down before the reader had scrolled a pixel: **2100 KB on arrival
   against 268 KB before**, and four of the five are for sections a reader may
   never reach.

   "The page must not get slower" is a standing rule here and it outranks any of
   the aesthetic ones, so the fetch is deferred instead. `lit.css` holds every
   band at `background-image: none` until it carries `data-near`, and this sets
   `data-near` when the section is within a viewport and a half of the fold.

   ONE OBSERVER, AND IT SURVIVES ROUTE CHANGES. This is a single-page app: the
   sections on `/about-us` do not exist when the module first runs. A
   MutationObserver on the body picks up whatever the router mounts, which is
   why this is a module rather than a hook — nothing has to remember to call it,
   and there is no component that owns all the bands.

   REDUCED MOTION AND NO-JS BOTH DEGRADE TO A GROUND, NOT TO NOTHING. Without
   this file every band is asphalt under its scrim, which is the value the page
   already uses everywhere else. A band that never arrives is a section that
   looks like the rest of the site.
*/

const SEL = '[class*="band-"], .scratched';
const MARK = 'near';

let io = null;

function watch(el) {
  if (el.dataset[MARK] || el.dataset.bandWatched) return;
  el.dataset.bandWatched = '1';
  io.observe(el);
}

function scan(root) {
  if (!(root instanceof Element)) return;
  if (root.matches?.(SEL)) watch(root);
  root.querySelectorAll?.(SEL).forEach(watch);
}

export function startBands() {
  if (io || typeof IntersectionObserver === 'undefined') return;

  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.dataset[MARK] = 'true';
        io.unobserve(e.target);
      }
    },
    /* 80% of the viewport of warning — about 700px at a laptop height, which is
       a second or so of normal scrolling and enough for a 400 KB image to
       decode before the section is read.

       IT WAS 150% AND THAT WAS TOO MUCH ON A SHORT PAGE. `/pricing` is barely
       two viewports tall, so a viewport and a half of margin reached the call
       band AND the footer from the top of the page and fetched both on arrival:
       1050 KB, which is the number this file exists to prevent. */
    { rootMargin: '80% 0px' },
  );

  scan(document.body);
  new MutationObserver((records) => {
    for (const r of records) r.addedNodes.forEach(scan);
  }).observe(document.body, { childList: true, subtree: true });
}
