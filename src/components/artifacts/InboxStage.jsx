import React, { useEffect, useRef, useState } from 'react';
import { prefersReduced } from '../site/useOnce.js';
import { halfInView, THRESHOLDS } from './loop.js';
import Monogram from './Monogram.jsx';
import { SETS, setVars } from '../../content/brandSets.js';
import './inbox-stage.css';

/* SERVICES, MARKETING: THREE PLACES, ONE INBOX (final19, 2026-10-06, the
   founder). It replaced the month's report of final18 (MonthReport.jsx,
   deleted with its figures block and styles); the report's real figures
   are one line under the stage now.

     left       three white cards, 220 x 400 on one baseline since final20
                (they stepped down 20px each before), 24 apart, the first
                24px in from the stage's edge, an 11px mono label over
                each:
                  1  a search: a Sponsored result for "Your Business"
                  2  a feed post, its panel in the client primary #1F2A44
                     and the one platform colour on the stage, #1877F2,
                     on the "Learn more" outline
                  3  a map with a navy pin carrying the YB mark, a listing
                     and a Call pill
     right 420  the inbox: "Where it lands · Your inbox", eight 64px rows
                (a SEARCH, SOCIAL or MAP chip, what came in, the time), and
                "Illustration of a typical day."
     between    48px, nothing in it (final28, 2026-10-07, the founder:
                the SVG wires, the bus, the trunk and the pulse of
                final20 and final21 are deleted)

   THE LOOP (final28). Finished at rest. At half in view the rows take a
   400ms soft start, the stage holds 6s, then every 9s one card lifts 6px
   for 600ms and, as it lifts, a row with that card's chip enters at the
   top of the inbox (350ms) and the bottom row fades. The new chip's
   outline shows the card's colour for 600ms (Search yellow #F2B01E, Social
   lilac #C9A5F5, Map mint #3FA37A), then settles to the bone outline every
   chip has: a coloured ring over it whose opacity goes to 0, so no colour
   animates (BUILD-LAW Motion). The cards take turns 1, 3, 2, 1, 3, 1, 2, 3.
   Off screen it stops. Reduced motion: no loop. The stage is a picture,
   aria-hidden; the caption is the content. */
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
const LIFT = 600;
const ENTER = 350;

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
        {/* THE REVIEWS (final21, 2026-10-06): two lines on the demo
            listing, the brief's words, for the made-up "Your Business";
            not reviews of VexelTech. */}
        <div className="ib__reviews">
          <p className="ib__rev-k">Reviews</p>
          {REVIEWS.map((r) => (
            <div className="ib__rev" key={r}>
              <span className="ib__rev-s">★★★★★</span>
              <p className="ib__rev-t">{r}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const REVIEWS = ['Came the same day and fixed it in an hour.', 'Clear price before they started. Would use again.'];

const CARDS = [Search, Feed, MapCard];

export default function InboxStage() {
  const stageRef = useRef(null);
  const rowsRef = useRef(null);
  const [rows, setRows] = useState(ROWS);
  const [cycle, setCycle] = useState(0);
  const [soft, setSoft] = useState(false);
  const [lift, setLift] = useState(-1);
  const s = useRef({ n: 8, turn: 0, top: ROWS[0].minute, rand: seeded(19), timers: [] });

  /* The loop. */
  useEffect(() => {
    const el = rowsRef.current;
    const st = s.current;
    if (!el || prefersReduced() || typeof IntersectionObserver === 'undefined') return undefined;
    const later = (fn, ms) => st.timers.push(setTimeout(fn, ms));
    const clear = () => {
      st.timers.forEach(clearTimeout);
      st.timers = [];
      setLift(-1);
    };
    const play = () => {
      const k = TURNS[st.turn % TURNS.length];
      st.turn += 1;
      setLift(k);
      st.top += 11 + Math.floor(st.rand() * 30);
      const kinds = KINDS[k];
      const next = { id: st.n, card: k, kind: kinds[Math.floor(st.n / 3) % kinds.length], minute: st.top };
      st.n += 1;
      setRows((r) => [next, ...r].slice(0, 9));
      setCycle((c) => c + 1);
      later(() => setRows((r) => r.slice(0, 8)), ENTER);
      later(() => setLift(-1), LIFT);
      later(play, PERIOD);
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
        <ol className="ib__places">
          {CARDS.map((Card, k) => (
            <li className={`ib__slot ib__slot--${k + 1}${lift === k ? ' is-lift' : ''}`} key={CHIP[k]}>
              <p className="ib__lab">
                {LABELS[k][0]}{' '}
                <br />
                {LABELS[k][1]}
              </p>
              <div className="ib__lift">
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
                <span className={`ib__chip ib__chip--${r.card + 1}`}>{CHIP[r.card]}</span>
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
