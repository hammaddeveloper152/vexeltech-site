import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Process.css';

/* Section 7. The line down the page.

   Placeholder steps. BUILD-LAW.md Truth: how this agency actually works is a
   capability claim and cannot be written here until it is given. */
const STEPS = [
  {
    id: 'one',
    n: '01',
    title: 'Placeholder step one',
    body: 'Placeholder description for the first step. It stands in for real copy and describes nothing about how the work is done.',
  },
  {
    id: 'two',
    n: '02',
    title: 'Placeholder step two',
    body: 'Placeholder description for the second step, written to about the length the real one will run.',
  },
  {
    id: 'three',
    n: '03',
    title: 'Placeholder step three',
    body: 'Placeholder description for the third step. Nothing here is a claim and nothing here should survive to a deploy.',
  },
  {
    id: 'four',
    n: '04',
    title: 'Placeholder step four',
    body: 'Placeholder description for the fourth and last step, closing the sequence.',
  },
];

export default function Process() {
  const listRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return undefined;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const steps = gsap.utils.toArray('.process__step', list);

      /* Where each step sits along the rail, as a fraction of the rail's own
         length. Measured rather than assumed, and re-measured on refresh,
         because the steps are text and their heights move with the viewport. */
      const measure = () => {
        const listRect = list.getBoundingClientRect();
        steps.forEach((step) => {
          const marker = step.querySelector('.process__n');
          const r = marker.getBoundingClientRect();
          const pos = (r.top + r.height / 2 - listRect.top) / listRect.height;
          step.dataset.pos = String(pos);
        });
      };

      const light = (p) => {
        steps.forEach((step) => {
          const pos = parseFloat(step.dataset.pos || '0');
          step.dataset.lit = p >= pos ? 'true' : 'false';
        });
      };

      measure();

      /* Scrubbed, not timed: the reader drives it in both directions. scaleY
         from a top origin, never height, so nothing here is a layout property. */
      const tween = gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: list,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: measure,
            onUpdate: (self) => light(self.progress),
          },
        }
      );

      light(tween.scrollTrigger ? tween.scrollTrigger.progress : 0);

      return () => {
        steps.forEach((step) => {
          step.removeAttribute('data-lit');
          step.removeAttribute('data-pos');
        });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="vt process" aria-labelledby="process-h">
      <div className="process__inner">
        <h2 className="process__h" id="process-h">
          How it works
        </h2>

        {/* The rail lives beside the list, not inside it: an <ol> may only
            hold <li>, and a stray div in there is invalid markup. Decorative
            either way, since the steps are numbered in the markup and the line
            repeats that rather than carrying it. */}
        <div className="process__track">
          <div className="process__rail" aria-hidden="true">
            <span className="process__rail-fill" ref={fillRef} />
          </div>

          <ol className="process__steps" ref={listRef}>
            {STEPS.map(({ id, n, title, body }) => (
              <li className="process__step" key={id} data-lit="false">
                <span className="process__n" aria-hidden="true">
                  {n}
                </span>
                <div className="process__body">
                  <h3 className="process__t">{title}</h3>
                  <p className="process__d">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
