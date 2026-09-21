import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '../../components/home/smoothScroll.js';

/* THE FOUR DISCIPLINES ON /services, AS SECTIONS, 2026-09-15.

   Each discipline is a full section, 96px from the next. Three rows.

     row one   the name in Moldie and the promise
     row two   the sub-service cards, 2026-09-16: six per discipline, three
               across from 1024, two from 768, one below. Lit-near with the two
               lights, a Phosphor icon at the 24px station top left, the title
               in Satoshi 18px white, one line in bone
     row three one strip on lit-near, 2026-09-21: the price left in Moldie
               32px, the turnaround and one "Good fit if" line in bone, the
               call right. It replaced the three-column panel (what you get,
               how it goes, the facts); how a project runs is one route band
               at the foot of the page now, not four sets of steps

   THE TILE IS GONE, 2026-09-16, by the user: the cards took its place, so the
   sides no longer alternate. The sticky index down the left margin follows the
   four sections. Below 1024 the index is hidden and the strip stacks.

   THE ICONS ARE SHOP WHITE, inherited from the card, by the user's decision:
   machine yellow would have shared frames with the primary calls on Branding
   and Websites. Each icon is decorative (`aria-hidden`); the title says the
   thing. DESIGN.md records the exception to the icon meaning test. */

export default function ServiceSections({ disciplines }) {
  const [active, setActive] = useState(0);
  const sections = useRef([]);

  /* ScrollTrigger is registered in smoothScroll.js; calling the hook is how
     this file says it depends on that. */
  useSmoothScroll();

  /* The index's active row: which section the reader is ON, in both
     directions. onEnter and onEnterBack both claim it, and leaving the first
     section upward hands it back, so the top of the page shows 01. */
  useEffect(() => {
    const els = sections.current.filter(Boolean);
    if (!els.length) return undefined;
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
  }, [disciplines]);

  /* The bar is sticky, so a section scrolled to its own top would land under
     it; the offset is read off the element. */
  const goTo = (i) => {
    const el = sections.current[i];
    if (!el) return;
    const bar = document.querySelector('.bar');
    const off = (bar ? bar.getBoundingClientRect().height : 0) + 24;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - off,
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  return (
    <div className="svc">
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

      <div className="svc2">
        {disciplines.map((d, i) => (
          <section
            key={d.id}
            id={d.id}
            className="svc2__d"
            aria-labelledby={`svc-${d.id}`}
            ref={(el) => {
              sections.current[i] = el;
            }}
          >
            <div className="svc2__intro">
              <h2 className="svc2__name" id={`svc-${d.id}`}>
                {d.name}
              </h2>
              <p className="svc2__promise">{d.promise}</p>
            </div>

            <ul className="svc2__cards">
              {d.cards.map(({ Icon, title, line }) => (
                <li
                  className="svc2__card"
                  key={title}
                  /* THE TAP HOLDS THE FILL FOR 300ms, 2026-09-16, the same
                     beat the home cards hold before they navigate. These cards
                     are not links, so the fill is all a tap does: `:active`
                     alone lasted as long as the finger and a quick tap painted
                     nothing. The attribute goes straight on the node, not
                     through state, so it paints in the frame the finger
                     lands. */
                  onPointerDown={(e) => {
                    if (e.pointerType === 'mouse') return;
                    const el = e.currentTarget;
                    el.dataset.tap = 'true';
                    setTimeout(() => delete el.dataset.tap, 300);
                  }}
                >
                  <Icon className="i i--md svc2__ci" aria-hidden="true" />
                  <h3 className="svc2__ct">{title}</h3>
                  <p className="svc2__cl">{line}</p>
                </li>
              ))}
            </ul>

            {/* THE STRIP, 2026-09-21: price left in Moldie, turnaround and
                the fit line in bone, the call right. */}
            <div className="svc2__strip">
              <p className="svc2__price">{d.price}</p>
              <div className="svc2__facts">
                <p className="svc2__fact">Turnaround: {d.turnaround}</p>
                <p className="svc2__fact">
                  Good fit if {d.fit.charAt(0).toLowerCase() + d.fit.slice(1)}
                </p>
              </div>
              <Link className={d.call.primary ? 'svc2__cta' : 'svc2__link'} to="/contact-us">
                {d.call.label}
              </Link>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
