import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Shell from './Shell.jsx';
import { PageHead, Section, CallBand, CALL_HREF } from './parts.jsx';
import PricingCards from './PricingCards.jsx';
import BundleBuilder from './BundleBuilder.jsx';
import { FIGURES, money } from '../../content/pricing.js';
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

/* The `from` line under each label. DERIVED where there is a figure — Branding
   from `brandingBasic`, Websites from `website` — so the tab row cannot drift
   from the cards under it. Marketing and Automation have no figure and never
   will; they say what the card says. */
const TABS = [
  { id: 'branding', label: 'Branding', from: () => `from ${money(FIGURES.brandingBasic)}` },
  { id: 'websites', label: 'Websites', from: () => `from ${money(FIGURES.website)}` },
  { id: 'marketing', label: 'Marketing', from: () => 'on the call' },
  { id: 'automation', label: 'Automation', from: () => 'on the call' },
];

/* THE PILL SLIDES, AND IT IS A PROGRESSIVE ENHANCEMENT.

   The tabs are radio inputs and `:checked` siblings and they work with no
   JavaScript at all — that is a recorded decision and it does not change here.
   A pill that SLIDES needs to know how wide each label is, and label widths
   depend on the face that landed, so no `:checked` selector can place it.

   So: the row gets one `::before` pill positioned from two custom properties,
   and this effect measures the checked label and sets them. `data-slide` is
   what turns the pill on, and it is only ever set by this effect — with no
   JavaScript the attribute is absent, the pill is not drawn, and the per-label
   `:checked` background does the job it did before. One state or the other,
   never both.

   It re-measures on resize AND after the fonts land, because a label set in
   the fallback face is a different width and a pill placed against it is a
   pill in the wrong place for the first second of every cold load. */
function useSlidingPill(tabs) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const row = ref.current;
    if (!row) return undefined;

    const place = () => {
      const checked = row.parentElement.querySelector('.tabs__radio:checked');
      if (!checked) return;
      const label = row.querySelector(`[for="${checked.id}"]`);
      if (!label) return;
      const r = label.getBoundingClientRect();
      const rr = row.getBoundingClientRect();
      /* BOTH AXES. Placed on x alone the pill was pinned to the vertical centre
         of the row, which is correct while the row is one line and wrong the
         moment it wraps — at 390 the four tabs are two lines, so the pill sat
         between them and the active label stood on the bare track with asphalt
         text on surface-warm at 1.12:1. Caught by the contrast walk, not by
         looking at the desktop. */
      row.style.setProperty('--pill-x', `${Math.round(r.left - rr.left)}px`);
      row.style.setProperty('--pill-y', `${Math.round(r.top - rr.top)}px`);
      row.style.setProperty('--pill-w', `${Math.round(r.width)}px`);
      row.style.setProperty('--pill-h', `${Math.round(r.height)}px`);
      setReady(true);
    };

    place();
    const onChange = () => place();
    row.parentElement.addEventListener('change', onChange);
    window.addEventListener('resize', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    return () => {
      row.parentElement.removeEventListener('change', onChange);
      window.removeEventListener('resize', place);
    };
  }, [tabs]);

  return [ref, ready];
}

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
/* UNDER THE PANEL since 2026-09-21, by the user: the panel is the tab row and
   the ladder, and this line stands on the dark ground below it with its
   dark-ground values. One per tab that has one; `:has()` on the panel shows
   the line for the checked tab (pricing.css). */
function RouteLine({ what, tab }) {
  return (
    <p className="tiers__route" data-tab={tab}>
      {what} that is not on this list? <Link to={CALL_HREF}>Tell us what you need</Link>{' '}
      and we will price it.
    </p>
  );
}

export default function PricingPage() {
  const [pillRef, pillReady] = useSlidingPill(TABS);

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

          <div
            className="tabs__row"
            role="presentation"
            ref={pillRef}
            data-slide={pillReady ? 'true' : undefined}
          >
            {TABS.map((t) => (
              <label className="tabs__tab" htmlFor={`tab-${t.id}`} key={t.id}>
                {t.label}
                <span className="tabs__from">{t.from()}</span>
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
              </div>
            ))}
          </div>
        </div>

        <RouteLine what="Branding" tab="branding" />
        <RouteLine what="A website" tab="websites" />
      </Section>

      {/* The page's engagement device, 2026-09-21: the bundle builder. */}
      <BundleBuilder />

      <CallBand
        material="burst"
        heading="Not sure which one you need"
        note="Tell us what is going wrong and we will say which of these we would start with. Sometimes it is the cheapest one on this page."
      />
    </Shell>
  );
}
