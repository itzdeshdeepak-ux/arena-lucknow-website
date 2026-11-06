import research from './research.json' with {type:'json'};
import courseImages from './course-images.json' with {type:'json'};
const featured=['AR-001','AR-006','AR-016','AR-011','AR-009','AR-005'];
export const courses=research.records.map(course=>{
 const image=courseImages[course.id];
 if(!image)throw new Error(`Missing course-specific image for ${course.id}`);
 return {...course,image};
}).sort((a,b)=>{const ai=featured.indexOf(a.id),bi=featured.indexOf(b.id);return(ai<0?999:ai)-(bi<0?999:bi)||a.title.localeCompare(b.title,'en');});
export const categories=['All courses','Animation','VFX','Digital Design','Gaming & Interactive Design','Architecture Visualization','AI Courses','Short-term','Digital Marketing'];
export const labels={'Gaming & Interactive Design':'Gaming & XR','Architecture Visualization':'Architecture','Short-term':'Short Courses'};
export const descriptions={'Animation':'Create expressive characters, tell memorable stories and explore the art of movement.','VFX':'Discover the craft behind extraordinary screen worlds, from 3D assets to final compositing.','Digital Design':'Bring ideas to life through visual communication, digital experiences and motion.','Gaming & Interactive Design':'Build the characters, environments and interactive worlds people love to explore.','Architecture Visualization':'Turn spaces and ideas into immersive architectural visualisations.','AI Courses':'Explore creative workflows that bring AI into design, storytelling and production.','Short-term':'Focus on a creative tool or discipline and build on your existing interests.','Digital Marketing':'Explore digital campaigns, creative content and AI-assisted marketing workflows.'};

export function coursePath(course){
 const slug=course.title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 return `/courses/${slug}/`;
}
export const courseByPath=new Map(courses.map(course=>[coursePath(course),course]));
export function courseForPath(path){return courseByPath.get(path.endsWith('/')?path:path+'/');}
