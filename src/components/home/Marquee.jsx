import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { useReducedMotion } from './hooks.js';
import { useSmoothScroll } from './smoothScroll.js';
import './Marquee.css';

gsap.registerPlugin(Draggable, InertiaPlugin);

/* Section 2. THE STRIKE TICKER, 2026-09-15. It replaced the client strip, and
   the eight client slots are deleted with it.

   One row of problems in outlined Monigue travelling left. As a phrase's
   centre crosses the viewport's centre, a 3px machine yellow line draws
   through it left to right, its two ends cut at 51.93 degrees (the short
   arm's outer edge of the mark), and the phrase's fix drops in 8px above it in
   solid white. The struck phrase carries on out still crossed and its fix
   travels with it.

   ---- The conveyor, and why it is not a doubled track ----------------------

   The old strip translated a doubled track by one set length and jumped back.
   That is invisible for text that never changes, and wrong for text that does:
   at the jump, the DOM node on screen swaps from copy B to copy A, and copy A
   carries its own struck state. So every phrase is its own item with its own
   x. An item that leaves one edge is moved to the far end of the row at the
   other, and its state is set for the side it re-enters on: leaving left it
   re-enters right unstruck; leaving right it re-enters left already struck,
   because everything left of centre has crossed.

   A phrase is struck when its centre is left of the viewport's centre and it
   is not already. Nothing un-strikes a phrase except leaving the row, so a
   throw to the right carries struck phrases back across the centre still
   crossed.

   ---- Speed -----------------------------------------------------------------

   Base 60px/s. Scroll velocity from ScrollTrigger sets a multiplier,
   |velocity| / 60 clamped to 6, signed by the scroll's direction, and it
   decays back to 1 over 1.2s. A drag throws the row with Draggable and
   InertiaPlugin (both part of the free GSAP package since 3.13); while a
   pointer holds or throws it, the base motion stops.

   ---- The pause control stays ----------------------------------------------

   WCAG 2.2.2: content that moves on its own for more than five seconds beside
   other content needs a control that stops it. The brief does not mention
   the control, and it does not remove it. Paused, the row does not advance or
   answer the scroll; a drag still moves it, because a drag is the reader's own
   hand. */

export const PAIRS = [
  ["Nobody's calling.", 'Phone rings.'],
  ['No website.', 'Live in four days.'],
  ['Same as everyone else.', 'Nobody like you.'],
  ['Paying for clicks.', 'Paying for customers.'],
  ['Answering the phone yourself.', 'Answered for you.'],
];

const BASE = 60; // px/s
const MAX = 6; // x base
const DECAY = 1.2; // s
const COPIES = 2; // enough to overfill the widest frame: measured in ticker.mjs

function Pair({ problem, fix, struck }) {
  return (
    <li className="tick" data-struck={struck ? 'true' : 'false'}>
      <span className="tick__fix">{fix}</span>
      <span className="tick__problem">
        {problem}
        <span className="tick__strike" />
      </span>
    </li>
  );
}

export default function Marquee() {
  const reduced = useReducedMotion();
  const [running, setRunning] = useState(true);
  const runningRef = useRef(true);
  const sectionRef = useRef(null);
  const viewRef = useRef(null);
  const proxyRef = useRef(null);

  useSmoothScroll();

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    /* The media query as well as the hook: the hook starts false and reads the
       preference in its own effect, so on the first commit a reduced-motion
       reader would otherwise get one pass of the moving row, with inline
       transforms left on the items the static row then reuses. */
    if (reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const section = sectionRef.current;
    const view = viewRef.current;
    const proxy = proxyRef.current;
    if (!section || !view || !proxy) return undefined;

    const els = [...view.querySelectorAll('.tick')];
    const state = { boost: 1, dir: 1, held: false };
    let items = [];
    let gap = 0;
    let vw = 0;
    let inView = false;

    const snap = (el) => {
      el.dataset.snap = 'true';
      requestAnimationFrame(() => requestAnimationFrame(() => delete el.dataset.snap));
    };
    const place = (it) => {
      it.el.style.transform = `translate3d(${it.x}px,0,0)`;
    };

    /* Measure every phrase and lay the row out from the left edge of a set
       that starts one set-length left of centre, so the frame is full from the
       first paint and everything left of centre starts struck, without a
       draw. */
    const layout = () => {
      vw = view.clientWidth;
      gap = parseFloat(getComputedStyle(view).fontSize) || 64;
      const measured = els.map((el) => {
        const p = el.querySelector('.tick__problem');
        const f = el.querySelector('.tick__fix');
        return { el, pw: p.offsetWidth, w: Math.max(p.offsetWidth, f.offsetWidth) };
      });
      const setW = measured.slice(0, PAIRS.length).reduce((s, m) => s + m.w + gap, 0);
      let x = vw / 2 - setW;
      items = measured.map((m) => {
        const it = { ...m, x };
        x += m.w + gap;
        const struck = it.x + it.pw / 2 < vw / 2;
        it.el.dataset.struck = struck ? 'true' : 'false';
        snap(it.el);
        place(it);
        return it;
      });
    };

    const first = () => items.reduce((a, b) => (b.x < a.x ? b : a));
    const last = () => items.reduce((a, b) => (b.x > a.x ? b : a));

    const move = (dx) => {
      if (!items.length) return;
      for (const it of items) it.x += dx;
      /* Recycle: whatever has fully left one edge goes to the far end of the
         other. A loop, because a hard throw can clear more than one. */
      for (let guard = 0; guard < items.length; guard += 1) {
        const a = first();
        if (a.x + a.w >= 0) break;
        const z = last();
        a.x = z.x + z.w + gap;
        a.el.dataset.struck = 'false';
        snap(a.el);
      }
      for (let guard = 0; guard < items.length; guard += 1) {
        const z = last();
        if (z.x <= vw) break;
        const a = first();
        z.x = a.x - gap - z.w;
        z.el.dataset.struck = 'true';
        snap(z.el);
      }
      const vc = vw / 2;
      for (const it of items) {
        if (it.el.dataset.struck !== 'true' && it.x + it.pw / 2 < vc) it.el.dataset.struck = 'true';
        place(it);
      }
    };

    const tick = (time, deltaMs) => {
      if (!inView || state.held) return;
      const dt = Math.min(deltaMs, 100) / 1000;
      if (!runningRef.current) return;
      const v = BASE * (1 + (state.boost - 1) * state.dir);
      move(-v * dt);
    };

    /* The scroll. A new, larger multiplier restarts the decay from itself; a
       smaller one during a decay is ignored, so the row does not stutter as a
       fling slows. */
    let decay = null;
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        if (!runningRef.current) return;
        const target = gsap.utils.clamp(1, MAX, Math.abs(self.getVelocity()) / BASE);
        if (target <= state.boost) return;
        state.boost = target;
        state.dir = self.direction;
        if (decay) decay.kill();
        decay = gsap.to(state, { boost: 1, duration: DECAY, ease: 'power2.out' });
      },
    });

    /* The throw. Draggable moves an invisible proxy and the row follows the
       proxy's deltas, so the conveyor above stays the only thing that owns an
       item's x. */
    let lastX = 0;
    const [drag] = Draggable.create(proxy, {
      type: 'x',
      trigger: view,
      inertia: true,
      allowNativeTouchScrolling: true,
      onPress() {
        state.held = true;
        gsap.set(proxy, { x: 0 });
        this.update();
        lastX = this.x;
      },
      onDrag() {
        move(this.x - lastX);
        lastX = this.x;
      },
      onThrowUpdate() {
        move(this.x - lastX);
        lastX = this.x;
      },
      onRelease() {
        gsap.delayedCall(0, () => {
          if (!drag.isThrowing) state.held = false;
        });
      },
      onThrowComplete() {
        state.held = false;
      },
    });

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
    });
    io.observe(section);

    const ro = new ResizeObserver(() => layout());
    ro.observe(view);
    layout();
    if (document.fonts) document.fonts.ready.then(layout);

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      if (decay) decay.kill();
      st.kill();
      drag.kill();
      io.disconnect();
      ro.disconnect();
      /* Hand the items back clean, for the static row if the preference
         changed mid-session. */
      for (const el of els) {
        el.style.transform = '';
        delete el.dataset.snap;
      }
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="vt ticker band-rays"
      aria-label="Problems and fixes"
      data-running={running ? 'true' : 'false'}
      data-static={reduced ? 'true' : 'false'}
    >
      {/* What a screen reader gets: each problem and its fix, once, in order.
          The moving row is decoration of the same words. */}
      <ul className="skip-h">
        {PAIRS.map(([problem, fix]) => (
          <li key={problem}>
            {problem} {fix}
          </li>
        ))}
      </ul>

      <div className="ticker__view" ref={viewRef} aria-hidden="true">
        {/* REDUCED MOTION: one static set, every problem struck with its fix
            above, wrapping onto as many rows as the frame needs. */}
        <ul className="ticker__row">
          {(reduced ? [0] : Array.from({ length: COPIES }, (_, i) => i)).map((copy) =>
            PAIRS.map(([problem, fix]) => (
              <Pair key={`${copy}-${problem}`} problem={problem} fix={fix} struck={reduced} />
            ))
          )}
        </ul>
        <div className="ticker__proxy" ref={proxyRef} />
      </div>

      {reduced ? null : (
        <button
          className="ticker__toggle"
          type="button"
          onClick={() => setRunning((v) => !v)}
          aria-label={running ? 'Pause the ticker' : 'Play the ticker'}
        >
          {/* Two 2px bars or a triangle, 12px, steel-dark, drawn inline: the
              one recorded exception in DESIGN.md Iconography. */}
          <svg
            className="ticker__icon"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            aria-hidden="true"
            focusable="false"
          >
            {running ? (
              <>
                <rect x="3" y="0" width="2" height="12" />
                <rect x="7" y="0" width="2" height="12" />
              </>
            ) : (
              <path d="M3 0 L11 6 L3 12 Z" />
            )}
          </svg>
        </button>
      )}
    </section>
  );
}
