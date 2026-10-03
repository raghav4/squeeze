# Worker message contract
Requests: list, squeeze(tabIds[]), reopen(ids[],newWindow?), update(ids[],patch), delete(ids[]), restore(records[]), category(name,id?,delete?), session(name,id?,delete?).
Responses: {ok:true,data} or {ok:false,error}. All IDs, names, patches, and schemes are validated by the worker. Operations serialize. Squeeze reports saved/closed/skipped/failed counts. No close occurs before persisted read-back.
