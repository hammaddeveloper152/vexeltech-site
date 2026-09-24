/* THE DASHES ARE OUT OF THE SHIPPED TEXT, 2026-09-08.

   Thirteen em dashes were rendering on these two pages, including one in
   both title tags, which BUILD-LAW.md **Markup** names explicitly. Legal
   prose is shipped output and is not the one exception the rule allows,
   which is a verbatim customer quote.

   Each was replaced with the punctuation the sentence already wanted: a
   colon where a label introduces its definition, commas where a phrase was
   parenthetical or appositive. NO CLAUSE CHANGED MEANING, which is the bar
   for touching a contract at all. The dashes left in this file are inside
   comment banners and are not shipped.

   WHAT IS DELIBERATELY UNTOUCHED: the $150 hourly cancellation rate, the
   50/50 milestone split and the 1.5% monthly late fee. Those are terms of an
   agreement rather than published service prices, so the "a URL is kept only
   while what it says is true" rule does not reach them the way it reached
   the sub-service pages. They are also unverified by anything in the content
   answers or the pricing sheet, and that is reported rather than fixed. */
/* THE EMAIL IS info@vexeltechsolutions.com, given by the user 2026-09-08.
   Every hello@ address in this file was replaced. It is not a branding
   change: a published address that nobody reads sends a reader's message
   nowhere, and on the legal pages it is the address a privacy request or a
   data subject request is told to use. */
/* THE VEXEL SCALES REFERENCES IN THIS FILE ARE DELIBERATELY LEFT ALONE.

   CLAUDE.md records, as settled, that no Vexel Scales attribution or parent
   company line appears anywhere on the site. That decision was applied on
   2026-09-08 to the legacy footer and the legacy contact card, which are
   marketing surfaces.

   IT IS NOT APPLIED HERE, AND THAT IS A DECISION FOR THE USER RATHER THAN
   FOR THIS BUILD. These two pages are the Privacy Policy and the Terms of
   Service, and in them "Vexel Scales LLC" is not attribution. It is the
   named data controller, the counterparty to a binding agreement, and the
   physical mailing address a CAN-SPAM clause commits to including. Removing
   the entity from a contract to satisfy a branding rule would break the
   contract, and a legal page that does not say who you are contracting with
   is worse than one that mentions a name the marketing site does not.

   Flagged rather than resolved. If the entity is to come off these pages
   too, that is a legal question, not a design one. */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SecondaryLayout from '../components/SecondaryLayout.jsx';

/* ─────────────────────────────────────────────────────────────────
   PRIVACY POLICY — comprehensive, Termly/Iubenda-equivalent
   Effective for form data collection, email marketing, analytics
───────────────────────────────────────────────────────────────── */
const PRIVACY = {
  badge: 'LEGAL & DATA PROTECTION',
  title: 'Privacy Policy',
  effective: 'Effective Date: August 22, 2026',
  updated: 'Last Updated: August 22, 2026',
  subtitle: 'How VexelTech Solutions (a brand of Vexel Scales LLC) collects, uses, and protects your personal information.',
  intro: 'VexelTech Solutions ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website vexeltechsolutions.com, contact us through our forms, or engage us for services. Please read this policy carefully. If you disagree with its terms, please discontinue use of our site.',
  highlights: [
    { icon: '🚫', title: 'Never Sold', desc: 'We do not sell, rent, trade, or monetize your personal data to any third party under any circumstances.' },
    { icon: '🎯', title: 'Purpose-Limited', desc: 'Data is collected only to respond to your inquiry, scope your project, and deliver contracted services.' },
    { icon: '🔒', title: 'TLS Encrypted', desc: 'All data transmitted to and from our website and staging environments is protected via HTTPS/TLS encryption.' },
    { icon: '✉️', title: 'Your Rights', desc: 'You may request access, correction, or deletion of your personal data at any time by contacting us directly.' }
  ],
  sections: [
    {
      id: '1',
      title: '1. Information We Collect',
      content: [
        {
          sub: 'a. Information You Provide Directly',
          body: 'When you submit a contact form, request a consultation, book a discovery call, subscribe to our newsletter, or engage us for services, we may collect: your full name, email address, phone number, company name, job title, website URL, project description, budget range, and any files or documents you choose to share. We also collect information you provide during the course of an active project engagement, including credentials, API keys, brand assets, and business documentation necessary to fulfill services.'
        },
        {
          sub: 'b. Information Collected Automatically',
          body: 'When you visit our website, our servers and analytics tools may automatically collect: IP address, browser type and version, operating system, referring URLs, pages visited, time spent on pages, geographic location (country/region level only), and device type. This information is collected through standard web server logs and may include cookies or similar tracking technologies.'
        },
        {
          sub: 'c. Cookies and Tracking Technologies',
          body: 'We use essential cookies to ensure our website functions properly and analytics cookies to understand how visitors interact with our site. We do not use advertising cookies or behavioral tracking cookies. You may instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some portions of our website may not function properly. We do not respond to "Do Not Track" browser signals at this time.'
        }
      ]
    },
    {
      id: '2',
      title: '2. How We Use Your Information',
      content: [
        {
          sub: 'Purposes of Processing',
          body: 'We use the information we collect to: (1) respond to your inquiries and fulfill service agreements; (2) schedule and conduct consultation calls; (3) prepare project scopes, proposals, and technical specifications; (4) communicate project milestones, deliverables, and updates; (5) send transactional emails related to your project or account; (6) send our newsletter or educational content if you have opted in; (7) improve our website, services, and customer experience; (8) comply with legal obligations; and (9) enforce our Terms of Service and protect our legal rights.'
        }
      ]
    },
    {
      id: '3',
      title: '3. Legal Basis for Processing (GDPR)',
      content: [
        {
          sub: 'For Users in the European Economic Area',
          body: 'If you are located in the EEA, our legal bases for processing your personal data are: (1) Contract Performance: processing necessary to deliver services you have engaged us for; (2) Legitimate Interests: processing necessary for our legitimate business interests such as improving our website and services, provided those interests are not overridden by your data protection rights; (3) Consent: where you have provided explicit consent, such as subscribing to our marketing communications; and (4) Legal Obligation: processing required to comply with applicable law.'
        }
      ]
    },
    {
      id: '4',
      title: '4. Email Communications & CAN-SPAM Compliance',
      content: [
        {
          sub: 'Marketing Emails',
          body: 'If you subscribe to our email newsletter or marketing communications, we will send you periodic emails containing educational content, company updates, and service information. In accordance with the CAN-SPAM Act: (1) we identify all commercial messages clearly as advertisements; (2) we include our physical mailing address (Vexel Scales LLC, Richmond, TX 77406, USA) in every email; (3) every email includes a clear and functioning unsubscribe mechanism; and (4) we honor all unsubscribe requests within 10 business days. You can unsubscribe at any time by clicking the unsubscribe link in any email or by emailing info@vexeltechsolutions.com with "Unsubscribe" in the subject line.'
        }
      ]
    },
    {
      id: '5',
      title: '5. Sharing and Disclosure of Information',
      content: [
        {
          sub: 'We Do Not Sell Your Data',
          body: 'We do not sell, trade, rent, or otherwise transfer your personally identifiable information to outside parties for commercial purposes.'
        },
        {
          sub: 'Service Providers',
          body: 'We may share your information with trusted third-party vendors who assist us in operating our website and conducting our business, including: cloud hosting providers (e.g., Netlify, Vercel, Cloudflare), email service providers (e.g., Resend, Mailchimp), CRM platforms (e.g., GoHighLevel, HubSpot), calendar and scheduling tools (e.g., Calendly), and analytics platforms (e.g., Google Analytics, Plausible). These parties are contractually obligated to keep your information confidential and to use it only for the purposes of providing services to us.'
        },
        {
          sub: 'Legal Requirements',
          body: 'We may disclose your information if required to do so by law or in response to valid legal process, including a court order, subpoena, or government investigation, or when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, or investigate fraud.'
        }
      ]
    },
    {
      id: '6',
      title: '6. Data Retention',
      content: [
        {
          sub: 'Retention Periods',
          body: 'We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy and to comply with our legal obligations. Specifically: inquiry and contact form submissions are retained for 24 months from the date of last communication; active client project data is retained for the duration of the project plus 36 months for support and reference purposes; financial and billing records are retained for 7 years as required by US tax law; and newsletter subscriber data is retained until you unsubscribe or request deletion. Upon expiration of the applicable retention period, we will securely delete or anonymize your personal data.'
        }
      ]
    },
    {
      id: '7',
      title: '7. Your Privacy Rights (CCPA / GDPR)',
      content: [
        {
          sub: 'California Residents: CCPA Rights',
          body: 'Under the California Consumer Privacy Act (CCPA), California residents have the right to: (1) know what personal information we collect and how it is used; (2) request deletion of personal information we have collected about you; (3) opt out of the sale of personal information (note: we do not sell your data); and (4) non-discrimination for exercising your CCPA rights. To submit a CCPA request, contact us at info@vexeltechsolutions.com or (385) 284-3265.'
        },
        {
          sub: 'EEA / UK Residents: GDPR Rights',
          body: 'If you are located in the European Economic Area or United Kingdom, you have the right to: access, rectification, erasure ("right to be forgotten"), restriction of processing, data portability, and to object to processing. You also have the right to lodge a complaint with your local data protection supervisory authority. To exercise these rights, contact us at info@vexeltechsolutions.com. We will respond to verified requests within 30 days.'
        }
      ]
    },
    {
      id: '8',
      title: '8. Security',
      content: [
        {
          sub: 'Security Measures',
          body: 'We implement commercially reasonable technical and organizational security measures designed to protect your personal information from unauthorized access, use, alteration, or destruction. These include TLS/HTTPS encryption for all data in transit, access control policies limiting data access to authorized personnel, and secure credential management practices. However, no internet transmission or electronic storage method is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.'
        }
      ]
    },
    {
      id: '9',
      title: '9. Children\'s Privacy',
      content: [
        {
          sub: 'Age Restriction',
          body: 'Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16 without verifiable parental consent, we will take steps to delete that information promptly. If you believe we may have collected information from a child under 16, please contact us at info@vexeltechsolutions.com.'
        }
      ]
    },
    {
      id: '10',
      title: '10. Changes to This Policy',
      content: [
        {
          sub: 'Policy Updates',
          body: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by updating the "Last Updated" date at the top of this policy. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information. Your continued use of our website and services following the posting of changes constitutes your acceptance of such changes.'
        }
      ]
    },
    {
      id: '11',
      title: '11. Contact & Data Controller',
      content: [
        {
          sub: 'Data Controller Information',
          body: 'The data controller responsible for your personal information is: Vexel Scales LLC (operating as VexelTech Solutions), Richmond, TX 77406, United States. For privacy inquiries, data subject requests, or to exercise any of the rights described in this policy, contact our privacy desk: Email: info@vexeltechsolutions.com | Phone: (385) 284-3265. We aim to respond to all privacy inquiries within 30 days of receipt.'
        }
      ]
    }
  ]
};

/* ─────────────────────────────────────────────────────────────────
   TERMS OF SERVICE — comprehensive commercial terms
───────────────────────────────────────────────────────────────── */
const TERMS = {
  badge: 'COMMERCIAL TERMS OF ENGAGEMENT',
  title: 'Terms of Service',
  effective: 'Effective Date: August 22, 2026',
  updated: 'Last Updated: August 22, 2026',
  subtitle: 'The agreement governing all projects, payments, intellectual property, revisions, and service delivery at VexelTech Solutions.',
  intro: 'These Terms of Service ("Terms") constitute a legally binding agreement between you ("Client," "you," or "your") and Vexel Scales LLC, a Texas limited liability company operating as VexelTech Solutions ("VexelTech," "we," "our," or "us"). By engaging our services, submitting a project deposit, or signing a project scope document, you agree to be bound by these Terms. If you do not agree, do not engage our services.',
  highlights: [
    { icon: '🏆', title: '100% IP Ownership', desc: 'Upon final payment, all deliverables, source code, and creative assets transfer entirely to you with no strings attached.' },
    { icon: '📋', title: 'Scope-First', desc: 'Every project begins with a written scope document. Work outside that scope is quoted and approved before it begins.' },
    { icon: '💳', title: '50/50 Milestones', desc: 'Standard projects use a 50% initiation deposit and 50% final payment before production deployment.' },
    { icon: '🛡️', title: 'Mutual NDA Available', desc: 'We gladly execute mutual non-disclosure agreements upon request before project initiation.' }
  ],
  sections: [
    {
      id: '1',
      title: '1. Services and Scope of Work',
      content: [
        {
          sub: '1.1 Project Initiation',
          body: 'All engagements with VexelTech Solutions are governed by a written Scope of Work ("SOW") document that defines deliverables, technical specifications, milestone timelines, revision rounds, and total fees. The SOW, together with these Terms, constitute the complete agreement between the parties for that project. No work will begin until the SOW is acknowledged and the initiation deposit is received.'
        },
        {
          sub: '1.2 Change Orders',
          body: 'Any requested changes outside the defined scope of work, including additional features, expanded deliverables, platform changes, or material revisions to agreed specifications, will be documented in a written Change Order outlining the additional scope, cost, and timeline impact. Change Orders must be approved in writing by both parties before additional work begins. Verbal approvals for out-of-scope work are not binding.'
        },
        {
          sub: '1.3 Client Responsibilities',
          body: 'Timely project completion depends on the Client providing: accurate and complete project briefs; required access credentials (domain DNS, hosting, CMS, API keys); brand assets, copy, imagery, and product data as specified in the SOW; and timely feedback within agreed review windows. Delays caused by the Client\'s failure to provide required materials may result in revised timelines and, in some cases, additional fees for project re-engagement.'
        }
      ]
    },
    {
      id: '2',
      title: '2. Fees, Payment Terms, and Billing',
      content: [
        {
          sub: '2.1 Standard Project Payment Structure',
          body: 'Unless otherwise specified in the SOW, all custom project engagements operate on a 50/50 milestone payment structure: a non-refundable 50% initiation deposit is due before sprint work begins (this deposit reserves your build slot and covers initial architecture and planning work); and the remaining 50% is due upon Client approval of the final staging environment, before production deployment.'
        },
        {
          sub: '2.2 Package and Retainer Billing',
          body: 'Productized packages and ongoing retainer engagements are billed as specified in the applicable package description or retainer agreement. Monthly retainers are billed on the 1st of each month. All invoices are due within 7 business days of issuance unless otherwise agreed in writing.'
        },
        {
          sub: '2.3 Late Payments',
          body: 'Invoices not paid within 7 business days are considered past due. VexelTech reserves the right to pause all active project work until outstanding invoices are settled. Accounts more than 30 days past due may be subject to a 1.5% monthly late fee on the unpaid balance. VexelTech also reserves the right to withhold delivery of final files, source code, and hosting credentials until all outstanding fees are paid in full.'
        },
        {
          sub: '2.4 Taxes',
          body: 'All fees are exclusive of applicable taxes. If VexelTech is required to collect sales tax, VAT, or similar taxes based on your location or the nature of services provided, such taxes will be added to your invoice. You are responsible for all taxes imposed on or related to your receipt of services under these Terms.'
        }
      ]
    },
    {
      id: '3',
      title: '3. Intellectual Property & Ownership',
      content: [
        {
          sub: '3.1 Client Ownership Upon Full Payment',
          body: 'Upon receipt of all payments due under the applicable SOW, VexelTech assigns and transfers to Client full ownership of all custom deliverables created specifically for Client\'s project, including: source code (HTML, CSS, JavaScript, React components, Python scripts, etc.), vector design files (Illustrator, Figma source files), brand identity assets, copywriting created for the project, and any other custom-built materials identified as deliverables in the SOW.'
        },
        {
          sub: '3.2 VexelTech Retained Rights',
          body: 'VexelTech retains ownership of: (a) all pre-existing tools, frameworks, boilerplate code, libraries, and proprietary systems that VexelTech uses as part of its standard development methodology; (b) open-source software components, which remain subject to their respective open-source licenses; and (c) the general knowledge, skills, experience, and methodologies acquired during the project. VexelTech grants Client a perpetual, royalty-free license to use any pre-existing VexelTech tools and frameworks incorporated into the deliverables.'
        },
        {
          sub: '3.3 Portfolio Rights',
          body: 'Unless Client expressly requests otherwise in writing before project commencement, VexelTech reserves the right to display completed work in its portfolio, case studies, and marketing materials, subject to any confidentiality restrictions in a separately executed NDA.'
        },
        {
          sub: '3.4 Third-Party Assets',
          body: 'Stock photography, icon libraries, font licenses, plugin licenses, and other third-party assets incorporated into deliverables remain subject to their respective third-party license terms. VexelTech will inform Client of any such assets used and any licensing costs or restrictions that apply. Client is responsible for securing and maintaining appropriate licenses for third-party assets used in their ongoing operations.'
        }
      ]
    },
    {
      id: '4',
      title: '4. Revisions, Approvals, and Project Completion',
      content: [
        {
          sub: '4.1 Included Revision Rounds',
          body: 'Each project tier includes a defined number of structured revision rounds as specified in the SOW. A revision round consists of a consolidated set of feedback on a specific deliverable stage, not individual, ongoing change requests submitted over time. All revision requests within an included round must be submitted together in a single written communication. VexelTech will not accept revisions submitted in piecemeal fashion across multiple emails or messages as separate revision rounds.'
        },
        {
          sub: '4.2 Staging Environment Approval',
          body: 'Prior to final production deployment, Client will be provided access to a live staging environment containing the completed project. Client has an agreed review window (typically 5-10 business days as specified in the SOW) to review the staging environment and submit any final revision requests within the included revision rounds. Client\'s written approval of the staging environment, or silence past the review deadline, constitutes final acceptance of the deliverables.'
        },
        {
          sub: '4.3 Project Completion and Handover',
          body: 'Upon receipt of final payment and Client approval, VexelTech will: transfer all applicable hosting configurations; hand over all source code repositories; deliver master design files; transfer all relevant account access (domain DNS, hosting panels, CMS credentials). The Client is responsible for maintaining and renewing all third-party subscriptions, hosting accounts, and domain registrations after handover.'
        }
      ]
    },
    {
      id: '5',
      title: '5. Cancellation and Termination',
      content: [
        {
          sub: '5.1 Client-Initiated Cancellation',
          body: 'Either party may terminate a project engagement with 7 days written notice. If Client cancels a project after work has begun: the initiation deposit is non-refundable; Client is responsible for payment of all work completed to the date of cancellation, calculated at VexelTech\'s standard hourly rate of $150/hour; and VexelTech will deliver all completed work product in its current state upon receipt of payment for work completed. Work will not be delivered until any outstanding balance is settled.'
        },
        {
          sub: '5.2 VexelTech-Initiated Termination',
          body: 'VexelTech reserves the right to terminate a project engagement immediately and without prior notice if: Client engages in abusive, threatening, or harassing behavior toward VexelTech team members; Client requests that VexelTech produce illegal, fraudulent, or malicious content or systems; or Client materially breaches these Terms and fails to cure such breach within 7 days of written notice. In the event of VexelTech-initiated termination for Client breach, the initiation deposit is non-refundable and Client is liable for payment of all completed work.'
        }
      ]
    },
    {
      id: '6',
      title: '6. Confidentiality',
      content: [
        {
          sub: '6.1 Mutual Confidentiality',
          body: 'Each party agrees to keep confidential all non-public, proprietary, or commercially sensitive information disclosed by the other party in connection with a project ("Confidential Information"). Each party agrees not to disclose Confidential Information to any third party without prior written consent, except to employees or contractors who need to know such information to fulfill obligations under these Terms and are bound by confidentiality obligations at least as protective as those herein. This obligation of confidentiality survives the termination of any project engagement for a period of three (3) years.'
        },
        {
          sub: '6.2 Mutual NDA',
          body: 'Upon Client request, VexelTech will execute a standalone mutual non-disclosure agreement prior to receiving any sensitive business information, proprietary technology details, or trade secrets. Please request this by emailing info@vexeltechsolutions.com before your initial consultation if required.'
        }
      ]
    },
    {
      id: '7',
      title: '7. Warranties and Representations',
      content: [
        {
          sub: '7.1 VexelTech Warranties',
          body: 'VexelTech warrants that: (a) it has the right to enter into these Terms and perform the services; (b) services will be performed in a professional and workmanlike manner consistent with industry standards; (c) deliverables will materially conform to the specifications set forth in the applicable SOW; and (d) to VexelTech\'s knowledge, custom-created deliverables (excluding third-party components) will not infringe on any third-party intellectual property rights.'
        },
        {
          sub: '7.2 Disclaimer',
          body: 'EXCEPT AS EXPRESSLY SET FORTH IN SECTION 7.1, VEXELTECH PROVIDES ALL SERVICES AND DELIVERABLES "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. VEXELTECH DOES NOT WARRANT THAT DELIVERABLES WILL BE FREE OF DEFECTS OR ERRORS, THAT THEY WILL MEET ALL CLIENT EXPECTATIONS, OR THAT THEIR USE WILL ACHIEVE ANY SPECIFIC BUSINESS OUTCOME, INCLUDING SPECIFIC REVENUE, TRAFFIC, OR CONVERSION RESULTS.'
        }
      ]
    },
    {
      id: '8',
      title: '8. Limitation of Liability',
      content: [
        {
          sub: '8.1 Liability Cap',
          body: 'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL VEXELTECH\'S TOTAL LIABILITY TO CLIENT FOR ANY CLAIM ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES EXCEED THE TOTAL FEES ACTUALLY PAID BY CLIENT TO VEXELTECH UNDER THE APPLICABLE SOW DURING THE THREE (3) MONTHS PRECEDING THE CLAIM.'
        },
        {
          sub: '8.2 Exclusion of Consequential Damages',
          body: 'IN NO EVENT SHALL VEXELTECH BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF BUSINESS OPPORTUNITY, LOSS OF GOODWILL, OR LOSS OF DATA, EVEN IF VEXELTECH HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you.'
        }
      ]
    },
    {
      id: '9',
      title: '9. Indemnification',
      content: [
        {
          sub: 'Client Indemnification',
          body: 'Client agrees to indemnify, defend, and hold harmless VexelTech, its members, officers, employees, and contractors from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys\' fees) arising out of or related to: (a) Client\'s use or misuse of deliverables after handover; (b) any content, materials, or information provided by Client and incorporated into deliverables; (c) Client\'s violation of any applicable law or third-party rights; or (d) any breach by Client of these Terms.'
        }
      ]
    },
    {
      id: '10',
      title: '10. Governing Law and Dispute Resolution',
      content: [
        {
          sub: '10.1 Governing Law',
          body: 'These Terms shall be governed by and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law principles.'
        },
        {
          sub: '10.2 Informal Resolution',
          body: 'Before initiating any formal dispute process, the parties agree to attempt to resolve any dispute informally by contacting the other party in writing and meeting (in person, by phone, or video call) within 14 days of the written notice. Both parties will act in good faith to resolve the issue.'
        },
        {
          sub: '10.3 Binding Arbitration',
          body: 'If informal resolution fails, any dispute, claim, or controversy arising out of or relating to these Terms or the breach thereof shall be settled by binding arbitration in Fort Bend County, Texas, conducted by a single arbitrator in accordance with the rules of the American Arbitration Association (AAA). The decision of the arbitrator shall be final and binding and may be entered as a judgment in any court of competent jurisdiction. Notwithstanding the foregoing, either party may seek injunctive relief in a court of competent jurisdiction to prevent irreparable harm pending arbitration.'
        }
      ]
    },
    {
      id: '11',
      title: '11. General Provisions',
      content: [
        {
          sub: 'Entire Agreement / Severability / No Waiver',
          body: 'These Terms, together with any executed SOW and applicable Change Orders, constitute the entire agreement between the parties with respect to the subject matter hereof and supersede all prior agreements. If any provision of these Terms is held unenforceable, the remaining provisions will continue in full force. Failure of either party to enforce any right or provision of these Terms shall not constitute a waiver of that right or provision. These Terms may not be assigned by Client without VexelTech\'s prior written consent. VexelTech may assign these Terms without restriction.'
        },
        {
          sub: 'Contact for Legal Inquiries',
          body: 'Vexel Scales LLC (VexelTech Solutions) | Richmond, TX 77406, USA | info@vexeltechsolutions.com | (385) 284-3265'
        }
      ]
    }
  ]
};

/* ─────────────────────────────────────────────────────────────────
   SHARED SUBCOMPONENTS
───────────────────────────────────────────────────────────────── */
function TableOfContents({ sections, activeId, onJump }) {
  return (
    <nav aria-label="Table of contents" style={{
      position: 'sticky',
      top: '96px',
      background: '#ffffff',
      border: '1px solid var(--line)',
      borderRadius: '4px',
      padding: '20px',
      alignSelf: 'flex-start',
      minWidth: '220px',
      maxWidth: '260px',
      flexShrink: 0
    }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--steel)', marginBottom: '12px' }}>
        TABLE OF CONTENTS
      </div>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {sections.map(sec => {
          const sId = sec.id;
          const isActive = activeId === sId;
          return (
            <li key={sId}>
              <button
                onClick={() => onJump(sId)}
                style={{
                  background: isActive ? 'var(--concrete)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '2px solid var(--amber)' : '2px solid transparent',
                  padding: '6px 10px',
                  fontSize: '12.5px',
                  color: isActive ? 'var(--ink)' : 'var(--steel)',
                  fontFamily: 'var(--body)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  lineHeight: '1.4',
                  width: '100%',
                  borderRadius: '0 3px 3px 0',
                  transition: 'all 0.15s ease'
                }}
              >
                {sec.title.replace(/^\d+\.\s/, '')}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function SectionBlock({ sec }) {
  return (
    <section id={`section-${sec.id}`} style={{ marginBottom: '40px', scrollMarginTop: '112px' }}>
      <h2 style={{
        fontFamily: 'var(--disp)',
        fontWeight: '700',
        fontSize: 'clamp(18px, 2vw, 22px)',
        color: 'var(--ink)',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '2px solid var(--line)'
      }}>
        {sec.title}
      </h2>
      {sec.content.map((block, i) => (
        <div key={i} style={{ marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--amber)', marginBottom: '8px' }}>
            {block.sub}
          </h3>
          <p style={{ fontSize: '15px', color: 'var(--steel)', lineHeight: '1.8', margin: 0 }}>
            {block.body}
          </p>
        </div>
      ))}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────────── */
export default function SimplePage({ title }) {
  const isPrivacy = title.toLowerCase().includes('privacy');
  const data = isPrivacy ? PRIVACY : TERMS;
  const [activeId, setActiveId] = useState('1');

  const jumpTo = (id) => {
    setActiveId(id);
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <SecondaryLayout
      /* The bare title: SecondaryLayout adds the suffix, and passing it
         here as well doubled it (the release audit, 2026-09-25). */
      title={data.title}
      description={data.subtitle}
    >

      {/* ══════════════════════════════════════════════════════
          1. DARK HERO
      ══════════════════════════════════════════════════════ */}
      <section className="band band--ink" style={{ background: 'var(--ink)', color: '#ffffff', padding: 'clamp(72px,10vw,108px) 0 clamp(56px,7vw,80px)' }}>
        <div className="wrap">
          <div style={{ display: 'flex', marginBottom: '22px' }}>
            <span style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--beacon)',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: '50px',
              fontFamily: 'var(--mono)'
            }}>
              ✓ {data.badge}
            </span>
          </div>

          <h1 className="h-xl" style={{ color: '#ffffff', marginBottom: '18px', maxWidth: '820px' }}>
            {data.title.toUpperCase()}<span style={{ color: 'var(--beacon)' }}>.</span>
          </h1>

          <p className="lede" style={{ color: 'var(--text-d)', maxWidth: '680px', fontSize: '18px', lineHeight: '1.65', marginBottom: '28px' }}>
            {data.subtitle}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--steel)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {data.effective}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--steel)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {data.updated}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <a href="mailto:info@vexeltechsolutions.com" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--beacon)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none' }}>
              Legal Questions →
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. KEY COMMITMENTS
      ══════════════════════════════════════════════════════ */}
      <section className="band" style={{ background: '#ffffff', padding: '52px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {data.highlights.map(h => (
              <div key={h.title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '22px', flexShrink: 0, lineHeight: 1, marginTop: '2px' }}>{h.icon}</span>
                <div>
                  <div style={{ fontFamily: 'var(--disp)', fontWeight: '700', fontSize: '15px', color: 'var(--ink)', marginBottom: '4px' }}>{h.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--steel)', lineHeight: '1.5' }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. INTRO + TWO-COLUMN LEGAL BODY
      ══════════════════════════════════════════════════════ */}
      <section className="band band--concrete" style={{ background: 'var(--concrete)', padding: 'clamp(56px,8vw,96px) 0' }}>
        <div className="wrap">
          {/* Intro paragraph */}
          <div style={{
            background: 'var(--ink)',
            color: 'var(--text-d)',
            padding: '24px 28px',
            borderRadius: '4px',
            borderLeft: '3px solid var(--beacon)',
            marginBottom: '40px',
            fontSize: '15px',
            lineHeight: '1.7'
          }}>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '6px', fontFamily: 'var(--mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              PLAIN LANGUAGE SUMMARY
            </strong>
            {data.intro}
          </div>

          {/* Body: sidebar TOC + sections */}
          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
            {/* Sidebar TOC — hidden on small screens via flex-wrap */}
            <div className="toc-sidebar" style={{ display: 'flex', flexShrink: 0 }}>
              <TableOfContents
                sections={data.sections}
                activeId={activeId}
                onJump={jumpTo}
              />
            </div>

            {/* Main content */}
            <div style={{ flex: 1, minWidth: 0, background: '#ffffff', border: '1px solid var(--line)', borderRadius: '4px', padding: 'clamp(24px,4vw,40px)' }}>
              {data.sections.map(sec => (
                <SectionBlock key={sec.id} sec={sec} />
              ))}

              {/* Jurisdiction notice */}
              <div style={{ background: 'var(--concrete)', border: '1px solid var(--line)', borderRadius: '3px', padding: '20px 24px', marginTop: '8px' }}>
                <p style={{ fontSize: '13px', color: 'var(--steel)', lineHeight: '1.6', margin: 0 }}>
                  <strong style={{ color: 'var(--ink)' }}>Jurisdiction Notice:</strong> This {data.title} is governed by the laws of the State of Texas, United States. If any provision of this document is found to be unenforceable, the remaining provisions shall remain in full force and effect. This document was last reviewed for compliance with CAN-SPAM, CCPA (California Consumer Privacy Act), and GDPR (General Data Protection Regulation) as of its effective date. For jurisdiction-specific questions, please consult a licensed attorney.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. ENTITY CONTACT BLOCK
      ══════════════════════════════════════════════════════ */}
      <section className="band band--ink" style={{ background: 'var(--ink)', padding: 'clamp(56px,8vw,80px) 0' }}>
        <div className="wrap">
          <div style={{
            background: 'var(--ink-2)',
            border: '1px solid var(--line-d)',
            borderRadius: '4px',
            padding: 'clamp(28px,4vw,44px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '32px',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--beacon)', marginBottom: '10px' }}>
                Official Legal Entity
              </span>
              <h3 className="h-md" style={{ color: '#ffffff', fontSize: '22px', marginBottom: '10px' }}>Vexel Scales LLC</h3>
              <p style={{ color: 'var(--text-d)', fontSize: '14px', lineHeight: '1.65', margin: 0 }}>
                Operating as <strong style={{ color: '#fff' }}>VexelTech Solutions</strong>. A Texas limited liability company. All contracts, invoices, and legal notices are issued under Vexel Scales LLC.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: '1px solid var(--line-d)', paddingLeft: 'clamp(0px,3vw,28px)' }}>
              {[
                { label: 'Registered State', value: 'Texas, United States' },
                { label: 'Physical Address', value: 'Richmond, TX 77406, USA' },
                { label: 'Legal & Privacy Desk', value: 'info@vexeltechsolutions.com', href: 'mailto:info@vexeltechsolutions.com' },
                { label: 'Direct Line', value: '(385) 284-3265', href: 'tel:+13852843265' }
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--steel)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>{item.label}</div>
                  {item.href
                    ? <a href={item.href} style={{ color: 'var(--beacon)', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>{item.value}</a>
                    : <span style={{ color: '#ffffff', fontSize: '14px' }}>{item.value}</span>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. FOOTER NAVIGATION — cross-link both docs + contact
      ══════════════════════════════════════════════════════ */}
      <section className="band" style={{ background: '#ffffff', padding: '40px 0', borderTop: '1px solid var(--line)' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              to={isPrivacy ? '/terms-of-service' : '/privacy-policy'}
              style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: '700', color: 'var(--steel)', textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none' }}
            >
              {isPrivacy ? 'View Terms of Service →' : 'View Privacy Policy →'}
            </Link>
            <span style={{ color: 'var(--line)' }}>|</span>
            <Link
              to="/contact-us"
              style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: '700', color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none' }}
            >
              Contact Legal Desk →
            </Link>
          </div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--steel)' }}>
            © 2026 Vexel Scales LLC · All rights reserved
          </span>
        </div>
      </section>

    </SecondaryLayout>
  );
}
