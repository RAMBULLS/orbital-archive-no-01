import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.join(process.env.RUNNER_TEMP,'rehearsal');
const {chromium}=await import(pathToFileURL(path.join(root,'driver/node_modules/playwright/index.mjs')).href);
const out=path.join(root,'proof'); await fs.mkdir(out,{recursive:true});
const origin='https://orbital.rambulls.dev';
const old='https://rambulls.github.io/orbital-archive-no-01';
const manifest=JSON.parse(await fs.readFile(new URL('./live-manifest.json',import.meta.url)));
assert.equal(manifest.files.length,242);
const http={status:'RUNNING',utc:new Date().toISOString(),resources:[],redirects:[],guards:[]};
let index=0;
const httpDeadline=Date.now()+90000;
async function get(url){
 const remaining=httpDeadline-Date.now();assert.ok(remaining>0,'90second HTTP verification bound');
 const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(Math.min(15000,remaining))});
 const body=Buffer.from(await response.arrayBuffer());
 return {url,status:response.status,headers:Object.fromEntries(response.headers),sha256:createHash('sha256').update(body).digest('hex'),bytes:body.length};
}
const mimes={'.html':['text/html'],'.css':['text/css'],'.mjs':['application/javascript','text/javascript'],'.json':['application/json'],'.svg':['image/svg+xml'],'.png':['image/png'],'.xml':['application/xml','text/xml'],'.txt':['text/plain']};
try{
 await Promise.all(Array.from({length:3},async()=>{while(index<manifest.files.length){
  const item=manifest.files[index++];const row=await get(origin+'/'+item.path.split('/').map(encodeURIComponent).join('/'));
  row.path=item.path;row.expected_sha256=item.sha256;const mime=row.headers['content-type']?.split(';')[0];
  row.match=row.status===200&&row.sha256===item.sha256&&(!mimes[path.extname(item.path)]||mimes[path.extname(item.path)].includes(mime));
  http.resources.push(row);
 }}));
 for(const suffix of ['/?source=test&x=1&x=2&empty=&utf8=%E2%9C%93','/preview.html?x=1','/assets/icons/home.svg?x=1','/README.md?x=1','/downloads/index.html?x=1']){
  const row=await get(old+suffix);row.expected_location=origin+suffix;row.match=[301,308].includes(row.status)&&row.headers.location===row.expected_location;http.redirects.push(row);
 }
 for(const suffix of ['/missing-migration-page.html','/.git/config','/.github/workflows/pages.yml','/AGENTS.md']){
  const row=await get(origin+suffix);row.match=row.status===404;http.guards.push(row);
 }
 assert.ok([...http.resources,...http.redirects,...http.guards].every(x=>x.match),'Actual HTTP resource/redirect/guard failure');http.status='PASS_REAL_PRODUCTION';
}catch(error){http.status='FAIL';http.error=String(error.stack||error);process.exitCode=1;}
await fs.writeFile(path.join(out,'live-http.json'),JSON.stringify(http,null,2));
assert.equal(http.status,'PASS_REAL_PRODUCTION','HTTP acceptance must pass before browser journeys');
const report={status:'RUNNING',utc:new Date().toISOString(),cases:[],redirects:[],errors:[],failed_requests:[],foreign_origins:[],limits:['Mobile is hosted Chrome touch/viewport emulation, not physical mobile or Safari','Separate HTTP manifest proof covers all242 resources; no actual production rollback exercise']};
const browser=await chromium.launch({channel:'chrome',headless:true});report.browser_version=browser.version();
const timer=setTimeout(()=>{report.timeout=true;browser.close();},120000);
async function redirects(response){
 let req=response.request(); const rows=[];
 while(req.redirectedFrom()){
  req=req.redirectedFrom();const res=await req.response();assert.ok(res,'Missing actual redirect response');
  rows.unshift({url:req.url(),status:res.status(),location:res.headers().location});
 }
 assert.ok(rows.length>=1,'No native old-host redirect');
 assert.ok([301,308].includes(rows[0].status));assert.ok(rows[0].location.startsWith(origin+'/'));
 assert.ok(rows.every(x=>[301,308].includes(x.status)&&x.location.startsWith('https://')));
 report.redirects.push(...rows);return rows;
}
try{
 for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(20000);page.setDefaultNavigationTimeout(20000);
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('requestfailed',r=>report.failed_requests.push({url:r.url(),error:r.failure()?.errorText}));
  page.on('request',r=>{const u=new URL(r.url());if(!['orbital.rambulls.dev','rambulls.dev','rambulls.github.io'].includes(u.hostname)) report.foreign_origins.push(u.origin);});
  const suffix='/?source=test&x=1&x=2&empty=&utf8=%E2%9C%93#components';
  const response=await page.goto(old+suffix,{waitUntil:'networkidle'});await redirects(response);
  assert.equal(response.status(),200);assert.equal(page.url(),origin+suffix);
  await page.locator('h1').first().waitFor({state:'visible'});
  assert.equal(await page.locator('#components').count(),1);
  await page.waitForFunction(()=>document.querySelectorAll('.icon-card').length===161);
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),origin+'/');
  await page.locator('#icon-search').fill('home');
  assert.match(await page.locator('#icon-count').textContent(),/of 161 assets/);
  const filtered=await page.locator('.icon-card:visible').count();assert.ok(filtered>0&&filtered<161);
  await page.locator('#icon-search').fill('');assert.equal(await page.locator('.icon-card:visible').count(),161);
  await page.locator('#icon-search').focus();assert.ok(await page.locator('#icon-search').evaluate(el=>el===document.activeElement));
  await page.reload({waitUntil:'networkidle'});assert.equal(page.url(),origin+suffix);
  assert.equal((await page.goto(origin+'/preview.html',{waitUntil:'networkidle'})).status(),200);
  await page.goBack({waitUntil:'networkidle'});assert.equal(page.url(),origin+suffix);
  await page.goForward({waitUntil:'networkidle'});assert.equal(page.url(),origin+'/preview.html');
  await page.goto(origin+'/',{waitUntil:'networkidle'});
  await page.screenshot({path:path.join(out,mobile?'root-mobile.png':'root-desktop.png')});
  const footer=page.locator('footer a[href="https://rambulls.dev/"]');assert.equal(await footer.count(),1);
  const [brand]=await Promise.all([page.waitForNavigation({waitUntil:'networkidle'}),footer.click()]);
  assert.equal(brand.status(),200);assert.equal(new URL(page.url()).hostname,'rambulls.dev');
  await page.locator('h1').first().waitFor({state:'visible'});await page.goBack({waitUntil:'networkidle'});assert.equal(page.url(),origin+'/');
  const staticResponse=await page.goto(old+'/preview.html?x=1#top',{waitUntil:'networkidle'});await redirects(staticResponse);
  assert.equal(staticResponse.status(),200);assert.equal(page.url(),origin+'/preview.html?x=1#top');
  assert.equal((await page.goto(origin+'/missing-migration-page.html',{waitUntil:'load'})).status(),404);
  report.cases.push({mobile,clean_and_warm:true,bookmark_search_focus_reload_history_footer_static_fragment_missing:'PASS'});
  await context.close();
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.failed_requests,[]);assert.deepEqual(report.foreign_origins,[]);
 report.status='PASS_REAL_PRODUCTION';
}catch(error){report.status='FAIL';report.error=String(error.stack||error);process.exitCode=1;}
finally{clearTimeout(timer);await browser.close();const raw=JSON.stringify(report,null,2);assert.ok(Buffer.byteLength(raw)<512*1024);await fs.writeFile(path.join(out,'live-browser.json'),raw);}
console.log(JSON.stringify({status:report.status,cases:report.cases,error:report.error}));
