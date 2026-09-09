import React, { useEffect, useRef, useState } from 'react';
import { cssMs, useReducedMotion } from './hooks.js';
import { Quotes } from '@phosphor-icons/react';
import './Testimonials.css';

/* Section 6. One quote at a time.

   Obviously synthetic. BUILD-LAW.md Truth: a testimonial is a claim about the
   work made in someone else's voice, which is the last thing that may be
   invented here. Names and companies are placeholders for the same reason.

   The quotes are written at roughly the length a real one runs, so the slot is
   sized by something honest rather than by a short stand-in that collapses
   when the real copy lands. */
const QUOTES = [
  {
    id: 'one',
    quote:
      'Placeholder quote one. This sentence holds the shape of a real testimonial until one arrives, and says nothing about the work.',
    name: 'Placeholder name one',
    company: 'Placeholder company one',
  },
  {
    id: 'two',
    quote:
      'Placeholder quote two. It runs to about the length a real quote runs, so the slot is sized by something honest rather than by a short stand-in.',
    name: 'Placeholder name two',
    company: 'Placeholder company two',
  },
  {
    id: 'three',
    quote:
      'Placeholder quote three. Nothing here is a claim, and nothing here should survive to a deploy.',
    name: 'Placeholder name three',
    company: 'Placeholder company three',
  },
  {
    id: 'four',
    quote:
      'Placeholder quote four. The longest of the set, so the stage is tall enough to hold the worst case without the layout moving when the quote changes.',
    name: 'Placeholder name four',
    company: 'Placeholder company four',
  },
];

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

  const rotating = !reduced && !manual && !paused;

  useEffect(() => {
    if (!rotating) return undefined;
    const dwell = cssMs('--d-rotate-quote', 7000);
    const t = setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), dwell);
    return () => clearInterval(t);
  }, [rotating]);

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
                  announced itself would say "quote" before every quote.

                  It was tried as this frame's carrier — the mark as type, in
                  Monigue at the figure size, in machine yellow — and measured
                  out. See Testimonials.css. It is back to what it was: a
                  texture at the strength this system uses for something
                  present and not to be looked at. */}
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

        <div className="quotes__controls">
          {/* Still text, now by choice rather than because iconography was
              unassigned. These two are the only content of their controls, and
              a word says which direction it goes without the reader having to
              resolve a glyph first. */}
          <button
            className="quotes__btn"
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
          >
            Prev
          </button>

          {/* Metadata, not the carrier. It says which of four the reader is
              on, which is a thing a control row says quietly, and it sits at
              the small loud size in white beside the two words it belongs
              with. It used to be this frame's accent at the figure size, and
              a count is the wrong thing for a section to shout: it is the one
              element in the frame that carries no meaning about the work. */}
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
      </div>
    </section>
  );
}
