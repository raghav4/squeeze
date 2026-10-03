import {describe,it,expect} from 'vitest';
import {Engine,blank,safeUrl,type Port} from '../src/lib/engine';
import type {LiveTab,Store} from '../src/types';
const live:LiveTab[]=[{id:1,url:'https://react.dev',title:'React',windowId:1,index:0,pinned:false},{id:2,url:'https://github.com',title:'GitHub',windowId:1,index:1,pinned:true}];
function setup(){let store=blank();const log:string[]=[];let active=structuredClone(live);const p:Port={read:async()=>structuredClone(store),write:async s=>{log.push('save');store=structuredClone(s)},tabs:async()=>active,get:async id=>active.find(t=>t.id===id)!,close:async id=>{log.push(`close:${id}`);active=active.filter(t=>t.id!==id)},open:async t=>{log.push(`open:${t.url}:${t.pinned}`);return 10+log.length},newWindow:async()=>4,group:async()=>{log.push('group')}};return {p,log,engine:new Engine(p),store:()=>store,set:(s:Store)=>{store=s}}}
describe('safe parking',()=>{
 it('saves and verifies before closing',async()=>{const x=setup();await x.engine.squeeze([1,2]);expect(x.log).toEqual(['save','close:1','close:2']);expect(x.store().parked).toHaveLength(2)});
 it('does not close when storage fails',async()=>{const x=setup();x.p.write=async()=>{throw new Error('quota')};await expect(x.engine.squeeze([1])).rejects.toThrow('quota');expect(x.log).toEqual([])});
 it('does not close when verification is incomplete',async()=>{const x=setup();x.p.write=async()=>{};await expect(x.engine.squeeze([1])).rejects.toThrow('verify');expect(x.log).toEqual([])});
 it('does not close a tab that navigated',async()=>{const x=setup();x.p.get=async()=>({...live[0],url:'https://new.example'});const r=await x.engine.squeeze([1]);expect(r.failed).toBe(1);expect(x.log).toEqual(['save'])});
 it('keeps saved record on close failure',async()=>{const x=setup();x.p.close=async()=>{throw new Error('gone')};expect((await x.engine.squeeze([1])).failed).toBe(1);expect(x.store().parked).toHaveLength(1)});
 it('skips unsafe and incognito tabs',async()=>{const x=setup();x.p.tabs=async()=>[{...live[0],incognito:true},{...live[1],url:'chrome://settings'}];expect((await x.engine.squeeze([1,2])).saved).toBe(0);expect(x.log).toEqual([])});
 it('serializes concurrent mutations without losing records',async()=>{const x=setup();await Promise.all([x.engine.squeeze([1]),x.engine.squeeze([2])]);expect(x.store().parked).toHaveLength(2)});
 it('reopens in order with pin state and keeps saved copies',async()=>{const x=setup();await x.engine.squeeze([1,2]);await x.engine.reopen(x.store().parked.map(t=>t.id));expect(x.log.slice(-2)).toEqual(['open:https://react.dev:false','open:https://github.com:true']);expect(x.store().parked).toHaveLength(2)});
 it('rejects unsafe schemes',()=>{expect(safeUrl('javascript:alert(1)')).toBe(false);expect(safeUrl('file:///etc/passwd')).toBe(false);expect(safeUrl('https://example.com')).toBe(true)});
 it('reports failed reopen and retains all records',async()=>{const x=setup();await x.engine.squeeze([1,2]);x.p.open=async()=>{throw new Error('blocked')};expect((await x.engine.reopen(x.store().parked.map(t=>t.id))).failed).toBe(2);expect(x.store().parked).toHaveLength(2)});
 it('restores group metadata while excluding pinned tabs from groups',async()=>{const x=setup();x.p.tabs=async()=>live.map(t=>({...t,group:{id:5,title:'Work',color:'purple'}}));await x.engine.squeeze([1,2]);await x.engine.reopen(x.store().parked.map(t=>t.id));expect(x.log.filter(v=>v==='group')).toHaveLength(1)});

});
