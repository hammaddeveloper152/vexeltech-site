import React, { useEffect, useRef, useState } from 'react';
import { useLoop, step, leaving } from './loop.js';
import './artifacts.css';
import '../final/about-bands.css';

/* ABOUT, ONE TEAM (2026-10-03, the founder, final7). A dark band after the
   statement: the H2 "Four disciplines. One team." and a convergence at the
   content width, 360 tall (480 below 768, running top to bottom).

   Four lanes, each named in mono 11px yellow (9.46:1 on the dark ground):
   Branding, Website, Marketing, Automation. The lanes are 1px steel lines
   that draw in first (stroke-dashoffset). Then a 12px bone disc travels each
   lane over 1.6s, 200ms apart, into one lane at the right, where the four
   merge into one 20px yellow disc (it grows from its centre as the last
   arrives). Beside it three lines rise into place 200ms apart, 18px bone:
   "One brief." "One invoice." "One number to call." Hold, rest 5s, loop
   (loop.js); the first paint and reduced motion show the finished state.

   RICHER, 2026-10-05 (the founder's pre-launch pass). Each lane carries its
   discipline's colour, the same four as home's What we do cards and
   /services: the lane name is in it, the disc is a 14px disc of it, and the
   disc leaves a 2px trail of it along its own lane (up to where the lanes
   meet) as it travels. Where the lanes meet the four coloured discs
   crossfade into one 24px bone disc, and then the three lines land. The
   yellow merge disc is gone.

   The geometry is computed from the band's measured size, in pixels, so the
   discs stay round at every width. The drawing is aria-hidden; the lane
   names and the three lines are text. */
const LANES = ['Branding', 'Website', 'Marketing', 'Automation'];
/* tokens.css, the discipline colours (2026-10-05). */
const TONES = ['var(--c-yellow-d)', 'var(--c-lilac)', 'var(--c-coral)', 'var(--c-mint)'];
const LINES = ['One brief.', 'One invoice.', 'One number to call.'];
const T_DRAW = 600;
const T_GO = 600;
const GAP = 200;
const TRAVEL = 1600;
const T_MERGE = T_GO + GAP * 3 + TRAVEL;
const T_LINES = T_MERGE + 300;
const TOTAL = T_LINES + GAP * 2 + 400 + 1100;

/* Lanes, labels, the merge point and the lines, for a box `w` x `h`. */
function layout(w, h) {
  const vertical = w < 768;
  if (!vertical) {
    const x0 = 132;
    const xM = Math.round(w * 0.55);
    const xD = Math.round(w * 0.66);
    const ys = [0, 1, 2, 3].map((i) => 60 + i * 80);
    const yc = h / 2;
    const x1 = x0 + (xM - x0) * 0.3;
    const own = ys.map((y) => `M ${x0} ${y} L ${x1} ${y} C ${(x1 + xM) / 2} ${y}, ${(x1 + xM) / 2} ${yc}, ${xM} ${yc}`);
    return {
      vertical,
      own,
      lanes: own.map((d) => `${d} L ${xD} ${yc}`),
      labels: ys.map((y) => ({ left: 0, top: y - 8 })),
      disc: { x: xD, y: yc },
      lines: { left: xD + 40, top: yc - 48 },
    };
  }
  const y0 = 32;
  const yM = 250;
  const yD = 300;
  const xs = [0, 1, 2, 3].map((i) => Math.round((w * (i + 0.5)) / 4));
  const xc = w / 2;
  const y1 = 90;
  const own = xs.map((x) => `M ${x} ${y0} L ${x} ${y1} C ${x} ${(y1 + yM) / 2}, ${xc} ${(y1 + yM) / 2}, ${xc} ${yM}`);
  return {
    vertical,
    own,
    lanes: own.map((d) => `${d} L ${xc} ${yD}`),
    labels: xs.map((x) => ({ left: x, top: 0 })),
    disc: { x: xc, y: yD },
    lines: { left: 0, top: yD + 32 },
  };
}

export default function OneTeam() {
  const ref = useRef(null);
  const paths = useRef([]);
  const trails = useRef([]);
  const [t, , , leave] = useLoop(ref, TOTAL);
  const [box, setBox] = useState({ w: 1152, h: 360 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const L = layout(box.w, box.h);
  /* The crossfade: the four coloured discs out, the bone disc in. */
  const pMerge = step(t, T_MERGE, 300);
  /* How far along its own stretch a lane's trail has drawn, for the disc's
     progress `k` along the whole lane. */
  const trailAt = (i, k) => {
    const p = paths.current[i];
    const tr = trails.current[i];
    if (!p || !tr) return k;
    const f = tr.getTotalLength() / p.getTotalLength();
    return Math.min(1, k / f);
  };
  const discAt = (i) => {
    const p = paths.current[i];
    const k = step(t, T_GO + i * GAP, TRAVEL);
    if (!p) return k < 1 ? null : L.disc;
    const pt = p.getPointAtLength(p.getTotalLength() * k);
    return { x: pt.x, y: pt.y };
  };

  return (
    <section className="vt st-sec st--dark ab-dark ot" aria-labelledby="ot-h" data-artifact="OneTeam">
      <div className="st-in">
        <h2 className="st-h" id="ot-h">
          One team for the whole job.
        </h2>
        {/* COPY V4, 2026-10-06: the H2 was "Four disciplines. One team.";
            the line under it is new, 18px (artifacts.css). */}
        <p className="ot__lede">
          Branding, website, marketing and automation are usually four vendors who have never met.
          Here they are one brief and one phone number, so the ad matches the page, the page matches
          the mark, and the call gets answered.
        </p>
        <div className={`ot__stage${L.vertical ? ' ot__stage--v' : ''}`} ref={ref} {...leaving(leave)}>
          <svg className="ot__svg" width={box.w} height={box.h} aria-hidden="true" focusable="false">
            {L.lanes.map((d, i) => (
              <path
                key={LANES[i]}
                ref={(n) => {
                  paths.current[i] = n;
                }}
                className="ot__lane"
                d={d}
                pathLength="100"
                style={{ strokeDashoffset: 100 * (1 - step(t, i * 70, T_DRAW)) }}
              />
            ))}
            {L.own.map((d, i) => (
              <path
                key={`${LANES[i]}-trail`}
                ref={(n) => {
                  trails.current[i] = n;
                }}
                className="ot__trail"
                d={d}
                pathLength="100"
                style={{
                  stroke: TONES[i],
                  strokeDashoffset: 100 * (1 - trailAt(i, step(t, T_GO + i * GAP, TRAVEL))),
                }}
              />
            ))}
            {LANES.map((name, i) => {
              const at = discAt(i);
              return at && pMerge < 1 ? (
                <circle
                  key={name}
                  className="ot__disc"
                  cx={at.x}
                  cy={at.y}
                  r="7"
                  style={{ fill: TONES[i], opacity: 1 - pMerge }}
                />
              ) : null;
            })}
            <circle className="ot__one" cx={L.disc.x} cy={L.disc.y} r="12" style={{ opacity: pMerge }} />
          </svg>
          <ul className="ot__labels">
            {LANES.map((name, i) => (
              <li className="ot__label" key={name} style={{ ...L.labels[i], color: TONES[i] }}>
                {name}
              </li>
            ))}
          </ul>
          <ul className="ot__lines" style={L.lines}>
            {LINES.map((line, i) => (
              <li className="ot__mask" key={line}>
                <span className="ot__line" style={{ transform: `translateY(${(1 - step(t, T_LINES + i * GAP, 400)) * 110}%)` }}>
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
