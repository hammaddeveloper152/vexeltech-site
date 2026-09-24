import React from 'react';
import './Badge.css';

/* THE NUMBER BADGE, 2026-09-25 (the founder's life pass 2). It replaces the
   illustration sticker: a 56px white disc with the sticker's 6px die-cut
   edge, the number in Clash Display Medium 20px asphalt (17.77:1 on white),
   rotated 12 degrees. The discipline cards carry it over their top right
   corner, the /services sections at the top right of their head. Hidden
   below 768. Decorative: the order is the list's. */
export default function Badge({ n, className = '' }) {
  return (
    <span className={`badge ${className}`.trim()} aria-hidden="true">
      {n}
    </span>
  );
}
