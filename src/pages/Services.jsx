import React from 'react';
import { Link } from 'react-router-dom';
import SecondaryLayout from '../components/SecondaryLayout.jsx';
import { CTA } from '../components/Blocks.jsx';

const services = [
  {
    path: '/services/branding',
    num: '01',
    title: 'Brand Identity Design',
    loss: 'Branding',
    text: 'Logos, guidelines, and visual identity systems that build market authority and command premium positioning.',
    deliverables: ['Vector Logo Suite', 'Brand Guidelines Book', 'Typography & Palette Standards', 'Social & Marketing Kit']
  },
  {
    path: '/services/web-development',
    num: '02',
    title: 'Custom Web Development',
    loss: 'Web Dev',
    text: 'Fast, high-converting websites built on React, FastAPI, or Webflow - engineered for performance and SEO.',
    deliverables: ['Responsive Design', 'Technical SEO Foundation', 'Sub-Second Load Times', 'Full CMS Ownership']
  },
  {
    path: '/services/marketing',
    num: '03',
    title: 'Digital Marketing & Acquisition',
    loss: 'Marketing',
    text: 'Google Ads, Meta campaigns, and intent-driven SEO strategies that produce qualified leads and revenue.',
    deliverables: ['Intent Keyword Research', 'Paid Search & Social Funnels', 'Intent SEO Content', 'Conversion Tracking']
  },
  {
    path: '/services/automation',
    num: '04',
    title: 'Sales & Workflow Automation',
    loss: 'Automation',
    text: 'Instant lead responses, calendar syncs, and custom Python integration pipelines that eliminate manual work.',
    deliverables: ['Instant Lead Response', 'CRM Pipeline Sync', 'Review Generation Engine', 'Custom API Webhooks']
  },
];

const pillars = [
  { num: '01', stat: '3-4 WK', label: 'Average Delivery' },
  { num: '02', stat: '100%', label: 'Client Ownership' },
  { num: '03', stat: '$0', label: 'Agency Retainer' },
  { num: '04', stat: '1-ON-1', label: 'Direct Access' },
];

export default function Services() {
  return (
    <SecondaryLayout title="Services" description="Branding, Custom Web Development, Marketing, and Automation for startups and growing businesses.">

      {/* 1. DARK HERO SECTION */}
      <section className="band band--ink" style={{ background: 'var(--ink)', color: '#ffffff', padding: '100px 0 72px' }}>
        <div className="wrap">
          {/* Yellow Badge Pill */}
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
              ✓ FOUR DISCIPLINES • ONE INTEGRATED ENGINE
            </span>
          </div>

          <h1 className="h-xl" style={{ color: '#ffffff', marginBottom: '20px', maxWidth: '880px' }}>
            WE BUILD THE ENTIRE DIGITAL SYSTEM<span style={{ color: 'var(--beacon)' }}>.</span>
          </h1>

          <p className="lede" style={{ color: 'var(--text-d)', maxWidth: '720px', fontSize: '19px', lineHeight: '1.6', marginBottom: '36px' }}>
            Branding first, then custom web development, followed by growth marketing and workflow automation. Every layer compounds the one before it.
          </p>

          <div className="btns" style={{ justifyContent: 'flex-start' }}>
            <Link className="btn btn--go" to="/contact-us">Get a Custom Quote</Link>
            <Link className="btn btn--line" to="/packages" style={{ color: '#fff', borderColor: 'var(--line-d)' }}>See Pricing</Link>
          </div>
        </div>

        {/* STATS ANCHOR BAR */}
        <div className="hero-anchor" style={{ marginTop: '56px' }}>
          {pillars.map((p) => (
            <div key={p.num} className="ha">
              <span className="ha-n">{p.num}</span>
              <span className="ha-t">{p.stat}</span>
              <span className="ha-d">{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. CORE DISCIPLINES GRID */}
      <section className="band" style={{ padding: '96px 0' }}>
        <div className="wrap">
          <span className="label">Core Disciplines</span>
          <h2 className="h-lg" style={{ marginBottom: '16px' }}>
            Four capabilities, one unified team<span style={{ color: 'var(--amber)' }}>.</span>
          </h2>
          <p className="lede" style={{ color: 'var(--steel)', marginBottom: '44px' }}>
            Choose a module below to inspect deliverables, processes, and pricing breakdown.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {services.map((s) => (
              <Link
                key={s.path}
                to={s.path}
                className="gcard"
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--line)',
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ color: 'var(--amber)', fontFamily: 'var(--mono)', fontWeight: '700', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                      MODULE {s.num}
                    </span>
                    <span style={{ background: 'var(--concrete)', border: '1px solid var(--line)', color: 'var(--steel)', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '2px', fontFamily: 'var(--mono)' }}>
                      {s.loss}
                    </span>
                  </div>

                  <h3 className="h-md" style={{ color: 'var(--ink)', fontSize: '22px', marginBottom: '12px', lineHeight: '1.2' }}>
                    {s.title}
                  </h3>

                  <p style={{ color: 'var(--steel)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                    {s.text}
                  </p>

                  <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--steel)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--mono)', display: 'block', marginBottom: '10px' }}>
                      Key Deliverables:
                    </span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {s.deliverables.map((d) => (
                        <li key={d} style={{ fontSize: '13.5px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: 'var(--amber)', fontWeight: '700' }}>✓</span> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--amber)', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--mono)' }}>
                    Explore Module →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS / METHOD (CONCRETE) */}
      <section className="band band--concrete" style={{ background: 'var(--concrete)', padding: '96px 0' }}>
        <div className="wrap">
          <span className="label">The Method</span>
          <h2 className="h-lg" style={{ marginBottom: '16px' }}>
            Layered by design, not by accident<span style={{ color: 'var(--amber)' }}>.</span>
          </h2>
          <p className="lede" style={{ color: 'var(--steel)', marginBottom: '44px' }}>
            Each discipline builds on the last. Brand equity amplifies web conversion. Web infrastructure powers marketing ROI. Automation compounds all three.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              ['Brand First', 'Establish visual authority and market positioning before any other spend.'],
              ['Then Build', 'Deploy a fast, conversion-optimised web presence on top of brand equity.'],
              ['Then Grow', 'Run paid and organic acquisition channels into a proven web system.'],
              ['Then Automate', 'Eliminate manual follow-up and operational bottlenecks with custom pipelines.'],
            ].map(([h, p], i) => (
              <div key={h} className="gcard" style={{ background: '#ffffff', border: '1px solid var(--line)', padding: '28px 24px' }}>
                <span style={{ color: 'var(--amber)', fontFamily: 'var(--mono)', fontWeight: '700', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                  STEP 0{i + 1}
                </span>
                <h3 className="h-md" style={{ color: 'var(--ink)', fontSize: '20px', marginBottom: '10px' }}>
                  {h}<span style={{ color: 'var(--amber)' }}>.</span>
                </h3>
                <p style={{ color: 'var(--steel)', fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>
                  {p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA BLOCK */}
      <CTA title="Ready to build your complete digital system?" buttonText="Book a Discovery Call" />
    </SecondaryLayout>
  );
}
