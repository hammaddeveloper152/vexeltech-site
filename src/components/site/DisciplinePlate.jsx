import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* THE DISCIPLINE PLATE, AN ICON PLATE SINCE 2026-09-21, by the user.

   Lit-near with the two lights, a Phosphor icon at 24px top left in shop
   white (64px until the storyboard pass, 2026-09-21), the name in Moldie,
   the three items. The pointer-follow light came off in the same pass. The
   generated tiles are gone from it and from the build: the plate was a scene card while they filled
   it, and without them it is an object again.

   Mounted on home Services, which hands it an icon, a name and three items
   and links it to the discipline's section on /services. The About page's
   row of plates came off with the storyboard, 2026-09-21.

   The icon is decorative (`aria-hidden`), and inherits the plate's colour so
   the fill turns it asphalt with the words. */

/* `items` is a list of `{ t, dt }`. The home mount passes three, the services
   mount passes the discipline's whole list.

   `as` exists because the same object is an `h2` under a page heading on
   /services and an `h3` under a section heading on the home page. */
export default function DisciplinePlate({
  id,
  name,
  line,
  items,
  Icon,
  index = 0,
  as: Heading = 'h2',
  plateRef,
  href,
}) {

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

  /* A link where the plate summarises a discipline and pressing it goes to
     that discipline; an article if a mount ever passes no `href`. */
  const Tag = href ? Link : 'article';
  const nav = href ? { to: href } : {};

  return (
    <Tag
      className="svc__plate"
      id={id}
      ref={plateRef}
      style={{ '--i': index }}
      data-in="false"
      aria-labelledby={`svc-${id}`}
      {...nav}
      onPointerDown={onPointerDown}
      onPointerCancel={clearTap}
      onClick={onClick}
    >
      {Icon ? <Icon className="svc__icon" aria-hidden="true" /> : null}
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
    </Tag>
  );
}
