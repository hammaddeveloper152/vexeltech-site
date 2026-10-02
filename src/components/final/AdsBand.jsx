import React, { useRef } from 'react';
import { useSeen } from '../site/useOnce.js';
import './proof.css';

/* SERVICES, THE MARKETING BAND (the final pass, 2026-10-03). A client's
   Google Ads performance summary, the founder's capture, in a plain browser
   frame across the content width: a 1px steel border, 6px radius, and a 32px
   title bar with three hollow 10px circles at the left and the date range in
   mono at the centre.

   TWO CALLOUTS, yellow 2px rounded rectangles round "234.00" (Conversions)
   and "$30.11" (Cost / conv.). They are drawn in the capture's own
   coordinates (an SVG on the image's 1175 x 310 box, measured off the
   pixels), so they hold at every width. They draw in by stroke-dashoffset
   (a named exception in BUILD-LAW Motion), 600ms after the frame enters the
   view, one after the other. Reduced motion: drawn from the start.

   The caption is the founder's. No figure on the page is written; the two
   are the capture's. ads-nov-2025.png stays in public/proof, unused. */
const W = 1175;
const H = 310;
const MARKS = [
  { id: 'conv', x: 176, y: 69, w: 87, h: 34 },
  { id: 'cpc', x: 445, y: 66, w: 83, h: 37 },
];

export default function AdsBand() {
  const ref = useRef(null);
  const armed = useSeen(ref);
  return (
    <figure className="ab" ref={ref} data-armed={armed ? 'true' : 'false'}>
      <div className="ab__frame">
        <div className="ab__bar" aria-hidden="true">
          <span className="ab__dots">
            <span className="ab__dot" />
            <span className="ab__dot" />
            <span className="ab__dot" />
          </span>
          <span className="ab__title">Google Ads. Jan 1 to Feb 25, 2026</span>
        </div>
        <div className="ab__shot">
          <img
            src="/proof/ads-jan-feb-2026.png"
            alt="Google Ads performance summary, January 1 to February 25, 2026: 680 clicks, 234.00 conversions, $10.36 average cost per click, $30.11 cost per conversion."
            width={W}
            height={H}
            loading="lazy"
            decoding="async"
          />
          <svg className="ab__marks" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
            {MARKS.map((m, i) => (
              <rect key={m.id} className="ab__mark" x={m.x} y={m.y} width={m.w} height={m.h} rx="6" pathLength="100" style={{ '--i': i }} />
            ))}
          </svg>
        </div>
      </div>
      <figcaption className="ab__cap">
        One client account, small business, US. Conversions as reported by Google Ads. Client name withheld.
      </figcaption>
    </figure>
  );
}
