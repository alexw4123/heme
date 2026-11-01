import React, {useRef, useState} from 'react';
import {ArrowRightIcon, ChevronDownIcon} from '@radix-ui/react-icons';
import './applications.css';

const uses = [
  {
    id:'peroxide', label:'Peroxide', number:'01', title:'Measure peroxide with light.',
    question:'How much peroxide is in the sample?',
    copy:'The assembly would help peroxide oxidize ABTS, a reporter molecule. Its green product absorbs light. Known peroxide standards turn that optical response into a concentration estimate.',
    chain:['Peroxide in the sample', 'Assembly + ABTS', 'Absorbance measurement'],
    test:'First compare the response with free hemin and horseradish peroxidase, or HRP. Check background, reproducibility and the useful measurement range.',
    next:'The starting point is a cuvette or microplate assay in buffer.',
    source:{label:'Designed peroxidase research', url:'https://www.nature.com/articles/s41467-017-00541-4'}
  },
  {
    id:'glucose', label:'Glucose', number:'02', title:'Connect glucose to the same signal.',
    question:'How does a peroxide reporter become a glucose test?',
    copy:'Glucose oxidase, or GOx, recognizes glucose and generates hydrogen peroxide. A validated heme assembly could report that peroxide through ABTS oxidation. GOx supplies recognition. The assembly supplies the reporter reaction.',
    chain:['Glucose + GOx + oxygen', 'Hydrogen peroxide', 'ABTS optical signal'],
    test:'Validate the peroxide assay first. Then calibrate the complete GOx reaction against glucose standards and check sample interference and agreement with a reference method.',
    next:'A different SP1 and hemin scaffold has demonstrated this route. Its performance does not establish performance for this bundle.',
    source:{label:'SP1 and hemin glucose assay', url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC11935090/'},
    extraSource:{label:'Official glucose oxidase reaction', url:'https://enzyme.expasy.org/EC/1.1.3.4'}
  },
  {
    id:'screening', label:'Drug research', number:'03', title:'Check what a screening hit is doing.',
    question:'Is a compound acting on the target or generating peroxide?',
    copy:'Some compounds generate peroxide in screening buffers. That chemistry can make them appear to inhibit a target indirectly. A validated peroxide reporter could help identify this problem during drug discovery.',
    chain:['Compound in assay buffer', 'Test for peroxide', 'Confirm the cause'],
    test:'Check whether the compound changes ABTS color directly or interferes with the reporter. Use a catalase-treated comparison and an independent peroxide method.',
    next:'The pharmaceutical connection is a laboratory assay reagent. No therapeutic use has been established for this bundle.',
    source:{label:'Published peroxide screening assay', url:'https://pubmed.ncbi.nlm.nih.gov/18699726/'}
  }
];

const roadmap = [
  ['Confirm the material.', 'Reconcile the sequence and preparation record for each construct. Compare assembly by circular dichroism and measure hemin binding.'],
  ['Test the chemistry.', 'Compare peroxide-dependent ABTS oxidation with the assembly, matched free hemin, peptide-only and reagent controls. Include no-peroxide blanks and an HRP reference.'],
  ['Calibrate peroxide.', 'Use known standards to determine the useful range, repeatability, background, sample recovery and interference.'],
  ['Add glucose recognition.', 'Couple a validated reporter to GOx. Test glucose standards and compare the complete assay with an independent glucose method.'],
  ['Measure the practical benefit.', 'Compare response time, storage losses, batch reproducibility and cost per validated test. A device would also need tests of immobilization and hemin retention.']
];

export function Applications(){
  const [selected,setSelected]=useState(0);
  const tabRefs=useRef([]);
  function onTabKey(event,index){
    let next=index;
    if(event.key==='ArrowRight')next=(index+1)%uses.length;
    else if(event.key==='ArrowLeft')next=(index+uses.length-1)%uses.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=uses.length-1;
    else return;
    event.preventDefault();setSelected(next);tabRefs.current[next]?.focus();
  }
  return <section id="applications" className="applications-section" data-section="applications" aria-labelledby="applications-heading">
    <header className="application-heading">
      <span className="eyebrow">Applications</span>
      <h2 id="applications-heading">Make peroxide<br/>measurable.</h2>
      <div className="application-intro"><p>The first goal is an optical peroxide assay. From there, the same reporter chemistry could support a glucose test or help check compounds in drug research.</p><p>For this bundle, activity and calibration still need to be measured.</p></div>
    </header>

    <div className="application-tabs" role="tablist" aria-label="Explore an application">
      {uses.map((use,index)=><button type="button" key={use.id} ref={node=>tabRefs.current[index]=node} id={'use-tab-'+use.id} role="tab" aria-selected={selected===index} aria-controls={'use-panel-'+use.id} tabIndex={selected===index?0:-1} onClick={()=>setSelected(index)} onKeyDown={event=>onTabKey(event,index)}><span>{use.number}</span>{use.label}</button>)}
    </div>

    {uses.map((current,index)=><div key={current.id} className={'application-panel application-'+current.id} id={'use-panel-'+current.id} role="tabpanel" aria-labelledby={'use-tab-'+current.id} tabIndex={0} hidden={selected!==index}>
      <div className="application-purpose"><p className="application-question">{current.question}</p><h3>{current.title}</h3><p>{current.copy}</p>
        <ol className="application-chain" aria-label="Reaction and measurement sequence">{current.chain.map((item,index)=><li key={item}><span>{item}</span>{index<current.chain.length-1&&<ArrowRightIcon aria-hidden="true"/>}</li>)}</ol>
      </div>
      <div className="application-test"><span className="eyebrow">What needs to be tested</span><p>{current.test}</p><p className="application-context">{current.next}</p><div className="application-sources"><a href={current.source.url} target="_blank" rel="noopener noreferrer">{current.source.label} <ArrowRightIcon/></a>{current.extraSource&&<a href={current.extraSource.url} target="_blank" rel="noopener noreferrer">{current.extraSource.label} <ArrowRightIcon/></a>}</div></div>
    </div>)}

    <div className="application-design"><h3>What this design lets us change.</h3><div><p>The cap, linker, peptide sequence and histidine placement can be varied separately. The experiment asks which changes help retain hemin while keeping the reaction site accessible.</p><a className="text-link" href="#modeling">See the model versions <ArrowRightIcon/></a></div></div>

    <details className="application-cost"><summary><span>Could it cost less?</span><ChevronDownIcon aria-hidden="true"/></summary><div><p>That depends on how much active material each measurement needs and how well it survives storage. A short peptide does not automatically make a cheaper assay.</p><p>Compare synthesis and purification, catalyst loading, batch failures and storage losses with an HRP assay at comparable performance. Include the reader, reporter reagents and GOx when relevant. The useful comparison is cost per validated measurement.</p></div></details>

    <section id="next-steps" className="application-roadmap" aria-labelledby="roadmap-heading"><header><span className="eyebrow">The plan</span><h3 id="roadmap-heading">What happens next.</h3><p>Establish one result before building on it.</p></header><ol>{roadmap.map(([title,copy],index)=><li key={title}><span className="roadmap-number">{String(index+1).padStart(2,'0')}</span><div><h4>{title}</h4><p>{copy}</p></div></li>)}</ol><a className="text-link" href="#laboratory">Laboratory records and construct details <ArrowRightIcon/></a></section>
  </section>;
}
