import React from 'react';
import { Link } from 'react-router-dom';
import './FooterForm.css';

/* THE FOOTER, REBUILT 2026-09-24 (the founder's Monolog pass), on every
   route. It follows the form (FooterForm renders it), inside the page
   measure:

     left     the five pages, Clash Display Medium 32px bone, one per row,
              a 1px white-at-10% hairline between rows
     right    (CONTACT): the email and the Richmond address
              (SOCIALS): LinkedIn and Instagram, `#` until the founder
              supplies the accounts - the founder's instruction, which
              replaces the rule that no social link renders without a URL
     base     13px steel-lift: "Booking projects for October 2026" left, the
              legal line and the year right

   The old footer's link grid, its wordmark row and the social glyph row
   (SocialRow.jsx) are gone. The email and the address confirmed 2026-09-08;
   the address and the `PostalAddress` in index.html's JSON-LD are one fact
   written twice, so change them together. On a phone the columns stack. */
const EMAIL = 'info@vexeltechsolutions.com';
const ADDRESS = '6619 Elks Trce, Richmond, TX 77406';

const PAGES = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'pricing', label: 'Pricing', href: '/pricing' },
  { id: 'about', label: 'About us', href: '/about-us' },
  { id: 'contact', label: 'Contact', href: '/contact-us' },
];

/* THE LEGAL LINE RENDERS AS ITS OWN PLACEHOLDER, 2026-09-23 (the founder):
   "[LEGAL ENTITY NAME] · 2026", verbatim from VEXELTECH-COPY.md, until the
   founder replaces it. It was null and rendered nothing.

   This is not a breach of "no placeholder content": the site's rule is that
   every placeholder string SAYS it is a placeholder, and a bracketed slot in
   the legal row does exactly that. The alternative - a footer with no legal
   line at all - reads as finished and is the thing that quietly ships.

   THE PHONE STAYS NULL. A visible "[PHONE]" in the contact row would sit
   beside a real email and a real address and invite a reader to try it; a
   legal line is a statement about the company, not something anyone dials. */
const PHONE = null;

/* The founder's two accounts, `#` until the URLs are supplied. */
const SOCIALS = [
  { id: 'linkedin', label: 'LinkedIn', href: '#' },
  { id: 'instagram', label: 'Instagram', href: '#' },
];

/* The founder's line, 2026-09-24. */
const BOOKING = 'Booking projects for October 2026';
const LEGAL = '[LEGAL ENTITY NAME]';
const YEAR = 2026;

export default function FooterMeta() {
  return (
    <div className="foot__meta">
      {/* The line that answered the form, kept from the old mail block. */}
      <p className="foot__lead-p">
        Tell us what&apos;s going wrong. You&apos;ll hear from a person within one business day.
      </p>
      <div className="foot__cols">
        {/* A named landmark, so it is not confused with the bar's "Main"
            navigation. */}
        <nav className="foot__nav" aria-label="Site">
          <ul className="foot__pages">
            {PAGES.map(({ id, label, href }) => (
              <li key={id}>
                <Link className="foot__page" to={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="foot__side">
          <div className="foot__group">
            <p className="foot__k lbl">Contact</p>
            <a className="foot__email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <p className="foot__addr">{ADDRESS}</p>
            {PHONE ? <p className="foot__phone">{PHONE}</p> : null}
          </div>
          <div className="foot__group">
            <p className="foot__k lbl">Socials</p>
            <ul className="foot__socials">
              {SOCIALS.map(({ id, label, href }) => (
                <li key={id}>
                  <a className="foot__social" href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="foot__base">
        <p className="foot__booking">{BOOKING}</p>
        {LEGAL ? (
          <p className="foot__legal">
            {LEGAL} · {YEAR}
          </p>
        ) : null}
      </div>
    </div>
  );
}
