import {chromium} from '@playwright/test';
import {mkdtemp,rm} from 'node:fs/promises';
import path from 'node:path';
const profile=await mkdtemp('/tmp/squeeze-chrome-');
const ext=path.resolve('dist');
let context;
try{
 context=await chromium.launchPersistentContext(profile,{channel:'chromium',headless:true,args:['--no-sandbox',`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker',{timeout:15000});
 const extensionId=new URL(worker.url()).host;
 const first=await context.newPage();await first.goto('https://example.com');
 const second=await context.newPage();await second.goto('https://example.org');
 const panel=await context.newPage();await panel.goto(`chrome-extension://${extensionId}/sidepanel.html`);
 const overview=await panel.evaluate(()=>chrome.runtime.sendMessage({type:'list'}));if(!overview.ok)throw new Error(overview.error);
 const targets=overview.data.tabs.filter(t=>t.url.includes('example.com')||t.url.includes('example.org'));
 if(targets.length!==2)throw new Error(`Expected 2 test tabs, got ${targets.length}`);
 const squeeze=await panel.evaluate(ids=>chrome.runtime.sendMessage({type:'squeeze',tabIds:ids}),targets.map(t=>t.id));if(!squeeze.ok||squeeze.data.closed!==2)throw new Error(JSON.stringify(squeeze));
 const after=await panel.evaluate(()=>chrome.runtime.sendMessage({type:'list'}));if(after.data.store.parked.length!==2)throw new Error('Saved records missing');
 const restore=await panel.evaluate(ids=>chrome.runtime.sendMessage({type:'reopen',ids}),after.data.store.parked.map(t=>t.id));if(!restore.ok||restore.data.closed!==2)throw new Error(JSON.stringify(restore));
 await panel.screenshot({path:'docs/screenshots/sidepanel-chrome.png',fullPage:true});
 await context.close();context=null;
 context=await chromium.launchPersistentContext(profile,{channel:'chromium',headless:true,args:['--no-sandbox',`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 const restarted=await context.newPage();await restarted.goto(`chrome-extension://${extensionId}/sidepanel.html`);
 const persisted=await restarted.evaluate(()=>chrome.runtime.sendMessage({type:'list'}));if(persisted.data.store.parked.length!==2)throw new Error('Restart persistence failed');
 console.log('Real Chrome: MV3 worker, discovery, save/close 2 tabs, reopen, and browser restart persistence passed.');
}finally{if(context)await context.close();await rm(profile,{recursive:true,force:true})}
