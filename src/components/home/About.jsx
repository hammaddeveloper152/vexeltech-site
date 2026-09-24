import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowUpRight } from '../site/Icons.jsx';
import { useReveal } from './hooks.js';
import './About.css';

/* The about section. Between the work wall and the counter row.

   ---- THE MASCOT CAME OFF, 2026-09-25 (the launch batch). The three rows
   stand where it stood; what follows is its history. ----------------------

   ---- A CREAM BAND WITH THE MASCOT ON IT, 2026-09-14 ----------------------

   The section was asphalt with its portrait slot hidden and a statement across
   the full measure. It is a cream band now, edge to edge: the site's mascot
   on the left at 40% of the width, floating, and the statement, the body and
   the call on the right, all in asphalt.

   The mascot is a rendered character, not a photograph of a person. BUILD-LAW's
   sourcing rule was amended the same day so that its no-faces clause covers
   photographs of people and a drawn or rendered mascot is a brand asset. It is
   recorded there as the site's mascot, and like the wordmark it is exempt from
   the carrier count, jacket and all.

   THE CALL IS ASPHALT, not white and not yellow, by the user's decision. The
   white call it was would be 1.13:1 against cream and lose its edge; a yellow
   one would be 1.66:1 at the edge and a second carrier beside the counter
   row's lead figure below.

   The copy is the founder's third sentence, unchanged. The section heading is
   still visually hidden and still a placeholder: a visible heading above a
   statement would be a fifth thing competing for one job. */
const COPY = {
  statement: 'We know how hard it is to spend your earnings and get nothing for it.',
  support:
    'So we build long-term partnerships instead of treating you as an invoice to be paid. A dedicated team stays on your project, which is why asking for a change here is a conversation and not a negotiation.',
  link: 'How we work',
};

/* THE THREE ROWS, 2026-09-25 (the founder's launch batch), verbatim. They
   replace the mascot: right of the copy, centred against it, stacked under
   it below 768. */
const ROWS = [
  ['Team', 'One team across all four disciplines.'],
  ['Build', 'Four business days from content to live.'],
  ['After', 'Thirty days of care, then it is yours.'],
  /* The fourth, 2026-09-25 (the founder's life pass 3), verbatim. */
  ['Price', 'Flat prices. No retainers, no surprises.'],
];

export default function About() {
  const [ref, revealed] = useReveal();

  return (
    <section className="vt about panel-sec" aria-labelledby="about-h">
      {/* The margin label is Marginalia.jsx's since 2026-09-25. */}
      {/* Visually hidden, and it names the section for a screen reader. It
          read "Placeholder section name" until 2026-09-16, when the viewer
          audit found the placeholder being announced; the user named it. */}
      <h2 className="about__h" id="about-h">
        Who we are
      </h2>

      {/* The observer is on what moves, not on the section (viewer audit,
          2026-09-16): from the section the reveal fired before the block was
          on screen. */}
      <div className="about__inner panel" data-revealed={revealed ? 'true' : 'false'} ref={ref}>
        <div className="about__body">
          <p className="about__statement" style={{ '--i': 1 }}>
            {COPY.statement}
          </p>

          <p className="about__support" style={{ '--i': 2 }}>
            {COPY.support}
          </p>

          <Link className="about__link" to="/about-us" style={{ '--i': 3 }}>
            {COPY.link}
            {/* Decorative: the label is the link's accessible name. */}
            <IconArrowUpRight className="i about__go" />
          </Link>
        </div>

        {/* THE MASCOT IS GONE, 2026-09-25 (the founder's launch batch), and
            its asset with it. */}
        <dl className="about__rows" style={{ '--i': 4 }}>
          {ROWS.map(([k, v]) => (
            <div className="about__row" key={k}>
              <dt className="about__row-k lbl">{k}</dt>
              <dd className="about__row-v">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
