import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SecondaryLayout from '../components/SecondaryLayout.jsx';

// 1. BRANDING PROJECTS
const BRANDING_PROJECTS = [
  {
    id: 'glamour-aroma-identity',
    title: 'Artisanal Perfumery Identity & Packaging',
    client: 'Glamour Aroma',
    industry: 'Luxury Fragrance & Consumer Goods',
    badge: 'Brand Identity',
    thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    summary: 'Crafted luxury brand guidelines, custom packaging design systems, and visual asset suites for high-end boutique retail.',
    challenge: 'Entering a crowded boutique luxury market, Glamour Aroma needed a distinctive visual positioning and packaging strategy that felt premium, cohesive, and established.',
    solution: 'Formulated a visual brand identity centered on minimalist luxury, rich typography, color palettes, and custom bottle packaging guidelines alongside digital asset libraries.',
    outcome: 'Established brand positioning that justified premium price points and achieved high market recognition upon retail product rollout.',
    deliverables: ['Brand Identity Suite', 'Packaging Design System', 'Typography & Palette Standards', 'Social Media Asset Kit']
  },
  {
    id: 'nexus-rebrand-system',
    title: 'Enterprise Tech Rebrand & Design System',
    client: 'Nexus Systems',
    industry: 'Enterprise Software',
    badge: 'Design System',
    thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
    summary: 'Redesigned corporate identity, created a modular component design system, and unified cross-platform marketing collateral.',
    challenge: 'Nexus had fragmented visual assets across different sales regions, causing inconsistent customer perception and brand dilution.',
    solution: 'Engineered a unified design system with strict component guidelines, logo variations, and high-fidelity presentation templates.',
    outcome: 'Standardized global marketing materials and elevated market perception across enterprise procurement teams.',
    deliverables: ['Corporate Design System', 'Vector Logo Suite', 'Component Guidelines', 'Sales Deck Templates']
  }
];

// 2. WEBSITE PROJECTS
const WEBSITE_PROJECTS = [
  {
    id: 'developer-consulting-platform',
    title: 'High-Converting Developer Portfolio Platform',
    client: 'Nexus Systems',
    industry: 'Software Consulting',
    badge: 'React / FastAPI',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    summary: 'Built a lightning-fast, dark-themed developer platform with consultation booking systems for high-ticket clients.',
    challenge: 'Nexus had high-level technical expertise but lacked a modern digital presence that reflected their capability, resulting in low organic conversions.',
    solution: 'Engineered a clean, dark-themed single-page React architecture built for maximum speed. Integrated automated booking flows and interactive service tiers.',
    outcome: 'Achieved a 99/100 Google Lighthouse performance score and doubled organic lead inquiry submissions within 30 days.',
    deliverables: ['Bespoke React Application', 'Dark-Mode System Architecture', 'Booking System Integration', 'Speed & SEO Optimization']
  },
  {
    id: 'digital-insurance-webhook-crm',
    title: 'Real-Time Digital Insurance Verification Hub',
    client: 'Vanguard Risk & Insurance',
    industry: 'InsurTech',
    badge: 'React / Webhooks',
    thumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    summary: 'Constructed custom webhooks mapping external digital insurance data feeds directly into client CRM platforms.',
    challenge: 'Vanguard manually verified policy status, claim histories, and compliance certificates, resulting in a 48-hour onboarding delay for new commercial accounts.',
    solution: 'Developed secure API integration bridges and multi-channel webhooks connecting third-party insurance validation endpoints directly into the database.',
    outcome: 'Accelerated client onboarding from 48 hours to instant real-time verification and increased policy conversion rates by 28%.',
    deliverables: ['REST API & Webhooks', 'Real-Time Policy Mapping Schema', 'CRM Pipeline Sync', 'Security Audit']
  }
];

// 3. MARKETING PROJECTS
const MARKETING_PROJECTS = [
  {
    id: 'saas-funnel-campaign',
    title: 'Omnichannel B2B Outbound Lead Engine',
    client: 'Vanguard Growth Solutions',
    industry: 'B2B Software',
    badge: 'Lead Funnels',
    thumbnail: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
    summary: 'Designed multi-stage landing funnels, targeted messaging sequences, and conversion tracking architectures.',
    challenge: 'The client struggled with low click-to-lead conversion rates on paid traffic campaigns, causing high customer acquisition costs.',
    solution: 'Deployed optimized landing pages with concise messaging, A/B tested call-to-actions, and continuous campaign tracking.',
    outcome: 'Decreased customer acquisition costs by 42% and tripled monthly qualified demo scheduling.',
    deliverables: ['High-Converting Landing Pages', 'Campaign Messaging Matrix', 'Conversion Tracking Setup', 'A/B Testing Framework']
  },
  {
    id: 'local-service-growth',
    title: 'Multi-Channel Local Acquisition System',
    client: 'Aegis Local Services',
    industry: 'Commercial Services',
    badge: 'Local Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    summary: 'Built targeted localized search landing pages coupled with automated follow-up sequences for high service booking rates.',
    challenge: 'Inconsistent lead velocity and weak local search visibility led to high dependency on expensive third-party lead brokers.',
    solution: 'Engineered hyper-targeted local landing page clusters, schema markups, and instant SMS follow-up sequences.',
    outcome: 'Generated 180+ direct inbound booking leads per month, significantly lowering reliance on lead broker networks.',
    deliverables: ['Local Landing Page Clusters', 'Schema & Local SEO Architecture', 'Instant SMS Auto-Responders', 'Conversion Dashboards']
  }
];

// 4. AUTOMATION PROJECTS
const AUTOMATION_PROJECTS = [
  {
    id: 'logistics-payroll-automation',
    title: 'Enterprise Payroll & Data Integration Pipeline',
    client: 'Apex Logistics Corp',
    industry: 'Supply Chain & Freight',
    badge: 'Python / Fuzzy Logic',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    summary: 'Automated multi-branch driver timeclocks and fuzzy-matched trip metrics to eliminate manual weekly reconciliation.',
    challenge: 'The client spent 15+ manual hours weekly reconciling disjointed driver timecard logs and trip sheets across multi-state branches, causing payout delays and accounting errors.',
    solution: 'Engineered a custom Python data aggregation pipeline using fuzzy-matching algorithms to bridge inconsistent naming conventions across timeclocks and trip metrics.',
    outcome: 'Eliminated manual payroll overhead by 92%, cut reconciliation time from 15 hours to 20 minutes, and ensured 100% data audit precision.',
    deliverables: ['Custom Python Data Pipeline', 'Fuzzy Logic Matching Engine', 'Automated Payroll Dashboard', 'System Documentation']
  },
  {
    id: 'gohighlevel-reputation-routing',
    title: 'Automated CRM & Sentiment Routing Engine',
    client: 'Aegis Local Services',
    industry: 'Home & Commercial Services',
    badge: 'GoHighLevel / Workflows',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    summary: 'Deployed GoHighLevel sentiment-based feedback loops to protect public profile ratings and convert reviews automatically.',
    challenge: 'Aegis lost lead follow-ups and faced public negative reviews before customer support could intervene, while satisfied customers rarely left ratings.',
    solution: 'Built automated multi-channel messaging workflows within GoHighLevel. Created sentiment-detection trees routing negative feedback internally while steering positive reviews to Google.',
    outcome: 'Boosted 5-star review acquisition by 340% within 60 days and cut lead response times to under 90 seconds.',
    deliverables: ['GoHighLevel Architecture', 'Sentiment Routing Logic', 'Automated SMS/Email Sequences', 'Review Funnel']
  },
  {
    id: 'bigquery-warehouse-migration',
    title: 'Enterprise BigQuery Warehouse Migration',
    client: 'DataClub Network',
    industry: 'Enterprise Data Analytics',
    badge: 'BigQuery / ETL',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    summary: 'Migrated daily batch records across fragmented data sources into a centralized Google BigQuery warehouse.',
    challenge: 'Fragmented data stores across regional clubs made executive business reporting slow and inaccurate, requiring complex manual updates each month.',
    solution: 'Architected automated daily ETL pipelines transferring legacy batch files into Google BigQuery. Structured visual dashboard layers to allow real-time analytics.',
    outcome: 'Reduced report generation times from 5 days to real-time dashboards and lowered database compute costs by 35%.',
    deliverables: ['BigQuery Data Warehouse', 'Daily ETL Pipeline Scripts', 'Executive Analytics Dashboards', 'Data Schema Mapping']
  }
];

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  const renderProjectCard = (proj, isDarkTheme) => (
    <article
      key={proj.id}
      role="button"
      tabIndex={0}
      aria-label={`View case study for ${proj.title}`}
      onClick={() => setSelectedProject(proj)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelectedProject(proj);
        }
      }}
      style={{
        background: isDarkTheme ? 'var(--ink-2)' : '#ffffff',
        border: isDarkTheme ? '1px solid var(--line-d)' : '1px solid var(--line)',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease',
      }}
    >
      <div style={{ width: '100%', height: '220px', overflow: 'hidden', background: 'var(--ink)', position: 'relative' }}>
        <img
          src={proj.thumbnail}
          alt={proj.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isDarkTheme ? 0.85 : 0.95 }}
          loading="lazy"
        />
        <span
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'var(--ink)',
            color: 'var(--beacon)',
            fontSize: '11px',
            fontWeight: '800',
            padding: '4px 10px',
            borderRadius: '2px',
            fontFamily: 'var(--mono)',
            textTransform: 'uppercase'
          }}
        >
          {proj.badge}
        </span>
      </div>

      <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '11px', color: isDarkTheme ? 'var(--beacon)' : 'var(--steel)', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--mono)' }}>
            {proj.client} • {proj.industry}
          </div>
          <h3 className="h-md" style={{ fontSize: '20px', marginBottom: '12px', color: isDarkTheme ? '#ffffff' : 'var(--ink)', lineHeight: '1.3' }}>
            {proj.title}
          </h3>
          <p style={{ fontSize: '14px', color: isDarkTheme ? 'var(--text-d)' : 'var(--steel)', lineHeight: '1.6', margin: 0, marginBottom: '20px' }}>
            {proj.summary}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: isDarkTheme ? '1px solid var(--line-d)' : '1px solid var(--line)', paddingTop: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--amber)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>
            Inspect Architecture →
          </span>
          <span className="tag" style={{ margin: 0 }}>Case Study</span>
        </div>
      </div>
    </article>
  );

  return (
    <SecondaryLayout title="Portfolio">
      {/* HERO SECTION (DARK) */}
      <section className="band band--ink" style={{ background: 'var(--ink)', color: '#ffffff', padding: '120px 0 80px' }}>
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
              ✓ PROVEN CAPABILITY • FULL-STACK PROOF
            </span>
          </div>

          <h1 className="h-xl" style={{ color: '#ffffff', marginBottom: '24px', maxWidth: '900px' }}>
            WORK THAT GIVES THE PITCH SOMETHING TO POINT AT<span style={{ color: 'var(--beacon)' }}>.</span>
          </h1>

          <p className="lede" style={{ color: 'var(--text-d)', maxWidth: '760px', fontSize: '19px', lineHeight: '1.6', marginBottom: '40px' }}>
            Explore our core deliverables sorted across our four primary engineering disciplines: Branding, Website Architecture, Marketing Funnels, and Automation Data Pipelines.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a href="#branding" className="btn btn--go" style={{ padding: '10px 18px', fontSize: '12.5px' }}>01. Branding ↓</a>
            <a href="#website" className="btn btn--line" style={{ padding: '10px 18px', fontSize: '12.5px', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>02. Website ↓</a>
            <a href="#marketing" className="btn btn--line" style={{ padding: '10px 18px', fontSize: '12.5px', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>03. Marketing ↓</a>
            <a href="#automation" className="btn btn--line" style={{ padding: '10px 18px', fontSize: '12.5px', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>04. Automation ↓</a>
          </div>
        </div>
      </section>

      {/* 1. BRANDING (LIGHT / CONCRETE THEME) */}
      <section id="branding" className="band band--concrete" style={{ background: 'var(--concrete)', padding: '100px 0' }}>
        <div className="wrap">
          <div style={{ marginBottom: '48px' }}>
            <span className="label" style={{ color: 'var(--amber)' }}>[DISCIPLINE 01] BRANDING & VISUAL CRAFT</span>
            <h2 className="h-lg" style={{ color: 'var(--ink)', margin: '8px 0 16px 0' }}>
              Distinct Identities Built To Convert<span style={{ color: 'var(--amber)' }}>.</span>
            </h2>
            <p style={{ color: 'var(--steel)', fontSize: '16px', maxWidth: '680px', margin: 0 }}>
              Sophisticated brand positioning, vector design suites, and physical package architectures that build immediate trust.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {BRANDING_PROJECTS.map(proj => renderProjectCard(proj, false))}
          </div>
        </div>
      </section>

      {/* 2. WEBSITE (DARK / INK THEME) */}
      <section id="website" className="band band--ink" style={{ background: 'var(--ink)', color: '#ffffff', padding: '100px 0' }}>
        <div className="wrap">
          <div style={{ marginBottom: '48px' }}>
            <span className="label" style={{ color: 'var(--beacon)' }}>[DISCIPLINE 02] WEBSITE DEVELOPMENT & ARCHITECTURE</span>
            <h2 className="h-lg" style={{ color: '#ffffff', margin: '8px 0 16px 0' }}>
              High-Velocity Digital Platforms<span style={{ color: 'var(--beacon)' }}>.</span>
            </h2>
            <p style={{ color: 'var(--text-d)', fontSize: '16px', maxWidth: '680px', margin: 0 }}>
              Clean React architectures, API integration bridges, and instant loading speeds. We construct scalable platforms without bloated plugins.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {WEBSITE_PROJECTS.map(proj => renderProjectCard(proj, true))}
          </div>
        </div>
      </section>

      {/* 3. MARKETING (LIGHT / WHITE THEME) */}
      <section id="marketing" className="band" style={{ background: '#ffffff', padding: '100px 0' }}>
        <div className="wrap">
          <div style={{ marginBottom: '48px' }}>
            <span className="label" style={{ color: 'var(--amber)' }}>[DISCIPLINE 03] MARKETING & LEAD ENGINES</span>
            <h2 className="h-lg" style={{ color: 'var(--ink)', margin: '8px 0 16px 0' }}>
              Acquisition Funnels & Growth Systems<span style={{ color: 'var(--amber)' }}>.</span>
            </h2>
            <p style={{ color: 'var(--steel)', fontSize: '16px', maxWidth: '680px', margin: 0 }}>
              Omnichannel B2B campaign structures, targeted local landing page clusters, and conversion-optimized sales funnels.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {MARKETING_PROJECTS.map(proj => renderProjectCard(proj, false))}
          </div>
        </div>
      </section>

      {/* 4. AUTOMATION (DARK / INK THEME) */}
      <section id="automation" className="band band--ink" style={{ background: 'var(--ink)', color: '#ffffff', padding: '100px 0' }}>
        <div className="wrap">
          <div style={{ marginBottom: '48px' }}>
            <span className="label" style={{ color: 'var(--beacon)' }}>[DISCIPLINE 04] AUTOMATION & DATA PIPELINES</span>
            <h2 className="h-lg" style={{ color: '#ffffff', margin: '8px 0 16px 0' }}>
              Eliminating Operational Bottlenecks<span style={{ color: 'var(--beacon)' }}>.</span>
            </h2>
            <p style={{ color: 'var(--text-d)', fontSize: '16px', maxWidth: '680px', margin: 0 }}>
              Custom Python scripts, GoHighLevel CRM workflows, and BigQuery data warehouses built to eliminate manual labor and data errors.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {AUTOMATION_PROJECTS.map(proj => renderProjectCard(proj, true))}
          </div>
        </div>
      </section>

      {/* CTA BLOCK (DARK FINALE) */}
      <section className="band band--ink" style={{ background: 'var(--ink-2)', padding: '100px 0', borderTop: '1px solid var(--line-d)' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
          <div>
            <span className="label" style={{ color: 'var(--beacon)' }}>INITIATE PROJECT SCOPE</span>
            <h2 className="h-lg" style={{ color: '#ffffff', marginBottom: '8px' }}>
              Want results like this? Let’s talk<span style={{ color: 'var(--beacon)' }}>.</span>
            </h2>
            <p className="lede" style={{ color: 'var(--text-d)', margin: 0, maxWidth: '600px' }}>
              Bring us the business goals, your existing stack, or simply the problem. We will break down what to fix first.
            </p>
          </div>
          <Link to="/contact-us" className="btn btn--go">
            Let's Talk Project Scope
          </Link>
        </div>
      </section>

      {/* CASE STUDY DETAIL MODAL */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(12, 16, 23, 0.88)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setSelectedProject(null)}
        >
          <div
            style={{
              background: '#ffffff',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '6px',
              position: 'relative',
              border: '1px solid var(--line)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ background: 'var(--ink)', color: '#ffffff', padding: '24px 32px', position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ color: 'var(--beacon)', fontSize: '11px', fontFamily: 'var(--mono)', fontWeight: '800', textTransform: 'uppercase' }}>
                  {selectedProject.client} • {selectedProject.industry}
                </span>
                <h3 id="modal-title" className="h-md" style={{ color: '#ffffff', margin: 0, fontSize: '20px' }}>
                  {selectedProject.title}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close case study details"
                onClick={() => setSelectedProject(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '28px', cursor: 'pointer', lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              <div style={{ width: '100%', height: '280px', borderRadius: '4px', overflow: 'hidden', marginBottom: '32px', background: 'var(--ink)' }}>
                <img src={selectedProject.thumbnail} alt={selectedProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '36px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#d9534f', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>[01] The Challenge</span>
                  <p style={{ fontSize: '15.5px', color: 'var(--ink)', lineHeight: '1.6', marginTop: '6px' }}>{selectedProject.challenge}</p>
                </div>

                <div>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--amber)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>[02] The Engineering Solution</span>
                  <p style={{ fontSize: '15.5px', color: 'var(--ink)', lineHeight: '1.6', marginTop: '6px' }}>{selectedProject.solution}</p>
                </div>

                <div>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#2b8a3e', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>[03] Measurable Outcome</span>
                  <p style={{ fontSize: '15.5px', color: 'var(--ink)', lineHeight: '1.6', marginTop: '6px', fontWeight: '600' }}>{selectedProject.outcome}</p>
                </div>
              </div>

              <div style={{ background: 'var(--concrete)', padding: '24px', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', fontFamily: 'var(--mono)', textTransform: 'uppercase', color: 'var(--ink)' }}>Deliverables & Architecture:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {selectedProject.deliverables.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '13.5px', color: 'var(--steel)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--amber)' }}>✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--concrete)', padding: '20px 32px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--steel)' }}>Need similar architecture?</span>
              <Link to="/contact-us" className="btn btn--go" style={{ padding: '8px 18px', fontSize: '13px' }}>
                Discuss Your Scope
              </Link>
            </div>
          </div>
        </div>
      )}
    </SecondaryLayout>
  );
}