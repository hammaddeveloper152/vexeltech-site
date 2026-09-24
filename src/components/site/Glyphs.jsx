import React from 'react';

/* THE SITE'S OWN GLYPHS, 2026-09-24 (the founder): drawn here, not imported.

   The four discipline glyphs sit in the card chips on home's What we do and
   About's What we build it around: 24px, a 2px stroke, round caps, and the
   V mark's own corners - the mark is a filled path with SHARP corners, so
   every join is mitred; the one rounded shape is Branding's square, which
   the brief names as rounded. One concept each:

     Branding     a monogram: the V in a rounded square
     Websites     a browser frame with one content bar
     Marketing    a signal: two arcs from a dot
     Automation   three nodes linked in a line, the last one filled

   The two social glyphs are 16px, a 2px stroke, for the footer's yellow
   circles. Every glyph takes `currentColor`, so the chip sets bone and the
   circle sets asphalt. Decorative wherever they are used: the name beside a
   chip, and the link's own label on a social circle, say what they are. */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'miter',
  'aria-hidden': 'true',
  focusable: 'false',
};

function Glyph24({ className, children }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24" {...base}>
      {children}
    </svg>
  );
}

function Glyph16({ className, children }) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" {...base}>
      {children}
    </svg>
  );
}

export function GlyphBranding({ className }) {
  return (
    <Glyph24 className={className}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 8.5 12 16l4-7.5" />
    </Glyph24>
  );
}

export function GlyphWebsites({ className }) {
  return (
    <Glyph24 className={className}>
      <rect x="3" y="4" width="18" height="16" />
      <path d="M3 8.5h18" />
      <path d="M7 13.5h8" />
    </Glyph24>
  );
}

export function GlyphMarketing({ className }) {
  return (
    <Glyph24 className={className}>
      <circle cx="6" cy="18" r="1.5" fill="currentColor" />
      <path d="M6 12a6 6 0 0 1 6 6" />
      <path d="M6 6.5A11.5 11.5 0 0 1 17.5 18" />
    </Glyph24>
  );
}

export function GlyphAutomation({ className }) {
  return (
    <Glyph24 className={className}>
      <circle cx="4.5" cy="12" r="2.5" />
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="19.5" cy="12" r="2.5" fill="currentColor" />
      <path d="M7 12h2.5M14.5 12H17" />
    </Glyph24>
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
