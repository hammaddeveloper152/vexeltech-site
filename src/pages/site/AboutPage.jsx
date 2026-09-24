import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowUpRight } from '../../components/site/Icons.jsx';
import Shell from './Shell.jsx';
import Brush from '../../components/site/Brush.jsx';
import '../../styles/aboutpage.css';

/* THE ABOUT PAGE, REBUILT 2026-09-25 (the founder; chong.studio/info). Four
   blocks of text and then the footer: no cards, no timeline, no facts table,
   no FAQ, no closing call and no form on this page. Every line is the
   founder's, verbatim.

     1  Statement    dark    the Monigue line with the swash on "phone", and
                             two paragraphs under it in two columns from 1024
     2  What we do   cream   the four disciplines and an example of each, a
                             plain two-column list, and the line to home's
                             How it works
     3  Definition   dark    one centred sentence under its mono label
     4  Contact      dark    clients and partners, a label, a line, the email

   Taken off: Where we come from, What we build it around (the cards), Who we
   are for, Key facts, Questions, the founder's note, the closing call and the
   contact form. The footer block closes the page without the form (Shell's
   `footerForm={false}`). The history of the page is in git and DESIGN.md. */

const EMAIL = 'info@vexeltechsolutions.com';

/* The founder's list: each discipline and, beside it, an example of it. */
const DO = [
  ['Branding', 'Logos and stationery'],
  ['Websites', 'Ecommerce stores'],
  ['Marketing', 'Google and Meta ads'],
  ['Automation', 'Quotes, invoices and follow-ups'],
];

const CONTACTS = [
  { id: 'clients', label: 'Clients', line: 'Want a quote or a straight answer first?' },
  { id: 'partners', label: 'Partners', line: 'Agencies and referrers who want a build partner.' },
];

export default function AboutPage() {
  return (
    <Shell
      title="About us | VexelTech"
      description="VexelTech Solutions is a technology company that builds the website, the marketing and the automation behind US local service businesses, at flat prices from $299."
      footerForm={false}
    >
      {/* 1. THE STATEMENT. */}
      <section className="vt ab3-hero" aria-labelledby="ab3-hero-h">
        <div className="ab3__in">
          <h1 className="ab3-hero__h" id="ab3-hero-h">
            {/* The page's one highlighted word: the swash (Brush.jsx). */}
            We build the system that makes the{' '}
            <Brush className="brush--hl" thickness="fit" angle={-2} at="52%">
              phone
            </Brush>{' '}
            ring.
          </h1>
          <div className="ab3-hero__cols">
            <p className="ab3-hero__p">
              A local business does not need a designer. It needs a website that converts, ads that
              point at it, and the automation that catches every call and quote behind them. That is
              one system, and we build the whole of it.
            </p>
            <p className="ab3-hero__p">
              We work with owner-run trades and services across the US: plumbing, HVAC, electrical,
              roofing, dental, cleaning. Flat prices, four business days, and a team that stays on the
              project after launch. You see the work before you owe us anything.
            </p>
          </div>
        </div>
      </section>

      {/* 2. WHAT WE DO, a cream sheet. */}
      <section className="vt ab3-do panel-sec" aria-labelledby="ab3-do-h">
        <div className="panel">
          <h2 className="ab3-do__h" id="ab3-do-h">
            What we do
          </h2>
          <ul className="ab3-do__list">
            {DO.map(([name, example]) => (
              <li className="ab3-do__row" key={name}>
                <span className="ab3-do__name">{name}</span>
                <span className="ab3-do__ex">{example}</span>
              </li>
            ))}
          </ul>
          <p className="ab3-do__more">
            <Link className="ab3-do__link" to="/#how-it-works">
              See how a project runs, step by step
              <IconArrowUpRight className="i i--sm" />
            </Link>
          </p>
        </div>
      </section>

      {/* 3. THE DEFINITION. The mono label is the section's heading. */}
      <section className="vt ab3-def" aria-labelledby="ab3-def-h">
        <div className="ab3__in ab3-def__in">
          <h2 className="ab3-def__k lbl" id="ab3-def-h">
            Founded 2026, Richmond, TX
          </h2>
          <p className="ab3-def__p">
            VexelTech Solutions is a technology company that builds the website, the marketing and the
            automation behind US local service businesses, at flat prices from $299.
          </p>
        </div>
      </section>

      {/* 4. CONTACT. */}
      <section className="vt ab3-contact" aria-labelledby="ab3-contact-h">
        <div className="ab3__in">
          <h2 className="skip-h" id="ab3-contact-h">
            Contact
          </h2>
          <div className="ab3-contact__cols">
            {CONTACTS.map(({ id, label, line }) => (
              <div className="ab3-contact__col" key={id}>
                <p className="ab3-contact__k lbl">{label}</p>
                <p className="ab3-contact__line">{line}</p>
                <a className="ab3-contact__email" href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
