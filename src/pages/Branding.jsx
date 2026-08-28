import React from 'react';
import ServicePage from './ServicePage.jsx';

const brandingData = {
  tag: 'branding',
  metaTitle: 'Brand Identity Design Services | Vexeltech',
  metaDesc: 'Logos, typography, color palettes, and comprehensive brand books designed as long-term business assets.',
  heroHeadline: "LOOK LIKE THE BRAND YOU'RE BUILDING TOWARD",
  badge: 'BRAND IDENTITY & SYSTEM DESIGN',
  intro: "A logo isn't a luxury - it is a core business asset. Fragmented visual branding causes potential clients to doubt your credibility before reading your offer.",
  ctaText: 'Start Your Brand',
  startingPrice: '$1,800',
  deliverablesTitle: 'Complete visual systems built to scale across touchpoints',
  techStack: ['Adobe Illustrator', 'Figma', 'Photoshop', 'After Effects', 'InDesign'],
  included: [
    ['Primary & Secondary Logos', 'Versatile vector logo systems designed to perform across screens, print, and dark UI.'],
    ['Strategic Color Palette', 'High-contrast palette definitions with dark/light background application rules.'],
    ['Typography Pairing', 'Distinctive headline and body typography pairs for clear content visual hierarchy.'],
    ['Brand Guidelines Book', 'Actionable document ensuring visual consistency for internal teams and vendors.']
  ],
  types: [
    ['Logo & Identity System', 'Core mark design that establishes immediate market contrast and recognition.'],
    ['Brand Guidelines Manual', 'Usage rules covering clear spacing, color codes, and visual do\'s and don\'ts.'],
    ['Social & Marketing Kit', 'Reusable banner templates, pitch deck frames, and social asset kits.'],
    ['Print & Collateral', 'Stationery, packaging mockups, and corporate materials engineered for print.']
  ],
  process: [
    ['Discovery', 'Uncovering visual positioning, target demographic, and market competitors.'],
    ['Research', 'Evaluating industry benchmarks to build a distinct visual contrast.'],
    ['Concepting', 'Exploring distinct vector mark directions, typography pairs, and color palettes.'],
    ['Refinement', 'Polishing chosen directions across real-world digital and print mockups.'],
    ['Final Hand-off', 'Delivering complete vector master files (SVG, EPS, AI) and brand asset kits.']
  ],
  faq: [
    ['How many revisions are included?', 'Revisions are structured directly into the concept and refinement stages for clarity.'],
    ['What file formats will I get?', 'You get full vector files (SVG, EPS, AI) as well as web-ready PNG, JPG, and icon formats.'],
    ['Do I own the trademark rights?', 'Yes, full intellectual property and copyrights transfer directly to you upon delivery.']
  ]
};

export default function Branding() {
  return <ServicePage data={brandingData} />;
}