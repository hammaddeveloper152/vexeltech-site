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

   ---- DARK FRAMES AND TWO TAGS EACH, 2026-09-14 ------------------------------

   Each plate stands in a dark frame now — the lit card surface every object on
   the site carries — with its name UNDER the plate and two tags under the
   name: Branding in yellow, Websites in cream, asphalt text on both. The name
   used to slide up over the plate on hover; it is always there now, below it,
   so nothing covers the work.

   THE YELLOW TAG IS A CARRIER, and that is the user's decision rather than a
   default. Grounds and brand objects were exempted from the one-carrier count
   the same day; a tag is a fill, so it is counted, and the rhythm walk reports
   any frame where it shares a viewport with another carrier.

   Titles are deliberately synthetic. Naming a client the user has not named in
   conversation is what BUILD-LAW.md Truth forbids. The two tags are the user's
   own, given on 2026-09-14. */
const TAGS = ['Branding', 'Websites'];

const TILES = [
  { id: 'one', title: 'Placeholder project one' },
  { id: 'two', title: 'Placeholder project two' },
  { id: 'three', title: 'Placeholder project three' },
  { id: 'four', title: 'Placeholder project four' },
  { id: 'five', title: 'Placeholder project five' },
  { id: 'six', title: 'Placeholder project six' },
];

export default function WorkGrid() {
  /* The rise and the press. The frame has a face now, but the pointer light is
     still the plates' device — see WorkGrid.css. */
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

        {/* Six separate things to read, so the 70ms stagger applies. */}
        <ul className="work__list" data-revealed={revealed ? 'true' : 'false'}>
          {TILES.map(({ id, title }, i) => {
            /* Plates are numbered from one, in grid order. */
            const clip = clipForPlate(i + 1);
            return (
              <li className="work__item" key={id} style={{ '--i': i }}>
                {/* The frame is the link. `/portfolio` is where the work will
                    live and is a real page today. */}
                <Link className="work__link" {...lit} to="/portfolio">
                  {/* The plate, at its breakpoint ratio. Three states, one box,
                      so nothing about the grid moves as files arrive. */}
                  <span className="work__media">
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
                  </span>

                  <span className="work__label">
                    <span className="work__label-x">
                      <span className="work__label-t">{title}</span>
                      <span className="work__tags">
                        {TAGS.map((tag) => (
                          <span className={`work__tag work__tag--${tag.toLowerCase()}`} key={tag}>
                            {tag}
                          </span>
                        ))}
                      </span>
                    </span>

                    {/* Decorative: the title is the link's accessible name. */}
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
