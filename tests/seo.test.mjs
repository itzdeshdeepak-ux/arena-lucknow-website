import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {courses,coursePath} from '../src/catalog.js';
import {SITE,pagePaths,seoForPath} from '../src/seo.js';
import worker from '../worker/index.js';

const client=new URL('../dist/client/',import.meta.url);
const file=path=>new URL(path.replace(/^\//,''),client);
const escape=value=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
const assets={fetch:async request=>{
 const path=new URL(request.url).pathname;
 try{return new Response(await readFile(file(path)),{headers:{'content-type':path.endsWith('.html')?'text/html':'text/plain'}});}catch{return new Response('Missing',{status:404});}
}};

test('all 45 canonical pages contain their content without executing JavaScript',async()=>{
 assert.equal(pagePaths.length,45);assert.equal(new Set(pagePaths).size,45);
 const titles=new Set();
 for(const path of pagePaths){
  const html=await readFile(file(path+'index.html'),'utf8'),seo=seoForPath(path);
  assert.ok(html.includes(`<link rel="canonical" href="${SITE.origin+path}"`),path);
  assert.ok(html.includes('content="index,follow,max-image-preview:large"'),path);
  assert.ok(html.includes(`<meta property="og:url" content="${SITE.origin+path}"`),path);
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,path);
  assert.ok(html.includes('<main'),path);assert.ok(html.includes('<meta name="twitter:card"'),path);
  assert.equal(titles.has(seo.title),false,path);titles.add(seo.title);
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.equal(graph.find(item=>item['@type']==='EducationalOrganization').telephone,'+916390006309');
  assert.ok(!graph.some(item=>item['@type']==='LocalBusiness'));
 }
 for(const course of courses){
  const html=await readFile(file(coursePath(course)+'index.html'),'utf8');
  assert.ok(html.includes(`<h1>${escape(course.title)}</h1>`),course.title);
  assert.ok(html.includes('What you’ll learn.'),course.title);
  assert.ok(html.includes('Published national course information'),course.title);
 }
});

test('the homepage links to every syllabus and sitemap URLs match canonical pages',async()=>{
 const html=await readFile(file('index.html'),'utf8'),xml=await readFile(file('sitemap.xml'),'utf8'),robots=await readFile(file('robots.txt'),'utf8');
 for(const course of courses)assert.ok(html.includes(`href="${coursePath(course)}"`),course.title);
 const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
 assert.deepEqual(urls,pagePaths.map(path=>SITE.origin+path));
 assert.ok(robots.includes('Sitemap: https://arenalucknow.in/sitemap.xml'));
 assert.ok(robots.includes('Disallow: /api/'));
 assert.ok(!xml.includes('127.0.0.1'));assert.ok(!xml.includes('#'));
});

test('conflicting course durations and unconfirmed branch facts are not invented',()=>{
 for(const id of ['AR-021','AR-042']){
  const graph=seoForPath(coursePath(courses.find(c=>c.id===id))).schema['@graph'];
  assert.equal(graph.find(item=>item['@type']==='Course').timeRequired,undefined);
 }
 for(const path of pagePaths){
  const graph=seoForPath(path).schema['@graph'];
  assert.ok(!JSON.stringify(graph).includes('aggregateRating'));
  const branch=graph.find(item=>item['@type']==='EducationalOrganization');
  assert.equal(branch.address.streetAddress,undefined);assert.equal(branch.address.postalCode,undefined);
 }
});

test('worker serves a real pre-rendered course and canonicalizes its trailing slash',async()=>{
 const path=coursePath(courses[0]);
 const response=await worker.fetch(new Request(SITE.origin+path,{headers:{accept:'text/html'}}),{ASSETS:assets});
 assert.equal(response.status,200);assert.ok((await response.text()).includes('What you’ll learn.'));
 assert.equal(response.headers.get('X-Robots-Tag'),null);
 const redirect=await worker.fetch(new Request(SITE.origin+path.slice(0,-1),{headers:{accept:'text/html'}}),{ASSETS:assets});
 assert.equal(redirect.status,301);assert.equal(redirect.headers.get('location'),SITE.origin+path);
});

test('unknown pages return 404 and preview hosts remain unindexable',async()=>{
 const missing=await worker.fetch(new Request(SITE.origin+'/courses/not-a-course/',{headers:{accept:'text/html'}}),{ASSETS:assets});
 assert.equal(missing.status,404);assert.match(await missing.text(),/This page has moved/);
 const preview=await worker.fetch(new Request('https://preview.example/index.html',{headers:{accept:'text/html'}}),{ASSETS:assets});
 assert.match(preview.headers.get('X-Robots-Tag'),/noindex/);
 const robots=await worker.fetch(new Request('https://preview.example/robots.txt'),{ASSETS:assets});
 assert.match(await robots.text(),/Disallow: \//);
 const alias=await worker.fetch(new Request('https://www.arenalucknow.in/'),{ASSETS:assets});
 assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),'https://arenalucknow.in/');
});
