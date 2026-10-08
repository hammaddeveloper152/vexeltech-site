import React, { useEffect, useRef, useState } from 'react';
import { useBeforePaint, motionAllowed, belowFold } from '../site/entrance.js';
import { Link } from 'react-router-dom';
import './what-we-do.css';

/* WHAT WE DO, AS PAPER FORMS (the founder's frame D3, final26, 2026-10-07).

   Four paper cards, each a question the owner is asking and the answer we
   write in: a form row ("01 · Branding"), the question in Clash 600, the
   "WE DO" row with the answer in mono in its discipline's ink, a rule, and
   a foot with one fact and a link. The whole card is the link to that
   discipline on /services. No price on any card.

   THE ANSWER INKS, not the raw colours (the founder's ruling, 2026-10-07):
   the raw yellow, violet, coral and mint measure 1.72, 4.03, 2.71 and 2.82
   to 1 on the paper, so the answer is set in each hue's ink at 5:1 or
   better, and the binding edge and the caret keep the raw colour.

   THE TYPING (BUILD-LAW Motion, final26: typing-in is a soft start for text
   that is filled at rest). Every answer is filled on first paint and in the
   prerendered HTML. Once, when a card is half in view, the answer is blank
   for 400ms, then types in at 60ms a character with a 3px caret after it;
   the caret blinks twice after the last character and goes. Cards in view
   together start 150ms apart. The full answer keeps its place throughout
   (the untyped part is laid out and hidden), so nothing reflows, and a
   screen reader reads the whole answer from the first paint. Reduced
   motion: filled, no caret, nothing moves. */

/* COPY V5.2 (final40, 2026-10-08, the founder): the lead and every
   question, answer and fact; before it, V5's answers under V4.2's
   questions. The "We do" label before the answer is gone (the founder's
   answer, final37): a full sentence reads alone. Cards, layout and motion
   unchanged; the cards grow to fit, over their min-height. */
const CARDS = [
  {
    id: 'branding',
    name: 'Branding',
    question: 'Does your business look as established as the work you do?', // V5.3
    answer:
      'We design the identity your customers judge you by before they ever speak to you: the mark, the colours, the type, and how they carry across your signage, your invoices and your social profiles.',
    fact: 'Delivered in one to two business days. Every file is yours.',
    link: 'See branding',
  },
  {
    id: 'websites',
    name: 'Websites',
    question: 'Is your website bringing in enquiries, or only visitors?',
    answer:
      'We build a six-page site around the way your customers decide, which is usually on a phone and often outside business hours. Every page is there to earn a call, a booking or a quote request.',
    fact: 'Live in four business days, on your domain, in your name.',
    link: 'See websites',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    question: 'Are you present everywhere your customers look?',
    answer:
      'Search, maps, Instagram, Facebook, review sites, and now the answer an AI gives when someone asks who to call. We run all of it as one plan and report every month what each enquiry cost you.',
    fact: 'Month to month. We grow when you grow.',
    link: 'See marketing',
  },
  {
    id: 'automation',
    name: 'Automation',
    question: "What happens to the calls you miss while you're working?",
    answer:
      'We set up an assistant that answers in your name, books the job into your calendar and keeps the quote, the invoice and the review request moving. You read the summary in the morning.',
    fact: 'Trained on your services and prices. Running in about two weeks.',
    link: 'See automation',
  },
];

const BLANK = 400;
const PER_CHAR = 60;
const APART = 150;
/* Two blinks of the caret after the last character (what-we-do.css). */
const BLINKS = 2 * 530;

/* One clock for the four cards, so cards entering together start 150ms
   apart however their observers fire. */
let nextStart = 0;

function Answer({ text }) {
  /* null: at rest, filled. A number: that many characters typed. */
  const [typed, setTyped] = useState(null);
  const [caret, setCaret] = useState(false);
  const [armed, setArmed] = useState(false);
  const ref = useRef(null);

  /* THE ENTRANCE RULE (FINAL41 part 4, entrance.js): a card entirely below
     the fold starts with its answer line empty, set before it paints; a
     card in view at first paint keeps its answer and never types. The
     prerendered HTML is filled. */
  useBeforePaint(() => {
    if (!motionAllowed() || typeof IntersectionObserver === 'undefined') return;
    if (belowFold(ref.current && (ref.current.closest('.wwd__card') || ref.current))) {
      setTyped(0);
      setArmed(true);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !armed) return undefined;
    const timers = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const now = performance.now();
        const start = Math.max(now, nextStart);
        nextStart = start + APART;
        timers.push(
          setTimeout(() => {
            setCaret(true);
            for (let i = 1; i <= text.length; i += 1) {
              timers.push(setTimeout(() => setTyped(i), BLANK + i * PER_CHAR));
            }
            const end = BLANK + text.length * PER_CHAR;
            timers.push(setTimeout(() => setTyped(null), end));
            timers.push(setTimeout(() => setCaret(false), end + BLINKS));
          }, start - now)
        );
      },
      { threshold: 0.5 }
    );
    /* The card, not the answer, is what must be half in view. */
    io.observe(el.closest('.wwd__card') || el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [text, armed]);

  const n = typed === null ? text.length : typed;
  return (
    <span className="wwd__fill" ref={ref}>
      <span className="wwd__sr">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, n)}
        {caret ? <span className={`wwd__caret${typed === null ? ' wwd__caret--blink' : ''}`} /> : null}
        <span className="wwd__rest">{text.slice(n)}</span>
      </span>
    </span>
  );
}

/* A hyphenated word never breaks at its hyphen ("follow- / ups" at 1280). */
function Whole({ text }) {
  return text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 ? (
      <span className="wwd__whole" key={i}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function WhatWeDo() {
  return (
    <section className="vt services wwd" aria-labelledby="services-h">
      <div className="services__in">
        <div className="services__head">
          <h2 className="services__h hl" id="services-h">
            What we do
          </h2>
          <p className="services__lead">
            Most clients come to us for one of these four. On the first call we&apos;ll tell you which one is
            actually costing you customers, even if it isn&apos;t the one you asked about.
          </p>
        </div>
        <ul className="wwd__grid">
          {CARDS.map((c, i) => (
            <li key={c.id}>
              <Link className={`wwd__card wwd--${c.id}`} to={`/services#${c.id}`}>
                <span className="wwd__hole" aria-hidden="true" />
                <span className="wwd__form">
                  {String(i + 1).padStart(2, '0')} · {c.name}
                </span>
                <h3 className="wwd__q">
                  <Whole text={c.question} />
                </h3>
                <span className="wwd__ans">
                  <Answer text={c.answer} />
                </span>
                <span className="wwd__meta">
                  <span className="wwd__fact">{c.fact}</span>
                  <span className="wwd__link">{c.link}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
