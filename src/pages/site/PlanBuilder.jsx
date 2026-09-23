import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  Broom,
  ChartBar,
  Check,
  ClockCounterClockwise,
  DotsThree,
  FlowArrow,
  Globe,
  HardHat,
  House,
  Monitor,
  PhoneCall,
  Pipe,
  Plant,
  Plug,
  Stamp,
  Thermometer,
  Tooth,
} from '@phosphor-icons/react';
import { FIGURES, bundleSaving, money } from '../../content/pricing.js';
import '../../styles/plan.css';

/* THE PLAN BUILDER, /pricing, 2026-09-22 (the founder's brief). It replaced
   the tabbed package board and the toggle receipt.

   Four steps and a result in one frame. The SECTION has no ground of its own:
   the page's drift lands on arc-black (#0E1220) at the builder and holds
   (2026-09-22; it was flat arc #0D47BD, now the rim light only).

   THE BUILDER HAS A BODY, 2026-09-22 (the founder): the left column is one
   lit-near panel (#1E1F22, hairline, 12px, the two lights, 48px of inner
   padding at 1280 and 24px at 390) standing on that drift, and the answer
   cards inside it are lit-raised (#2B2D31) with their own hairline. Nothing
   is translucent — the veil the cards used to take (6% white over the ground)
   and their 45% white border are both gone for solid values, so every surface
   in here is a painted colour that can be measured rather than a composite.
   The progress line runs along the panel's top inner edge. The five
   `plan-1` to `plan-5.webp` object slots are deleted: cost-1 to cost-4 and
   the mascot are the site's only artwork.

   Left column (60%): the progress line, the question, the helper, the
   answers. Right column (40%): the TICKET, a cream work order that fills as
   the reader answers. At 390 the ticket is a sticky bottom bar that opens as
   a sheet.

   DECIDED WITH THE USER BEFORE BUILDING, and recorded in DESIGN.md:
   - Nearest passing colours, chosen on the old arc ground and kept: Next is
     a WHITE outline (asphalt was
     2.24:1); the helper line is bone (steel-lift was 3.04:1); the stage line
     on the ticket is steel (steel-dark was 3.08:1 on cream).
   - BUILD-LAW 0: glyphs used nowhere else on the site. The brief's Wrench,
     Browser, Robot, PaintBrush, AppWindow, Target and Lightning are all
     already on home or /services, so the builder uses Pipe, Plug, Globe,
     Stamp, Monitor, ChartBar and FlowArrow (and Plant: Seedling is not in
     this Phosphor).
   - No pin and no wheel capture: the builder is a normal section.
   - Check on selected cards may repeat inside this component (a state glyph).

   The founder's copy is verbatim. The Netlify form "plan" is declared in
   index.html and posted from here. */

const TRADES = [
  { id: 'plumbing', label: 'Plumbing', Icon: Pipe },
  { id: 'hvac', label: 'HVAC', Icon: Thermometer },
  { id: 'electrical', label: 'Electrical', Icon: Plug },
  { id: 'roofing', label: 'Roofing', Icon: House },
  { id: 'dental', label: 'Dental', Icon: Tooth },
  { id: 'cleaning', label: 'Cleaning', Icon: Broom },
  { id: 'contracting', label: 'Contracting', Icon: HardHat },
  { id: 'other', label: 'Something else', Icon: DotsThree },
];

const STAGES = [
  { id: 'start', title: 'Just starting out', line: 'No logo, no site, first customers.', Icon: Plant },
  { id: 'logo', title: 'Have a logo, no real website', line: 'People look you up and find nothing.', Icon: Globe },
  { id: 'dated', title: 'Have both, they look dated', line: 'They were fine five years ago.', Icon: ClockCounterClockwise },
  { id: 'calls', title: 'Set up, need more calls', line: 'The phone should ring more than it does.', Icon: PhoneCall },
];

const SERVICES = [
  { id: 'branding', title: 'Branding', Icon: Stamp },
  { id: 'website', title: 'Website', Icon: Monitor },
  { id: 'marketing', title: 'Marketing', Icon: ChartBar },
  { id: 'automation', title: 'Automation', Icon: FlowArrow },
];

const STEPS = [
  { q: 'What kind of work do you do?', helper: 'Pick the closest.' },
  { q: 'Where are you right now?', helper: null },
  { q: 'What should we take off your plate?', helper: 'Pick everything that applies.' },
  { q: 'Where do we send it?', helper: null },
];

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/* The ticket's lines, derived. `bundle` is true when Advance and the website
   are both on; Basic with the website does not bundle. */
function ticket(a) {
  const lines = [];
  const s = a.services;
  const deal = bundleSaving();
  const bundle = s.branding && a.tier === 'advance' && s.website && !!deal;
  if (bundle) {
    lines.push({ id: 'bundle', label: 'Website + Advance branding, bundle', price: FIGURES.bundle, save: deal.saving });
  } else {
    if (s.branding)
      lines.push({
        id: 'branding',
        label: `Branding ${a.tier === 'basic' ? 'Basic' : 'Advance'}`,
        price: a.tier === 'basic' ? FIGURES.brandingBasic : FIGURES.brandingAdvance,
      });
    if (s.website) lines.push({ id: 'website', label: 'Website', price: FIGURES.website });
  }
  if (s.marketing)
    lines.push({ id: 'marketing', label: 'Marketing, scoped on a call', sub: 'moves with ad spend and locations', price: null });
  if (s.automation)
    lines.push({ id: 'automation', label: 'Automation, scoped on a call', sub: 'moves with the tools we connect', price: null });
  const total = lines.reduce((n, l) => n + (l.price || 0), 0);
  return { lines, total, bundle, priced: lines.some((l) => l.price !== null) };
}

function rationale(a, t) {
  const trade = TRADES.find((x) => x.id === a.trade);
  const stage = STAGES.find((x) => x.id === a.stage);
  const head = `${trade ? trade.label : ''}, ${stage ? stage.title.toLowerCase() : ''}.`;
  const priced = t.lines.filter((l) => l.price !== null).map((l) => (l.id === 'bundle' ? 'Website + Advance branding' : l.label));
  const start = priced.length ? `Start with ${priced.join(' and ')}.` : 'Start with a call.';
  const scoped = a.services.marketing || a.services.automation ? ' Marketing and Automation get scoped on the call.' : '';
  return `${head} ${start}${scoped}`;
}

/* A card or chip: a button with aria-pressed, the Check when selected, and
   the select pulse (1 to 1.04 to 1 over 0.25s). */
function Choice({ pressed, onPick, className, children, label }) {
  const ref = useRef(null);
  const pick = () => {
    if (!reduced() && ref.current) {
      gsap.fromTo(ref.current, { scale: 1 }, { scale: 1.04, duration: 0.125, yoyo: true, repeat: 1, ease: 'power1.out' });
    }
    onPick();
  };
  return (
    <button
      ref={ref}
      type="button"
      className={className}
      aria-pressed={pressed}
      aria-label={label}
      data-choice=""
      onClick={pick}
    >
      {children}
      {pressed ? <Check className="plan__check" weight="bold" aria-hidden="true" /> : null}
    </button>
  );
}

/* `heading`: a visible section heading, 2026-09-24. The pricing rebuild puts
   the builder under "Not sure?" with the founder's heading; without it the
   section keeps its visually hidden name. */
export default function PlanBuilder({ heading = null }) {
  const [step, setStep] = useState(0); // 0..3 the questions, 4 the result
  const [a, setA] = useState({
    trade: null,
    stage: null,
    services: { branding: false, website: false, marketing: false, automation: false },
    tier: 'advance',
    name: '',
    email: '',
    phone: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed
  const [sheet, setSheet] = useState(false);
  const [shownTotal, setShownTotal] = useState(0);

  const qRef = useRef(null);
  const fillRef = useRef(null);
  const nodeRefs = useRef([]);
  const lineRefs = useRef({});
  const primaryRef = useRef(null);
  const busy = useRef(false);

  const t = ticket(a);
  const answered =
    step === 0 ? !!a.trade :
    step === 1 ? !!a.stage :
    step === 2 ? Object.values(a.services).some(Boolean) :
    step === 3 ? a.name.trim() && validEmail(a.email) && a.phone.trim() :
    true;

  /* ---- The progress line: fill tweens 0.4s, the reached node pulses. ---- */
  useLayoutEffect(() => {
    /* Four nodes at 0, 1/3, 2/3 and 1: the fill reaches the node of the step
       the reader is on, and is full on the last step and the result. */
    const done = Math.min(step, 3) / 3;
    if (fillRef.current) {
      gsap.to(fillRef.current, { scaleX: done, duration: reduced() ? 0.15 : 0.4, ease: 'power2.out' });
    }
    const node = nodeRefs.current[Math.min(step, 3)];
    if (node && !reduced()) gsap.fromTo(node, { scale: 1 }, { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1, ease: 'power1.out' });
  }, [step]);

  /* ---- The incoming question and its cards. ---- */
  useLayoutEffect(() => {
    const el = qRef.current;
    if (!el) return;
    if (reduced()) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.15 });
      return;
    }
    gsap.killTweensOf(el);
    gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
    const cards = el.querySelectorAll('[data-choice], .plan__field');
    gsap.fromTo(
      cards,
      { y: 24, scale: 0.98, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.45, ease: 'power3.out', stagger: 0.07, delay: 0.1 }
    );
  }, [step]);

  /* ---- The result: the total counts up over 0.6s, then the button lifts. -- */
  useEffect(() => {
    if (step !== 4) {
      setShownTotal(t.total);
      return undefined;
    }
    if (reduced()) {
      setShownTotal(t.total);
      return undefined;
    }
    const o = { v: 0 };
    const tw = gsap.to(o, {
      v: t.total,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => setShownTotal(Math.round(o.v)),
      onComplete: () => {
        if (primaryRef.current) gsap.fromTo(primaryRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
      },
    });
    return () => tw.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (step !== 4) setShownTotal(t.total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.total]);

  /* ---- A ticket line arrives: scale from 0.9, y from 8, back.out. ---- */
  const seen = useRef(new Set());
  const prevBundle = useRef(false);
  useLayoutEffect(() => {
    const ids = t.lines.map((l) => l.id);
    /* THE MERGE: Advance and the website become one line. The two parts
       are drawn toward each other over 0.6s (power2.inOut) from where they
       stood; the bundle line resolves in their place. Splitting runs it
       back: the parts move out from the middle. */
    const merged = t.bundle && !prevBundle.current;
    const split = !t.bundle && prevBundle.current;
    prevBundle.current = t.bundle;
    ids.forEach((id) => {
      const el = lineRefs.current[id];
      if (!el) return;
      if (reduced()) {
        if (!seen.current.has(id)) gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.15 });
        return;
      }
      if (merged && id === 'bundle') {
        gsap.fromTo(el, { scaleY: 0.6, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.6, ease: 'power2.inOut' });
      } else if (split && (id === 'branding' || id === 'website')) {
        gsap.fromTo(el, { y: id === 'branding' ? 20 : -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.inOut' });
      } else if (!seen.current.has(id)) {
        gsap.fromTo(el, { scale: 0.9, y: 8, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.6)' });
      }
    });
    seen.current = new Set(ids);
  }, [t.lines.map((l) => l.id).join(','), t.bundle]);

  /* Before the bundle line replaces them, the two parts draw together. */
  const toggleService = (id) => {
    const next = { ...a.services, [id]: !a.services[id] };
    const willBundle = next.branding && a.tier === 'advance' && next.website;
    if (willBundle && !t.bundle && !reduced()) {
      const b = lineRefs.current.branding;
      const w = lineRefs.current.website;
      const parts = [b, w].filter(Boolean);
      if (parts.length === 2) {
        const gap = w.getBoundingClientRect().top - b.getBoundingClientRect().top;
        gsap.to(b, { y: gap / 2, duration: 0.6, ease: 'power2.inOut' });
        gsap.to(w, { y: -gap / 2, opacity: 0, duration: 0.6, ease: 'power2.inOut', onComplete: () => setA((c) => ({ ...c, services: next })) });
        return;
      }
    }
    setA((c) => ({ ...c, services: next }));
  };

  const setTier = (tier) => {
    const willBundle = a.services.branding && tier === 'advance' && a.services.website;
    if (willBundle && !t.bundle && !reduced()) {
      const b = lineRefs.current.branding;
      const w = lineRefs.current.website;
      if (b && w) {
        const gap = w.getBoundingClientRect().top - b.getBoundingClientRect().top;
        gsap.to(b, { y: gap / 2, duration: 0.6, ease: 'power2.inOut' });
        gsap.to(w, { y: -gap / 2, opacity: 0, duration: 0.6, ease: 'power2.inOut', onComplete: () => setA((c) => ({ ...c, tier })) });
        return;
      }
    }
    setA((c) => ({ ...c, tier }));
  };

  /* ---- Moving between steps: out -40 0.4s power2.in, in overlapping 0.15s. */
  const go = (n) => {
    if (busy.current) return;
    const el = qRef.current;
    if (!el || reduced()) {
      setStep(n);
      return;
    }
    busy.current = true;
    gsap.to(el, { y: -40, opacity: 0, duration: 0.4, ease: 'power2.in' });
    setTimeout(() => {
      setStep(n);
      busy.current = false;
    }, 250);
  };

  const next = () => {
    if (!answered) return;
    go(step + 1);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && step < 4 && answered) {
      e.preventDefault();
      next();
      return;
    }
    /* Arrow keys move between the answer buttons. */
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    if (!e.target.matches('[data-choice]')) return;
    const all = [...qRef.current.querySelectorAll('[data-choice]')];
    const i = all.indexOf(e.target);
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    const n = all[(i + d + all.length) % all.length];
    if (n) {
      e.preventDefault();
      n.focus();
    }
  };

  const restart = () => {
    setStatus('idle');
    setA({
      trade: null,
      stage: null,
      services: { branding: false, website: false, marketing: false, automation: false },
      tier: 'advance',
      name: '',
      email: '',
      phone: '',
    });
    go(0);
  };

  /* ---- The post: Netlify form "plan", url-encoded, to "/". ---- */
  const send = async () => {
    if (status === 'sending') return;
    setStatus('sending');
    const trade = TRADES.find((x) => x.id === a.trade);
    const stage = STAGES.find((x) => x.id === a.stage);
    const plan = [
      `WORK ORDER: ${trade ? trade.label : ''}`,
      stage ? stage.title : '',
      ...t.lines.map((l) =>
        l.id === 'bundle'
          ? `${l.label} ${money(l.price)} (saves ${money(l.save)})`
          : `${l.label}${l.price !== null ? ` ${money(l.price)}` : ''}${l.sub ? ` (${l.sub})` : ''}`
      ),
      t.priced ? `Total: ${money(t.total)}` : 'Total: start with a call',
    ]
      .filter(Boolean)
      .join('\n');
    const body = new URLSearchParams({ 'form-name': 'plan', name: a.name, email: a.email, phone: a.phone, plan });
    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      setStatus(r.ok ? 'sent' : 'failed');
    } catch {
      setStatus('failed');
    }
  };

  const trade = TRADES.find((x) => x.id === a.trade);
  const stage = STAGES.find((x) => x.id === a.stage);
  /* THE 390 SHEET'S BAR still waits for the first answer: a 64px sticky bar
     across the bottom of a phone, saying nothing, is a cost the desktop
     column does not pay. */
  const showBar = !!a.trade;

  /* A render function, not a component: declared as a component inside the
     render it would be a new type every render, and React would remount the
     ticket (and restart its line animations) on every keystroke. */
  const renderTicket = (inSheet = false) => (
    <div className="plan__ticket" data-sheet={inSheet ? 'true' : 'false'}>
      <p className="plan__ticket-k">Work order</p>
      {/* THE EMPTY STATE, from step 1: the ticket is mounted before there is
          anything on it, so the panel has something opposite it on every
          step. One line, steel on cream at 7.20:1. The trade line is Moldie
          and would otherwise render as an empty paragraph holding its own
          height, which is a reservation rather than a state. */}
      {trade ? (
        <p className="plan__ticket-trade">{trade.label}</p>
      ) : (
        <p className="plan__ticket-empty">Your plan starts here.</p>
      )}
      {stage ? <p className="plan__ticket-stage">{stage.title}</p> : null}
      {t.lines.length ? (
        <ul className="plan__ticket-lines">
          {t.lines.map((l) => (
            <li
              className="plan__tl"
              key={l.id}
              ref={inSheet ? undefined : (el) => (lineRefs.current[l.id] = el)}
            >
              <span className="plan__tl-t">
                {l.label}
                {l.save ? <span className="plan__tl-save">Saves {money(l.save)}</span> : null}
                {l.sub ? <span className="plan__tl-sub">{l.sub}</span> : null}
              </span>
              {l.price !== null ? <span className="plan__tl-p">{money(l.price)}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
      {t.priced ? (
        <p className="plan__total">
          <span className="plan__total-k">Total</span>
          <span className="plan__total-n">{money(step === 4 ? shownTotal : t.total)}</span>
        </p>
      ) : null}
    </div>
  );

  return (
    <section className="vt plan colour-band" aria-labelledby="plan-h" onKeyDown={onKeyDown}>
      {heading ? (
        <div className="plan__head">
          <h2 className="plan__h" id="plan-h">
            {heading}
          </h2>
        </div>
      ) : (
        <h2 className="skip-h" id="plan-h">
          The plan builder
        </h2>
      )}
      <div className="plan__in">
        <div className="plan__main">
          {/* The progress line: four nodes, a bone hairline, the fill yellow. */}
          <div className="plan__progress" aria-hidden="true">
            <span className="plan__track" />
            <span className="plan__fill" ref={fillRef} />
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="plan__node"
                style={{ left: `${(i / 3) * 100}%` }}
                data-on={step >= i ? 'true' : 'false'}
                ref={(el) => (nodeRefs.current[i] = el)}
              />
            ))}
          </div>
          <p className="skip-h" aria-live="polite">
            {step < 4 ? `Step ${step + 1} of 4` : 'Your plan'}
          </p>

          <div className="plan__stage" ref={qRef} key={step}>
            {step < 4 ? (
              <>
                <p className="plan__q" tabIndex={-1}>
                  {STEPS[step].q}
                </p>
                {STEPS[step].helper ? <p className="plan__help">{STEPS[step].helper}</p> : null}
              </>
            ) : (
              <>
                <p className="plan__q" tabIndex={-1}>
                  Here&apos;s your plan.
                </p>
                <p className="plan__why">{rationale(a, t)}</p>
              </>
            )}

            {step === 0 ? (
              <div className="plan__chips">
                {TRADES.map(({ id, label, Icon }) => (
                  <Choice
                    key={id}
                    className="plan__chip"
                    pressed={a.trade === id}
                    onPick={() => setA((c) => ({ ...c, trade: id }))}
                  >
                    <Icon className="plan__ci" aria-hidden="true" />
                    {label}
                  </Choice>
                ))}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="plan__cards">
                {STAGES.map(({ id, title, line, Icon }) => (
                  <Choice
                    key={id}
                    className="plan__card"
                    pressed={a.stage === id}
                    onPick={() => setA((c) => ({ ...c, stage: id }))}
                  >
                    <Icon className="plan__card-i" aria-hidden="true" />
                    <span className="plan__card-t">{title}</span>
                    <span className="plan__card-l">{line}</span>
                  </Choice>
                ))}
              </div>
            ) : null}

            {/* `--svc`: this grid's cells hold a card AND, for Branding, the
                tier chips under it, so the row must not stretch its siblings
                to the tallest cell. `align-items: start`, step 3 only. */}
            {step === 2 ? (
              <div className="plan__cards plan__cards--svc">
                {SERVICES.map(({ id, title, Icon }) => (
                  <div className="plan__svc" key={id}>
                    <Choice className="plan__card" pressed={a.services[id]} onPick={() => toggleService(id)}>
                      <Icon className="plan__card-i" aria-hidden="true" />
                      <span className="plan__card-t">{title}</span>
                    </Choice>
                    {id === 'branding' && a.services.branding ? (
                      <div className="plan__tiers" role="group" aria-label="Branding package">
                        <Choice className="plan__chip plan__chip--tier" pressed={a.tier === 'basic'} onPick={() => setTier('basic')}>
                          Basic {money(FIGURES.brandingBasic)}
                        </Choice>
                        <Choice className="plan__chip plan__chip--tier" pressed={a.tier === 'advance'} onPick={() => setTier('advance')}>
                          Advance {money(FIGURES.brandingAdvance)}
                        </Choice>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="plan__fields">
                {[
                  ['name', 'Name', 'text', 'name'],
                  ['email', 'Email', 'email', 'email'],
                  ['phone', 'Phone', 'tel', 'tel'],
                ].map(([id, label, type, auto]) => (
                  <p className="plan__field" key={id}>
                    <label className="plan__label" htmlFor={`plan-${id}`}>
                      {label}
                    </label>
                    <input
                      className="plan__input"
                      id={`plan-${id}`}
                      name={id}
                      type={type}
                      autoComplete={auto}
                      value={a[id]}
                      onChange={(e) => setA((c) => ({ ...c, [id]: e.target.value }))}
                    />
                  </p>
                ))}
              </div>
            ) : null}

            {step < 4 ? (
              <div className="plan__nav">
                <button type="button" className="plan__next" disabled={!answered} onClick={next}>
                  {step === 3 ? 'Show my plan' : 'Next'}
                </button>
                {step > 0 ? (
                  <button type="button" className="plan__back" onClick={() => go(step - 1)}>
                    Back
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="plan__nav plan__nav--result">
                {status === 'sent' ? (
                  <p className="plan__ok" role="status">
                    <span aria-hidden="true">&#10003;</span> Message sent.
                  </p>
                ) : (
                  <>
                    <button
                      type="button"
                      className="plan__send"
                      ref={primaryRef}
                      onClick={send}
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? 'Sending' : 'Send this plan to us'}
                    </button>
                    {status === 'failed' ? (
                      <p className="plan__err" role="status">
                        That did not send. Try again in a moment.
                      </p>
                    ) : null}
                  </>
                )}
                <button type="button" className="plan__again" onClick={restart}>
                  Start over
                </button>
              </div>
            )}
          </div>

        </div>

        {/* MOUNTED FROM STEP 1, in its empty state: the panel has something
            opposite it on every step rather than a bare 40% of ground until
            the first answer lands. */}
        <aside className="plan__side" aria-label="Your plan">
          {renderTicket(false)}
        </aside>
      </div>

      {/* 390: the ticket as a sticky bottom bar that opens as a sheet. */}
      {showBar ? (
        <div className="plan__bar">
          <button type="button" className="plan__bar-btn" aria-expanded={sheet} onClick={() => setSheet(true)}>
            <span className="plan__bar-k">Your plan</span>
            <span className="plan__bar-n">{t.priced ? money(t.total) : ''}</span>
          </button>
        </div>
      ) : null}
      {sheet ? (
        <div className="plan__sheet" role="dialog" aria-modal="true" aria-label="Your plan" data-lenis-prevent="">
          <button type="button" className="plan__sheet-close" onClick={() => setSheet(false)}>
            Close
          </button>
          {renderTicket(true)}
        </div>
      ) : null}
    </section>
  );
}
