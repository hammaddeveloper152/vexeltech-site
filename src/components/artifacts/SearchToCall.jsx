import React, { useLayoutEffect, useRef, useState } from 'react';
import { useLoop, step, lin, leaving } from './loop.js';
import './artifacts.css';

/* SERVICES, MARKETING: FROM SEARCH TO CALL, FOR THE VISITOR (2026-10-03,
   the founder; final7 replaced every client reference). It replaced the
   benchmark bars.

   One stage at the content width, 380 tall, three frames left to right
   with a 1px steel rule between; below 1024 they stack, 280 tall each
   (frame B 340, to hold the screen's words at their own sizes).

     A  Search    "plumber near me" types; a results list draws; the first
                  row is sponsored (a yellow mono "Sponsored", "Your
                  business", "yourbusiness.com", "The one line that makes
                  them call."), the other two read "Someone else."; a 12px
                  bone disc moves to the sponsored row, which flashes yellow
                  at 10% for 200ms.
     B  Landing   the sponsored title glides into frame B over a plain phone
                  screen: a 390:520 cream rectangle, radius 24, a steel
                  hairline, no bezel, no capture. On it a 12px steel status
                  line, "Your business" at 22px in black, "Open now. Serving
                  your area." at 15px, and a 48px yellow "Call now", round
                  which a yellow ring draws. The words are set at their own
                  sizes in the rectangle, never scaled (BUILD-LAW Type floor).
     C  Call      a call card rises: "Incoming call", "Your business", a
                  yellow "Accept"; 1.2s later "Answered, 0:00" counts to 0:14.

   About 7.5s, hold, rest, loop (loop.js). The URL and the steel lines on
   the dark ground are steel-lift (steel is 2.4:1 there). Under the stage,
   one line with the figures and their source. The stage is a picture,
   aria-hidden; the line under it is the content.

   FOUR FRAMES, 2026-10-05 (the founder's final9). In 2 x 2 from 1024
   (A, A2 / B, C), stacked below, so the feed card keeps its 320 x 300.

     A   the results list has three organic rows under the sponsored one,
         each "Someone else." in bone 14px, "4.8 stars. Open now." at 12px
         and a URL at 11px (steel-lift: steel is 2.4:1 on the dark frame).
     A2  Social, new: a feed card in the dark frame style. A 28px disc in
         the discipline colour and "Your business" in bone 14px, a mono
         "Sponsored", an image area in the colour at 20% with "Your
         business" at 22px, "The one line that makes them message." at
         13px and a "Send message" text button in the colour. The cursor
         disc moves to it and it flashes.
     C   after the count, a lead card slides in under the call card: mono
         "Lead logged", "Source: Google Ads", "Call, 0:14", "Cost per lead:
         $31", and under it, mono 11px, "Illustrative figure." It is the
         one invented figure on the page, and it says so.

   Each new step starts 300ms after the one before. About 10.5s, hold,
   rest, loop (loop.js). */
const QUERY = 'plumber near me';
const TOTAL = 10500;
const ORGANIC = 3;

const wipe = (k) => ({ clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` });

export default function SearchToCall() {
  const ref = useRef(null);
  const frameA = useRef(null);
  const rowT = useRef(null);
  const glide = useRef(null);
  const frameS = useRef(null);
  const sendBtn = useRef(null);
  const [t, , , leave] = useLoop(ref, TOTAL);
  const [geo, setGeo] = useState({ gx: 0, gy: 0, cx: 0, cy: 0, ox: 0, oy: 0, sx: 0, sy: 0, so: 0, sp: 0 });

  /* Where the glider starts (over the sponsored title) and where the
     cursor goes, measured from the layout, again on every resize. */
  useLayoutEffect(() => {
    const measure = () => {
      const a = frameA.current;
      const r = rowT.current;
      const g = glide.current;
      if (!a || !r || !g) return;
      const ra = a.getBoundingClientRect();
      const rr = r.getBoundingClientRect();
      /* The glider's resting box, without its transform. */
      const gx0 = g.offsetLeft;
      const gy0 = g.offsetTop;
      const host = g.offsetParent.getBoundingClientRect();
      /* The social frame's cursor: from its lower right to the button. */
      const fs = frameS.current;
      const sb = sendBtn.current;
      const rs = fs ? fs.getBoundingClientRect() : ra;
      const rb = sb ? sb.getBoundingClientRect() : rr;
      setGeo({
        gx: rr.left - host.left - gx0,
        gy: rr.top - host.top - gy0,
        cx: rr.right - ra.left - 24,
        cy: rr.top - ra.top + rr.height / 2 - 6,
        ox: ra.width - 32,
        oy: ra.height - 32,
        sx: rb.left - rs.left + rb.width / 2 - 6,
        sy: rb.top - rs.top + rb.height / 2 - 6,
        so: rs.width - 32,
        sp: rs.height - 32,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    if (document.fonts) document.fonts.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  const typed = QUERY.slice(0, Math.round(lin(t, 200, 1000) * QUERY.length));
  const pc = step(t, 1900, 600);
  const flash = t >= 2550 && t < 2750;
  /* A2, from 300ms after A's flash. */
  const pFeed = step(t, 3050, 500);
  const ps = step(t, 3850, 600);
  const sFlash = t >= 4450 && t < 4650;
  /* B and C, 300ms after A2 ends; then the lead card 300ms after the count. */
  const pg = step(t, 4950, 600);
  const pShot = step(t, 5350, 700);
  const pRing = step(t, 6250, 600);
  const pCall = step(t, 6950, 500);
  const secs = Math.round(lin(t, 8250, 1200) * 14);
  const pLead = step(t, 9750, 500);

  return (
    <figure className="sc" ref={ref} data-artifact="SearchToCall" {...leaving(leave)}>
      <div className="sc__stage" aria-hidden="true">
        <div className="sc__f sc__f--a" ref={frameA}>
          <p className="sc__k">Search</p>
          <p className="sc__field">
            <span>{typed}</span>
            <span className="cs-caret" />
          </p>
          <ol className="sc__res">
            <li className={`sc__row sc__row--ad${flash ? ' sc__row--flash' : ''}`} style={wipe(step(t, 1300, 400))}>
              <span className="sc__tag">Sponsored</span>
              <span className="sc__t" ref={rowT}>
                Your business
              </span>
              <span className="sc__u">yourbusiness.com</span>
              <span className="sc__d">The one line that makes them call.</span>
            </li>
            {Array.from({ length: ORGANIC }, (_, i) => (
              <li className="sc__row sc__row--org" key={i} style={wipe(step(t, 1450 + i * 150, 400))}>
                <span className="sc__t sc__t--other">Someone else.</span>
                <span className="sc__o">4.8 stars. Open now.</span>
                <span className="sc__u sc__u--o">someoneelse.com</span>
              </li>
            ))}
          </ol>
          <span
            className="sc__cursor"
            style={{ transform: `translate(${geo.ox + (geo.cx - geo.ox) * pc}px, ${geo.oy + (geo.cy - geo.oy) * pc}px)` }}
          />
        </div>

        <div className="sc__f sc__f--s" ref={frameS}>
          <p className="sc__k">Social</p>
          <div className="sc__clip sc__clip--s">
            <div className="sc__feed" style={{ transform: `translateY(${(1 - pFeed) * 110}%)` }}>
              <span className="sc__feed-h">
                <span className="sc__feed-av" />
                <span className="sc__feed-n">Your business</span>
                <span className="sc__feed-sp">Sponsored</span>
              </span>
              <span className="sc__feed-img">
                <span className="sc__feed-wm">Your business</span>
              </span>
              <span className="sc__feed-l">The one line that makes them message.</span>
              <span className={`sc__feed-go${sFlash ? ' sc__feed-go--flash' : ''}`} ref={sendBtn}>
                Send message
              </span>
            </div>
          </div>
          <span
            className="sc__cursor"
            style={{ transform: `translate(${geo.so + (geo.sx - geo.so) * ps}px, ${geo.sp + (geo.sy - geo.sp) * ps}px)` }}
          />
        </div>

        <div className="sc__f sc__f--b">
          <p className="sc__k">Landing</p>
          <p className="sc__t sc__glide" ref={glide} style={{
              transform: `translate(${geo.gx * (1 - pg)}px, ${geo.gy * (1 - pg)}px)`,
              /* Over the sponsored title until it leaves, drawn with it. */
              ...(t < 3000 ? wipe(step(t, 1300, 400)) : null),
            }}
          >
            Your business
          </p>
          <div className="sc__clip">
            <div className="sc__screen" style={{ transform: `translateY(${(1 - pShot) * 110}%)` }}>
              <span className="sc__status">9:41</span>
              <span className="sc__wm">Your business</span>
              <span className="sc__open">Open now. Serving your area.</span>
              <span className="sc__btn">
                Call now
                <svg className="sc__ring" focusable="false">
                  <rect rx="9" pathLength="100" style={{ strokeDashoffset: 100 * (1 - pRing) }} />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="sc__f sc__f--c">
          <p className="sc__k">Call</p>
          <div className="sc__clip sc__clip--c">
            <div className="sc__call" style={{ transform: `translateY(${(1 - pCall) * 120}%)` }}>
              <span className="sc__call-k">Incoming call</span>
              <span className="sc__call-n">Your business</span>
              <span className="sc__call-a">Accept</span>
              <span className="sc__call-s" style={wipe(step(t, 8150, 300))}>
                Answered, 0:{String(secs).padStart(2, '0')}
              </span>
            </div>
            <div className="sc__lead-w" style={{ transform: `translateY(${(1 - pLead) * 160}%)` }}>
              <div className="sc__lead">
                <span className="sc__call-k">Lead logged</span>
                <span className="sc__lead-l">Source: Google Ads</span>
                <span className="sc__lead-l">Call, 0:14</span>
                <span className="sc__lead-l">Cost per lead: $31</span>
              </div>
              <span className="sc__lead-note">Illustrative figure.</span>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="sc__cap">
        On our last reported account, a lead cost $30.11 against a $70.11 US search average (WordStream, Google Ads
        Benchmarks 2025).
      </figcaption>
    </figure>
  );
}
