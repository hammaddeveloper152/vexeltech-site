import React, { useEffect, useRef } from 'react';
import '../styles.legacy.css';

/* The legacy tree's container, and the reason the rebuild can have `/`.

   BUILD-LAW.md pre-flight step 12 said the route swap could not happen until
   `styles.css` was scoped, because `main.jsx` imported it globally and it
   opened with bare-element resets. `src/styles.legacy.css` is that stylesheet
   with every one of its 1,500 selectors rewritten to require this element.
   Nothing in it can reach a rebuilt page, because every rule now needs `.lg`
   in its ancestor chain and no rebuilt page has one.

   Three things the old `index.html` did for the legacy tree and can no longer
   do, because `/` is not the legacy tree any more. All three moved here:

   1. THE WEBFONTS. Barlow and Barlow Condensed came from a Google Fonts
      <link> in the document head, which after the swap would have been a
      third-party request on every page of the rebuild — the exact thing
      DESIGN.md forbids and the reason its own two faces are self-hosted.
      They are appended here instead, so they are requested on a legacy route
      and nowhere else.

   2. THE `g-wait` CLASS. The document script wrote it onto <html>. Its rules
      are now `.lg.g-wait`, so it belongs on this element. It is set in the
      initial className rather than by an effect: the class hides content
      until the entrance runs, and an effect lands after first paint, which
      is one frame of unhidden content.

   3. THE BODY GROUND. `body { background: var(--paper) }` is now
      `.lg { background: ... }`, which paints only as far as this element
      goes. The page behind it is the rebuild's asphalt, so a short legacy
      page would have shown asphalt below the fold. `min-height: 100vh` on
      the wrapper is what puts that back.

   The three cdnjs scripts are NOT here. Only the legacy home page uses
   them; see HomePage.jsx. */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Archivo:wght@800&family=Barlow+Condensed:ital,wght@0,600;0,700;1,600;1,700&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&display=swap';

let fontsRequested = false;

export default function LegacyShell({ children }) {
  const ref = useRef(null);

  /* NOINDEX, 2026-09-25 (the founder's release-audit addendum): /thanks and
     every legacy page are kept out of search and out of sitemap.xml. Removed
     on unmount, so a rebuilt page after it is not carried along. */
  useEffect(() => {
    const m = document.createElement('meta');
    m.name = 'robots';
    m.content = 'noindex';
    m.dataset.legacy = 'robots';
    document.head.appendChild(m);
    return () => m.remove();
  }, []);

  useEffect(() => {
    /* Once per session, not once per navigation. */
    if (!fontsRequested) {
      fontsRequested = true;
      const pre = document.createElement('link');
      pre.rel = 'preconnect';
      pre.href = 'https://fonts.gstatic.com';
      pre.crossOrigin = '';
      document.head.appendChild(pre);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = FONTS;
      link.dataset.legacy = 'fonts';
      document.head.appendChild(link);
    }

    /* Whatever the legacy entrance would have done, the content must not
       stay hidden if it never runs. The old document script had the same
       release in its error path. */
    const el = ref.current;
    const t = setTimeout(() => el && el.classList.remove('g-wait'), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="lg g-wait" ref={ref}>
      {children}
    </div>
  );
}
