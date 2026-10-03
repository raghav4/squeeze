# Data Model
Store: schemaVersion=1, parked[], recent[], categories[], sessions[].
SavedTab: id, URL, title, optional favicon, savedAt, sourceTabId, windowId, index, pinned, optional Chrome group (id/title/color), categoryId|null, sessionId|null, starred.
Category/Session: id, name, createdAt. Deleting an organization clears membership, not saved URLs.
ObservedTab: tab metadata cached in session storage, excluded for incognito and unsafe URLs.
State transitions: open -> persisted -> verified -> closed/parked. Reopen creates a browser tab while retaining its parked record. Delete moves a record into UI undo memory until restored or panel closed.
