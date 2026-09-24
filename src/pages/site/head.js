/* THE HEAD, per page, 2026-09-25 (the release audit). Every rebuilt page
   sets its title, description, canonical URL and Open Graph tags through
   here, and the 404 marks itself noindex.

   WHY, measured: no page had a canonical URL or any Open Graph tag, and
   alias routes (/about, /contact, /packages and the trailing-slash forms)
   render a rebuilt page under a second URL.
   The canonical names the one URL each page is kept at.

   THE ORIGIN is the one the JSON-LD in index.html already asserts.

   THE SHARE IMAGE, 2026-09-25 (the founder's addendum): /og.jpg, 1200 x
   630, drawn in code by .measure/brand-assets.mjs, on every page, with the
   large card.

   ON UNMOUNT the page's canonical, og:url and robots tags are removed, so a
   client-side hop to a route that sets none (the legacy privacy, terms and
   thanks pages) does not carry a stale canonical with it. */

export const ORIGIN = 'https://vexeltechsolutions.com';
const OG_ALT = 'VexelTech. Websites $700 flat. Live in four business days.';

function metaTag(attr, key) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  return el;
}

export function setHead({ title, description, path, noindex = false }) {
  if (title) {
    document.title = title;
    metaTag('property', 'og:title').content = title;
  }
  if (description) {
    metaTag('name', 'description').content = description;
    metaTag('property', 'og:description').content = description;
  }
  metaTag('property', 'og:type').content = 'website';
  metaTag('property', 'og:site_name').content = 'VexelTech';
  metaTag('property', 'og:image').content = `${ORIGIN}/og.jpg`;
  metaTag('property', 'og:image:width').content = '1200';
  metaTag('property', 'og:image:height').content = '630';
  metaTag('property', 'og:image:alt').content = OG_ALT;
  metaTag('name', 'twitter:card').content = 'summary_large_image';

  if (path) {
    const url = ORIGIN + path;
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
    metaTag('property', 'og:url').content = url;
  }
  if (noindex) metaTag('name', 'robots').content = 'noindex';

  return () => {
    document.head.querySelector('link[rel="canonical"]')?.remove();
    document.head.querySelector('meta[property="og:url"]')?.remove();
    document.head.querySelector('meta[name="robots"]')?.remove();
  };
}
