import React from 'react';

/* HARBOR DENTAL'S MARK (final17, 2026-10-06, the founder): an H and a D
   sharing one vertical stem, drawn as geometry, in no container. The H's
   left stem and crossbar meet the shared stem; the D's bowl runs off its
   top and foot. The stroke is 2 units in a 40-unit box, so it is 2px at
   40px and scales with the size. `currentColor`, so each surface sets its
   ink. This is the only mark used for Harbor Dental on the site (BUILD-LAW
   Real over drawn). Decorative: the surface it sits on carries the name. */
export default function Monogram({ size = 40, className = '', style }) {
  return (
    <svg
      className={`hd-mark${className ? ` ${className}` : ''}`}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      style={style}
    >
      <path d="M8 7 V33 M8 20 H20 M20 7 V33 M20 7 H22.5 A10.5 13 0 0 1 22.5 33 H20" />
    </svg>
  );
}
