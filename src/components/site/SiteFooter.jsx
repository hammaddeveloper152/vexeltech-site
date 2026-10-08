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

export default function SiteFooter() {
  return (
    <footer className="vt sf">
      <div className="sf__in">
        <div className="sf__cols">
          <div className="sf__col">
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

          <nav className="sf__col" aria-labelledby="sf-pages">
            <p className="sf__k" id="sf-pages">
              Pages
            </p>
            <ul className="sf__pages">
              {PAGES.map((pg) => (
                <li key={pg.label}>
                  <Link className="sf__a" to={pg.to}>
                    {pg.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3 is the call alone (FINAL41, the founder): the
              sentence and then the "Start" label are deleted. It stands at
              the top of the row, level with "Let's talk." and "Pages". */}
          <div className="sf__col sf__col--call">
            <Link className="sf__cta" to="/contact-us">
              Get a custom quote
            </Link>
          </div>
        </div>

        {/* Two groups, so below 600 the row breaks between them and never
            starts a line with a dot. Every dot is a span of its own, outside
            the links, so a link's underline never runs under one (final35). */}
        <p className="sf__legal">
          <span className="sf__lg">
            <span>© 2026 {ENTITY.name}</span>
            <span className="sf__sep" aria-hidden="true">
              ·
            </span>
            <span>{ENTITY.addressShort}</span>
          </span>
          <span className="sf__sep sf__sep--g" aria-hidden="true">
            ·
          </span>
          <span className="sf__lg">
            <Link className="sf__a sf__a--legal" to="/privacy-policy">
              Privacy
            </Link>
            <span className="sf__sep" aria-hidden="true">
              ·
            </span>
            <Link className="sf__a sf__a--legal" to="/terms-of-service">
              Terms
            </Link>
          </span>
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
