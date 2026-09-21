import React from 'react';
import '../../styles/route.css';

/* THE ROUTE BAND: five stops on one drawn line, on cream. About's "How it
   goes" and, since 2026-09-21, /services' "How every project runs". The five
   stops are the About brief's, the user's own copy. */

const STOPS = [
  ['01', 'A call, not a pitch'],
  ['02', 'We design it and show you'],
  ['03', 'We build and test it'],
  ['04', 'It goes live on your domain'],
  ['05', "Thirty days of support, then it's yours"],
];

export default function RouteBand({ id, heading }) {
  return (
    <section className="vt route-band" aria-labelledby={id}>
      <div className="route-band__in">
        <h2 className="route-band__h" id={id}>
          {heading}
        </h2>
        <ol className="route">
          {STOPS.map(([n, line]) => (
            <li className="route__stop" key={n}>
              <span className="route__n" aria-hidden="true">
                {n}
              </span>
              <span className="route__t">{line}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
