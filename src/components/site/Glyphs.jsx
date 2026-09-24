import React from 'react';

/* THE SITE'S OWN GLYPHS, 2026-09-24 (the founder): drawn here, not imported.

   The four discipline glyphs that sat in the card chips are gone, later the
   same day: the cards carry isometric illustrations now (Illustrations.jsx).
   What is left are the two social glyphs for the footer's yellow circles:
   16px, a 2px stroke, round caps, mitred joins (the V mark's own sharp
   corners), `currentColor`, asphalt from the circle. Decorative: the link's
   own label says what each is. */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'miter',
  'aria-hidden': 'true',
  focusable: 'false',
};

function Glyph16({ className, children }) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" {...base}>
      {children}
    </svg>
  );
}

export function GlyphLinkedIn({ className }) {
  return (
    <Glyph16 className={className}>
      <path d="M3.5 6.5V13" />
      <circle cx="3.5" cy="3" r="0.5" fill="currentColor" />
      <path d="M7.5 13V6.5M7.5 9.5a2.75 2.75 0 0 1 5.5 0V13" />
    </Glyph16>
  );
}

export function GlyphInstagram({ className }) {
  return (
    <Glyph16 className={className}>
      <rect x="2" y="2" width="12" height="12" rx="3.5" />
      <circle cx="8" cy="8" r="2.75" />
      <circle cx="11.5" cy="4.5" r="0.25" fill="currentColor" />
    </Glyph16>
  );
}
