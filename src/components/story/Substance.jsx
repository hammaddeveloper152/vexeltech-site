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
     SubstanceRows the two above and the two questions, behind three
                  closed rows of the site's FAQ accordion (final14) */

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

/* THE THREE ROWS (the founder's final14, 2026-10-06): the spec sheet, how
   it goes and the two questions, each behind a closed row in the site's FAQ
   style, in this order, one open at a time, opening with the FAQ's own
   motion. The two questions are plain Q and A text inside the third row
   (h4 under its h3), not a nested accordion, and stay in the page so the
   FAQPage data matches it (head.js). */
export function SubstanceRows({ data, id, name }) {
  const items = [
    { id: 'included', q: "What's included", a: <SpecSheet rows={data.spec} label={`${name}, what's included`} /> },
    { id: 'how', q: 'How it goes', a: <HowItGoes steps={data.steps} label={`${name}, how it goes`} /> },
    {
      id: 'questions',
      q: 'Questions',
      a: (
        <div className="sub-qa">
          {data.questions.map(({ id: qid, q, a: answer }) => (
            <div className="sub-qa__item" key={qid}>
              <h4 className="sub-q">{q}</h4>
              <p className="sub-a">{answer}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];
  return (
    <div className="sub-qs faq">
      <FaqList items={items} id={id} />
    </div>
  );
}
