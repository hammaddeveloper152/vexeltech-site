import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { prefersReduced } from '../site/useOnce.js';
import { halfInView, THRESHOLDS } from './loop.js';
import Monogram from './Monogram.jsx';
import { SETS, setVars } from '../../content/brandSets.js';
import './inbox-stage.css';

/* SERVICES, MARKETING: THREE PLACES, ONE INBOX (final19, 2026-10-06, the
   founder). It replaced the month's report of final18 (MonthReport.jsx,
   deleted with its figures block and styles); the report's real figures
   are one line under the stage now.

     left 700   three white cards, 210 x 300, 24 apart, each 20px lower than
                the one before, an 11px mono label over each:
                  1  a search: a Sponsored result for "Your Business"
                  2  a feed post, its panel in the client primary #1F2A44
                     and the one platform colour on the stage, #1877F2,
                     on the "Learn more" outline
                  3  a map with a navy pin carrying the YB mark, a listing
                     and a Call pill
     right 420  the inbox: "Where it lands · Your inbox", eight 64px rows
                (a SEARCH, SOCIAL or MAP chip, what came in, the time), and
                "Illustration of a typical day."
     wires      from each card's right edge at 60% of its height a 1px line
                in yellow at 35% runs right, bends on a 24px radius into a
                shared 1px trunk, which bends again into the inbox's top.
                SVG, measured from the layout, finished at rest; hidden
                below 1024

   THE LOOP. Finished at rest. At half in view the rows take a 400ms soft
   start, the stage holds 6s, then every 9s: one card lifts 6px and a 6px
   yellow pulse runs its wire to the trunk and into the inbox (900ms); a
   row with that card's chip enters at the top (350ms) and the bottom row
   fades. The cards take turns 1, 3, 2, 1, 3, 1, 2, 3. Off screen it stops.
   Reduced motion: no loop. The stage is a picture, aria-hidden; the
   caption is the content. */
const CHIP = ['Search', 'Social', 'Map'];
/* What came in, per card, in turn. */
const KINDS = [
  ['Quote request', 'Booking enquiry', 'Call back requested'],
  ['Message, asked for a price', 'Booking enquiry'],
  ['Call, 2 min 40 s', 'Call, 4 min 05 s'],
];
const TURNS = [0, 2, 1, 0, 2, 0, 1, 2];
const FIRST = [
  [0, 'Quote request'],
  [2, 'Call, 2 min 40 s'],
  [0, 'Booking enquiry'],
  [1, 'Message, asked for a price'],
  [0, 'Quote request'],
  [2, 'Call, 4 min 05 s'],
  [1, 'Booking enquiry'],
  [0, 'Call back requested'],
];
const TIMES = [741, 718, 690, 662, 637, 605, 581, 552]; // 12:21 down to 09:12
const ROWS = FIRST.map(([c, kind], i) => ({ id: i, card: c, kind, minute: TIMES[i] }));
const SOFT = 400;
const HOLD = 6000;
const PERIOD = 9000;
const PULSE = 900;
const ENTER = 350;
const R = 24;

function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = a;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const hhmm = (m) => {
  const d = ((m % 1440) + 1440) % 1440;
  return `${String(Math.floor(d / 60)).padStart(2, '0')}:${String(d % 60).padStart(2, '0')}`;
};

const LABELS = [
  ['Searching for', 'it now'],
  ['Scrolling, not', 'yet looking'],
  ['Nearby, deciding', 'who to call'],
];

function Search() {
  return (
    <div className="ib__card ib__card--search">
      <span className="ib__bar">electrician near me</span>
      <p className="ib__sp">Sponsored</p>
      <p className="ib__meta">Your business · yourbusiness.com</p>
      <p className="ib__head">Your Business | Same-week appointments</p>
      <p className="ib__desc">Local, insured, reply within the hour.</p>
      <p className="ib__links">
        <span>Book online</span>
        <span>Call</span>
      </p>
    </div>
  );
}

function Feed() {
  return (
    <div className="ib__card ib__card--feed">
      <div className="ib__post-h">
        <span className="ib__av">
          <Monogram name="Your Business" size={13} />
        </span>
        <span className="ib__post-id">
          <span className="ib__post-n">Your Business</span>
          <span className="ib__post-sp">Sponsored</span>
        </span>
      </div>
      <p className="ib__post-t">Booked up this week? Neither were our customers until they found us.</p>
      <div className="ib__panel">
        <span>Same-week appointments.</span>
        <span>Book online.</span>
      </div>
      <div className="ib__post-f">
        <span className="ib__post-url">yourbusiness.com</span>
        <span className="ib__more">Learn more</span>
      </div>
    </div>
  );
}

function MapCard() {
  return (
    <div className="ib__card ib__card--map">
      <div className="ib__map">
        <span className="ib__road ib__road--h" />
        <span className="ib__road ib__road--v" />
        <span className="ib__pin">
          <Monogram name="Your Business" size={13} />
        </span>
      </div>
      <div className="ib__place">
        <p className="ib__place-n">Your Business</p>
        <p className="ib__place-r">4.9 ★★★★★ (212)</p>
        <p className="ib__place-o">Open · Closes 5 PM</p>
        <span className="ib__call">Call</span>
      </div>
    </div>
  );
}

const CARDS = [Search, Feed, MapCard];

export default function InboxStage() {
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const rowsRef = useRef(null);
  const pulseRef = useRef(null);
  const pathRefs = useRef([]);
  const [wires, setWires] = useState(null);
  const [rows, setRows] = useState(ROWS);
  const [cycle, setCycle] = useState(0);
  const [soft, setSoft] = useState(false);
  const [lift, setLift] = useState(-1);
  const s = useRef({ n: 8, turn: 0, top: ROWS[0].minute, rand: seeded(19), timers: [], raf: 0 });

  /* The wires, measured from the layout, from 1024. */
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const measure = () => {
      if (window.innerWidth < 1024) {
        setWires(null);
        return;
      }
      const o = stage.getBoundingClientRect();
      const cards = cardRefs.current.map((c) => c.getBoundingClientRect());
      const list = rowsRef.current.getBoundingClientRect();
      const yR = list.top - o.top;
      const xL = list.left - o.left;
      /* The trunk 40px right of the third card, unless the gap to the
         inbox is too narrow for that and the 24px bend into it (at 1280
         the stage is 1152 wide and the gap 54): then as far right as the
         bend allows. */
      const T = Math.min(cards[2].right - o.left + 40, xL - R);
      const ys = cards.map((c) => c.top - o.top + c.height * 0.6);
      const branch = (k) => `M ${cards[k].right - o.left} ${ys[k]} H ${T - R} A ${R} ${R} 0 0 0 ${T} ${ys[k] - R}`;
      const trunkFrom = (y) => `V ${yR + R} A ${R} ${R} 0 0 1 ${T + R} ${yR} H ${xL}`;
      setWires({
        w: o.width,
        h: o.height,
        branches: [0, 1, 2].map(branch),
        trunk: `M ${T} ${ys[2] - R} ${trunkFrom()}`,
        full: [0, 1, 2].map((k) => `${branch(k)} ${trunkFrom()}`),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    if (document.fonts) document.fonts.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  /* The loop. */
  useEffect(() => {
    const el = rowsRef.current;
    const st = s.current;
    if (!el || prefersReduced() || typeof IntersectionObserver === 'undefined') return undefined;
    const later = (fn, ms) => st.timers.push(setTimeout(fn, ms));
    const clear = () => {
      st.timers.forEach(clearTimeout);
      st.timers = [];
      cancelAnimationFrame(st.raf);
      if (pulseRef.current) pulseRef.current.style.opacity = '0';
      setLift(-1);
    };
    const pulse = (k, done) => {
      const path = pathRefs.current[k];
      const dot = pulseRef.current;
      if (!path || !dot || window.innerWidth < 1024) {
        later(done, PULSE);
        return;
      }
      const len = path.getTotalLength();
      const t0 = performance.now();
      dot.style.opacity = '1';
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / PULSE);
        const pt = path.getPointAtLength(len * p);
        dot.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
        if (p < 1) st.raf = requestAnimationFrame(tick);
        else {
          dot.style.opacity = '0';
          done();
        }
      };
      st.raf = requestAnimationFrame(tick);
    };
    const play = () => {
      const k = TURNS[st.turn % TURNS.length];
      st.turn += 1;
      setLift(k);
      pulse(k, () => {
        st.top += 11 + Math.floor(st.rand() * 30);
        const kinds = KINDS[k];
        const next = { id: st.n, card: k, kind: kinds[Math.floor(st.n / 3) % kinds.length], minute: st.top };
        st.n += 1;
        setRows((r) => [next, ...r].slice(0, 9));
        setCycle((c) => c + 1);
        setLift(-1);
        later(() => setRows((r) => r.slice(0, 8)), ENTER);
        later(play, PERIOD - PULSE);
      });
    };
    let on = false;
    const io = new IntersectionObserver(
      (es) => {
        const now = halfInView(es[es.length - 1]);
        if (now && !on) {
          setSoft(true);
          later(() => setSoft(false), SOFT);
          later(play, SOFT + HOLD);
        }
        if (!now && on) {
          clear();
          setSoft(false);
          setRows((r) => r.slice(0, 8));
        }
        on = now;
      },
      { threshold: THRESHOLDS }
    );
    io.observe(stageRef.current);
    return () => {
      io.disconnect();
      clear();
    };
  }, []);

  return (
    <figure className="ib" data-artifact="InboxStage" data-device="three places">
      <div className="ib__stage" ref={stageRef} aria-hidden="true" style={setVars(SETS[0])}>
        {wires ? (
          <svg className="ib__wires" width={wires.w} height={wires.h} viewBox={`0 0 ${wires.w} ${wires.h}`} focusable="false">
            {wires.branches.map((d) => (
              <path key={d} d={d} />
            ))}
            <path d={wires.trunk} />
            {wires.full.map((d, k) => (
              // eslint-disable-next-line react/no-array-index-key
              <path key={`f${k}`} d={d} className="ib__route" ref={(n) => (pathRefs.current[k] = n)} />
            ))}
            <circle className="ib__pulse" ref={pulseRef} r="3" cx="0" cy="0" />
          </svg>
        ) : null}

        <ol className="ib__places">
          {CARDS.map((Card, k) => (
            <li className={`ib__slot ib__slot--${k + 1}${lift === k ? ' is-lift' : ''}`} key={CHIP[k]}>
              <p className="ib__lab">
                {LABELS[k][0]}
                <br />
                {LABELS[k][1]}
              </p>
              <div className="ib__lift" ref={(n) => (cardRefs.current[k] = n)}>
                <Card />
              </div>
            </li>
          ))}
        </ol>

        <div className="ib__inbox">
          <p className="ib__k">Where it lands · Your inbox</p>
          <ol className={`ib__rows${soft ? ' is-soft' : ''}`} key={cycle} ref={rowsRef} data-cycle={cycle > 0 ? 'true' : undefined}>
            {rows.map((r, i) => (
              <li className={`ib__row${cycle > 0 && i === 0 ? ' ib__row--new' : ''}`} key={r.id}>
                <span className="ib__chip">{CHIP[r.card]}</span>
                <span className="ib__what">{r.kind}</span>
                <span className="ib__time">{hhmm(r.minute)}</span>
              </li>
            ))}
          </ol>
          <p className="ib__note">Illustration of a typical day.</p>
        </div>
      </div>
      <p className="ib__proof">One campaign we ran, November 2025: 418 clicks, 122 enquiries, $34.69 each. Client name withheld.</p>
      <figcaption className="ib__cap">
        <span>Three places your customers already are. One place the enquiries land.</span>
        <span>Marketing priced on the call</span>
      </figcaption>
    </figure>
  );
}
