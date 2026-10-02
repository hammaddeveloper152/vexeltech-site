import React, { useRef } from 'react';
import { useReveal } from '../home/hooks.js';
import { useOnce } from '../site/useOnce.js';
import '../final/about-final.css';
import './story.css';

/* WHAT WE BUILD IT AROUND (the storytelling pass, 2026-10-01; the marks
   removed in the seven corrections, 2026-10-02). Four rows in one column on
   the content column's left edge: the discipline in mono 11px deep amber,
   then its statement in Clash Display at 32px (26 below 768). Hairlines
   between rows. No icons, no cards.

   The statements are VEXELTECH-COPY.md V3.1's, verbatim. */
const ROWS = [
  {
    id: 'branding',
    k: 'Branding',
    n: 10,
    suf: 's',
    line: "A customer decides if you're real in ten seconds. The mark does that before you speak.",
  },
  {
    id: 'websites',
    k: 'Websites',
    n: 3,
    suf: '',
    line: 'People scan for a number, a price and a reason to trust you. All three above the fold.',
  },
  {
    id: 'marketing',
    k: 'Marketing',
    n: 1,
    suf: '',
    line: 'An ad is only as good as the page after the click and the phone after the page.',
  },
  {
    id: 'automation',
    k: 'Automation',
    n: 60,
    suf: 's',
    line: 'A missed call answered by text in sixty seconds is still a customer.',
  },
];

function Row({ k, n, suf, line, i }) {
  const ref = useRef(null);
  const armed = useOnce(ref, (gsap, el, done) => {
    const node = el.querySelector('.ba__n');
    const o = { v: 0 };
    gsap.to(o, {
      v: n,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: () => {
        node.firstChild.nodeValue = String(Math.round(o.v));
      },
      onComplete: done,
    });
  });
  return (
    <li className="ba__row st-rv" ref={ref} style={{ '--i': i }}>
      <p className="ba__fig">
        <span className="ba__n">{armed ? 0 : n}</span>
        {suf}
      </p>
      <p className="ba__k">{k}</p>
      <p className="ba__line">{line}</p>
    </li>
  );
}

export default function BuildAround() {
  const [ref, revealed] = useReveal();
  return (
    <section className="vt st-sec st--light ba" aria-labelledby="ba-h">
      <div className="st-in">
        <h2 className="st-h" id="ba-h">
          What we build it around
        </h2>
        <ul className="ba__rows" ref={ref} data-revealed={revealed ? 'true' : 'false'}>
          {ROWS.map(({ id, ...row }, i) => (
            <Row key={id} {...row} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
