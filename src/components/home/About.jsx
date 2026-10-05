import React from 'react';
import { useReveal } from './hooks.js';
import FactLedger from '../final/FactLedger.jsx';
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
/* COPY V3.1, 2026-10-01 (VEXELTECH-COPY.md, Home, Who we are). The "How we
   work" link has no V3 line and is removed. */
const COPY = {
  statement: 'Websites, ads and automation for small business.',
  support:
    'VexelTech builds the website people land on, the campaigns that send them there, and the follow-up that catches the enquiry. One team, one brief, one invoice, and a named person on the phone.',
};

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
      {/* THE HANDOFF, 2026-10-06 (the founder's clarity pass): each home
          section's one-line lead picks up from the one before. */}
      <p className="sec-lead about__lead">One team fixes all four, on one invoice.</p>

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
        </div>

        {/* THE FACTS, a cream ledger (the final pass, 2026-10-03). It
            replaced the four colour tiles and content/facts.js. */}
        <FactLedger />
      </div>
    </section>
  );
}
