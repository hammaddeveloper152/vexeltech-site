/* PLAUSIBLE, BEHIND A FLAG (the launch gate, 2026-10-07, the founder).

   OFF BY DEFAULT. With VITE_PLAUSIBLE_DOMAIN unset this file is a no-op and
   the build carries no analytics script (vite.config.js, `vt-plausible`).
   To turn it on: add the site in Plausible, put
   VITE_PLAUSIBLE_DOMAIN=vexeltechsolutions.com in the site repo's .env,
   add the goals "Lead", "Click Phone" and "Click Email" in Plausible's
   settings, add https://plausible.io to script-src and connect-src in the
   CSP (htaccess-append.txt), then `npm run build` and upload dist.

   Events:
     Lead          once per visit to /thanks (Tracking.jsx)
     Click Phone   a tel: link pressed, anywhere
     Click Email   a mailto: link pressed, anywhere

   Plausible's script may arrive after an event: calls are queued on a stub
   `plausible` that the script replays when it loads. Cookieless; nothing
   here reads or stores anything about the visitor. */
const DOMAIN = String(import.meta.env.VITE_PLAUSIBLE_DOMAIN || '').trim();
export const PLAUSIBLE_ON = /^[a-z0-9.-]+$/i.test(DOMAIN);

export function track(name) {
  if (!PLAUSIBLE_ON || typeof window === 'undefined') return;
  if (!window.plausible) {
    window.plausible = function plausibleStub(...a) {
      (window.plausible.q = window.plausible.q || []).push(a);
    };
  }
  window.plausible(name);
}

let wired = false;
export function wireLinkEvents() {
  if (!PLAUSIBLE_ON || wired || typeof document === 'undefined') return;
  wired = true;
  document.addEventListener(
    'click',
    (e) => {
      const a = e.target instanceof Element ? e.target.closest('a[href^="tel:"], a[href^="mailto:"]') : null;
      if (!a) return;
      track(a.getAttribute('href').startsWith('tel:') ? 'Click Phone' : 'Click Email');
    },
    true
  );
}
