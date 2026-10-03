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
   it shrinks to the top-left corner while the surfaces the client actually
   received land around it, 180ms apart, each with the mark already on it:
   the mark on each is a copy that travels from the centre. THE SURFACES ARE
   THE DELIVERED ONES (the founder, 2026-10-03, rewriting BUILD-LAW's Real
   over drawn: a scene may show a mark being applied, never work as
   delivered that was not): the sign band, the business card, the
   letterhead and the envelope. The brief's app tile, browser tab and social
   avatar came out with that ruling. Then the five palette values draw as a
   2px strip along the stage's foot. Hold, rest, loop (loop.js).

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

/* x, y, w, h of each surface; m: the mark's box inside the stage; e: where
   the surface enters from (an offset that puts it outside the stage). */
const WIDE = {
  w: 640,
  h: 480,
  big: 160,
  main: { x: 32, y: 32, s: 72 },
  sign: { x: 300, y: 372, w: 300, h: 64, m: { x: 316, y: 380, s: 40 }, e: [0, 160] },
  card: { x: 136, y: 56, w: 220, h: 126, m: { x: 150, y: 70, s: 40 }, e: [0, -220] },
  letter: { x: 432, y: 40, w: 160, h: 226, m: { x: 446, y: 54, s: 32 }, e: [260, 0] },
  env: { x: 48, y: 236, w: 220, h: 110, m: { x: 62, y: 286, s: 40 }, e: [-320, 0] },
};
const NARROW = {
  w: 358,
  h: 268,
  big: 112,
  main: { x: 12, y: 12, s: 40 },
  sign: { x: 12, y: 222, w: 334, h: 36, m: { x: 22, y: 226, s: 24 }, e: [0, 80] },
  card: { x: 132, y: 12, w: 214, h: 112, m: { x: 142, y: 20, s: 28 }, e: [0, -150] },
  letter: { x: 12, y: 74, w: 104, h: 140, m: { x: 20, y: 82, s: 22 }, e: [-160, 0] },
  env: { x: 132, y: 136, w: 150, h: 76, m: { x: 140, y: 172, s: 26 }, e: [260, 0] },
};
const ORDER = ['sign', 'card', 'letter', 'env'];
const T_MOVE = 1000;
const T_LAND = 1100;
const GAP = 180;
const MOVE = 700;
const T_STRIP = 2900;
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
  const pMain = step(t, T_MOVE, MOVE);
  const p = (name) => step(t, T_LAND + ORDER.indexOf(name) * GAP, MOVE);
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

            {ORDER.map((name) => (
              <img
                key={name}
                className={`me__mark${name === 'sign' ? ' me__mark--white' : ''}`}
                src="/brand/ccp-main.svg"
                alt=""
                style={markAt(L, L[name].m, p(name))}
              />
            ))}
            <img
              className="me__mark me__mark--main"
              src="/brand/ccp-main.svg"
              alt=""
              style={markAt(L, { x: L.main.x, y: L.main.y, s: L.main.s }, pMain)}
            />
          </div>
          <span className="me__strip">
            {PALETTE.map((hex, j) => (
              <span key={hex} style={{ background: hex, transform: `scaleX(${step(t, T_STRIP + j * 120, 400)})` }} />
            ))}
          </span>
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
