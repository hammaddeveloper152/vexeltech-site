/* THE META PIXEL, 2026-09-24 (the founder's energy pass, CRO for paid
   traffic).

   The ID is read from VITE_META_PIXEL_ID at build time. WITHOUT AN ID THIS
   FILE IS A NO-OP: no script element, no `fbq` global, no request to
   connect.facebook.net, nothing. The site's "no third-party request on page
   load" holds exactly as long as the variable is unset; set it (in the
   Netlify build environment) and the pixel loads on the first route.

   An ID that is not all digits is treated as no ID, because it is written
   into a script call and a pixel ID is a number.

   Events: PageView on every route (Tracking in main.jsx); Lead on the
   in-page success of the contact form and the Plan Builder, once per
   submission, and on /thanks for the legacy form. The loader is Meta's own
   snippet, reduced to what it does: queue calls on a stub `fbq` until
   fbevents.js arrives and replays them. */

const ID = String(import.meta.env.VITE_META_PIXEL_ID || '').trim();
const VALID = /^\d+$/.test(ID);
let started = false;

function start() {
  if (started) return true;
  if (!VALID || typeof window === 'undefined') return false;
  if (!window.fbq) {
    const fbq = function fbqStub(...args) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
  }
  window.fbq('init', ID);
  started = true;
  return true;
}

export function trackPixel(event) {
  if (!start()) return;
  window.fbq('track', event);
}

export const PIXEL_ON = VALID;
