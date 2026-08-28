import React from 'react';
import './Pillars.css';

/* The four disciplines, framed as the four failures. Moved out of the hero so
   the hero fits one phone screen, per BUILD-LAW.md. */
const PILLARS = [
  { n: '01', title: 'Branding', failure: 'They do not remember you', href: '/services/branding' },
  { n: '02', title: 'Websites', failure: 'They cannot find you', href: '/services/websites' },
  { n: '03', title: 'Marketing', failure: 'Not enough are calling', href: '/services/marketing' },
  { n: '04', title: 'Automation', failure: 'You miss the ones who do', href: '/services/automation' },
];

export default function Pillars() {
  return (
    <nav className="vt pillars" aria-label="What we do">
      <ul className="pillars__list">
        {PILLARS.map(({ n, title, failure, href }, i) => (
          <li className="pillars__item" key={n} style={{ '--i': i }}>
            <a className="pillars__link" href={href}>
              <span className="pillars__n">{n}</span>
              <span className="pillars__t">{title}</span>
              <span className="pillars__d">{failure}</span>
              <i className="pillars__bar" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
