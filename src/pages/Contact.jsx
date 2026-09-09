/* THE EMAIL IS info@vexeltechsolutions.com, given by the user 2026-09-08.
   Every hello@ address in this file was replaced. It is not a branding
   change: a published address that nobody reads sends a reader's message
   nowhere, and on the legal pages it is the address a privacy request or a
   data subject request is told to use. */
import React from 'react';
import SecondaryLayout from '../components/SecondaryLayout.jsx';

export default function Contact() {
  return (
    <SecondaryLayout title="Contact Us">
      {/* Homepage-Matching Hero Section */}
      <section 
        className="band band--ink" 
        style={{ 
          background: 'var(--ink)', 
          color: '#ffffff', 
          padding: '100px 0 80px'
        }}
      >
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
              ✓ Contact • 15-Minute Intro
            </span>
          </div>

          {/* Left-Aligned Bold Title */}
          <h1 
            className="h-xl" 
            style={{ 
              color: '#ffffff', 
              fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
              lineHeight: '1.05',
              marginBottom: '20px'
            }}
          >
            LET'S TALK ABOUT WHAT NEEDS FIXING<span style={{ color: 'var(--beacon)' }}>.</span>
          </h1>

          {/* Subtitle */}
          <p 
            className="lede" 
            style={{ 
              color: 'var(--text-d)', 
              marginBottom: '36px', 
              fontSize: '18px',
              maxWidth: '640px'
            }}
          >
            Book a 15-minute call, request a callback, or ring us directly. We show up with the fix built, not a proposal.
          </p>

          {/* Buttons */}
          <div className="btns" style={{ justifyContent: 'flex-start' }}>
            <a 
              className="btn btn--go" 
              href="#name"
            >
              Request a Callback
            </a>
            <a className="btn btn--line" href="tel:+13852843265" style={{ color: '#fff', borderColor: 'var(--line-d)' }}>
              Call (385) 284-3265
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Form Area */}
      <section className="band band--concrete" style={{ background: 'var(--concrete)', padding: '80px 0' }}>
        <div className="wrap">
          <div className="hero-grid" style={{ alignItems: 'start' }}>
            
            {/* Form Column wrapped in Signature Card styling */}
            <div className="sig" style={{ padding: '32px', background: '#fff', border: '1px solid var(--line)' }}>
              <span className="label">Request a callback</span>
              <h2 className="h-lg" style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--ink)' }}>
                Tell us what you need<span style={{ color: 'var(--amber)' }}>.</span>
              </h2>

              <form className="form" name="contact" method="POST" action="/thanks" data-netlify="true" netlify-honeypot="company-website">
                <input type="hidden" name="form-name" value="contact" />
                <p style={{ display: 'none' }}>
                  <label>Leave this empty <input name="company-website" /></label>
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <label className="sig-cap" style={{ padding: '0 0 6px 0' }} htmlFor="name">Your name</label>
                  <input id="name" name="name" type="text" required minLength="2" autoComplete="name" style={{ width: '100%', padding: '14px', border: '1px solid var(--line)', background: 'var(--concrete)', fontFamily: 'var(--body)' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="sig-cap" style={{ padding: '0 0 6px 0' }} htmlFor="email">Email address</label>
                  <input id="email" name="email" type="email" required autoComplete="email" style={{ width: '100%', padding: '14px', border: '1px solid var(--line)', background: 'var(--concrete)', fontFamily: 'var(--body)' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="sig-cap" style={{ padding: '0 0 6px 0' }} htmlFor="phone">Phone number</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" style={{ width: '100%', padding: '14px', border: '1px solid var(--line)', background: 'var(--concrete)', fontFamily: 'var(--body)' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="sig-cap" style={{ padding: '0 0 6px 0' }} htmlFor="business">What kind of work do you do?</label>
                  <input id="business" name="business" placeholder="Automation, Web Development, Software..." style={{ width: '100%', padding: '14px', border: '1px solid var(--line)', background: 'var(--concrete)', fontFamily: 'var(--body)' }} />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label className="sig-cap" style={{ padding: '0 0 6px 0' }} htmlFor="message">What do you need help with?</label>
                  <textarea id="message" name="message" rows="4" style={{ width: '100%', padding: '14px', border: '1px solid var(--line)', background: 'var(--concrete)', fontFamily: 'var(--body)' }}></textarea>
                </div>

                <button className="btn btn--go" type="submit" style={{ width: '100%' }}>
                  Send request
                </button>
              </form>
            </div>

            {/* Direct Contact Details Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="gcard">
                <span className="label">Direct Contact</span>
                {/* The entity line read "Vexel Scales LLC". Removed 2026-09-08:
                    CLAUDE.md records no Vexel Scales reference of any kind
                    anywhere on the site, decided by the user directly. */}
                <p className="gcard-m" style={{ marginBottom: '16px' }}>Richmond, TX 77406, USA</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href="tel:+13852843265" className="btn btn--ink" style={{ justifyContent: 'flex-start' }}>
                    📞 (385) 284-3265
                  </a>
                  <a href="mailto:info@vexeltechsolutions.com" className="btn btn--line" style={{ justifyContent: 'flex-start' }}>
                    ✉️ info@vexeltechsolutions.com
                  </a>
                </div>
              </div>

              <div className="sig-mid">
                <span>Fast Response Guaranteed</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </SecondaryLayout>
  );
}