import React from 'react';
import { REAL_WORK, MIN_WORK } from '../../content/work.js';
import './story.css';

/* RECENT WORK (the storytelling pass, 2026-10-01; VEXELTECH-COPY.md V3.1,
   For the structure pass). A strip of plates: each a flat browser frame
   holding the site's screenshot, then the business name, its industry and
   city, and one line of what the job was, the proof unit V3.1 names (and
   the shape monolog's success stories take: the work, the name, one line).

   THE DATA IS content/work.js: the founder's sites, each screenshot the live
   site's first viewport at 1440 x 900 (.measure/work-shots.mjs). THE SECTION
   RENDERS NOTHING with fewer than three entries (BUILD-LAW Truth, Real over
   drawn).

   The strip scrolls sideways with snap at every width: three plates and a
   peek at 1280, one and a peek at 390. Each plate opens the live site. */
/* The screenshot in a plain frame: 8px radius, a hairline, nothing drawn
   (real over drawn, 2026-10-02: the browser chrome drawing came off). The
   720 file for phones, the 1440 one from 768. Decorative: the name under it
   says whose site it is, and the link is the plate. */
function Shot({ slug }) {
  return (
    <div className="rw__frame">
      <img
        src={`/work/${slug}-720.jpg`}
        srcSet={`/work/${slug}-720.jpg 720w, /work/${slug}.jpg 1440w`}
        sizes="(min-width: 768px) 380px, 82vw"
        alt=""
        width="1440"
        height="900"
        loading="lazy"
        decoding="async"
      />
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
              <Shot slug={w.slug} />
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
