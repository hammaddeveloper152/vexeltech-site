import React, { useEffect, useRef, useState } from 'react';
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

const CARDS = [
  {
    id: 'branding',
    name: 'Branding',
    question: 'Need a logo and a look that makes your business look established?',
    answer: 'your logo, colours, business cards and social kit.',
    fact: 'Ready in one to two business days. Every file is yours.',
    link: 'See branding',
  },
  {
    id: 'websites',
    name: 'Websites',
    question: 'Need a website that brings in calls and bookings, not just visits?',
    answer: 'a six-page site built for phones, live in four business days.',
    fact: 'On your own domain, in your name. Thirty days of maintenance included.',
    link: 'See websites',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    question: 'Need more customers to find you on Google and Facebook?',
    answer: 'your ads and your Google listing, reported as cost per enquiry.',
    fact: 'Month to month. You see every call and form, and what each one cost.',
    link: 'See marketing',
  },
  {
    id: 'automation',
    name: 'Automation',
    question: 'Missing calls and forgetting follow-ups while you are on the job?',
    answer: 'text-backs, bookings and reminders that run without you.',
    fact: 'Set up in about two weeks, in your own accounts.',
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
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
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
            setTyped(0);
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
  }, [text]);

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
          <h2 className="services__h" id="services-h">
            What we do
          </h2>
          <p className="services__lead">Four things we do for owner-run businesses. Start with the one that hurts.</p>
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
                  <span className="wwd__k">We do</span>
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
