import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SecondaryLayout from '../components/SecondaryLayout.jsx';

export default function About() {
  const [hoveredValue, setHoveredValue] = useState(null);

  const VALUES = [
    {
      num: '01',
      title: 'Complete Ownership',
      desc: 'You own every line of code, design file, domain, and tool integration. Zero proprietary lock-in or hostage retainer fees.'
    },
    {
      num: '02',
      title: 'Radical Specificity',
      desc: 'No vague agency jargon or empty promises. We define clear deliverables, milestones, and measurable outcomes before day one.'
    },
    {
      num: '03',
      title: 'Agile Velocity',
      desc: 'We launch functional staging environments fast. Continuous feedback loops mean you test real code instead of static PDF mockups.'
    },
    {
      num: '04',
      title: 'Founder-Led Attention',
      desc: 'The engineer who scopes your technical architecture is the engineer building it. No junior hand-offs or middle-management noise.'
    }
  ];

  const DIFFERENCE_POINTS = [
    {
      kicker: 'AGENCY ALTERNATIVE',
      title: 'Template Mills & Offshore Outsources',
      items: [
        'Slow communication across multiple time zones',
        'Generic templates bloated with unnecessary plugins',
        'Account managers who cannot solve technical problems',
        'Surprise billing for basic revisions and scope changes'
      ],
      negative: true
    },
    {
      kicker: 'THE VEXELTECH WAY',
      title: 'Engineering Rigor + Brand Craft',
      items: [
        'Direct 1-on-1 communication with your primary build team',
        'Custom lightweight React/CSS architectures built for speed',
        'Full-stack execution: Branding, Web, Marketing & Automation',
        'Fixed pricing with guaranteed SLA delivery timelines'
      ],
      negative: false
    }
  ];

  const PROCESS_STEPS = [
    {
      step: '01',
      title: 'Blueprint & Architecture',
      desc: 'We map out user flows, tech stack choices, and project roadmaps to ensure zero wasted development cycles.'
    },
    {
      step: '02',
      title: 'Design & Build Sprints',
      desc: 'We craft high-fidelity visual assets and perform rapid code iterations in a live client staging environment.'
    },
    {
      step: '03',
      title: 'Automation & Integration',
      desc: 'Connecting webhooks, CRM routing, lead captures, and operational tools for seamless business mechanics.'
    },
    {
      step: '04',
      title: 'Launch & Handoff',
      desc: 'Final speed tuning, technical SEO schema checks, full asset delivery, and dedicated post-launch SLA support.'
    }
  ];

  return (
    <SecondaryLayout title="About Us">
      {/* 1. DARK HERO SECTION */}
      <section className="band band--ink" style={{ background: 'var(--ink)', color: '#ffffff', padding: '100px 0 72px' }}>
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
              ✓ FOUNDER-LED • FULL-STACK AGENCY
            </span>
          </div>

          <h1 className="h-xl" style={{ color: '#ffffff', marginBottom: '24px', maxWidth: '850px' }}>
            WHY WE STARTED VEXELTECH<span style={{ color: 'var(--beacon)' }}>.</span>
          </h1>

          <p className="lede" style={{ color: 'var(--text-d)', maxWidth: '720px', fontSize: '19px', lineHeight: '1.6' }}>
            We started with a simple observation: customers don’t experience a business in isolated silos. They experience the brand identity, the web platform, marketing campaigns, and customer support as one unified entity. We exist to build those systems end-to-end.
          </p>
        </div>
      </section>

      {/* 2. LIGHT/CONCRETE FOUNDER STORY SECTION */}
      <section className="band band--concrete" style={{ background: 'var(--concrete)', padding: '96px 0' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
          <div>
            <span className="label">Founder Story</span>
            <h2 className="h-lg" style={{ marginBottom: '24px', fontSize: '2.4rem' }}>
              One team, zero hand-offs<span style={{ color: 'var(--amber)' }}>.</span>
            </h2>
            <div style={{ fontSize: '16px', color: 'var(--steel)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p>
                Traditional agency setups break down when work is passed through a long chain of sales reps, account managers, and junior subcontractors. Context gets lost, timelines balloon, and quality deteriorates.
              </p>
              <p>
                At VexelTech, we operate as a nimble, engineer-led studio. The person who evaluates your business requirements, structures your design system, and architects your database is the exact same lead executing the build.
              </p>
              <p>
                Whether you need a bespoke brand system, high-converting digital platform, or automated lead infrastructure, we take full accountability from initial blueprint to production deployment.
              </p>
            </div>
          </div>

          {/* Dark Contrast Card Element */}
          <div 
            className="sig" 
            style={{ 
              background: 'var(--ink)', 
              color: '#ffffff',
              border: '1px solid var(--line-d)', 
              borderRadius: '4px',
              padding: '24px',
              position: 'relative'
            }}
          >
            <div 
              style={{ 
                width: '100%', 
                height: '240px', 
                borderRadius: '2px', 
                overflow: 'hidden', 
                marginBottom: '20px',
                background: 'var(--ink-2)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                alt="VexelTech Engineering Team" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              />
            </div>
            <div style={{ padding: '0 8px' }}>
              <span className="sig-cap" style={{ padding: 0, fontSize: '11px', color: 'var(--beacon)' }}>OUR PHILOSOPHY</span>
              <h4 className="h-md" style={{ fontSize: '18px', margin: '6px 0 10px 0', color: '#ffffff' }}>Craftsmanship Over Volume</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-d)', margin: 0, lineHeight: '1.5' }}>
                "By keeping our client queue selective, we maintain senior engineering standards on every deliverable without compromises."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DARK MISSION & VALUES SECTION */}
      <section className="band band--ink" style={{ background: 'var(--ink)', color: '#ffffff', padding: '96px 0' }}>
        <div className="wrap">
          <span className="label" style={{ color: 'var(--beacon)' }}>Mission & Values</span>
          <h2 className="h-lg" style={{ color: '#ffffff', marginBottom: '48px' }}>
            How we choose to build<span style={{ color: 'var(--beacon)' }}>.</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {VALUES.map((val, idx) => {
              const isHovered = hoveredValue === idx;
              return (
                <div 
                  key={idx}
                  onMouseEnter={() => setHoveredValue(idx)}
                  onMouseLeave={() => setHoveredValue(null)}
                  style={{
                    background: 'var(--ink-2)',
                    padding: '36px 28px',
                    border: isHovered ? '1px solid var(--beacon)' : '1px solid var(--line-d)',
                    borderRadius: '2px',
                    transform: isHovered ? 'translateY(-6px)' : 'translateY(0px)',
                    boxShadow: isHovered ? '0 16px 32px rgba(0,0,0,0.4)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span 
                      style={{ 
                        fontFamily: 'var(--mono)', 
                        fontSize: '14px', 
                        fontWeight: '800', 
                        color: 'var(--beacon)',
                        display: 'block',
                        marginBottom: '16px'
                      }}
                    >
                      [{val.num}]
                    </span>
                    <h3 className="h-md" style={{ fontSize: '20px', marginBottom: '12px', color: '#ffffff' }}>{val.title}</h3>
                    <p style={{ fontSize: '14.5px', color: 'var(--text-d)', lineHeight: '1.6', margin: 0 }}>{val.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. LIGHT HOW WE'RE DIFFERENT SECTION */}
      <section className="band" style={{ background: '#ffffff', padding: '96px 0' }}>
        <div className="wrap">
          <span className="label">Different By Design</span>
          <h2 className="h-lg" style={{ marginBottom: '48px' }}>
            Built for outcomes, not billable hours<span style={{ color: 'var(--amber)' }}>.</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {DIFFERENCE_POINTS.map((block, i) => (
              <div 
                key={i} 
                style={{
                  background: block.negative ? 'var(--concrete)' : 'var(--ink)',
                  color: block.negative ? 'var(--ink)' : '#ffffff',
                  padding: '40px 32px',
                  borderRadius: '4px',
                  border: block.negative ? '1px solid var(--line)' : '1px solid var(--ink)'
                }}
              >
                <span 
                  style={{ 
                    fontFamily: 'var(--mono)', 
                    fontSize: '11px', 
                    fontWeight: '800', 
                    letterSpacing: '0.12em',
                    color: block.negative ? 'var(--steel)' : 'var(--beacon)',
                    display: 'block',
                    marginBottom: '12px'
                  }}
                >
                  {block.kicker}
                </span>
                <h3 
                  className="h-md" 
                  style={{ 
                    fontSize: '22px', 
                    marginBottom: '24px', 
                    color: block.negative ? 'var(--ink)' : '#ffffff' 
                  }}
                >
                  {block.title}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {block.items.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14.5px', lineHeight: '1.5' }}>
                      <span style={{ color: block.negative ? '#d9534f' : 'var(--beacon)', fontWeight: 'bold' }}>
                        {block.negative ? '✕' : '✓'}
                      </span>
                      <span style={{ color: block.negative ? 'var(--steel)' : 'var(--text-d)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CONCRETE PROCESS PHILOSOPHY SECTION */}
      <section className="band band--concrete" style={{ background: 'var(--concrete)', padding: '96px 0' }}>
        <div className="wrap">
          <span className="label">Process Philosophy</span>
          <h2 className="h-lg" style={{ marginBottom: '48px' }}>
            How work actually gets done<span style={{ color: 'var(--amber)' }}>.</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {PROCESS_STEPS.map((ps, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: '#ffffff', 
                  padding: '28px 24px', 
                  border: '1px solid var(--line)',
                  borderRadius: '2px',
                  position: 'relative'
                }}
              >
                <span 
                  style={{ 
                    fontSize: '28px', 
                    fontFamily: 'var(--disp)', 
                    fontWeight: '800', 
                    color: 'var(--amber)',
                    display: 'block',
                    marginBottom: '12px'
                  }}
                >
                  {ps.step}
                </span>
                <h4 className="h-md" style={{ fontSize: '17px', marginBottom: '8px', color: 'var(--ink)' }}>{ps.title}</h4>
                <p style={{ fontSize: '13.5px', color: 'var(--steel)', margin: 0, lineHeight: '1.55' }}>{ps.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA BANNER */}
      <section className="band band--ink" style={{ background: 'var(--ink)', padding: '80px 0' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
          <div>
            <span className="label" style={{ color: 'var(--beacon)' }}>START A CONVERSATION</span>
            <h2 className="h-lg" style={{ color: '#ffffff', marginBottom: '8px' }}>
              Ready to build something exceptional<span style={{ color: 'var(--beacon)' }}>?</span>
            </h2>
            <p className="lede" style={{ color: 'var(--text-d)', margin: 0 }}>
              Direct access to founders and senior engineers. Zero friction.
            </p>
          </div>
          <Link to="/contact-us" className="btn btn--go">
            Let's Work Together
          </Link>
        </div>
      </section>

      {/* 7. POST-CTA FOUNDER GUARANTEE SECTION */}
      <section className="band" style={{ background: '#ffffff', padding: '80px 0', borderTop: '1px solid var(--line)' }}>
        <div className="wrap" style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div 
            style={{ 
              background: 'var(--concrete)', 
              border: '1px solid var(--line)', 
              padding: '36px', 
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span 
                style={{ 
                  background: 'var(--amber)', 
                  color: 'var(--ink)', 
                  fontSize: '11px', 
                  fontWeight: '800', 
                  padding: '4px 8px', 
                  borderRadius: '2px',
                  fontFamily: 'var(--mono)',
                  textTransform: 'uppercase'
                }}
              >
                Founder Direct
              </span>
              <h3 className="h-md" style={{ margin: 0, fontSize: '20px' }}>Our Hands-On Pledge</h3>
            </div>
            
            <p style={{ fontSize: '15px', color: 'var(--steel)', margin: 0, lineHeight: '1.6' }}>
              Being an agile, founder-led team is our biggest operational advantage. When you engage VexelTech, you don't get handed off to an account executive or offshore team. You receive dedicated senior engineering attention, clear milestone updates, and full direct access to the team bringing your roadmap to life.
            </p>
          </div>
        </div>
      </section>
    </SecondaryLayout>
  );
}