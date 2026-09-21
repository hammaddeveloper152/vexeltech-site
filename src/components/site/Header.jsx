/* INTERNAL LINKS ARE ROUTER LINKS, NOT PLAIN ANCHORS, from 2026-09-08.

   Every internal link in the rebuild was `<a href>`, which makes the browser
   FETCH A NEW DOCUMENT for a route the router could have rendered in place.

   That is why the wordmark could land on the old hero. `/` served the legacy
   homepage until the route swap earlier the same day, so a browser that had
   visited it could hold a cached document for that exact URL — and a plain
   anchor is precisely what hands the browser the chance to use it. A `<Link>`
   never requests a document, so the cache has nothing to answer.

   It was also wrong on its own terms: a full reload on every internal click
   re-parses the bundle, re-runs the hero entrance and throws away scroll
   position, on a site that is one bundle already. */
import React, { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, X } from '@phosphor-icons/react';
import Wordmark from './Wordmark.jsx';
import './Header.css';

/* The bar.

   ---- Navigation, PROPOSED 2026-09-08 -----------------------------------

   Content answer 10.1 lists eight destinations: Home Page, Services,
   Pricing, About Us, Contact US, Resources, Portfolio, Case Studies. The bar
   holds four. These four are a proposal and are trivially reversible; they
   are written in rather than left as PLACEHOLDER LINK because the container
   budget at 1024 cannot be measured against a label nobody will ship.

   TWO OF THE EIGHT ARE ALREADY IN THE BAR AND DO NOT NEED A SLOT.
   Home is the wordmark, which is a link to `/` and the first thing in the
   tab order after the skip link. Contact is the call, which 10.3 names
   "Let's Talk". Spending nav slots on either would be the same destination
   twice in one 65px strip.

   That leaves six for four, and the four chosen are the ones a reader
   deciding whether an agency is serious opens in order: what you do, what it
   costs, what you have done, who you are. Services and Pricing are the offer.
   Portfolio is the evidence. About us is the company.

   THE OTHER FOUR LIVE IN THE FOOTER: Home, Contact us, Resources and Case
   studies. 10.4 says the footer carries all the website pages, so the footer
   list is all eight rather than only the four that missed; see FooterForm.

   Case studies is the closest call. It is proof, like Portfolio, and it was
   left out of the bar because two proof links side by side make the reader
   choose between them before they know the difference. In the footer it sits
   next to Portfolio where that comparison is cheap.

   PORTFOLIO IS OUT OF THE BAR, 2026-09-21, by the user, at every width and
   in the phone menu (both render this one list). The work section is still a
   placeholder, so the bar no longer offers it as evidence. `/portfolio` stays
   reachable by URL until it is retired with the other legacy routes. The bar
   holds three; its container budget only gains from the removal.

   Social icons, also 10.4: in the FOOTER since 2026-09-16, not the bar. See
   SocialRow.jsx for the user's decision to ship them with placeholder URLs. */
const NAV = [
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'pricing', label: 'Pricing', href: '/pricing' },
  { id: 'about', label: 'About us', href: '/about-us' },
];

/* 10.3, the user's own label for this call, verbatim. It replaces "Get a
   custom quote", which was written here before the content arrived. */
const CTA = 'Let’s Talk';

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/* `over`: the route has a film or surface hero, and the bar stands over it.
   Home (the film) and About (the surface mount) pass it; every other route
   keeps the solid bar. */
const SOLID_AFTER = 80; // px of scroll

export default function Header({ over = false }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(!over);

  /* OVER A HERO THE BAR HAS TWO STATES, 2026-09-15, by the user. At the top
     it is a gradient over the picture; after 80px of scroll it is the solid
     bar with its hairline, and back on return. One passive listener, read
     once per frame. */
  useEffect(() => {
    if (!over) {
      setSolid(true);
      return undefined;
    }
    let raf = 0;
    const read = () => {
      raf = 0;
      setSolid(window.scrollY > SOLID_AFTER);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [over]);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();

  /* The panel is a modal: while it is open it is the only thing you can
     reach. Escape closes it, Tab cycles inside it, and focus goes back to the
     button that opened it, because a reader who closes a menu should be where
     they were, not at the top of the document. */
  useEffect(() => {
    if (!open) return undefined;

    const panel = panelRef.current;
    if (!panel) return undefined;

    const previous = document.activeElement;
    const first = panel.querySelector(FOCUSABLE);
    if (first) first.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (!items.length) return;

      const head = items[0];
      const tail = items[items.length - 1];

      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault();
        tail.focus();
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault();
        head.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    /* The page behind does not scroll under an open full-screen menu. */
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;

      /* Focus goes back to the button that opened the menu. If the viewport
         crossed the breakpoint while it was open, that button is now
         display:none and cannot take focus, so fall back to whatever had it
         before and then to the brand link. Without the fallback, focus drops
         silently to the body and a keyboard reader restarts at the top of the
         document. */
      const trigger = triggerRef.current;
      const candidates = [
        trigger && trigger.offsetParent !== null ? trigger : null,
        previous instanceof HTMLElement && previous.offsetParent !== null ? previous : null,
        document.querySelector('.bar__brand'),
      ];
      const back = candidates.find((el) => el && typeof el.focus === 'function');
      if (back) back.focus();
    };
  }, [open]);

  /* The ground state is back, over heroes only. It was deleted when the hero
     carried no photography and a transparent bar put white navigation on a
     white headline. The hero is a film now, the headline sits below the bar's
     band, and the gradient's strength is walked over the film. See Header.css. */
  return (
    <header
      className="vt bar"
      data-over={over ? 'true' : 'false'}
      data-solid={solid ? 'true' : 'false'}
    >
      <div className="bar__inner">
        <Link className="bar__brand" to="/" aria-label="Vexeltech, home">
          <Wordmark size="md" />
        </Link>

        <nav className="bar__nav" aria-label="Main">
          <ul className="bar__list">
            {NAV.map(({ id, label, href }) => (
              <li key={id}>
                <Link className="bar__link" to={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link className="bar__cta" to="/contact-us">
          {CTA}
        </Link>

        {/* The icon is the whole content of this control, so the control
            carries the label. DESIGN.md Iconography: the label says what the
            button does, not what the icon depicts, which is why it is not
            "three lines". Phosphor rather than a hamburger assembled from
            divs, and not text, per the brief. The 48px target is on the
            button's padding, not the 24px glyph. */}
        <button
          className="bar__menu"
          type="button"
          ref={triggerRef}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? 'Close the menu' : 'Open the menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="i i--md" aria-hidden="true" />
          ) : (
            <List className="i i--md" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Rendered only while open, so nothing behind it is reachable by Tab
          and there is no hidden copy of the navigation in the tree. */}
      {open ? (
        <div
          className="bar__panel"
          id={panelId}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
        >
          <ul className="bar__panel-list">
            {NAV.map(({ id, label, href }) => (
              <li key={id}>
                <Link className="bar__panel-link" to={href} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <Link className="bar__cta bar__cta--panel" to="/contact-us" onClick={() => setOpen(false)}>
            {CTA}
          </Link>
        </div>
      ) : null}
    </header>
  );
}
