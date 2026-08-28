import React from 'react';
import ServicePage from './ServicePage.jsx';

const webData = {
  tag: 'web',
  metaTitle: 'Custom Web Development Services | Vexeltech',
  metaDesc: 'Fast, high-converting custom websites built on React, Webflow, and FastAPI. Zero vendor lock-in.',
  heroHeadline: 'WEBSITES BUILT TO CONVERT, NOT JUST LOOK PRETTY',
  badge: 'SUB-SECOND SPEED & SEO OPTIMIZED',
  intro: 'Your site is costing you customers if it loads slow or fails to guide visitors to take action. We engineer clean, fast, custom web applications built to scale.',
  ctaText: 'Get a Free Website Audit',
  startingPrice: '$2,500',
  deliverablesTitle: 'Websites engineered for the exact job you need done',
  techStack: ['React', 'FastAPI', 'WordPress', 'Webflow', 'Tailwind CSS', 'GoHighLevel'],
  included: [
    ['Responsive Design', 'Flawless performance across desktop, tablet, and mobile with zero layout shift.'],
    ['Technical SEO Foundation', 'Clean semantic code, structured metadata, and Google search readiness.'],
    ['Sub-Second Load Times', 'Lightweight architectures optimized for core web vitals and fast rendering.'],
    ['Full CMS Control', 'Practical content editing setups with zero ongoing vendor lock-in.']
  ],
  types: [
    ['Corporate & Service Sites', 'High-impact web presences for established firms and growth companies.'],
    ['Custom WordPress Builds', 'Flexible WordPress setups tailored for total content editorial control.'],
    ['E-Commerce Platforms', 'Storefronts engineered around intuitive browsing and high checkout conversion.'],
    ['Targeted Landing Pages', 'Single-purpose campaign destinations focused on immediate user lead capture.']
  ],
  process: [
    ['Discovery', 'Analyzing technical constraints, business conversion goals, and target personas.'],
    ['Wireframing', 'Establishing UI structure, content hierarchy, and UX user pathways.'],
    ['Design', 'Crafting custom interfaces, dark-mode accents, and micro-interactions.'],
    ['Engineering', 'Writing clean, performant React, Webflow, or FastAPI production code.'],
    ['QA & Speed Audit', 'Rigorous mobile stability testing and Lighthouse speed optimization.'],
    ['Deployment', 'Launching directly to live hosting with complete analytics and DNS handoff.']
  ],
  faq: [
    ['How long does a web project take?', 'Typical turnaround is 2 to 4 weeks depending on scope, page count, and asset readiness.'],
    ['Do I own the final site?', 'Yes. You receive 100% ownership of code, assets, domains, and CMS accounts.'],
    ['Is SEO included?', 'Yes, technical and on-page SEO foundations are built into every website deployment.']
  ]
};

export default function Website() {
  return <ServicePage data={webData} />;
}