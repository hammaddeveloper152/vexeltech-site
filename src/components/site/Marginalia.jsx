import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from '../home/smoothScroll.js';
import '../../styles/marginalia.css';

/* THE MARGINALIA, site-wide, 2026-09-25 (the founder's launch batch).
   Mounted once per page, by Home and by Shell. Renders nothing of its own; it
   builds the labels from the page's markup, so every page gets them the same
   way and no section carries its own.

   Every section after the one holding the page's h1 (the hero on home, the
   page head elsewhere), the footer's form included, gets a rotated mono
   label in the left gutter: "01 WHAT IT COSTS YOU", numbered from 01 per
   page, the words the section's own heading (visible or not). A decorative
   section (aria-hidden, the wordmark band) is skipped. Each label sits level
   with its heading. STATIC: steel-lift on the dark ground, deep amber on a
   cream sheet, never yellow (register.css). Hidden below 1024.

   LENIS ON EVERY PAGE stays from the batch: this component starts it
   wherever it is mounted; smoothScroll.js ref-counts it, so home's two
   callers share one. */
const SECTIONS = ':scope > section, :scope > header, :scope > footer, :scope > div > section';

export default function Marginalia() {
  const { pathname } = useLocation();
  useSmoothScroll();

  useLayoutEffect(() => {
    const main = document.getElementById('main');
    if (!main) return undefined;
    const h1 = main.querySelector('h1');
    const first = h1 ? h1.closest('section, header') : null;
    const all = [...main.querySelectorAll(SECTIONS)];
    const start = first ? all.indexOf(first) + 1 : 0;
    const sections = all
      .slice(start)
      .filter((s) => s.getAttribute('aria-hidden') !== 'true' && s.querySelector('h2'));

    const made = sections.map((s, i) => {
      const h = s.querySelector('h2');
      const label = document.createElement('span');
      label.className = 'marg';
      label.setAttribute('aria-hidden', 'true');
      label.textContent = `${String(i + 1).padStart(2, '0')} ${h.textContent.trim()}`;
      s.classList.add('has-marg');
      s.appendChild(label);
      return { s, h, label };
    });

    /* Level with the heading, re-placed when anything changes the page's
       layout (fonts landing, a width, a disclosure). */
    const place = () => {
      made.forEach(({ s, h, label }) => {
        const top = h.getBoundingClientRect().top - s.getBoundingClientRect().top;
        label.style.top = `${Math.max(0, Math.round(top))}px`;
      });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(main);

    return () => {
      ro.disconnect();
      made.forEach(({ s, label }) => {
        label.remove();
        s.classList.remove('has-marg');
      });
    };
  }, [pathname]);

  return null;
}
