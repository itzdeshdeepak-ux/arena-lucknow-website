import {build} from 'vite';
import {mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {pathToFileURL,fileURLToPath} from 'node:url';
import path from 'node:path';
import {pagePaths,replaceSeo,sitemap,robots} from '../src/seo.js';

const root=fileURLToPath(new URL('..',import.meta.url));
await build({root});
await build({root,build:{ssr:'src/entry-server.jsx',outDir:'.build/ssr',rollupOptions:{output:{entryFileNames:'entry-server.mjs'}}}});
const {render}=await import(pathToFileURL(path.join(root,'.build/ssr/entry-server.mjs')).href);
const client=path.join(root,'dist/client'),template=await readFile(path.join(client,'index.html'),'utf8');
if(new Set(pagePaths).size!==pagePaths.length)throw new Error('Course URLs must be unique.');
for(const pathname of [...pagePaths,'/404.html']){
 const destination=pathname==='/404.html'?path.join(client,'404.html'):path.join(client,pathname,'index.html');
 const html=replaceSeo(template,pathname).replace('<div id="root"></div>',`<div id="root">${render(pathname)}</div>`);
 if(!html.includes('<main'))throw new Error(`Missing rendered content for ${pathname}`);
 await mkdir(path.dirname(destination),{recursive:true});await writeFile(destination,html);
}
await writeFile(path.join(client,'sitemap.xml'),sitemap());
await writeFile(path.join(client,'robots.txt'),robots);
await rm(path.join(root,'.build'),{recursive:true,force:true});
await import('./prepare-sites-build.mjs');
console.log(`Pre-rendered ${pagePaths.length} indexable pages with canonical metadata, plus a 404 page.`);
