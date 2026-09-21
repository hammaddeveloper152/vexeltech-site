import React from 'react';
import Character from './Character.jsx';
import '../../styles/promise.css';

/* WHAT WE PROMISE: the yellow band with the $700 figure and the four
   refusals. Built for About (2026-09-16) and shared with home since the
   storyboard pass, 2026-09-21: one component, identical copy, by the user.

   The figure is the band's object (a typographic figure counts, by the
   user's decision of 2026-09-16), and P5 with the keys stands in the band's
   bottom-right corner, feet on its bottom edge. The slot renders nothing
   until `character-5.webp` exists.

   EVERY LINE IS THE ABOUT BRIEF'S, which is the user's own copy. */

const REFUSALS = [
  "We don't sell retainers. Thirty days of support are included, after that it's a conversation.",
  "We don't use templates. Every build starts from your business.",
  "We don't hide the price until a call. It's on this site.",
  "We don't keep your files. Domain, hosting, code and credentials move to your name.",
];

export default function PromiseBand({ id }) {
  return (
    <section className="vt ab3-price promise colour-band" aria-labelledby={id}>
      <div className="promise__in">
        <h2 className="promise__h ab3-price__h" id={id}>
          Flat prices, and a short list of things we refuse to do.
        </h2>
        <div className="ab3-price__cols">
          <div className="ab3-price__fig">
            <p className="ab3-price__n">$700</p>
            <p className="ab3-price__k">flat, one time</p>
            <p className="ab3-price__k">$299 to $449 for branding</p>
          </div>
          <ul className="ab3-price__refuse">
            {REFUSALS.map((line) => (
              <li className="ab3-price__r" key={line}>
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="promise__cast">
          <Character pose={5} className="promise__char" />
        </div>
      </div>
    </section>
  );
}
