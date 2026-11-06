import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {courses,coursePath} from '../src/catalog.js';

test('all 43 courses have separate, valid thumbnail and course-banner artwork',async()=>{
 assert.equal(courses.length,43);
 const thumbnailPaths=new Set(),imagePaths=new Set(),thumbnailHashes=new Set(),imageHashes=new Set();
 for(const course of courses){
  assert.match(course.image.alt,/.{20,}/,course.id);
  for(const [key,paths,hashes] of [['thumbnail',thumbnailPaths,thumbnailHashes],['src',imagePaths,imageHashes]]){
   const path=course.image[key];assert.ok(path.includes(course.id.toLowerCase()),course.id);
   const bytes=await readFile(new URL('../public'+path,import.meta.url));
   assert.equal(bytes.toString('ascii',0,4),'RIFF',path);assert.equal(bytes.toString('ascii',8,12),'WEBP',path);
   assert.ok(bytes.length>1000,path);paths.add(path);hashes.add(createHash('sha256').update(bytes).digest('hex'));
  }
 }
 for(const values of [thumbnailPaths,imagePaths,thumbnailHashes,imageHashes])assert.equal(values.size,43);
});

test('every standalone course guide and its social metadata use the matching artwork',async()=>{
 for(const course of courses){
  const html=await readFile(new URL('../dist/client'+coursePath(course)+'index.html',import.meta.url),'utf8');
  assert.ok(html.includes(`src="${course.image.src}"`),course.id);
  assert.ok(html.includes(`<meta property="og:image" content="https://arenalucknow.in${course.image.src}"`),course.id);
 }
 const home=await readFile(new URL('../dist/client/index.html',import.meta.url),'utf8');
 for(const course of courses.slice(0,6))assert.ok(home.includes(`src="${course.image.thumbnail}"`),course.id);
});
