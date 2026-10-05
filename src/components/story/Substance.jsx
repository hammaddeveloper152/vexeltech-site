import React from 'react';
import { FaqList } from '../home/Faq.jsx';

/* THE THREE SUBSTANCE OBJECTS ON /services (the founder's services
   substance pass, 2026-10-05). Built once, fed per discipline from
   content/substance.js. Static type: nothing in them starts hidden and
   nothing in them moves but the questions' own disclosure. Styled in
   services.css, on both grounds.

     SpecSheet    a ruled table, mono 11px labels left, 16px values right,
                  1px steel rules; two columns from 1024, one below
     HowItGoes    four steps in a row (stacked below 768): a mono "01" to
                  "04", a 16px title, a 14px line, and one 1px rule
                  linking the four
     TwoQuestions two rows of the site's FAQ accordion (Faq.jsx), opening
                  in place */

export function SpecSheet({ rows, label }) {
  return (
    <dl className="sub-spec" aria-label={label}>
      {rows.map(([k, v]) => (
        <div className="sub-spec__row" key={k}>
          <dt className="sub-spec__k">{k}</dt>
          <dd className="sub-spec__v">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function HowItGoes({ steps, label }) {
  return (
    <ol className="sub-how" aria-label={label}>
      {steps.map(([title, line], i) => (
        <li className="sub-how__step" key={title}>
          <span className="sub-how__n" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="sub-how__t">{title}</span>
          <span className="sub-how__l">{line}</span>
        </li>
      ))}
    </ol>
  );
}

export function TwoQuestions({ items, id }) {
  return (
    <div className="sub-qs faq">
      <FaqList items={items} id={id} />
    </div>
  );
}
