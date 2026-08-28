import React, { useState } from 'react';
import './FooterForm.css';

/* Section 9. The form, and the end of the page.

   Every value below is a placeholder. BUILD-LAW.md Truth: a phone number, an
   address, a legal entity name and a set of budget bands are all facts about
   this business, and none of them may be written here until they are given.
   The v11 tree carries a phone number and a Calendly link; they were NOT
   carried over, because a stale contact detail is worse than a visibly empty
   one.

   There is no Vexel Scales line anywhere in this file, by decision. */

const FIELDS = [
  { id: 'name', label: 'Name', type: 'text', autoComplete: 'name', required: true },
  { id: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
  { id: 'company', label: 'Company', type: 'text', autoComplete: 'organization', required: false },
];

/* Obviously synthetic. Real bands are a pricing decision, not a form
   decision, and inventing them here would be inventing the price list. */
const BUDGETS = [
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

    setStatus('sending');
    /* STUB. Wired to nothing on purpose. See the note in the summary for what
       a real endpoint needs before this is replaced. */
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus('sent');
  };

  const sending = status === 'sending';

  return (
    <footer className="vt foot">
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
            <button className="foot__submit" type="submit" disabled={sending}>
              {sending ? 'Sending' : 'Send'}
            </button>

            {/* Polite, so it does not cut across whatever the reader is doing,
                and always present so the region is not created on the fly. */}
            <p className="foot__status" role="status">
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

        <div className="foot__meta">
          <div className="foot__contact">
            <span className="foot__meta-k">Contact</span>
            <span className="foot__meta-v">Placeholder email address</span>
            <span className="foot__meta-v">Placeholder phone number</span>
          </div>

          <div className="foot__contact">
            <span className="foot__meta-k">Where</span>
            <span className="foot__meta-v">Placeholder address line one</span>
            <span className="foot__meta-v">Placeholder address line two</span>
          </div>

          <p className="foot__legal">Placeholder legal line, entity name and year.</p>
        </div>
      </div>
    </footer>
  );
}
