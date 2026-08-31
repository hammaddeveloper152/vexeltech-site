import React, { useLayoutEffect, useRef, useState } from 'react';
import './Faq.css';

/* Section 8. The quiet one.

   Placeholder questions. BUILD-LAW.md Truth: an answer here is a statement
   about price, timeline, ownership or process, and none of those may be
   written until they are given. */
const ITEMS = [
  {
    id: 'one',
    q: 'Placeholder question one',
    a: 'Placeholder answer one. This paragraph stands in for a real answer and commits to nothing about price, timeline, or how the work is run.',
  },
  {
    id: 'two',
    q: 'Placeholder question two',
    a: 'Placeholder answer two, written to roughly the length a real answer runs so the panel is sized by something honest.',
  },
  {
    id: 'three',
    q: 'Placeholder question three',
    a: 'Placeholder answer three. Nothing here is a claim and nothing here should survive to a deploy.',
  },
  {
    id: 'four',
    q: 'Placeholder question four',
    a: 'Placeholder answer four, closing the set.',
  },
];

export default function Faq() {
  const [openId, setOpenId] = useState(null);

  /* One piece of state, set synchronously. The entrance is a keyframe
     animation rather than a transition, so it does not need the panel to have
     existed in a closed state first, and there is no frame-timing dance to get
     wrong. An earlier version paired the panel out of `hidden` with a
     double requestAnimationFrame to set the open flag; in a backgrounded tab
     rAF is throttled, the callback never ran, and the panel laid out at zero
     opacity with aria-expanded still false. Correctness must not depend on a
     frame arriving.

     Closing is instant. An exit animation would overlap the next panel's
     entrance, and two things moving at once is the opposite of what this
     section is for. */
  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  const listRef = useRef(null);

  /* Group the answer's words into the visual lines they actually fell on, so
     the stagger runs line by line rather than word by word.

     A layout effect, not an effect: the words are measured and their line
     index written before the browser paints. Run after paint and every word
     would start its animation on line zero and only learn its real delay
     once it was already moving. */
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || !openId) return;
    const panel = list.querySelector(`#faq-panel-${openId}`);
    if (!panel) return;

    let line = -1;
    let lastTop = null;
    panel.querySelectorAll('.faq__w').forEach((w) => {
      const top = Math.round(w.offsetTop);
      if (lastTop === null || top !== lastTop) {
        line += 1;
        lastTop = top;
      }
      w.style.setProperty('--line', line);
    });
  }, [openId]);

  return (
    <section className="vt vt--light faq" aria-labelledby="faq-h">
      <div className="faq__inner">
        <h2 className="faq__h" id="faq-h">
          Questions
        </h2>

        <div className="faq__list" ref={listRef}>
          {ITEMS.map(({ id, q, a }) => {
            const open = openId === id;
            return (
              <div className="faq__item" key={id} data-open={open ? 'true' : 'false'}>
                {/* The row's own hairline, drawn over the static one on
                    hover. Separate element because it scales from the left,
                    and a border cannot be transformed. */}
                <span className="faq__rule" aria-hidden="true" />

                <h3 className="faq__q">
                  <button
                    className="faq__btn"
                    type="button"
                    id={`faq-btn-${id}`}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${id}`}
                    onClick={() => toggle(id)}
                  >
                    <span className="faq__q-t">{q}</span>
                    {/* A rotated glyph, not an icon. Iconography is unassigned
                        in the ownership map, and the rotation is transform. */}
                    <span className="faq__mark" aria-hidden="true" data-open={open}>
                      +
                    </span>
                  </button>
                </h3>

                <div
                  className="faq__panel"
                  id={`faq-panel-${id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${id}`}
                  hidden={!open}
                  data-open={open}
                >
                  <div className="faq__panel-in">
                    {/* Split into words so they can be grouped into their
                        rendered lines. Inline spans inside a paragraph, so
                        the text an assistive technology reads is unchanged. */}
                    <p className="faq__a">
                      {a.split(' ').map((word, w) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <span className="faq__w" key={`${word}-${w}`}>
                          {word}{' '}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
