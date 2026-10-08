import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight, IconCheck, IconCross } from './Icons.jsx';
import { UTM_KEYS, getUtm } from './utm.js';
import { trackPixel } from './pixel.js';
import { track } from './analytics.js';
import { budgetBands } from '../../content/pricing.js';
import { FORM_ENDPOINT, FORM_TARGET, FORM_EMAIL } from '../../content/form.js';
import './LeadForm.css';

/* THE LEAD FORM, 2026-09-25 (the founder's contact pass). One form, two
   placements: the footer form on every page (`FooterForm.jsx`) and the
   contact page's own (`needs`, which adds the "What do you need?" pills and
   sets the first three fields in one row). One place its validation, its
   error handling and its posting live, as there was when FooterForm held it.

   THE LINE FIELD: no box, a 1px line under each field, 22px Satoshi, the
   placeholder as the label, a mono index above (01, 02, ...). Each field
   keeps a real `<label>`, visually hidden, so it has a name once the
   placeholder has gone. Focus: the line goes 2px machine yellow. Error: 2px
   red and the message in words under it, never colour alone.

   WHERE IT POSTS (the founder's final audit, final22, 2026-10-06): to
   Formspree (content/form.js), as JSON with `Accept: application/json`, since
   the site is on Hostinger and Netlify Forms does not run there. With
   VITE_FORM_TARGET=netlify it posts the Netlify form "contact", url-encoded
   to "/", as before, and the build keeps the hidden twin in index.html.

   THE HONEYPOT: one visually hidden text field out of the tab order,
   `_gotcha` for Formspree and `bot-field` for Netlify. A person never fills
   it; a submission that has it filled is dropped here and shown the success
   state, so a bot learns nothing. Under the form, always, a mailto link to
   the address, for anyone whose post fails or who would rather write. */

const FIELDS = [
  /* COPY V2, 2026-10-01: Name, Phone, Email. */
  { id: 'name', ph: 'Name *', type: 'text', autoComplete: 'name' },
  { id: 'phone', ph: 'Phone *', type: 'tel', autoComplete: 'tel' },
  { id: 'email', ph: 'Email *', type: 'email', autoComplete: 'email' },
];

/* The founder's five, verbatim. */
const NEEDS = ['Branding', 'Website', 'Marketing', 'Automation', 'Not sure'];

/* The founder's budget bands for the contact page, verbatim (2026-09-25).
   Single select and not required. */
/* COPY V2, 2026-10-01: the three bands, derived from the prices
   (content/pricing.js, budgetBands): Up to $300, $300 to $700, $700 or
   more. */
const BUDGETS = budgetBands();

/* The founder's placeholder, contact page and footer form (2026-09-25). */
/* COPY V2, 2026-10-01: the footer form's fourth field is "Message"; the
   contact form's is "Tell us about your business and what you need". */
const MESSAGE_LABEL = { footer: 'Message', contact: 'Tell us about your business and what you need' };

export function validate(id, value) {
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
  if (id === 'message') return v ? '' : 'Tell us about your business and what you need.';
  return '';
}

const REQUIRED = ['name', 'phone', 'email', 'message'];

const pad = (n) => String(n).padStart(2, '0');

function Err({ id, msg }) {
  /* Always rendered, filled only when it has something to say: a live
     region created at the same moment as its content is unreliably
     announced; one that already exists and then changes is not. */
  return (
    <span className="lf__err" id={id} role="alert">
      {msg ? (
        <>
          <IconCross className="i i--sm lf__err-mark" />
          {msg}
        </>
      ) : null}
    </span>
  );
}

export default function LeadForm({ idPrefix = 'ff', needs = false, labelledBy, submitLabel = null }) {
  const [values, setValues] = useState({ name: '', phone: '', email: '', message: '' });
  const [picked, setPicked] = useState([]);
  const [budget, setBudget] = useState('');
  /* The UTM tags, read when the form mounts (utm.js). */
  /* Read after mount (FINAL29): the prerendered form has empty tags, and
     the first render must match it. */
  const [utm, setUtm] = useState(() => Object.fromEntries(UTM_KEYS.map((k) => [k, ''])));
  useEffect(() => setUtm(getUtm()), []);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed
  const [trap, setTrap] = useState('');
  /* THE SENDING GUARD IS A REF, 2026-09-24: state would let a double click
     run both handlers before React re-renders and POST twice. */
  const inFlight = useRef(false);
  const msgRef = useRef(null);

  const fid = (id) => `${idPrefix}-${id}`;
  const set = (id) => (e) => setValues((v) => ({ ...v, [id]: e.target.value }));
  /* On blur, not on every keystroke: a half-typed address is wrong, and the
     reader already knows. */
  const check = (id) => () => setErrors((prev) => ({ ...prev, [id]: validate(id, values[id]) }));

  /* THE MESSAGE GROWS WITH ITS CONTENT from one line. Height is set, never
     animated, and includes the field's line (offsetHeight - clientHeight).
     Re-measured when the field's WIDTH changes too (release addendum,
     2026-09-25): the full stylesheet can land after home mounts, and a
     height taken unstyled was left 18px tall; a viewport resize rewraps the
     text the same way. */
  const grow = () => {
    const el = msgRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`;
  };
  useLayoutEffect(grow, [values.message]);
  useEffect(() => {
    const el = msgRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    let w = el.getBoundingClientRect().width;
    const ro = new ResizeObserver(([entry]) => {
      const nw = entry.contentRect.width;
      if (nw !== w) {
        w = nw;
        grow();
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* THE SUBMIT RULE, 2026-09-25 (the founder): 40% until name, phone, email
     and message are filled and valid, full when they are. It stays a live
     button at 40%: pressing it early names what is missing and moves focus
     there, which a disabled control cannot do. `aria-disabled` tells a
     screen reader it is not ready yet. */
  const ready = REQUIRED.every((id) => !validate(id, values[id]));

  const toggle = (n) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (inFlight.current) return;

    const next = {};
    REQUIRED.forEach((id) => {
      const msg = validate(id, values[id]);
      if (msg) next[id] = msg;
    });
    setErrors(next);
    const bad = Object.keys(next);
    if (bad.length) {
      setStatus('idle');
      const el = document.getElementById(fid(bad[0]));
      if (el) el.focus();
      return;
    }

    /* The honeypot was filled: a bot. Drop it and show the success. */
    if (trap) {
      setStatus('sent');
      return;
    }

    inFlight.current = true;
    setStatus('sending');
    const fields = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      ...(needs ? { need: picked.join(', '), budget } : {}),
      message: values.message,
      ...utm,
    };
    try {
      const r =
        FORM_TARGET === 'netlify'
          ? await fetch('/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({ 'form-name': 'contact', ...fields }).toString(),
            })
          : await fetch(FORM_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify({ ...fields, _subject: 'New quote request, vexeltechsolutions.com' }),
            });
      setStatus(r.ok ? 'sent' : 'failed');
      /* THE LEAD, once per submission, on the in-page success. A no-op
         without a pixel ID. */
      if (r.ok) {
        trackPixel('Lead');
        /* Plausible's "Lead" too (FINAL29, the founder): once per
           submission, on the in-page success, as on /thanks. The sending
           guard above already makes a submission one request. */
        track('Lead');
      }
    } catch {
      setStatus('failed');
    } finally {
      inFlight.current = false;
    }
  };

  const field = ({ id, ph, type, autoComplete }, i) => {
    const err = errors[id];
    return (
      <p className="lf__field" key={id}>
        <span className="lf__idx" aria-hidden="true">
          {pad(i)}
        </span>
        {/* REQUIRED IN TEXT (the launch gate, 2026-10-07): the label reads
            "Name (required)"; the asterisk in the placeholder is the visible
            mark. */}
        <label className="lf__sr" htmlFor={fid(id)}>
          {ph.replace(' *', '')} (required)
        </label>
        <input
          className="lf__input"
          id={fid(id)}
          name={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={ph}
          value={values[id]}
          onChange={set(id)}
          onBlur={check(id)}
          required
          aria-invalid={err ? 'true' : undefined}
          aria-describedby={err ? `${fid(id)}-err` : undefined}
        />
        <Err id={`${fid(id)}-err`} msg={err} />
      </p>
    );
  };

  const msgIndex = needs ? 6 : 4;

  return (
    <form
      className={`lf${needs ? ' lf--needs' : ''}`}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby={labelledBy}
    >
      {UTM_KEYS.map((k) => (
        <input key={k} type="hidden" name={k} value={utm[k]} />
      ))}

      {/* The honeypot (final22): hidden from people and out of the tab
          order; only a bot fills it. */}
      <p className="lf__trap" aria-hidden="true">
        <label htmlFor={fid('trap')}>Leave this empty</label>
        <input
          id={fid('trap')}
          type="text"
          name={FORM_TARGET === 'netlify' ? 'bot-field' : '_gotcha'}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </p>

      <div className="lf__row">{FIELDS.map((f, i) => field(f, i + 1))}</div>

      {needs ? (
        <fieldset className="lf__needs">
          {/* The legend is the fieldset's first child, or it is not its
              legend; the index rides inside it. */}
          <legend className="lf__legend">
            <span className="lf__idx" aria-hidden="true">
              04
            </span>
            <span className="lbl lf__legend-t">What do you need?</span>
          </legend>
          <div className="lf__pills">
            {NEEDS.map((n) => (
              <label className="lf__pill" key={n}>
                <input
                  className="lf__check"
                  type="checkbox"
                  name="need"
                  value={n}
                  checked={picked.includes(n)}
                  onChange={() => toggle(n)}
                />
                <span className="lf__pill-face">{n}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {needs ? (
        /* 05, THE BUDGET: single select, so radios, in the pills' style. Not
           required, and nothing is picked until the reader picks. */
        <fieldset className="lf__needs">
          <legend className="lf__legend">
            <span className="lf__idx" aria-hidden="true">
              05
            </span>
            <span className="lbl lf__legend-t">Budget</span>
          </legend>
          <div className="lf__pills">
            {BUDGETS.map((n) => (
              <label className="lf__pill" key={n}>
                <input
                  className="lf__check"
                  type="radio"
                  name="budget"
                  value={n}
                  checked={budget === n}
                  onChange={() => setBudget(n)}
                />
                <span className="lf__pill-face">{n}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <p className="lf__field lf__field--msg">
        <span className="lf__idx" aria-hidden="true">
          {pad(msgIndex)}
        </span>
        <label className="lf__sr" htmlFor={fid('message')}>
          {needs ? MESSAGE_LABEL.contact : MESSAGE_LABEL.footer} (required)
        </label>
        <textarea
          className="lf__input lf__textarea"
          id={fid('message')}
          name="message"
          rows={1}
          ref={msgRef}
          placeholder={`${needs ? MESSAGE_LABEL.contact : MESSAGE_LABEL.footer} *`}
          value={values.message}
          onChange={set('message')}
          onBlur={check('message')}
          required
          aria-invalid={errors.message ? 'true' : undefined}
          aria-describedby={errors.message ? `${fid('message')}-err` : undefined}
        />
        <Err id={`${fid('message')}-err`} msg={errors.message} />
      </p>

      <div className="lf__actions">
        <button
          className="lf__submit"
          type="submit"
          {...(submitLabel && /quote/i.test(submitLabel) ? { 'data-primary-call': '' } : {})}
          data-ready={ready ? 'true' : 'false'}
          aria-disabled={ready ? undefined : 'true'}
        >
          {/* The closing section names its submit "Get a custom quote"
              (final34); elsewhere it is "Send" with its arrow. */}
          {status === 'sending' ? 'Sending' : submitLabel || 'Send'}
          {submitLabel ? null : <IconArrowRight className="i send__go" />}
        </button>

        {/* Polite, and always present so the region is not created on the
            fly. */}
        <p className="lf__status" role="status">
          {status === 'sent' ? (
            <span className="lf__ok">
              <IconCheck className="i i--sm lf__ok-mark" />
              {/* VEXELTECH-COPY.md (V3), the forms' success, verbatim. */}
              Received. A written reply within one business day.
            </span>
          ) : null}
          {status === 'failed' ? (
            <span className="lf__err">
              <IconCross className="i i--sm lf__err-mark" />
              That did not send. Try again in a moment.
            </span>
          ) : null}
        </p>
      </div>

      {/* THE PRIVACY LINE (the launch gate, 2026-10-07, the founder's
          words): under the submit, with the privacy policy one link away. */}
      <p className="lf__privacy">
        We reply within one business day. Your details are used only to answer you.{' '}
        <Link to="/privacy-policy">Privacy policy</Link>
      </p>

      {/* THE MAILTO FALLBACK (final22), under the form, always. */}
      <p className="lf__mail">
        Or email <a href={`mailto:${FORM_EMAIL}`}>{FORM_EMAIL}</a>
      </p>
    </form>
  );
}
