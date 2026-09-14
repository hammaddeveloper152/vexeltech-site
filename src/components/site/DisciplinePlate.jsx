import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import usePointerLight from '../home/usePointerLight.js';

/* THE DISCIPLINE PLATE. One component, two mounts, and since 2026-09-15 two
   VARIANTS, because the tiles are scenes and a scene is the card.

     card   the home page's Services section. The tile fills the card edge to
            edge; a gradient carries the name and the three items bottom-left.
     split  `/services`. The copy on lit-near in the left half, the tile in the
            right half at the plate's full height, flush to the edges.

   What was withdrawn: the bleeding slot, a panel standing 32px off the plate's
   top and right edges. A bleed is for an OBJECT resting on a plate. The tiles
   are pictures of a whole place with a horizon, and a place cropped into a
   square that floats over a card reads as a sticker. DESIGN.md records it.

   The plate does not know which page it is on. The mount chooses the variant,
   the grid, and how many items to hand over. */

/* THE ARTEFACT, AND IT IS NOT THERE UNTIL THE FILE IS.

   `/assets/services/<id>.webm` and `<id>.webp` are probed with a HEAD request;
   whichever resolves is what renders, motion preferred, and if neither does the
   art is not in the DOM at all. 200 is not proof: this is a single-page app and
   an unknown path answers `index.html` with a 200, so the CONTENT TYPE is what
   tells a file from the fallback.

   The reservation (a hairline and a numeral) is behind `VITE_SHOW_RESERVED=1`
   and off everywhere by default. */
function Art({ id, n, lit }) {
  const [src, setSrc] = useState(undefined); // undefined = still asking

  useEffect(() => {
    let live = true;
    const head = (u, kind) =>
      fetch(u, { method: 'HEAD' })
        .then((r) => {
          const t = r.headers.get('content-type') || '';
          return r.ok && t.startsWith(kind) ? u : null;
        })
        .catch(() => null);
    Promise.all([
      head(`/assets/services/${id}.webm`, 'video/'),
      head(`/assets/services/${id}.webp`, 'image/'),
    ]).then(([webm, webp]) => {
      if (live) setSrc(webm || webp || null);
    });
    return () => {
      live = false;
    };
  }, [id]);

  if (src === undefined) return null;

  if (src === null) {
    if (import.meta.env.VITE_SHOW_RESERVED !== '1') return null;
    return (
      <div className="svc__art" data-reserved="true">
        <span className="svc__art-n" aria-hidden="true">
          {n}
        </span>
      </div>
    );
  }

  return (
    <div className="svc__art">
      {src.endsWith('.webm') ? (
        <video
          className="svc__art-img"
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          ref={(el) => {
            if (!el) return;
            if (lit) el.play().catch(() => {});
            else el.pause();
          }}
        />
      ) : (
        /* EMPTY ALT. The tiles are generated illustrations: "work by
           VexelTech" would tell a screen reader they are client work, which
           BUILD-LAW Truth does not allow. The words inside them are the
           artwork's own (BUILD-LAW, sourcing rule, 2026-09-15), and the
           discipline is named by the heading beside them. */
        <img className="svc__art-img" src={src} alt="" loading="lazy" decoding="async" />
      )}
    </div>
  );
}

/* `items` is a list of `{ t, dt }`. The home mount passes three, the services
   mount passes the discipline's whole list.

   `as` exists because the same object is an `h2` under a page heading on
   /services and an `h3` under a section heading on the home page. */
export default function DisciplinePlate({
  id,
  name,
  line,
  items,
  n,
  side,
  as: Heading = 'h2',
  plateRef,
  href,
  variant = 'split',
}) {
  const lit = usePointerLight();
  const [hot, setHot] = useState(false);

  /* A link on the home page, where the card summarises a discipline and
     pressing it goes to that discipline; an article on /services, where the
     plate IS the section and a link to its own anchor would do nothing. */
  const Tag = href ? Link : 'article';
  const nav = href ? { to: href } : {};

  /* NO CORNER NUMERAL. It was the plate's index, top right, 11px steel-lift on
     lit-near. Both variants put the tile in that corner now, and steel on a
     photograph is not a pair anyone can measure once; /services keeps its
     numerals on the index rail. */
  return (
    <Tag
      className="svc__plate"
      id={id}
      ref={plateRef}
      data-variant={variant}
      data-side={side}
      data-in="false"
      aria-labelledby={`svc-${id}`}
      {...nav}
      {...lit}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHot(true)}
      onPointerLeave={(e) => {
        lit.onPointerLeave(e);
        setHot(false);
      }}
    >
      <div className="svc__body">
        <Heading className="disc__name" id={`svc-${id}`}>
          {name}
        </Heading>
        {line ? <p className="disc__line">{line}</p> : null}
        <ul className="disc__list">
          {items.map(({ t, dt }) => (
            <li className="disc__item" key={t}>
              {t}
              {dt ? <span className="disc__detail">{dt}</span> : null}
            </li>
          ))}
        </ul>
      </div>
      <Art id={id} n={n} lit={hot} />
    </Tag>
  );
}
