import React from 'react';
import { FIGURES, money } from '../../content/pricing.js';
import Wordmark from '../site/Wordmark.jsx';
import Brush from '../site/Brush.jsx';
import './story.css';

/* HOW WE WORK WITH YOU, AS A DOCUMENT (the founder's five fixes,
   2026-10-02). One cream sheet, 24px radius, a 2px hairline, turned minus 1
   degree from 1024 (square below), 48px inside (24 on a phone):

     the header   the wordmark small, "Terms" in Clash Display 24px, "2026"
                  in mono at the right, a hairline under
     the clauses  01 to 04, the step's title in Clash Display 20px over its
                  line in Satoshi 18px
     a hairline, then "Schedule" in mono and the key facts as label and
     value rows
     the foot     the yellow swash, 120px, right-aligned, a signature: the
                  one swash on About (the hero's "called." gave its up)

   The words are VEXELTECH-COPY.md V3.1's; the figures are tokens; the email
   and phone are links with 48px targets. */
const EMAIL = 'info@vexeltechsolutions.com';
const PHONE = '(385) 284-3265';

const STEPS = [
  ['01', 'One person.', 'A name and a US number, on your account from the first call.'],
  ['02', 'Approval first.', 'Concepts, then the build, then the invoice.'],
  ['03', 'Ownership.', 'Domain, hosting, code and credentials in your name from day one.'],
  ['04', 'Thirty days.', 'Maintenance included after launch. After that, you call us when you need us.'],
];

const FACTS = [
  ['Company', 'VexelTech Solutions'],
  ['Work', 'Website design, branding, local SEO and ads, automation for US small businesses'],
  ['Founded', '2026'],
  ['Serves', 'Owner-run businesses across the US. Recent work spans real estate, bookkeeping, care services, hospitality, consulting and technology'],
  ['Terms', `Website ${money(FIGURES.website)} flat, branding ${money(FIGURES.brandingBasic)} or ${money(FIGURES.brandingAdvance)}, marketing and automation by quote`],
  ['Turnaround', 'Branding one to two business days, website four business days'],
  ['Ownership', "Domain, hosting, code and credentials in the client's name"],
  [
    'Contact',
    <>
      <a className="ts__a" href={`mailto:${EMAIL}`}>
        {EMAIL}
      </a>
      ,{' '}
      <a className="ts__a" href="tel:+13852843265">
        {PHONE}
      </a>
    </>,
  ],
];

export default function TermsSheet() {
  return (
    <section className="vt st-sec st--light ts" aria-labelledby="ts-h">
      <div className="st-in">
        <h2 className="st-h" id="ts-h">
          How we work with you
        </h2>
        <article className="ts__doc" aria-label="Terms">
          <header className="ts__head">
            <Wordmark size="sm" className="ts__wm" />
            <p className="ts__title">Terms</p>
            <p className="ts__year st-mono">2026</p>
          </header>
          <ol className="ts__steps">
            {STEPS.map(([n, t, d]) => (
              <li className="ts__step" key={n}>
                <span className="ts__n st-mono">{n}</span>
                <span className="ts__body">
                  <span className="ts__t">{t}</span>
                  <span className="ts__d">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <h3 className="ts__k-h st-mono">Schedule</h3>
          <dl className="ts__facts">
            {FACTS.map(([k, v]) => (
              <div className="ts__row" key={k}>
                <dt className="ts__k st-mono">{k}</dt>
                <dd className="ts__v">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="ts__sign" aria-hidden="true">
            <Brush mark width={120} angle={-6} opacity={0.9} />
          </div>
        </article>
      </div>
    </section>
  );
}
