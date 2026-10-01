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

function Box({ x, y, w = 120, h = 50, label, acc = false, i }) {
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

/* Each stage on the same 360 x 200 drawing, so the three read as one. */
const STAGES = [
  () => <Box x={120} y={75} label="Ads" i={0} />,
  () => (
    <>
      <Box x={40} y={75} label="Ads" i={1} />
      <Link d="M160 100 L200 100" i={2} />
      <Box x={200} y={75} label="Page" i={3} />
    </>
  ),
  () => (
    <>
      <Box x={40} y={30} label="Brand" i={4} />
      <Link d="M160 55 L200 55" i={5} />
      <Box x={200} y={30} label="Site" i={6} />
      <Link d="M260 80 L260 120" i={7} />
      <Box x={200} y={120} label="Follow-up" acc i={9} />
      <Link d="M200 145 L160 145" i={8} />
      <Box x={40} y={120} label="Ads" i={7} />
      <Link d="M100 120 L100 80" i={8} />
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
                <svg className="gd__svg" viewBox="0 0 360 200" aria-hidden="true" focusable="false">
                  <Stage />
                </svg>
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
