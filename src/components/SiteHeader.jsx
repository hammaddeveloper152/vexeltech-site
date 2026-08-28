import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const serviceLinks = [
  {
    number: '01',
    label: 'Branding & Identity',
    path: '/services/branding',
  },
  {
    number: '02',
    label: 'Web Development',
    path: '/services/web-development',
  },
  {
    number: '03',
    label: 'Digital Marketing',
    path: '/services/marketing',
  },
  {
    number: '04',
    label: 'Marketing Automation',
    path: '/services/automation',
  },
];

export default function SiteHeader() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const servicesRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target)
      ) {
        setServicesOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('mobile-nav-open', mobileOpen);

    return () => {
      document.body.classList.remove('mobile-nav-open');
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setServicesOpen(false);
  };

  return (
    <header className="mast">
      <div className="mast-in">

        {/* Logo */}
        <Link
          className="brand"
          to="/"
          aria-label="VexelTech Solutions home"
          onClick={closeMobileMenu}
        >
          <span className="brand-tile" aria-hidden="true">
            <svg viewBox="0 0 100 100" fill="none">
              <path
                className="mk"
                d="M7 33 29 25 50 60 78 6 94 2 54 93Z"
              />
            </svg>
          </span>

          <span>vexeltech</span>
        </Link>

        {/* Main Navigation */}
        <nav
          id="main-navigation"
          className={`site-nav ${
            mobileOpen ? 'site-nav--open' : ''
          }`}
          aria-label="Main navigation"
        >
          <ul className="nav">

            {/* Services */}
            <li
              className={`nav-item--has-dropdown ${
                servicesOpen ? 'services-open' : ''
              }`}
              ref={servicesRef}
              onMouseEnter={() => {
                if (window.innerWidth > 860) {
                  setServicesOpen(true);
                }
              }}
              onMouseLeave={() => {
                if (window.innerWidth > 860) {
                  setServicesOpen(false);
                }
              }}
            >
              <div className="nav-service-trigger">

                <Link
                  to="/services"
                  onClick={() => {
                    if (window.innerWidth <= 860) {
                      setServicesOpen(false);
                      closeMobileMenu();
                    }
                  }}
                >
                  Services
                </Link>

                <button
                  type="button"
                  className="nav-dropdown-toggle"
                  aria-label="Toggle Services menu"
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                  onClick={() => setServicesOpen((current) => !current)}
                >
                  <span
                    className={`nav-chevron ${
                      servicesOpen ? 'nav-chevron--open' : ''
                    }`}
                    aria-hidden="true"
                  >
                    ↓
                  </span>
                </button>

              </div>

              <ul
                className={`dropdown-menu ${
                  servicesOpen ? 'dropdown-menu--open' : ''
                }`}
                aria-label="Services"
              >
                {serviceLinks.map((service) => (
                  <li key={service.path}>
                    <Link
                      to={service.path}
                      onClick={closeMobileMenu}
                    >
                      <span className="dropdown-number">
                        {service.number}
                      </span>

                      <span>{service.label}</span>

                      <span
                        className="dropdown-arrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <Link to="/portfolio" onClick={closeMobileMenu}>
                Portfolio
              </Link>
            </li>

            <li>
              <Link to="/about-us" onClick={closeMobileMenu}>
                About
              </Link>
            </li>

            <li>
              <Link to="/packages" onClick={closeMobileMenu}>
                Pricing
              </Link>
            </li>

            <li>
              <Link to="/contact-us" onClick={closeMobileMenu}>
                Contact
              </Link>
            </li>

          </ul>
        </nav>

        {/* Right-side actions */}
        <div className="mast-actions">

          <a
            className="mast-tel"
            href="tel:+13852843265"
          >
            (385) 284-3265
          </a>

          <Link
            className="btn btn--go"
            to="/contact-us"
            onClick={closeMobileMenu}
          >
            Book a Discovery Call
          </Link>

          <button
            type="button"
            className={`mobile-nav-toggle ${
              mobileOpen ? 'mobile-nav-toggle--open' : ''
            }`}
            aria-label={
              mobileOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={mobileOpen}
            aria-controls="main-navigation"
            onClick={() => setMobileOpen((current) => !current)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>

        </div>

      </div>
    </header>
  );
}