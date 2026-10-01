import React from 'react';
import { useReveal } from '../home/hooks.js';
import './story.css';

/* WHERE WE COME FROM, AS ONE DIAGRAM THAT GROWS (the storytelling pass,
   2026-10-01). Three stops, and over each the system as it stood: one box,
   the ads; two connected, the ads and the page after the click; four in a
   ring, the brand, the site, the ads and the follow-up. The box words come
   from the stops' own lines (VEXELTECH-COPY.md V3.1, About, Where we come
   from). Asphalt keylines on cream; the one accent is the last box the story
   adds, the follow-up, in machine yellow with asphalt words (9.46:1).

   It builds once when it comes into view, stage by stage: each box and each
   connector rises in on the reveal curve, 70ms apart (BUILD-LAW Motion:
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

function Box({ x, y, w = 110, h = 46, label, acc = false, i }) {
  return (
    <g className="st-rv" style={{ '--i': i }}>
      <rect className={acc ? 'kl kl-acc' : 'kl'} x={x} y={y} width={w} height={h} rx="10" />
      <text className={acc ? 'kl-text kl-text--ink' : 'kl-text'} x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function Link({ d, i }) {
  return <path className="kl kl--2 st-rv" d={d} style={{ '--i': i }} />;
}

/* Each stage on the same 244 x 122 drawing, so the three read as one: two
   columns of 110-unit boxes 20 apart, two rows 30 apart. Tight to the
   boxes, so at 1280 the drawing fills its column and the boxes carry about
   the weight of the statements under them (the founder, 2026-10-01: about
   1.4x what they were; 1.35x is what three columns allow). */
const STAGES = [
  () => <Box x={67} y={38} label="Ads" i={0} />,
  () => (
    <>
      <Box x={2} y={38} label="Ads" i={1} />
      <Link d="M112 61 L132 61" i={2} />
      <Box x={132} y={38} label="Page" i={3} />
    </>
  ),
  () => (
    <>
      <Box x={2} y={2} label="Brand" i={4} />
      <Link d="M112 25 L132 25" i={5} />
      <Box x={132} y={2} label="Site" i={6} />
      <Link d="M187 48 L187 74" i={7} />
      <Box x={132} y={74} label="Follow-up" acc i={9} />
      <Link d="M132 97 L112 97" i={8} />
      <Box x={2} y={74} label="Ads" i={7} />
      <Link d="M57 74 L57 48" i={8} />
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
