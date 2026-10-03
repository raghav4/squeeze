import type {Command,Overview,Reply,SavedTab,Store,LiveTab,Result} from '../types';
import {blank,snapshot,safeUrl} from './engine';
export const preview=typeof chrome==='undefined'||!chrome.runtime?.id;
const samples=[['React Server Components','https://react.dev/reference/rsc/server-components',1],['Authentication patterns','https://github.com/example/auth',1],['TypeScript handbook','https://typescriptlang.org/docs',1],['Designing with restraint','https://linear.app/blog',2],['Kyoto weekend guide','https://example.com/travel/kyoto',2],['A better reading list','https://example.com/reading',2]] as const;
let demoTabs:LiveTab[]=samples.map(([title,url,w],i)=>({id:i+1,title,url,windowId:w,index:i,pinned:i===1,group:i<3?{id:2,title:'Frontend research',color:'purple'}:undefined}));
let demo:Store={...blank(),categories:[{id:'work',name:'Work',createdAt:Date.now()},{id:'learn',name:'Learning',createdAt:Date.now()}],sessions:[{id:'frontend',name:'Frontend research',createdAt:Date.now()}],parked:demoTabs.slice(0,4).map((t,i)=>({...snapshot(t),sourceTabId:20+i,categoryId:i<2?'learn':'work',sessionId:i<3?'frontend':null,starred:i===0,savedAt:Date.now()-i*3600000}))};
export async function request<T=Overview>(c:Command):Promise<T>{
 if(!preview){const r:Reply<T>=await chrome.runtime.sendMessage(c);if(!r?.ok)throw new Error(r?.error||'Squeeze did not respond. Open it again to check saved state.');return r.data}
 if(c.type==='list')return {store:demo,tabs:demoTabs,currentWindowId:1} as T;
 if(c.type==='squeeze'){const chosen=demoTabs.filter(t=>c.tabIds.includes(t.id));demo={...demo,parked:[...chosen.map(t=>snapshot(t)),...demo.parked]};demoTabs=demoTabs.filter(t=>!c.tabIds.includes(t.id));return {saved:chosen.length,closed:chosen.length,failed:0,skipped:0,message:`${chosen.length} tabs safely squeezed (preview).`} as T}
 if(c.type==='reopen')return {message:`${c.ids.length} tabs reopened (preview).`,saved:0,closed:c.ids.length,failed:0,skipped:0} as T;
 if(c.type==='delete')demo={...demo,parked:demo.parked.filter(t=>!c.ids.includes(t.id)),recent:demo.recent.filter(t=>!c.ids.includes(t.id))};
 if(c.type==='restore')demo={...demo,parked:[...c.records.filter(t=>safeUrl(t.url)),...demo.parked]};
 if(c.type==='update')demo={...demo,parked:demo.parked.map(t=>c.ids.includes(t.id)?{...t,...c.patch}:t)};
 if(c.type==='category'||c.type==='session'){const k=c.type==='category'?'categories':'sessions';demo={...demo,[k]:c.remove?demo[k].filter(n=>n.id!==c.id):c.id?demo[k].map(n=>n.id===c.id?{...n,name:c.name}:n):[...demo[k],{id:crypto.randomUUID(),name:c.name,createdAt:Date.now()}]}}
 return demo as T;
}
export function domain(url:string){try{return new URL(url).hostname.replace(/^www\./,'')}catch{return url}}
export function searchTabs(tabs:SavedTab[],q:string,s:Store){const query=q.trim().toLowerCase();return tabs.filter(t=>[t.title,t.url,domain(t.url),s.categories.find(c=>c.id===t.categoryId)?.name||'',s.sessions.find(c=>c.id===t.sessionId)?.name||''].join(' ').toLowerCase().includes(query))}
export async function openPanel(){if(preview){location.href='/sidepanel.html';return}const w=await chrome.windows.getCurrent();await chrome.sidePanel.open({windowId:w.id!});window.close()}
export type {Result};

export async function openApp(){if(preview){location.href="/app.html";return}await chrome.tabs.create({url:chrome.runtime.getURL("app.html")});window.close()}
