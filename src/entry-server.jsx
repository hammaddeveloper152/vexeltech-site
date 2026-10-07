import React from 'react';
import { StaticRouter } from 'react-router';
import { prerenderToNodeStream } from 'react-dom/static';
import 'virtual:vt-css';
import Root from './Root.jsx';

/* THE SERVER RENDER (FINAL29, 2026-10-07, the founder's hydration fix).
   Built by `vite build --ssr` into dist-ssr and called by
   scripts/prerender.mjs, once per route. It renders the app exactly as the
   browser's FIRST render will be, before any effect has run, so
   `hydrateRoot` in main.jsx adopts the prerendered markup instead of
   replacing it. `prerenderToNodeStream` waits for the lazy page chunks,
   and writes the Suspense markers hydration expects.

   Nothing here may read the window: a component that decides something
   from the screen, the motion preference or the connection does it in an
   effect after mount (DESIGN.md FINAL29). */
export async function render(url) {
  const { prelude } = await prerenderToNodeStream(
    <StaticRouter location={url}>
      <Root />
    </StaticRouter>
  );
  let html = '';
  for await (const chunk of prelude) html += chunk;
  return html;
}
