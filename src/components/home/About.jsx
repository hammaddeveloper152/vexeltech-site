import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useReveal } from './hooks.js';
import './About.css';

/* The about section. Between the work wall and the counter row.

   One first-person statement at pull quote scale carries the section, with a
   supporting paragraph under it, a reserved photograph bled to the left
   viewport edge, and a link to the about page.

   Every string here is placeholder and says so. BUILD-LAW.md Truth: who this
   agency is, how long it has been doing this, and what it believes are all
   things only the user can say, and a first-person statement is the single
   most tempting place on the page to invent one. Nothing is written here
   that the user has not said, including in the voice.

   The statement takes the PULL QUOTE role, not display and not a heading
   step. DESIGN.md allows one display per page and the hero has it; and a
   sentence set large is not a heading, which is the whole reason the pull
   quote role exists. It is a <p>, not a <blockquote>: this is the agency
   speaking in its own section, not a quotation from someone else. The
   testimonial carousel is the page's other pull quote and that one IS a
   quotation, which is the difference. */
const COPY = {
  /* THE STATEMENT HAS A LENGTH BUDGET: about 115 characters. It is not a
     stylistic preference and the real copy has to be written to it.

     The pull quote role is specified for text running five or six lines, and
     the role's size is fixed by viewport while the column is not, so the
     narrowest width sets the budget. Measured, at 115 characters:

     | width | size | column | lines |
     |---|---|---|---|
     | 390 | 40px | 343px | 8 |
     | 600 | 40px | 553px | 4 |
     | 768 | 58px | 721px | 5 |
     | 1024 | 58px | 977px | 4 |
     | 1280 | 58px | 732px | 5 |

     390 is the one that hurts and it cannot be fixed here: 40px type in a
     343px column is fourteen characters to the line whatever the layout
     does, so every character costs. The first draft of this placeholder ran
     157 characters and set eleven lines on a phone, which is not a pull
     quote, it is a paragraph at the wrong size.

     If the real statement needs to be longer than this, it wants the
     supporting paragraph, not a longer quote. */
  statement:
    'We know how hard it is to spend your earnings and get nothing for it.',
  support:
    'So we build long-term partnerships instead of treating you as an invoice to be paid. A dedicated team stays on your project, which is why asking for a change here is a conversation and not a negotiation.',
  link: 'How we work with you',
};

export default function About() {
  const [ref, revealed] = useReveal();

  return (
    <section className="vt about" aria-labelledby="about-h" ref={ref}>
      {/* Visually hidden, and deliberately so.

          Every other section on this page carries a visible h2, and the
          document outline needs an entry here or this section is a large
          block of content that heading navigation cannot reach. But the
          section was specified as a statement, a paragraph, an image and a
          link, and a visible heading above a pull quote would be a fifth
          element competing with the statement for the same job.

          So the outline gets its entry and the composition stays as
          specified. If a visible section name is wanted later, delete the
          clip in About.css and it becomes an ordinary heading. */}
      <h2 className="about__h" id="about-h">
        Placeholder section name
      </h2>

      <div className="about__inner" data-revealed={revealed ? 'true' : 'false'}>
        <div className="about__media" style={{ '--i': 0 }}>
          {/* The reserved slot. Fixed ratio, so the photograph drops in at
              exactly this size and nothing in the section moves.

              4 by 5 portrait, and one ratio at every width rather than a
              landscape crop on phones: the real photograph gets cropped once,
              not twice. Portrait also separates it from the work wall above,
              whose six plates are all 16 by 10 landscape.

              No icon in it. DESIGN.md Iconography: an icon must add meaning
              the element does not already carry, and a picture glyph centred
              in an empty picture frame only says "picture". This is the same
              call the services artwork slot came to. */}
          <span className="about__plate" aria-hidden="true" />
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
            {/* Decorative. The label beside it is the link's accessible name,
                so an arrow with its own label would announce the destination
                twice. Steel-dark rather than white, the same call the work
                wall's arrow made: the label is what the reader lands on. */}
            <ArrowUpRight className="i i--sm about__go" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
