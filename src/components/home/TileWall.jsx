import React from 'react';
import './TileWall.css';

/* The wall.
   Placeholder tones for now. Real images drop into the same slots later by
   swapping the tone class for an <img>: the tile is a fixed-ratio container,
   so nothing about the layout changes when they arrive.

   Roughly six dark to one yellow. The yellow is not a pattern, so the slots
   are hand-placed at uneven intervals rather than every nth tile. */
const COLUMNS = [
  {
    id: 'a',
    dir: 'down',
    seconds: 88,
    tiles: ['asphalt', 'surface-2', 'surface-1', 'yellow', 'surface-1', 'asphalt', 'surface-2', 'surface-1'],
  },
  {
    id: 'b',
    dir: 'up',
    seconds: 64,
    tiles: ['surface-1', 'asphalt', 'surface-2', 'asphalt', 'surface-1', 'yellow', 'surface-2', 'asphalt', 'surface-1'],
  },
  {
    id: 'c',
    dir: 'down',
    seconds: 104,
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
      {COLUMNS.map(({ id, dir, seconds, tiles }) => (
        <div className="wall__col" key={id}>
          {/* The set is rendered twice. The loop is a continuous translate
              across one full set, never a reset, so there is no seam. */}
          <div
            className={`wall__track wall__track--${dir}`}
            style={{ '--dur': `${seconds}s` }}
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
