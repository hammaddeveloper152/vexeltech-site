import React, { useEffect, useRef, useState } from 'react';
import { prefersReduced } from '../site/useOnce.js';
import { halfInView, THRESHOLDS } from './loop.js';
import './month-report.css';

/* SERVICES, MARKETING: THE MONTH, IN OUR NUMBERS (final18, 2026-10-06, the
   founder). It replaced the results sheet, the receipt and the call strip
   of final17, which are deleted with their styles and loop. No sheet, no
   frame: two columns on the dark band, 1180 wide at 1280.

     the report    620 wide, a 1px bone rule at 22% top and bottom: the
                   account label, a 2px yellow rule 80 wide under it, and
                   three figures in the display face at 112px, 418 clicks,
                   122 enquiries, $34.69 per enquiry, with the 12px line
                   under them. THE FIGURES ARE REAL: the founder's Google
                   Ads account for November 2025 (VEXELTECH-COPY.md, "Where
                   we come from, the November capture": 418 clicks, 122
                   conversions, $34.69 per conversion). They never change.
     the arrivals  480 wide: "ENQUIRIES · TUESDAY" and eight 64px rows,
                   each a source chip, what came in and a time. The rows
                   are a scene of the process (BUILD-LAW Real over drawn),
                   not a record: the times and kinds are made up, and the
                   sources cycle in the brief's order.

   THE LOOP: at rest the eight rows, finished. At half in view the rows
   take a 400ms soft start, then every 9s a new row enters at the top (from
   64px up and opacity 0, 350ms), the rows below shift down 64px and the
   bottom one fades out. Its time is the previous top time plus 11 to 40
   minutes, from a fixed seed. Off screen it stops where it is. Reduced
   motion: no loop. Six rows below 1024, four below 600 (the CSS). The
   stage is a picture, aria-hidden; the caption is the content. */
const ORDER = ['Search ad', 'Local listing', 'Search ad', 'Meta ad', 'Website form', 'Search ad', 'Local listing', 'Search ad'];
const KINDS = ['Quote request', 'Call, 2 min 40 s', 'Booking enquiry', 'Call back requested'];
/* What came in, per source: a listing rings, a form asks, an ad does
   either. */
const KIND_OF = {
  'Search ad': [0, 2, 1],
  'Local listing': [1, 3],
  'Meta ad': [2, 0],
  'Website form': [3, 0],
};
const PERIOD = 9000;
const ENTER = 350;
const SOFT = 400;

/* A small seeded generator (mulberry32), so every load runs the same. */
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

function rowAt(n, minute) {
  const src = ORDER[n % ORDER.length];
  const ks = KIND_OF[src];
  return { id: n, src, kind: KINDS[ks[Math.floor(n / ORDER.length) % ks.length]], minute };
}

/* The finished column: eight rows, newest on top, from 09:12 up. */
const START = [552, 581, 605, 637, 662, 690, 718, 741]; // 09:12 ... 12:21
const FIRST = START.map((m, k) => rowAt(7 - k, m)).reverse();

export default function MonthReport() {
  const ref = useRef(null);
  const [rows, setRows] = useState(FIRST);
  const [cycle, setCycle] = useState(0);
  const [soft, setSoft] = useState(false);
  const state = useRef({ n: 8, rand: seeded(18), top: FIRST[0].minute, timers: [] });

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced() || typeof IntersectionObserver === 'undefined') return undefined;
    const s = state.current;
    const clear = () => {
      s.timers.forEach(clearTimeout);
      s.timers = [];
      clearInterval(s.every);
      s.every = 0;
    };
    const enter = () => {
      s.top += 11 + Math.floor(s.rand() * 30);
      const next = rowAt(s.n, s.top);
      s.n += 1;
      setRows((r) => [next, ...r].slice(0, 9));
      setCycle((c) => c + 1);
      s.timers.push(setTimeout(() => setRows((r) => r.slice(0, 8)), ENTER));
    };
    const start = () => {
      setSoft(true);
      s.timers.push(
        setTimeout(() => {
          setSoft(false);
          enter();
          s.every = setInterval(enter, PERIOD);
        }, SOFT)
      );
    };
    let on = false;
    const io = new IntersectionObserver(
      (es) => {
        const now = halfInView(es[es.length - 1]);
        if (now && !on) start();
        if (!now && on) {
          clear();
          setSoft(false);
          setRows((r) => r.slice(0, 8));
        }
        on = now;
      },
      { threshold: THRESHOLDS }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
    };
  }, []);

  return (
    <figure className="mr" data-artifact="MonthReport" data-device="report">
      <div className="mr__stage" aria-hidden="true">
        <div className="mr__report">
          <p className="mr__k">Google Ads account report · November 2025 · Client name withheld</p>
          <span className="mr__rule" />
          <dl className="mr__figs">
            <div className="mr__fig">
              <dt className="mr__n">418</dt>
              <dd className="mr__l">clicks</dd>
            </div>
            <div className="mr__fig">
              <dt className="mr__n">122</dt>
              <dd className="mr__l">enquiries</dd>
            </div>
            <div className="mr__fig">
              <dt className="mr__n">$34.69</dt>
              <dd className="mr__l">per enquiry</dd>
            </div>
          </dl>
          <p className="mr__note">One search campaign, one month, as reported by the ad account. Figures are real.</p>
        </div>

        <div className="mr__arrivals" ref={ref}>
          <p className="mr__k">Enquiries · Tuesday</p>
          <ol className={`mr__rows${soft ? ' is-soft' : ''}`} key={cycle} data-cycle={cycle > 0 ? 'true' : undefined}>
            {rows.map((r, k) => (
              <li className={`mr__row${cycle > 0 && k === 0 ? ' mr__row--new' : ''}`} key={r.id}>
                <span className="mr__chip">{r.src}</span>
                <span className="mr__what">{r.kind}</span>
                <span className="mr__time">{hhmm(r.minute)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <figcaption className="mr__cap">
        <span>Searches become enquiries. The report says how many.</span>
        <span>Marketing priced on the call</span>
      </figcaption>
    </figure>
  );
}
