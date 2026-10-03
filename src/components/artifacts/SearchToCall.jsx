import React, { useLayoutEffect, useRef, useState } from 'react';
import { useLoop, step, lin } from './loop.js';
import './artifacts.css';

/* SERVICES, MARKETING: FROM SEARCH TO CALL (the final artifacts pass,
   2026-10-03, the founder). It replaced the benchmark bars.

   One stage at the content width, 380 tall, three frames left to right
   with a 1px steel rule between; below 1024 they stack, 280 tall each.

     A  Search    the query types; a results list draws; the first row is
                  the sponsored one (a yellow mono "Sponsored", Baseline
                  Bookkeeping's title, URL and line), the other two read
                  "Someone else."; a 12px bone disc moves to the sponsored
                  row and the row flashes yellow at 10% for 200ms.
     B  Landing   the sponsored title glides into frame B and heads the
                  phone capture of baseline-books.com, a plain crop with a
                  6px radius and a steel hairline. A yellow ring draws
                  round the site's "Book a Call Now" button.
     C  Call      a call card rises: "Incoming call", the business, a yellow
                  "Accept"; 1.2s later "Answered, 0:00" counts to 0:14.

   About 7.5s, hold, rest, loop (loop.js). Under the stage, one line with
   the figures and their source.

   NO DEVICE SILHOUETTE in frame B (the founder, 2026-10-03): the phone
   silhouette is the Websites band's alone, so the capture stands as a
   plain crop. THE CROP IS THE FIRST 590px, not the brief's 520: the
   button the ring draws round sits at 521 to 575 of the 390-wide layout,
   so a 520 crop would cut it off. The capture appears here only; the
   Websites band shows Zions Caregivers in its place (BUILD-LAW rule 0).

   The stage is a picture, aria-hidden; the line under it is the content.
   Every word in it is the founder's, from the brief. */
const QUERY = 'bookkeeper wichita falls';
const TOTAL = 8000;

/* The button in the capture's own pixels (780 x 1180 shown of 780 x 2360). */
const RING = { x: 163, y: 1035, w: 454, h: 123 };

const wipe = (k) => ({ clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` });

export default function SearchToCall() {
  const ref = useRef(null);
  const frameA = useRef(null);
  const rowT = useRef(null);
  const glide = useRef(null);
  const [t] = useLoop(ref, TOTAL);
  const [geo, setGeo] = useState({ gx: 0, gy: 0, cx: 0, cy: 0, ox: 0, oy: 0 });

  /* Where the glider starts (over the sponsored title) and where the
     cursor goes, measured from the layout, again on every resize. */
  useLayoutEffect(() => {
    const measure = () => {
      const a = frameA.current;
      const r = rowT.current;
      const g = glide.current;
      if (!a || !r || !g) return;
      const ra = a.getBoundingClientRect();
      const rr = r.getBoundingClientRect();
      /* The glider's resting box, without its transform. */
      const gx0 = g.offsetLeft;
      const gy0 = g.offsetTop;
      const host = g.offsetParent.getBoundingClientRect();
      setGeo({
        gx: rr.left - host.left - gx0,
        gy: rr.top - host.top - gy0,
        cx: rr.right - ra.left - 24,
        cy: rr.top - ra.top + rr.height / 2 - 6,
        ox: ra.width - 32,
        oy: ra.height - 32,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    if (document.fonts) document.fonts.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  const typed = QUERY.slice(0, Math.round(lin(t, 200, 1000) * QUERY.length));
  const pc = step(t, 1900, 600);
  const flash = t >= 2550 && t < 2750;
  const pg = step(t, 3000, 600);
  const pShot = step(t, 3400, 700);
  const pRing = step(t, 4300, 600);
  const pCall = step(t, 5000, 500);
  const secs = Math.round(lin(t, 6300, 1200) * 14);

  return (
    <figure className="sc" ref={ref} data-artifact="SearchToCall">
      <div className="sc__stage" aria-hidden="true">
        <div className="sc__f sc__f--a" ref={frameA}>
          <p className="sc__k">Search</p>
          <p className="sc__field">
            <span>{typed}</span>
            <span className="cs-caret" />
          </p>
          <ol className="sc__res">
            <li className={`sc__row sc__row--ad${flash ? ' sc__row--flash' : ''}`} style={wipe(step(t, 1300, 400))}>
              <span className="sc__tag">Sponsored</span>
              <span className="sc__t" ref={rowT}>
                Baseline Bookkeeping
              </span>
              <span className="sc__u">baseline-books.com</span>
              <span className="sc__d">You have a business to run. We&apos;ve got the books covered.</span>
            </li>
            {[0, 1].map((i) => (
              <li className="sc__row" key={i} style={wipe(step(t, 1450 + i * 150, 400))}>
                <span className="sc__t sc__t--other">Someone else.</span>
              </li>
            ))}
          </ol>
          <span
            className="sc__cursor"
            style={{ transform: `translate(${geo.ox + (geo.cx - geo.ox) * pc}px, ${geo.oy + (geo.cy - geo.oy) * pc}px)` }}
          />
        </div>

        <div className="sc__f sc__f--b">
          <p className="sc__k">Landing</p>
          <p className="sc__t sc__glide" ref={glide} style={{
              transform: `translate(${geo.gx * (1 - pg)}px, ${geo.gy * (1 - pg)}px)`,
              /* Over the sponsored title until it leaves, drawn with it. */
              ...(t < 3000 ? wipe(step(t, 1300, 400)) : null),
            }}
          >
            Baseline Bookkeeping
          </p>
          <div className="sc__clip">
            <div className="sc__shot" style={{ transform: `translateY(${(1 - pShot) * 110}%)` }}>
              <img src="/work/baseline-books-phone.jpg" alt="" width="780" height="2360" loading="lazy" decoding="async" />
              <svg className="sc__ring" viewBox="0 0 780 1180" preserveAspectRatio="xMidYMin slice" focusable="false">
                <rect
                  x={RING.x}
                  y={RING.y}
                  width={RING.w}
                  height={RING.h}
                  rx="61"
                  pathLength="100"
                  style={{ strokeDashoffset: 100 * (1 - pRing) }}
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="sc__f sc__f--c">
          <p className="sc__k">Call</p>
          <div className="sc__clip sc__clip--c">
            <div className="sc__call" style={{ transform: `translateY(${(1 - pCall) * 120}%)` }}>
              <span className="sc__call-k">Incoming call</span>
              <span className="sc__call-n">Baseline Bookkeeping</span>
              <span className="sc__call-a">Accept</span>
              <span className="sc__call-s" style={wipe(step(t, 6200, 300))}>
                Answered, 0:{String(secs).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="sc__cap">
        Shown with a client&apos;s site. On our last reported account, a lead cost $30.11 against a $70.11 US search
        average (WordStream, Google Ads Benchmarks 2025).
      </figcaption>
    </figure>
  );
}
