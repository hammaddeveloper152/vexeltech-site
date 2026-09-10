import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Process.css';

/* Section 7. One drawn diagram.

   ---- The four steps, written 2026-09-08 --------------------------------

   The user's process, from content answers 3.1 to 3.4, one answer per step
   and in the user's order. Nothing is added and nothing is reordered.

   | Step | Source |
   |---|---|
   | 01 | 3.1 — a booked meeting with a professional, most probably a brand strategist, a complete discovery of 30 minutes, their problem and what they are looking for |
   | 02 | 3.2 — onboarding, research, the design phase for branding and the UI/UX phase for the website |
   | 03 | 3.3 — development and QA and launch |
   | 04 | 3.4 — handover the digital assets, 100% ownership, we will be just the design or IT partners |

   Budgets: titles under 30 characters, bodies about 120. Measured, they run
   18 / 21 / 20 / 22 and 114 / 112 / 116 / 117. The titles set in Monigue at
   the small loud step and are uppercased by the register, so the character
   count is what keeps each one on its line.

   ---- The turnaround, settled 2026-09-08 --------------------------------

   THE WEBSITE IS FOUR BUSINESS DAYS, and step 03 says so. It was held out
   of this page while 7.2's four business days and 2.2 and 3.5's "within
   weeks" were unreconciled; the user settled it in favour of 7.2, and
   "within weeks" is not used anywhere on this site.

   3.5's OTHER two figures are still not here: a custom logo within 24 hours
   and branding within 5 business days. They are unambiguous and could be
   written, and they are held back on composition rather than on truth —
   three clocks in one four-step sequence is three durations for a reader to
   reconcile, and the build one is the one this page is about. Which of them
   belongs on the homepage is a content decision, not a build one.

   3.6 is blank in the source. There is no fifth step and none is invented. */
const STEPS = [
  {
    id: 'one',
    n: '01',
    title: 'A call, not a pitch',
    body: "Thirty minutes with a brand strategist. You tell us what's wrong and what you're after, and we listen before we price anything.",
  },
  {
    id: 'two',
    n: '02',
    title: 'Then we design it',
    body: 'Onboarding and research first, then design starts: the brand work for branding, the UI and UX for the site.',
  },
  {
    id: 'three',
    n: '03',
    title: 'We build and test it',
    body: "Four business days to build it, then testing. You look at it and tell us what to change, as many times as it takes.",
  },
  {
    id: 'four',
    n: '04',
    title: 'You own it outright',
    body: "It moves to your hosting, with every credential and the ownership under your name. You own everything you paid for.",
  },
];

export default function Process() {
  const trackRef = useRef(null);
  const listRef = useRef(null);
  const svgRef = useRef(null);
  const railRef = useRef(null);
  const litRef = useRef(null);
  const passedRef = useRef(null);
  const strikeRefs = useRef([]);
  const edgeRefs = useRef([]);
  /* Where along the path each step is reached, as a fraction of total length.
     Written by measure(), read by light(). */
  const marks = useRef([]);

  useEffect(() => {
    const track = trackRef.current;
    const list = listRef.current;
    const svg = svgRef.current;
    const rail = railRef.current;
    const lit = litRef.current;
    const passed = passedRef.current;
    if (!track || !list || !svg || !rail || !lit || !passed) return undefined;

    const steps = () => Array.from(list.querySelectorAll('.process__step'));

    /* Build the route from where the cards actually are.

       Every coordinate comes off a live getBoundingClientRect, and the whole
       route is rebuilt on every ScrollTrigger refresh. Hardcoding any of it
       would put the path where the cards are not, the moment the viewport
       changes, the fonts settle, or a description wraps one line further. */
    const measure = () => {
      const tb = track.getBoundingClientRect();
      const W = Math.round(tb.width);
      const H = Math.round(tb.height);
      if (!W || !H) return 0;

      const zigzag = window.matchMedia('(min-width: 768px)').matches;
      /* The spine. Down the middle when the cards alternate around it, down
         the left when they are stacked to its right. */
      const spine = zigzag ? Math.round(W / 2) : 0.5;

      const points = [[spine, 0]];
      const arrivals = [];
      const strikes = [];
      const edges = [];

      steps().forEach((step, i) => {
        const sb = step.getBoundingClientRect();
        const nb = step.querySelector('.process__n').getBoundingClientRect();
        const bottom = sb.bottom - tb.top;
        /* The path arrives where the numeral sits, so the line reaches the
           number rather than the box. */
        const arriveY = nb.top - tb.top + nb.height / 2;

        if (!zigzag) {
          points.push([spine, arriveY]);
          arrivals.push(points.length - 1);
          const nl = nb.left - tb.left;
          const nr = nb.right - tb.left;
          /* Stacked, the route runs down the left and the numeral sits beside
             it, so there is no crossing to brighten. */
          strikes.push(nl <= spine && spine <= nr
            ? `M ${nl.toFixed(1)} ${arriveY.toFixed(1)} L ${nr.toFixed(1)} ${arriveY.toFixed(1)}`
            : '');
          edges.push(''); // stacked, the rail is beside the card, not on it
          return;
        }

        /* The card edge facing the spine. It alternates with the zigzag, and
           it is the edge the hairline runs along. */
        const innerX = i % 2 === 0 ? sb.right - tb.left : sb.left - tb.left;

        points.push([spine, arriveY]); // down the spine
        points.push([innerX, arriveY]); // out to the card, at the numeral
        arrivals.push(points.length - 1);
        points.push([innerX, bottom]); // along its edge
        points.push([spine, bottom]); // back to the spine

        /* The stretch of the horizontal run that actually passes through the
           numeral. This is the brightest point on the path, so it is measured
           from where the glyph really is rather than assumed to be the whole
           run. */
        const nl = nb.left - tb.left;
        const nr = nb.right - tb.left;
        const a = Math.max(Math.min(spine, innerX), nl);
        const b = Math.min(Math.max(spine, innerX), nr);
        strikes.push(b > a ? `M ${a.toFixed(1)} ${arriveY.toFixed(1)} L ${b.toFixed(1)} ${arriveY.toFixed(1)}` : '');

        /* The card's own edge, as its own stroke. It is already part of the
           route, but the route only reaches it after it has passed the
           numeral, so on the route alone the edge lights a beat behind the
           step it belongs to. Carrying it on the step's own lit state is what
           makes the card read as one thing lighting rather than a numeral
           lighting and an edge catching up. */
        edges.push(`M ${innerX.toFixed(1)} ${arriveY.toFixed(1)} L ${innerX.toFixed(1)} ${bottom.toFixed(1)}`);
      });

      points.push([spine, H]);

      const d = points
        .map(([x, y], i) => (i ? 'L' : 'M') + ' ' + x.toFixed(1) + ' ' + y.toFixed(1))
        .join(' ');

      rail.setAttribute('d', d);
      lit.setAttribute('d', d);
      passed.setAttribute('d', d);
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

      strikeRefs.current.forEach((el, i) => {
        if (el) el.setAttribute('d', strikes[i] || '');
      });

      edgeRefs.current.forEach((el, i) => {
        if (el) el.setAttribute('d', edges[i] || '');
      });

      const total = lit.getTotalLength();
      lit.style.strokeDasharray = String(total);
      passed.style.strokeDasharray = String(total);

      /* Where each arrival falls along the path, measured by walking the same
         point list rather than guessed from a card height. */
      let run = 0;
      const at = [];
      for (let i = 1; i < points.length; i += 1) {
        const prev = points[i - 1];
        const cur = points[i];
        run += Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
        if (arrivals.indexOf(i) !== -1) at.push(run / total);
      }
      marks.current = at;
      return total;
    };

    const light = (p) => {
      steps().forEach((step, i) => {
        const mark = marks.current[i];
        const on = mark !== undefined && p >= mark;
        step.dataset.lit = on ? 'true' : 'false';
        const strike = strikeRefs.current[i];
        if (strike) strike.dataset.lit = on ? 'true' : 'false';
        const edge = edgeRefs.current[i];
        if (edge) edge.dataset.lit = on ? 'true' : 'false';
      });
    };

    const draw = (p) => {
      const total = lit.getTotalLength();
      lit.style.strokeDashoffset = String(total * (1 - p));

      /* The passed route holds at the last step actually reached rather than
         tracking the reader continuously. That is what makes the line behind
         them read as progress that has happened instead of a uniform stroke
         that happens to be longer. */
      const reached = marks.current.filter((m) => p >= m);
      const held = reached.length ? Math.max(...reached) : 0;
      passed.style.strokeDashoffset = String(total * (1 - held));

      light(p);
    };

    measure();

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const st = ScrollTrigger.create({
        trigger: list,
        start: 'top 70%',
        end: 'bottom 80%',
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          measure();
          draw(self.progress);
        },
        /* stroke-dashoffset: the named path-drawing exception. A route that
           turns cannot be drawn by transform, and a mask sweeps one way while
           this one goes several. */
        onUpdate: (self) => draw(self.progress),
      });

      draw(0);

      return () => {
        st.kill();
        draw(1);
      };
    });

    /* Reduced motion: the diagram is simply drawn. There is no gentler
       version of a line drawing itself, so it is switched off rather than
       slowed and every step is lit from the first paint. */
    mm.add('(prefers-reduced-motion: reduce)', () => {
      draw(1);
      return undefined;
    });

    const onResize = () => {
      measure();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      mm.revert();
    };
  }, []);

  return (
    <section className="vt process" aria-labelledby="process-h">
      <div className="process__inner">
        <h2 className="process__h" id="process-h">
          How it works
        </h2>

        <div className="process__track" ref={trackRef}>
          {/* One route, stroked twice: a static hairline that gives every
              card its edge before anything is drawn, and the accent stroke
              that draws over it. There is no separate card border, because
              the point is that this reads as one diagram rather than four
              boxes with a line behind them. */}
          <svg
            className="process__svg"
            ref={svgRef}
            aria-hidden="true"
            focusable="false"
            preserveAspectRatio="none"
          >
            <path className="process__rail" ref={railRef} />
            {/* The route ahead of the reader, then the stretch behind them
                held at full strength, then the crossing through each numeral,
                which is the brightest point on the path. */}
            <path className="process__lit" ref={litRef} />
            <path className="process__passed" ref={passedRef} />
            {STEPS.map(({ id }, i) => (
              <path
                className="process__edge"
                key={`edge-${id}`}
                data-lit="false"
                ref={(el) => {
                  edgeRefs.current[i] = el;
                }}
              />
            ))}
            {STEPS.map(({ id }, i) => (
              <path
                className="process__strike"
                key={`strike-${id}`}
                data-lit="false"
                ref={(el) => {
                  strikeRefs.current[i] = el;
                }}
              />
            ))}
          </svg>

          <ol className="process__steps" ref={listRef}>
            {STEPS.map(({ id, n, title, body }, i) => (
              /* --row gives each card its own grid row. Without it,
                 auto-placement fills row one with cards one and two side by
                 side and the zigzag is just a two-column grid. */
              <li
                className="process__step"
                key={id}
                data-lit="false"
                style={{ '--row': i + 1 }}
              >
                {/* No icon. The numeral is the visual object, per Plate 04,
                    and a mark beside it would only say "this is a step" over
                    something a numeral in a sequence already says. See
                    DESIGN.md Iconography.

                    Two copies, crossfaded. The numeral lifts from muted to
                    full white on opacity alone, so no colour is animated and
                    no new value had to be invented for the muted state: it is
                    steel-dark, the system's own secondary. */}
                <span className="process__n" aria-hidden="true">
                  <span className="process__n-muted">{n}</span>
                  <span className="process__n-lit">{n}</span>
                </span>

                <div className="process__body">
                  {/* The title crossfades the same way the numeral does, two
                      copies in one cell. Both of its states clear their
                      contrast bar; a single element dimmed by opacity would
                      not.

                      Only one of the two copies is in the accessibility
                      tree. The pair is a paint trick — two glyph sets in one
                      grid cell swapping opacity — and to a screen reader it
                      was two headings' worth of text, so every step title was
                      announced twice. The numeral above hides both its copies
                      on the wrapper and this was missed on the way past.

                      The muted copy is the one that stays: it is the copy
                      that is present before the route reaches the step, both
                      carry identical text, and opacity leaves an element in
                      the tree, so the name never empties when the step
                      lights. */}
                  <h3 className="process__t">
                    <span className="process__t-muted">{title}</span>
                    <span className="process__t-lit" aria-hidden="true">
                      {title}
                    </span>
                  </h3>
                  <p className="process__d">
                    <span className="process__d-muted">{body}</span>
                    <span className="process__d-lit" aria-hidden="true">
                      {body}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
