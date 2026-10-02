import React from 'react';
import YearRail from '../final/YearRail.jsx';
import './story.css';

/* WHERE WE COME FROM, AS TYPE (the founder's six fixes, 2026-10-02). The
   isometric scenes, their tiles and their generator are deleted. One
   measured column, at most 760px, on the content column's left edge: three
   paragraphs in the display face at 26px / 1.35 in asphalt, each under its
   own mono 11px label in deep amber (4.82:1 on cream), 40px apart, a 1px
   rule above the first and below the last.

   The words are VEXELTECH-COPY.md V3.1's, About, Where we come from: the
   label is the stop's numeral and title, the paragraph its line. */
const STORIES = [
  {
    k: '01 The ads',
    p: 'We started as a paid media team running Google and Meta campaigns for small businesses. Most of the spend died on the page after the click.',
  },
  {
    k: '02 The build',
    p: 'So we built the pages, then the whole site, then the follow-up that runs after the call.',
  },
  {
    k: '03 The whole thing',
    p: "VexelTech, 2026. Branding, website, marketing and automation from one team at flat prices, for businesses that can't carry four vendors.",
  },
];

export default function OriginStory() {
  return (
    <section className="vt st-sec st--light os" aria-labelledby="os-h">
      <div className="st-in">
        <h2 className="st-h" id="os-h">
          Where we come from
        </h2>
        {/* The year rail (the final pass, 2026-10-03). */}
        <YearRail />
        <ol className="os__list">
          {STORIES.map(({ k, p }) => (
            <li className="os__item" key={k}>
              <p className="os__k">{k}</p>
              <p className="os__p">{p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
