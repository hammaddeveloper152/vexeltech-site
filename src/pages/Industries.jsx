import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SecondaryLayout from '../components/SecondaryLayout.jsx';

/* ─────────────────────────────────────────────────────────────────
   INDUSTRY DATA
   - icon, name, slug (future dedicated page), pain points, how we
     solve them, and portfolio tags that match Portfolio.jsx industries
───────────────────────────────────────────────────────────────── */
const INDUSTRIES = [
  {
    id: 'ecommerce',
    icon: '🛍️',
    name: 'E-Commerce & D2C',
    shortName: 'E-Commerce',
    headline: 'Turn browsers into buyers — consistently.',
    painPoints: [
      'High cart abandonment with no automated recovery path',
      'Generic Shopify themes that look identical to every competitor',
      'No brand story that earns trust before a customer clicks "buy"',
      'Slow page speeds killing paid ad Quality Scores'
    ],
    solution: 'We rebuild the visual trust layer — custom storefront design, conversion-optimized product storytelling, automated abandoned-cart sequences, and sub-2-second load times that protect your paid traffic spend.',
    stats: [{ num: '28%', label: 'Avg. Conversion Lift' }, { num: '340%', label: 'Review Growth (GoHL)' }],
    portfolioTag: 'Consumer Goods',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'See E-Commerce Work'
  },
  {
    id: 'saas-tech',
    icon: '⚙️',
    name: 'SaaS & Technology',
    shortName: 'SaaS & Tech',
    headline: 'Make a complex product feel instantly understandable.',
    painPoints: [
      'Homepage explains features — not the buyer\'s outcome',
      'No demo-booking flow that pre-qualifies enterprise leads',
      'Design system so inconsistent it undermines product credibility',
      'Zero SEO foundation for long-tail "software for X" queries'
    ],
    solution: 'We engineer outcome-first messaging hierarchies, modular React component systems, and enterprise-grade design tokens that scale with your product. Booking flows built to pre-qualify leads before a single sales call.',
    stats: [{ num: '99/100', label: 'Lighthouse Score' }, { num: '2x', label: 'Organic Lead Growth' }],
    portfolioTag: 'Enterprise Software',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'See SaaS Work'
  },
  {
    id: 'professional-services',
    icon: '💼',
    name: 'Professional Services',
    shortName: 'Pro Services',
    headline: 'Turn expertise into a presence that earns the next call.',
    painPoints: [
      'Website looks 10 years old and undermines premium pricing',
      'No clear differentiation from hundreds of similar firms',
      'Referrals sustain the practice — but scale is stuck',
      'Missing case study proof that validates premium positioning'
    ],
    solution: 'We audit your existing client language, extract genuine differentiators, and build a credibility-first brand system with real proof architecture — case study carousels, testimonial frameworks, and intake funnels that close the gap between visit and conversation.',
    stats: [{ num: '3x', label: 'Inbound Lead Growth' }, { num: '90 days', label: 'Rebrand-to-Leads Timeline' }],
    portfolioTag: 'Software Consulting',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'See Services Work'
  },
  {
    id: 'healthcare-wellness',
    icon: '🏥',
    name: 'Healthcare & Wellness',
    shortName: 'Healthcare',
    headline: 'Clear, confident, and compliant — all three at once.',
    painPoints: [
      'Jargon-heavy copy that confuses instead of reassuring patients',
      'Intake forms that lose leads before a first appointment',
      'No SEO footprint for "near me" and symptom-based searches',
      'Outdated website design that signals low trust at first glance'
    ],
    solution: 'We simplify complex care narratives into approachable, conversion-ready copy. Frictionless intake routing, ADA-accessible design, and local SEO architecture that surfaces your practice for high-intent search queries.',
    stats: [{ num: '180+', label: 'Inbound Bookings/mo.' }, { num: '<2s', label: 'Intake Form Load Time' }],
    portfolioTag: 'Healthcare',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'See Healthcare Work'
  },
  {
    id: 'real-estate',
    icon: '🏠',
    name: 'Real Estate & PropTech',
    shortName: 'Real Estate',
    headline: 'Authority, listings, and leads — all in one system.',
    painPoints: [
      'Agent websites all look identical with the same template layout',
      'No local content strategy driving organic regional search traffic',
      'Leads arrive from Zillow — but nothing converts on your own site',
      'CRM follow-up is manual and leads go cold within 24 hours'
    ],
    solution: 'We build hyper-local landing page clusters, automated lead-routing workflows, and IDX-adjacent property showcase systems that make your site the authority for buyers in your market.',
    stats: [{ num: '42%', label: 'Lower CAC from Ads' }, { num: '90s', label: 'Lead Response via Automation' }],
    portfolioTag: 'Real Estate',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'See Real Estate Work'
  },
  {
    id: 'restaurants-fb',
    icon: '🍽️',
    name: 'Restaurants & F&B',
    shortName: 'Restaurants',
    headline: 'Make the digital door work as hard as the front door.',
    painPoints: [
      'Menu PDFs on mobile that take 8 seconds to open',
      'No Google Review strategy — 4.1 stars while competitors have 4.8',
      'Instagram presence with zero link-in-bio conversion path',
      'Booking is a phone call — losing reservations every night'
    ],
    solution: 'We create fast, mobile-first restaurant web presences with integrated reservation flows, automated post-visit review funnels, and social-ready content systems that convert foot traffic to loyal repeat customers.',
    stats: [{ num: '340%', label: '5-Star Review Growth' }, { num: '<90s', label: 'Review Funnel Response' }],
    portfolioTag: 'Commercial Services',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'See F&B Work'
  }
];

/* Portfolio proof excerpts mapped from Portfolio.jsx case studies */
const PROOF_BY_INDUSTRY = {
  'Consumer Goods':       { client: 'Glamour Aroma', result: 'Brand positioning that justified premium price points and achieved high market recognition on retail rollout.' },
  'Enterprise Software':  { client: 'Nexus Systems', result: '99/100 Lighthouse score and doubled organic lead inquiries within 30 days of launch.' },
  'Software Consulting':  { client: 'Nexus Systems', result: 'High-converting developer platform enabling high-ticket client consultation bookings at scale.' },
  'Healthcare':           { client: 'Client on file', result: 'Intake funnel rebuilt for frictionless mobile patient routing.' },
  'Real Estate':          { client: 'Client on file', result: 'Local landing page cluster driving 180+ direct inbound leads per month.' },
  'Commercial Services':  { client: 'Aegis Local Services', result: '340% boost in 5-star reviews and lead response time cut to under 90 seconds.' }
};

/* ─────────────────────────────────────────────────────────────────
   INDUSTRY CARD — expanded accordion-style
───────────────────────────────────────────────────────────────── */
function IndustryCard({ ind, isOpen, onToggle }) {
  const proof = PROOF_BY_INDUSTRY[ind.portfolioTag];

  return (
    <article
      style={{
        background: '#ffffff',
        border: isOpen ? '1px solid var(--amber)' : '1px solid var(--line)',
        borderRadius: '4px',
        overflow: 'hidden',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        boxShadow: isOpen ? '0 16px 48px rgba(0,0,0,0.10)' : '0 2px 8px rgba(0,0,0,0.04)'
      }}
    >
      {/* ── Card Header (always visible) ── */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '28px 28px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flex: 1 }}>
          {/* Icon */}
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '8px',
            background: isOpen ? 'var(--amber)' : 'var(--concrete)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            flexShrink: 0,
            transition: 'background 0.25s ease'
          }}>
            {ind.icon}
          </div>

          <div>
            <h3 style={{
              fontFamily: 'var(--disp)',
              fontWeight: '700',
              fontSize: 'clamp(18px, 2vw, 22px)',
              color: 'var(--ink)',
              margin: '0 0 4px 0',
              lineHeight: 1.2
            }}>
              {ind.name}
            </h3>
            <p style={{
              color: 'var(--steel)',
              fontSize: '14px',
              margin: 0,
              lineHeight: 1.4,
              fontStyle: 'italic'
            }}>
              {ind.headline}
            </p>
          </div>
        </div>

        {/* Chevron */}
        <span style={{
          width: '32px',
          height: '32px',
          border: '1px solid var(--line)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: isOpen ? 'var(--amber)' : 'var(--steel)',
          fontWeight: '800',
          fontSize: '18px',
          transition: 'transform 0.25s ease, color 0.25s ease',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
        }}>
          +
        </span>
      </button>

      {/* ── Expanded Detail Panel ── */}
      {isOpen && (
        <div style={{ borderTop: '1px solid var(--line)' }}>
          {/* Hero image */}
          <div style={{ width: '100%', height: '240px', overflow: 'hidden' }}>
            <img
              src={ind.img}
              alt={ind.name}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ padding: '32px 28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>

            {/* Pain points */}
            <div>
              <span style={{
                display: 'inline-block',
                fontFamily: 'var(--mono)',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#d9534f',
                marginBottom: '14px'
              }}>
                [01] COMMON PAIN POINTS
              </span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ind.painPoints.map((pt, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '14px', color: 'var(--steel)', lineHeight: '1.5' }}>
                    <span style={{ color: '#d9534f', fontWeight: '800', flexShrink: 0, marginTop: '1px' }}>✕</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution */}
            <div>
              <span style={{
                display: 'inline-block',
                fontFamily: 'var(--mono)',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--amber)',
                marginBottom: '14px'
              }}>
                [02] THE VEXELTECH FIX
              </span>
              <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: '1.7', margin: '0 0 20px 0' }}>
                {ind.solution}
              </p>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {ind.stats.map(s => (
                  <div key={s.label} style={{ background: 'var(--concrete)', padding: '10px 16px', borderRadius: '3px', border: '1px solid var(--line)' }}>
                    <div style={{ fontFamily: 'var(--disp)', fontWeight: '800', fontSize: '22px', color: 'var(--ink)', lineHeight: 1 }}>{s.num}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--steel)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Proof snippet */}
          {proof && (
            <div style={{ margin: '0 28px', padding: '20px 24px', background: 'var(--ink)', borderRadius: '3px', display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '28px' }}>
              <span style={{ color: 'var(--beacon)', fontWeight: '800', fontSize: '18px', flexShrink: 0, lineHeight: 1 }}>✓</span>
              <div>
                <span style={{ color: 'var(--beacon)', fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
                  Client Proof — {proof.client}
                </span>
                <p style={{ color: 'var(--text-d)', fontSize: '14px', lineHeight: '1.55', margin: 0 }}>{proof.result}</p>
              </div>
            </div>
          )}

          {/* Footer action */}
          <div style={{ padding: '0 28px 28px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/portfolio"
              className="btn btn--go"
              style={{ padding: '12px 24px', fontSize: '13px', fontWeight: '700' }}
            >
              {ind.ctaLabel} →
            </Link>
            <Link
              to="/contact-us"
              className="btn btn--line"
              style={{ padding: '12px 24px', fontSize: '13px', border: '1px solid var(--line)', color: 'var(--ink)' }}
            >
              Discuss My Project
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────────── */
export default function Industries() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId(prev => prev === id ? null : id);

  return (
    <SecondaryLayout
      title="Industries We Serve — VexelTech Solutions"
      description="Branding, websites, marketing automation, and data pipelines for E-Commerce, SaaS, Professional Services, Healthcare, Real Estate, and Restaurants. Built for businesses like yours."
    >

      {/* ══════════════════════════════════════════════════════
          1. DARK HERO
      ══════════════════════════════════════════════════════ */}
      <section className="band band--ink" style={{ background: 'var(--ink)', color: '#ffffff', padding: 'clamp(72px,10vw,112px) 0 clamp(60px,8vw,88px)' }}>
        <div className="wrap">
          {/* Badge */}
          <div style={{ display: 'flex', marginBottom: '24px' }}>
            <span style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--beacon)',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: '50px',
              fontFamily: 'var(--mono)'
            }}>
              ✓ INDUSTRY-SPECIFIC SYSTEMS &nbsp;•&nbsp; 6 VERTICALS
            </span>
          </div>

          <h1 className="h-xl" style={{ color: '#ffffff', marginBottom: '20px', maxWidth: '900px' }}>
            BUILT FOR BUSINESSES LIKE YOURS<span style={{ color: 'var(--beacon)' }}>.</span>
          </h1>

          <p className="lede" style={{ color: 'var(--text-d)', maxWidth: '700px', fontSize: '19px', lineHeight: '1.65', marginBottom: '40px' }}>
            We only work in industries where we can deliver measurable outcomes. Select your sector below to see the exact pain points we solve, the systems we deploy, and the results we have delivered for similar businesses.
          </p>

          {/* Industry quick-jump pills */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {INDUSTRIES.map(ind => (
              <button
                key={ind.id}
                onClick={() => {
                  setOpenId(ind.id);
                  setTimeout(() => {
                    document.getElementById(`ind-${ind.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 80);
                }}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontFamily: 'var(--mono)',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '7px 14px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--amber)'; e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.color = 'var(--ink)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#ffffff'; }}
              >
                {ind.icon} {ind.shortName}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. APPROACH STRIP — white band between hero & cards
      ══════════════════════════════════════════════════════ */}
      <section className="band" style={{ background: '#ffffff', padding: '52px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '28px' }}>
            {[
              { num: '01', title: 'Self-identify', desc: 'Find your industry — we only include sectors we actively want more of.' },
              { num: '02', title: 'See your pain points', desc: 'Read the exact problems founders in your space bring to us.' },
              { num: '03', title: 'Review the fix', desc: 'See our specific solution stack and a real proof result from a similar engagement.' },
              { num: '04', title: 'Start the conversation', desc: 'Book a free 15-minute scope call — no pitch deck, just answers.' }
            ].map(s => (
              <div key={s.num} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--mono)', fontWeight: '800', fontSize: '13px', color: 'var(--amber)', flexShrink: 0, marginTop: '2px' }}>{s.num}</span>
                <div>
                  <div style={{ fontFamily: 'var(--disp)', fontWeight: '700', fontSize: '15px', color: 'var(--ink)', marginBottom: '4px' }}>{s.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--steel)', lineHeight: '1.5' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. INDUSTRY ACCORDION CARDS
      ══════════════════════════════════════════════════════ */}
      <section className="band band--concrete" style={{ background: 'var(--concrete)', padding: 'clamp(56px,8vw,96px) 0' }}>
        <div className="wrap">
          <span className="label">Vertical Expertise</span>
          <h2 className="h-lg" style={{ marginBottom: '12px' }}>
            The industries we build for<span style={{ color: 'var(--amber)' }}>.</span>
          </h2>
          <p style={{ color: 'var(--steel)', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px', maxWidth: '640px' }}>
            Click any industry card to see specific pain points, our solution approach, and measurable proof from similar clients.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {INDUSTRIES.map(ind => (
              <div key={ind.id} id={`ind-${ind.id}`}>
                <IndustryCard
                  ind={ind}
                  isOpen={openId === ind.id}
                  onToggle={() => toggle(ind.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. TRUST STRIPE — what stays consistent across sectors
      ══════════════════════════════════════════════════════ */}
      <section className="band" style={{ background: '#ffffff', padding: 'clamp(56px,8vw,96px) 0' }}>
        <div className="wrap">
          <span className="label">Cross-Industry Constants</span>
          <h2 className="h-lg" style={{ marginBottom: '40px' }}>
            Different sectors — same discipline<span style={{ color: 'var(--amber)' }}>.</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { icon: '⚡', title: 'Speed first', body: 'Every deliverable is built for sub-2-second load times. Slow pages lose patients, buyers, and enterprise leads equally.' },
              { icon: '🔒', title: '100% ownership', body: 'Your source code, brand files, hosting accounts, and domain registrations always belong to your business — never to us.' },
              { icon: '📐', title: 'No templates', body: 'Every design system is purpose-built. We do not reskin generic themes or clone a competitor\'s layout in a new color.' },
              { icon: '📞', title: 'Direct access', body: 'One-on-one with the lead engineer from brief to launch. No account managers, no offshore hand-offs, no translation layers.' },
              { icon: '📊', title: 'Proof over claims', body: 'We anchor every recommendation to a measurable business outcome — conversion rates, lead velocity, or time saved per week.' },
              { icon: '🔄', title: 'Built to scale', body: 'Stacks are chosen so your internal team can maintain, modify, and expand without re-engaging an agency for basic changes.' }
            ].map(item => (
              <div
                key={item.title}
                style={{
                  background: 'var(--concrete)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  padding: '24px 20px'
                }}
              >
                <span style={{ fontSize: '26px', display: 'block', marginBottom: '12px' }}>{item.icon}</span>
                <h3 style={{ fontFamily: 'var(--disp)', fontWeight: '700', fontSize: '16px', color: 'var(--ink)', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: 'var(--steel)', fontSize: '13.5px', lineHeight: '1.55', margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. PORTFOLIO PROOF TEASER
      ══════════════════════════════════════════════════════ */}
      <section className="band band--ink" style={{ background: 'var(--ink)', padding: 'clamp(56px,8vw,96px) 0' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <span className="label" style={{ color: 'var(--beacon)' }}>Industry Proof</span>
              <h2 className="h-lg" style={{ color: '#ffffff', marginBottom: '16px' }}>
                Don't take our word for it<span style={{ color: 'var(--beacon)' }}>.</span>
              </h2>
              <p style={{ color: 'var(--text-d)', fontSize: '16px', lineHeight: '1.65', marginBottom: '28px' }}>
                Our portfolio contains end-to-end case studies across branding, web architecture, marketing funnels, and automation pipelines — with real numbers for each engagement.
              </p>
              <Link to="/portfolio" className="btn btn--go" style={{ padding: '14px 28px', fontWeight: '700' }}>
                View Full Portfolio →
              </Link>
            </div>

            {/* Quick proof cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { badge: 'Automation', client: 'Apex Logistics', result: '92% payroll overhead eliminated. 15 hrs → 20 min weekly.' },
                { badge: 'CRM / GHL', client: 'Aegis Services', result: '340% review growth + leads close in under 90 seconds.' },
                { badge: 'React Web', client: 'Nexus Systems', result: '99/100 Lighthouse + 2x organic leads in 30 days.' },
              ].map(p => (
                <div key={p.client} style={{ background: 'var(--ink-2)', border: '1px solid var(--line-d)', borderRadius: '3px', padding: '16px 20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--beacon)', fontWeight: '800', fontSize: '16px', flexShrink: 0 }}>✓</span>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ background: 'var(--amber)', color: 'var(--ink)', fontSize: '10px', fontWeight: '800', fontFamily: 'var(--mono)', padding: '2px 7px', borderRadius: '2px', textTransform: 'uppercase' }}>{p.badge}</span>
                      <span style={{ color: 'var(--steel)', fontFamily: 'var(--mono)', fontSize: '11px' }}>{p.client}</span>
                    </div>
                    <p style={{ color: 'var(--text-d)', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{p.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. CTA BLOCK
      ══════════════════════════════════════════════════════ */}
      <section className="band" style={{ background: '#ffffff', padding: 'clamp(64px,8vw,100px) 0' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
          <div>
            <span className="label">START A CONVERSATION</span>
            <h2 className="h-lg" style={{ marginBottom: '8px' }}>
              Do not see your exact industry<span style={{ color: 'var(--amber)' }}>?</span>
            </h2>
            <p className="lede" style={{ color: 'var(--steel)', margin: 0, maxWidth: '560px' }}>
              Tell us what you are building. The discipline remains constant: make the value obvious, make the proof visible, and make the next step effortless.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/contact-us" className="btn btn--go" style={{ padding: '16px 32px', fontWeight: '700' }}>
              Discuss My Market
            </Link>
            <Link to="/services" className="btn btn--line" style={{ padding: '16px 32px', border: '1px solid var(--line)', color: 'var(--ink)' }}>
              View All Services
            </Link>
          </div>
        </div>
      </section>

    </SecondaryLayout>
  );
}
