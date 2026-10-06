import React from 'react';
import { REAL_WORK, MIN_WORK } from '../../content/work.js';
import './work-tiles.css';

/* RECENT WORK, AS TILES (the founder's home brief, final25, 2026-10-07). It
   replaced the full-width accordion (WorkAccordion.jsx, deleted).

   Each tile is the live site's real above-the-fold screenshot, 16:10, in
   its own colours, with no overlay and no tint, and under it, on a bone
   bar, the name and the city in 13px. Below 1024 the tiles run full width
   one after another, 12px apart (two to a phone screen); from 1024 three
   across. A tile opens the live site in a new tab.

   The screenshots are fresh 2x captures (.measure/tile-shots.mjs): 800 x
   500 and 1600 x 1000 WebP of the same 1280 x 800 view, lazy, with their
   size set, so they cost home's first paint nothing. The section renders
   nothing until three entries show (BUILD-LAW Truth). */
export default function WorkTiles() {
  if (REAL_WORK.length < MIN_WORK) return null;
  return (
    <section className="vt st-sec st--dark wt" aria-labelledby="wt-h" data-artifact="WorkTiles">
      <div className="st-in">
        <h2 className="st-h" id="wt-h">
          Recent work
        </h2>
        <p className="sec-lead">What the fixes look like when they&apos;re live. Open any of them.</p>
        <ul className="wt__grid">
          {REAL_WORK.map((w) => (
            <li className="wt__item" key={w.slug}>
              <a className="wt__tile" href={w.url} target="_blank" rel="noopener noreferrer">
                <img
                  className="wt__img"
                  src={`/work/tiles/${w.slug}-800.webp`}
                  srcSet={`/work/tiles/${w.slug}-800.webp 800w, /work/tiles/${w.slug}-1600.webp 1600w`}
                  sizes="(min-width: 1024px) 400px, 100vw"
                  width="800"
                  height="500"
                  loading="lazy"
                  decoding="async"
                  alt={`The ${w.name} website, its first screen.`}
                />
                <span className="wt__bar">
                  <span className="wt__name">{w.name}</span>
                  <span className="wt__city">{w.city}</span>
                  <span className="skip-h">, opens the live site in a new tab</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
