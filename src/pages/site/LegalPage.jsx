import React from 'react';
import { Link } from 'react-router-dom';
import Shell from './Shell.jsx';
import { IconArrowRight } from '../../components/site/Icons.jsx';
import { PRIVACY, TERMS } from './legalContent.js';
import './legal.css';

/* THE PRIVACY POLICY AND THE TERMS OF SERVICE, on the site's shell,
   2026-09-25 (the founder's legacy rebuild). They were the last pages in the
   legacy tree; with them and /thanks rebuilt, the legacy stylesheet and its
   layout are deleted.

   THE SHAPE: the bar, the dark ground, one text column at reading width in
   the site's type and colours, and the footer block (no form, as on About).
   Every word is the legacy page's (legalContent.js, and the strings below).
   What did not come over is presentation, not copy: the emoji before each
   highlight, the "✓" before the badge, the "|" separators, the "→" after
   the links (the icon set's arrow stands there), and the sticky table of
   contents, whose entries were the section headings, which are all still
   here.

   noindex, as the legacy shell set it: kept out of search and the sitemap. */

const EMAIL = 'info@vexeltechsolutions.com';

const ENTITY = [
  { label: 'Registered State', value: 'Texas, United States' },
  { label: 'Physical Address', value: 'Richmond, TX 77406, USA' },
  { label: 'Legal & Privacy Desk', value: EMAIL, href: `mailto:${EMAIL}` },
  { label: 'Direct Line', value: '(385) 284-3265', href: 'tel:+13852843265' },
];

export default function LegalPage({ kind }) {
  const isPrivacy = kind === 'privacy';
  const data = isPrivacy ? PRIVACY : TERMS;

  return (
    <Shell
      title={`${data.title} | VexelTech`}
      description={data.subtitle}
      footerForm={false}
      noindex
    >
      <section className="vt legal" aria-labelledby="legal-h">
        <div className="legal__in">
          <p className="legal__badge lbl">{data.badge}</p>
          <h1 className="legal__h" id="legal-h">
            {data.title}
          </h1>
          <p className="legal__lead">{data.subtitle}</p>

          <ul className="legal__meta">
            <li className="lbl">{data.effective}</li>
            <li className="lbl">{data.updated}</li>
            <li>
              <a className="legal__link lbl" href={`mailto:${EMAIL}`}>
                Legal Questions
                <IconArrowRight className="i i--sm" />
              </a>
            </li>
          </ul>

          <dl className="legal__highlights">
            {data.highlights.map((h) => (
              <div className="legal__hl" key={h.title}>
                <dt className="legal__hl-t">{h.title}</dt>
                <dd className="legal__hl-d">{h.desc}</dd>
              </div>
            ))}
          </dl>

          <div className="legal__summary">
            <p className="legal__summary-l lbl">Plain Language Summary</p>
            <p className="legal__p">{data.intro}</p>
          </div>

          {data.sections.map((sec) => (
            <section className="legal__sec" id={`section-${sec.id}`} key={sec.id} aria-labelledby={`legal-s${sec.id}`}>
              <h2 className="legal__h2" id={`legal-s${sec.id}`}>
                {sec.title}
              </h2>
              {sec.content.map((block, i) => (
                <div className="legal__block" key={i}>
                  <h3 className="legal__h3">{block.sub}</h3>
                  <p className="legal__p">{block.body}</p>
                </div>
              ))}
            </section>
          ))}

          <p className="legal__p legal__notice">
            <strong>Jurisdiction Notice:</strong> This {data.title} is governed by the laws of the State of Texas,
            United States. If any provision of this document is found to be unenforceable, the remaining provisions
            shall remain in full force and effect. This document was last reviewed for compliance with CAN-SPAM, CCPA
            (California Consumer Privacy Act), and GDPR (General Data Protection Regulation) as of its effective date.
            For jurisdiction-specific questions, please consult a licensed attorney.
          </p>

          <section className="legal__entity" aria-labelledby="legal-entity-h">
            <p className="lbl legal__entity-l">Official Legal Entity</p>
            <h2 className="legal__h2" id="legal-entity-h">
              Vexel Scales LLC
            </h2>
            <p className="legal__p">
              Operating as <strong>VexelTech Solutions</strong>. A Texas limited liability company. All contracts,
              invoices, and legal notices are issued under Vexel Scales LLC.
            </p>
            <dl className="legal__facts">
              {ENTITY.map((item) => (
                <div className="legal__fact" key={item.label}>
                  <dt className="lbl">{item.label}</dt>
                  <dd>
                    {item.href ? (
                      <a className="legal__link" href={item.href}>
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <nav className="legal__cross" aria-label="Legal documents">
            <Link className="legal__link" to={isPrivacy ? '/terms-of-service' : '/privacy-policy'}>
              {isPrivacy ? 'View Terms of Service' : 'View Privacy Policy'}
              <IconArrowRight className="i i--sm" />
            </Link>
            <Link className="legal__link" to="/contact-us">
              Contact Legal Desk
              <IconArrowRight className="i i--sm" />
            </Link>
          </nav>
          <p className="legal__copy lbl">© 2026 Vexel Scales LLC · All rights reserved</p>
        </div>
      </section>
    </Shell>
  );
}
