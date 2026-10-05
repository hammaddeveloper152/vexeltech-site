import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

   LENIS IS HOME'S ONLY, 2026-10-01 (the founder's bundle split: routes with
   no scroll animation do not ship GSAP, ScrollTrigger or Lenis). This
   component started it on every page from the launch batch; it no longer
   does, and home's WordBand starts it there (smoothScroll.js). */
const SECTIONS = ':scope > section, :scope > header, :scope > footer, :scope > div > section';

/* THE STORY RAIL (the founder's clarity pass, 2026-10-06), home only
   (`rail`): from 1024 the side labels are joined by a 1px steel rail down
   the left edge, drawn in the gaps between consecutive labels so it never
   crosses their words. A machine yellow fill runs down it from 01 to the
   section in view: each segment fills as the middle of the viewport passes
   through it. Transform only (scaleY), read once per frame on scroll; the
   fill is a position, not an entrance, so reduced motion keeps it. Hidden
   below 1024 with the labels (marginalia.css). */
const GAP = 10; // px of air between a label and the rail

export default function Marginalia({ rail = false }) {
  const { pathname } = useLocation();

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
      /* A section may name its label itself (`data-marg`, About's "The
         record", 2026-10-03); otherwise the label is its heading. */
      label.textContent = `${String(i + 1).padStart(2, '0')} ${s.dataset.marg || h.textContent.trim()}`;
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
    /* The rail: one segment per gap between two labels. */
    const segs = [];
    let host = null;
    let raf = 0;
    const fill = () => {
      raf = 0;
      if (!host) return;
      const mid = window.scrollY + window.innerHeight / 2;
      segs.forEach(({ top, h, bar }) => {
        const k = h > 0 ? Math.max(0, Math.min(1, (mid - top) / h)) : 0;
        bar.style.transform = `scaleY(${k})`;
      });
    };
    const layRail = () => {
      if (!host) return;
      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      const boxes = made.map(({ label }) => {
        const r = label.getBoundingClientRect();
        return { x: r.left + r.width / 2, top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
      });
      segs.forEach((seg, i) => {
        const a = boxes[i];
        const b = boxes[i + 1];
        seg.top = a.bottom + GAP;
        seg.h = Math.max(0, b.top - GAP - seg.top);
        seg.el.style.left = `${Math.round(a.x - main.getBoundingClientRect().left)}px`;
        seg.el.style.top = `${Math.round(seg.top - mainTop)}px`;
        seg.el.style.height = `${Math.round(seg.h)}px`;
      });
      fill();
    };
    /* The rail is built once the page is idle after load: it reads every
       label's box, and on the first render that work competed with the
       hero's line for the main thread (Lighthouse mobile, 2026-10-06). */
    let idle = 0;
    let gone = false;
    const buildRail = () => {
      if (gone || host || !rail || made.length < 2) return;
      host = document.createElement('div');
      host.className = 'marg-rail';
      host.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < made.length - 1; i += 1) {
        const el = document.createElement('span');
        el.className = 'marg-rail__seg';
        const bar = document.createElement('span');
        bar.className = 'marg-rail__fill';
        el.appendChild(bar);
        host.appendChild(el);
        segs.push({ el, bar, top: 0, h: 0 });
      }
      main.classList.add('has-marg-rail');
      main.appendChild(host);
      layRail();
      window.addEventListener('scroll', onScroll, { passive: true });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(fill);
    };

    place();
    const ro = new ResizeObserver(() => {
      place();
      layRail();
    });
    ro.observe(main);
    if (rail) {
      const whenIdle = () => {
        idle = window.requestIdleCallback ? window.requestIdleCallback(buildRail, { timeout: 2000 }) : window.setTimeout(buildRail, 300);
      };
      if (document.readyState === 'complete') whenIdle();
      else window.addEventListener('load', whenIdle, { once: true });
    }

    return () => {
      gone = true;
      ro.disconnect();
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      if (host) {
        host.remove();
        main.classList.remove('has-marg-rail');
      }
      made.forEach(({ s, label }) => {
        label.remove();
        s.classList.remove('has-marg');
      });
    };
  }, [pathname, rail]);

  return null;
}
