import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import usePointerLight from '../home/usePointerLight.js';

/* THE DISCIPLINE PLATE. One component, two mounts: `/services` and the home
   page's Services section.

   It was inside `ServicePlates.jsx` and the home section was about to grow a
   second copy of it. Two implementations of one object is the drift nobody
   notices until a screenshot — and this one carries a surface, two lights,
   four tinted edges, a bar, a slot ratio and a fallback, every one of which
   would have had to be kept in step by hand.

   The plate does not know which page it is on. What differs between the two
   mounts is the grid around it and the number of items handed to it, and both
   of those belong to the mount. */

/* THE ARTEFACT SLOT, AND IT IS NOT THERE UNTIL THE FILE IS.

   A reservation used to render whatever happened: a hairline, a numeral, a
   3:2 box bleeding past the plate. That is right in a workshop and wrong on a
   shipped page. A reader does not know a photograph is coming — they see an
   empty bordered box with a number in it and read it as a component that
   failed. **An empty slot is removed, not marked.**

   So the slot is asked for rather than assumed. `/assets/services/<id>.webm`
   and `<id>.webp` are probed with a HEAD request; whichever resolves is what
   renders, motion preferred, and if neither does the slot is not in the DOM at
   all. The plate keeps a small mono index in its top-right corner instead —
   the plate's own number, not a placeholder for anything.

   THE RESERVATION IS BEHIND A FLAG, and the flag is OFF everywhere by
   default — in dev as well as in a build. `VITE_SHOW_RESERVED=1` is what turns
   it on, for whoever is supplying the files and needs to see the box, its
   ratio and its bleed.

   It was `import.meta.env.DEV`, which is the wrong switch: it ties "show me
   what is missing" to "are you running the dev server", and those are
   different questions. Everyone who opens the dev server is not producing
   artwork, and someone producing artwork may well want to see the slots in a
   preview build. One environment variable, asked for explicitly, off unless
   somebody asks.

   TWO REQUESTS PER PLATE WHILE NOTHING EXISTS, and they are same-origin 404s.
   There is no way to know a file exists without asking, and the alternative —
   render the slot and remove it on error — flashes a box on every load of a
   page that has no files. Probing first costs a request and shifts nothing.
   The day a file lands its plate makes one request instead of two. */
function Art({ id, name, n, lit }) {
  const [src, setSrc] = useState(undefined); // undefined = still asking

  useEffect(() => {
    let live = true;
    /* 200 IS NOT PROOF THE FILE EXISTS. This is a single-page app, so the
       server answers an unknown path with `index.html` and a 200 — every probe
       "resolved", and four plates rendered a <video> pointing at a page of
       HTML. The status says the request succeeded; the CONTENT TYPE says what
       came back. A webm has to be video/*, a webp image/*, and the SPA
       fallback is text/html, which is what tells them apart. */
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
    /* Nothing to show. In dev, show what is reserved; in a build, show
       nothing at all. */
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
        /* Rests on its first frame and plays while the pointer is on the
           plate. `muted` and `playsInline` because it is decoration with no
           soundtrack and must not take over a phone screen; the plate's own
           lit state drives it, so nothing here watches the pointer twice. */
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
        <img
          className="svc__art-img"
          src={src}
          alt={`${name} work by VexelTech`}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}

/* `items` is a list of `{ t, dt }`. The home mount passes three, the services
   mount passes the discipline's whole list; the plate does not care and does
   not decide, because how much of an offer a page shows is the page's call.

   `headingId` and `as` exist because the same object is an `h2` under a page
   heading on /services and an `h3` under a section heading on the home page.
   A heading level is a document structure fact, not a component preference. */
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
  const lit = usePointerLight();
  const [hot, setHot] = useState(false);

  /* AN ARTICLE, OR A LINK, AND THE MOUNT DECIDES.

     On the home page the plate is a summary of a discipline and pressing it
     goes to that discipline on /services, so the whole object is the control.
     On /services the plate IS that page's section — a link from it to its own
     anchor is a control that does nothing, which is worse than no control. */
  const Tag = href ? Link : 'article';
  const nav = href ? { to: href } : {};

  return (
    <Tag
      className="svc__plate"
      id={id}
      ref={plateRef}
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
      {/* THE PLATE'S OWN NUMBER, top right, and it is not a placeholder. The
          same numeral the /services index rail carries, so one object has one
          name wherever it appears. */}
      <span className="svc__n" aria-hidden="true">
        {n}
      </span>
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
      <Art id={id} name={name} n={n} lit={hot} />
    </Tag>
  );
}
