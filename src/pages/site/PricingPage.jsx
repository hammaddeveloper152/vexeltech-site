import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Brush from '../../components/site/Brush.jsx';
import Shell from './Shell.jsx';
import { PromiseLine } from './parts.jsx';
import Faq from '../../components/home/Faq.jsx';
import { DISCIPLINES } from '../../content/services.js';
import { BRANDING, BUNDLE, FIGURES, WEBSITES, money } from '../../content/pricing.js';
import '../../styles/pricegrid.css';
import { setFaqLd, setLd, ORIGIN } from './head.js';

/* THE PRICING PAGE, REBUILT 2026-09-24 ON THE MELIUS PATTERN (the founder),
   after the quiet pass, so it inherits its type and panel rules.

     1. The head on the base: eyebrow, headline, one line
     2. The grid: a cream panel of four columns, the Websites column picked
     3. What's in every project: deleted in final28, its facts on the cards
     4. Not sure? The Plan Builder as built, with a visible heading
     5. Questions: the FAQ accordion with four pricing questions
     6. The burst call, then the form from the Shell, as built

   EVERY STRING IS THE FOUNDER'S: "PRICING 2026-09-24" in VEXELTECH-COPY.md in
   the design repo. The six items and the calls in each column are /services'
   own (src/content/services.js), and each column's line is the first sentence
   of that discipline's /services promise, unchanged. The prices are FIGURES,
   so a price change still happens in one place.

   THE HIGHLIGHTED WORD MOVED WITH THE HEADLINE. The quiet pass gave this page
   "need" in "What do you need?"; the founder's new headline has "needs", and
   the page keeps its one highlighted word there rather than losing it.

   THE WEBSITES COLUMN is the recommended one: a 2px machine yellow top edge,
   the "Most picked" chip, and the yellow primary button - the founder's
   three, and the only yellow in the grid. The other three columns' buttons
   are asphalt with a cream label. */

const GRID = {
  branding: {
    price: `${money(FIGURES.brandingBasic)} to ${money(FIGURES.brandingAdvance)}`,
    sub: 'one time',
  },
  websites: { price: money(FIGURES.website), sub: 'one time, four business days', picked: true },
  marketing: { price: 'On the call', sub: 'monthly, no contract' },
  automation: { price: 'Per workflow', sub: 'one time per workflow' },
};

/* THE TIER LISTS IN THE GRID, 2026-10-01 (the structure pass): the branding
   tiers and the website's features from pricing.js, saved until now and not
   rendered, shown in their columns under What you get, each under a label
   that names the tier, its price and its turnaround (VEXELTECH-COPY.md
   V3.1, Pricing, Branding and The website). Figures are tokens. */
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const TIERS = {
  branding: BRANDING.map((t) => ({
    id: t.id,
    label: `${t.name}, ${money(FIGURES[t.figure])}, ${t.turnaround}`,
    items: t.features,
  })),
  websites: WEBSITES.map((t) => ({
    id: t.id,
    label: `The website, ${money(FIGURES[t.figure])}, ${t.turnaround}`,
    items: t.features,
    note: t.bigger ? `Bigger builds: ${t.bigger}` : null,
  })),
};

/* THE FULL LIST, 2026-10-02 (the founder's five fixes): every column shows
   exactly its six What you get lines; the detail is behind a "Full list"
   toggle under them. Branding: the Basic and Advance tiers. Websites: the
   website's features and bigger builds. Marketing and Automation: their six
   lines from services.js, each item's name and line. */
const DETAIL = {
  ...TIERS,
  marketing: [{ id: 'marketing-lines', label: null, rows: DISCIPLINES[2].cards }],
  automation: [{ id: 'automation-lines', label: null, rows: DISCIPLINES[3].cards }],
};

const COLUMNS = DISCIPLINES.map((d) => ({
  id: d.id,
  name: d.name,
  /* COPY V2, 2026-10-01: the grid gives no line under a column's name, so
     the row is left empty (it is a row of the shared subgrid, so the
     element stays and the buttons stay aligned). */
  line: null,
  items: d.cards.map((c) => c.title),
  call: d.call.label,
  /* The button follows its label (2026-09-24): the primary is yellow, the
     secondary the outline on cream. */
  primary: d.call.primary,
  ...GRID[d.id],
}));

/* The founder's table, verbatim, in the grid's column order. Since final28
   (2026-10-07) it renders as each card's terms (FACTS), not as a table. */
/* COPY V2, 2026-10-01 (VEXELTECH-COPY.md, Pricing, What's in every project). */
/* COPY V3, 2026-10-01 (VEXELTECH-COPY.md, Pricing, What's in every
   project). */
const ROWS = [
  ['Turnaround', ['1 to 2 business days', '4 business days', 'live in week one', 'per workflow']],
  ['Revisions', ['unlimited before files', 'unlimited before launch', 'ongoing', 'ongoing']],
  ['Ownership', ['files', 'domain, hosting, code', 'ad accounts and data', 'tools and access']],
  ['After launch', ['30 days', '30 days', 'monthly', 'monthly']],
  ['Payment', ['on approval', 'on approval', 'monthly', 'on approval']],
];

/* Each column's terms, less any the card already states: the website's
   turnaround is in its sub line, and automation's is its price. */
const ON_CARD = { websites: ['Turnaround'], automation: ['Turnaround'] };
const FACTS = Object.fromEntries(
  DISCIPLINES.map((d, i) => [
    d.id,
    ROWS.filter(([term]) => !(ON_CARD[d.id] || []).includes(term)).map(([term, values]) => [term, values[i]]),
  ])
);

/* COPY V2, 2026-10-01 (VEXELTECH-COPY.md, Pricing, Questions). The $700
   and the $299 are the tokens; the $15 is a domain's cost, not a price of
   ours. */
/* COPY V3.5, 2026-10-05 (VEXELTECH-COPY.md, Pricing, Questions): seven,
   in the founder's order. The $700 and the $299 are the tokens. */
/* FINAL28 (2026-10-07, the founder): four. The deposit, the logo-only and
   the marketing questions are deleted from the page and so from the
   FAQPage data, which is built from this list. */
const QUESTIONS = [
  {
    id: 'cost',
    q: 'How much does a website cost?',
    a: `${money(FIGURES.website)}, flat. That covers six pages, a build in four business days from your content, and thirty days of maintenance after launch. The only extra is a domain if you don't own one, about $15 a year, registered in your name.`,
  },
  {
    id: 'need',
    q: 'What do you need from me?',
    a: 'The services you sell and where you sell them, photos of real work, your logo if you have one, and the things you find yourself saying to customers on the phone. That last one writes half the site.',
  },
  {
    id: 'call',
    q: 'What does "on the call" mean?',
    a: 'Marketing and automation depend on your ad budget, your area and the tools you already use, so a price on a page would be a guess. We take fifteen minutes to understand it, then put a number in writing before anything starts.',
  },
  {
    id: 'after',
    q: 'What happens after the thirty days?',
    a: 'Your site keeps running; it is yours. When you need a change, call us. Small changes are priced small, and there is no retainer unless you ask for one.',
  },
];

export default function PricingPage() {
  const [open, setOpen] = useState(null);
  /* The questions as FAQPage data (head.js, 2026-10-05). */
  useEffect(() => setFaqLd(QUESTIONS), []);
  /* THE PRICES IN STRUCTURED DATA, ON /pricing ONLY (FINAL40, addendum 3,
     the founder): the price range left home's ProfessionalService, and
     the published prices stand here as an offer catalog on the same
     entity (`#service`). Every figure and name is the price sheet's
     (content/pricing.js). */
  useEffect(
    () =>
      setLd('prices', {
        '@type': 'ProfessionalService',
        '@id': `${ORIGIN}/#service`,
        name: 'VexelTech Solutions',
        url: `${ORIGIN}/pricing`,
        priceRange: `${money(FIGURES.brandingBasic)} to ${money(FIGURES.bundle)}`,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Website design and branding prices',
          itemListElement: [
            [`Branding, ${BRANDING[0].name}`, FIGURES.brandingBasic],
            [`Branding, ${BRANDING[1].name}`, FIGURES.brandingAdvance],
            [WEBSITES[0].name, FIGURES.website],
            [BUNDLE.name, FIGURES.bundle],
          ].map(([name, price]) => ({
            '@type': 'Offer',
            name,
            price: String(price),
            priceCurrency: 'USD',
            url: `${ORIGIN}/pricing`,
          })),
        },
      }),
    []
  );
  return (
    <Shell
      title={`Website design pricing: ${money(FIGURES.website)} flat rate | VexelTech`}
      path="/pricing"
      /* The closing section, "Ready when you are." and the form, since
         final34 (2026-10-08, the founder; no in-page form from the
         storytelling pass until then). */
      description={`How much does a website cost? ${money(FIGURES.website)} flat for six pages in four business days. Branding ${money(FIGURES.brandingBasic)} or ${money(FIGURES.brandingAdvance)}. Marketing and automation by quote.`}
    >
      {/* 1. THE HEAD. */}
      <header className="vt pr-head">
        <div className="pr__in">
          <p className="pr-head__eyebrow lbl">Pricing</p>
          <h1 className="pr-head__h" id="pg-h">
            {/* COPY V3, 2026-10-01. The page's one highlighted word moved
                from "written" (not in V3) to "Flat-rate". */}
            <Brush className="brush--hl" thickness="fit" angle={-2} at="52%">Flat-rate</Brush> website
            design and branding. Marketing and automation by quote.
          </h1>
          {/* COPY V4, 2026-10-06. The figures it named are on the grid below. */}
          <p className="pr-head__lead">
            Two prices you can plan around. Everything else is quoted in writing before any work begins.
          </p>
        </div>
      </header>

      {/* 2. THE GRID. A list of four offers; each column is a subgrid of the
             same eight rows, so the buttons line up whatever wraps above. */}
      <section className="vt pr-grid panel-sec" aria-labelledby="pr-grid-h">
        <div className="panel pr-grid__panel">
          <h2 className="skip-h" id="pr-grid-h">
            The four services and their prices
          </h2>
          <ul className="pr-grid__cols">
            {COLUMNS.map((c) => (
              <li className={`pr-col pr-col--${c.id}`} key={c.id} data-picked={c.picked ? 'true' : 'false'}>
                {/* The white plane the column lifts onto (the Melius glow).
                    Out of flow, so it takes no row of the subgrid. */}
                <span className="pr-col__glow" aria-hidden="true" />
                <span className="pr-col__bg" aria-hidden="true" />
                <p className="pr-col__tag-row">
                  {/* COPY V3, 2026-10-01: "Flat rate" (V2's "Flat price"
                      replaced "Most picked", a claim nothing evidenced). */}
                  {c.picked ? <span className="pr-col__tag">Flat rate</span> : null}
                </p>
                <h3 className="pr-col__name">{c.name}</h3>
                <p className="pr-col__line">{c.line}</p>
                {/* The Websites figure's brush stroke came off (the storytelling pass, 2026-10-01: the swash is home's "Yet." and one word per page, nothing else). */}
                <p className="pr-col__price">
                  {c.price}
                </p>
                <p className="pr-col__sub">{c.sub}</p>
                <div className="pr-col__get">
                  <p className="pr-col__label lbl">What you get</p>
                  <ul className="pr-col__list">
                    {c.items.map((item) => (
                      <li className="pr-col__item" key={item}>
                        <span className="lmark" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <dl className="pr-col__facts">
                    {FACTS[c.id].map(([term, value]) => (
                      <div className="pr-col__fact" key={term}>
                        <dt className="lbl">{term}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  {/* THE TOGGLE: closed by default, one open at a time. The
                      panel is laid out or `hidden`, and its contents rise in
                      over 200ms on opacity and transform (BUILD-LAW Motion
                      forbids animating height; the FAQ's technique). */}
                  <button
                    type="button"
                    className="pr-col__more"
                    aria-expanded={open === c.id}
                    aria-controls={`pr-full-${c.id}`}
                    onClick={() => setOpen((o) => (o === c.id ? null : c.id))}
                  >
                    Full list
                    <span className="pr-col__more-mark" aria-hidden="true">
                      +
                    </span>
                  </button>
                  <div className="pr-col__full" id={`pr-full-${c.id}`} hidden={open !== c.id}>
                    {(DETAIL[c.id] || []).map((t) => (
                      <div className="pr-col__tier" key={t.id}>
                        {t.label ? <p className="pr-col__label lbl">{cap(t.label)}</p> : null}
                        <ul className="pr-col__list">
                          {t.items
                            ? t.items.map((item) => (
                                <li className="pr-col__item" key={item}>
                                  <span className="lmark" aria-hidden="true" />
                                  {item}
                                </li>
                              ))
                            : t.rows.map(({ title, line }) => (
                                <li className="pr-col__item pr-col__item--d" key={title}>
                                  <span className="lmark" aria-hidden="true" />
                                  <span>
                                    <span className="pr-col__item-t">{title}</span>
                                    <span className="pr-col__item-d">{line}</span>
                                  </span>
                                </li>
                              ))}
                        </ul>
                        {t.note ? <p className="pr-col__note">{t.note}</p> : null}
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  className={`pr-col__btn${c.primary ? ' pr-col__btn--primary' : ''}`}
                  to="/contact-us"
                >
                  {c.call}
                  {/* The labels repeat across columns, so each names its
                      service for a screen reader listing the page's links. */}
                  <span className="skip-h">, {c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          {/* THE BUNDLE, its own row under the grid (the five fixes,
              2026-10-02): name, price, line and call. The figure is the
              token; the line is derived (pricing.js). */}
          <div className="pr-bundle">
            {/* The bundle's face and glow (FINAL40, addendum 4), lit on
                hover and focus as the four cards are; drawn outside the
                row's box, so the row does not move at rest. */}
            <span className="pr-bundle__glow" aria-hidden="true" />
            <span className="pr-bundle__bg" aria-hidden="true" />
            <h3 className="pr-bundle__name">{BUNDLE.name}</h3>
            <p className="pr-bundle__price">{money(FIGURES.bundle)}</p>
            <p className="pr-bundle__line">{BUNDLE.line()}</p>
            <Link className="pr-col__btn pr-bundle__btn" to="/contact-us">
              Get a custom quote
              <span className="skip-h">, {BUNDLE.name}</span>
            </Link>
            <PromiseLine className="pr-bundle__promise" />
          </div>
          {/* THE FOOTNOTE, COPY V3, 2026-10-01: under the grid, in the panel. */}
          <p className="pr-grid__note">
            Marketing scales with ad spend and service area. Automation scales with the number of
            workflows and the tools they connect.
          </p>
          {/* CURRENCY AND TAX (the launch gate, 2026-10-07, the founder). */}
          <p className="pr-grid__note">All prices are in US dollars and exclude tax where applicable.</p>
        </div>
      </section>

      {/* 3. WHAT'S IN EVERY PROJECT came off (final28, 2026-10-07, the
             founder): its facts are on the price cards above. */}

      {/* THE PLAN BUILDER AND THE CLOSING CALL CAME OFF, 2026-10-01: COPY
          V3 gives them no lines (DESIGN.md, COPY V3). */}

      {/* 4. QUESTIONS. The accordion, V3.5's seven. Then the form from the
             Shell. */}
      <Faq items={QUESTIONS} id="pr-faq" heading="Questions about website pricing" />
    </Shell>
  );
}
