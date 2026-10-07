import React from 'react';
import LeadForm from './LeadForm.jsx';
import { STEPS } from '../../content/steps.js';
import '../home/FooterForm.css';
import './closing-form.css';

/* THE CLOSING SECTION (final34, 2026-10-08, the founder). One cream
   section where home had three (How it works, the closing call and the
   form, each under its own join) and where every other page had the "Get
   in touch" sheet.

   Home: "Which one is costing you most?" and its line, then two columns
   from 1024 (5/12 and 7/12, 64 apart): How it works's four steps on the
   left, the form on the right, its submit "Get a custom quote". Below 1024:
   the heading, the line, the form, then the steps two by two. No join since
   final35: the heading and the padding mark it. The steps keep #how-it-works.

   Services, Pricing and About: the same section without the steps,
   "Ready when you are." and "A written number within one business day."
   Contact keeps its own page; the legal pages and /thanks have no form.
   There is no "Get in touch" heading and no "Let's talk." block here: the
   footer below says that. */
export default function ClosingForm({ steps = false, heading, line }) {
  return (
    <section className={`vt foot foot--sheet tail${steps ? ' tail--steps' : ''}`} aria-labelledby="tail-h">
      <div className="foot__sheet tail__in">
        <h2 className="tail__h hl" id="tail-h">
          {heading}
        </h2>
        <p className="tail__line">{line}</p>
        <div className="tail__cols">
          {steps ? (
            <div className="tail__steps-col">
              <p className="tail__k">How it works</p>
              <ol className="tail__steps" id="how-it-works">
                {STEPS.map(([title, text], i) => (
                  <li className="tail__step" key={title}>
                    <span className="tail__n" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="tail__t">{title}</h3>
                    <p className="tail__l">{text}</p>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          <div className="tail__form">
            <LeadForm idPrefix="ff" labelledBy="tail-h" submitLabel="Get a custom quote" />
          </div>
        </div>
      </div>
    </section>
  );
}
