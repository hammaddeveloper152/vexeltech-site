import React from 'react';
import SectionJoin from './SectionJoin.jsx';
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

/* HOW IT WORKS, final28 (2026-10-07, the founder). The $700 figure, its two
   labels ("Flat, one time", "$299 to $449 for branding"), the heading "Flat
   prices, in writing." and the three "We ..." rows are deleted. The band is
   "How it works" in the display face at the band's heading size, one 18px
   line under it, then the four steps exactly as built. Full-bleed cream,
   no sheet corners, 96px above and below, the content in the 1180
   container (promise.css). The component keeps its name and its `ab3-`
   classes for the reasons above. */
const LINE = 'Fifteen minutes on the phone, a written number, and a site live in four business days.';

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

export default function PromiseBand({ id = 'hiw-h' }) {
  return (
    <section className="vt ab3-price promise promise--hiw panel-sec" aria-labelledby={id} data-artifact="PromiseBand">
      <div className="promise__in panel">
        <SectionJoin />
        <h2 className="promise__h ab3-price__h" id={id}>
          How it works
        </h2>
        <p className="promise__line">{LINE}</p>
        <ol className="pb-steps" id="how-it-works">
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
      </div>
    </section>
  );
}
