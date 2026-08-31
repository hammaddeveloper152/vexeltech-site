import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Browser, Lightning, Megaphone, PenNib } from '@phosphor-icons/react';
import { getLenis, useSmoothScroll } from './smoothScroll.js';
import './Services.css';

/* Section 5. The four disciplines, pinned.

   Replaces the flat four-across Pillars row. The failure lines carry over
   from it verbatim: they are the user's copy, not new writing.

   Sub-services are obviously synthetic. BUILD-LAW.md Truth: no invented
   capabilities, and a list of services this agency has not said it offers is
   exactly that.

   The artwork slot now holds an icon at the large station rather than an
   empty box. It is not the pillar artifact and does not pretend to be: there
   is still no SVG file anywhere in either repo, the legacy .art rules are dead
   CSS with no markup on the old palette, and the artifact slot is still open
   in CLAUDE.md. The slot keeps its fixed ratio, so the real artwork drops in
   later at artwork scale with no layout change and the icon comes out.

   The icons are safe to name here because the four disciplines came from the
   user directly. Everything else on this card is a placeholder and its icon
   would be inventing what the placeholder will say, which is why the
   sub-services have none. */
const CARDS = [
  {
    id: 'branding',
    n: '01',
    Icon: PenNib,
    discipline: 'Branding',
    failure: 'They do not remember you',
    subs: [
      'Placeholder sub-service one',
      'Placeholder sub-service two',
      'Placeholder sub-service three',
    ],
  },
  {
    id: 'websites',
    n: '02',
    Icon: Browser,
    discipline: 'Websites',
    failure: 'They cannot find you',
    subs: [
      'Placeholder sub-service one',
      'Placeholder sub-service two',
      'Placeholder sub-service three',
    ],
  },
  {
    id: 'marketing',
    n: '03',
    Icon: Megaphone,
    discipline: 'Marketing',
    failure: 'Not enough are calling',
    subs: [
      'Placeholder sub-service one',
      'Placeholder sub-service two',
      'Placeholder sub-service three',
    ],
  },
  {
    id: 'automation',
    n: '04',
    Icon: Lightning,
    discipline: 'Automation',
    failure: 'You miss the ones who do',
    subs: [
      'Placeholder sub-service one',
      'Placeholder sub-service two',
      'Placeholder sub-service three',
    ],
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const stRef = useRef(null);

  useSmoothScroll();

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return undefined;

    const mm = gsap.matchMedia();

    /* The pin exists only where it is honest. Below 768 a horizontal scroller
       on a phone is a trap, and under reduced motion a pin is movement the
       reader asked not to have. In both cases the cards are a plain vertical
       stack and nothing here runs. */
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray('.services__card', track);
      const distance = () => track.scrollWidth - viewport.clientWidth;

      const tween = gsap.to(track, {
        /* Transform only. Never left, never margin. */
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          /* Vertical distance equals horizontal distance, so the mapping is
             one to one and each card takes an equal slice of the scroll. That
             is what advances the track a card at a time.

             Deliberately NOT ScrollTrigger's snap. Snapping picks the
             destination and overrides where a flick would have landed, which
             DESIGN.md names as hijacking and forbids outright. */
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
        },
      });

      stRef.current = tween.scrollTrigger;

      /* Sub-services stagger as their own card arrives, driven by the
         horizontal tween rather than by page scroll. */
      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: tween,
          start: 'left 75%',
          once: true,
          onEnter: () => card.setAttribute('data-arrived', 'true'),
        });
      });

      return () => {
        stRef.current = null;
        cards.forEach((card) => card.removeAttribute('data-arrived'));
      };
    });

    return () => mm.revert();
  }, []);

  /* Focusing an off-screen card must bring it into view. This is the thing
     pinned scrollers usually get wrong: the track is moved by scroll position,
     not by a scrollable box, so the browser has nothing to scroll and the
     focus ring lands somewhere the reader cannot see.

     Not hijacking. The reader chose this destination by pressing Tab; the
     page is following, not deciding. */
  const bringIntoView = (index) => {
    const st = stRef.current;
    if (!st) return; // stacked mode: the browser handles it natively
    const p = CARDS.length > 1 ? index / (CARDS.length - 1) : 0;
    const target = st.start + (st.end - st.start) * p;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target);
    else window.scrollTo({ top: target });
  };

  return (
    <section className="vt services" aria-labelledby="services-h" ref={sectionRef}>
      <div className="services__head">
        <h2 className="services__h" id="services-h">
          What we do
        </h2>
      </div>

      <div className="services__viewport" ref={viewportRef}>
        <ul className="services__track" ref={trackRef}>
          {CARDS.map(({ id, n, Icon, discipline, failure, subs }, i) => (
            <li className="services__card" key={id}>
              <a
                className="services__link"
                href={`/services/${id}`}
                onFocus={() => bringIntoView(i)}
              >
                <span className="services__n" aria-hidden="true">
                  {n}
                </span>

                <span className="services__failure">{failure}</span>

                <span className="services__discipline">{discipline}</span>

                {/* Artwork slot. Fixed ratio, holds the pillar artifact at
                    artwork scale when it arrives. Decorative: the discipline
                    is already written directly above it. */}
                <span className="services__art" aria-hidden="true">
                  <Icon className="i i--lg services__art-i" />
                </span>

                <ul className="services__subs">
                  {subs.map((s, j) => (
                    <li className="services__sub" key={s} style={{ '--i': j }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
