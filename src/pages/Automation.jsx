import React from 'react';
import ServicePage from './ServicePage.jsx';

const automationData = {
  tag: 'automation',
  metaTitle: 'Workflow & Sales Automation Services | Vexeltech',
  metaDesc: 'Instant lead response engines, CRM pipelines, and custom Python backend integrations.',
  heroHeadline: 'NEVER LET A QUALIFIED LEAD GO COLD AGAIN',
  badge: 'WORKFLOW & CRM AUTOMATION',
  intro: 'Manual lead follow-up and disconnected software cost your business hours and closed deals. We build automated lead response, calendar syncs, and custom data pipelines.',
  ctaText: 'Build Follow-Up Engine',
  startingPrice: '$1,200',
  deliverablesTitle: 'Automations designed to save hours and capture revenue',
  techStack: ['Python', 'GoHighLevel', 'Make', 'Zapier', 'Twilio', 'Webhooks'],
  included: [
    ['Instant Response Engine', 'Trigger sub-60-second automated SMS/Email replies to incoming inquiries.'],
    ['Calendar Booking Flows', 'Connect lead forms directly to sales calendars with automated reminders.'],
    ['Follow-Up Sequences', 'Nurture cold leads or sent quotes automatically until closed.'],
    ['Custom Data Webhooks', 'Connect disparate systems, CRMs, and databases using custom Python scripts.']
  ],
  types: [
    ['Instant Lead Response', 'Automated first responses that acknowledge leads and book calls immediately.'],
    ['CRM Pipeline Sync', 'Structured stage tracking so your sales team knows where every lead stands.'],
    ['Review Generation Engine', 'Automated post-service SMS requests that boost positive Google reviews.'],
    ['Custom API Integrations', 'Data migration, payroll tools, and webhook bridges connecting your software.']
  ],
  process: [
    ['Workflow Mapping', 'Diagramming existing lead touchpoints and identifying operational bottlenecks.'],
    ['Copy & Logic Design', 'Drafting natural, human messaging sequences aligned with your tone.'],
    ['Integration Setup', 'Linking webhooks, CRMs, messaging platforms, and database endpoints.'],
    ['Stress Testing', 'Simulating edge-case lead entries to ensure zero duplicate messages or breaks.'],
    ['Activation', 'Deploying live automation sequences with real-time error logging.']
  ],
  faq: [
    ['Will messages sound robotic?', 'No. We write natural copy tailored to your brand voice.'],
    ['What platforms can you integrate?', 'We integrate any platform with an API or webhook access, including GoHighLevel, Zapier, Make, and custom backends.']
  ]
};

export default function Automation() {
  return <ServicePage data={automationData} />;
}