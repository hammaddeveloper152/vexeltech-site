import React from 'react';
import './story.css';

/* WHAT HAPPENS AFTER YOU SEND (the storytelling pass, 2026-10-01). It
   replaces the four tiles under Contact's form: the form's own future, four
   points on one hairline rail, a mono index over each label. The one yellow
   point is the promise, the written number within one business day; the
   other three are keyline rings. Coinsetters sets a promise over each step
   of its process; here the promise is the step.

   Horizontal from 768, the rail through the points; vertical below, the
   rail down the left. The labels are the founder's four, verbatim. No
   visible heading: the copy gives none, so the list is named for a screen
   reader. */
const POINTS = [
  { id: 'sent', label: 'Sent' },
  { id: 'number', label: 'Written number within one business day', lit: true },
  { id: 'call', label: 'Call' },
  { id: 'build', label: 'Build' },
];

export default function ContactTimeline() {
  return (
    <section className="vt st-sec st--dark ctl" aria-label="What happens after you send" data-artifact="ContactTimeline">
      <div className="st-in">
        <ol className="ctl__rail">
          {POINTS.map(({ id, label, lit }, i) => (
            <li className="ctl__pt" key={id} data-lit={lit ? 'true' : 'false'}>
              <span className="ctl__dot" aria-hidden="true" />
              <span className="ctl__n st-mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="ctl__t">{label}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
