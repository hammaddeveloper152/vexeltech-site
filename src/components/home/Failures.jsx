import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReveal } from './hooks.js';
import { useSmoothScroll } from './smoothScroll.js';
import './Failures.css';

/* The four failures. Sits between the hero and Services, and names what is
   broken before anything on the page mentions a service.

   The four statements are the user's copy, verbatim and in the user's order.
   They were small labels inside the service cards and they are the section
   now; the cards keep their discipline names and no longer carry them. There
   is no fifth and none of the four is rewritten.

   The order is the order a customer is lost in: found, called, answered,
   remembered. That is why the first one leads on size below. Nothing in the
   four statements is a claim about VexelTech, so BUILD-LAW.md Truth is not in
   play for them.

   ---- The consequences, 2026-09-08 --------------------------------------

   ALL FOUR ARE NOW THE USER'S COPY. They arrived in two passes and the
   sources are different, which is worth keeping straight.

   Lines one and two come from content answer 1.2, which names exactly two
   conditions a customer arrives in: a business "not getting enough leads by
   spending alot on their marketing budget", and one that does "not have any
   online presence". Those are the consequences of not being found and of
   nobody calling.

   Lines three and four were given directly on 2026-09-08. Nothing in either
   document said what it costs to miss the calls you do get or to be
   forgotten after the job — 2.4 lists what automation does for a workflow
   and 2.1 lists branding deliverables, and neither states a consequence for
   the reader — so both slots held a placeholder until the user wrote them.

   Budget: 60 to 80 characters, the measured slot. All four are inside it:
   74, 73, 62, 68. */
const FAILURES = [
  {
    id: 'find',
    statement: 'They cannot find you',
    /* Leads on size, per the density law. Not a ranking of severity, which
       would be a claim nobody made: it is the failure that gates the other
       three, because nobody calls, gets missed, or remembers a business they
       never found. Four statements at one size is a composition that has not
       decided, and the section heading cannot be the leader here because the
       statements are the section. */
    lead: true,
    /* Source 1.2: businesses "who do not have any online presence". */
    consequence: 'No online presence, so the search that should have found you finds nobody.',
  },
  {
    id: 'call',
    statement: 'Not enough are calling',
    /* Source 1.2: "not getting enough leads by spending alot on their
       marketing budget". */
    consequence: 'The marketing budget goes out every month and the leads do not come back.',
  },
  {
    id: 'miss',
    statement: 'You miss the ones who do',
    /* The user, directly, 2026-09-08. 62 characters. */
    consequence: 'A missed call is a job that goes to whoever picked up instead.',
  },
  {
    id: 'remember',
    statement: 'They do not remember you',
    /* The user, directly, 2026-09-08. 68 characters. */
    consequence: 'Work with no name on it is work the next customer never hears about.',
  },
];

export default function Failures() {
  const listRef = useRef(null);
  const railRef = useRef(null);
  const aheadRef = useRef(null);
  const passedRef = useRef(null);
  /* Where along the rail each statement is reached, as a fraction of the
     rail's height. Written by measure(), read by draw(). */
  const marks = useRef([]);

  /* Two different jobs, two different mechanisms, and they are not
     interchangeable.

     The statements reveal once on the 70ms stagger as the section arrives:
     four separate things to read, so they arrive one after another rather
     than as a block. That is useReveal, an IntersectionObserver.

     The consequences are gated on the rail instead, so each one appears as
     the rail passes its statement. That is a scrubbed ScrollTrigger, because
     it has to track the reader in both directions rather than fire once.

     Arrival is a reveal. Travel is a scrub. */
  const [revealRef, revealed] = useReveal();

  /* ScrollTrigger is registered in smoothScroll.js and nowhere else, so a
     section that scrubs depends on that module having loaded. Calling the
     hook is how this section says so, rather than relying on another section
     to have imported it first. Ref counted by design. */
  useSmoothScroll();

  useEffect(() => {
    const list = listRef.current;
    const rail = railRef.current;
    const ahead = aheadRef.current;
    const passed = passedRef.current;
    if (!list || !rail || !ahead || !passed) return undefined;

    const items = () => Array.from(list.querySelectorAll('.fail__item'));

    /* Every mark comes off a live getBoundingClientRect and is remeasured on
       every refresh. A statement that wraps one line further at a narrower
       width moves every mark below it, so none of this can be a constant. */
    const measure = () => {
      const lb = list.getBoundingClientRect();
      const H = lb.height;
      if (!H) return;

      marks.current = items().map((item) => {
        const s = item.querySelector('.fail__s');
        const sb = s.getBoundingClientRect();
        /* The centre of the statement's FIRST line, not the centre of its
           box. A statement that wraps to two lines has been reached when the
           rail is level with the words, not when it clears the paragraph. */
        const lh = parseFloat(getComputedStyle(s).lineHeight) || sb.height;
        return (sb.top - lb.top + Math.min(lh, sb.height) / 2) / H;
      });
    };

    const draw = (p) => {
      /* scaleY from a top origin, not stroke-dashoffset. The rail is a
         straight rule, and DESIGN.md is explicit that a progress line scrubs
         with scaleY() from a set transform-origin. stroke-dashoffset is the
         named exception for drawing a path that TURNS, which is why the
         process route needs it and this does not. Same technique, in the
         version of it a straight line takes. */
      ahead.style.transform = 'scaleY(' + p + ')';

      /* The drawn stretch behind the reader holds at the last statement
         actually reached rather than tracking the scroll continuously, so it
         reads as ground covered instead of a cursor that happens to be
         further down. Taken from the process route deliberately: it is the
         same line treatment, so it behaves the same way. */
      const reached = marks.current.filter((m) => p >= m);
      const held = reached.length ? Math.max(...reached) : 0;
      passed.style.transform = 'scaleY(' + held + ')';

      items().forEach((item, i) => {
        const m = marks.current[i];
        item.dataset.lit = m !== undefined && p >= m ? 'true' : 'false';
      });
    };

    /* Content is visible by default and only hides once this effect is
       actually running. If gsap never loads or the effect never runs, the
       consequences read as plain text under their statements rather than
       sitting at zero opacity forever. The rail is decoration and fails the
       other way: undrawn, with nothing lost. */
    list.dataset.drawn = 'true';

    measure();

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const st = ScrollTrigger.create({
        trigger: list,
        /* The same window the process route uses, so the two line treatments
           draw at the same rate relative to the reader. */
        start: 'top 70%',
        end: 'bottom 80%',
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          measure();
          draw(self.progress);
        },
        onUpdate: (self) => draw(self.progress),
      });

      draw(0);

      return () => {
        st.kill();
        draw(1);
      };
    });

    /* Reduced motion: the rail is simply drawn and every consequence is
       present from the first paint. There is no gentler version of a line
       drawing itself, so it is switched off rather than slowed, exactly as
       the process route is. */
    mm.add('(prefers-reduced-motion: reduce)', () => {
      draw(1);
      return undefined;
    });

    const onResize = () => {
      measure();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      mm.revert();
      delete list.dataset.drawn;
    };
  }, []);

  return (
    <section className="vt fail band band-glass" aria-labelledby="fail-h" ref={revealRef}>
      <div className="fail__inner">
        {/* Deliberately not the loudest thing in the section. It is set in
            steel-dark rather than white so it separates from the statements
            on ground instead of on size, which is the separation available:
            the statements already occupy two heading steps and the heading
            cannot take a third without either tying one of them or dropping
            out of heading scale. The statements are the section; this only
            labels them. */}
        <h2 className="fail__h" id="fail-h">
          What it costs you
        </h2>

        <div
          className="fail__list"
          ref={listRef}
          data-revealed={revealed ? 'true' : 'false'}
        >
          {/* The rail, stroked three times, the way the process route is: a
              static hairline that gives the rail its full length before
              anything is drawn, the accent ahead of the reader at the
              system's ahead opacity, and the stretch behind them at full
              strength. No marker per statement. The rail arriving is the
              marker. */}
          <div className="fail__rail" ref={railRef} aria-hidden="true">
            <span className="fail__rail-track" />
            <span className="fail__rail-ahead" ref={aheadRef} />
            <span className="fail__rail-passed" ref={passedRef} />
          </div>

          <ul className="fail__items">
            {FAILURES.map(({ id, statement, lead, consequence }, i) => (
              <li
                className={'fail__item' + (lead ? ' fail__item--lead' : '')}
                key={id}
                data-lit="false"
                style={{ '--i': i }}
              >
                <h3 className="fail__s">{statement}</h3>
                <p className="fail__c">{consequence}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
