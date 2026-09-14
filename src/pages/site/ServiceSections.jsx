import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '../../components/home/smoothScroll.js';

/* THE FOUR DISCIPLINES ON /services, AS SECTIONS, 2026-09-15.

   Each discipline is a full section, 96px from the next, and the sides
   alternate: tile right, left, right, left. Two rows.

     row one   the name in Moldie and the promise, beside the tile at 45% of
               the width, cover-fit, 12px radius
     row two   one lit panel in three columns, split by hairlines: what you
               get, how it goes, the facts and the call

   It replaces the plate stack (ServicePlates and the split DisciplinePlate).
   The sticky index down the left margin is the one piece carried over, now
   following these four sections. Below 1024 the index is hidden, the tile goes
   above the name, and the three columns stack. */

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
            data-side={i % 2 === 0 ? 'right' : 'left'}
            aria-labelledby={`svc-${d.id}`}
            ref={(el) => {
              sections.current[i] = el;
            }}
          >
            <div className="svc2__top">
              <div className="svc2__intro">
                <h2 className="svc2__name" id={`svc-${d.id}`}>
                  {d.name}
                </h2>
                <p className="svc2__promise">{d.promise}</p>
              </div>
              {/* The founder's generated tile. Empty alt: an illustration, not
                  client work, and the heading beside it names it. */}
              <div className="svc2__tile">
                <img src={`/assets/services/${d.id}.webp`} alt="" loading="lazy" decoding="async" />
              </div>
            </div>

            <div className="svc2__panel">
              <div className="svc2__col svc2__col--get">
                <h3 className="svc2__ch">What you get</h3>
                <dl className="svc2__groups">
                  {d.get.map(({ g, t }) => (
                    <div className="svc2__group" key={g}>
                      <dt className="svc2__gt">{g}</dt>
                      <dd className="svc2__gd">{t}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="svc2__col">
                <h3 className="svc2__ch">How it goes</h3>
                <ol className="svc2__steps">
                  {d.steps.map(([title, text], k) => (
                    <li className="svc2__step" key={title}>
                      <span className="svc2__sn" aria-hidden="true">
                        {k + 1}
                      </span>
                      <p className="svc2__st">
                        <strong>{title}</strong> {text}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="svc2__col svc2__col--facts">
                <dl className="svc2__facts">
                  <div>
                    <dt className="svc2__gt">Price</dt>
                    <dd className="svc2__gd">
                      {d.price}
                      {d.pricing ? (
                        <>
                          {' '}
                          <Link className="svc2__inline" to="/pricing">
                            See pricing
                          </Link>
                          .
                        </>
                      ) : null}
                    </dd>
                  </div>
                  <div>
                    <dt className="svc2__gt">Turnaround</dt>
                    <dd className="svc2__gd">{d.turnaround}</dd>
                  </div>
                  <div>
                    <dt className="svc2__gt">Good fit if</dt>
                    <dd className="svc2__gd">{d.fit}</dd>
                  </div>
                  <div>
                    <dt className="svc2__gt">Not a fit if</dt>
                    <dd className="svc2__gd">{d.notFit}</dd>
                  </div>
                </dl>
                <Link className={d.call.primary ? 'svc2__cta' : 'svc2__link'} to="/contact-us">
                  {d.call.label}
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
