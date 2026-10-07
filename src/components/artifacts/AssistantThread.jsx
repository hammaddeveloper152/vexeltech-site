import React, { useRef } from 'react';
import { useLoop, leaving } from './loop.js';
import './assistant-thread.css';

/* SERVICES, AUTOMATION: "YOUR ASSISTANT TOOK THE CALL." (final30,
   2026-10-07, the founder's frame A4, reference/final-frames/
   frame_A4_automation). It replaced the missed call's phone, calendar and
   receipt (TextBackBand, deleted with its styles and content/automation.js).
   The band is the cream paper, #F4EFE6 ruled (services.css).

     left    300 at 1280: the eyebrow, "You had gone home. Your assistant
             took the call." (not a heading: the band's h2 is below the
             stage), one paragraph and three mono lines
     right   the thread, 760 wide: a 2px rail at 14% black, a 12px dot per
             event (hollow for the caller, mint for the assistant, ink for
             the system) and eight events, each under an 11px mono stamp

   EVERYTHING ON IT IS AN EXAMPLE of what the assistant is set up to do,
   and the line under the thread says so (BUILD-LAW Truth). The number is
   the demo's (555) 010 2200, as on the branding desk.

   THE PLAY (BUILD-LAW Motion, artifacts rest full; loop.js). At rest the
   thread is complete, on the first paint, off screen and under reduced
   motion. At half in view: the 400ms crossfade, then the thread writes
   itself, one event every 650ms, each rising 8px into place as its dot
   fills; the booked slot drops into the planner; the receipt's rows print
   250ms apart; the PAID stamp lands last, 1.15 to 1 over 150ms. Then the
   6s hold. The sequence as briefed takes 5.9s, so a play begins every
   12.3s, not the brief's 11 (reported). Transform and opacity only. */

const EVENT = 650;
const RISE = 300;
const ROW = 250;
const SLOT_AT = 6 * EVENT + 250;
const ROWS_AT = 7 * EVENT + 150;
const STAMP_AT = ROWS_AT + 4 * ROW;
const TOTAL = STAMP_AT + 200;

const clamp = (x) => Math.max(0, Math.min(1, x));

const RECEIPT = [
  ['Quote sent', 'Thu 11:30'],
  ['Invoice sent', 'Fri 9:00'],
  ['Paid', 'Fri 14:12', true],
  ['Review request', 'Sat 10:00'],
];

/* The planner: five days, two rows of slots; Thursday's two are the booking. */
const SLOTS = ['busy', '', 'busy', 'new', '', '', 'busy', '', 'busy'];

export default function AssistantThread() {
  const ref = useRef(null);
  const [t, , , leave] = useLoop(ref, TOTAL);

  /* Event k's progress, 0 to 1, and its style: rising 8px into place. */
  const p = (k) => clamp((t - k * EVENT) / RISE);
  const rise = (k) => ({ opacity: p(k), transform: `translateY(${(1 - p(k)) * 8}px)` });
  const slot = clamp((t - SLOT_AT) / RISE);
  const row = (i) => clamp((t - (ROWS_AT + i * ROW)) / 150);
  const stamp = clamp((t - STAMP_AT) / 150);

  const events = [
    {
      who: 'sys',
      stamp: '8:47 PM · incoming call · answered in 1 ring',
      body: (
        <div className="at__call">
          <span className="at__ring" aria-hidden="true" />
          <span>
            <b>Answered by your assistant</b>
            <small>(555) 010 2200 · 1 min 52 s</small>
          </span>
        </div>
      ),
      dot: 'caller',
    },
    { who: 'us', stamp: 'your assistant', body: <p className="at__b at__b--us">Your Business, good evening. How can I help?</p> },
    {
      who: 'them',
      stamp: 'caller',
      body: <p className="at__b at__b--them">Hi, I need a quote for a kitchen remodel. Can someone come out this week?</p>,
    },
    {
      who: 'us',
      stamp: 'your assistant',
      body: (
        <p className="at__b at__b--us">We can. Thursday at 10 is open, or Friday at 2. Quotes are free and take about forty minutes.</p>
      ),
    },
    { who: 'them', stamp: 'caller', body: <p className="at__b at__b--them">Thursday at 10 is perfect.</p> },
    {
      who: 'us',
      stamp: 'your assistant',
      body: (
        <p className="at__b at__b--us">
          Booked. I have texted you the confirmation and the address to send photos to. Anything else tonight?
        </p>
      ),
    },
    {
      who: 'sys',
      stamp: '8:49 PM · booked, and a summary sent to you',
      body: (
        <div className="at__attach">
          <div className="at__card at__plan">
            <p className="at__hd">
              <span>Your calendar</span>
              <span>This week</span>
            </p>
            <div className="at__days">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="at__slots">
              {SLOTS.map((s, i) =>
                s === 'new' ? (
                  // eslint-disable-next-line react/no-array-index-key
                  <span
                    className="at__slot at__slot--new"
                    key={i}
                    style={{ opacity: slot, transform: `translateY(${(1 - slot) * -14}px) rotate(-2deg)` }}
                  >
                    Kitchen quote
                    <br />
                    Thu 10:00
                  </span>
                ) : (
                  // eslint-disable-next-line react/no-array-index-key
                  <span className={`at__slot${s ? ` at__slot--${s}` : ''}`} key={i} />
                )
              )}
            </div>
          </div>
          <p className="at__sys">
            To you: &ldquo;New quote booked, Thu 10:00, kitchen remodel, caller wants it done before December.&rdquo; Reminder
            set Wed 6 PM.
          </p>
        </div>
      ),
    },
    {
      who: 'sys',
      stamp: 'Thu to Sat · the paperwork',
      body: (
        <div className="at__card at__tape">
          {RECEIPT.map(([what, when, paid], i) => (
            <p className="at__tr" key={what} style={{ opacity: row(i) }}>
              <span>
                {what}
                {paid ? (
                  <span className="at__paid" style={{ opacity: stamp, transform: `rotate(-6deg) scale(${1.15 - 0.15 * stamp})` }}>
                    PAID
                  </span>
                ) : null}
              </span>
              <span>{when}</span>
            </p>
          ))}
        </div>
      ),
    },
  ];

  return (
    <figure className="at" data-artifact="AssistantThread" data-device="thread">
      <div className="at__stage" ref={ref} {...leaving(leave)}>
        <div className="at__side">
          <p className="at__eyebrow">Tuesday · 8:47 PM · after hours</p>
          <p className="at__head">You had gone home. Your assistant took the call.</p>
          <p className="at__p">
            An AI receptionist that answers in your name, books into your calendar and hands you the summary. Then the
            quote, the invoice, the reminder and the review request send themselves.
          </p>
          <p className="at__eyebrow at__terms">
            Trained on your services and prices.
            <br />
            Your calendar, your invoicing.
            <br />
            Set up in about two weeks.
          </p>
        </div>

        <ol className="at__thread">
          {events.map((e, k) => (
            // eslint-disable-next-line react/no-array-index-key
            <li className={`at__item at__item--${e.dot || e.who}`} key={k} style={rise(k)}>
              <span className="at__dot" aria-hidden="true" />
              <p className="at__stamp">{e.stamp}</p>
              {e.body}
            </li>
          ))}
        </ol>
      </div>
      <p className="at__note">Illustration. The conversation is an example of what your assistant is set up to do.</p>
      <figcaption className="at__cap">
        <span>The phone was answered, the job was booked and the paperwork followed. You read about it in the morning.</span>
        <span>Automation per workflow</span>
      </figcaption>
    </figure>
  );
}
