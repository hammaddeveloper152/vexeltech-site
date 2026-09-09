import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Browser, Lightning, Megaphone, PenNib } from '@phosphor-icons/react';
import { getLenis, useSmoothScroll } from './smoothScroll.js';
import './Services.css';

/* Section 5. The four disciplines, pinned.

   Replaces the flat four-across Pillars row.

   The failure lines are no longer here. They came over from Pillars as small
   labels on these cards and they are now the section above this one, at
   heading scale, where they name what is broken before the page mentions a
   service at all. See Failures.jsx. The cards keep their discipline names,
   which is the half of the pair this section is for.

   The 01 to 04 numerals are gone too, and nothing replaced them. They were
   the section's one accent, and this frame now carries none. Both calls are
   argued in full at the top of Services.css; the short version is that four
   disciplines are not a sequence, so the numbering encoded nothing, and the
   accent was better left unspent than moved onto something that would break
   a different rule to hold it.

   ---- Sub-services, written 2026-09-08 ----------------------------------

   All twelve are the user's, from the content answers and the pricing sheet.
   Nothing here is a capability this agency has not stated.

   Each is a short noun phrase, which is the slot: three lines under a
   discipline name at the statement size, in a card whose width the pinned
   track fixes. Longest is 25 characters.

   | Discipline | Source |
   |---|---|
   | Branding   | 2.1 and 1.1, plus the pricing sheet's branding tiers |
   | Websites   | 1.1 development services, 2.2, the website tiers |
   | Marketing  | 1.1 marketing services, and the sheet's own three headings: SEO, Meta Ads, Google PPC |
   | Automation | 1.1 automations, verbatim: workflow automations, AI agents, chat bots |

   Two lines compress two sourced items into one phrase because the slot
   holds three and the source lists more: "Stationery and social kit" is
   2.1's stationery plus its social media kit, and "Web apps and ecommerce"
   is two entries from 1.1's development list. Both halves of each are the
   user's; neither adds anything.

   The artwork slot now holds an icon at the large station rather than an
   empty box. It is not the pillar artifact and does not pretend to be: there
   is still no SVG file anywhere in either repo, the legacy .art rules are dead
   CSS with no markup on the old palette, and the artifact slot is still open
   in CLAUDE.md. The slot keeps its fixed ratio, so the real artwork drops in
   later at artwork scale with no layout change and the icon comes out.

   The icons are safe to name here because the four disciplines came from the
   user directly.

   The sub-services still take no icon, and the reason has changed rather
   than gone away. It used to be Truth: an icon beside a placeholder invents
   what the placeholder will say. They are real copy now, so the test is
   DESIGN.md Iconography instead: an icon must add meaning the element does
   not already carry, and "Chatbots" beside a chat bubble carries nothing
   twice. Twelve marks on four cards would also put twelve objects against
   the one artwork slot each card is built around. */
const CARDS = [
  {
    id: 'branding',
    Icon: PenNib,
    discipline: 'Branding',
    subs: ['Custom logo design', 'Brand guidelines', 'Stationery and social kit'],
  },
  {
    id: 'websites',
    Icon: Browser,
    discipline: 'Websites',
    subs: ['Custom websites', 'Web apps and ecommerce', 'UI and UX design'],
  },
  {
    id: 'marketing',
    Icon: Megaphone,
    discipline: 'Marketing',
    subs: ['SEO and search ranking', 'Google and Meta ads', 'Lead generation and CRO'],
  },
  {
    id: 'automation',
    Icon: Lightning,
    discipline: 'Automation',
    subs: ['Workflow automation', 'AI agents', 'Chatbots'],
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
          {CARDS.map(({ id, Icon, discipline, subs }, i) => (
            <li className="services__card" key={id}>
              <Link
                className="services__link"
                /* The canonical anchor, not `/services/<id>`. That path is a
                   REDIRECT since the sub-service pages came off the router,
                   and a card should point at the page rather than at a hop
                   through one. */
                to={`/services#${id}`}
                onFocus={() => bringIntoView(i)}
              >
                <span className="services__discipline">{discipline}</span>

                {/* Artwork slot, 3:2, holding the pillar artefact when it
                    arrives. Until then it shows its hairline and the
                    discipline's numeral and nothing else — DESIGN.md, a
                    reserved slot is never decoration. Decorative in the
                    accessibility sense too: the discipline is written directly
                    above it. */}
                <span
                  className="services__art"
                  data-n={String(i + 1).padStart(2, '0')}
                  aria-hidden="true"
                >
                  <Icon className="i i--lg services__art-i" />
                </span>

                <ul className="services__subs">
                  {subs.map((s, j) => (
                    <li className="services__sub" key={s} style={{ '--i': j }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
