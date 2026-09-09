/* The bench — the wall's arrangement, as data.
   ==========================================================================

   The hero's wall is no longer a grid of photographs. It is a lit studio
   bench seen from above, and the tiles are ARTEFACTS lying on it: press
   sheets, swatch strips, type specimens, tracing paper, tape, a steel rule,
   a blade. Objects on a bench overlap, sit at angles, and are not all the
   same size — which is the whole difference from a grid, however good the
   pictures in the grid are.

   ---- What stays --------------------------------------------------------

   The machinery under this is the wall's: six lanes drifting at the three
   ambient stations in alternating directions, the set rendered twice for a
   seamless loop, the responsive ladder, the video capability and its four
   gates, the sourcing rule. Only the concept changed, and this file is the
   concept: what lies where, how big, at what angle, overlapping what.

   ---- The signature is 52.8 degrees, and it lives in the objects ---------

   Not drawn, not clipped, not on the type. Four devices were built on the
   headline and all four came out; DESIGN.md records why. The short version
   is that ONE WORD IS TOO SMALL A PLACE TO PUT A BRAND. So the mark's angle
   — its long arm runs 44 across and 58 up, 52.8 degrees — lives in things
   that naturally lie at angles: a steel rule and a strip of tape across the
   bench, and one short tape in a lane. Those are the only objects at exactly
   that angle. Everything else sits within a few degrees of square, the way
   sheets do when someone has put them down, so the 52.8s read as the
   deliberate ones.

   ---- Geometry, in lane units --------------------------------------------

   `w` is the artefact's width as a share of its lane. Over 1 spills into
   the neighbours, which is what breaks the column read. `rot` is degrees;
   a transform, so it costs nothing. `up` is how far the artefact overlaps
   the one before it, as a share of its own height. Later items sit on top:
   DOM order is z-order, and a bench is stacked in the order things landed.

   Ratios are the ARTEFACT'S own — an A-series sheet is 1:1.414, a strip is
   a strip — because the container no longer decides the slot. The one
   exception is `print`, the 16:10 photograph lying on the bench, which is
   the shape a video clip has to be. Video slots are always prints. */

export const ART = {
  'sheet-p':  { ratio: 1 / 1.414, kind: 'A-series sheet, portrait' },
  'sheet-l':  { ratio: 1.414,     kind: 'A-series sheet, landscape' },
  'print':    { ratio: 1.6,       kind: 'photographic print, 16:10 — the video shape' },
  'specimen': { ratio: 3 / 4,     kind: 'type specimen card' },
  'swatch':   { ratio: 1 / 3.2,   kind: 'swatch strip' },
  'trace':    { ratio: 4 / 5,     kind: 'tracing paper, translucent' },
  'tape':     { ratio: 6.5,       kind: 'tape, translucent' },
  'rule':     { ratio: 14,        kind: 'steel rule' },
  'blade':    { ratio: 3.2,       kind: 'blade' },
};

export const MARK_ANGLE = 52.8;

/* CSS rotates CLOCKWISE, and the mark's arm RISES to the right — 44 across,
   58 up. A horizontal object turned +52.8deg falls to the right, which is the
   wrong line. So every object lying at the mark's angle takes the negative.
   The recorded number stays 52.8; this is the same line expressed in the
   coordinate system that draws it. */
export const MARK_ROT = -MARK_ANGLE;

/* Six lanes. Same ids, stations and directions as before so nothing about
   the drift changes. Six or seven artefacts a lane, not eight or nine:
   overlap fills more of the lane per item, and fewer, larger, angled things
   read as objects where more, smaller, square things read as a grid. */
export const LANES = [
  { id: 'a', dir: 'down', station: 1, items: [
    { art: 'sheet-p',  w: 1.18, rot: -4,   up: 0 },
    { art: 'print',    w: 1.05, rot: 3,    up: 0.22 },
    { art: 'swatch',   w: 0.42, rot: 7,    up: 0.10 },
    { art: 'specimen', w: 0.92, rot: -2,   up: 0.28 },
    { art: 'tape',     w: 1.35, rot: MARK_ROT, up: 0.30 },
    { art: 'sheet-l',  w: 1.22, rot: 2,    up: 0.18 },
  ]},
  { id: 'b', dir: 'up', station: 2, items: [
    { art: 'specimen', w: 0.96, rot: 5,    up: 0 },
    { art: 'trace',    w: 1.10, rot: -6,   up: 0.30 },
    { art: 'sheet-l',  w: 1.25, rot: -1,   up: 0.14 },
    { art: 'blade',    w: 0.70, rot: 12,   up: 0.20 },
    { art: 'sheet-p',  w: 1.08, rot: 3,    up: 0.25 },
    { art: 'print',    w: 1.00, rot: -3,   up: 0.16 },
    { art: 'swatch',   w: 0.38, rot: -8,   up: 0.12 },
  ]},
  { id: 'c', dir: 'down', station: 3, items: [
    { art: 'sheet-l',  w: 1.30, rot: 2,    up: 0 },
    { art: 'swatch',   w: 0.44, rot: -5,   up: 0.24 },
    { art: 'print',    w: 1.02, rot: 4,    up: 0.10 },
    { art: 'trace',    w: 1.12, rot: -3,   up: 0.32 },
    { art: 'specimen', w: 0.90, rot: 6,    up: 0.18 },
    { art: 'sheet-p',  w: 1.15, rot: -2,   up: 0.22 },
  ]},
  { id: 'd', dir: 'up', station: 1, items: [
    { art: 'trace',    w: 1.06, rot: 4,    up: 0 },
    { art: 'sheet-p',  w: 1.20, rot: -5,   up: 0.26 },
    { art: 'blade',    w: 0.66, rot: -14,  up: 0.14 },
    { art: 'specimen', w: 0.94, rot: 2,    up: 0.20 },
    { art: 'sheet-l',  w: 1.28, rot: -3,   up: 0.30 },
    { art: 'swatch',   w: 0.40, rot: 9,    up: 0.10 },
    { art: 'print',    w: 1.04, rot: 1,    up: 0.18 },
  ]},
  { id: 'e', dir: 'down', station: 2, items: [
    { art: 'print',    w: 1.00, rot: -2,   up: 0 },
    { art: 'sheet-p',  w: 1.14, rot: 6,    up: 0.28 },
    { art: 'swatch',   w: 0.46, rot: -4,   up: 0.12 },
    { art: 'sheet-l',  w: 1.26, rot: 3,    up: 0.22 },
    { art: 'trace',    w: 1.08, rot: -7,   up: 0.30 },
    { art: 'specimen', w: 0.88, rot: 1,    up: 0.16 },
  ]},
  { id: 'f', dir: 'up', station: 3, items: [
    { art: 'sheet-l',  w: 1.24, rot: -3,   up: 0 },
    { art: 'specimen', w: 0.92, rot: 5,    up: 0.20 },
    { art: 'trace',    w: 1.10, rot: 2,    up: 0.30 },
    { art: 'print',    w: 1.02, rot: -4,   up: 0.14 },
    { art: 'swatch',   w: 0.42, rot: 6,    up: 0.10 },
    { art: 'sheet-p',  w: 1.16, rot: -1,   up: 0.24 },
    { art: 'blade',    w: 0.64, rot: 10,   up: 0.18 },
  ]},
];

/* The still layer. Two long objects lying across the bench at the mark's
   angle, above the drift and below the scrim. They do not move, which is
   what makes them read as placed rather than as part of the surface, and
   it is what lets them cross lanes: a drifting lane cannot hold something
   that spans its neighbours.

   Positions are shares of the hero's width and height. Two, not three: a
   third would be the row of three the density law forbids, and two of
   different lengths is already a pair that has decided. */
export const STILL = [
  { art: 'rule', x: 0.36, y: 0.10, w: 0.46, rot: MARK_ROT },
  { art: 'tape', x: 0.60, y: 0.66, w: 0.30, rot: MARK_ROT },
];

/* Video lives in prints only, one per lane, at spread heights. Same rule as
   before: one per lane makes vertical adjacency impossible, and the still
   layer never carries video. */
export const VIDEO_SLOTS = {
  'a-1': 1,
  'c-2': 2,
  'e-0': 3,
  'b-5': 4,
  'f-3': 5,
  'd-6': 6,
};
