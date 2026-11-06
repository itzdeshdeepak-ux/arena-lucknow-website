import React,{useState} from 'react';
import {CourseDetail} from './CourseDetail.jsx';
import {Enquiry} from './Enquiry.jsx';
import {Modal} from './shared.jsx';
import {courses,coursePath} from './catalog.js';

export function CoursePage({course}){
 const[enquiry,setEnquiry]=useState(null);
 const related=courses.filter(c=>c.id!==course.id&&c.category===course.category).slice(0,3);
 return <>
  <main><CourseDetail course={course} standalone onClose={()=>location.assign('/#courses')} onEnquire={setEnquiry}/></main>
  <nav className="related-courses section-width" aria-label="More Arena course guides"><h2>Find your creative direction.</h2><div>{related.map(c=><a key={c.id} href={coursePath(c)}>{c.title}</a>)}</div><a className="text-link" href="/#courses">Explore all Arena courses in Lucknow</a><p className="detail-note">Published national course information. Confirm local availability, fees and batches with the Indira Nagar centre.</p></nav>
  <Modal open={Boolean(enquiry)} onClose={()=>setEnquiry(null)} label="Speak with a course counsellor" className="enquiry-dialog">{enquiry&&<Enquiry course={enquiry} onClose={()=>setEnquiry(null)}/>}</Modal>
 </>;
}
