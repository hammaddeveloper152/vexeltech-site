import React from 'react';
import { Section, Cards } from './Blocks.jsx';

export default function PageDepth({label='Working notes',title='The useful details behind the work',items}){
  return <>
    <Section label={label} title={title}><Cards items={items.slice(0,4).map(([heading,text])=>({title:heading,text}))}/></Section>
    <Section label="What happens next" title="A clear next step, not another content maze" concrete><div className="rows">{items.slice(4,7).map(([heading,text],index)=><div className="row" key={heading}><span className="row-k">0{index+1} - {heading}</span><span className="row-v">{text}</span></div>)}</div></Section>
  </>;
}
