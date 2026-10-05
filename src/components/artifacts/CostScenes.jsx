import React, { useRef } from 'react';
import { useLoop, step, lin, leaving } from './loop.js';
import { prefersReduced } from '../site/useOnce.js';
import PhoneShell from './PhoneShell.jsx';
import StepStrip from './StepStrip.jsx';
import './artifacts.css';
import './cost-scenes.css';

/* HOME, WHAT IT COSTS YOU: THE FOUR SCENES (the final artifacts pass,
   2026-10-03, the founder). It replaced KineticCosts' four stacked
   headlines.

   PRESENTATION-GRADE, 2026-10-06 (the founder's home cost scenes brief,
   final13). A 620 x 440 stage from 1024 (full width and 360 tall below),
   a 1px steel hairline and a 24px inner margin, playing four scenes, 6s
   each, sliding 240ms sideways from one to the next; at the right the four
   headlines. The scenes are CSS mockups (BUILD-LAW Real over drawn, as
   amended): a results page in a phone, a paper statement, a call screen in
   a phone, two shop signs over a work invoice.

     1  Not found.     A phone, a white results page: the search bar, a map
                       block with three pins, three results ("Someone
                       else.", favicon discs in Google's blue, red and
                       green), then a fast scroll through rows four to nine,
                       greyer, to row ten: "Your business", "Page 2". "10th"
                       lands beside the phone in yellow.
     2  Ad spend.      A paper statement printing row by row to "Cost per
                       lead" and a red "?" stamped in with an overshoot, and
                       a cream slip, "Invoice, agency fee, $800". The
                       figures are labelled "Illustrative figures."
     3  Missed call.   A phone ringing (the discs pulse), the screen dims, a
                       "Missed call, 2:14 PM" banner slides down, then the
                       screen crossfades to the results and a tap lands on
                       the first "Someone else."
     4  No name.       A grey shop sign with no name and a work invoice
                       whose "Work by" line stays blank, its dotted
                       underline drawing; then a coral sign slides in behind
                       carrying "Someone else.", and lights.

   THE HEADLINES. The one on stage is bone (16.32:1); the other three are
   STEEL-DARK (5.66:1 on the base), not steel-lift. They were steel-lift
   (7.55), and the active state worked, but bone against steel-lift is too
   close to read as a state: in the final12 frames all four looked alike.
   Clicking a headline jumps to its scene.

   THE STEP STRIP under the stage (the clarity pass): Not found, Spend,
   Missed, Unbranded, the scene playing in yellow, fully lit at rest.

   The stage is a picture of what the headline says, so it is aria-hidden;
   the headlines and lines are the content. The loop (loop.js): rest full,
   start soft. First paint and reduced motion show scene 1's held frame;
   reduced motion shows each scene's held frame on a click; off screen the
   held frame of the scene it was in. */
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
const BEATS = ['Not found', 'Spend', 'Missed', 'Unbranded'];

const SCENE = 6000;
const TOTAL = SCENE * ROWS.length;
const SLIDE = 240;
const HELD = SCENE - 1;

/* A masked reveal from the left (clip-path), 0 to 1. */
const wipe = (k) => ({ clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` });
const fall = (k, px) => ({ transform: `translateY(${(1 - k) * px}px)` });

/* ---- The results page, shared by scenes 1 and 3 ------------------------ */
const FAVICONS = ['#4285F4', '#EA4335', '#34A853'];
/* Rows are 78 tall; the first starts 154 down the page (bar 40, map 90,
   two 12px gaps), so row ten is 856 down. */
const ROW_H = 78;
const FIRST_ROW = 154;

function Stars({ grey = false }) {
  return (
    <span className={`cs-stars${grey ? ' cs-stars--grey' : ''}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((n) => (
        <span className="cs-star" key={n} />
      ))}
    </span>
  );
}

function ResultsPage({ query, typed, scroll = 0, rowsIn = () => 1, mapIn = 1, tenth = true }) {
  return (
    <div className="cs-page" style={{ transform: `translateY(${-scroll}px)` }}>
      <p className="cs-gbar">
        <span>{typed ?? query}</span>
        {typed !== undefined && typed.length < query.length ? <span className="cs-caret cs-caret--ink" /> : null}
      </p>
      <div className="cs-map" style={wipe(mapIn)}>
        <span className="cs-pin" style={{ left: '22%', top: '34%' }} />
        <span className="cs-pin" style={{ left: '56%', top: '58%' }} />
        <span className="cs-pin" style={{ left: '76%', top: '26%' }} />
      </div>
      {Array.from({ length: 9 }, (_, n) => {
        const top = n < 3;
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div className={`cs-g${top ? '' : ' cs-g--grey'}`} key={n} style={top ? wipe(rowsIn(n)) : undefined}>
            <span className="cs-g__u">
              <span className="cs-g__fav" style={top ? { background: FAVICONS[n] } : undefined} />
              someoneelse.com
            </span>
            <span className="cs-g__t">Someone else.</span>
            <span className="cs-g__d">
              Open now. <Stars grey={!top} />
            </span>
          </div>
        );
      })}
      {tenth ? (
        <div className="cs-g cs-g--you">
          <span className="cs-g__t">Your business</span>
          <span className="cs-g__d">Page 2</span>
        </div>
      ) : null}
    </div>
  );
}

/* ---- 1. Not found ---------------------------------------------------- */
function SceneFind({ lt }) {
  const q = 'plumber near me';
  const typed = q.slice(0, Math.round(lin(lt, 300, 800) * q.length));
  /* The fast scroll: row ten comes to 120 down the screen. */
  const scroll = step(lt, 2700, 900) * (FIRST_ROW + 9 * ROW_H - 120);
  return (
    <div className="cs-s cs1">
      <PhoneShell width={260} screen="#ffffff" shadow={false} className="cs-phone">
        <ResultsPage
          query={q}
          typed={typed}
          scroll={scroll}
          mapIn={step(lt, 1100, 400)}
          rowsIn={(n) => step(lt, 1300 + n * 200, 400)}
        />
      </PhoneShell>
      <span className="cs-rank" style={{ clipPath: `inset(${(1 - step(lt, 3700, 400)) * 100}% 0 0 0)` }}>
        10th
      </span>
    </div>
  );
}

/* ---- 2. Ad spend without a cost per lead ----------------------------- */
const STATEMENT = [
  ['Google Ads', '$1,400'],
  ['Meta Ads', '$1,000'],
  null,
  ['Total spend', '$2,400'],
  null,
  ['Leads', '14'],
];

function SceneSpend({ lt }) {
  const at = (n) => 300 + n * 300;
  const pStamp = lin(lt, at(STATEMENT.length) + 400, 300);
  /* The stamp: 1.6 down past 1 to 0.92, then back to 1. */
  const stamp = pStamp < 0.7 ? 1.6 - (0.68 * pStamp) / 0.7 : 0.92 + (0.08 * (pStamp - 0.7)) / 0.3;
  return (
    <div className="cs-s cs2">
      <div className="cs-paper cs-stmt" style={fall(step(lt, 0, 400), 24)}>
        <p className="cs-stmt__h">Statement</p>
        {STATEMENT.map((row, n) =>
          row ? (
            <p className="cs-stmt__r" key={row[0]} style={wipe(step(lt, at(n), 300))}>
              <span>{row[0]}</span>
              <span>{row[1]}</span>
            </p>
          ) : (
            // eslint-disable-next-line react/no-array-index-key
            <span className="cs-stmt__rule" key={`rule-${n}`} style={{ transform: `scaleX(${step(lt, at(n), 300)})` }} />
          )
        )}
        <p className="cs-stmt__r cs-stmt__r--q" style={wipe(step(lt, at(STATEMENT.length), 300))}>
          <span>Cost per lead</span>
          <span className="cs-stamp" style={{ transform: `rotate(-10deg) scale(${pStamp > 0 ? stamp : 0})` }}>
            ?
          </span>
        </p>
      </div>
      <p className="cs-slip" style={{ transform: `translateX(${(1 - step(lt, at(STATEMENT.length) + 1100, 500)) * 140}%) rotate(4deg)` }}>
        Invoice, agency fee, $800
      </p>
      <p className="cs-illus">Illustrative figures.</p>
    </div>
  );
}

/* ---- 3. The missed call ---------------------------------------------- */
function SceneMissed({ lt }) {
  /* Rings for 2s: the discs pulse three times. */
  const ring = lt > 300 && lt < 2300 ? 1 + 0.08 * Math.abs(Math.sin(((lt - 300) / 2000) * Math.PI * 3)) : 1;
  const dim = step(lt, 2300, 400);
  const banner = step(lt, 2600, 400);
  const toResults = step(lt, 3700, 400);
  const tap = lin(lt, 4500, 600);
  return (
    <div className="cs-s cs3">
      <PhoneShell width={260} screen="#16171a" shadow={false} className="cs-phone">
        {/* Each layer is rendered only while it shows, so the held frame
            carries no text at opacity 0. */}
        {toResults < 1 ? (
        <div className="cs-callui" style={{ opacity: 1 - toResults }}>
          <span className="cs-callui__k">Incoming call</span>
          <span className="cs-callui__disc">KM</span>
          <span className="cs-callui__n">(xxx) xxx-xxxx</span>
          <span className="cs-callui__acts">
            <span className="cs-callui__act">
              <span className="cs-callui__b cs-callui__b--no" style={{ transform: `scale(${ring})` }} />
              Decline
            </span>
            <span className="cs-callui__act">
              <span className="cs-callui__b cs-callui__b--yes" style={{ transform: `scale(${ring})` }} />
              Accept
            </span>
          </span>
          <span className="cs-callui__dim" style={{ opacity: dim * 0.6 }} />
          <span className="cs-banner" style={{ transform: `translateY(${(1 - banner) * -140}%)` }}>
            Missed call, 2:14 PM
          </span>
        </div>
        ) : null}
        {toResults > 0 ? (
        <div className="cs-callres" style={{ opacity: toResults }}>
          <ResultsPage query="plumber near me" tenth={false} />
          <span
            className="cs-ripple"
            style={{ opacity: tap > 0 && tap < 1 ? 0.4 * (1 - tap) : 0, transform: `scale(${0.2 + tap * 1.4})` }}
          />
        </div>
        ) : null}
      </PhoneShell>
    </div>
  );
}

/* ---- 4. No name on the work ------------------------------------------ */
function SceneName({ lt }) {
  const pSign = step(lt, 200, 500);
  const pInv = step(lt, 900, 500);
  const pLine = step(lt, 1500, 800);
  const pOther = step(lt, 2600, 600);
  const sheen = lin(lt, 3300, 900);
  return (
    <div className="cs-s cs4">
      <div className="cs-signs">
        <div className="cs-sign2" style={{ transform: `translateX(${(1 - pOther) * 120}%)` }}>
          <span className="cs-sign2__shadow" style={{ opacity: pOther }} />
          <span className="cs-sign2__face">
            <span className="cs-sign2__w">Someone else.</span>
            <span className="cs-sheen" style={{ transform: `translateX(${-120 + sheen * 240}%)` }} />
          </span>
        </div>
        <div className="cs-sign1" style={fall(pSign, -40)}>
          <span className="cs-sign1__shadow" style={{ opacity: pSign }} />
          <span className="cs-sign1__face" />
        </div>
      </div>
      <div className="cs-paper cs-inv" style={fall(pInv, 60)}>
        <p className="cs-inv__k">Work invoice</p>
        <p className="cs-inv__t">Job complete. Kitchen remodel.</p>
        <p className="cs-inv__by">
          <span>Work by</span>
          <span className="cs-inv__blank">
            <span className="cs-inv__dots" style={{ transform: `scaleX(${pLine})` }} />
          </span>
        </p>
      </div>
    </div>
  );
}

const SCENES = [SceneFind, SceneSpend, SceneMissed, SceneName];

export default function CostScenes() {
  const ref = useRef(null);
  /* At rest each scene shows its own held frame: the one the playhead is
     in when the stage leaves the screen, scene 1's on the first paint. */
  const [t, seek, , leave] = useLoop(ref, TOTAL, {
    start: HELD,
    first: SLIDE,
    rest: (at) => Math.min(ROWS.length - 1, Math.floor(at / SCENE)) * SCENE + HELD,
  });
  const i = Math.min(ROWS.length - 1, Math.floor(t / SCENE));
  const lt = t - i * SCENE;
  const prev = (i + ROWS.length - 1) % ROWS.length;
  const k = step(lt, 0, SLIDE);
  /* At rest the playhead sits exactly on a held frame (or the end), and
     the strip is fully lit; while a play runs it marks the scene. */
  const resting = t === TOTAL || lt === HELD;

  return (
    <section className="vt st-sec st--dark cs" aria-labelledby="kc-h" data-artifact="CostScenes" data-device="stage">
      <div className="st-in">
        <h2 className="st-h" id="kc-h">
          What it costs you
        </h2>
        {/* THE LEAD, the clarity pass (2026-10-06): it hands off to the
            next section. The founder's ruling: no stage title on home, the
            lead says it once. */}
        <p className="cs-lead">Four ways a good business loses customers it never hears from.</p>
        <div className="cs__body" ref={ref} {...leaving(leave)}>
          <div className="cs-stagecol">
            <div className="cs-panel" aria-hidden="true">
              {SCENES.map((Scene, n) => {
                let x = 100;
                if (n === i) x = (1 - k) * 100;
                else if (n === prev && k < 1) x = -k * 100;
                return (
                  <div className="cs-slot" key={ROWS[n].id} style={{ transform: `translateX(${x}%)` }}>
                    <Scene lt={n === i ? lt : HELD} />
                  </div>
                );
              })}
            </div>
            <StepStrip steps={BEATS} at={resting ? null : i} className="cs-strip" />
          </div>
          <ol className="cs__rows">
            {ROWS.map(({ id, statement, consequence }, n) => (
              <li className="cs__row" key={id} data-on={n === i ? 'true' : 'false'}>
                <h3 className="cs__t">
                  <button type="button" className="cs__btn" aria-pressed={n === i} onClick={() => seek(n * SCENE + (prefersReduced() ? HELD : SLIDE))}>
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
