import React from 'react';
import { Link } from 'react-router-dom';
import { Envelope, MapPin, Phone } from '@phosphor-icons/react';
import Wordmark from '../site/Wordmark.jsx';
import SocialRow from './SocialRow.jsx';
import './FooterForm.css';

/* The meta row, split out of FooterForm so the eight pages share ONE
   implementation of it rather than a copy each.

   It was always its own thing inside that file — the lockup, the site map,
   the contact block and the legal line, under a hairline, below the form.
   The homepage is the only page whose footer is a form, so the form stayed
   where it was and this came out. Nothing in it changed in the move; the
   class names, the icons and the placeholder strings are the same ones, and
   `FooterForm.css` still owns all of them, which is why this file imports
   that stylesheet rather than getting one of its own.

   ---- Still placeholder, and why ----------------------------------------

   Content answer section 8, CONTACT AND FOOTER, is blank, so the phone, the
   two address lines and the legal line are still placeholders: those are
   facts about this business and BUILD-LAW.md Truth does not let a build
   write them. The v11 tree has a phone number and a Calendly link and
   neither was carried over — a stale contact detail is worse than a visibly
   empty one.

   THE EMAIL AND THE ADDRESS ARE NO LONGER PLACEHOLDERS.
   info@vexeltechsolutions.com and 6619 Elks Trce, Richmond, TX 77406, both
   confirmed by the user on 2026-09-08. The email is a `mailto` rather than
   plain text: the address and the phone are text because they are not
   actionable, and this one is.

   The address here and the `PostalAddress` in index.html's JSON-LD are the
   same fact written twice. Change them together; that file carries a note
   saying so. THE PHONE STAYS A PLACEHOLDER, in both places, until a number
   is confirmed — the JSON-LD has no `telephone` for the same reason.

   The site map is NOT placeholder. It is all eight destinations from content
   answer 10.1, in the user's order, because 10.4 says the footer carries all
   the website pages.

   SOCIAL, also 10.4, IS BUILT SINCE 2026-09-16, by the user's decision. It was
   held back because no account or URL was given; the user chose to ship the
   six tiles now with each linking to its platform's home page, replaced in
   SocialRow.jsx when the accounts arrive. `social={false}` drops the row where
   the page carries its own (Contact, under the form). */

/* THE FOOTER BLOCK FROM VEXELTECH-COPY.md, applied 2026-09-16.

   Pages: Home, Services, Pricing, About us, Contact us. RESOURCES, PORTFOLIO
   AND CASE STUDIES ARE OFF THE FOOTER until those routes are live, per the
   founder's copy. The routes still exist: Portfolio stays linked from the bar
   and the work grid; Resources and Case studies are reachable by URL only.

   The phone and the legal line are HIDDEN until supplied. They were visible
   placeholders ("Placeholder phone number", "Placeholder legal line"); the
   copy file marks both as facts only the founder can give, to be left out of
   the build until filled. Set them here when they arrive. */
const PAGES = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'pricing', label: 'Pricing', href: '/pricing' },
  { id: 'about', label: 'About us', href: '/about-us' },
  { id: 'contact', label: 'Contact us', href: '/contact-us' },
];

/* null until supplied; the line does not render while it is null. */
const PHONE = null;
const LEGAL = null;

export default function FooterMeta({ social = true }) {
  return (
    <div className="foot__meta">
      {/* The lockup closes the page. Larger than the bar's, because this
          one is the sign-off rather than a label on a strip. */}
      <Link className="foot__brand" to="/" aria-label="Vexeltech, home">
        <Wordmark size="lg" />
      </Link>

      {/* The site map. A landmark of its own, labelled, so a screen reader
          can tell it from the bar's "Main" navigation. No icons: a page name
          already says what it is, which is the Iconography test. */}
      <nav className="foot__nav" aria-label="Site">
        <span className="foot__meta-k">Pages</span>
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

      {social ? (
        <div className="foot__social">
          <span className="foot__meta-k">Social</span>
          <SocialRow size="sm" />
        </div>
      ) : null}

      {/* One icon per contact line, at the small station. All decorative:
          the line beside each one already says what it is, and the block is
          headed besides. The two address lines are one contact line with two
          lines of text, so they take one pin between them rather than a pin
          each. */}
      <div className="foot__contact">
        <span className="foot__meta-k">Contact</span>
        <span className="foot__meta-v">
          <Envelope className="i i--sm foot__meta-i" aria-hidden="true" />
          {/* Confirmed by the user, 2026-09-08. A mailto, because an
              address that is not clickable is an address the reader has to
              copy by hand. */}
          <a className="foot__meta-a" href="mailto:info@vexeltechsolutions.com">
            info@vexeltechsolutions.com
          </a>
        </span>
        {PHONE ? (
          <span className="foot__meta-v">
            <Phone className="i i--sm foot__meta-i" aria-hidden="true" />
            <span>{PHONE}</span>
          </span>
        ) : null}
      </div>

      <div className="foot__contact">
        <span className="foot__meta-k">Where</span>
        <span className="foot__meta-v">
          <MapPin className="i i--sm foot__meta-i" aria-hidden="true" />
          <span className="foot__meta-lines">
            {/* Confirmed by the user, 2026-09-08, the same address the
                JSON-LD carries. The two are written from one fact and should
                be changed together; index.html has a note saying so. */}
            <span>6619 Elks Trce</span>
            <span>Richmond, TX 77406</span>
          </span>
        </span>
      </div>

      {LEGAL ? <p className="foot__legal">{LEGAL}</p> : null}
    </div>
  );
}
