import React from 'react';
import {ArrowUpRight} from '@phosphor-icons/react';
import {BROCHURE_URL,brochurePage,placementHighlights} from './placements.js';
import './placements.css';

function BrochureButton(){
 return <a className="split-button" href={BROCHURE_URL} target="_blank" rel="noopener noreferrer" aria-label="Explore the full Arena placement brochure (opens in a new tab)"><span>Explore full brochure</span><span className="button-arrow"><ArrowUpRight size={21}/></span></a>;
}

function PlacementPortrait({person}){
 const[x,y,w,h]=person.crop;
 return <div className="placement-portrait" style={{aspectRatio:`${w}/${h}`}}>
  <img src={`/assets/placements/page-${person.page}.webp`} alt={`${person.name}, pictured in Arena’s placement brochure`} loading="lazy" decoding="async" style={{width:`${1980/w*100}%`,left:`${-x/w*100}%`,top:`${-y/h*100}%`}}/>
 </div>;
}

export function Placements(){
 return <section id="placements" className="placements-section" aria-labelledby="placements-title">
  <div className="section-width">
   <div className="section-heading">
    <div><h2 id="placements-title">Creative skills.<br/>Real career stories.</h2></div>
    <p>Selected student placements from Arena Animation’s official Talent &amp; Placement Showcase 2026–27.</p>
   </div>
   <div className="placement-grid">
    {placementHighlights.map(person=><article className="placement-card" key={person.name}>
     <div className="placement-person"><PlacementPortrait person={person}/><div><h3>{person.name}</h3><p className="placement-role">{person.role}</p></div></div>
     <p className="placement-company"><span>PLACED AT</span><strong>{person.company}</strong></p>
     <div className="placement-card-footer"><div className="placement-package"><strong>₹{person.package} <span>LPA</span></strong><span>Reported annual package</span></div><a className="text-link" href={brochurePage(person.page)} target="_blank" rel="noopener noreferrer" aria-label={`View ${person.name} on brochure page ${person.page} (opens in a new tab)`}>View in brochure<ArrowUpRight size={17}/></a></div>
    </article>)}
   </div>
   <p className="placement-source-note">Examples across Arena’s national network, as published in the 2026–27 brochure. LPA = lakh per annum. Individual outcomes vary.</p>
   <div className="placement-brochure">
    <a className="brochure-cover-link" href={BROCHURE_URL} target="_blank" rel="noopener noreferrer" aria-label="Open Arena’s Talent and Placement Showcase 2026–27 (opens in a new tab)"><img src="/assets/placements/brochure-cover.webp" alt="Arena Animation Talent and Placement Showcase 2026–27 brochure cover" loading="lazy" width="339" height="480"/></a>
    <div className="brochure-description"><h3>There’s a bigger story<br/>behind every next step.</h3><p>Explore more student placements, star alumni and featured recruiters in the complete official brochure.</p></div>
    <div className="brochure-action"><BrochureButton/><span>Opens Arena’s official brochure in a new tab.</span></div>
   </div>
  </div>
 </section>;
}
