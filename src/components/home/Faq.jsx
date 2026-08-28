import React, { useState } from 'react';
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

  return (
    <section className="vt vt--light faq" aria-labelledby="faq-h">
      <div className="faq__inner">
        <h2 className="faq__h" id="faq-h">
          Questions
        </h2>

        <div className="faq__list">
          {ITEMS.map(({ id, q, a }) => {
            const open = openId === id;
            return (
              <div className="faq__item" key={id}>
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
                    <p className="faq__a">{a}</p>
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
