# Research
- Decision: MV3 worker owns serial mutations. Rationale: popup/panel writes must not race. Alternative: independent UI writes rejected due to lost updates.
- Decision: verify chrome.storage.local records before close. Rationale: Chrome closes are not transactional with storage. Failed closes leave saved copies; failed saves leave original tabs.
- Decision: chrome.storage.session for observed-tab snapshots. Rationale: MV3 worker suspension loses in-memory state. Browser shutdown recovery remains best effort.
- Decision: built-in tab groups and side panel. Rationale: respects Chrome's model without replacing it.
- Decision: allow only http/https reopen. Rationale: unsafe/imported URLs must not execute scripts or privileged browser pages.
- Decision: pinned tabs are visible and eligible but clearly labeled; incognito and unsupported URLs are excluded.
- Decision: no remote favicon service or preview crawler. Show local monogram for unavailable favicon.

Sources checked 2026-10-03:
https://developer.chrome.com/docs/extensions/reference/api/tabs
https://developer.chrome.com/docs/extensions/reference/api/sidePanel
https://developer.chrome.com/docs/extensions/reference/api/storage
https://github.com/github/spec-kit
