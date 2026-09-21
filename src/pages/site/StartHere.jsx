import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CALL_HREF, CALL_LABEL } from './parts.jsx';
import { FIGURES, money } from '../../content/pricing.js';
import '../../styles/starthere.css';

/* FOUR QUESTIONS, /pricing's engagement device (2026-09-22, the founder's
   restructure; it replaced the bundle builder). Built for this page and used
   nowhere else, BUILD-LAW 0.

   One question on screen at a time: the question in Monigue, two or three
   answers as outline buttons, a 250ms slide in (opacity only under reduced
   motion), and a line of four dots for progress. The questions, answers and
   rules are the founder's, verbatim:

     Branding Advance   if Q1 is No
     Website            if Q2 is No or "It doesn't ring the phone"
     Marketing          if Q3 is Yes or Q2 is "It doesn't ring the phone"
     Automation         if Q4 is not "Nothing, I'm fine"

   THE RESULT SHOWS EVERY MATCH, one to four cards, by the founder's ruling;
   with none, a single line and the call. Priced parts total from pricing.js;
   Branding Advance with the website totals as the $999 bundle, the sheet's
   own figure for that pair. Marketing and Automation are priced on the call.
   The yellow Let's Talk is the result's one call; Start over returns to Q1.

   Focus follows the conversation: each new question takes focus, so a
   keyboard or screen reader user lands on it rather than on a button that
   has just gone. */

const QUESTIONS = [
  { id: 'logo', q: "Do you have a logo you're proud of?", a: ['Yes', 'No'] },
  { id: 'site', q: 'Do you have a website?', a: ['Yes', 'No', "It doesn't ring the phone"] },
  { id: 'ads', q: 'Are you spending on ads?', a: ['Yes', 'No'] },
  {
    id: 'week',
    q: 'What eats your week?',
    a: ['Quotes and follow-ups', 'Answering the same questions', "Nothing, I'm fine"],
  },
];

function matches(ans) {
  const out = [];
  if (ans.logo === 'No') out.push({ id: 'branding', name: 'Branding', tier: 'Advance', price: FIGURES.brandingAdvance });
  if (ans.site === 'No' || ans.site === "It doesn't ring the phone")
    out.push({ id: 'website', name: 'Website', tier: 'One tier', price: FIGURES.website });
  if (ans.ads === 'Yes' || ans.site === "It doesn't ring the phone")
    out.push({ id: 'marketing', name: 'Marketing', tier: null, price: null });
  if (ans.week && ans.week !== "Nothing, I'm fine")
    out.push({ id: 'automation', name: 'Automation', tier: null, price: null });
  return out;
}

function total(cards) {
  const has = (id) => cards.some((c) => c.id === id);
  let sum = cards.reduce((n, c) => n + (c.price || 0), 0);
  let bundle = false;
  if (has('branding') && has('website') && FIGURES.bundle !== null) {
    sum = sum - FIGURES.brandingAdvance - FIGURES.website + FIGURES.bundle;
    bundle = true;
  }
  return { sum, bundle, unpriced: cards.filter((c) => c.price === null) };
}

export default function StartHere() {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  const focusRef = useRef(null);
  const moved = useRef(false);

  useEffect(() => {
    if (moved.current && focusRef.current) focusRef.current.focus();
  }, [step]);

  const answer = (id, value) => {
    moved.current = true;
    setAns((a) => ({ ...a, [id]: value }));
    setStep((s) => s + 1);
  };

  const restart = () => {
    moved.current = true;
    setAns({});
    setStep(0);
  };

  const done = step >= QUESTIONS.length;
  const cards = done ? matches(ans) : [];
  const t = done ? total(cards) : null;

  return (
    <section className="vt sh" aria-labelledby="sh-h">
      <div className="sh__in">
        <h2 className="skip-h" id="sh-h">
          Four questions
        </h2>

        <ol className="sh__dots" aria-hidden="true">
          {QUESTIONS.map((q, i) => (
            <li
              key={q.id}
              className="sh__dot"
              data-state={i < step ? 'done' : i === step ? 'now' : 'next'}
            />
          ))}
        </ol>
        <p className="skip-h" aria-live="polite">
          {done ? 'Your answers are in.' : `Question ${step + 1} of ${QUESTIONS.length}`}
        </p>

        {!done ? (
          <div className="sh__screen" key={step}>
            <p className="sh__q" tabIndex={-1} ref={focusRef}>
              {QUESTIONS[step].q}
            </p>
            <div className="sh__answers">
              {QUESTIONS[step].a.map((a) => (
                <button
                  key={a}
                  type="button"
                  className="sh__answer"
                  onClick={() => answer(QUESTIONS[step].id, a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="sh__screen" key="result">
            <p className="sh__q" tabIndex={-1} ref={focusRef}>
              {cards.length ? "Here's what we'd start with." : 'Nothing needs fixing yet.'}
            </p>

            {cards.length ? (
              <>
                <ul className="sh__cards">
                  {cards.map((c) => (
                    <li className="sh__card" key={c.id}>
                      <span className="sh__card-name">{c.name}</span>
                      {c.tier ? <span className="sh__card-tier">{c.tier}</span> : null}
                      <span className="sh__card-price">{c.price !== null ? money(c.price) : 'Priced on the call'}</span>
                    </li>
                  ))}
                </ul>

                {t.sum ? (
                  <p className="sh__total">
                    <span className="sh__total-k">{t.bundle ? 'Total, as the bundle' : 'Total'}</span>
                    <span className="sh__total-n">{money(t.sum)}</span>
                  </p>
                ) : null}
                {t.unpriced.length ? (
                  <p className="sh__note">
                    {t.unpriced.map((c) => c.name).join(' and ')}{' '}
                    {t.unpriced.length > 1 ? 'are' : 'is'} priced on the call.
                  </p>
                ) : null}
              </>
            ) : null}

            <div className="sh__actions">
              <Link className="sh__call" to={CALL_HREF}>
                {CALL_LABEL}
              </Link>
              <button type="button" className="sh__again" onClick={restart}>
                Start over
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
