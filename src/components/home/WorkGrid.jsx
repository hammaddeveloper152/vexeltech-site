import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from './hooks.js';
import { ArrowUpRight } from '@phosphor-icons/react';
import { VideoTile, videoAllowed } from './Video.jsx';
import { clipForPlate } from './workVideo.js';
import usePointerLight from './usePointerLight.js';
import './WorkGrid.css';

/* Section 3. The work wall.

   Six tiles, asymmetric. Tile one leads on size at every width, per the
   density law: six things of nearly equal size is a composition that has not
   decided.

   Placeholder surfaces for now. Each tile is a fixed-ratio container, so an
   <img> drops into the plate later and nothing about the grid moves.

   Titles are deliberately synthetic. CLAUDE.md records six real work images
   (card-altavia, card-baseline, card-christal, card-artiora, card-zions,
   telecom-case) that are not on this machine, and they map one to one onto
   these six slots. Nothing is substituted for them here: naming a client the
   user has not named in conversation is what BUILD-LAW.md Truth forbids. */
const TILES = [
  { id: 'one', title: 'Placeholder project one', meta: 'Placeholder discipline' },
  { id: 'two', title: 'Placeholder project two', meta: 'Placeholder discipline' },
  { id: 'three', title: 'Placeholder project three', meta: 'Placeholder discipline' },
  { id: 'four', title: 'Placeholder project four', meta: 'Placeholder discipline' },
  { id: 'five', title: 'Placeholder project five', meta: 'Placeholder discipline' },
  { id: 'six', title: 'Placeholder project six', meta: 'Placeholder discipline' },
];

export default function WorkGrid() {
  /* The rise and the press. The tile has no face to light — see
     WorkGrid.css. */
  const lit = usePointerLight();

  const [ref, revealed] = useReveal();

  /* Asked once, after mount, never watched. A connection that changes
     mid-visit must not start six downloads under someone. See Video.jsx for
     the four reasons this comes back false. */
  const [allow, setAllow] = useState(false);
  useEffect(() => setAllow(videoAllowed()), []);

  return (
    <section className="vt work" aria-labelledby="work-h" ref={ref}>
      <div className="work__inner">
        <h2 className="work__h" id="work-h">
          Selected work
        </h2>

        {/* Six separate things to read, so the 70ms stagger applies. The
            reveal is additive: data-revealed only ever adds motion, and the
            grid is fully laid out before it runs. */}
        <ul className="work__list" data-revealed={revealed ? 'true' : 'false'}>
          {TILES.map(({ id, title, meta }, i) => {
            /* Plates are numbered from one, in grid order. */
            const clip = clipForPlate(i + 1);
            return (
            <li className="work__item" key={id} style={{ '--i': i }}>
              <Link className="work__link" {...lit} /* `/work/<id>` matched no route and fell through to the 404 —
                 six tiles linking nowhere. There are no project pages and no
                 projects; `/portfolio` is where the work will live and is a
                 real page today. Re-point these when the plates are filled. */
              to="/portfolio">
                {/* The surface. Three states, and the plate is the same box in
                    all of them, so nothing about the grid moves as files
                    arrive.

                    `live` is the section's own reveal rather than a timer:
                    nothing asks for a byte until the grid has entered, which
                    is the work grid's version of the gate that used to be the
                    hero's ambient phase. See Video.jsx and workVideo.js. */}
                {clip && clip.mp4 && allow ? (
                  <VideoTile clip={clip} live={revealed} className="work__video" />
                ) : clip ? (
                  <img
                    className="work__video"
                    src={clip.poster}
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                    fetchPriority="low"
                  />
                ) : (
                  <span className="work__plate" aria-hidden="true" />
                )}

                {/* Slides up from the bottom edge on hover, on real pointers
                    only. On touch it is simply already there. */}
                <span className="work__label">
                  <span className="work__label-x">
                    <span className="work__label-t">{title}</span>
                    <span className="work__label-m">{meta}</span>
                  </span>

                  {/* Rides in on the band rather than animating separately.
                      Decorative: the whole tile is one link and the title
                      beside it is the accessible name, so an arrow with its
                      own label would announce the destination twice. */}
                  <ArrowUpRight className="i i--sm work__go" aria-hidden="true" />
                </span>
              </Link>
            </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
