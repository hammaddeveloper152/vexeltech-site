import React from 'react';
import './TileWall.css';

/* The wall.
   Placeholder tones for now. Real images drop into the same slots later by
   swapping the tone class for an <img>: the tile is a fixed-ratio container,
   so nothing about the layout changes when they arrive.

   Roughly six dark to one yellow. The yellow is not a pattern, so the slots
   are hand-placed at uneven intervals rather than every nth tile.

   Each column takes a different ambient station from DESIGN.md, so the three
   never fall into step and resolve into one sliding plane. The station is the
   value, not the seconds: do not put a raw duration back in here.

   The wall does not run at page load. It is composed and still until the
   hero's entrance finishes, then wakes one column at a time on the 70ms
   stagger. All of that lives in TileWall.css and Hero.jsx; this file only
   supplies each column's index. */
const COLUMNS = [
  {
    id: 'a',
    dir: 'down',
    station: 2,
    tiles: ['asphalt', 'surface-2', 'surface-1', 'yellow', 'surface-1', 'asphalt', 'surface-2', 'surface-1'],
  },
  {
    id: 'b',
    dir: 'up',
    station: 1,
    tiles: ['surface-1', 'asphalt', 'surface-2', 'asphalt', 'surface-1', 'yellow', 'surface-2', 'asphalt', 'surface-1'],
  },
  {
    id: 'c',
    dir: 'down',
    station: 3,
    tiles: ['surface-2', 'surface-1', 'asphalt', 'surface-2', 'yellow', 'asphalt', 'surface-1'],
  },
];

function Tile({ tone, col, i }) {
  return (
    <div className={`wall__tile wall__tile--${tone}`} data-slot={`${col}-${i}`} />
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
            {tiles.map((tone, i) => (
              <Tile tone={tone} col={id} i={i} key={`x${i}`} />
            ))}
            {tiles.map((tone, i) => (
              <Tile tone={tone} col={id} i={i} key={`y${i}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
