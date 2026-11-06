const FORM_ACTION = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSf0xv8GcVXMEuAPvVRFFU0o3xfLM-qOvjbLVKRGffpIsNL9ow/formResponse";
const CONSENT = "I agree to share these details with Arena Animation, Indira Nagar for admission guidance.";
const FIELDS = {name:"entry.759494523",phone:"entry.345540192",course:"entry.604844296",qualification:"entry.133143954",message:"entry.1358187973",consent:"entry.800698877",source:"entry.708883138",reference:"entry.1176379031"};
const SCHOLARSHIP_ACTION = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSczh-XjXjRqJjPF6orHtp4kQr6Agy4uQ2p5JiISDAL4MLtwnw/formResponse";
const SCHOLARSHIP_FIELDS = {...FIELDS,email:"entry.788695738",state:"entry.1625509079",centre:"entry.660532691"};
const SCHOLARSHIP_CONSENT = "I agree to share these details with Arena Animation, Indira Nagar for scholarship and admission guidance.";
const json = (body, status = 200) => Response.json(body, {status, headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});

export async function handleEnquiry(request, send = fetch, kind = 'admission') {
  const scholarship = kind === 'scholarship';
  if (request.method !== "POST") return json({error:"Please submit the enquiry form."},405);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({error:"Please submit from our website."},403);
  if (!request.headers.get("content-type")?.includes("application/json")) return json({error:"Invalid enquiry format."},415);
  try {
    const raw = await request.text();
    if (raw.length > 8000) return json({error:"Please shorten your enquiry."},413);
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return json({error:"Invalid enquiry details."},400);
    const text = (key, max) => typeof data[key] === "string" && data[key].trim().length <= max ? data[key].trim() : null;
    const name=text("name",80), phone=text("phone",18), course=text("course",180), qualification=text("qualification",40), message=text("message",600), reference=text("reference",50), email=scholarship?text("email",120):null;
    const referencePattern=scholarship?/^ARLS-[a-f0-9-]{36}$/:/^ARL-[a-f0-9-]{36}$/;
    if (scholarship&&(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))return json({error:"Please enter a valid email address."},400);
    if (!name || !phone || !/^([+]91|91)?[ ]?[6-9][0-9]{9}$/.test(phone) || !course || qualification===null || message===null || data.consent!==true || !reference || !referencePattern.test(reference)) {
      return json({error:"Please check your name, mobile number and contact consent."},400);
    }
    if (data.website) return json({error:"We couldn’t accept this enquiry. Please contact us on WhatsApp."},400);
    const literal = value => /^[=+@-]/.test(value) ? "'"+value : value;
    const values={name:literal(name),phone:literal(phone),course:literal(course),qualification:literal(qualification),message:literal(message),consent:scholarship?SCHOLARSHIP_CONSENT:CONSENT,source:scholarship?"Website — Scholarship enquiry — Arena Animation, Indira Nagar, Lucknow":"Website — Arena Animation, Indira Nagar, Lucknow",reference,...(scholarship?{email:literal(email),state:"Uttar Pradesh",centre:"Indira Nagar, Lucknow"}:{})};
    const fields=scholarship?SCHOLARSHIP_FIELDS:FIELDS;
    const body = new URLSearchParams(Object.entries(values).map(([key,value])=>[fields[key],value]));
    body.set("entry.800698877_sentinel", "");
    body.set("fvv","1"); body.set("pageHistory","0");
    const response = await send((scholarship?SCHOLARSHIP_ACTION:FORM_ACTION)+"?hl=en", {method:"POST",body,signal:AbortSignal.timeout(15000)});
    const html = await response.text();
    // A 200 response can also contain validation errors or a closed form.
    if (!response.ok || !html.includes("Your response has been recorded.")) {
      return json({error:"We couldn’t confirm your enquiry was saved. Please contact our team on WhatsApp, or try again later."},502);
    }
    return json({ok:true,reference});
  } catch (error) {
    if (error instanceof SyntaxError) return json({error:"Invalid enquiry details."},400);
    return json({error:"We couldn’t confirm your enquiry was saved. Please contact our team on WhatsApp, or try again later."},502);
  }
}

export const handleScholarship = (request,send=fetch) => handleEnquiry(request,send,'scholarship');

const PUBLIC_HOST='arenalucknow.in';
function seoResponse(response,request,status=response.status){
 const headers=new Headers(response.headers);
 if(new URL(request.url).hostname!==PUBLIC_HOST||status===404)headers.set('X-Robots-Tag','noindex, nofollow');
 return new Response(response.body,{status,statusText:status===404?'Not Found':response.statusText,headers});
}

export default {
 async fetch(request,env){
  const url=new URL(request.url),read=['GET','HEAD'].includes(request.method);
  if(read&&(url.hostname==='www.'+PUBLIC_HOST||url.hostname===PUBLIC_HOST&&url.protocol==='http:')){
   url.hostname=PUBLIC_HOST;url.protocol='https:';return Response.redirect(url.href,301);
  }
  if(url.pathname==='/api/enquiry')return handleEnquiry(request);
  if(url.pathname==='/api/scholarship')return handleScholarship(request);
  if(url.pathname==='/robots.txt'&&url.hostname!==PUBLIC_HOST)return new Response(request.method==='HEAD'?null:'User-agent: *\nDisallow: /\n',{headers:{'content-type':'text/plain; charset=utf-8','X-Robots-Tag':'noindex'}});
  const response=await env.ASSETS.fetch(request);
  if(response.status!==404||!read||!request.headers.get('accept')?.includes('text/html')||url.pathname.startsWith('/api/'))return seoResponse(response,request,url.pathname==='/404.html'?404:response.status);
  if(!/\.[a-z0-9]+$/i.test(url.pathname)){
   const indexUrl=new URL(url);indexUrl.pathname=url.pathname.replace(/\/$/,'')+'/index.html';indexUrl.search='';
   const page=await env.ASSETS.fetch(new Request(indexUrl,request));
   if(page.status!==404){
    if(url.pathname!=='/'&&!url.pathname.endsWith('/')){url.pathname+='/';return Response.redirect(url.href,301);}
    return seoResponse(page,request);
   }
  }
  const errorUrl=new URL('/404.html',url);
  const error=await env.ASSETS.fetch(new Request(errorUrl,request));
  return seoResponse(error,request,404);
 }
};
