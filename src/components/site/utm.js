/* THE UTM FIELDS, 2026-09-24 (the founder's energy pass, CRO for paid
   traffic).

   The four tags a paid click lands with are read from the landing URL once,
   at load, and kept in sessionStorage for the rest of the visit, so a reader
   who lands on /pricing from an ad and sends the form from /contact-us three
   pages later still sends the tags the ad put on the URL. Both forms (the
   footer form and the Plan Builder) post them as hidden fields.

   A landing URL WITH tags replaces what is stored; a URL without them leaves
   it alone, because every internal page after the landing page has none.
   Storage can throw (a private window, blocked site data), so every read and
   write is guarded and the fields fall back to empty: a form that cannot
   read its tags still sends. */

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
const STORE = 'vt-utm';

export function captureUtm() {
  if (typeof window === 'undefined') return;
  try {
    const q = new URLSearchParams(window.location.search);
    const found = {};
    let any = false;
    for (const k of UTM_KEYS) {
      const v = q.get(k);
      if (v) {
        found[k] = v.slice(0, 200);
        any = true;
      }
    }
    if (any) window.sessionStorage.setItem(STORE, JSON.stringify(found));
  } catch {
    /* No storage: the fields go empty, the form still works. */
  }
}

export function getUtm() {
  const out = Object.fromEntries(UTM_KEYS.map((k) => [k, '']));
  try {
    const s = JSON.parse(window.sessionStorage.getItem(STORE) || '{}');
    for (const k of UTM_KEYS) if (typeof s[k] === 'string') out[k] = s[k];
  } catch {
    /* As above. */
  }
  return out;
}
