import React from 'react';
import { COSTS } from '../../content/costs.js';
import './costs-cited.css';

/* HOME, WHAT IT COSTS YOU: CITED NUMBERS, NO ARTIFACT (the founder's
   approved frame C, final15, 2026-10-06). It replaced the lock screen of
   final14 and, before it, the four scenes (CostScenes.jsx, deleted).

   The H2, an 18px lead, then four cells in one row from 1024 (two by two
   below), 2px apart, under one continuous 2px yellow rule (#F2B01E) across
   the top of the row (final16). Each cell: a mono label in steel-lift, the
   figure, a 20px line, a 14px note, and the source in mono 11px pinned to
   the cell's foot. The words are content/costs.js.

   LIGHT AND COLOUR, NOT OBJECTS (final19, 2026-10-06, the founder). The
   quantity fields of final18 and their sweep are deleted. The figures are
   #F2B01E; each cell is lit from its top edge, so the rule reads as the
   light; a soft 320px highlight crosses the row every 12s (paused under
   reduced motion); a hovered cell lifts 4px and its light strengthens.
   All of it is costs-cited.css. The figures never count. */
export default function CostsCited() {
  return (
    <section className="vt st-sec st--dark cc" aria-labelledby="cc-h">
      <div className="st-in">
        <h2 className="st-h" id="cc-h">
          What it costs you
        </h2>
        <p className="sec-lead cc__lead">
          Four leaks most owner-run businesses never see. The numbers are the industry&apos;s, not ours.
        </p>
        <div className="cc__row">
          <ul className="cc__grid">
            {COSTS.map(({ id, label, figure, line, note, source }) => (
              <li className="cc__cell" key={id}>
                <p className="cc__k">{label}</p>
                <p className="cc__n">{figure}</p>
                <h3 className="cc__h">{line}</h3>
                <p className="cc__p">{note}</p>
                <p className="cc__src">{source}</p>
              </li>
            ))}
          </ul>
          <span className="cc__sweep" aria-hidden="true">
            <span />
          </span>
        </div>
      </div>
    </section>
  );
}
