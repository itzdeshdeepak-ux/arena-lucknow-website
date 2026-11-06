import assert from 'node:assert/strict';
import test from 'node:test';
import {handleEnquiry} from '../worker/index.js';

const details={name:'Test enquiry',phone:'+91 9999999999',course:'Master in Blender',qualification:'Class 12',message:'Course guidance',consent:true,reference:'ARL-12345678-1234-1234-1234-123456789abc',website:''};
const request=(data=details,headers={})=>new Request('https://arena.test/api/enquiry',{method:'POST',headers:{origin:'https://arena.test','content-type':'application/json',...headers},body:JSON.stringify(data)});

test('sends all form values and only confirms a recorded Google response',async()=>{
 let sent;
 const result=await handleEnquiry(request(),async(url,options)=>{
  sent={url,body:options.body};
  return new Response('<div>Your response has been recorded.</div>');
 });
 assert.equal(result.status,200);
 assert.deepEqual(await result.json(),{ok:true,reference:details.reference});
 for(const value of [details.name,"'"+details.phone,details.course,details.qualification,details.message,details.reference,'Website — Arena Animation, Indira Nagar, Lucknow'])assert.ok([...sent.body.values()].includes(value));
 assert.match(sent.body.get('entry.800698877'),/I agree to share these details/);
 assert.equal(result.headers.get('cache-control'),'no-store');
});

test('never reports success for a Google 200 validation page, closed form, or timeout',async()=>{
 for(const send of [async()=>new Response('Please answer this question'),async()=>new Response('No longer accepting responses',{status:403}),async()=>{throw new Error('timeout');}]){
  const result=await handleEnquiry(request(),send);
  assert.equal(result.status,502);assert.equal((await result.json()).ok,undefined);
 }
});

test('rejects invalid data, missing consent, bots and cross-site requests before writing',async()=>{
 for(const data of [{...details,name:'   '},{...details,phone:'----------'},{...details,consent:false},{...details,message:'x'.repeat(601)},{...details,reference:'bad'},{...details,website:'bot'},null]){
  const result=await handleEnquiry(request(data),()=>{throw new Error('Must not send');});
  assert.equal(result.status,400);
 }
 assert.equal((await handleEnquiry(request(details,{origin:'https://other.test'}))).status,403);
 assert.equal((await handleEnquiry(new Request('https://arena.test/api/enquiry'))).status,405);
});

test('preserves formula-like free text as literal Sheet values',async()=>{
 let body;
 await handleEnquiry(request({...details,message:'=IMPORTXML("https://example.test","//a")'}),async(url,options)=>{
  body=options.body;return new Response('Your response has been recorded.');
 });
 assert.ok(body.get('entry.1358187973').startsWith("'="));
});
