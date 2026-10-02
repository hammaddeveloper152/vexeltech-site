import React, { useRef } from 'react';
import { useSeen } from '../site/useOnce.js';
import './proof.css';

/* SERVICES, THE BRANDING BAND (the final pass, 2026-10-03). Christal Clear
   Properties' identity, the founder's files: the main mark on cream at the
   left, the white mark on black at the right, equal halves of the content
   width, 420px tall, 2px apart (stacked below 768, each 320 tall). Each mark
   320px wide (200 when stacked). Under them, on the cream band, one caption
   in mono 11px steel (7.2:1 on cream).

   The marks slide in from opposite sides, 40px, with a fade, 500ms, once,
   on the reveal curve (useSeen, proof.css). Reduced motion: in place.

   The city is work.js's for the client (the founder's ruling, 2026-10-03).
   The brand guide and stationery plates wait for a render of their PDFs;
   nothing stands in for them. Each file here appears on this page only
   (BUILD-LAW rule 0). */
export default function BrandBand() {
  const ref = useRef(null);
  const armed = useSeen(ref);
  return (
    <figure className="bb" ref={ref} data-armed={armed ? 'true' : 'false'}>
      <div className="bb__marks">
        <div className="bb__p bb__p--cream">
          <img src="/brand/ccp-main.svg" alt="The Christal Clear Properties mark" width="320" height="395" loading="lazy" decoding="async" />
        </div>
        <div className="bb__p bb__p--black">
          <img src="/brand/ccp-white.svg" alt="The Christal Clear Properties mark in white" width="320" height="395" loading="lazy" decoding="async" />
        </div>
      </div>
      <figcaption className="bb__cap">
        Christal Clear Properties. Identity, stationery and brand guide. Real estate, St. Simons Island GA.
      </figcaption>
    </figure>
  );
}
