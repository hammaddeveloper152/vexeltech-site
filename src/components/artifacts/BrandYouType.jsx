import React, { useEffect, useRef, useState } from 'react';
import { useLoop, step, lin } from './loop.js';
import './artifacts.css';

/* SERVICES, BRANDING: THE BRAND YOU TYPE (2026-10-03, the founder, final7).
   It replaced the Christal Clear stage and the signage photograph; the
   /brand files are deleted. No client name, capture or logo is in it.

   A cream panel at the content width, 520 tall from 1024 (stacked below):

     left 36%    one line field, "Your name here" over it in mono 11px
                 steel, the placeholder "Type your business name", 24
                 characters at most; under it "Watch it become a brand." in
                 15px STEEL, not the brief's steel-lift, which is 2.3:1 on
                 cream and fails 4.5:1
     right 64%   the stage. Until the visitor types it runs a demo on
                 "Harbor Dental", retyping it every 12s (a 7s build and the
                 loop's 5s rest). The moment the visitor types, the demo
                 stops for good and the stage follows the field live.

   What the stage builds, each step 300ms after the last: the wordmark (the
   name in the display face at 44px, letter-spaced, colour A, shrunk to
   fit), the mark (the initials of up to two words in a 96px square, radius
   20, A with B letters), the palette (A, B and the neutral, hex in mono
   11px), then three surfaces with the mark and wordmark already on them: a
   360 x 72 sign band in A with the wordmark in B, a 220 x 126 card in the
   neutral with the mark at 36px and the name at 11px, a 72px app tile in A
   with the initials.

   THE COLOURS are picked from the name, one of five sets by a hash, the
   neutral always #F7F5EF, never the site's yellow. Every pair the stage
   paints passes 4.5:1 for all five sets: B on A 5.23 (charcoal and coral)
   to 10.79 (navy and sand); A on the neutral 10.58 to 14.42.

   Nothing starts hidden: the first paint is the finished stage. The steps
   draw (the palette by clip-path), resize (the mark from its centre) or move
   in from outside the stage (the surfaces); the wordmark types. Reduced
   motion: the finished state for the current name, no stepping. The stage
   is a picture of the field, aria-hidden; the field is the content. */
const DEMO = 'Harbor Dental';
const MAX = 24;
const SETS = [
  { a: '#1F2A44', b: '#EADFC8' },
  { a: '#1E3D2F', b: '#CFE8D5' },
  { a: '#5A1F24', b: '#F1D9D2' },
  { a: '#232323', b: '#F26B4F' },
  { a: '#2E3A4A', b: '#CFE3F2' },
];
const NEUTRAL = '#F7F5EF';

const T_TYPE = 200;
const PER_CHAR = 100;
const T_WORD = T_TYPE + DEMO.length * PER_CHAR;
const T_MARK = T_WORD + 300;
const T_PAL = T_MARK + 300;
const T_SURF = T_PAL + 300;
const TOTAL = 7000;

function setFor(name) {
  let h = 0;
  for (const ch of name.trim().toLowerCase()) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return SETS[h % SETS.length];
}

function initialsOf(name) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => [...w][0])
    .join('')
    .toUpperCase();
}

/* The font size that fits `text` into `avail` px, at most `max`, in the
   display face, uppercase, letter-spaced .06em. */
let ctx = null;
function fit(text, avail, max) {
  if (!text || avail <= 0 || typeof document === 'undefined') return max;
  ctx = ctx || document.createElement('canvas').getContext('2d');
  ctx.font = `500 ${max}px 'Clash Display', 'Helvetica Neue', Arial, sans-serif`;
  const w = ctx.measureText(text.toUpperCase()).width + 0.06 * max * [...text].length;
  return Math.max(11, Math.min(max, Math.floor((max * avail) / w)));
}

export default function BrandYouType() {
  const ref = useRef(null);
  const stageRef = useRef(null);
  const [t, , stop] = useLoop(ref, TOTAL);
  const [value, setValue] = useState('');
  const [typed, setTyped] = useState(false);
  const [w, setW] = useState(0);
  const [, setFonts] = useState(0);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    if (document.fonts) document.fonts.ready.then(() => setFonts((n) => n + 1));
    return () => ro.disconnect();
  }, []);

  const onChange = (e) => {
    const v = e.target.value.slice(0, MAX);
    setValue(v);
    if (!typed && v) {
      setTyped(true);
      stop();
    }
  };

  /* The name on stage: the visitor's once they have typed (the demo's when
     the field is empty again), else the demo, typed out by the loop. */
  const live = typed;
  const name = live ? value.trim() || DEMO : DEMO;
  const shown = live ? name : DEMO.slice(0, Math.round(lin(t, T_TYPE, DEMO.length * PER_CHAR) * DEMO.length));
  const k = (from, ms = 400) => (live ? 1 : step(t, from, ms));
  const { a, b } = setFor(name);
  const ini = initialsOf(name);
  const inner = Math.max(0, w - 48);
  const fsWord = fit(name, inner, 44);
  /* The sign band is 360 wide where the row holds all three surfaces at
     their sizes; where it does not (1024 to 1439, the row is 632 at 1280)
     it gives up the difference, so the three stay on one row. Below 600 the
     row wraps and the band takes the width. */
  const signW = inner >= 520 ? Math.max(240, Math.min(360, inner - 220 - 72 - 40)) : Math.min(360, inner);
  const fsSign = fit(name, signW - 48, 28);
  const pMark = k(T_MARK);
  const pPal = k(T_PAL);

  return (
    <figure className="by" ref={ref} data-artifact="BrandYouType">
      <div className="by__panel">
        <div className="by__field">
          <label className="by__label" htmlFor="by-name">
            Your name here
          </label>
          <input
            id="by-name"
            className="by__input"
            type="text"
            value={value}
            onChange={onChange}
            maxLength={MAX}
            placeholder="Type your business name"
            autoComplete="off"
            spellCheck={false}
          />
          <p className="by__hint">Watch it become a brand.</p>
        </div>

        <div className="by__stage" ref={stageRef} aria-hidden="true">
          <p className="by__word" style={{ color: a, fontSize: fsWord }}>
            {shown}
            {!live && shown.length < DEMO.length ? <span className="cs-caret by__caret" /> : null}
          </p>

          <div className="by__row">
            <span className="by__mark" style={{ background: a, color: b, transform: `scale(${pMark})` }}>
              {ini}
            </span>
            <ul className="by__pal" style={{ clipPath: `inset(0 ${(1 - pPal) * 100}% 0 0)` }}>
              {[a, b, NEUTRAL].map((hex) => (
                <li className="by__sw" key={hex}>
                  <span className="by__chip" style={{ background: hex }} />
                  <span className="by__hex">{hex}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="by__surfaces">
            <span
              className="by__sign"
              style={{ width: signW, background: a, color: b, fontSize: fsSign, transform: `translateY(${(1 - k(T_SURF, 500)) * 320}px)` }}
            >
              {name}
            </span>
            <span className="by__card" style={{ transform: `translateY(${(1 - k(T_SURF + 70, 500)) * 320}px)` }}>
              <span className="by__mark by__mark--sm" style={{ background: a, color: b }}>
                {ini}
              </span>
              <span className="by__card-n" style={{ color: a }}>
                {name}
              </span>
            </span>
            <span
              className="by__tile"
              style={{ background: a, color: b, transform: `translateY(${(1 - k(T_SURF + 140, 500)) * 320}px)` }}
            >
              {ini}
            </span>
          </div>
        </div>
      </div>
      <figcaption className="by__cap">Name, mark, palette, applications. Delivered as files you own.</figcaption>
    </figure>
  );
}
