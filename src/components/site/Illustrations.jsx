import React from 'react';

/* THE CARD ILLUSTRATIONS, 2026-09-24 (the founder's illustration pass; the
   isometric outline style of coinsetters.io's services section, translated
   to this palette). They are the card's artwork on home's What we do and
   About's What we build it around.

   TRUE ISOMETRIC, 30 degree axes: a point (x, y, z) lands at
   (x - y) * cos 30, (x + y) * sin 30 - z. Drawn in a 280 x 280 box and
   rendered at 140px, each object centred on its own bounds. The geometry is
   generated, not hand-placed - every face is a projected box face - so the
   light is the same on all four: TOP lit-raised, LEFT lit-near, RIGHT
   steel-dark. The keyline is bone at 1.5px with round joins (ArtCard.css).
   Every object stands on the same 110 x 110 footprint, and each has exactly
   one yellow element:

     Branding     a stamp block with a raised V on its top face; the V
     Websites     a browser window, three-dot bar, two bars and a block; the block
     Marketing    a megaphone on a low plinth, three sound lines; the middle line
     Automation   three cubes on a rail, joined by connectors; the last cube

   Decorative: the card's title says what each one is. */

export function IsoBranding({ className }) {
  return (
    <svg className={className} viewBox="0 0 280 280" width="140" height="140" aria-hidden="true" focusable="false">
      <path className="iso-l" d="M44.7 163.0 L140.0 218.0 L140.0 172.0 L44.7 117.0Z" />
      <path className="iso-r" d="M235.3 163.0 L140.0 218.0 L140.0 172.0 L235.3 117.0Z" />
      <path className="iso-t" d="M140.0 62.0 L235.3 117.0 L140.0 172.0 L44.7 117.0Z" />
      <path className="iso-l" d="M120.1 137.5 L104.5 128.5 L104.5 119.5 L120.1 128.5Z" />
      <path className="iso-r" d="M195.4 119.0 L120.1 137.5 L120.1 128.5 L195.4 110.0Z" />
      <path className="iso-l" d="M104.5 128.5 L136.5 85.0 L136.5 76.0 L104.5 119.5Z" />
      <path className="iso-y" d="M136.5 76.0 L152.1 85.0 L133.1 112.0 L179.8 101.0 L195.4 110.0 L120.1 128.5 L104.5 119.5Z" />
    </svg>
  );
}

export function IsoWebsites({ className }) {
  return (
    <svg className={className} viewBox="0 0 280 280" width="140" height="140" aria-hidden="true" focusable="false">
      <path className="iso-l" d="M44.7 187.8 L140.0 242.8 L140.0 234.8 L44.7 179.8Z" />
      <path className="iso-r" d="M235.3 187.8 L140.0 242.8 L140.0 234.8 L235.3 179.8Z" />
      <path className="iso-t" d="M140.0 124.8 L235.3 179.8 L140.0 234.8 L44.7 179.8Z" />
      <path className="iso-l" d="M108.0 143.2 L203.2 198.2 L203.2 98.2 L108.0 43.2Z" />
      <path className="iso-r" d="M213.6 192.2 L203.2 198.2 L203.2 98.2 L213.6 92.2Z" />
      <path className="iso-t" d="M118.3 37.2 L213.6 92.2 L203.2 98.2 L108.0 43.2Z" />
      <path className="iso-t" d="M108.0 59.2 L203.2 114.2 L203.2 98.2 L108.0 43.2Z" />
      <path className="iso-r" d="M115.8 58.8 L120.1 61.2 L120.1 55.2 L115.8 52.8Z" />
      <path className="iso-r" d="M123.5 63.2 L127.9 65.8 L127.9 59.8 L123.5 57.2Z" />
      <path className="iso-r" d="M131.3 67.8 L135.7 70.2 L135.7 64.2 L131.3 61.8Z" />
      <path className="iso-t" d="M117.5 82.8 L181.6 119.8 L181.6 112.8 L117.5 75.8Z" />
      <path className="iso-t" d="M117.5 94.8 L164.2 121.8 L164.2 114.8 L117.5 87.8Z" />
      <path className="iso-y" d="M117.5 136.8 L174.6 169.8 L174.6 137.8 L117.5 104.8Z" />
    </svg>
  );
}

export function IsoMarketing({ className }) {
  return (
    <svg className={className} viewBox="0 0 280 280" width="140" height="140" aria-hidden="true" focusable="false">
      <path className="iso-l" d="M44.7 149.5 L140.0 204.5 L140.0 190.5 L44.7 135.5Z" />
      <path className="iso-r" d="M235.3 149.5 L140.0 204.5 L140.0 190.5 L235.3 135.5Z" />
      <path className="iso-t" d="M140.0 80.5 L235.3 135.5 L140.0 190.5 L44.7 135.5Z" />
      <path className="iso-l" d="M88.0 93.5 L100.2 100.5 L100.2 88.5 L88.0 81.5Z" />
      <path className="iso-r" d="M110.6 94.5 L100.2 100.5 L100.2 88.5 L110.6 82.5Z" />
      <path className="iso-t" d="M98.4 75.5 L110.6 82.5 L100.2 88.5 L88.0 81.5Z" />
      <path className="iso-l" d="M96.7 106.5 L138.3 158.5 L138.3 110.5 L96.7 86.5Z" />
      <path className="iso-t" d="M114.0 76.5 L179.8 86.5 L138.3 110.5 L96.7 86.5Z" />
      <path className="iso-r" d="M179.8 134.5 L138.3 158.5 L138.3 110.5 L179.8 86.5Z" />
      <path className="iso-l" d="M172.9 130.5 L145.2 146.5 L145.2 114.5 L172.9 98.5Z" />
      <path className="iso-line" d="M188.5 119.5 L202.4 118.5" />
      <path className="iso-line iso-line--y" d="M188.5 139.5 L202.4 147.5" />
      <path className="iso-line" d="M188.5 159.5 L202.4 176.5" />
    </svg>
  );
}

export function IsoAutomation({ className }) {
  return (
    <svg className={className} viewBox="0 0 280 280" width="140" height="140" aria-hidden="true" focusable="false">
      <path className="iso-l" d="M44.7 152.0 L140.0 207.0 L140.0 199.0 L44.7 144.0Z" />
      <path className="iso-r" d="M235.3 152.0 L140.0 207.0 L140.0 199.0 L235.3 144.0Z" />
      <path className="iso-t" d="M140.0 89.0 L235.3 144.0 L140.0 199.0 L44.7 144.0Z" />
      <path className="iso-l" d="M82.0 122.5 L177.2 177.5 L177.2 171.5 L82.0 116.5Z" />
      <path className="iso-r" d="M198.0 165.5 L177.2 177.5 L177.2 171.5 L198.0 159.5Z" />
      <path className="iso-t" d="M102.8 104.5 L198.0 159.5 L177.2 171.5 L82.0 116.5Z" />
      <path className="iso-l" d="M79.4 118.0 L105.4 133.0 L105.4 103.0 L79.4 88.0Z" />
      <path className="iso-r" d="M131.3 118.0 L105.4 133.0 L105.4 103.0 L131.3 88.0Z" />
      <path className="iso-t" d="M105.4 73.0 L131.3 88.0 L105.4 103.0 L79.4 88.0Z" />
      <path className="iso-l" d="M114.9 115.5 L123.5 120.5 L123.5 112.5 L114.9 107.5Z" />
      <path className="iso-r" d="M130.5 116.5 L123.5 120.5 L123.5 112.5 L130.5 108.5Z" />
      <path className="iso-t" d="M121.8 103.5 L130.5 108.5 L123.5 112.5 L114.9 107.5Z" />
      <path className="iso-l" d="M114.0 138.0 L140.0 153.0 L140.0 123.0 L114.0 108.0Z" />
      <path className="iso-r" d="M166.0 138.0 L140.0 153.0 L140.0 123.0 L166.0 108.0Z" />
      <path className="iso-t" d="M140.0 93.0 L166.0 108.0 L140.0 123.0 L114.0 108.0Z" />
      <path className="iso-l" d="M149.5 135.5 L158.2 140.5 L158.2 132.5 L149.5 127.5Z" />
      <path className="iso-r" d="M165.1 136.5 L158.2 140.5 L158.2 132.5 L165.1 128.5Z" />
      <path className="iso-t" d="M156.5 123.5 L165.1 128.5 L158.2 132.5 L149.5 127.5Z" />
      <path className="iso-y" d="M148.7 158.0 L174.6 173.0 L174.6 143.0 L148.7 128.0Z" />
      <path className="iso-y" d="M200.6 158.0 L174.6 173.0 L174.6 143.0 L200.6 128.0Z" />
      <path className="iso-y" d="M174.6 113.0 L200.6 128.0 L174.6 143.0 L148.7 128.0Z" />
    </svg>
  );
}

