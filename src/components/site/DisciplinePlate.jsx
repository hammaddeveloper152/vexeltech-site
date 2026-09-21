import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* THE DISCIPLINE CARD, home's What we do, RESTORED 2026-09-22 by the
   founder's restructure: the four word tiles are the card faces again.

   The tile fills the card edge to edge; the name in Moldie and the three
   items sit bottom-left on the hold-then-fade shade; hover, focus or a tap
   fills the card machine yellow and lifts it 4px; it tilts 1.5 degrees at
   rest and straightens on arrival. As built at c711e56, less the
   pointer-follow light (withdrawn by the user, 2026-09-21) and the /services
   split variant (no longer mounted). The tiles are the founder's files,
   `/assets/services/<id>.webp`, restored from git. */

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
}) {
  const [hot, setHot] = useState(false);

  /* THE TAP FILLS BEFORE IT LEAVES, 2026-09-16, by the user. A pointer fills
     the card on hover and the reader sees the accent arrive; a finger has no
     hover, so the tap holds the fill for 300ms and the page then changes. The
     card is a link only on the home page, so this runs only where there is
     somewhere to go.

     `data-tap` is the same state the hover rule paints, so the fill is one
     declaration rather than a touch copy of it. The timer is cleared on
     unmount: a card tapped as the reader leaves must not navigate after. */
  const tapped = useRef(false);
  const tapAt = useRef(0);
  const tapEl = useRef(null);
  const timer = useRef(null);
  const release = useRef(null);
  const navigate = useNavigate();
  useEffect(() => () => {
    clearTimeout(timer.current);
    clearTimeout(release.current);
  }, []);

  /* THE ATTRIBUTE IS SET ON THE ELEMENT, NOT THROUGH STATE, and that is the
     difference between a fill and no fill. Through `useState` the flag was set
     on pointerdown and the click ran before React had re-rendered, so the card
     navigated with nothing painted: measured at 0ms of fill. Writing
     `data-tap` straight onto the node paints it in the same frame the finger
     lands. */
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse') return;
    tapped.current = true;
    tapAt.current = performance.now();
    tapEl.current = e.currentTarget;
    e.currentTarget.dataset.tap = 'true';
    /* THE FILL CLEARS EVEN IF NO CLICK ARRIVES. It used to be cleared by the
       click handler alone, so a tap that produced no click left the card
       filled and lifted with nothing to undo it — four cards stuck yellow at
       390 in the viewer audit. The hold is the same 300ms either way. */
    clearTimeout(release.current);
    release.current = setTimeout(() => {
      if (tapped.current) clearTap();
    }, 320);
  };

  const clearTap = () => {
    tapped.current = false;
    if (tapEl.current) delete tapEl.current.dataset.tap;
  };

  const onClick = (e) => {
    if (!href || !tapped.current) return;
    e.preventDefault();
    const left = Math.max(0, 300 - (performance.now() - tapAt.current));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      clearTap();
      navigate(href);
    }, left);
  };

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
      data-variant="card"
      data-side={side}
      data-in="false"
      aria-labelledby={`svc-${id}`}
      {...nav}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHot(true)}
      onPointerDown={onPointerDown}
      onPointerCancel={clearTap}
      onClick={onClick}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHot(false)}
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
