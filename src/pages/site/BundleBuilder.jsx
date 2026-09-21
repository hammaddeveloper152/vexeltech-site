import React, { useEffect, useRef, useState } from 'react';
import { FIGURES, bundleSaving, money } from '../../content/pricing.js';
import '../../styles/bundle.css';

/* THE BUNDLE BUILDER, /pricing's engagement device (2026-09-21, the user's
   choice; built for this page and used nowhere else, BUILD-LAW 0).

   Pick a branding tier and whether the website comes with it; the total
   COUNTS to its new figure. Every number is a token from pricing.js, so
   nothing here is typed and nothing can drift from the ladder:

     Advance + website   parts $1,149, the bundle $999, the $150 saving
     Basic + website     $999 at the parts' own prices; the bundle saving is
                         Advance with the website, and the builder says so
     one part alone      that part's price
     nothing             an instruction, no figure

   No yellow: the chosen option takes a white edge. The ladder above spends
   the page's accent, and this section does not compete with it. The count is
   the counter row's device on its own terms (transform-free: the figure is
   text), 400ms on the reveal curve, and instant under reduced motion. The
   live region announces the settled total only. */

const BRANDING = [
  { id: 'none', label: 'No branding', price: 0 },
  { id: 'basic', label: 'Basic', price: FIGURES.brandingBasic },
  { id: 'advance', label: 'Advance', price: FIGURES.brandingAdvance },
];

const easeReveal = (t) => {
  // cubic-bezier(.23,1,.32,1), solved for x by Newton's method.
  const cx = 3 * 0.23, bx = 3 * (1 - 0.23) - cx, ax = 1 - cx - bx;
  const cy = 3 * 1, by = 3 * (0.32 - 1) - cy, ay = 1 - cy - by;
  let x = t;
  for (let i = 0; i < 6; i++) {
    const f = ((ax * x + bx) * x + cx) * x - t;
    const d = (3 * ax * x + 2 * bx) * x + cx;
    if (Math.abs(d) < 1e-6) break;
    x -= f / d;
  }
  return ((ay * x + by) * x + cy) * x;
};

function useCount(target) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = from.current;
    if (reduce || start === target) {
      from.current = target;
      setShown(target);
      return undefined;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / 400);
      const v = Math.round(start + (target - start) * easeReveal(t));
      setShown(v);
      from.current = v;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return shown;
}

export default function BundleBuilder() {
  const [branding, setBranding] = useState('advance');
  const [website, setWebsite] = useState(true);

  const b = BRANDING.find((x) => x.id === branding);
  const parts = b.price + (website ? FIGURES.website : 0);
  const deal = bundleSaving();
  const bundled = branding === 'advance' && website && deal;
  const total = bundled ? FIGURES.bundle : parts;
  const shown = useCount(total);

  let note = null;
  if (!parts) note = 'Pick a branding tier, the website, or both.';
  else if (branding === 'basic' && website) {
    note = `Basic and the website come to ${money(parts)} at their own prices. The ${money(
      deal ? deal.saving : null
    )} bundle saving is Advance with the website.`;
  }

  return (
    <section className="vt bb" aria-labelledby="bb-h">
      <div className="bb__in">
        <h2 className="bb__h" id="bb-h">
          Your total
        </h2>

        <div className="bb__grid">
          <div className="bb__choose">
            <fieldset className="bb__set">
              <legend className="bb__legend">Branding</legend>
              <div className="bb__options">
                {BRANDING.map((o) => (
                  <label className="bb__opt" key={o.id} data-on={branding === o.id ? 'true' : 'false'}>
                    <input
                      className="bb__input"
                      type="radio"
                      name="bb-branding"
                      value={o.id}
                      checked={branding === o.id}
                      onChange={() => setBranding(o.id)}
                    />
                    <span className="bb__opt-t">{o.label}</span>
                    {o.price ? <span className="bb__opt-p">{money(o.price)}</span> : null}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="bb__set">
              <legend className="bb__legend">Website</legend>
              <div className="bb__options">
                <label className="bb__opt" data-on={website ? 'true' : 'false'}>
                  <input
                    className="bb__input"
                    type="checkbox"
                    checked={website}
                    onChange={(e) => setWebsite(e.target.checked)}
                  />
                  <span className="bb__opt-t">Website</span>
                  <span className="bb__opt-p">{money(FIGURES.website)}</span>
                </label>
              </div>
            </fieldset>
          </div>

          <div className="bb__sum">
            <dl className="bb__lines">
              {bundled ? (
                <>
                  <div className="bb__line">
                    <dt>Parts</dt>
                    <dd>{money(deal.separately)}</dd>
                  </div>
                  <div className="bb__line">
                    <dt>Bundle</dt>
                    <dd>{money(FIGURES.bundle)}</dd>
                  </div>
                  <div className="bb__line bb__line--save">
                    <dt>You save</dt>
                    <dd>{money(deal.saving)}</dd>
                  </div>
                </>
              ) : null}
            </dl>

            <p className="bb__total">
              <span className="bb__total-k">Total</span>
              <span className="bb__total-n" aria-hidden="true">
                {money(shown)}
              </span>
              {/* The settled figure, announced once, not every frame of the
                  count. */}
              <span className="skip-h" aria-live="polite">
                {parts ? money(total) : 'No total yet'}
              </span>
            </p>

            {note ? <p className="bb__note">{note}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
