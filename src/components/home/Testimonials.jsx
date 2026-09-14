import React, { useEffect, useRef, useState } from 'react';
import { cssMs, useReducedMotion } from './hooks.js';
import { Quotes } from '@phosphor-icons/react';
import './Testimonials.css';

/* Section 6. One quote at a time.

   SWITCHED OFF UNTIL A QUOTE EXISTS, 2026-09-14. Every quote below is a
   placeholder and is marked as one, and the section renders nothing while no
   quote is real: a carousel of four sentences saying they are placeholders is
   a section telling the reader there is no proof yet, in the one place proof
   is supposed to go. Replace a placeholder with a real quote, delete its
   `placeholder` flag, and the section returns with no other change.

   BUILD-LAW.md Truth: a testimonial is a claim about the work made in someone
   else's voice, which is the last thing that may be invented here. Names and
   companies are placeholders for the same reason.

   The placeholders are written at roughly the length a real one runs, so the
   slot is sized by something honest rather than by a short stand-in that
   collapses when the real copy lands. */
const ALL_QUOTES = [
  {
    id: 'one',
    placeholder: true,
    quote:
      'Placeholder quote one. This sentence holds the shape of a real testimonial until one arrives, and says nothing about the work.',
    name: 'Placeholder name one',
    company: 'Placeholder company one',
  },
  {
    id: 'two',
    placeholder: true,
    quote:
      'Placeholder quote two. It runs to about the length a real quote runs, so the slot is sized by something honest rather than by a short stand-in.',
    name: 'Placeholder name two',
    company: 'Placeholder company two',
  },
  {
    id: 'three',
    placeholder: true,
    quote:
      'Placeholder quote three. Nothing here is a claim, and nothing here should survive to a deploy.',
    name: 'Placeholder name three',
    company: 'Placeholder company three',
  },
  {
    id: 'four',
    placeholder: true,
    quote:
      'Placeholder quote four. The longest of the set, so the stage is tall enough to hold the worst case without the layout moving when the quote changes.',
    name: 'Placeholder name four',
    company: 'Placeholder company four',
  },
];

/* Only real quotes are shown, so a set with one real quote shows one. */
const QUOTES = ALL_QUOTES.filter((q) => !q.placeholder);

const pad = (n) => String(n).padStart(2, '0');

/* Hover only counts on a real pointer. Checked at event time rather than
   cached, so a hybrid device that gains or loses a mouse stays correct. */
const finePointer = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export default function Testimonials() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  /* Once the reader works a control, rotation is over for good. Moving the
     content under someone who has taken charge of it is the same discourtesy
     as hijacking their scroll. */
  const [manual, setManual] = useState(false);
  const sectionRef = useRef(null);

  /* One quote does not rotate, and none is not a section. */
  const rotating = QUOTES.length > 1 && !reduced && !manual && !paused;

  useEffect(() => {
    if (!rotating) return undefined;
    const dwell = cssMs('--d-rotate-quote', 7000);
    const t = setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), dwell);
    return () => clearInterval(t);
  }, [rotating]);

  /* After every hook, so the hook order never changes between renders. */
  if (!QUOTES.length) return null;

  const go = (delta) => {
    setManual(true);
    setIndex((i) => (i + delta + QUOTES.length) % QUOTES.length);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    }
  };

  return (
    <section
      className="vt quotes"
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onKeyDown={onKeyDown}
      onMouseEnter={() => finePointer() && setPaused(true)}
      onMouseLeave={() => finePointer() && setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div className="quotes__inner">
        {/* aria-live is off while the carousel moves on its own, and polite
            once it is under the reader's control. An auto-rotating region that
            announces every change talks over whatever the reader is doing. */}
        <div className="quotes__stage" aria-live={rotating ? 'off' : 'polite'}>
          {QUOTES.map(({ id, quote, name, company }, i) => (
            <figure
              className="quotes__slide"
              key={id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${QUOTES.length}`}
              aria-hidden={i === index ? undefined : 'true'}
              data-active={i === index ? 'true' : 'false'}
            >
              {/* Behind the quote, one per slide. Decorative twice over: the
                  element is already a blockquote, and a quotation mark that
                  announced itself would say "quote" before every quote. */}
              <Quotes className="i i--lg quotes__mark" aria-hidden="true" />

              <blockquote className="quotes__q">
                <p>{quote}</p>
              </blockquote>
              <figcaption className="quotes__src">
                <span className="quotes__name">{name}</span>
                <span className="quotes__co">{company}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* The controls exist only when there is somewhere to go. */}
        {QUOTES.length > 1 ? (
          <div className="quotes__controls">
            <button
              className="quotes__btn"
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
            >
              Prev
            </button>

            {/* Metadata, not the carrier: which of the set the reader is on. */}
            <span className="quotes__count">
              <span className="quotes__count-n">{pad(index + 1)}</span>
              <span aria-hidden="true"> / </span>
              <span className="quotes__count-t">{pad(QUOTES.length)}</span>
            </span>

            <button
              className="quotes__btn"
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
