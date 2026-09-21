import React from 'react';
import { Link } from 'react-router-dom';
import Wordmark from '../site/Wordmark.jsx';
import SocialRow from './SocialRow.jsx';
import './FooterForm.css';

/* THE FOOTER, REBUILT 2026-09-16; the form on every route since 2026-09-21,
   by the user. This is what follows the form (FooterForm renders it), top to
   bottom, on the drift's last stop, arc-black, with no hairlines (2026-09-21):

     the email      "info@vexeltechsolutions.com" as a bone link, Satoshi
                    body, directly under the form, and the line under it in
                    bone. It was the footer's object in Monigue up to 115px
                    until the form came to every route
     pages, social  the five pages left in Satoshi 14px, the social glyphs
                    right (none render until an account URL is supplied)
     the base       mono 11px steel-lift: the wordmark small at left, the
                    address centre, the legal line and year right; the legal
                    line and the phone are hidden until supplied

   The large stroked V in the footer's corner is gone: the email is the object.
   On a phone everything stacks.

   Every value is the user's: the email and the address confirmed 2026-09-08,
   the five pages and the hidden lines from VEXELTECH-COPY.md, the line under
   the email from the brief. The address and the `PostalAddress` in index.html's
   JSON-LD are one fact written twice; change them together. */

const EMAIL = 'info@vexeltechsolutions.com';
const ADDRESS = '6619 Elks Trce, Richmond, TX 77406';

const PAGES = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'pricing', label: 'Pricing', href: '/pricing' },
  { id: 'about', label: 'About us', href: '/about-us' },
  { id: 'contact', label: 'Contact us', href: '/contact-us' },
];

/* null until supplied; neither line renders while it is null. The copy file
   gives the legal line as "[LEGAL ENTITY NAME] · 2026". */
const PHONE = null;
const LEGAL = null;
const YEAR = 2026;

export default function FooterMeta() {
  return (
    <div className="foot__meta">
      <div className="foot__mail">
        <a className="foot__email" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
        <p className="foot__lead-p">
          Tell us what&apos;s going wrong. You&apos;ll hear from a person within one business day.
        </p>
      </div>

      <div className="foot__row">
        {/* A landmark of its own, labelled, so a screen reader can tell it from
            the bar's "Main" navigation. */}
        <nav className="foot__nav" aria-label="Site">
          <ul className="foot__nav-list">
            {PAGES.map(({ id, label, href }) => (
              <li key={id}>
                <Link className="foot__nav-link" to={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SocialRow />
      </div>

      <div className="foot__base">
        <Link className="foot__brand" to="/" aria-label="Vexeltech, home">
          <Wordmark size="sm" />
        </Link>
        <p className="foot__addr">{ADDRESS}</p>
        {LEGAL ? (
          <p className="foot__legal">
            {LEGAL} · {YEAR}
          </p>
        ) : null}
        {PHONE ? <p className="foot__phone">{PHONE}</p> : null}
      </div>
    </div>
  );
}
