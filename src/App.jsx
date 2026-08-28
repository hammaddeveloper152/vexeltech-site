import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import Services from './pages/Services.jsx';
import WebDevelopment from './pages/WebDevelopment.jsx';
import Branding from './pages/Branding.jsx';
import Marketing from './pages/Marketing.jsx';
import Automation from './pages/Automation.jsx';
import Portfolio from './pages/Portfolio.jsx';
import About from './pages/About.jsx';
import Packages from './pages/Packages.jsx';
import Contact from './pages/Contact.jsx';
import Blog from './pages/Blog.jsx';
import Industries from './pages/Industries.jsx';
import SimplePage from './pages/SimplePage.jsx';
import ThanksPage from './pages/ThanksPage.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<Services />} />
      
      {/* SUB-SERVICES */}
      <Route path="/services/websites" element={<WebDevelopment />} />
      <Route path="/services/web-development" element={<WebDevelopment />} />
      <Route path="/services/branding" element={<Branding />} />
      <Route path="/services/marketing" element={<Marketing />} />
      <Route path="/services/automation" element={<Automation />} />
      
      {/* ROUTE ALIASES */}
      <Route path="/web-development" element={<WebDevelopment />} />
      <Route path="/web-development/" element={<WebDevelopment />} />
      <Route path="/websites.html" element={<WebDevelopment />} />
      <Route path="/branding" element={<Branding />} />
      <Route path="/branding/" element={<Branding />} />
      <Route path="/marketing" element={<Marketing />} />
      <Route path="/marketing/" element={<Marketing />} />
      <Route path="/automation" element={<Automation />} />
      <Route path="/automation/" element={<Automation />} />
      
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/portfolio/" element={<Portfolio />} />
      <Route path="/portfolio.html" element={<Portfolio />} />
      <Route path="/work" element={<Portfolio />} />
      <Route path="/work/" element={<Portfolio />} />
      <Route path="/case-studies" element={<Portfolio />} />
      <Route path="/about-us" element={<About />} />
      <Route path="/about/" element={<About />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/pricing/" element={<Packages />} />
      <Route path="/pricing" element={<Packages />} />
      <Route path="/contact-us" element={<Contact />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/contact-us/" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/industries" element={<Industries />} />
      
      {/* THANK YOU & LEGAL */}
      <Route path="/thanks" element={<ThanksPage />} />
      <Route path="/thanks.html" element={<ThanksPage />} />
      <Route path="/privacy-policy" element={<SimplePage title="Privacy Policy" />} />
      <Route path="/privacy-policy/" element={<SimplePage title="Privacy Policy" />} />
      <Route path="/terms-of-service" element={<SimplePage title="Terms of Service" />} />
      <Route path="/terms-of-service/" element={<SimplePage title="Terms of Service" />} />
      <Route path="/privacy.html" element={<SimplePage title="Privacy Policy" />} />
      <Route path="/terms.html" element={<SimplePage title="Terms of Service" />} />
      
      {/* WILDCARD 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}