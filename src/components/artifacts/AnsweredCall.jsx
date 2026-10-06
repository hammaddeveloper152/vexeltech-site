import React, { useRef } from 'react';
import { useLoop, step, lin, leaving } from './loop.js';
import PhoneShell from './PhoneShell.jsx';
import './answered-call.css';

/* HOME, THE CLOSING CALL: THE ANSWERED CALL (the founder's final14,
   2026-10-06). The phone from the hero's last shot and from What it costs
   you, finally picked up. A PhoneShell, 220 wide upright left of the
   closing call's copy from 1024 (180 above it below), on a call screen:
   "Incoming call" with the two discs pulsing, then the accept, then
   "Answered, 0:14" with the timer running from 0:00. No other text: no
   caller name.

     0 to 1500     Incoming call, the green and red discs pulse
     1500          answered: the line changes, the red disc stays to end
     1600 to 3800  the timer counts 0:00 to 0:14

   Rests full (first paint, off screen, reduced motion): "Answered, 0:14".
   The loop (loop.js): starts soft at half in view, holds 6s. The phone is
   a picture of the heading beside it, so it is aria-hidden. */
const ANSWER = 1500;
const COUNT = 1600;
const COUNT_MS = 2200;
const TOTAL = 4400;

export default function AnsweredCall() {
  const ref = useRef(null);
  const [t, , , leave] = useLoop(ref, TOTAL);
  const answered = t >= ANSWER;
  const secs = Math.round(lin(t, COUNT, COUNT_MS) * 14);
  /* The ring: both discs pulse while it is incoming. */
  const ring = answered ? 1 : 1 + 0.08 * Math.max(0, Math.sin((t / 500) * Math.PI));
  const pAns = step(t, ANSWER, 300);

  return (
    <div className="ac" ref={ref} data-artifact="AnsweredCall" aria-hidden="true" {...leaving(leave)}>
      <PhoneShell width={220} screen="#0d1220" className="ac__phone">
        <div className="ac__screen ac__fade">
          <span className="ac__disc-me" />
          <span className="ac__line">
            {answered ? (
              <span className="ac__t" style={{ transform: `translateY(${(1 - pAns) * 8}px)` }}>
                Answered, 0:{String(secs).padStart(2, '0')}
              </span>
            ) : (
              <span className="ac__t">Incoming call</span>
            )}
          </span>
          <span className="ac__acts">
            <span className="ac__b ac__b--no" style={{ transform: `scale(${ring})` }}>
              <span className="ac__glyph" />
            </span>
            {answered ? null : (
              <span className="ac__b ac__b--yes" style={{ transform: `scale(${ring})` }}>
                <span className="ac__glyph" />
              </span>
            )}
          </span>
        </div>
      </PhoneShell>
    </div>
  );
}
