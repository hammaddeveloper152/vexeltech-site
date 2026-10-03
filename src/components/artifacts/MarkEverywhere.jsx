import React, { useEffect, useRef, useState } from 'react';
import { useLoop, step, mix } from './loop.js';
import './artifacts.css';

/* SERVICES, BRANDING: ONE MARK, EVERYWHERE (the final artifacts pass,
   2026-10-03, the founder). It replaced the identity sheet, its clear-space
   grid and its type row; the Great Vibes files are deleted.

   On the cream band: at the left (60% from 1024) a stage, at the right the
   signage photograph at the stage's full height, "And on the building."
   under it.

   THE STAGE opens on Christal Clear's main mark, centred at 160px. After 1s
   it shrinks onto the letterhead while the surfaces the client actually
   received land in their slots, 180ms apart, each with the mark already on
   it: the mark on each other surface is a copy that travels from the
   centre. THE SURFACES ARE
   THE DELIVERED ONES (the founder, 2026-10-03, rewriting BUILD-LAW's Real
   over drawn: a scene may show a mark being applied, never work as
   delivered that was not): the sign band, the business card, the
   letterhead and the envelope. The brief's app tile, browser tab and social
   avatar came out with that ruling. Then the five palette values draw as a
   4px strip on the bottom margin. Hold, rest, loop (loop.js).

   TWO COMPOSITIONS, NOT ONE SCALED (BUILD-LAW Type floor: text in a drawing
   stays at 11px or more at 390). A 640 x 480 stage scaled to a phone would
   set the card's 11px name at 6px. So the stage holds a fixed-size
   composition centred in it: 640 x 480 where the stage is at least 640
   wide, 358 x 268 below that, with every word at 11px or more in both.

   The words on the surfaces are the client's name and nothing else. Sora
   is the client's open-licence face, self-hosted (public/fonts/client, OFL,
   Latin subset), fetched only here. The stage is a picture, aria-hidden;
   the caption says what it shows. */
const RATIO = 504.38 / 408.54;
const PALETTE = ['#2E3242', '#232735', '#1BA1A8', '#9BF9FE', '#F0F0F0'];

/* THE SLOTS (the founder's correction, 2026-10-03, final6): the surfaces
   stand in fixed slots on a 24px inner margin, not scattered.

     letterhead   200 x 283 (A4), top-left
     sign band    368 x 64 to its right, top-aligned
     card         220 x 126 under the sign band, left-aligned with it
     envelope     132 x 66 (DL) to the card's right, bottom-aligned with it
     palette      a 4px strip margin to margin, on the bottom margin

   x, y, w, h of each surface; m: the mark's box inside the stage; e: where
   the surface enters from (an offset that puts it outside the stage). THE
   MAIN MARK SHRINKS INTO THE LETTERHEAD: it is the letterhead's mark, so
   the letterhead lands with it, and the copies travel to the other three
   in the founder's order (sign band, card, envelope).

   On a phone the stacked layout as built, in the same order, at 326 x 244. Its letterhead
   moved up to the top-left corner the main mark used to hold, since the
   main mark now lands on the letterhead. */
const WIDE = {
  w: 640,
  h: 480,
  big: 160,
  letter: { x: 24, y: 24, w: 200, h: 283, m: { x: 44, y: 44, s: 40 }, e: [-260, 0] },
  sign: { x: 248, y: 24, w: 368, h: 64, m: { x: 264, y: 32, s: 40 }, e: [0, -120] },
  card: { x: 248, y: 112, w: 220, h: 126, m: { x: 262, y: 126, s: 40 }, e: [420, 0] },
  env: { x: 484, y: 172, w: 132, h: 66, m: { x: 494, y: 196, s: 24 }, e: [180, 0] },
  strip: { x: 24, y: 452, w: 592 },
};
/* 326 x 244: the stage's own size at 390, inside the cream panel's 16px
   padding (it was drawn at 358 x 268, the content width, and clipped 32px
   at 390; found in final6's frames). */
const NARROW = {
  w: 326,
  h: 244,
  big: 104,
  letter: { x: 12, y: 12, w: 96, h: 136, m: { x: 19, y: 19, s: 20 }, e: [-150, 0] },
  sign: { x: 12, y: 196, w: 302, h: 32, m: { x: 20, y: 199, s: 21 }, e: [0, 80] },
  card: { x: 120, y: 12, w: 194, h: 104, m: { x: 129, y: 19, s: 26 }, e: [240, 0] },
  env: { x: 120, y: 124, w: 136, h: 64, m: { x: 128, y: 150, s: 24 }, e: [240, 0] },
  strip: { x: 12, y: 234, w: 302 },
};
const ORDER = ['letter', 'sign', 'card', 'env'];
const T_MOVE = 1000;
const GAP = 180;
const MOVE = 700;
const T_STRIP = 2800;
const TOTAL = 4600;

const box = (b) => ({ left: b.x, top: b.y, width: b.w, height: b.h });

/* A mark copy at its place on a surface, travelling from the centre. */
function markAt(L, m, p) {
  const sx = L.w / 2 - L.big / 2;
  const sy = L.h / 2 - (L.big * RATIO) / 2;
  const k = mix(L.big / m.s, 1, p);
  return {
    left: m.x,
    top: m.y,
    width: m.s,
    height: m.s * RATIO,
    transform: `translate(${(sx - m.x) * (1 - p)}px, ${(sy - m.y) * (1 - p)}px) scale(${k})`,
  };
}

export default function MarkEverywhere() {
  const ref = useRef(null);
  const stageRef = useRef(null);
  const [t] = useLoop(ref, TOTAL);
  const [wide, setWide] = useState(true);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setWide(el.clientWidth >= WIDE.w));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const L = wide ? WIDE : NARROW;
  const p = (name) => step(t, T_MOVE + ORDER.indexOf(name) * GAP, MOVE);
  const enter = (name) => {
    const [ex, ey] = L[name].e;
    const k = 1 - p(name);
    return { ...box(L[name]), transform: `translate(${ex * k}px, ${ey * k}px)` };
  };

  return (
    <figure className="me" ref={ref} data-artifact="MarkEverywhere">
      <div className="me__main">
        <div className={`me__stage${wide ? '' : ' me__stage--n'}`} ref={stageRef} aria-hidden="true">
          <div className="me__comp" style={{ width: L.w, height: L.h }}>
            <div className="me__s me__sign" style={enter('sign')}>
              <span className="me__sign-w">CHRISTAL CLEAR</span>
            </div>
            <div className="me__s me__card" style={enter('card')}>
              <span className="me__card-w">CHRISTAL CLEAR PROPERTIES</span>
            </div>
            <div className="me__s me__letter" style={enter('letter')}>
              <span className="me__letter-w">
                <span>Christal Clear</span>
                <span>Properties</span>
              </span>
            </div>
            <div className="me__s me__env" style={enter('env')} />

            {ORDER.filter((name) => name !== 'letter').map((name) => (
              <img
                key={name}
                className={`me__mark${name === 'sign' ? ' me__mark--white' : ''}`}
                src="/brand/ccp-main.svg"
                alt=""
                style={markAt(L, L[name].m, p(name))}
              />
            ))}
            {/* The main mark: opens centred and large, lands on the
                letterhead. */}
            <img className="me__mark me__mark--main" src="/brand/ccp-main.svg" alt="" style={markAt(L, L.letter.m, p('letter'))} />
            <span className="me__strip" style={{ left: L.strip.x, top: L.strip.y, width: L.strip.w }}>
            {PALETTE.map((hex, j) => (
              <span key={hex} style={{ background: hex, transform: `scaleX(${step(t, T_STRIP + j * 120, 400)})` }} />
            ))}
            </span>
          </div>
        </div>
        <figcaption className="me__cap">
          Christal Clear Properties. Identity, stationery, signage. Real estate, St. Simons Island GA.
        </figcaption>
      </div>
      <div className="me__side">
        <span className="me__photo">
          <img
            src="/brand/ccp-signage-800.jpg"
            srcSet="/brand/ccp-signage-800.jpg 800w, /brand/ccp-signage.jpg 1600w"
            sizes="(min-width: 1024px) 40vw, 100vw"
            alt="Christal Clear Properties signage on a building front, beside the Brokered by eXp Realty mark"
            width="1600"
            height="1845"
            loading="lazy"
            decoding="async"
          />
        </span>
        <p className="me__cap">And on the building.</p>
      </div>
    </figure>
  );
}
