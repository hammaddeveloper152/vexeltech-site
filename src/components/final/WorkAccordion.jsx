import React, { useRef, useState } from 'react';
import { REAL_WORK, MIN_WORK } from '../../content/work.js';
import './accordion.css';

/* RECENT WORK, A FULL-WIDTH ACCORDION (the final pass, 2026-10-03). It
   replaced the drag track, its DRAG disc and its rail.

   SIX PANELS IN ONE ROW, edge to edge across the viewport, 2px apart on
   black, the row 620px tall from 1280 and 520 from 1024. A resting panel
   grows 1, the active one 4; the first is active to start. A mouse sets the
   active panel by hovering, a touch by tapping (a tap on the active panel
   follows its link), the arrow keys move it when a panel has focus, and
   focus itself sets it. The panels change size by flex-grow over 600ms,
   cubic-bezier(.2,.7,.2,1): the one width animation on the site, ruled by
   the founder and recorded in BUILD-LAW Motion. The row's height is fixed,
   so nothing around it moves.

   EACH PANEL is its site's capture, centred, at the active panel's width
   whichever panel it is in, so it never rescales while the row moves. The
   active panel's capture scrolls up the page and back, 12s each way,
   linear, by transform, so the site reads as live; the captures are three
   viewports tall for this (.measure/work-shots.mjs). A resting panel is
   dimmed by a black layer at 45% (the capture at 55%).

   THE CAPTION, bottom left at 24px: in the active panel the name at 22px in
   bone and the sector and city in mono 11px steel-lift, over a scrim from
   the foot; in a resting panel the name alone at 16px, turned to read from
   the foot up along the left edge, over a darker strip there. The whole
   panel is one link to the live site, in a new tab.

   BELOW 1024 the panels stack: each 220px tall, the active 360, tap to
   open, by flex-grow in a column of fixed height. A resting panel's name
   reads across there, not up: a stacked panel is wider than it is tall.

   Reduced motion: the panels change size with no transition, the capture
   stands at the top of the page, the captions change with no fade.

   THE SECTION RENDERS NOTHING with fewer than three entries (BUILD-LAW
   Truth, Real over drawn). */
const fine = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export default function WorkAccordion() {
  const [active, setActive] = useState(0);
  const links = useRef([]);

  if (REAL_WORK.length < MIN_WORK) return null;

  const onKeyDown = (e) => {
    const next = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!next) return;
    e.preventDefault();
    const i = (active + next + REAL_WORK.length) % REAL_WORK.length;
    setActive(i);
    if (links.current[i]) links.current[i].focus();
  };

  return (
    <section className="vt st-sec st--dark wa" aria-labelledby="wa-h">
      <div className="st-in wa__head">
        <h2 className="st-h" id="wa-h">
          Recent work
        </h2>
      </div>

      <ul className="wa__row" onKeyDown={onKeyDown}>
        {REAL_WORK.map((w, i) => {
          const on = i === active;
          return (
            <li className="wa__panel" key={w.slug} data-on={on ? 'true' : 'false'} onPointerEnter={() => fine() && setActive(i)}>
              <a
                className="wa__link"
                href={w.url}
                target="_blank"
                rel="noopener"
                ref={(n) => {
                  links.current[i] = n;
                }}
                onFocus={(e) => {
                  /* Keyboard focus only: a tap focuses the link before
                     its click, and would make the first tap open the
                     site. */
                  if (e.currentTarget.matches(':focus-visible')) setActive(i);
                }}
                onClick={(e) => {
                  /* A touch: the first tap opens the panel, the next its
                     site. */
                  if (!on && !fine()) {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
              >
                <span className="wa__shot">
                  <img
                    src={`/work/${w.slug}-720.jpg`}
                    srcSet={`/work/${w.slug}-720.jpg 720w, /work/${w.slug}.jpg 1440w`}
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    alt={`${w.name}, the live site`}
                    width="1440"
                    height="2700"
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                </span>
                <span className="wa__cap">
                  <span className="wa__name">{w.name}</span>
                  <span className="wa__where">
                    {w.industry}, {w.city}
                  </span>
                </span>
                <span className="wa__side" aria-hidden="true">
                  {w.name}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="st-in">
        <p className="st-lead wa__foot">Six live sites. Open any of them.</p>
      </div>
    </section>
  );
}
