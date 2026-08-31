import React from 'react';
import { useReveal } from './hooks.js';
import { ArrowUpRight } from '@phosphor-icons/react';
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
  const [ref, revealed] = useReveal();

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
          {TILES.map(({ id, title, meta }, i) => (
            <li className="work__item" key={id} style={{ '--i': i }}>
              <a className="work__link" href={`/work/${id}`}>
                {/* The plate. An <img> replaces this later at the same size. */}
                <span className="work__plate" aria-hidden="true" />

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
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
