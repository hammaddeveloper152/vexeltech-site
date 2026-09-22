import React from 'react';
import Slot from '../site/Slot.jsx';
import { useReveal } from './hooks.js';
import './Failures.css';

/* The four failures. Sits between the hero and Services, and names what is
   broken before anything on the page mentions a service.

   The four statements are the user's copy, verbatim and in the user's order.
   The order is the order a customer is lost in: found, called, answered,
   remembered. Nothing in them is a claim about VexelTech, so BUILD-LAW.md
   Truth is not in play for them.

   ---- FOUR ROWS WITH THE FOUNDER'S IMAGES, 2026-09-22 ----------------

   THE OBJECTS ARE THE ARTWORK, NOT ICONS (the founder, later the same day).
   Each row is a two-column band: the object at 280px one side, the statement
   and its line the other, and the rows ALTERNATE - object left, right, left,
   right - so the reader's eye crosses the measure four times instead of
   running down one gutter. They were 96px beside the text, which is an icon
   station, and an icon station is what made them read as icons.

   The files were re-encoded at 560px for this (`.measure/costprep.mjs 560`):
   at the old 192px they would have been shown at 280 CSS px, 2.9x on a
   retina screen, and the one thing the section is built around would have
   been the softest object on the page.

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
            <li
              className="fail__item"
              key={id}
              style={{ '--i': i }}
              data-side={i % 2 === 0 ? 'left' : 'right'}
            >
              {/* The founder's object, 280px, alternating sides. Empty until
                  the file exists. Decorative: the statement says it. */}
              <Slot src={image} className="fail__img" />
              <div className="fail__text">
                <h3 className="fail__s">{statement}</h3>
                <p className="fail__c">{consequence}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
