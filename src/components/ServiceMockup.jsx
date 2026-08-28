import React from 'react';

export default function ServiceMockup({ kind }) {
  // 1. BRANDING MOCKUP (Brand Guide Palette & Tokens)
  if (kind === 'branding') {
    return (
      <div style={containerStyle}>
        <div style={headerTitleStyle}>Brand Guide Palette & Tokens</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: '#0C1017', borderRadius: '4px', border: '1px solid #1E2638' }} />
            <div>
              <div style={subLabelStyle}>PRIMARY INK</div>
              <div style={valueStyle}>#0C1017</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: '#00DC82', borderRadius: '4px' }} />
            <div>
              <div style={subLabelStyle}>ACCENT BEACON</div>
              <div style={valueStyle}>#00DC82</div>
            </div>
          </div>
        </div>
        <div style={footerTextStyle}>
          Aa Bb Cc — Syne & Inter Typography System
        </div>
      </div>
    );
  }

  // 2. WEB DEVELOPMENT MOCKUP (Code Architecture / Performance Metrics)
  if (kind === 'web') {
    return (
      <div style={containerStyle}>
        <div style={headerTitleStyle}>System Architecture & Performance</div>
        <div style={{ fontFamily: 'monospace', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ color: '#00DC82' }}>✓ FASTAPI / REACT BUILD: OPTIMIZED</div>
          <div style={{ color: '#8d98a7' }}>• LCP Score: <span style={{ color: '#ffffff' }}>0.4s (99/100)</span></div>
          <div style={{ color: '#8d98a7' }}>• SEO Audit: <span style={{ color: '#ffffff' }}>100% Index Ready</span></div>
          <div style={{ color: '#8d98a7' }}>• Schema Markup: <span style={{ color: '#ffcc00' }}>Active</span></div>
        </div>
        <div style={footerTextStyle}>
          React 19 + Vite HMR + Edge Deployment
        </div>
      </div>
    );
  }

  // 3. MARKETING MOCKUP (Funnel Analytics & CAC Metrics)
  if (kind === 'marketing') {
    return (
      <div style={containerStyle}>
        <div style={headerTitleStyle}>Campaign ROI & Conversion Tracking</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ borderLeft: '3px solid #00DC82', paddingLeft: '10px' }}>
            <div style={subLabelStyle}>GOOGLE ADS INTENT ROI</div>
            <div style={valueStyle}>4.8x Return on Ad Spend</div>
          </div>
          <div style={{ borderLeft: '3px solid #ffcc00', paddingLeft: '10px' }}>
            <div style={subLabelStyle}>META TARGETING CPL</div>
            <div style={valueStyle}>$14.20 / Qualified Lead</div>
          </div>
        </div>
        <div style={footerTextStyle}>
          Real-time Pixel & Attribution Webhooks Enabled
        </div>
      </div>
    );
  }

  // 4. AUTOMATION MOCKUP (Logic Sequence - Default)
  return (
    <div style={containerStyle}>
      <div style={headerTitleStyle}>Automation Logic Sequence</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'monospace', fontSize: '12px' }}>
        <div style={{ borderLeft: '3px solid #00DC82', paddingLeft: '10px' }}>
          <span style={{ color: '#00DC82', fontWeight: '800' }}>TRIGGER:</span> <span style={{ color: '#ffffff' }}>New Lead Form Submitted</span>
        </div>
        <div style={{ borderLeft: '3px solid #0099ff', paddingLeft: '10px' }}>
          <span style={{ color: '#0099ff', fontWeight: '800' }}>ACTION 1:</span> <span style={{ color: '#ffffff' }}>Instant SMS Reply (&lt; 45s)</span>
        </div>
        <div style={{ borderLeft: '3px solid #ffcc00', paddingLeft: '10px' }}>
          <span style={{ color: '#ffcc00', fontWeight: '800' }}>ACTION 2:</span> <span style={{ color: '#ffffff' }}>Sync Calendar & Assign CRM Pipeline</span>
        </div>
      </div>
    </div>
  );
}

/* REUSABLE STYLES FOR SLEEK DARK MOCKUP CARD */
const containerStyle = {
  background: '#121722',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '6px',
  padding: '24px 28px',
  minWidth: '320px',
  maxWidth: '420px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
};

const headerTitleStyle = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '700',
  marginBottom: '16px',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const subLabelStyle = {
  color: '#8d98a7',
  fontSize: '10px',
  fontWeight: '800',
  letterSpacing: '0.8px',
  fontFamily: 'monospace',
};

const valueStyle = {
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: '700',
  fontFamily: 'monospace',
  marginTop: '2px',
};

const footerTextStyle = {
  marginTop: '16px',
  paddingTop: '12px',
  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  color: '#8d98a7',
  fontSize: '11px',
  fontFamily: 'monospace',
};