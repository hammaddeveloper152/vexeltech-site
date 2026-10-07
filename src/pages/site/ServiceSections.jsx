import React from 'react';
import { Link } from 'react-router-dom';
import { FIGURES, money } from '../../content/pricing.js';
import EvidenceBand from '../../components/story/EvidenceBand.jsx';
import DevicePhones from '../../components/story/DevicePhones.jsx';
import BrandDesk from '../../components/artifacts/BrandDesk.jsx';
import MarketingMosaic from '../../components/artifacts/MarketingMosaic.jsx';
import AssistantThread from '../../components/artifacts/AssistantThread.jsx';
import { SpecSheet, HowItGoes } from '../../components/story/Substance.jsx';
import Details from '../../components/story/Details.jsx';
import { CALL_HREF, CALL_LABEL, PromiseLine } from './parts.jsx';
import { SUBSTANCE } from '../../content/substance.js';

/* FINAL14 (the founder, 2026-10-06): the stage titles and step strips of the
   clarity pass are deleted; each artifact's caption is the one line of
   explanation. THE REVERT (the founder, 2026-10-06): the accent field and
   the three closed rows of final14 are undone. The artifact stands on the
   band's own ground, and the spec sheet, how it goes and the two questions
   are open under the list and the price, as in the substance pass. */

/* The proof bands, by services.js's `proof` (the final pass, 2026-10-03;
   since the final artifacts pass, 2026-10-03; since final7 the brand you
   type, and from search to call for the visitor). */
/* Since final17 (2026-10-06) Branding is the desk. */
/* FINAL30 (2026-10-07, the founder's frames M2 and A4): Marketing is the
   mosaic of six places (MarketingMosaic.jsx), Automation the assistant's
   thread (AssistantThread.jsx). The inbox and the text-back stage are
   deleted. */
const PROOF = { brand: BrandDesk, ads: MarketingMosaic, textback: AssistantThread };

/* THE HEADINGS (the founder's decisions after the final audit, final23,
   2026-10-06): each band's h2 is a sentence carrying its search cluster
   (copy rule 9), and the discipline's name stands above it as the band's
   eyebrow. The eyebrows are sentence case, not uppercase, so the four of
   them stay outside BUILD-LAW Layout's cap of three small uppercase
   eyebrows per page. */
const HEADINGS = {
  branding: 'Branding for small businesses',
  websites: 'Small business website design',
  marketing: 'Local SEO, Google Ads and Meta ads for local businesses',
  automation: 'Missed-call text-back and small business automation',
};

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

/* ONE SCREEN PER DISCIPLINE (the founder, final24, 2026-10-07). Each band
   holds, in this order and nothing else:

     1  the artifact, as built
     2  the eyebrow (the discipline's name) and the sentence h2
     3  the promise line, 18px, ten words or fewer (PROMISES below)
     4  the facts strip: price, timing, what you get, what you own, every
        value from the spec sheet (FACTS below)
     5  the call, "Get a custom quote"; the promise line "A written number
        within one business day." under the first band only
     6  "Details", closed: the spec sheet and how it goes, as they are

   The What you get list, the price column, the fit line, "Bigger builds"
   and the two questions came off the page. The list's lines still feed
   /pricing (content/services.js); the questions are deleted from
   content/substance.js and marked off in the copy file. */

/* The promise, ten words or fewer. Two were trimmed, same meaning:
   Branding (14 words) and Websites (11). */
const PROMISES = {
  branding: 'A mark that holds up on sign, invoice and search.',
  websites: 'A conversion-focused site, live in four business days.',
};

/* The facts strip: [label, value], every value the spec sheet's own words,
   except the two prices, which are the site's tokens (the Branding and
   Websites spec sheets carry no price row). Marketing's spec sheet has no
   ownership row, so its fourth item is its Terms row. */
function factsOf(id) {
  const spec = Object.fromEntries((SUBSTANCE[id] && SUBSTANCE[id].spec) || []);
  if (id === 'branding')
    return [
      ['Price', `${money(FIGURES.brandingBasic)} or ${money(FIGURES.brandingAdvance)}`],
      ['Delivery', spec.Delivery],
      ['Files', spec.Files],
      ['Ownership', spec.Ownership],
    ];
  if (id === 'websites')
    return [
      ['Price', money(FIGURES.website)],
      ['Build', spec.Build],
      ['Pages', spec.Pages],
      ['Ownership', spec.Ownership],
    ];
  if (id === 'marketing')
    return [
      ['Pricing', spec.Pricing],
      ['Start', spec.Start],
      ['Measured by', spec['Measured by']],
      ['Terms', spec.Terms],
    ];
  return [
    ['Pricing', spec.Pricing],
    ['Setup', spec.Setup],
    ['Response', spec.Response],
    ['Ownership', spec.Ownership],
  ];
}

export default function ServiceSections({ disciplines }) {
  return (
    <div className="svc2 svc2--one">
      {disciplines.map((d, i) => {
        const cream = i % 2 === 1;
        return (
          <section
            key={d.id}
            id={d.id}
            className={`vt svc2__d svc2__d--${d.id}${cream ? ' svc2__d--cream panel-sec' : ''}`}
            aria-labelledby={`svc-${d.id}`}
          >
            <div className={`svc2__in${cream ? ' panel' : ''}`}>
              {d.image || d.phones || d.proof ? (
                <div className="svc2__band">
                  {d.proof ? (
                    React.createElement(PROOF[d.proof])
                  ) : d.phones ? (
                    <DevicePhones phones={d.phones} />
                  ) : (
                    <EvidenceBand image={d.image} />
                  )}
                </div>
              ) : null}

              <div className="svc2__head">
                <p className="svc2__kicker">{d.name}</p>
                <h2 className="svc2__name" id={`svc-${d.id}`}>
                  {HEADINGS[d.id] || d.name}
                </h2>
                <p className="svc2__promise">{PROMISES[d.id] || d.promise}</p>
              </div>

              <ul className="svc2__facts" aria-label={`${d.name}, the facts`}>
                {factsOf(d.id).map(([k, v]) => (
                  <li className="svc2__fact-i" key={k}>
                    <span className="svc2__fact-k">{k}</span>
                    <span className="svc2__fact-v">{v}</span>
                  </li>
                ))}
              </ul>

              <div className="svc2__call">
                <Link className="svc2__cta" to={CALL_HREF}>
                  {CALL_LABEL}
                </Link>
                {i === 0 ? <PromiseLine className="svc2__promise-line" /> : null}
              </div>

              {SUBSTANCE[d.id] ? (
                <Details id={`svc-${d.id}-details`}>
                  <SpecSheet rows={SUBSTANCE[d.id].spec} label={`${d.name}, the spec`} />
                  <HowItGoes steps={SUBSTANCE[d.id].steps} label={`${d.name}, how it goes`} />
                </Details>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}
