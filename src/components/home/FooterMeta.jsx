import React from 'react';
import { company } from '../../content/company.js';
import { Link } from 'react-router-dom';
import { IconFacebook, IconInstagram, IconLinkedIn } from '../site/Icons.jsx';
import { SOCIAL_URLS } from '../../content/socials.js';
import Brush from '../site/Brush.jsx';
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
     row 4   LinkedIn, Instagram and   32px yellow circles, asphalt marks from
             Facebook                  the icon set, 16px, 48px hit areas.
                                       HIDDEN UNTIL THEIR URLS ARE SET in
                                       content/socials.js (2026-09-24); the
                                       row collapses when none is
     row 5   Booking projects for October 2026   mono 12px, steel (added
                                       with the email)
     row 6   (c) 2026 VexelTech       mono 12px, steel. The legal entity
                                       line is gone (2026-09-24, the
                                       founder's final details)

   A FULL-BLEED COLOUR BAND AND YELLOW CIRCLES are both the founder's
   decision in this brief, against the quiet pass's "no full-bleed colour"
   and its four places for yellow; DESIGN.md records both.

   The email confirmed 2026-09-08. The address is in index.html's JSON-LD as
   a `PostalAddress`; the band names the city. */
const EMAIL = 'info@vexeltechsolutions.com';
/* The month is content/company.js's (2026-09-25). */
const BOOKING = `Booking projects for ${company.bookingMonth}`;

const PAGES = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'pricing', label: 'Pricing', href: '/pricing' },
  { id: 'about', label: 'About', href: '/about-us' },
  { id: 'contact', label: 'Contact', href: '/contact-us' },
];

/* The founder's three accounts. Only an account with a URL in
   content/socials.js renders; the `#` placeholders are gone. */
const SOCIALS = [
  { id: 'linkedin', label: 'LinkedIn', Icon: IconLinkedIn },
  { id: 'instagram', label: 'Instagram', Icon: IconInstagram },
  { id: 'facebook', label: 'Facebook', Icon: IconFacebook },
]
  .map((s) => ({ ...s, href: (SOCIAL_URLS[s.id] || '').trim() }))
  .filter((s) => s.href);

/* THE BOTTOM ROW, 2026-09-24 (the founder's final details): the brand and
   the year, no legal entity. The "[LEGAL ENTITY NAME]" placeholder is
   deleted. */
const YEAR = 2026;

/* THE FOOTER IS A BLOCK, 2026-09-25 (the founder's Genesis pass), on every
   page: a cream block inset 16px from the viewport on every side, 32px
   radius, 96px of padding (see FooterForm.css for the phone's), the grain
   kept. Left: "Let's talk." in Clash Display Medium, 96px (56 on a phone),
   asphalt, and the copyright at the bottom left. Right: the email, the city,
   the pages, the socials when they are set, and the booking line with a
   yellow dot that pulses. One loose swash, 48px thick and 420px long, runs
   off the block's top right corner at -35 degrees, cut by its radius;
   hidden below 768. It replaced the full-bleed centred band. */
export default function FooterMeta() {
  return (
    <div className="foot__band">
      <Brush mark width={420} thickness={48} angle={-35} opacity={0.9} className="foot__swash" />

      <div className="foot__big-col">
        <p className="foot__big">Let&apos;s talk.</p>
        <p className="foot__legal">© {YEAR} VexelTech</p>
      </div>

      <div className="foot__meta">
        <a className="foot__email" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>

        <p className="foot__city">Richmond, TX</p>

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

        {SOCIALS.length ? (
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
        ) : null}

        <p className="foot__booking">
          <span className="foot__pulse" aria-hidden="true" />
          {BOOKING}
        </p>
      </div>
    </div>
  );
}
