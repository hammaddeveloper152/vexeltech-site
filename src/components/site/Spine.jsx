import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '../home/smoothScroll.js';
import '../../styles/spine.css';

gsap.registerPlugin(ScrollTrigger);

/* THE MARGINALIA AND THE SPINE, site-wide, 2026-09-25 (the founder's launch
   batch). Mounted once per page, by Home and by Shell. Renders nothing of
   its own; it builds both from the page's markup, so every page gets them
   the same way and no section has to carry its own label any more (home's
   four hand-written ones are gone).

   THE LABELS. Every section after the one holding the page's h1 (the hero
   on home, the page head elsewhere), the footer's form included, gets a
   rotated mono label in the left gutter: "01 WHAT IT COSTS YOU", numbered
   from 01 per page, the words the section's own heading (visible or not).
   A decorative section (aria-hidden, the wordmark band) is skipped. Each
   label sits level with its heading and turns yellow as that heading
   crosses 60% of the viewport; on a cream sheet the yellow is deep amber,
   because machine yellow is 1.66:1 on cream (spine.css).

   THE SPINE. A 1px line in the same gutter, from under the h1 block to the
   top of the footer's cream sheet, white at 14% at rest. A yellow segment
   draws down it on a ScrollTrigger scrub, its head at 60% of the viewport,
   the same line the labels answer to. It runs UNDER the cream sheets, which
   are laid over the page (tokens.css); through a sheet it is covered, as
   anything on the ground is. How it works' route line is part of it: from
   1024 the route drops its own line and puts its dots on the spine
   (route.css, RouteBand.jsx).

   LENIS ON EVERY PAGE. The scrub runs on Lenis, which until now only home
   started (from the wordmark band). The spine starts it wherever it is
   mounted; smoothScroll.js ref-counts it, so home's two callers share one.

   Hidden below 1024, with every trigger it made (gsap.matchMedia), and under
   reduced motion the spine is drawn in full and the labels are left at
   rest. */
const SECTIONS = ':scope > section, :scope > header, :scope > footer, :scope > div > section';

export default function Spine() {
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

    /* The labels. */
    const made = [];
    sections.forEach((s, i) => {
      const h = s.querySelector('h2');
      const label = document.createElement('span');
      label.className = 'marg';
      label.setAttribute('aria-hidden', 'true');
      label.dataset.on = 'false';
      if (s.matches('.panel-sec, .plan')) label.dataset.ground = 'cream';
      label.textContent = `${String(i + 1).padStart(2, '0')} ${h.textContent.trim()}`;
      s.classList.add('has-marg');
      s.appendChild(label);
      made.push({ s, h, label });
    });
    const place = () => {
      made.forEach(({ s, h, label }) => {
        const top = h.getBoundingClientRect().top - s.getBoundingClientRect().top;
        label.style.top = `${Math.max(0, Math.round(top))}px`;
      });
    };

    /* The spine. */
    const spine = document.createElement('div');
    spine.className = 'spine';
    spine.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('span');
    fill.className = 'spine__fill';
    spine.appendChild(fill);
    main.prepend(spine);
    const measure = () => {
      const m = main.getBoundingClientRect();
      const topEl = first || main.firstElementChild;
      const endEl = main.querySelector('.foot__band');
      const top = topEl ? topEl.getBoundingClientRect().bottom - m.top : 0;
      const end = endEl ? endEl.getBoundingClientRect().top - m.top : m.height;
      spine.style.top = `${Math.round(top)}px`;
      spine.style.height = `${Math.max(0, Math.round(end - top))}px`;
      place();
    };
    measure();

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      ScrollTrigger.addEventListener('refreshInit', measure);
      if (reduced) {
        fill.style.transform = 'scaleY(1)';
      } else {
        ScrollTrigger.create({
          trigger: spine,
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: true,
          onUpdate: (self) => {
            fill.style.transform = `scaleY(${self.progress})`;
          },
        });
        made.forEach(({ h, label }) => {
          ScrollTrigger.create({
            trigger: h,
            start: 'top 60%',
            onEnter: () => {
              label.dataset.on = 'true';
            },
            onLeaveBack: () => {
              label.dataset.on = 'false';
            },
          });
        });
      }
      return () => ScrollTrigger.removeEventListener('refreshInit', measure);
    });

    /* Anything that changes the page's height (fonts, a disclosure, a width)
       moves both ends and every label; ScrollTrigger re-measures after. */
    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(main);

    return () => {
      ro.disconnect();
      mm.revert();
      spine.remove();
      made.forEach(({ s, label }) => {
        label.remove();
        s.classList.remove('has-marg');
      });
    };
  }, [pathname]);

  return null;
}
