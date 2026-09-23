import React from 'react';
import ArtCard from '../site/ArtCard.jsx';
import { useReveal } from './hooks.js';
import './Failures.css';

/* The four failures. Sits between the hero and Services, and names what is
   broken before anything on the page mentions a service.

   The four statements are the user's copy, verbatim and in the user's order.
   The order is the order a customer is lost in: found, called, answered,
   remembered. Nothing in them is a claim about VexelTech, so BUILD-LAW.md
   Truth is not in play for them.

   ---- FOUR OF THE CARD, 2026-09-24 (the founder) ----------------------

   Each cost is the site's one card (components/site/ArtCard.jsx) with its
   object as the artwork: the transparent webp centred in the top 65% at
   200px, over a lit-raised wash, the fade under it, the statement and the
   consequence pinned to the bottom. Four across at 1280, two at 768, one at
   390. No object stands on the page ground any more. What follows is the
   history of the grid it replaced.

   ---- FOUR ROWS WITH THE FOUNDER'S IMAGES, 2026-09-22 ----------------

   A 2 x 2 GRID, 2026-09-23 (the founder). Each cell is the object at 220px
   over the title over the line, flush left, 32px gutters, nothing drawn. It
   replaced four alternating full-width bands, which put one object and one
   sentence on each of four rows and ran the section past 2000px at 1280 -
   four screens of scroll to read four sentences. Four costs seen together is
   what the section is arguing.

   The objects are the artwork, not icons: they were 96px beside the text,
   which is an icon station, and that is what made them read as icons. The
   files are cut to alpha at 560px, so a 220px box shows them at 2.5x.

   cost-1 and cost-2 swapped rows by the founder, 2026-09-22: the pin is on
   "They cannot find you", the phone on "Not enough are calling". A slot
   is empty and takes no space until its file exists, so a row with no image
   yet is the text alone. */
const FAILURES = [
  {
    id: 'find',
    statement: 'They cannot find you',
    consequence: 'No online presence, so the search that should have found you finds nobody.',
    image: '/assets/cost-2.webp',
  },
  {
    id: 'call',
    statement: 'Not enough are calling',
    consequence: 'The marketing budget goes out every month and the leads do not come back.',
    image: '/assets/cost-1.webp',
  },
  {
    id: 'miss',
    statement: 'You miss the ones who do',
    consequence: 'A missed call is a job that goes to whoever picked up instead.',
    image: '/assets/cost-3.webp',
  },
  {
    id: 'remember',
    statement: 'They do not remember you',
    consequence: 'Work with no name on it is work the next customer never hears about.',
    image: '/assets/cost-4.webp',
  },
];

export default function Failures() {
  /* Four separate things to read, so they arrive one after another on the
     70ms stagger as the LIST enters, and once. The observer watched the
     section until 2026-09-16, and the section's top reaches the trigger line
     with the heading: the list was still 147px below the fold at 1280, so the
     stagger ran out of sight (viewer audit). It watches what moves now. */
  const [ref, revealed] = useReveal();

  return (
    <section className="vt fail" aria-labelledby="fail-h">
      <div className="fail__inner">
        <h2 className="fail__h" id="fail-h">
          What it costs you
        </h2>

        <ul className="fail__items" data-revealed={revealed ? 'true' : 'false'} ref={ref}>
          {FAILURES.map(({ id, statement, consequence, image }, i) => (
            <li className="fail__item" key={id} style={{ '--i': i }}>
              <ArtCard image={image} name={statement} line={consequence} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
