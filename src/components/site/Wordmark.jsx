import React from 'react';
import './Wordmark.css';

/* The lockup from Plate 00: the cut mark, then VEXELTECH with the period in
   machine yellow.

   On the two halves, and why they are built differently:

   The MARK is a real vector. It is the path the v11 tree already ships, on a
   0 0 100 100 box, and it is the same shape Plate 00 enlarges across the
   cover. It is inlined as SVG so it takes currentColor and needs no request.

   The WORDMARK is type, not a drawn logo. Plate 00 sets it in the brand face
   in caps with a coloured full stop, which is exactly what the type tokens
   already produce, so it is live text rather than converted outlines. Text
   scales, inherits the face when it changes, stays selectable and readable to
   assistive technology, and cannot go stale against the type scale. Outlines
   would give up all of that to look identical.

   There is no SVG in brand/. It holds the identity plates as a PDF and two
   PNG exports, so nothing was traced from them: the mark below is the vector
   the site already had. */

export default function Wordmark({ size = 'md', className = '' }) {
  return (
    <span className={`wm wm--${size} ${className}`.trim()}>
      <svg className="wm__mark" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <path d="M7 33 29 25 50 60 78 6 94 2 54 93Z" />
      </svg>
      <span className="wm__word">
        Vexeltech<span className="wm__dot" aria-hidden="true">.</span>
      </span>
    </span>
  );
}
