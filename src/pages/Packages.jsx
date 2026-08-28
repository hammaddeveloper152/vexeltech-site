import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SecondaryLayout from '../components/SecondaryLayout.jsx';

// ==========================================
// PRICING CONFIG: 4 SERVICES (3 TIERS EACH)
// ==========================================
const PRICING_DATA = {
  branding: [
    {
      id: 'brand-1',
      name: 'Identity Core',
      popular: false,
      price: '$990',
      wasPrice: '$1,290',
      bestFor: 'New ventures needing an initial logo & visual framework.',
      benefits: [
        'Primary & Secondary Logo Marks',
        'Typography hierarchy & color palette',
        'Social media asset kit',
        'Vector source files (.SVG, .AI, .PNG)',
        '14-day post-delivery support'
      ]
    },
    {
      id: 'brand-2',
      name: 'Full Brand System',
      popular: true,
      price: '$2,490',
      wasPrice: '$3,290',
      bestFor: 'Growing SMBs requiring a comprehensive visual brand book.',
      benefits: [
        'Complete visual identity system & style guide',
        'Social media templates & pitch deck theme',
        'Custom iconography & illustration direction',
        'Print-ready stationery kit',
        'Brand asset portal setup'
      ]
    },
    {
      id: 'brand-3',
      name: 'Enterprise Positioning',
      popular: false,
      price: '$4,890',
      wasPrice: '$5,990',
      bestFor: 'Established companies launching major rebrand initiatives.',
      benefits: [
        'Comprehensive market positioning & strategy',
        'Multi-product brand architecture',
        'Full design system (Figma token library)',
        'Motion branding & video bumper kits',
        'Dedicated brand director sprint'
      ]
    }
  ],
  websites: [
    {
      id: 'web-1',
      name: 'Launchpad Site',
      popular: false,
      price: '$1,490',
      wasPrice: '$1,990',
      bestFor: 'Startups & founders needing a high-converting core site fast.',
      benefits: [
        'High-converting 1-3 page custom design',
        'Mobile-first responsive architecture',
        'SEO baseline & speed tuning',
        'Form & Lead Capture integration',
        '14-day post launch support'
      ]
    },
    {
      id: 'web-2',
      name: 'Growth Engine',
      popular: true,
      price: '$2,990',
      wasPrice: '$3,890',
      bestFor: 'Established businesses ready for a multi-page conversion build.',
      benefits: [
        'Up to 8 custom structured pages',
        'Clean CSS motion & smooth interactions',
        'CMS integration for dynamic content',
        'CRM & email marketing webhooks',
        'Full technical SEO & schema setup'
      ]
    },
    {
      id: 'web-3',
      name: 'Custom Web Platform',
      popular: false,
      price: '$5,490',
      wasPrice: '$6,890',
      bestFor: 'Complex web applications, SaaS platforms, or heavy custom builds.',
      benefits: [
        'Unlimited custom templates & pages',
        'Custom interactive elements & micro-interactions',
        'Full stack API & database integrations',
        'Dedicated senior engineer support',
        '30-day post-launch optimization sprint'
      ]
    }
  ],
  marketing: [
    {
      id: 'mkt-1',
      name: 'Funnel Sprint',
      popular: false,
      price: '$1,290',
      wasPrice: '$1,650',
      bestFor: 'Businesses targeting higher lead conversion rates from traffic.',
      benefits: [
        'Dedicated high-converting landing page design',
        'Lead magnet & opt-in flow structure',
        'A/B testing layout configuration',
        'Analytics & conversion tracking setup',
        '14-day performance monitoring'
      ]
    },
    {
      id: 'mkt-2',
      name: 'Growth Marketing Kit',
      popular: true,
      price: '$2,890',
      wasPrice: '$3,600',
      bestFor: 'Full funnel visual assets & multi-channel strategy.',
      benefits: [
        'Multi-channel ad creative design kit',
        'Email campaign sequence layout templates',
        'Copywriting & value proposition polishing',
        'Conversion rate optimization (CRO) audit',
        'Monthly reporting dashboard'
      ]
    },
    {
      id: 'mkt-3',
      name: 'Scale Campaign Stack',
      popular: false,
      price: '$4,990',
      wasPrice: '$6,200',
      bestFor: 'Aggressive growth brands executing multi-platform campaigns.',
      benefits: [
        'End-to-end ad funnel production',
        'Video ad editing & motion graphic assets',
        'Omnichannel lead nurture workflows',
        'Dedicated CRO specialist & weekly tuning',
        'Custom attribution model setup'
      ]
    }
  ],
  automation: [
    {
      id: 'auto-1',
      name: 'Lead Pipeline Auto',
      popular: false,
      price: '$1,190',
      wasPrice: '$1,500',
      bestFor: 'Businesses needing automated contact & intake management.',
      benefits: [
        'GoHighLevel / CRM workflow configuration',
        'Automated instant SMS & Email auto-responders',
        'Form response routing to sales reps',
        'Calendar booking system integration',
        '14-day post-setup SLA support'
      ]
    },
    {
      id: 'auto-2',
      name: 'Full Operations Stack',
      popular: true,
      price: '$3,200',
      wasPrice: '$4,100',
      bestFor: 'Complete end-to-end client onboarding & review automation.',
      benefits: [
        'Multi-channel webhooks & data pipeline setup',
        'Automated review & reputation management',
        'Client onboarding portal & notification sequence',
        'Custom Zapier / Make automation flows',
        '30-day workflow optimization'
      ]
    },
    {
      id: 'auto-3',
      name: 'Enterprise AI Workflow',
      popular: false,
      price: '$5,800',
      wasPrice: '$7,200',
      bestFor: 'Complex multi-system integrations and AI agent routing.',
      benefits: [
        'Custom AI assistant & voice agent integration',
        'Enterprise database synchronization (BigQuery/SQL)',
        'Custom API middleware & error fallback channels',
        'Dedicated automation engineer support',
        'Priority 60-day maintenance SLA'
      ]
    }
  ]
};

const COMPARISON_MATRIX = [
  { feature: 'Custom Design (No Templates)', branding: '✓', website: '✓', marketing: '✓', automation: '✓' },
  { feature: 'Mobile Responsive Tuning', branding: '—', website: '✓', marketing: '✓', automation: '—' },
  { feature: 'CRM & Webhook Integrations', branding: '—', website: 'Optional', marketing: '✓', automation: '✓' },
  { feature: 'Post-Launch Dedicated SLA Support', branding: '14 Days', website: '14-30 Days', marketing: '30 Days', automation: '30-60 Days' }
];

const FAQS = [
  {
    q: "What are your payment terms?",
    a: "We operate on a standard 50/50 model (50% deposit to initiate sprint, 50% upon final launch approval). Custom milestones can be structured for enterprise engagements."
  },
  {
    q: "How do revisions work?",
    a: "Every package includes dedicated revision cycles. We share live staging environments early so you approve real work rather than static mockups."
  },
  {
    q: "Can we combine multiple services into one package?",
    a: "Yes. You can combine elements across Branding, Websites, Marketing, and Automation into a single custom engagement."
  }
];

export default function Packages() {
  const [tab, setTab] = useState('branding');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <SecondaryLayout title="Packages & Pricing">
      {/* Homepage-Matching Dark Hero Section */}
      <section className="band band--ink" style={{ background: 'var(--ink)', color: '#ffffff', padding: '100px 0 64px' }}>
        <div className="wrap">
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
              ✓ BRANDING • WEBSITES • MARKETING • AUTOMATION
            </span>
          </div>

          <h1 className="h-xl" style={{ color: '#ffffff', marginBottom: '20px' }}>
            TRANSPARENT PRICING, NO SURPRISES<span style={{ color: 'var(--beacon)' }}>.</span>
          </h1>

          <p className="lede" style={{ color: 'var(--text-d)', marginBottom: '36px' }}>
            Select a service category to explore pricing tiers. High-performance systems engineered for growth.
          </p>

          {/* Sequence: Branding · Websites · Marketing · Automation */}
          <div className="btns" role="tablist" aria-label="Service pricing categories">
            {[
              { id: 'branding', label: 'Branding' },
              { id: 'websites', label: 'Websites' },
              { id: 'marketing', label: 'Marketing' },
              { id: 'automation', label: 'Automation' }
            ].map((item) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={`btn ${tab === item.id ? 'btn--go' : 'btn--line'}`}
                style={{
                  minHeight: '44px',
                  padding: '10px 22px',
                  color: tab === item.id ? 'var(--ink)' : '#fff',
                  borderColor: tab === item.id ? 'var(--beacon-edge)' : 'var(--line-d)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Package Cards Section with Clean Hover Zoom */}
      <section className="band band--concrete" style={{ background: 'var(--concrete)', padding: '80px 0' }}>
        <div className="wrap">
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '24px'
            }}
          >
            {PRICING_DATA[tab].map((plan, i) => {
              const isHovered = hoveredCard === plan.id;

              return (
                <div 
                  key={plan.id}
                  className="sig"
                  tabIndex={0}
                  onMouseEnter={() => setHoveredCard(plan.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onFocus={() => setHoveredCard(plan.id)}
                  onBlur={() => setHoveredCard(null)}
                  style={{ 
                    background: '#fff', 
                    padding: '32px', 
                    position: 'relative',
                    border: plan.popular 
                      ? '2px solid var(--beacon)' 
                      : isHovered 
                        ? '1px solid var(--ink)' 
                        : '1px solid var(--line)',
                    borderRadius: '2px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0px) scale(1)',
                    boxShadow: isHovered 
                      ? '0 16px 32px rgba(0,0,0,0.08)' 
                      : plan.popular ? '0 8px 20px rgba(0,0,0,0.04)' : 'none',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  {plan.popular && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: '-13px',
                        right: '20px',
                        background: 'var(--beacon)',
                        color: 'var(--ink)',
                        fontSize: '10px',
                        fontWeight: '800',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: '2px',
                        fontFamily: 'var(--mono)'
                      }}
                    >
                      ★ Most Popular
                    </span>
                  )}

                  <div>
                    <span className="label" style={{ marginBottom: '8px' }}>Tier 0{i + 1}</span>
                    <h3 className="h-md" style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--ink)' }}>{plan.name}</h3>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                      <span style={{ fontFamily: 'var(--disp)', fontSize: '38px', fontWeight: '800', color: 'var(--ink)' }}>
                        {plan.price}
                      </span>
                      {plan.wasPrice && (
                        <span style={{ fontSize: '15px', textDecoration: 'line-through', color: 'var(--steel)' }}>
                          {plan.wasPrice}
                        </span>
                      )}
                    </div>

                    <div style={{ background: 'var(--concrete)', padding: '12px', borderRadius: '2px', marginBottom: '24px' }}>
                      <span className="sig-cap" style={{ padding: 0, fontSize: '10px', marginBottom: '4px' }}>BEST FOR</span>
                      <p style={{ fontSize: '13.5px', color: 'var(--ink)', margin: 0 }}>{plan.bestFor}</p>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                      {plan.benefits.map((benefit, idx) => (
                        <li 
                          key={idx} 
                          style={{ 
                            fontSize: '14.5px', 
                            color: 'var(--steel)', 
                            marginBottom: '10px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}
                        >
                          <span style={{ color: 'var(--amber)', fontWeight: 'bold' }}>✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link 
                    to="/contact-us" 
                    className={`btn ${plan.popular || isHovered ? 'btn--go' : 'btn--ink'}`} 
                    style={{ 
                      width: '100%',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Select Package
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Scope CTA */}
      <section className="band band--ink" style={{ background: 'var(--ink)', padding: '64px 0' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
          <div>
            <span className="label" style={{ color: 'var(--beacon)' }}>CUSTOM ENGAGEMENT</span>
            <h2 className="h-lg" style={{ color: '#fff', marginBottom: '8px' }}>Need a multi-service bundle<span style={{ color: 'var(--beacon)' }}>?</span></h2>
            <p className="lede" style={{ color: 'var(--text-d)', margin: 0 }}>Combine Branding, Websites, Marketing, and Automation into a tailored growth sprint.</p>
          </div>
          <Link to="/contact-us" className="btn btn--go">
            Request Custom Quote
          </Link>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="band" style={{ background: '#fff', padding: '80px 0' }}>
        <div className="wrap">
          <span className="label">Comparison Matrix</span>
          <h2 className="h-lg" style={{ marginBottom: '32px' }}>Side-by-side service capabilities<span style={{ color: 'var(--amber)' }}>.</span></h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid var(--line)' }}>
              <thead>
                <tr style={{ background: 'var(--ink)', color: '#fff', fontFamily: 'var(--disp)', textAlign: 'left' }}>
                  <th style={{ padding: '16px 20px' }}>Capabilities</th>
                  <th style={{ padding: '16px 20px' }}>Branding</th>
                  <th style={{ padding: '16px 20px' }}>Websites</th>
                  <th style={{ padding: '16px 20px' }}>Marketing</th>
                  <th style={{ padding: '16px 20px' }}>Automation</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_MATRIX.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--line)', fontSize: '14.5px' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--ink)' }}>{row.feature}</td>
                    <td style={{ padding: '16px 20px', color: 'var(--steel)' }}>{row.branding}</td>
                    <td style={{ padding: '16px 20px', color: 'var(--steel)' }}>{row.website}</td>
                    <td style={{ padding: '16px 20px', color: 'var(--steel)' }}>{row.marketing}</td>
                    <td style={{ padding: '16px 20px', color: 'var(--steel)' }}>{row.automation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Accordion FAQ */}
      <section className="band band--concrete" style={{ padding: '80px 0' }}>
        <div className="wrap" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span className="label">FAQ</span>
          <h2 className="h-lg" style={{ marginBottom: '36px' }}>Frequently asked questions<span style={{ color: 'var(--amber)' }}>.</span></h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                style={{ 
                  border: '1px solid var(--line)', 
                  background: '#fff',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  style={{ 
                    width: '100%', 
                    padding: '20px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'var(--disp)',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'var(--ink)'
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '20px', color: 'var(--amber)' }}>
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div style={{ padding: '0 20px 20px 20px', fontSize: '15px', color: 'var(--steel)', lineHeight: '1.6' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </SecondaryLayout>
  );
}