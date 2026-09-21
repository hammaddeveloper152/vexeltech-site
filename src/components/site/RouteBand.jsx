import React from 'react';
import { useReveal } from '../home/hooks.js';
import '../../styles/route.css';

/* THE ROUTE, the one route component on the site (storyboard, 2026-09-21).

   Five stops on one drawn line, on every page that shows how a project runs:
   home's "How it works" on the glass band, /services' "How every project
   runs" on cream, About's "How it goes" on the dark ground. Home's Process
   component was retired into this one.

   `ground`   'cream' or 'dark'. The line is yellow on dark and asphalt on
              cream, where machine yellow is 1.66:1.
   `material` 'glass' puts the dark route on the glass band (home only).
   `lines`    optional, one line under each of the first stops. Home carries
              the four step descriptions from the retired Process here.

   THE LINE DRAWS ON SCROLL: it scales from its start to its end on the reveal
   curve when the route arrives (transform only), and the stops follow it at
   the 70ms stagger. Reduced motion: the line is drawn, the stops fade.

   The five stops are the About brief's, the user's own copy. */

const STOPS = [
  ['01', 'A call, not a pitch'],
  ['02', 'We design it and show you'],
  ['03', 'We build and test it'],
  ['04', 'It goes live on your domain'],
  ['05', "Thirty days of support, then it's yours"],
];

export default function RouteBand({ id, heading, ground = 'cream', material, lines }) {
  const [ref, drawn] = useReveal();
  const band = material ? ` band band-${material}` : '';
  const colour = ground === 'cream' ? ' colour-band' : '';

  return (
    <section
      className={`vt route-band route-band--${ground}${band}${colour}`}
      aria-labelledby={id}
    >
      <div className="route-band__in">
        <h2 className="route-band__h" id={id}>
          {heading}
        </h2>


        <ol className="route" ref={ref} data-drawn={drawn ? 'true' : 'false'}>
          {STOPS.map(([n, title], i) => (
            <li className="route__stop" key={n} style={{ '--i': i }}>
              <span className="route__n" aria-hidden="true">
                {n}
              </span>
              <span className="route__t">{title}</span>
              {lines && lines[i] ? <span className="route__d">{lines[i]}</span> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
