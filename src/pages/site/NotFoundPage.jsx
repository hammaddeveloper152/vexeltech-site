import React from 'react';
import { Link } from 'react-router-dom';
import Shell from './Shell.jsx';
import { CALL_HREF, CALL_LABEL } from './parts.jsx';
import './notfound.css';

/* THE NOT-FOUND PAGE, 2026-09-15. The route for `/404` and for every path
   the router does not know.

   It replaced the legacy NotFound, which rendered inside the legacy shell with
   the legacy stylesheet: the one place a mistyped URL still left the
   rebuild. This is on the page rig like every other rebuilt page.

   The render is the mark on the tile floor, `vmark.png` from the founder,
   1200px webp, shown at 480px. A brand object, and decoration here: the
   heading says what happened, so its alt is empty. The copy is the brief's. */
export default function NotFoundPage() {
  return (
    <Shell title="Page not found | VexelTech" description="That page isn't here.">
      <section className="vt nf" aria-labelledby="nf-h">
        <div className="nf__in">
          <img
            className="nf__mark"
            src="/assets/objects/vmark.webp"
            alt=""
            width="1200"
            height="1200"
            decoding="async"
          />
          <h1 className="one__h nf__h" id="nf-h">
            That page isn&apos;t here.
          </h1>
          <p className="nf__lead">Try the menu, or tell us what you were looking for.</p>
          <Link className="one__cta nf__cta" to={CALL_HREF}>
            {CALL_LABEL}
          </Link>
        </div>
      </section>
    </Shell>
  );
}
