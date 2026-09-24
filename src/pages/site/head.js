/* THE HEAD, per page, 2026-09-25 (the release audit). Every rebuilt page
   sets its title, description, canonical URL and Open Graph tags through
   here, and the 404 marks itself noindex.

   WHY, measured: no page had a canonical URL or any Open Graph tag, and
   seven alias routes (/about, /contact, /work, /packages, /portfolio.html
   and the trailing-slash forms) render a rebuilt page under a second URL.
   The canonical names the one URL each page is kept at.

   THE ORIGIN is the one the JSON-LD in index.html already asserts.

   NO og:image. There is no share image, and BUILD-LAW rule 0 says a missing
   visual is asked for, never substituted or made. It is listed in the
   release audit as owed by the founder; add `og:image` here when it lands.

   ON UNMOUNT the page's canonical, og:url and robots tags are removed, so a
   client-side hop to a route that sets none (the legacy privacy, terms and
   thanks pages) does not carry a stale canonical with it. */

export const ORIGIN = 'https://vexeltechsolutions.com';

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
  metaTag('name', 'twitter:card').content = 'summary';

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
