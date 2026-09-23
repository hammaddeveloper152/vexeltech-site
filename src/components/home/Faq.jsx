import React, { useLayoutEffect, useRef, useState } from 'react';
import { Plus } from '@phosphor-icons/react';
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
const ITEMS = [
  {
    id: 'one',
    q: 'How long does it take?',
    a: "Four business days to build your site. Then the revision rounds start, and it changes with each one until it's the site you actually wanted. We don't put a cap on how many.",
  },
  {
    /* ARGUMENT TWO, and the reason this answer was rewritten. It used to say
       "Yes, 100% ownership", which is abstract: a reader cannot picture it
       and every agency claims it. What they are afraid of is being locked
       in, and the concrete version of not being locked in is whose hosting
       it sits on and whose name is on the credentials. The founder's own
       words. */
    id: 'two',
    q: 'Do I actually own it?',
    a: "Yes, and it isn't just a word. When it's live and approved it transfers to your hosting, with all the credentials and the ownership under your name. You own everything you paid for.",
  },
  {
    /* ARGUMENT ONE, and this slot was the price placeholder until the price
       moved to /pricing. It is the strongest thing the founder says and it
       was buried in a pricing bullet reading "Unlimited revisions". A bullet
       states a deliverable; this states what the deliverable is FOR. */
    id: 'three',
    q: 'What if I want changes?',
    a: "Then you ask, and we change it. Revisions here are a conversation, not a negotiation. A dedicated team stays on your project, so there's none of the nuisance other agencies make of it.",
  },
  {
    id: 'four',
    q: 'What happens after launch?',
    a: "Thirty days of support and maintenance, at no cost. It's part of the work rather than a retainer, so there's nothing extra to pay in the month after you go live.",
  },
];

/* `items` and `id` let a second route mount the same accordion with its own
   questions (About, 2026-09-23). `id` prefixes every DOM id, so two instances
   never collide; home passes neither and its ids are unchanged. */
export default function Faq({ items = ITEMS, id: base = 'faq' }) {
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
    <section className="vt faq" aria-labelledby={`${base}-h`}>
      <div className="faq__inner">
        <h2 className="faq__h" id={`${base}-h`}>
          Questions
        </h2>

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
                      <Plus className="i i--sm" aria-hidden="true" />
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
      </div>
    </section>
  );
}
