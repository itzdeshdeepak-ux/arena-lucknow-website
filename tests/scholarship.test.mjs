import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {handleScholarship} from '../worker/index.js';

const details={name:'TEST — scholarship connection only',phone:'9999999999',email:'test@example.com',course:'Master in Blender',qualification:'Class 12',message:'TEST / no callback required',consent:true,reference:'ARLS-12345678-1234-1234-1234-123456789abc',website:''};
const request=(data=details,origin='https://arena.test')=>new Request('https://arena.test/api/scholarship',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(data)});

test('scholarships use their separate Google Form, email and fixed branch context',async()=>{
 let sent;
 const response=await handleScholarship(request({...details,state:'Other state',centre:'Other branch'}),async(url,options)=>{
  sent={url,body:options.body};return new Response('Your response has been recorded.');
 });
 assert.equal(response.status,200);assert.deepEqual(await response.json(),{ok:true,reference:details.reference});
 assert.match(sent.url,/1FAIpQLSczh-XjXjRqJjPF6orHtp4kQr6Agy4uQ2p5JiISDAL4MLtwnw/);
 assert.equal(sent.body.get('entry.788695738'),details.email);
 assert.equal(sent.body.get('entry.1625509079'),'Uttar Pradesh');
 assert.equal(sent.body.get('entry.660532691'),'Indira Nagar, Lucknow');
 assert.match(sent.body.get('entry.800698877'),/scholarship and admission guidance/);
 assert.match(sent.body.get('entry.708883138'),/Scholarship enquiry/);
 for(const value of [details.name,details.phone,details.course,details.qualification,details.message,details.reference])assert.ok([...sent.body.values()].includes(value));
 assert.equal(response.headers.get('cache-control'),'no-store');
});

test('invalid scholarship email, references, consent and bots never reach Google',async()=>{
 let calls=0;
 const send=async()=>{calls++;return new Response('Your response has been recorded.');};
 for(const data of [{...details,email:''},{...details,email:'wrong'},{...details,email:'a@b.com\nother@b.com'},{...details,reference:details.reference.replace('ARLS','ARL')},{...details,consent:false},{...details,website:'bot'},null]){
  assert.equal((await handleScholarship(request(data),send)).status,400);
 }
 assert.equal((await handleScholarship(request(details,'https://other.test'),send)).status,403);
 assert.equal((await handleScholarship(new Request('https://arena.test/api/scholarship'),send)).status,405);
 assert.equal(calls,0);
});

test('a Google validation page or failure never confirms a scholarship enquiry',async()=>{
 for(const send of [async()=>new Response('Please answer this question'),async()=>new Response('Form closed',{status:403}),async()=>{throw new Error('timeout');}]){
  const response=await handleScholarship(request(),send);
  assert.equal(response.status,502);assert.equal((await response.json()).ok,undefined);
 }
});

test('scholarship free text is stored literally and cannot create Sheet formulas',async()=>{
 let body;
 await handleScholarship(request({...details,email:'=example@example.com',message:'=IMPORTXML("https://example.test","//a")'}),async(url,options)=>{body=options.body;return new Response('Your response has been recorded.');});
 assert.equal(body.get('entry.788695738'),"'=example@example.com");
 assert.match(body.get('entry.1358187973'),/^'=/);
});

test('the scholarship page is pre-rendered, discoverable and clear about enquiry limits',async()=>{
 const html=await readFile(new URL('../dist/client/scholarship/index.html',import.meta.url),'utf8');
 assert.ok(html.includes('<link rel="canonical" href="https://arenalucknow.in/scholarship/"'));
 assert.ok(html.includes('scholarship exam marks'));
 assert.ok(html.includes('does not register you for the exam or confirm a scholarship award'));
 assert.ok(html.includes('name="email"'));assert.ok(html.includes('Uttar Pradesh'));
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);
 const home=await readFile(new URL('../dist/client/index.html',import.meta.url),'utf8');
 assert.ok(home.includes('href="/scholarship/"'));
});
