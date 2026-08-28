import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SecondaryLayout from '../components/SecondaryLayout.jsx';
import { CTA } from '../components/Blocks.jsx';

const MASTER_PORTFOLIO = [
  { id: '1', title: 'High-Converting Developer Platform', tag: 'web', badge: 'React / FastAPI', thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80' },
  { id: '2', title: 'Real-Time Digital Insurance Hub', tag: 'web', badge: 'React / Webhooks', thumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80' },
  { id: '3', title: 'Artisanal Perfumery Identity & Packaging', tag: 'branding', badge: 'Brand & Packaging', thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80' },
  { id: '4', title: 'Enterprise AI Tech Design System', tag: 'branding', badge: 'Rebrand & Guidelines', thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80' },
  { id: '5', title: 'Omnichannel B2B Outbound Lead Engine', tag: 'marketing', badge: 'Lead Funnels', thumbnail: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80' },
  { id: '6', title: 'Enterprise Payroll Integration Pipeline', tag: 'automation', badge: 'Python / Fuzzy Logic', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' },
];

export default function ServicePage({ data }) {
  const [openFaq, setOpenFaq] = useState(null);
  const filteredPortfolio = MASTER_PORTFOLIO.filter(item => item.tag === data.tag);

  return (
    <SecondaryLayout title={data.metaTitle} description={data.metaDesc}>

      {/* 1. DARK HERO SECTION */}
      <section className="band band--ink" style={{ background: 'var(--ink)', color: '#ffffff', padding: '100px 0 72px' }}>
        <div className="wrap">
          {/* Badge Pill */}
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'var(--beacon)',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '6px 14px',
                borderRadius: '50px',
                fontFamily: 'var(--mono)'
              }}
            >
              ✓ {data.badge || 'DIGITAL SERVICE SPECIFICATION'}
            </span>
          </div>

          <h1 className="h-xl" style={{ color: '#ffffff', marginBottom: '20px', maxWidth: '880px' }}>
            {data.heroHeadline}<span style={{ color: 'var(--beacon)' }}>.</span>
          </h1>

          <p className="lede" style={{ color: 'var(--text-d)', maxWidth: '720px', fontSize: '19px', lineHeight: '1.6', marginBottom: '36px' }}>
            {data.intro}
          </p>

          <div className="btns" style={{ justifyContent: 'flex-start' }}>
            <Link className="btn btn--go" to="/contact-us">{data.ctaText}</Link>
            <a className="btn btn--line" href="#pricing" style={{ color: '#fff', borderColor: 'var(--line-d)' }}>View Pricing</a>
          </div>

          {/* Core Tech Stack Bar */}
          {data.techStack && data.techStack.length > 0 && (
            <div style={{ borderTop: '1px solid var(--line-d)', marginTop: '48px', paddingTop: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <span style={{ color: 'var(--beacon)', fontFamily: 'var(--mono)', fontWeight: '700', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Core Stack &amp; Platforms
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {data.techStack.map((tool) => (
                    <span
                      key={tool}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--line-d)',
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontFamily: 'var(--mono)',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '6px 14px',
                        borderRadius: '2px'
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. WHAT IS INCLUDED (LIGHT BAND) */}
      <section className="band" style={{ padding: '96px 0' }}>
        <div className="wrap">
          <span className="label">What Is Included</span>
          <h2 className="h-lg" style={{ marginBottom: '36px' }}>
            Built for performance, scalability and results<span style={{ color: 'var(--amber)' }}>.</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {data.included.map(([title, text]) => (
              <div key={title} className="gcard" style={{ background: '#ffffff', border: '1px solid var(--line)', padding: '28px 24px' }}>
                <h4 className="h-md" style={{ color: 'var(--ink)', fontSize: '19px', marginBottom: '10px', lineHeight: '1.2' }}>
                  {title}
                </h4>
                <p style={{ color: 'var(--steel)', fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DELIVERABLES BREAKDOWN (DARK BAND) */}
      <section className="band band--ink" style={{ background: 'var(--ink)', color: '#ffffff', padding: '96px 0' }}>
        <div className="wrap">
          <span className="label" style={{ color: 'var(--paper)' }}>Deliverables Breakdown</span>
          <h2 className="h-lg" style={{ color: '#fff', marginBottom: '36px' }}>
            {data.deliverablesTitle || 'Tailored solutions built for your exact operational needs'}<span style={{ color: 'var(--beacon)' }}>.</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {data.types.map(([title, text]) => (
              <div key={title} className="sig" style={{ background: 'var(--ink-2)', border: '1px solid var(--line-d)', padding: '28px 24px' }}>
                <h4 className="h-md" style={{ color: '#ffffff', fontSize: '19px', marginBottom: '10px', lineHeight: '1.2' }}>
                  {title}
                </h4>
                <p style={{ color: 'var(--text-d)', fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXECUTION PROCESS (CONCRETE) */}
      <section className="band band--concrete" style={{ background: 'var(--concrete)', padding: '96px 0' }}>
        <div className="wrap">
          <span className="label">Our Execution Process</span>
          <h2 className="h-lg" style={{ marginBottom: '36px' }}>
            A predictable path from initial concept to launch<span style={{ color: 'var(--amber)' }}>.</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {data.process.map(([step, desc], i) => (
              <div key={step} className="gcard" style={{ background: '#ffffff', border: '1px solid var(--line)', padding: '24px' }}>
                <span style={{ color: 'var(--amber)', fontFamily: 'var(--mono)', fontWeight: '700', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                  STEP 0{i + 1}
                </span>
                <h4 className="h-md" style={{ color: 'var(--ink)', fontSize: '18px', margin: '0 0 8px 0', lineHeight: '1.2' }}>
                  {step}
                </h4>
                <p style={{ color: 'var(--steel)', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO PROOF (DARK BAND) */}
      {filteredPortfolio.length > 0 && (
        <section className="band band--ink" style={{ background: 'var(--ink)', color: '#ffffff', padding: '96px 0' }}>
          <div className="wrap">
            <span className="label" style={{ color: 'var(--paper)' }}>Portfolio Proof</span>
            <h2 className="h-lg" style={{ color: '#fff', marginBottom: '36px' }}>
              Selected recent deliverables<span style={{ color: 'var(--beacon)' }}>.</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '36px' }}>
              {filteredPortfolio.map((proj) => (
                <div key={proj.id} className="gcard" style={{ background: 'var(--ink-2)', border: '1px solid var(--line-d)', padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: '200px', position: 'relative' }}>
                    <img src={proj.thumbnail} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--beacon)', color: 'var(--ink)', fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '2px', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>
                      {proj.badge}
                    </span>
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    <h4 className="h-md" style={{ margin: 0, fontSize: '17px', color: '#ffffff', lineHeight: '1.3' }}>
                      {proj.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link className="btn btn--line" to="/portfolio" style={{ color: '#fff', borderColor: 'var(--line-d)' }}>
                View Full Portfolio →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. PRICING SNAPSHOT (CONCRETE) */}
      <section id="pricing" className="band band--concrete" style={{ background: 'var(--concrete)', padding: '80px 0' }}>
        <div className="wrap">
          <div style={{ background: 'var(--ink)', border: '2px solid var(--beacon)', padding: 'clamp(28px, 5vw, 44px)', borderRadius: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <span style={{ color: 'var(--beacon)', fontFamily: 'var(--mono)', fontWeight: '700', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Transparent Pricing
              </span>
              <h3 className="h-lg" style={{ margin: '0 0 8px 0', color: '#ffffff', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
                Starting at {data.startingPrice}<span style={{ color: 'var(--beacon)' }}>.</span>
              </h3>
              <p style={{ margin: 0, color: 'var(--text-d)', fontSize: '15px' }}>
                Full ownership, zero lock-in, and clear deliverables agreed upfront.
              </p>
            </div>
            <Link className="btn btn--go" to="/packages">See Package Breakdown →</Link>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION (DARK BAND) */}
      {data.faq && data.faq.length > 0 && (
        <section className="band band--ink" style={{ background: 'var(--ink)', color: '#ffffff', padding: '96px 0' }}>
          <div className="wrap">
            <span className="label" style={{ color: 'var(--paper)' }}>Frequently Asked Questions</span>
            <h2 className="h-lg" style={{ color: '#fff', marginBottom: '36px' }}>
              Clear answers before we write a single line of code<span style={{ color: 'var(--beacon)' }}>.</span>
            </h2>

            <div style={{ borderTop: '1px solid var(--line-d)' }}>
              {data.faq.map(([q, a], idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={q} style={{ borderBottom: '1px solid var(--line-d)' }}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '22px 0',
                        background: 'transparent',
                        border: 'none',
                        color: '#ffffff',
                        fontFamily: 'var(--disp)',
                        fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        lineHeight: '1.2'
                      }}
                    >
                      <span style={{ color: isOpen ? 'var(--beacon)' : '#ffffff', transition: 'color 0.15s ease' }}>{q}</span>
                      <span style={{ color: 'var(--beacon)', fontFamily: 'var(--mono)', fontSize: '20px', fontWeight: '400', flex: '0 0 auto' }}>
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 0 22px', color: 'var(--text-d)', fontSize: '15.5px', lineHeight: '1.65' }}>
                        <p style={{ margin: 0, maxWidth: '68ch' }}>{a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 8. BOTTOM CTA */}
      <CTA title="Ready to start your project?" buttonText={data.ctaText} />
    </SecondaryLayout>
  );
}
