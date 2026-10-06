import React from 'react';
import { COSTS } from '../../content/costs.js';
import './costs-cited.css';

/* HOME, WHAT IT COSTS YOU: CITED NUMBERS, NO ARTIFACT (the founder's
   approved frame C, final15, 2026-10-06). It replaced the lock screen of
   final14 and, before it, the four scenes (CostScenes.jsx, deleted).

   The H2, an 18px lead, then four cells in one row from 1024 (two by two
   below), 2px apart, under one continuous 2px yellow rule (#F2B01E) across
   the top of the row (final16; the per-cell discipline colours are gone,
   BUILD-LAW Layout). Each cell: a mono label in steel-lift, a 72px figure, a 20px line, a 14px note, and the source in mono
   11px pinned to the cell's foot. Everything is painted from the first
   frame; nothing moves (the brief's count-in is held, see DESIGN.md
   "FINAL15": BUILD-LAW Motion allows a count-up only on a figure on screen
   at load). The words are content/costs.js. */
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
      </div>
    </section>
  );
}
