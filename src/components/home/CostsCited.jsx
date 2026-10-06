import React, { useRef } from 'react';
import { COSTS } from '../../content/costs.js';
import { useLoop, leaving } from '../artifacts/loop.js';
import './costs-cited.css';

/* HOME, WHAT IT COSTS YOU: CITED NUMBERS, NO ARTIFACT (the founder's
   approved frame C, final15, 2026-10-06). It replaced the lock screen of
   final14 and, before it, the four scenes (CostScenes.jsx, deleted).

   The H2, an 18px lead, then four cells in one row from 1024 (two by two
   below), 2px apart, under one continuous 2px yellow rule (#F2B01E) across
   the top of the row (final16). Each cell: a mono label in steel-lift, a
   72px figure, a quantity field (final18), a 20px line, a 14px note, and
   the source in mono 11px pinned to the cell's foot. The words are
   content/costs.js.

   THE QUANTITY FIELDS (final18, 2026-10-06, the founder). Each cell shows
   its figure as units, between the figure and the line, left aligned:

     1  0.6%   1000 dots of 3px in 40 x 25, bone at 12%, six lit yellow,
               clustered bottom right
     2  $70    70 bars of 3 x 14 in seven rows of ten, all yellow at 80%
     3  27%    100 dots of 6px in 10 x 10, 27 lit, scattered from a fixed
               seed, so the pattern is the same every load
     4  <3%    the same grid, 3 lit, from its own seed

   The brief gave the fields 36px (40 for cell 1). The grids it specified
   need 100, 110, 78 and 78, so the four share one 110px slot, top
   aligned, and the lines under them stay level (DESIGN.md "FINAL18").

   THE PLAY (loop.js, once): finished at rest, off screen and under reduced
   motion. At half in view, the lit units take the 400ms soft start, then
   appear in a 900ms sweep, left to right. The figures never count
   (BUILD-LAW Motion: a quantity field may fill when its figure is
   static). Hover lifts a cell 4px with a 1px bone edge at 20%, 200ms. The
   fields are pictures of the figures, aria-hidden. */
const SWEEP = 900;
const FADE = 120;

function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = a;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/* `n` distinct cells of a 100-dot grid, from `seed`. */
function pick(n, seed) {
  const r = seeded(seed);
  const out = new Set();
  while (out.size < n) out.add(Math.floor(r() * 100));
  return out;
}

const FIELDS = {
  found: { cols: 40, rows: 25, pitch: 4, d: 3, lit: new Set([999, 998, 959, 997, 958, 919]) },
  spend: { bars: true, cols: 10, rows: 7, w: 3, h: 14, gx: 2, gy: 2 },
  missed: { cols: 10, rows: 10, pitch: 8, d: 6, lit: pick(27, 27) },
  voicemail: { cols: 10, rows: 10, pitch: 8, d: 6, lit: pick(3, 3) },
};

/* A lit unit at column `c` of `cols` shows from its moment in the sweep. */
const shown = (t, c, cols) => {
  const at = (c / Math.max(1, cols - 1)) * (SWEEP - FADE);
  return Math.max(0, Math.min(1, (t - at) / FADE));
};

function Field({ id, t }) {
  const f = FIELDS[id];
  if (f.bars) {
    const W = f.cols * (f.w + f.gx) - f.gx;
    const H = f.rows * (f.h + f.gy) - f.gy;
    const bars = [];
    for (let r = 0; r < f.rows; r += 1) {
      for (let c = 0; c < f.cols; c += 1) {
        const o = shown(t, c, f.cols);
        if (o > 0) bars.push(<rect key={`${r}-${c}`} x={c * (f.w + f.gx)} y={r * (f.h + f.gy)} width={f.w} height={f.h} opacity={o} />);
      }
    }
    return (
      <svg className="cc__field cc__field--bars" viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true" focusable="false">
        <g className="cc__lit">{bars}</g>
      </svg>
    );
  }
  const W = (f.cols - 1) * f.pitch + f.d;
  const H = (f.rows - 1) * f.pitch + f.d;
  const rad = f.d / 2;
  const base = [];
  const lit = [];
  for (let k = 0; k < f.cols * f.rows; k += 1) {
    const c = k % f.cols;
    const r = Math.floor(k / f.cols);
    const cx = c * f.pitch + rad;
    const cy = r * f.pitch + rad;
    base.push(<circle key={k} cx={cx} cy={cy} r={rad} />);
    if (f.lit.has(k)) {
      const o = shown(t, c, f.cols);
      if (o > 0) lit.push(<circle key={k} cx={cx} cy={cy} r={rad} opacity={o} />);
    }
  }
  return (
    <svg className="cc__field" viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true" focusable="false">
      <g className="cc__base">{base}</g>
      <g className="cc__lit">{lit}</g>
    </svg>
  );
}

export default function CostsCited() {
  const ref = useRef(null);
  const [t, , , leave] = useLoop(ref, SWEEP, { once: true });
  return (
    <section className="vt st-sec st--dark cc" aria-labelledby="cc-h">
      <div className="st-in">
        <h2 className="st-h" id="cc-h">
          What it costs you
        </h2>
        <p className="sec-lead cc__lead">
          Four leaks most owner-run businesses never see. The numbers are the industry&apos;s, not ours.
        </p>
        <ul className="cc__grid" ref={ref} {...leaving(leave)}>
          {COSTS.map(({ id, label, figure, line, note, source }) => (
            <li className="cc__cell" key={id}>
              <p className="cc__k">{label}</p>
              <p className="cc__n">{figure}</p>
              <div className="cc__slot">
                <Field id={id} t={t} />
              </div>
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
