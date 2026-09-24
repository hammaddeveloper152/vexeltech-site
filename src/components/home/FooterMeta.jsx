import React from 'react';
import { Link } from 'react-router-dom';
import { GlyphInstagram, GlyphLinkedIn } from '../site/Glyphs.jsx';
import './FooterForm.css';

/* THE FOOTER BAND, 2026-09-24 (the founder's Flesh and Bones pass), on every
   route: a full-bleed cream band under the form, 120px above and below,
   everything centred, 24px between rows. Grain at 3%, as on every cream
   panel.

     row 1   RICHMOND, TX              mono 12px uppercase, steel
     row 2   the email                 16px asphalt link (added later the
                                       same day, the founder)
     row 3   the five pages            Clash Medium 20px uppercase, asphalt,
                                       40px apart, steel on hover
     row 4   LinkedIn and Instagram    32px yellow circles, asphalt glyphs,
                                       `#` until the founder supplies them
     row 5   Booking projects for October 2026   mono 12px, steel (added
                                       with the email)
     row 6   (c) 2026 [LEGAL ENTITY NAME]  mono 12px, steel

   A FULL-BLEED COLOUR BAND AND YELLOW CIRCLES are both the founder's
   decision in this brief, against the quiet pass's "no full-bleed colour"
   and its four places for yellow; DESIGN.md records both.

   The email confirmed 2026-09-08. The address is in index.html's JSON-LD as
   a `PostalAddress`; the band names the city. */
const EMAIL = 'info@vexeltechsolutions.com';
const BOOKING = 'Booking projects for October 2026';

const PAGES = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'pricing', label: 'Pricing', href: '/pricing' },
  { id: 'about', label: 'About', href: '/about-us' },
  { id: 'contact', label: 'Contact', href: '/contact-us' },
];

/* The founder's two accounts, `#` until the URLs are supplied. */
const SOCIALS = [
  { id: 'linkedin', label: 'LinkedIn', href: '#', Icon: GlyphLinkedIn },
  { id: 'instagram', label: 'Instagram', href: '#', Icon: GlyphInstagram },
];

/* A placeholder that says it is one, verbatim from VEXELTECH-COPY.md. */
const LEGAL = '[LEGAL ENTITY NAME]';
const YEAR = 2026;

export default function FooterMeta() {
  return (
    <div className="foot__band">
      <p className="foot__city">Richmond, TX</p>

      <a className="foot__email" href={`mailto:${EMAIL}`}>
        {EMAIL}
      </a>

      {/* A named landmark, so it is not confused with the bar's "Main". */}
      <nav className="foot__nav" aria-label="Site">
        <ul className="foot__pages">
          {PAGES.map(({ id, label, href }) => (
            <li key={id}>
              <Link className="foot__page" to={href}>
                <span className="tl">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <ul className="foot__socials" aria-label="Social">
        {SOCIALS.map(({ id, label, href, Icon }) => (
          <li key={id}>
            <a className="foot__social" href={href} aria-label={label}>
              <span className="foot__dot" aria-hidden="true">
                <Icon className="foot__glyph" />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="foot__booking">{BOOKING}</p>

      <p className="foot__legal">
        © {YEAR} {LEGAL}
      </p>
    </div>
  );
}
