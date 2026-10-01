import React from 'react';
import { useReveal } from '../home/hooks.js';
import './story.css';

/* WHERE WE COME FROM, AS ONE DIAGRAM THAT GROWS (the storytelling pass,
   2026-10-01). Three stops, and over each the system as it stood: one box,
   the ads; two connected, the ads and the page after the click; four in a
   ring, the brand, the site, the ads and the follow-up. The words come from
   the stops' own lines (VEXELTECH-COPY.md V3.1, About, Where we come from).
   Since 2026-10-02 they are type alone: no boxes (see STAGES).

   It builds once when it comes into view, stage by stage: each word and
   each line rises in on the reveal curve, 70ms apart (BUILD-LAW Motion:
   opacity and transform only). Reduced motion: drawn complete, still. */
const STOPS = [
  {
    n: '01',
    t: 'The ads.',
    d: 'We started as a paid media team running Google and Meta campaigns for small businesses. Most of the spend died on the page after the click.',
  },
  {
    n: '02',
    t: 'The build.',
    d: 'So we built the pages, then the whole site, then the follow-up that runs after the call.',
  },
  {
    n: '03',
    t: 'The whole thing.',
    d: "VexelTech, 2026. Branding, website, marketing and automation from one team at flat prices, for businesses that can't carry four vendors.",
  },
];

/* THE AUDIT, 2026-10-02 (the founder): louder. The words are Clash Display
   24px (18 below 768), the lines 2px, and the diagram is HTML, not a
   drawing: a word is type, a line is a 2px rule between words, and each
   stage is centred in a plate of one height so the three line up.
   Follow-up, the last thing the story adds, is deep amber, the light
   ground's yellow (yellow itself is 1.66:1 on cream). Decorative: the
   stops' titles and lines carry what it says. */
function W({ children, acc = false, i }) {
  return (
    <span className={`gd__w st-rv${acc ? ' gd__w--acc' : ''}`} style={{ '--i': i }}>
      {children}
    </span>
  );
}

function H({ i }) {
  return <span className="gd__h st-rv" style={{ '--i': i }} />;
}

function V({ i }) {
  return <span className="gd__v st-rv" style={{ '--i': i }} />;
}

const STAGES = [
  () => (
    <div className="gd__row">
      <W i={0}>Ads</W>
    </div>
  ),
  () => (
    <div className="gd__row">
      <W i={1}>Ads</W>
      <H i={2} />
      <W i={3}>Page</W>
    </div>
  ),
  () => (
    <div className="gd__ring">
      <W i={4}>Brand</W>
      <H i={5} />
      <W i={6}>Site</W>
      <V i={8} />
      <span />
      <V i={7} />
      <W i={7}>Ads</W>
      <H i={8} />
      <W acc i={9}>
        Follow-up
      </W>
    </div>
  ),
];

export default function GrowthDiagram() {
  const [ref, revealed] = useReveal();
  return (
    <section className="vt st-sec st--light gd" aria-labelledby="gd-h">
      <div className="st-in">
        <h2 className="st-h" id="gd-h">
          Where we come from
        </h2>
        <ol className="gd__stops" ref={ref} data-revealed={revealed ? 'true' : 'false'}>
          {STOPS.map(({ n, t, d }, k) => {
            const Stage = STAGES[k];
            return (
              <li className="gd__stop" key={n}>
                <div className="gd__plate" aria-hidden="true">
                  <Stage />
                </div>
                <p className="gd__n st-mono">{n}</p>
                <h3 className="gd__t">{t}</h3>
                <p className="gd__d st-soft">{d}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
