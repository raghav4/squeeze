export interface Group { id: number; title: string; color: chrome.tabGroups.ColorEnum }
export interface SavedTab { id: string; url: string; title: string; favicon?: string; savedAt: number; sourceTabId: number; windowId: number; index: number; pinned: boolean; group?: Group; categoryId: string|null; sessionId: string|null; starred: boolean }
export interface Named { id:string;name:string;createdAt:number }
export interface Store {schemaVersion:1; parked:SavedTab[];recent:SavedTab[];categories:Named[];sessions:Named[]}
export interface LiveTab {id:number;url:string;title:string;favicon?:string;windowId:number;index:number;pinned:boolean;group?:Group;incognito?:boolean;active?:boolean}
export type Command = {type:'list'} | {type:'squeeze';tabIds:number[]} | {type:'reopen';ids:string[];newWindow?:boolean} | {type:'delete';ids:string[]} | {type:'restore';records:SavedTab[]} | {type:'update';ids:string[];patch:Partial<Pick<SavedTab,'categoryId'|'sessionId'|'starred'>>} | {type:'category'|'session';name:string;id?:string;remove?:boolean};
export interface Overview {store:Store;tabs:LiveTab[];currentWindowId:number}
export interface Result {saved:number;closed:number;skipped:number;failed:number;message:string}
export type Reply<T>={ok:true;data:T}|{ok:false;error:string};
