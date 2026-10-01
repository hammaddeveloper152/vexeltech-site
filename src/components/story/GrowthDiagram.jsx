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

/* A word, set in mono at 14 units (14px: the drawing is never drawn larger
   than 1:1), centred on (x, y). */
function Word({ x, y, label, acc = false, i }) {
  return (
    <text className={`gd__w st-rv${acc ? ' gd__w--acc' : ''}`} x={x} y={y + 5} textAnchor="middle" style={{ '--i': i }}>
      {label}
    </text>
  );
}

function Link({ d, i }) {
  return <path className="gd__l st-rv" d={d} style={{ '--i': i }} />;
}

/* REAL OVER DRAWN, 2026-10-02 (the founder): the boxes came off; the
   diagram is the words and 1px lines between them. Each stage on the same
   244 x 122 drawing, the words on two columns (x 57 and 187) and two rows
   (y 25 and 97), the middle row (y 61) for the first two stages. The lines
   stop 8 units short of each word. Follow-up, the last thing the story
   adds, is the accent: deep amber, the light ground's yellow (yellow itself
   is 1.66:1 on cream). */
const STAGES = [
  () => <Word x={122} y={61} label="Ads" i={0} />,
  () => (
    <>
      <Word x={57} y={61} label="Ads" i={1} />
      <Link d="M79 61 L160 61" i={2} />
      <Word x={187} y={61} label="Page" i={3} />
    </>
  ),
  () => (
    <>
      <Word x={57} y={25} label="Brand" i={4} />
      <Link d="M89 25 L160 25" i={5} />
      <Word x={187} y={25} label="Site" i={6} />
      <Link d="M187 38 L187 84" i={7} />
      <Word x={187} y={97} label="Follow-up" acc i={9} />
      <Link d="M136 97 L79 97" i={8} />
      <Word x={57} y={97} label="Ads" i={7} />
      <Link d="M57 84 L57 38" i={8} />
    </>
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
                <div className="gd__plate">
                  <svg className="gd__svg" viewBox="0 0 244 122" aria-hidden="true" focusable="false">
                    <Stage />
                  </svg>
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
