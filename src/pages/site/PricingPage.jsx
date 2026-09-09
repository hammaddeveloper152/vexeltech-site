import React from 'react';
import { Link } from 'react-router-dom';
import Shell from './Shell.jsx';
import { PageHead, Section, CallBand, CALL_HREF } from './parts.jsx';
import PricingCards from './PricingCards.jsx';
/* The lit ladder. Loaded after pages.css so it wins on ground and card. */
import '../../styles/pricing.css';

/* THE PRICING PAGE, BUILT WITH THE FIGURES BLANK.

   Every number on this page comes from `src/content/pricing.js` and there is
   no other source for one. Grep this file for a digit: the only ones are in
   the feature strings the sheet itself wrote ("up to 6 pages", "30 days"),
   and those are scope, not price.

   WHAT A NULL FIGURE LOOKS LIKE. Where the price would be, a dashed hairline
   slot the width of the card carries the words FIGURE PENDING, at the same
   height the figure occupies, so nothing moved when the four numbers landed
   and nothing will move when a fifth does. The bundle's saving line is absent
   entirely rather than half written, because it is derived and stating a
   saving without its parts would be a claim about money.

   THE MARKETING AND AUTOMATION SECTIONS HAVE NO FIGURE AND NEVER WILL.
   The sheet scopes both individually and ends each category with a quote,
   so their cards carry a quote line where the others carry a price.

   ---- FOUR TABS, NOT A 5,000px SCROLL ------------------------------------

   The page ran 6,123px at 1280 and 8,060px at 390 — 7.7 and 9.5 screens — to
   show four disciplines and eight cards. It is now four tabs and one panel at
   a time.

   THE TABS ARE RADIO INPUTS AND `:checked` SIBLINGS, so they work with no
   JavaScript at all. That is not only a robustness choice: a radio group is
   natively arrow-key operable, which IS the correct keyboard interaction for
   a tab set, whereas the ARIA `role="tablist"` pattern needs JS to manage a
   roving tabindex. The version that needs no script is also the more
   accessible one.

   ALL FOUR PANELS STAY IN THE DOM. Only visibility switches, so the whole
   offer is in the document for a crawler and for a reader with CSS off, and
   nothing is fetched or built on selection.

   `defaultChecked`, NOT `checked`. A `checked` prop makes the input
   controlled, React re-asserts it on every render, and the tabs stop
   responding to clicks with no error anywhere. Uncontrolled is what a CSS
   tab set needs.

   Reachability was checked before this was built: nothing anywhere links to
   `/pricing#anything`, and the JSON-LD offer URLs point at `/services`, so
   collapsing these sections costs no inbound link. */

const TABS = [
  { id: 'branding', label: 'Branding' },
  { id: 'websites', label: 'Websites' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'automation', label: 'Automation' },
];

/* THE TIER COMPONENTS ARE GONE, 2026-09-10.

   `Figure`, `Features` and `TierCalls` rendered the old tier cards and nothing
   called them after the ladder rebuild: the panel below renders
   `<PricingCards>`. They were dead the moment `PricingCards.jsx` landed, and
   dead code that still reads correctly is worse than none — the `.tier*`
   stylesheet stayed alive for the same reason and outlived the page it
   described by a whole rebuild. Both went in the same pass.

   The prose above about null figures still holds; it is now
   `content/pricing.js` and `PricingCards.jsx` that carry it. */

/* The route line. "Something else" is a door, not a product, and a card made
   it a peer of a priced tier. See `.tiers__route` in pages.css. */
function RouteLine({ what }) {
  return (
    <p className="tiers__route">
      {what} that is not on this list? <Link to={CALL_HREF}>Tell us what you need</Link>{' '}
      and we will price it.
    </p>
  );
}

export default function PricingPage() {
  return (
    <Shell
      title="Pricing | VexelTech"
      description="Branding and website packages, marketing and automation scoped to the job."
    >
      <PageHead
        title="Pricing"
        lead="Branding and websites have a price on them. Marketing and automation depend on what they have to do, so those get a number once we have talked."
      />

      <Section labelledBy="pricing-tabs">
        <h2 className="skip-h" id="pricing-tabs">
          Packages by discipline
        </h2>

        <div className="tabs">
          {/* The inputs come FIRST and are siblings of both the label row and
              the panels, because `:checked ~` only reaches forward. */}
          {TABS.map((t, i) => (
            <input
              key={t.id}
              type="radio"
              name="pricing-tab"
              id={`tab-${t.id}`}
              className="tabs__radio"
              defaultChecked={i === 0}
            />
          ))}

          <div className="tabs__row" role="presentation">
            {TABS.map((t) => (
              <label className="tabs__tab" htmlFor={`tab-${t.id}`} key={t.id}>
                {t.label}
              </label>
            ))}
          </div>

          <div className="tabs__panels">
            {/* One ladder per discipline: Advance, Basic, Custom where three
                exist, the real tier plus Custom where they do not. The delta
                mechanic lives on the lead card's price. See PricingCards.jsx
                and the LADDER export in content/pricing.js. */}
            {TABS.map((t) => (
              <div className="tabs__panel" data-tab={t.id} key={t.id}>
                <PricingCards discipline={t.id} />
                {t.id === 'branding' || t.id === 'websites' ? (
                  <RouteLine what={t.id === 'branding' ? 'Branding' : 'A website'} />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CallBand
        heading="Not sure which one you need"
        note="Tell us what is going wrong and we will say which of these we would start with. Sometimes it is the cheapest one on this page."
      />
    </Shell>
  );
}
