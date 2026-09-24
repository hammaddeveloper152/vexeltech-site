import React from 'react';
import { Link } from 'react-router-dom';
import Scribble from '../../components/site/Scribble.jsx';
import './pages.css';

/* The three shapes every non-home page is built from.

   They exist so a page head, a call band and a one-screen page are one
   decision each rather than seven. A page that wants a different head should
   argue for it here, not fork it.

   THE CALL IS ALWAYS TO CONTACT and always says the same thing, because
   content answer 10.3 gives one call label for this site and a second one
   invented here would be a second offer. The bar's call and these calls are
   the same words pointing at the same page; the bar's is white and this one
   is machine yellow, which is the difference between a persistent link and
   the one action a frame is about. */

/* `vt` is on every section below, not on a page wrapper. That is the
   established pattern: tokens.css applies the ground, the register and the
   focus ring per SECTION rather than once at the root, and a page wrapper
   carrying it would be a second surface behind the sections that already
   have one. See the note above `.vt` in tokens.css. */

/* The primary label everywhere, 2026-09-24 (the founder's energy pass). */
export const CALL_LABEL = 'Get a custom quote';
export const CALL_HREF = '/contact-us';

/* `step`: the storyboard (2026-09-21) opens every page but home at the
   HEADING step. 'figure' keeps the old step for Contact, which is off the
   sheet and was left as built. */
export function PageHead({ title, lead, id = 'pg-h', step = 'heading' }) {
  return (
    <header className="vt pg__head">
      <div className="pg__head-in">
        <h1 className="pg__h" id={id} data-step={step}>
          {title}
        </h1>
        {lead ? <p className="pg__lead">{lead}</p> : null}
      </div>
    </header>
  );
}

export function Section({ title, note, children, labelledBy }) {
  return (
    <section className="vt pg__section" aria-labelledby={labelledBy}>
      <div className="pg__section-in">
        {title ? (
          <h2 className="pg__sh" id={labelledBy}>
            {title}
          </h2>
        ) : null}
        {note ? <p className="pg__note">{note}</p> : null}
        {children}
      </div>
    </section>
  );
}

/* THE CLOSING CALL, 2026-09-24 (the founder's Flesh and Bones pass): one
   line, the heading's own words, in Clash Display Medium 32px uppercase in
   machine yellow with a hand-drawn yellow scribble 8px below it (a straight
   4px underline until 2026-09-25; Scribble.jsx), centred, 160px
   above and below on the page's ground. The line IS the call - a link to the
   contact page - so the separate button is gone, and so are the burst and
   spotlight grounds. The heading keeps its own punctuation under the
   uppercase transform.

   `note`, restored later the same day (the founder): the page's original
   subline, 24px under the line, 16px steel-lift, centred, 520px wide at most. */
/* THE CLOSING CALL SINCE 2026-09-25 (the founder): the heading at 56px (40
   on a phone) with the scribble under it, scaled to it; the subline; the
   yellow "Get a custom quote" button. The button is the link now, and the
   heading is words. */
export function CallBand({ heading, note = null }) {
  return (
    <section className="vt callband" aria-labelledby="callband-h">
      <h2 className="callband__h" id="callband-h">
        <span className="callband__word">
          {heading}
          <Scribble />
        </span>
      </h2>
      {note ? <p className="callband__note">{note}</p> : null}
      <Link className="callband__cta" to={CALL_HREF}>
        {CALL_LABEL}
      </Link>
    </section>
  );
}

/* A one-screen page: a heading, a line, optionally a note saying what is not
   here yet, and the call.

   `pending` is deliberately a separate prop from `lead`. A line that states
   what the page IS may be real copy; a line that says content has not been
   supplied is a placeholder and has to be visibly one, so the two are styled
   differently and neither can quietly become the other. */
export function OneScreen({ title, lead, pending, callHeadingId = 'one-h' }) {
  return (
    <section className="vt one" aria-labelledby={callHeadingId}>
      <div className="one__in">
        <h1 className="one__h" id={callHeadingId}>
          {title}
        </h1>
        {lead ? <p className="one__lead">{lead}</p> : null}
        {pending ? <p className="one__pending">{pending}</p> : null}
        <Link className="one__cta" to={CALL_HREF}>
          {CALL_LABEL}
        </Link>
      </div>
    </section>
  );
}
