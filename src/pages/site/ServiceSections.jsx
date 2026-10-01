import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowUpRight } from '../../components/site/Icons.jsx';
import { FIGURES, money } from '../../content/pricing.js';
import ServiceFrame from '../../components/story/ServiceFrames.jsx';

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

/* THE FIGURE IS CLASH 400 AT 56px SINCE 2026-09-24 (the founder), set like
   the /pricing grid, and so is "On the call". The Moldie figure that filled
   its own column in `cqi` up to a 160px cap, and the measured `--fig-em`
   ratios that sized it, are gone: at 56px "$299 to $449" is about 330px and
   fits the right column at every width from 1024, and it wraps rather than
   pushing the page wide below that. The history of the cap is in git. */

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
            className={`vt svc2__d svc2__d--${d.id}${cream ? ' svc2__d--cream panel-sec' : ''}`}
            aria-labelledby={`svc-${d.id}`}
          >
            <div className={`svc2__in${cream ? ' panel' : ''}`}>
              {/* ONE FRAME PER DISCIPLINE, 2026-10-01 (the storytelling
                  pass): the frame beside the list from 1024, left on the
                  dark bands and right on the cream ones, as the grounds
                  alternate; above the list below 1024 (services.css). */}
              <div className="svc2__head">
                <h2 className="svc2__name" id={`svc-${d.id}`}>
                  {d.name}
                </h2>
                <p className="svc2__promise">{d.promise}</p>
                {/* THE SEO LINE, COPY V3.1, 2026-10-01: Websites' H3, a 14px
                    mono line under the promise (services.css). */}
                {d.seo ? <h3 className="svc2__seo">{d.seo}</h3> : null}
              </div>

              <div className="svc2__frame">
                <ServiceFrame id={d.id} />
              </div>

              <div className="svc2__left">
                <ul className="svc2__list">
                  {d.cards.map(({ title, line }) => (
                    <li className="svc2__item" key={title}>
                      {/* Decorative: the item says the thing, and a list of
                          six ticks read aloud is six words nobody needs. */}
                      <span className="lmark" aria-hidden="true" />
                      {/* THE ITEM'S LINE under its name, 2026-10-01 (the
                          structure pass): services.js's `line`, 14px. */}
                      <span className="svc2__item-w">
                        <span className="svc2__item-t">{title}</span>
                        {line ? <span className="svc2__item-d">{line}</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
                {/* BIGGER BUILDS, COPY V3, 2026-10-01: Websites' line under its
                    items, in the fact register. */}
                {d.bigger ? <p className="svc2__fact svc2__bigger">Bigger builds: {d.bigger}</p> : null}
              </div>

              <div className="svc2__right">
                {figure ? (
                  <p className="svc2__fig">
                    {figure}
                  </p>
                ) : (
                  /* "Per workflow" for Automation: V3's grid price
                     (VEXELTECH-COPY.md, Pricing, The grid). */
                  <p className="svc2__oncall">{d.id === 'automation' ? 'Per workflow' : 'On the call'}</p>
                )}
                <p className="svc2__fact">Terms: {d.terms}</p>
                <p className="svc2__fact">
                  Good fit if {d.fit.charAt(0).toLowerCase() + d.fit.slice(1)}
                </p>
                <Link className={d.call.primary ? 'svc2__cta' : 'svc2__link'} to="/contact-us">
                  {d.call.label}
                  {/* The outline link's arrow, 2026-09-24: every outline link
                      carries it. Decorative; the label is the name. */}
                  {d.call.primary ? null : <IconArrowUpRight className="i i--sm" />}
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
