import React, { useEffect, useRef, useState } from 'react';
import '../../styles/route.css';

/* THE ROUTE, HOME'S DEVICE (2026-09-21, by the user: it appears once on the
   site). Five stops, vertical: the line runs down the left through the five
   stops, and beside each sits its numeral in Moldie, its title and its line.
   It stands on the drift at its darkest with 128px either side and nothing
   painted. /services and About carried it until the same day; /services now
   says it in its strips, About in four short lines.

   THE NUMERAL IS THE STOP'S OBJECT, 2026-09-22 (the founder): Moldie 01 to
   05 at 96px, machine yellow, beside the title at every width. The five
   `route-1` to `route-5.webp` slots are GONE with their column — cost-1 to
   cost-4 and the mascot are the only artwork on the site, so a slot nothing
   will ever fill is not a reservation, it is a hole. The line and a reached
   stop stay yellow; the numeral no longer changes colour on arrival, because
   it is the accent already.

   THE ROUTE IS NUMERALS AND THE LINE ONLY (the founder, 2026-09-22). The
   mascot stood at stop 03 for part of that day and came off: at 320px it was
   504px tall against roughly 100px of copy, so it drove its own stop's row
   height and left a ~380px hole between stop 03 and stop 04. The route's
   whole job is an even rhythm down a drawn line. It moved to Get in touch,
   where a tall object has a form beside it to measure against.

   THE LINE DRAWS ON SCROLL, scrubbed: its length follows the reading line
   (60% down the viewport) through the route, transform only, and what has
   been drawn stays drawn. A stop is REACHED when its numeral crosses the same
   line, and stays reached. Reduced motion: the line is drawn in full and
   every stop is reached.

   The five stops are the About brief's, the user's own copy; the five lines
   are the retired Process's four and the user's line for stop 05. */

const STOPS = [
  ['01', 'A call, not a pitch'],
  ['02', 'We design it and show you'],
  ['03', 'We build and test it'],
  ['04', 'It goes live on your domain'],
  ['05', "Thirty days of support, then it's yours"],
];

const READ = 0.6; // the reading line, as a share of the viewport height

export default function RouteBand({ id, heading, lines }) {
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

  return (
    <section
      className="vt route-band route-band--open"
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
