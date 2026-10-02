import React, { useRef } from 'react';
import { useSeen } from '../site/useOnce.js';
import './proof.css';

/* SERVICES, THE BRANDING BAND (final pass 2, 2026-10-03). Three plates
   from Christal Clear Properties' brand guide, the founder's renders, on a
   cream band:

     from 768   the signage at the left, the band's full height and 42% of
                the content width; at the right, stacked, the lockup on
                dark above the lockup on teal, each half the height, 2px
                apart. The plates are 640px tall at 1280 (560 from 768).
     below 768  the signage first at 4:5, then the other two at their own
                proportions, stacked
   Every plate cover-fit, 4px radius. Under them, one caption in mono 11px
   steel (7.2:1 on cream).

   THE ENTRANCE: each plate rises 24px to its place over 500ms, 120ms
   apart, on the reveal curve, when the band comes into view. Opacity is 1
   throughout (BUILD-LAW Motion: an entrance never hides content). Reduced
   motion: in place.

   The two SVG marks of the final pass are deleted; the marks are in the
   plates. Each file appears on this page only (BUILD-LAW rule 0). */
const PLATES = [
  {
    id: 'signage',
    src: '/brand/ccp-signage.jpg',
    w: 1600,
    h: 1845,
    alt: 'Christal Clear Properties signage on a building front, beside the Brokered by eXp Realty mark',
  },
  {
    id: 'dark',
    src: '/brand/ccp-lockup-dark.jpg',
    w: 1600,
    h: 773,
    alt: 'The Christal Clear Properties and eXp Realty lockup in white on a dark ground',
  },
  {
    id: 'teal',
    src: '/brand/ccp-teal.jpg',
    w: 1600,
    h: 750,
    alt: 'The Christal Clear Properties lighthouse mark in white on teal',
  },
];

export default function BrandBand() {
  const ref = useRef(null);
  const armed = useSeen(ref);
  return (
    <figure className="bb" ref={ref} data-armed={armed ? 'true' : 'false'}>
      <div className="bb__plates">
        {PLATES.map((p, i) => (
          <span className={`bb__plate bb__plate--${p.id}`} key={p.id} style={{ '--i': i }}>
            {/* 800 and 1600 wide (the 800s are the same renders, halved).
                The signage is /services' largest paint on a phone, so it
                loads at once and first. */}
            <img
              src={p.src.replace('.jpg', '-800.jpg')}
              srcSet={`${p.src.replace('.jpg', '-800.jpg')} 800w, ${p.src} 1600w`}
              sizes={p.id === 'signage' ? '(min-width: 768px) 42vw, 100vw' : '(min-width: 768px) 58vw, 100vw'}
              alt={p.alt}
              width={p.w}
              height={p.h}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              decoding="async"
            />
          </span>
        ))}
      </div>
      <figcaption className="bb__cap">
        Christal Clear Properties. Identity, signage and stationery. Real estate, St. Simons Island GA.
      </figcaption>
    </figure>
  );
}
