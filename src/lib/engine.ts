import type {Store, SavedTab, LiveTab, Result} from '../types';
export const blank = (): Store => ({schemaVersion:1,parked:[],recent:[],categories:[],sessions:[]});
export function safeUrl(url:unknown):url is string {try {return typeof url==='string' && ['https:','http:'].includes(new URL(url).protocol)}catch{return false}}
export function snapshot(t:LiveTab,now=Date.now()):SavedTab {return {id:crypto.randomUUID(),url:t.url,title:t.title||t.url,favicon:t.favicon,savedAt:now,sourceTabId:t.id,windowId:t.windowId,index:t.index,pinned:t.pinned,group:t.group,categoryId:null,sessionId:null,starred:false}}
export interface Port {read():Promise<Store>;write(s:Store):Promise<void>;tabs():Promise<LiveTab[]>;get(id:number):Promise<LiveTab>;close(id:number):Promise<void>;open(t:SavedTab,windowId?:number):Promise<number>;newWindow():Promise<number>;group(ids:number[],g:NonNullable<SavedTab['group']>):Promise<void>}
export class Engine {
 private tail:Promise<unknown>=Promise.resolve();
 constructor(private p:Port){}
 serial<T>(fn:()=>Promise<T>):Promise<T>{const run=this.tail.then(fn,fn);this.tail=run.catch(()=>{});return run}
 async mutate(fn:(s:Store)=>Store){return this.serial(async()=>{const s=fn(await this.p.read());await this.p.write(s);return s})}
 squeeze(ids:number[]):Promise<Result>{return this.serial(async()=>{
  const all=await this.p.tabs();const chosen=all.filter(t=>ids.includes(t.id)&&!t.incognito&&safeUrl(t.url));
  const records=chosen.map(t=>snapshot(t)); if(!records.length)return {saved:0,closed:0,skipped:ids.length,failed:0,message:'No eligible tabs selected. Internal and incognito tabs stay open.'};
  const store=await this.p.read();await this.p.write({...store,parked:[...records,...store.parked]});
  const verified=await this.p.read();if(records.some(r=>!verified.parked.some(v=>v.id===r.id&&v.url===r.url)))throw new Error("Couldn't verify the save. Your original tabs are still open.");
  let closed=0,failed=0;
  for(const r of records){try{const live=await this.p.get(r.sourceTabId);if(live.incognito||live.url!==r.url){failed++;continue}await this.p.close(r.sourceTabId);closed++}catch{failed++}}
  return {saved:records.length,closed,skipped:ids.length-records.length,failed,message:failed?`${records.length} saved. ${closed} closed. ${failed} changed or couldn't close; check your open tabs.`:`${closed} tabs safely squeezed.`};
 })}
 reopen(ids:string[],newWindow=false):Promise<Result>{return this.serial(async()=>{
  const s=await this.p.read();const tabs=s.parked.concat(s.recent).filter(t=>ids.includes(t.id));tabs.sort((a,b)=>a.windowId-b.windowId||a.index-b.index);
  const windowId=newWindow?await this.p.newWindow():undefined;let opened=0,failed=0;const groups=new Map<string,{g:NonNullable<SavedTab['group']>;ids:number[]}>();
  for(const t of tabs){if(!safeUrl(t.url)){failed++;continue}try{const id=await this.p.open(t,windowId);opened++;if(t.group&&!t.pinned){const key=`${t.windowId}:${t.group.id}`;const entry=groups.get(key)||{g:t.group,ids:[]};entry.ids.push(id);groups.set(key,entry)}}catch{failed++}}
  let groupFailed=0;for(const {g,ids} of groups.values())try{await this.p.group(ids,g)}catch{groupFailed++}
  return {saved:0,closed:opened,skipped:0,failed,message:`${opened} tabs reopened. Saved copies stay here.${failed?` ${failed} couldn't reopen.`:''}${groupFailed?' Some groups could not be restored.':''}`};
 })}
}
