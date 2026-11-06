import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { handleEnquiry,handleScholarship } from "./worker/index.js";
import {readFile} from 'node:fs/promises';
import {replaceSeo,seoForPath,sitemap} from './src/seo.js';

const seoPreview = () => ({
  name:'arena-seo-preview',
  transformIndexHtml(html,context){return replaceSeo(html,context.path||'/',{preview:Boolean(context.server)});},
  configureServer(server){
    server.middlewares.use(async(req,res,next)=>{
      const pathname=new URL(req.url,'http://localhost').pathname;
      if(pathname==='/robots.txt'){
        res.writeHead(200,{'content-type':'text/plain','X-Robots-Tag':'noindex'});res.end('User-agent: *\nDisallow: /\n');return;
      }
      if(pathname==='/sitemap.xml'){
        res.writeHead(200,{'content-type':'application/xml','X-Robots-Tag':'noindex'});res.end(sitemap());return;
      }
      if(!['GET','HEAD'].includes(req.method)||!req.headers.accept?.includes('text/html')||pathname.startsWith('/api/')||/\.[a-z0-9]+$/i.test(pathname))return next();
      try{
        const template=await readFile(new URL('./index.html',import.meta.url),'utf8');
        const html=await server.transformIndexHtml(req.url,template);
        const {render}=await server.ssrLoadModule('/src/entry-server.jsx');
        res.writeHead(seoForPath(pathname).path?200:404,{'content-type':'text/html; charset=utf-8','X-Robots-Tag':'noindex, nofollow'});
        res.end(req.method==='HEAD'?'':html.replace('<div id="root"></div>',`<div id="root">${render(pathname)}</div>`));
      }catch(error){server.ssrFixStacktrace(error);next(error);}
    });
  },
});

const enquiryApi = () => ({
  name: "arena-enquiry-api",
  configureServer(server) {
    server.middlewares.use(async (req,res,next) => {
      const pathname=new URL(req.url,'http://localhost').pathname;
      if(!['/api/enquiry','/api/scholarship'].includes(pathname))return next();
      const chunks=[];let size=0;
      for await (const chunk of req) {
        chunks.push(chunk);size+=chunk.length;
        if (size>8000) {
          res.writeHead(413,{"content-type":"application/json"});
          res.end(JSON.stringify({error:"Please shorten your enquiry."})); return;
        }
      }
      const request = new Request(`http://${req.headers.host}${pathname}`, {
        method:req.method,headers:req.headers,
        ...(!["GET","HEAD"].includes(req.method)?{body:Buffer.concat(chunks)}:{})
      });
      const response = await (pathname==='/api/scholarship'?handleScholarship:handleEnquiry)(request);
      res.writeHead(response.status,Object.fromEntries(response.headers));
      res.end(await response.text());
    });
  },
});

export default defineConfig({
  define:{__SITE_BUILD_YEAR__:JSON.stringify(new Date().getFullYear())},
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(), enquiryApi(), seoPreview()],
});
