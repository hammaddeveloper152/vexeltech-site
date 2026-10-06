import React, { useEffect, useRef } from 'react';
import { useLoop, step, leaving } from './loop.js';
import { prefersReduced } from '../site/useOnce.js';
import PhoneShell from './PhoneShell.jsx';
import './artifacts.css';
import './cost-scenes.css';

/* HOME, WHAT IT COSTS YOU: THE LOCK SCREEN (the founder's final14,
   2026-10-06). It replaced the four scenes of final13 with one object. The
   hero's last shot is a phone ringing; this is that phone a month later.

   A 620 x 460 stage from 1024 (the phone upright, 260 wide, in a taller
   stage below 768), a 1px steel hairline and a 24px inner margin, on a dark
   surface drawn as a radial gradient. One phone, 300 wide, lies on it
   rotated -6 degrees over a soft ellipse shadow. Its lock screen (navy to
   black) shows "2:14" in the display face at 56px and the day in mono.

   Over 16s six notifications stack from the top of the screen, newest
   first, each pushing the older ones down as it lands (transform only; the
   stack is clipped at its top, so a card arrives from above it). Each
   lights its headline at the right as it lands, and the headline stays lit:

     a   800  Missed call, 2:14 PM                 The missed call.
     b  3200  Missed call, 2:31 PM
     c  5800  Google Ads, $2,400.00                 Ad spend without a cost per lead.
     d  8400  Reviews, "Couldn't find..."           Not found.
     e 11000  Someone else., "...booked them in."   No name on the work.
     f 13600  Missed call, Now, and the phone shakes 2px

   THE TYPE FLOOR HOLDS (the founder's ruling): the brief's mono 10px time
   on each card is 11px.

   At rest (first paint, off screen, reduced motion) all six cards are
   stacked and all four headlines are lit. Clicking a headline replays from
   just before its notification lands (under reduced motion it keeps the
   full state). The cards are in normal flow, newest at the top; during a
   play each card's offset comes from the heights of the newer cards not yet
   landed (measured by a ResizeObserver, never in a loop), so at rest no
   transform is set at all.

   The stage is a picture of what the headlines say, so it is aria-hidden;
   the headlines and their lines are the content. */
const ROWS = [
  {
    id: 'find',
    statement: 'Not found.',
    consequence: "Someone searches for what you do and sees three competitors. You're not one of them.",
  },
  {
    id: 'call',
    statement: 'Ad spend without a cost per lead.',
    consequence: 'Money goes out every month and nobody can say what a lead cost.',
  },
  {
    id: 'miss',
    statement: 'The missed call.',
    consequence: "You're with a customer. The caller dials the next number on the list.",
  },
  {
    id: 'remember',
    statement: 'No name on the work.',
    consequence: "Every job you finish advertises someone else's brand, or nobody's.",
  },
];

/* Oldest first; `row` is the headline the card lights (an index into ROWS). */
const NOTES = [
  { id: 'a', app: 'call', title: 'Missed call', line: '(xxx) xxx-xxxx', time: '2:14 PM', at: 800, row: 2 },
  { id: 'b', app: 'call', title: 'Missed call', line: '(xxx) xxx-xxxx', time: '2:31 PM', at: 3200 },
  { id: 'c', app: 'ads', title: 'Google Ads', line: 'Your card was charged $2,400.00', time: '9:00 AM', at: 5800, row: 1 },
  {
    id: 'd',
    app: 'review',
    title: 'Reviews',
    line: "New review: 'Couldn't find your website, went with someone else.'",
    time: 'Yesterday',
    at: 8400,
    row: 0,
  },
  {
    id: 'e',
    app: 'other',
    title: 'Someone else.',
    line: "Thanks for the referral, we've booked them in.",
    time: 'Yesterday',
    at: 11000,
    row: 3,
  },
  { id: 'f', app: 'call', title: 'Missed call', line: '(xxx) xxx-xxxx', time: 'Now', at: 13600 },
];
const LAND = 520;
const GAP = 6;
const SHAKE_AT = 13600;
const SHAKE = 420;
const TOTAL = 16000;

/* When each headline lights: its notification's landing. */
const LIGHT = ROWS.map((_, n) => {
  const note = NOTES.find((x) => x.row === n);
  return note ? note.at : 0;
});

function Disc({ app }) {
  return (
    <span className={`ls-disc ls-disc--${app}`} aria-hidden="true">
      {app === 'call' ? <span className="ls-glyph ls-glyph--phone" /> : null}
      {app === 'ads' ? <span className="ls-g">G</span> : null}
      {app === 'review' ? <span className="ls-glyph ls-glyph--star" /> : null}
    </span>
  );
}

export default function CostScenes() {
  const ref = useRef(null);
  const stackRef = useRef(null);
  /* Card heights, newest first, as the screen shows them. */
  const heights = useRef(NOTES.map(() => 60));
  const [t, seek, , leave] = useLoop(ref, TOTAL);

  useEffect(() => {
    const el = stackRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const read = () => {
      heights.current = [...el.children].map((c) => c.offsetHeight);
    };
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const shown = [...NOTES].reverse();
  const resting = t >= TOTAL;
  const p = shown.map((n) => (resting ? 1 : step(t, n.at, LAND)));
  const offsets = shown.map((_, i) => {
    let y = 0;
    for (let j = 0; j < i; j += 1) y -= (1 - p[j]) * (heights.current[j] + GAP);
    return y - (1 - p[i]) * (heights.current[i] + GAP);
  });
  /* The 2px shake as the last call arrives. */
  const e = t - SHAKE_AT;
  const sk = !resting && e >= 0 && e < SHAKE ? Math.sin((e / SHAKE) * Math.PI * 6) * 2 * (1 - e / SHAKE) : 0;
  const lit = ROWS.map((_, n) => resting || t >= LIGHT[n]);

  const jump = (n) => {
    if (prefersReduced()) {
      seek(TOTAL);
      return;
    }
    seek(Math.max(0, LIGHT[n] - 300));
  };

  return (
    <section className="vt st-sec st--dark cs" aria-labelledby="kc-h" data-artifact="CostScenes" data-device="lock screen">
      <div className="st-in">
        <h2 className="st-h" id="kc-h">
          What it costs you
        </h2>
        <div className="cs__body" ref={ref} {...leaving(leave)}>
          <div className="cs-panel ls" aria-hidden="true">
            <span className="ls-surface" />
            <div className="ls-lie">
              <span className="ls-shadow" />
              <div className="ls-shake" style={sk ? { transform: `translateX(${sk.toFixed(2)}px)` } : undefined}>
                <PhoneShell width={300} screen="transparent" shadow={false} className="ls-phone">
                  <div className="ls-screen">
                    <p className="ls-time">2:14</p>
                    <p className="ls-day">Tuesday</p>
                    <ol className="ls-stack ls-fade" ref={stackRef}>
                      {shown.map((n, i) => (
                        <li
                          className="ls-card"
                          key={n.id}
                          style={Math.abs(offsets[i]) < 0.5 ? undefined : { transform: `translateY(${offsets[i].toFixed(1)}px)` }}
                        >
                          <Disc app={n.app} />
                          <span className="ls-card__body">
                            <span className="ls-card__row">
                              <span className="ls-card__t">{n.title}</span>
                              <span className="ls-card__time">{n.time}</span>
                            </span>
                            <span className="ls-card__l">{n.line}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </PhoneShell>
              </div>
            </div>
            <p className="ls-cap">Illustrative notifications.</p>
          </div>
          <ol className="cs__rows">
            {ROWS.map(({ id, statement, consequence }, n) => (
              <li className="cs__row" key={id} data-on={lit[n] ? 'true' : 'false'}>
                <h3 className="cs__t">
                  <button type="button" className="cs__btn" aria-pressed={lit[n]} onClick={() => jump(n)}>
                    {statement}
                  </button>
                </h3>
                <p className="cs__b">{consequence}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
