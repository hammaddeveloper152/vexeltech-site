import React, { useState } from 'react';
import { PaperPlaneTilt } from '@phosphor-icons/react';
import FooterMeta from './FooterMeta.jsx';
import { budgetBands } from '../../content/pricing.js';
import './FooterForm.css';

/* Section 9. The form, and the end of the page.

   Every value below is a placeholder. BUILD-LAW.md Truth: a phone number, an
   address, a legal entity name and a set of budget bands are all facts about
   this business, and none of them may be written here until they are given.
   The v11 tree carries a phone number and a Calendly link; they were NOT
   carried over, because a stale contact detail is worse than a visibly empty
   one.

   There is no Vexel Scales line anywhere in this file, by decision. */

/* THE FORM IS NOT LIVE, and it says so on the page.

   There is no endpoint. Until there is one, the submit is disabled and a
   visible line under it says the form is not live yet. It used to validate,
   show a sending state for 900ms and then report "Message sent" — a reader
   who filled it in was told it had gone somewhere, and it had not. BUILD-LAW
   Truth applies to interface states as much as to copy: a success message is
   a claim.

   A mailto was the other option and was not taken, because the address is a
   placeholder too. Flip this to true only when `onSubmit` posts to something
   real; the sent and failed branches below are already wired for that. */
const LIVE = false;

const FIELDS = [
  { id: 'name', label: 'Name', type: 'text', autoComplete: 'name', required: true },
  { id: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
  { id: 'company', label: 'Company', type: 'text', autoComplete: 'organization', required: false },
];

/* THE BUDGET BANDS ARE REAL, from 2026-09-08.

   They were placeholders because bands are price data and the price was in
   conflict. The user settled it — one website at $700 — and the bands come
   straight from the figures: `budgetBands()` in src/content/pricing.js, which
   derives them from FIGURES so a price change cannot leave a band behind.

   Up to $300 / $300 to $700 / $700 or more. The top band is open-ended AT
   the highest published price rather than above it, because $700 is the
   largest figure this business publishes and naming a ceiling nobody quoted
   would be inventing one. The full reasoning is in that file.

   The fallback is not decoration: if any figure returns to null the bands go
   with it and the field says it is a placeholder again, rather than showing
   three ranges derived from a number that is no longer there. */
const BUDGETS = budgetBands() || [
  'Placeholder range one',
  'Placeholder range two',
  'Placeholder range three',
];


function validate(id, value) {
  const v = value.trim();
  if (id === 'name') return v ? '' : 'Enter your name.';
  if (id === 'email') {
    if (!v) return 'Enter your email address.';
    /* Deliberately loose. A strict pattern rejects addresses that are
       actually valid, and the only real test is whether the mail arrives. */
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter an email address with an at sign and a domain.';
  }
  if (id === 'message') return v ? '' : 'Tell us what you need.';
  return '';
}

export default function FooterForm() {
  const [values, setValues] = useState({
    name: '', email: '', company: '', budget: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed

  const set = (id) => (e) => setValues((v) => ({ ...v, [id]: e.target.value }));

  /* On blur, not on every keystroke. Validating as someone types tells them
     their half-finished email address is wrong, which it is, and which they
     already know. */
  const check = (id) => () =>
    setErrors((prev) => ({ ...prev, [id]: validate(id, values[id]) }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    const next = {};
    ['name', 'email', 'message'].forEach((id) => {
      const msg = validate(id, values[id]);
      if (msg) next[id] = msg;
    });
    setErrors(next);

    const bad = Object.keys(next);
    if (bad.length) {
      setStatus('idle');
      /* Move focus to the first field that failed. Without this a keyboard or
         screen reader user is told something is wrong and left at the submit
         button with no way to know where. */
      const el = document.getElementById(`ff-${bad[0]}`);
      if (el) el.focus();
      return;
    }

    /* Nothing to post to. The button is disabled while LIVE is false, so this
       branch is only reachable by a submit event that bypassed the button —
       the Enter key in a field — and it must still not pretend. */
    if (!LIVE) {
      setStatus('idle');
      return;
    }

    setStatus('sending');
    /* Replace with the real request. On success setStatus('sent'), on any
       failure setStatus('failed'); both messages below are already written. */
    setStatus('failed');
  };

  const sending = status === 'sending';

  return (
    <footer className="vt foot scratched">
      <div className="foot__inner">
        <h2 className="foot__h" id="foot-h">
          Get in touch
        </h2>

        <form className="foot__form" onSubmit={onSubmit} noValidate aria-labelledby="foot-h">
          {FIELDS.map(({ id, label, type, autoComplete, required }) => {
            const err = errors[id];
            return (
              <p className="foot__field" key={id}>
                <label className="foot__label" htmlFor={`ff-${id}`}>
                  {label}
                  {required ? <span className="foot__req" aria-hidden="true"> (required)</span> : null}
                </label>
                <input
                  className="foot__input"
                  id={`ff-${id}`}
                  name={id}
                  type={type}
                  autoComplete={autoComplete}
                  value={values[id]}
                  onChange={set(id)}
                  onBlur={check(id)}
                  required={required || undefined}
                  aria-invalid={err ? 'true' : undefined}
                  aria-describedby={err ? `ff-${id}-err` : undefined}
                  data-invalid={err ? 'true' : 'false'}
                />
                {/* Always rendered, filled only when it has something to
                    say. A live region created at the same moment as its
                    content is unreliably announced; one that already exists
                    and then changes is not. Colour never carries the state
                    alone either: a mark, a colour, and the message in words. */}
                <span className="foot__err" id={`ff-${id}-err`} role="alert">
                  {err ? (
                    <>
                      <span className="foot__err-mark" aria-hidden="true">
                        &#215;
                      </span>
                      {err}
                    </>
                  ) : null}
                </span>
              </p>
            );
          })}

          <p className="foot__field">
            <label className="foot__label" htmlFor="ff-budget">
              Budget
            </label>
            <select
              className="foot__input foot__select"
              id="ff-budget"
              name="budget"
              value={values.budget}
              onChange={set('budget')}
            >
              <option value="">No preference</option>
              {BUDGETS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </p>

          <p className="foot__field foot__field--wide">
            <label className="foot__label" htmlFor="ff-message">
              Message
              <span className="foot__req" aria-hidden="true"> (required)</span>
            </label>
            <textarea
              className="foot__input foot__textarea"
              id="ff-message"
              name="message"
              rows={5}
              value={values.message}
              onChange={set('message')}
              onBlur={check('message')}
              required
              aria-invalid={errors.message ? 'true' : undefined}
              aria-describedby={errors.message ? 'ff-message-err' : undefined}
              data-invalid={errors.message ? 'true' : 'false'}
            />
            <span className="foot__err" id="ff-message-err" role="alert">
              {errors.message ? (
                <>
                  <span className="foot__err-mark" aria-hidden="true">
                    &#215;
                  </span>
                  {errors.message}
                </>
              ) : null}
            </span>
          </p>

          <div className="foot__actions">
            {/* The one icon in the form. Nothing inside the fields: a glyph
                in an input crowds the value and moves the text away from the
                edge the label is aligned to. Decorative, because the button
                already says Send. */}
            <button
              className="foot__submit"
              type="submit"
              disabled={!LIVE || sending}
              aria-describedby={LIVE ? undefined : 'foot-offline'}
            >
              <PaperPlaneTilt className="i i--sm" aria-hidden="true" />
              {sending ? 'Sending' : 'Send'}
            </button>

            {/* Polite, so it does not cut across whatever the reader is doing,
                and always present so the region is not created on the fly. */}
            <p className="foot__status" role="status">
              {!LIVE ? (
                /* Plain and visible, not a tooltip and not a disabled-state
                   colour alone: a greyed button on its own reads as broken,
                   and the reader should know it is deliberate. */
                <span className="foot__offline" id="foot-offline">
                  This form isn't wired up yet, so nothing you type here reaches us.
                  Email us instead and it will.
                </span>
              ) : null}
              {status === 'sent' ? (
                <span className="foot__ok">
                  <span className="foot__ok-mark" aria-hidden="true">
                    &#10003;
                  </span>
                  Message sent.
                </span>
              ) : null}
              {status === 'failed' ? (
                <span className="foot__err">
                  <span className="foot__err-mark" aria-hidden="true">
                    &#215;
                  </span>
                  That did not send. Try again in a moment.
                </span>
              ) : null}
            </p>
          </div>
        </form>

        <FooterMeta />
      </div>
    </footer>
  );
}
