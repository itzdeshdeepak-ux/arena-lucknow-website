import {cp,mkdir,readFile,rm,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {pagePaths} from '../src/seo.js';

const root=fileURLToPath(new URL('..',import.meta.url));
const destination=path.join(root,'dist/hostinger');
for(const pathname of pagePaths)await readFile(path.join(root,'dist/client',pathname,'index.html'));
await rm(destination,{recursive:true,force:true});
await mkdir(destination,{recursive:true});
await cp(path.join(root,'dist/client'),destination,{recursive:true});
await cp(path.join(root,'hosting/hostinger'),destination,{recursive:true});
await writeFile(path.join(root,'dist/hostinger-build.json'),JSON.stringify({domain:'https://arenalucknow.in',indexablePages:pagePaths.length,formEndpoint:'/api/enquiry',scholarshipEndpoint:'/api/scholarship',runtime:'PHP 8.2+ with cURL; Apache/LiteSpeed .htaccess',builtAt:new Date().toISOString()},null,2)+'\n');
console.log(`Hostinger files ready in dist/hostinger (${pagePaths.length} pages + PHP enquiry endpoint).`);
