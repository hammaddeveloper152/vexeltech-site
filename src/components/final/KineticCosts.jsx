import React, { useEffect, useRef, useState } from 'react';
import { useOnce, prefersReduced } from '../site/useOnce.js';
import './kinetic.css';

/* WHAT IT COSTS YOU, KINETIC TYPE ON A SPINE (the final pass, 2026-10-03).
   It replaced CostRows' two-column grid.

   Four rows stacked at the full content width: the headline in Clash
   Display at 72px (56 from 768 to 1279, 40 below 768), the line under it at
   18px steel-lift, at most 640px.

   THE SPINE: a 1px steel rail down the content column's left edge, from the
   first row to the last, and a yellow segment on it beside whichever row is
   nearest the middle of the viewport. That row's headline is bone, the
   others steel-lift. STEEL-LIFT, NOT STEEL, for the resting headlines: the
   brief named steel, which is 2.4:1 on the dark ground and fails its own
   4.5:1 check; steel-lift is 7.6:1. The change is a crossfade, 300ms: each
   word paints a bone copy over itself (`::after`, from `data-w`, so the
   words are in the document once) and only the copy's opacity
   moves (BUILD-LAW Motion: transform and opacity). The segment moves by
   transform (translateY, and scaleY from a 1px line).

   THE ENTRANCE: each headline's words rise from 24px down, visible
   throughout (final pass 2: an entrance never hides content), 70ms apart (BUILD-LAW's stagger; the brief's 60 was ruled out by
   the founder), when its row is 20% into the viewport. Once (useOnce).
   Reduced motion: every word in place from the start and the bone moves
   with no fade.

   The words are VEXELTECH-COPY.md V3.1's, verbatim. */
const ROWS = [
  {
    id: 'find',
    statement: 'Not found.',
    consequence: "Someone searches for what you do and sees three competitors. You're not one of them.",
  },
  {
    id: 'call',
    statement: 'Ad spend without a cost per lead.',
    consequence: 'Money goes out every month and nobody can say what a lead cost.',
  },
  {
    id: 'miss',
    statement: 'The missed call.',
    consequence: "You're with a customer. The caller dials the next number on the list.",
  },
  {
    id: 'remember',
    statement: 'No name on the work.',
    consequence: "Every job you finish advertises someone else's brand, or nobody's.",
  },
];

function Row({ statement, consequence, on, rowRef }) {
  const ref = useRef(null);
  /* ScrollTrigger says when; the words' own transitions (kinetic.css) say
     how, on the reveal curve. */
  const armed = useOnce(ref, (gsap, el, done) => done(), 'top 80%');
  const words = statement.split(' ');
  return (
    <li
      className="kc__row"
      ref={(n) => {
        ref.current = n;
        rowRef(n);
      }}
      data-on={on ? 'true' : 'false'}
      data-armed={armed ? 'true' : 'false'}
    >
      <h3 className="kc__t">
        {words.map((w, i) => (
          <React.Fragment key={i}>
            <span className="kc__w" data-w={w} style={{ '--i': i }}>
              {w}
            </span>
            {i < words.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </h3>
      <p className="kc__b">{consequence}</p>
    </li>
  );
}

export default function KineticCosts() {
  const rows = useRef([]);
  const segRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let dist = Infinity;
      rows.current.forEach((r, i) => {
        if (!r) return;
        const b = r.getBoundingClientRect();
        const d = Math.abs(b.top + b.height / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setActive(best);
      const r = rows.current[best];
      const seg = segRef.current;
      if (r && seg) seg.style.transform = `translateY(${r.offsetTop}px) scaleY(${r.offsetHeight})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    const ro = new ResizeObserver(on);
    rows.current.forEach((r) => r && ro.observe(r));
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      ro.disconnect();
    };
  }, []);

  return (
    <section className="vt st-sec st--dark kc" aria-labelledby="kc-h" data-still={prefersReduced() ? 'true' : 'false'}>
      <div className="st-in">
        <h2 className="st-h" id="kc-h">
          What it costs you
        </h2>
        <div className="kc__body">
          <span className="kc__rail" aria-hidden="true">
            <span className="kc__seg" ref={segRef} />
          </span>
          <ol className="kc__rows">
          {ROWS.map(({ id, statement, consequence }, i) => (
            <Row
              key={id}
              statement={statement}
              consequence={consequence}
              on={i === active}
              rowRef={(n) => {
                rows.current[i] = n;
              }}
            />
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
