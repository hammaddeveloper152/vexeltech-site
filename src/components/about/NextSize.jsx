import React, { useRef } from 'react';
import useSoftStart from './useSoftStart.js';

/* THE NEXT SIZE (About, D4, final37, 2026-10-08, the founder). The page's
   artifact: a staircase of three paper steps, Now, Next and Then, each a
   label, a Monigue title in sentence case, a line and a mono line. Step 03
   is yellow, every type on it in ink (9.31:1; the brief's yellow-ink labels
   were 3.01:1, the founder's answer). Below 1024 the steps stack and step
   out to the right; from 1024 they stand in three columns on one foot, 460,
   540 and 620 tall (final38). At rest everything is in place; at half in view each
   step rises from 24px below, 150ms apart (useSoftStart). Nothing loops. */
const STEPS = [
  {
    n: '01',
    k: 'Now',
    title: 'The phone rings when it rings.',
    body: 'Work comes from referrals and luck, and you answer everything yourself.',
    mono: 'We build: the name, the site, the follow-up.',
  },
  {
    n: '02',
    k: 'Next',
    title: 'The calendar fills.',
    body: 'You show up wherever people look, every call gets answered and every lead gets followed up.',
    mono: 'We run: search, maps, social, reviews, the receptionist.',
  },
  {
    n: '03',
    k: 'Then',
    title: 'You hire. You choose the work.',
    body: "There's enough coming in to raise your prices and pick the jobs you want.",
    mono: 'We stay: the plan, the number, the next size.',
  },
];

export default function NextSize() {
  const ref = useRef(null);
  const play = useSoftStart(ref);
  return (
    <section className="vt ab ab--ink ns" aria-labelledby="ns-h" data-artifact="NextSize">
      <div className="ab__in ns__grid">
        <div className="ns__text">
          <p className="ab__eyebrow">How we work</p>
          <h2 className="hl ab__h" id="ns-h">
            The Next Size.
          </h2>
          <p className="ab__lead">
            Every client gets one. It&apos;s a written plan from where your business is to where you want it
            to be, run by one team and reviewed with you every month against one number.
          </p>
        </div>
        <ol className="ns__steps" ref={ref} data-play={play ? 'true' : 'false'}>
          {STEPS.map((s, i) => (
            <li className={`ns__step ns__step--${s.n}`} key={s.n} style={{ '--i': i }}>
              <p className="ns__k">
                {s.n} · {s.k}
              </p>
              <h3 className="ns__t">{s.title}</h3>
              <p className="ns__b">{s.body}</p>
              <p className="ns__m">{s.mono}</p>
            </li>
          ))}
        </ol>
        <p className="ns__cap">One number, every month: enquiries, and what each one cost.</p>
      </div>
    </section>
  );
}
