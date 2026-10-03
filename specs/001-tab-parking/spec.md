# Feature Specification: Squeeze tab parking

**Feature Branch**: `001-tab-parking`
**Created**: 2026-10-03
**Status**: Ready for implementation
**Input**: Product requirements for Squeeze, a local tab-parking utility. See product.md for the full product brief.

## User Scenarios & Testing
### User Story 1 - Safely park open tabs (Priority: P1, product P0)
A user sees open tabs by window, selects one or many, and parks them without losing URLs.
**Why this priority**: Trust depends on preserving tabs before closing them.
**Independent Test**: Open ten ordinary pages, select six, squeeze, and inspect six persisted records after restarting Chrome.
**Acceptance Scenarios**:
1. Given selected tabs, when save succeeds, records exist before Chrome closes them.
2. Given failed storage, when squeeze runs, no original tab closes and an error allows retry.
3. Given an unsupported or incognito tab, when selecting all, that tab is excluded with an explanation.
4. Given a tab navigating while saving, when its URL changes, it is left open and flagged for retry.

### User Story 2 - Return without losing context (Priority: P1, product P0)
The user finds parked tabs and reopens one or many in saved order. Saved records remain until explicitly removed.
**Independent Test**: Reopen parked tabs and confirm URLs, pinned state, order, and saved records.
**Acceptance Scenarios**:
1. Given saved records, when reopened, safe URLs become tabs and records remain.
2. Given partial reopen failure, successful tabs remain and the failed records can be retried.
3. Given deleted saved records, when Undo is clicked, the records return.

### User Story 3 - Organize and find (Priority: P2, product P1)
Users manage categories and sessions, star records, search titles/URLs/domains/categories/session names, and preserve Chrome groups.
**Independent Test**: Create a category and session, assign a parked tab, search by name, and reopen a grouped collection.

### User Story 4 - Fast, calm surfaces (Priority: P3, product P2)
A small popup opens the main Side Panel. The user can use a command palette, shortcuts, and minimal context menus.
**Independent Test**: Use only the keyboard to open the palette, navigate, squeeze, and reopen. Inspect empty, loading, and error states at narrow panel widths.

### Edge Cases
- Quota exhaustion, extension restart, lost runtime response, duplicate click, and tabs already closed.
- Last tab/window closure can dismiss the panel. Saved data must already be durable.
- Browser-level recently closed recovery is best effort for observed regular tabs only.
- Browser internal pages, incognito tabs, missing URLs, unsafe schemes, and expired favicon references.
- Restored groups are recreated where supported; original window IDs can expire.
- Unsaved forms, authentication, history, and scroll position cannot be preserved as tab metadata.

## Requirements
### Functional Requirements
- **FR-001**: Discover ordinary tabs across regular windows with pinned/group/window/index metadata.
- **FR-002**: Support squeeze one, selection, current window, all eligible tabs, and Chrome group.
- **FR-003**: Persist and read back all records before any close. Serialize mutations in the service worker.
- **FR-004**: Preserve URL/title/favicon/time/window/group/pin/index/category/session/star metadata.
- **FR-005**: Reopen in stable order; preserve pins and recreate groups when possible; keep saved records.
- **FR-006**: Explicit delete offers undo. No automatic deletion of parked records.
- **FR-007**: Search and organization are local and deterministic; categories and sessions are user-created.
- **FR-008**: Provide recently squeezed and best-effort recently closed views without promising complete browser history.
- **FR-009**: Side Panel is primary; popup is a small entry point. No external scripts, fonts, crawlers, analytics, or accounts.
- **FR-010**: Provide status feedback and truthful partial-failure messages. Unsupported tabs remain open.
- **FR-011**: Use reduced-motion preferences, named controls, visible focus, keyboard actions, and responsive spacing.
- **FR-012**: Local browsing metadata must never be transmitted to a server. No incognito capture.

### Key Entities
SavedTab, ChromeGroupSnapshot, Category, Session, Settings, ObservedTab, UndoBatch.

## Success Criteria
- **SC-001**: Park 41 of 47 ordinary tabs and find all 41 records in less than one minute.
- **SC-002**: Zero original tabs close on failed persistence or failed verification.
- **SC-003**: Search 1,000 saved records within 100ms on the test machine; measure before claiming performance.
- **SC-004**: The interface remains readable at 360px width and usable with keyboard and reduced motion.
- **SC-005**: No browsing metadata leaves the device in automated network inspection.

## Assumptions
- Chrome desktop 116+; no mobile browser support. Only http/https tabs are parked in this release.
- Side Panel is implemented early despite its product P2 priority because it is the requested primary surface.
- First delivery prioritizes product P0 with selected organization/UX features. P3 is an explicit follow-up, not silently claimed complete.
- Recently closed records retain the latest 100 observed closures; parked records have no automatic expiry.
