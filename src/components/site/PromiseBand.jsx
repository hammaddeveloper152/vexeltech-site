import React from 'react';
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

/* COPY V2, 2026-10-01: V2 writes this band under About ("Flat prices
   band"); the band lives on home, so its copy is applied here, the one
   place it renders (DESIGN.md, COPY V2). V2.1 drops the first refusal, so
   three. */
/* THE FOUNDER'S DECISIONS AFTER THE FINAL AUDIT (final23, 2026-10-06):
   the three refusals are written as what we do, the same facts; "It's on
   this site." is gone, and so is the heading's "three things we don't
   do". */
const REFUSALS = [
  'We show the price before the first call.',
  'We hand over your files. Domain, hosting, code and credentials move to your name.',
  'We price branding and websites once, with no retainer. Marketing is month to month.',
];

/* THE FOUR STEPS (the founder's home brief, final25, 2026-10-07): How it
   works, folded into this band as one row under the price. A 32px mono
   numeral, a 15px bold title (the brief's: Call, Approve, Launch, Own) and
   one 13px line under twelve words, from the old steps; the fourth was cut
   from 13 words to its first sentence. Four across from 1024, two by two
   below, four deep below 600. The row keeps the #how-it-works anchor. */
const STEPS = [
  ['Call', "Fifteen minutes. Your business, your market, what's not working."],
  ['Approve', 'Logo concepts or the site design, shown before anything is billed.'],
  ['Launch', 'Four business days for a website. One to two for branding.'],
  ['Own', 'Domain, hosting, files and code in your name.'],
];

export default function PromiseBand({ id, lead, steps = false }) {
  return (
    <section className="vt ab3-price promise panel-sec" aria-labelledby={id} data-artifact="PromiseBand">
      <div className="promise__in panel">
        <h2 className="promise__h ab3-price__h" id={id}>
          Flat prices, in writing.
        </h2>
        {lead ? <p className="sec-lead">{lead}</p> : null}
        <div className="ab3-price__cols">
          <div className="ab3-price__fig">
            {/* The brush stroke through the figure came off (the storytelling pass, 2026-10-01: the swash is home's "Yet." and one word per page, nothing else). */}
            <p className="ab3-price__n">$700</p>
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
        {steps ? (
          <ol className="pb-steps" id="how-it-works" aria-label="How it works">
            {STEPS.map(([title, line], i) => (
              <li className="pb-steps__i" key={title}>
                <span className="pb-steps__n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="pb-steps__t">{title}</h3>
                <p className="pb-steps__l">{line}</p>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}
