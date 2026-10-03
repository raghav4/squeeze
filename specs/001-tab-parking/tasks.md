# Tasks: Squeeze
## Phase 1: Setup
- [x] T001 Initialize actual GitHub Spec Kit scaffold and constitution in .specify/.
- [x] T002 Write specification, research, plan, data model, contracts and quickstart in specs/001-tab-parking/.
- [x] T003 [P] Set up React/TypeScript/Vite MV3 build and manifest in package.json and public/.
## Phase 2: Foundation
- [x] T004 Define validated records/messages in src/types/index.ts.
- [x] T005 Write failure/concurrency/URL safety tests in tests/engine.test.ts.
- [x] T006 Implement serialized state engine and persist verification in src/lib/engine.ts.
## Phase 3: Story 1 - Safe parking
- [x] T007 [US1] Implement discovery, single/multiple/window/group squeeze in src/background/index.ts.
- [x] T008 [US1] Build responsive open-tab list and save/close status in src/components/App.tsx.
## Phase 4: Story 2 - Return
- [x] T009 [US2] Implement ordered/pinned/group reopen in src/lib/engine.ts.
- [x] T010 [US2] Implement saved list, delete and undo in src/components/App.tsx.
## Phase 5: Organization and UX
- [x] T011 [US3] Implement category/session CRUD, stars, local search in worker and UI.
- [x] T012 [US4] Implement popup, palette, shortcuts, and minimal context menus.
- [x] T013 [US4] Implement best-effort recent-close cache and clear limitations.
## Phase 6: Validation and delivery
- [ ] T014 Test narrow panel/popup pixels, keyboard/reduced-motion, Chrome integration and search timing in tests/.
- [x] T015 Record convergence gaps and real evidence in specs/001-tab-parking/convergence.md.
- [ ] T016 Publish clean public PR with UI screenshots, descriptions and test evidence; no secrets/private metadata.

Dependencies: T001-T003 -> T004-T006 -> US1 -> US2 -> US3/US4 -> validation.
Parallel examples: UI CSS and worker tests can run independently after typed contracts. MVP first: save/verify/close/reopen before organization. P3 onboarding/import-export/settings/advanced restoration remain follow-up unless implemented and tested.
