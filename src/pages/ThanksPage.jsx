import React from 'react';
import { Link } from 'react-router-dom';
import SecondaryLayout from '../components/SecondaryLayout.jsx';

export default function ThanksPage() {
  return (
    <SecondaryLayout title="Submission Received" description="Thank you for reaching out to VexelTech Solutions. We will review your request and get back to you shortly.">
      <section className="band band--ink" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <div className="wrap" style={{ width: '100%' }}>
          <span className="label">Submission Confirmed <i>/ 01</i></span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', margin: '16px 0 24px', textTransform: 'uppercase' }}>
            We've Received Your Request
          </h1>
          <p style={{ margin: '0 auto 32px', fontSize: '1.2rem', color: 'var(--text-d)', maxWidth: '580px' }}>
            Thank you for reaching out to VexelTech. We show up with actual work built, not generic pitch decks. A member of our team will review your project details and reach out within 24 hours.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn--go" style={{ display: 'inline-flex', alignItems: 'center', padding: '16px 32px', fontWeight: 700 }}>
              Return to Homepage
            </Link>
          </div>
        </div>
      </section>
    </SecondaryLayout>
  );
}
