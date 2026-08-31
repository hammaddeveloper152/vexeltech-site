import React, { useEffect, useId, useRef, useState } from 'react';
import { List, X } from '@phosphor-icons/react';
import Wordmark from './Wordmark.jsx';
import './Header.css';

/* The bar. Placeholder navigation. BUILD-LAW.md Truth: the real site map is
   fifteen pages the user has not listed here, and inventing section names
   would be inventing the site. */
const NAV = [
  { id: 'one', label: 'Placeholder link one', href: '/placeholder-one' },
  { id: 'two', label: 'Placeholder link two', href: '/placeholder-two' },
  { id: 'three', label: 'Placeholder link three', href: '/placeholder-three' },
  { id: 'four', label: 'Placeholder link four', href: '/placeholder-four' },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function Header() {
  const [grounded, setGrounded] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();

  /* The bar is transparent over the hero and takes a ground once the hero is
     behind the reader, so the type never has to hold up over the tile wall.
     Observed rather than measured off a scroll listener: the hero's own
     height is the threshold, whatever that height turns out to be. */
  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero || typeof IntersectionObserver === 'undefined') {
      setGrounded(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => setGrounded(!entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

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

  return (
    <header className="vt bar" data-grounded={grounded ? 'true' : 'false'}>
      <div className="bar__inner">
        <a className="bar__brand" href="/" aria-label="Vexeltech, home">
          <Wordmark size="md" />
        </a>

        <nav className="bar__nav" aria-label="Main">
          <ul className="bar__list">
            {NAV.map(({ id, label, href }) => (
              <li key={id}>
                <a className="bar__link" href={href}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="bar__cta" href="/contact-us">
          Get a Custom Quote
        </a>

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
                <a className="bar__panel-link" href={href} onClick={() => setOpen(false)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <a className="bar__cta bar__cta--panel" href="/contact-us" onClick={() => setOpen(false)}>
            Get a Custom Quote
          </a>
        </div>
      ) : null}
    </header>
  );
}
