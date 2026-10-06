/* THE HEAD, per page, 2026-09-25 (the release audit). Every rebuilt page
   sets its title, description, canonical URL and Open Graph tags through
   here, and the 404 marks itself noindex.

   WHY, measured: no page had a canonical URL or any Open Graph tag, and
   alias routes (/about, /contact, /packages and the trailing-slash forms)
   render a rebuilt page under a second URL.
   The canonical names the one URL each page is kept at.

   THE ORIGIN is the one the JSON-LD in index.html already asserts.

   THE SHARE IMAGE, 2026-09-25 (the founder's addendum): /og/vexeltech.jpg
   since final22 (it was /og.jpg), 1200 x
   630, drawn in code by .measure/brand-assets.mjs, on every page, with the
   large card.

   ON UNMOUNT the page's canonical, og:url and robots tags are removed, so a
   client-side hop to a route that sets none (the legacy privacy, terms and
   thanks pages) does not carry a stale canonical with it. */

export const ORIGIN = 'https://vexeltechsolutions.com';
const OG_ALT = 'The VexelTech wordmark on a dark ground.';
export const OG_IMAGE = '/og/vexeltech.jpg';

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
  /* The share image since final22 (2026-10-06): the wordmark on the dark
     ground, 1200 x 630, /og/vexeltech.jpg (.measure/brand-assets.mjs). */
  metaTag('property', 'og:image').content = `${ORIGIN}${OG_IMAGE}`;
  metaTag('property', 'og:image:width').content = '1200';
  metaTag('property', 'og:image:height').content = '630';
  metaTag('property', 'og:image:alt').content = OG_ALT;
  metaTag('name', 'twitter:card').content = 'summary_large_image';
  metaTag('name', 'twitter:image').content = `${ORIGIN}${OG_IMAGE}`;
  metaTag('name', 'twitter:image:alt').content = OG_ALT;
  if (title) metaTag('name', 'twitter:title').content = title;
  if (description) metaTag('name', 'twitter:description').content = description;

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

/* THE FAQ STRUCTURED DATA, 2026-10-05 (the founder's services substance
   pass): one FAQPage block per page that shows questions (/services, /about-us
   and /pricing), built from the same `{ q, a }` items the page renders, so
   the data and the page cannot say different things. Removed on unmount, so
   a client-side hop never carries one page's questions to another. */
export function setFaqLd(items) {
  if (typeof document === 'undefined' || !items || !items.length) return () => {};
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.dataset.faq = 'true';
  el.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  });
  document.head.querySelectorAll('script[data-faq]').forEach((n) => n.remove());
  document.head.appendChild(el);
  return () => el.remove();
}

/* JSON-LD PER PAGE (the founder's final audit, final22, 2026-10-06). One
   block per `key`, replaced when set again and removed on unmount, so a
   client-side hop never carries one page's data to another. The prerender
   step bakes each page's blocks into its own HTML. */
export function setLd(key, data) {
  if (typeof document === 'undefined' || !data) return () => {};
  document.head.querySelectorAll(`script[data-ld="${key}"]`).forEach((n) => n.remove());
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.dataset.ld = key;
  el.textContent = JSON.stringify({ '@context': 'https://schema.org', ...data });
  document.head.appendChild(el);
  return () => el.remove();
}

/* The countries served: the US, the UK, Australia and the EU's member
   states (the founder's audit brief; About's FAQ says yes to the UK,
   Europe and Australia). */
export const AREA_SERVED = ['US', 'GB', 'AU', 'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];

/* The breadcrumb of an inner page: Home, then the page. */
export function setBreadcrumb(name, path) {
  return setLd('breadcrumb', {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name, item: `${ORIGIN}${path}` },
    ],
  });
}
