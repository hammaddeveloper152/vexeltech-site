import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from '@phosphor-icons/react';
import Shell from './Shell.jsx';
import { CallBand } from './parts.jsx';
import PlanBuilder from './PlanBuilder.jsx';
import Faq from '../../components/home/Faq.jsx';
import { DISCIPLINES } from '../../content/services.js';
import { FIGURES, money } from '../../content/pricing.js';
import '../../styles/pricegrid.css';

/* THE PRICING PAGE, REBUILT 2026-09-24 ON THE MELIUS PATTERN (the founder),
   after the quiet pass, so it inherits its type and panel rules.

     1. The head on the base: eyebrow, headline, one line
     2. The grid: a cream panel of four columns, the Websites column picked
     3. What's in every project: a comparison table on the base
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

const firstSentence = (text) => {
  const at = text.indexOf('. ');
  return at < 0 ? text : text.slice(0, at + 1);
};

const GRID = {
  branding: {
    price: `${money(FIGURES.brandingBasic)} to ${money(FIGURES.brandingAdvance)}`,
    sub: 'one time',
  },
  websites: { price: money(FIGURES.website), sub: 'one time, four business days', picked: true },
  marketing: { price: 'On the call', sub: 'monthly, after a scoping call' },
  automation: { price: 'On the call', sub: 'scoped per workflow' },
};

const COLUMNS = DISCIPLINES.map((d) => ({
  id: d.id,
  name: d.name,
  line: firstSentence(d.promise),
  items: d.cards.map((c) => c.title),
  call: d.call.label,
  ...GRID[d.id],
}));

/* The founder's table, verbatim, in the grid's column order. */
const ROWS = [
  ['Turnaround', ['1 to 2 days', '4 days', 'first week', 'per workflow']],
  ['Revisions', ['unlimited before build', 'two rounds', 'ongoing', 'ongoing']],
  ['Ownership', ['yours', 'yours, domain and code', 'yours, ad accounts', 'yours, tools and access']],
  ['Support after launch', ['30 days', '30 days', 'monthly', 'monthly']],
  ['Payment', ['flat, on approval', 'flat, on approval', 'monthly', 'monthly']],
];

const QUESTIONS = [
  {
    id: 'whole',
    q: 'Is $700 really the whole price?',
    a: 'Yes. Design, build, testing, launch on your domain and thirty days of support. The only thing not in it is a domain name if you do not own one yet, which is about $15 a year and goes in your name.',
  },
  {
    id: 'call',
    q: 'What does "on the call" mean?',
    a: 'Marketing and automation depend on your ad spend, your locations and the tools you already use, so we price them after a fifteen-minute call. You get a written number before anything starts.',
  },
  {
    id: 'deposit',
    q: 'Do you take a deposit?',
    a: 'No. You see concepts before you pay for anything. The invoice comes after you approve the build.',
  },
  {
    id: 'logo',
    q: 'What if I only want the logo?',
    a: 'Then that is what you buy. Basic branding is $299 on its own, no website required.',
  },
];

export default function PricingPage() {
  return (
    <Shell
      title="Pricing | VexelTech"
      description="Flat prices for every job that needs doing. Branding and websites are fixed. Marketing and automation are scoped on a call."
      driftTo=".plan"
    >
      {/* 1. THE HEAD. */}
      <header className="vt pr-head">
        <div className="pr__in">
          <p className="pr-head__eyebrow">Pricing</p>
          <h1 className="pr-head__h" id="pg-h">
            Flat prices for every job that <span className="hl">needs</span> doing.
          </h1>
          <p className="pr-head__lead">
            Branding and websites are fixed. Marketing and automation are scoped on a call.
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
              <li className="pr-col" key={c.id} data-picked={c.picked ? 'true' : 'false'}>
                <p className="pr-col__tag-row">
                  {c.picked ? <span className="pr-col__tag">Most picked</span> : null}
                </p>
                <h3 className="pr-col__name">{c.name}</h3>
                <p className="pr-col__line">{c.line}</p>
                <p className="pr-col__price">{c.price}</p>
                <p className="pr-col__sub">{c.sub}</p>
                <div className="pr-col__get">
                  <p className="pr-col__label">What you get</p>
                  <ul className="pr-col__list">
                    {c.items.map((item) => (
                      <li className="pr-col__item" key={item}>
                        <Check className="pr-col__check" weight="bold" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  className={`pr-col__btn${c.picked ? ' pr-col__btn--primary' : ''}`}
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
        </div>
      </section>

      {/* 3. WHAT'S IN EVERY PROJECT. A real table: the services across, the
             terms down. Below 1024 it scrolls sideways in its own region. */}
      <section className="vt pr-cmp" aria-labelledby="pr-cmp-h">
        <div className="pr__in">
          <h2 className="pr-sec__h" id="pr-cmp-h">
            What&apos;s in every project
          </h2>
          <div className="pr-cmp__wrap" role="region" aria-labelledby="pr-cmp-h" tabIndex={0}>
            <table className="pr-cmp__t">
              <thead>
                <tr>
                  <td className="pr-cmp__corner" />
                  {COLUMNS.map((c) => (
                    <th scope="col" key={c.id}>
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([term, values]) => (
                  <tr key={term}>
                    <th scope="row">{term}</th>
                    {values.map((v, i) => (
                      <td key={COLUMNS[i].id}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. NOT SURE? The Plan Builder as built, with the founder's heading. */}
      <PlanBuilder heading="Four questions, then a plan with a number on it." />

      {/* 5. QUESTIONS. The home accordion, the founder's four. */}
      <Faq items={QUESTIONS} id="pr-faq" />

      {/* 6. The burst call, then the form from the Shell. */}
      <CallBand
        material="burst"
        heading="Not sure which one you need"
        note="Tell us what is going wrong and we will say which of these we would start with. Sometimes it is the cheapest one on this page."
      />
    </Shell>
  );
}
