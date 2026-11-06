import {courses,courseForPath,coursePath,descriptions} from './catalog.js';

export const SITE={
 origin:'https://arenalucknow.in',
 name:'Arena Animation Indira Nagar, Lucknow',
 phone:'+916390006309',
 title:'Arena Animation Indira Nagar Lucknow | Animation & VFX',
 description:'Explore animation, VFX, gaming and design courses at Arena Animation, Indira Nagar, Lucknow. View syllabuses and contact our admission counsellor.',
 image:'/assets/hero-animation.png',
};
export const canonical=path=>new URL(path,SITE.origin).href;
export const pagePaths=['/','/scholarship/',...courses.map(coursePath)];
const shortName=course=>course.title.replace(/^Advanced? Program in /,'').replace(/^Advanced /,'');
const branch={
 '@type':'EducationalOrganization','@id':canonical('/#organisation'),name:SITE.name,
 url:canonical('/'),telephone:SITE.phone,logo:canonical('/assets/arena-logo.png'),
 address:{'@type':'PostalAddress',addressLocality:'Lucknow',addressRegion:'Uttar Pradesh',addressCountry:'IN'},
 areaServed:{'@type':'City',name:'Lucknow'},
 contactPoint:{'@type':'ContactPoint',telephone:SITE.phone,contactType:'admissions',areaServed:'IN'},
};

export function seoForPath(pathname){
 const course=courseForPath(pathname),home=pathname==='/',scholarship=pathname.replace(/\/$/,'')==='/scholarship';
 if(!home&&!course&&!scholarship)return{title:'Page not found | Arena Animation Lucknow',description:'This page could not be found. Explore Arena Animation courses and contact our Indira Nagar, Lucknow team.',robots:'noindex,follow',path:null,schema:null};
 const path=home?'/':scholarship?'/scholarship/':coursePath(course),url=canonical(path);
 const title=home?SITE.title:scholarship?'YUVA Scholarship Enquiry in Lucknow | Arena Animation':`${shortName(course)} Course in Lucknow | Arena Animation`;
 const description=home?SITE.description:scholarship?'Enquire about scholarships up to 35% at Arena Animation, Indira Nagar, Lucknow. Benefits depend on the selected course and scholarship exam marks.':`Explore ${shortName(course)} at Arena Animation. View the published syllabus, tools and eligibility, and ask our Lucknow centre about availability.`;
 const page={'@type':'WebPage','@id':url+'#webpage',url,name:title,description,inLanguage:'en-IN',isPartOf:{'@id':canonical('/#website')},publisher:{'@id':branch['@id']}};
 const graph=[branch,{'@type':'WebSite','@id':canonical('/#website'),url:canonical('/'),name:SITE.name,inLanguage:'en-IN',publisher:{'@id':branch['@id']}},page];
 if(home){
  page.mainEntity={'@id':canonical('/#published-courses')};
  graph.push({'@type':'ItemList','@id':canonical('/#published-courses'),name:'Published Arena Animation course guides',numberOfItems:courses.length,itemListElement:courses.map((c,index)=>({'@type':'ListItem',position:index+1,name:c.title,url:canonical(coursePath(c))}))});
 }else if(course){
  const item={'@type':'Course','@id':url+'#course',url,name:course.title,image:canonical(course.image.src),description:`${descriptions[course.category]} Confirm current availability at the Indira Nagar, Lucknow centre.`,provider:{'@type':'Organization',name:'Arena Animation',url:'https://www.arena-multimedia.com/'},inLanguage:'en',coursePrerequisites:course.eligibility};
  if(!['AR-021','AR-042'].includes(course.id)&&Number.isFinite(course.hours)&&course.hours>0)item.timeRequired=`PT${course.hours}H`;
  page.mainEntity={'@id':item['@id']};graph.push(item);
 }
 return{title,description,robots:'index,follow,max-image-preview:large',path,url,image:course?.image.src||SITE.image,imageAlt:course?.image.alt||'Original 3D explorer artwork for Arena Animation, Indira Nagar, Lucknow',schema:{'@context':'https://schema.org','@graph':graph}};
}

const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function seoHead(pathname,{preview=false}={}){
 const seo=seoForPath(pathname),image=canonical(seo.image||SITE.image),imageAlt=seo.imageAlt||'Original 3D explorer artwork for Arena Animation, Indira Nagar, Lucknow',robots=preview?'noindex,nofollow':seo.robots;
 return `<title>${escape(seo.title)}</title>
    <meta name="description" content="${escape(seo.description)}" />
    <meta name="robots" content="${robots}" />
    ${seo.url?`<link rel="canonical" href="${escape(seo.url)}" />`:''}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escape(SITE.name)}" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:title" content="${escape(seo.title)}" />
    <meta property="og:description" content="${escape(seo.description)}" />
    ${seo.url?`<meta property="og:url" content="${escape(seo.url)}" />`:''}
    <meta property="og:image" content="${image}" />
    <meta property="og:image:alt" content="${escape(imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(seo.title)}" />
    <meta name="twitter:description" content="${escape(seo.description)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${escape(imageAlt)}" />
    ${seo.schema?`<script type="application/ld+json">${JSON.stringify(seo.schema).replace(/</g,'\\u003c')}</script>`:''}`;
}
export function replaceSeo(html,path,options){return html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/,`<!-- seo:start -->\n    ${seoHead(path,options)}\n    <!-- seo:end -->`);}
export const sitemap=()=>`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pagePaths.map(path=>`  <url><loc>${escape(canonical(path))}</loc></url>`).join('\n')}\n</urlset>\n`;
export const robots='User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: '+canonical('/sitemap.xml')+'\n';
