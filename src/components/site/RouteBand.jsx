import React, { useEffect, useRef, useState } from 'react';
import '../../styles/route.css';

/* THE ROUTE, the one route component on the site. Five stops, VERTICAL at
   every width since 2026-09-21 (the user's correction): the line runs down
   the left through the five stops, and beside each stop sits its numeral in
   Moldie at 96px, its title, and, where the mount gives one, its line.

   Home's "How it works" on the drifting ground with nothing painted and
   128px either side; /services' "How every project runs" on cream; About's
   "How it goes" on the dark ground.

   `ground`   'cream' or 'dark'. On dark the line is yellow and a numeral is
              steel-lift at rest and white when reached; on cream the line is
              asphalt (yellow is 1.66:1 on cream) and a numeral is steel at
              rest and asphalt when reached.
   `open`     home: no section edge of its own, 128px above and below.
   `lines`    optional, one line under each stop's title. Home carries the
              retired Process's four step descriptions under stops 01 to 04
              and the user's line under stop 05.

   THE LINE DRAWS ON SCROLL, scrubbed: its length follows the reading line
   (60% down the viewport) through the route, transform only, and what has
   been drawn stays drawn. A stop is REACHED when its numeral crosses the same
   line, and stays reached. Reduced
   motion: the line is drawn in full and every stop is reached.

   The five stops are the About brief's, the user's own copy. */

const STOPS = [
  ['01', 'A call, not a pitch'],
  ['02', 'We design it and show you'],
  ['03', 'We build and test it'],
  ['04', 'It goes live on your domain'],
  ['05', "Thirty days of support, then it's yours"],
];

const READ = 0.6; // the reading line, as a share of the viewport height

export default function RouteBand({ id, heading, ground = 'cream', open = false, lines }) {
  const listRef = useRef(null);
  const stopRefs = useRef([]);
  const [reached, setReached] = useState(0);
  const [drawn, setDrawn] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const y = window.innerHeight * READ;
      const r = list.getBoundingClientRect();
      /* Where the line stops: the last numeral's centre, measured from the
         list's bottom, because the last stop's height depends on its line. */
      const n = list.querySelector('.route__stop:last-child .route__n');
      if (n) {
        const nr = n.getBoundingClientRect();
        list.style.setProperty('--line-end', `${r.bottom - (nr.top + nr.height / 2)}px`);
      }
      if (reduce) {
        setDrawn(1);
        setReached(STOPS.length);
        return;
      }
      /* Drawn stays drawn, like a reached stop: scrolling back up does not
         take the line back past a stop that is already lit. */
      const d = Math.max(0, Math.min(1, (y - r.top) / (r.height || 1)));
      setDrawn((prev) => Math.max(prev, d));
      let k = 0;
      stopRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= y) k = i + 1;
      });
      /* Reached stays reached: scrolling back up does not un-light a stop. */
      setReached((prev) => Math.max(prev, k));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    /* The webfonts change every stop's height when they land. */
    if (document.fonts) document.fonts.ready.then(onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const colour = ground === 'cream' ? ' colour-band' : '';
  const spacing = open ? ' route-band--open' : '';

  return (
    <section
      className={`vt route-band route-band--${ground}${spacing}${colour}`}
      aria-labelledby={id}
    >
      <div className="route-band__in">
        <h2 className="route-band__h" id={id}>
          {heading}
        </h2>

        <ol className="route" ref={listRef} style={{ '--drawn': drawn }}>
          {STOPS.map(([n, title], i) => (
            <li
              className="route__stop"
              key={n}
              ref={(el) => {
                stopRefs.current[i] = el;
              }}
              data-reached={i < reached ? 'true' : 'false'}
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
