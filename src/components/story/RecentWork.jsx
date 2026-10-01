import React from 'react';
import { REAL_WORK, MIN_WORK } from '../../content/work.js';
import './story.css';

/* RECENT WORK (the storytelling pass, 2026-10-01; VEXELTECH-COPY.md V3.1,
   For the structure pass). A strip of plates: each a flat browser frame
   holding the site's screenshot, then the business name, its industry and
   city, and one line of what the job was, the proof unit V3.1 names (and
   the shape monolog's success stories take: the work, the name, one line).

   THE DATA IS content/work.js. A plate is a real entry: a name and a
   screenshot at /public/work/<slug>.jpg, 16:10. THE SECTION RENDERS NOTHING
   until there are three (BUILD-LAW Truth: no invented clients), so on the
   page today it is absent, not empty.

   The strip scrolls sideways with snap at every width: three plates and a
   peek at 1280, one and a peek at 390. Each plate opens the live site. */
function Browser({ slug }) {
  return (
    <div className="rw__frame">
      <svg className="rw__chrome" viewBox="0 0 400 28" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <circle className="kl" cx="16" cy="14" r="4" />
        <circle className="kl" cx="30" cy="14" r="4" />
        <circle className="kl" cx="44" cy="14" r="4" />
      </svg>
      <span className="rw__url" aria-hidden="true" />
      <div className="rw__shot">
        <img src={`/work/${slug}.jpg`} alt="" width="1600" height="1000" loading="lazy" decoding="async" />
      </div>
    </div>
  );
}

export default function RecentWork() {
  if (REAL_WORK.length < MIN_WORK) return null;
  return (
    <section className="vt st-sec st--dark rw" aria-labelledby="rw-h">
      <div className="st-in">
        <h2 className="st-h" id="rw-h">
          Recent work
        </h2>
        <p className="st-lead">Live sites. Open any of them.</p>
      </div>
      <ul className="rw__strip">
        {REAL_WORK.map((w) => (
          <li className="rw__plate" key={w.slug}>
            <a className="rw__link" href={w.url || undefined} target="_blank" rel="noopener noreferrer">
              <Browser slug={w.slug} />
              <p className="rw__name">{w.name}</p>
              <p className="rw__where st-mono">
                {w.industry}, {w.city}
              </p>
              <p className="rw__line st-soft">{w.line}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
