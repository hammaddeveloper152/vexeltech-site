import React, { useRef } from 'react';
import { THREAD } from '../../content/automation.js';
import { useLoop, step, leaving } from '../artifacts/loop.js';
import PhoneShell from '../artifacts/PhoneShell.jsx';
import './proof.css';

/* SERVICES, AUTOMATION: THE MISSED CALL (rebuilt 2026-10-06, the founder's
   quality pass). Three objects on the cream band, 32px apart from 1024 and
   stacked below, the phone first:

     the phone     a PhoneShell 320 wide, a white screen: the number in a
                   grey header, the missed-call line, then the three
                   bubbles as built (sent in the discipline's colour with
                   asphalt words, received grey), each after a typing
                   indicator in its own place
     the calendar  a 300 x 300 white card with a paper gradient and two
                   shadows: a month grid in mono 11px with no month name or
                   year (a picture of a calendar, not a dated claim), the
                   booking's week highlighted, and under it Thursday's
                   10:00 slot, which fills with the discipline's colour and
                   "Kitchen quote, 10:00" when the thread reaches the
                   booking, and a check draws
     the receipt   260 wide, white, its bottom edge torn (a radial-gradient
                   mask), four mono rows: the PAID stamp lands on the third
                   with a 60ms overshoot, and five stars fill on the fourth

   The final9 system log is gone: the calendar and the receipt carry what
   it listed. The words are content/automation.js's.

   ARTIFACTS REST FULL, START SOFT (loop.js): the finished stage on the
   first paint, off screen and under reduced motion; a play only at half
   in view, opening with the 400ms crossfade to the first frame (what moves
   is the `tb-x` layer; the phone, the card and the paper stay), then the
   build, then 6s held. Motion is transform, clip-path and
   stroke-dashoffset; nothing in the build fades.

   The drawn thread is a founder-ruled exception to BUILD-LAW "Real over
   drawn" until a real capture of the text-back replaces it. */

/* When each bubble lands; its typing indicator shows for the 600ms before
   (the system line has none). */
const AT = [300, 1300, 2800, 3900];
const TYPING = 600;
const T_BOOK = 4500;
const T_CHECK = T_BOOK + 400;
const T_RCPT = 5400;
const ROW_GAP = 300;
const T_STAMP = T_RCPT + 2 * ROW_GAP + 300;
const T_REVIEW = T_STAMP + 500;
const T_STARS = T_REVIEW + 300;
const STAR_GAP = 150;
const TOTAL = T_STARS + 4 * STAR_GAP + 200 + 500;


/* A generic month: 30 days from a Wednesday, five weeks. The booking's
   week is the third, its Thursday the 16th. */
const OFFSET = 2;
const DAYS_IN = 30;
const WEEK = 2;
const THU = 3;
const CELLS = Array.from({ length: 35 }, (_, i) => {
  const d = i - OFFSET + 1;
  return d >= 1 && d <= DAYS_IN ? d : null;
});

/* In by a rise and a clip from below; nothing at rest is clipped. */
const arrive = (p, rise = 8) =>
  p >= 1 ? undefined : { clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`, transform: `translateY(${(1 - p) * rise}px)` };

/* The stamp: from 1.5 to 0.94 over 180ms, then the 60ms overshoot back
   to 1. */
function stampScale(t) {
  if (t < T_STAMP) return 0;
  const e = t - T_STAMP;
  if (e < 180) return 1.5 - 0.56 * step(e, 0, 180);
  if (e < 240) return 0.94 + 0.06 * ((e - 180) / 60);
  return 1;
}

export default function TextBackBand() {
  const ref = useRef(null);
  const [t, , , leave] = useLoop(ref, TOTAL);
  const { lines, calendar, receipt } = THREAD;
  const pBook = step(t, T_BOOK, 400);
  const pCheck = step(t, T_CHECK, 300);
  const stamp = stampScale(t);

  return (
    <figure className="tb" data-artifact="TextBackBand" {...leaving(leave)}>
      <div className="tb__stage" ref={ref}>
        <PhoneShell width={320} screen="#ffffff" className="tb__phone">
          <div className="tb__screen">
            <p className="tb__status" aria-hidden="true">
              9:41
            </p>
            <p className="tb__head">{THREAD.number}</p>
            <ol className="tb__thread">
              {lines.map((line, i) => {
                const typingK =
                  line.kind === 'system' ? 0 : step(t, AT[i] - TYPING, 160) * (1 - step(t, AT[i] - 160, 160));
                return (
                  <li key={i} className={`tb__msg tb__msg--${line.kind}`}>
                    <span className="tb__text tb-x" style={arrive(step(t, AT[i], 400))}>
                      {line.text}
                    </span>
                    {line.kind === 'system' ? null : (
                      <span className="tb__typing" aria-hidden="true" style={{ transform: `scale(${typingK})` }}>
                        <span />
                        <span />
                        <span />
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </PhoneShell>

        <div className="tb__cal" role="group" aria-label="Calendar">
          <ol className="tb__cal-grid" aria-hidden="true">
            {calendar.days.map((d) => (
              <li className="tb__cal-dh" key={d}>
                {d}
              </li>
            ))}
            {CELLS.map((d, i) => {
              const row = Math.floor(i / 7);
              const booked = row === WEEK && i % 7 === THU;
              return (
                <li
                  className={`tb__cal-d${row === WEEK ? ' tb__cal-d--wk' : ''}${booked ? ' tb__cal-d--bk' : ''}`}
                  key={i}
                >
                  {booked ? <span className="tb__cal-dot tb-x" style={{ transform: `scale(${pBook})` }} /> : null}
                  <span className="tb__cal-n">{d ?? ''}</span>
                </li>
              );
            })}
          </ol>
          <div className="tb__slot">
            <span className="tb__slot-t">{calendar.slot}</span>
            <span className="tb__slot-box">
              <span
                className="tb__book tb-x"
                style={pBook >= 1 ? undefined : { clipPath: `inset(0 ${(1 - pBook) * 100}% 0 0)` }}
              >
                <svg className="tb__check" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M3 8.5 L6.5 12 L13 4.5" pathLength="100" style={{ strokeDashoffset: 100 * (1 - pCheck) }} />
                </svg>
                <span>{calendar.booking}</span>
              </span>
            </span>
          </div>
        </div>

        <div className="tb__rc-w">
          <ol className="tb__rc" aria-label="Receipt">
            {receipt.map((r, i) => {
              const at = r.stars ? T_REVIEW : T_RCPT + i * ROW_GAP;
              return (
                <li className="tb__rc-row" key={r.label}>
                  <span className="tb__rc-in tb-x" style={arrive(step(t, at, 300), 6)}>
                    <span className="tb__rc-l">{r.label}</span>
                    <span className="tb__rc-t">{r.time}</span>
                  </span>
                  {r.stamp ? (
                    <span className="tb__stamp tb-x" style={{ transform: `rotate(-12deg) scale(${stamp})` }}>
                      {r.stamp}
                    </span>
                  ) : null}
                  {r.stars ? (
                    <span className="tb__stars" role="img" aria-label={`${r.stars} stars`}>
                      {Array.from({ length: r.stars }, (_, s) => {
                        const k = step(t, T_STARS + s * STAR_GAP, 200);
                        return (
                          <span className="tb__star" key={s}>
                            <span
                              className="tb__star-f tb-x"
                              style={k >= 1 ? undefined : { clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` }}
                            />
                          </span>
                        );
                      })}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <figcaption className="tb__cap">{THREAD.caption}</figcaption>
    </figure>
  );
}
