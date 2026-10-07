import React from 'react';
import { Link } from 'react-router-dom';
import SectionJoin from './SectionJoin.jsx';
import { ENTITY } from '../../content/entity.js';
import { company } from '../../content/company.js';
import './site-footer.css';

/* THE FOOTER, EVERY PAGE (final32, 2026-10-07, the founder). It replaced the
   cream sheet's "Let's talk." card and the bottom row (FooterMeta.jsx and
   FooterBase, deleted); the contact form stays above it as its own cream
   section (FooterForm.jsx), on every page but Contact, which has its own.

   The dark ground #0B0B0C, full width, under the yellow join drawn full and
   still (the footer does not move). In the 1180 container, 96px down:
     1  "Let's talk." in the display face, the email and the phone, and
        "Calls set to your hours. US, UK, Europe and Australia."
     2  "Pages": Home, Services and its four disciplines, Pricing, About
        us, Contact us
     3  "Right now": the booking line with its yellow dot (still), the
        promise and the primary call
   then the legal row, then VEXELTECH. across the full container in the
   display face, its lower 30% cropped by the page's bottom edge.

   Prerendered and static: nothing moves but the links' hover. It sits
   after <main>, so it is the page's contentinfo landmark. The wordmark is
   a picture of the name (the legal row says it in words), hidden from
   assistive technology. */
const EMAIL = ENTITY.email;
const PAGES = [
  { label: 'Home', to: '/' },
  {
    label: 'Services',
    to: '/services',
    subs: [
      { label: 'Branding', to: '/services#branding' },
      { label: 'Websites', to: '/services#websites' },
      { label: 'Marketing', to: '/services#marketing' },
      { label: 'Automation', to: '/services#automation' },
    ],
  },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About us', to: '/about-us' },
  { label: 'Contact us', to: '/contact-us' },
];

export default function SiteFooter() {
  return (
    <footer className="vt sf">
      <div className="sf__in">
        <SectionJoin still />
        <div className="sf__cols">
          <div className="sf__col">
            <p className="sf__talk">Let&apos;s talk.</p>
            <p className="sf__contact">
              <a className="sf__u" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              <a className="sf__u" href={ENTITY.phoneHref}>
                {ENTITY.phone}
              </a>
            </p>
            <p className="sf__note">Calls set to your hours. US, UK, Europe and Australia.</p>
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
                  {pg.subs ? (
                    <ul className="sf__subs">
                      {pg.subs.map((s) => (
                        <li key={s.label}>
                          <Link className="sf__a sf__a--sub" to={s.to}>
                            {s.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          <div className="sf__col">
            <p className="sf__k">Right now</p>
            <p className="sf__book">
              <span className="sf__dot" aria-hidden="true" />
              Taking bookings for {company.bookingMonth}.
            </p>
            <p className="sf__promise">A written number within one business day.</p>
            <Link className="sf__cta" to="/contact-us">
              Get a custom quote
            </Link>
          </div>
        </div>

        {/* Two groups, so below 600 the row breaks between them and never
            starts a line with a dot. */}
        <p className="sf__legal">
          <span className="sf__lg">
            <span>© 2026 {ENTITY.name}</span>
            <span>{ENTITY.addressShort}</span>
          </span>
          <span className="sf__lg">
            <Link className="sf__a sf__a--legal" to="/privacy-policy">
              Privacy
            </Link>
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
