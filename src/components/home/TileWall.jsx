import React from 'react';
import './TileWall.css';

/* The wall.

   Fourteen photographs across forty-eight slots. The tile is a fixed-ratio
   16:10 container and the image fills it with object-fit: cover, so nothing
   about the layout depends on what any individual image is.

   SIX columns at desktop, three at tablet, one on a phone. It was three at
   desktop, which made each tile about 400px wide and read as a handful of
   large photographs rather than as a wall. Density is the whole point of the
   thing: at six the tile is around 200px and the eye reads a surface instead
   of counting pictures.

   Fourteen, not fifteen: two of the supplied files were byte-identical and
   the duplicate was dropped.

   Each column takes an ambient station from DESIGN.md and no two columns
   share both a station and a direction, so none of them fall into step and
   resolve into one sliding plane. The station is the value, not the seconds:
   do not put a raw duration back in here.

   The wall does not run at page load. It is composed and still until the
   hero's entrance finishes, then wakes one column at a time on the sweep
   stagger. All of that lives in TileWall.css and Hero.jsx; this file only
   supplies each column's index.

   ---- How the numbers are arranged ---------------------------------------

   Two rules, both satisfiable and both checked rather than eyeballed:

   1. No image appears twice in the same column.
   2. No image is vertically adjacent to itself, INCLUDING across the loop
      seam. The set is rendered twice and the track translates by exactly one
      set, so the last tile of a column sits directly above the first tile of
      its copy. An arrangement that ignores the wrap looks correct in the
      source and shows a doubled image once a second.

   Horizontal adjacency between columns is deliberately NOT a rule. The
   columns travel at different speeds and in different directions, so every
   horizontal pairing changes continuously and none of them can be arranged
   for. Anything claiming to control it would be describing the first frame
   and nothing after it. */
/* Six columns, and every one of them is a different station-and-direction
   pair. There are only three ambient stations in DESIGN.md and six columns,
   so a station is reused twice; what stops the pair from sliding as one plane
   is that the two columns sharing a station run in opposite directions. Three
   stations by two directions is exactly six combinations, so no two columns
   move alike. Do not add a fourth station to solve this: the stations are a
   DESIGN.md value and the directions are free. */
const COLUMNS = [
  { id: 'a', dir: 'down', station: 1, tiles: [1, 2, 3, 4, 5, 6, 7, 8] },
  { id: 'b', dir: 'up', station: 2, tiles: [9, 10, 11, 12, 13, 14, 1, 2, 3] },
  { id: 'c', dir: 'down', station: 3, tiles: [4, 5, 6, 7, 8, 9, 10] },
  { id: 'd', dir: 'up', station: 1, tiles: [11, 12, 13, 14, 1, 2, 3, 4] },
  { id: 'e', dir: 'down', station: 2, tiles: [5, 6, 7, 8, 9, 10, 11, 12, 13] },
  { id: 'f', dir: 'up', station: 3, tiles: [14, 1, 2, 3, 4, 5, 6] },
];

/* Vite resolves these at build time, so the filenames are checked by the
   bundler rather than assembled into a string at runtime and 404ing quietly
   if one is ever renamed. */
const FILES = import.meta.glob('../../assets/images/tiles/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
});

const src = (n) =>
  FILES[`../../assets/images/tiles/tile-${String(n).padStart(2, '0')}.jpg`];

function Tile({ n, col, i }) {
  return (
    <div className="wall__tile" data-slot={`${col}-${i}`}>
      {/* alt is empty and the whole wall is aria-hidden: these are texture,
          not content, and nothing in them is information a reader needs.

          fetchpriority low, because this is the one thing in the hero that
          can afford to arrive late. The headline, the fonts and the call are
          what the reader came for; a scrimmed background photograph that is
          not moving yet must not compete with them for bandwidth. */}
      <img
        className="wall__img"
        src={src(n)}
        alt=""
        decoding="async"
        fetchPriority="low"
      />
    </div>
  );
}

export default function TileWall() {
  return (
    <div className="wall" aria-hidden="true">
      {COLUMNS.map(({ id, dir, station, tiles }, col) => (
        <div className="wall__col" key={id}>
          {/* The set is rendered twice. The loop is a continuous translate
              across one full set, never a reset, so there is no seam. */}
          <div
            className={`wall__track wall__track--${dir}`}
            /* --col drives the staggered wake in TileWall.css. It is the
               column's position in the wall, not its ambient station: the
               stations are deliberately unordered so the columns never fall
               into step, and staggering by station would wake them in an
               order the reader can see is arbitrary. */
            style={{ '--dur': `var(--d-ambient-${station})`, '--col': col }}
          >
            {tiles.map((n, i) => (
              <Tile n={n} col={id} i={i} key={`x${i}`} />
            ))}
            {tiles.map((n, i) => (
              <Tile n={n} col={id} i={i} key={`y${i}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
