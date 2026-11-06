import React,{useEffect,useRef,useState} from 'react';
import {ArrowRight,ArrowUpRight,Check,CircleNotch,WhatsappLogo,X} from '@phosphor-icons/react';
import {courses,wa,BRANCH} from './shared.jsx';

export function Enquiry({course,onClose}){
 const[sent,setSent]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const reference=useRef(`ARL-${crypto.randomUUID()}`),pending=useRef(false);
 useEffect(()=>{if(sent)document.querySelector('.enquiry-dialog .whatsapp-submit')?.focus();},[sent]);
 async function submit(e){
  e.preventDefault(); if(pending.current)return;
  const details=Object.fromEntries(new FormData(e.currentTarget));
  details.consent=details.consent==='on';details.reference=reference.current;
  pending.current=true;setBusy(true);setError('');
  try{
   const response=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(details),signal:AbortSignal.timeout(20000)});
   const result=await response.json();
   if(!response.ok||!result.ok)throw new Error(result.error||'We couldn’t confirm your enquiry was saved. Please contact us on WhatsApp.');
   const message=`Hello ${BRANCH}, I have submitted an admission enquiry. My reference is ${result.reference}. My name is ${details.name.trim()}. I’m interested in ${details.course}. My phone number is ${details.phone.trim()}.${details.qualification?` My qualification: ${details.qualification}.`:''}${details.message.trim()?` ${details.message.trim()}`:''} Please help me with course details, fees and the next batch.`;
   setSent({reference:result.reference,message});
  }catch(err){setError(err.name==='TimeoutError'?'We couldn’t confirm your enquiry was saved. Please contact us on WhatsApp before retrying.':err.message||'We couldn’t connect. Please contact us on WhatsApp.');}
  finally{pending.current=false;setBusy(false);}
 }
 return <>
  <button className="dialog-close" aria-label="Close enquiry" onClick={onClose}><X size={24}/></button>
  {!sent?<>
   
   <h2>A little curiosity.<br/>A great first step.</h2>
   <p className="form-intro">Tell us a little about yourself. Our Indira Nagar team will contact you with course and admission guidance.</p>
   <form onSubmit={submit} aria-busy={busy}>
    <div className="form-two-columns">
     <label>Full name<input name="name" required autoComplete="name" maxLength={80} pattern=".*\S.*" placeholder="Your name"/></label>
     <label>Mobile number<input name="phone" required type="tel" autoComplete="tel" pattern="([+]91|91)?[ ]?[6-9][0-9]{9}" title="Enter a 10-digit Indian mobile number, with an optional +91." minLength={10} maxLength={18} placeholder="10-digit mobile number"/></label>
    </div>
    <label>I’m interested in<select name="course" defaultValue={course||'Not sure — need guidance'}><option>Not sure — need guidance</option>{courses.map(c=><option key={c.id} value={c.title}>{c.title}</option>)}</select></label>
    <label>Highest qualification <span className="optional">(optional)</span><select name="qualification" defaultValue=""><option value="">Select your qualification</option><option>Class 10</option><option>Class 12</option><option>Diploma</option><option>Graduate</option><option>Working professional</option></select></label>
    <label>Anything you’d like to ask? <span className="optional">(optional)</span><textarea name="message" maxLength={600} rows={2} placeholder="Fees, batch timings, course guidance…"/></label>
    <div className="enquiry-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <label className="consent"><input name="consent" type="checkbox" required/><span>I agree to share these details with Arena Animation, Indira Nagar for admission guidance.</span></label>
    {error&&<div className="enquiry-error" role="alert"><p>{error}</p><a className="text-link" href={wa(`Hello ${BRANCH}, I need help submitting an admission enquiry.`)} target="_blank" rel="noreferrer">Contact us on WhatsApp<ArrowUpRight size={16}/></a></div>}
    <button type="submit" className="form-submit" disabled={busy}>{busy?'Saving your enquiry…':'Submit my enquiry'}{busy?<CircleNotch className="saving-spinner" size={20}/>:<ArrowRight size={20}/>}</button>
    <p className="form-note">Submitting saves your details with our admissions team for follow-up. You can also chat with us on WhatsApp after submitting.</p>
   </form>
  </>:<div className="prepared-state">
   <div className="success-icon"><Check size={30}/></div>
   
   <h2>Your enquiry<br/>has been received.</h2>
   <p>Your details have been saved for our Indira Nagar admissions team. We’ll contact you to help you explore your next step.</p>
   <p className="enquiry-reference">Your reference<br/><strong>{sent.reference}</strong></p>
   <a className="form-submit whatsapp-submit" href={wa(sent.message)} target="_blank" rel="noreferrer"><WhatsappLogo size={23}/>Continue on WhatsApp<ArrowUpRight size={20}/></a>
   <p className="form-note">Your enquiry is already recorded. WhatsApp is optional if you’d like to start a conversation now.</p>
  </div>}
 </>;
}
