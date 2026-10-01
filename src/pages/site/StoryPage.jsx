import React from 'react';
import { useParams } from 'react-router-dom';
import Shell from './Shell.jsx';
import CostFrames from '../../components/story/CostFrames.jsx';
import RecentWork from '../../components/story/RecentWork.jsx';
import ContactTimeline from '../../components/story/ContactTimeline.jsx';
import GrowthDiagram from '../../components/story/GrowthDiagram.jsx';
import BuildAround from '../../components/story/BuildAround.jsx';
import FitLedger from '../../components/story/FitLedger.jsx';
import TermsSheet from '../../components/story/TermsSheet.jsx';
import ServiceFrame from '../../components/story/ServiceFrames.jsx';
import '../../styles/aboutpage.css';
import '../../styles/light.css';

/* THE STORYTELLING PREVIEW, 2026-10-01 (the founder's storytelling pass,
   `storytelling` branch only). Each new component on its page's ground,
   before any is wired into a page: /story/<id>. noindex, linked from
   nowhere, no form. Comes out when the components go into their pages. */

/* The Services frames, each on its band's ground at the right column's
   width: Branding and Marketing on the base, Websites and Automation on a
   cream sheet, as the bands alternate. */
function ServiceBands() {
  return ['branding', 'websites', 'marketing', 'automation'].map((id, i) => {
    const cream = i % 2 === 1;
    return (
      <section
        key={id}
        className={`vt st-sec ${cream ? 'panel-sec' : ''}`}
        style={{ color: cream ? 'var(--c-asphalt)' : 'var(--c-bone)' }}
        aria-label={`${id} frame`}
      >
        <div className="st-in" style={{ maxWidth: 560 }}>
          <p className="st-mono" style={{ margin: '0 0 24px', color: cream ? 'var(--c-steel)' : 'var(--c-steel-lift)' }}>
            {id}
          </p>
          <ServiceFrame id={id} />
        </div>
      </section>
    );
  });
}

const VIEWS = {
  cost: { light: false, node: <CostFrames /> },
  work: { light: false, node: <RecentWork /> },
  timeline: { light: false, node: <ContactTimeline /> },
  growth: { light: true, node: <GrowthDiagram /> },
  around: { light: true, node: <BuildAround /> },
  fit: { light: true, node: <FitLedger /> },
  terms: { light: true, node: <TermsSheet /> },
  services: { light: false, node: <ServiceBands /> },
};

export default function StoryPage() {
  const { id } = useParams();
  const v = VIEWS[id] || VIEWS.cost;
  return (
    <Shell title="Story preview | VexelTech" path={`/story/${id}`} noindex footerForm={false} light={v.light}>
      {v.node}
    </Shell>
  );
}
