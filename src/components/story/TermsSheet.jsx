import React from 'react';
import { FIGURES, money } from '../../content/pricing.js';
import './story.css';

/* THE TERMS SHEET (the storytelling pass, 2026-10-01). One document: How we
   work with you as four numbered rows, a hairline, then the key facts as
   label and value rows. It replaces About's second route and its facts
   table, so the terms read as one thing a client could hold.

   A cream sheet, 32px radius, its edge the hairline (asphalt at 15%): the
   page is cream too, so the edge and the radius are what draw it. The words
   are VEXELTECH-COPY.md V3.1's; the figures are tokens; the email and phone
   are links with 48px targets. */
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
        <article className="ts__sheet">
          <h2 className="ts__h" id="ts-h">
            How we work with you
          </h2>
          <ol className="ts__steps">
            {STEPS.map(([n, t, d]) => (
              <li className="ts__step" key={n}>
                <span className="ts__n st-mono">{n}</span>
                <span className="ts__t">{t}</span>
                <span className="ts__d st-soft">{d}</span>
              </li>
            ))}
          </ol>
          <h3 className="ts__k-h st-mono">Key facts</h3>
          <dl className="ts__facts">
            {FACTS.map(([k, v]) => (
              <div className="ts__row" key={k}>
                <dt className="ts__k st-mono">{k}</dt>
                <dd className="ts__v">{v}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </section>
  );
}
