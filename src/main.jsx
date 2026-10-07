import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
/* Every stylesheet, in the order the cascade depends on, ahead of anything
   else (vite.config.js, `vt-css-order`, 2026-10-01). */
import 'virtual:vt-css';
import './styles/tokens.css';
import Root from './Root.jsx';
import { preloadRoute } from './App.jsx';
/* A band's photograph is fetched when the band is nearly on screen, not when
   the page loads. There is no lazy loading for a CSS background, so this is the
   thing that does it. See styles/bands.js. */
import { startBands } from './styles/bands.js';
import { captureUtm } from './components/site/utm.js';
import { refreshScroll } from './components/site/motionLibs.js';

/* The landing URL's UTM tags, read once before anything renders, so both
   forms find them wherever the reader goes next (utm.js). */
captureUtm();

/* PageTransition wraps the routes rather than sitting beside them because it
   needs the router's location to know a route changed. It does NOT control the
   location the routes render against: the transition starts already covering
   and the destination mounts on the same commit as the click, so there is
   nothing to hold. See PageTransition.jsx.

   An earlier draft passed a held location down through a function child, for a
   variant that drew its mark before the page changed. That variant was not
   taken and the machinery came out with it.  */
/* HYDRATED, NOT REPLACED (FINAL29, 2026-10-07, the founder's hydration fix).
   Every page's HTML is the app's own first render, written at build time
   (entry-server.jsx, scripts/prerender.mjs), so React adopts the markup the
   browser has already painted instead of throwing it away and painting new
   nodes. That second paint was the LCP the launch gate measured.

   The landing page's chunk is awaited first, so hydration never meets a
   pending lazy page. A mismatch is reported loudly, tagged [hydration]:
   the build's hydration check (scripts/hydration-check.mjs) fails the build
   on one. The dev server serves the bare template, which has nothing to
   hydrate, so it renders. */
const tree = (
  <BrowserRouter>
    <Root />
  </BrowserRouter>
);

const render = async () => {
  const el = document.getElementById('root');
  if (el.firstElementChild) {
    await preloadRoute(window.location.pathname);
    hydrateRoot(el, tree, {
      onRecoverableError(error, info) {
        // eslint-disable-next-line no-console
        console.error('[hydration]', error && error.message, info && info.componentStack ? info.componentStack.slice(0, 600) : '');
      },
    });
  } else {
    createRoot(el).render(tree);
  }
  startBands();
};

/* THE FULL STYLESHEET LOADS WITHOUT BLOCKING (vite.config.js, critical CSS,
   2026-09-25). EVERY ROUTE renders now, on the inlined above-the-fold rules
   (2026-10-01, the founder; home only until then, while the other routes
   waited for the full sheet, which was most of /services' LCP), and
   re-measures its ScrollTriggers once the rest lands. The inlined list is
   every public route's above-the-fold classes (.measure/critical-classes.mjs).
   In dev there is no such link and everything renders at once. Only a route
   that has loaded ScrollTrigger has triggers to re-measure (motionLibs.js,
   2026-10-01); one that loads it later measures on creation. */
const sheet = document.querySelector('link[data-vt-css]');
const cssLoaded = !sheet || sheet.media === 'all'
  ? Promise.resolve()
  : new Promise((resolve) => {
      sheet.addEventListener('load', resolve, { once: true });
      sheet.addEventListener('error', resolve, { once: true });
      setTimeout(resolve, 4000);
    });

render();
cssLoaded.then(() => requestAnimationFrame(refreshScroll));
