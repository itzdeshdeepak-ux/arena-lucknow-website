import {useEffect,useRef} from 'react';

const revealTargets = '.intro > div, .section-heading > *, .course-toolbar, .course-card, .placement-card, .placement-brochure, .pathway-item, .feature-story-copy > *, .centre > *, .faq-section > *, .closing > *, .footer-main > *';

export function scrollToSection(id){
 document.getElementById(id)?.scrollIntoView({
  behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',
  block:'start'
 });
}

// Content stays visible without animation support, JavaScript, or an observer.
export function useSectionMotion(dependencies){
 const seen=useRef(new WeakSet());
 useEffect(()=>{
  if(!('IntersectionObserver' in window)||!Element.prototype.animate)return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const running=new Set();
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    const element=entry.target;
    observer.unobserve(element);
    if(seen.current.has(element))continue;
    seen.current.add(element);
    if(preference.matches||element.contains(document.activeElement))continue;
    const index=[...element.parentElement.children].indexOf(element);
    const animation=element.animate([
     {opacity:0,transform:'translateY(16px)'},
     {opacity:1,transform:'translateY(0)'}
    ],{duration:560,delay:Math.min(index,2)*65,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
    running.add(animation);
    animation.finished.then(()=>running.delete(animation),()=>running.delete(animation));
   }
  },{threshold:.1,rootMargin:'0px 0px -24px 0px'});
  document.querySelectorAll(revealTargets).forEach(element=>{
   if(!seen.current.has(element))observer.observe(element);
  });
  const stop=()=>{if(preference.matches)running.forEach(animation=>animation.cancel());};
  preference.addEventListener('change',stop);
  return()=>{observer.disconnect();running.forEach(animation=>animation.cancel());preference.removeEventListener('change',stop);};
 },dependencies);
}
