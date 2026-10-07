import React, { useLayoutEffect, useRef, useState } from 'react';
import { IconPlus } from '../site/Icons.jsx';
import './Faq.css';

/* Section 8. The quiet one.

   ---- All four written, and two of them carry arguments -----------------

   The four answers come from content answers 7.2, 7.3 and 7.4 plus the
   founder's own words, rewritten in the voice on 2026-09-09.

   | Item | From |
   |---|---|
   | Timeline  | 7.2, four business days, then the revision rounds |
   | Ownership | 7.3 and the founder: their hosting, their credentials |
   | Changes   | the founder: revisions are a conversation, not a negotiation |
   | Support   | 7.4, 30 days at no cost |

   TWO OF THESE WERE NOT ON THE SITE AT ALL and both are stronger than what
   they replaced. Ownership said "100% ownership", which is abstract and
   which every agency claims; it now says whose hosting and whose
   credentials, which a reader can picture. Changes had no home anywhere
   except a pricing bullet reading "Unlimited revisions": a deliverable
   where an argument should have been.

   The fourth slot held the price question and a placeholder while the price
   was in conflict. That conflict is settled and the price lives on
   /pricing, so the slot was free for the changes question.

   Budget: 150 to 250 characters an answer. Measured after the rewrite.
*/
/* HOME'S FOUR QUESTIONS ARE GONE, 2026-10-01 (COPY V3 gives home none):
   the accordion now renders only the questions its route passes. */
/* `items` and `id` let a second route mount the same accordion with its own
   questions (About, 2026-09-23). `id` prefixes every DOM id, so two instances
   never collide. */
/* THE ROWS ALONE, 2026-10-05 (the founder's services substance pass): the
   same rows, state and line stagger, without the section and its "Questions"
   heading, so a /services band can carry two questions under its own h2.
   `Faq` below is this list inside its section. */
export function FaqList({ items, id: base = 'faq' }) {
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
    const panel = list.querySelector(`#${base}-panel-${openId}`);
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
  }, [openId, base]);

  return (
    <div className="faq__list" ref={listRef}>
      {items.map(({ id, q, a }) => {
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
                id={`${base}-btn-${id}`}
                aria-expanded={open}
                aria-controls={`${base}-panel-${id}`}
                onClick={() => toggle(id)}
              >
                <span className="faq__q-t">{q}</span>
                {/* Now a real icon. Iconography was unassigned when this
                    was a typed glyph; it is assigned to DESIGN.md and the
                    plus is Phosphor at the small station. The rotation is
                    unchanged: transform, on the panel's own duration and
                    curve. Decorative, because the question beside it and
                    aria-expanded on the button already say the whole
                    thing. */}
                <span className="faq__mark" data-open={open}>
                  <IconPlus className="i" />
                </span>
              </button>
            </h3>

            <div
              className="faq__panel"
              id={`${base}-panel-${id}`}
              role="region"
              aria-labelledby={`${base}-btn-${id}`}
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
  );
}

/* `heading` (final22, 2026-10-06): the h2 names what the questions are
   about, so a search engine can quote it; "Questions" by default. */
export default function Faq({ items, id: base = 'faq', heading = 'Questions' }) {
  return (
    <section className="vt faq" aria-labelledby={`${base}-h`}>
      <div className="faq__inner">
        <h2 className="faq__h hl" id={`${base}-h`}>
          {heading}
        </h2>
        <FaqList items={items} id={base} />
      </div>
    </section>
  );
}
