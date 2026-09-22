import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from '@phosphor-icons/react';
import { FIGURES, money } from '../../content/pricing.js';

/* THE FOUR DISCIPLINES ON /services, AS ALTERNATING BANDS, 2026-09-23.

   THE 28 CARDS ARE OUT. Each discipline carried six sub-service cards and the
   four sets came to twenty-four, plus the four strips: a page whose whole job
   is to say what four things are, saying it in twenty-eight boxes. The founder
   called it a shoe store and that is the right name for it - a wall of
   identical small objects, none of which can be the thing you came for.

   ONE BAND PER DISCIPLINE, full width, alternating base / cream / base /
   cream. The ground is the separator, so nothing between them is drawn.

     left    the name in Moldie at 64px, the promise, and the six
             what-you-get items as a TWO-COLUMN CHECKLIST with a Phosphor
             Check. The items are the cards' own titles; a checklist says the
             same six things in a tenth of the height and reads as one offer
             rather than six objects.
     right   THE PRICE IS THE VISUAL. Moldie at 160px where there is a figure
             to set - "$299 to $449" for Branding and "$700" for Websites -
             and "On the call" in Monigue at the heading step where there is
             not. Then the turnaround and fit lines in the label register, and
             the button.

   WHY THE TWO PRICELESS ONES CHANGE FACE RATHER THAN SHRINK. Moldie is the
   NAME register and sets product names and figures; "On the call" is neither,
   it is a statement about how the work is priced. Setting it in Moldie at
   160px would make a sentence look like a number. Monigue at the heading step
   is the loud register doing what it does everywhere else on the site, and it
   lands at a similar optical weight without pretending to be a figure.

   EVERY FIGURE IS A TOKEN from `content/pricing.js`. The strings that used to
   carry them ("From $299. Advance at $449.", "$700, one tier.") are gone: a
   price written into a sentence is a price that goes stale in a place nobody
   greps. `money()` formats them.

   ALL COPY IS THE FOUNDER'S, from VEXELTECH-SERVICES-COPY.md in the design
   repo. The promise, the turnaround, the fit line and the call label are
   unchanged; the six item titles are the cards' titles, unchanged. Only the
   price strings are replaced by their tokens, and the cards' one-line
   descriptions come off with the cards. */

/* The price, per discipline, derived rather than typed. `null` means the work
   is scoped on the call, which is the founder's position for two of the four
   and is not a missing figure. */
function priceOf(id) {
  if (id === 'branding') {
    const { brandingBasic: lo, brandingAdvance: hi } = FIGURES;
    return lo === null || hi === null ? null : `${money(lo)} to ${money(hi)}`;
  }
  if (id === 'websites') return FIGURES.website === null ? null : money(FIGURES.website);
  return null;
}

export default function ServiceSections({ disciplines }) {
  return (
    <div className="svc2">
      {disciplines.map((d, i) => {
        const figure = priceOf(d.id);
        const cream = i % 2 === 1;
        return (
          <section
            key={d.id}
            id={d.id}
            className={`vt svc2__d${cream ? ' svc2__d--cream colour-band' : ''}`}
            aria-labelledby={`svc-${d.id}`}
          >
            <div className="svc2__in">
              <div className="svc2__left">
                <h2 className="svc2__name" id={`svc-${d.id}`}>
                  {d.name}
                </h2>
                <p className="svc2__promise">{d.promise}</p>

                <ul className="svc2__list">
                  {d.cards.map(({ title }) => (
                    <li className="svc2__item" key={title}>
                      {/* Decorative: the item says the thing, and a list of
                          six ticks read aloud is six words nobody needs. */}
                      <Check className="svc2__check" weight="bold" aria-hidden="true" />
                      {title}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="svc2__right">
                {figure ? (
                  <p className="svc2__fig">{figure}</p>
                ) : (
                  <p className="svc2__oncall">On the call</p>
                )}
                <p className="svc2__fact">Turnaround: {d.turnaround}</p>
                <p className="svc2__fact">
                  Good fit if {d.fit.charAt(0).toLowerCase() + d.fit.slice(1)}
                </p>
                <Link className={d.call.primary ? 'svc2__cta' : 'svc2__link'} to="/contact-us">
                  {d.call.label}
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
