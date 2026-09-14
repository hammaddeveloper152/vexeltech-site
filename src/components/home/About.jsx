import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useReveal } from './hooks.js';
import './About.css';

/* The about section. Between the work wall and the counter row.

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
  link: 'How we work with you',
};

export default function About() {
  const [ref, revealed] = useReveal();

  return (
    <section className="vt about" aria-labelledby="about-h" ref={ref}>
      <h2 className="about__h" id="about-h">
        Placeholder section name
      </h2>

      <div className="about__inner" data-revealed={revealed ? 'true' : 'false'}>
        {/* The reveal moves this wrapper and the float moves the image inside
            it, so the two transforms never compete for one element. */}
        <div className="about__mascot" style={{ '--i': 0 }}>
          {/* Decorative. The statement beside it is what the section says, and
              a description of a character waving would be read before it. */}
          <img
            className="about__character float"
            src="/assets/objects/character.webp"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>

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
            <ArrowUpRight className="i i--sm about__go" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
