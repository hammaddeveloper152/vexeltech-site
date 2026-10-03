import React, { useRef } from 'react';
import { useLoop, step, lin } from './loop.js';
import { prefersReduced } from '../site/useOnce.js';
import './artifacts.css';

/* HOME, WHAT IT COSTS YOU: THE FOUR SCENES (the final artifacts pass,
   2026-10-03, the founder). It replaced KineticCosts' four stacked
   headlines.

   From 1024 a two-column stage: at the left a 560 x 400 dark panel that
   plays four scenes, 4s each, sliding 240ms sideways from one to the next;
   at the right the four headlines at 32px with their lines at 16px. The
   one on stage is bone, the others steel-lift (STEEL-LIFT, NOT STEEL: steel
   is 2.4:1 on the dark ground and fails the 4.5:1 check, the same change
   KineticCosts made). Clicking a headline jumps to its scene. Below 1024
   the panel runs the full width, 300 tall, with the headlines under it.

   The panel is a picture of what the headline says, so it is aria-hidden;
   the headlines and lines are the content, VEXELTECH-COPY.md's verbatim.
   Every word inside the panel is the founder's, from the brief.

   The loop (loop.js): first paint and reduced motion show scene 1's held
   frame; reduced motion shows each scene's held frame on a click. */
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

const SCENE = 4000;
const TOTAL = SCENE * ROWS.length;
const SLIDE = 240;
const HELD = SCENE - 1;

/* A masked reveal from the left (clip-path, BUILD-LAW Motion's named
   exception), 0 to 1. */
const wipe = (k) => ({ clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` });

function SceneFind({ lt }) {
  const q = 'bookkeeper near me';
  const typed = q.slice(0, Math.round(lin(lt, 300, 1000) * q.length));
  return (
    <div className="cs-s cs-find">
      <p className="cs-field">
        <span>{typed}</span>
        <span className="cs-caret" />
      </p>
      <ol className="cs-results">
        {[0, 1, 2].map((i) => (
          <li className="cs-res" key={i} style={wipe(step(lt, 1500 + i * 300, 400))}>
            <span className="cs-res__n">{i + 1}</span>
            <span className="cs-res__w">
              <span className="cs-res__t">Someone else.</span>
              <span className="cs-res__d">Open now. 4.8 stars.</span>
            </span>
          </li>
        ))}
        <li className="cs-res cs-res--you" style={{ transform: `translateX(${(1 - step(lt, 2600, 500)) * 110}%)` }}>
          <span className="cs-res__n" />
          <span className="cs-res__w">
            <span className="cs-res__t cs-y">You.</span>
            <span className="cs-res__d">Page two.</span>
          </span>
        </li>
      </ol>
    </div>
  );
}

function SceneSpend({ lt }) {
  const spend = Math.round(lin(lt, 300, 1800) * 2400);
  const leads = Math.round(lin(lt, 2200, 700) * 14);
  const p = step(lt, 3100, 500, (x) => x);
  const pulse = 1 + 0.4 * Math.sin(Math.PI * p);
  return (
    <div className="cs-s cs-spend">
      <dl className="cs-ledger">
        <div className="cs-led">
          <dt>Spend this month</dt>
          <dd>${spend.toLocaleString('en-US')}</dd>
        </div>
        <div className="cs-led">
          <dt>Leads</dt>
          <dd>{leads}</dd>
        </div>
        <div className="cs-led">
          <dt>Cost per lead</dt>
          <dd>
            <span className="cs-q cs-y" style={{ transform: `scale(${pulse})` }}>
              ?
            </span>
          </dd>
        </div>
      </dl>
      <p className="cs-note">Illustrative figures.</p>
    </div>
  );
}

function SceneMissed({ lt }) {
  const missed = lt >= 2300;
  return (
    <div className="cs-s cs-missed">
      <div
        className={`cs-call${missed ? ' cs-call--missed' : ''}`}
        style={{ transform: `translateY(${(1 - step(lt, 300, 500)) * -140}%)` }}
      >
        <span className="cs-call__k">Incoming call</span>
        <span className="cs-call__n">(xxx) xxx-xxxx</span>
        <span className="cs-call__b">
          <span>Decline</span>
          <span>Accept</span>
        </span>
      </div>
      <p className="cs-log" style={wipe(step(lt, 2400, 400))}>
        Missed call, 2:14 PM
      </p>
      <p className="cs-log cs-log--y cs-y" style={wipe(step(lt, 3400, 400))}>
        They dialled the next number.
      </p>
    </div>
  );
}

function SceneName({ lt }) {
  return (
    <div className="cs-s cs-name">
      <div className="cs-sign" style={{ transform: `translateY(${(1 - step(lt, 300, 500)) * -160}%)` }} />
      <p className="cs-receipt">
        <span>Work completed by</span>
        <span className="cs-blank">
          <span className="cs-blank__line" style={{ transform: `scaleX(${step(lt, 1300, 1000)})` }} />
          <span className="cs-blank__mask">
            <span className="cs-nobody cs-y" style={{ transform: `translateY(${(1 - step(lt, 2500, 500)) * -110}%)` }}>
              Nobody.
            </span>
          </span>
        </span>
      </p>
    </div>
  );
}

const SCENES = [SceneFind, SceneSpend, SceneMissed, SceneName];

export default function CostScenes() {
  const ref = useRef(null);
  const [t, seek] = useLoop(ref, TOTAL, { start: HELD, first: SLIDE });
  const i = Math.min(ROWS.length - 1, Math.floor(t / SCENE));
  const lt = t - i * SCENE;
  const prev = (i + ROWS.length - 1) % ROWS.length;
  const k = step(lt, 0, SLIDE);

  return (
    <section className="vt st-sec st--dark cs" aria-labelledby="kc-h" data-artifact="CostScenes" data-device="stage">
      <div className="st-in">
        <h2 className="st-h" id="kc-h">
          What it costs you
        </h2>
        <div className="cs__body" ref={ref}>
          <div className="cs-panel" aria-hidden="true">
            {SCENES.map((Scene, n) => {
              let x = 100;
              if (n === i) x = (1 - k) * 100;
              else if (n === prev && k < 1) x = -k * 100;
              return (
                <div className="cs-slot" key={ROWS[n].id} style={{ transform: `translateX(${x}%)` }}>
                  <Scene lt={n === i ? lt : SCENE} />
                </div>
              );
            })}
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
