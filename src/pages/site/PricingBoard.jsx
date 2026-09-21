import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CALL_HREF, CALL_LABEL } from './parts.jsx';
import { FIGURES, bundleSaving, money } from '../../content/pricing.js';
import '../../styles/board.css';

/* /PRICING, REBUILT 2026-09-22 by the founder: THE BOARD and BUILD YOUR QUOTE,
   one arc blue ground (#0D47BD) edge to edge. The four-question flow is gone.

   ---- THE BOARD ------------------------------------------------------------

   Four tabs in Clash Display, the active one underlined in machine yellow
   (4.21:1 against arc, a non-text mark). Each tab shows package cards side by
   side: cream face, asphalt ink (15.75:1), a 12px radius, the two lights.
   Prices in Moldie at 64px, asphalt on cream; yellow on cream is banned.

   The lists, the turnarounds and the fit lines are VEXELTECH-SERVICES-COPY.md,
   verbatim. The copy gives Branding one list for both tiers; it is split per
   tier on the pricing sheet's own differences (the ladder in pricing.js):
   Advance adds three concepts, the colour variations and the social kit, and
   takes one business day to Basic's two.

   ---- BUILD YOUR QUOTE -------------------------------------------------------

   Toggle chips on the left (Branding off / Basic / Advance; Websites,
   Marketing, Automation on or off), a cream receipt on the right. The $999
   bundle applies itself when Advance and the website are both on, with the
   line "Bundle applied". Marketing and Automation read "on the call". The
   total is Moldie 72px, yellow, in an asphalt strip. Every change reveals its
   line (the reveal curve, 70ms stagger). "Send this to us" scrolls to the form
   and puts the chosen lines in its message.

   THE PRICING EXCEPTION, recorded: on this ground the yellow is the tab
   underline, the "Most picked" tag and the bundle card on the board, and only
   the total strip and "Send this to us" in the quote. */

const BRANDING = {
  basic: {
    name: 'Basic',
    price: FIGURES.brandingBasic,
    turnaround: '2 business days',
    list: [
      'The mark: custom logo design, 5 concepts, logo sizes for social.',
      'The rules: a brand guideline so every future job looks like the same company.',
      'The kit: business card, letterhead, envelope, email signature, favicon.',
    ],
  },
  advance: {
    name: 'Advance',
    price: FIGURES.brandingAdvance,
    turnaround: '1 business day',
    list: [
      'The mark: custom logo design, 8 concepts, colour variations, logo sizes for social.',
      'The rules: a brand guideline so every future job looks like the same company.',
      'The kit: business card, letterhead, envelope, email signature, favicon; social media kit, banners and cover profiles.',
    ],
  },
};

const WEBSITE = {
  price: FIGURES.website,
  turnaround: '4 business days from the day we have your content.',
  list: [
    'The build: custom design up to 6 pages, custom UI and UX, custom backend, payment gateway integration.',
    'The reach: SEO-friendly content, mobile first, live on your own domain.',
    "The cover: 30 days of maintenance included, then it's a conversation, not a retainer.",
    'Also: web apps, ecommerce stores, CRM development, SaaS products, mobile applications.',
  ],
};

const MARKETING = {
  list: [
    'Search: SEO and AEO, so the search that should find you finds you.',
    'Paid: Google ads, Meta ads, campaign management, performance marketing, lead generation.',
    'Conversion: CRO, so the clicks you pay for become calls.',
    'Social: social media management, organic content creation, reels.',
  ],
  fit: "You're spending on marketing and not getting the leads, or you've never spent and don't know where to start.",
};

const AUTOMATION = {
  list: [
    'Workflows: the repeated tasks (quotes, follow-ups, invoices, reminders) run on their own.',
    'Agents: AI agents that answer, book, and route, on your rules.',
    "Chatbots: on your site and your channels, answering the questions you answer ten times a day.",
  ],
  fit: 'You or your staff answer the same message, send the same quote, or chase the same invoice every day.',
};

const TABS = [
  { id: 'branding', label: 'Branding' },
  { id: 'websites', label: 'Websites' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'automation', label: 'Automation' },
];

function List({ items }) {
  return (
    <ul className="pb__list">
      {items.map((t) => (
        <li className="pb__li" key={t}>
          {t}
        </li>
      ))}
    </ul>
  );
}

/* The quote's lines, derived. Priced lines carry a number; Marketing and
   Automation carry null and read "on the call". */
function quoteLines(q) {
  const lines = [];
  if (q.branding) {
    const b = BRANDING[q.branding];
    lines.push({ id: 'branding', label: `Branding ${b.name}`, price: b.price });
  }
  if (q.website) lines.push({ id: 'website', label: 'Website', price: FIGURES.website });
  const deal = bundleSaving();
  const bundled = q.branding === 'advance' && q.website && deal;
  if (bundled) lines.push({ id: 'bundle', label: 'Bundle applied', price: -deal.saving });
  if (q.marketing) lines.push({ id: 'marketing', label: 'Marketing', price: null });
  if (q.automation) lines.push({ id: 'automation', label: 'Automation', price: null });
  const total = lines.reduce((n, l) => n + (l.price || 0), 0);
  return { lines, total, priced: lines.some((l) => l.price !== null && l.id !== 'bundle') };
}

function lineValue(l) {
  if (l.price === null) return 'on the call';
  if (l.price < 0) return `−${money(-l.price)}`;
  return money(l.price);
}

export default function PricingBoard() {
  const [tab, setTab] = useState('branding');
  const [q, setQ] = useState({ branding: null, website: false, marketing: false, automation: false });
  const quoteRef = useRef(null);
  const tabRefs = useRef([]);

  const start = (next) => {
    setQ((cur) => ({ ...cur, ...next }));
    const el = quoteRef.current;
    if (el) {
      const bar = document.querySelector('.bar');
      const off = (bar ? bar.getBoundingClientRect().height : 0) + 24;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off, behavior: reduce ? 'auto' : 'smooth' });
    }
  };

  /* Tabs: arrow keys move between them, per the ARIA tabs pattern. */
  const onTabKey = (e, i) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + TABS.length) % TABS.length;
    setTab(TABS[n].id);
    tabRefs.current[n]?.focus();
  };

  const { lines, total, priced } = quoteLines(q);

  const send = () => {
    const body = [
      'My quote from the pricing page:',
      ...lines.map((l) => `- ${l.label}: ${lineValue(l)}`),
      priced ? `Total: ${money(total)}${lines.some((l) => l.price === null) ? ', plus what is priced on the call' : ''}` : 'Total: priced on the call',
    ].join('\n');
    window.dispatchEvent(new CustomEvent('vt:prefill', { detail: { message: body } }));
    const field = document.getElementById('ff-message');
    if (field) {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      field.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      setTimeout(() => field.focus({ preventScroll: true }), reduce ? 0 : 500);
    }
  };

  return (
    <section className="vt pb colour-band" aria-labelledby="pb-h">
      <div className="pb__in">
        <h2 className="skip-h" id="pb-h">
          Packages
        </h2>

        {/* ---- THE BOARD ---- */}
        <div className="pb__tabs" role="tablist" aria-label="Disciplines">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`pb-tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`pb-panel-${t.id}`}
              tabIndex={tab === t.id ? 0 : -1}
              className="pb__tab"
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              onClick={() => setTab(t.id)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="pb__panel" role="tabpanel" id={`pb-panel-${tab}`} aria-labelledby={`pb-tab-${tab}`} key={tab}>
          {tab === 'branding' ? (
            <div className="pb__cards pb__cards--2">
              {['basic', 'advance'].map((id) => {
                const b = BRANDING[id];
                return (
                  <article className="pb__card" key={id}>
                    {id === 'advance' ? <span className="pb__tag">Most picked</span> : null}
                    <h3 className="pb__name">{b.name}</h3>
                    <p className="pb__price">{money(b.price)}</p>
                    <p className="pb__turn">Turnaround: {b.turnaround}</p>
                    <List items={b.list} />
                    <button type="button" className="pb__start" onClick={() => start({ branding: id })}>
                      Start with this
                    </button>
                  </article>
                );
              })}
            </div>
          ) : null}

          {tab === 'websites' ? (
            <div className="pb__cards pb__cards--web">
              <article className="pb__card pb__card--wide">
                <h3 className="pb__name">Website</h3>
                <p className="pb__price">
                  {money(WEBSITE.price)} <span className="pb__price-k">flat</span>
                </p>
                <p className="pb__turn">Turnaround: {WEBSITE.turnaround}</p>
                <List items={WEBSITE.list} />
                <button type="button" className="pb__start" onClick={() => start({ website: true })}>
                  Start with this
                </button>
              </article>
              <article className="pb__card pb__card--yellow">
                <h3 className="pb__name">Website + Advance branding</h3>
                <p className="pb__price">{money(FIGURES.bundle)}</p>
                {bundleSaving() ? (
                  <p className="pb__turn">
                    Saves {money(bundleSaving().saving)} against {money(bundleSaving().separately)} bought separately.
                  </p>
                ) : null}
                <button type="button" className="pb__start" onClick={() => start({ website: true, branding: 'advance' })}>
                  Start with this
                </button>
              </article>
            </div>
          ) : null}

          {tab === 'marketing' || tab === 'automation' ? (
            <div className="pb__cards pb__cards--1">
              <article className="pb__card pb__card--wide">
                <h3 className="pb__name">{tab === 'marketing' ? 'Marketing' : 'Automation'}</h3>
                <p className="pb__price pb__price--call">Priced on the call</p>
                <List items={tab === 'marketing' ? MARKETING.list : AUTOMATION.list} />
                <p className="pb__fit">
                  <span className="pb__fit-k">Good fit if</span>{' '}
                  {tab === 'marketing' ? MARKETING.fit : AUTOMATION.fit}
                </p>
                <Link className="pb__start" to={CALL_HREF}>
                  {CALL_LABEL}
                </Link>
              </article>
            </div>
          ) : null}
        </div>

        {/* ---- BUILD YOUR QUOTE ---- */}
        <div className="pb__quote" ref={quoteRef}>
          <h2 className="pb__h" id="pb-quote-h">
            Build your quote
          </h2>

          <div className="pb__quote-grid">
            <div className="pb__rows">
              <fieldset className="pb__row">
                <legend className="pb__row-k">Branding</legend>
                {['basic', 'advance'].map((id) => (
                  <button
                    key={id}
                    type="button"
                    className="pb__chip"
                    aria-pressed={q.branding === id}
                    onClick={() => setQ((c) => ({ ...c, branding: c.branding === id ? null : id }))}
                  >
                    {BRANDING[id].name}
                  </button>
                ))}
              </fieldset>
              {[
                ['website', 'Websites'],
                ['marketing', 'Marketing'],
                ['automation', 'Automation'],
              ].map(([key, label]) => (
                <fieldset className="pb__row" key={key}>
                  <legend className="pb__row-k">{label}</legend>
                  <button
                    type="button"
                    className="pb__chip"
                    aria-pressed={q[key]}
                    onClick={() => setQ((c) => ({ ...c, [key]: !c[key] }))}
                  >
                    {q[key] ? 'On' : 'Off'}
                  </button>
                </fieldset>
              ))}
            </div>

            <div className="pb__receipt-wrap">
              <div className="pb__receipt" aria-live="polite">
                {lines.length ? (
                  <ul className="pb__lines">
                    {lines.map((l, i) => (
                      <li className="pb__line" key={l.id} style={{ '--i': i }}>
                        <span>{l.label}</span>
                        <span>{lineValue(l)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="pb__empty">Nothing chosen yet.</p>
                )}
                <p className="pb__total">
                  <span className="pb__total-k">Total</span>
                  <span className="pb__total-n">
                    {priced || !lines.length ? money(total) : 'On the call'}
                  </span>
                </p>
              </div>
              <button type="button" className="pb__send" onClick={send} disabled={!lines.length}>
                Send this to us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
