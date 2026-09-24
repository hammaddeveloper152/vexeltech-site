import React, { useRef, useState } from 'react';
import { IconArrowRight, IconCheck, IconCross } from '../site/Icons.jsx';
import FooterMeta from './FooterMeta.jsx';
import { UTM_KEYS, getUtm } from '../site/utm.js';
import { trackPixel } from '../site/pixel.js';
import './FooterForm.css';

/* Section 9. The form, and the end of the page.

   Every value below is a placeholder. BUILD-LAW.md Truth: a phone number, an
   address, a legal entity name and a set of budget bands are all facts about
   this business, and none of them may be written here until they are given.
   The v11 tree carries a phone number and a Calendly link; they were NOT
   carried over, because a stale contact detail is worse than a visibly empty
   one.

   There is no Vexel Scales line anywhere in this file, by decision. */

/* THE FORM IS LIVE, 2026-09-22. It posts the Netlify form "contact",
   declared as a hidden static twin in index.html so Netlify's HTML parser
   can find its fields — the same mechanism the Plan Builder's "plan" form
   already uses and which is confirmed working.

   THE WIRING WAS WRITTEN IN THIS PASS, and that is worth recording because
   the instruction was to enable Send on the understanding it was already
   wired. It was not: index.html declared only "plan", and this file's
   `onSubmit` returned early with nothing to post to. Enabling the button
   without the wiring would have given a form that validates, reports success
   and drops every enquiry — which is the exact failure the LIVE flag was put
   here to prevent, and BUILD-LAW names it: a success message is a claim.

   WHAT STILL HAS TO BE TRUE ON THE OTHER SIDE: Forms must be enabled for the
   site in Netlify, and the deploy must be a Netlify build of this repo, or
   the POST lands on the SPA shell and returns 200 with nothing recorded.
   That cannot be verified from here. */
const LIVE = true;

/* NAME, PHONE, EMAIL, MESSAGE, 2026-09-24 (the founder's energy pass, CRO
   for paid traffic). Company and Budget are gone; Phone is new and required,
   as Email is. The budget bands stay in content/pricing.js for the pricing
   page; nothing here uses them now. Email takes the full row at 768 and up,
   so the three short fields fill two rows without a hole. */
const FIELDS = [
  { id: 'name', label: 'Name', type: 'text', autoComplete: 'name', required: true },
  { id: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', required: true },
  { id: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true, wide: true },
];

function validate(id, value) {
  const v = value.trim();
  if (id === 'name') return v ? '' : 'Enter your name.';
  if (id === 'phone') {
    if (!v) return 'Enter your phone number.';
    /* Loose, like the email check: seven digits anywhere, whatever the
       punctuation. */
    return (v.match(/\d/g) || []).length >= 7 ? '' : 'Enter a phone number with at least seven digits.';
  }
  if (id === 'email') {
    if (!v) return 'Enter your email address.';
    /* Deliberately loose. A strict pattern rejects addresses that are
       actually valid, and the only real test is whether the mail arrives. */
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter an email address with an at sign and a domain.';
  }
  if (id === 'message') return v ? '' : 'Tell us what you need.';
  return '';
}

/* P2, the character on the phone, stands at the left of the form on EVERY
   route (2026-09-21, the user's final placement, overriding the storyboard's
   per-page poses): one of the site's two character appearances, with P1 on
   exists. The handset that stood above the heading on Contact came off the
   site the same day. */
/* `form={false}` renders the footer block alone, with no form above it:
   About's page ends on it (2026-09-25, the founder's About rebuild). The
   hooks still run so the component's shape does not change with the prop. */
export default function FooterForm({ form = true }) {
  const [values, setValues] = useState({
    name: '', phone: '', email: '', message: '',
  });
  /* The UTM tags, read when the form mounts (utm.js). */
  const [utm] = useState(getUtm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed
  /* THE SENDING GUARD IS A REF, 2026-09-24. It was `status === 'sending'`,
     which is state: a double click runs both handlers before React
     re-renders, so both saw 'idle' and the form POSTed twice (and would
     have fired two Leads). Measured on a test build: 2 posts from one
     double click. A ref is set synchronously. */
  const inFlight = useRef(false);

  const set = (id) => (e) => setValues((v) => ({ ...v, [id]: e.target.value }));

  /* On blur, not on every keystroke. Validating as someone types tells them
     their half-finished email address is wrong, which it is, and which they
     already know. */
  const check = (id) => () =>
    setErrors((prev) => ({ ...prev, [id]: validate(id, values[id]) }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (inFlight.current) return;

    const next = {};
    ['name', 'phone', 'email', 'message'].forEach((id) => {
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

    if (!LIVE) {
      setStatus('idle');
      return;
    }

    inFlight.current = true;
    setStatus('sending');
    /* url-encoded to "/", form-name "contact": Netlify's own convention for a
       script-rendered form, and the same call PlanBuilder makes. The four
       UTM tags ride along as the hidden fields below. */
    const body = new URLSearchParams({
      'form-name': 'contact',
      name: values.name,
      phone: values.phone,
      email: values.email,
      message: values.message,
      ...utm,
    });
    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      setStatus(r.ok ? 'sent' : 'failed');
      /* THE LEAD, 2026-09-24 (the founder's final details): once per
         submission, on the in-page success. The ref guard above means one
         POST per submission, so one Lead. A no-op without a pixel ID. */
      if (r.ok) trackPixel('Lead');
    } catch {
      setStatus('failed');
    } finally {
      inFlight.current = false;
    }
  };

  const sending = status === 'sending';

  if (!form) {
    return (
      <footer className="vt foot foot--bare">
        <FooterMeta />
      </footer>
    );
  }

  return (
    <footer className="vt foot">
      <div className="foot__inner">
        <h2 className="foot__h" id="foot-h">
          Get in touch
        </h2>

        {/* THE MASCOT IS OFF EVERY ROUTE, 2026-09-23 (the founder). It stood
            at the right of this form for part of 2026-09-22. `FooterForm` is
            shared by every route, so one object here was the same object on
            nine pages — the opposite of what the placement was for. THE
            MASCOT APPEARS ONCE ON THE SITE: P1 on home's cream band.
            `character-desk.webp` is deleted from the build. */}
        <div className="foot__stage">
        <form className="foot__form" onSubmit={onSubmit} noValidate aria-labelledby="foot-h">
          {/* The UTM tags as hidden fields (utm.js), 2026-09-24. */}
          {UTM_KEYS.map((k) => (
            <input key={k} type="hidden" name={k} value={utm[k]} />
          ))}
          {FIELDS.map(({ id, label, type, autoComplete, required, wide }) => {
            const err = errors[id];
            return (
              <p className={`foot__field${wide ? ' foot__field--wide' : ''}`} key={id}>
                <label className="foot__label" htmlFor={`ff-${id}`}>
                  <span className="lbl">{label}</span>
                  {required ? ' ' : null}
                  {required ? (
                    <span className="foot__req lbl" aria-hidden="true">
                      required
                    </span>
                  ) : null}
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
                      <IconCross className="i i--sm foot__err-mark" />
                      {err}
                    </>
                  ) : null}
                </span>
              </p>
            );
          })}

          <p className="foot__field foot__field--wide">
            <label className="foot__label" htmlFor="ff-message">
              <span className="lbl">Message</span>{' '}
              <span className="foot__req lbl" aria-hidden="true">
                required
              </span>
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
                  <IconCross className="i i--sm foot__err-mark" />
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
            {/* NO DISABLED STATE, 2026-09-22 (the founder): the yellow
                primary at full opacity, always. A double submit is stopped in
                `onSubmit` by the sending guard rather than by greying the
                control, so nothing has to explain itself to the reader. */}
            {/* "SEND MESSAGE" AND AN ARROW AFTER IT, 2026-09-25 (the founder's
                life pass 2): the arrow slides 4px right on hover; the
                button stays yellow. The paper plane before the label is
                gone. */}
            <button className="foot__submit" type="submit">
              {sending ? 'Sending' : 'Send message'}
              <IconArrowRight className="i send__go" />
            </button>

            {/* Polite, so it does not cut across whatever the reader is doing,
                and always present so the region is not created on the fly. */}
            <p className="foot__status" role="status">
              {status === 'sent' ? (
                <span className="foot__ok">
                  <IconCheck className="i i--sm foot__ok-mark" />
                  {/* VEXELTECH-COPY.md, Contact form, verbatim. */}
                  Got it. You&apos;ll hear from a person, not an autoresponder, within one
                  business day.
                </span>
              ) : null}
              {status === 'failed' ? (
                <span className="foot__err">
                  <IconCross className="i i--sm foot__err-mark" />
                  That did not send. Try again in a moment.
                </span>
              ) : null}
            </p>
          </div>
        </form>
        </div>

        {/* The line that answers the form. */}
        <p className="foot__lead-p">
          Tell us what&apos;s going wrong. You&apos;ll hear from a person within one business day.
        </p>
      </div>

      {/* The cream band, full bleed, outside the form's measure. */}
      <FooterMeta />
    </footer>
  );
}
