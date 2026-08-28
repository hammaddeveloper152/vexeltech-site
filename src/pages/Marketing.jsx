import React from 'react';
import ServicePage from './ServicePage.jsx';

const marketingData = {
  tag: 'marketing',
  metaTitle: 'Digital Marketing & Acquisition Services | Vexeltech',
  metaDesc: 'Google Ads, Meta advertising, and intent-driven SEO built to turn traffic into pipeline.',
  heroHeadline: 'TRAFFIC THAT TURNS INTO PIPELINE, NOT IMPRESSIONS',
  badge: 'PERFORMANCE MARKETING ENGINES',
  intro: 'Stop wasting budget on clicks that go nowhere. We build acquisition funnels around high-intent buyers, custom landing pages, and transparent conversion tracking.',
  ctaText: 'Get a Marketing Plan',
  startingPrice: '$1,500/mo',
  deliverablesTitle: 'Targeted acquisition funnels built for qualified demand',
  techStack: ['Google Ads', 'Meta Manager', 'GA4', 'Ahrefs', 'Search Console', 'GoHighLevel'],
  included: [
    ['Intent Keyword Research', 'Identifying high-converting buyer search queries before spending budget.'],
    ['Paid Search & Social', 'Structuring campaign ad groups around clear buyer intent and offers.'],
    ['Technical SEO', 'Optimizing site structure and content to capture persistent search visibility.'],
    ['Conversion Tracking', 'Setting up GA4 event logging to measure exact acquisition costs per lead.']
  ],
  types: [
    ['Google Search Campaigns', 'Targeting bottom-of-funnel buyers actively searching for your service.'],
    ['Meta Paid Social', 'Visual ad campaigns built around explicit offers and structured landing pages.'],
    ['Intent SEO Content', 'High-ranking answer pages that generate compounding inbound organic leads.'],
    ['Landing Page Design', 'High-converting destinations tailored explicitly to incoming ad traffic.']
  ],
  process: [
    ['Audience Audit', 'Evaluating channel costs, buyer demographics, and competitor strategy.'],
    ['Funnel Design', 'Designing search terms, ad creatives, and campaign landing page journeys.'],
    ['Build & Integration', 'Writing high-converting ad copy and configuring tracking pixels.'],
    ['Launch & Monitor', 'Activating live campaigns with daily bid management and budget scaling.'],
    ['Reporting', 'Monthly updates focusing on lead quality, cost per acquisition, and ROAS.']
  ],
  faq: [
    ['Do I own the ad accounts?', 'Yes. All Google Ads, Meta, and analytics accounts remain 100% yours.'],
    ['How soon do campaigns launch?', 'Campaign structures and ad copy are ready for launch within 7 to 10 business days.']
  ]
};

export default function Marketing() {
  return <ServicePage data={marketingData} />;
}