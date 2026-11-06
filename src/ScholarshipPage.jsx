import React,{useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,ArrowUpRight,Check,CircleNotch,MapPin,WhatsappLogo} from '@phosphor-icons/react';
import {BRANCH,PHONE,wa,SplitButton,courses} from './shared.jsx';
import './scholarship.css';

const consent='I agree to share these details with Arena Animation, Indira Nagar for scholarship and admission guidance.';
export function ScholarshipPage(){
 const[busy,setBusy]=useState(false),[error,setError]=useState(''),[saved,setSaved]=useState(null);
 const pending=useRef(false),reference=useRef(null),success=useRef(null);
 useEffect(()=>{if(saved)success.current?.focus();},[saved]);
 async function submit(event){
  event.preventDefault();if(pending.current)return;
  const details=Object.fromEntries(new FormData(event.currentTarget));
  if(!reference.current)reference.current=`ARLS-${crypto.randomUUID()}`;
  details.reference=reference.current;details.consent=details.consent==='on';
  pending.current=true;setBusy(true);setError('');
  try{
   const response=await fetch('/api/scholarship',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(details),signal:AbortSignal.timeout(20000)});
   const result=await response.json();
   if(!response.ok||!result.ok)throw new Error(result.error||'We couldn’t confirm your scholarship enquiry was saved. Please contact us on WhatsApp.');
   setSaved({reference:result.reference,name:details.name.trim(),course:details.course});
  }catch(err){setError(err.name==='TimeoutError'?'We couldn’t confirm the save. Please contact us on WhatsApp before submitting again.':err.message||'We couldn’t connect. Please contact us on WhatsApp.');}
  finally{pending.current=false;setBusy(false);}
 }
 return <>
  <a className="skip-link" href="#scholarship-main">Skip to content</a>
  <header className="site-header scholarship-header"><a className="brand" href="/" aria-label="Arena Animation Indira Nagar Lucknow home"><img src="/assets/arena-logo.png" alt="Arena Animation"/><span className="brand-location">INDIRA NAGAR<span>LUCKNOW</span></span></a><nav aria-label="Scholarship navigation"><a href="/#courses">Courses</a><a href="#how-it-works">How it works</a></nav><a className="header-enquiry" href="#scholarship-enquiry">Enquire now<ArrowUpRight size={18}/></a></header>
  <main id="scholarship-main" className="scholarship-page">
   <section className="scholarship-opening" aria-labelledby="scholarship-title">
    <img className="scholarship-backdrop" src="/assets/hero-animation.webp" alt=""/>
    <div className="scholarship-layout section-width">
     <div className="scholarship-intro"><a className="scholarship-back" href="/"><ArrowLeft size={16}/>Back to Arena Lucknow</a><h1 id="scholarship-title">Big potential.<br/>A creative head start.</h1><div className="scholarship-percentage"><span>UP TO</span><strong>35<small>%</small></strong><span>SCHOLARSHIP</span></div><p className="scholarship-intro-description">Explore scholarship opportunities for your creative future. The benefit depends on the course you choose and the marks you obtain in the scholarship exam.</p><a className="scholarship-how-link" href="#how-it-works">See how it works<ArrowRight size={18}/></a><p className="scholarship-local"><MapPin size={18}/>Your enquiry goes directly to our Indira Nagar team.</p></div>
     <section id="scholarship-enquiry" className="scholarship-form-panel" aria-labelledby="scholarship-form-title">
      {!saved?<><h2 id="scholarship-form-title">Let’s explore<br/>your scholarship.</h2><p className="form-intro">Leave your details. Our branch team will guide you on eligible courses, the exam and the next steps.</p>
       <form onSubmit={submit} aria-busy={busy}>
        <fieldset disabled={busy}><legend className="sr-only">Scholarship enquiry details</legend>
         <div className="form-two-columns"><label>Full name<input name="name" required autoComplete="name" maxLength={80} pattern=".*\S.*" placeholder="Your full name"/></label><label>Mobile number<input name="phone" type="tel" required autoComplete="tel" pattern="([+]91|91)?[ ]?[6-9][0-9]{9}" title="Enter a 10-digit Indian mobile number, with an optional +91." maxLength={18} placeholder="10-digit mobile number"/></label></div>
         <label>Email address<input name="email" type="email" required autoComplete="email" maxLength={120} placeholder="you@example.com"/></label>
         <label>Course you’re interested in<select name="course" defaultValue="" required><option value="" disabled>Select a course</option><option>Not sure — need guidance</option>{courses.map(course=><option key={course.id}>{course.title}</option>)}</select></label>
         <label>Highest qualification <span className="optional">(optional)</span><select name="qualification" defaultValue=""><option value="">Select your qualification</option><option>Class 10</option><option>Class 12</option><option>Diploma</option><option>Graduate</option><option>Working professional</option></select></label>
         <div className="scholarship-centre"><MapPin size={18}/><div><strong>Indira Nagar, Lucknow</strong><span>Uttar Pradesh · Your selected centre</span></div></div>
         <label>Your question <span className="optional">(optional)</span><textarea name="message" maxLength={600} rows={2} placeholder="Ask about the exam, eligible courses or next steps…"/></label>
         <div className="enquiry-trap" aria-hidden="true"><label>Website<input name="website" autoComplete="off" tabIndex={-1}/></label></div>
         <label className="consent"><input name="consent" type="checkbox" required/><span>{consent}</span></label>
        </fieldset>
        {error&&<div className="enquiry-error" role="alert"><p>{error}</p><a className="text-link" href={wa(`Hello ${BRANCH}, I need help with my scholarship enquiry.`)} target="_blank" rel="noreferrer">Contact the branch on WhatsApp<ArrowUpRight size={16}/></a></div>}
        <button className="form-submit" type="submit" disabled={busy}>{busy?'Saving your enquiry…':'Enquire about my scholarship'}{busy?<CircleNotch className="saving-spinner" size={20}/>:<ArrowRight size={20}/>}</button>
        <p className="form-note">This requests a callback from our branch. Submitting does not register you for the exam or confirm a scholarship award.</p>
       </form>
      </>:<div className="prepared-state"><div className="success-icon"><Check size={30}/></div><h2 id="scholarship-form-title" ref={success} tabIndex={-1}>Your scholarship<br/>enquiry is saved.</h2><p>Thank you, {saved.name}. Our Indira Nagar team has your interest in {saved.course} and will guide you on the scholarship exam and course eligibility.</p><p className="enquiry-reference">Your reference<br/><strong>{saved.reference}</strong></p><a className="form-submit whatsapp-submit" href={wa(`Hello ${BRANCH}, I have submitted a scholarship enquiry. My name is ${saved.name}. I’m interested in ${saved.course}. My reference is ${saved.reference}. Please guide me on the scholarship exam and eligibility.`)} target="_blank" rel="noreferrer"><WhatsappLogo size={22}/>Continue on WhatsApp<ArrowUpRight size={18}/></a><p className="form-note">Your enquiry is already recorded. WhatsApp is optional. The scholarship amount depends on your selected course and exam performance.</p></div>}
     </section>
    </div>
   </section>
   <section id="how-it-works" className="scholarship-steps section-width"><h2>A little curiosity.<br/>A clearer path forward.</h2><div className="pathway-grid">{[['01','Tell us your interest','Choose a course and send your scholarship enquiry directly to our Indira Nagar branch.'],['02','Get exam guidance','Our counsellor will explain the eligible courses, scholarship exam process and current terms.'],['03','Explore your opportunity','Your selected course and scholarship exam marks determine the applicable benefit, up to 35%.']].map(([number,title,description])=><article className="pathway-item" key={number}><div className="pathway-top"><span>{number}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>
   <section className="scholarship-guidance section-width"><div><h2>Your questions.<br/>A good place to start.</h2><a className="text-link" href="/#courses">Explore all courses<ArrowRight size={18}/></a></div><div className="scholarship-faqs"><details><summary>Is the 35% scholarship guaranteed?</summary><p>No. Up to 35% is the maximum. The applicable benefit depends on the selected course and marks obtained in the scholarship exam. Our branch will confirm eligibility and terms.</p></details><details><summary>Does this form book my scholarship exam?</summary><p>This form sends an enquiry to the Indira Nagar team. A counsellor will explain how to register for the exam and confirm the schedule.</p></details><details><summary>Who receives my enquiry?</summary><p>Our Arena Animation, Indira Nagar, Lucknow admissions team receives your details for scholarship and admission guidance.</p></details><details><summary>Which courses can I apply for?</summary><p>Tell us the course you’re interested in. The branch will confirm which programs currently qualify and the applicable benefit before you enrol.</p></details></div></section>
   <section className="scholarship-contact"><div className="section-width"><div><h2>Your creative journey.<br/>Your local team.</h2><p>Speak with Arena Animation, Indira Nagar, Lucknow.</p></div><SplitButton light href={`tel:+${PHONE}`}>Call +91 63900 06309</SplitButton></div></section>
  </main>
  <footer className="scholarship-footer"><div className="section-width"><a href="/">Arena Animation · Indira Nagar, Lucknow</a><a href="https://www.arena-multimedia.com/campaign/brand-awareness-scholarship" target="_blank" rel="noreferrer">About the national YUVA initiative<ArrowUpRight size={15}/></a><p>Up to 35%, subject to the selected course, scholarship exam marks and applicable terms confirmed by the centre.</p><span>© {__SITE_BUILD_YEAR__} Arena Animation · Indira Nagar, Lucknow</span></div></footer>
 </>;
}
