import React, { useEffect, useRef, useState } from 'react';
import { COSTS } from '../../content/costs.js';
import './costs-cited.css';

/* HOME, WHAT IT COSTS YOU: CITED NUMBERS, NO ARTIFACT (the founder's
   approved frame C, final15, 2026-10-06). It replaced the lock screen of
   final14 and, before it, the four scenes (CostScenes.jsx, deleted).

   The H2, an 18px lead, then four cells in one row from 1024 (two by two
   below), 2px apart, under one continuous 2px yellow rule (#F2B01E) across
   the top of the row (final16). Each cell: a mono label in steel-lift, the
   figure, a 20px line and a 14px note. The words are content/costs.js.

   NO SOURCE ON THE CELLS (final28, 2026-10-07, the founder): the four
   source lines are deleted. One line under the row, 11px mono, right
   aligned, reads "Industry figures." (the launch gate; it named the years
   2024 to 2025 in final28); the sources are
   recorded in VEXELTECH-COPY.md and in content/costs.js, not on the page.
   The cell light is 5% (it was 10) and the sweep 2% (it was 4).

   LIGHT AND COLOUR, NOT OBJECTS (final19, 2026-10-06, the founder). The
   quantity fields of final18 and their sweep are deleted. The figures are
   #F2B01E; each cell is lit from its top edge, so the rule reads as the
   light; a soft 320px highlight crosses the row every 12s (paused under
   reduced motion); a hovered cell lifts 4px and its light strengthens.
   All of it is costs-cited.css. The figures never count.

   BELOW 1024, A SWIPE ROW (the founder's home brief, final25, 2026-10-07):
   the four cells become 300px cards in a horizontal scroll that snaps,
   16px apart, the first inset 24px and 24px of room after the last, so the
   next card always shows at the edge and the row reads as scrollable. The
   figure is 96px. Dots under the row show where the reader is (6px, bone
   at 30%, the current one yellow); each is a button that brings its card
   in. The row is a focusable region there, so a keyboard can scroll it.
   From 1024 it is the row of four as before. */
const NARROW = '(max-width: 1023px)';

export default function CostsCited() {
  const rowRef = useRef(null);
  const [active, setActive] = useState(0);
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(NARROW).matches);

  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  /* The current card: the one whose start is nearest the row's start. */
  useEffect(() => {
    const el = rowRef.current;
    if (!el || !narrow) return undefined;
    let raf = 0;
    const read = () => {
      raf = 0;
      const cells = [...el.children];
      const x = el.scrollLeft;
      let best = 0;
      cells.forEach((c, i) => {
        if (Math.abs(c.offsetLeft - el.offsetLeft - 24 - x) < Math.abs(cells[best].offsetLeft - el.offsetLeft - 24 - x)) best = i;
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [narrow]);

  const go = (i) => {
    const el = rowRef.current;
    const c = el && el.children[i];
    if (!c) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: c.offsetLeft - el.offsetLeft - 24, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section className="vt st-sec st--dark cc" aria-labelledby="cc-h">
      <div className="st-in">
        <h2 className="st-h" id="cc-h">
          What it costs you
        </h2>
        <p className="sec-lead cc__lead">
          Four leaks most owner-run businesses never see. The numbers are the industry&apos;s, not ours.
        </p>
        <div className="cc__row">
          <ul
            className="cc__grid"
            ref={rowRef}
            {...(narrow ? { tabIndex: 0, 'aria-label': 'What it costs you, four figures. Scroll sideways for the next.' } : {})}
          >
            {COSTS.map(({ id, label, figure, line, note }) => (
              <li className="cc__cell" key={id}>
                <p className="cc__k">{label}</p>
                <p className="cc__n">{figure}</p>
                <h3 className="cc__h">{line}</h3>
                <p className="cc__p">{note}</p>
              </li>
            ))}
          </ul>
          <span className="cc__sweep" aria-hidden="true">
            <span />
          </span>
        </div>
        {narrow ? (
          <div className="cc__dots">
            {COSTS.map(({ id, label }, i) => (
              <button
                type="button"
                className="cc__dot"
                key={id}
                aria-label={`Show ${i + 1} of ${COSTS.length}: ${label}`}
                aria-current={i === active ? 'true' : undefined}
                onClick={() => go(i)}
              >
                <span />
              </button>
            ))}
          </div>
        ) : null}
        <p className="cc__src">Industry figures.</p>
      </div>
    </section>
  );
}
