import React from 'react';
import { Link } from 'react-router-dom';
import SecondaryLayout from '../components/SecondaryLayout.jsx';

export default function NotFound() {
  return (
    <SecondaryLayout title="Page Not Found" description="The requested page could not be found. Return to VexelTech Solutions homepage.">
      <section className="band band--ink" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <div className="wrap" style={{ width: '100%' }}>
          <span className="label" style={{ color: 'var(--beacon)' }}>404 Error <i>/ Route Missing</i></span>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', margin: '16px 0 24px', textTransform: 'uppercase', color: '#fff' }}>
            Page Not Found
          </h1>
          <p style={{ margin: '0 auto 32px', fontSize: '1.2rem', color: 'var(--text-d)', maxWidth: '580px' }}>
            The requested page does not exist or has been relocated. Choose a destination below to continue exploring VexelTech.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn--go" style={{ display: 'inline-flex', alignItems: 'center', padding: '16px 32px', fontWeight: 700 }}>
              Return to Homepage
            </Link>
            <Link to="/services" className="btn btn--sec" style={{ display: 'inline-flex', alignItems: 'center', padding: '16px 32px', border: '1px solid var(--line-d)', color: '#fff' }}>
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </SecondaryLayout>
  );
}
