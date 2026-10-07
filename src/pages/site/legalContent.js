import { ENTITY } from '../../content/entity.js';

/* THE LEGAL PAGES' COPY, moved verbatim from the legacy SimplePage.jsx on
   2026-09-25 (the founder's legacy rebuild). Not one clause is edited. What
   came out: the emoji each highlight carried (the site has one icon set, and
   an emoji is not in it).

   THE ENTITY IS content/entity.js SINCE THE LAUNCH GATE (2026-10-07, the
   founder): the legal entity name, state of formation, file number and
   geographic address are bracketed placeholders there until the founder
   supplies them. The "Vexel Scales LLC", "Texas limited liability company"
   and "Richmond, TX 77406" strings that stood here are gone.

   WHAT IS UNVERIFIED AND LEFT AS WRITTEN, as before: the $150 hourly
   cancellation rate, the 50/50 milestone split, the 1.5% monthly late fee and
   the phone number (385) 284-3265, which appears nowhere else on the site. */

/* THE PRIVACY POLICY, REWRITTEN FOR THE LAUNCH GATE (2026-10-07, the
   founder's item 17). It now states what the site actually does: the form
   posts to Formspree, Hostinger hosts the site and keeps its logs, and the
   site sets no cookies. The 2026-08-22 text described a newsletter,
   analytics cookies, Netlify, Google Analytics and CRMs the site does not
   use. Kept from the founder's text: the four highlights, the retention
   periods (24 months, project plus 36 months, 7 years), the 30-day
   response, the CCPA and GDPR rights and the children's clause. Every fact
   only the founder can give is a bracketed placeholder, and each is listed
   in .measure/audit/launch-gate.md. */
const E = ENTITY;
export const PRIVACY = {
  badge: 'LEGAL & DATA PROTECTION',
  title: 'Privacy Policy',
  effective: 'Effective Date: [EFFECTIVE DATE]',
  updated: 'Last Updated: [EFFECTIVE DATE]',
  subtitle: `How ${E.trading} (a brand of ${E.name}) collects, uses, and protects your personal information.`,
  intro: `${E.trading} ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains what we collect when you visit vexeltechsolutions.com or send us the contact form, why, who receives it, how long we keep it, and the rights you have over it.`,
  highlights: [
    { title: 'Never Sold', desc: 'We do not sell, rent, trade, or monetize your personal data to any third party under any circumstances.' },
    { title: 'Purpose-Limited', desc: 'Data is collected only to respond to your inquiry, scope your project, and deliver contracted services.' },
    { title: 'TLS Encrypted', desc: 'All data transmitted to and from our website is protected via HTTPS/TLS encryption.' },
    { title: 'Your Rights', desc: 'You may request access, correction, or deletion of your personal data at any time by contacting us directly.' },
  ],
  sections: [
    {
      id: '1',
      title: '1. Who We Are (the Controller)',
      content: [
        {
          sub: 'Data Controller',
          body: `The controller of your personal information is ${E.name}, trading as ${E.trading}, formed in ${E.state} (file number ${E.fileNumber}), of ${E.address}. Contact us about anything in this policy at ${E.email} or ${E.phone}.`,
        },
      ],
    },
    {
      id: '2',
      title: '2. Information We Collect',
      content: [
        {
          sub: 'a. What You Send Us Through the Form',
          body: 'Your name, phone number, email address and message. On the contact page, also the services you tick and the budget band you choose, if you choose one. If you arrived from a link that carried campaign tags (utm_source, utm_medium, utm_campaign, utm_content), those tags are sent with the form so we know which link brought you. Nothing is sent until you press Send.',
        },
        {
          sub: 'b. Server Logs',
          body: 'When you load a page, the server that hosts the site records a standard log line: your IP address, the date and time, the page requested, your browser and device type as your browser reports them, and the page that linked to us.',
        },
        {
          sub: 'c. Cookies',
          body: 'The site sets no cookies. The campaign tags in (a) are held in your browser\'s session storage for the length of the visit, so they reach the form from any page, and are cleared when you close the tab. [ANALYTICS: if Plausible Analytics or the Meta Pixel is turned on, describe it here before launch, or delete this sentence.]',
        },
      ],
    },
    {
      id: '3',
      title: '3. Why We Use It, and the Lawful Basis',
      content: [
        {
          sub: 'Purposes and Lawful Basis',
          body: 'We use form submissions to answer you, to prepare a quote or proposal, and to deliver the work if you engage us. The lawful basis is taking steps at your request before entering into a contract, and performing the contract once you have. We use server logs to keep the site running and secure, which is our legitimate interest in operating a safe website; we do not use them to identify you. We keep billing records because the law requires it (legal obligation).',
        },
      ],
    },
    {
      id: '4',
      title: '4. Who Receives It',
      content: [
        {
          sub: 'Recipients',
          body: 'Formspree receives the form submission and delivers it to our inbox at info@vexeltechsolutions.com; it processes the submission on our behalf and under its own security and privacy terms. Hostinger hosts the site and keeps the server logs on our behalf. We do not sell, rent, or trade personal information, and we share it with no one else unless the law requires it, for example in response to a court order.',
        },
      ],
    },
    {
      id: '5',
      title: '5. International Transfers',
      content: [
        {
          sub: 'Where Your Data Goes',
          body: 'We are based in the United States, and Formspree processes submissions in the United States. Hostinger keeps the server logs in [HOSTING REGION]. If you write to us from the UK, the European Economic Area or Australia, your information leaves your country. Where the law requires a safeguard for that transfer, we rely on [TRANSFER SAFEGUARD].',
        },
      ],
    },
    {
      id: '6',
      title: '6. How Long We Keep It',
      content: [
        {
          sub: 'Retention Periods',
          body: 'Inquiry and contact form submissions are retained for 24 months from the date of last communication; active client project data is retained for the duration of the project plus 36 months for support and reference purposes; financial and billing records are retained for 7 years as required by US tax law. Server logs are kept for [LOG RETENTION PERIOD]. When a period ends, we delete or anonymize the information.',
        },
      ],
    },
    {
      id: '7',
      title: '7. Your Rights',
      content: [
        {
          sub: 'UK and EEA Residents',
          body: 'You have the right to access your personal information, to have it corrected, to have it erased, to restrict or object to our processing of it, and to receive it in a portable form. Where we rely on your consent, you may withdraw it at any time.',
        },
        {
          sub: 'California Residents',
          body: 'Under the California Consumer Privacy Act (CCPA), you have the right to know what personal information we collect and how it is used, to request its deletion, to opt out of its sale (we do not sell it), and not to be discriminated against for exercising these rights.',
        },
        {
          sub: 'How to Ask',
          body: `Write to ${E.email} or call ${E.phone}. We respond to verified requests within 30 days.`,
        },
      ],
    },
    {
      id: '8',
      title: '8. Your Right to Complain',
      content: [
        {
          sub: 'Supervisory Authorities',
          body: 'If you are unhappy with how we handle your information, please tell us first so we can put it right. You also have the right to complain to a data protection authority: in the UK, the Information Commissioner\'s Office (ico.org.uk); in the European Economic Area, the supervisory authority where you live or work; in Australia, the Office of the Australian Information Commissioner (oaic.gov.au); in California, the California Privacy Protection Agency.',
        },
      ],
    },
    {
      id: '9',
      title: '9. Security',
      content: [
        {
          sub: 'Security Measures',
          body: 'The site is served over HTTPS, so what you send through the form is encrypted in transit. Access to submissions is limited to the people who answer them. No method of transmission or storage is completely secure, but we take reasonable care to protect what you send us.',
        },
      ],
    },
    {
      id: '10',
      title: '10. Children\'s Privacy',
      content: [
        {
          sub: 'Age Restriction',
          body: `Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16. If you believe we may have collected information from a child under 16, please contact us at ${E.email} and we will delete it.`,
        },
      ],
    },
    {
      id: '11',
      title: '11. Changes to This Policy',
      content: [
        {
          sub: 'Policy Updates',
          body: 'When we change this policy, we update the date at the top of the page. A material change is also stated here before it takes effect.',
        },
      ],
    },
  ],
};

export const TERMS = {
  badge: 'COMMERCIAL TERMS OF ENGAGEMENT',
  title: 'Terms of Service',
  effective: 'Effective Date: August 22, 2026',
  updated: 'Last Updated: August 22, 2026',
  subtitle: 'The agreement governing all projects, payments, intellectual property, revisions, and service delivery at VexelTech Solutions.',
  intro: `These Terms of Service ("Terms") constitute a legally binding agreement between you ("Client," "you," or "your") and ${ENTITY.name}, formed in ${ENTITY.state} (file number ${ENTITY.fileNumber}), operating as VexelTech Solutions ("VexelTech," "we," "our," or "us"). By engaging our services, submitting a project deposit, or signing a project scope document, you agree to be bound by these Terms. If you do not agree, do not engage our services.`,
  highlights: [
    { title: '100% IP Ownership', desc: 'Upon final payment, all deliverables, source code, and creative assets transfer entirely to you with no strings attached.' },
    { title: 'Scope-First', desc: 'Every project begins with a written scope document. Work outside that scope is quoted and approved before it begins.' },
    { title: '50/50 Milestones', desc: 'Standard projects use a 50% initiation deposit and 50% final payment before production deployment.' },
    { title: 'Mutual NDA Available', desc: 'We gladly execute mutual non-disclosure agreements upon request before project initiation.' }
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
          body: `${ENTITY.name} (VexelTech Solutions) | ${ENTITY.address} | ${ENTITY.email} | ${ENTITY.phone}`
        }
      ]
    }
  ]
};
