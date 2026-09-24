import React from 'react';
import Brush from './Brush.jsx';
import '../../styles/promise.css';

/* WHAT WE PROMISE: the yellow band with the $700 figure and the four
   refusals. Built for About (2026-09-16), shared with home from 2026-09-21,
   and HOME'S ALONE since 2026-09-23, when the About rebuild dropped every
   section not on the founder's list. The `ab3-` prefix on its classes is
   history - it meant "About, third version" - and it is left alone rather
   than renamed, because the class names are the only thing binding this
   component to `promise.css` and a rename buys nothing but risk.

   THE FIGURE IS THE BAND'S ONLY OBJECT, 2026-09-22 (the founder). $700 in
   Monigue at 240px is the visual, and the two image slots are gone with the
   `image` prop: `promise.webp` on home and `promise-about.webp` on About were
   both reserving space for files that are not coming, because cost-1 to
   cost-4 and the mascot are the whole of the site's artwork. A typographic
   figure has counted as a band's object since 2026-09-16, so the band rule
   ("a colour band is allowed when objects stand on it") is met by the figure
   alone and the band is not a field.

   EVERY LINE IS THE ABOUT BRIEF'S, which is the user's own copy. */

const REFUSALS = [
  "We don't sell retainers. Thirty days of support are included, after that it's a conversation.",
  "We don't use templates. Every build starts from your business.",
  "We don't hide the price until a call. It's on this site.",
  "We don't keep your files. Domain, hosting, code and credentials move to your name.",
];

export default function PromiseBand({ id }) {
  return (
    <section className="vt ab3-price promise panel-sec" aria-labelledby={id}>
      <div className="promise__in panel">
        <h2 className="promise__h ab3-price__h" id={id}>
          Flat prices, and a short list of things we refuse to do.
        </h2>
        <div className="ab3-price__cols">
          <div className="ab3-price__fig">
            {/* The brush stroke through the figure, 2026-09-25 (life pass 3). */}
            <p className="ab3-price__n">
              <Brush>$700</Brush>
            </p>
            <p className="ab3-price__k">Flat, one time</p>
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
      </div>
    </section>
  );
}
