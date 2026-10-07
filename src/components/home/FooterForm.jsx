import React from 'react';
import LeadForm from '../site/LeadForm.jsx';
import SectionJoin from '../site/SectionJoin.jsx';
import './FooterForm.css';

/* THE FORM ABOVE THE FOOTER (final32, 2026-10-07, the founder). Until now
   this was the footer: a cream sheet with the "Let's talk." card beside the
   form, then the bottom row. The footer is SiteFooter.jsx now, after
   <main> on every page; the card's words moved into it, and FooterMeta.jsx
   is deleted. What stays here is the form, as its own cream section in the
   1180 container: "Get in touch" and LeadForm, on every page but Contact,
   which has its own, and About, the legal pages and /thanks, which never
   had one. On home it opens with the yellow join, like home's other
   sections. */
export default function FooterForm({ join = false }) {
  return (
    <section className="vt foot foot--sheet" aria-labelledby="foot-h">
      <div className="foot__sheet foot__sheet--form">
        {join ? <SectionJoin /> : null}
        <div className="foot__inner">
          <h2 className="foot__h" id="foot-h">
            Get in touch
          </h2>
          <LeadForm idPrefix="ff" labelledBy="foot-h" />
        </div>
      </div>
    </section>
  );
}
