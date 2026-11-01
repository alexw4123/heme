import React,{useEffect,useRef,useState} from 'react';
import {ArrowRightIcon,PauseIcon,PlayIcon,ReloadIcon} from '@radix-ui/react-icons';
import './scroll-assay.css';

const steps=[
 {id:'assay-bundle',tab:'Bundle',label:'The peptide bundle',title:'Four helices surround hemin.',copy:'The peptides form the walls of the modeled pocket. Each peptide connects to a guanosine-derived cap through a PEG2 linker.',note:'Scroll to turn the intact structure. This camera movement explains the model; the saved simulation is below in Research.',equation:'Guanosine cap → PEG2 linker → peptide helix',selection:'all',pose:{yaw:0,pitch:0,zoom:-.04}},
 {id:'assay-iron',tab:'Iron site',label:'The iron site',title:'The reaction centers on iron.',copy:'Hemin contains an iron atom held inside a porphyrin ring. Two peptide histidines connect to that iron in this starting model.',note:'The iron connections were imposed during modeling. Binding and catalytic activity must be measured experimentally.',equation:'Histidine · Fe · histidine',selection:'heme',pose:{yaw:24,pitch:7,zoom:.12}},
 {id:'assay-peroxide',tab:'Peroxide',label:'Peroxide reporting',title:'Turn peroxide into a color change.',copy:'In heme-peroxidase chemistry, hydrogen peroxide drives oxidation of ABTS, a reporter molecule. Its oxidized form is green. A spectrophotometer measures that color by absorbance.',note:'Test whether this assembly supports the reaction and how it compares with free hemin and an established peroxidase. The illustration shows the assay principle, not a measured reaction in this bundle.',equation:'Peroxide → ABTS oxidation → optical signal',selection:'heme',reagent:'peroxide',pose:{yaw:43,pitch:1,zoom:.07},source:['Peroxidase chemistry','https://www.nature.com/articles/s41467-017-00541-4']},
 {id:'assay-glucose',tab:'Glucose',label:'Glucose recognition',title:'Glucose needs a second enzyme.',copy:'Glucose oxidase, or GOx, recognizes glucose and produces peroxide as it oxidizes it. A validated heme assembly could report that peroxide through the same ABTS color reaction.',note:'This is the connection to a biosensor: GOx supplies recognition, the heme catalyst supplies the reporter chemistry, and the optical instrument supplies the readout.',equation:'β-D-glucose + O₂ → lactone + H₂O₂',selection:'heme',reagent:'glucose',pose:{yaw:65,pitch:-7,zoom:-.03},source:['The glucose oxidase reaction','https://enzyme.expasy.org/EC/1.1.3.4']},
 {id:'assay-readout',tab:'Readout',label:'The optical readout',title:'A color becomes a measurement.',copy:'A stronger color is useful only if it tracks a known amount of analyte. Measure standards and a blank in a cuvette or microplate, then compare the corrected sample response.',note:'Peroxide standards validate the reporter first. Glucose standards test the full GOx-coupled reaction next. Neither calibration has been established for this bundle.',equation:'Known standards → corrected absorbance → concentration',selection:'all',pose:{yaw:88,pitch:0,zoom:-.05}}
];
const clamp=n=>Math.min(1,Math.max(0,n));
const interpolate=(a,b,p)=>a+(b-a)*p;
let reagentColors;

function Reagent({kind,progress,motionOff,paused}){
 const host=useRef(null),stage=useRef(null),baseline=useRef(null);
 const [status,setStatus]=useState('loading');
 const spec=kind==='glucose'?{file:'beta-d-glucose.sdf',cid:64689,label:'β-D-glucose',formula:'C₆H₁₂O₆'}:{file:'peroxide.sdf',cid:784,label:'Hydrogen peroxide',formula:'H₂O₂'};
 useEffect(()=>{
  let cancelled=false;setStatus('loading');
  const node=host.current;
  if(!window.NGL){setStatus('error');return;}
  let view;
  try{view=new window.NGL.Stage(node,{backgroundColor:'#fafbfc',quality:'high',sampleLevel:0,cameraType:'perspective',cameraFov:36,clipNear:0,clipFar:100,clipDist:.1,fogNear:75,fogFar:100,lightIntensity:1.1,ambientIntensity:.8,tooltip:false});}catch{setStatus('error');return;}
  if(!reagentColors)reagentColors=window.NGL.ColormakerRegistry.addScheme(function(){this.atomColor=atom=>({C:0x52616f,H:0xb9c2cd,O:0xdc514f})[atom.element]||0x887caf;});
  stage.current=view;view.mouseControls.disabled=true;view.mouseObserver.handleScroll=false;view.keyControls.clear();view.spinAnimation.pause(true);view.rockAnimation.pause(true);
  const ro=new ResizeObserver(()=>view.handleResize());ro.observe(node);
  view.loadFile('assets/assay/'+spec.file,{ext:'sdf',defaultRepresentation:false,inferBonds:'none'}).then(async component=>{
   if(cancelled)return;
   component.addRepresentation('ball+stick',{sele:'all',colorScheme:reagentColors,radiusScale:.75,aspectRatio:2,quality:'high'});
   await new Promise(resolve=>view.tasks.onZeroOnce(resolve));if(cancelled)return;
   view.handleResize();view.viewerControls.center(component.getCenter());view.viewerControls.distance(component.getZoom());view.trackballControls.rotate(12,7);view.viewerControls.zoom(-.2);
   baseline.current=view.viewerControls.getOrientation().clone();node.dataset.orientation=JSON.stringify(Array.from(baseline.current.elements));
   node.dataset.reagent=kind;node.dataset.atomCount=String(component.structure.atomCount);node.dataset.bondCount=String(component.structure.bondCount);node.dataset.cid=String(spec.cid);setStatus('ready');
  }).catch(()=>{if(!cancelled)setStatus('error');});
  return()=>{cancelled=true;ro.disconnect();view.dispose();node.replaceChildren();stage.current=null;baseline.current=null;};
 },[kind]);
 useEffect(()=>{if(paused&&!motionOff)return;if(status==='ready'&&stage.current&&baseline.current){stage.current.viewerControls.orient(baseline.current.clone());if(!motionOff)stage.current.trackballControls.rotate(26*progress,7*progress);}},[progress,motionOff,status,paused]);
 return <figure className="assay-reagent"><div ref={host} className="reagent-viewport" role="img" aria-label={spec.label+' reference conformer from PubChem, CID '+spec.cid}/>{status!=='ready'&&<span className="reagent-formula">{spec.formula}</span>}<figcaption><span>{spec.label}</span><a href={'https://pubchem.ncbi.nlm.nih.gov/compound/'+spec.cid} target="_blank" rel="noopener">Reference structure</a></figcaption></figure>;
}

function SignalPath({index,progress}){
 const labels=index===3?['Glucose + GOx','Peroxide','Bundle + ABTS','Optical signal']:['Peroxide','Bundle + ABTS','ABTS oxidation','Optical signal'];
 const current=Math.min(labels.length-1,Math.floor(progress*labels.length));
 return <div className={'assay-path '+(index===3?'glucose-path':'')} aria-label={index===3?'Glucose-coupled assay signal path':'Peroxide reporter signal path'}>{labels.map((label,i)=><span key={label} className={(i<=current?'reached ':'')+(i===labels.length-1?'signal-green':'')}><small>{String(i+1).padStart(2,'0')}</small>{label}</span>)}</div>;
}

export function ScrollAssay({motionOff=false}){
 const wrapper=useRef(null),viewport=useRef(null),engine=useRef(null),articleRefs=useRef([]),sticky=useRef(null),frame=useRef(null),latest=useRef({motionOff,paused:false});
 const [enabled,setEnabled]=useState(false),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0),[index,setIndex]=useState(0),[progress,setProgress]=useState(0),[paused,setPaused]=useState(false),[viewMode,setViewMode]=useState('hybrid');
 const selected=useRef(null),current=steps[index];latest.current={motionOff,paused};
 useEffect(()=>{
  const nav=document.querySelector('.site-header');
  const measure=()=>{if(nav&&wrapper.current)wrapper.current.style.setProperty('--site-nav-height',nav.getBoundingClientRect().height+'px');};
  measure();const ro=new ResizeObserver(measure);if(nav)ro.observe(nav);return()=>ro.disconnect();
 },[]);
 useEffect(()=>{
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))setEnabled(true);},{rootMargin:'650px 0px'});observer.observe(wrapper.current);return()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  if(!enabled)return;setFailed(false);setReady(false);
  if(!window.createResearchMolecule){setFailed(true);return;}
  const instance=window.createResearchMolecule({project:'heme',viewport:viewport.current,backgroundColor:'#fafbfc',defaultMode:viewMode,interactionEnabled:false,contextIntensity:.73,onReady:()=>setReady(true),onError:()=>setFailed(true)});engine.current=instance;selected.current=null;
  viewport.current.tabIndex=-1;viewport.current.setAttribute('aria-label','Original PEG2 structure. Camera follows scrolling; chapter buttons provide direct access.');
  return()=>{instance.destroy();engine.current=null;};
 },[enabled,attempt]);
 useEffect(()=>{
  const update=()=>{
   frame.current=null;if(!wrapper.current)return;
   const bounds=wrapper.current.getBoundingClientRect();if(bounds.bottom<0||bounds.top>innerHeight)return;
   const phone=window.matchMedia('(max-width:700px)').matches;
   const focus=phone?Math.min(innerHeight-90,(sticky.current?.getBoundingClientRect().bottom||innerHeight*.5)+70):innerHeight*.47;
   let next=0;
   articleRefs.current.forEach((el,i)=>{if(el&&el.getBoundingClientRect().top<=focus)next=i;});
   const rect=articleRefs.current[next].getBoundingClientRect(),p=clamp((focus-rect.top)/Math.max(1,rect.height));
   const rounded=Math.round(p*200)/200;setIndex(next);setProgress(rounded);
   wrapper.current.dataset.chapter=String(next);wrapper.current.dataset.progress=String(rounded);
   const stop=latest.current.motionOff||matchMedia('(prefers-reduced-motion:reduce)').matches;
   if(engine.current&&ready){
    const step=steps[next],to=steps[Math.min(next+1,steps.length-1)],ease=p*p*(3-2*p);
    if(selected.current!==step.selection){engine.current.setComponent(step.selection);selected.current=step.selection;}
    if(!latest.current.paused||stop)engine.current.setScrollPose({yaw:interpolate(step.pose.yaw,to.pose.yaw,ease),pitch:interpolate(step.pose.pitch,to.pose.pitch,ease),zoom:interpolate(step.pose.zoom,to.pose.zoom,ease),static:stop});
   }
  };
  const request=()=>{if(frame.current===null)frame.current=requestAnimationFrame(update);};
  window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request);request();
  return()=>{window.removeEventListener('scroll',request);window.removeEventListener('resize',request);if(frame.current!==null)cancelAnimationFrame(frame.current);frame.current=null;};
 },[ready,motionOff,paused]);
 function selectStep(i){const article=articleRefs.current[i];if(!article)return;const phone=matchMedia('(max-width:700px)').matches;const header=document.querySelector('.site-header')?.getBoundingClientRect().height||85;const offset=phone?(sticky.current?.offsetHeight||350)+header+12:header+30;window.scrollTo({top:article.getBoundingClientRect().top+window.scrollY-offset,behavior:motionOff||paused||matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
 function changeView(value){setViewMode(value);engine.current?.setMode(value);}
 return <div ref={wrapper} className="scroll-assay" data-chapter={index} data-progress={progress}>
  <div ref={sticky} className="assay-sticky">
   <div className="assay-stage-head"><span>{String(index+1).padStart(2,'0')} <b>{current.label}</b></span><div className="assay-view-controls" aria-label="Scroll structure controls"><button type="button" aria-pressed={viewMode==='hybrid'} onClick={()=>changeView('hybrid')}>Helices</button><button type="button" aria-pressed={viewMode==='atomic'} onClick={()=>changeView('atomic')}>Atoms</button><button type="button" className="motion-toggle" aria-label={paused?'Resume scroll animation':'Pause scroll animation'} aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?<PlayIcon/>:<PauseIcon/>}</button></div></div>
   <div className="assay-scene"><div ref={viewport} className="assay-bundle-viewport" id="assay-molecular-viewport" role="img" aria-label="Original PEG2 model, with scroll-controlled camera motion"/>
    {!ready&&!failed&&<span className="assay-loading" role="status">Opening the source model…</span>}
    {failed&&<div className="assay-fallback"><img src="assets/source-model-fallback.png" alt="Original PEG2 model source image"/><button type="button" onClick={()=>setAttempt(n=>n+1)}><ReloadIcon/> Retry the model</button></div>}
    {current.reagent&&<Reagent kind={current.reagent} progress={progress} motionOff={motionOff} paused={paused}/>}
   </div>
   <p className="assay-evidence-note">{index<2?'Original PEG2 coordinates. Scroll changes the camera.':'Assay principle. Activity in this bundle still needs testing.'}</p>
   {index===2||index===3?<SignalPath index={index} progress={progress}/>:<div className="assay-stage-equation" aria-live="polite">{index===4?<span className="signal-green">Corrected absorbance + known standards</span>:current.equation}</div>}
   <nav className="assay-step-nav" aria-label="How the Heme assay works">{steps.map((step,i)=><button type="button" key={step.id} aria-current={index===i?'step':undefined} onClick={()=>selectStep(i)}>{step.tab}</button>)}</nav>
  </div>
  <div className="assay-chapters">{steps.map((step,i)=><article id={step.id} key={step.id} ref={el=>articleRefs.current[i]=el} className={'assay-caption '+(index===i?'current':'')}><span className="eyebrow">{String(i+1).padStart(2,'0')} / {step.label}</span><h3>{step.title}</h3><p className="assay-main-caption">{step.copy}</p><p className="assay-detail">{step.note}</p>{i===3&&<p className="assay-chemistry-note">The GOx product is D-glucono-1,5-lactone. The peroxide then feeds the separate reporter reaction.</p>}{step.source&&<a className="assay-source" href={step.source[1]} target="_blank" rel="noopener">{step.source[0]} <ArrowRightIcon/></a>}</article>)}</div>
 </div>;
}
