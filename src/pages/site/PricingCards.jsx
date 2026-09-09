import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FIGURES, LADDER, CUSTOM, NEEDS, CUSTOM_TERMS, money } from '../../content/pricing.js';
import { CALL_HREF } from './parts.jsx';

/* THE PRICING LADDER — Advance, Basic, Custom, and the delta.

   ---- The delta is the mechanic ------------------------------------------

   The price difference between two tiers is a number a reader has to compute
   before it means anything. Pressing or hovering the Advance price highlights
   exactly the lines Advance has that Basic does not, and says what they cost
   together. Nothing else on the card moves.

   The caption's figure is DERIVED — `LADDER.branding.delta()` is
   449 minus 299 — and its count is derived too: it is the number of flagged
   lines plus the turnaround if that differs. Neither is typed, so neither can
   drift from the tiers above it.

   ---- Hover and touch are one state, not two ------------------------------

   `open` is React state, set by pointer enter and leave AND toggled by click.
   That is deliberate: a hover-only mechanic is invisible on a phone, and a
   click-only one feels dead under a cursor. The pointer handlers are gated in
   CSS terms by `@media (hover: hover)` on the AFFORDANCE — the cursor and the
   caption's hint — while the state itself is available to both, which is what
   BUILD-LAW's hover gating is protecting against: a sticky false hover on
   touch. Here a tap sets the same state a hover does and a second tap clears
   it, so nothing can stick. */

/* START HERE, not "Most chosen". The old marker was a claim about what other
   customers had bought, which nothing on this repo evidences — BUILD-LAW Truth,
   and it was flagged as unevidenced when it shipped. This one is a
   recommendation the agency is making in its own voice, which it is entitled
   to make, and it tells a reader what to DO rather than what to assume.

   IT ONLY APPEARS WHERE THERE IS A CHOICE. A tab with one priced tier has
   nothing to start ahead of, and a marker there points at the only door in the
   room. See `lead` in PricingCards below. */
function Marker() {
  return <p className="card__marker">Start here</p>;
}

/* THE GHOST ROWS. What Basic does not have, on Basic's own card.

   Three cards of different lengths is a comparison a reader has to do by
   scrolling, and the empty half of the shortest card is the part that says
   nothing. So Basic's gap is filled with the four lines Advance has and it
   does not — DERIVED, never typed: the delta-flagged features plus the
   turnaround, which is the same set the caption counts.

   They are the absent items, so they are drawn absent: steel-lift at 50%, and
   a hairline square instead of the filled yellow one, because a filled yellow
   square is the site's "this is here" mark and none of this is here.

   IN THE DELTA STATE THEY LIGHT WITH THE ADVANCE ROWS. That is the whole
   argument for putting them on the card: press the Advance price and the four
   things you are paying for light up on BOTH cards at once — present on one,
   absent on the other, same four lines, same colour, side by side. */
function ghostsFor(set, tier) {
  const lead = set.tiers.find((t) => t.id === set.lead);
  if (!lead || lead.id === tier.id) return [];
  const rows = lead.features.filter((f) => typeof f !== 'string' && f.delta).map((f) => f.t);
  if (lead.turnaroundDelta && lead.turnaround) rows.push(lead.turnaround);
  return rows;
}

function Ghosts({ rows, open }) {
  if (!rows.length) return null;
  return (
    <div className="card__ghosts" data-lit={open ? 'true' : 'false'}>
      <p className="card__ghost-h">Not in Basic</p>
      <ul className="card__rows card__rows--ghost">
        {rows.map((t) => (
          <li className="card__row card__row--ghost" key={t}>
            <span className="card__tick card__tick--ghost" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Row({ line, open }) {
  const text = typeof line === 'string' ? line : line.t;
  const delta = typeof line === 'string' ? false : !!line.delta;
  return (
    <li className={'card__row' + (delta ? ' card__row--delta' : '')} data-lit={delta && open ? 'true' : 'false'}>
      <span className="card__tick" aria-hidden="true" />
      {text}
    </li>
  );
}

function Tier({ tier, i, lead, marked, deltaAmount, open, setOpen, ghosts }) {
  const price = money(FIGURES[tier.figure]);
  const flagged = tier.features.filter((f) => typeof f !== 'string' && f.delta).length;
  const count = flagged + (tier.turnaroundDelta ? 1 : 0);
  const showsDelta = lead && count > 0 && deltaAmount;

  /* Only the lead card's price is interactive, and only when there is a
     difference to show. A control that does nothing is worse than no control. */
  const priceProps = showsDelta
    ? {
        className: 'card__price card__price--live',
        type: 'button',
        onClick: () => setOpen((v) => !v),
        onPointerEnter: (e) => e.pointerType === 'mouse' && setOpen(true),
        onPointerLeave: (e) => e.pointerType === 'mouse' && setOpen(false),
        'aria-expanded': open,
        'aria-label': `${price}. Show what the extra ${money(deltaAmount)} includes`,
      }
    : { className: 'card__price' };

  const Price = showsDelta ? 'button' : 'p';

  return (
    <li className={'card' + (lead ? ' card--lead' : '')} style={{ '--i': i }}>
      {marked ? <Marker /> : null}
      <h3 className="card__name">{tier.name}</h3>

      <Price {...priceProps}>{price}</Price>

      {showsDelta ? (
        <p className="card__caption" data-lit={open ? 'true' : 'false'}>
          {`${money(deltaAmount)} more gets you these ${count === 4 ? 'four' : count}`}
        </p>
      ) : null}

      {tier.turnaround ? (
        <p
          className="card__turn"
          data-lit={tier.turnaroundDelta && open ? 'true' : 'false'}
        >
          {tier.turnaround}
        </p>
      ) : null}

      <ul className="card__rows">
        {tier.features.map((f) => (
          <Row key={typeof f === 'string' ? f : f.t} line={f} open={open} />
        ))}
      </ul>

      <Ghosts rows={ghosts} open={open} />

      {/* ONE SOLID CALL IN THE PANEL, and it belongs to the pick. Every card in
          the ladder used to carry a yellow fill, which is three primaries in
          one frame saying three ways to do one thing. The lead keeps the fill;
          the others take the outline — a bone hairline and bone text, which is
          still a button and still 48px, and is legibly the second choice. */}
      <p className="card__foot">
        <Link className={'card__cta' + (lead ? '' : ' card__cta--line')} to={CALL_HREF}>
          Get a custom quote
        </Link>
        {lead ? (
          <Link className="card__ask" to={CALL_HREF}>
            Ask a question first
          </Link>
        ) : null}
      </p>
    </li>
  );
}

/* The Custom card. No price and no feature list — a quote line at the price
   size, what we need to know before we can give one, and one call. It is the
   same object as its neighbours and it says the thing they cannot: that the
   list is not the offer.

   THE THREE ROWS ARE RESERVED, NOT WRITTEN. `NEEDS` holds `null` for every
   line because the lines have never been supplied; see the note beside it in
   content/pricing.js. A pending row is visibly one, at the height a real line
   will occupy, so filling them in moves nothing. */
function CustomCard({ why, needs, i }) {
  return (
    <li className="card card--custom" style={{ '--i': i }}>
      <h3 className="card__name">{CUSTOM.name}</h3>
      <p className="card__price card__price--quote">{CUSTOM.quote}</p>
      {why ? <p className="card__why">{why}</p> : null}

      <p className="card__need-h">{CUSTOM.needHeading}</p>
      <ul className="card__rows card__rows--need">
        {needs.map((line, i) => (
          <li
            className="card__row"
            data-pending={line ? 'false' : 'true'}
            key={line || `pending-${i}`}
          >
            <span className="card__tick" aria-hidden="true" />
            {line || <span className="card__pending">Line pending</span>}
          </li>
        ))}
      </ul>

      {/* The card's one commitment, under the three questions. */}
      <p className="card__terms">{CUSTOM_TERMS}</p>

      <p className="card__foot">
        <Link className="card__ask card__ask--only" to={CALL_HREF}>
          Ask a question first
        </Link>
      </p>
    </li>
  );
}

export default function PricingCards({ discipline }) {
  const set = LADDER[discipline];
  const [open, setOpen] = useState(false);
  if (!set) return null;

  const deltaAmount = typeof set.delta === 'function' ? set.delta() : null;
  const count = set.tiers.length + 1;
  /* A MARKER NEEDS SOMETHING TO BE PICKED OVER. Websites names a lead because
     it has one priced tier and that tier is the offer; marking it says "start
     here" in a room with one door. The marker is earned by a CHOICE, so it
     needs two priced tiers, not a `lead` key. */
  const marked = set.tiers.length > 1 ? set.lead : null;
  /* `lead` and `marked` are two different things and this is where they split.
     LEAD is the panel's primary card: the raised surface, the one solid call,
     and the second "ask" link beside it. Every panel with a priced tier has
     one, including Websites, or the panel would carry no primary at all.
     MARKED is the recommendation, and it needs a choice to be a recommendation
     — see above. On Websites the single tier is the lead and is not marked. */

  return (
    <ul className={`cards cards--${count}`}>
      {set.tiers.map((tier, i) => (
        <Tier
          key={tier.id}
          i={i}
          tier={tier}
          lead={set.lead === tier.id}
          marked={marked === tier.id}
          deltaAmount={deltaAmount}
          open={open}
          setOpen={setOpen}
          ghosts={ghostsFor(set, tier)}
        />
      ))}
      <CustomCard why={set.why} needs={NEEDS[discipline] || [null, null, null]} i={set.tiers.length} />
    </ul>
  );
}
