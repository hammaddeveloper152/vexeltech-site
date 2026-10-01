import React from 'react';
import './story.css';

/* RECENT WORK (the storytelling pass, 2026-10-01; VEXELTECH-COPY.md V3.1,
   For the structure pass). A strip of plates: each a flat browser frame
   holding a screenshot, then the business name, its industry and city, and
   one line of what the job was, the proof unit V3.1 names (and the shape
   monolog's success stories take: the work, the name, one line).

   SIX PLACEHOLDER PLATES. The founder supplies the sites. Each screenshot
   slot is 16:10, sized for a desktop capture cropped once; the words are
   marked as placeholders, not invented (BUILD-LAW Truth). A plate's `href`
   and `shot` drop in with no layout change.

   The strip scrolls sideways with snap at every width: three plates and a
   peek at 1280, one and a peek at 390. */
const PLATES = Array.from({ length: 6 }, (_, i) => ({
  id: `plate-${i + 1}`,
  name: 'Business name',
  where: 'Industry, City ST',
  line: 'One line on the job.',
  shot: null,
  href: null,
}));

function Browser({ shot }) {
  return (
    <div className="rw__frame">
      <svg className="rw__chrome" viewBox="0 0 400 28" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <circle className="kl" cx="16" cy="14" r="4" />
        <circle className="kl" cx="30" cy="14" r="4" />
        <circle className="kl" cx="44" cy="14" r="4" />
      </svg>
      <span className="rw__url" aria-hidden="true" />
      <div className="rw__shot">
        {shot ? <img src={shot} alt="" loading="lazy" decoding="async" /> : <span className="rw__slot st-mono">Screenshot, 16:10</span>}
      </div>
    </div>
  );
}

export default function RecentWork() {
  return (
    <section className="vt st-sec st--dark rw" aria-labelledby="rw-h">
      <div className="st-in">
        <h2 className="st-h" id="rw-h">
          Recent work
        </h2>
        <p className="st-lead">Live sites. Open any of them.</p>
      </div>
      <ul className="rw__strip">
        {PLATES.map((p) => (
          <li className="rw__plate" key={p.id}>
            <Browser shot={p.shot} />
            <p className="rw__name">{p.name}</p>
            <p className="rw__where st-mono">{p.where}</p>
            <p className="rw__line st-soft">{p.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
