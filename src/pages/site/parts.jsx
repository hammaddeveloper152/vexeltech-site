import React from 'react';
import SectionJoin from '../../components/site/SectionJoin.jsx';
import { Link } from 'react-router-dom';
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
/* THE PROMISE LINE (copy rule 7; the founder's final audit, final22,
   2026-10-06): "A written number within one business day." exactly once per
   page, beside the primary call. Home carries it in the hero; Services in
   its closing call, Pricing under the bundle's call, About in its close,
   Contact under the form, the 404 under its call. 12px mono, steel-lift on
   the dark (7.55:1), steel on a cream panel (7.20). */
export const PROMISE = 'A written number within one business day.';
export function PromiseLine({ className = '' }) {
  return <p className={`promise-line${className ? ` ${className}` : ''}`}>{PROMISE}</p>;
}

/* `field` (home, final26, 2026-10-07): the band is a full-bleed yellow
   field, #F2B01E, with the heading and the line in ink #121212 and the
   call inverted (ink fill, bone text); at 390 it fills one screen with the
   heading at 56px. The page's last stop before the form. */
export function CallBand({ heading, note = null, promise = false, field = false, cream = false, join = false }) {
  return (
    <section
      className={`vt callband${field ? ' callband--field' : ''}${cream ? ' callband--cream' : ''}`}
      aria-labelledby="callband-h"
    >
      {/* Home's section join (final30); on the yellow field, in its ink. */}
      {join ? <SectionJoin tone={field ? 'ink' : undefined} /> : null}
      {/* The scribble under the heading came off everywhere, 2026-10-01
          (the storytelling pass). */}
      <h2 className="callband__h" id="callband-h">
        {heading}
      </h2>
      {note ? <p className="callband__note">{note}</p> : null}
      <Link className="callband__cta" to={CALL_HREF}>
        {CALL_LABEL}
      </Link>
      {promise ? <PromiseLine className="callband__promise" /> : null}
    </section>
  );
}

