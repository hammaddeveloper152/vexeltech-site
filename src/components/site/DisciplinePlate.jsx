import React, { useState } from 'react';
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

/* THE ARTEFACT SLOT, and it needs no code change when the files land.

   3:2 at 40% of the plate, top-aligned, standing 32px above the plate's top
   edge and 32px past its right. The `<img>` is rendered unconditionally and
   points at `/assets/services/<id>.webp`; if the file is not there the load
   fails, one piece of state flips, and the slot shows what a reservation is
   allowed to show — its hairline and the discipline's numeral. Nothing else:
   DESIGN.md holds every reserved slot on the site to a hairline and a numeral,
   because decoration inside a reservation reads as content. */
function Art({ id, name, n }) {
  const [missing, setMissing] = useState(false);
  return (
    <div className="svc__art">
      {missing ? (
        <span className="svc__art-n" aria-hidden="true">
          {n}
        </span>
      ) : (
        <img
          className="svc__art-img"
          src={`/assets/services/${id}.webp`}
          alt={`${name} work by VexelTech`}
          loading="lazy"
          decoding="async"
          onError={() => setMissing(true)}
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
      <Art id={id} name={name} n={n} />
    </Tag>
  );
}
