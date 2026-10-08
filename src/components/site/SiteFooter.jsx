import React from 'react';
import { Link } from 'react-router-dom';
import { ENTITY } from '../../content/entity.js';
import './site-footer.css';

/* THE FOOTER, EVERY PAGE (final32, 2026-10-07, the founder). It replaced the
   cream sheet's "Let's talk." card and the bottom row (FooterMeta.jsx and
   FooterBase, deleted); the contact form stays above it as its own cream
   section (FooterForm.jsx), on every page but Contact, which has its own.

   The dark ground #0B0B0C, full width; no join or rule at its top since
   the lines audit (final34), 96px of space instead (56 on a phone). In the 1180 container, 96px down:
     1  "Let's talk." in the display face, the email and the phone
     2  "Pages": Services, Pricing, About us, Contact us
     3  "Start": the promise and the primary call
   (the trim, 2026-10-08, the founder: the hours line, Home, the four
   sub-links and the booking line are gone)
   then the legal row, then VEXELTECH. across the full container in the
   display face, standing on the page's bottom edge: the edge is at the
   baseline (2026-10-08, the founder), so every letter and the yellow stop
   are whole. It cropped the lower 30% until then, which hid the stop.

   Prerendered and static: nothing moves but the links' hover. It sits
   after <main>, so it is the page's contentinfo landmark. The wordmark is
   a picture of the name (the legal row says it in words), hidden from
   assistive technology. */
const EMAIL = ENTITY.email;
/* THE TRIM (2026-10-08, the founder): four pages, no Home (the wordmark in
   the bar is home) and no sub-links. */
const PAGES = [
  { label: 'Services', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About us', to: '/about-us' },
  { label: 'Contact us', to: '/contact-us' },
];

/* THE FOOTER, FINAL41 (2026-10-08, the founder): three columns and no
   labels. 1, "Let's talk." with the email and the phone; 2, the four
   pages; 3, the two legal pages. The first links of 2 and 3 stand level
   with the top of "Let's talk." (site-footer.css). The "Pages" and
   "Start" labels, the Start sentence and the footer's call are deleted;
   the legal row is the entity and the address only. */
const LEGAL = [
  { label: 'Privacy policy', to: '/privacy-policy' },
  { label: 'Terms of service', to: '/terms-of-service' },
];

export default function SiteFooter() {
  return (
    <footer className="vt sf">
      <div className="sf__in">
        <div className="sf__cols">
          <div className="sf__col sf__col--talk">
            <p className="sf__talk hl">Let&apos;s talk.</p>
            <p className="sf__contact">
              <a className="sf__u" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              <a className="sf__u" href={ENTITY.phoneHref}>
                {ENTITY.phone}
              </a>
            </p>
          </div>

          <nav className="sf__col" aria-label="Pages">
            <ul className="sf__links">
              {PAGES.map((pg) => (
                <li key={pg.label}>
                  <Link className="sf__a" to={pg.to}>
                    {pg.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="sf__col" aria-label="Legal">
            <ul className="sf__links">
              {LEGAL.map((pg) => (
                <li key={pg.label}>
                  <Link className="sf__a" to={pg.to}>
                    {pg.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="sf__legal">
          <span>© 2026 {ENTITY.name}</span>
          <span className="sf__sep" aria-hidden="true">
            ·
          </span>
          <span>{ENTITY.addressShort}</span>
        </p>

        <p className="sf__mark" aria-hidden="true">
          <span className="sf__mark-w">
            VEXELTECH<span className="sf__stop">.</span>
          </span>
        </p>
      </div>
    </footer>
  );
}
