import React from 'react';
import { Link } from 'react-router-dom';
import { CALL_HREF, CALL_LABEL } from '../../pages/site/parts.jsx';
import './about-close.css';

/* ABOUT, THE CLOSE (final18, 2026-10-06, the founder). It replaced the
   closing call (CallBand) on About. Full width on the dark band: a 2px
   yellow rule 80 wide, the statement in the display face (72px at 1280,
   44px below 768, three lines at most), one 18px line, the call and a text
   link to pricing, then one row of three facts in 13px mono with 1px bone
   separators. Nothing else in the section. */
const FACTS = ['Reply within one business day', 'Every quote in writing', 'No long contracts'];

export default function AboutClose() {
  return (
    <section className="vt st-sec st--dark ab-dark ac" aria-labelledby="ac-h" data-nomarg="">
      <div className="ac__in">
        <span className="ac__rule" aria-hidden="true" />
        <h2 className="ac__h" id="ac-h">
          Four services. One team. One number to call.
        </h2>
        <p className="ac__p">
          Branding, websites, marketing and automation, delivered by the people you spoke to on the first call.
        </p>
        <div className="ac__calls">
          <Link className="ac__cta" to={CALL_HREF}>
            {CALL_LABEL}
          </Link>
          <Link className="ac__link" to="/pricing">
            See pricing
          </Link>
        </div>
        <ul className="ac__facts">
          {FACTS.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
