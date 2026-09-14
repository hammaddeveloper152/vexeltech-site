import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DisciplinePlate from '../../components/site/DisciplinePlate.jsx';
import usePlateArrival from '../../components/home/usePlateArrival.js';

/* THE FOUR DISCIPLINES ON /services, AND THE INDEX BESIDE THEM.

   The plate is `DisciplinePlate`, shared with the home page's Services
   section, and its arrival is `usePlateArrival`, shared with the same. What is
   left in this file is the thing only this page has: a sticky index down the
   left margin.

   Both moved out when the home section was rebuilt on the same object. Two
   implementations of one plate is the drift nobody notices until a screenshot,
   and this one carries a surface, two lights, four tinted edges, a bar, a slot
   ratio and a fallback — every one of which would otherwise have had to be
   kept in step by hand. */

export default function ServicePlates({ disciplines }) {
  const [active, setActive] = useState(0);
  const [plateRef, plates] = usePlateArrival(disciplines.length);

  /* The index's active row. Its own triggers, because it tracks a different
     thing from arrival: which plate the reader is ON, which changes in both
     directions, where straightening happens once.

     onEnter AND onEnterBack, not onToggle. A trigger that claims the active
     row when it becomes active and never gives it back leaves the index
     showing whichever plate was last active — so the top of the page, where
     every reader starts, showed 04. A scroll indicator has to answer for the
     space ABOVE the first item as well as between them. */
  useEffect(() => {
    const els = plates.current.filter(Boolean);
    if (!els.length) return undefined;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
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
      return () => marks.forEach((s) => s.kill());
    });

    return () => mm.revert();
  }, [disciplines, plates]);

  /* The bar is sticky and in flow, so a plate scrolled to its own top lands
     underneath it. The offset is read off the element rather than typed, so
     the two cannot drift. Reduced motion gets the same destination without the
     travel. */
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
    <div className="svc">
      {/* THE INDEX. Four numerals in the name face, one per plate, sticky down
          the left margin. A `nav` of buttons rather than anchors because it
          moves the reader inside a page they are already on; there is no
          destination to open in a new tab. Hidden below 1024, where there is
          no margin to put it in and an index of four in a column of one is
          furniture. */}
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
          <DisciplinePlate
            key={d.id}
            id={d.id}
            name={d.name}
            line={d.line}
            items={d.items}
            n={String(i + 1).padStart(2, '0')}
            side={i % 2 === 0 ? 'left' : 'right'}
            as="h2"
            variant="split"
            plateRef={plateRef(i)}
          />
        ))}
      </div>
    </div>
  );
}
