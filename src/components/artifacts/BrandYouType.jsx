import React, { useEffect, useRef, useState } from 'react';
import { useLoop, step, lin, leaving } from './loop.js';
import PhoneShell from './PhoneShell.jsx';
import './artifacts.css';
import './brand-board.css';

/* SERVICES, BRANDING: THE BRAND YOU TYPE (2026-10-03, the founder, final7).
   No client name, capture or logo is in it.

   A PRESENTATION BOARD, 2026-10-06 (the founder's quality pass, BUILD-LAW
   rule 0 and "CSS mockups", as amended that day). The name field stays on
   the left of the cream panel; the stage is a 760 x 560 board from 1024
   (field above it from 1024 to 1279, beside it from 1280), and below 1024
   the same objects stack in a column at their own sizes, so no type is
   scaled under the floor.

     the sign      460 x 120 (520 until the clarity pass), top left,
                   tipped back by rotateX(6deg) in a 900px perspective. Unlit it is A darkened; lit, a two-stop
                   gradient from A to A at 86%, so its lightest stop is A
                   itself and B reads on every stop (the lighting only ever
                   darkens: coral on charcoal is 3.85:1 on A lightened 10%).
                   A 2px lighter top edge, a 24px drop shadow. The mark at
                   72px and the wordmark in B, with a 1px darker text shadow
                   so it reads as lettering
     the cards     two, 240 x 140, overlapping at -8deg and 6deg: one in A
                   with the mark, one in the neutral with the name and a 3px
                   A edge; each a paper gradient with the site's grain, and
                   the two shadows 0 2px 4px .12 and 0 18px 40px .18
     the phone     PhoneShell, 200 wide: a lock screen in A, "9:41" in the
                   display face in B and the mark at 56px; cropped by the
                   board's foot (it is 433 tall in a 560 board)
     the kit       under the cards: the app tile and the palette strip
     the sheet     top right: the guideline sheet as built, on paper with a
                   gradient and the cards' shadows
     the files     the four pills right of the palette, in two rows (along
                   the foot until the clarity pass)

   THE PLAY (start soft, loop.js): the mark draws on the sign; the palette
   strip wipes in; the wordmark types onto the sign while it lights, a lit
   face revealed left to right by clip-path with a sheen crossing once; the
   cards drop in with a 12px overshoot; the phone's face lights and the app
   tile arrives; the sheet slides in and its lines draw; the pills land.
   (The step strip of the clarity pass came off in final14, 2026-10-06.) Whatever lands casts
   its shadow as it lands: each shadow is its own layer under the object,
   fading up as the object arrives (box-shadow itself never animates).
   Transform, opacity, clip-path and stroke-dashoffset only.

   Nothing starts hidden: the first paint, a rest and reduced motion are the
   finished board for the current name. The board is a picture of the
   field, aria-hidden; the field is the content.

   THE COLOURS are picked from the name, one of five sets by a hash, the
   neutral always #F7F5EF. Measured, every set, on the sign's two stops, the
   A card and the neutral card: B on A 5.23 to 10.79, B on A at 86% 5.49 to
   11.54, A on the neutral paper's darker stop 9.68 to 13.18. */
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
const FILES = ['SVG', 'PNG', 'PDF guide', 'Fonts'];

/* The timeline, in ms. THE CLARITY PASS (2026-10-06): the palette lands
   straight after the mark, before the sign, so the play runs in the step
   strip's order, the founder's: Mark, Palette, Sign, Cards, Screen, Guide,
   Files. The sign types from 1000 (it was 800) and the palette wipes in at
   600 (it was 3850, after the phone). */
const T_MARK = 200;
const T_PAL = 600;
const T_TYPE = 1000;
const PER_CHAR = 90;
const T_LIT = T_TYPE;
const LIT_MS = DEMO.length * PER_CHAR;
const T_CARD = 2300;
const CARD_MS = 650;
const T_PHONE = 3300;
const T_TILE = 3700;
const T_SHEET = 4400;
const T_FILES = 5500;
const TOTAL = 7000;

/* The board's own width from 1024; under it the column. */
const BOARD = 760;
/* 460 since the clarity pass (it was 520), so the guideline sheet in the
   top right corner clears the sign's end instead of overlapping it. */
const SIGN = 460;

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

/* A drop with a 12px overshoot: from `from` px above to 12px past its
   place over the first 70%, then back up to rest. */
const OVER = 12;
function drop(p, from) {
  if (p >= 1) return 0;
  if (p < 0.7) {
    const e = step(p, 0, 0.7);
    return -from * (1 - e) + OVER * e;
  }
  return OVER * (1 - step(p, 0.7, 0.3));
}

/* The shadow under a landing object: nothing while it is high, full as it
   arrives. */
const shade = (p) => Math.max(0, Math.min(1, (p - 0.45) / 0.55));

export default function BrandYouType() {
  const ref = useRef(null);
  const stageRef = useRef(null);
  const [t, , stop, leave] = useLoop(ref, TOTAL);
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

  /* The name on the board: the visitor's once they have typed (the demo's
     when the field is empty again), else the demo, typed out by the loop. */
  const live = typed;
  const name = live ? value.trim() || DEMO : DEMO;
  const shown = live
    ? name
    : DEMO.slice(0, Math.round(lin(t, T_TYPE, DEMO.length * PER_CHAR) * DEMO.length));
  const k = (from, ms = 400) => (live ? 1 : step(t, from, ms));
  const kl = (from, ms) => (live ? 1 : lin(t, from, ms));
  const { a, b } = setFor(name);
  const ini = initialsOf(name);

  /* The board from a 760 stage; under it the sign takes the column. The
     wordmark fits what the sign leaves after its padding and the mark;
     the sheet no longer overlaps the sign's end (clarity pass). */
  const board = w >= BOARD;
  const signW = board ? SIGN : Math.max(200, Math.min(SIGN, w - 32));
  const fsSign = fit(name, signW - 48 - 72 - 16, 40);

  /* The mark on the sign: its 2px stroke draws, the fill rises in it, the
     initials rise into it. */
  const pStroke = k(T_MARK, 220);
  const pFill = k(T_MARK + 160, 160);
  const pIni = k(T_MARK + 220, 240);
  /* The sign lights left to right while the name types. */
  const pLit = kl(T_LIT, LIT_MS);
  const sheenOn = !live && t > T_LIT && t < T_LIT + LIT_MS + 200;
  const pCardA = kl(T_CARD, CARD_MS);
  const pCardN = kl(T_CARD + 150, CARD_MS);
  const pPhone = k(T_PHONE, 400);
  const pTile = kl(T_TILE, 450);
  const pPal = k(T_PAL);
  const pSheet = k(T_SHEET, 550);
  const pSheetLines = k(T_SHEET + 400, 400);

  const vars = { '--a': a, '--b': b };
  const markSign = (
    <span className="bb__mark" aria-hidden="true">
      <svg className="bb__mark-line" viewBox="0 0 72 72" focusable="false">
        <rect x="1" y="1" width="70" height="70" rx="15" pathLength="100" style={{ strokeDashoffset: 100 * (1 - pStroke) }} />
      </svg>
      <span className="bb__mark-fill" style={{ clipPath: `inset(${(1 - pFill) * 100}% 0 0 0)` }} />
      {/* The initials rise 16px into the square and are revealed from
          the foot by their own clip: inside the tilted sign the square's
          overflow does not hold them back. */}
      <span
        className="bb__mark-ini"
        style={{ transform: `translateY(${(1 - pIni) * 16}px)`, clipPath: `inset(${(1 - pIni) * 100}% 0 0 0)` }}
      >
        {ini}
      </span>
    </span>
  );

  return (
    <figure className="by by--board" ref={ref} data-artifact="BrandYouType" {...leaving(leave)}>
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
          {/* "Watch it become a brand." came off here in the clarity pass
              (2026-10-06): the stage title above says it. */}
        </div>

        <div className="by__stage bb" ref={stageRef} aria-hidden="true" style={vars}>
          {/* THE SIGN. */}
          <div className="bb__sign-wrap" style={{ width: signW }}>
            <div className="bb__sign">
              <span className="bb__sign-lit" style={{ clipPath: `inset(0 ${(1 - pLit) * 100}% 0 0)` }} />
              <span
                className="bb__sign-sheen"
                style={{
                  transform: `translateX(${-60 + pLit * 320}%)`,
                  opacity: sheenOn ? 1 : 0,
                }}
              />
              {markSign}
              <span className="bb__sign-word" style={{ fontSize: fsSign }}>
                {shown}
                {!live && shown.length < DEMO.length ? <span className="cs-caret bb__caret" /> : null}
              </span>
            </div>
          </div>

          {/* THE SHEET. */}
          <div className="bb__sheet-slot">
            <span className="bb__shadow" style={{ opacity: shade(pSheet) }} />
            <span className="by__guide bb__sheet" style={{ transform: `translateX(${(1 - pSheet) * 120}%)` }}>
              <span className="by__guide-k">Clear space</span>
              <svg className="by__guide-lines" viewBox="0 0 96 96" aria-hidden="true" focusable="false">
                <rect x="0.5" y="0.5" width="95" height="95" pathLength="100" style={{ strokeDashoffset: 100 * (1 - pSheetLines) }} />
                {/* The x-gap ticks: the clear space, 20px, marked on the top
                    and left edges between the box and the mark. */}
                <path
                  d="M 38 4 L 38 20 M 58 4 L 58 20 M 4 38 L 20 38 M 4 58 L 20 58"
                  pathLength="100"
                  style={{ strokeDashoffset: 100 * (1 - pSheetLines) }}
                />
              </svg>
              <span className="by__mark by__mark--guide" style={{ background: a, color: b }}>
                {ini}
              </span>
              <span className="by__aa" style={{ color: a }}>
                <span className="by__aa-l">Aa</span>
                <span className="by__aa-s">Aa</span>
              </span>
            </span>
          </div>

          {/* THE CARDS. */}
          <div className="bb__cards">
            <div className="bb__card-slot bb__card-slot--a">
              <span className="bb__shadow" style={{ opacity: shade(pCardA) }} />
              <span className="bb__card bb__card--a" style={{ transform: `translateY(${drop(pCardA, 520)}px)` }}>
                <span className="bb__card-mark">{ini}</span>
              </span>
            </div>
            <div className="bb__card-slot bb__card-slot--n">
              <span className="bb__shadow" style={{ opacity: shade(pCardN) }} />
              <span className="bb__card bb__card--n" style={{ transform: `translateY(${drop(pCardN, 560)}px)` }}>
                <span className="bb__card-n">{name}</span>
              </span>
            </div>
          </div>

          {/* THE PHONE. */}
          <div className="bb__phone-slot">
            <PhoneShell width={200} screen="#0b0b0d" className="bb__phone">
              <span className="bb__lock" style={{ opacity: pPhone }}>
                <span className="bb__time">9:41</span>
                <span className="bb__lock-mark">{ini}</span>
              </span>
            </PhoneShell>
          </div>

          {/* THE KIT: the app tile and the palette strip. */}
          <div className="bb__kit">
            <span className="bb__tile-slot">
              <span className="bb__shadow bb__shadow--tile" style={{ opacity: shade(pTile) }} />
              <span className="bb__tile" style={{ transform: `scale(${pTile >= 1 ? 1 : pTile < 0.7 ? step(pTile, 0, 0.7) * 1.08 : 1.08 - 0.08 * step(pTile, 0.7, 0.3)})` }}>
                {ini}
              </span>
            </span>
            <ul className="by__pal bb__pal" style={{ clipPath: `inset(0 ${(1 - pPal) * 100}% 0 0)` }}>
              {[a, b, NEUTRAL].map((hex) => (
                <li className="by__sw" key={hex}>
                  <span className="by__chip bb__chip" style={{ background: hex }} />
                  <span className="by__hex">{hex}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* THE FILES. */}
          <ul className="by__files bb__files">
            {FILES.map((f, i) => (
              <li className="by__file bb__file" key={f} style={{ transform: `translateY(${(1 - k(T_FILES + i * 80, 300)) * 80}px)` }}>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="by__cap">Name, mark, palette, applications. Delivered as files you own.</figcaption>
    </figure>
  );
}
