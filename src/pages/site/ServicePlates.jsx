import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '../../components/home/smoothScroll.js';

/* THE FOUR DISCIPLINES, AS PLATES.

   Same object the About page uses — warm surface, hairline, warm-white corner
   glow, the 3px yellow bar on the left edge, a 1.5 degree tilt that
   straightens with a 4px lift over 250ms on the reveal curve.

   ---- What is different, and it is the trigger, not the mechanic ---------

   An About plate straightens on hover or tap, because it is a control: it has
   an answer to reveal and pressing it is how you ask. These four are not
   controls. There is nothing hidden inside them and nothing to press, so
   hovering one would promise a reveal that never comes.

   They straighten on ARRIVAL instead: ScrollTrigger at `top 70%`, which is the
   moment the plate is 30% into the viewport. The tilt is the state a plate is
   in before the reader has reached it, and straightening is the page settling
   as they arrive rather than a response to anything they did.

   IT FIRES ONCE. `once: true` on every trigger, because a plate that
   re-tilts when it leaves the top of the screen is a plate that undoes itself
   behind the reader — and scrolling back up would then re-straighten four
   plates the reader has already read. Arrival happens once.

   ---- Reduced motion ------------------------------------------------------

   Straight, from first paint, with no trigger created at all. Not a slower
   straighten: the whole device is the movement, and there is no gentler
   version of a rectangle rotating. `gsap.matchMedia` owns both branches, so
   the reduce case is a declaration rather than a check inside the animated
   path — the same shape `Failures.jsx` and `Process.jsx` use. */

/* THE ARTEFACT SLOT, and it needs no code change when the files land.

   3:2 at 40% of the plate, top-aligned, standing 32px above the plate's top
   edge and 32px past its right. The `<img>` is rendered unconditionally and
   points at `/assets/services/<id>.webp`; if the file is not there the load
   fails, one piece of state flips, and the slot shows what a reservation is
   allowed to show — its hairline and the discipline's numeral.

   NOTHING ELSE. It carried the page's WebGL surface at half intensity, and
   that is decoration inside a box reserved for a photograph: a reader cannot
   tell a slot that is waiting from a slot that is finished. DESIGN.md now
   carries the rule for every reserved slot on the site.

   The day `branding.webp` is dropped into `/public/assets/services/` it
   renders, cover-fit, and nothing in this file changes. */
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

function Plate({ d, i, plateRef }) {
  return (
    <article
      className="svc__plate"
      id={d.id}
      ref={plateRef}
      data-side={i % 2 === 0 ? 'left' : 'right'}
      data-in="false"
      aria-labelledby={`svc-${d.id}`}
    >
      <div className="svc__body">
        <h2 className="disc__name" id={`svc-${d.id}`}>
          {d.name}
        </h2>
        <p className="disc__line">{d.line}</p>
        <ul className="disc__list">
          {d.items.map(({ t, dt }) => (
            <li className="disc__item" key={t}>
              {t}
              {dt ? <span className="disc__detail">{dt}</span> : null}
            </li>
          ))}
        </ul>
      </div>
      <Art id={d.id} name={d.name} n={String(i + 1).padStart(2, '0')} />
    </article>
  );
}

export default function ServicePlates({ disciplines }) {
  const wrap = useRef(null);
  const plates = useRef([]);
  const [active, setActive] = useState(0);

  /* ScrollTrigger is registered in smoothScroll.js and nowhere else. Calling
     the hook is how this page says it depends on that, rather than relying on
     some other section having imported it first. Ref counted by design. */
  useSmoothScroll();

  useEffect(() => {
    const els = plates.current.filter(Boolean);
    if (!els.length) return undefined;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const sts = els.map((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          /* 30% into the viewport: the plate's top edge reaching 70% down. */
          start: 'top 70%',
          once: true,
          onEnter: () => {
            el.dataset.in = 'true';
          },
          /* A plate above the fold on first paint never crosses its start, so
             it would sit tilted forever. */
          onRefresh: (self) => {
            if (self.progress > 0) el.dataset.in = 'true';
          },
          id: `svc-in-${i}`,
        })
      );

      /* The index's active row. A separate trigger because it tracks a
         different thing: which plate the reader is ON, which changes in both
         directions, where straightening happens once.

         onEnter AND onEnterBack, NOT onToggle. The first version set the
         active row when a trigger became active and never cleared it, so above
         the first plate — the top of the page, where every reader starts — the
         index sat on whichever plate had last been active. After a scroll to
         the bottom and back it showed 04 while the reader was looking at the
         heading. Entering claims the row; leaving upward hands it to the plate
         above, and above the first plate nothing has been entered, so the
         initial 0 stands. */
      const marks = els.map((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
          onLeaveBack: () => {
            if (i === 0) setActive(0);
          },
          id: `svc-mark-${i}`,
        })
      );

      return () => {
        sts.forEach((s) => s.kill());
        marks.forEach((s) => s.kill());
      };
    });

    /* Straight, and present, with no trigger and no animation. */
    mm.add('(prefers-reduced-motion: reduce)', () => {
      els.forEach((el) => {
        el.dataset.in = 'true';
      });
      return undefined;
    });

    return () => mm.revert();
  }, [disciplines]);

  /* The bar is sticky and in flow, so a plate scrolled to its own top lands
     underneath it. The offset is read off the element rather than typed, so
     the two cannot drift. Reduced motion gets the same destination without
     the travel. */
  const goTo = (i) => {
    const el = plates.current[i];
    if (!el) return;
    const bar = document.querySelector('.bar, header');
    const off = (bar ? bar.getBoundingClientRect().height : 0) + 24;
    const reduce =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - off,
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  return (
    <div className="svc" ref={wrap}>
      {/* THE INDEX. Four numerals in the name face, one per plate, sticky down
          the left margin. It is a `nav` of buttons rather than a list of
          anchors because it moves the reader inside a page they are already
          on; there is no destination to open in a new tab. Hidden below 1024,
          where there is no margin to put it in and the plates are the whole
          width — an index of four in a column of one is furniture. */}
      <nav className="svc__index" aria-label="Disciplines">
        <ol className="svc__index-list">
          {disciplines.map((d, i) => (
            <li key={d.id}>
              <button
                type="button"
                className="svc__index-n"
                data-active={active === i ? 'true' : 'false'}
                aria-current={active === i ? 'true' : undefined}
                onClick={() => goTo(i)}
              >
                <span className="svc__index-bar" aria-hidden="true" />
                {String(i + 1).padStart(2, '0')}
                <span className="skip-h"> {d.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="svc__plates">
        {disciplines.map((d, i) => (
          <Plate
            key={d.id}
            d={d}
            i={i}
            plateRef={(el) => {
              plates.current[i] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
}
