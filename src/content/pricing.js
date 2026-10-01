/* THE PRICING SHEET, AS DATA. Every figure is a token, and they are all here.

   ======================================================================
   TO CHANGE A PRICE: change it in FIGURES below. Nothing else has to move.
   ======================================================================

   ---- THE CONFLICT IS SETTLED, 2026-09-08, BY THE USER -----------------

   It was: content answer 7.1 said "700$ for a website which will be custom",
   the pricing sheet said Custom Website $999 and Template-Based $699, and
   $700 was neither figure. The build stopped and wrote nothing, per
   BUILD-LAW.md Conflicts.

   THE DECISION: **$700 for a website, ONE TIER.** FAQ 7.1 was right and the
   sheet's two-tier split is superseded. Template-Based at $699 and Custom at
   $999 collapse into a single website product at $700.

   THE SURVIVING TIER KEEPS THE CUSTOM FEATURE LIST, not the template one,
   and that is the user's instruction rather than a build choice: a single
   $700 product describing itself as "template based, up to 5 pages" would
   undersell what is actually being sold. So the one website tier is custom
   design up to 6 pages, custom UI and UX, the contact form, CTA integration,
   social icons, the payment gateway, a custom backend, SEO friendly content
   and 30 days of maintenance. The template tier is deleted outright rather
   than kept as a cheaper option, because there is no longer a cheaper option.

   Branding is unchanged and is the sheet's: Basic $299, Advance $449.

   ---- THE BUNDLE IS $999, GIVEN 2026-09-08 -----------------------------

   The sheet priced it at $1,299 and justified it as $999 + $449 = $1,448
   less $149. **That arithmetic did not survive the price decision**, and it
   failed in a direction worth naming: with the website at $700 the parts
   come to $1,149, so $1,299 would have made the "bundle" DEARER than buying
   the two separately. A saving that has gone negative is not a stale number,
   it is a false claim.

   At $999 the arithmetic works again: $700 + $449 = $1,149, less $999, a
   **$150 saving**. Every one of those four numbers is derived by
   `bundleSaving()` from the tokens below, so none of them can drift.

   THE LAST FIGURE PENDING SLOT ON THE SITE CLOSES WITH THIS. Nothing on the
   page is waiting on a price any more. */

export const FIGURES = {
  brandingBasic: 299, // the sheet, unchanged
  brandingAdvance: 449, // the sheet, unchanged
  website: 700, // the user, 2026-09-08. One tier. Supersedes 699 and 999
  bundle: 999, // the user, 2026-09-08. Saving $150 against $1,149 of parts
};

/* US dollars, the sheet's own currency, with a thousands separator so 1299
   reads as $1,299 the way the sheet writes it. */
export function money(n) {
  if (n === null || n === undefined) return null;
  return `$${n.toLocaleString('en-US')}`;
}

/* The bundle line, entirely derived. Null while any part is missing. */
export function bundleSaving() {
  const { website, brandingAdvance, bundle } = FIGURES;
  if (website === null || brandingAdvance === null || bundle === null) return null;
  const separately = website + brandingAdvance;
  return {
    separately,
    saving: separately - bundle,
    parts: [website, brandingAdvance],
  };
}

/* ---- The form's budget bands ------------------------------------------

   UNBLOCKED BY THE PRICE DECISION, 2026-09-08. Content answer 9.1 asked for
   a budget field and never said what the bands were; they stayed placeholder
   because bands are price data and the price was in conflict.

   Three bands, and every published price falls in one:

     Up to $300      branding Basic, $299
     $300 to $700    branding Advance, $449, and a website, $700
     $700 or more    a website with branding, and the quoted work

   THE TOP BAND IS OPEN-ENDED AT THE HIGHEST PUBLISHED PRICE, NOT ABOVE IT.
   That is the constraint the user set and it is worth stating plainly: there
   is no "$1,000 to $2,500" here, because nothing is sold at those numbers.
   $700 is the largest figure this business publishes, so the top band starts
   there and says "or more" rather than naming a ceiling nobody quoted. What
   lives above it is real but unpriced — the bundle has no figure, and
   marketing and automation are quoted per job — so an open band is the
   honest shape rather than a vague one.

   The boundaries are ROUNDED, deliberately. $299 reads as $300 to somebody
   estimating their own budget, and a band edge at $299 would be pricing
   dressed as a question. A reader picking a band is telling you roughly what
   they have, not agreeing a number.

   Derived from FIGURES rather than typed beside them, so a price change
   cannot leave a band behind. If any figure is null the bands are null and
   the field falls back to its placeholder state. */

export function budgetBands() {
  const { brandingBasic, website } = FIGURES;
  if (brandingBasic === null || website === null) return null;
  /* Round the low edge up to the nearest 100; the top edge is the highest
     published figure exactly, because that one is a real price. */
  const low = Math.ceil(brandingBasic / 100) * 100;
  return [`Up to ${money(low)}`, `${money(low)} to ${money(website)}`, `${money(website)} or more`];
}

/* ---- The tiers ---------------------------------------------------------

   Feature lists are the sheet's, in the sheet's order.

   TWO EDITS, BOTH FORCED BY BUILD-LAW.md AND BOTH RECORDED:

   1. THE EN DASHES ARE GONE. The sheet writes "Custom Logo Design – 5
      concepts", "Custom website design – up to 6 pages" and so on. BUILD-LAW
      **Markup** bans en and em dashes in shipped output with one exception,
      a verbatim customer quote, and a feature list is not one. Each is a
      comma. Nothing else about those lines changed.

   2. SENTENCE CASE. The sheet Title Cases every feature. DESIGN.md's
      register sets case at the element, and a list item is body copy, so
      Title Case here would be a second case system inside one page. The
      words are the sheet's; only the capitals moved.

   Neither edit changes what is offered. Where a phrase is the sheet's own
   product name it is left alone: "Contact Us form integration" keeps its
   capitals because that is the name of a form. */

export const BRANDING = [
  {
    id: 'branding-basic',
    name: 'Basic',
    figure: 'brandingBasic',
    /* COPY V2, 2026-10-01 (VEXELTECH-COPY.md, Pricing, Branding tiers). */
    turnaround: 'two business days',
    features: [
      'Logo design, five concepts',
      'Brand guideline',
      'Stationery: card, letterhead, envelope, favicon, email signature',
      'Logo sizes for social',
      'Unlimited revisions before files are released',
    ],
  },
  {
    id: 'branding-advance',
    name: 'Advance',
    figure: 'brandingAdvance',
    turnaround: 'one business day',
    features: [
      'Logo design, eight concepts',
      'Colour variations of the mark',
      'Social kit: banners and cover images',
      'Brand guideline',
      'Stationery: card, letterhead, envelope, favicon, email signature',
      'Unlimited revisions before files are released',
    ],
  },
];

/* ONE tier. The template tier was deleted with the two-tier split. */
export const WEBSITES = [
  {
    id: 'website',
    name: 'A website',
    figure: 'website',
    /* COPY V2, 2026-10-01 (VEXELTECH-COPY.md, Pricing, The website): the
       $700 site defined once. */
    turnaround: 'four business days',
    features: [
      'Up to six pages, designed for your business',
      'Built fast, built to last, nothing to renew',
      'Mobile first, under two seconds to load on a phone',
      'Quote and contact forms to your inbox, click to call, booking link',
      'Search set up: titles, descriptions, sitemap, Google Business Profile connected',
      'Live on your own domain, in your name',
      'Thirty days of changes and maintenance',
    ],
    bigger: 'Stores, portals, custom backends and apps are priced on the call.',
  },
];

/* COPY V2, 2026-10-01 (VEXELTECH-COPY.md, Pricing, Marketing and
   automation columns). */
export const MARKETING_LINE =
  'Priced on the call, month to month. Google ads, Meta ads, SEO and AI search, tracking, social content.';
export const AUTOMATIONS = {
  note: 'Priced per workflow. Missed call text back, quotes, invoices, booking, AI agents.',
};

export const BUNDLE = {
  id: 'all-in-one',
  name: 'Website and branding',
  figure: 'bundle',
  /* The sheet describes the bundle as the two named tiers, so it lists their
     contents rather than a third feature set. Referencing them keeps one
     copy of each list: change a tier above and the bundle follows. */
  includes: [
    { label: 'The website', from: WEBSITES[0] },
    { label: 'Branding, advance', from: BRANDING[1] },
  ],
  /* COPY V2, 2026-10-01: the $150 is derived (bundleSaving). */
  line: () => {
    const b = bundleSaving();
    return b ? `The website and Advance branding together, ${money(b.saving)} less than separately.` : null;
  },
};

/* ==========================================================================
   THE LADDER, 2026-09-09. Three cards per discipline where three exist.

   Every line below is drawn from the tiers already in this file. Nothing here
   is a new feature, a new price or a new claim — the lists are CUT and
   ORDERED, the turnaround is lifted out of the list into its own figure, and
   the lines Advance has that Basic lacks are flagged so the card can show what
   the difference buys.

   ---- TWO PLACES WHERE THE BRIEF ASKED FOR SOMETHING THIS FILE CANNOT GIVE

   1. WEBSITES HAS ONE TIER, NOT THREE. The user settled it directly on
      2026-09-08: "$700 for a website, ONE tier", superseding the sheet's
      Template-Based $699 / Custom $999 split. Building a Basic and an Advance
      website would mean inventing two prices and two feature sets, which is
      the one thing BUILD-LAW Truth forbids outright. Websites gets its real
      tier and a Custom card.

   2. "MOST CHOSEN" IS A CLAIM ABOUT CUSTOMERS. It is carried because the
      founder supplied it and BUILD-LAW makes the user the only source — but
      it asserts what buyers do, it is published, and nothing in this repo
      evidences it. Flagged rather than quietly shipped.

   `delta: true` marks a line Advance has and Basic does not. The turnaround
   figure carries the same flag, which is what makes the caption's count of
   four correct: three more concepts, a day instead of two, colour variations,
   the social kit. */

export const CUSTOM = {
  id: 'custom',
  name: 'Custom',
  quote: 'Priced on the call',
  needHeading: 'What we need to know:',
};

/* WHAT THE CUSTOM CARD ASKS FOR, PER DISCIPLINE — AND THE LINES ARE NOT HERE.

   The card's structure is built: a heading, three hairline rows, above the
   link. The three rows per discipline have never been supplied. They were
   asked for as "per discipline as specified earlier" and there is no earlier —
   not in this file, not in DESIGN.md, not in any instruction on this repo.

   BUILD-LAW Truth: the only source is the user, and nothing about VexelTech is
   written into a file unless the user said it. Three questions an agency asks
   before it can price a job are a claim about how this agency scopes work, so
   they are not something a build can fill in from what a sensible agency would
   ask. `null` is the honest value and the card renders a visible reservation
   for each one — the same treatment the figures had while they were blank, and
   for the same reason.

   SUPPLIED BY THE FOUNDER, 2026-09-10. The twelve lines below are verbatim.
   The card's pending rows are gone and nothing else moved, which is what the
   reservation was built to do. */
/* COPY V2, 2026-10-01 (VEXELTECH-COPY.md, Pricing, Custom card). */
export const NEEDS = {
  branding: [
    "Your trade and who you're up against",
    'How many places the mark has to live',
    'Anything that exists and has to stay',
  ],
  websites: [
    'How many pages and what each one is for',
    'What it connects to: booking, payments, CRM',
    'Where your visitors come from',
  ],
  marketing: [
    'Your market and your competitors',
    'The monthly budget range',
    "What you've tried and what it returned",
  ],
  automation: [
    'The tools you already use',
    'The job that eats the most hours a week',
    'How many a day it has to handle',
  ],
};

/* The line under the intake rows. Founder-supplied, and it is the one thing on
   the Custom card that is a commitment rather than a question. */
export const CUSTOM_TERMS =
  'Every custom job is priced on the call and in writing before any work starts.';

/* COPY V2, 2026-10-01: the ladder reads the tiers above rather than
   carrying its own cut of them, so the $700 site and the two branding tiers
   are each written once. */
export const LADDER = {
  branding: {
    label: 'Branding',
    lead: 'branding-advance',
    /* 449 - 299, derived. Never typed. */
    delta: () => FIGURES.brandingAdvance - FIGURES.brandingBasic,
    tiers: BRANDING,
  },
  websites: {
    label: 'Websites',
    lead: 'website',
    tiers: WEBSITES,
  },
  marketing: {
    label: 'Marketing',
    tiers: [],
    why: MARKETING_LINE,
  },
  automation: {
    label: 'Automation',
    tiers: [],
    why: AUTOMATIONS.note,
  },
};
