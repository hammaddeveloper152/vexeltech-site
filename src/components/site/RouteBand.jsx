import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/route.css';

gsap.registerPlugin(ScrollTrigger);

/* THE ROUTE, HOME'S DEVICE (2026-09-21, by the user: it appears once on the
   site). Five stops, vertical: the line runs down the left through the five
   stops, and beside each sits its numeral in Moldie, its title and its line.
   It stands on the drift at its darkest with 128px either side and nothing
   painted.

   THE LINE IS A SCROLLTRIGGER SCRUB, 2026-09-23 (the founder). It draws from
   the section's top at 70% of the viewport to its bottom at 30%, driving
   `--drawn` from 0 to 1. A NUMERAL RESTS IN STEEL-LIFT and turns machine
   yellow the moment the drawn line reaches ITS OWN DOT, and stays yellow.

   WHY A SCRUB RATHER THAN THE SCROLL LISTENER IT REPLACED. The old version
   read `getBoundingClientRect` on every scroll event and set React state, so
   the line's progress was a render and the whole section re-rendered down the
   page. Worse, it took its own reading of the scroll position while Lenis was
   easing toward a different one, so the line lagged the page by however much
   smoothing was left to run. ScrollTrigger is already driven by Lenis in
   `smoothScroll.js` - `lenis.on('scroll', ScrollTrigger.update)` with
   `gsap.ticker` driving `lenis.raf` - so a scrub reads the same clock as
   everything else that moves.

   NOTHING HERE IS REACT STATE. The scrub writes `--drawn` and the reached
   flags straight to the DOM. At 60fps a scrubbed value is a per-frame write,
   and a per-frame `setState` on a section this tall is a re-render budget
   nothing else on the page spends.

   WHERE A STOP LIGHTS, derived rather than guessed: the line spans the FIRST
   dot's centre to the LAST dot's centre, so stop i lights at
   `(top_i - top_0) / (top_last - top_0)` of the drawn length. It is measured
   from layout on refresh, so the webfonts landing late cannot leave it wrong -
   the same defect BUILD-LAW records against every scroll-driven start on
   this page.

   Reduced motion: the line is drawn in full and every stop is lit, with no
   trigger created at all.

   The five stops are the About brief's, the user's own copy; the five lines
   are the retired Process's four and the user's line for stop 05. */

const STOPS = [
  ['01', 'A call, not a pitch'],
  ['02', 'We design it and show you'],
  ['03', 'We build and test it'],
  ['04', 'It goes live on your domain'],
  ['05', "Thirty days of support, then it's yours"],
];

export default function RouteBand({ id, heading, lines }) {
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const stopRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return undefined;

    const stops = stopRefs.current.filter(Boolean);
    const light = (n) => stops.forEach((el, i) => el.setAttribute('data-reached', i < n ? 'true' : 'false'));

    /* The line stops at the LAST numeral's centre, measured from the list's
       bottom, because the last stop's height depends on its own line. */
    const measureEnd = () => {
      const last = list.querySelector('.route__stop:last-child .route__n');
      if (!last) return;
      const r = list.getBoundingClientRect();
      const nr = last.getBoundingClientRect();
      list.style.setProperty('--line-end', `${r.bottom - (nr.top + nr.height / 2)}px`);
    };

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      measureEnd();
      list.style.setProperty('--drawn', '1');
      light(stops.length);
      return undefined;
    }

    /* Where each dot sits along the drawn line, as a share of it. */
    let marks = [];
    const measureMarks = () => {
      measureEnd();
      if (stops.length < 2) {
        marks = stops.map(() => 0);
        return;
      }
      const tops = stops.map((el) => el.getBoundingClientRect().top);
      const span = tops[tops.length - 1] - tops[0];
      marks = tops.map((t) => (span > 0 ? (t - tops[0]) / span : 0));
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: true,
        /* Re-derived on every refresh, so a late webfont cannot leave the
           marks measured against a layout no reader sees. */
        onRefresh: measureMarks,
        onUpdate: (self) => {
          const d = self.progress;
          list.style.setProperty('--drawn', String(d));
          /* Reached stays reached: the line is what moves back, not the
             numerals. A stop that has been lit is a stop the reader has
             passed, and un-lighting it on the way up would say otherwise. */
          let n = 0;
          for (let i = 0; i < marks.length; i += 1) if (d >= marks[i]) n = i + 1;
          const now = stops.filter((el) => el.getAttribute('data-reached') === 'true').length;
          if (n > now) light(n);
        },
      });
    }, section);

    measureMarks();
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="vt route-band route-band--open"
      aria-labelledby={id}
      ref={sectionRef}
    >
      <div className="route-band__in">
        <h2 className="route-band__h" id={id}>
          {heading}
        </h2>

        <ol className="route" ref={listRef}>
          {STOPS.map(([n, title], i) => (
            <li
              className="route__stop"
              key={n}
              ref={(el) => {
                stopRefs.current[i] = el;
              }}
              data-reached="false"
            >
              <span className="route__n" aria-hidden="true">
                {n}
              </span>
              <span className="route__body">
                <span className="route__t">{title}</span>
                {lines && lines[i] ? <span className="route__d">{lines[i]}</span> : null}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
